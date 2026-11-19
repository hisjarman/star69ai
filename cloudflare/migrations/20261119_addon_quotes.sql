-- Client-visible written quotes and explicit quote acceptance for custom-work requests.
ALTER TABLE avr_addon_orders ADD COLUMN quote_summary TEXT;
ALTER TABLE avr_addon_orders ADD COLUMN quote_status TEXT NOT NULL DEFAULT 'none' CHECK(quote_status IN ('none','presented','accepted','declined'));
ALTER TABLE avr_addon_orders ADD COLUMN quote_updated_at TEXT;
