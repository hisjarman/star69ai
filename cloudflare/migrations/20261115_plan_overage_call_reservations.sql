-- Per-call reservations make the fixed plan overage ceiling enforceable across concurrent inbound calls.
-- Reservations expire after the provider's maximum allowed call duration plus a safety buffer.
CREATE TABLE IF NOT EXISTS avr_overage_call_reservations (
  call_id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES avr_customers(id) ON DELETE CASCADE,
  period_key TEXT NOT NULL,
  reserved_ms INTEGER NOT NULL CHECK(reserved_ms >= 60000 AND reserved_ms <= 3600000),
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS avr_overage_call_reservations_customer_period_idx
  ON avr_overage_call_reservations(customer_id, period_key, expires_at);
