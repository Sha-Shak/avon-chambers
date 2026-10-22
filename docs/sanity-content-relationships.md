# Tagging services and lawyers in Sanity

After the updated site is deployed, open `/studio` and choose any publishable document type: **Article**, **News & Event**, **Case Study**, **Pro Bono post**, or **Job posting**.

1. Open **Related practice areas** and select the existing services directly relevant to the document. For Case Studies this is under **Matter details**. The selections use stable service IDs, so existing tags and URLs continue to work.
2. Under **Responsible lawyers**, select the lawyer or lawyers actually responsible for the matter or update. This is separate from the article's Author and Reviewed by fields; it does not create an author, review credit, or responsibility automatically.
3. Publish the document. Allow the website's 60-second content revalidation to refresh the relevant pages.

The document displays a reusable **Related legal services** section with descriptive service links, a service-specific WhatsApp enquiry link, and links to any selected lawyer profiles. Existing article bylines remain in place. Documents with no selected service or lawyer do not receive invented relationships. Existing titles, H1s and descriptions are preserved.

Matching service pages in English and Bangla display related articles, case studies, news/events, pro bono work and open job postings as available. Non-indexable pro bono/news items and closed or non-indexable job postings are excluded from these placements. Existing service lawyer profiles remain in place. Add specific tags to older documents to enable these new placements; saving the new schema does not populate editorial selections in existing documents.

All five types share `src/sanity/schemaTypes/objects/legalRelationships.ts`. Reuse these two field definitions when adding a new publishable document type, carry the fields through its content projection/type, and render `RelatedLegalServices` in its public template.

## Navigation checks

`npm run audit:seo:from-home` crawls the deployed site from Home through actual anchors and reports missing sitemap pages, orphan pages and service click depth. `npm run build` also validates the generated HTML graph before deployment. Article archive pagination has real `/insights/page/2` destinations, server-rendered content, self canonicals, sitemap entries and invalid-page 404s; these later pages appear as the archive grows beyond nine articles. Sorting remains a client preference for the current archive view; following a page link opens the default newest-first view.

Validation for this change: ESLint, TypeScript, 18 SEO/navigation tests, a production Webpack build and its HTML audit. Local Turbopack's CSS worker encountered an OS port-permission error; the supported Webpack build completed. No deployment bundler setting was changed.
