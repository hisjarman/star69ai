-- Per-customer subscription overage authorization and automatic inbound call protection.
-- New and existing customers default to zero authorized overage until an administrator sets a limit.
ALTER TABLE avr_customers
  ADD COLUMN overage_limit_minutes INTEGER NOT NULL DEFAULT 0
  CHECK(overage_limit_minutes >= 0 AND overage_limit_minutes <= 10000);

CREATE TABLE IF NOT EXISTS avr_overage_protection_events (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES avr_customers(id) ON DELETE CASCADE,
  period_key TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK(event_type IN ('warning_50','blocked_75','blocked_no_overage_authorization')),
  overage_minutes INTEGER NOT NULL DEFAULT 0 CHECK(overage_minutes >= 0),
  limit_minutes INTEGER NOT NULL DEFAULT 0 CHECK(limit_minutes >= 0),
  threshold_minutes INTEGER NOT NULL DEFAULT 0 CHECK(threshold_minutes >= 0),
  notification_sent INTEGER NOT NULL DEFAULT 0 CHECK(notification_sent IN (0,1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  notified_at TEXT,
  UNIQUE(customer_id, period_key, event_type)
);
CREATE INDEX IF NOT EXISTS avr_overage_protection_events_customer_idx
  ON avr_overage_protection_events(customer_id, period_key DESC);
