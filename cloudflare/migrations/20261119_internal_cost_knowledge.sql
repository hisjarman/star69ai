-- Private administrator reference data for internal provider costs and pricing research.
-- Catalog contents are seeded directly into the production D1 database and are intentionally
-- not committed to the public repository or exposed in static admin HTML.
CREATE TABLE IF NOT EXISTS avr_internal_cost_knowledge (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_reviewed_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);
