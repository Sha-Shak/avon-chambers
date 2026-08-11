# Avon Chambers

Next.js 16 (App Router) rebuild of the Avon Chambers marketing site —
migrated from a Lovable/TanStack Start export, cleaned up, and made
data-driven. Insights (blog) and Careers content is managed through a
Sanity Studio built into the app; everything else (attorneys, practice
areas, case studies, firm details) is plain JSON/config files in the repo.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in the values, see below
npm run dev                  # http://localhost:3000
```

Before deploying: run `npm run build` once yourself to confirm it compiles
in your environment. `next/font` downloads Playfair Display and Inter from
Google Fonts at build time, so this step needs normal internet access
(this only matters for the build step — the deployed site self-hosts the
fonts, with no runtime dependency on Google's CDN).

## Environment variables

See `.env.example` for the full list with comments. In short:

| Variable | What it's for | Where to get it |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Your real domain, used to build every absolute URL (metadata, JSON-LD, sitemap, robots.txt, llms.txt) | Your own domain |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Enables Google Analytics 4 | GA4 property → Data Streams |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Connects the site (and the `/studio` admin UI) to your Sanity project | sanity.io/manage |
| `NEXT_PUBLIC_SANITY_DATASET` | Almost always `production` | sanity.io/manage |
| `SANITY_API_WRITE_TOKEN` | Only needed once, to run the migration script below. Never expose this client-side. | sanity.io/manage → API → Tokens |

## Setting up the content management system (Sanity)

Insights and Careers are edited through a real admin screen at `/studio` —
built into this app, no separate deployment. Setup is one-time:

1. **Create a Sanity account and project.** Go to [sanity.io](https://www.sanity.io),
   sign up (free), and create a new project. When it asks about a dataset,
   accept the default name `production`.
2. **Get your Project ID.** Find it at sanity.io/manage → your project →
   Settings, or in the URL after you create the project. Put it in
   `.env.local` as `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. **Set the dataset name.** `NEXT_PUBLIC_SANITY_DATASET=production` in
   `.env.local`, matching whatever you named it in step 1.
4. **Add the same two values to your hosting provider's environment
   variables** (Vercel, Netlify, etc.) — not just `.env.local`, which only
   works on your machine.
5. **Run the app** (`npm run dev`) and open `http://localhost:3000/studio`.
   Log in with the same account you used to create the Sanity project.
   You should see two sections in the sidebar: Insights and Careers.
6. **Migrate the 4 starter posts and 2 job postings** so the Studio isn't
   empty on day one:
   - Create a write-capable API token: sanity.io/manage → your project →
     API → Tokens → Add API token → give it "Editor" permissions.
   - Run: `SANITY_API_WRITE_TOKEN=sk... npm run migrate:sanity`
   - This is safe to re-run; it overwrites rather than duplicating.
7. **Invite your staff.** In sanity.io/manage → your project → Members,
   invite them by email. They log into `/studio` with their own Sanity
   account — no separate password system to manage. Give them the
   "Editor" role (can create/edit/publish) rather than "Administrator"
   (can also change project settings and billing) unless they need that.

Once set up, creating a blog post or job listing is: go to `/studio`, click
the relevant section, fill in the form, hit Publish. It appears on the live
site within about a minute (content is cached for 60 seconds, so changes
don't need a redeploy).

## Editing content

| To change... | Edit... |
| --- | --- |
| A blog post (Insights) | `/studio` in your browser — not a file |
| A job posting (Careers) | `/studio` in your browser — not a file |
| An attorney's bio, photo, stats, etc. | `src/data/attorneys.json` |
| A practice area | `src/data/practice-areas.json` |
| A case study | `src/data/case-studies.json` |
| Firm name, address, phone, stats | `src/config/site.config.ts` |
| Logo, hero image, OG image | `src/config/media.config.ts` |

Attorneys, practice areas, and case studies stayed as JSON files rather
than moving into Sanity, since you specifically asked for the attorney
roster to be a JSON file you can edit directly — and since these change far
less often than blog posts or job listings, and are cross-referenced with
each other by slug (an attorney's `practiceAreaSlugs` must match a real
slug in `practice-areas.json`).

`src/content/` holds the *original* markdown seed files — the app doesn't
read them anymore, they exist only as input for the one-time migration
script. Safe to delete once you've confirmed the migrated content in
`/studio` looks right.

## Before you launch

A few things were deliberately left as clearly-marked placeholders rather
than invented:

- **Legal pages** (`/privacy-policy`, `/terms-of-engagement`,
  `/attorney-advertising`, `/accessibility`) are real, working pages but
  contain a placeholder notice instead of actual policy text, and are set
  to `noindex` until you replace it. These need the firm's own counsel, not
  generated boilerplate — see each `page.tsx` for exactly where the real
  copy goes.
- **The contact form** validates and logs submissions server-side
  (`src/app/api/contact/route.ts`) but doesn't send them anywhere yet —
  wire up a real provider (Resend, Postmark, SES, SMTP) before launch, or
  submissions only reach your server logs. There's a honeypot field for
  basic spam filtering already in place; swap in something like Cloudflare
  Turnstile there if you want stronger protection.
- **Social links** in the footer (LinkedIn, X) point to `#` — add the real
  profile URLs in `src/components/layout/site-footer.tsx`.
- **OG image**: the default social-share image is generated on the fly from
  brand colors and the firm name (`src/app/opengraph-image.tsx`) rather
  than a static photo, since none was supplied.

## Architecture note: why `/studio` is separate

The app is split into a `(site)` route group (everything with the
marketing site's header/footer/design system) and `/studio` (Sanity's admin
UI, outside that group). This isn't just organizational — Sanity Studio has
its own styling system, and if it inherited the site's Tailwind CSS reset
it would visually break. `src/app/layout.tsx` (true root) is deliberately
minimal; `src/app/(site)/layout.tsx` carries the header, footer, analytics,
and is the only place `globals.css` is imported.

## SEO / AI-visibility notes

- `src/app/sitemap.ts` and `src/app/robots.ts` are Next's native
  equivalents of the hand-rolled versions in the original export.
  `robots.ts` explicitly allows the major AI crawlers (GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended, etc.) in addition to search engines, and
  explicitly keeps `/studio` out of both search engines and AI crawlers.
- `/llms.txt` is a plain-text summary aimed at AI systems, built from the
  same data sources that render the pages (including live Sanity content),
  so it can't drift out of sync with what's actually on the site.
- JSON-LD structured data is on every page: `LegalService` for the firm,
  `Person` for each attorney (not schema.org's `Attorney` type, which
  represents the business/service, not an individual), `Service` +
  `FAQPage` for practice areas, `BlogPosting` for insights, `JobPosting`
  for careers, and `BreadcrumbList` throughout.
- None of this is a substitute for accurate, comprehensive real content.
  Structured data and crawler access help search engines and AI systems
  read the site correctly — they don't make untrue claims more credible.

## Stack

Next.js 16 (App Router, TypeScript, Tailwind v4) · Sanity (Studio embedded
at `/studio`, content fetched via `next-sanity`) · `@portabletext/react`
for rich text rendering · shadcn/ui-style primitives (only the ones
actually used: button, input, textarea, label, accordion) · Zod for form
validation · `@next/third-parties` for GA4.

## Known non-blocking issue

`npm install` currently reports vulnerabilities in Sanity's own CLI/build
tooling (`js-yaml`, `undici`, `@module-federation/*`) — all several
dependency layers deep inside packages that only run when you use Sanity's
own CLI commands, never in the deployed site. `npm audit fix --force` would
downgrade `sanity` to a version flagged as a breaking change; I left it
alone rather than force a downgrade I couldn't verify. Worth revisiting
next time you do routine dependency updates.
