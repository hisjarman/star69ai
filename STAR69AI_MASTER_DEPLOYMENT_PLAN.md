# Star69AI Master SaaS Deployment & Operations Plan

**Status:** Baseline audit in progress — 2026-11-20  
**Repository:** `hisjarman/star69ai`  
**Production domain:** `star69ai.com`  
**Owner:** Founder / operator  
**Change control:** This document governs architecture, security, compliance, operations and release readiness. It does not authorize production changes.

## 1. Mission and operating standard

Operate Star69AI as a managed, multi-tenant SaaS communications service. The target standard is disciplined corporate infrastructure deployment: documented architecture, least privilege, layered security, change control, monitoring, tested recovery, privacy governance and evidence-based release gates.

A source file, configured binding, provider dashboard, migration or marketing claim is not proof of production operation. Every control must be labelled:
- **Source present** — code or configuration exists in the repository.
- **Configured in provider** — current provider configuration confirms it.
- **Deployed** — the intended version is active in production.
- **Tested** — a repeatable test has passed.
- **Verified end to end** — the complete real workflow has passed.
- **Not verified / planned / blocked** — evidence is missing or a dependency remains.

No certification or legal compliance claim may be made from this plan.

## 2. Governing architecture (preserve)

| Layer | Current selected service | Responsibility |
|---|---|---|
| Public site and portals | GitHub Pages, repository root | Static public website, customer, admin and partner frontends |
| DNS / edge | Cloudflare zone for star69ai.com | DNS, TLS, proxy, WAF, DDoS and edge controls |
| Application/API | Cloudflare Workers | Business logic, authorization, integrations, webhooks |
| Data | Cloudflare D1 database avr-trust-lab | Tenant-scoped business, call, billing, support and audit records |
| Identity | Clerk production custom domain | Authentication; Worker must independently authorize every request |
| Voice / telephony | Retell AI | Voice agents, numbers, inbound events, transcripts and analysis |
| Payments | Stripe | Subscription checkout, lifecycle and customer portal |
| Setup / prepaid payments | PayPal | Separately authorized setup and prepaid transactions |
| Transactional email | Resend | Transactional and approved marketing email |
| Public demo intake | Worker-first with Formspree fallback | Prospect intake and manual-review fallback |

Do not introduce Render, Manus or a replacement platform. Do not change production architecture without a demonstrated need and founder approval.

### Current provider inventory observed on 2026-11-20

- Cloudflare zone `star69ai.com`: active, unpaused; web A/CNAME records are proxied.
- DNS includes GitHub Pages apex A records and `www` CNAME; Clerk custom-domain records are DNS-only; Worker-backed `api`, `trust` and `concierge` hostnames exist.
- TLS mode is Full; Always Use HTTPS and Automatic HTTPS Rewrites are on.
- Cloudflare managed L7 DDoS ruleset and Managed Free Ruleset are present; a custom scanner-protection rule blocks common secret/CMS/server-probe paths.
- Three Workers are listed: `avr-platform-api`, `avr-trust-lab-api`, `star69ai-concierge`.
- D1 database `avr-trust-lab` is live and contains platform, billing, call, Call Shield, support, partner, checkout-evidence and security-event tables.
- Worker bindings include D1, Clerk, Stripe, PayPal, Retell, Resend, Turnstile and two Cloudflare Rate Limiter bindings on the platform Worker. Do not expose or copy secret values into documentation.
- The platform source includes Clerk JWT verification, verified-email enforcement, admin email allow-listing, customer account linking, webhook signature verification, Turnstile checkout verification, customer-scoped call reads, security telemetry and Call Shield screening.
- Call Shield hashes caller identity with HMAC scoped to customer and dialed number, tracks repeated attempts and can reject bursts. Current source fails open if screening errors; this must be an explicit, tested risk decision rather than an assumed guarantee.

These observations are snapshots, not a complete configuration export or proof of every route's deployment.

## 3. Initial audit findings and priority

| Priority | Finding | Evidence / impact | Required action |
|---|---|---|---|
| P0 | Cloudflare minimum TLS version is 1.0 | Provider setting currently reports 1.0; weak legacy protocol exposure | Test clients and integrations, then raise to TLS 1.2 minimum; verify all hostnames |
| P0 | Account-wide 2FA enforcement is off | Cloudflare account setting `enforce_twofactor=false`; does not prove individual users lack 2FA | Enable enforcement after confirming recovery methods and all authorized users |
| P1 | Dedicated zone rate-limit ruleset entrypoint not found | `http_ratelimit` entrypoint returned not found; Worker has Rate Limiter bindings, but current source does not reference their binding names | Implement and test per-route API throttles; separately decide Cloudflare edge rate-limit rules |
| P1 | DMARC policy is monitoring-only | DNS currently publishes `p=none`; SPF record is registrar-forwarding oriented | Validate all senders, SPF/DKIM/DMARC alignment and reports; progress policy safely to quarantine/reject |
| P1 | Bot controls need explicit verification | Managed WAF and DDoS are present; Bot Fight Mode setting queried was not a recognized zone setting | Identify available plan features and configure appropriate bot mitigation / Turnstile coverage |
| P1 | Call Shield failure mode is fail-open | Screening exception returns allowed; abuse protection can be bypassed during D1/key/runtime failure | Define customer-visible degraded mode, alerting, fallback limits and tested failure behavior |
| P1 | Security telemetry has limited scope | Worker records selected rejected requests; its own endpoint states edge blocks and GitHub Pages requests are excluded | Add edge analytics/logging and correlate request IDs; define alert thresholds and retention |
| P1 | Deployment/release protection evidence incomplete | All sampled branches are unprotected; main protection endpoint was inaccessible to current GitHub integration (403) | Verify branch protection/rulesets in GitHub UI/API with owner; require PR + CI before merge |
| P2 | Worker operational observability incomplete | Worker list reports Logpush disabled and no tail consumers | Decide structured logs, alerting, retention and cost-appropriate export |
| P2 | Data recovery configuration not verified | D1 is live; backup/restore settings and restore test not yet evidenced | Confirm Time Travel/backup retention, export strategy and perform isolated restore exercise |

Do not mark a finding resolved until the provider setting or live behavior has been rechecked and recorded.

## 4. Workstreams and sequence

### Phase 0 — Audit and asset inventory
- Inventory every hostname, DNS record, Worker, route/custom domain, binding, D1 table/index/trigger, migration, webhook, third-party app and repository workflow.
- Compare production Worker versions with repository source and deployment notes.
- Map data flows and data classifications, including caller audio, transcripts, recordings, phone numbers, billing, support and prospect data.
- Create an evidence register and risk register.
**Exit:** asset inventory reconciled; unknowns clearly assigned.

### Phase 1 — Identity, account and perimeter hardening
- Enforce MFA for GitHub, Cloudflare, Clerk admin, Stripe, PayPal, Retell, Resend and registrar accounts; use unique credentials and recovery codes.
- Separate owner/admin/operator roles; least-privilege provider API tokens; remove stale access.
- Raise TLS minimum to 1.2 after compatibility validation; verify Full (strict) origin posture where applicable, HSTS strategy, HTTPS redirects and certificate renewal.
- Review Cloudflare WAF managed rules, custom rules, DDoS, bot controls, rate limiting, API Shield options and origin exposure.
- Confirm DNS proxy state per record; protect mail/auth records from accidental proxying.
**Exit:** approved edge baseline, tested auth, MFA and account recovery evidence.

### Phase 2 — Application/API security
- Enforce authentication and server-side authorization on every protected route.
- Verify customer tenant scope on every read, write, export, email, recording, support and billing operation.
- Add route-specific rate limiting using actual configured bindings or edge controls; include IP, account, customer and action-based quotas as appropriate.
- Apply request size limits, schema validation, safe error responses, origin checks and CSRF protection where cookie credentials are used.
- Validate webhook signatures, timestamps, event IDs, replay behavior and idempotency under concurrent duplicate delivery.
- Store secrets only in provider secret stores; rotate exposed or aged credentials.
- Add dependency, secret and static security scanning to CI.
**Exit:** negative authorization tests, abuse tests and webhook replay tests pass.

### Phase 3 — Telephony and Call Shield
- Document inbound call sequence: carrier/Retell → signed inbound webhook → number/customer mapping → subscription entitlement → Call Shield → usage reservation → agent override/routing.
- Validate caller ID normalization, HMAC key management, per-tenant/per-line isolation, duplicate event handling, concurrent burst behavior and data retention.
- Add fraud signals: rapid call velocity, repeated failed calls, unusual geography/patterns, premium-rate/toll abuse, international destination controls and spend caps where provider capabilities allow.
- Separate caller-risk scoring from automatic blocking; minimize false positives and preserve legitimate/private caller handling.
- Define fail-open/fail-closed policy per failure type, including D1 unavailable, missing HMAC secret, provider outage and stale settings.
- Enforce plan limits and the approved 75% overage cap server-side before calls are accepted; reservations must handle concurrent calls.
- Record customer configuration, notice, appeal/review and override audit history.
**Exit:** scripted legitimate/spam/fraud/failure scenarios pass; no unapproved live call behavior changes.

### Phase 4 — Billing, metering and revenue integrity
- Reconcile Stripe invoices, subscription state, webhook events, minute ledger, call reservations, Minute Vault, PayPal orders and partner commissions.
- Test idempotency, out-of-order webhooks, duplicate events, partial payments, refunds, disputes, failed invoices, cancellations and plan changes.
- Distinguish estimated usage from finalized billable usage.
- Verify the 75% overage cap, active-call maximum duration and new-call rejection under concurrent load.
- Ensure commissions use actual qualifying subscription revenue collected after discounts; exclude setup fees, add-ons unless approved, refunds and uncollected amounts.
- Keep demo creation, payment, provisioning, number purchase/assignment and production activation as separate authorized transitions.
**Exit:** financial reconciliation test suite and controlled end-to-end payment tests pass.

### Phase 5 — Privacy, compliance and legal operations
- Establish target jurisdictions, customer industries, call origin/destination mix and service role (controller/business vs processor/service provider).
- Complete data inventory, purpose/legal basis, retention schedule, subprocessors, transfer map, deletion/export workflow and incident/breach process.
- Review recording/transcription notices and consent by jurisdiction; SMS and outbound voice/text permissions; suppression and revocation.
- Review TCPA/FCC/FTC, CAN-SPAM, state recording laws, state privacy laws, applicable international privacy rules, PCI DSS scope, accessibility and AI disclosure obligations with qualified counsel.
- Execute vendor DPAs and review subprocessors/security terms for Clerk, Cloudflare, Retell, Stripe, PayPal and Resend.
- Do not handle payment card data, PHI or other regulated sensitive data unless a separate approved scope, contract and controls exist.
**Exit:** counsel-reviewed applicability matrix, approved contracts/notices and operational evidence.

### Phase 6 — Data, resilience and disaster recovery
- Establish D1 backup/Time Travel retention, scheduled exports where appropriate, encryption/access controls and tested restore.
- Define RPO/RTO for website, API, identity, telephony, billing and customer data.
- Document rollback for Pages, Workers, D1 migrations and external integrations.
- Maintain provider outage runbooks, emergency call-routing/disable procedures, customer communication templates and status process.
- Test recovery in an isolated database/environment.
**Exit:** restore and rollback exercises recorded with measured RPO/RTO.

### Phase 7 — Monitoring, incident response and support
- Centralize structured security, application, webhook, billing, telephony and edge events with correlation IDs.
- Alert on admin login failures, tenant authorization denials, unusual API volume, webhook failures, D1 errors, Call Shield fail-open, call spikes, usage caps, billing anomalies and provider outages.
- Define severity, owner, escalation, containment, evidence preservation and customer notification.
- Establish support SLAs, ticket classification, change approval and post-incident review.
**Exit:** alert drills and incident tabletop completed.

### Phase 8 — QA, release and controlled launch
- Run unit, integration, end-to-end, authorization, tenant-isolation, load/abuse, accessibility, mobile and regression tests.
- Require a reviewed PR, green CI, migration plan, rollback, release notes and production smoke tests.
- Deploy Workers and GitHub Pages separately; apply D1 migrations explicitly and verify target database.
- Keep production activation and billing changes behind explicit approval.
**Exit:** signed release evidence and owner approval.

## 5. Mandatory security control catalogue

- Identity: MFA, SSO where appropriate, session expiry/revocation, verified email, privileged role controls.
- Authorization: server-side RBAC/ABAC, tenant scoping, object-level checks, least privilege.
- Edge/network: TLS 1.2+, HTTPS, WAF, DDoS, bot controls, rate limiting, origin protection, DNS hygiene.
- Application: OWASP ASVS-aligned controls, input validation, output encoding, SSRF/XSS/CSRF/SQLi protections, secure headers, dependency scanning.
- API: per-route quotas, request limits, idempotency, safe errors, versioning and abuse monitoring.
- Webhooks: signature, timestamp tolerance, replay defense, deduplication, retry-safe state transitions.
- Telephony: fraud controls, spend caps, call velocity, number/agent ownership, emergency disable and usage enforcement.
- Data: classification, minimization, encryption in transit/at rest by provider, access logging, retention/deletion and restore.
- Secrets: secret manager only, narrow scopes, rotation, no client exposure, no logs or commits.
- Operations: audit trails, monitoring, incident response, vulnerability management, backups and recovery.
- Governance: vendor inventory, DPAs, customer agreements, privacy notices, security review and evidence.

## 6. Required release gates

A release is blocked if any critical gate fails:
1. Scope and architecture reviewed.
2. Threat/data-flow impact assessed.
3. Authentication and authorization tested.
4. Cross-tenant negative tests passed.
5. Input, output, rate and abuse controls tested.
6. Webhook and payment idempotency tested where relevant.
7. Privacy/consent/retention impact reviewed.
8. Migration, backup and rollback prepared.
9. CI, syntax, integration and regression tests passed.
10. Production smoke test and monitoring confirmed.
11. Handoff and evidence register updated.
12. Founder approval obtained before merging into main or changing production behavior.

## 7. Change authority and prohibited actions

This plan does not authorize:
- merging to `main`;
- switching production traffic or changing DNS;
- applying production migrations;
- changing production Worker secrets/settings;
- enabling paid Cloudflare features or new paid vendors;
- changing live customer plans, prompts, agents, phone numbers or routing;
- sending marketing campaigns or initiating outbound calls;
- claiming certification or legal compliance.

Such actions require a reviewed change proposal and explicit authorization where applicable.

## 8. Immediate next actions

1. Finish read-only inventory of Cloudflare routes, settings, rulesets, D1 migrations and backups.
2. Finish source review of platform, Trust Lab and concierge Worker entrypoints and all public write endpoints.
3. Reconcile repository source with deployed Worker versions.
4. Produce testable P0/P1 remediation issues.
5. Complete this plan's evidence register and open a review PR; do not merge.
