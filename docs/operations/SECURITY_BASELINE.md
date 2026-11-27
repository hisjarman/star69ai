# Star69AI Security Baseline

**Status:** Initial baseline from read-only repository/provider inspection — 2026-11-20. Not a certification.

## Baseline principles
- Default deny for protected routes; authenticate and authorize server-side.
- Tenant identity is derived from the verified session and server-side customer mapping, never trusted from browser-supplied customer IDs.
- Least privilege for people, API tokens, Workers bindings and vendor accounts.
- Defense in depth: Cloudflare edge controls plus application-level authorization and throttling.
- Minimize personal data; never log secrets, raw call content or unnecessary caller identifiers.
- Security controls must fail in an explicitly documented way and produce observable events.

## Observed controls
- Platform Worker source verifies Clerk RS256 JWT signatures, issuer, expiry/not-before, authorized party when present, verified primary email, and admin allow-list membership.
- Client customer lookup is based on Clerk user ID, with guarded email-based initial linking.
- Client call retrieval and call-email operations constrain the query by the authenticated customer's ID.
- Platform CORS allow-list is configured for the production apex and www hostnames; preflight and response headers are explicit.
- Checkout requires explicit acknowledgements and a server-verified Cloudflare Turnstile token with action and hostname checks.
- Stripe webhook signature timestamp and HMAC validation; Retell webhook signature validation; webhook event identifiers are stored for deduplication.
- Security event table stores selected rejected request metadata and is pruned to 30 days by application code.
- Cloudflare managed DDoS and Managed Free WAF rulesets are present; custom scanner-protection rule blocks common sensitive-file/CMS/server probe paths.
- Web DNS records for apex/www and Worker hostnames are proxied. Clerk auth records remain DNS-only.
- Call Shield uses HMAC caller fingerprints scoped to customer and dialed line, stores no raw caller numbers in its dedicated state/event tables, and applies repeated-attempt thresholds.

## Verified gaps / remediation
| ID | Severity | Gap | Required control / test |
|---|---|---|---|
| SEC-001 | Critical | Zone minimum TLS is 1.0 | Validate compatibility; set TLS 1.2 minimum; test all hostnames and webhook clients |
| SEC-002 | High | Cloudflare account 2FA enforcement reports false | Confirm owner recovery and all authorized users; enable enforcement |
| SEC-003 | High | Zone rate-limit entrypoint not found; Worker Rate Limiter bindings exist but are not referenced in current platform Worker source | Implement route-specific limits; test bursts, distributed IPs and account-level abuse |
| SEC-004 | High | DMARC is p=none | Audit sender inventory, SPF/DKIM alignment and aggregate reports; progress to quarantine/reject |
| SEC-005 | High | Call Shield screening catches errors and returns allowed | Define and test degraded behavior; alert immediately; consider conservative fallback limits |
| SEC-006 | Medium | Worker security dashboard excludes edge firewall and GitHub Pages events by design | Add edge telemetry and correlate with Worker security events |
| SEC-007 | Medium | Worker Logpush and tail consumers disabled in provider settings | Decide logging/alerting architecture, retention and cost |
| SEC-008 | Medium | Main branch protection could not be confirmed through current GitHub integration (API returned 403) | Owner verifies rulesets/branch protection in GitHub; require PR and CI |
| SEC-009 | Medium | No zone HTTP rate-limit entrypoint was found | Determine available plan features and create edge limits if supported |

## Required controls before paid production scale
- MFA for all privileged vendor accounts; unique credentials and documented recovery.
- Restrict Cloudflare/GitHub/Stripe/PayPal/Retell/Resend access; review tokens and rotate on personnel changes.
- Enforce TLS 1.2+, HTTPS, secure cookies where applicable, CSP and security headers.
- Rate limit every unauthenticated write endpoint, login-adjacent endpoint, webhook and expensive AI/telephony action.
- Apply strict object-level tenant checks to all reads, writes, exports, emails and recordings.
- Add security tests for IDOR, role escalation, session replay, CSRF, XSS, injection, webhook replay and race conditions.
- Validate webhook signatures with provider-supported constant-time comparison and idempotent atomic event processing.
- Protect secrets via Worker secrets; never expose secret values to clients, logs, issues or docs.
- Establish data retention/deletion, encryption, access audit and backup restore procedures.
- Alert on failed auth, admin access, unusual traffic, tenant denials, D1 errors, webhook failures, call spikes, Call Shield fail-open and billing anomalies.

## Call Shield policy requirements
- Separate spam/abuse signals from definitive caller identity.
- Do not block withheld/private numbers solely because caller ID is unavailable.
- Make thresholds configurable within safe server-side bounds.
- Scope fingerprints to tenant and dialed number; protect HMAC key rotation.
- Prevent duplicate events and concurrent counter races.
- Provide review/override history and customer-facing explanation.
- Test false positives and emergency/legitimate repeat-caller scenarios.
- Treat D1 outage, missing key and malformed webhook as explicit degraded states; do not silently claim screening is active.

## Evidence status
Provider settings above were read from the connected Cloudflare account on 2026-11-20. Source controls were inspected in the repository's main branch. This document does not establish live end-to-end testing, full Cloudflare account posture, GitHub branch rules, or external vendor security configuration.
