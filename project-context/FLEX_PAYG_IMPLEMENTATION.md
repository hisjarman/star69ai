# Star69AI Flex — pay-as-you-go implementation

## Commercial model
- Retail usage rate: **$0.65 per AI voice minute**.
- No monthly subscription, included-minute allowance, subscription rollover or Minute Vault.
- Flex holds prepaid USD usage credit. The wallet balance is not cash-redeemable, transferable or refundable except where required by law or the written agreement.
- Deposits are dollar amounts, not fixed-minute packages. The portal shows only an estimate of minutes at the published rate.
- Deposit denominations: **$10, $25, $50, $75, $100 and $149**.
- Estimated call time at $0.65/minute: 15.4, 38.5, 76.9, 115.4, 153.8 and 229.2 minutes, respectively. Actual usage depends on the AI configuration and connected-call duration.
- Flex payments are handled through PayPal invoices issued separately by SIMIAPP CLOUD. Stripe is not used for Flex deposits or wallet funding.
- Wallet credit is posted only after an administrator verifies that the corresponding PayPal payment has actually been received. No automated PayPal top-ups or auto-reload are represented as available.

## Merged and deployed foundation (2026-11-15)
- Pull request #149 was squash-merged to `main` as `015db97e78d66386995a80f190dc20c3e2ba4892`.
- D1 migration was applied to production database `avr-trust-lab`; both wallet tables and the ledger index were verified.
- Worker `avr-platform-api` received the merged Worker source. Cloudflare reported the deployment at 100% traffic.
- Existing Worker bindings and secret bindings were preserved by updating script content only.
- `PAYG_INGRESS_GATE_ENABLED` is not configured. The API correctly reports call eligibility as false. Do not enable it until the ingress gate is live.

## Customer/admin flow in this feature branch
- Client portal includes a Flex wallet page with available dollar credit, estimated minutes, wallet status and the latest 20 ledger entries.
- The customer can see the six published deposit choices. The PayPal invoice request controls remain disabled while the ingress gate is off. When enabled, a request is sent to support; it does not charge the customer or automatically post wallet credit.
- Admin console lists every customer and current Flex balance. An administrator can post a credit only after verifying the matching PayPal receipt.
- The Worker exposes the fixed deposit denominations, rejects non-package amounts, rejects duplicate PayPal references, and refuses wallet credit posting until `PAYG_INGRESS_GATE_ENABLED=true`.
- The customer wallet endpoint returns a minute estimate calculated from dollar credit divided by the retail rate. It does not imply those minutes have already been purchased as a fixed bundle.
- Pricing page now discloses the deposit options and labels Flex as a pilot/waitlist until the gateway is verified.

## Launch blocker — do not bypass
The current Retell integration maps inbound numbers directly to Retell agents. The existing Retell webhook is post-call; it cannot reliably stop a call before the AI answers or stop an in-progress call at the exact moment a balance reaches zero. A positive wallet alone must NOT be treated as authorization to activate a Flex number.

Before selling/activating Flex:
1. Route the business number through a supported telephony ingress/gateway.
2. Synchronously check the wallet before bridging the call to Retell.
3. Reserve enough balance for the maximum permitted call duration or enforce a hard maximum duration and terminate/redirect safely when the reserve is exhausted.
4. Fail closed when the balance service is unavailable or the wallet is insufficient.
5. Make concurrent-call reservations atomic so two calls cannot spend the same balance.
6. Reconcile actual Retell call duration and provider cost after each call, with idempotent usage ledger entries.
7. Test zero balance, insufficient reserve, long calls, transfer behavior, gateway outage and concurrent calls.
8. Only then enable `PAYG_INGRESS_GATE_ENABLED=true`.

## Metering and unit-economics decisions
- Retell documents second-level billing on accumulated call duration rather than rounding every call up to a full minute. Star69AI should use a disclosed per-second pro-rata retail calculation when its usage meter is implemented and tested; do not round each short call up to a full minute.
- The public $0.65 rate is a retail price, not a statement of Star69AI's provider cost or guaranteed margin. Retell model, voice, telephony, add-ons, number rental, concurrency, PayPal fees, support and partner costs must be included in the live margin model.
- Retell's published rate varies by configuration and telephony can be a separate charge. Recheck the exact production agent model/voice/telephony bill before activation.
- PayPal transaction fees reduce the amount Star69AI retains; do not subtract fees from the customer's advertised wallet credit after a successful payment. Include payment processing in unit economics.
- Refunds, reversals and chargebacks need an auditable compensating ledger entry; never edit or delete a posted ledger credit.

## Remaining production work
- Implement the actual pre-answer ingress/gateway and usage-metering/debit service.
- Implement atomic balance reservation, in-call maximum duration enforcement and post-call reconciliation.
- Verify low-balance alerts and graceful fallback/voicemail/forwarding behavior.
- Run automated and live integration tests against a non-production number.
- Keep the public Flex deposit controls disabled until all gateway and metering tests pass.
