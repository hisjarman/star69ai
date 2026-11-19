-- Auditable, founder-approved one-to-one AI sales calls.
-- Calls are blocked unless the admin records documented permission and verifies a business landline.
ALTER TABLE avr_marketing_prospects ADD COLUMN call_number_type TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE avr_marketing_prospects ADD COLUMN call_permission_confirmed INTEGER NOT NULL DEFAULT 0;
ALTER TABLE avr_marketing_prospects ADD COLUMN call_permission_evidence TEXT;
ALTER TABLE avr_marketing_prospects ADD COLUMN call_permission_checked_by TEXT;
ALTER TABLE avr_marketing_prospects ADD COLUMN call_permission_checked_at TEXT;
ALTER TABLE avr_marketing_prospects ADD COLUMN call_opted_out_at TEXT;

CREATE TABLE IF NOT EXISTS avr_marketing_ai_calls (
 id TEXT PRIMARY KEY,
 prospect_id TEXT NOT NULL,
 retell_call_id TEXT UNIQUE,
 to_number TEXT NOT NULL,
 from_number TEXT NOT NULL,
 call_status TEXT NOT NULL DEFAULT 'creating',
 initiated_by TEXT NOT NULL,
 permission_evidence TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 started_at TEXT,
 ended_at TEXT,
 duration_ms INTEGER,
 transcript TEXT,
 recording_url TEXT,
 call_summary TEXT,
 FOREIGN KEY(prospect_id) REFERENCES avr_marketing_prospects(id)
);
CREATE INDEX IF NOT EXISTS avr_marketing_ai_calls_created_idx
 ON avr_marketing_ai_calls(created_at DESC);
CREATE INDEX IF NOT EXISTS avr_marketing_ai_calls_prospect_idx
 ON avr_marketing_ai_calls(prospect_id,created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS avr_marketing_ai_calls_one_active_per_prospect_idx
 ON avr_marketing_ai_calls(prospect_id)
 WHERE call_status IN ('creating','registered','ongoing','in_progress');
