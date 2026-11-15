-- Star69AI overage policy preferences and period ledger.
-- Apply once to the existing avr-trust-lab D1 database before deploying the matching Worker.
ALTER TABLE avr_customers ADD COLUMN overage_billing_preference TEXT NOT NULL DEFAULT 'pay_month_end'
 CHECK(overage_billing_preference IN ('pay_month_end','carryover'));
ALTER TABLE avr_customers ADD COLUMN overage_carry_in_seconds INTEGER NOT NULL DEFAULT 0
 CHECK(overage_carry_in_seconds >= 0);
ALTER TABLE avr_customers ADD COLUMN overage_coverage_blocked INTEGER NOT NULL DEFAULT 0
 CHECK(overage_coverage_blocked IN (0,1));
ALTER TABLE avr_customers ADD COLUMN overage_blocked_reason TEXT;
ALTER TABLE avr_customers ADD COLUMN current_period_start TEXT;

CREATE TABLE IF NOT EXISTS avr_overage_periods (
 id TEXT PRIMARY KEY,
 customer_id TEXT NOT NULL REFERENCES avr_customers(id),
 period_start TEXT NOT NULL,
 period_end TEXT NOT NULL,
 included_minutes INTEGER NOT NULL CHECK(included_minutes >= 0),
 used_seconds INTEGER NOT NULL DEFAULT 0 CHECK(used_seconds >= 0),
 carry_in_seconds INTEGER NOT NULL DEFAULT 0 CHECK(carry_in_seconds >= 0),
 carry_out_seconds INTEGER NOT NULL DEFAULT 0 CHECK(carry_out_seconds >= 0),
 billable_seconds INTEGER NOT NULL DEFAULT 0 CHECK(billable_seconds >= 0),
 billable_amount_cents INTEGER NOT NULL DEFAULT 0 CHECK(billable_amount_cents >= 0),
 stripe_invoice_id TEXT,
 due_at TEXT,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','invoiced','paid','past_due','void')),
 paid_at TEXT,
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 UNIQUE(customer_id,period_start)
);
CREATE INDEX IF NOT EXISTS avr_overage_periods_due_idx ON avr_overage_periods(status,due_at);
CREATE INDEX IF NOT EXISTS avr_overage_periods_customer_idx ON avr_overage_periods(customer_id,period_start DESC);
