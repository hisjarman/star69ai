# Subscription minute usage and overage protection

**Current source of truth: November 16, 2026.** This document supersedes older notes about administrator-entered overage allowances. The production design uses a fixed cap derived from each subscription plan.

## Commercial rules

- Subscription usage is applied in this order: current billing-period included minutes, available Minute Vault minutes (oldest saved minutes first), then authorized billable overage.
- The maximum billable overage is fixed at **75% of the plan's included minutes**. It is not an administrator-editable allowance:
  - Starter: 300 included + maximum 225 overage minutes.
  - Growth: 600 included + maximum 450 overage minutes.
  - Pro: 1,200 included + maximum 900 overage minutes.
- Minute Vault minutes are separate from the overage cap. The vault carries forward 50% of unused included minutes while the subscription remains active and paid. Vault minutes are consumed FIFO after the current month's included minutes, have no cash value, and are forfeited on cancellation.
- Overage capacity is available only after the customer explicitly authorizes off-session payment and a valid payment method is saved. Without that authorization, the customer can use included and available vaulted minutes, but no additional overage capacity is reserved.
- Published overage rates are Starter $0.55/minute, Growth $0.45/minute and Pro $0.36/minute.
- Monthly subscription overage is added to the next Stripe subscription invoice. Prepaid six-/twelve-month plan overage is billed through a separate Stripe invoice. The dashboard's estimate is not an invoice or proof of payment.

## Backend enforcement

- Retell inbound numbers use the pre-answer webhook at `/webhooks/retell/inbound`.
- The Worker verifies the Retell signature, resolves the called number to its assigned customer and agent, and checks that the customer is active and billing-eligible.
- For subscription accounts, the Worker recalculates current included, vault and authorized overage capacity, accounts for active call reservations, and sets Retell's per-call maximum duration from the remaining capacity.
- If there is insufficient capacity to reserve at least one minute, the Worker returns Retell's explicit `call_inbound.reject=true` response. It must never return an empty successful response for a blocked call, because Retell may otherwise fall back to a number's default inbound agent.
- D1 call reservations protect against overlapping inbound calls consuming the same remaining allowance. The reservation is released when the Retell `call_ended` event is processed; a 24-hour expiry is the safety fallback for missing/delayed events.
- The regular `/webhooks/retell` endpoint records call events and usage, refreshes the Minute Vault, and initiates eligible overage billing.
- Flex pay-as-you-go accounts use their separate prepaid wallet and ingress gate. Flex does not receive subscription minutes or a Minute Vault.

## Dashboard display rules

- Show included monthly minutes, consumed minutes, remaining included minutes, Minute Vault balance, vault usage and billable overage as distinct values.
- Visual usage warnings at 50%, 75% and 90% of included minutes are informational UI thresholds. They do not change the backend's fixed 75%-of-included overage ceiling.
- The Worker currently sends its overage-protection email warning at 50% of the fixed overage allowance and sends a stop notice at the full allowance. Do not describe these as 50/75/90% included-minute email alerts.
- The 75% cap is enforced server-side. A progress bar or browser-side calculation is never a security or billing control.

## Verification status and remaining tests

- The Worker/D1 implementation and production deployment are recorded in `PROJECT_HANDOFF.md`; the November 16 dashboard enhancement branch corrects the no-capacity inbound response to explicitly reject the call.
- Do not claim the entire payment lifecycle is end-to-end verified until controlled test-customer checks cover monthly and prepaid billing, saved-card authorization, invoice creation, payment failure/retry, duplicate Retell events, simultaneous inbound calls, and the exact cap boundary.
- Verify the inbound webhook is attached to every assigned production number and test that exhausted capacity produces a rejected inbound call, not a fallback route.
- No production Worker deployment, D1 migration, Retell number update, Stripe setting change, or customer payment was performed by the dashboard enhancement branch.
