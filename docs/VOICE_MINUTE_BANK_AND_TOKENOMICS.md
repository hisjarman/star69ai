# Star69AI Voice Minute Bank & Tokenomics Design

**Status:** Approved product direction; implementation and legal/accounting review pending. This is an internal design note, not customer terms or accounting advice.

## 1. Product objective

Make unused included AI voice minutes retain practical value for customers for as long as they remain active, paid Star69AI subscribers. The customer sees a clear bank balance and can use it for eligible future Star69AI AI voice calls. This is a service-credit system, not a financial asset.

## 2. Recommended model: closed-loop usage credits

- Unit: one Voice Minute Credit (VMC) represents one eligible minute of Star69AI AI voice usage under the customer's agreement.
- No dollar peg, cash redemption, transfer between customers, resale, exchange listing, staking, yield or investment promise.
- No public blockchain or customer crypto wallet. Maintain an auditable first-party database ledger with immutable grant, consumption, adjustment and reversal entries.
- The customer portal should show available minutes, the source and date of each grant, usage debits, adjustments and a clear explanation of how credits are consumed.

## 3. Grant and consumption rules

1. At each successful subscription renewal, grant the plan's included minutes: Starter 300, Growth 600, Pro 1,200. Do not grant on an unpaid or failed renewal.
2. At the end of the period, unused included minutes move into the bank and do not expire month-to-month while the subscription remains active and paid.
3. During a period, consume the current-period allowance first, then the oldest banked credits (FIFO), then billable overage. FIFO prevents newer credits from being stranded behind older credits.
4. The existing overage payment/carryover preference applies only after both the current-period allowance and banked credits have been exhausted. The existing 50% carryover rule must not duplicate credits already placed in the bank.
5. Plan upgrades and downgrades preserve the existing bank. Future monthly grants follow the new plan. Enterprise agreements may define a separate grant and consumption schedule in writing.
6. Every call debit must be reconciled from provider-reported duration in seconds. Store seconds, not rounded minutes, and define one consistent rounding rule for display and billing. Never debit twice for duplicate provider events; support reversals for failed or refunded calls.

## 4. Customer status and exit rules

- Accumulation continues only while the subscription is active and paid.
- If payment fails, stop new grants; preserve the recorded balance during a defined billing grace/recovery period. Whether usage is temporarily restricted must be separately disclosed.
- On cancellation, decide and disclose whether the bank is available through the paid-through date and whether a short reactivation window preserves it. Do not promise forfeiture or cash refunds without counsel reviewing applicable consumer, prepaid-service and unclaimed-property rules.
- Credits are not cash, cannot be transferred, and cannot be used for unrelated third-party services. Contract language must avoid implying a bank deposit or monetary account.

## 5. Unit economics and reserve controls

Using the working provider-cost assumption of $0.15 per voice minute, the theoretical direct voice cost represented by the monthly allowance is:

| Plan | Included minutes | Indicative voice cost at $0.15/min | Monthly price |
|---|---:|---:|---:|
| Starter | 300 | $45 | $149 |
| Growth | 600 | $90 | $249 |
| Pro | 1,200 | $180 | $399 |

These are scenario estimates, not verified all-in costs. They exclude the assumed $2 monthly phone-number cost, taxes, payment fees, refunds, support, telephony variability and other vendor charges. Revalidate actual provider costs before setting a final reserve.

Because banked minutes can be redeemed later, track outstanding credits by customer and grant cohort. Report both (a) outstanding banked seconds/minutes and (b) an estimated fulfillment-cost exposure using current variable provider cost. Finance should reconcile the ledger monthly and maintain a cash reserve policy. Unlimited accumulation creates a potentially growing future service obligation; it should not be treated as free margin merely because the minutes were not used in the month they were granted.

## 6. Pricing and overage

| Plan | Monthly price | Included minutes | Effective included rate | Proposed overage |
|---|---:|---:|---:|---:|
| Starter | $149 | 300 | $0.497/min | $0.55/min |
| Growth | $249 | 600 | $0.415/min | $0.45/min |
| Pro | $399 | 1,200 | $0.3325/min | $0.36/min |

Overage must be higher than the plan's effective included rate. For usage, current-period allowance and banked credits are consumed before an overage charge is created.

## 7. Enterprise offer

Enterprise is a consultation-led custom offer, not an automatically purchasable fourth tier. Quote based on monthly/annual usage forecast, locations, call concurrency, call flows, integrations, support expectations, service-level commitments and the cost of the selected voice configuration. Set a minimum commitment or usage band where necessary to protect capacity and margin. Include the minute-bank treatment explicitly in each enterprise proposal.

## 8. Accounting, legal and tokenomics research

- Unused credits that provide a future service may create a contract liability or deferred-revenue/performance-obligation question. The exact treatment depends on the contract, jurisdiction, whether credits are part of the paid subscription or a separate prepaid product, redemption expectations and applicable accounting framework. Obtain a CPA's written policy before launch.
- Deloitte's discussion of ASC 405-20 describes prepaid stored-value obligations and breakage; IFRS loyalty-program guidance explains that customer award credits may represent a separate performance obligation when they provide a material right. These are relevant concepts, but they do not determine Star69AI's exact treatment.
- Telecom rollover examples demonstrate that customer-facing minute/data balances can be carried forward with explicit use, status and expiry rules. Their rules are examples, not a legal template for Star69AI.
- Tokenization is not required for this product. A private, centralized ledger is appropriate for one issuer. Transferable or cash-like tokens would add custody, fraud, consumer-protection, tax and regulatory complexity without solving a problem the customer has asked us to solve.

## 9. Implementation gates

- Design D1 ledger tables for grant, debit, adjustment, reversal and balance snapshots.
- Implement idempotent provider call debits using call IDs and duration seconds; reconcile to provider statements.
- Implement renewal grants only after confirmed successful subscription payment.
- Implement FIFO consumption across current-period minutes and bank lots; ensure the overage workflow only sees usage remaining after credits.
- Add customer and admin views, exportable transaction history, audit events and balance reconciliation reports.
- Define cancellation, failed-payment, refund, reactivation and enterprise exceptions in reviewed customer terms.
- Add tests for duplicate webhooks, partial seconds, long calls, plan changes, charge reversals, period boundaries, failed renewals and concurrent calls.
- Apply D1 migration, deploy Worker and publish UI only after staging and end-to-end verification. Until then, do not describe the minute bank as live.

## Sources reviewed

- Deloitte, *Derecognition of Liabilities for Prepaid Stored-Value Products*: https://dart.deloitte.com/USDART/home/codification/liabilities/asc470-10/roadmap-debt/chapter-9-debt-extinguishments/9-4-derecognition-liabilities-for-prepaid
- IFRIC 13, *Customer Loyalty Programmes* (EUR-Lex): https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32008R1262
- AT&T, *About Rollover Minutes*: https://www.att.com/support/article-modal/wireless/KM1051496/
- ColdAI, *Tokenised Loyalty Points: When a Ledger Helps* (industry commentary; not a regulator or accounting authority): https://coldai.org/technologies/digital-assets/tokenised-loyalty-programmes/

This note is product and engineering guidance only. It is not legal, tax, accounting or investment advice.
