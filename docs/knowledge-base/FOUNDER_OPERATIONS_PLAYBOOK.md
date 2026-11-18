# Founder Operations Playbook

**Audience:** Solomon Jarman and authorized Star69AI operators.  
**Review date:** 2026-11-18.

## 1. The promise

Star69AI handles the technical work of building, configuring, testing and maintaining the receptionist. The customer supplies accurate business information, approves operating rules, identifies human contacts and responds to leads that require a person.

Sell the managed outcome: fewer unanswered calls, consistent intake, useful caller information and dependable escalation. Do not sell a guaranteed number of leads, bookings, revenue or emergency response.

## 2. Prospect-to-customer workflow

1. **Receive inquiry.** Record source, business, contact and requested outcome. An inquiry is not recurring-payment consent.
2. **Qualify.** Confirm industry, locations, call volume, phone setup, services, hours, after-hours needs, languages, scheduling tools, human escalation and constraints.
3. **Discovery brief.** Keep it easy. Ask for minimum reliable contact information; let prospects skip details they do not know. If validation rejects a submission, explain the missing field and preserve valid answers.
4. **Review.** Check service fit, unsupported requirements, safety-sensitive workflows, integrations and likely plan fit.
5. **Create demo.** Use approved facts only. Label simulations and unconnected integrations. A demo must not buy a number, start a subscription or activate production routing.
6. **Test demo.** Run industry QA scenarios and critical safety tests. Record failures and corrections.
7. **Present.** Explain what is configured, simulated and unconnected; plan costs, setup fee, included usage, overage and third-party costs.
8. **Obtain approval and order.** Keep demo acceptance, commercial order, recurring-payment authorization and overage authorization distinct and explicit.
9. **Collect payment.** Verify with the payment provider and matching server-side record. A browser success screen alone is not proof.
10. **Mission Briefing.** Confirm business knowledge, phone authority, routing, notifications, recording/transcription settings, retention, fallback and escalation.
11. **Configure and test.** Assign the production agent and number only after approvals and payment conditions. Verify number-to-agent-to-customer mapping.
12. **Launch approval.** Customer reviews final call experience, transfer destinations and fallback. Record who approved and when.
13. **Activate.** Only then enable production routing. Verify an inbound test call from an external phone and expected transfer/fallback behavior.
14. **Monitor.** Review webhook delivery, call outcomes, lead capture, failed transfers, usage, billing, support and provider status.
15. **Improve.** Analyze patterns, draft proposed improvements, test, obtain approval and publish with a rollback path.

## 3. Required customer Mission Briefing record

Do not build from a website or guess. Confirm and record:
- Legal/display business name and pronunciation.
- Primary contact and authorized approver.
- Business locations, time zone, hours, holiday hours and service area.
- Approved services, exclusions, FAQs and authoritative source/last-confirmed date.
- Pricing policy: exact approved figures or explicit instruction to route pricing to a human.
- Appointment workflow and authoritative calendar, if connected.
- Lead fields: caller name, callback number, service requested, location, urgency, preferred time and consent where relevant.
- Emergency definitions, escalation destination, schedule and fallback if nobody answers.
- Human transfer rules, voicemail policy and after-hours behavior.
- Notification recipients and their authorization.
- Languages and voice/feature compatibility confirmed by provider.
- Recording/transcription decision, caller notice/consent process and retention instructions.
- Customer backup procedure if phone service is unavailable.
- Customer approval of final call flow and launch test.

Never collect passwords, card data or unnecessary sensitive information in discovery or ordinary support tickets.

## 4. Agent quality standard

Every new agent and material prompt revision must be tested against approved customer facts.

Critical pass/fail tests:
1. Correct business identity, pronunciation and greeting.
2. Correct hours, holidays and time zone.
3. Correct service area, services and exclusions.
4. Correct appointment handling; never invent a confirmed booking.
5. Correct lead capture and read-back of callback details.
6. Correct urgent/emergency classification and approved escalation.
7. Correct transfer, no-answer fallback and after-hours behavior.
8. Safe handling of unknown questions and pricing.
9. No fabricated availability, arrival, diagnosis, warranty or policy.
10. Resistance to caller attempts to override instructions or reveal private data.
11. Clear, respectful conversation and graceful interruption handling.
12. Correct language/voice pronunciation for tested scenarios.

A critical failure blocks launch regardless of average score. Record scenario, expected behavior, observed result, severity, correction and retest.

## 5. Mission Control and customer success

Review the workspace as a service dashboard, not merely a call counter.

- **Calls:** compare call records with provider events; identify unanswered, failed, short or abandoned calls.
- **Leads:** distinguish a caller inquiry from a qualified lead and a lead from a booked job.
- **Appointments:** count as booked only when a connected authoritative calendar or authorized human confirms it.
- **Intelligence:** explain AI findings as assessments with confidence/limitations; verify high-impact findings against the call.
- **Usage:** compare server-calculated current period, Vault and authorized overage. A browser estimate is not a charge.
- **Support:** track owner, priority, status, next action and customer communication.
- **Health:** flag failed calls, webhook gaps, integration failures, payment problems, low activity, usage limits and unresolved critical tickets.

Monthly customer review:
- Calls received and handled, with definitions.
- Leads captured, with evidence and duplicates removed where possible.
- Appointment requests versus confirmed appointments.
- Transfer/escalation success and failure.
- Usage, Vault and invoiced overage.
- Important complaints or call-quality issues.
- Changes made, tests run and customer approvals.
- Next recommended improvements.

Never estimate recovered revenue without customer-provided assumptions and an explicit estimate label.

## 6. Billing and partner operations

- Use the accepted order and provider-confirmed transaction as the financial record.
- Keep the $99 setup fee separate from subscription discounts and partner commission calculations.
- Calculate partner commission only from qualifying subscription amounts actually collected after customer discounts, under the approved tier and agreement. Exclude setup fees and uncollected amounts.
- Do not mark commission paid until validation hold has passed, payout minimum is met and payout reference is recorded.
- Reconcile Stripe invoices, PayPal transactions, customer records and partner ledger regularly.
- Do not manually edit balances or ledger rows without an auditable correction procedure.
- The 75% overage cap is a hard service limit. If billing authorization or payment status is uncertain, fail safely by limiting new calls.

## 7. Support and incident response

1. Record affected customer, number, time window, symptom and business impact.
2. Determine whether the issue is provider outage, phone routing, agent behavior, webhook delivery, AI analysis, email, billing or customer configuration.
3. Preserve event IDs and sanitized logs. Do not copy full caller transcripts into public tickets.
4. Check for a documented backup number or manual process.
5. Notify the customer with what is known, unknown and the next update time.
6. Apply the smallest safe correction; do not edit a live prompt without testing and approval.
7. Verify recovery with a real test call or provider-confirmed event.
8. Record root cause, prevention and customer follow-up.

Never tell a customer the system is restored until the relevant path has been tested.

## 8. Weekly and monthly cadence

**Weekly:** review prospects, demo queue, pending onboarding, call failures, urgent support, payment exceptions, usage limits, webhook/AI failures and partner referral anomalies.

**Monthly:** reconcile payments and commissions; review customer health and retention risks; send performance reports based on verified data; confirm knowledge base and legal/pricing copy align with production.

## 9. Founder decisions that remain human-controlled

Commercial terms, discounts, refunds and exceptions; legal interpretations; emergency policy and escalation commitments; customer approval of material workflow changes; live prompt publication and rollback; provider selection and paid integrations; customer suspension/termination and data deletion exceptions; partner admission, commission exceptions and payouts.

## 10. Never do this

- Never invent customer facts or assume a business policy from its industry.
- Never tell a caller an appointment, technician, quote or refund is confirmed without authoritative confirmation.
- Never treat an AI lead score or sentiment as revenue or customer satisfaction.
- Never activate a demo as production without approvals and a tested phone path.
- Never expose one customer's information to another.
- Never expose secrets or personal caller data in the repository.
- Never merge to main without the founder's explicit approval.
