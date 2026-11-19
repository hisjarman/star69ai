# Star69AI sitemap and indexing audit — 2026-11-19

## Scope and method

- Repository reviewed: `hisjarman/star69ai`, source branch `main`.
- Google Search Console property: `sc-domain:star69ai.com` (verified owner access).
- Reviewed the repository sitemap and robots policy, page-level canonical/noindex metadata on identified routes, submitted-sitemap status, sitemap URL performance, and Google URL Inspection results.
- Google URL Inspection was run for all 47 URLs in the pre-correction sitemap and three additional public HTML pages identified in the repository.
- This is a point-in-time audit. Google Search Console data is settled through 2026-11-17; the latest two days are not complete.

## Executive findings

1. Google successfully downloaded the existing sitemap on 2026-11-19. Search Console reported 47 submitted URLs, zero warnings and zero errors. Re-submission alone is not the fix.
2. The repository sitemap omitted at least three public, indexable pages:
   - `/receptionist-intelligence.html`
   - `/blog/the-call-that-crossed-the-signal-nebula/`
   - `/learning-center/call-shield.html`
3. `receptionist-intelligence.html` had no canonical URL or social metadata. A canonical and indexable robots directive have been added.
4. The robots file did not explicitly exclude the Partner Center, partner admin page or Trust Lab moderation page. These routes are now listed for all three configured crawler groups.
5. `trust-lab-admin.html`, `checkout.html` and `checkout-complete.html` lacked explicit noindex directives. They now carry `noindex,nofollow,noarchive`.
6. The sitemap included legacy `changefreq` and `priority` values on Partner Terms. These fields are removed; Google does not use them as ranking/indexing signals.
7. No invented `lastmod` dates were added. Existing last-modified values were retained; new pages only receive a date where a source date was available.

## Google Search Console — sitemap

| Check | Result |
|---|---:|
| Sitemap URL | `https://star69ai.com/sitemap.xml` |
| Last submitted | 2026-11-19 |
| Last downloaded | 2026-11-19 |
| URLs submitted before corrections | 47 |
| Warnings | 0 |
| Errors | 0 |

Google's deprecated sitemap `indexed` count is not used. The Search Console API no longer provides a reliable indexed-URL count in that field.

## Google Search Console — URL inspection

Inspection results for the 47 original sitemap URLs:

| Google URL Inspection result | URLs |
|---|---:|
| Submitted and indexed | 34 |
| URL is unknown to Google | 10 |
| Discovered — currently not indexed | 2 |
| Inspection timed out after retry | 1 |
| **Total** | **47** |

The two discovered-but-not-indexed URLs were `/capabilities.html` and `/partner-terms.html`.

The ten URLs reported as unknown to Google were:
- `/industries/dental-ai-receptionist/`
- `/industries/legal-ai-receptionist/`
- `/industries/hvac-ai-receptionist/`
- `/faq.html`
- `/blog/episode-001-the-roof-the-ring/`
- `/trust-lab-dashboard.html`
- `/sms-terms.html`
- `/learning-center/receptionist-architect-curriculum.html`
- `/research/managed-ai-receptionists.html`
- `/insights/ai-receptionist-for-roofing-companies.html`

The remaining timeout was `/privacy.html`; the retry did not return a Google verdict. A timeout is not an indexing failure.

Three additional public pages were inspected:
- `/receptionist-intelligence.html` — URL unknown to Google.
- `/blog/the-call-that-crossed-the-signal-nebula/` — URL unknown to Google.
- `/learning-center/call-shield.html` — inspection timed out.

A result of “URL is unknown to Google” means Google returned no known URL record; it is not the same as “Crawled — currently not indexed.” A sitemap submission also does not guarantee that Google will crawl or index every listed URL.

All 34 URLs returning “Submitted and indexed” reported a Google-selected canonical matching the page's declared canonical.

## Search performance

For 2026-10-20 through 2026-11-16 (latest settled 28-day window):
- Clicks: 10
- Impressions: 17
- CTR: 58.82%
- Average position: 1.47

The sitemap performance join found that one sitemap URL received impressions in this period. This is a lower bound on URLs with search visibility, not a count of all indexed pages. The homepage accounted for 15 impressions and 10 clicks in the sitemap URL performance response.

The property is very new in Search Console: the prior comparison window had no recorded clicks or impressions, and first activity appeared during November. The sample is too small for reliable trend conclusions.

## Robots and indexability

- The public robots policy already allowed general public crawling and referenced the canonical sitemap.
- Existing client/admin directories were disallowed and their entry pages already carried noindex metadata.
- The Partner Center and two admin HTML routes were missing explicit crawler exclusions.
- Trust Lab moderation, checkout and checkout-complete pages were missing explicit noindex directives.
- No private route was added to the sitemap.

Robots.txt is a crawler instruction, not an access-control mechanism. Authentication and server-side authorization must continue to protect private data.

## Corrections prepared on this branch

- Added the three missing public pages to `sitemap.xml`, bringing it to 50 URLs.
- Added a canonical, Open Graph metadata and an explicit indexable robots directive to `receptionist-intelligence.html`.
- Added explicit crawler exclusions for `/partner-portal/`, `/partners-admin.html` and `/trust-lab-admin.html` for the default, OAI Search and Perplexity crawler groups.
- Added noindex directives to Trust Lab moderation and checkout/status pages.
- Removed deprecated sitemap priority/change-frequency fields.
- Preserved existing lastmod values and avoided fabricating dates.

## Remaining actions after merge/deployment

1. Re-run the repository-wide SEO/sitemap integrity check against the latest main branch, ensuring every public indexable HTML page appears in the sitemap and no private/noindex page appears there.
2. Once the corrections are published, submit the sitemap only if Search Console has not automatically re-fetched it; verify the new 50-URL count and zero parse errors.
3. Add internal links to pages still reported as unknown or discovered-but-not-indexed, prioritizing the Dental, Legal and HVAC industry pages, FAQ, Receptionist Architect curriculum, Call Shield, Research and Roofing guide.
4. Reinspect `capabilities.html`, `partner-terms.html`, `receptionist-intelligence.html` and the Signal Nebula article after Google has had time to recrawl.
5. Review the live Google-selected canonicals and coverage for any URL that remains excluded. Do not request indexing repeatedly before fixing discoverability and internal-link signals.

## Validation limits

- The sitemap and URL Inspection results above are from live Search Console data.
- The source audit identified at least three omitted public pages; a full recursive inventory of every HTML file and a live HTTP/redirect crawl of every route remain a release check.
- This branch has not been merged or deployed. Google cannot read these source changes until GitHub Pages publishes them.
- No sitemap resubmission or manual indexing request was issued during this audit.
