import crypto from 'crypto';

function baseUrl() {
  return (process.env.MTN_MOMO_API_BASE_URL || 'https://sandbox.momodeveloper.mtn.com').replace(/\/+$/, '');
}

function targetEnvironment() {
  return process.env.MTN_MOMO_TARGET_ENVIRONMENT || 'sandbox';
}

function requireEnv(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing ${key}`);
  }
  return String(value).trim();
}

function uuidV4() {
  return crypto.randomUUID();
}

function safeJsonParse(raw) {
  try {
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return { raw };
  }
}

function withNoCache(headers = {}) {
  return {
    ...headers,
    'Cache-Control': 'no-store'
  };
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const raw = await response.text();
  return {
    ok: response.ok,
    status: response.status,
    data: safeJsonParse(raw),
    headers: response.headers
  };
}

async function provisioningCreateApiUser({ referenceId, providerCallbackHost }) {
  const subKey = requireEnv('MTN_MOMO_PROVISIONING_SUBSCRIPTION_KEY');
  return fetchJson(`${baseUrl()}/v1_0/apiuser`, {
    method: 'POST',
    headers: withNoCache({
      'Content-Type': 'application/json',
      'X-Reference-Id': referenceId,
      'Ocp-Apim-Subscription-Key': subKey
    }),
    body: JSON.stringify({ providerCallbackHost })
  });
}

async function provisioningCreateApiKey({ apiUserId }) {
  const subKey = requireEnv('MTN_MOMO_PROVISIONING_SUBSCRIPTION_KEY');
  return fetchJson(`${baseUrl()}/v1_0/apiuser/${encodeURIComponent(apiUserId)}/apikey`, {
    method: 'POST',
    headers: withNoCache({
      'Ocp-Apim-Subscription-Key': subKey
    })
  });
}

async function tokenFor(product) {
  const productUpper = product.toUpperCase();
  const subKey = requireEnv(`MTN_MOMO_${productUpper}_SUBSCRIPTION_KEY`);
  const apiUser = requireEnv('MTN_MOMO_API_USER_ID');
  const apiKey = requireEnv('MTN_MOMO_API_KEY');
  const basic = Buffer.from(`${apiUser}:${apiKey}`).toString('base64');
  const result = await fetchJson(`${baseUrl()}/${product}/token`, {
    method: 'POST',
    headers: withNoCache({
      Authorization: `Basic ${basic}`,
      'Ocp-Apim-Subscription-Key': subKey,
      'X-Target-Environment': targetEnvironment()
    })
  });
  return result;
}

async function collectionRequestToPay({ amount, currency, externalId, msisdn, payerMessage, payeeNote, referenceId }) {
  const tokenResult = await tokenFor('collection');
  if (!tokenResult.ok || !tokenResult.data?.access_token) return tokenResult;
  const subKey = requireEnv('MTN_MOMO_COLLECTION_SUBSCRIPTION_KEY');

  return fetchJson(`${baseUrl()}/collection/v1_0/requesttopay`, {
    method: 'POST',
    headers: withNoCache({
      Authorization: `Bearer ${tokenResult.data.access_token}`,
      'X-Reference-Id': referenceId,
      'X-Target-Environment': targetEnvironment(),
      'Ocp-Apim-Subscription-Key': subKey,
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      amount: String(amount),
      currency,
      externalId,
      payer: { partyIdType: 'MSISDN', partyId: msisdn },
      payerMessage,
      payeeNote
    })
  });
}

async function disbursementTransfer({ amount, currency, externalId, msisdn, payerMessage, payeeNote, referenceId }) {
  const tokenResult = await tokenFor('disbursement');
  if (!tokenResult.ok || !tokenResult.data?.access_token) return tokenResult;
  const subKey = requireEnv('MTN_MOMO_DISBURSEMENT_SUBSCRIPTION_KEY');

  return fetchJson(`${baseUrl()}/disbursement/v1_0/transfer`, {
    method: 'POST',
    headers: withNoCache({
      Authorization: `Bearer ${tokenResult.data.access_token}`,
      'X-Reference-Id': referenceId,
      'X-Target-Environment': targetEnvironment(),
      'Ocp-Apim-Subscription-Key': subKey,
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      amount: String(amount),
      currency,
      externalId,
      payee: { partyIdType: 'MSISDN', partyId: msisdn },
      payerMessage,
      payeeNote
    })
  });
}

async function getTransferStatus(referenceId) {
  const tokenResult = await tokenFor('disbursement');
  if (!tokenResult.ok || !tokenResult.data?.access_token) return tokenResult;
  const subKey = requireEnv('MTN_MOMO_DISBURSEMENT_SUBSCRIPTION_KEY');
  return fetchJson(`${baseUrl()}/disbursement/v1_0/transfer/${encodeURIComponent(referenceId)}`, {
    method: 'GET',
    headers: withNoCache({
      Authorization: `Bearer ${tokenResult.data.access_token}`,
      'X-Target-Environment': targetEnvironment(),
      'Ocp-Apim-Subscription-Key': subKey
    })
  });
}

async function getRequestToPayStatus(referenceId) {
  const tokenResult = await tokenFor('collection');
  if (!tokenResult.ok || !tokenResult.data?.access_token) return tokenResult;
  const subKey = requireEnv('MTN_MOMO_COLLECTION_SUBSCRIPTION_KEY');
  return fetchJson(`${baseUrl()}/collection/v1_0/requesttopay/${encodeURIComponent(referenceId)}`, {
    method: 'GET',
    headers: withNoCache({
      Authorization: `Bearer ${tokenResult.data.access_token}`,
      'X-Target-Environment': targetEnvironment(),
      'Ocp-Apim-Subscription-Key': subKey
    })
  });
}

async function getBalance(product) {
  const tokenResult = await tokenFor(product);
  if (!tokenResult.ok || !tokenResult.data?.access_token) return tokenResult;
  const subKey = requireEnv(`MTN_MOMO_${product.toUpperCase()}_SUBSCRIPTION_KEY`);
  return fetchJson(`${baseUrl()}/${product}/v1_0/account/balance`, {
    method: 'GET',
    headers: withNoCache({
      Authorization: `Bearer ${tokenResult.data.access_token}`,
      'X-Target-Environment': targetEnvironment(),
      'Ocp-Apim-Subscription-Key': subKey
    })
  });
}

async function isAccountHolderActive(product, partyIdType, partyId) {
  const tokenResult = await tokenFor(product);
  if (!tokenResult.ok || !tokenResult.data?.access_token) return tokenResult;
  const subKey = requireEnv(`MTN_MOMO_${product.toUpperCase()}_SUBSCRIPTION_KEY`);
  return fetchJson(`${baseUrl()}/${product}/v1_0/accountholder/${encodeURIComponent(partyIdType)}/${encodeURIComponent(partyId)}/active`, {
    method: 'GET',
    headers: withNoCache({
      Authorization: `Bearer ${tokenResult.data.access_token}`,
      'X-Target-Environment': targetEnvironment(),
      'Ocp-Apim-Subscription-Key': subKey
    })
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const action = String(req.body?.action || '').trim();

  try {
    if (action === 'preflight') {
      const required = [
        'MTN_MOMO_API_BASE_URL',
        'MTN_MOMO_TARGET_ENVIRONMENT',
        'MTN_MOMO_API_USER_ID',
        'MTN_MOMO_API_KEY',
        'MTN_MOMO_COLLECTION_SUBSCRIPTION_KEY',
        'MTN_MOMO_DISBURSEMENT_SUBSCRIPTION_KEY'
      ];
      const missing = required.filter((k) => !process.env[k]);
      return res.status(200).json({
        ready: missing.length === 0,
        missing,
        base_url: baseUrl(),
        target_environment: targetEnvironment()
      });
    }

    if (action === 'createApiUser') {
      const referenceId = String(req.body?.referenceId || uuidV4());
      const providerCallbackHost = String(req.body?.providerCallbackHost || process.env.MTN_MOMO_PROVIDER_CALLBACK_HOST || '').trim();
      if (!providerCallbackHost) {
        return res.status(400).json({ error: 'Missing providerCallbackHost' });
      }
      const result = await provisioningCreateApiUser({ referenceId, providerCallbackHost });
      return res.status(result.status).json({ ...result.data, referenceId });
    }

    if (action === 'createApiKey') {
      const apiUserId = String(req.body?.apiUserId || process.env.MTN_MOMO_API_USER_ID || '').trim();
      if (!apiUserId) return res.status(400).json({ error: 'Missing apiUserId' });
      const result = await provisioningCreateApiKey({ apiUserId });
      return res.status(result.status).json(result.data);
    }

    if (action === 'token') {
      const product = String(req.body?.product || 'disbursement').toLowerCase();
      if (!['collection', 'disbursement'].includes(product)) {
        return res.status(400).json({ error: 'Invalid product', allowed: ['collection', 'disbursement'] });
      }
      const result = await tokenFor(product);
      return res.status(result.status).json(result.data);
    }

    if (action === 'requestToPay') {
      const msisdn = String(req.body?.msisdn || '').trim();
      const amount = req.body?.amount;
      const currency = String(req.body?.currency || 'XAF').toUpperCase();
      const externalId = String(req.body?.externalId || `COL-${Date.now()}`);
      const payerMessage = String(req.body?.payerMessage || 'Payment request');
      const payeeNote = String(req.body?.payeeNote || 'Payment request');
      const referenceId = String(req.body?.referenceId || uuidV4());
      if (!msisdn || !amount) return res.status(400).json({ error: 'Missing msisdn/amount' });
      const result = await collectionRequestToPay({ amount, currency, externalId, msisdn, payerMessage, payeeNote, referenceId });
      return res.status(result.status).json({ ...result.data, referenceId });
    }

    if (action === 'requestToPayStatus') {
      const referenceId = String(req.body?.referenceId || '').trim();
      if (!referenceId) return res.status(400).json({ error: 'Missing referenceId' });
      const result = await getRequestToPayStatus(referenceId);
      return res.status(result.status).json(result.data);
    }

    if (action === 'transfer') {
      const msisdn = String(req.body?.msisdn || '').trim();
      const amount = req.body?.amount;
      const currency = String(req.body?.currency || 'XAF').toUpperCase();
      const externalId = String(req.body?.externalId || `DISB-${Date.now()}`);
      const payerMessage = String(req.body?.payerMessage || 'Disbursement');
      const payeeNote = String(req.body?.payeeNote || 'Disbursement');
      const referenceId = String(req.body?.referenceId || uuidV4());
      if (!msisdn || !amount) return res.status(400).json({ error: 'Missing msisdn/amount' });
      const result = await disbursementTransfer({ amount, currency, externalId, msisdn, payerMessage, payeeNote, referenceId });
      return res.status(result.status).json({ ...result.data, referenceId });
    }

    if (action === 'transferStatus') {
      const referenceId = String(req.body?.referenceId || '').trim();
      if (!referenceId) return res.status(400).json({ error: 'Missing referenceId' });
      const result = await getTransferStatus(referenceId);
      return res.status(result.status).json(result.data);
    }

    if (action === 'balance') {
      const product = String(req.body?.product || 'disbursement').toLowerCase();
      if (!['collection', 'disbursement'].includes(product)) {
        return res.status(400).json({ error: 'Invalid product', allowed: ['collection', 'disbursement'] });
      }
      const result = await getBalance(product);
      return res.status(result.status).json(result.data);
    }

    if (action === 'accountHolderActive') {
      const product = String(req.body?.product || 'collection').toLowerCase();
      if (!['collection', 'disbursement'].includes(product)) {
        return res.status(400).json({ error: 'Invalid product', allowed: ['collection', 'disbursement'] });
      }
      const partyIdType = String(req.body?.partyIdType || 'MSISDN').toUpperCase();
      const partyId = String(req.body?.partyId || req.body?.msisdn || '').trim();
      if (!partyId) return res.status(400).json({ error: 'Missing partyId' });
      const result = await isAccountHolderActive(product, partyIdType, partyId);
      return res.status(result.status).json(result.data);
    }

    return res.status(400).json({
      error: 'Unsupported action',
      allowed: [
        'preflight',
        'createApiUser',
        'createApiKey',
        'token',
        'requestToPay',
        'requestToPayStatus',
        'transfer',
        'transferStatus',
        'balance',
        'accountHolderActive'
      ]
    });
  } catch (error) {
    return res.status(500).json({
      error: 'MTN MoMo operation failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
