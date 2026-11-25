-- Store business phone numbers and auditable after-hours observations for marketing prospects.
-- This migration does not place calls or trigger automated outreach.
ALTER TABLE avr_marketing_prospects ADD COLUMN phone_number TEXT;

CREATE TABLE IF NOT EXISTS avr_marketing_after_hours_checks (
  check_id TEXT PRIMARY KEY,
  prospect_id TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  result_status TEXT NOT NULL CHECK(result_status IN ('ai_receptionist','human_answering_service','voicemail','no_answer','inconclusive')),
  check_method TEXT NOT NULL CHECK(check_method IN ('manual_call','public_website','business_listing','other')),
  evidence TEXT NOT NULL,
  checked_at TEXT NOT NULL,
  checked_by TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS avr_marketing_after_hours_prospect_checked_idx
  ON avr_marketing_after_hours_checks(prospect_id, checked_at DESC);
