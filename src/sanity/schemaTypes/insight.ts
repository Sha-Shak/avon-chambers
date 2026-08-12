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
      description: "Also used as the page/search title unless a meta title is set below.",
      validation: (rule) =>
        rule
          .required()
          .max(70)
          .warning("Titles over ~60 characters are usually truncated in Google search results."),
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
      description:
        "One or two sentences shown on the Articles listing page, and in search results unless a meta description is set below.",
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
      name: "seo",
      title: "SEO & Social",
      type: "seo",
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
