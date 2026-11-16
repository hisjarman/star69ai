-- November 2026 3FORFREE subscription promotion tracking.
ALTER TABLE avr_customers ADD COLUMN promo_code TEXT;
ALTER TABLE avr_customers ADD COLUMN promo_paid_cycles INTEGER NOT NULL DEFAULT 0;
ALTER TABLE avr_customers ADD COLUMN promo_free_applied INTEGER NOT NULL DEFAULT 0;
CREATE TABLE IF NOT EXISTS avr_3forfree_invoice_events (
  invoice_id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_avr_3forfree_customer ON avr_3forfree_invoice_events(customer_id);
