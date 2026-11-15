-- Star69AI Flex pay-as-you-go prepaid wallet foundation.
-- Apply to avr-trust-lab D1 before deploying the matching Worker.
-- This migration records verified PayPal top-ups. It does NOT make direct Retell
-- phone-number routing safe: inbound numbers must first be moved behind a
-- pre-answer ingress gate that checks this balance before connecting a call.

CREATE TABLE IF NOT EXISTS avr_payg_wallets (
  customer_id TEXT PRIMARY KEY REFERENCES avr_customers(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','funded','suspended')),
  currency TEXT NOT NULL DEFAULT 'usd' CHECK(currency='usd'),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS avr_payg_wallet_ledger (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES avr_customers(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL CHECK(amount_cents != 0),
  entry_type TEXT NOT NULL CHECK(entry_type IN ('top_up','call_usage','refund','adjustment')),
  source_ref TEXT NOT NULL,
  note TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(customer_id, source_ref)
);

CREATE INDEX IF NOT EXISTS avr_payg_wallet_ledger_customer_idx
  ON avr_payg_wallet_ledger(customer_id, created_at DESC);
