import { getProviders } from "next-auth/react";

export default function LoginPage({
  providers = {},
  legacyEnabled = false,
  orangeEnabled = false,
}) {
  const googleProvider = providers.google || null;
  const appleProvider = providers.apple || null;

  return (
    <main style={{ padding: 24 }}>
      <h1>Authentification unifiée</h1>
      <p>Accès centralisé, enterprise grade.</p>

      {googleProvider && (
        <p>
          <a href={googleProvider.signinUrl}>Continuer avec Google</a>
        </p>
      )}

      {appleProvider && (
        <p>
          <a href={appleProvider.signinUrl}>Continuer avec Apple</a>
        </p>
      )}

      {orangeEnabled && (
        <p>
          <a href="/oidc-debug">Continuer avec téléphone</a>
        </p>
      )}

      {legacyEnabled && (
        <p>
          <a href="/">Utiliser le login classique (beta)</a>
        </p>
      )}

      {!googleProvider && !appleProvider && !orangeEnabled && !legacyEnabled && (
        <p>Aucun provider d’authentification n’est activé.</p>
      )}

      <p>Smith-Heffa Paygate</p>

      <h2>Enterprise Payment Rail</h2>
      <p>
        Orchestration unifiée des paiements, OTP mobile trust layer, virements
        bancaires et mobile money.
      </p>

      <p>Rails</p>
      <ul>
        <li>Stripe</li>
        <li>PayPal</li>
        <li>Apple Pay</li>
        <li>Interac</li>
        <li>SWIFT / SEPA</li>
        <li>Orange Money / Mobile Money</li>
      </ul>

      <p>Sécurité</p>
      <ul>
        <li>Authentification</li>
        <li>2FA / OTP</li>
        <li>Session hardening</li>
        <li>Audit trail</li>
        <li>Enterprise access control</li>
      </ul>

      <p>Buttertech</p>
      <ul>
        <li>Viize Parking</li>
        <li>Buttertech Academy</li>
        <li>AI Multimodal Studio</li>
        <li>Production-ready orchestration</li>
      </ul>

      <footer>© 2026 Smith-Heffa PaygateFond blanc • Noir • Or Louis XIV</footer>
    </main>
  );
}

export async function getServerSideProps() {
  const providers = (await getProviders()) || {};

  const orangeEnabled =
    process.env.NEXT_PUBLIC_PAYGATE_AUTH_ORANGE_OTP_ENABLED === "true";

  const legacyEnabled =
    process.env.NEXT_PUBLIC_PAYGATE_AUTH_LEGACY_ENABLED === "true";

  return {
    props: {
      providers,
      orangeEnabled,
      legacyEnabled,
    },
  };
}
