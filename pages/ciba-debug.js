import { useState } from 'react';

const gold = '#D4AF37';

export default function CibaDebugPage() {
  const [authMethod, setAuthMethod] = useState('basic');
  const [loginHint, setLoginHint] = useState('tel:+237690000000');
  const [scope, setScope] = useState('openid dpv:FraudPreventionAndDetection sim-swap:check');
  const [authReqId, setAuthReqId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function callApi(body) {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/oidc/ciba', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      setResult({ status: response.status, data });
      if (!response.ok) {
        throw new Error(data?.error || `HTTP ${response.status}`);
      }
      return data;
    } catch (e) {
      setError(e.message || 'Erreur');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function start() {
    const data = await callApi({
      action: 'start',
      authMethod,
      login_hint: loginHint,
      scope
    });
    if (data?.auth_req_id) {
      setAuthReqId(data.auth_req_id);
    }
  }

  async function token() {
    await callApi({
      action: 'token',
      authMethod,
      auth_req_id: authReqId
    });
  }

  async function poll() {
    await callApi({
      action: 'poll',
      authMethod,
      auth_req_id: authReqId,
      maxAttempts: 6,
      intervalSec: 2
    });
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#000', fontFamily: '-apple-system,BlinkMacSystemFont,sans-serif' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '34px 20px' }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, letterSpacing: 1 }}>OIDC CIBA BACKEND FLOW</h1>
        <p style={{ margin: '8px 0 18px', color: '#444' }}>Smith-Heffa PayGate • Basic Auth + JWT Assertion</p>

        <div style={{ background: '#000', border: `1px solid ${gold}`, borderRadius: 18, padding: 18 }}>
          <label style={{ color: gold, fontWeight: 800, fontSize: 12 }}>AUTH METHOD</label>
          <select
            value={authMethod}
            onChange={(e) => setAuthMethod(e.target.value)}
            style={{ display: 'block', marginTop: 8, marginBottom: 12, padding: 10, width: '100%', borderRadius: 10, border: '1px solid #333', background: '#111', color: '#fff' }}
          >
            <option value="basic">basic</option>
            <option value="jwt_assertion">jwt_assertion</option>
          </select>

          <label style={{ color: gold, fontWeight: 800, fontSize: 12 }}>LOGIN HINT</label>
          <input
            value={loginHint}
            onChange={(e) => setLoginHint(e.target.value)}
            style={{ display: 'block', marginTop: 8, marginBottom: 12, padding: 10, width: '100%', borderRadius: 10, border: '1px solid #333', background: '#111', color: '#fff' }}
          />

          <label style={{ color: gold, fontWeight: 800, fontSize: 12 }}>SCOPE</label>
          <textarea
            rows={2}
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            style={{ display: 'block', marginTop: 8, marginBottom: 12, padding: 10, width: '100%', borderRadius: 10, border: '1px solid #333', background: '#111', color: '#fff' }}
          />

          <label style={{ color: gold, fontWeight: 800, fontSize: 12 }}>AUTH_REQ_ID</label>
          <input
            value={authReqId}
            onChange={(e) => setAuthReqId(e.target.value)}
            style={{ display: 'block', marginTop: 8, marginBottom: 16, padding: 10, width: '100%', borderRadius: 10, border: '1px solid #333', background: '#111', color: '#fff' }}
          />

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="button" onClick={start} disabled={loading} style={{ background: gold, color: '#000', border: 'none', borderRadius: 10, fontWeight: 900, padding: '11px 14px', cursor: 'pointer' }}>START CIBA</button>
            <button type="button" onClick={token} disabled={loading || !authReqId} style={{ background: '#111', color: gold, border: `1px solid ${gold}`, borderRadius: 10, fontWeight: 900, padding: '11px 14px', cursor: 'pointer' }}>GET TOKEN</button>
            <button type="button" onClick={poll} disabled={loading || !authReqId} style={{ background: '#111', color: gold, border: `1px solid ${gold}`, borderRadius: 10, fontWeight: 900, padding: '11px 14px', cursor: 'pointer' }}>POLL TOKEN</button>
          </div>
        </div>

        {error ? <div style={{ marginTop: 14, color: '#ef4444', fontWeight: 700 }}>{error}</div> : null}

        {result ? (
          <pre style={{ marginTop: 14, padding: 14, borderRadius: 12, border: `1px solid ${gold}`, background: '#fafafa', overflowX: 'auto' }}>
{JSON.stringify(result, null, 2)}
          </pre>
        ) : null}
      </div>
    </div>
  );
}
