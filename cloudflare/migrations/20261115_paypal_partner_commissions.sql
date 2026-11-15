-- Extend partner commission ledger to identify PayPal prepaid-plan receipts separately from Stripe invoices.
ALTER TABLE partner_commissions ADD COLUMN payment_provider TEXT NOT NULL DEFAULT 'stripe' CHECK(payment_provider IN ('stripe','paypal'));
ALTER TABLE partner_commissions ADD COLUMN payment_reference TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS partner_commissions_payment_reference_unique ON partner_commissions(payment_provider,payment_reference) WHERE payment_reference IS NOT NULL;
