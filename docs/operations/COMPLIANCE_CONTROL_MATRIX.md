# Star69AI Compliance Control Matrix

**Status:** Applicability assessment required — 2026-11-20. This is an engineering/legal issue register, not legal advice or a compliance certification.

## Scope decisions required
Before finalizing applicability, document:
- Countries/states where Star69AI, each customer and callers are located.
- Inbound vs outbound voice/text use cases.
- Whether calls are recorded, transcribed, summarized or retained.
- Customer industry and whether sensitive/regulated information is in scope.
- Star69AI's contractual role and each vendor's role.
- Data locations, subprocessors and cross-border transfers.

## Control matrix

| Domain | Potential obligations / framework | Required Star69AI controls and evidence | Owner / status |
|---|---|---|---|
| Privacy and data rights | Applicable U.S. state privacy laws, GDPR/UK GDPR or other local laws where in scope | Data inventory, purpose, notice, rights intake, deletion/export, retention, processor terms, transfer map | Counsel + operator; applicability open |
| Call recording/transcription | Federal/state and international recording/interception consent rules | Jurisdictional consent matrix, pre-recording notice, customer approval, evidence, opt-out/disable path, retention/deletion | Counsel + telephony; open |
| Automated calls/texts | TCPA, FCC rules, state mini-TCPA laws, Do Not Call/suppression requirements where applicable | Separate inbound/outbound policy, consent evidence, revocation, suppression, time-of-day rules, caller identity and audit | Counsel + operator; open |
| Marketing email | CAN-SPAM and applicable local marketing rules | Accurate headers/subject, postal address, ad identification where appropriate, working unsubscribe, suppression, vendor evidence | Operator; source controls present, end-to-end tests open |
| AI transparency and claims | Applicable AI laws, consumer protection and unfair/deceptive practices | AI identity disclosure, limitation notice, human escalation, no fabricated capabilities, risk review, claim register | Product + counsel; partial |
| Payments | PCI DSS responsibilities and card-provider rules | Keep card data in hosted Stripe/PayPal flows; document SAQ scope with providers/acquirer; never store PAN/CVV | Billing; scope review open |
| Security | Contractual security obligations; OWASP ASVS/SAMM as engineering baselines | Secure SDLC, access control, vulnerability handling, logging, incident response, restore tests | Engineering; partial |
| Accessibility | ADA and applicable digital accessibility requirements; WCAG as target | Keyboard, screen-reader, contrast, labels, error states, responsive and assistive-tech testing | Product; testing open |
| Vendor / processor terms | DPAs, subprocessors, security terms and international transfer terms | Vendor register, DPA review, subprocessor list, breach notice terms, deletion/return, data location | Operator + counsel; open |
| Industry-specific data | HIPAA/BAA if PHI/business-associate role arises; GLBA or other sector rules if relevant | Exclude sensitive regulated data by default; no regulated deployment without separate scope, vendor eligibility, contract and controls | Counsel; high-risk gate |
| Consumer/business contracts | State contract, auto-renewal, cancellation and disclosure rules | Clear scope, pricing, setup fees, overage, prepaid terms, renewal, cancellation, limitations and change process | Counsel + operator; review |
| Records / accounting | Applicable tax, accounting and recordkeeping rules | Immutable payment/acceptance evidence, reconciliation, retention schedule, access controls | Operator/accountant; partial |
| Incident / breach response | Applicable state, federal and international breach-notification requirements | Incident plan, discovery clock, evidence preservation, impact assessment, vendor/customer/counsel escalation | Operator + counsel; open |

## Existing source evidence
- Public AI Use & Compliance page disclaims blanket legal guarantees and describes AI transparency, approved scope, recording/transcription, outbound restrictions, escalation and regulated-data limits.
- Checkout source requires separate affirmative terms/privacy/AI limitation/plan/billing acknowledgements and Turnstile verification.
- D1 contains append-only checkout evidence events and security telemetry tables.
- Marketing source includes advertisement disclosure, postal contact details, unsubscribe token and one-click unsubscribe headers.
- Recording Notice and SMS Terms public pages exist.
- Existence of these controls does not establish that notices are legally sufficient in every jurisdiction or that consent has been captured for each caller/customer.

## Mandatory launch blockers
- No recording/transcription feature until consent design, notice and retention have been approved for applicable jurisdictions.
- No outbound AI voice or automated SMS campaign without documented consent/suppression/legal review.
- No PHI, cardholder data, passwords, government IDs or sensitive regulated data unless separately approved and contractually supported.
- No claims of HIPAA, SOC 2, PCI certification or blanket legal compliance without independent evidence and appropriate scope.
- No production customer onboarding without signed customer terms, approved agent behavior, emergency/human escalation, data notice and tested deletion/access process.

## Evidence to collect
1. Jurisdiction and customer-use-case decision log.
2. Data map and retention schedule.
3. Vendor DPA/subprocessor review records.
4. Recording and messaging consent test evidence.
5. Customer agreement and checkout acceptance evidence.
6. Marketing suppression/unsubscribe tests.
7. Security and incident response records.
8. Accessibility test report.
9. Counsel review and outstanding legal questions.
