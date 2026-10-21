# Developer SEO audit review

Reviewed 21 October 2026 (Asia/Dhaka) against the supplied 14-task brief. Existing working fixes were retained. The changes are ready for deployment; local verification is distinguished from checks of the currently deployed site.

## Changes and validation

| Audit task | Result |
|---|---|
| 01. Route indexability | Added a repeatable production HTTP crawler and a production-build HTML validator. CSV inventories record URL, HTTP status, title, canonical, robots, H1, internal inlinks, sitemap inclusion and issues. Build validation covers 65 public routes and all 63 intended sitemap URLs. JavaScript-rendered checks cover six representative templates on both mobile and desktop, rather than claiming a full JavaScript crawl of every route. |
| 02. URL normalization | Added explicit permanent Netlify redirects to the preferred HTTPS/www domain, explicit no-trailing-slash policy and public-page case normalization. Assets, APIs and Studio paths retain their case. Tracking parameters keep working for attribution and canonicalize to the clean page. Local uppercase/trailing-slash checks return 308 to the clean path; a nonexistent page returns a genuine 404. Edge-level domain/HTTPS behaviour must be checked after deployment. |
| 03. Robots and sitemap | Preserved the existing API/Studio restrictions. Live robots and sitemap endpoints are accessible. The built sitemap is valid XML with 63 canonical URLs; all appear in the built page inventory. Added explicit 60-second sitemap revalidation and real optional revision dates for news and pro bono content. Unknown static content revision dates are omitted rather than fabricated from deployment time. |
| 04. Freshness and unfinished copy | Removed the shared loading boundary that streamed an empty main area and footer ahead of the content. Important text now arrives before the footer. Replaced JavaScript-dependent hidden entrance animations with visible server content and optional CSS motion. Netlify now runs `npm run build`, including a post-build gate that rejects unfinished public text, malformed JSON-LD, canonical conflicts, missing H1s, sitemap inconsistencies and orphan landing pages. |
| 05. Organization | Retained the stable `/#organization` LegalService record, actual logo, configured social links, shared address/telephone and office hours. Added a stable WebSite entity linked to that organization. No coordinates, reviews or star ratings were invented. |
| 06. Lawyer entities | Added stable `/lawyers/{slug}#person` IDs and reused them in ProfilePage, article-author and reviewer relationships. Publisher references use the same organization ID. Education and professional admissions retain the published source wording; removed institution guesses based on splitting education strings at commas. |
| 07. Page schema | Added ProfilePage and ContactPage records and practice WebPage/Service relationships, retaining existing AboutPage, article, news and breadcrumb schema. News/pro bono revision dates feed metadata and structured data. Undated event announcements no longer invent an event date from publication time; missing venue/attendance details are omitted. JSON-LD syntax and entity relationships are validated locally. Google Rich Results testing remains a post-deployment check. |
| 08. Measurements | Completed 12 production Lighthouse baseline runs and 12 final local production-build runs: homepage, directory, corporate service, lawyer, long article and news/case update, each mobile and desktop. See performance.md. Final local performance is 92–100, accessibility 100 and CLS zero. Mobile LCP remains above the 2.5-second target. These are lab measurements, not field INP or 75th-percentile Core Web Vitals. |
| 09. Images | Retained local WebP practice photography, responsive sizes/srcset, reserved image geometry and below-fold lazy loading. Preserved critical hero/banner image preloads, reduced their quality setting to 60, and lowered secondary practice-card image priority/quality based on measured delivery savings. Both languages reuse the same image files. |
| 10. Frontend overhead | Removed per-element animation hydration, state, timers and IntersectionObservers. Fonts already use next/font self-hosting with swap. CSS was already inlined and analytics already deferred. Production reports include transferred JavaScript and unused-code diagnostics. No libraries were removed merely to satisfy a checklist; framework JavaScript remains necessary. |
| 11. Connected content | Added visible, crawlable breadcrumbs alongside their JSON-LD. Preserved existing practice/lawyer/article/case relationships. Added explicit CMS practice-area relationships for news updates and reciprocal rendering on news/practice pages. Existing news needs editorial tagging before those new related-news sections populate; no classifications were guessed from headlines. |
| 12. Business identity | Centralized office address, localized address and opening-hours source data, deriving the visible hours and directions destination from it. Added a selectable-address Google Maps directions link to Contact. Website phone/email/WhatsApp actions remain intact. Google Business Profile and external directory reconciliation require account-level work. |
| 13. Languages | Retained all 16 genuine Bangla routes, self canonicals, reciprocal language references and sitemap entries. Practice navigation in the header/footer now preserves Bangla, alongside breadcrumbs, cards and related-practice links. English-only destinations retain their existing routes. No IP-based language redirects were introduced. |
| 14. Accessibility | Added navigation labels, current-page states, focus indicators and larger touch targets. Dropdowns use ordinary disclosure semantics; keyboard Enter, Tab and Escape were tested, including focus return. Fixed measured footer and WhatsApp contrast failures. Local automated accessibility is 100 across all six templates/devices; this is not a claim of complete WCAG compliance. |

## Evidence

- `build/inventory.csv` and `build/summary.json`: current production-build validation.
- `production/inventory.csv`, `production/summary.json`, `production/url-variants.json`: live HTTP crawl and variant probes, before deploying this change.
- `production/crawler-comparison.json`: ordinary versus Googlebot-user-agent HTML for Foreign Investment and Corporate Restructuring. This is a user-agent consistency check, not authenticated Google URL Inspection.
- `lighthouse-production/summary.json` and `lighthouse-final/summary.json`: production baseline and final local lab verification. Raw Lighthouse reports are retained locally and ignored by Git because of their size.
- `performance.md`: measurements, environment differences and remaining LCP target.
- `bangla-navigation.png`: browser preview of the translated directory and preserved language navigation.
- `npm run test:seo`: 15 passing tests for translations, entities, URL normalization, markup handling, no invented event data and deployment-gate behaviour.
- `npm run build`: successful build, TypeScript and post-build SEO gate; `npm run lint`: successful.

## Live crawl finding

The final compressed HTTP/1.1 crawl reached all 63 sitemap URL entries. It verified 62 of them; `/news-events` did not finish downloading within the crawler's 30-second limit and is explicitly marked `FETCH_FAILED`, not treated as a confirmed indexing failure. The affected source route passes the local build audit. This listing needs a fresh production check after deployment. The two updated practice pages returned HTTP 200 and identical visible text for ordinary and Googlebot user agents. Query-string canonicalization, genuine 404s and existing permanent redirects were also checked. Uppercase public URLs currently return 404 on the deployed version; the new local normalization returns 308 and needs deployment.

## Remaining external checks

After deployment, run `npm run audit:seo:live -- --strict` and rerun the production Lighthouse measurements. Confirm Netlify's primary domain is `www.avonchambers.com`, HTTPS is enabled and the direct domain redirects behave as configured; platform TLS redirects may run before application rules. The old HTTP/non-www variants should redirect and are not separate pages that should be indexed.

Search Console was not accessed and no indexing submissions were made in this task. Inspect the canonical homepage, the following representative pages and their rendered HTML; then verify sitemap submission/last read and request indexing only for valid canonical URLs that need it:

- `/`
- `/practice-areas/corporate-commercial`
- `/practice-areas/foreign-investment-facilitation`
- `/practice-areas/corporate-restructuring-project-documentation`
- `/lawyers/asif-bin-anwar`
- `/lawyers/maeesha-dhusharima`
- `/lawyers/nazifa-sarwar`
- `/insights/amendments-to-the-cyber-protection-act-2026`
- `/insights/legal-problems-businesses-dhaka-company-lawyer`
- `/news-events/high-court-stays-unfair-suspension-of-college-officer`

The public PageSpeed Insights API returned 429 RESOURCE_EXHAUSTED. Field INP and p75 Core Web Vitals therefore remain unverified; use Search Console or an authorized PSI/CrUX request. Local scores are not a promise of identical production performance or indexing. Verify the existing Google Business Profile separately and use the new related-practice controls in Studio to tag news updates accurately.
