# Star69AI AI Assistant Working Context

**Audience:** ChatGPT, coding agents, future AI assistants, contractors and developers.  
**Review date:** 2026-11-18.  
**Owner:** Founder / operator.

## Mission and business model

Star69AI is a managed, done-for-you AI receptionist service for local-service businesses. It is not a DIY voice-agent platform. Star69AI configures, customizes, tests, deploys and maintains the customer's receptionist. The customer's approved business information, operating rules and human escalation contacts remain authoritative.

Brand: **Star69AI**. Tagline: **Communications, Evolved.** Founder: Solomon Jarman. Follow the official brand vocabulary in the Brand Language Guide.

## Architecture — preserve it

- Repository: hisjarman/star69ai.
- Public website and portal frontends: GitHub Pages, repository root.
- Backend: Cloudflare Workers.
- Database: Cloudflare D1.
- Authentication: Clerk, with authorization enforced by backend APIs.
- Voice agent and telephony: Retell integration.
- Subscription checkout and customer billing: Stripe.
- Setup-fee and prepaid payment flows: PayPal.
- Transactional email: Resend where configured.
- Public discovery form: existing Formspree endpoint, https://formspree.io/f/mrppjqdb, with Worker-first processing and manual-review fallback as implemented.
- Production Workers inspected: avr-platform-api, avr-trust-lab-api, star69ai-concierge.
- Main platform Worker uses a D1 binding and Workers AI binding named AI. Default Intelligence model in source is @cf/zai-org/glm-4.7-flash, overridable with INTELLIGENCE_MODEL.

Do not introduce Render, Manus or obsolete deployment paths. Do not replace Clerk, Retell, Stripe, GitHub Pages or Cloudflare without demonstrated technical need and explicit approval.

## Non-negotiable development workflow

1. Read project-context/PROJECT_HANDOFF.md and this knowledge base.
2. Inspect current main, relevant branches, recent commits and PRs before editing.
3. Inspect affected frontend, Worker routes, D1 schema/migrations and deployed bindings.
4. Identify current implementation; inspect history/branches if prior work may be reusable.
5. Create a focused branch from current approved main.
6. Keep changes reviewable. Preserve existing behavior and approved design locks.
7. Test syntax, affected flows and mobile/desktop layouts where relevant.
8. Update handoff and knowledge base when decisions or verified behavior change.
9. Open a PR with scope, evidence, risks and deployment/manual steps.
10. **Never merge into main without the founder's explicit approval.**
11. Never claim a deployment, payment, booking, email, call or AI analysis succeeded unless actually verified.

## Product rules that must not drift

- Managed service, not self-service software.
- Demo creation, demo approval, payment, number assignment and production activation are separate steps.
- A demo or paid account does not prove production phone routing is active.
- Customer data must be tenant-scoped. Never expose another customer's calls, recordings, transcripts, leads, settings or billing.
- Never publish a prompt or change live call behavior without authorized review, scenario tests, required customer approval, version history and rollback.
- Never invent appointment availability, a booking, dispatch, arrival time, diagnosis, quote, warranty, emergency response or revenue.
- AI-assessed lead quality, intent, sentiment and call outcome are not verified sales, bookings or revenue.
- Usage estimates are not invoices or proof of payment.
- Overage is capped at 75% of included plan minutes. Never bypass it.
- Do not promise an add-on, integration or language/voice pairing until compatibility and customer-specific availability are confirmed.
- Never put API keys, secrets or private customer data in code, docs, prompts or public issues.

## Current product baseline — verify before changing

- Monthly plans in current source/docs: Starter $149 / 300 minutes; Growth $249 / 600 minutes; Pro $399 / 1,200 minutes.
- Advertised monthly overage rates: Starter $0.55/minute; Growth $0.45/minute; Pro $0.36/minute.
- Monthly setup fee: $99, separately invoiced by SIMIAPP CLOUD through PayPal. Setup is waived on six- and twelve-month prepaid plans.
- Prepaid terms in current public copy: six months 25% savings; twelve months 35% savings.
- Flex: no monthly fee or included minutes; prepaid PayPal wallet credit; $0.65 per started AI voice minute. New calls should be blocked when credit cannot cover the next minute. Verify production behavior before promising availability.
- Minute Vault: current Worker source banks 50% of unused included minutes from finalized billing periods; current month's allowance is used first; vault lots are consumed oldest-first; no cash value; cancellation forfeits the balance.
- Overage: fixed 75% cap of included plan minutes (Starter 225; Growth 450; Pro 900). Vault minutes do not increase the cap.
- Partner commissions: calculate only from qualifying subscription amounts actually collected after customer discounts, excluding setup fees and uncollected amounts. Confirm current approved tiers and deployed calculation before quoting.
- Secret Mission reward: source expects STAR15MISSION and a Stripe coupon supplied by STRIPE_COUPON_SECRET_MISSION15. The Worker validates 15% off for 12 months on eligible monthly subscriptions. If secret/coupon is not configured and tested, do not tell visitors the reward is redeemable.
- Temporary promotions have expiry dates and server-side eligibility. Inspect current checkout and Worker configuration before publishing or promising them.

## Intelligence Engine — explain accurately

Intended flow: Retell call event → persisted call record → Cloudflare Workers AI analysis → structured findings/recommendations → customer-scoped Mission Control display → controlled proposal and scenario testing → authorized human review → approved release with version history and rollback.

The code includes call analysis and prompt-optimization workbench logic. This does not prove a live customer call completed the full cycle. Confirm production binding, deployed code, D1 migration, webhook delivery, stored intelligence row, tenant isolation and UI display. Treat failed AI analysis as recoverable work, not as a successful report.

Never let the model autonomously change business policies, pricing, appointment availability, emergency escalation, transfer destinations, legal disclosures or the live production prompt.

## How to assist the founder

Be direct, concrete and sequential. Prefer one recommended path and numbered actions. Distinguish code changes from actions requiring provider-account access, consent, legal review, payment configuration or explicit approval. Do not ask the founder to repeat information already in the handoff or project files.

## Source-of-truth links

- [Project handoff](../../project-context/PROJECT_HANDOFF.md)
- [Founder playbook](FOUNDER_OPERATIONS_PLAYBOOK.md)
- [Product truth and claims](PRODUCT_TRUTH_AND_CLAIMS.md)
- [QA and release checklist](QA_RELEASE_CHECKLIST.md)
- [Client service standards](CLIENT_SERVICE_STANDARDS.md)
