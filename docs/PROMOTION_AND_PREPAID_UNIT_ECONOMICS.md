# Star69AI promotion and prepaid unit economics

Prepared 2026-11-14 for the approved offer structure. This is a planning model, not an accounting statement or a substitute for actual Retell/Stripe invoices.

## Assumptions

- Published monthly plan prices: Starter $149 (300 minutes), Growth $249 (600 minutes), Pro $399 (1,000 minutes).
- First-month challenge discount: 10% on the first monthly subscription invoice only.
- Partner referral discount: 5% on the first monthly subscription invoice only. A challenge code takes precedence; discounts never stack.
- Partner commission stress case: 30% of eligible subscription revenue actually collected after discounts. This is the current maximum commission tier.
- Assumed blended voice/telephony/AI cost: $0.17 per included AI minute. This is an illustrative input and must be replaced with the actual blended cost from the Retell account and phone carrier.
- Stripe domestic card fee assumption: 2.9% + $0.30 per successful card charge. Actual account pricing, currency, international card and FX fees may differ.
- The $99 setup fee is excluded from the model because it is separately invoiced. Labor, support, phone number rental, software, tax, refunds, disputes and general overhead are also excluded.

## Monthly first-month challenge offer — conservative partner-commission case

| Plan | Customer payment after 10% | Modeled usage cost | Stripe fee | 30% partner commission | Contribution before overhead |
|---|---:|---:|---:|---:|---:|
| Starter | $134.10 | $51.00 | $4.19 | $40.23 | **$38.68** |
| Growth | $224.10 | $102.00 | $6.80 | $67.23 | **$48.07** |
| Pro | $359.10 | $170.00 | $10.71 | $107.73 | **$70.66** |

Formula: discounted payment − modeled usage cost − Stripe fee − partner commission. This assumes the referred customer uses all included minutes and the maximum 30% partner commission is earned. A non-referred challenge customer will have no partner commission, so contribution will be higher.

## Six-month prepayment — 5% off, no first-month offer stacked

| Plan | Upfront payment | Modeled six-month usage cost | Stripe fee | 30% partner commission | Contribution before overhead |
|---|---:|---:|---:|---:|---:|
| Starter | $849.30 | $306.00 | $24.93 | $254.79 | **$263.58** |
| Growth | $1,419.30 | $612.00 | $41.46 | $425.79 | **$340.05** |
| Pro | $2,274.30 | $1,020.00 | $66.25 | $682.29 | **$505.76** |

## Twelve-month prepayment — 10% off, no first-month offer stacked

| Plan | Upfront payment | Modeled twelve-month usage cost | Stripe fee | 30% partner commission | Contribution before overhead |
|---|---:|---:|---:|---:|---:|
| Starter | $1,609.20 | $612.00 | $46.97 | $482.76 | **$467.47** |
| Growth | $2,689.20 | $1,224.00 | $78.29 | $806.76 | **$580.15** |
| Pro | $4,309.20 | $2,040.00 | $125.27 | $1,292.76 | **$851.17** |

## Cost ceilings in the first discounted month

At 10% off, after the 2.9% + $0.30 Stripe fee and 30% partner commission, the approximate maximum blended per-minute cost before contribution reaches zero is:

| Plan | Break-even blended cost per included minute |
|---|---:|
| Starter | $0.299/minute |
| Growth | $0.250/minute |
| Pro | $0.241/minute |

These are not safe operating targets: they leave nothing for configuration labor, customer support, fixed costs, taxes, refunds or churn. Keep actual blended costs comfortably below these ceilings and review each voice/model/telephony combination. Pro has the tightest ceiling in this stress case.

## Stripe configuration required before activating offers

- STRIPE_COUPON_CALLSMART10: Stripe coupon ID configured for 10% off, duration once.
- STRIPE_COUPON_PARTNER5: Stripe coupon ID configured for 5% off, duration once.
- Six-month recurring Price IDs: STRIPE_PRICE_STARTER_6MO, STRIPE_PRICE_GROWTH_6MO, STRIPE_PRICE_PRO_6MO. Each must use interval=month, interval_count=6, with the full upfront amount above.
- Twelve-month recurring Price IDs: STRIPE_PRICE_STARTER_12MO, STRIPE_PRICE_GROWTH_12MO, STRIPE_PRICE_PRO_12MO. Each must use interval=month, interval_count=12, with the full upfront amount above.
- Preserve existing monthly Price IDs. Do not set up automatic stacking or expose Stripe's generic promotion-code field.
- Test in Stripe test mode: challenge code first invoice discount and full-price renewal; partner referral first invoice discount and commission attribution; challenge code overriding partner discount while preserving attribution; prepaid six-/twelve-month upfront invoice and renewal interval; failed/cancelled checkout; webhook plan mapping; refunds and commission reversals.

**Activation gate:** the website may describe the approved offer structure, but no code is redeemable and no prepaid checkout is available until the matching Stripe coupon/Price IDs are configured in the Cloudflare Worker and end-to-end test mode checkout passes. Never tell a customer a discount was applied unless Stripe's Checkout Session confirms it.
