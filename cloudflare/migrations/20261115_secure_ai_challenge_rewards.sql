-- Secure, account-bound AI Challenge completion and reward redemption.
CREATE TABLE IF NOT EXISTS avr_challenge_attempts (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  clerk_user_id TEXT NOT NULL,
  level_key TEXT NOT NULL CHECK(level_key IN ('beginner','pro','expert')),
  question_set_json TEXT NOT NULL,
  answers_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK(status IN ('in_progress','completed','expired')),
  expires_at TEXT NOT NULL,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(customer_id) REFERENCES avr_customers(id)
);
CREATE INDEX IF NOT EXISTS idx_avr_challenge_attempts_customer
  ON avr_challenge_attempts(customer_id, level_key, status);
CREATE TABLE IF NOT EXISTS avr_challenge_rewards (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  clerk_user_id TEXT NOT NULL,
  level_key TEXT NOT NULL CHECK(level_key IN ('beginner','pro','expert')),
  discount_percent INTEGER NOT NULL CHECK(discount_percent IN (5,10,15)),
  stripe_coupon_id TEXT,
  stripe_promotion_code_id TEXT,
  status TEXT NOT NULL DEFAULT 'earned' CHECK(status IN ('earned','reserved','redeemed','expired')),
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  redeemed_at TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(customer_id, level_key),
  FOREIGN KEY(customer_id) REFERENCES avr_customers(id)
);
CREATE INDEX IF NOT EXISTS idx_avr_challenge_rewards_customer
  ON avr_challenge_rewards(customer_id, status);
