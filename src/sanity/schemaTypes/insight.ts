import { defineField, defineType } from "sanity";

const CATEGORIES = ["Corporate", "Litigation", "Employment", "Immigration", "Real Estate", "Family Law"];

export const insight = defineType({
  name: "insight",
  title: "Article (blog post)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      description: "The web address for this post, e.g. \"my-post\" becomes /insights/my-post",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: CATEGORIES },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "One or two sentences shown on the Articles listing page and in search results.",
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "authorSlug",
      title: "Author",
      type: "string",
      description:
        "Must match an attorney's slug in src/data/attorneys.json, e.g. \"helena-marchetti\". Leave blank to credit the firm generally.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated at",
      type: "datetime",
      description:
        "Leave blank until you actually revise the post. When set, it replaces \"Published at\" as the freshness signal search engines see (JSON-LD dateModified and the sitemap).",
    }),
    defineField({
      name: "readingTime",
      title: "Reading time",
      type: "string",
      description: "Shown next to the date, e.g. \"6 min read\".",
      initialValue: "5 min read",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "string",
      description:
        "Optional. A ~155 character description for search results and social previews. Falls back to the excerpt (which can run longer) when left blank.",
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      description: "Optional. A short list of terms this article should be found for.",
      options: { layout: "tags" },
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
});
