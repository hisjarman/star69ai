# Phase 5 Visual QA and Phase 6 SEO Work

**Branch:** `qa/phase-5-visual-phase-6-seo-2026-11-18`  
**Base:** `main` at `4323f28d1de86e7d80c69584dcdd0795eebc7315`  
**Scope:** Public website QA automation, sitemap/crawler hygiene, and truthful Intelligence-page messaging. No production backend, billing, authentication, customer data or Worker configuration changes.

## Phase 5 — Visual and responsive QA

Added a GitHub Actions quality workflow with two independent jobs:

- **Responsive browser smoke tests:** Playwright/Chromium checks 17 public routes at 360px, 768px and 1280px. It verifies HTTP 200, a visible H1, and no horizontal page overflow. The discovery form is also checked for required fields and a required privacy-consent checkbox.
- **Screenshot evidence:** The homepage, pricing page and discovery form are captured at all three viewport sizes and uploaded as a workflow artifact.

The browser checks have not been considered passed until the GitHub Actions run completes successfully. These automated checks do not replace a manual visual review of typography, contrast, menu interaction, touch targets, forms and authenticated dashboards. The client and admin consoles are outside this public-site smoke-test scope.

## Phase 6 — SEO and conversion hygiene

- Added a Node-based SEO gate that checks public HTML page titles, meta descriptions, canonical URLs, H1 presence, sitemap coverage, sitemap file targets, duplicate sitemap entries and crawler exclusions for private routes.
- Added missing public URLs for the Receptionist Intelligence page and the “Call That Crossed the Signal Nebula” story to `sitemap.xml`.
- Added crawler exclusions for the private partner portal and admin pages in `robots.txt`. These rules are crawler guidance, not access control; authentication and server-side authorization remain the security boundary.
- Added canonical and social-sharing metadata to `receptionist-intelligence.html`.
- Rewrote Intelligence-page copy to make call-analysis availability configuration-dependent and clarify that AI findings are recommendations, human approval is required before live changes, and measured outcomes depend on connected business data. This avoids promising an unverified always-on improvement loop.

## Validation and limits

- Source inventory found 55 HTML pages in the repository.
- Existing public pages already contain substantial SEO metadata, canonical URLs and structured content. The changes focus on the missing sitemap coverage, private crawler exclusions and the Intelligence page's claims.
- Automated SEO and responsive browser checks are now wired into pull requests. Their pass/fail results are pending the first CI run on this branch.
- No live-domain fetch, manual mobile-device inspection, authenticated dashboard visual test, Lighthouse/PageSpeed measurement, Google Search Console inspection or real lead submission was completed in this environment.
- No changes were made to the frozen shared header files, Cloudflare Workers, D1, Clerk, Retell, Stripe, PayPal or Resend.

## Founder review after CI

1. Review the responsive screenshot artifact for 360px, 768px and 1280px.
2. Check the live homepage, pricing page, discovery form and mobile navigation on a real phone.
3. Review Search Console indexing and sitemap processing after the changes are published.
4. Approve or request changes on the pull request. Do not merge until the founder approves.
