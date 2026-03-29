const TOKEN_SAFETY_WINDOW_SECONDS = 30;

let cachedToken = null;
let cachedTokenExpiryMs = 0;

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && now < cachedTokenExpiryMs) {
    return cachedToken;
  }

  const tokenUrl = process.env.ORANGE_OAUTH_TOKEN_URL || 'https://api.orange.com/oauth/v3/token';
  const clientId = getRequiredEnv('ORANGE_CLIENT_ID');
  const clientSecret = getRequiredEnv('ORANGE_CLIENT_SECRET');
  const scope = process.env.ORANGE_ORDERING_SCOPE || 'b2b:ordering';

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    scope
  });

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Orange OAuth failed (${response.status}): ${text}`);
  }

  const json = await response.json();
  const expiresIn = Number(json.expires_in || 3600);
  cachedToken = json.access_token;
  cachedTokenExpiryMs = now + Math.max(60, expiresIn - TOKEN_SAFETY_WINDOW_SECONDS) * 1000;

  return cachedToken;
}

async function callOrangeOrdering(path, { method = 'GET', query, body } = {}) {
  const token = await getAccessToken();
  const baseUrl = process.env.ORANGE_ORDERING_BASE_URL || 'https://api.orange.com/ordering/b2b/v3';
  const apiKey = getRequiredEnv('ORANGE_API_KEY');
  const language = process.env.ORANGE_ACCEPT_LANGUAGE || 'fr';

  const url = new URL(`${baseUrl}${path}`);
  if (query && typeof query === 'object') {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'X-Api-Key': apiKey,
      'Accept-Language': language,
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  const raw = await response.text();
  let parsed;
  try {
    parsed = raw ? JSON.parse(raw) : {};
  } catch (_) {
    parsed = { raw };
  }

  return {
    ok: response.ok,
    status: response.status,
    data: parsed
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const action = String(req.body?.action || '').trim();
  if (!action) {
    return res.status(400).json({ error: 'Missing action' });
  }

  try {
    let result;

    switch (action) {
      case 'status':
        result = await callOrangeOrdering('/status');
        break;
      case 'version':
        result = await callOrangeOrdering('/version');
        break;
      case 'me':
        result = await callOrangeOrdering('/me');
        break;
      case 'listRequests':
        result = await callOrangeOrdering('/requests', { query: req.body?.query });
        break;
      case 'getRequest': {
        const id = String(req.body?.id || '').trim();
        if (!id) return res.status(400).json({ error: 'Missing id' });
        result = await callOrangeOrdering(`/requests/${encodeURIComponent(id)}`);
        break;
      }
      case 'createRequest': {
        const payload = req.body?.payload;
        if (!payload || typeof payload !== 'object') {
          return res.status(400).json({ error: 'Missing payload object' });
        }
        result = await callOrangeOrdering('/requests', { method: 'POST', body: payload });
        break;
      }
      case 'listCatalogItems':
        result = await callOrangeOrdering('/catalogItems', { query: req.body?.query });
        break;
      case 'getCatalogItem': {
        const id = String(req.body?.id || '').trim();
        if (!id) return res.status(400).json({ error: 'Missing id' });
        result = await callOrangeOrdering(`/catalogItems/${encodeURIComponent(id)}`);
        break;
      }
      default:
        return res.status(400).json({
          error: 'Unsupported action',
          allowed: [
            'status',
            'version',
            'me',
            'listRequests',
            'getRequest',
            'createRequest',
            'listCatalogItems',
            'getCatalogItem'
          ]
        });
    }

    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({
      error: 'Orange ordering proxy failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
