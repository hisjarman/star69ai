## Capabilities hero refinement — 2026-11-18

- Removed the abstract orb / AI-front-office centerpiece artwork from the capabilities hero.
- Replaced the right side with a responsive, illustrated 12-item capability dashboard: 24/7 call answering, bookings/reservations, customer recognition, lead qualification, missed-call recovery, SMS/notifications, smart routing, business integrations, Call Shield, multilingual voice, payment workflows and analytics.
- Kept the left side focused on the value proposition and custom-demo CTA. Added responsive layouts for tablet and mobile and retained the existing dark Star69AI palette.
- Static checks: prior hero visual/orbit markup absent; key capability tiles present; responsive CSS breakpoints retained. Visual browser QA still required.
- PR #278 remains the review/merge vehicle. No deployment or backend changes.

## Public capabilities page — 2026-11-18 — REVIEW REQUIRED

- Added `capabilities.html` and `capabilities.css` on branch `feature/public-capabilities-page-2026-11-18`.
- The page presents Star69AI as a managed AI front office and groups capabilities into answering/understanding, booking/coordination, follow-up/recovery, and protection/improvement. It includes industry examples, secure integration expectations, a clear capabilities disclaimer, and custom-demo calls to action.
- Added the page to the global Mission Control navigation in `site-header.js` and to `sitemap.xml`.
- Content is intentionally qualified: appointment and restaurant booking require a supported connected booking system; CRM/customer recognition, messaging, payments and other workflows depend on provider support, customer permissions, plan and testing. The page does not claim every feature is active for every customer.
- No homepage conversion sections, Worker routes, D1 schema/data, Retell configuration, billing, auth or customer records were changed. No merge or deployment performed.
- Static source assertions: pageTitle:PASS, canonical:PASS, capabilitySections:PASS, caveats:PASS, demoCTA:PASS, sharedReadability:PASS, responsiveCss:PASS, cssBraces:PASS, navLink:PASS, sitemapLink:PASS.
- Browser visual/accessibility QA at 360px, 768px and 1280px, link checks and GitHub Pages deployment verification remain outstanding. Review via PR; do not merge to `main` without the founder's explicit approval.

## Client Integrations Hub — 2026-11-18 — REVIEW REQUIRED

- Added an Integrations page to client Mission Control with a responsive catalog of CRM, field-service, calendar, Google Workspace, automation and custom-system connection requests.
- The page positions Star69AI as the managed setup layer around Retell and approved provider APIs. Clients submit a request; existing tenant-scoped `/api/client/agent-change-requests` workflow stores it as a workflow request, and existing Crew review/quote/approval statuses are displayed in the new page.
- Requests explicitly ask the Crew to confirm provider support, permissions, read/write scope, costs and testing before activation. The UI warns clients not to submit passwords or API keys.
- Important limitation: this is a managed request and status interface, **not** a completed OAuth connection manager or proof that any named provider is currently connected. No CRM credentials, OAuth tokens, provider webhooks, external customer records, Retell integration settings, Worker routes, D1 schema, billing, or production configuration were changed.
- Existing Retell tools and third-party integration options must be verified per provider and per customer before the Crew confirms a connection. Do not advertise any card as a live integration until connection, tenant isolation, least-privilege permissions, and end-to-end tests pass.
- Static source assertions passed for the navigation item, page panel, stylesheet linkage, request handler, existing tenant-scoped API route, request history rendering, page hash support and responsive styles. Browser QA at mobile/tablet/desktop and a full signed-in client/admin request lifecycle test remain outstanding.
- Working branch: `feature/client-integration-hub-2026-11-18`. Review via PR. Do not merge to `main` without the founder's explicit approval.

## Client-configurable Call Shield — 2026-11-18 — MERGED AND DEPLOYED

- PR #274 merged to `main` with squash commit `0db2f79e31c9fd81b06cda0f47cc9b65128a6a4b`.
- Applied production D1 migration `cloudflare/migrations/20261118_call_shield_client_settings.sql` to database `avr-trust-lab` (UUID `6cf68b12-2aa8-4ed4-9f92-8a7824520d1a`). Confirmed the table and supporting index exist after migration. The original Call Shield tables and events were already present; no historical data was altered.
- Deployed merged `cloudflare/platform-worker.js` to Worker `avr-platform-api` using the content-only upload endpoint, preserving the existing Worker configuration and bindings. Deployment ID `c663a77d37604090bb8b611675aa2f00`, created 2026-11-18 20:16:21 UTC. Confirmed deployment is at 100% traffic and existing Clerk, Retell, Stripe, PayPal, Resend, AI and D1 bindings remain configured.
- Client Mission Control includes a dedicated Call Shield page with Standard, Strict and Business Friendly presets plus editable limits: 3–20 attempts, 1–60 minute window, 1–120 minute cooldown, and 1–30 minute maximum AI call duration. It displays 30-day screening/rejection totals and recent privacy-preserving event history (no raw caller numbers).
- Authenticated client API is tenant-scoped and validates values server-side. Administrator-only GET/PUT routes allow the Crew to inspect and override the same bounded settings in the existing client supervision modal. Actor labels are stored with settings changes.
- Inbound Retell webhook applies each customer's attempt/window/cooldown values before connecting the agent. Both subscription and Flex call overrides cap `max_call_duration_ms` at the configured customer duration or the lower amount permitted by existing minute/balance reservations. Existing 75% overage hard-stop and Minute Vault/plan checks remain in force.
- Global hard bounds remain server-controlled. Client settings cannot disable screening, bypass account authorization, raise the 75% overage ceiling, or automatically create a permanent denylist. Private/invalid caller IDs remain unblocked by the repeat-caller rule; permanent blocks require Crew review. AI caller-risk labels remain advisory only.
- Validation completed before merge: Worker/client/admin JavaScript syntax checks, static assertions for tenant scoping/admin authorization/dynamic thresholds/both duration caps/overage protection/privacy-safe event fields, isolated SQLite migration and attempt-threshold tests. Production D1 schema and Worker deployment verified after merge.
- Remaining rollout QA: authenticated client/admin browser tests at mobile/tablet/desktop sizes; live Retell inbound tests for all modes, custom thresholds, cooldown expiry, caller privacy, duration caps, Flex wallet reservations and 75% overage stop; verify GitHub Pages published client/admin assets. DNS/network access from this session prevented independent live-site/browser confirmation.
- GitHub Pages source is now on `main`; do not assume public asset propagation until the deployed pages are checked. No Retell number configuration or billing settings were changed.

## Call Shield and caller-risk intelligence — 2026-11-18

- Working branch: `feature/ai-call-shield-intelligence-2026-11-18`, based on main after PR #272 merged at `35a911749303b376f1a59299f25b1f8499fe09d5`.
- Existing architecture already provided a Retell inbound webhook before agent connection, per-call minute reservations, and plan/wallet usage gates. Added Call Shield screening ahead of those existing reservations.
- Call Shield scopes caller fingerprints to customer + dialed business number using HMAC keyed by the existing Retell API secret; raw caller numbers are not written to shield tables. It deduplicates by Retell call ID, allows the first eight same-caller attempts in a fixed ten-minute burst window, rejects the ninth and subsequent attempts for a 15-minute cooldown, and retains operational events/state for at most 30 days. Withheld/invalid caller IDs are not automatically blocked. Caller-ID spoofing cannot be reliably detected by this rule.
- Screening is pre-answer: a rejected call does not connect to the AI agent and therefore avoids AI-agent conversation minutes. Carrier/telephony delivery charges may still apply. Existing per-call reservations and account minute/overage controls remain in place.
- If the new Call Shield tables are missing or screening errors, the shield fails open and existing billing/minute protections still execute. This prevents an un-applied migration from accidentally rejecting all legitimate calls.
- Extended Cloudflare Workers AI post-call analysis with cautious caller-risk assessment and evidence signals. AI risk findings are advisory only; they never automatically block/blacklist a caller or publish live agent changes. Mission Control now displays risk assessments and a 30-day count of repeat-call attempts rejected before agent connection.
- Added public homepage and Receptionist Intelligence page messaging for Call Shield and continuous call intelligence, including limitations (caller-ID spoofing, unavailable caller ID, no guarantee of blocking every spam call, possible carrier fees).
- New D1 migration: `cloudflare/migrations/20261118_call_shield_protection.sql`. Must be applied to production `avr-trust-lab` before Worker deployment. Worker inbound webhook is already configured via the existing admin billing-protection sync route; verify all live numbers still point to `/webhooks/retell/inbound`.
- Source changes only. No D1 migration applied, Worker deployed, Retell phone-number settings modified, or GitHub Pages deployment verified. Before rollout, validate migration on a non-production copy, run SQL/Worker syntax checks, test allowed/rejected/deduplicated caller sequences, test private caller IDs, test minute reservation and overage behavior, and verify client tenant isolation. Browser QA at mobile/tablet/desktop widths remains outstanding.
- No merge to `main` without the founder's explicit approval.

## Homepage Call Rescue Simulator — 2026-11-18

- Working branch: `feature/call-rescue-simulator-2026-11-18`, based on current `main` at `97291e220a6c84965d58eb86ba22f0e8b9dbb2e1`.
- Audited the existing public Secret Mission and Receptionist Architect challenge before adding anything. The site already has a five-signal Secret Mission with local progress and a separate 45-scenario learning challenge; do not create a duplicate Easter-egg or quiz system.
- Added a homepage Call Rescue Simulator immediately after the hero. Visitors can compare letting a fictional plumbing inquiry reach voicemail, answering personally while working, or having a configured AI receptionist capture the request and prepare a team handoff.
- The simulator is explicitly fictional and local-only: it does not place calls, submit forms, collect visitor data, claim bookings/dispatch, or promise outcomes. The AI path is described as an example subject to client-approved configuration and business rules.
- Added dedicated responsive CSS and accessible interaction JavaScript, including keyboard focus, live result announcements and reduced-motion support. The CTA leads to the existing discovery form.
- Preserved the existing Secret Mission, its reward/checkout logic, the Receptionist Architect challenge, pricing, navigation and all backend integrations. No Worker, D1, Retell, Stripe, PayPal, Resend, auth, customer or prospect data changed.
- Static source assertions passed for the section, stylesheet/script references, all three outcomes, no outbound call/API behavior, reduced-motion/mobile styles and the simulation disclaimer. Browser QA at mobile/tablet/desktop widths and GitHub Pages deployment remain outstanding.
- PR review required. Do not merge `main` without the founder's explicit approval.

## Client Mission Control visual correction — 2026-11-18

- Follow-up to the initial cinematic client dashboard pass: the dashboard still read too much like the previous interface, the atmosphere was too faint, and default green buttons were not approved.
- Added a stronger layered deep-space/nebula background with brighter blue and purple atmospheric light, richer star points, and improved depth behind the authenticated workspace.
- Replaced default primary green buttons with a blue-to-purple command gradient; secondary buttons remain dark outlined blue/purple. Green is reserved for semantic positive/live indicators. Active navigation now uses blue/purple rather than green.
- Increased visual separation and depth for the workspace header, sidebar, page heading and content panels. Mobile overrides preserve the same palette and hierarchy.
- Presentation-only CSS change in `client/mission-control-cinematic.css`. No client data, auth, billing, APIs, Worker, D1, Retell, Stripe, PayPal, or customer records changed. Static source checks only; browser visual QA and Pages deployment remain to be verified.

## Single discovery intake and corrected prepaid pricing — 2026-11-18

- Consolidated homepage demo lead capture into the existing three-step `get-started.html` discovery form. Removed the separate homepage Formspree quick-lead form and its dedicated `demo-request.js` handler; the homepage now links to the canonical discovery brief. The weekly story newsletter form remains separate because it is an email subscription, not a sales lead form.
- Updated the discovery form's billing schedule to the approved six-month 25% and twelve-month 35% prepaid discounts. Added the exact upfront totals for Starter ($670.50 / $1,162.20), Growth ($1,120.50 / $1,942.20) and Pro ($1,795.50 / $3,112.20).
- Clarified that prepaid terms are paid in full through PayPal and waive the $99 setup fee; monthly plans retain the separately invoiced $99 setup fee. Prepaid savings are not stackable with partner, AI Challenge or other promotional discounts.
- Updated homepage pricing copy to match the same prepaid savings and setup-fee treatment.
- No Worker, D1, billing integration, Stripe subscription, PayPal checkout, partner commission, AI Challenge, authentication or customer/prospect data behavior was changed. No records were submitted or modified.
- Static source checks are required before PR review. Browser QA and GitHub Pages deployment remain outstanding. This branch is not merged; do not merge `main` without the founder's explicit approval.

## Phase 2 discovery-to-demo personalization — 2026-11-18

- Working branch: `feature/phase-2-discovery-demo-personalization-2026-11-18`, created from current `main` after reviewing this handoff and the existing homepage intake, three-step discovery form, Worker API, D1 migrations and Command Center demo queue.
- Audit confirmed the complete discovery pipeline already exists: `get-started.html` collects business and call-handling preferences; `app.js` sends the complete brief to `POST /api/demo-requests`; the Worker stores the structured answers in `avr_demo_requests.discovery_json`; Command Center displays the discovery record and gates demo-agent creation behind approval; Retell demo-agent provisioning includes supplied discovery facts as unverified business context and explicitly disclaims unconnected integrations.
- The homepage has a shorter quick-lead form. A later full discovery submission from the same email is merged into an eligible quick lead when no demo agent has been created. Formspree remains a fallback only when the platform request cannot be reached; those backup submissions require manual review and are not automatically placed in the demo queue.
- Corrected the full discovery form's misleading “every field optional” copy. Contact name, business email, phone, business name and industry are now required, and client-side step validation now enforces required fields. Selecting “Other / not listed” also requires the custom industry detail.
- Made the discovery privacy acknowledgement required in the browser and enforced it server-side for complete discovery submissions. Quick-lead submissions remain compatible with their existing lighter intake path.
- Personalized the Command Center's suggested demo call scenarios using the prospect's own call tasks, services, FAQs and service area, in addition to the existing industry-specific scenarios. The supplied answers remain prospect-provided context; the demo must not invent facts or claim integrations that are not connected.
- Static validation performed on the branch: JavaScript syntax checks passed for `app.js`, `admin/admin.js`, and `cloudflare/platform-worker.js` (Worker default export wrapped for parse-only validation); source assertions confirmed required-field, custom-industry, consent and personalized-scenario wiring.
- Not yet performed: browser QA at mobile/tablet/desktop widths, live form submission, production D1 verification, Retell demo-agent creation, or Cloudflare Worker deployment. No customer data was submitted or changed. No production Worker deployment or merge to `main` has been performed. Review via PR; do not merge without the founder's explicit approval.

## Sitewide design-system consistency pass — 2026-11-18

- Working branch: `design/phase-1-sitewide-token-consistency-2026-11-18`, based on current `main` after PR #260 was merged and its GitHub Pages deployment succeeded.
- Standardized remaining legacy accent colors in shared and page-specific CSS to the approved Star69AI palette: purple `#F461FE`, blue `#43B4FE`, green `#34FD78`, and the approved green hover companion `#69FF98`. Updated old RGB glow values to the corresponding approved palette values.
- Standardized remaining legacy `DM Sans` and `DM Mono` CSS font declarations to Manrope and IBM Plex Mono. The shared `readability.css` layer already supplies the canonical Michroma / Manrope / IBM Plex Mono type system.
- Replaced the client cockpit's legacy Inter font stack and green palette values with the shared body-font token and approved green accents.
- Added the shared `/readability.css` layer to `checkout-complete.html`, `newsletter-admin.html`, `partners-admin.html` and `trust-lab-admin.html`, which were the four HTML pages found missing it during the 55-page inventory.
- Aligned inline accent colors in checkout and pricing pages. No page layout, hero artwork, navigation, form destination, authentication, Worker, D1, Retell, Stripe, PayPal, Resend, or customer/prospect data behavior was intentionally changed.
- Static source validation on the branch: scanned all 35 CSS files for the audited legacy palette values and DM Sans / DM Mono / Inter declarations; none remained. Checked CSS brace counts for the audited files. Scanned all 55 HTML pages for audited legacy inline palette values and confirmed each loads the shared readability layer.
- Browser-based visual QA at 360px, 768px and 1280px has not yet been performed. Review the PR and perform visual QA before merge. GitHub Pages deployment will run only after the founder approves merge. Do not merge `main` without explicit approval.

## Knowledge base and production status correction — 2026-11-18

- Added the Star69AI Knowledge Base for the founder/operator, AI development assistants, Crew and clients. Start at `docs/knowledge-base/README.md`.
- The prior note below was stale: **PR #256 was merged on 2026-11-18** (merge commit `8ab19d3d59670f962bd4fc980af0c405fa0f8619`). Do not describe it as open or unmerged.
- A fresh production inspection found `avr-platform-api` has a Workers AI binding named `AI`, its deployed version receives 100% of traffic, and the production D1 database contains the Intelligence tables. The default source model is `@cf/zai-org/glm-4.7-flash`, overridable by `INTELLIGENCE_MODEL`.
- The main source contains call-analysis and prompt-optimization workbench logic. This is **not proof** that the complete real-call → report → proposal → scenario test → approval → Retell publication workflow has passed end to end. No completed Intelligence report/proposal was present in the inspected production database at audit time.
- Found and corrected on the knowledge branch: the Intelligence API configuration response and client status message still referenced `OPENAI_API_KEY` and an obsolete OpenAI model. They now report the Cloudflare Workers AI binding and model. This frontend/Worker source correction is not deployed until the branch is reviewed, merged and the Worker redeployed.
- Remaining verification: real Retell `call_analyzed` webhook, exactly-once processing, recoverable AI failure/retry, customer tenant isolation, large-prompt truncation safety, scenario test results, approval audit trail and rollback.
- Never add or expose provider secrets in repository files. Confirm bindings and secret names in the provider dashboard without copying secret values into GitHub.

## Cinematic homepage, astronaut spaceship cursor and client Mission Control refinement — 2026-11-18

- Homepage banner source artwork is 2080×1136. Changed from contain (which made it look like a small centered picture) to cover/crop inside a slightly shorter fixed-height responsive banner. Header height was reduced, not expanded.
- Receptionist portrait source is 608×1181. Reduced its visual size and constrained it to the right-side desktop column beside homepage copy; mobile layout stacks a smaller portrait beneath the copy. The portrait and call-summary card link to the custom-demo form.
- Root cause of the non-working native cursor: supplied assets/cursor.webp is 1920×1280. MDN notes Chromium and Firefox commonly ignore cursor images above 128×128 and recommends 32×32. A desktop-only scaled image follower now renders the exact supplied spaceship-with-astronaut artwork at a small visual size. Text fields retain text cursor; touch devices keep native behavior.
- Upgraded authenticated client Mission Control with a cinematic space-horizon banner, starfield/glow treatment, glass-like panels, neon blue/purple/green accents and stronger hierarchy. Existing data, navigation, Clerk session and Worker/API workflows are unchanged.
- Source-level validation only until PR review, merge, GitHub Pages deployment and browser QA at desktop/mobile widths. Cursor must be checked with mouse/trackpad; touch devices retain native cursor.

## Clickable canonical logo on interior pages and complete homepage banner — 2026-11-18

- Added the same canonical `/assets/main_logo.webp` wordmark used by the footer to the shared public header on interior pages. The wordmark links directly to the homepage and is hidden on the homepage itself to keep the cinematic landing page uncluttered.
- Kept the existing header/banner dimensions unchanged. The homepage's `/assets/image_hero.webp` now uses `object-fit: contain` so the full supplied artwork is visible instead of being cropped; the unused space stays within the existing dark banner.
- Confirmed the desktop cursor rule continues to use the supplied `/assets/cursor.webp` with its 16×16 hotspot; touch devices retain their native cursor behavior.
- No Worker, D1, authentication, billing, Retell, Stripe, PayPal, Resend, customer data or backend configuration changed.
- Source review only until PR approval, merge, GitHub Pages deployment, and desktop/mobile browser visual checks.

## Secret Mission reward and custom cursor — 2026-11-18

- Replaced the desktop spaceship cursor data-URI with the supplied `/assets/cursor.webp`; touch devices retain native cursor behavior.
- Secret Mission completion now unlocks the Star Navigator reward: 15% off monthly subscription charges for 12 billing months.
- Added checkout handoff using `STAR15MISSION`; checkout pre-fills the reward automatically. Worker validates the configured Stripe coupon is exactly 15% off, repeating for 12 months, and rejects prepaid plans and partner-discount stacking. Stripe coupon is supplied through Worker secret `STRIPE_COUPON_SECRET_MISSION15`; it must be configured to a matching Stripe coupon ID before this reward can be redeemed.
- Public pricing and reward terms clarify exclusions: setup, overage, taxes, third-party charges and other promotions.
- Source changes only until reviewed, merged, the Stripe coupon is created/configured, and the Cloudflare Worker is deployed. Do not claim the reward is live before all steps are complete.

## Sitewide footer branding, readability and banner confirmation — 2026-11-17

- Owner requested that the existing /assets/image_hero.webp remain the primary cinematic site banner, that footer presentation be corrected across pages, and that undersized/inconsistent Star69AI logos be fixed.
- Confirmed the shared public header already uses /assets/image_hero.webp as its full-width cinematic cover. The approved header/menu source files remain byte-for-byte unchanged under the permanent design lock.
- Added higher-specificity shared footer rules in styles.css to render the canonical assets/main_logo.webp wordmark at a readable 220px desktop / 200px mobile maximum, remove legacy text-logo remnants, and improve footer copy, link and disclaimer contrast/size.
- Replaced the legacy AI Virtual Receptionist icon/text brand in the How It Works footer with the official Star69AI wordmark and current Communications, Evolved. tagline.
- Replaced the text-only Trust Lab footer brand with the official wordmark and added responsive sizing and readable link treatment in trust-lab.css.
- No Worker, D1, authentication, billing, Retell, Stripe, PayPal, Resend, customer/prospect data, or production configuration changed.
- Review source changes and run GitHub Pages deployment plus desktop/mobile visual checks before calling the work live. The frozen site-header.js and site-header.css files were not modified.

## Restore the approved cinematic menu and retain footer refinements — 2026-11-17

- Feature branch: `restore/cinematic-menu-pr215-footer-refinement-2026-11-17`, based on current `main` after inspecting the project handoff, current shared header/footer files, and the exact merged PR #215 implementation.
- User reconfirmed PR #215's design as the approved baseline after the simplified navigation in PR #243 failed to meet expectations.
- Restores PR #215's full-width cinematic cover and interactive MENU control, translucent Mission Control destination panel, 18 illuminated navigation destinations, active-page state, responsive grid, keyboard Escape behavior, outside-click close, focus return, and inert-state accessibility.
- Uses the current designated hero asset `/assets/image_hero.webp` instead of the obsolete filename referenced by the original PR #215 implementation.
- Restores the PR #215 compact utility strip for Partner Login, Client Console and Initiate Contact; removes the conventional permanent navigation bar.
- Retains PR #243's footer readability and compact logo refinements, including high-contrast footer text/links and reduced wordmark size/padding. Retains canonical `main_logo.webp` normalization for legacy footer logos.
- No Worker, D1, authentication, billing, Retell, Stripe, PayPal, Resend, customer/prospect data or production configuration changed.
- Source-level JavaScript syntax and CSS structure checks are required before review. Browser visual QA and GitHub Pages deployment must be verified separately; this branch is not merged or published. Do not merge `main` without explicit user approval.

## Restore full public navigation and compact readable footer — 2026-11-17

- Feature branch: `fix/restore-navigation-compact-readable-footer-2026-11-17`, created from current `main` after inspecting the simplified shared header, homepage markup, prior navigation implementation and footer styles.
- Root cause: the simplified shared header replaced the full navigation with a cinematic sticky banner and three buttons; its installer also removed the legacy homepage navigation, including the hamburger menu. This removed the primary site destinations and the hamburger interaction instead of resolving the overlapping/persistent navigation.
- Restored a full Star69AI public navigation using the canonical `assets/main_logo.webp` wordmark, Home, Features, Pricing, How it works, Industries, Explore dropdown, 55+ Languages dropdown, Partner, Client Login and Get Started. The menu collapses to an accessible hamburger navigation on smaller screens, with Escape/outside-click/link-close behavior and current-page highlighting.
- Removed the persistent/sticky positioning and oversized hero-banner header from the public navigation. The header now occupies normal document flow and cannot remain fixed over the hamburger menu or page content.
- Reworked footer styles for high-contrast light text and links on the dark background. Reduced the footer wordmark from 240px to 150px, removed excess logo padding/margins, and tightened the brand column so the navigation links and contact details use the available space.
- Kept the existing canonical footer logo normalization and all footer destinations/content. No client/admin portal navigation, Worker, D1, authentication, billing, Retell, Stripe, PayPal, Resend, customer or prospect data/configuration changed.
- Source-level syntax and selector checks are required; real desktop/mobile browser visual QA and GitHub Pages deployment remain unverified. Review via PR; do not merge `main` without explicit user approval.

## Simplified sticky header, legacy header removal and enforced dark footer — 2026-11-17

- Feature branch: `fix/simplify-sticky-header-dark-footer-2026-11-17`, created from current `main` after reading this handoff and inspecting the shared header/footer implementation and homepage.
- Root cause of the duplicate/persistent logo menu: the homepage still contained a second legacy `s69-header`, its standalone menu controller and an orphaned `reference-topbar` controller. The shared installer also left room for legacy public header variants on pages with different markup.
- Removed the homepage's old `s69-header` markup and its menu scripts/styles. The shared header installer now removes retired public-site header variants, prevents duplicate shared headers, and leaves nested component headers (such as the AI assistant panel) alone.
- Replaced the old mission-control dropdown with one compact, full-width sticky header: the cinematic `image_hero.webp` banner remains visible and the only header actions are **CLIENT**, **PARTNER**, and **INITIATE CONTACT**. Removed the separate left-side header logo/mark and the legacy hamburger navigation. The three actions stay visible as part of the entire sticky header while scrolling.
- Corrected footer theming with high-specificity dark background and readable text rules in the shared stylesheet, plus a final runtime theme guard injected after page styles. The official footer wordmark remains intact.
- Homepage source no longer contains the old `s69-header` or `reference-topbar` menu controller. Removed the unused public-header rules for `.topbar`, `.reference-topbar`, `.reference-nav`, `.menu-toggle`, `.client-login-global` and associated retired brand/menu classes from the shared public `styles.css`; the only remaining legacy-selector references are deliberate cleanup selectors in the installer so stale markup is removed from older pages.
- No Worker, D1, authentication, billing, Retell, Stripe, PayPal, Resend, customer or prospect data/configuration changed. Source validation and real desktop/mobile visual testing are required before merge.
- Review through PR. Do not merge `main` without explicit user approval.

## Mobile navigation overlay, compact cockpit banner and dark footers — 2026-11-17

- Feature branch: `fix/mobile-navigation-footer-banner-2026-11-17`, created from current `main`.
- Corrected the mobile mission-control menu so it opens as a full-viewport overlay above persistent page navigation and content, with a fixed close control, independent scrolling, and background scroll lock. The open state is reflected on the body and cleared on close.
- Corrected the authenticated client cockpit drawer to sit above all page layers, lock background scrolling while open, and close with Escape, the backdrop, or a navigation selection.
- Removed the Star69AI logo graphic from both the shared mission-control menu identity and the persistent client cockpit sidebar; the navigation labels remain.
- Reduced the client cockpit cinematic banner from 112px to 98px on desktop and to 68px/64px on mobile breakpoints while preserving the hero artwork and icon.
- Applied a consistent deep-dark background and light readable text to site footers so the official wordmark remains legible across themes.
- No Worker, D1, authentication, billing, Retell, Stripe, PayPal, Resend, customer or prospect data/configuration changed.
- Source validation and live mobile visual testing remain pending. Review via PR; do not merge `main` without explicit approval.

## Sitewide header/footer cleanup and Navigator AI Assistant Eli — 2026-11-17

- Feature branch: `fix/sitewide-brand-cockpit-eli-2026-11-17`, created from current `main` commit `c4cbbd0608f6efbca3b3b8b7e2dd01c858155f90`.
- Audited the shared public header installer, canonical logo normalization, footer insertion behavior, client portal header/greeting, and cockpit layout. The shared installer previously normalized only the first footer and only its first matching brand image, allowing duplicate/legacy footer logos to survive.
- Root cause also included malformed trailing-slash regular expressions in the shared header script. Corrected both path matchers; the previous invalid regex flags could prevent the entire shared header/footer installer from executing.
- Updated the shared installer to normalize every footer, keep exactly one canonical full Star69AI wordmark per footer, and remove duplicate legacy/icon-only Star69AI logo images and their otherwise-empty links. Existing header/navigation behavior and non-brand footer content remain.
- Replaced retired logo asset references with `assets/main_logo.webp` in the About, Pricing, Trust Lab, partner program/admin, newsletter admin, Trust Lab admin/dashboard, blog index/episode, and roofing industry pages inspected during this pass. Other public pages using the shared installer are normalized at runtime.
- Refined the client cockpit's cinematic `image_hero.webp` banner to a slightly taller but still compact header with a lighter overlay and improved focal positioning. The yin-yang icon remains the compact header mark; the large wordmark is not reintroduced.
- Replaced device-time “Good morning/afternoon/evening” copy with “Welcome back” plus the customer's first name when available, avoiding incorrect time-of-day greetings from device timezone/clock differences.
- Added the minimized-by-default **Eli — Navigator AI Assistant** launcher on the left side of the authenticated cockpit. Opening it lazily loads the existing Star69AI Concierge Worker iframe; the panel has a clear identity header, close/minimize control, responsive sizing, safe-area spacing and keyboard-accessible controls. It is hidden until a customer workspace is loaded and does not cover the dashboard while minimized.
- No Worker, D1, authentication, billing, Retell, Stripe, PayPal, Resend, customer/prospect records or production configuration changed.
- Required validation: JavaScript syntax checks for the shared header and client script; verify footer deduplication on pages using the shared installer; inspect cockpit banner and Eli widget at desktop/tablet/mobile sizes; confirm the Concierge iframe loads and conversation works in an authenticated browser session. Source changes remain unmerged and unpublished. Do not merge `main` without explicit user approval.

## Brand asset roles, visible banner repair and client greeting — 2026-11-17

- Canonical brand assets are distinct: `assets/main_logo.webp` is the full Star69AI wordmark; `assets/Icon_main.webp` is the standalone yin-yang mark; `assets/image_hero.webp` is the cinematic banner artwork. Never use the yin-yang icon as a replacement for the full logo in full-brand contexts.
- The shared mission-control menu now uses the real `Icon_main.webp` asset instead of a hand-drawn inline SVG. The public-site banner image layer was behind the cover's opaque background due to its negative stacking order; the CSS now places the image above the background and below its shade/text/navigation layers.
- Shared header installation replaces recognizable legacy Star69AI logo images with `main_logo.webp`, while preserving the standalone icon asset. Footer logo normalization remains in place.
- The client console top bar is now a compact `image_hero.webp` banner with the `Icon_main.webp` mark and account controls. The sidebar uses only the yin-yang icon; the oversized wordmark is removed.
- The client workspace greeting uses the browser's local time and the customer's contact first name when available: morning 05:00–11:59, afternoon 12:00–16:59, evening 17:00–04:59. The business name remains the workspace title. No customer data is sent to a new service and no Worker, D1, authentication or billing behavior changes.
- Source changes only on `branding/client-header-greeting-logo-cleanup-2026-11-17`. Verify icon/banner assets on GitHub Pages, desktop/mobile layouts, the client greeting with authenticated customer data, and legacy logos on public pages after deployment. Do not merge `main` without explicit approval.

## Official Star69AI logo and cinematic hero banner — 2026-11-17

- Feature branch: `branding/main-logo-and-hero-banner-2026-11-17`, created from current `main`.
- Confirmed both supplied assets already exist in the repository: `assets/main_logo.webp` (transparent horizontal Star69AI logo with yin-yang emblem) and `assets/image_hero.webp` (wide 16:9 cinematic space-horizon banner).
- Updated the shared public-site header to use `image_hero.webp` as its primary banner and `main_logo.webp` as the official brand mark in the utility/navigation bar.
- Updated the shared header installer to replace legacy Star69AI logo images in existing page footers with `main_logo.webp`, or insert the official logo where a page footer has no logo.
- Updated homepage Open Graph/Twitter share artwork and image preload to use `image_hero.webp`; homepage footer uses `main_logo.webp`.
- Updated the client portal, agency admin console and partner portal header logos to `main_logo.webp`; replaced the client sidebar's text-only brand mark with the official logo.
- Preserved existing navigation, hero content, portal authentication, dashboard functions, and backend integrations. No Worker, D1, billing, Retell, Stripe, PayPal, Clerk, customer, prospect or email behavior changed.
- Source-level checks confirm both asset paths exist on `main`, the shared header points to the new hero/logo assets, homepage social artwork and preload point to the hero image, all three standalone portals point to the official logo, and appended CSS has balanced braces.
- Browser visual QA at desktop/mobile widths and live GitHub Pages deployment remain outstanding. Review via PR; do not merge `main` without explicit user approval.

## Shared Resend delivery pipeline and Marketing Outreach prospect resolution — 2026-11-17

- Feature branch: `fix/shared-resend-marketing-delivery-2026-11-17`, created from current `main` after reading this handoff and inspecting the current Admin, client and Worker email paths.
- Added one Worker-level `sendResendEmail` helper and routed both the authenticated client call-details email endpoint and the Admin Marketing send endpoint through it. Both now share the same Resend request structure, idempotency-key handling, one retry for rate-limit/server/transport failures, sanitized provider-code logging, reference IDs and normalized provider error categories.
- Kept each message type's own authorization and content rules: client call details still require Clerk customer authentication and a call row scoped to that customer; marketing still requires Admin authorization, active prospect status, initial/follow-up validation, seven-day cooldown, 25 sends per rolling 24 hours, Advertisement disclosure, Star69AI phone and protected postal address, unsubscribe link and one-click unsubscribe headers.
- Addressed the separate prospect-ID failure: Admin now includes the selected prospect's email as a secondary lookup key; Worker only uses that key if the ID is absent/invalid, resolves exactly one existing prospect using the normalized email fields, and still loads the record by its database ID before sending. Ambiguous or missing email matches are rejected.
- Admin now displays the Worker-provided reference ID, provider code and HTTP status in the send feedback instead of hiding useful diagnostics. Updated the Admin script cache-bust.
- No email was sent; no prospect/customer record, unsubscribe state or send history was changed. No secrets or production bindings were changed.
- Source-level review confirmed both send routes use the shared helper and the marketing disclosure, footer, unsubscribe headers, cooldown and daily cap remain in place. Full JavaScript syntax/runtime tests, authenticated browser testing, Resend provider testing, merge and Worker deployment remain outstanding.
- Review via PR. Do not merge into `main` or deploy the Worker without the user's separate explicit approval.

## Star69AI marketing email advertisement disclosure — 2026-11-17

- Feature branch: `fix/marketing-advertisement-disclosure-2026-11-17`.
- Every marketing/prospecting email generated by the Admin Marketing send route begins with a clear `ADVERTISEMENT` disclosure in the email body: a plain-text first line and a prominent first HTML paragraph.
- The subject line is not prefixed or altered by the disclosure; the operator's reviewed subject remains unchanged.
- Preserves the existing Star69AI phone and protected postal-address footer, unsubscribe link, and List-Unsubscribe / one-click unsubscribe headers.
- This is a source change only until reviewed, merged and deployed to the Cloudflare Worker. No emails were sent and no prospect/customer data was changed.

## Star69AI marketing email business contact footer — 2026-11-17

- Source change merged through PR #221 (merge commit `adeb152fe9fdbd3ad6a8d4555f203384f477f18f`).
- Updated the existing marketing-send route so every marketing email footer includes Star69AI's business phone number and the configured business postal address, in both plain-text and HTML versions. The one-click unsubscribe link and List-Unsubscribe headers remain unchanged.
- The business phone is a public business contact detail in the Worker source. The mailing address is stored only as the protected Cloudflare Worker secret `BUSINESS_POSTAL_ADDRESS`; it is not committed to the repository.
- **Production deployment completed 2026-11-17:** Cloudflare Worker `avr-platform-api`, version 76, 100% traffic, deployment `b8e57620-ec32-44a7-8790-566e7fdca51a`. Version source commit `73e6cf285c8fe66bb3b35b6a897516c689b04b52` matches merged GitHub main.
- Version 76 preserves the existing plain-text, secret-text and D1 bindings, including Clerk, Resend, Retell, Stripe and the production D1 database. The protected mailing-address secret binding was verified present on the deployed version.
- The deployment includes the PR #220 initial-send/follow-up safeguards, seven-day cooldown, 25-send rolling 24-hour limit, and the PR #221 contact footer.
- No marketing emails were sent and no customer/prospect data was changed during configuration or deployment. The send flow has not yet been tested by sending a live email.

## Marketing prospect date tree and repeat-outreach safeguards — 2026-11-17

- Feature branch: `feature/marketing-date-tree-send-guard-2026-11-17`.
- Updated the existing Agency Admin Marketing Outreach tab rather than creating a second marketing console.
- Prospects are grouped into expandable date branches by their `created_at` date. Each branch shows its prospect count; the newest date opens by default. Prospect rows show contact status, number of recorded sends and most recent send date.
- The admin prospects API now returns each prospect's recorded send count and latest send timestamp from `avr_marketing_sends`.
- Worker send protection now allows only one initial outreach per prospect. A later message must explicitly carry the follow-up action, and the existing seven-day cooldown and 25-per-rolling-24-hour cap remain enforced server-side. Unsubscribed/non-active records remain blocked.
- The compose UI labels the first message as initial outreach and subsequent messages as follow-ups. Follow-up copy is prefilled separately and still requires individual review and confirmation.
- Source syntax checks passed for the updated Worker and admin JavaScript; CSS brace balance is zero. No production Worker deployment or live browser/email test was performed. Review through PR; do not merge `main` or deploy the Worker without the user's explicit approval.
- **Historical-send limitation:** production `avr_marketing_sends` contained zero records at implementation time. The safeguard reliably blocks messages recorded by this console, but it cannot infer emails sent manually or through another provider before tracking began. Those prospects must be marked/recorded as previously contacted before any first send through this console; do not assume the current empty history proves no one was emailed elsewhere.
- No marketing emails were sent as part of this work.


## Learning Center dark-text contrast repair — 2026-11-16

- Feature branch: `fix/learning-center-dark-text-contrast-2026-11-16`, created from current `main`.
- Root cause: the shared `readability.css` applies dark foreground defaults to generic `main` headings, paragraphs and links. The Learning Center uses a dark `.ih-page` theme, but its own stylesheet did not explicitly override all heading and nested-list colors. Existing card headings and list text could therefore inherit dark text on dark navy surfaces.
- Added page-scoped contrast rules to the existing `intelligence-hub.css` used by both the Learning Center landing page and the Receptionist Architect curriculum. Explicitly covers headings, body copy, nested lists, cards, tags, links, estimator results and footer text while preserving the green primary CTA and outlined secondary CTA colors.
- No new stylesheet, duplicate component, page redesign, JavaScript, Worker, D1, billing, authentication or customer data changes.
- Source-level review confirms both Learning Center pages load `intelligence-hub.css` after `readability.css`; the scoped rules are appended to the latter-loaded page stylesheet. Browser visual QA at desktop/mobile widths and live GitHub Pages publication remain to be verified.
- Review through PR; do not merge `main` without the user's explicit approval.

## Site-wide contrast, radio-choice guidance and AI Challenge CTA copy — 2026-11-16

- Feature branch: `fix/sitewide-contrast-radio-and-challenge-copy-2026-11-16`, created from current `main`.
- Extended the existing final-loaded `readability.css` contrast guardrails to cover legacy dark sections, dark cards, the standalone Receptionist Architect challenge, workflow/example cards, reward panels and other dark surfaces. Added light body copy, high-contrast headings and readable links while retaining explicit light-surface text colors.
- Added a short explanation immediately before the checkout subscription-timing radio choices. The field group is now programmatically labelled and references its helper text; users are told to choose one option and what each timing choice means.
- Added explanatory copy beside the homepage AI Challenge CTA and the challenge difficulty/start control. It explains the practical learning value (45 realistic scenarios; caller intent, useful detail capture and approved next steps) and the Starter/Pro/Expert achievement milestones associated with 5%/10%/15% monthly-plan reward levels.
- Reward copy remains transparent: achievements are stored locally in the browser and reward redemption is not enabled. No claim was added that a discount is currently redeemable.
- No backend, Worker, D1, billing, Stripe, PayPal, authentication, Retell, customer records or challenge scoring logic changed.
- Source-level review performed for the touched selectors and exact radio/CTA placements. Browser visual contrast testing across every viewport/page and live GitHub Pages publication remain to be verified.
- Review through PR; do not merge `main` without explicit user approval.

## Retro space-exploration brand refresh — 2026-11-16

- Feature branch: `design/retro-exploration-brand-2026-11-16`, created from current `main`.
- Refined the existing homepage (no parallel theme or duplicate landing page) with original space-exploration copy: “Ready to Explore?”, “It’s our business to bring you more business”, “It’s not science fiction anymore”, “See how far your business can go”, and “Are you ready to come aboard? The future is waiting.”
- Added a restrained mission-briefing label, subtle starfield drift, original geometric display typography (Michroma), and IBM Plex Mono technical labels, using the existing dark Earth-at-night hero and neon palette.
- Preserved the existing hero artwork, primary custom-demo CTA, demo form and Formspree destination, November offer, navigation/client login, pricing, managed-service disclosures, industry sections and assistant behavior. No backend, Worker, D1, billing, auth, Retell or customer data changed.
- This is a visual/copy homage to classic space exploration, not a Star Trek replica: no protected dialogue, logos, characters, uniforms, or official-affiliation claims were added.
- Static HTML/source and responsive CSS review remain required; live desktop/mobile browser QA and GitHub Pages publication are not yet verified. Review via PR; do not merge `main` without explicit user approval.

## Business Intelligence & Receptionist Performance Center — 2026-11-17

- Feature branch: `feature/business-intelligence-performance-center`. Enhances the existing authenticated THE COCKPIT Overview; no duplicate dashboard, navigation, API route or database table.
- Adds a customer-scoped performance summary to the existing `/api/client/dashboard` response using aggregate queries over `avr_calls`: current UTC calendar-month call count and call duration, average call duration, provider-analyzed positive/neutral/negative sentiment counts, previous-month call count, and daily call counts for the last 14 days.
- Timestamp aggregation normalizes existing second- and millisecond-based `start_timestamp` values. It does not read another customer's calls; every query is filtered by the authenticated customer ID.
- Adds an Overview panel with current-month calls, total call minutes, average duration, positive sentiment share among calls with a recognized sentiment, a 14-day call-volume chart, and a sentiment breakdown. Missing sentiment is excluded from the sentiment denominator.
- Clearly labels sentiment as provider analysis, not a measure of lead quality or customer satisfaction. Explicitly discloses that bookings, qualified leads, missed-call classifications and revenue are not currently captured as structured outcomes and are not inferred.
- No D1 migration, schema change, new route, third-party integration, billing behavior, Retell behavior, customer records or production configuration is changed.
- Verification performed: client JavaScript syntax parse; Worker JavaScript syntax parse after normalizing its module default export; CSS brace balance; HTML tag nesting and performance ID checks; SQLite aggregate test with mixed timestamp units and multiple customer IDs. Authenticated browser QA and production deployment remain outstanding.
- Preserve all existing portal pages, authentication, customer scoping, minute vault and fixed 75% overage enforcement.



## Dashboard enhancement follow-through — 2026-11-16

- Extended the existing dashboard enhancement branch and PR #205; no new dashboard, duplicate API route, table, or component system was created.
- Call details now present a factual at-a-glance panel using existing call record fields: caller number, call status, sentiment, direction, duration, disconnection reason and provider-generated call summary. Callback requests and lead urgency are not separate structured fields in the current data model; customers are directed to review the transcript rather than being shown invented lead data. Existing transcript, recording and manual email actions remain.
- Added a minute breakdown using the existing dashboard usage response: included minutes used/remaining, Minute Vault balance/usage, billable overage used and remaining distance to the fixed 75% ceiling. Flex prepaid accounts do not display subscription-minute breakdowns. The overage-ceiling remainder is explicitly labeled as a ceiling, not payment authorization; existing backend eligibility and saved-card checks remain authoritative.
- Expanded the existing onboarding checklist into a five-step progress view derived from the existing onboarding response. The final managed launch and call-testing step remains pending in the client view; payment completion is not misrepresented as a completed production launch.
- Improved existing automatic call-summary email preferences with an ON/OFF and recipient-count status, immediate toggle feedback, and client-side validation aligned with the existing Worker limits (maximum ten valid addresses; at least one recipient when enabled). Existing customer-scoped Worker endpoint and D1 settings remain unchanged.
- No Worker API, D1 schema, migration, billing, Retell, authentication or production configuration was changed for these presentation enhancements. Browser, live email, billing, Retell and production tests remain outstanding.
## Client dashboard enhancement — 2026-11-16

- Feature branch: `feature/dashboard-enhancement`, created from current `main` after confirming the requested branch did not already exist. Current dashboard work is based on the existing static GitHub Pages client portal at `/client/` (THE COCKPIT), not a new Next.js app or replacement dashboard.
- Repository audit completed first. Read this handoff and inspected the current `client/index.html`, `client/client.js`, `cockpit.css`, `cloudflare/platform-worker.js`, `cloudflare/schema.sql`, relevant migrations, `OVERAGE_PROTECTION.md` and `FLEX_PAYG_IMPLEMENTATION.md`. Current main was `57a636a2a1deec805fe27a25a1acca5a8332302a`. The requested branch was absent; the existing open PRs were unrelated to the client dashboard (#168, #135, #112, #99, #95, #89 and #35).
- Existing client navigation already has seven pages: Overview, Receptionist, Plan & Billing, Upgrades, Call Activity, Support Center and Knowledge Center. Existing functionality includes Clerk session authentication, authenticated Worker requests, per-customer D1 data, Retell agent/number/call history, transcripts and available recordings, call-detail email, configurable call-summary recipients, Stripe billing portal and checkout, PayPal setup/Flex flows, Minute Vault, support tickets, agent change requests, add-on requests, and searchable knowledge articles. The existing premium dark navy/neon-green visual system and mobile navigation were already in `cockpit.css`; these were preserved.
- Relevant existing D1 data includes `avr_customers`, `avr_agents`, `avr_numbers`, `avr_calls`, `avr_minute_vault_periods`, `avr_minute_vault_allocations`, `avr_minute_vault_events`, `avr_overage_call_reservations`, `avr_overage_billing_ledger`, `avr_call_email_settings`, `avr_support_tickets`, `avr_agent_change_requests`, `avr_addon_orders`, `avr_paid_onboardings`, `avr_payg_wallets`, `avr_payg_wallet_ledger`, `avr_payg_topups`, `avr_billing_events` and Retell webhook/event history. Client Worker routes resolve the signed-in Clerk user with `customerFor` and scope customer-owned reads/writes to that resolved customer ID. This source audit is not a penetration test.
- **Stage 1 — IMPLEMENTED AND TESTED (repository/source audit):** recorded the existing routes/pages, frontend files, Worker, relevant D1 tables/migrations, billing and Retell integration points, current open PRs and branch state. Live Stripe account products, actual customer records and assigned Retell resources were not directly inspected because no production secrets/account session was used.
- **Stage 2 — IMPLEMENTED BUT NOT VERIFIED (source-level):** preserved the existing fixed 75%-of-included-minute overage cap and Minute Vault logic. Starter is 300 included + 225 maximum overage; Growth 600 + 450; Pro 1,200 + 900. Overage requires the existing saved-payment authorization. The dashboard now obtains the current subscription price from the Stripe subscription's Price object, with a fallback to the configured Stripe catalog Price; frontend hardcoded monthly plan amounts were removed from the current-plan overview tile. Stripe API responses were not tested against a live account. Corrected the exhausted-capacity Retell inbound response to return explicit `call_inbound.reject=true` rather than an empty successful object. No D1 migration or secret/configuration change was required.
- **Stage 3 — IMPLEMENTED BUT NOT VERIFIED (source-level):** retained the existing dark visual system and responsive navigation; added a clear receptionist readiness pill, accessible usage progress semantics, 50%/75%/90% included-minute visual warnings and responsive filter controls. The receptionist indicator says `LIVE SETUP` only when the account is active/billing-eligible and a non-demo agent is assigned to a customer number; Flex readiness comes from the existing wallet eligibility endpoint. It is a configuration/readiness indicator, not a live call monitor or external health probe.
- **Stage 4 — IMPLEMENTED BUT NOT VERIFIED:** added client-side Call Activity search across caller number, business number, summary, transcript, status and direction, plus a status dropdown populated from the actual latest 50 calls returned by the existing dashboard endpoint. No duplicate API route, database table or call-history component was created. Existing playback, transcript, email and detail controls remain.
- **Stage 5 — NOT IMPLEMENTED / BLOCKED BY MISSING BACKEND SUPPORT:** a true live-call monitor is not exposed by the current client dashboard API; structured lead records/outcome extraction and lead-conversion analytics are not represented by the current client response/D1 schema. These must not be faked with sample records or guessed from transcript text. Existing call volume and summaries remain available.
- Updated `project-context/OVERAGE_PROTECTION.md` to remove obsolete administrator-entered allowance language and document the fixed plan cap, vault sequence, payment authorization, inbound rejection contract, and distinction between visual 50/75/90% usage warnings and backend overage notifications.
- Source checks on this branch: client JavaScript syntax parsed successfully; Worker JavaScript syntax parsed successfully after adapting the module export for syntax checking; CSS braces balanced; HTML section tags balanced; no sample phone/call rows introduced; current-plan monthly price no longer uses hardcoded screenshot amounts; the 75% cap expression and explicit inbound rejection remain present.
- **Not yet verified:** authenticated real-customer desktop/mobile browser testing, real Stripe Price retrieval, Retell inbound webhook behavior on assigned production numbers, concurrent-call boundary testing, production Worker deployment and GitHub Pages publication. Do not mark these end-to-end checks complete or claim the branch is live.
- No Clerk auth changes, Stripe configuration changes, PayPal settings, customer records, production D1 data, D1 migrations, Retell agent assignments, Resend settings or live deployments were changed. Review this work through a PR; do not merge `main` without the user's explicit approval.

## AI Challenge desktop layout refinement — 2026-11-16

- Follow-up on PR #202, branch `feature/challenge-flow-examples-reward-copy-2026-11-16`.
- Widened the challenge content container on desktop while keeping the question/game card and hero copy constrained for readability. The workflow explainer now uses three roomy horizontal step cards and three example cards per row on wide desktop; examples switch to two columns at tablet widths and one column on mobile. Mobile retains the compact stacked numbered-step treatment.
- Increased desktop card padding and body text size to improve hierarchy and scanning. This addresses the desktop/mobile layout mismatch reported by the user.
- Source CSS and responsive media-query boundaries were reviewed. Actual browser viewport testing remains outstanding; do not claim visual verification or publication until checked after Pages deploys.

## AI Challenge workflow explainer and reward-status clarification — 2026-11-16

- Feature branch: `feature/challenge-flow-examples-reward-copy-2026-11-16`.
- Expanded `challenge/index.html` with a three-step receptionist design method: understand the caller's request, capture only useful details, and take the correct approved next step. Added six detailed industry examples for roofing, plumbing, HVAC, cleaning, auto service and real estate.
- Replaced the vague “Rewards are not automatically applied yet” copy with precise terms: Starter 5%, Pro 10%, Expert 15% off eligible monthly subscription payments for 12 months; no setup-fee discount; no stacking with partner/prepaid offers. The page clearly says browser-only progress is not account proof and cannot apply a discount.
- Challenge completion remains browser-local only. The current implementation has no authenticated server-side completion record, verification endpoint or checkout redemption path. **Do not tell customers that challenge discounts are redeemable.** Enabling actual rewards requires an authenticated account flow, server-verified completion for each level, one-time eligibility/redemption records and server-side checkout enforcement, plus tests for replay, tampering, duplicate redemption and offer stacking.
- No Worker, D1, Stripe, PayPal, Clerk or production configuration was changed. Website publication and browser testing remain pending.

## Homepage call-flow card containment correction — 2026-11-16

- Follow-up branch: `fix/homepage-call-flow-card-containment-2026-11-16`. The homepage's six additional industry examples were present inside the hero preview, and `design-refresh.css` was already linked by `index.html`; the issue was insufficient defensive sizing/overflow rules for nested grid items and their text.
- Added explicit border-box sizing, zero minimum widths, width/max-width constraints, text wrapping and overflow containment to the hero preview, three-stage flow cards and six industry example cards. The example grid is explicitly three columns on desktop, two on tablet and one on narrow mobile.
- No content, checkout, Worker, D1, billing, authentication or customer data changed. Browser viewport verification is still required after GitHub Pages publishes the change.

## November 2026 3FORFREE promotion — LIVE activation

- Public campaign: `3FORFREE`, available for new monthly subscription signups through November 30, 2026 (UTC date boundary enforced by the checkout Worker). The first two monthly subscription invoices are charged at standard price; the third monthly subscription invoice receives a one-time 100% subscription discount after the second successful paid subscription invoice.
- Standard $99 setup fee remains unchanged and is collected separately via PayPal after demo approval. Taxes, usage and third-party charges are not discounted. Prepaid plans and discounted partner referrals are excluded; other promo codes are rejected by the public checkout handler.
- GitHub PR #182 merged into `main` as `2f1ce942ebd3f1232c925f5112492128c2cf3063`; follow-up PR #183 added the existing-client checkout guard and merged as `1e176c6d52530c6edd43ebf5df6ea65654524ba8`.
- Production D1 migration `cloudflare/migrations/20261115_3forfree_promotion.sql` applied to database `avr-trust-lab` (`6cf68b12-2aa8-4ed4-9f92-8a7824520d1a`). Verified customer promo columns and `avr_3forfree_invoice_events` table.
- Live Stripe coupon: `STAR69AI_3FORFREE_2026_11_NOREDEEM` (100% off, duration once, no Stripe redeem_by; Star69AI checkout enforces the November signup window). An earlier coupon with a Stripe redeem_by date was deleted before use because that date would have prevented applying the reward after the second payment in a later month.
- Cloudflare Worker `avr-platform-api` latest production deployment: `99ae8159-f418-4ec7-ab0a-984fd79e6054`, version `82b5be0f-10b8-4079-8c9e-279ca70ac53d` (100% traffic). Binding `STRIPE_COUPON_3FORFREE` is a plain-text binding containing the live coupon ID. Existing D1 and secret bindings were retained. A server-side guard blocks existing client accounts from submitting the public acquisition code.
- Activation is complete at the Stripe, D1 and Worker layers. Live public website rendering / GitHub Pages publication could not be independently fetched from this runtime; verify the homepage, pricing and `checkout.html?promo=3FORFREE` in a browser before advertising the campaign.

## November 2026 3FORFREE promotion — implementation branch

- Feature branch: `promo/3forfree-november-2026`. Adds the public November offer banner to the homepage and pricing page, pre-fills and captures `3FORFREE` in checkout, and publishes matching FAQ/Terms copy.
- Intended terms: new monthly customers only; two successfully paid monthly subscription invoices at standard price, then one 100% subscription-only discount on the third monthly invoice. The $99 setup fee, usage, taxes and third-party charges are not discounted. Not combinable with discounted partner referrals, AI Challenge rewards or prepaid plans. Redemption window ends November 30, 2026.
- Worker validates the code and configured Stripe coupon, records the promo on the customer, and applies the one-time 100% coupon after the second qualifying paid plan invoice. A D1 migration tracks customer promotion state and deduplicates invoice events.
- **Activation gate:** set Worker secret/binding `STRIPE_COUPON_3FORFREE` to a Stripe coupon ID configured as 100% off with duration `once`; apply `cloudflare/migrations/20261115_3forfree_promotion.sql` to production D1; deploy the updated `avr-platform-api` Worker; then test the full monthly flow in Stripe test mode before public activation. Do not claim the offer is redeemable until all three steps and end-to-end tests pass. Do not apply the migration twice.
- The feature branch is not merged or deployed. Production Stripe/Cloudflare configuration has not been changed.

## Mobile AI assistant and homepage demo disclosure — 2026-11-15

- Homepage mobile assistant layout is adjusted so the receptionist image and chat widget stack vertically, the chat iframe receives a tall mobile viewport (at least 640px, 680px on narrow phones), and the widget is not clipped by the former short image-column height.
- Homepage custom-demo AI Challenge disclosure now has an explicit pale background and dark green high-contrast text, including responsive type sizes. Reward terms remain unchanged: Starter 5%, Pro 10%, Expert 15% off monthly subscription payments for 12 months; no setup discount, no partner/prepaid stacking, and no redemption until secure account-based verification is enabled.
- Source-only change on `fix/mobile-ai-assistant-and-challenge-disclosure-2026-11-15`. Mobile browser/iframe interaction testing and GitHub Pages publication remain to be verified.

## Partner setup-fee correction and public program explanation — 2026-11-15

- Partner referrals no longer discount the one-time setup fee. The setup fee remains $99 for monthly-plan customers regardless of partner referral type; six-/twelve-month prepaid plans continue to waive setup under their separate offer.
- Discounted partner referral links provide 15% off eligible monthly subscription payments for the first 12 months only. Standard referral links preserve attribution and commission eligibility without a customer discount. Partner discounts cannot stack with AI Challenge rewards or prepaid offers.
- Public `/partners/` page now explains the program and publishes the commission tiers: 20% for 1–4 active referred customers, 25% for 5–14, and 30% for 15+. It also explains eligible collected subscription revenue, exclusions, 30-day validation, $50 minimum and monthly PayPal review.
- Partner Center referral labels and terms explicitly state that the $99 setup fee is not discounted. CSS `[hidden]` is enforced with `display:none!important` because component display rules otherwise overrode the browser's hidden attribute and left the signed-out prompt visible after Clerk sign-in.
- The platform Worker now prices partner-attributed setup orders at $99, validates captures against $99 and records no setup discount. Existing historical setup invoice rows retain their original amounts/reasons for audit; this change does not rewrite completed transactions.
- The original partner setup-fee correction was recorded on `fix/partner-portal-offer-and-onboarding-2026-11-15`; the consolidated checkout, client portal, admin display, legal-copy and Worker enforcement correction is on `fix/setup-fee-never-discounted-2026-11-15`. Merge/publish and Worker deployment require review and explicit approval. Existing PayPal approval orders created at the old $84.15 amount must not be captured under the new policy; customers must resume checkout to receive a fresh $99 order.

## Current promotion and setup-fee limits — 2026-11-15

**Supersedes all older promotion notes below:** any historical reference to a 50% partner setup discount, a 50% challenge setup reward, 10% challenge discount, or stacking challenge and partner offers is obsolete and must not be used for current quotes, UI, checkout or customer communications.

- **Maximum customer discount for AI Challenge and partner referrals: 15%.** No challenge reward or partner link may offer a discount above 15% on any component.
- **AI Challenge:** Starter 5%, Pro 10%, Expert 15% off monthly subscription payments for the first 12 months. Challenge rewards never discount the setup fee. Challenge progress is local-only and reward redemption is not yet enabled; do not imply that an achievement is a coupon or applied discount.
- **Partner discounted referral link:** 15% off eligible monthly subscription payments for the first 12 months only. The one-time $99 setup fee is never discounted. Standard partner link carries attribution and commission eligibility but no customer discount. Partner offer details remain private in Partner Center and authenticated customer checkout/dashboard surfaces.
- **No stacking:** AI Challenge, partner referral and prepaid offers are mutually exclusive. Prepaid remains 25% off six months / 35% off twelve months and waives setup; this separate prepaid program is not subject to the 15% cap for challenge/partner links.
- **Server-side enforcement:** Public demo-first checkout always calculates $99 (9,900 cents) for monthly customers, regardless of partner attribution or offer mode. Prepaid setup remains $0. The browser cannot choose or override this amount. Pending legacy onboarding records are normalized to $99 before a new PayPal order is created; an old PayPal approval URL for a discounted setup amount must not be captured, and the customer must resume checkout to receive a fresh $99 order. Historical invoice rows retain their original amounts and are labeled as legacy records for audit.
- **Partner commissions:** Preserve the current 20% / 25% / 30% active-referral tiers; calculate only on eligible subscription amounts actually collected after discounts. Exclude setup fees, taxes, usage, phone rental, carrier pass-through, unpaid invoices, refunds and chargebacks.
- Promotion copy must agree across homepage, challenge, pricing, checkout, FAQ, Terms, partner portal, client dashboard and Agency Admin. Never expose private partner referral URLs/codes on public pages. Do not reactivate challenge coupons or claim redemption until server-side challenge verification and one-time redemption are implemented and tested.

## Automatic overage billing implementation — merged to main 2026-11-15

- Feature branch: `feature/automatic-overage-billing-2026-11-15`. Merged through PR #159 (merge commit `aae320a9f6e25bef8e965b762a08c48c43d67aba`). As verified 2026-11-16, the production `avr-platform-api` Worker is deployed at 100% traffic and the production D1 schema contains the overage billing ledger and call-reservation tables. The Stripe webhook is enabled and now includes checkout completion, async checkout success, subscription create/update/delete, setup-intent success and invoice payment events. The complete charge lifecycle remains untested with a controlled customer; do not describe overage billing as fully end-to-end verified.
- All plan customers must separately authorize off-session overage collection in the client portal and save a card through Stripe Checkout Setup mode. Monthly overage invoice items attach to the active Stripe subscription and are charged on its next invoice; PayPal-prepaid six-/twelve-month overage is charged through a separate Stripe invoice. The saved method is set as the customer's default and, for monthly customers, the subscription's default payment method.
- Rates: Starter $0.55/minute, Growth $0.45/minute, Pro $0.36/minute. The existing 75% hard overage cap and Minute Vault consumption order remain unchanged. Without an overage payment method, calls may use included and vaulted minutes but cannot reserve overage capacity.
- The Worker stores a D1 billing ledger keyed by customer, period and cumulative overage minutes; Stripe idempotency keys prevent duplicate invoice items/invoices. Failed usage is retained in the ledger to prevent double billing; updating a card retries failed prepaid invoices where an invoice ID exists.
- Client portal shows card authorization state, overage billing totals and the billing timing.
- Remaining validation: test monthly and prepaid payment flows with a controlled test customer, payment failures/retries, duplicate Retell events, and the 75% stop. The production webhook and Worker/D1 deployment are already in place; no real customer charge was initiated during the 2026-11-16 audit.

## Production release — hard usage ceiling, demo-first onboarding and Flex wallet — 2026-11-15

- Release branch: `release/hard-usage-cap-demo-first-flex-2026-11-15`, merged into `main` via PR #155. The final homepage challenge-reward disclosure correction was merged via PR #157. PRs #153/#154 are included in the release; obsolete PR #151 was closed as superseded.
- Production Cloudflare Worker `avr-platform-api` has been deployed from the merged `main` code. The production D1 migrations for overage protection, Minute Vault, paid onboarding, partner payment references, call reservations and Flex PayPal top-ups have been applied. The new Flex wallet ingress gate secret `PAYG_INGRESS_GATE_ENABLED=true` is set.
- **Hard subscription overage ceiling:** the maximum overage is fixed at 75% of the plan's included minutes, not 75% of an administrator-entered allowance. Starter: 300 included + 225 overage = 525 minutes before vault; Growth: 600 + 450 = 1,050; Pro: 1,200 + 900 = 2,100. The administrator cannot raise this ceiling. Available Minute Vault minutes are used before overage and are separate from the 75% overage allowance.
- Inbound calls reserve usage capacity before Retell answers. The inbound webhook assigns a per-call `max_call_duration_ms` based on remaining eligible capacity and uses an atomic D1 reservation to account for concurrency. If the account is ineligible, capacity is exhausted, the Flex wallet cannot cover another minute, or the webhook encounters an error, it returns Retell's explicit `call_inbound.reject=true` response. Never return an empty successful response for a blocked call: Retell may otherwise fall back to the number's default inbound agent.
- Call reservations release on the Retell `call_ended` event. A 24-hour reservation expiry is a fail-closed safety net for delayed/missing events; if an event is lost, the customer can remain blocked until the reservation expires. The normal `/webhooks/retell` endpoint must receive `call_ended` and `call_analyzed` events. New number assignments attach the inbound gate automatically. Agency Admin now synchronizes the inbound webhook on admin login and has a manual sync button; verify the result for all assigned numbers.
- Overage is not an automatic Stripe metered charge. The client portal may display an estimate at the published rate, but the hard usage ceiling is enforced regardless of payment method. Do not describe an estimate as a charge.
- **Minute Vault:** exactly 50% of unused included plan minutes carry forward while the subscription remains active and paid. Vault minutes have no cash value, are consumed FIFO after current included minutes, and are forfeited on cancellation. They do not increase the fixed 75% overage ceiling.
- **Demo-first monthly onboarding:** checkout creates the customer workspace, Retell demo agent and Clerk invitation before collecting plan payment. The customer can choose to start the monthly Stripe subscription immediately or wait until reviewing and approving the demo. The one-time setup fee is always $99 for monthly customers and is collected through PayPal in the client dashboard only after demo approval and plan payment. Customer status remains pending until the plan and setup payments are verified. Live phone routing stays blocked until managed number assignment and testing are complete.
- **Prepaid onboarding:** six-month terms are 25% off and twelve-month terms are 35% off, paid once through PayPal. Totals: Starter $670.50 / $1,162.20; Growth $1,120.50 / $1,942.20; Pro $1,795.50 / $3,112.20. Setup is waived. Prepaid does not create a Stripe subscription. Partner discounts do not stack with prepaid savings.
- **Flex:** public Flex signup creates a pending customer workspace and Clerk invitation. Customers add any positive amount in $5 increments through PayPal. Credit is posted only after server-side PayPal capture verification. Usage is $0.65 per started minute per call; completed calls debit the wallet. The inbound gate reserves available minutes and sets a maximum call duration before Retell answers. New calls are rejected when the balance cannot cover another minute. A Flex account becomes active after verified top-up, but still needs an assigned agent and phone number before calls can connect. Admin Flex wallet view is read-only; the unverified manual-credit route has been removed.
- The public AI Challenge advertises rewards but must not reveal coupon codes. Do not reintroduce coupon strings or examples in public UI. Private codes may be entered only when the customer has received them through an authorized channel.
- Billing provider split: monthly subscription plans use Stripe; setup fees, prepaid six-/twelve-month plans and Flex wallet top-ups use PayPal. PayPal orders are captured and amount-checked server-side; browser return alone never marks a payment paid. Partner commissions must continue to be based on the amount actually collected after discounts.
- **Deployment status:** Worker code and production D1 schema are deployed. The website changes are merged into `main`; GitHub Pages publishing was triggered by the main-branch merges, but the live domain could not be independently verified in this session. The existing assigned Retell number's inbound webhook has not been independently verified; Agency Admin syncs assigned numbers on the next authorized admin-console login.
- Static JavaScript syntax checks, D1 migration/schema checks and non-mutating SQL binding checks passed. Live PayPal capture, Stripe subscription checkout/webhooks, Clerk invitation delivery, Retell call rejection/duration enforcement, wallet debit and full browser E2E tests have not yet been performed. Do not claim the complete customer journey is production-tested until those tests pass.

## Prepaid pricing and setup-fee waiver update — 2026-11-14

- Approved prepaid offers: six months at 25% off the standard subscription total; twelve months at 35% off. Totals: Starter $670.50 / $1,162.20; Growth $1,120.50 / $1,942.20; Pro $1,795.50 / $3,112.20.
- Both prepaid terms waive the $99 setup fee completely. Monthly setup fees are always $99 and are collected through the public PayPal checkout after demo approval. Prepaid customers must never receive a setup invoice.
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
- Public prepaid pricing is 25% off six months and 35% off twelve months. Totals: Starter $670.50 / $1,162.20; Growth $1,120.50 / $1,942.20; Pro $1,795.50 / $3,112.20. Both prepaid terms waive the $99 setup fee and are charged once through PayPal; no Stripe subscription or prepaid Stripe Price IDs are used. Monthly setup fees are always $99 and are collected through PayPal after demo approval; the monthly plan subscription is created through Stripe. The Worker stores billing cadence and the Admin setup-invoice workflow blocks invoices for prepaid customers.
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

## Client onboarding readiness audit — 2026-11-16

- Production GitHub Pages workflow for the latest `main` commit `7ac46b377aee1e67afb83f11a51d8cbd9fb08cb8` completed successfully. The public homepage was retrievable during the audit. Checkout, portal and admin URLs could not be independently fetched by the external browser verifier; do not infer their runtime health from source alone.
- Production `avr-platform-api` is deployed at 100% traffic. The `avr-trust-lab` D1 database has the overage ledger, call reservations, webhook event log and `avr_addon_orders` table. Aggregate state at audit time: one pending customer, no paid-onboarding rows, no active customer accounts, one phone number assigned to that pending customer, five call records and zero overage billing ledger entries. Do not manually activate the pending record; verify whether it is a test/administrative record before changing it.
- Stripe live monthly prices were verified at $149, $249 and $399. The production webhook endpoint `we_1UXkHiHY3UnchZwdkwxWfqQe` was updated on 2026-11-16 and Stripe confirmed it enabled with 25 event types, including `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `setup_intent.succeeded`, `invoice.payment_succeeded`, and `invoice.payment_failed`. No real checkout or charge was initiated; end-to-end billing remains unverified. The six-/twelve-month checkout implementation uses PayPal, not the unused Stripe prepaid price records.
- Cloudflare Worker settings show the required Stripe, PayPal, Clerk, Retell and Resend secret bindings are configured by name/type. Secret values were not read. PayPal mode is not explicitly set in the inspected settings; Worker code defaults to PayPal live mode unless `PAYPAL_MODE=sandbox`.
- Clerk authentication and customer/admin isolation were reviewed statically: client routes call Clerk authentication and customer lookup; `/api/admin/*` routes pass through `requireAdmin`. Real sign-in, invitation, account-linking and cross-tenant negative tests remain outstanding.
- Retell event storage contains call-started, call-ended and call-analyzed events, demonstrating that signed event ingestion has occurred. The only assigned number currently maps to a pending customer, and the inbound webhook rejects calls unless the mapped customer is active. A controlled inbound call on an active customer number remains outstanding.
- Resend domain `star69ai.com` is verified with sending enabled. Recent demo acknowledgement and call-details emails show delivered status. No customer call-email preferences are currently enabled in D1, so customer-configured automatic summaries still need a controlled test.
- The client portal overage notice was corrected on the audit branch: automatic overage billing requires explicit consent and a saved card; Star69AI creates Stripe invoice items rather than using a Stripe metered subscription price. Monthly invoice timing, prepaid separate invoices and the 75% cap are now stated accurately.

## Open launch work

- Submit a real Formspree discovery request and confirm the submission reaches the intended inbox/lead workflow.
- Complete Clerk production login, invitation, admin authorization, account-linking and tenant-isolation tests.
- Run a controlled monthly Stripe checkout, subscription update/cancellation, invoice failure/retry and customer-portal test. Validate the complete demo approval and $99 PayPal setup-fee sequence without charging an unintended customer.
- Run a controlled PayPal sandbox or approved low-value live prepaid transaction and verify exact amount/capture reconciliation; confirm the intended PayPal environment explicitly.
- Verify Retell agent/number sync, assign a number to an active paid pilot customer, and complete inbound/outbound routing, call duration enforcement, recordings, transcripts and analysis tests.
- Enable call-email settings for a test customer and verify automatic summary delivery and manual call-details delivery to intended recipients.
- Reconcile the customer-facing billing display with the overage ledger using controlled usage; verify card authorization, invoice-item idempotency, failed-payment handling and the 75% stop.
- Perform responsive browser QA of public checkout, customer portal and admin console; verify the `avr_addon_orders` flows against the existing table.
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


## Real estate lead follow-up insight — 2026-11-15

- Published article: **How Real Estate Agents Can Turn More Property Inquiries Into Qualified Appointments**
- URL/slug: `/insights/real-estate-lead-follow-up-appointments.html`
- Primary SEO keyword: `real estate lead follow-up`
- Industry: real estate operations; practical guidance on inquiry ownership, appointment coordination, respectful follow-up, after-hours call coverage, and lead tracking.
- Article body verified at 756 words; meta description verified at 144 characters.
- Article HTML, Insights index card, sitemap entry, and this handoff update were committed directly to `main` under the user's standing automatic-publication authorization. No branch or pull request was created.


## Sitewide conversion design refresh — 2026-11-16

- Feature branch: `design/full-site-conversion-refresh-2026-11-16`. This is a source-only GitHub Pages website update; it does not change Cloudflare Worker code, D1 data, Stripe, PayPal, Clerk, Retell, Resend, customer records or live billing configuration.
- Added `design-refresh.css` as a scoped, accessible visual layer for the main public conversion journey: homepage, pricing, get-started, how-it-works, managed-service, demos and FAQ.
- Homepage hero now uses its previously empty second column for a clearly labeled illustrative call-flow preview (not represented as a live call or customer result). Added a four-step managed-service explanation: Discover, Configure, Test and Maintain.
- Pricing page now prominently explains the monthly-plan $99 setup fee: SIMIAPP CLOUD sends a separate PayPal invoice only after demo approval; six-/twelve-month prepaid plans waive setup. The detailed competitor comparison is collapsed behind an accessible disclosure so the main plan choices are easier to scan.
- Preserved the competitor comparison's November 6, 2026 pricing-review date. Competitor pricing entries were not independently re-audited in this design-only change; verify provider pricing before relying on the comparison as a current quote.
- Preserved current plan prices, included-minute allowances, overage rates, Minute Vault terms, 75% hard overage cap, prepaid discounts, partner rules, AI Challenge disclosures and checkout links.
- Validation still required: inspect all seven changed pages at desktop and mobile widths, confirm the Pages deployment after merge, verify the homepage demo/video interaction and discovery form, and check the pricing disclosure on a live browser. Do not describe this branch as deployed or merged.


## Admin marketing outreach console — proposed 2026-11-16

- Feature branch: `feature/admin-marketing-outreach-console-2026-11-16`. Adds a **Marketing outreach** tab to the existing Clerk-authenticated Agency Admin at `/admin/`; it does not create a separate login surface.
- Admin can add business prospects with business name, email, contact first name, industry and research notes; select a prospect; edit a subject and plain-text sales email; and manually send one recipient at a time through the existing Resend account/Worker bindings.
- Includes editable starting copy for roofing, plumbing, HVAC and general service businesses. The copy positions Star69AI as a managed, done-for-you receptionist service; it does not claim guaranteed lead recovery or performance results.
- Worker endpoints are admin-authorized for prospect listing/creation and one-at-a-time sending. A D1 ledger stores prospects, sends and one-time unsubscribe-token hashes. Duplicate normalized email addresses are rejected; unsubscribed prospects are suppressed; a prospect cannot be contacted again within seven days; and the Worker caps all marketing sends at 25 per rolling 24 hours.
- Every marketing email includes Star69AI identity, a business mailing address, a visible unsubscribe link, and RFC 8058 one-click unsubscribe headers. Both browser GET and provider one-click POST requests are handled. Unsubscribe state is permanent for that prospect; there is no re-subscribe control in the admin console.
- New D1 migration: `cloudflare/migrations/20261116_admin_marketing_outreach.sql`. Apply it to the existing `avr-trust-lab` D1 database before deploying the Worker. Do not apply it twice unnecessarily; it uses `IF NOT EXISTS` for the new tables/indexes.
- Required Worker configuration before enabling sends: existing `RESEND_API_KEY` and `RESEND_FROM_EMAIL`, plus a verified business mailing address in plain-text binding `BUSINESS_POSTAL_ADDRESS`. The send endpoint deliberately refuses to send if the postal address or Resend sender is missing.
- No marketing email was sent. No prospect/customer data was added. No D1 migration or Cloudflare Worker deployment was performed. This branch is source-only until review, merge approval, D1 migration and Worker deployment. Test with an internal address first, verify Resend delivery and one-click unsubscribe, then begin small, individually reviewed business outreach.
- Compliance guardrails: this is not a bulk blast tool. Only use relevant business contacts with a lawful basis for outreach; use accurate sender/subject details; honor opt-outs; do not use purchased, scraped or guessed personal-address lists. The console enforces a 25-per-day ceiling and seven-day per-prospect cooldown, but the operator remains responsible for applicable CAN-SPAM and other local laws.


## Agency Admin dashboard route repair — 2026-11-16

- Feature branch: `fix/admin-console-missing-api-routes-2026-11-16`. The Agency Admin frontend's initial `overview()` requested four admin API endpoints that were absent from `cloudflare/platform-worker.js`: `/api/admin/addon-orders`, `/api/admin/support-tickets`, `/api/admin/agent-change-requests`, and `/api/admin/demo-requests`. The Worker returned `admin_route_not_found`, causing the dashboard overview Promise to reject and leaving its metrics and related panels in a loading/error state.
- Added authenticated GET handlers for those four endpoints, using existing D1 tables and joining customer business/email context where needed. No billing, customer data, or outbound email behavior changed.
- Worker JavaScript syntax validation passed. End-to-end verification against production D1 and browser login is still required after merge/deployment. The PR must be reviewed and explicitly approved before merge; deploy the updated Worker only after confirming the production D1 schema supports the selected columns.


## THE COCKPIT client dashboard visual integration — 2026-11-16

- Feature branch: `design/client-cockpit-dashboard-2026-11-16`. Applies the premium dark navy / neon green THE COCKPIT visual system to the existing static GitHub Pages client portal at `/client/`; it does not introduce Next.js or a second client application.
- Preserves the current Clerk sign-in/session, authenticated `client/client.js` API calls, Cloudflare Worker routes, D1-backed customer data, Retell call history, support tickets, Stripe billing, PayPal setup/Flex flows, onboarding approvals, Minute Vault, and fixed 75% overage ceiling.
- Adds `cockpit.css` as a scoped final stylesheet override, a branded sidebar header and managed-service card, and a responsive mobile navigation drawer. Existing page panels and data-bound DOM IDs remain in place; no demo billing or call records are inserted.
- Client receptionist settings remain managed/read-only where the existing product policy requires Star69AI staff to configure, test and publish changes. Upgrade and configuration requests remain requests subject to written quote/approval.
- Source-only change. No Worker, D1, Stripe, PayPal, Clerk, Retell, Resend or customer data was changed. GitHub Pages publication and authenticated desktop/mobile browser QA remain pending review/merge.


## THE COCKPIT mobile usability and header refinement — 2026-11-16

- Follow-up feature branch: `fix/cockpit-mobile-header-qa-2026-11-16`, based on the merged THE COCKPIT dashboard.
- Refines the mobile global header into a compact, balanced brand/session/account row and reorganizes the workspace header into a clear two-column layout: navigation control and dashboard identity on the first row, account status and refresh action below.
- Keeps the slide-out navigation and ensures Escape closes it, restores the menu button's expanded state, and returns focus to the menu control.
- Adds contained horizontal scrolling for wide data tables so call history and other tables do not widen the entire phone viewport; improves wrapping for long cell content.
- Raises mobile tap target sizing, protects narrow-screen form controls from overflow, uses 16px form text on small phones to avoid unwanted browser zoom, and adds visible keyboard focus styling.
- Static source checks are required before review. This remains a source change until merged and published; authenticated visual testing at 320px, 360px, 390px and 430px widths is still required.


## THE COCKPIT desktop-site mode and company-heading overflow — 2026-11-16

- Follow-up branch: `fix/cockpit-desktop-mode-and-header-2026-11-16`.
- Detects browsers explicitly requesting a desktop user-agent mode and applies a desktop workspace layout even when the physical screen is narrow. The sidebar remains expanded, the mobile drawer/menu is suppressed, and the desktop workspace remains horizontally scrollable on narrow devices rather than silently reverting to the mobile drawer.
- Stabilizes the workspace identity/header grid so the company name and supporting description can wrap within their column without overlapping the status/refresh controls or overflowing the Cockpit content area.
- Keeps normal mobile user-agent behavior unchanged.
- Source-only pending review and merge. Verify on Android Chrome with Desktop site enabled and disabled, plus a regular desktop browser; no live browser QA or GitHub Pages deployment is claimed.


## Homepage conversion flow and AI assistant — 2026-11-16

- Feature branch: `feature/homepage-conversion-flow-ai-challenge-2026-11-16`.
- Homepage now promotes the Receptionist Architect AI Challenge immediately after the hero, with a dedicated visual feature block and a direct start button; the hero also has a direct challenge CTA. It retains the 45-scenario / three-level description and clearly discloses that challenge achievements are learning progress, not redeemable coupons.
- The custom demo form is moved directly after the managed-service explanation to shorten the conversion path. The telephone-history deep dive is removed from the homepage to keep the page focused on onboarding and marketing; the existing AI Challenge is removed from the generic resource-card grid to avoid duplicate promotion.
- A minimized-by-default floating Star69AI assistant is added to the homepage. It opens the existing `https://star69ai-concierge.hisjarman.workers.dev/` coach in a lazy-loaded iframe, can be minimized with the close control or Escape, and does not load the assistant until a visitor opens it.
- New styles are isolated in `home-conversion-flow.css`; existing global styling, lead form endpoint, pricing, reward restrictions, and application integrations are preserved.
- Validation and publication status must be recorded after static checks and browser review. This branch must be reviewed through a PR; do not merge `main` without approval.


## Homepage example-flow explanation and challenge navigation — 2026-11-16

- Follow-up branch: `fix/homepage-example-flow-challenge-link-2026-11-16`.
- Expanded the homepage hero's illustrative call-flow preview so its left column explains what the managed AI receptionist is doing, why the captured context helps the business, and that Star69AI configures and tests the workflow using rules approved by the client. The right column now gives more specific detail for each listen, qualify and hand-off stage. Responsive layouts stack the explanation and stages on narrower screens.
- Corrected the first/hero **Try the AI Challenge** button to link directly to `./challenge/`. It no longer links to the homepage's `#ai-challenge` section. The separate challenge feature CTA already links directly to the challenge page.
- Source-only change. No Worker, D1, billing, authentication, customer data or live integrations changed. Validate desktop/mobile rendering and challenge navigation before merge and GitHub Pages publication.


## Homepage example flow — full-width horizontal layout — 2026-11-16

- Follow-up correction to the homepage example flow: the prior revision expanded copy only inside a preview card that remained constrained to the right-hand hero column. That did not satisfy the requested left-to-right expansion.
- On desktop, the hero now uses a full-width single-column flow: marketing headline and primary actions first, followed by the example-flow panel spanning the available content width. Inside the panel, the explanation stays on the left and the three workflow stages display horizontally across the right.
- The workflow panel is no longer capped at 510px. Desktop content width is up to 1,440px with responsive side gutters. Tablet/mobile retain stacked layouts.
- Change is source-only on `fix/homepage-example-flow-full-width-2026-11-16`. Validate in a real browser at desktop/tablet/mobile widths and confirm GitHub Pages publication after merge; do not claim live until verified.


## Homepage industry-specific call-flow examples — 2026-11-16

- Feature branch: `feature/homepage-more-call-flows-2026-11-16`.
- Expanded the full-width homepage hero workflow panel with six additional concrete examples for plumbing, HVAC, cleaning, auto service, general contracting and real estate, alongside the existing roofing walkthrough.
- Each example shows a caller scenario, the information the receptionist gathers, and the configured next step. The cards are responsive: three columns on wide screens, two on tablets and one on narrow phones.
- Copy is illustrative and does not promise guaranteed bookings, transfers or outcomes; actual actions depend on the client's approved call-handling rules and integrations.
- Changes are limited to `index.html`, `design-refresh.css` and this handoff. No Worker, D1, billing, authentication, customer data or live integrations changed.
- Static source review is complete; real browser visual QA and GitHub Pages publication remain pending. Submit through a PR and do not merge without explicit approval.


## AI Challenge benefit copy and rainbow demo CTA — 2026-11-16

- Feature branch: `design/challenge-benefits-rainbow-demo-cta-2026-11-16`.
- Removed the homepage line stating challenge reward redemption is not yet enabled and replaced it with the practical visitor benefits: practice real-world call judgment, capture useful details, and learn when to answer, book or hand off.
- Reworded reward disclosures on the homepage and challenge page to remove “not enabled” / “not connected yet” phrasing while remaining accurate: progress is a browser-saved learning achievement and completing a level does not itself apply a subscription discount.
- Updated the homepage “Get My Custom Demo” hero CTA and form submit button to the same purple-to-blue-to-green rainbow spectrum as the AI Challenge CTA, with matching glow and hover treatment.
- Static website changes only. No Worker, D1, Stripe, PayPal, Clerk, Retell, customer data or billing configuration changed. Browser visual QA and GitHub Pages publication remain pending.


## Homepage hero sales-story rethink — 2026-11-16

- Feature branch: `design/homepage-hero-sales-story-2026-11-16`. Rebuilt the homepage first screen around one clear proposition: the business owner stays focused on the job while Star69AI answers and captures incoming customer calls. The new headline is “You’re busy doing the work. We’ll answer the call.”
- Reduced the hero to one dominant rainbow-spectrum **Get My Custom Demo** CTA and one secondary link to the managed-service explanation. Removed the competing AI Challenge and call-comparison buttons from the hero; the AI Challenge remains promoted in its own homepage feature section.
- Replaced the dense right-hand workflow manual and six example cards inside the hero with the existing left-facing receptionist artwork, Earth-at-night visual treatment and a clearly marked illustrative call-summary card. The call summary is explicitly labeled illustrative and is not represented as a live customer result.
- Moved the six industry examples into a separate responsive section after the hero so they remain available without overwhelming the first screen. Preserved pricing/demo disclosure and the existing custom-demo anchor.
- Added `homepage-hero-rethought.css` as a final stylesheet override. This is a static GitHub Pages change only; no Worker, D1, Stripe, PayPal, Clerk, Retell, Resend, customer data or billing behavior changed.
- Static structure and responsive CSS review are required before merge. Verify desktop and mobile layout, image crop, CTA destination, challenge section and demo form in a real browser after Pages publishes. This branch is not merged or confirmed live.

- Follow-through source checks: all nine new HTML IDs are present and unique; the appended CSS braces are balanced and responsive breakpoints are present; the UI reuses existing dashboard and call-email-settings endpoints. A fresh JavaScript syntax-parser run after the follow-through edits is still required; earlier syntax checks predate these edits.


## Pricing-page AI Challenge CTA — 2026-11-16

- Feature branch: `feature/pricing-ai-challenge-cta-2026-11-16`, created from current `main`.
- Added a clearly labelled “Take the AI Challenge” button directly inside the existing Receptionist Architect / Challenge Rewards section on `pricing.html`, linking to the existing `./challenge/` page.
- Added one short explanatory sentence describing the practical value of trying the challenge. Preserved the existing reward percentages, eligibility/stacking terms and explicit disclosure that secure account-based reward redemption is not yet enabled.
- No challenge logic, scoring, reward redemption, checkout, billing, Worker, D1 or customer data changed. Review via PR; do not merge `main` without explicit user approval.


## Industry Hub and shared navigation refinement — 2026-11-16

- Feature branch: `design/industry-hub-clean-global-header-2026-11-16`, created from current `main`.
- Refined the existing shared header used across public pages rather than adding a Hub-only header. Reduced the visible desktop navigation to Home, How it works, Industry Hub and Pricing, with a consolidated Explore menu for the existing secondary destinations.
- Kept Partner Login, Client Login and Get Started available. On mobile, Client Login remains in the compact header while Partner Login and Get Started are inside the expandable navigation; all existing destinations remain reachable.
- Replaced the accumulated/duplicated header CSS append blocks with one consolidated responsive stylesheet. Updated spacing, logo sizing, typography, glass-dark surface, subtle blue divider, consistent button hierarchy, dropdown layout, focus/keyboard behavior and reduced-motion handling.
- Simplified the existing header installer without changing its shared injection approach. Improved current-page highlighting, including opening Explore when the active page is one of its destinations; Escape closes the mobile menu and returns focus to its toggle.
- Preserved all existing navigation URLs and the existing single shared header architecture. No page content, Worker, D1, billing, authentication, Retell, customer data or production configuration changed.
- Static checks: JavaScript syntax, CSS brace balance, required primary/login/CTA destinations and retained secondary destinations. Real browser visual QA at desktop/mobile widths and GitHub Pages publication remain to be verified.
- Review through PR; do not merge `main` without explicit user approval.


## Founder portrait and career timeline — 2026-11-16

- Feature branch: `content/founder-photo-and-career-timeline-2026-11-16`, created from current `main`.
- Updated the existing About the Founder page portrait to use the requested existing asset `assets/founder-logo-full.webp.webp`.
- Added a factual career timeline based on Solomon Jarman's supplied résumé: U.S. Air Force communications/systems work (2001–2005), Unisys/DFAS workstation deployment (300 workstations in two weeks), URS/U.S. Army project support (approximately 800 users, 500 desktops and 30 servers in a 24/7 environment), Air Force Reserve air transportation service (2008–2011), Bureau of Land Management systems administration (2011–2012), and education/continued IT studies through 2020.
- Added a responsive, page-scoped timeline stylesheet. The timeline uses the approved dark Star69AI surface, readable light text and neon-green/blue accents. The shared `readability.css` remains last in the page stylesheet order.
- No backend, Worker, D1, billing, authentication, customer data or integrations changed.
- Source review confirms the requested portrait asset exists in the repository and the existing founder page is reused. Browser visual QA at 360px, 768px and 1280px and GitHub Pages publication remain unverified.
- Review through a PR; do not merge `main` without the user's explicit approval.


## Sitewide Star69AI logo and favicon integration — 2026-11-16

- Feature branch: `branding/sitewide-logo-favicon-2026-11-16`, created from the current uploaded-asset commit on `main` (74ef5ea9e21dd122a195efad7de89c5511bec275).
- Promoted the user-uploaded transparent `assets/star69ai-logo-transparent.webp` to the canonical full wordmark in the shared public header, home/about/pricing footers, client portal, agency admin, partner center, partner admin and Trust Lab/newsletter admin headers.
- Replaced the old headset-style favicon SVG with a matching Star69AI cosmic-star/orbit symbol and added the supplied 48px, 192px and 512px PNG favicon declarations plus Apple touch icons to primary pages and private consoles.
- Preserved existing routes, navigation, authentication, Worker/D1 behavior, billing, customer data and production configuration. No backend changes.
- Assets were already uploaded by the user to `main` and are reused without re-encoding. This branch is source-only; browser visual QA, Pages publication and cache refresh remain unverified. Review via PR; do not merge `main` without explicit user approval.


## Admin Marketing console — runtime error and missing research import — 2026-11-17

- Production D1 database `avr-trust-lab` contains the three Marketing tables (`avr_marketing_prospects`, `avr_marketing_sends`, `avr_marketing_unsubscribe_tokens`); a read-only production query confirmed `avr_marketing_prospects` has **0 rows**. The November 16 research batch was never imported, so the Admin UI cannot display it. The existing prospects GET endpoint correctly reads only that D1 table.
- Root cause of the Worker `business is not defined` runtime error: an orphaned duplicate validation statement referencing block-scoped `business` and `email` variables was left immediately after the `GET /api/admin/customers` route. It executes for otherwise-unmatched admin paths and throws a ReferenceError. The variables belong only to the POST customer-creation handler. Remove the orphan statement; keep validation in its owning handler.
- This repair is isolated on `fix/admin-business-reference-marketing-2026-11-17`; no production Worker deployment or main merge is performed from this branch.
- Retrieved prior research context identifies one fully surfaced prospect record: DiSalvo Roofing, Las Vegas, NV, public email `info@disalvoroofing.com`, phone 725-205-3113. The rest of the earlier report is truncated in conversation retrieval; do not invent missing records, sources or personalized drafts. User's standing instruction remains: verify each business, website, location, industry, public email and source; never guess, automatically add prospects, or send emails. Prepare records for review before import.
- Marketing emails remain one-at-a-time, individually reviewed and manually sent only after explicit admin action. No emails were sent and no prospect records were inserted during this repair.


## Admin marketing send confirmation popup removal — 2026-11-17

- Feature branch: `fix/admin-marketing-send-no-confirmation-2026-11-17`, created from current `main`.
- Removed the blocking `window.confirm()` prompt from the Admin Marketing compose form. Clicking the reviewed Send button now proceeds directly to the existing authenticated Worker send request.
- Preserved the in-flight disabled button state, `Sending…` feedback, success/error notices, individual prospect selection, explicit follow-up flag, unsubscribe handling, seven-day cooldown, 25-send rolling 24-hour cap, and server-side send eligibility checks.
- No email was sent during this source change. No production deployment or merge was performed; review through PR before merging and deploying.


## Marketing email footer founder identity — 2026-11-17

- Feature branch: `fix/marketing-founder-footer-identity-2026-11-17`, created from current `main` after reading this handoff and inspecting the current Worker marketing-send footer and the existing About the Founder page.
- Replaces the footer's standalone `Star69AI` identity with **Solomon Jarman · Founder & Operator**, linked to the existing canonical page `https://star69ai.com/about.html`, in both HTML and plain-text marketing emails.
- Keeps the Advertisement disclosure, prominent unsubscribe link, phone number, protected postal address, website/brand context in the destination URL, and List-Unsubscribe / one-click headers. No unsubscribe logic, sending rules, prospect records or email delivery behavior changed.
- Source-only change. No emails sent. Review through PR; do not merge `main` or deploy the Worker without the user's separate explicit approval.


## Marketing email duplicate signature cleanup — 2026-11-17

- Feature branch: `fix/marketing-founder-signoff-cleanup-2026-11-17`.
- Removed the generic `Best, Star69AI` and standalone website sign-off from both initial and follow-up outreach templates. The marketing send footer already supplies Solomon Jarman · Founder & Operator linked to the About page, plus phone and postal contact details.
- Added a marketing-only HTML email wrapper without the duplicate bottom logo/tagline block. The shared `brandEmail` wrapper remains unchanged for transactional and other non-marketing messages.
- Preserved the Advertisement disclosure, clearly visible unsubscribe link, founder identity, contact details, unsubscribe URL, and List-Unsubscribe / one-click headers.
- No emails sent; no prospect/customer records, unsubscribe states, sending rules or production bindings changed. Source changes are pending PR review; do not merge or deploy without separate explicit user approval.


## Sticky navigation yin-yang identity mark — 2026-11-17

- Feature branch: `branding/sticky-menu-yin-yang-mark-2026-11-17`, created from the sitewide logo/hero merge commit `07711d29e390f629f5d328d25f68544fb815eb35`.
- Added a compact, flat vector yin-yang SVG mark beside the MISSION CONTROL label in the shared sticky/navigation menu, using the site's dark navy and off-white identity.
- Styled the mark responsively for desktop and mobile; it is inline SVG, so it does not add another asset request or depend on an external icon service.
- Navigation destinations, menu behavior, accessibility labels, login links, and backend behavior are unchanged.
- Source-only change pending PR review; no merge or production deployment performed.


## Marketing prospect research drafts and email hero banner — 2026-11-17

- Working branch: `feature/marketing-prospect-drafts-hero-banner-2026-11-17`, based on the latest verified `main` commit `e32c55c7c13fd5aa767773539ab4e1ecc314c273`.
- Confirmed the existing enabled weekday automation **Research 25 Star69AI sales prospects** already researches 25 prospects, verifies public business details/emails, drafts unique initial emails, and imports records into `avr_marketing_prospects`. The issue was that `admin/admin.js` ignored the stored research/draft in `notes` and replaced it with two generic templates.
- Updated the existing automation prompt (without changing its Monday–Friday schedule) to store each imported prospect's research and complete individualized draft as compact JSON using schema `star69ai-prospect-v1`, with source URLs, observation, unique subject/body and `draftStatus: needs_review`. The task remains research/drafting/import only and must never send emails.
- Proposed Marketing console changes read that structured record and prefill the composer with its saved subject/body; they also show the research observation, verified website and source links. Removed automatic insertion of the generic roofing/general email templates. Follow-ups deliberately start blank so the original email is not recycled as a generic follow-up. The composer also parses the existing legacy notes format (`Batch`, `Source`, `Area`, `Why`, `Subject`, `Body`) so previously imported custom drafts are not lost while the next automation run transitions to structured JSON.
- Expanded the prospect notes input and authenticated Worker creation route limit to 12,000 characters so structured research and the complete email draft can be retained without truncation.
- Updated the marketing-only Resend HTML wrapper to display `https://star69ai.com/assets/image_hero.webp` as a responsive, clickable email header linking to the homepage. Transactional `brandEmail` wrapper is unchanged. Existing Advertisement disclosure, founder identity, mailing address, phone, unsubscribe URL and one-click unsubscribe headers are preserved.
- No email was sent, no prospect or customer records were changed, no D1 migration was added, and no Cloudflare Worker deployment was performed. The automation prompt update is saved; its next scheduled run is expected to use the structured notes format. Existing records with unstructured notes will not be overwritten and will show that no structured draft is available.
- Required validation: JS syntax checks; inspect generated email wrapper markup; verify admin source parses structured JSON and displays source links; confirm body-size and notes limits; run representative test records through UI; test an email preview in a mail client; review PR before merging. Worker deployment is a separate step after merge and must be verified independently. No merge or deployment without explicit approval.


## Official Star69AI brand language standard — 2026-11-17

- Added `docs/STAR69AI_BRAND_LANGUAGE_GUIDE.md` as the canonical terminology and voice reference for the public website, client workspace, internal Command Center, marketing/transactional email, automated campaigns, blog/social content, partner communications and support.
- Standardizes the Star69AI identity as **Star69AI — Communications, Evolved.** with a premium, confident, futuristic-but-human voice and the managed, done-for-you AI receptionist proposition.
- Official vocabulary: **The Crew**, **Client Care / Crew Support**, **Mission Control** (client dashboard), **Command Center** (internal admin), **Navigator** (AI assistant only), **Client Workspace**, **Open Channel**, **Initiate Contact**, **Mission Briefing**, **Systems Online**, **Mission Parameters**, **Diagnostics**, **Mission Status**, **Mission Report** (secondary label for call summary), and **Alliance Program / Alliance Member**.
- Added strict clarity rules: branded terminology must not obscure meaning; use plain language for pricing, billing, contracts, privacy, consent, recordings, security, opt-outs, support instructions and system errors. “Systems Online” is reserved for verified completion. “Navigator” must not be confused with the AI receptionist product.
- Updated README and the design/content standards to link to the official guide.
- Marketing email safeguards remain unchanged: Advertisement disclosure, founder signature, business contact details, unsubscribe link/headers, individual manual approval, cooldowns and send limits. No emails were sent. No Worker, D1, billing, authentication, customer or prospect data changed.
- Follow-up brand-language instructions were applied to the existing active prospect-research, blog-publication and weekly cartoon-episode automations without changing their schedules or publishing/sending permissions.

- Applied the vocabulary in the existing customer-facing client portal: the dashboard overview is now **Mission Control**, the support destination is **Crew Support**, the onboarding checklist is **Mission Briefing**, and Star69AI-operated “our team” references now say **our Crew**. The client business's own team/member/distribution-list references remain plain “team” so they are not confused with Star69AI personnel. Replaced “AI teammate” with “AI receptionist” to keep the product distinction clear.
- Rebranded the internal admin landing identity as **Command Center** and updated its document title and logo alt text to the official **Communications, Evolved.** tagline.
- Updated the existing demo/discovery acknowledgement email copy in `cloudflare/platform-worker.js` to refer to **our Crew** and use the official **Communications, Evolved.** sign-off. This is a source change only; the Cloudflare Worker has not been deployed. Existing transactional email remains transactional and does not gain an Advertisement disclosure.
- Updated the three active Star69AI content automations—**Research 25 Star69AI sales prospects**, **Publish Star69AI blog articles**, and **Create the weekly Saved by the AI Receptionist episode**—with the official brand-language rules. Their schedules, publication permissions, research/import behavior, and email-send restrictions were preserved. No marketing emails were sent and no articles/episodes were published by this terminology update.
- Documentation changes only in this branch. No merge or deployment performed. Review via PR; do not merge `main` without explicit user approval.


## Permanent lock for the approved cinematic public header — 2026-11-17

- Owner explicitly requested that the approved cinematic header/navigation design never change as part of future work.
- The frozen baseline is the PR #244 restoration of the design approved in PR #215, with PR #243 compact footer refinements retained.
- Added `project-context/STAR69AI_HEADER_DESIGN_LOCK.md` documenting the frozen visual/functional contract, protected elements, and the requirement for a separate explicit owner request before any future redesign.
- Added `.github/workflows/protect-approved-header.yml`. It checks the exact Git blob IDs of `site-header.js` and `site-header.css` on pull requests and pushes to `main`; any source change fails the check until the owner explicitly authorizes a design revision and the lock is deliberately updated.
- Pinned baseline: `site-header.js` blob `2e5b4984936f4c0cfb84ec4dd79207ae755e65d4`; `site-header.css` blob `5ea0add134838665ef019e63e7c59c00480bd611`.
- The lock protects the shared header/menu and footer stylesheet. It does not block unrelated page, content, backend or portal work, but other CSS must not override the frozen presentation.
- No existing site header, CSS, Worker, D1, authentication, billing, Retell, Stripe, PayPal, Resend, customer or prospect data was changed in this protection branch.
- Review and merge this protection as a pull request. Until merged, the guard is not active on `main`.


## Homepage-only hero, Web 3.0 client Mission Control and footer logo scale — 2026-11-17

- Feature branch: `design/homepage-hero-client-web3-mission-control-2026-11-17`, created from current `main` after PR #244 and PR #245 were merged.
- Public header: the full-width `/assets/image_hero.webp` cover is now displayed only on `/` and `/index.html`. Other public pages retain the 18-link cinematic Mission Control menu and utility links inside a compact 76px desktop / 66px mobile dark-blue header, without the hero image or cover tagline strip.
- Client dashboard: removed the homepage hero artwork from its top identity header. The client workspace now uses a compact navy glass-effect identity bar, deep-space ambient glow and subtle grid, electric purple `#F461FE`, electric blue `#43B4FE`, neon green `#34FD78`, illuminated navigation states, glass-like cards, and restrained reduced-motion-aware effects. Updated browser theme color.
- Footer: increased the canonical footer wordmark container/image to 320px desktop and 280px mobile while retaining natural image proportions and the dark footer.
- Updated `project-context/STAR69AI_HEADER_DESIGN_LOCK.md` and `.github/workflows/protect-approved-header.yml` because the explicit owner request intentionally revises the previously frozen header design. New protected Git blob IDs are recorded in both the lock and workflow.
- No authentication, Worker, D1, billing, call data, customer/prospect records or email behavior changed. No merge or deployment performed.
- Validation performed: confirmed the branch is based on current main; confirmed homepage route detection, interior hero-art hiding, dashboard navy header override, all three approved accent colors, footer sizing overrides, and synchronized design-lock/workflow blob IDs. Automated browser visual QA, responsive screenshot review, GitHub Actions check, PR review/merge and Pages deployment remain outstanding.

## Star69AI Secret Mission Easter egg — 2026-11-18

- Feature branch: `feature/secret-mission-easter-egg-2026-11-18`, based on current `main` after reading this handoff and inspecting the homepage, How It Works, Industries, Pricing, Demos and the shared header installer.
- Adds an optional five-signal treasure hunt across the homepage, How It Works, Industries, Pricing and Demos. Each page has one subtle spacecraft signal marker; collecting a fragment reveals the next riddle and destination.
- Adds a cinematic star-map dialog, progress tracker, resume control, and a non-monetary Star Navigator achievement. The map launcher appears after the visitor starts.
- Progress is stored only in the visitor's browser localStorage. No accounts, emails, analytics events, server calls, customer records, discounts, checkout, billing or backend changes are introduced.
- Uses new root-level `secret-mission.js` and `secret-mission.css`; only adds stylesheet/script references to the five participating public pages. Does not modify protected `site-header.js`, `site-header.css`, the header design lock, client dashboard or existing AI Challenge.
- Source validation: JavaScript parses successfully; all five pages reference both assets; CSS braces are balanced. Browser visual QA, touch-device testing and GitHub Pages deployment remain unverified.
- Review through PR. Do not merge `main` without explicit user approval.


## Receptionist Intelligence deployment and prompt optimization workbench — 2026-11-18

- PR #256 merged to main at `8ab19d3d59670f962bd4fc980af0c405fa0f8619`.
- Applied and verified production D1 migration `avr_call_intelligence` in database `avr-trust-lab`.
- Deployed Worker `avr-platform-api` from merged main source via Cloudflare API. Added native Workers AI binding `AI` while preserving existing plain-text, secret-text and D1 bindings. New deployment version `0f02d042-63ac-4be3-bc58-0f56c2b3a93c`, deployment `c18492c7-1673-4615-b4a6-6c1626d9d97b`, 100% traffic. GitHub Pages publication and real Retell webhook analysis still need live verification; direct site URL fetch was not available during this session.
- Started branch `feature/agent-prompt-optimization-workbench-2026-11-18` for call-linked prompt proposal generation with Cloudflare Workers AI, offline scenario simulation, admin approval before publishing a new Retell agent version, stale-base protection, and rollback by publishing the stored previous prompt as a new Retell version.
- Next phase remains source-only until reviewed, merged, D1 migration applied and Worker/site deployed. The scenario simulation is model-based QA, not a live Retell call or guaranteed behavior. Conversation Flow agents remain out of scope for this prompt-only workflow.


## Transactional email branding and discovery confirmation — 2026-11-18

- Working branch: `email/transactional-confirmation-branding-2026-11-18`, created from current `main` after reviewing the handoff and current Worker email implementation.
- Reworked the shared transactional `brandEmail` wrapper to use the canonical `/assets/main_logo.webp` wordmark, a dark Star69AI header/footer, approved neon-green accent, and a consistent **Solomon Jarman — Founder & Operator** signature with website and support email.
- Rewrote the discovery/demo acknowledgement in both HTML and plain text. It addresses the submitted contact by name, identifies the business, explains the Crew review/custom-demo next step, and clearly states that a demo request does not assign a production number, activate routing, or start a paid subscription.
- Preserved the existing Resend sender configuration, idempotency key, discovery-versus-quick-request distinction, and the quick-request link to the full discovery form. The shared wrapper also standardizes the signature on other transactional messages that use `brandEmail`; marketing-specific disclosure/unsubscribe content remains in its existing body.
- Source assertions passed for the canonical logo, founder signature, personalized greeting, discovery copy, approval boundary, and existing idempotency key. No email was sent, no customer/prospect records were changed, and no Worker deployment or merge to `main` was performed.
- Before merge/deployment, run the platform Worker syntax and regression checks, inspect the PR diff for email-client-safe HTML, and verify delivery using a controlled test recipient. Do not merge `main` without the founder's explicit approval.


## Intelligence-first homepage hero — 2026-11-18

- Working branch: `conversion/intelligence-first-homepage-hero-2026-11-18`, based on current `main` after reading this handoff and inspecting the homepage, hero stylesheet, and Receptionist Intelligence workbench notes.
- Reframes the homepage hero around Star69AI's differentiator: call analysis that turns conversations into useful business insights and reviewed improvement recommendations. The AI receptionist portrait no longer occupies the hero's primary visual column; it is replaced by a premium call-intelligence dashboard illustration.
- The visual demonstrates an illustrative roofing inquiry, caller intent, urgency, a recurring after-hours question, and a proposed answer/escalation improvement. It is explicitly labeled illustrative. The copy states that the Crew reviews proposed changes before they reach a live receptionist, matching the existing approval-gated prompt optimization design.
- Updates the headline, subhead, process stamp and benefit proof points to lead with business intelligence and managed ongoing improvement. Preserves the primary custom-demo CTA, pricing/activation disclosure, cinematic background, existing header/menu, and all other homepage sections.
- Adds isolated `intelligence-hero.css`; does not modify the protected `site-header.js` or `site-header.css`, Worker, D1, billing, auth, Retell, email, or customer/prospect data.
- Source checks: replaced the exact portrait markup, verified the AI portrait asset is no longer referenced in the homepage hero, confirmed the intelligence dashboard and review-required disclaimer are present, and checked CSS brace balance. Browser screenshot/visual QA at desktop, tablet and mobile widths plus GitHub Pages deployment remain outstanding. This is source-only until reviewed and merged; do not merge without the founder's explicit approval.

## Cinematic StarGate-inspired client Mission Control — 2026-11-18

- Working branch: `design/cinematic-stargate-client-mission-control-2026-11-18`, created from current `main` after reviewing this handoff, the protected public cinematic menu, and the existing client portal markup/styles.
- Added an isolated `client/mission-control-cinematic.css` presentation layer and loaded it after the existing client portal styles. It brings the client workspace closer to the public Mission Control menu: deep-space starfield and grid atmosphere, layered navy command-deck panels, blue/purple illuminated navigation, restrained neon-green live indicators, HUD/radar geometry in the workspace banner, and subtle signal effects.
- Renamed the sidebar identity from “The Cockpit” to the official “Mission Control.” Preserved existing client portal navigation, responsive drawer, authentication, API/data bindings, call activity, Receptionist Intelligence, billing, support and knowledge-center workflows.
- The visual direction is original Star69AI styling inspired by cinematic space-exploration interfaces; it does not use Star Trek or Stargate logos, characters, or copied screen assets.
- The approved public header/menu files `site-header.js` and `site-header.css` were not changed. No Worker, D1, authentication, billing, Retell, customer data or production configuration changed.
- Source checks: verified the new stylesheet is linked after the existing client styles, the workspace label is updated, and the new CSS has balanced braces. Browser visual QA at desktop/tablet/mobile widths and GitHub Pages deployment remain unverified. Review via PR; do not merge `main` without the founder's explicit approval.


## Cinematic checkout page refresh — 2026-11-18

- Working branch: `design/modern-cinematic-checkout-2026-11-18`, based on current `main` after reviewing this handoff, the existing checkout page and its JavaScript contract, the canonical public Mission Control header, and the public checkout Worker validation.
- Replaced the checkout page's legacy standalone top bar with the shared cinematic Star69AI navigation and added a new responsive deep-space checkout visual layer: mission-style hero, orbital identity motif, restrained neon accents, readable dark form controls, clearer plan summary, and stronger action styling.
- Preserved the existing `paid-checkout-form` element, every JavaScript-referenced field ID, form field names, promo-code prefill, `checkout.js` submit/capture/resume logic, and all checkout API/payment behavior. No Worker, D1, Stripe, PayPal, Retell, authentication, or customer data was changed.
- Preserved the November `3FORFREE` promo handoff. The current Worker accepts it only for monthly plans during 2026-11-01 through 2026-11-30 and requires a configured Stripe coupon that is valid, 100% off, and one-time. The production secret/configuration was not inspected, so redemption readiness is not confirmed.
- Static validation: shared header and new stylesheet are linked; legacy top bar removed; checkout form and JavaScript preserved; all IDs queried by `checkout.js` are present; promo field retained; CSS brace balance is zero.
- Not yet performed: browser visual QA at mobile/tablet/desktop widths, live form submission, real Stripe/PayPal checkout, or GitHub Pages deployment. Do not claim the page is live until the PR is reviewed/merged and the Pages deployment succeeds. No production billing or customer data was changed.


## Call Shield audience documentation — 2026-11-18

- Added a customer-facing Call Shield guide at `docs/knowledge-base/CALL_SHIELD_CLIENT_GUIDE.md`, covering presets, bounded client controls, repeat-caller behavior, cooldowns, duration caps, privacy, limitations and troubleshooting.
- Added an internal administrator operations manual at `docs/knowledge-base/CALL_SHIELD_ADMIN_MANUAL.md`, covering daily operations, Crew overrides, permanent-block review, incident response, security and the remaining release QA checklist.
- Added the public Learning Center page at `learning-center/call-shield.html` with product explanation, client controls, safeguards, limitations and FAQs.
- Linked the guides from the knowledge-base index and repository README. This branch is documentation/content only: no Worker, D1, Retell, billing, authentication, client settings or customer data changed.
- The guides explicitly preserve the current evidence boundary: PR #274 and Worker/D1 deployment are recorded as merged/deployed, while authenticated browser tests, live Retell inbound-call tests and GitHub Pages publication verification remain outstanding. Do not claim those tests passed until performed.
- Working branch: `docs/call-shield-knowledge-guides-2026-11-18`. Review through PR; do not merge to `main` without the founder's explicit approval.


## Client-owned OAuth authorization requirements — 2026-11-18

- Revised Integrations Hub PR #276 to state that clients authorize their own provider account through the provider's official consent screen; Mission Control must never collect provider passwords, API keys or tokens.
- Added `docs/INTEGRATIONS_OAUTH_SECURITY_ARCHITECTURE.md` as the required security/release contract: single-use tenant-bound OAuth state, PKCE where supported, server-side code exchange, application-layer token encryption with Worker secrets, strict tenant ownership, least-privilege scopes, read-only default, audit/revoke/disconnect, minimal per-call data access and provider-by-provider rollout gates.
- The existing PR remains a request catalog only. It does not implement OAuth or claim any provider is connected. Retell-native OAuth must not be used until independent per-client authorization ownership and revocation are proven; otherwise Star69AI Worker must broker provider access and expose narrowly scoped custom functions.
- No Worker routes, D1 migrations, OAuth app credentials, provider tokens, Retell settings, customer records, production secrets or deployment configuration changed. No merge or deployment performed.
- Before implementing live OAuth, select one provider, verify its official endpoints/scopes/review requirements and confirm required Star69AI OAuth app credentials are available as Worker secrets. Test two-tenant isolation, connect/refresh/revoke/disconnect, least privilege and call-time data minimization. Browser QA and signed-in end-to-end tests for PR #276 remain outstanding.


## Homepage and public capabilities hero alignment — 2026-11-18

- Working branch: `feature/homepage-capabilities-hero-alignment-2026-11-18`, created from current `main` after reading this handoff and inspecting the homepage and public capabilities page.
- Replaced the homepage hero's call-intelligence illustration panel and its Earth/glow decoration with the same 12-item capability showcase used on the public Capabilities page: 24/7 answering, bookings/reservations, customer recognition, lead qualification, missed-call recovery, SMS/notifications, smart routing, business integrations, Call Shield, multilingual voice, payment workflows and call analytics.
- Each tile links to the detailed capability library. The left-side intelligence-led headline, custom-demo CTA, pricing disclosure and managed-service message remain intact.
- Added a responsive homepage-only style layer in `intelligence-hero.css`; the shared public header, footer, other homepage sections and the separate capabilities page remain untouched.
- Capability wording remains qualified: connections and actions depend on supported providers, client authorization, plan, configuration and testing. No new integrations or backend functionality are claimed.
- Source-level checks performed in this change: exact old illustration markup removed from homepage hero; 12 capability tiles and detailed-page links present; responsive 3-column/2-column breakpoints and focus-visible styling included; reduced-motion behavior retained. Browser screenshots/visual QA and live GitHub Pages verification remain to be performed.
- Source-only change. No Worker, D1, Retell, billing, authentication, customer/prospect records or production configuration changed. Review through PR; do not merge `main` without the founder's explicit approval.


## Owner-approved grouped public navigation — 2026-11-18

- Working branch: `feature/group-public-navigation-menu-2026-11-18`, created from current `main` after reading the project handoff, the frozen header design lock and the live shared header implementation.
- Grouped all 19 existing public destinations into five visitor-intent sections: **Explore** (Home, How it works, What it can do, Industry Hub, Industry overview, Provider directory); **See It in Action** (Demos, AI Challenge, AI Trust Lab); **Learn & Support** (Learning Center, Stories, FAQ, Managed AI research); **Company & Plans** (About Star69AI, Managed service, Pricing, Partner program); **Policies** (Privacy, Terms).
- Preserved all 19 destination labels/routes, active-page highlighting, inert-while-closed behavior, Escape/outside-click close, MENU/CLOSE interaction, and the separate Partner Login, Client Console and Initiate Contact utility strip.
- Added responsive grouped cards: three columns on wide screens, two on tablet, one on mobile; links inside each group use a two-column layout. Existing keyboard focus-visible styling and reduced-motion behavior are retained.
- Updated `STAR69AI_HEADER_DESIGN_LOCK.md` and the protection workflow's pinned Git blob IDs because the owner explicitly requested a navigation organization change. New approved source blobs: JS `6664131e13969a38938c84657db4ec4b9a4df636`, CSS `34a920b0f858198d33efc8a2174f21008cd2abc9`.
- Source checks: 5 groups; 19 destinations; no routes removed; CSS braces balanced; responsive group breakpoints present. Browser screenshot/interaction QA at desktop, tablet and mobile remains outstanding.
- No Worker, D1, Retell, billing, authentication, customer/prospect records or production configuration changed. Source-only PR; no merge until explicit owner approval.


## Homepage conversion focus and optional expansion — 2026-11-18 — REVIEW REQUIRED

- Working branch: `conversion/homepage-focus-expand-newsletter-last-2026-11-18`, based on current `main`.
- Kept the homepage hero, capability showcase, interactive call-rescue simulator, Call Shield / Receptionist Intelligence selling points, and industry proof visible by default.
- Grouped the remaining lower-priority homepage material (AI Challenge, how it works, managed-service explanation, demo/discovery content, comparison and safeguards, industry example, dashboard/language previews, and exploration links) inside a native accessible `<details>` disclosure. Visitors can choose **Show more** or **Show less**; the content remains in the HTML rather than being deleted.
- Added a homepage-only visual treatment for the disclosure. No other public page uses this collapsed layout.
- Moved the weekly story newsletter subscription section to the final content position immediately before the homepage footer.
- Added hash-navigation handling so a direct link to a section inside the collapsed region opens the disclosure before navigation.
- Preserved existing newsletter form fields and `data-story-subscribe` hook, existing forms, CTA destinations, scripts, and backend behavior. No Worker, D1, Retell, billing, authentication, customer/prospect data or production configuration changed.
- Static verification required: ensure exactly one newsletter subscription section remains and is last before the footer; verify the disclosure begins after the initial selling-point sections and closes before newsletter; check stylesheet link and hash-reveal script; run HTML/JS/CSS syntax and link/ID checks. Browser visual QA at desktop/tablet/mobile and GitHub Pages publication remain outstanding.
- Source-only PR review required. Do not merge to `main` without explicit founder approval.

## Capabilities card text overflow correction — 2026-11-18 — REVIEW REQUIRED

- Working branch: `fix/capabilities-card-text-overflow-2026-11-18`.
- Added explicit min/max-width and box-sizing constraints to capability card grid items, plus safe wrapping and hyphenation for card tags, headings and descriptions. Mobile cards remain a single full-width column.
- Scoped to `capabilities.css`; no copy, navigation, integrations, Worker, D1, Retell, billing, auth or customer data changed.
- Source-level checks and browser visual QA at 360px, 768px and 1280px remain required before merge. Do not merge without the founder's explicit approval.


## Spaceship cursor reliability and brand personality — 2026-11-18

- Working branch: `fix/spaceship-cursor-and-brand-personality-2026-11-18`, based on the current `main`.
- Reworked `assets/cursor-follower.js` so the spaceship pointer activates only after the cursor image loads; if the image fails, the native browser cursor remains available. The follower is reparented into the currently open native dialog/popover so it renders inside the browser top layer, including the Secret Mission map dialog.
- Added pointer-exit, window-blur, tab-visibility, reduced-motion and unsupported-pointer fallbacks. Text-entry controls retain their native text cursor. The follower remains pointer-events:none and cannot intercept clicks.
- Removed the unconditional desktop `cursor:none` rule from `styles.css`; this was the main reason the pointer could disappear when the follower was hidden, unloaded or visually trapped behind a native dialog.
- Added a compact homepage brand note: “We love where technology is going. We care about where it takes people.” It expresses curiosity and optimism while connecting technology to human outcomes: giving owners time back, helping callers feel heard and making work lighter. The treatment is concise and responsive and sits before the optional expanded homepage content.
- No Worker, D1, Retell, billing, authentication, customer records, forms, promotions, mission progress or reward logic changed.
- Static source checks required: JavaScript syntax; image-load fallback; absence of global cursor hiding; overlay-host synchronization; pointer-events:none; mobile/reduced-motion behavior; homepage section placement and responsive CSS. Browser QA remains required for standard pages, the Secret Mission map/dialog, popovers, text inputs and pointer exit at desktop widths, plus touch/mobile checks.
- Review through the PR. Do not merge to `main` without the founder's explicit approval. GitHub Pages deployment and live-site behavior remain unverified until after merge and deployment.


## Visitor arrival spaceship and complete header artwork fit — 2026-11-18 — OWNER APPROVED

- Working branch: `design/visitor-arrival-header-fit-2026-11-18`, based on current `main` after reading this handoff and inspecting the shared header implementation and both image assets.
- Reuses the existing `assets/visitorspaceship.png` as a decorative visitor-arrival overlay on the homepage header. The ship flies in from the right and settles over the banner; it is hidden from assistive technology, cannot intercept clicks, and is shown once per browser session where session storage is available.
- Changes the homepage banner image from cropped `cover` rendering to proportional `contain` rendering so the complete existing artwork remains visible within the current header space. The header height, menu, utility links, and interior-page compact header are not changed.
- Reduced-motion users receive a stationary ship instead of the arrival animation. The ship is a separate overlay, not baked into the banner or brand logo.
- Source-level checks required: verify asset paths exist; JavaScript syntax; exactly one ship overlay on homepage; no overlay on interior pages; image contain behavior; pointer-events:none; responsive and reduced-motion styles; navigation markup unchanged. Browser visual QA at desktop/tablet/mobile and live GitHub Pages verification remain outstanding.
- No new image upload, Worker, D1, Retell, billing, authentication, customer data or production configuration changes. Review through PR; do not merge without explicit founder approval.


## Visitor arrival spaceship initialization correction — 2026-11-18

- Follow-up branch: `fix/visitor-spaceship-arrival-init-2026-11-18`.
- Fixed the initialization order: the homepage banner container is part of the shared header markup, so the ship is now attached after that markup is inserted.
- The arrival animation begins only after `/assets/visitorspaceship.png` successfully loads. A failed image is removed and does not consume the once-per-session display.
- Updated the approved-header protection fingerprints and design lock for this narrowly scoped correction. Navigation, banner design, reduced-motion behavior, and all unrelated systems remain unchanged.
- CI and browser/live-site verification are pending review; do not merge until required checks pass and the founder explicitly approves.
