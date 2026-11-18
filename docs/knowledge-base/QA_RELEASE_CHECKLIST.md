# Star69AI QA & Release Checklist

**Audience:** Developers, operators and AI coding assistants.  
**Review date:** 2026-11-18.

## A. Before changing code

- [ ] Read current Project Handoff and Master Development Directive.
- [ ] Inspect current main, relevant branches, open PRs and recent commits.
- [ ] Inspect affected frontend, Worker routes, D1 schema/migrations and deployed bindings.
- [ ] Identify customer claims and legal copy affected.
- [ ] Create a focused branch from current main.
- [ ] Preserve approved behavior and design locks.

## B. Public site and discovery

- [ ] Desktop, mobile and narrow-screen layout.
- [ ] Keyboard navigation, focus visibility, labels and accessible errors.
- [ ] Navigation, canonical URLs, sitemap and metadata.
- [ ] Discovery form frontend validation matches Worker validation.
- [ ] Worker success, validation failure, timeout and Formspree fallback paths.
- [ ] Duplicate submissions and manual-review queue behavior.
- [ ] Privacy acknowledgment matches actual processing.
- [ ] No secrets or private prospect data in browser code/logs.

## C. Demo and onboarding

- [ ] Prospect record is scoped and linked to source.
- [ ] Missing required details are explained without losing valid answers.
- [ ] Demo agent creation is idempotent.
- [ ] Demo and production numbers are distinguished.
- [ ] Simulated integrations are labelled.
- [ ] Test scenarios and critical pass/fail criteria are recorded.
- [ ] Demo approval is explicit.
- [ ] Payment verified using provider-confirmed events.
- [ ] Setup payment separate from subscription.
- [ ] Production number assignment and activation require separate authorization.
- [ ] External inbound test call verifies greeting, capture, transfer and fallback.

## D. Customer portal and tenant isolation

- [ ] Clerk sign-in/out work.
- [ ] Backend verifies token and customer association.
- [ ] Customer A cannot read, mutate or export Customer B's data.
- [ ] Calls, recordings, transcripts, lead details, billing and support are permission-scoped.
- [ ] Read-only settings are enforced server-side.
- [ ] Status labels distinguish pending, active, failed, unavailable and not configured.
- [ ] Usage and Vault values are server-calculated and reconcile to source records.
- [ ] Knowledge center matches actual portal controls.

## E. Intelligence Engine

- [ ] Workers AI binding AI exists in target environment.
- [ ] Model/configuration status reflects Workers AI, not obsolete OpenAI settings.
- [ ] Retell webhook validation and event deduplication work.
- [ ] Real call_analyzed event persists the call and exactly one intelligence result.
- [ ] AI failure leaves a recoverable pending/failed state and can be retried.
- [ ] AI output is schema-validated and safely rendered.
- [ ] Lead/outcome assessments are labelled as AI assessments.
- [ ] Large prompts are not silently truncated; failure or patch strategy is tested.
- [ ] Candidate prompt runs customer-specific scenarios.
- [ ] Critical safety failures block publication.
- [ ] Authorized human approval is recorded.
- [ ] Version history and rollback are tested.
- [ ] Live Retell agent changes only after explicit authorization and successful tests.

## F. Billing, payments and partners

- [ ] Stripe checkout and signed webhooks tested in test mode.
- [ ] PayPal setup and prepaid payments verified against provider transaction records.
- [ ] Customer entitlement matches paid order.
- [ ] Discounts, dates, eligibility and exclusions enforced server-side.
- [ ] Secret Mission coupon secret and Stripe coupon verified before reward is advertised.
- [ ] Minute Vault matches 50% bank, FIFO use and cancellation rules.
- [ ] 75% overage ceiling cannot be bypassed, including concurrent calls.
- [ ] Overage authorization, invoice creation, payment failure and call-stop behavior tested.
- [ ] Partner attribution persists through checkout and qualifying payment.
- [ ] Commission uses actual collected eligible subscription amount after customer discount.
- [ ] Setup fee and uncollected amounts excluded.
- [ ] Validation hold, minimum payout and payout reference enforced.

## G. Worker deployment and D1

- [ ] Review Worker diff and compatibility date.
- [ ] Confirm required bindings/secrets by name without exposing values.
- [ ] Review migration SQL and rollback/backup plan.
- [ ] Apply migrations to intended database only.
- [ ] Confirm Worker-to-database binding points to intended database.
- [ ] Deploy intended Worker and inspect version/traffic.
- [ ] Run health checks and API smoke tests.
- [ ] Confirm CORS and allowed origins.
- [ ] Logs contain no secrets or unnecessary personal data.

## H. Release and handoff

- [ ] Run available syntax/lint/build checks.
- [ ] Test affected journeys on desktop and mobile.
- [ ] Record evidence and untested items.
- [ ] Update knowledge base and Project Handoff.
- [ ] Open PR with scope, risks, migration/deployment instructions and founder actions.
- [ ] Do not merge to main without founder's explicit approval.
- [ ] Do not say “deployed” until target platform confirms deployment.
- [ ] Do not say “working end to end” until complete real workflow passes.
