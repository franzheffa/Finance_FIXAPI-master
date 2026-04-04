const { generateOtp } = require("../../../../../lib/paygate/auth/generate-otp");
const {
  ORANGE_COUNTRY_LABELS,
  ensureCountryAllowed,
  resolveCountryCode,
  withInternationalPlus,
} = require("../../../../../lib/paygate/orange/countries");
const { orangeConfig } = require("../../../../../lib/paygate/orange/config");
const { sendOrangeSms } = require("../../../../../lib/paygate/orange/send-sms");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed",
    });
  }

  try {
    const {
      phoneNumber,
      phone,
      countryCode: requestedCountryCode,
      country,
    } = req.body || {};

    const rawPhoneNumber = phoneNumber || phone;

    if (!rawPhoneNumber || typeof rawPhoneNumber !== "string") {
      return res.status(400).json({
        ok: false,
        code: "PHONE_REQUIRED",
        error: "Phone number is required",
      });
    }

    const to = withInternationalPlus(rawPhoneNumber);

    if (!to) {
      return res.status(400).json({
        ok: false,
        code: "PHONE_INVALID",
        error: "Invalid phone number",
      });
    }

    const countryCode = resolveCountryCode(
      requestedCountryCode || country,
      to
    );

    ensureCountryAllowed(countryCode, orangeConfig);

    const otp = generateOtp(6);
    const message = `Smith-Heffa Paygate code: ${otp}.\nNe partagez jamais ce code.`;

    const delivery = await sendOrangeSms({
      to,
      message,
    });

    if (!delivery || !delivery.ok) {
      return res.status(502).json({
        ok: false,
        code: "ORANGE_DELIVERY_FAILED",
        provider: "orange",
        error: delivery?.error || "Orange SMS delivery failed",
      });
    }

    return res.status(200).json({
      ok: true,
      provider: "orange",
      mode: delivery.mode || (orangeConfig.simulation ? "simulation" : "live"),
      countryCode,
      countryLabel: ORANGE_COUNTRY_LABELS[countryCode] || countryCode,
      otpPreview: process.env.NODE_ENV === "production" ? undefined : otp,
      delivery,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    if (/^Orange country .* disabled$/.test(message)) {
      return res.status(400).json({
        ok: false,
        code: "ORANGE_COUNTRY_DISABLED",
        error: message,
      });
    }

    if (
      message === "Orange configuration unavailable" ||
      message === "Orange countries configuration unavailable" ||
      message === "Orange SMS disabled" ||
      message === "Missing Orange credentials"
    ) {
      return res.status(503).json({
        ok: false,
        code: "ORANGE_CONFIG_ERROR",
        error: message,
      });
    }

    console.error("[PayGate - Orange OTP] System Exception:", error);

    return res.status(500).json({
      ok: false,
      code: "ORANGE_INTERNAL_ERROR",
      error: message,
    });
  }
}
