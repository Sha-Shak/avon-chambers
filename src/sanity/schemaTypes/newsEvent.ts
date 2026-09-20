import { defineField, defineType } from "sanity";
import { coverImageField, postBodyField } from "./objects/postBody";

export const newsEvent = defineType({
  name: "newsEvent",
  title: "News & Event",
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
      description: "The web address for this post, e.g. \"annual-dinner\" becomes /news-events/annual-dinner",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      options: { list: ["News", "Event"], layout: "radio" },
      initialValue: "News",
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
    defineField({
      name: "eventDate",
      title: "Event date",
      type: "datetime",
      description: "When the event takes place.",
      hidden: ({ parent }) => parent?.kind !== "Event",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "Where the event takes place, e.g. \"Chambers, Dhanmondi\".",
      hidden: ({ parent }) => parent?.kind !== "Event",
    }),
    postBodyField,
    defineField({ name: "seo", title: "SEO & Social", type: "seo" }),
  ],
  orderings: [{ title: "Newest first", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", subtitle: "kind", media: "coverImage" },
  },
});
