function providerConfig(provider) {
  const map = {
    mtn: {
      name: 'MTN_MOMO',
      baseUrl: process.env.MTN_MOMO_API_BASE_URL,
      path: process.env.MTN_MOMO_PAYOUT_PATH || '/payouts',
      required: ['MTN_MOMO_API_BASE_URL', 'MTN_MOMO_API_KEY']
    },
    mpesa: {
      name: 'MPESA',
      baseUrl: process.env.MPESA_API_BASE_URL,
      path: process.env.MPESA_PAYOUT_PATH || '/payouts',
      required: ['MPESA_API_BASE_URL', 'MPESA_API_KEY']
    },
    orange: {
      name: 'ORANGE_MONEY',
      baseUrl: process.env.ORANGE_MONEY_API_BASE_URL,
      path: process.env.ORANGE_MONEY_PAYOUT_PATH || '/payouts',
      required: ['ORANGE_MONEY_API_BASE_URL', 'ORANGE_MONEY_API_KEY']
    }
  };
  return map[provider];
}

function missingVars(keys) {
  return keys.filter((key) => !process.env[key]);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const provider = String(req.body?.provider || '').toLowerCase();
  const amount = Number(req.body?.amount);
  const currency = String(req.body?.currency || 'XAF').toUpperCase();
  const phone = String(req.body?.phone || '').trim();
  const country = String(req.body?.country || 'CM').toUpperCase();
  const reference = String(req.body?.reference || `MM-${Date.now()}`);
  const dryRun = Boolean(req.body?.dryRun ?? true);

  const cfg = providerConfig(provider);
  if (!cfg) {
    return res.status(400).json({ error: 'Unsupported provider', allowed: ['mtn', 'mpesa', 'orange'] });
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  if (!phone) {
    return res.status(400).json({ error: 'Missing phone' });
  }

  const missing = missingVars(cfg.required);
  if (missing.length) {
    return res.status(503).json({ error: 'Provider not configured', provider: cfg.name, missing });
  }

  const payload = {
    amount,
    currency,
    phone,
    country,
    reference
  };

  if (dryRun) {
    return res.status(200).json({
      provider: cfg.name,
      status: 'SIMULATED_ACCEPTED',
      payload
    });
  }

  try {
    const response = await fetch(`${cfg.baseUrl}${cfg.path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${process.env[`${cfg.name}_API_KEY`] || process.env.MOBILE_MONEY_API_KEY || ''}`,
        'X-Api-Key': process.env[`${cfg.name}_API_KEY`] || process.env.MOBILE_MONEY_API_KEY || ''
      },
      body: JSON.stringify(payload)
    });

    const raw = await response.text();
    let data;
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch (_) {
      data = { raw };
    }
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'Mobile Money payout failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
