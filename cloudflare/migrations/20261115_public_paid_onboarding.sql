-- Public paid onboarding: setup fee via PayPal, subscription via Stripe, then automatic demo agent + Clerk invitation.
CREATE TABLE IF NOT EXISTS avr_paid_onboardings (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES avr_customers(id),
  demo_request_id TEXT NOT NULL REFERENCES avr_demo_requests(id),
  email TEXT NOT NULL,
  plan_key TEXT NOT NULL CHECK(plan_key IN ('starter','growth','pro')),
  billing_cadence TEXT NOT NULL CHECK(billing_cadence IN ('monthly','six_month','annual')),
  setup_amount_cents INTEGER NOT NULL DEFAULT 0 CHECK(setup_amount_cents >= 0),
  prepaid_amount_cents INTEGER NOT NULL DEFAULT 0 CHECK(prepaid_amount_cents >= 0),
  setup_status TEXT NOT NULL CHECK(setup_status IN ('not_required','pending','paid')),
  paypal_order_id TEXT,
  paypal_order_purpose TEXT NOT NULL CHECK(paypal_order_purpose IN ('setup_fee','prepaid_plan')),
  paypal_capture_id TEXT,
  paypal_attempts INTEGER NOT NULL DEFAULT 0,
  stripe_session_id TEXT,
  stripe_attempts INTEGER NOT NULL DEFAULT 0,
  plan_payment_provider TEXT NOT NULL CHECK(plan_payment_provider IN ('stripe','paypal')),
  plan_payment_status TEXT NOT NULL DEFAULT 'pending' CHECK(plan_payment_status IN ('pending','paid')),
  status TEXT NOT NULL DEFAULT 'awaiting_setup' CHECK(status IN ('awaiting_setup','awaiting_plan_payment','awaiting_subscription','awaiting_provisioning','provisioning','provisioned','provisioning_failed','checkout_failed')),
  demo_approved INTEGER NOT NULL DEFAULT 0 CHECK(demo_approved IN (0,1)),
  public_token_hash TEXT NOT NULL,
  account_delivery_status TEXT,
  clerk_invitation_id TEXT,
  agent_id TEXT,
  llm_id TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(customer_id),
  UNIQUE(demo_request_id)
);
CREATE INDEX IF NOT EXISTS avr_paid_onboardings_status_idx ON avr_paid_onboardings(status,updated_at DESC);
CREATE INDEX IF NOT EXISTS avr_paid_onboardings_email_idx ON avr_paid_onboardings(email,created_at DESC);
