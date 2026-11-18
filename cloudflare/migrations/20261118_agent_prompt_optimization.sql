-- Star69AI controlled Retell prompt optimization workbench
CREATE TABLE IF NOT EXISTS avr_agent_prompt_proposals (
 id TEXT PRIMARY KEY,
 customer_id TEXT NOT NULL REFERENCES avr_customers(id) ON DELETE CASCADE,
 agent_id TEXT NOT NULL REFERENCES avr_agents(agent_id) ON DELETE CASCADE,
 source_call_id TEXT REFERENCES avr_calls(call_id) ON DELETE SET NULL,
 source_intelligence_id TEXT REFERENCES avr_call_intelligence(id) ON DELETE SET NULL,
 engine_id TEXT NOT NULL,
 prompt_type TEXT NOT NULL DEFAULT 'general_prompt',
 base_prompt TEXT NOT NULL,
 proposed_prompt TEXT NOT NULL,
 change_summary TEXT NOT NULL DEFAULT '',
 scenarios_json TEXT NOT NULL DEFAULT '[]',
 test_results_json TEXT NOT NULL DEFAULT '[]',
 test_status TEXT NOT NULL DEFAULT 'not_run',
 status TEXT NOT NULL DEFAULT 'draft',
 base_agent_version INTEGER,
 base_engine_version INTEGER,
 published_agent_version INTEGER,
 rollback_prompt TEXT,
 created_by TEXT,
 reviewed_by TEXT,
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 published_at TEXT
);
CREATE INDEX IF NOT EXISTS avr_agent_prompt_proposals_status_idx ON avr_agent_prompt_proposals(status, created_at DESC);
CREATE INDEX IF NOT EXISTS avr_agent_prompt_proposals_agent_idx ON avr_agent_prompt_proposals(agent_id, created_at DESC);
