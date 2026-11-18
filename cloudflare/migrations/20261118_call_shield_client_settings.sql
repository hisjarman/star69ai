-- Client-configurable Call Shield policy. Server-side limits remain authoritative.
CREATE TABLE IF NOT EXISTS avr_call_shield_settings (
  customer_id TEXT PRIMARY KEY REFERENCES avr_customers(id) ON DELETE CASCADE,
  protection_mode TEXT NOT NULL DEFAULT 'standard' CHECK(protection_mode IN ('standard','strict','business_friendly')),
  max_attempts INTEGER NOT NULL DEFAULT 8 CHECK(max_attempts BETWEEN 3 AND 20),
  window_minutes INTEGER NOT NULL DEFAULT 10 CHECK(window_minutes BETWEEN 1 AND 60),
  cooldown_minutes INTEGER NOT NULL DEFAULT 15 CHECK(cooldown_minutes BETWEEN 1 AND 120),
  max_call_duration_minutes INTEGER NOT NULL DEFAULT 20 CHECK(max_call_duration_minutes BETWEEN 1 AND 30),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT NOT NULL DEFAULT 'system'
);
CREATE INDEX IF NOT EXISTS avr_call_shield_settings_updated_idx ON avr_call_shield_settings(updated_at);
