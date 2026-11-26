-- Public, isolated Star69AI live demo agents and privacy-preserving call rate limits.
-- Apply to the existing avr-trust-lab D1 database before deploying platform-worker.js.
CREATE TABLE IF NOT EXISTS avr_public_demo_agents (
  slug TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  agent_id TEXT NOT NULL UNIQUE,
  active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE IF NOT EXISTS avr_public_demo_call_events (
  id TEXT PRIMARY KEY,
  visitor_hash TEXT NOT NULL,
  demo_slug TEXT NOT NULL,
  call_id TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS avr_public_demo_visitor_rate_idx
  ON avr_public_demo_call_events(visitor_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS avr_public_demo_global_rate_idx
  ON avr_public_demo_call_events(demo_slug, created_at DESC);
