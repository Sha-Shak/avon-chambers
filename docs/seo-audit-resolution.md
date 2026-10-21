# SEO audit implementation

The October 21 audit was checked against the current source and a production build. Changes apply across all current templates, rather than a phased subset. Deployment is still required.

| Audit finding | Resolution |
| --- | --- |
| Homepage title lacks service and location | Search title now identifies a law firm in Dhaka, Bangladesh. The social title retains the firm's requested slogan. |
| Homepage H1 is only a slogan | H1 now identifies the firm and location. The slogan remains visible immediately below it. |
| No concise firm description | Added a plain-language overview using the actual lawyer count, practice count, location and existing service scopes. No founding year was invented. |
| Contradictory practice-area heading | Replaced with a factual practice-area count. |
| Generic practice metadata | Added unique service-specific titles and descriptions for all 15 practice areas, including Dhaka. |
| Generic lawyer directory and profile metadata | Improved directory title, H1 and description. All 12 profiles include a canonical practice area in their title and identify the firm in Dhaka without claiming every lawyer is personally based there. |
| Repeated meta keywords | Removed public meta keywords tags everywhere. Article keywords remain available for structured data only. |
| FAQ answers missing in initial HTML | Replaced the practice FAQ widget with native details/summary. Every answer is present in the initial HTML and matches FAQPage data. No JavaScript is required to open an answer. |
| No process and document guidance | Added consultation/preparation guidance to all practice pages, with service-specific document suggestions. These are preparation suggestions, not filing requirements or guaranteed timelines. Per-practice editorial overrides are supported. |
| Weak sibling-service navigation | Added related practice links. Existing lawyer, article and case-study links remain available. |
| Repeated homepage content | Scrolling strips render each practice card and testimonial once. Auto-scroll reverses at its endpoints, with drag, wheel, hover and keyboard-focus handling. |
| Hotlinked practice photos | Stored all 15 existing practice photos locally as WebP, preserving the honest descriptions of what they depict. Practice social previews use the branded social card instead of stock images. |
| Portrait alt text | Portraits identify the lawyer, role and firm; no incorrect personal location is added for remotely based lawyers. |
| Phone display/link inconsistency | Standardized the office display to +880 1841-010059. Normalized existing Bangladesh mobile formats in profile/consultation links and Person schema. |
| Inconsistent names and practice labels | Normalized Asif Bin Anwar's name casing. Profile practice tags use canonical practice-page titles. Numeric practice counts are derived from unique linked areas. Nicknames and legal-name spellings were preserved. |
| Opening hours missing in schema | Added OpeningHoursSpecification from the existing Saturday–Thursday, 09:30–18:30 schedule. Hours were already visible on Contact and in the footer. |
| Missing credentials in Person schema | Professional admissions now populate EducationalOccupationalCredential records from existing lawyer data. |
| Verified external profile links | Added optional profileLinks entries to Lawyer data. The same verified links appear visibly on the profile and in Person.sameAs; no directory URLs are fabricated. |
| Article author and reviewer support | Existing named bylines retained. Added author bios, exact-name profile links in article text and editorial warnings in Sanity when author/reviewer selection is missing. |
| Firm credited as a person | Organization-authored articles now use Organization schema rather than incorrectly identifying Avon Chambers as a Person. |
| Incorrect review-date implication | Editorial updatedAt is labelled Updated. A separate reviewedAt field records an actual legal review and requires a reviewer. A verified reviewer/date can also be supplied for practice pages. |
| Article typo | Corrected the exact phrase “an continuing responsibility” during article rendering. The renderer preserves existing rich-text formatting and links. |
| Bangla service coverage | Added Bangla summaries and FAQs for family, criminal, property and civil services, translated from existing service scopes. Added language switches, reciprocal en-BD/bn-BD hreflang, self-canonicals and sitemap alternates. These summaries do not introduce new statutory advice. |
| Social accessibility | Social icons already have accessible labels. Corrected the contact definition-list nesting and removed focusable cloned carousel content. |
| AI crawler access | Existing wildcard robots rule permits public pages for AI crawlers and search engines. Admin/API exclusions remain intentional. |
| Existing schema/related content | LegalService, Service, BreadcrumbList, article schema, related content and sitemap/canonical handling were already implemented; retained and checked. |

## Inputs that must be real

These are not code bugs and should not be filled with guessed claims:

- The published articles `legal-problems-businesses-dhaka-company-lawyer` and `commercial-property-in-bangladesh-law` currently credit the organization. Their actual human authors must be identified before assigning a Person byline.
- Legal reviewers and actual review dates must be supplied. An update date does not prove a legal review occurred.
- Current statutes, amendments, procedural requirements and timelines need a lawyer's verification. The audit itself asks for that verification. Do not copy its example statutes into advice without checking that they remain current.
- Existing author/practice support can display verified sources. Sanity already has article reference links. Do not invent citations or add laws merely as keywords.
- Verified LinkedIn and directory links, languages, founding date and new personal credentials need factual input. Existing biographies, admissions, publications and notable matters are retained.
- Granular service landing pages need substantive, service-specific approved material. The service lists remain on their relevant practice pages; do not generate 25–40 near-duplicate pages from the same short paragraphs solely to create indexed URLs.
- Google Business Profile, external directories, backlinks, posting schedules, Search Console reporting and advertising-rule decisions require account actions or the firm's own decisions. No changes to those services are claimed here.
- The Bangla summaries and any subsequent legal edits should be checked by the firm before publishing as its professional advice.

## Maintaining the new fields

- `src/config/practice-guidance.ts`: shared process and preparation suggestions.
- `src/data/practice-areas.json`: optional `process`, `documents`, `reviewedBySlug`, `reviewedAt` override the default guidance and enable actual review attribution.
- `src/data/lawyers.json`: optional `profileLinks: [{ title, url }]` enables visible professional links and schema. Use only verified URLs.
- Sanity Articles: select the actual Author, Reviewed by and Legal review date. Existing References and sources accept legislation, judgments and official guidance.
- `src/data/practice-localizations.ts`: Bangla summaries and FAQs. Add language links only when corresponding translated content exists.

## Verification

- Production build, TypeScript and repository lint passed.
- `npm run test:seo` checks phone normalization, metadata coverage, canonical practice labels, rich-text link preservation, localization mapping and honest schema attribution.
- Production HTML checked for all 15 practice pages, all 12 lawyer profiles, the homepage and four Bangla pages.
- Verified the FAQ answer text is in HTML, FAQPage answers match the source, no public meta keywords remain, each homepage practice card occurs once, and language links/sitemap entries are reciprocal.

## Complete Bangla practice pages

The practice directory and all 15 service detail pages now have Bangla versions under `/bn/practice-areas`. The previous four summaries are replaced by full page content. The translations are stored in `src/data/bn/` and matched to English services through stable numeric IDs. They were written directly without uploading the source text to a translation service.

The Bangla pages retain every source overview paragraph, service and FAQ, and include translated preparation guidance, contact information and team labels. Related article and case study previews continue in English and are labelled accordingly; other pages remain outside the translation scope. Each practice page links to its equivalent language version, declares a self canonical and reciprocal language alternatives, and appears in the sitemap. The main Bangla content carries `lang="bn"`; shared English navigation retains its existing language.

Run `npm run test:seo` to check that all source services and FAQs have matching Bangla entries, that route and image identifiers are preserved and that preparation copy has no missing translations. Future English copy changes also need an editorial update to the matching Bangla entry.
