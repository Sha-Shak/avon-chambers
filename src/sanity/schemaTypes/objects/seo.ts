import { defineField, defineType } from "sanity";

/**
 * Reusable "SEO & Social" panel, attached to any document type via
 * `defineField({ name: "seo", type: "seo" })`. Every field is optional —
 * the site always has a sensible fallback (the document's own title,
 * excerpt/summary, and cover image), so an editor only needs to open this
 * panel when they want to override that default for search or social.
 */
export const seo = defineType({
  name: "seo",
  title: "SEO & Social",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      description:
        "Overrides the page title search engines and browser tabs show. Leave blank to use the title above. Aim for under 60 characters — longer titles get truncated in search results.",
      validation: (rule) => rule.max(70).warning("Titles over ~60 characters are usually truncated in Google search results."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      description:
        "The snippet shown under the title in search results and in social previews. Leave blank to fall back to the excerpt/summary above. Sweet spot is 120–160 characters — short enough to avoid truncation, long enough to be worth showing.",
      validation: (rule) =>
        rule
          .max(160)
          .warning("Over ~160 characters and search engines will truncate this.")
          .min(70)
          .warning("Under ~70 characters is a missed opportunity — there's room to say more."),
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Optional. Terms this page should be found for — used in meta keywords and JSON-LD, not a ranking factor on its own.",
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "image",
      options: { hotspot: true },
      description:
        "Shown when this page is shared on social media (Twitter/X, LinkedIn, Facebook, iMessage). Leave blank to use the cover image, or the site default if there isn't one. Ideal size is 1200×630.",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
      description:
        "Turn on to keep this specific page out of Google/Bing search results and out of the sitemap — the page itself still works for anyone with the direct link. Use for duplicate, outdated or low-value pages you don't want competing with your other content.",
    }),
  ],
});
