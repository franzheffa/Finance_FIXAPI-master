import Head from "next/head";
import { useMemo, useState } from "react";

const ORANGE_COUNTRIES = [
  { code: "CM", name: "Cameroun", dialCode: "+237", example: "+2376XXXXXXX" },
  { code: "SN", name: "Sénégal", dialCode: "+221", example: "+221771234567" },
  { code: "CI", name: "Côte d’Ivoire", dialCode: "+225", example: "+22507XXXXXXX" },
  { code: "CD", name: "RD Congo", dialCode: "+243", example: "+2438XXXXXXX" },
  { code: "BF", name: "Burkina Faso", dialCode: "+226", example: "+2267XXXXXXX" },
  { code: "GN", name: "Guinée", dialCode: "+224", example: "+2246XXXXXXX" },
];

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f3eb",
    color: "#111111",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: "40px 16px 56px",
  },
  wrap: {
    maxWidth: 920,
    margin: "0 auto",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e7dcc4",
    borderRadius: 28,
    overflow: "hidden",
    boxShadow: "0 24px 80px rgba(0,0,0,0.08)",
  },
  hero: {
    background: "#0b0b0b",
    color: "#ffffff",
    padding: "28px 30px 24px",
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "#d4b26a",
    margin: 0,
  },
  h1: {
    margin: "14px 0 8px",
    fontSize: 34,
    lineHeight: 1.1,
    fontWeight: 800,
  },
  heroText: {
    margin: 0,
    color: "rgba(255,255,255,0.76)",
    fontSize: 15,
    lineHeight: 1.6,
  },
  body: {
    padding: 30,
    display: "grid",
    gap: 22,
  },
  section: {
    borderRadius: 22,
    border: "1px solid #eadfca",
    background: "#fcfaf5",
    padding: 24,
  },
  sectionTitle: {
    margin: "0 0 8px",
    fontSize: 22,
    lineHeight: 1.2,
    fontWeight: 800,
  },
  sectionText: {
    margin: "0 0 18px",
    color: "#3d3322",
    fontSize: 15,
    lineHeight: 1.6,
  },
  form: {
    display: "grid",
    gap: 16,
  },
  label: {
    display: "grid",
    gap: 8,
    fontSize: 15,
    fontWeight: 700,
    color: "#17120b",
  },
  input: {
    width: "100%",
    height: 54,
    borderRadius: 18,
    border: "1px solid #d8c9aa",
    background: "#fffdf8",
    padding: "0 16px",
    fontSize: 16,
    color: "#111111",
    outline: "none",
    boxSizing: "border-box",
  },
  grid: {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "1fr 1fr",
  },
  actions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 180,
    height: 54,
    borderRadius: 18,
    border: "1px solid #0b0b0b",
    background: "#0b0b0b",
    color: "#d4b26a",
    fontWeight: 800,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    cursor: "pointer",
    padding: "0 20px",
  },
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 140,
    height: 54,
    borderRadius: 18,
    border: "1px solid #d7d7d7",
    background: "#ffffff",
    color: "#111111",
    fontWeight: 700,
    textDecoration: "none",
    cursor: "pointer",
    padding: "0 20px",
  },
  status: {
    minHeight: 24,
    fontSize: 14,
    lineHeight: 1.6,
    color: "#5c4a1f",
    fontWeight: 700,
  },
  hint: {
    marginTop: -2,
    fontSize: 13,
    lineHeight: 1.5,
    color: "#6a5730",
    fontWeight: 600,
  },
  infoBox: {
    borderRadius: 16,
    background: "#faf7ef",
    border: "1px solid #eadfca",
    padding: 16,
    fontSize: 14,
    lineHeight: 1.6,
    color: "#4a3b22",
  },
};

export default function LoginClassicPage() {
  const [email, setEmail] = useState("franz@buttertech.io");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  const [country, setCountry] = useState("CM");
  const [phoneNumber, setPhoneNumber] = useState("+2376XXXXXXX");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  const currentCountry = useMemo(() => {
    return ORANGE_COUNTRIES.find((item) => item.code === country) || ORANGE_COUNTRIES[0];
  }, [country]);

  async function handleLoginSubmit(event) {
    event.preventDefault();

    if (loginLoading) return;

    setLoginLoading(true);
    setLoginMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.ok) {
        setLoginMessage(data?.error || "Connexion impossible pour le moment.");
        setLoginLoading(false);
        return;
      }

      setLoginMessage("Connexion réussie. Redirection...");
      window.location.href = data?.redirectTo || "/";
    } catch (error) {
      setLoginMessage("Connexion impossible pour le moment.");
      setLoginLoading(false);
    }
  }

  async function handleOtpSubmit(event) {
    event.preventDefault();

    if (otpLoading) return;

    setOtpLoading(true);
    setOtpMessage("");

    try {
      const response = await fetch("/api/paygate/orange/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          country,
          phoneNumber,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.ok) {
        setOtpMessage(data?.error || "Envoi impossible pour le moment.");
        setOtpLoading(false);
        return;
      }

      setOtpMessage("Code envoyé avec succès.");
    } catch (error) {
      setOtpMessage("Envoi impossible pour le moment.");
    } finally {
      setOtpLoading(false);
    }
  }

  function handleCountryChange(event) {
    const nextCode = event.target.value;
    const nextCountry =
      ORANGE_COUNTRIES.find((item) => item.code === nextCode) || ORANGE_COUNTRIES[0];

    setCountry(nextCode);
    setPhoneNumber(nextCountry.example);
    setOtpMessage("");
  }

  return (
    <>
      <Head>
        <title>Login classique · Smith-Heffa Paygate</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={styles.page}>
        <div style={styles.wrap}>
          <div style={styles.card}>
            <section style={styles.hero}>
              <p style={styles.eyebrow}>Buttertech · Smith-Heffa Paygate</p>
              <h1 style={styles.h1}>Login classique</h1>
              <p style={styles.heroText}>Accédez à votre espace en toute simplicité.</p>
            </section>

            <section style={styles.body}>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Connexion</h2>
                <p style={styles.sectionText}>
                  Utilisez votre email et votre mot de passe pour continuer.
                </p>

                <form
                  style={styles.form}
                  onSubmit={handleLoginSubmit}
                  action="/login-classic"
                  method="post"
                  noValidate
                >
                  <label style={styles.label}>
                    Email
                    <input
                      style={styles.input}
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="franz@buttertech.io"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </label>

                  <label style={styles.label}>
                    Mot de passe
                    <input
                      style={styles.input}
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      placeholder="Votre mot de passe"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </label>

                  <div style={styles.actions}>
                    <button type="submit" style={styles.primaryBtn} disabled={loginLoading}>
                      {loginLoading ? "Connexion..." : "Se connecter"}
                    </button>

                    <a href="/auth/login" style={styles.secondaryBtn}>
                      Retour
                    </a>
                  </div>

                  <div style={styles.status}>{loginMessage}</div>
                </form>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Test rapide Orange</h2>
                <p style={styles.sectionText}>
                  Vérifiez l’envoi d’un code sur les pays actifs avant le branchement final.
                </p>

                <form style={styles.form} onSubmit={handleOtpSubmit}>
                  <div style={styles.grid}>
                    <label style={styles.label}>
                      Pays
                      <select
                        style={styles.input}
                        value={country}
                        onChange={handleCountryChange}
                      >
                        {ORANGE_COUNTRIES.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label style={styles.label}>
                      Numéro
                      <input
                        style={styles.input}
                        type="text"
                        placeholder={currentCountry.example}
                        required
                        value={phoneNumber}
                        onChange={(event) => setPhoneNumber(event.target.value)}
                      />
                      <span style={styles.hint}>
                        Indicatif {currentCountry.dialCode} · Exemple {currentCountry.example}
                      </span>
                    </label>
                  </div>

                  <div style={styles.actions}>
                    <button type="submit" style={styles.primaryBtn} disabled={otpLoading}>
                      {otpLoading ? "Envoi..." : "Envoyer le code"}
                    </button>
                  </div>

                  <div style={styles.status}>{otpMessage}</div>
                </form>
              </section>

              <div style={styles.infoBox}>
                Pays disponibles : Cameroun, Sénégal, Côte d’Ivoire, RD Congo, Burkina Faso, Guinée.
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
