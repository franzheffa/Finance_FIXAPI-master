import { prisma } from "../../../lib/prisma";

function wantsJson(req) {
  const accept = String(req.headers.accept || "");
  const contentType = String(req.headers["content-type"] || "");
  return accept.includes("application/json") || contentType.includes("application/json");
}

function redirectHtml(res, location) {
  res.writeHead(303, { Location: location });
  res.end();
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    return redirectHtml(res, "/login-classic");
  }

  if (req.method !== "POST") {
    if (wantsJson(req)) {
      return res.status(405).json({ ok: false, error: "Méthode non autorisée." });
    }
    return redirectHtml(res, "/login-classic");
  }

  try {
    const { email, password } = req.body || {};

    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPassword = String(password || "");

    if (!normalizedEmail || !normalizedPassword) {
      if (wantsJson(req)) {
        return res.status(400).json({ ok: false, error: "Email et mot de passe requis." });
      }
      return redirectHtml(res, "/login-classic?error=missing_fields");
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        createdAt: true,
        security: {
          select: {
            twoFactorEnabled: true,
          },
        },
      },
    });

    if (!user || !user.password || user.password !== normalizedPassword) {
      if (wantsJson(req)) {
        return res.status(401).json({ ok: false, error: "Identifiants invalides." });
      }
      return redirectHtml(res, "/login-classic?error=invalid_credentials");
    }

    const payload = {
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      security: {
        twoFactorEnabled: Boolean(user.security?.twoFactorEnabled),
      },
      redirectTo: "/",
    };

    if (wantsJson(req)) {
      return res.status(200).json(payload);
    }

    return redirectHtml(res, "/");
  } catch (error) {
    if (wantsJson(req)) {
      return res.status(500).json({ ok: false, error: "Erreur interne." });
    }
    return redirectHtml(res, "/login-classic?error=server_error");
  }
}
