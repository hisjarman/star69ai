# Star69AI Approved Header & Navigation — Design Lock

**Status: FROZEN — owner-approved grouped navigation and homepage banner/visitor-arrival revision on 2026-11-18.**

This is the permanent public-site header/navigation baseline. The owner explicitly revised the design on 2026-11-17: the full-width cinematic hero artwork appears on the homepage only; interior public pages retain the same compact cinematic Mission Control menu in a short dark header bar.

## Protected elements

- Homepage only: full-width cinematic cover using `/assets/image_hero.webp`.
- Interior public pages: compact dark-blue header bar with the same MENU/CLOSE control, destination panel and utility strip; no hero artwork or oversized cover.
- The compact MENU/CLOSE control and translucent Mission Control destination panel, with five clearly labeled navigation groups and responsive grouped link tiles.
- The existing 19 destination links, organized into five visitor-intent groups: Explore, See It in Action, Learn & Support, Company & Plans, and Policies. All labels and routes are preserved.
- The compact Partner Login, Client Console and Initiate Contact utility strip.
- Existing interaction and accessibility behavior: open/close state, Escape key, outside-click close, active-page highlighting and inert navigation while closed.
- The compact, dark, high-contrast footer refinements retained from PR #243, including the canonical Star69AI wordmark treatment.

## Change policy

- Do not redesign, simplify, replace, remove, restyle, reorder, rename or relocate these elements as part of unrelated site work.
- Do not replace this with a conventional persistent navigation bar, a sticky header, a different menu, or a different hero.
- Routine site changes must preserve the protected files byte-for-byte. The owner expressly authorized grouped navigation on 2026-11-18; this grouped menu is now the revised protected baseline.
- GitHub Actions workflow **Protect approved Star69AI cinematic header** checks the Git blob IDs of `site-header.js` and `site-header.css`. Any change to either file fails the check on pull requests and pushes to `main`.
- The lock is intentionally strict. A future change is allowed only if the owner explicitly requests a new header/menu design. That request must include deliberate review of the new design, updating this document and the pinned Git blob IDs in the protection workflow in the same reviewed pull request.
- This design lock does not prevent other site content, page layouts, backend systems or unrelated styles from evolving, provided they do not override or alter the protected header/footer presentation.

## Owner-approved grouped navigation revision — 2026-11-18

- Grouped all 19 existing destinations without removing or renaming routes: Explore (6), See It in Action (3), Learn & Support (4), Company & Plans (4), and Policies (2).
- Kept Partner Login, Client Console and Initiate Contact in the separate utility strip.
- Added responsive three-column, two-column and single-column group layouts, with clear group descriptions and keyboard focus behavior inherited from the existing links.
- This is an explicit owner-authorized revision to the previously frozen navigation. The new blob IDs are pinned in the protection workflow.

## Owner-approved homepage banner and visitor-arrival revision — 2026-11-18

- The owner explicitly approved PR #284 to display the complete existing homepage banner artwork proportionally with `object-fit: contain` and add the existing visitor spaceship as a decorative arrival animation.
- The animation is homepage-only, non-interactive and hidden from assistive technology. It replays on every homepage refresh with one of four randomized flight routes, explores the banner, lands on the central yin-yang emblem and plants a small decorative flag. Reduced-motion users receive a stationary ship and visible flag without animation.
- The compact interior-page header, all 19 navigation destinations, grouped menu, utility strip, footer styling, keyboard behavior and existing accessibility protections remain protected and unchanged in intent.
- This is a narrowly scoped approved presentation revision, not permission for unrelated navigation/header redesign or removal of automated protection.

## Approved source baseline — updated by the social-cover and visitor-flight revision

- `site-header.js` and `site-header.css` fingerprints are updated in the protection workflow in the same pull request as this revision. The PR must pass the protected-header CI check before merge.
- PR #284: owner-approved homepage banner and visitor-arrival presentation revision.
- PR #285: narrow visitor-arrival initialization and responsive banner reliability corrections; preserves PR #284's approved design and existing navigation.
- Original cinematic restoration: PR #244
- Revised homepage-only hero and compact interior menu: owner-authorized change, 2026-11-17
- Original approved design reference: PR #215
- Footer refinements retained: PR #243

This lock protects the approved source implementation. It cannot guarantee that third-party browser extensions, cached assets, future browser behavior, or unrelated page-specific CSS will never affect how a visitor renders the page; visual regression checks remain useful after substantial site-wide styling work.


## Visitor arrival initialization reliability fix — 2026-11-18

- Narrow follow-up correction to the already owner-approved visitor-arrival behavior: attach the visitor spaceship only after the shared header markup has been inserted, because the banner container is created by that markup.
- Wait for the existing spaceship image to load before starting the arrival animation; failed image loads remove the decorative element and do not mark the session as having seen it.
- No visual redesign, navigation changes, route changes, or changes to the approved banner artwork, reduced-motion fallback, pointer behavior or one-arrival-per-session intent.
- Updated the protected source fingerprints in the same reviewed change. This does not authorize broader header or navigation modifications.


## Responsive homepage banner display correction — 2026-11-18 — OWNER REQUESTED

- Desktop and large monitors: display the complete original banner at 100% available width with automatic proportional height; do not crop, stretch, squash or constrain it to a fixed-height box.
- Tablet: continue proportional full-width scaling with the complete composition preserved.
- Mobile: use a deliberate centered 4:3 crop of the existing artwork so the focal center remains prominent. A separately authored mobile asset can replace this CSS crop when one is supplied.
- The cover container follows the desktop image's natural height; the menu and visitor-arrival overlays remain positioned above the artwork.
- This is a narrowly scoped banner presentation correction. The menu destinations, utility links, header structure and footer remain protected.
- Updated the protected CSS blob fingerprint in the same reviewed change.

- The once-per-session guard uses a versioned key so a stale flag written by the previous broken initializer cannot suppress the corrected first arrival.


## Owner-approved social-cover and visitor-flight revision — 2026-11-18

- Replace the oversized natural-height homepage artwork with a shallow, responsive social-media-style cover: capped desktop height, compact mobile height, and a deliberate centered crop of the existing artwork.
- Preserve the existing Mission Control menu, all 19 destinations, utility strip, interior-page compact header, footer, keyboard behavior and accessibility protections.
- Replay the visitor spaceship on every homepage refresh. Select one of four randomized exploration routes, then land on the yin-yang emblem centered on the astronaut and plant a small decorative flag.
- Keep the flight decorative, pointer-inert and hidden from assistive technology. Reduced-motion users receive a stationary ship and flag without animation.
- No unrelated site, backend, Worker, D1, Retell, billing, authentication, customer data or deployment changes are authorized by this revision.


## Compact cover navigation overflow safeguard — 2026-11-18

- The compact homepage cover must retain `overflow:visible` so the existing Mission Control dropdown can extend below the banner without clipping. The visitor-flight overlay itself clips its animated ship within the artwork bounds.
- This preserves the existing navigation interaction and does not change the cover dimensions or visitor flight.


## Owner correction — complete hero image fit and direction-aware visitor ship — 2026-11-18

- The homepage cover remains compact: desktop height is capped at 184px and mobile height at 150px. Do not let the source image's natural dimensions expand the header.
- Show the entire `/assets/image_hero.webp` artwork proportionally inside the cover using `object-fit: contain`. No crop, stretching, or distortion. Any unused space remains the existing deep-space background.
- The visitor ship is a separate decorative overlay. Its source artwork points left, so mirror it horizontally on each left-to-right flight segment and leave it unmirrored on each right-to-left segment. Do not rotate the ship 180 degrees or alter its artwork.
- Preserve the four randomized exploration routes, flight timing, landing/flag sequence, reduced-motion behavior, Mission Control dropdown overflow, navigation, utility links, and interior-page header.
- This owner correction supersedes the earlier social-cover note that called for a deliberate crop of the hero artwork. It does not authorize changes to unrelated site features.


## Owner-requested header text and full-width banner correction — 2026-11-19

- Removed the visible “COMMUNICATIONS, EVOLVED.” tagline from the shared header cover; the Star69AI brand mark, SYSTEM ONLINE status, Mission Control menu and utility links remain.
- Made the shared header a true viewport-width, full-bleed element so it reaches both the left and right edges even when a page content wrapper is narrower. Kept the cover artwork proportional and the existing compact responsive header behavior; no horizontal stretching or unrelated page-layout changes.
- Updated the approved-header protection fingerprints in the same change. No navigation destinations, visitor-flight behavior, footer content, Worker, D1, Retell, billing, authentication or customer data changed.
- Source-level validation and browser visual QA at mobile, tablet and desktop widths are required before merge. GitHub Pages deployment is not assumed.


## Owner-requested true banner fill correction — 2026-11-19

- The owner reports the homepage artwork still does not read visually as a site banner. This correction supersedes the prior complete-artwork `object-fit:contain` instruction for the homepage cover.
- The homepage hero is a shallow, edge-to-edge social/site banner: fill the full available width and fixed responsive cover height using `object-fit:cover`. Preserve the image's proportions; crop excess image area rather than letterboxing, stretching, or allowing the source image's natural height to expand the header.
- Keep the desktop cover capped at 184px and mobile at 150px. Keep the image centered, with a slightly elevated desktop focal position. The deep-space base remains behind the image.
- The visitor spaceship remains a separate overlay and its routes, direction mirroring, landing/flag animation and timing are unchanged. Preserve Mission Control menu overflow, navigation, utility strip, interior header and footer.
- Update the protected CSS fingerprint in the same PR. Browser QA and GitHub Pages deployment verification are still required; do not claim visual success until checked.


## Owner correction — full artwork and utility-row menu — 2026-11-18

- Move the Mission Control menu trigger out of the artwork and into the persistent utility-button row, alongside Partner Login, Client Console and Initiate Contact. Keep the full grouped navigation panel attached to that row and ensure it opens below the row without being clipped.
- On the homepage, display the complete hero artwork at full available width using its intrinsic aspect ratio. Do not crop it with `object-fit:cover`, stretch it, or force it to fill the viewport. The image determines the cover height proportionally on desktop and mobile.
- Preserve the visitor spaceship overlay and animation, status indicator, all navigation destinations, utility actions, interior-page compact header and footer. Update the protected CSS fingerprint in the same PR.
- Browser visual QA and GitHub Pages deployment verification remain outstanding.


## Final compact full-artwork banner correction — 2026-11-18

- Keep the homepage cover edge-to-edge and compact: desktop height scales between 138px and 184px; mobile remains between 126px and 150px.
- Fit the complete original artwork proportionally inside the cover with `object-fit: contain`; never allow its natural image height to expand the desktop page and never crop, stretch or distort the image.
- Preserve the deep-space background in any unused cover area. Keep the existing visitor-flight overlay, utility-row menu, dropdown overflow, navigation and interior header unchanged.
- This correction supersedes the natural-height desktop rule in the earlier responsive banner note.


## Owner-approved additive cookie preference prompt — 2026-11-19

- The owner approved merging and publishing the legal checkout and cookie-choice work in PR #296.
- Added a compact, fixed privacy-choice panel at the bottom of pages that load the shared header script. It offers optional analytics permission, rejection of optional analytics, and a customization control. Essential security and checkout storage remains enabled.
- The panel is separate from the protected Mission Control navigation, homepage cover, utility strip and footer. Their structure, labels, destinations, positioning and interaction behavior remain unchanged.
- Updated the protection workflow's pinned blob fingerprints for the additive consent UI. Future unrelated changes to the protected shared header remain subject to this design lock.


## Owner-approved intelligent local welcome — 2026-11-19

- Add one authentic country flag to the existing planted landing flag; do not display U.S. state flags or multiple flags. If the country is unavailable, retain the existing generic decorative flag.
- Add a concise local welcome bubble on the homepage. The greeting may use a confidently recognizable local sports team, culture, landmark or expression (for example, a Dallas Cowboys greeting for Dallas); do not force sports references or invent current scores/events.
- The homepage requests location context from the existing Star69AI Concierge Worker using Cloudflare's request country/city/region metadata. The Worker generates a short greeting with Workers AI and caches it by normalized location for 24 hours. No visitor IP, identity or precise address is stored for this feature.
- Preserve the four randomized 10.8-second spaceship routes and replay on every homepage refresh. The existing header/menu/footer structure, route destinations and reduced-motion behavior remain intact.
- New frontend helper: assets/visitor-welcome.js. New Worker GET route: /api/welcome on the existing star69ai-concierge Worker. This requires a separate reviewed Worker deployment after merge; GitHub Pages merge alone does not activate the endpoint.
- Header source fingerprints in .github/workflows/protect-approved-header.yml are updated in the same reviewed pull request. No merge or Worker deployment without founder approval.


## Owner-requested calm cursor control — 2026-11-19

- Add a compact, keyboard-accessible **CURSOR FX** on/off toggle at the far-right end of the shared utility row, visible across public pages without changing any navigation destinations or menu behavior.
- The visitor's choice is saved locally and persists across page navigation/reloads. OFF restores the native system cursor immediately.
- The optional decorative cursor is deliberately restrained: approximately 34–42px wide, gently eased pointer following, no rotation, pitch, yaw, banking, click flashes or other attention-grabbing movement. It remains hidden over text-entry controls.
- The effect is limited to mouse/pen devices and is not enabled when the operating system requests reduced motion. The toggle does not affect the homepage visitor-arrival animation.
- This is an explicit owner-requested additive header control and cursor comfort revision. The updated source fingerprints are pinned in the protection workflow in the same PR. Preserve all other protected header, navigation, utility links and footer behavior.


## Owner-approved header banner image sizing — 2026-11-19

- Use the existing `/assets/image_hero.webp` artwork in the shared header banner. The filename in the supplied snippet contained a typo (`image_herp.webp`); do not create or reference that nonexistent asset.
- Keep the image's native 3840:1645 proportions using width/height intrinsic attributes and a matching responsive banner aspect ratio. Render the entire image with `object-fit: contain`; do not crop, stretch, redraw or replace it.
- Preserve the existing menu, brand, status, visitor ship, utility controls, navigation and footer behavior.
- This owner-approved sizing revision supersedes earlier fixed-height/cropped banner sizing rules where they conflict.


## Owner-requested compact shared header revision — 2026-11-19

- The full-width cinematic hero/banner artwork appears on the homepage only. Interior pages must not render an empty, oversized or image-backed hero-cover header; their shared header begins directly with the compact utility/navigation bar.
- Move the canonical Star69AI wordmark image into the shared utility bar on every page, including the homepage. Do not place the logo over the homepage banner.
- Keep the existing MENU/CLOSE control, grouped navigation destinations, Partner Login, Client Console, Initiate Contact, cursor toggle, cookie controls, footer, keyboard behavior and accessibility behavior.
- The utility bar is the single shared site identity/navigation bar. Legal pages must not add a duplicate local legal-navigation header above their content.
- This owner request explicitly revises the earlier interior-page compact-cover and logo placement rules above. The homepage cinematic artwork and visitor arrival remain homepage-only.
- PR validation must update this document and the protected-header workflow fingerprints alongside the changed header source.


## Owner-approved compact header revision — 2026-11-19 (supersedes prior banner rules)

The owner clarified that the header remained too large after PR #315. This revision supersedes all earlier rules that retained the cinematic banner in the homepage header or reserved a blank cover area on interior pages.

- No cinematic/banner/cover region in the shared header on any page, including the homepage.
- Homepage hero content remains part of the homepage body and is not removed by this header change.
- Every page uses one slim, single-row navigation strip, targeted at 54px desktop height and 50px mobile height.
- The Star69AI wordmark sits at the left of the row, constrained to approximately 132px desktop / 112px mobile width and 30px / 26px image height.
- MENU sits beside the wordmark; desktop retains Partner Login, Client Console, Initiate Contact and cursor toggle in the same row. Mobile keeps the wordmark, MENU and Client Console in the row; Partner Login and Contact remain accessible in the grouped menu, while the cursor toggle is hidden on narrow screens.
- Existing grouped destinations, legal links, footer, menu open/close, Escape/outside-click behavior, active-page state and accessibility semantics are retained.
- The old header-banner visitor ship animation is retired with the banner. Other homepage hero content and page-level interactions are unchanged.
- This is an explicit owner-requested design revision. Update the protected-header fingerprints in the same reviewed change.

## Owner-approved menu overlay visibility repair — 2026-11-20

- The owner explicitly requested that the established Mission Control menu code be included in PR #328 because the menu was inconsistent across public pages and would not open visibly.
- Root cause: the compact shared utility row used `overflow:hidden`, clipping the absolutely positioned navigation panel even though the MENU button's JavaScript correctly toggled the open state.
- Correct the shared stylesheet to keep the utility row and shared header overflow visible, allowing the existing overlay panel to render outside the compact row on desktop and mobile.
- Preserve the 54px desktop / 50px mobile compact header, wordmark, MENU/CLOSE toggle, five navigation groups, all destinations, utility actions, active-page state, Escape and outside-click behavior. Do not restore the retired cover/banner region.
- The public `receptionist-intelligence.html` page was missing the shared header and had a duplicate inline header; it now uses the common header assets. Admin screens, authenticated client/partner portals and the noindex onboarding completion page retain their dedicated layouts.
- Update the protected CSS fingerprint in the workflow in this same PR. The menu correction is an owner-authorized repair to the approved implementation, not a new visual redesign.
- Browser QA and GitHub Pages verification remain required before merge/deployment.



---

## Expanded owner protection boundary — 2026-11-20

The owner has explicitly requested that the approved shared header, homepage banner, navigation/menu, visitor greeting and visitor spaceship animation must not be changed without explicit permission.

### Frozen components

- Shared header and grouped Mission Control navigation: `site-header.js` and `site-header.css`.
- Homepage banner presentation and motion: `homepage-cinematic-banner.css`.
- Visitor ship routes, flight timing, landing flag and reduced-motion behavior: `assets/visitor-arrival.js` and `assets/visitor-arrival.css`.
- Location-aware greeting, country flag handling and fallback behavior: `assets/visitor-welcome.js`.
- Homepage banner/greeting structure in `index.html`: exactly one banner, followed by exactly one greeting wrapper containing the arrival flag and welcome bubble, with the matching styles/scripts loaded.

### Permission rule

No routine cleanup, refactor, responsive adjustment, copy edit, asset replacement, dependency update or unrelated feature work may edit or override these protected elements. Do not change protected files, their selectors, markup, routes, timing, animation keyframes, responsive rules or behavior unless the owner explicitly authorizes that specific change. A general request to clean up code is not permission to alter this protected experience.

An explicitly authorized revision must be narrowly scoped, reviewed as a dedicated change, update this document and the protected source fingerprints in the same pull request, and pass the protection workflow. Do not weaken or remove the workflow as part of unrelated work.

### Automated enforcement

The workflow `.github/workflows/protect-approved-header.yml` now pins Git blob fingerprints for the six protected source files and checks the required homepage banner/greeting structure and asset references. Any source-file change fails the protection job until the owner explicitly approves the revision and the fingerprints are deliberately updated in the same reviewed change.

The CI check is a repository guardrail, not an absolute permission system: someone with permission to rewrite the workflow, bypass required checks, or push directly to the protected branch could bypass it. For stronger enforcement, configure GitHub branch rules requiring this check, require pull requests, block force pushes/deletions, and require CODEOWNERS approval for the protected files and workflow.

### Scope boundary

This lock does not freeze homepage marketing copy, pricing, other page sections, footer content, unrelated scripts/styles, backend services, or the rest of the website. Those may be cleaned up independently only when they do not change the protected experience through global selectors, inherited styles, script side effects, DOM rewrites or asset changes. Any CSS/JS cleanup must be checked for indirect effects on the protected elements.

### Audit notes — first-pass source review

- The existing lock covered only `site-header.js` and `site-header.css`; the homepage banner CSS, visitor flight code, greeting code and homepage markup were outside its fingerprint protection. This gap is now covered by the expanded workflow.
- `site-header.js` currently combines navigation rendering, cookie-consent UI, legacy header/footer cleanup, brand-logo normalization and cursor-follower loading. These are separable responsibilities and candidates for a future behavior-preserving refactor, but must not be refactored while the shared header is frozen.
- `index.html` contains substantial inline assistant, disclosure/interaction and section-reveal scripts alongside page markup. These can be extracted into page-specific files in a later cleanup, but only after regression tests and without moving or changing the protected banner/greeting block.
- The homepage loads several independent stylesheets and scripts with cache-busting query strings. A later asset inventory can identify duplicate selectors, unused styles and stale assets; do not remove files based only on filename or search results.
- The banner currently uses multiple visual-motion layers (slow background drift, scan sweep, status pulse, ship flight and flag pop). Preserve all layers and reduced-motion behavior. A future audit should verify that every decorative animation respects reduced-motion preferences consistently.
- The first-pass audit was source inspection, not a complete dead-code proof. No CSS/JS/assets were deleted, no broad refactor was performed, and no visual behavior was intentionally changed.


## Owner-requested Initiate Contact button readability correction — 2026-11-23

- The owner explicitly reported that the text inside the shared **Initiate Contact ↗** utility button was difficult to read and requested a readability fix.
- Narrowly increased contrast without changing the link destination, label, utility-row position, navigation structure or behavior: use the approved neon-green accent as a solid button background and deep navy text, strengthen label weight/size, retain a clear hover state and add a visible keyboard focus outline.
- No other header controls, page layouts, homepage banner, visitor greeting, menu behavior, routes or footer styling were intentionally changed.
- This specific owner request authorizes the button's visual contrast correction only. The protected CSS fingerprint is updated in this same reviewed change.
- Verify the button at desktop/tablet/mobile widths and keyboard focus before merge. GitHub Pages live appearance must be checked after deployment.


## Owner-approved menu addition — 2026-11-23

- Added **Insights & Guides** under **LEARN & SUPPORT**, linking to `/insights/`.
- This is a focused navigation addition; all existing destinations, group structure, and menu behavior remain unchanged.
