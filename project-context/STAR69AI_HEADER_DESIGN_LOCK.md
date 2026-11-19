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
