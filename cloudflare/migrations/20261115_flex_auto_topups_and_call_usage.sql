-- Enable Flex accounts without violating the existing subscription-plan CHECK constraint.
ALTER TABLE avr_customers ADD COLUMN payg_enabled INTEGER NOT NULL DEFAULT 0 CHECK(payg_enabled IN (0,1));

-- PayPal orders are recorded before redirect; wallet credits are posted only after verified capture.
CREATE TABLE IF NOT EXISTS avr_payg_topups (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES avr_customers(id) ON DELETE CASCADE,
  paypal_order_id TEXT UNIQUE,
  paypal_capture_id TEXT UNIQUE,
  amount_cents INTEGER NOT NULL CHECK(amount_cents >= 500 AND amount_cents % 500 = 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','paid','cancelled','failed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS avr_payg_topups_customer_idx
  ON avr_payg_topups(customer_id, created_at DESC);
