-- Star69AI Receptionist Intelligence
CREATE TABLE IF NOT EXISTS avr_call_intelligence (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES avr_customers(id) ON DELETE CASCADE,
  call_id TEXT NOT NULL REFERENCES avr_calls(call_id) ON DELETE CASCADE,
  analysis_status TEXT NOT NULL DEFAULT 'complete',
  caller_intent TEXT,
  call_outcome TEXT,
  lead_capture_status TEXT NOT NULL DEFAULT 'unclear',
  confidence REAL NOT NULL DEFAULT 0,
  friction_points_json TEXT NOT NULL DEFAULT '[]',
  recommendations_json TEXT NOT NULL DEFAULT '[]',
  analyzed_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(call_id)
);
CREATE INDEX IF NOT EXISTS avr_call_intelligence_customer_date_idx
  ON avr_call_intelligence(customer_id, analyzed_at DESC);
