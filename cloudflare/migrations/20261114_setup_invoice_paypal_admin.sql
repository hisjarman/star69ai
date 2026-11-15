-- Admin-managed PayPal setup invoices. Amounts are calculated from the server-side customer attribution.
CREATE TABLE IF NOT EXISTS avr_setup_invoices (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES avr_customers(id),
  base_amount_cents INTEGER NOT NULL DEFAULT 9900 CHECK(base_amount_cents >= 0),
  discount_amount_cents INTEGER NOT NULL DEFAULT 0 CHECK(discount_amount_cents >= 0),
  amount_due_cents INTEGER NOT NULL CHECK(amount_due_cents >= 0),
  discount_reason TEXT NOT NULL DEFAULT 'none' CHECK(discount_reason IN ('none','partner_referral_50')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','sent','paid','void')),
  paypal_invoice_url TEXT,
  admin_note TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  sent_at TEXT,
  paid_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS avr_setup_invoice_one_open_per_customer_idx
ON avr_setup_invoices(customer_id) WHERE status IN ('draft','sent','paid');
CREATE INDEX IF NOT EXISTS avr_setup_invoice_status_created_idx
ON avr_setup_invoices(status,created_at DESC);
