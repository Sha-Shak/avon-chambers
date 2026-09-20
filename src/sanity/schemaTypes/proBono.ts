import { defineField, defineType } from "sanity";
import { coverImageField, postBodyField } from "./objects/postBody";

const CATEGORIES = ["Legal aid", "Community outreach", "Awareness & education", "Partnerships"];

export const proBono = defineType({
  name: "proBono",
  title: "Pro Bono post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) =>
        rule.required().max(90).warning("Titles over ~60 characters are usually truncated in Google search results."),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      description: "The web address for this post, e.g. \"legal-aid-day\" becomes /pro-bono/legal-aid-day",
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
      title: "Short summary",
      type: "text",
      rows: 3,
      description: "One or two sentences shown on the listing page and in search results.",
      validation: (rule) => rule.required().max(320),
    }),
    coverImageField,
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    postBodyField,
    defineField({ name: "seo", title: "SEO & Social", type: "seo" }),
  ],
  orderings: [{ title: "Newest first", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
});
