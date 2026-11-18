-- Star69AI Call Shield: pre-answer burst screening and post-call caller-risk intelligence.
-- Caller numbers are not stored here. Caller identity is a keyed HMAC scoped to the client and dialed line.

CREATE TABLE IF NOT EXISTS avr_call_shield_state (
  customer_id TEXT NOT NULL REFERENCES avr_customers(id) ON DELETE CASCADE,
  dialed_number TEXT NOT NULL,
  caller_hash TEXT NOT NULL,
  window_started_at TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK(attempt_count >= 0),
  blocked_until TEXT,
  last_seen_at TEXT NOT NULL,
  PRIMARY KEY(customer_id, dialed_number, caller_hash)
);
CREATE INDEX IF NOT EXISTS avr_call_shield_state_last_seen_idx
  ON avr_call_shield_state(last_seen_at);

CREATE TABLE IF NOT EXISTS avr_call_shield_events (
  call_id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES avr_customers(id) ON DELETE CASCADE,
  dialed_number TEXT NOT NULL,
  caller_hash TEXT NOT NULL,
  decision TEXT NOT NULL CHECK(decision IN ('pending','allowed','rejected')),
  reason TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS avr_call_shield_events_customer_date_idx
  ON avr_call_shield_events(customer_id, created_at DESC);

ALTER TABLE avr_call_intelligence
  ADD COLUMN caller_risk_assessment TEXT NOT NULL DEFAULT 'unclear'
  CHECK(caller_risk_assessment IN ('likely_spam','possibly_abusive','legitimate','unclear'));
ALTER TABLE avr_call_intelligence
  ADD COLUMN caller_risk_signals_json TEXT NOT NULL DEFAULT '[]';
