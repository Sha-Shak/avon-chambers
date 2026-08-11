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
      validation: (rule) => rule.required(),
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
      description: "e.g. \"New York, NY (Hybrid)\"",
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
      description: "One or two sentences shown on the Careers listing page.",
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
