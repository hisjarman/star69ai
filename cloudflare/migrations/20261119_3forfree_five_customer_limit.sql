-- Enforce the November 2026 3FORFREE offer's five-customer limit.
-- Active reservations temporarily hold a place for one hour while Stripe Checkout is open.
CREATE TABLE IF NOT EXISTS avr_promotion_enrollments (
  id TEXT PRIMARY KEY,
  campaign_key TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('reserved', 'claimed')),
  reserved_until TEXT,
  stripe_session_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (campaign_key, customer_id)
);
CREATE INDEX IF NOT EXISTS idx_avr_promotion_enrollments_campaign_status
  ON avr_promotion_enrollments (campaign_key, status, reserved_until);
CREATE INDEX IF NOT EXISTS idx_avr_promotion_enrollments_stripe_session
  ON avr_promotion_enrollments (stripe_session_id);
