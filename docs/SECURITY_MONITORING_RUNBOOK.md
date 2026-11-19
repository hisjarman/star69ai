# Star69AI Security Monitoring & Traffic Filtering Runbook

**Status:** Monitoring-first implementation; production enforcement not activated.  
**Working branch:** `feature/security-traffic-monitoring-admin-2026-11-19`.

## Current architecture and verified limitation

- Public website hosting: GitHub Pages.
- Backend: Cloudflare Worker `avr-platform-api`, with existing D1 database `avr-trust-lab`.
- The connected Cloudflare account was inspected on 2026-11-19. A zone lookup for `star69ai.com` returned no matching zone.
- Therefore Cloudflare zone-level WAF/firewall rules cannot currently be applied to the public GitHub Pages site from this account. Do not claim that GitHub Pages traffic is protected by Cloudflare WAF.
- The Worker can observe requests that reach its own `workers.dev` endpoint. It cannot see requests blocked at Cloudflare's edge before reaching the Worker, or ordinary static GitHub Pages requests.

## Admin monitoring panel

The authenticated administrator console adds **Security & traffic** with:

- 24-hour and 7-day windows.
- Total classified security rejections and high-severity count.
- Authentication rejection and Turnstile rejection totals.
- Event type, country and ASN/network summaries.
- Recent event list with timestamp, method/path, severity, network/location and Ray ID.
- A coverage notice distinguishing Worker telemetry from Cloudflare edge firewall analytics.

API: `GET /api/admin/security/events?range=24h|7d&limit=150`.

The API is inside the existing `/api/admin/` gate and requires a valid Clerk session, verified administrator email and existing `ADMIN_EMAILS` allowlist.

## Data minimization and retention

D1 table: `avr_security_events`.

Only classified rejected requests are recorded:
- `authentication_rejected`
- `turnstile_rejected`
- `webhook_verification_failed`
- `malformed_request`

Stored metadata: request path/method, Cloudflare country/region/city/ASN/ASN organization/colo, Cloudflare Ray ID, event category/severity, and timestamp.

Not stored: raw visitor IP address, IP hash, user-agent string, request body, credentials, payment data or caller conversation data.

Events older than 30 days are pruned during event recording. Dashboard results are read-only.

## Production rollout sequence

1. Review/merge the source PR only after founder approval.
2. Apply `cloudflare/migrations/20261119_security_monitoring.sql` to the existing `avr-trust-lab` D1 database.
3. Deploy updated `cloudflare/platform-worker.js` to `avr-platform-api`, preserving all existing bindings and secrets.
4. Verify admin-only access, empty-state dashboard, event insertion for controlled test failures, 24-hour/7-day filtering and 30-day retention behavior.
5. Confirm no customer, billing, Retell, Clerk, Stripe, PayPal, Resend or Turnstile flows regress.
6. If zone-level filtering is required, first connect `star69ai.com` to the same Cloudflare account and verify DNS/proxy configuration. Then inspect traffic before enabling rules.
7. Start with Managed Challenge and monitoring. Use narrow, behavior-based rules; allow verified crawlers and required provider endpoints.
8. Never blanket-block major cloud ASNs or countries without reviewing legitimate traffic and documented exceptions.

## Suggested policy after zone connection

- Confirmed malicious IPs: block.
- Known Tor exit nodes: challenge first; block confirmed abuse.
- Bulletproof hosting: challenge/deny based on threat intelligence and observed behavior.
- AWS, Google Cloud, Azure, DigitalOcean and Hetzner: challenge only when request behavior is suspicious; do not blanket-block.
- Geo restrictions: monitor and challenge first; only block countries with no legitimate business need after review.
- Verified Googlebot/Bingbot: allow based on verified crawler identity, not user-agent text alone.
- Clerk, Stripe, PayPal, Retell and Star69AI Worker traffic: use narrowly scoped, verified exceptions; never broad provider-wide allowlists.

## Rollback

- Revert the source PR or Worker deployment to the preceding known-good version.
- Do not drop `avr_security_events` as part of rollback; preserving telemetry is preferable.
- If a future WAF rule creates false positives, disable that specific rule first and verify affected customer/payment/webhook flows.
