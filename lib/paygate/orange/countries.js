const ORANGE_COUNTRY_PREFIXES = {
  CM: "+237",
  CM_ORANGE_ONLY: "+237",
  CI: "+225",
  CD: "+243",
  BF: "+226",
  GN: "+224",
  SN: "+221",
};

const ORANGE_COUNTRY_LABELS = {
  CM: "Cameroun",
  CM_ORANGE_ONLY: "Cameroun (Orange)",
  CI: "Cote d'Ivoire",
  CD: "RDC",
  BF: "Burkina Faso",
  GN: "Guinee",
  SN: "Senegal",
};

function normalizePhoneNumber(raw) {
  return String(raw || "").replace(/[^\d+]/g, "");
}

function withInternationalPlus(raw) {
  const value = normalizePhoneNumber(raw);
  if (!value) {
    return "";
  }
  return value.startsWith("+") ? value : `+${value}`;
}

function resolveCountryCode(rawCountryCode, rawPhoneNumber) {
  const requested = String(rawCountryCode || "").trim().toUpperCase();
  if (requested) {
    return requested;
  }

  const phoneNumber = withInternationalPlus(rawPhoneNumber);

  for (const [countryCode, prefix] of Object.entries(ORANGE_COUNTRY_PREFIXES)) {
    if (countryCode === "CM_ORANGE_ONLY") {
      continue;
    }

    if (phoneNumber.startsWith(prefix)) {
      return countryCode;
    }
  }

  return "CM";
}

function ensureCountryAllowed(countryCode, config) {
  if (!config || typeof config !== "object") {
    throw new Error("Orange configuration unavailable");
  }

  if (!config.countries || typeof config.countries !== "object") {
    throw new Error("Orange countries configuration unavailable");
  }

  if (!config.countries[countryCode]) {
    throw new Error(`Orange country ${countryCode} disabled`);
  }
}

module.exports = {
  ORANGE_COUNTRY_PREFIXES,
  ORANGE_COUNTRY_LABELS,
  normalizePhoneNumber,
  withInternationalPlus,
  resolveCountryCode,
  ensureCountryAllowed,
};
