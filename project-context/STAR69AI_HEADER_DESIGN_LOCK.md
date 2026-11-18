# Star69AI Approved Header & Navigation — Design Lock

**Status: FROZEN — owner-approved grouped navigation revision on 2026-11-18.**

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

## Approved source baseline

- `site-header.js` Git blob: `6664131e13969a38938c84657db4ec4b9a4df636`
- `site-header.css` Git blob: `34a920b0f858198d33efc8a2174f21008cd2abc9`
- Original cinematic restoration: PR #244
- Revised homepage-only hero and compact interior menu: owner-authorized change, 2026-11-17
- Original approved design reference: PR #215
- Footer refinements retained: PR #243

This lock protects the approved source implementation. It cannot guarantee that third-party browser extensions, cached assets, future browser behavior, or unrelated page-specific CSS will never affect how a visitor renders the page; visual regression checks remain useful after substantial site-wide styling work.
