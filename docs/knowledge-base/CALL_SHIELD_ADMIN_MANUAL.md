# Call Shield — Administrator Operations Manual

Audience: Authorized Star69AI Crew administrators and operators. Internal operational guidance; not a public help article.
Review date: 2026-11-18.

## Operating model
Call Shield screens repeated inbound caller attempts before the Retell AI agent is connected. It is not a universal spam filter or caller identity verification service.

Three layers apply:
1. Global server safeguards define non-negotiable bounds and authorization.
2. Customer settings allow bounded choice of repeat-attempt threshold, detection window, cooldown and maximum AI call duration.
3. Crew oversight allows authorized administrators to inspect and override customer settings and review operational events.

## Implementation facts recorded in the project handoff
- PR #273 established screening and caller-risk intelligence; PR #274 added customer settings and Crew override controls.
- PR #274 merged to main as commit 0db2f79e31c9fd81b06cda0f47cc9b65128a6a4b.
- Production D1 migration cloudflare/migrations/20261118_call_shield_client_settings.sql was applied to avr-trust-lab.
- Worker avr-platform-api deployment c663a77d37604090bb8b611675aa2f00 was recorded at 100% traffic.
- Client ranges: attempts 3–20; window 1–60 minutes; cooldown 1–120 minutes; maximum AI call duration 1–30 minutes.
- Client APIs are tenant-scoped and validate values server-side. Admin GET/PUT routes are administrator-only; actor labels are stored with setting changes.
- Retell inbound screening occurs before agent connection. Subscription and Flex paths cap max_call_duration_ms using the configured duration and any lower limit imposed by minute/balance reservations.
- Existing 75% overage hard-stop and Minute Vault/plan checks remain in force.
- Client settings cannot disable screening, bypass authorization, raise the overage ceiling or automatically create a permanent denylist.
- Caller fingerprints are scoped to customer plus dialed business number and use HMAC keyed by the existing Retell API secret. Raw caller numbers are not written to Call Shield tables.
- Retell call IDs are deduplicated. The original baseline allowed eight same-caller attempts in a fixed ten-minute burst window, rejected the ninth and later attempts for a 15-minute cooldown. Customer-configurable settings now control the bounded threshold/window/cooldown; do not assume the original defaults remain effective for every account.
- Screening state/events are retained for at most 30 days.
- Withheld/invalid caller IDs are not automatically blocked. Caller-ID spoofing cannot be reliably detected.
- AI caller-risk labels are advisory only; they do not automatically create permanent blocks or publish live agent changes.
- The handoff records source checks, isolated SQLite migration/threshold tests, production D1 schema verification and Worker deployment verification. It also records browser QA and live Retell inbound-call tests as outstanding.

## Daily operating procedure
1. Open Command Center and locate the correct client record.
2. Confirm client identity and business number before inspecting settings.
3. Review the current Call Shield configuration and recent event totals/history.
4. Compare settings with the approved customer requirements and reported call pattern.
5. If a change is needed, explain the reason and expected customer impact; use administrator override controls.
6. Record reason, author, time, client and affected business number in the appropriate support/audit record. Actor labels on settings changes do not replace a full incident record.
7. Re-check saved values and ask the client to confirm the intended outcome.
8. Run relevant tests before declaring a live behavior change complete.

## Configuration policy
- Keep customer values within validated bounds.
- Prefer the least restrictive setting that addresses the documented abuse pattern.
- Do not make Strict the default for every business; legitimate callers may retry because of anxiety, poor reception or missing information.
- Before reducing attempts or extending cooldown, assess the risk of rejecting legitimate callers.
- Treat maximum call duration as an upper bound, not guaranteed talk time.
- Never use an override to bypass the 75% overage hard-stop, entitlements or provider safety controls.
- Global bounds, HMAC strategy, retention, fail-open/fail-closed behavior and permanent-block policy require explicit product/security review and regression tests.

## Suspicious caller review and permanent blocks
1. Review relevant screening metadata and authorized call records.
2. Correlate timestamps, dialed number, repeated-attempt pattern and Retell call IDs.
3. Treat AI risk labels as triage hints, not proof.
4. Consider legitimate explanations such as failed transfers, distress, poor reception or caller corrections.
5. If a permanent block is warranted, follow the approved Crew review/approval process and record reason and scope.
6. Confirm the block applies only to the intended customer and business number, with a review/removal path.

Never blacklist automatically based solely on a risk score, withheld caller ID, one call or an unverified accusation. Never expose caller fingerprints or raw call data to another customer.

## Incident response
**Unexpected rejection spike:** check recent preset/threshold changes, affected client/number and event totals. If legitimate calls may be affected, restore the last approved configuration or use a less restrictive bounded configuration. Escalate systemic patterns.

**Screening appears inactive:** verify deployed Worker version, D1 migration/table availability, inbound webhook routing and provider event delivery. Confirm production numbers still use the intended inbound webhook. A dashboard page rendering is not proof that screening is active.

**Calls exceed expected duration:** review configured duration, subscription/Flex path, reservations and balance/plan limits. Confirm both call paths apply the duration cap. Do not change the usage ceiling to solve a duration issue.

**Customer disputes a block:** preserve relevant metadata within retention rules, verify customer/number scope and cooldown expiry, correct erroneous settings and document resolution.

## Security and privacy
- Do not store/export raw caller numbers in Call Shield tables or general-purpose notes.
- Never copy secrets, HMAC material, API keys, caller fingerprints or unredacted transcripts into tickets, GitHub or public documentation.
- Enforce tenant isolation on every customer-facing read/write.
- Enforce admin authorization server-side; hiding a button is not authorization.
- Limit event access to legitimate operational need and follow the 30-day retention behavior plus any stricter requirement.
- Treat recordings/transcripts under their separate access, consent, retention and deletion policies.

## Release and QA checklist
The project handoff records the following remaining rollout tests. Do not mark complete without recording date, test environment, account/number scope (redacted), expected result and actual result.

- [ ] Authenticated client browser tests at mobile, tablet and desktop widths.
- [ ] Authenticated administrator browser tests at mobile, tablet and desktop widths.
- [ ] Standard, Strict and Business Friendly preset behavior.
- [ ] Custom attempts/window/cooldown thresholds and boundary values.
- [ ] Deduplication and cooldown expiry.
- [ ] Legitimate repeat callers and private/invalid caller IDs.
- [ ] Privacy-safe event history; no raw caller numbers.
- [ ] Subscription call-duration cap.
- [ ] Flex call-duration cap and wallet reservation behavior.
- [ ] Existing 75% overage hard-stop remains effective.
- [ ] Retell inbound webhook routing verified for every production number in scope.
- [ ] GitHub Pages client/admin assets verified after publication.
- [ ] Failure-path behavior and logs reviewed.

## Escalation
Escalate tenant-isolation defects, unexpected screening failures, missing D1 tables, webhook failures, unexplained mass rejections or any path that could bypass minute/billing controls to the platform operator. Keep the project handoff current. This manual is an operating guide, not proof that live-call tests have passed.
