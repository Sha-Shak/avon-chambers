import { defineField, defineType } from "sanity";

export const jobPost = defineType({
  name: "jobPost",
  title: "Job posting",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Job title",
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
      description: "The web address for this posting, e.g. \"corporate-associate\" becomes /careers/corporate-associate",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "department",
      title: "Department",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. \"Dhaka, Bangladesh (On-site)\"",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Employment type",
      type: "string",
      options: { list: ["Full-time", "Part-time", "Contract", "Internship"] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "One or two sentences shown on the Careers listing page, and in search results unless a meta description is set below.",
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: "applyEmail",
      title: "Apply-by email address",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "postedAt",
      title: "Posted at",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "closingDate",
      title: "Closing date",
      type: "datetime",
      description: "Optional. Once this date passes, the posting disappears from /careers automatically (but a direct link keeps working).",
    }),
    defineField({
      name: "updatedAt",
      title: "Updated at",
      type: "datetime",
      description:
        "Leave blank until you actually revise the posting. When set, it replaces \"Posted at\" as the freshness signal search engines see (the sitemap).",
    }),
    defineField({
      name: "seo",
      title: "SEO & Social",
      type: "seo",
    }),
    defineField({
      name: "body",
      title: "Full description",
      type: "array",
      of: [{ type: "block" }],
      description: "Responsibilities, requirements, how to apply.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "department" },
  },
});
