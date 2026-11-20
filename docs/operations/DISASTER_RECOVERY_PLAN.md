# Star69AI Disaster Recovery & Business Continuity Plan

**Status:** Initial plan; recovery objectives and restore tests not yet verified — 2026-11-20.

## 1. Recovery objectives
Set and approve separate RPO/RTO targets for:
- Public website and static assets.
- Platform API and customer portal.
- D1 customer, call, billing and audit records.
- Clerk identity.
- Retell agents, phone numbers and routing.
- Stripe/PayPal billing and webhook state.
- Transactional email.
- Trust Lab and concierge services.

Do not publish numeric RPO/RTO until tested and approved.

## 2. Recovery principles
- Preserve production data before any repair.
- Restore into an isolated environment first.
- Never point production Workers at an unverified restored database.
- Reconcile payments and webhook state with provider records before replay.
- Keep call routing and billing fail-safe: do not activate unknown agent/number mappings or permit unmetered usage during recovery.
- Record incident timeline, approvals, evidence and customer communications.

## 3. Failure scenarios and runbooks

### GitHub Pages / repository
1. Freeze releases and identify last known-good commit.
2. Confirm repository, Pages source and custom-domain configuration.
3. Roll back by reviewed commit/branch procedure; do not force-push.
4. Verify CNAME, HTTPS, assets, navigation and forms.
5. Confirm API and portals still point to correct production Worker endpoints.

### Cloudflare Worker
1. Identify affected Worker and last known-good deployment/version.
2. Inspect errors, bindings and routes without exposing secret values.
3. Restore previous known-good version through controlled deployment.
4. Run health, auth, customer isolation, webhook and telephony smoke tests.
5. Confirm rollback did not break D1 schema compatibility.

### D1 database
1. Stop risky writes or affected workflows if integrity is uncertain.
2. Confirm database identity and current migration/version state.
3. Review Cloudflare D1 Time Travel/backup availability and retention.
4. Restore to a separate database or supported recovery point first.
5. Validate schema, row counts, constraints, indexes and key business invariants.
6. Reconcile call events, subscriptions, invoices, payments, commissions and usage reservations with provider records.
7. Obtain explicit approval before production cutover.

### Clerk / identity
1. Confirm provider incident and domain configuration.
2. Do not bypass authentication or weaken authorization.
3. Restore known-good Clerk domain/configuration and verify session issuer/JWKS.
4. Test verified email, admin allow-list and customer linking.

### Retell / telephony
1. Determine whether issue is provider, webhook, agent, number or routing-specific.
2. Disable only affected agent/number using an authorized emergency procedure.
3. Use customer-approved fallback/forwarding where configured.
4. Do not purchase, reassign or activate a number during incident without authorization.
5. Verify inbound test call, AI disclosure, handoff and call recording policy before re-enable.

### Stripe / PayPal
1. Stop manual billing changes until provider state is reconciled.
2. Retrieve provider event/payment/invoice records.
3. Replay only verified events through idempotent handling.
4. Reconcile customer entitlements, overage ledger, refunds, disputes and commissions.
5. Never mark payment paid from browser redirects or screenshots alone.

### Email / messaging
1. Pause affected sending workflow if authentication, suppression or delivery state is uncertain.
2. Preserve unsubscribe/suppression records.
3. Verify sender domain and provider status.
4. Send transactional recovery notice only after audience and content are validated.

## 4. Backups and recovery evidence
- Confirm D1 Time Travel and backup retention, export access and limits.
- Maintain versioned schema/migration artifacts in Git.
- Keep a documented export procedure with access restricted to authorized operators.
- Store backup metadata and integrity hashes without exposing customer data.
- Run periodic isolated restore tests; record duration, recovered timestamp, schema version and reconciliation results.
- Define retention and secure disposal of exported backups.

## 5. Incident response
1. Detect and classify severity.
2. Assign incident commander and technical owner.
3. Contain the affected system while preserving evidence.
4. Determine data, customers, calls, payments and services affected.
5. Notify counsel, providers, insurer and affected customers as required.
6. Recover from verified state.
7. Validate controls and monitor after recovery.
8. Complete root-cause analysis and corrective actions.

## 6. Required tabletop exercises
- D1 accidental migration / corrupted data.
- Worker secret rotation or leaked credential.
- Clerk outage or compromised admin account.
- Retell webhook outage / call routing failure.
- Stripe duplicate/out-of-order webhook.
- Call Shield D1 outage / fail-open event.
- Cloudflare DNS/TLS/WAF misconfiguration.
- Customer data access incident.

**Current limitation:** no production restore or rollback exercise is claimed by this document.
