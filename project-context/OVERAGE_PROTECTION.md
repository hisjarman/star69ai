# Subscription overage protection

## Commercial rule
- Subscription customers consume the current month's included minutes first, then their Minute Vault balance (FIFO), then billable overage.
- Each customer has an administrator-approved overage_limit_minutes value. New and existing accounts default to 0 until an administrator explicitly authorizes overage.
- At 50% of the approved overage allowance, Star69AI emails the customer and configured administrators.
- At 75% of the approved allowance, Star69AI stops accepting new AI calls for that billing period. The unused final 25% is a safety margin, not additional customer entitlement.
- A limit of 0 means no overage is authorized: new calls stop when included minutes and the Minute Vault are exhausted.
- The admin workspace allows an integer allowance from 0 to 2,000 minutes. Admin approval is required to increase it.

## Enforcement
- Retell's phone-number inbound_webhook_url points to https://avr-platform-api.hisjarman.workers.dev/webhooks/retell/inbound.
- The Worker verifies the Retell signature, resolves the dialed number to its Star69AI customer, checks subscription status, recomputes included/vault/overage usage, and returns the assigned agent only when the customer is eligible.
- A blocked call receives an empty inbound response, so Retell does not connect the AI agent.
- The normal Retell call webhook continues to record call duration and sends threshold notifications after call completion.
- New assignments automatically receive the inbound webhook. The Agency Admin has an explicit action to attach it to existing assigned numbers.
- PAYG/Flex numbers remain fail-closed unless PAYG_INGRESS_GATE_ENABLED=true and a funded positive wallet exists. Do not enable that flag as part of this subscription-overage release.

## Important limits and launch checklist
- This guard blocks new inbound calls. It does not terminate calls that are already connected. A call already in progress can push actual usage beyond the 75% threshold; concurrent calls can increase that overrun. Test concurrency and decide whether a per-call duration override is needed before promising a mathematically exact ceiling.
- Usage is based on completed Retell call records. The call webhook may arrive after the call ends; inbound checks always recompute from the latest stored call usage.
- This implementation does not itself create Stripe metered usage items or charge overage invoices. The portal must continue to label overage as an estimate until Stripe metered billing, reconciliation, retries and end-to-end payment tests are completed.
- Apply cloudflare/migrations/20261115_overage_protection.sql before deploying the Worker.
- Deploy the Worker, then use Agency Admin → Agents & numbers → Enable call protection on assigned numbers. Verify the Retell API accepted inbound_webhook_url on every assigned number.
- Test: zero overage authorization, 50% warning, 75% block, new-client default, prepaid-term eligibility, suspended/past-due accounts, duplicate webhooks, Resend failures and concurrent calls.
- No production migration, Worker deployment, Retell number update or payment setting change was performed by this branch.
