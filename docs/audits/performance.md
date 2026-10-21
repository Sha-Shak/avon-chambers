# Performance and accessibility measurements

Measured on 21 October 2026. Lighthouse 13.5.0, Chrome headless, default simulated mobile throttling and desktop preset. These are single lab runs, not 75th-percentile field measurements. INP was not measured; TBT is listed separately and is not a replacement for INP.

The baseline is the deployed site. The final verification is the local production build. They use different server/network environments, so their performance scores and load times are not an apples-to-apples production improvement claim. Local checks demonstrate rendering stability and catch accessibility regressions; rerun production after deployment.

| Template | Device | Live baseline performance | Local verification performance | Local accessibility | Local LCP (s) | Local CLS | Local TBT (ms) |
|---|---|---:|---:|---:|---:|---:|---:|
| home | mobile | 90 | 93 | 100 | 3.22 | 0.000 | 37.5 |
| home | desktop | 76 | 100 | 100 | 0.70 | 0.000 | 0.0 |
| practices | mobile | 87 | 92 | 100 | 3.32 | 0.000 | 15.5 |
| practices | desktop | 97 | 100 | 100 | 0.70 | 0.000 | 0.0 |
| corporate | mobile | 96 | 94 | 100 | 3.09 | 0.000 | 16.5 |
| corporate | desktop | 92 | 100 | 100 | 0.69 | 0.000 | 0.0 |
| lawyer | mobile | 91 | 93 | 100 | 3.17 | 0.000 | 14.5 |
| lawyer | desktop | 99 | 100 | 100 | 0.69 | 0.000 | 0.0 |
| article | mobile | 70 | 94 | 100 | 3.09 | 0.000 | 16.0 |
| article | desktop | 99 | 100 | 100 | 0.68 | 0.000 | 0.0 |
| news | mobile | 94 | 93 | 100 | 3.17 | 0.000 | 18.5 |
| news | desktop | 96 | 100 | 100 | 0.69 | 0.000 | 0.0 |

All final local scores are at least 90. CLS is zero and automated accessibility scores are 100 for every tested template/device. This does not establish full WCAG compliance. Mobile LCP remains above the 2.5-second target in the simulated runs, so that target is still open. Desktop LCP is below one second.

The production baseline captured a homepage desktop CLS of 0.577 and article mobile CLS of 0.897. Their HTML streamed an empty main region followed by the footer before the main content arrived. Removing the shared loading boundary eliminated those shifts in local verification. The final build also keeps decorative entrance content visible without JavaScript, removes per-element hydration/observers, reserves larger control targets, fixes measured contrast failures, preserves early LCP image preloads and lowers secondary image priority/quality.

The public PageSpeed Insights API returned HTTP 429 RESOURCE_EXHAUSTED. No field INP or CrUX conclusions can be drawn from this run. Use Search Console Core Web Vitals or an authorized PSI/CrUX request after deployment.

Full Lighthouse JSON reports are available locally in the corresponding `lighthouse-*` folders and are ignored by Git because of their size. Compact summaries are versioned.
