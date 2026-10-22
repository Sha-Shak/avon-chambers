# Production indexing inspection

Verified in the Avon Chambers domain property in Google Search Console through Dia on 22 October 2026 (Asia/Dhaka). HTTP response evidence is in `http-results.csv` and `http-results.json`. Live-test results are in `search-console-results.json`. `google-rendered-content.json` records the actual headings, main-content excerpts and anchor destinations read from Google's tested-page HTML editor. Editor excerpts are not a full resource or JavaScript-console audit.

| Page | HTTP | Canonical | Live crawl / fetch / indexing permission | Google index status at inspection |
| --- | --- | --- | --- | --- |
| `/practice-areas` | 200 | Self | Yes / Successful / Yes | Indexed |
| `/insights` | 200 | Self | Yes / Successful / Yes | Discovered, currently not indexed |
| `/about` | 200 | Self | Yes / Successful / Yes | Discovered, currently not indexed |
| `/case-studies` | 200 | Self | Yes / Successful / Yes | URL unknown to Google |
| `/news-events/high-court-rejects-habeas-corpus-shortcut-in-child-custody-dispute-family-court-appeal-cannot-be` | 200 | Self | Yes / Successful / Yes | URL unknown to Google |
| `/news-events/high-court-stays-unfair-suspension-of-college-officer` | 200 | Self | Yes / Successful / Yes | URL unknown to Google |

All six live tests passed. Google rendered the expected main content and actual links. In particular, the service directory contains all 15 completed services, the article archive contains its published article cards, and both affected news pages contain their article text. No accidental robots restriction, rendering failure, or incorrect canonical was found on these six pages. A live test does not establish inclusion in Google's index; the five not-indexed states above remain unresolved Google inclusion outcomes.

## Intellectual-property URL

`/practice-areas/intellectual-property-law` returns **308** with `Location: /practice-areas/corporate-commercial`. The redirect response is plain text, with no HTML robots tag, HTML canonical or `X-Robots-Tag`. It is a legacy consolidated URL, not a completed standalone service page. Its completed destination returns **200**, `index, follow`, no `X-Robots-Tag`, and the self canonical `https://www.avonchambers.com/practice-areas/corporate-commercial`. The destination includes Intellectual Property Protection & Registration and Intellectual Property Licensing & Enforcement. Keep this intentional redirect.

## Intentional exclusions

`/careers` and `/pro-bono` currently have no published open roles/posts and retain `noindex, follow`. Studio retains HTML and HTTP `noindex, nofollow`. None was opened to indexing.

## Internal discovery

The production crawl in `../from-home/` began only with the homepage and followed server-rendered anchors, without using sitemap entries as discovery seeds. It reached all 30 service URLs (15 English and 15 Bangla): English in one click and Bangla in two. It found one other sitemap orphan, `/life-at-avon`. The code now adds a contextual link from About to that completed gallery. The updated production-build graph in `../build/` reaches all 63 sitemap URLs with no missing pages or audit errors. The deployed crawl predates this new link; its orphan entry is retained as the before-change evidence.

## Follow-up

A daily 9:00 AM Asia/Dhaka chat automation checks for meaningful changes. Public HTTP eligibility and actual Search Console index status must remain distinct. Keep notifications quiet when unchanged. No bulk indexing submission or artificial last-modified dates were added by this inspection.
