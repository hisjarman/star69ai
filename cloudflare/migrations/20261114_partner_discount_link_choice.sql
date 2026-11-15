-- Persist the selected partner referral offer through click, lead and customer attribution.
ALTER TABLE partner_clicks ADD COLUMN offer_mode TEXT NOT NULL DEFAULT 'standard' CHECK (offer_mode IN ('standard','discount'));
ALTER TABLE partner_referrals ADD COLUMN offer_mode TEXT NOT NULL DEFAULT 'standard' CHECK (offer_mode IN ('standard','discount'));
ALTER TABLE avr_customers ADD COLUMN affiliate_offer_mode TEXT NOT NULL DEFAULT 'standard' CHECK (affiliate_offer_mode IN ('standard','discount'));
