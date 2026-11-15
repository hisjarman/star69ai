## Public paid checkout and automatic demo provisioning — 2026-11-15

- Feature branch: `feature/paypal-setup-checkout-2026-11-15`. Changes are not merged or deployed.
- Public plan CTAs and partner referral links lead to `checkout.html`. Checkout collects customer/business details and the minimum discovery facts needed to generate a tailored demo agent.
- Monthly path: preflight the active Stripe monthly price and partner coupon before collecting money; capture the one-time PayPal setup fee ($99 standard / $49.50 for eligible partner-discount referrals), then create a Stripe monthly subscription checkout. The backend verifies both providers' payment states before provisioning.
- Prepaid path (latest approved terms): six-month terms are 20% off and twelve-month terms are 30% off, charged once through PayPal. Totals: Starter $715.20 / $1,251.60; Growth $1,195.20 / $2,091.60; Pro $1,915.20 / $3,351.60. Setup is waived; prepaid does not create a Stripe subscription.
- Partner discount and prepaid discounts cannot stack. Monthly partner referrals receive the approved 15% monthly subscription discount for 12 months and 50% off setup when the link is configured for discount. Partner commissions are calculated on subscription amounts actually collected after discounts; prepaid PayPal payments also create a commission ledger entry based on the collected prepaid amount, excluding setup.
- After verified plan payment, the platform creates a Retell demo LLM/agent from the discovery brief, associates it with the D1 customer workspace, and sends a Clerk invitation to the checkout email. Existing Clerk users are directed to sign in. The demo agent is not assigned a phone number and does not activate production routing.
- Client portal pre-live state: the paid Retell agent is stored with `avr_agents.status='demo'`. The receptionist panel must label this as a demo, explicitly state that it is not connected to a live phone number or production routing, and show number assignment as pending until Agency Admin assigns a number and agent.
- PayPal Live credentials are stored as Cloudflare Worker secrets on `avr-platform-api`: `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`. The Worker defaults to Live; `PAYPAL_MODE=sandbox` is an optional non-secret switch for a deliberate sandbox deployment. Do not put credential values in GitHub.
- New migrations to apply to the `avr-trust-lab` D1 database before deploying either Worker: `cloudflare/migrations/20261115_public_paid_onboarding.sql` and `cloudflare/migrations/20261115_paypal_partner_commissions.sql` (independent migrations; apply both). The platform Worker requires the existing Stripe webhook endpoint at `/webhooks/stripe` to receive checkout completion and subscription events. PayPal orders are captured server-side after buyer approval; the browser redirect alone never marks a payment paid.
- Admin Demo Requests displays paid onboarding state and supports retrying a failed Retell/Clerk provisioning step. Support is notified if provisioning fails after payment.
- Static JavaScript syntax checks and SQLite migration/insert-shape checks passed. Live PayPal capture, Stripe checkout, Clerk invitation delivery, Retell agent creation, partner attribution/commission, and the full browser flow have not yet been production-tested. Do not deploy until the D1 migrations and end-to-end checks are complete.

## Subscription overage protection — 2026-11-15

- Feature branch: feature/75-percent-overage-protection-2026-11-15. Not merged or deployed.
- New migration: cloudflare/migrations/20261115_overage_protection.sql adds per-customer overage_limit_minutes (0–2,000) and an idempotent warning/block notification ledger.
- New and existing customers default to 0 authorized overage until the administrator explicitly sets an allowance. Zero means calls stop after included minutes and available Minute Vault minutes are exhausted.
- The administrator can set an approved overage allowance in the customer workspace. Star69AI emails at 50% and blocks new inbound AI calls at 75% of that approved allowance.
- Retell phone numbers use the pre-answer inbound webhook at https://avr-platform-api.hisjarman.workers.dev/webhooks/retell/inbound. New number assignments attach it automatically; Agency Admin includes a bulk action to attach it to existing assigned numbers.
- The inbound handler verifies the Retell signature, maps the dialed number to its customer, checks account/subscription eligibility and current included/vault/overage usage, and returns the assigned agent only when eligible. A blocked call receives an empty inbound response.
- Calls already connected are not terminated by this guard; their usage can exceed the threshold, and concurrent calls can increase the overrun. Test this before promising an exact ceiling.
- The client portal displays the authorized overage allowance and the 75% stop point. The portal still correctly says overage amounts are estimates: Stripe metered usage reporting and automatic overage charging are not implemented by this branch.
- Do not enable PAYG_INGRESS_GATE_ENABLED; Flex still requires its separate wallet deduction and ingress tests.
- Before rollout: apply the migration, deploy the Worker, use Agency Admin → Agents & numbers → Enable call protection on assigned numbers, then test 0 allowance, 50% warning, 75% block, prepaid-term eligibility, suspended accounts, webhook retries, email failures and concurrency. No production D1 migration, Worker deployment, Retell number update or Stripe setting change was made by this branch.

## Prepaid pricing and setup-fee waiver update — 2026-11-14

- Approved prepaid offers: six months at 25% off the standard subscription total; twelve months at 35% off. Totals: Starter $670.50 / $1,162.20; Growth $1,120.50 / $1,942.20; Pro $1,795.50 / $3,112.20.
- Both prepaid terms waive the $99 setup fee completely. Monthly setup fees are collected through the public PayPal checkout; standard amount $99, discounted partner amount $49.50. Prepaid customers must never receive a setup invoice.
- Prepaid checkout uses a one-time PayPal payment and never creates a Stripe subscription. Stripe is reserved for monthly recurring subscriptions.
- New D1 migration adds `avr_customers.billing_cadence`; the Stripe checkout/subscription webhooks persist the selected cadence. The admin invoice workflow suppresses invoice creation for prepaid customers, both in its UI and server-side route.
- Challenge and partner discounts cannot stack with prepaid offers. Setup-fee waiver is not a commissionable payment.
- Deployment remains pending: apply both 2026-11-15 D1 migrations in order, deploy the platform and Trust Lab Workers, publish GitHub Pages, and verify checkout and admin behavior. No production deployment was made by this branch.

## Partner setup invoice administration and offer corrections — 2026-11-14

- Feature branch: `feature/verified-challenge-rewards-paypal-setup-2026-11-14`. Not merged or deployed.
- Added D1 migration `cloudflare/migrations/20261114_setup_invoice_paypal_admin.sql` for an auditable setup-invoice ledger. Apply it to the existing `avr-trust-lab` D1 database before deploying the Worker.
- Added admin-only Worker routes to list setup invoices, create server-priced drafts, and record sent/paid status. Server-side calculation is fixed at $99.00 standard or $49.50 for a customer whose stored attribution is a discounted partner referral. The client cannot submit or override the invoice amount.
- Added an Agency Admin "Setup invoices" tab. The administrator creates the invoice in PayPal under SIMIAPP CLOUD, pastes the PayPal invoice URL, marks it sent, and confirms paid only after checking PayPal. This remains as a legacy admin-assisted workflow for older records. New public customers use the PayPal Orders API checkout flow described above.
- Setup invoice commission remains zero: partner commissions continue to be calculated only on eligible collected subscription revenue, net of customer subscription discounts.
- Public prepaid pricing is now 25% off six months and 35% off twelve months. Totals: Starter $670.50 / $1,162.20; Growth $1,120.50 / $1,942.20; Pro $1,795.50 / $3,112.20. Both prepaid terms waive the $99 setup fee and are charged once through PayPal; no Stripe subscription or prepaid Stripe Price IDs are used. Monthly setup fees are collected through PayPal ($99 standard; $49.50 for eligible discounted partner referrals), then the monthly plan subscription is created through Stripe. The Worker stores billing cadence and the Admin setup-invoice workflow blocks invoices for prepaid customers.
- Removed the legacy `CALLSMART10` first-month coupon path from monthly checkout. Any manually supplied promo code now fails closed with `challenge_reward_redemption_not_yet_enabled`. Partner 15%-for-12-months monthly checkout remains, and prepaid offers remain mutually exclusive.
- AI Challenge reward verification is NOT complete in this branch. Browser localStorage remains learning progress only; challenge rewards are explicitly disclosed as not yet automatically applied. Do not issue or promise Starter/Pro/Expert reward discounts until server-side challenge-session verification, one-time customer redemption, Stripe 12-month coupons and the Expert setup-fee path are implemented and tested.
- Validation so far for the earlier implementation: Admin JavaScript parses; Worker JavaScript parses after stripping the module export for syntax-only validation; static checks confirm invoice UI, endpoints, pricing totals and legacy coupon rejection. This pricing update adds a new D1 billing-cadence migration; it has not been applied. No live PayPal invoice, browser/live checkout test or deployment has been performed.
- Next steps before merge: inspect the full PR diff; test the migration against a D1 staging copy; test admin endpoints for standard/discounted customers, idempotent invoice creation, invalid transitions and URL validation; test the setup invoice UI; then implement server-authoritative challenge sessions and Stripe reward redemption in a separate reviewed phase.

# Star69AI — Project Context Handoff

Last consolidated: 2026-11-11

Read this file before making substantial changes. It records current project decisions, technical architecture, development rules and known follow-ups. Verify all implementation claims against the current repository and live provider configuration.

## Brand and business

- **Brand:** Star69AI
- **Canonical website:** https://star69ai.com
- **GitHub repository:** https://github.com/hisjarman/star69ai
- **Founder:** Solomon Jarman
- **Business/operator disclosure:** SIMIAPP CLOUD
- **General email:** hello@star69ai.com
- **Support/reply-to:** support@star69ai.com
- **Hosting:** GitHub Pages for static pages; Cloudflare Workers and D1 for backend services.
- The previous project branding has been retired. Use Star69AI branding in current user-facing materials, page titles, footers, email templates, repository descriptions and documentation. Do not reintroduce the previous domain as the current website.

## Product positioning

Star69AI is a managed, done-for-you AI receptionist service, not a self-service software platform. The agency builds, configures, customizes, tests and maintains each client's receptionist and phone workflow.

Target customers include roofing, plumbing, HVAC, general contractors, cleaning, automotive services and real estate businesses.

Depending on customer configuration and third-party provider capabilities, the service may answer calls, respond to approved FAQs, capture and qualify leads, assist with appointment requests, route/escalate calls, and provide call summaries and call activity.

## Visual and UX direction

- Premium, modern interface with a dark space-inspired visual language where appropriate.
- The approved brand palette is purple #E156FF, blue #21B7FF, and green #14D251, with darker accessible companions #A52AB8, #0875A9, and #167A3D for text on light surfaces. Use green as the primary action/status accent, blue for supporting interaction and links, and purple for selective emphasis. The older lime/sky-blue direction is superseded by docs/STAR69AI_DESIGN_CONTENT_STANDARDS.md.
- Prioritize readable contrast, calm spacing, accessible focus states and responsive layouts.
- Keep navigation and Client Login visible and usable on desktop and mobile.
- Do not put onboarding promotions in the top banner if they push navigation or login off-screen.
- Homepage hero direction: Earth-at-night / illuminated global AI network artwork and receptionist model, with speech bubble visually aligned near the model's mouth.
- Use supplied assets from `assets/` after verifying exact filenames and current usage.
- Dashboard preview figures must be identified as illustrative; never imply sample data is real customer performance.
- Retell-wide metrics must be attributed to Retell and distinguished from Star69AI customer results.

## Public website and content

GitHub Pages publishes the static site from the repository root using the root `CNAME` file. Do not move the site back into a `docs/` publishing folder.

The site includes marketing pages, pricing, FAQs, demos, industries, insights, the weekly business-comedy series, partner pages, the Trust Lab and the Receptionist Architect challenge. Preserve existing SEO metadata, canonical URLs, navigation, footer, forms and responsive behavior when editing shared components.

### Demo/discovery form

The public homepage quick lead form and the full `get-started.html` discovery form use the dedicated platform Worker as the primary intake path:

```text
POST https://avr-platform-api.hisjarman.workers.dev/api/demo-requests
Formspree backup: https://formspree.io/f/mrppjqdb
```

- Homepage quick leads are stored in `avr_demo_requests` with `discovery_complete=0`.
- The full discovery form sends the structured business brief to the same Worker and can attach it to the matching quick lead when safe; completed discovery is stored in `discovery_json` with `discovery_complete=1`.
- The Worker attempts a transactional Resend receipt email after storing the lead. Email failure does not undo the saved inquiry; the response tells the visitor when a confirmation email may not arrive.
- The forms retain Formspree as a native fallback when JavaScript is unavailable. If the Worker request fails at the network level after JavaScript has intercepted the form, the form is submitted through Formspree for manual follow-up. A Formspree-only backup is **not** automatically inserted into the admin demo queue and must not be treated as a completed D1 discovery record.
- An explicit HTTP error from the Worker is shown to the visitor; it is not silently bypassed by Formspree.
- A quick lead cannot create a demo agent. Full discovery and administrator approval are required.
- Demo creation does not purchase or assign a phone number, create a customer subscription, or activate production routing.
- After an administrator records that a demo was presented and the prospect accepts (status `converted`), the Admin Console can create a linked **pending** customer workspace. This action does not assign the demo agent or a phone number, choose a plan, create a Stripe subscription, or activate production routing. D1 migration `0004_demo_request_customer_link.sql` must be applied before deploying this Worker change.
- This flow still requires live browser testing on desktop and mobile, including a controlled Worker-network-failure test and verification of the Formspree inbox.

The form is for demo/discovery follow-up only; it does not create an account or activate a subscription.

## Published pricing

| Plan | Monthly price | Included voice minutes | Advertised overage |
|---|---:|---:|---:|
| Starter | $149 | 300 | $0.49/minute |
| Growth | $249 | 600 | $0.39/minute |
| Pro | $399 | 1,000 | $0.29/minute |

- One-time setup fee: $99, invoiced separately.
- Do not silently change these published values in one page or portal surface without synchronizing all pricing displays and legal summaries.
- Automatic Stripe metered overage billing is not to be claimed as implemented until usage meter reporting, reconciliation, rounding rules and end-to-end billing tests are complete.
- Usage estimates must be labeled as estimates until actual billing is implemented and verified.
- Any annual offer or setup-fee waiver must match the active checkout and written offer terms.

## Minute Vault and published billing rules — 2026-11-15\n\n- Monthly plans: Starter $149 / 300 minutes / $0.55 overage; Growth $249 / 600 minutes / $0.45 overage; Pro $399 / 1,200 minutes / $0.36 overage. Enterprise plans are custom-tailored.\n- The Minute Vault is a server-side D1 ledger. Unused included minutes accumulate while the account remains active and paid. Current-month included minutes are consumed first, followed by the oldest vaulted minutes (FIFO). Overage begins only after included minutes and the available vault are exhausted.\n- Vault minutes have no monetary, refund, transfer, sale or account-credit value. They are preserved through upgrades/downgrades; future monthly grants follow the new plan. Cancellation forfeits the entire remaining vault balance. Stripe subscription cancellation and admin account closure/suspension clear the vault, with a forfeiture audit event.\n- Prepaid customers are paid outside Stripe; active six-/twelve-month prepaid accounts also qualify for vault accrual.\n- Migration `20261115_unused_minute_vault.sql` must be applied to D1 before deploying the Worker. The Worker and portal change in `feature/unused-minute-vault-2026-11-15` are not production-ready until the migration, tests and Worker deployment are completed.\n\n## Technical architecture

- **GitHub Pages:** public website, client portal at `/client/`, admin console at `/admin/`.
- **Cloudflare Workers:** server-side API and integrations.
- **Cloudflare D1:** application data; existing D1 binding and table prefixes must be preserved.
- **Clerk:** authentication. Worker-side JWT verification and authorization are required; hiding controls in browser code is not sufficient.
- **Stripe:** subscription checkout, customer billing portal and signed webhook processing.
- **Retell AI:** voice agents, phone numbers, assignments, call webhooks and call analysis.
- **Formspree:** public demo/discovery form.
- **Resend:** transactional email.
- The platform API Worker has been documented as `avr-platform-api` at `https://avr-platform-api.hisjarman.workers.dev`. Verify the deployed Worker URL and routes before changing configuration.
- The separate Trust Lab Worker and its contact, newsletter and partner workflows must remain independent and operational.
- Do not use Render. Do not restore obsolete Manus/CallPilot deployment paths.

## Repository map

- Root HTML/CSS/JS: public marketing site.
- `client/`: customer portal frontend.
- `admin/`: agency admin frontend.
- `cloudflare/platform-worker.js`: platform API.
- `cloudflare/trust-lab-worker.js`: Trust Lab/contact/newsletter/partner API.
- `cloudflare/schema.sql` and `cloudflare/migrations/`: database schema and migrations.
- `docs/`: implementation notes.
- `assets/`: brand, illustration and media assets.

## Email and domain configuration notes

- Resend domain `star69ai.com` has been reported verified.
- Production sender is `Star69AI <hello@star69ai.com>`.
- Support/reply-to address is `support@star69ai.com`.
- Branded email templates use the Star69AI logo and footer.
- Cloudflare Worker secrets must be managed in Cloudflare, never committed here.
- Never print or expose API keys, Clerk secrets, Stripe secrets, webhook signing secrets or customer information in source code or documentation.

## Implementation history verified in this conversation

- PR #70 added Star69AI branding to outgoing email templates and was merged to `main`. Platform and Trust Lab Workers were deployed after that change; deployment success was confirmed, but do not infer endpoint health from deployment status alone.
- PR #71 changed the demo request form from JavaScript `fetch()` to native Formspree POST and was merged to `main` at commit `afe041a6bd39249e43de261618ca247ac41f7b5f`.
- The actual Formspree submission and return confirmation have not yet been verified with a real end-to-end request.
- The prior call-details email attempt showed a generic portal error even though an earlier Resend email was delivered. That earlier delivery predated the new email-branding deployment and does not prove the current manual email path is healthy. If revisiting, add safe diagnostic error codes without exposing provider secrets or private details.

## Security and production-readiness checks

Before onboarding customers, verify:

1. Clerk frontend publishable key and Worker issuer belong to the same production Clerk instance.
2. Cloudflare Worker bindings, secrets and allowed origins are configured for the production domain.
3. Admin authorization is enforced in the Worker and customer records are isolated by tenant.
4. Stripe Price IDs, checkout, portal, signed webhooks, cancellation and payment-failure handling work in test mode before live mode.
5. Retell webhook signatures are validated, events are deduplicated, and calls are associated with the correct client.
6. Required D1 migrations are applied. A static website deployment does not apply SQL migrations or deploy Worker code.
7. Recording consent, access control, retention, deletion and applicable privacy/legal requirements are addressed.
8. Email delivery is tested for automatic call summaries, manually requested call details, support notifications and Trust Lab flows.
9. The Formspree discovery form is tested with a real submission and confirmed receipt.
10. Overage rates are not automatically charged until Stripe metering, rounding, reconciliation and billing tests are complete.

Known prior issue to recheck against current source: a portal request reported `D1_ERROR: no such table: avr_addon_orders`. Inspect Worker queries, frontend calls and migrations before adding or changing a table.

## Development rules

- Always inspect the root README, this handoff, current branch, related source files and relevant migrations before making substantial changes.
- Work in a dedicated branch. Do not silently commit feature work to `main`.
- Inspect diffs and test changes before proposing a merge. Never merge to `main` without the user's explicit approval.
- Keep commits focused and descriptive; report branch, PR and commit details.
- Preserve the GitHub Pages root layout, CNAME, navigation, Client Login, SEO, Formspree, Trust Lab, partner workflows and existing working functionality.
- Use GitHub Pages for static hosting and Cloudflare Workers/D1 for backend needs. No Render.
- Never commit secrets or customer data.
- Do not claim a feature is deployed, healthy, billable or production-ready unless the relevant behavior has been verified.

## Open launch work

- Verify the Formspree native POST with an actual demo request and confirm receipt.
- Verify current Clerk production configuration.
- Run customer/admin authorization and tenant-isolation tests.
- Verify Stripe checkout, customer portal, webhooks and cancellation; complete the overage-metering implementation before enabling automatic overage charges.
- Verify Retell agent/number sync, assignments, call events, recordings and analysis.
- Verify call email delivery after the Star69AI template deployment.
- Reconcile the prior `avr_addon_orders` missing-table report against current schema and Worker code.
- Update this handoff whenever brand, architecture, implementation or launch status changes.


## Star69AI logo delivery update — 2026-11-11

- Canonical supplied logo source: `assets/star69ai-logo.png` (approximately 1.95 MB in the repository).
- The shared platform email wrapper now places the supplied logo in the email footer using the PNG-compatible endpoint `https://star69ai-concierge.hisjarman.workers.dev/brand-logo.png`. Both automatic call-summary emails and manually requested call-details emails pass through this wrapper.
- The Concierge Worker serves `/brand-logo.png` (500px target, PNG for email-client compatibility) and `/brand-logo.webp` (440px target, WebP for browser display) from the canonical GitHub logo source using Cloudflare image resizing. Responses are cached for reuse; a source-fetch fallback is retained if transformation is unavailable.
- Concierge header now uses the horizontal Star69AI logo, with a compact mobile width. The Concierge browser icon uses `assets/favicon.svg`.
- Deployment to Cloudflare Worker `star69ai-concierge` completed on 2026-11-11 (deployment ID `4e03ab9755f74934877b8a7e36d173c2`).
- Verification limitation: the tool environment blocks direct requests to this Worker hostname, so the optimized response size and visual rendering could not be independently confirmed here. Verify `/brand-logo.png` and `/brand-logo.webp` in a browser and check the `X-Logo-Transform` response header. Do not claim an exact byte reduction until measured.

- The shared email-wrapper change was deployed to `avr-platform-api` on 2026-11-11 (deployment ID `7cc3259dfa0f4b6783e6889cf3ecaa78`). Post-deployment settings inspection confirmed the existing `CLERK_SECRET_KEY`, `RESEND_API_KEY`, and `RETELL_API_KEY` secret bindings plus the D1 binding remained present.
- GitHub implementation branch: `branding/optimized-logo-email-concierge`; PR #73: https://github.com/hisjarman/star69ai/pull/73 (merged to main on 2026-11-11; squash commit `afa4fbff990e74c1abcd08c1d7f9c745fa62cb45`).

- Final Concierge deployment after strengthening the image-source fallback: `58317661beb449f6bbc446a43c883e8a` (2026-11-11). This supersedes the earlier Concierge deployment ID listed above.


## AI Concierge hero model layout — 2026-11-11

- The deployed `star69ai-concierge` Worker now uses a wider two-column desktop layout: chat on the left and the same virtual receptionist image used by the homepage hero on the right (`assets/Asistente virtual con headset futurista.png`).
- The model image is served through `/receptionist-model.webp`, which requests a 760px Cloudflare image transformation and caches the result; it falls back to the original PNG if transformation is unavailable.
- On narrow screens, the model becomes a compact banner above the chat so the conversation and composer remain usable.
- Worker deployment ID: `ec94eecee3fc451f9df5f846f2b11cfc` (2026-11-11). Existing AI and D1 bindings were preserved.
- The deployed Worker source is now tracked at `cloudflare/concierge-worker.js`.
- Verification limitation: requests to the Worker hostname are blocked in the current tool environment, so the page and image transformation still need browser verification. Do not claim the visual result or WebP byte reduction is confirmed until checked in a browser.


## Click-to-chat homepage bubble and Concierge layout correction — 2026-11-11

- The homepage receptionist speech bubble is now an accessible button with the message: “I can help you design a receptionist around the way your business works.” Visitors can click it to open the embedded AI Concierge panel without leaving the homepage. The panel includes a close control, Escape-key support, dialog labeling, and an iframe title.
- The embedded panel loads the existing `star69ai-concierge` Worker UI; it reuses the same `/api/chat` conversation endpoint rather than creating a second chat implementation. The Worker already allows `https://star69ai.com` and `https://www.star69ai.com` as frame ancestors.
- The Concierge desktop frame now gives the chat approximately 70% of the workspace and confines the receptionist portrait to a narrow right-side column with a 470px maximum image height. At 640px and below, the model becomes a compact 112px header row and the chat occupies the remaining frame height. This prevents the portrait from forcing the chat/composer below the visible frame.
- Updated Concierge Worker deployed successfully to Cloudflare Worker `star69ai-concierge` on 2026-11-11 (deployment ID `50dc3138a93d4ce8b372ef044a0b912d`). The existing AI and D1 bindings were preserved; Cloudflare accepted the module upload with no validation errors.
- GitHub changes are on `feature/concierge-hero-chat-launch`, based on the still-open PR #74 branch. The homepage iframe and styling are not live on GitHub Pages until the dependent PR is merged. No merge to `main` is performed.
- Browser verification of the homepage iframe, live chat submission, and responsive layout remains required; the tool environment previously blocked direct requests to the Worker hostname.


## Concierge full-width header and chat-only frame — 2026-11-11

- Reworked the Concierge page so the Star69AI logo, Concierge title, descriptor, online status, and receptionist model share one full-width branded header. The model is positioned as a small visual at the upper-right of that header, not in a separate column or chat content area.
- Removed the split model/chat workspace. The conversation history now fills the main frame below the banner, and the message composer remains anchored at the bottom of that chat frame.
- Responsive header rules shrink the logo and model on mobile while preserving the full-height chat and composer.
- Updated Worker successfully deployed to Cloudflare `star69ai-concierge` on 2026-11-11 (deployment ID `a3517580524a4825aaa36d259e9f8641`); existing AI and D1 bindings were retained.
- Change committed to `feature/concierge-hero-chat-launch`; PR #75 remains open and depends on PR #74. No GitHub Pages merge performed.


## Merge recovery — 2026-11-11

- PR #74 merged to `main` on 2026-11-11 (squash commit `8e31edd75952f013ff0f887069e890145072738d`).
- PR #75 was retargeted to `main` but GitHub reported a content conflict because the Concierge Worker source was independently added on both branches. Its homepage/Worker changes were transplanted to `feature/concierge-chat-homepage-merge`, created from the post-PR-74 `main` commit, to preserve the full-width branded header and chat-only main frame while retaining the homepage click-to-chat implementation.
- The replacement branch carries the current full-width Concierge Worker, homepage bubble/panel integration, responsive panel styles, and this handoff. PR #75 remains unmerged until the replacement PR is reviewed/merged.
- Latest Worker deployment ID for the full-width header/chat-only frame: `a3517580524a4825aaa36d259e9f8641` (2026-11-11). Homepage GitHub Pages activation still requires merging the replacement PR.


## AI-assisted discovery form coaching — implementation branch, 2026-11-11

- New feature branch: `feature/ai-discovery-form-coach` (based on the post-PR-76 `main` commit).
- Adds an optional AI Discovery Coach panel to `get-started.html`, using the existing `star69ai-concierge` Worker UI and chat endpoint.
- The form page shares a limited allowlist of business/call-handling fields with the embedded Concierge: industry, service area, services, call volume, hours, caller tasks, FAQs, recording/transcription preference, outbound AI preference, SMS preference, phone setup and additional notes. It sends the active field label/value plus current step so the AI can offer contextual examples while the visitor types.
- Contact name, email, phone, business name, website, human escalation contact and privacy-consent choice are excluded from the context payload. The UI explains what is shared and warns visitors not to enter sensitive/customer data.
- Worker independently re-applies the field allowlist and length limits before adding the form context to the model prompt. Visitor-provided values are explicitly treated as untrusted data, not instructions.
- The public form continues to submit natively to Formspree `https://formspree.io/f/mrppjqdb`; the AI helper does not submit the form or alter the user's answers.
- This is an implementation branch only. No Worker deployment, Formspree configuration change, D1 change or merge to `main` has been performed. Test privacy behavior, mobile layout, contextual suggestions and form submission before merge/deploy.


### AI Discovery Coach refinements and validation — 2026-11-11

- The coach receives live updates as visitors focus, change or type into allowlisted discovery fields; it also receives the last active field when opened and refreshes context when the visitor moves between form steps.
- The Worker enforces the allowlist a second time and limits each field before model inference. The Concierge prompt explicitly treats all visitor-provided form values as untrusted data and instructs the model to explain fields, tailor examples to industry/prior answers, and never edit or submit the form.
- Updated the Get Started privacy note to clarify that dedicated contact/business identity fields are excluded and that visitors should not place those details in free-text fields.
- Updated privacy.html to disclose optional Cloudflare Workers AI processing for selected business and call-handling answers when the visitor opens the coach.
- Corrected assistant panel button typography and whitespace normalization in the field-label extraction.
- Static source checks passed for the assistant entry point/panel, parent-to-iframe context messaging, Worker-side allowlist and model prompt, privacy disclosure, and retention of the existing native Formspree POST. Live browser testing, real inference and end-to-end form submission remain outstanding.
- No Cloudflare Worker deployment or GitHub Pages deployment has been performed from this feature branch. Merge and Worker deployment require review/approval; do not claim the helper is live.


## AI Discovery Coach merged to main — 2026-11-11

- PR #77 merged successfully to `main` on 2026-11-11. Squash merge commit: `839a5d0e660349fa927847371f38584280e9beca`.
- The Get Started discovery form now includes an optional AI coach panel using the existing Star69AI Concierge iframe. It receives the current step, active field and allowlisted business/call-handling answers as the visitor focuses, types, changes answers and navigates steps.
- The Concierge shows the active field and can offer industry-tailored explanations and example wording for longer descriptions. The model is instructed not to invent business facts or submit/change the form.
- The client-side and Worker-side allowlists exclude dedicated contact and identity fields; Worker-side length limits and untrusted-input handling remain in place. Visitors are warned not to put sensitive or customer data in free text.
- `privacy.html` discloses optional Cloudflare Workers AI processing. The existing Formspree endpoint `https://formspree.io/f/mrppjqdb` remains unchanged.
- Static source checks passed before merge. **The new Worker source has not yet been deployed to Cloudflare**, and live browser, real AI inference, mobile rendering and end-to-end Formspree submission tests remain outstanding. Do not describe the AI coach as live until the Worker is deployed and tested.


## Hero model chat invitation visibility — 2026-11-11

- New branch `feature/hero-model-chat-cta` makes the homepage hero receptionist's interactive nature explicit. The speech bubble now says the pictured receptionist is the AI and invites visitors to chat about their business, ask questions or explore capabilities.
- The chat control is restyled as a prominent dark teal/lime bordered call-to-action card with a clear "START CHATTING WITH ME" action label, keyboard focus and hover feedback, including a compact mobile treatment.
- Existing dialog/iframe wiring and Concierge URL are unchanged. The click opens the live Star69AI Concierge panel.
- Awaiting branch checks/PR merge and live browser verification. The AI Discovery Coach Worker deployment is tracked separately below.


## AI Discovery Coach Worker deployment and hero chat CTA — 2026-11-11

- Deployed the merged `main` version of `cloudflare/concierge-worker.js` to Cloudflare Worker `star69ai-concierge` on 2026-11-11.
- Cloudflare upload/deployment ID: `a16f3e3c-1619-420d-a6db-e606eaaf6102`; deployed Worker version ID: `f7a8fd29-984b-4117-acd2-fa634f6a7e74`; 100% of traffic assigned to this version.
- Verified Worker settings after deployment: AI binding `AI` retained; D1 binding `DB` retained with database ID `6cf68b12-2aa8-4ed4-9f92-8a7824520d1a`; compatibility date remains `2026-11-10`.
- The deployed Worker source includes the discovery form context message receiver, Worker-side safe field allowlist and length limits, untrusted-input treatment, practical form-coach prompt, and active-field indicator in the Concierge UI.
- Homepage hero CTA visibility update merged in PR #78, squash commit `d5372a67561e0d1fad9ed05b01c1417d33b5a6e1`. The hero receptionist now speaks in first person, explains visitors can chat about their business, and shows a prominent "START CHATTING WITH ME" action label. The existing accessible dialog and iframe still open the deployed Concierge.
- GitHub Pages source changes are merged to `main`. Workflow run #395 (commit `317585197e49a54ef413d8899682364a7106e331`) was observed queued and then in progress; final Pages publish status was not yet available at the last check. Track at https://github.com/hisjarman/star69ai/actions/runs/42966615120.
- Static source checks passed. A live external browser request could not be completed in this tool environment (DNS/network resolution unavailable), so do not claim visual browser or end-to-end inference/form submission verification. The Cloudflare API confirms the new Worker version is deployed and active.


## Compact hero receptionist prompt and discovery form readability — 2026-11-11

- Homepage hero receptionist is presented as a small portrait/avatar beside a compact speech-bubble CTA rather than a large portrait occupying the hero column.
- The bubble asks visitors to ask the AI receptionist a question and remains the clickable entry point to the existing Concierge dialog/iframe. Chat URL and behavior are unchanged.
- Get Started discovery form typography is enlarged for readability: labels, field values, placeholders, step headings, helper copy, privacy disclosures, consent text and buttons receive larger sizes, stronger contrast and more comfortable line-height. Mobile inputs use 16px to avoid browser zoom on focus.
- Changes are on `feature/compact-hero-chat-readable-discovery`; no merge, Pages publication or Worker deployment has been performed.
- Static source checks: verify hero CTA text/ARIA label and discovery stylesheet overrides. Browser/mobile visual checks and live chat/form submission tests remain outstanding.


## Compact hero receptionist and discovery form readability merged — 2026-11-11

- PR #79 was squash-merged into `main` on 2026-11-11.
- Merge commit: `62d120cea23cda699a40fa80b18868767d6fc5d1`.
- The homepage hero receptionist is now styled as a compact avatar with an adjacent speech bubble inviting visitors to ask a question. The bubble remains the clickable trigger for the existing Concierge chat iframe/dialog.
- The Get Started discovery form now has larger, higher-contrast labels, inputs, placeholders, instructions, privacy/consent copy and buttons; mobile form inputs use 16px text.
- Static source checks passed before merge. Browser visual verification, live chat, and Formspree submission testing remain outstanding.
- GitHub Pages publication status was not verified at the time of this handoff update. No Worker deployment was needed because the Concierge backend was unchanged.


## Expanded industry discovery and AI coach — 2026-11-11

- Added a grouped industry selector to `get-started.html`, covering home services/contractors, automotive/transportation, healthcare/wellness, professional services, hospitality/retail/lifestyle, and community organizations.
- Added an optional custom-industry description that appears and becomes required only when the visitor chooses “Other / not listed.” The custom field is disabled and cleared when not in use.
- Added `industryOther` to the client-side and Worker-side AI context allowlists. The coach receives the custom industry description only as business context; dedicated identity/contact/escalation/consent fields remain excluded.
- Expanded the Concierge instructions to recognize the supported industry groups and provide relevant call scenarios plus sample receptionist responses when helpful. Examples must be labeled illustrative and cannot invent a business's actual services, prices, hours, policies or capabilities.
- Preserved the existing three-step discovery form, native Formspree POST destination (`https://formspree.io/f/mrppjqdb`), privacy boundaries, and existing Worker endpoints.
- Implementation branch: `feature/expanded-industry-discovery`. No merge to `main`, GitHub Pages publish, Cloudflare Worker deployment, or live end-to-end test has been performed. Review the branch, test desktop/mobile selector behavior and custom-industry validation, verify coach context and scenarios, then test a real Formspree submission before deployment.

## Manual call-details email reliability fix — 2026-11-11

- Investigation compared historical Resend delivery records and Cloudflare Worker versions. A successful manual call-details send was recorded on 2026-11-11 at 01:15 UTC from `hello@star69ai.com`, before the Star69AI email-wrapper deployment. The record's body retained legacy AIVirtualReceptionist.online wording. Current Worker configuration was inspected without exposing secret values: `RESEND_API_KEY` remains a secret binding, `RESEND_FROM_EMAIL` is `hello@star69ai.com`, and the D1 binding remains present. This historical delivery is not proof of current end-to-end reliability.
- The active Worker source uses the Star69AI shared email wrapper for manually requested call details. The manual send path previously made one Resend request, logged the full provider response, and converted most non-401/403 failures into the same generic `call_email_send_failed_try_again` error.
- Branch `fix/manual-call-email-reliability` updates the manual path to retry once after transport errors, HTTP 429 responses or HTTP 5xx responses, with a short delay and the same Resend idempotency key to reduce duplicate-send risk. Permanent provider rejections are not retried.
- Failure logs now contain only the HTTP status, a sanitized provider error identifier, attempt number, or transport error class. They do not log the provider response body, recipient address, email content, call transcript, or secrets.
- The Worker now returns distinct error categories/statuses for sender configuration (503), rate limiting (429), temporary provider/transport unavailability (503), and permanent provider rejection (502). The client portal maps these categories to actionable messages while preserving the existing manual-send form and endpoint.
- Existing Star69AI sender, brand wrapper, logo/footer, email subject, call content, tenant-scoped call lookup, recipient validation and idempotency-key format are preserved.
- Implementation is on `fix/manual-call-email-reliability`; source checks confirmed the bounded one-retry loop, stable idempotency key, sanitized logging and client error mappings. A live Resend failure simulation and authenticated browser send test have not been run. No Cloudflare configuration, secrets, D1 data, or Worker deployment were changed.
- Merge authorization does not authorize Worker deployment. After merge, deploy `cloudflare/platform-worker.js` separately to `avr-platform-api` only with explicit deployment approval, then verify a manual send and inspect Worker logs for any categorized failure.

## Manual call-details email reliability deployment — 2026-11-11

- PR #81 was merged to `main` at commit `199555f5c015d4f189e6c94476d5acebf92d9a1f`. It adds a single bounded retry for transient Resend/network failures, stable idempotency-key reuse, privacy-safe structured diagnostics, distinct provider error codes, and actionable client-portal messages.
- The merged `cloudflare/platform-worker.js` was deployed to Cloudflare Worker `avr-platform-api` on 2026-11-11.
- Active Worker version: **27**, version ID `16b6c7fc-f0f5-4f21-939b-e7487ce7ac1e`.
- Deployment ID: `7805c97c-1c5f-49a9-bce3-04643c998871`; Cloudflare deployment inspection confirmed the version is receiving **100%** of traffic.
- Existing production bindings were preserved: `ADMIN_EMAILS`, `ALLOWED_ORIGINS`, `CLERK_ISSUER`, D1 binding `DB`, and secret bindings `CLERK_SECRET_KEY`, `RESEND_API_KEY`, and `RETELL_API_KEY`. No secret values were read or changed. D1 database binding ID and compatibility date were retained.
- No D1 schema/data, Stripe configuration, Resend configuration, or other Worker was changed.
- Verification limitation: direct HTTP access to `https://avr-platform-api.hisjarman.workers.dev/health` is blocked by the current tool environment (HTTP 403 generated by the tool network policy). Cloudflare's deployment/version APIs confirmed the 100% rollout and bindings, but the manual email button has not yet been exercised in an authenticated browser session. A real manual-send test and transient-provider-failure test remain outstanding.


## Resend sender-binding correction — 2026-11-11

- Post-deployment verification found that Worker version 27 did not contain the plain-text RESEND_FROM_EMAIL binding. This was an error in the version-upload metadata, not a Resend API-key failure. Version 26 had the sender configured as hello@star69ai.com.
- Corrected by uploading the merged main source from cloudflare/platform-worker.js again and explicitly restoring RESEND_FROM_EMAIL=hello@star69ai.com.
- Corrected Worker version: 28, version ID 5ad3cff5-705e-4546-bd63-d982c5982b76.
- Active deployment ID: 7a9dece9-39e4-444d-a459-1c961b23528d; Cloudflare deployment inspection confirms version 28 receives 100% of traffic.
- Verified version 28 bindings include RESEND_FROM_EMAIL=hello@star69ai.com, RESEND_API_KEY (secret binding), CLERK_SECRET_KEY (secret binding), RETELL_API_KEY (secret binding), D1 DB (same database ID), and the existing ADMIN_EMAILS, ALLOWED_ORIGINS, and CLERK_ISSUER values. Secret values were not read or changed.
- No D1 data/schema or unrelated service configuration was changed. A live authenticated manual-send test is still required to confirm delivery; if it fails, inspect the new categorized Worker logs and Resend response status rather than assuming the sender configuration is still missing.


## Discovery form usability and accessibility update — 2026-11-11

- Branch: feature/discovery-form-ux-accessibility (based on main). No changes were made to main and no deployment or merge has occurred.
- Updated get-started.html to make the discovery form feel lower-pressure: the intro explains that most questions are optional, and step 2 tells visitors a short answer is enough and they can skip uncertain items.
- Added an explicit affirmative recording/transcription preference, alongside no-recording, transcript-only and discuss-first choices. The copy states that recording/transcription is subject to legal review, caller notice/consent, access controls and retention settings; this is a preference only, not automatic recording activation.
- Added optional multi-select feature interests: appointment booking, call recordings/transcripts, emailed summaries, lead qualification, live transfers/urgent escalation, after-hours coverage, multiple languages, software integrations, consent-based SMS follow-ups, and other workflows.
- Updated app.js so the AI Discovery Coach receives the selected optional interests and the Formspree brief includes every checked option. The native POST flow and Formspree endpoint https://formspree.io/f/mrppjqdb are preserved. No credentials or external services changed.
- Added high-contrast typography, readable helper/disclosure text, clearer form controls, accessible focus and mobile single-column preference cards in contact.css. Overrides are scoped to the Get Started/onboarding form to avoid changing unrelated pages.
- Validation status: source-level replacement checks passed during editing. Browser/mobile visual verification, keyboard testing, Formspree delivery test, and color-contrast measurement are still required before merge/publish.

- Pull request: #82 (https://github.com/hisjarman/star69ai/pull/82), merged to main on 2026-11-11 at commit `1388731013d4cb3b13c60d08d5111fa0a8d29dba`. A follow-up source correction restored actual line breaks in app.js after the optional-checkbox context and Formspree summary logic was added. Automated browser testing and a live Formspree delivery test remain outstanding.


## Technical SEO and AI crawler implementation — 2026-11-11

- SEO implementation is prepared on branch `seo/technical-crawlability-ai-discovery`; production branch `main` remains unchanged pending explicit approval to merge.
- Confirmed production site architecture: repository-root GitHub Pages publishing with root `CNAME` set to `star69ai.com`. Do not move publishing to `docs/`.
- Root `robots.txt` allows public marketing, editorial, pricing and public Trust Lab content. It explicitly excludes `/client/`, `/admin/`, `/api/`, `/dashboard/`, `/private/` and `/newsletter-admin.html`; OAI-SearchBot and PerplexityBot have explicit public crawl allowances with the same private-path exclusions. Robots directives are not access control; Clerk and Worker authorization remain the security boundary.
- Root `sitemap.xml` has been reconciled against the known static public routes. It includes marketing, industry, blog, challenge, insights, Trust Lab, partner and legal pages; it excludes client/admin and API routes.
- Homepage title and description now emphasize the managed service. Homepage Open Graph/Twitter metadata and JSON-LD Organization, WebSite and Service entities are included. Structured data does not assert unverified ratings, reviews or Star69AI customer-performance statistics.
- Four insights pages had canonical and Open Graph URLs on the retired `aivirtualreceptionist.online` domain; these are corrected to `star69ai.com`.
- Public Trust Lab dashboard and partner landing page have self-referencing canonicals; Trust Lab and public legal pages also have self-referencing canonicals.
- Client and admin portal entry pages carry `noindex,nofollow,noarchive` metadata and are excluded from robots crawling and the sitemap.
- IndexNow verification key file is `c2bce683c78de699b10abff8601ac838.txt`. This is a public verification token, not an application secret. `scripts/submit-indexnow.ps1` reads the published sitemap and submits its URLs after deployment.
- After merge/deployment, still verify live HTTP status and redirects; ensure GitHub Pages publishes root files; inspect rendered HTML and canonical URLs; validate JSON-LD; submit the sitemap in Google Search Console and Bing Webmaster Tools; test the IndexNow key URL and submission; review Cloudflare security events for crawler challenges.
- DNS ownership verification and Search Console/Bing account actions must be completed by the account owner. Sitemap submission, IndexNow notification and live URL tests do not guarantee indexing or ranking.

## Legacy HelloAnswer script removal — 2026-11-11

- Removed the obsolete HelloAnswer client widget script (`clients.aivirtualreception.online/w/w_xin7g6jkr6au9gqlo18h.js`) from the homepage `index.html` on branch `seo/technical-crawlability-ai-discovery`.
- The script was confirmed to be a legacy HelloAnswer integration and is no longer needed. The current Star69AI Concierge remains embedded through the existing `star69ai-concierge` Cloudflare Worker iframe and its homepage click-to-chat controls; those were not changed.
- Verified the retired HelloAnswer hostname no longer appears in the homepage source. No other scripts, chat behavior, backend configuration or production branch were changed.


## Hero Concierge left-rail placement — 2026-11-11

- Implementation branch: `fix/hero-concierge-left-rail`, based on the current `main` commit after the technical SEO / obsolete HelloAnswer cleanup. Pull request #84 (https://github.com/hisjarman/star69ai/pull/84) was merged to `main` on 2026-11-11 at squash commit `24192f2566601f40f80c864e80b1950db2c9869c`.
- Updated `homepage-refresh.css` with a final, scoped layout contract for the homepage hero. At desktop widths, the hero reserves a dedicated left column for the receptionist avatar and clickable AI prompt, while the sales copy remains in a separate right column. The assistant prompt is anchored within that left rail and cannot sit over the sales headline or sales copy.
- At tablet and mobile widths, the assistant remains left-aligned in its own row above the sales copy instead of overlapping it. The existing model asset, prompt text, accessible button, Concierge iframe URL, and chat behavior are unchanged.
- When opened, the Concierge chat panel is anchored to the lower-left side of the viewport on desktop so it does not cover the sales pitch. On mobile it expands within the viewport margins for usable chat controls.
- This is a CSS-only change; no Worker, D1, authentication, form, SEO metadata, or provider configuration was changed.
- Validation performed: inspected the current homepage DOM, stylesheet load order, existing competing hero overrides and the active chat iframe markup; confirmed the new override is appended to the final-loaded `homepage-refresh.css`. PR #84 was merged as noted above. A real desktop/mobile browser visual test and live chat submission test remain outstanding because browser access to the deployed site/Worker is unavailable in this tool session.


## Discovery Coach side-by-side UX implementation — 2026-11-11

- Working branch: `ux/discovery-coach-side-by-side-2026-11-11`, created from the verified current `main` after PR #84 and PR #82 had both merged. Pull request #85 (https://github.com/hisjarman/star69ai/pull/85) was marked ready and squash-merged into `main` on 2026-11-11 as commit `1bcb1fe66ab261009a3de5b514b197c78e17395c`.
- Reworked `get-started.html` so the AI Discovery Coach is a permanent, independently labeled panel in the left onboarding column and the existing three-step Formspree discovery form remains in the right column. The floating/toggle panel and duplicate assistant controls were removed.
- Desktop uses a two-column layout; widths at 900px and below stack the assistant above the form. Mobile uses a shorter assistant viewport while keeping its composer and conversation frame available without fixed-position overlays.
- Preserved the existing Concierge Worker iframe URL, exact allowed `postMessage` target origin, contextual form payload, field allowlist and privacy exclusions. The contact name, email, phone, business name, website, human escalation and privacy-consent fields remain excluded. No Worker, D1, secrets or provider configuration changed.
- Preserved the existing Formspree endpoint `https://formspree.io/f/mrppjqdb`, native POST submission, three-step validation, optional feature selections, recording preference, plan interest and disclosures.
- Improved the assistant privacy copy and increased helper/disclosure text sizes and focus visibility on the discovery form.
- Homepage demo CTA now says “Watch a Sample Call” to avoid implying the scripted simulator is a live AI call. The demos navigation label was clarified and the demos footer now uses the current Star69AI logo asset.
- Removed the obsolete HelloAnswer client widget script from `get-started.html`; the current Star69AI Concierge iframe remains the only discovery assistant integration on that page. The privacy notice's conditional HelloAnswer vendor disclosure was not deleted because whether it applies to any existing deployment still requires an operational vendor/configuration review.
- Source-level validation: confirmed one Discovery Coach iframe remains, the toggle and floating panel are removed, the obsolete HelloAnswer widget script is absent from `get-started.html`, the Formspree endpoint remains unchanged, the Worker origin target remains exact, and the sensitive contact/identity fields are not added to the allowlist. JavaScript syntax and CSS brace-balance checks passed. Automated browser rendering, keyboard/screen-reader testing, live Formspree submission and live Concierge conversation tests remain outstanding; do not claim these are complete. GitHub Pages workflow run https://github.com/hisjarman/star69ai/actions/runs/43066785839 was queued and then observed in progress for the subsequent handoff commit `e25a28ac182836daabe208798f492880d06939ba`; production deployment success is not yet confirmed.


## Marketing-page legacy wordmark cleanup — 2026-11-11

- On this branch, replaced the retired “AI VIRTUAL RECEPTIONIST” text wordmark in the roofing, plumbing and HVAC industry landing-page headers and both existing “Saved by the AI Receptionist!” blog headers with the canonical Star69AI logo asset.
- Used the correct relative asset path for each page depth and descriptive Star69AI alternative text. No page copy, canonical metadata, structured data, or industry content was changed.
- These pages now match the current Star69AI identity at the header; broader navigation harmonization across every marketing page remains a separate follow-up.


## Discovery Coach replaces the full left column — 2026-11-11

- Correction to PR #85's side-by-side implementation: the previous layout retained the “START YOUR CUSTOM SETUP” heading, introduction and three numbered steps above the assistant. This did not match the requested composition.
- On branch `fix/discovery-coach-replace-left-column`, removed that entire left-side introduction block. The AI Discovery Coach is now the sole content in the left column; the existing three-step Formspree discovery form remains in the right column on desktop.
- At widths of 900px and below, the coach stacks first and the form follows beneath it. The coach panel starts at the top of its column with no top margin and has a taller desktop viewport. Mobile retains a compact but usable panel.
- Preserved the existing Concierge iframe URL, privacy disclosure, safe contextual form-sharing behavior, Formspree endpoint, fields, validation and submission logic. No Worker, D1, auth, billing or provider configuration was changed.
- Source checks passed: exactly one coach iframe and one intake form; old setup heading and numbered intro block absent; coach markup precedes the form and is the only content in the left column; original Formspree endpoint and Concierge Worker URL remain unchanged; desktop two-column and <=900px stacked responsive rules are present.
- Browser-rendered desktop/mobile testing and live form/assistant interaction tests remain outstanding. Do not claim visual deployment verification until the PR is merged, Pages deployment succeeds and the live page is checked.


## Public provider-branding boundary — 2026-11-11

- Star69AI is marketed as an independent, managed receptionist service. Public sales copy, homepage trust elements, pricing descriptions, editorial guides, SEO metadata and social previews must not name, promote, link to, or imply endorsement/partnership with the underlying voice-AI vendor.
- Do not use vendor-owned business counts, call-volume statistics, customer-resolution figures, case studies or other vendor platform metrics as Star69AI proof points. Use only verified Star69AI customer results with documented permission and evidence; otherwise explain the managed-service process and capabilities without invented numbers.
- Internal integration code, Worker secrets, webhooks, provider-specific API operations and internal technical handoff notes must retain accurate provider references. Do not rename API fields, secrets, routes, event types, D1 schema or integration logic as part of a marketing cleanup.
- Privacy, recording/transcription and other legally operative notices must accurately identify any third-party provider that actually processes caller or customer information, and describe the relevant processing. Do not remove a real processor from legal disclosures merely to conceal the integration. Keep those disclosures factual and separate from marketing; clarify that use of a provider does not imply affiliation, sponsorship or endorsement.
- On 2026-11-11, the homepage hero was changed to describe Star69AI's own managed service and to replace third-party platform metrics with service-benefit statements. Pricing copy now describes multilingual capability without vendor branding. The vendor-specific editorial article and its listing/sitemap entry were retired. Public README architecture language now uses a generic voice-provider description. The legal notices remain unchanged pending a compliance review of the actual production data flow.
- PR #88 was squash-merged into `main` as `9bf4a68966d4c4702e9dd986d53a1864ad85e370` on 2026-11-11. GitHub Pages workflow run 43092588091 completed successfully. Legal notices remain unchanged pending a compliance review of the actual production data flow.


## Homepage Concierge opens beneath receptionist model — 2026-11-11

- Follow-up branch: `fix/hero-concierge-opens-below-model`, based on main after PR #86.
- The homepage hero's Concierge panel previously used fixed viewport positioning at the bottom-left. It now uses normal flow inside `.hero-model-column`, directly below the receptionist portrait and clickable speech-bubble trigger.
- The panel remains hidden until the existing accessible speech-bubble button is activated. The existing close button, Escape-key behavior, dialog labeling, iframe source and shared Concierge Worker conversation endpoint are unchanged.
- Desktop panel width is constrained to the model column (up to 440px) and uses a bounded responsive height. On mobile it remains full-column width with a bounded viewport-relative height; it does not cover the sales-copy column.
- No Concierge Worker, AI endpoint, D1, authentication, Formspree, billing or provider configuration was changed.
- Source-level validation and live browser verification are pending. Do not claim the layout is published until the PR is approved/merged and GitHub Pages deployment succeeds.

## Intake-page Concierge conversation viewport expansion — 2026-11-11

- On branch `fix/hero-concierge-opens-below-model` (PR #87), increased the inline Discovery Coach panel height so more of the Concierge conversation and generated responses remain visible without an overly short embedded viewport.
- Desktop panel now uses a 760px minimum with an 88vh preferred height and 940px maximum. Tablet uses 760px; mobile uses 700px. The iframe is explicitly allowed to flex and fill the remaining panel height.
- The Concierge Worker iframe URL, internal Worker UI, conversation endpoint, contextual form-sharing behavior, privacy exclusions, and Formspree form are unchanged. No Worker, D1, auth, billing, secrets or provider configuration changed.
- Source-level validation confirms the new sizing overrides are appended after the existing responsive rules. Browser visual testing on desktop/mobile and live conversation testing remain outstanding; do not claim the larger panel is visually verified until checked in a browser.


## Homepage Concierge window heading removal — 2026-11-11

- Branch: `ux/remove-concierge-window-heading`, based on the current `main` branch.
- Removed the embedded homepage Concierge window's visible “Star69AI Concierge” heading and the explanatory sentence beneath it.
- Kept the close button, iframe, chat interface, conversation endpoint, and existing open/close behavior. The dialog now has an accessible “AI Concierge chat” label instead of referencing the removed heading.
- Adjusted the compact header row so the close button remains aligned at the right edge.
- No Concierge Worker, AI prompt, D1, authentication, billing, form, email, or provider configuration was changed.
- Source-level validation: confirmed the removed heading and sentence are absent from the homepage markup and the dialog retains its close control and iframe. Browser visual verification and a live conversation test remain outstanding until the change is merged and published.


## Homepage lead-capture hero redesign — 2026-11-11

- Working branch: `ux/homepage-lead-capture-hero`, created from current `main`.
- Reframed the homepage hero as a lead-generation surface: concise sales copy on the left and a short custom-demo inquiry form on the right at desktop widths. The form captures name, business email, phone, business name and industry before visitors need to navigate to the longer discovery brief.
- The homepage form posts directly to the existing Formspree endpoint `https://formspree.io/f/mrppjqdb`, with a source label, email subject and honeypot field. The full three-step discovery form and AI Discovery Coach on `get-started.html` remain available and unchanged.
- Desktop layout prioritizes the lead form alongside the hero message. Tablet/mobile stack the copy, short form and receptionist/Concierge visual without overlaying form fields. Existing homepage artwork, Concierge iframe/chat behavior, YouTube demo, dashboard preview, navigation, SEO metadata, and all backend integrations are preserved.
- CSS changes are appended as a scoped homepage-only override in `homepage-refresh.css`; no global styles or other pages are changed.
- Source checks: confirm a single hero lead form, exact existing Formspree endpoint, required contact fields, industry selector, honeypot, and preservation of the existing three-step intake form/Discovery Coach/Concierge iframe and hero video. Browser visual testing, keyboard/accessibility review and live Formspree delivery testing remain outstanding.
- This is a proposal branch only. Do not merge to `main` or claim production deployment until the user approves the pull request and GitHub Pages deployment succeeds.

- Follow-up responsive refinement: moved the existing YouTube demo out of the hero copy and into its own section immediately below the hero. This keeps the short lead form visible before the demo on narrow/mobile layouts while retaining the same video URL and player permissions.


## Fresh glass-inspired homepage visual refresh — 2026-11-11

- Working branch: `design/fresh-glass-light-homepage`, based on current `main`.
- Visual reference: Run It Remote homepage (`https://runitremote.com/`). Borrowed the clean, bright presentation, spacious hierarchy and clear progression from hero to industries/content to inquiry; Star69AI copy, brand, assets and lead-capture behavior remain its own.
- Updated only the homepage-scoped `homepage-refresh.css` overrides. The Earth-at-night/network hero artwork remains in place, now softened by a graduated translucent white veil (strongest behind the copy, lighter over the artwork) to create the requested frosted-window / white-film effect.
- Changed homepage hero foreground typography to solid dark navy and muted blue-gray for readability; retained lime green as the accent and blue for primary actions. Receptionist artwork remains visible with a softer shadow. The Concierge speech bubble and lead-capture card now use translucent white glass surfaces with subtle borders, blur and restrained shadows.
- Refined homepage header, dashboard/story/feature surfaces, language section and footer toward a lighter, calmer visual rhythm. Responsive veil opacity is adjusted for tablet and mobile so the artwork does not overwhelm text.
- No HTML, copy, form fields, Formspree endpoint, navigation destinations, SEO metadata, Concierge iframe/chat behavior, backend integrations, pricing or non-homepage styles were changed.
- Browser visual QA at desktop/tablet/mobile widths, keyboard/focus review and contrast measurement remain outstanding. Review the branch/PR before merge; do not claim the live site has changed until the PR is merged and GitHub Pages deployment succeeds.


## Homepage conversation-first layout — 2026-11-11

- Working branch: `ux/homepage-conversation-section-under-header`, based on the latest `main` after PR #92.
- Rebuilt the homepage lead-capture presentation as a complete, standalone conversation section immediately below the global header. It is no longer awkwardly embedded as a sidecar inside the hero.
- The conversation section is the page's single primary H1; the following service-introduction hero uses an H2. The first section now has a clear headline and concise explanation on the left, a three-step expectation-setting sequence, and a polished inquiry form on the right. The form retains the existing five required fields, industry options, Formspree endpoint `https://formspree.io/f/mrppjqdb`, subject/source metadata and honeypot.
- Removed the duplicate form placement from the hero. The following hero now reads as the brand/service introduction with the receptionist visual and supporting sales copy, so the page has a clear order: header → custom-demo conversation → service introduction → supporting content.
- Desktop uses a balanced two-column conversation layout; tablet/mobile stack the copy, short process and form into one readable column. The existing hero is also rebalanced into a receptionist visual beside the service introduction on desktop.
- No backend, Formspree configuration, email, Concierge, authentication, pricing, SEO metadata or other pages were changed.
- Source-level checks: verify one homepage Formspree form, unchanged endpoint and required field names, standalone section immediately after header/main opening, hero no longer contains the form, handoff updated, and responsive CSS present. Browser-rendered visual testing, keyboard/focus review, measured contrast and live form delivery remain outstanding.
- This proposal must be reviewed before merging. Do not claim it is live until explicitly approved, merged and GitHub Pages deployment succeeds.


## Discovery form optional fields and one-click AI suggestions — 2026-11-11

- Added to the existing homepage conversation-first PR branch `ux/homepage-conversation-section-under-header`; PR #93 remains the review target.
- Removed required-field validation from the three-step `get-started.html` business discovery form. Visitors may leave any or all fields blank and continue through the steps; non-empty email/URL values are still checked for valid format. The separate quick-contact form and homepage lead form are not part of this change.
- Removed the redundant “Find your industry” search input and its filtering JavaScript. The grouped industry dropdown remains available and is optional. The custom-industry follow-up remains conditional when “Other / not listed” is selected, but it is no longer required.
- Updated the Concierge Worker prompt to provide a concise, context-aware suggestion for the currently active discovery field using a constrained machine-readable marker. Worker parsing only accepts an explicit allowlist of business/call-handling fields and bounds suggestion length.
- The Concierge UI presents a “Use this suggestion” action when a valid suggestion is returned. Only after the visitor clicks it does the iframe send the suggestion to the parent page. The parent verifies the exact Worker origin, validates the field allowlist and select-option values, fills the field, dispatches normal input/change events, and refreshes assistant context. The AI cannot silently overwrite answers or submit the form.
- Existing Formspree endpoint, native browser POST, three-step navigation, privacy notice, contact-field exclusion from assistant context, and Worker rate limiting remain unchanged.
- Validation to perform: JavaScript syntax checks; verify zero required attributes in the intake form, no industry-search markup or handler, optional-step navigation, marker allowlist and length checks, origin validation, exact select-value validation, one-click fill behavior, desktop/mobile browser tests, real model inference, and a live Formspree test.
- `cloudflare/concierge-worker.js` is source only on this PR branch. Do not claim the Worker behavior is live until the Worker is separately deployed and tested. No production deployment or merge is performed here.

- Follow-up refinement: the discovery form introduction and plan-interest helper now explicitly say every field is optional. The AI suggestion action is rendered as a properly styled quick-action button, and the Worker prompt now includes the exact supported dropdown values so it can return valid selectable suggestions rather than arbitrary text.


## Client call-details email rejection fix — 2026-11-11

- Investigated the client portal Call Activity “Email details” error: the UI mapped Resend 4xx rejections to a generic support message, while the Worker logged only a sanitized provider code without returning a trace reference.
- The manual call-details sender previously reused a deterministic Resend idempotency key derived from call ID and recipient. A later attempt for the same call/recipient could conflict if the call payload had changed since the earlier request.
- The sender now creates a unique idempotency key per user-initiated send. Internal retries within that same request continue reusing the same key, preserving retry safety without blocking a later intentional resend.
- Rejected requests now return a short reference ID, HTTP provider status and sanitized provider error code. The client portal displays the reference and provider code so a support investigation can correlate the request with Worker logs; no provider response body, credentials, transcript or recipient address is exposed.
- Resend domain status was checked through the connected Resend account on 2026-11-11: `star69ai.com` was verified and sending was enabled. This does not prove that the sender identity, recipient or each message payload is accepted.
- Validation still required: JavaScript syntax checks, deploy the updated `avr-platform-api` Worker, then send call details twice to the same recipient and confirm both requests can be accepted. Inspect Worker logs using the displayed reference ID if Resend rejects a request. No production Worker deployment is performed by this branch/PR.

## Candy-popsicle palette and readability refresh — 2026-11-12

- Working branch: `design/candy-popsicle-palette-readability`, based on current `main`.
- User clarified the desired brand mood: appetizing candy and ice-cream colors, especially a bright lime-popsicle green (not the prior dull/olive green), while making text easy to read.
- Added a shared color foundation to `styles.css`: lime popsicle, strawberry, raspberry, orange sherbet, blueberry, vanilla cream, and deep plum/ink. Body copy and muted text use dark plum/berry neutrals for contrast; lime is reserved for accents and calls to action.
- Applied a matching homepage treatment in `homepage-refresh.css`: warm vanilla/strawberry surfaces, rich plum navigation/footer, blueberry and berry accents, readable dark hero copy, and lime-popsicle action buttons.
- Applied matching high-contrast candy accents to `portal.css`, keeping the client portal dark and professional with cream-white text, lime controls, strawberry/blueberry accents, and cream form fields.
- This is a CSS-only proposal. No HTML structure, copy, forms, endpoints, authentication, billing, Worker code, or SEO metadata changed. No merge or production deployment has been performed.
- Required QA before merge: inspect homepage, pricing, discovery form, and client portal at desktop/tablet/mobile sizes; verify contrast for normal and muted text, button states, form placeholders, navigation, footer, and status badges. Confirm no page-specific CSS overrides reintroduce low-contrast text or the previous green.


## Watermelon-green palette refinement — 2026-11-12

- Follow-up to the candy-popsicle palette proposal on PR #96: user clarified the signature accent should be watermelon green, not lemon/lime yellow-green.
- Updated the shared palette and homepage/client-portal accent references to vivid watermelon-rind green (#45C957), with a deeper supporting green (#2FA947) and a lighter hover state (#A5F0A5). Strawberry, raspberry, orange sherbet, blueberry, vanilla and deep plum remain complementary colors.
- This remains a CSS-only proposal on design/candy-popsicle-palette-readability; no merge, GitHub Pages publication, or browser visual QA has been performed.


## Automatic AI Discovery Coach suggestions — 2026-11-11

- Confirmed the existing Get Started form (app.js) already sends the active allowlisted field and selected business/call-handling answers to the embedded star69ai-concierge iframe using the exact production origin. The iframe already receives this context and the Worker already supports one-click suggestion responses during a manually started chat.
- Root cause of the reported behavior: the deployed Concierge page only updated its contextual hint when form context arrived; it did not initiate an AI request. Suggestions were generated only after a visitor manually typed and sent a chat message.
- Updated the Concierge page logic in cloudflare/concierge-worker.js to automatically request a tailored suggestion when a visitor focuses one of the seven free-text discovery fields: industry details, service area, services, business hours, call tasks, common questions, and additional notes.
- Automatic suggestions are debounced briefly, generated once per field per iframe session, use the current allowlisted form context, and appear as assistant messages with the existing explicit “Use this suggestion” button. The visitor's form is never silently changed or submitted. Contact/identity fields and dropdowns do not trigger automatic AI suggestions.
- Existing manual chat, suggestion parsing, origin validation, field allowlist, exact dropdown-value checks, privacy exclusions, Formspree endpoint, and Worker rate limit remain unchanged.
- Source validation required: embedded script syntax, automatic field allowlist, one-request-per-field behavior, stale-response suppression, existing manual chat, and one-click message flow. Live AI inference and browser interaction still require production deployment and end-to-end testing.
- This change is source-only until the Worker is separately deployed. Do not claim automatic suggestions are live until the Worker deployment and a real discovery-form interaction are verified.


## Concierge Worker deployment validation correction — 2026-11-11

- PR #97 was merged into main (merge commit 23ad27db9df7456e87e4d2e1731b8558928f15b8). The first production upload attempt was rejected by Cloudflare validation with a JavaScript syntax error in the existing system-prompt string, before any deployment occurred.
- Root cause: the repository's system-prompt example for the machine-readable suggestion marker contained raw double quotes inside a double-quoted JavaScript string. The previously deployed Worker did not include that newer parser/prompt block, so this source defect had not prevented the earlier deployment.
- This follow-up escapes the JSON example's double quotes within the JavaScript string. No runtime behavior, prompt semantics, bindings, or secrets are changed.
- Required validation: parse the complete Worker module and its embedded Concierge browser script before attempting another production upload.
- No Worker upload or deployment was successful during the rejected attempt; the previously active production deployment remains unchanged.


## Partner header rebrand — 2026-11-12

- Updated the private partner applications admin header and public partner-program header to use the canonical horizontal Star69AI logo at `assets/star69ai-logo.png` instead of the retired text wordmark.
- Updated the partner admin document title from the previous brand name to `Partner Applications | Star69AI`.
- Added responsive logo sizing in the partner admin and public partner page stylesheets. No partner application, authorization, commission, API or enrollment behavior was changed.


## Align admin sign-in with production Clerk — 2026-11-12

- Root cause: the private Partner Admin, Trust Lab Admin and Newsletter Admin pages still loaded the retired Clerk development instance `aware-pegasus-8939.clerk.accounts.dev` and its `pk_test` publishable key. The customer portal at `/client/` and main agency console at `/admin/` already use the production Clerk instance.
- Updated all three remaining admin HTML entry points to load Clerk JS/UI from `https://clerk.star69ai.com` and use the same production publishable key as the working client portal. No secret key or private credential was exposed or changed.
- Inspected Cloudflare Worker configuration: both `avr-platform-api` and `avr-trust-lab-api` already have the non-secret `CLERK_ISSUER` set to `https://clerk.star69ai.com`. No Worker code, issuer variable, secrets, D1 data, authorization allowlist or user records were changed.
- Existing client/agency admin pages were left unchanged. The partner, Trust Lab and newsletter admin JavaScript continues to use the existing Clerk session and server-side authorization checks.
- Source-level validation: all three target HTML pages must now reference the production Clerk domain and live publishable key, with no remaining `aware-pegasus-8939` or `pk_test` references in those pages. A browser sign-in/session test and authorized admin API request are still required after GitHub Pages publishes the merge.
- Changes are proposed on `fix/admin-clerk-production-instance`; do not merge until explicitly approved.


## First-party Star69AI partner portal and referral ledger — 2026-11-11

- Working branch: `feature/star69ai-partner-portal`. This is a source-code proposal only; do not merge to `main`, apply the production D1 migration, or deploy either Worker until the user reviews and approves the PR.
- Replaces the former Systeme.io-dependent partner enrollment notes with a first-party Star69AI workflow:
  - Public applications remain at `/partners/`.
  - Partner self-service login and dashboard: `/partner-portal/`.
  - Private partner application and commission admin: `/partners-admin.html`.
  - Clerk production authentication is used; the Trust Lab Worker verifies the session and matches the verified email to an approved `affiliate_applications` record.
- New migration: `cloudflare/migrations/20261111_partner_attribution.sql`. It adds a unique partner code, links customers to partner applications, and creates click, referral and commission ledger tables. Apply it to the existing shared `avr-trust-lab` D1 database only after the PR is approved and before deploying the Worker changes.
- Referral links use `https://star69ai.com/get-started.html?ref=PARTNERCODE`. The public site captures a click, stores a first-party 90-day attribution cookie, and records the discovery lead through the Trust Lab Worker before the existing native Formspree POST. The Formspree endpoint remains `https://formspree.io/f/mrppjqdb`; the normal inquiry submission is not blocked if referral tracking is unavailable.
- Attribution is first-touch per normalized lead email. Existing Star69AI customers are not eligible for a new referral. Admin customer creation links a matching unexpired referred lead to the customer record. A referral is shown as a paying conversion only after a qualifying Stripe invoice payment succeeds.
- The platform Worker records recurring commissions from positive, non-proration subscription invoice lines in `invoice.payment_succeeded` events. It uses the approved partner's 20% standard rate, 25% founding rate, 25% after 5 active referred subscriptions, and 30% after 15. Setup fees and non-subscription invoice lines are excluded. Each commission has a 30-day validation hold; administrators manually mark eligible commissions paid and can record a payout reference.
- Stripe webhook configuration must include `invoice.payment_succeeded` in addition to the existing checkout, subscription and payment-failure events. Confirm the live webhook endpoint and test invoices before advertising automatic commission crediting as active.
- Public privacy copy now explains partner referral attribution. The partner application admin no longer exposes Systeme.io enrollment fields; approving a partner generates a referral code/link and sends a branded Partner Center approval email.
- Validation still required before production: inspect the complete PR diff; run JavaScript syntax checks for both Workers and browser scripts; apply the migration to a non-production copy or approved production D1 change window; test click capture, 90-day attribution, first-touch duplicate handling, Clerk partner/admin access isolation, customer matching, Stripe signed webhook idempotency, non-subscription/proration exclusion, tier thresholds, 30-day hold and manual payout. Deploy Trust Lab and platform Workers separately only after migration and approval. Browser QA of the Partner Center and admin ledger is also pending.


### Partner ledger accounting refinements — 2026-11-11

- Referral records distinguish `lead`, `customer` (Star69AI customer record created), and `converted` (a qualifying Stripe subscription invoice has been paid). The partner-facing paying-customer count includes only the final converted state.
- Partner commissions are calculated only from positive, non-proration subscription invoice lines. Setup fees, usage overage, phone-number rental, carrier charges and third-party pass-through items are excluded by the current implementation and public program terms.
- The admin payout endpoint enforces both the 30-day validation hold and the $50 minimum aggregate eligible balance. Administrators can record payout references and manually reverse commissions for refunds, chargebacks or accounting corrections.
- The partner approval action now creates the partner code/referral link and sends a branded email with the Partner Center sign-in URL. The partner must use the same verified email address as the approved application.


### Partner tracking privacy and anti-abuse safeguards — 2026-11-11

- Public click capture is limited to 60 clicks per hashed network identifier per 10-minute window; lead capture is limited to 10 submitted leads per hashed network identifier per hour. The tables retain a one-way hash, not a readable IP address.
- A lead's customer-conversion deadline is tied to the original qualifying click's `expires_at`, not reset for another 90 days when the form is submitted.
- Repeated visits to a referral link are counted as clicks. A normalized email can be attributed only once (first recorded lead wins); existing Star69AI customers are excluded.
- The Partner Center's paying-customer count includes only referred customers whose subscription status is currently active or trialing. Lifetime converted leads remain visible in the referral activity list.
- The admin-assigned founding, growth and premier commission tiers are honored; automatic active-customer thresholds can raise the rate to 25% at 5 active referrals and 30% at 15.


### Partner Center final review notes — 2026-11-11

- Direct self-referrals matching the approved partner's own application email are rejected by the lead capture API.
- The partner dashboard reports the effective current commission percentage and counts currently active/trialing referred subscriptions as paying customers; lifetime conversion remains visible in referral activity.
- The public application page now describes first-party Partner Center activation and no longer refers to manual enrollment in an external affiliate system.
- PR #102 is open and currently reports mergeable. It remains unmerged. No production migration, Worker deployment, Stripe webhook configuration change or GitHub Pages publication has been performed.


## Partner Center production activation — 2026-11-11

- PR #102 was merged into `main` with squash merge commit `28d3e85228cbcc46fe157f5814ed04c04aeffb06`.
- Production D1 migration `cloudflare/migrations/20261111_partner_attribution.sql` was applied successfully to the existing `avr-trust-lab` database (`6cf68b12-2aa8-4ed4-9f92-8a7824520d1a`). Verification confirmed `affiliate_applications.partner_code`, `avr_customers.affiliate_partner_id`, and all three `partner_clicks`, `partner_referrals`, and `partner_commissions` tables/indexes exist.
- Before the migration, a D1 Time Travel bookmark was recorded: `000000c3-00000004-00005121-a4bb5bb1b8aac84fabc15375e2f5d714`. No existing customer or partner application rows were rewritten by the migration; it added schema only.
- Updated `cloudflare/trust-lab-worker.js` was uploaded to the existing `avr-trust-lab-api` Worker using the content-only endpoint, preserving its existing settings/bindings. Cloudflare reported successful upload/deployment, version tag `e203a9fd00194096817ae0455c2599dc`, deployment ID `85b73614237a4e51864a9fdd213fa20e`, and entry point `worker.js`.
- Runtime HTTP health check and browser sign-in/referral-flow testing could not be completed in this session; do not claim those tests passed. Cloudflare's API confirmed the Worker upload succeeded.
- **Platform Worker deployment is intentionally blocked pending Stripe secrets.** The existing `avr-platform-api` settings currently have no `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` bindings, while the repository's platform Worker code requires both. Do not deploy `cloudflare/platform-worker.js` until both are added as Worker secrets in Cloudflare. Do not ask the user to paste secret values into chat.
- After adding those two secrets, deploy the merged `cloudflare/platform-worker.js` to `avr-platform-api`, then confirm the existing Stripe webhook endpoint subscribes to `invoice.payment_succeeded`. Stripe webhook configuration has not been changed.
- GitHub Pages is configured to publish from the repository's main branch; the merge is now in `main`. A live browser/page verification was not available during this session.
- Systeme.io is not required for this partner program. Legacy `systeme_*` columns remain in the existing D1 table for backward compatibility but are not used by the new first-party tracking flow.


## Platform Worker Stripe activation — 2026-11-12

- User confirmed the two required Stripe secrets have now been configured on Cloudflare Worker `avr-platform-api`.
- Before deployment, Cloudflare Worker settings were inspected by binding name/type only. Both `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` were present as `secret_text` bindings. Secret values were never read or exposed.
- Deployed the current merged `cloudflare/platform-worker.js` from `main` to the existing `avr-platform-api` Worker through the content-only upload endpoint, preserving existing Worker settings and bindings.
- Cloudflare confirmed successful deployment on 2026-11-12: deployment ID `b4bd3b1d80584e549bbf5039a4832e73`, version tag `2cc622db0c924398aedca6dffb1c63c7`, entry point `worker.js`.
- Post-deployment settings inspection confirmed both Stripe secrets remain configured as secret bindings, alongside the existing Clerk, D1, Resend and Retell bindings.
- Runtime health endpoint browser request could not be verified in this environment (the request tool returned an access error). Do not claim runtime health or end-to-end billing/webhook tests passed.
- Stripe webhook event configuration has not been inspected or changed because no Stripe account connector is available in this session. In Stripe Dashboard, verify the endpoint `https://avr-platform-api.hisjarman.workers.dev/webhooks/stripe` is subscribed to `invoice.payment_succeeded` (as well as the pre-existing required events). Then send a Stripe test event/test invoice and confirm the Worker records the event and partner commission correctly before relying on production commission automation.


## Contact section readability repair — 2026-11-12

- Identified the contrast conflict on `get-started.html#contact-us`: the contact section retained a dark background and pale inherited text, while later site-wide theme rules force section headings to dark ink. The heading and section kicker therefore rendered with insufficient contrast.
- Added scoped overrides to `contact.css` so the contact section follows the site's light surface theme, with explicit high-contrast heading, kicker, paragraph, email-link, card, form-label, input, placeholder, focus and status colors.
- Kept the existing contact copy, support email, form fields, submission behavior and contact layout intact; this is a visual/readability-only change.
- Change is on branch `fix/contact-section-readability`. Not merged into `main`; production publication awaits review/approval. Browser visual QA remains to be performed.


## Partner payout profile — implementation branch, 2026-11-12

- Feature branch: `feature/partner-payout-profile` (based on `main`).
- Partner Center now includes a **Profile & Payout Settings** panel. At launch, the only supported method is manual PayPal payout; the partner can save and update the PayPal account email.
- Authenticated API endpoint: `PATCH /api/partners/payout-preferences` on `avr-trust-lab-api`. It derives the partner from the verified Clerk email and only updates the approved partner's own record. It validates and normalizes the PayPal email; it does not accept a partner ID from the browser.
- New D1 migration: `cloudflare/migrations/20261112_partner_payout_preferences.sql` adds `payout_method`, `paypal_email`, and `payout_updated_at` to `affiliate_applications`.
- Partner dashboard response includes payout preference fields. Admin commission ledger now displays the partner's PayPal payout email beside each commission.
- This does not initiate payments or connect PayPal/Stripe. Payouts remain manual: the administrator sends payment outside Star69AI and records the payment reference in the ledger. Stripe Connect and bank payouts are not implemented.
- Deployment requirements: apply the new migration to the existing `avr-trust-lab` D1 database, then deploy the updated `avr-trust-lab-api` Worker. GitHub Pages frontend changes are not live until the PR is merged and published.
- Verification status: source-level review only; no live migration, Worker deployment, authenticated browser test, or real payout was performed. Do not claim the feature is live until these steps and tests are complete.


## Partner payout profile production fix — 2026-11-12

- Investigated the Partner Center PayPal payout save failure. The public frontend called `PATCH /api/partners/payout-preferences`, but the active `avr-trust-lab-api` Worker deployment still served the pre-feature source and returned the Worker catch-all `not_found` response. The production `affiliate_applications` table also lacked the payout preference columns.
- Applied `cloudflare/migrations/20261112_partner_payout_preferences.sql` to the existing `avr-trust-lab` D1 database (`6cf68b12-2aa8-4ed4-9f92-8a7824520d1a`). Verified that `payout_method`, `paypal_email`, and `payout_updated_at` now exist.
- Deployed the merged `main` version of `cloudflare/trust-lab-worker.js` to the existing `avr-trust-lab-api` Worker using the content-only upload endpoint, preserving Worker settings and bindings. Cloudflare deployment ID: `4dab0d53-ca6b-4a8d-9ad4-1835a96ebb46`; version: `409bd722-8894-4751-996b-4a1939b73a5d`.
- Verified the deployed Worker source includes both the `handlePartnerPayoutPreferences` handler and the `PATCH /api/partners/payout-preferences` route. Live authenticated save testing was not performed because this session cannot authenticate as the partner; do not claim an end-to-end browser save test passed.


## Daily Insights publication — 2026-11-12

- Published directly to `main` with the user's explicit authorization to bypass pull-request approval for daily editorial articles.
- Article: **How Dental Practices Can Reduce Appointment No-Shows Without Overloading the Front Desk**
- URL: `https://star69ai.com/insights/dental-practice-appointment-no-shows.html`
- Slug: `dental-practice-appointment-no-shows`
- Target industry: Dental practices; primary SEO keyword: `Reduce dental appointment no-shows`.
- Added the article page, Insights index card and sitemap URL. The article uses the existing Insights template and stylesheet, Article and BreadcrumbList JSON-LD, canonical/Open Graph metadata, internal related-guide links and a Star69AI managed-service CTA.
- Article body supplied by the 2026-11-12 daily automation; the recorded draft was approximately 802 words with a 143-character meta description. The published HTML has been formatted to the current site template.
- GitHub Pages deployment and live HTTP availability must be checked separately; a successful commit is not proof of completed deployment.


## Legal-readiness remediation — 2026-11-12

- User requested a legal audit remediation and a PDF checklist of owner actions. This work is a website-content improvement, not legal advice or a legal certification.
- Updated privacy.html: clarified operator identity as Solomon Jarman, individual sole proprietor under the Star69AI service brand; described SIMIAPP CLOUD cautiously as the current setup-fee invoice/payment name without representing that the fictitious-firm-name filing is complete; removed the stale conditional HelloAnswer processor reference; added Resend transactional/operational email disclosure, PayPal setup-fee processing, expanded Stripe payment disclosure, YouTube privacy-enhanced embedded video, and the optional Cloudflare Workers AI Discovery Coach data flow; strengthened privacy-request and international-processing wording.
- Updated terms.html: clarified operator identity and the boundary between website inquiry and a paid order; stated that the written order must specify renewal/cancellation, billing and usage details before paid service begins; clarified that a discovery form does not authorize recurring charges; added a privacy/data-processing section and explicitly stated that these website terms are not a DPA or BAA.
- Updated ai-compliance.html: clarified that outbound AI calling and automated SMS require separate written scope and verification of consent, identification, permitted hours and suppression/opt-out controls; added restrictions and additional review requirements for regulated/sensitive data and healthcare deployments; explicitly does not claim HIPAA certification/compliance.
- Updated recording-notice.html and sms-terms.html: refreshed effective dates and strengthened the written-approval and activation safeguards for recording/transcription and SMS workflows.
- Updated sitemap lastmod dates for all five legal pages.
- These changes do not complete the user's external obligations: Nevada/Clark County registration and licensing, attorney review, signed customer agreement/DPA/BAA as applicable, vendor account terms, live consent/recording/SMS tests, retention/deletion settings, newsletter email compliance, partner agreement/disclosures, or tax/accounting review. See the companion owner-action PDF.
- All five legal pages and sitemap are committed directly to main under the user's request to fix what can. Live GitHub Pages deployment and end-to-end behavior remain to be verified separately.

- Follow-up verification on 2026-11-12 corrected the Terms page section numbering and inserted the explicit privacy/data-processing section (section 8); cancellation, renewal, refunds, export and termination details must be stated in the customer agreement before paid service begins.


\n## Permanent design, readability and content standards — 2026-11-12

- Added `docs/STAR69AI_DESIGN_CONTENT_STANDARDS.md` as the required source of truth for typography, color/contrast, spacing, responsive behavior, forms, legal documents, content accuracy, CSS hygiene and the pre-publish quality gate.
- Added a shared `legal.css` stylesheet and consistent navigation/footer to the five public legal documents. The stylesheet explicitly gives legal pages a dark reading surface because the shared site stylesheet sets a white body background; the previous pale legal text could therefore inherit a low-contrast light-on-white combination.
- Standardized legal body and list text at 16px, heading hierarchy, link contrast/underline, focus visibility, callout styling, page width and mobile layout.
- This is a visual and editorial consistency pass only. It does not constitute legal advice, attorney review, a legal certification, or verification of live consent/provider behavior. Preserve the documented owner actions and customer-agreement requirements.
- Work is on branch `quality/readability-and-legal-standards-2026-11-12`; do not merge until the user reviews and approves.


## Official Star69AI photo-matched neon palette — 2026-11-12

- The user approved the vivid neon colors sampled from their supplied reference photo: **purple `#E156FF`**, **blue `#21B7FF`**, and **green `#14D251`**. These replace the earlier provisional neon values.
- Keep the existing translucent white/glass film over the Earth-at-night hero artwork. Let the original image remain visible beneath a graduated white veil with subtle purple, blue and green light blooms.
- Use the vivid original colors for decorative lighting, glows, icon fills, borders and green action-button fills. On white backgrounds, use accessible darker companion colors for small text: purple `#A52AB8`, blue `#0875A9`, green `#167A3D`.
- Keep primary text deep navy (`#172B40`) on light/glass surfaces and near-white on dark surfaces. Never use the bright neon hues for long paragraphs or small text on white.
- Keep forms, cards, links, focus states, mobile layouts, navigation and existing functionality readable and intact. Avoid harsh white section breaks and excessive glow.
- Implementation is on branch `branding/photo-neon-white-glass-2026-11-12`; it is not production until reviewed and merged.



## Hero readability and AI assistant scale correction — 2026-11-12

- User reported that hero text was unreadable and should have been green, and that the AI assistant model image was too small.
- Correct the emphasized hero headline and the assistant speech-bubble/caption text to accessible dark green `#167A3D` on the translucent white/glass hero surface. Keep neon green `#14D251` for accents and glows, not small body text on white.
- Override older compact avatar CSS rules: target approximately 460px max width on desktop, 390px on tablet, and 290px on mobile, retaining `object-fit:contain`, auto height, and no cropping. Keep the speech bubble readable and positioned beneath/near the assistant without covering the face.
- Implemented on branch `fix/hero-green-text-larger-assistant-2026-11-12`; do not merge until reviewed and approved. Verify desktop, tablet and mobile layouts after merge.


## Industry-specific AI configuration and guardrails — 2026-11-12

- Added a dedicated “Not just an AI voice. A business-specific playbook.” section to `industries.html`, linked from the existing Industries navigation route.
- Covers eight business groupings: home services; contractors/property services; healthcare/wellness; legal/professional services; real estate/finance; automotive/transport; hospitality/food; and retail/personal services/community organizations.
- Each grouping explains the intended receptionist configuration and specific boundaries, including emergency escalation, no unapproved advice/diagnosis, no invented quotes or availability, sensitive-data restrictions, and human handoff rules where applicable.
- Added shared baseline guardrails: approved business knowledge only, clear AI identity and applicable recording/messaging notices, no unauthorized commitments, data minimization, risk/uncertainty escalation, and scenario testing with client approval before activation.
- Added a prominent qualification that these are configuration standards, not a guarantee of error-free operation or a claim of legal compliance; regulated/high-risk workflows require additional review and may be restricted or declined.
- Added scoped responsive styling in `industry-guardrails.css`, using the approved Star69AI neon palette against a dark readable surface, accessible body text sizing, mobile single-column behavior and reduced-motion consideration.
- Updated the Industries page title and meta description. Existing navigation, footer, industry landing-page links and demo CTA remain in place.
- Implementation branch: `feature/industry-specific-ai-guardrails-2026-11-12`. Not merged or published. Static source checks confirmed the new stylesheet link, section anchor, eight industry guardrail panels, balanced article tags, common guardrail block and demo CTA. Desktop/mobile browser rendering, keyboard accessibility and live GitHub Pages deployment remain to be verified.
- Important operational caveat: website copy does not itself enforce agent behavior. Before selling these workflows, each client agent must be configured and tested against the stated rules, with written scope/approval and provider capabilities verified.


## Industry agent configuration playbooks and QA — 2026-11-12

- Added `docs/INDUSTRY_AGENT_CONFIGURATION_PLAYBOOKS.md` on `feature/industry-specific-ai-guardrails-2026-11-12`.
- The playbook converts the public industry guardrail categories into a repeatable client setup record, reusable baseline prompt, standard call flow, eight industry modules, universal adversarial/failure test suite (U01–U15), launch gates, ongoing QA and client approval record.
- Industry modules cover home services, contractors/property services, healthcare/wellness, legal/professional services, real estate/property/mortgage, automotive/towing, hospitality/food/events, and personal services/retail/community organizations.
- Added conservative defaults for emergencies, regulated advice, sensitive data, identity verification, pricing/booking/dispatch confirmation, human handoff and tool failure.
- Healthcare deployment posture is administrative-only unless the specific deployment, vendor configuration, contractual requirements and applicable legal obligations are separately reviewed. No Star69AI HIPAA certification/compliance claim is made.
- The document links to current Retell materials for knowledge bases, safety guardrails, webhook/function testing and simulation/batch testing. These are implementation references only; feature availability and actual settings must be verified in the client's account.
- No Retell agents, prompts, knowledge bases, tools, guardrail settings, phone numbers, client records, Cloudflare Workers or D1 data were changed. No production deployment or activation occurred.
- Next operational step: turn the playbook into client-specific agent configurations only after a real client setup record and authorized written approvals exist; run the full relevant test suite and retain versioned approval evidence before activation.


## Client read-only AI agent configuration and prompt transparency — 2026-11-12

- Feature branch: `feature/client-agent-prompt-transparency-2026-11-12`.
- Extends the authenticated `GET /api/client/agent-configuration` route. It resolves the signed-in Clerk user to their customer record and selects agents only where `avr_agents.customer_id` matches that customer. No agent identifier supplied by the browser is trusted.
- Adds a customer-facing prompt excerpt only from explicit `[[CLIENT_VISIBLE_PROMPT]] ... [[/CLIENT_VISIBLE_PROMPT]]` delimiters in the Retell `general_prompt`, or from Markdown sections whose headings match a client-facing allowlist (business, role, greeting, call flow, services, hours, location, lead, appointment, FAQ, handoff, escalation, caller, tone, objective, scope, customer, service area). Sections headed with internal/system/developer/security/private credentials, API, webhooks, tools, integrations, guardrails, injection, retention, recording or compliance are excluded. Excerpts are capped at 6,000 characters.
- Client UI presents the prompt excerpt as a read-only panel alongside existing voice, language, greeting, model and capability settings. When no safe excerpt is detected, the UI says a client-approved preview has not yet been published; it never falls back to displaying the raw prompt.
- This content-selection safeguard is best-effort, not a formal security boundary. Review actual prompts and ensure allowlisted sections contain only business-approved information before production use. A dedicated admin-managed public prompt field is the preferred future hardening.
- No Worker deployment, D1 migration or GitHub Pages publication is performed by this branch. Browser, tenant-isolation, mobile and live API verification remain required.


## Client AI agent prompt transparency — merged 2026-11-13

- PR #110 merged to `main` at squash commit `5a1cb83dd2d8b1814a791bb2cb86d69cf55e3412`.
- The client portal's authenticated agent-configuration endpoint now returns a client-facing prompt excerpt only when an approved delimited block or allowlisted Markdown section is detected. The portal displays it read-only and does not fall back to the raw system prompt.
- The portal continues to derive the signed-in customer's identity server-side and restricts the agent query to that customer's `customer_id`. The code change itself has not been deployed to the Cloudflare Worker or browser-verified.
- Active Retell agents still need reviewed `[[CLIENT_VISIBLE_PROMPT]] ... [[/CLIENT_VISIBLE_PROMPT]]` sections before the client preview can display the intended business-facing prompt. The daily scheduled audit checks this readiness when source/provider access is available.

## Site-wide readability hardening — implementation branch 2026-11-13

- Branch: `quality/sitewide-readability-hardening-2026-11-13`.
- Added root `readability.css` and linked it last in the document head across the main public pages, legal pages, Trust Lab pages, Insights index/articles, blog index, challenge, industry landing pages, partner pages and client/admin portals.
- The shared layer enforces minimum body-copy, label, table, metadata and dashboard-demo text sizes; improves default light-surface text/link contrast, preserves light text on explicitly dark panels, improves placeholder/focus visibility, and prevents small-screen typography reductions.
- Removed the old blanket rule that forced every descendant in the homepage dashboard preview to white text regardless of its surface. Existing page-specific styles remain in place, with the shared layer as the final readability guardrail.
- This is a source-level hardening pass. It has not yet had full browser visual review at 360px, 768px and 1280px, automated axe/WCAG scans, or measured contrast checks. Check all page families before merging. Do not claim GitHub Pages has published these changes until live deployment is verified.


## Dedicated client-specific prompt publication — implementation branch 2026-11-12

- Feature branch: `feature/full-client-prompt-transparency-2026-11-12`, based on current `main`.
- Replaces heading-based extraction from Retell `general_prompt` with a dedicated nullable `avr_agents.client_visible_prompt` D1 field. The client portal API returns only this separately published business-specific prompt; it never derives the client-visible text from the Retell runtime/global prompt.
- Adds an admin-only prompt publishing endpoint: `PUT /api/admin/agents/:agentId/client-prompt`. It requires the existing server-side admin authorization, validates a 12,000-character maximum and rejects common credential/token patterns, stores the text separately from Retell `raw_json`, and writes an audit event.
- The admin Retell Resources screen now lets the operator review/edit/publish the complete business-specific prompt per agent, or clear publication. The client portal displays the complete published text as read-only and retains the existing change-request workflow.
- Adds migration `cloudflare/migrations/20261112_client_visible_agent_prompt.sql`. **This migration must be applied to the existing platform D1 database before deploying the updated Worker.** The Worker and GitHub Pages changes are separate deployments.
- Security boundary: never paste the shared Star69AI master/system prompt, API keys, credentials, webhook URLs, private integration secrets or other clients' information into the client-visible field. The separate field and server-side tenant lookup are the boundary; the credential pattern check is only a secondary safeguard, not a secret scanner.
- Verification status: source changes committed on the feature branch only. No D1 migration was applied, no Cloudflare Worker was deployed, no GitHub Pages publication occurred, and no authenticated browser/tenant-isolation test was performed. Do not claim this feature is live until those steps are completed.


## Dedicated client-specific AI prompt transparency — merged 2026-11-13

- PR #113 merged to `main` (squash merge commit `b83aab7bb7e325bbccf979ca16187af7be6a588a`).
- Replaces best-effort extraction from Retell `general_prompt` with the dedicated D1 field `avr_agents.client_visible_prompt`. The authenticated client configuration API returns only this separately published business-specific text; it does not expose the shared Star69AI master/runtime prompt.
- Adds admin-only `PUT /api/admin/agents/:agentId/client-prompt` with existing admin authorization, audit logging, 12,000-character limit and basic credential-pattern rejection. Admin → Retell Resources can save/publish or clear each agent's client-facing prompt.
- Client portal shows the complete published business prompt read-only; publication is managed by Star69AI. Do not paste shared master instructions, API keys, credentials, webhook URLs, private integration secrets or other tenants' information into this field. Pattern checks are not a substitute for human review.
- Migration `cloudflare/migrations/20261112_client_visible_agent_prompt.sql` must be applied to the existing platform D1 database before deploying the updated Worker.
- No D1 migration was applied and no Cloudflare Worker deployment or authenticated tenant-isolation/browser test has been performed. The frontend and Worker source changes are on `main`; do not describe the feature as live until the migration, Worker deployment and tests are complete.

## Founder portrait on About page — 2026-11-13

- Added `assets/Solomon_Jarman_Star69AI.webp` to `about.html` as the founder portrait, with descriptive alt text, explicit dimensions, lazy loading and asynchronous decoding.
- Added responsive `.founder-photo` styling in `styles.css`; desktop uses a larger portrait and mobile layouts reduce it to fit the founder sidebar.
- Source changes committed directly to `main`. Confirm the GitHub Pages build/live page and review desktop/mobile cropping before calling it fully verified.


## Admin Clerk session and sign-in UX follow-up — 2026-11-13

- Branch: `fix/admin-inline-clerk-signin-session-2026-11-13`.
- The agency admin page now mounts Clerk's embedded sign-in form when no active session is detected, so the email field is visible on the page rather than requiring a separate sign-in popup.
- Admin session activation now follows Clerk's listener lifecycle, serializes repeated activation events, and refreshes the dashboard when Clerk reports an active session.
- Authenticated admin API requests retry once with a freshly requested Clerk token after a 401 response. A 403 remains an authorization denial and is not retried or bypassed.
- The Cloudflare Worker `requireAdmin` check and `ADMIN_EMAILS` allowlist are unchanged. Admin access remains server-authorized.
- This is a proposed GitHub Pages frontend change; it is not live until its PR is reviewed and merged. Verify the existing client session is recognized, the embedded email sign-in works when signed out, and an authorized admin can load protected data after publication.


## Google Tag Manager installation — 2026-11-13

- Added the exact user-supplied Google tag snippet for container `GTM-N7RBHG8K` immediately before the closing `</head>` tag on all 28 public-facing HTML pages, including the homepage, marketing pages, pricing, legal pages, public Trust Lab, partner application, blog, challenge, industry pages and insights.
- The snippet was preserved exactly as supplied:
  ```html
  <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-N7RBHG8K"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
  </script>
  ```
- Did not add a noscript iframe or alter the supplied snippet.
- Excluded authenticated/private surfaces (`admin/`, `client/`, partner portal, and private admin dashboards) to avoid sending logged-in customer or administrative activity into a general website analytics container.
- Implemented on branch `analytics/install-gtm-n7rbhg8k-2026-11-13`. No merge to `main` or production deployment has been performed. GTM tag firing and Analytics receipt still require browser/Tag Assistant verification after merge and publication.


## Published Insight — Law firm client intake — 2026-11-13

- **Article:** How Small Law Firms Can Stop Losing New Clients to Missed Calls
- **URL/slug:** https://star69ai.com/insights/law-firm-client-intake-missed-calls.html (`law-firm-client-intake-missed-calls.html`).
- **Target industry:** Small law firms.
- **Primary SEO keyword:** law firm client intake.
- **Article length:** 864 words in the article body; meta description is 136 characters.
- **Publication:** Article HTML, Insights index card and sitemap entry were committed directly to `main` under the user's explicit authorization for automated daily article publishing. This is a narrow publishing exception; the general no-unapproved-merge rule for software changes remains unchanged.
- **Content guardrails:** General business-operations guidance only. The article tells firms to follow their own conflict-checking, confidentiality, intake and communication procedures; it does not offer legal advice or promise client outcomes.
- **Verification:** GitHub source verification is required after the commits. A successful commit does not by itself confirm that GitHub Pages has finished deploying; live HTTP verification is reported separately.


## Published Insight — Auto repair estimate follow-up — 2026-11-14

- **Article:** How Auto Repair Shops Can Get More Repair Estimates Approved Without Chasing Customers
- **URL/slug:** https://star69ai.com/insights/auto-repair-estimate-follow-up.html (`auto-repair-estimate-follow-up.html`).
- **Target industry:** Independent auto repair shops.
- **Primary SEO keyword:** auto repair estimate follow-up.
- **Article length:** 838 words in the article body; meta description is 124 characters.
- **Publication:** Article HTML, Insights index card, sitemap entry and this handoff update were committed directly to `main` under the user's explicit authorization for automated article publishing. This is a narrow content-publishing exception; general software changes remain subject to the normal review/approval rules.
- **Content guardrails:** General customer-communication and shop-operations guidance only. The article does not diagnose vehicles, prescribe repairs, authorize work on a customer's behalf, or make performance guarantees. It emphasizes clear customer authorization before additional work.
- **Verification:** The article file, Insights index card, sitemap URL and handoff entry were re-fetched from `main` after committing. GitHub source verification does not prove that GitHub Pages has completed deployment; live HTTP verification is reported separately.

## Demo pipeline deployment record — 2026-11-14

- The homepage visual/sales release was merged to `main` in commit `1cd189d1bd6dcb5479e7cb29eaeaada9690018d6` (PR #131). GitHub Pages publishes from the repository root on `main`; the live page still requires browser verification because direct site access was unavailable during this deployment run.
- Before changing production D1, a full SQL export backup was generated successfully from database `avr-trust-lab` (database ID `6cf68b12-2aa8-4ed4-9f92-8a7824520d1a`). The export contains application data; do not publish or expose its signed download URL.
- Production D1 did not have a `d1_migrations` tracking table. Migration `0004_demo_request_customer_link.sql` was therefore applied directly through the Cloudflare D1 query API after verifying the column was absent and the backup completed:
  - Added nullable `avr_demo_requests.customer_id`.
  - Added partial unique index `avr_demo_requests_customer_unique_idx` on non-null `customer_id`.
  - Verified the column with `PRAGMA table_info('avr_demo_requests')` and the index with `PRAGMA index_list('avr_demo_requests')`.
  - The change is additive; existing demo rows remain unlinked.
- Updated `avr-platform-api` Worker content using Cloudflare's content-only upload endpoint, which leaves existing bindings and script settings intact. Latest deployment record: `44e5c077-0aca-4966-b671-21ad7d2869a6`; upload response deployment ID: `78a635c2fa4b40cfaa4c56fbc5f9e561` (2026-11-14 14:17 UTC).
- Post-deployment settings inspection confirmed the existing Clerk, Retell, Stripe, Resend, ADMIN_EMAILS, ALLOWED_ORIGINS and D1 bindings remained present. The D1 binding still points to the existing production database. No secret values were read or changed.
- Worker customer lookup now requires the Clerk primary email to be verified (existing behavior), refuses ambiguous email-to-customer matches, refuses a customer record already linked to a different Clerk user, and uses a conditional update before claiming an unlinked pending customer workspace.
- Current production database contains one customer record and two demo-request records; no duplicate customer-email groups were found. No customer records or email addresses were displayed or changed.
- Verification limitation: no real demo lead was submitted, no Resend acknowledgement was triggered, and no Retell agent, phone number, customer subscription or production call routing was created. The Worker upload and binding preservation are confirmed, but the live `/api/demo-requests` route, Admin Console workflow, and browser form fallback still require controlled end-to-end testing.

## Shared public navigation and visible homepage AI assistant — proposed 2026-11-14

- Added a shared public-site header implementation in `site-header.js` and `site-header.css`, loaded by the sitemap's public marketing, legal, blog, insights, challenge, partner and Trust Lab pages.
- The shared header provides consistent Star69AI branding, primary navigation, a More menu, Client Login and Get Started links, plus an accessible responsive menu with Escape/outside-click closing.
- The homepage hero now removes the overlapping assistant speech bubble and the redundant “YOUR AI RECEPTIONIST · ALWAYS ON” and “STAR69AI · MANAGED AI RECEPTIONIST” labels. The assistant image remains beneath the introduction, and the AI Concierge iframe is displayed as a visible, inline chat widget below the image rather than hidden behind a bubble click.
- Changes are isolated on `fix/sitewide-header-visible-hero-assistant-2026-11-14`. They are not live until review and merge.
- Before merging, verify header presence and navigation on every public page at desktop/mobile widths; test all menu links, Client Login, Get Started, active-page states, and the visible homepage chat iframe. Confirm the Worker iframe loads, accepts a chat message, and remains usable on small screens. No Worker or D1 changes are included.


## Global AI receptionist provider directory — proposed 2026-11-14

- Added a public searchable directory at `/directory/` with 83 provider entries across nine markets: United States, Canada, United Kingdom, Ireland, Australia, New Zealand, South Africa, Singapore and India.
- Listings distinguish managed, hybrid, self-service, industry-specific and platform models. Search and filters cover provider, country, service model and billing model.
- Comparison fields include monthly pricing, included calls/minutes where reported, overage rates, setup fees, billing cadence, official provider website and a linked pricing-evidence page.
- Listings with unconfirmed terms use “Confirm” or “Quote required”; no missing price is presented as a verified price. Prices retain the provider's original currency and are not converted.
- Added the directory to the shared public navigation and sitemap. The page includes CollectionPage structured data, a research/pricing disclaimer, comparison guidance, FAQs and a Star69AI demo CTA.
- Research inventory is a first release, not a guarantee of complete worldwide coverage. Some prices and plan details are reported by dated third-party comparisons rather than independently rechecked against each provider's pricing page. Every listing links to the provider's own website and a supporting evidence page; confirm prices, tax, setup and eligibility directly with each vendor before relying on them.
- Branch: `feature/global-managed-ai-receptionist-directory-2026-11-14`. No merge or production publication has occurred. Before merge, validate every provider URL and pricing claim, inspect the directory on desktop/mobile, test all filters and links, and verify sitemap/navigation integration.


## Industry Intelligence Hub — 2026-11-14

- Added `/hub/` as the industry hub landing page, linking dental, plumbing, roofing, HVAC, legal, real estate, cleaning/property services and automotive use cases. Existing roofing, plumbing and HVAC pages remain the canonical industry detail pages.
- Added detailed industry pages at `/industries/dental-ai-receptionist/`, `/industries/legal-ai-receptionist/`, and `/industries/real-estate-ai-receptionist/` with industry-specific intake examples and safety/human-handoff boundaries.
- Added `/learning-center/` with pricing, missed-call, implementation and automation guides plus a browser-only missed-call gross-profit opportunity estimator. Calculator values are not submitted or stored; outputs are illustrative, not forecasts or promised recovery.
- Added `/research/managed-ai-receptionists.html`, a neutral comparison of DIY AI receptionist software, traditional human answering services and agency-built managed AI, including buyer questions about setup, operations, costs, privacy and portability.
- Shared styling is in `intelligence-hub.css`. Shared navigation now features Industry Hub and Learning Center, with Managed AI Research in More. All new public URLs are listed in `sitemap.xml`.
- Changes are on branch `feature/industry-intelligence-hub-2026-11-14`; browser/mobile and live sitemap verification remain pending until preview/live testing.


## Starfleet-inspired typography system — 2026-11-14

- Approved brand typography: Michroma for major H1/H2 display headings; Manrope for body copy and UI; IBM Plex Mono for restrained technical labels and statuses.
- Shared implementation lives in `readability.css`, which is already the final-loaded global readability layer across public, client and admin pages. Keep it last in page heads.
- The intended feel is premium, original starship-command-interface typography. Do not copy Star Trek logos, wordmarks or protected interface artwork.
- Preserve the existing readability standards: 15–17px ordinary copy, accessible contrast, responsive wrapping and comfortable line-height. Avoid applying Michroma to body paragraphs or dense data.
- Typography update branch: `design/star69ai-starfleet-typography-2026-11-14`; PR review required before merging.


## Homepage telephone history learning timeline — proposed 2026-11-14

- Added a textbook-style interactive timeline directly below the shared site header and immediately before the homepage hero/receptionist model.
- The seven chapters trace the telephone from Bell's 1876 patent, manual exchanges, automatic switching, Touch-Tone, mobile voice and internet/cloud telephony to conversational AI.
- Desktop visitors can select any chapter from the timeline; mobile visitors get a compact four-column chapter navigator plus Previous/Next controls. Keyboard arrow navigation, button labels, selected-state announcements and reduced-motion support are included.
- The closing lesson positions AI as the next evolution of the business front desk—not the end of the telephone—and explains listening, intent recognition, approved answers, information capture and human escalation without promising autonomous outcomes.
- Styling is isolated in `phone-evolution.css`; interaction is in `phone-evolution.js`. No Worker, D1, authentication, billing, lead form or existing assistant iframe behavior is changed.
- Branch: `feature/homepage-phone-evolution-textbook-timeline-2026-11-14`. Browser checks at 360px, 768px and 1280px, live visual inspection, keyboard/screen-reader review and GitHub Pages publication remain outstanding. Do not merge without explicit approval.


## First-month offers and prepaid billing — 2026-11-14

- Approved offer structure: `CALLSMART10` gives 10% off the first monthly subscription payment for standard referrals. Discounted partner referrals receive 15% off monthly subscription payments for the first 12 months; using `CALLSMART10` with a discounted partner link produces a 25% total discount on month one, then 15% off months 2–12. Standard partner links apply no partner discount but retain attribution and commission eligibility.
- Prepayment alternatives: six-month recurring Stripe price billed upfront at the approved 25% discount; twelve-month recurring Stripe price billed upfront at the approved 30% discount. These are separate billing intervals and cannot be combined with monthly partner/challenge discounts. The $99 setup fee remains separately invoiced.
- Stripe Worker configuration required before checkout activation: `STRIPE_COUPON_CALLSMART10` (Stripe coupon ID, 10% off, duration `once`), `STRIPE_COUPON_PARTNER15` (15% off, repeating for 12 months), plus plan-specific fixed-amount first-invoice challenge-stack coupons, plus `STRIPE_PRICE_STARTER_6MO`, `STRIPE_PRICE_GROWTH_6MO`, `STRIPE_PRICE_PRO_6MO`, `STRIPE_PRICE_STARTER_12MO`, `STRIPE_PRICE_GROWTH_12MO`, `STRIPE_PRICE_PRO_12MO`. Each six-/twelve-month price must be a recurring Price with `interval=month` and `interval_count=6` or `12`, and the full discounted term amount shown on the pricing page. Keep existing monthly Price IDs unchanged.
- Coupons must be configured in Stripe Dashboard and their IDs added as Cloudflare Worker variables/secrets. No secret values are committed. Do not claim discounts are redeemable until those variables are present and test-mode checkout verifies first invoice discount, renewal at full monthly price, six-/twelve-month renewal, cancellation and webhook commission amount.
- Challenge levels all unlock the same 10% code; difficulty changes points/experience, not discount value. Public pages disclose the 12-month partner discount, first-month combined offer, excluded setup/overage/tax/third-party charges, and separate prepaid terms. Partner link messaging dynamically shows the partner offer when the existing referral cookie is present.
- Partner commissions continue to use eligible subscription invoice amounts actually collected, after any first-month discount; attribution is preserved even when a referred customer uses the challenge code instead of the partner discount.
- Implementation branch: `feature/transparent-promotions-prepaid-partner-discounts-2026-11-14`. GitHub Pages publication and Cloudflare Worker deployment are separate; checkout fails closed when required Stripe price/coupon configuration is missing.


## Partner referral discount choice — implementation branch (2026-11-14)

- Feature branch: `feature/partner-link-discount-choice`; changes are not merged or deployed.
- Partner Center provides two referral links: discounted (`?ref=CODE&offer=discount`) and standard (`?ref=CODE&offer=standard`). Both preserve the 90-day attribution window and are eligible for the same partner commission tiers.
- Discounted link: 15% off monthly subscription payments for the first 12 months. A valid 10% challenge code adds a further first-month discount, for 25% total off month one and 15% off months 2–12. Prepaid billing offers remain separate and cannot be combined with promo codes. Standard link has no partner customer discount, but referral attribution and commission eligibility are preserved.
- Commission tiers are automatic: 20% for 1–4 active referred customers, 25% for 5–14, and 30% for 15+. Commission is calculated on eligible subscription amounts actually received after discounts, excluding taxes, refunds, chargebacks, credits, unpaid invoices, setup fees, phone-number rental, carrier charges, usage overage and third-party pass-throughs. 30-day validation hold; $50 minimum payout; monthly review.
- The Stripe commission base is the invoice line amount excluding tax minus the line's Stripe `discount_amounts`; this produces the eligible subscription amount after discounts and before tax.
- New migration: `cloudflare/migrations/20261114_partner_discount_link_choice.sql`. The existing base migration `cloudflare/migrations/20261111_partner_attribution.sql` must be applied before `20261114_partner_discount_link_choice.sql`; both are required before deploying the updated Trust Lab Worker. Apply them to the existing `avr-trust-lab` D1 database before deploying updated Workers.
- Required Stripe configuration: create a 15% coupon with `duration=repeating` and `duration_in_months=12`, set its ID as `STRIPE_COUPON_PARTNER15`; create plan-specific one-time fixed-amount coupons equal to 10% of the plan's list monthly price (`STRIPE_COUPON_CHALLENGE_STACK_STARTER` = $14.90, `..._GROWTH` = $24.90, `..._PRO` = $39.90); retain the existing 10% challenge-only coupon as `STRIPE_COUPON_CALLSMART10`. The Worker applies the 12-month 15% coupon first and the plan-specific fixed-amount coupon second for a 25% first-month total, then 15% for months 2–12. Confirm this exact sequence and totals in Stripe test mode.
- Deploy `avr-trust-lab-api` and `avr-platform-api` separately after migration and configuration. Test both link types end-to-end, including a standard referral that still credits a commission, a discounted referral, stacked challenge + partner discount, invoice commission base, refund/reversal behavior and the 30-day payout hold. GitHub Pages deployment alone does not deploy Workers or apply D1 migrations.


## Partner offer activation status — 2026-11-14

- Production D1 account/database: Cloudflare account `dff29b577252a9df4b05707a48f85014`, database `avr-trust-lab` (`6cf68b12-2aa8-4ed4-9f92-8a7824520d1a`).
- The base partner-attribution migration `20261111_partner_attribution.sql` was already present in production: `partner_code`, `affiliate_partner_id`, and the partner click/referral/commission tables were verified. Do not rerun its non-idempotent ALTER statements.
- Applied `20261114_partner_discount_link_choice.sql` to production D1. Verified `partner_clicks.offer_mode`, `partner_referrals.offer_mode`, and `avr_customers.affiliate_offer_mode` now exist. Existing rows receive the migration default `standard`.
- Created and verified the following Stripe coupons in the connected STAR69AI.COM **test-mode account only** (all have `livemode=false`): `STAR69AI_PARTNER15_12MO` (15% repeating for 12 months), `STAR69AI_CHALLENGE_STACK_STARTER` ($14.90 once), `STAR69AI_CHALLENGE_STACK_GROWTH` ($24.90 once), and `STAR69AI_CHALLENGE_STACK_PRO` ($39.90 once). Existing test coupons `CALLSMART10` and obsolete `PARTNER5` were left unchanged.
- The connected Stripe account currently exposes test mode only. Do NOT place these test coupon IDs in the production Workers: the live Stripe secret key cannot redeem test-mode coupons. Connect the STAR69AI.COM Stripe account in live mode before creating the four live coupons and setting the Worker coupon variables.
- Production Worker names verified: `avr-platform-api` and `avr-trust-lab-api`. Their current production scripts have not been updated with the feature branch code. No coupon variables were changed, no Worker was deployed, and no GitHub Pages publication/merge was performed because the live coupon IDs are not yet available.
- Resume: connect Stripe live mode; create matching live coupons; configure `STRIPE_COUPON_PARTNER15`, `STRIPE_COUPON_CHALLENGE_STACK_STARTER`, `STRIPE_COUPON_CHALLENGE_STACK_GROWTH`, and `STRIPE_COUPON_CHALLENGE_STACK_PRO` on `avr-platform-api`; verify `STRIPE_COUPON_CALLSMART10` points to the live 10% challenge coupon; test checkout/webhook and commission amounts; then deploy both Workers and merge/publish the website branch.



## Partner offer production deployment update — 2026-11-14

This section supersedes the earlier activation-status notes above where they describe the Stripe connection as test-mode-only, state that production Workers have not been deployed, or describe applying two coupon objects in one Checkout Session.

- PR: [#142](https://github.com/hisjarman/star69ai/pull/142), branch `feature/partner-link-discount-choice`, base `main`.
- Production D1 migration `20261114_partner_discount_link_choice.sql` is applied. The three `offer_mode` columns were queried and verified on the existing `avr-trust-lab` database.
- Stripe STAR69AI.COM exposes both test and live mode. Live and test coupons are configured. Live coupon IDs: `STAR69AI_PARTNER15_12MO` (15% repeating for 12 months), `CALLSMART10` (10% once), `STAR69AI_CHALLENGE_PARTNER_STARTER` ($37.25 once), `STAR69AI_CHALLENGE_PARTNER_GROWTH` ($62.25 once), `STAR69AI_CHALLENGE_PARTNER_PRO` ($99.75 once), and `STAR69AI_PARTNER15_11MO` (15% repeating for 11 additional months).
- Stripe Checkout accepts only one discount object per Session. For a discounted partner link plus the 10% challenge code, checkout applies one plan-specific 25% first-invoice coupon; after `checkout.session.completed`, the platform webhook attaches the 15% repeating coupon for the next 11 invoices. This preserves 25% off month one and 15% off months 2–12. A standard partner link with the challenge code receives only the 10% one-time coupon; a discounted partner link without the challenge code receives the 15%/12-month coupon.
- Live Stripe monthly plan prices were verified against the active Starter ($149), Growth ($249) and Pro ($399) products. Live prepaid recurring prices were created: six-month term prices reflect 25% off six monthly payments; annual term prices reflect 35% off twelve monthly payments; these legacy prepaid Stripe Price IDs are not used by the current public checkout, which charges prepaid terms once through PayPal. Their IDs are stored as Cloudflare Worker secrets, not committed to Git.
- Cloudflare `avr-platform-api` has monthly plan Price IDs and legacy prepaid Price IDs configured as secret bindings; only monthly Price IDs are used by the current checkout. Coupon IDs remain secret bindings. Coupon and price secret values must never be written to repository files.
- Updated `avr-platform-api` and `avr-trust-lab-api` source from this feature branch were uploaded successfully to their existing production Workers. The latest platform deployment was confirmed at 2026-11-15T02:56:28Z; the Trust Lab Worker deployment was confirmed at 2026-11-15T02:52:35Z. D1 bindings and existing Worker settings were preserved by content-only uploads.
- Commission calculation now allowlists the Star69AI plan Price IDs, excludes unrelated subscription items such as metered usage and phone-number rental, subtracts Stripe line discounts, excludes tax, and scales the eligible amount by the portion of the invoice actually paid. The 30-day hold and $50 minimum remain. Administrators retain manual reversal controls for refunds, disputes and accounting corrections; do not describe refund reversal as automatically processed.
- Still required: end-to-end checkout and signed-webhook tests in Stripe test mode, verify renewal discount periods and the 25% + 15% sequence, verify commission ledger entries and manual reversal, and perform browser QA of Partner Center and public pages. GitHub Pages is still awaiting merge of PR #142; do not claim the website has published until the PR is merged and the Pages deployment is verified.


## Receptionist Architect Challenge + Learning Center integration — 2026-11-15

- Current main contains a 45-scenario bank split across Starter, Pro and Expert, but the previous experience sampled only five questions per run and exposed the same first-month coupon after any perfect run.
- Feature branch `feature/learning-linked-receptionist-challenge-2026-11-15` expands each level into a full 15-scenario mastery run (45 total), randomizes order, requires Starter before Pro and Pro before Expert, and stores progress locally for learning continuity only.
- Intended rewards by level: Starter 5% off subscription for the first 12 months; Pro 10% off subscription for the first 12 months; Expert 10% off subscription for the first 12 months plus 50% off the one-time setup fee. Challenge rewards cannot stack with partner discounts or prepaid plans.
- Each answered scenario opens a context-specific lesson in `learning-center/receptionist-architect-curriculum.html`. The curriculum covers triage, knowledge quality, lead intake, scheduling, human handoff, privacy/consent, AI/tool security, conversation design and quality assurance, with implementation checklists and external references.
- IMPORTANT: local browser progress is not proof of eligibility. Do not activate or honor any challenge discount based solely on client-side storage. Server-side challenge attempt/progress verification, one-time customer redemption, Stripe promotion configuration for all three tiers, and end-to-end checkout/webhook tests remain required before advertising challenge rewards as redeemable.
- No Worker, D1 or Stripe changes are made by this frontend/content branch. Keep it unmerged until backend reward verification and browser/accessibility testing are complete.


## Partner-first navigation, private partner economics and technology timeline — 2026-11-15

- Feature branch: `feature/partner-header-private-console-history-timeline-2026-11-15`.
- Shared site header adds a visually prominent **Partner Login** action linking to `/partner-portal/`, while preserving Client Login and Get Started. The mobile navigation also exposes Partner Login.
- Public `/partners/` page no longer publishes commission percentages, tier thresholds, earnings examples, referral-link options or customer discount details. It presents the application and a private Partner Center sign-in path instead.
- Authenticated Partner Center now contains a private program disclosure covering the commission schedule (20% for 1–4 active referrals, 25% for 5–14, 30% for 15+), commission base/exclusions, 90-day intended attribution, validation/payout terms, the 15% subscription discount for 12 months, and non-stacking with AI Challenge or prepaid offers.
- Important setup-fee limitation disclosed inside Partner Center: the approved 50% setup-fee discount is not yet integrated into the separate one-time setup invoice flow. Do not tell partners it is automatically applied until that backend/invoice work is completed and tested. The discounted referral link currently represents the subscription discount only.
- Homepage top area now shows only a compact, seven-stop year timeline immediately below the shared header. Selecting a year opens the corresponding detailed history card in the technology section located after the homepage demo-intake form.
- The historical chapters cover Bell and Watson / Bell Telephone Company (1876), George W. Coy / New Haven District Telephone Company (1878), Almon B. Strowger / automatic switching (1891), Bell Laboratories and Touch-Tone (1963), Martin Cooper / Motorola cellular prototype (1973), VocalTec / early VoIP (1995+), and the evolution from ELIZA and Transformer research to modern conversational voice AI.
- Historical references are linked from the detail cards, including the U.S. patents, National Park Service, Bell System archive, Motorola history, IEEE Spectrum and the original ELIZA paper.
- Static website files only. No Worker, D1, Stripe, Clerk or production configuration was changed. The partner setup-fee discount remains a known backend gap and is clearly disclosed in the private console.
- QA still required before merge: desktop/mobile header layout on representative pages; partner public-page content audit; signed-in/approved and signed-out/unapproved Partner Center views; year-card scroll/accordion behavior; keyboard, reduced-motion and mobile timeline review; HTML and JavaScript validation. Do not merge without explicit user approval.


## Partner offer exclusivity enforcement — 2026-11-15

- In `cloudflare/platform-worker.js`, monthly checkout now rejects `CALLSMART10` when the customer is attributed to a discounted partner link (`partner_discount_cannot_be_combined_with_challenge`). A standard referral can still use the AI Challenge code; a discounted partner referral uses the partner subscription offer instead.
- Removed the old Checkout-completion webhook behavior that attached a partner follow-up coupon after a stacked first-month challenge/partner coupon.
- Prepaid checkout already rejects promo codes and does not apply the monthly partner coupon; prepaid prices remain their own standalone offer.
- The partner setup-fee discount remains unimplemented because setup is invoiced separately; Partner Center warns partners not to promise automatic application until that invoice workflow is updated.
- This is a source change only. It must be deployed to the existing `avr-platform-api` Worker separately from GitHub Pages. Do not claim production enforcement until the Worker deployment and Stripe test-mode checkout/webhook cases are verified.


### Review and static validation — PR #144

- Draft PR: https://github.com/hisjarman/star69ai/pull/144
- Compared against current `main`: branch is 15 commits ahead and 0 behind; GitHub reports the PR mergeable with a clean merge state.
- Static checks completed: JavaScript syntax passed for `site-header.js`, `phone-evolution.js`, `partner-portal/partner-portal.js`, and the ES-module platform Worker after normalizing its `export default` for parsing; modified CSS files have balanced braces.
- Structural checks passed: homepage, public partner page and Partner Center have balanced key HTML tags. The homepage's pre-existing extra closing tags around the hero were corrected.
- Content checks passed: the public partner page no longer contains commission rates, discount percentages, customer offer specifics, plan-level commission examples or referral URL fields. Partner economics and link choices remain within the hidden, authenticated Partner Center dashboard.
- Timeline checks passed: seven top year links match seven detail cards, and the detailed history section appears after the homepage intake form.
- Checkout source check passed: a discounted partner referral cannot use the AI Challenge promo code; the old stacked coupon and follow-up webhook code paths are removed. Prepaid checkout continues to reject promo codes.
- Not yet completed: visual browser QA, live authenticated partner-account verification, Stripe test checkout/webhook tests, Cloudflare Worker deployment, and GitHub Pages publication. PR remains draft and unmerged.
