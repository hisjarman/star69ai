-- Star69AI admin-only, one-to-one prospect outreach.
CREATE TABLE IF NOT EXISTS avr_marketing_prospects (
 id TEXT PRIMARY KEY,
 business_name TEXT NOT NULL,
 contact_name TEXT,
 email TEXT NOT NULL,
 normalized_email TEXT NOT NULL UNIQUE,
 industry TEXT NOT NULL DEFAULT 'other',
 notes TEXT NOT NULL DEFAULT '',
 status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','unsubscribed')),
 unsubscribe_token_hash TEXT,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 last_contacted_at TEXT
);
CREATE INDEX IF NOT EXISTS avr_marketing_prospects_status_idx ON avr_marketing_prospects(status,created_at DESC);
CREATE TABLE IF NOT EXISTS avr_marketing_sends (
 id TEXT PRIMARY KEY,
 prospect_id TEXT NOT NULL,
 resend_email_id TEXT,
 subject TEXT NOT NULL,
 sent_at TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'sent',
 FOREIGN KEY(prospect_id) REFERENCES avr_marketing_prospects(id)
);
CREATE INDEX IF NOT EXISTS avr_marketing_sends_sent_at_idx ON avr_marketing_sends(sent_at DESC);
