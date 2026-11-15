-- Persist selected subscription billing cadence so admin setup-invoice handling
-- can enforce the prepaid setup-fee waiver without trusting browser state.
ALTER TABLE avr_customers
ADD COLUMN billing_cadence TEXT NOT NULL DEFAULT 'monthly'
CHECK (billing_cadence IN ('monthly', 'six_month', 'annual'));
