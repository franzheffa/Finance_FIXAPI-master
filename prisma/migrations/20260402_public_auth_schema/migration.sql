CREATE SCHEMA IF NOT EXISTS public_auth;

CREATE TABLE IF NOT EXISTS public_auth.user_profile (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  phone_e164 TEXT,
  auth_provider TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public_auth.auth_identity (
  id TEXT PRIMARY KEY,
  user_profile_id TEXT NOT NULL REFERENCES public_auth.user_profile(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

CREATE INDEX IF NOT EXISTS idx_public_auth_identity_user_profile_id
  ON public_auth.auth_identity(user_profile_id);

CREATE TABLE IF NOT EXISTS public_auth.phone_verification (
  id TEXT PRIMARY KEY,
  phone_e164 TEXT NOT NULL,
  country_code TEXT,
  otp_code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_public_auth_phone_verification_phone
  ON public_auth.phone_verification(phone_e164);

CREATE INDEX IF NOT EXISTS idx_public_auth_phone_verification_expires_at
  ON public_auth.phone_verification(expires_at);
