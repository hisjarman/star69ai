# Star69AI Design System and Phase 1 Audit

Status: Phase 1 in progress. This document is the working source of truth for visual consistency; it does not claim that every page has been migrated.

## Canonical brand system

- Background: deep space navy `#030918`; raised surfaces `#0B1730` and `#10213D`.
- Electric purple: `#F461FE`.
- Electric blue: `#43B4FE`.
- Neon green: `#34FD78`.
- Primary text on dark surfaces: `#F4F8FF`; muted copy should remain readable and meet WCAG contrast.
- Typography roles: Manrope for body/interface copy; Michroma for major display headings (regular weight); IBM Plex Mono for technical labels and data.
- Use consistent 8px-based spacing, 8px control radius, 16px card radius, and a shared 1160px content width unless a page has a documented reason to differ.
- Keep the cinematic hero/banner treatment on the homepage only. Interior pages use a compact shared header; client Mission Control keeps its own product-specific cockpit shell.

## Current main-branch audit baseline (2026-11-18)

- The repository contains 35 CSS files.
- The homepage `index.html` loads 18 external stylesheets and contains 3 inline style blocks. Several of these stylesheets overlap in purpose (homepage polish, refresh, readability, experience, conversion, and design refresh).
- The homepage imports DM Mono, DM Sans, IBM Plex Mono, Manrope, and Michroma. Michroma/Manrope/IBM Plex Mono are the target roles; DM Sans and DM Mono are legacy imports still referenced by older CSS and must not be removed until those references are migrated.
- The inspected shared `styles.css` contains 127 `!important` declarations; `readability.css` contains 77; `experience.css` 76; `site-header.css` 41; `homepage-refresh.css` 19; and `design-refresh.css` 11. These are per-file counts, not a repository-wide total.
- The base stylesheet still contains legacy teal/mint references and a white body canvas, while newer homepage and multi-page refresh layers introduce the deep-space palette. Some of this contrast is intentional for light content sections, but hard-coded accent colors compete with the canonical brand palette.
- The handoff design lock identifies `site-header.js` and `site-header.css` as protected shared navigation files. Phase 1 will preserve them unless a separately reviewed decision explicitly unlocks them.
- Client/admin/partner portal styles must be audited separately from public marketing pages; a marketing token migration must not flatten or break the authenticated product UI.

## Migration rules

1. Prefer design tokens over repeated literal colors, font declarations, spacing values, shadows, and radii.
2. Do not delete a stylesheet merely because its filename sounds redundant. First map its selectors, page consumers, and unique behavior.
3. Avoid adding more blanket `!important` overrides. Remove an override only after verifying the winning rule and page behavior.
4. Preserve meaningful light/dark section contrast, accessible focus states, reduced-motion behavior, mobile navigation, and all existing interactions.
5. Keep homepage-only hero artwork out of interior pages.
6. Do not change business logic, authentication, billing, Worker/D1, Retell, or customer data during the visual consolidation.
7. Validate representative desktop and mobile pages before merging: homepage, pricing, industries, learning center, contact/discovery, client Mission Control, partner portal, and admin.

## Phase 1 implementation log

- Added canonical brand and typography role tokens to `styles.css` while preserving existing semantic aliases and light-surface text tokens. The typography token roles now follow the existing Star69AI signature standard: Michroma display, Manrope interface/body, IBM Plex Mono technical.
- Aligned the newer multi-page design-refresh accent variables with the canonical electric purple/blue/neon-green palette.
- Next: migrate public marketing components to the tokens, remove duplicated homepage cascade layers safely, then perform responsive and accessibility checks.
