import { defineArrayMember, defineField, defineType } from "sanity";
import { ARTICLE_CATEGORIES } from "@/config/article.config";
import { PRACTICE_AREA_OPTIONS } from "@/config/practice-areas.config";
import lawyersData from "@/data/lawyers.json";
import { RichTextInput } from "../components/rich-text-input";
import { richTextBlock } from "./objects/postBody";

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
      description: "Choose the main legal subject of the article. Use the closest practice area for cross-disciplinary pieces.",
      options: { list: [...ARTICLE_CATEGORIES] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "practiceAreaIds",
      title: "Related practice areas",
      type: "array",
      description: "Connect this article to every relevant Practice Area page. This powers related-content links across the website.",
      of: [defineArrayMember({ type: "number" })],
      options: { list: PRACTICE_AREA_OPTIONS, layout: "grid" },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "practiceAreaSlugs",
      title: "Legacy practice links",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      hidden: true,
      readOnly: true,
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
      description: "Select the lawyer who wrote the article. Only leave blank for an article authored by the firm as an organization.",
      validation: (rule) => rule.required().warning("Select a named author for individual legal analysis."),
      options: {
        list: lawyersData
          .slice()
          .sort((a, b) => a.position - b.position)
          .map((lawyer) => ({ title: lawyer.name, value: lawyer.slug })),
      },
    }),
    defineField({
      name: "reviewedBySlug",
      title: "Reviewed by",
      type: "string",
      description: "Select the lawyer who checked the legal accuracy of this article. Only credit a review that has actually taken place.",
      validation: (rule) => rule.required().warning("A named legal reviewer is recommended for legal analysis."),
      options: {
        list: lawyersData
          .slice()
          .sort((a, b) => a.position - b.position)
          .map((lawyer) => ({ title: lawyer.name, value: lawyer.slug })),
      },
    }),
    defineField({
      name: "reviewedAt",
      title: "Legal review date",
      type: "datetime",
      description: "Set only when the selected reviewer has actually reviewed the legal accuracy. This is separate from an editorial update.",
      validation: (rule) => rule.custom((value, context) =>
        !value || context.document?.reviewedBySlug ? true : "Select the lawyer who performed this review.",
      ),
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
      description:
        "Paste from Google Docs or Microsoft Word to retain headings, lists, indentation, bold, italic, underline, strike-through, and links.",
      components: { input: RichTextInput },
      of: [richTextBlock],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "references",
      title: "References and sources",
      type: "array",
      description: "Optional public references such as legislation, judgments, regulations or official guidance.",
      of: [
        defineArrayMember({
          type: "object",
          name: "sourceLink",
          fields: [
            defineField({ name: "title", title: "Source title", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "url",
              title: "Source URL",
              type: "url",
              validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: { select: { title: "title", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
});
