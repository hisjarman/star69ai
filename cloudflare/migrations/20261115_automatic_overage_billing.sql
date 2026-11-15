-- Automatic, auditable Stripe overage billing and off-session card authorization.
ALTER TABLE avr_customers ADD COLUMN stripe_payment_method_id TEXT;
ALTER TABLE avr_customers ADD COLUMN overage_payment_status TEXT NOT NULL DEFAULT 'not_setup'
  CHECK(overage_payment_status IN ('not_setup','payment_method_required','active','past_due'));

CREATE TABLE IF NOT EXISTS avr_overage_billing_ledger (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES avr_customers(id) ON DELETE CASCADE,
  period_key TEXT NOT NULL,
  usage_minutes_total INTEGER NOT NULL CHECK(usage_minutes_total >= 0),
  billed_minutes INTEGER NOT NULL CHECK(billed_minutes > 0),
  rate_cents INTEGER NOT NULL CHECK(rate_cents > 0),
  amount_cents INTEGER NOT NULL CHECK(amount_cents > 0),
  stripe_invoice_item_id TEXT,
  stripe_invoice_id TEXT,
  status TEXT NOT NULL CHECK(status IN ('processing','queued','invoiced','paid','failed')),
  failure_reason TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(customer_id,period_key,usage_minutes_total)
);
CREATE INDEX IF NOT EXISTS avr_overage_billing_customer_period_idx
  ON avr_overage_billing_ledger(customer_id,period_key,status);
