
-- Allow Google-only accounts that do not have a password.
ALTER TABLE users
  ALTER COLUMN password_hash DROP NOT NULL;

-- Existing accounts remain usable.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT TRUE;

-- Google subject identifier; never use an email as the Google identity key.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS google_sub VARCHAR(255);

CREATE UNIQUE INDEX IF NOT EXISTS users_google_sub_unique
  ON users (google_sub)
  WHERE google_sub IS NOT NULL;

-- Temporary signup records; no account is created until OTP verification.
CREATE TABLE IF NOT EXISTS pending_signups (
  email VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,

  age INTEGER,
  height_cm DECIMAL(5,2),
  weight_kg DECIMAL(5,2),
  goal_type VARCHAR(50),

  otp_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_sent_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS pending_signups_expires_at_idx
  ON pending_signups (expires_at);
