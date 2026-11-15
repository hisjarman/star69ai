# Star69AI Flex — pay-as-you-go implementation

## Approved commercial rules
- Public price: $0.65 per AI voice minute.
- No monthly subscription, no included minutes, no subscription rollover and no Minute Vault.
- The account must have a positive prepaid USD credit balance before it can receive inbound calls.
- Credit is a prepaid usage balance; it is not cash-redeemable and is separate from subscription minute benefits.
- A verified PayPal payment is manually posted by an administrator in this initial implementation. Do not claim automated PayPal top-ups or auto-reload.

## Implemented in this branch
- Added the Flex pricing card and explicit disclosure to `pricing.html`.
- Added D1 tables for Flex wallet status and an auditable credit ledger.
- Added authenticated client wallet-balance API: `GET /api/client/payg-wallet`.
- Added admin wallet listing and a manual verified-PayPal credit posting endpoint:
  - `GET /api/admin/payg-wallets`
  - `POST /api/admin/payg-wallets/{customer_id}/credit`
- Wallet top-ups require a unique PayPal invoice/transaction reference and are idempotent via the ledger uniqueness constraint.
- The Worker exposes `canReceiveCalls=false` until the ingress gate is explicitly enabled.

## Launch blocker — do not bypass
The current Retell integration maps inbound numbers directly to Retell agents. The existing Retell webhook is post-call; it cannot reliably stop a call before the AI answers or stop an in-progress call at the exact moment a balance reaches zero. Therefore, a positive wallet alone must NOT be treated as authorization to activate a Flex number.

Before selling/activating Flex, route the business number through a supported telephony ingress/gateway that can synchronously check the wallet before bridging to Retell, enforce a reserve/maximum-call-duration policy, and fail closed when balance is zero or the balance service is unavailable. Test low-balance and concurrent-call cases. Only then set `PAYG_INGRESS_GATE_ENABLED=true`. Do not set it before the ingress gate is deployed and verified.

## Billing details still to finalize
- Define the smallest PayPal top-up denomination and any minimum balance.
- Define whether call usage is billed in full-minute increments or per-second increments. Public copy currently says per AI voice minute; the meter must use the same disclosed rounding rule.
- Add client portal UI for wallet history and top-up instructions.
- Add the pre-answer ingress service and integration tests.
