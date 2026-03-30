import Stripe from 'stripe';

function looksLikePlaceholder(value) {
  const v = String(value || '').trim().toLowerCase();
  if (!v) return true;
  return v.includes('replace_me') || v.includes('example') || v === 'changeme' || v === 'dummy';
}

function getStripe() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }
  return new Stripe(secret);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const action = String(req.body?.action || '').toLowerCase();
  const amount = Number(req.body?.amount);
  const currency = String(req.body?.currency || 'usd').toLowerCase();
  const reference = String(req.body?.reference || `SMITH-${Date.now()}`);

  if (action === 'preflight') {
    const secret = String(process.env.STRIPE_SECRET_KEY || '').trim();
    const publishable = String(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '').trim();
    const missing = ['STRIPE_SECRET_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'].filter((k) => !process.env[k]);
    const warnings = [];
    if (looksLikePlaceholder(secret)) warnings.push('STRIPE_SECRET_KEY looks like placeholder');
    if (looksLikePlaceholder(publishable)) warnings.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY looks like placeholder');
    if (secret && publishable && secret.startsWith('sk_live_') !== publishable.startsWith('pk_live_')) {
      warnings.push('Mode mismatch between secret key and publishable key');
    }
    return res.status(200).json({
      ready: missing.length === 0 && warnings.length === 0,
      missing,
      warnings,
      key_prefixes: {
        secret: secret ? secret.slice(0, 8) : null,
        publishable: publishable ? publishable.slice(0, 8) : null
      }
    });
  }

  if (!Number.isFinite(amount) || amount < 100) {
    return res.status(400).json({ error: 'Invalid amount. Minimum is 100 (minor units).' });
  }

  try {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        reference,
        rail: 'stripe'
      }
    });

    return res.status(200).json({
      id: intent.id,
      client_secret: intent.client_secret,
      status: intent.status
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Stripe payment intent failed',
      stripe_type: error?.type || undefined,
      stripe_code: error?.code || undefined,
      stripe_status: error?.statusCode || undefined,
      message: error?.message || undefined,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
