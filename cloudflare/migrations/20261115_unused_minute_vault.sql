-- Server-authoritative, non-cash unused-minute vault.
-- Apply to the existing avr-trust-lab D1 database before deploying the platform Worker.
-- Correct the existing Pro allowance without changing plan prices.
UPDATE avr_customers SET included_minutes=1200 WHERE plan_key='pro';

CREATE TABLE IF NOT EXISTS avr_minute_vault_periods (
  customer_id TEXT NOT NULL REFERENCES avr_customers(id) ON DELETE CASCADE,
  period_key TEXT NOT NULL,
  plan_key TEXT NOT NULL,
  included_minutes INTEGER NOT NULL DEFAULT 0 CHECK(included_minutes >= 0),
  used_minutes INTEGER NOT NULL DEFAULT 0 CHECK(used_minutes >= 0),
  banked_minutes INTEGER NOT NULL DEFAULT 0 CHECK(banked_minutes >= 0),
  bank_used_minutes INTEGER NOT NULL DEFAULT 0 CHECK(bank_used_minutes >= 0),
  balance_after_minutes INTEGER NOT NULL DEFAULT 0 CHECK(balance_after_minutes >= 0),
  finalized INTEGER NOT NULL DEFAULT 0 CHECK(finalized IN (0,1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  PRIMARY KEY(customer_id, period_key)
);
CREATE INDEX IF NOT EXISTS avr_minute_vault_period_customer_idx
  ON avr_minute_vault_periods(customer_id, period_key DESC);

CREATE TABLE IF NOT EXISTS avr_minute_vault_events (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  minutes INTEGER NOT NULL DEFAULT 0,
  detail_json TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS avr_minute_vault_events_customer_idx
  ON avr_minute_vault_events(customer_id, created_at DESC);
