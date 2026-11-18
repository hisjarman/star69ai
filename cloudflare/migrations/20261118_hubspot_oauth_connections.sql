-- Tenant-isolated OAuth state and encrypted provider connections.
CREATE TABLE IF NOT EXISTS avr_oauth_states (
  id TEXT PRIMARY KEY,
  state_hash TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL REFERENCES avr_customers(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  redirect_uri TEXT NOT NULL,
  scopes_json TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS avr_oauth_states_expiry_idx ON avr_oauth_states(expires_at);
CREATE TABLE IF NOT EXISTS avr_provider_connections (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES avr_customers(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  provider_account_name TEXT,
  scopes_json TEXT NOT NULL DEFAULT '[]',
  access_token_ciphertext TEXT NOT NULL,
  refresh_token_ciphertext TEXT NOT NULL,
  access_token_expires_at INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'connected' CHECK(status IN ('connected','reauthorization_required','disconnected')),
  connected_at TEXT NOT NULL,
  last_used_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(customer_id,provider)
);
CREATE INDEX IF NOT EXISTS avr_provider_connections_provider_idx ON avr_provider_connections(provider,status);
CREATE TABLE IF NOT EXISTS avr_provider_sync_jobs (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES avr_customers(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payload_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
