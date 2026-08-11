import { defineField, defineType } from "sanity";

const CATEGORIES = ["Corporate", "Litigation", "Employment", "Immigration", "Real Estate", "Family Law"];

export const insight = defineType({
  name: "insight",
  title: "Insight (blog post)",
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
      description: "One or two sentences shown on the Insights listing page and in search results.",
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
      name: "readingTime",
      title: "Reading time",
      type: "string",
      description: "Shown next to the date, e.g. \"6 min read\".",
      initialValue: "5 min read",
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
