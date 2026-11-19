-- Append-only legal acceptance and checkout evidence for Star69AI.
CREATE TABLE IF NOT EXISTS avr_checkout_evidence_events (
  event_id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  onboarding_id TEXT,
  event_type TEXT NOT NULL CHECK(event_type IN ('purchase_terms_accepted','payment_confirmed')),
  email TEXT NOT NULL,
  business_name TEXT NOT NULL,
  plan_key TEXT NOT NULL,
  billing_cadence TEXT NOT NULL,
  terms_version TEXT NOT NULL,
  privacy_version TEXT NOT NULL,
  service_disclosure_version TEXT NOT NULL,
  plan_snapshot_json TEXT NOT NULL,
  acceptance_json TEXT NOT NULL,
  agreement_sha256 TEXT NOT NULL,
  turnstile_hostname TEXT,
  turnstile_action TEXT,
  ip_address TEXT,
  user_agent TEXT,
  provider TEXT,
  provider_reference TEXT,
  server_timestamp TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS avr_checkout_evidence_customer_idx ON avr_checkout_evidence_events(customer_id, server_timestamp DESC);
CREATE INDEX IF NOT EXISTS avr_checkout_evidence_onboarding_idx ON avr_checkout_evidence_events(onboarding_id, server_timestamp DESC);
CREATE TRIGGER IF NOT EXISTS avr_checkout_evidence_no_update BEFORE UPDATE ON avr_checkout_evidence_events BEGIN SELECT RAISE(ABORT, 'checkout evidence is append-only'); END;
CREATE TRIGGER IF NOT EXISTS avr_checkout_evidence_no_delete BEFORE DELETE ON avr_checkout_evidence_events BEGIN SELECT RAISE(ABORT, 'checkout evidence is append-only'); END;
