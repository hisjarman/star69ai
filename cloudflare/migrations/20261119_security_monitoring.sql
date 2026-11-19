-- Operational security telemetry for requests rejected by the Star69AI platform Worker.
-- Deliberately excludes raw IP addresses, request bodies, credentials and payment data.
CREATE TABLE IF NOT EXISTS avr_security_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL CHECK(event_type IN ('authentication_rejected','turnstile_rejected','webhook_verification_failed','malformed_request')),
  severity TEXT NOT NULL CHECK(severity IN ('low','medium','high')),
  path TEXT NOT NULL,
  method TEXT NOT NULL,
  country TEXT,
  region TEXT,
  city TEXT,
  asn INTEGER,
  as_organization TEXT,
  colo TEXT,
  ray_id TEXT,
  detail TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS avr_security_events_created_idx ON avr_security_events(created_at DESC);
CREATE INDEX IF NOT EXISTS avr_security_events_type_created_idx ON avr_security_events(event_type,created_at DESC);
CREATE INDEX IF NOT EXISTS avr_security_events_asn_created_idx ON avr_security_events(asn,created_at DESC);
