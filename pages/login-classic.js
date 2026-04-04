export default function LoginClassicPage() {
  return (
    <main style={{ padding: 24, maxWidth: 480, margin: "0 auto" }}>
      <h1>Login classique</h1>
      <p>Mode sprint sans Google. Point d’entrée temporaire pour continuer le déploiement.</p>

      <form method="POST" action="/api/auth/login">
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email">Email</label><br />
          <input
            id="email"
            name="email"
            type="email"
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Mot de passe</label><br />
          <input
            id="password"
            name="password"
            type="password"
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button type="submit" style={{ padding: "10px 16px" }}>
          Se connecter
        </button>
      </form>
    </main>
  );
}
