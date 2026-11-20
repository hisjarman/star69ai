# Star69AI Production Readiness Checklist

**Status:** Audit baseline; no blanket production-readiness approval — 2026-11-20.

Use evidence links, test IDs, timestamps and operator initials for every checked item. A check is not complete because code exists.

## A. Governance and architecture
- [ ] Current architecture and asset inventory reconciled.
- [ ] Current project handoff and master directive reviewed.
- [ ] Data-flow map and data classification completed.
- [ ] Production and staging/test environments distinguished.
- [ ] Provider owners, permissions and emergency contacts recorded.
- [ ] Third-party vendor and subprocessor register current.

## B. Account and perimeter security
- [ ] MFA enforced for GitHub, Cloudflare, Clerk admin, Stripe, PayPal, Retell, Resend and registrar.
- [ ] Least-privilege access and token scopes reviewed.
- [ ] Cloudflare account 2FA enforcement enabled and verified.
- [ ] Minimum TLS 1.2 tested across all hostnames.
- [ ] HTTPS redirect, certificate, HSTS and origin mode verified.
- [ ] WAF managed/custom rules reviewed and tested.
- [ ] DDoS protections confirmed.
- [ ] Bot controls and Turnstile coverage reviewed.
- [ ] Edge and Worker rate limits configured and load-tested.
- [ ] DNS records, proxy state and origin exposure reviewed.
- [ ] SPF, DKIM and DMARC alignment verified; DMARC policy progressed safely.

## C. Identity and application security
- [ ] Clerk issuer, JWKS, authorized party, session expiry and verified email tested.
- [ ] Admin MFA and role allow-list tested.
- [ ] Every protected API route has server-side authorization.
- [ ] Customer A cannot read/write/export/email Customer B's data.
- [ ] CSRF, XSS, injection, SSRF, IDOR and privilege escalation tests passed.
- [ ] Request schemas, body limits, safe errors and content types verified.
- [ ] API abuse throttles tested on unauthenticated and authenticated routes.
- [ ] Secrets are provider-managed, rotated and absent from source/logs.
- [ ] Dependency and secret scanning run in CI.

## D. Telephony and Call Shield
- [ ] Retell signatures and timestamp/replay controls verified.
- [ ] Inbound call number-to-customer-to-agent mapping tested.
- [ ] Inactive/suspended accounts reject calls.
- [ ] Call Shield legitimate, burst, repeat, private-number and false-positive tests passed.
- [ ] Concurrent call attempts cannot bypass thresholds or usage reservations.
- [ ] D1 outage / missing secret degraded behavior documented and alerted.
- [ ] Toll fraud, destination restrictions, spend ceilings and unusual usage alerts reviewed.
- [ ] Emergency/human escalation and fallback verified.
- [ ] Recording/transcription notice and consent confirmed per applicable jurisdiction.
- [ ] 75% overage cap enforced under concurrent calls and active-call duration tests.

## E. Billing and partner accounting
- [ ] Stripe signature, webhook deduplication, replay and concurrency tests passed.
- [ ] PayPal order/capture verified against provider records.
- [ ] Checkout consent evidence is append-only and complete.
- [ ] Plan entitlements match confirmed paid state.
- [ ] Usage ledger reconciles to call records.
- [ ] Overage and Minute Vault calculations reconcile.
- [ ] Failed payment, cancellation, refund, dispute and plan-change cases tested.
- [ ] Partner attribution and commission calculations reconcile to collected eligible subscription amounts.
- [ ] Setup fees and uncollected amounts excluded from commissions.
- [ ] Billing estimates clearly distinguished from final charges.

## F. Privacy and compliance
- [ ] Jurisdiction applicability reviewed by qualified counsel.
- [ ] Privacy notice matches actual processing and vendors.
- [ ] Recording/transcription notice and consent flow approved.
- [ ] SMS/outbound voice consent and suppression process approved.
- [ ] Data retention, export, correction and deletion tested.
- [ ] Vendor DPAs and subprocessor terms reviewed.
- [ ] Sensitive regulated data excluded unless separately approved.
- [ ] Customer terms, renewal, cancellation, setup fee and overage disclosures accurate.
- [ ] Marketing ad disclosure, postal address and unsubscribe tested.
- [ ] Accessibility checks completed.

## G. Monitoring and resilience
- [ ] Worker, edge, auth, billing, webhook and telephony logs correlated.
- [ ] Alerts for auth abuse, tenant denial, rate limit, provider errors and D1 failures.
- [ ] Call Shield fail-open and billing anomalies alert.
- [ ] Security event coverage limitations documented.
- [ ] D1 backup/Time Travel retention verified.
- [ ] Isolated D1 restore test passed.
- [ ] Worker and Pages rollback tested.
- [ ] RPO/RTO approved from measured recovery.
- [ ] Incident response and customer communication runbooks rehearsed.

## H. Release and launch
- [ ] PR reviewed and all required CI checks pass.
- [ ] Unit, integration, e2e, negative authorization and regression tests pass.
- [ ] D1 migration reviewed, backed up and applied to intended database.
- [ ] Worker bindings and deployment version verified.
- [ ] GitHub Pages deployment verified.
- [ ] External test calls and billing test transactions verified.
- [ ] Monitoring is active during release.
- [ ] Rollback owner and procedure available.
- [ ] Founder explicitly approves production release.
- [ ] No unverified capability is advertised as live.

## Evidence register template

| Control / test ID | Environment | Evidence / link | Result | Date | Owner | Follow-up |
|---|---|---|---|---|---|---|
| Example: TENANT-001 | Staging | Link to test output | Not run | — | — | Create two test tenants |

**Release rule:** Any critical failure or unverified tenant-isolation, authorization, billing, telephony-fraud, consent or recovery control blocks onboarding or expansion until risk is accepted in writing by the founder with a remediation date.
