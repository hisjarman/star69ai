# Star69AI Product Truth & Claims Register

**Audience:** Founder, sales, marketing, support, AI assistants and developers.  
**Review date:** 2026-11-18.  
**Rule:** A marketing statement must never be stronger than verified product behavior and the customer's accepted order.

## 1. Positioning

Approved core statement:

> Star69AI is a managed AI receptionist service. We configure, customize, test and maintain the receptionist around each customer's business so the owner does not have to build or operate another software platform.

Avoid absolute claims such as “guaranteed leads,” “guaranteed bookings,” “revenue recovery” or “never miss a call.”

## 2. Published plan baseline

| Plan | Monthly price | Included AI voice minutes | Advertised overage rate | Maximum 75% overage |
|---|---:|---:|---:|---:|
| Starter | $149 | 300 | $0.55/min | 225 min |
| Growth | $249 | 600 | $0.45/min | 450 min |
| Pro | $399 | 1,200 | $0.36/min | 900 min |

These are the current source/public-copy baseline, not proof that a specific customer has that plan. Confirm checkout and accepted order for actual entitlement.

## 3. Setup, prepaid and Flex

- Monthly customers: $99 one-time setup fee, separately invoiced by SIMIAPP CLOUD through PayPal.
- Six-month prepaid: 25% subscription savings and setup fee waived, per current public offer.
- Twelve-month prepaid: 35% subscription savings and setup fee waived, per current public offer.
- Flex: no monthly fee and no included minutes; prepaid PayPal wallet credit; advertised rate $0.65 per started AI voice minute. Star69AI must assign and test the receptionist and phone number before live calls.
- Do not stack prepaid pricing with partner or challenge discounts unless a current server-validated offer expressly permits it.
- A demo request, account creation or website visit is not recurring-payment authorization.

## 4. Minute Vault

Current platform Worker source implements:
- 50% of unused included minutes from a finalized month are banked.
- Current-period included minutes are used first.
- Vault lots are consumed oldest-first.
- Vault minutes have no cash value, cannot be transferred or refunded, and are forfeited on cancellation.
- Plan changes preserve existing Vault lots; future grants follow the then-current plan.
- Flex does not receive a Minute Vault.

Explain the Vault as service-use minutes, not cash, credit or refund. Confirm account-level balances in Mission Control.

## 5. Overage

- Hard ceiling is 75% of included plan minutes per billing period: Starter 225, Growth 450, Pro 900.
- Available Vault minutes do not increase the 75% cap.
- Advertised rates are not proof a charge was made.
- Automatic overage collection requires separate customer authorization and a saved payment method. Current implementation describes Stripe invoice items rather than a Stripe metered subscription price.
- If payment authorization or collection is unavailable, new calls should be limited to included and available Vault minutes.
- Never promise a customer they can exceed the 75% ceiling.

## 6. Promotions

Promotions are time-limited and server-validated. Before mentioning one, verify public offer, checkout logic, eligibility dates, exclusions and provider-side coupon/secret configuration.

**Secret Mission / Star Navigator:** source expects STAR15MISSION and a Stripe coupon referenced by STRIPE_COUPON_SECRET_MISSION15. The Worker validates 15% off for 12 months on eligible monthly subscriptions. If the secret or matching Stripe coupon is not configured and tested, do not claim the reward is redeemable.

**3FORFREE:** current legal copy describes a November 2026 offer ending November 30, 2026. Verify server-side eligibility and checkout display before use. Do not extend expired promotions by copying old marketing copy.

## 7. Partner commissions

The approved business rule is commission on qualifying subscription amounts actually collected after customer discounts—not list price, unpaid amounts or the separate $99 setup fee. The remembered commercial tiers are 20% for 1–4 active referrals, 25% for 5–14 and 30% for 15+, but confirm the currently approved partner agreement and deployed commission calculation before quoting or paying a rate. Verify hold and payout rules.

## 8. Intelligence and lead reporting

The Intelligence Engine can assess call intent, outcome, lead-capture completeness, friction and possible improvements. It does not independently prove a qualified sales opportunity, confirmed appointment, completed job, revenue earned/recovered, caller satisfaction or policy violation.

Use “AI-assessed,” “potential lead,” “appointment request” and “recommended follow-up.” Reserve “booked,” “paid,” “won” and “revenue” for authoritative records.

## 9. Feature and integration claims

Distinguish:
- **Available in product:** feature exists in source.
- **Configured for this customer:** settings and required provider connections are present.
- **Tested:** a test was executed and passed.
- **Live:** production routing/integration is active and verified.
- **Requested / planned:** not delivered.

Calendar booking, CRM writes, SMS, voice cloning, extra numbers, concurrency upgrades, language/voice combinations and third-party workflows require compatibility checks, customer approval and any necessary provider registration. A request is not activation.

## 10. Claims checklist

Before publishing a claim or answering a sales question:
1. Is it supported by current source and production configuration?
2. Does it apply to this customer's plan and configuration?
3. Does it depend on a third party, consent, registration or paid add-on?
4. Is the result an estimate or an authoritative confirmed event?
5. Is the promotion still within its dates?
6. Does the accepted agreement say something different?

If unknown, qualify the statement or ask the Crew to verify it.
