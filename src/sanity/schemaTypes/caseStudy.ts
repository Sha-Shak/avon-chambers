import { practiceAreasField, responsibleLawyersField } from "./objects/legalRelationships";
import { defineArrayMember, defineField, defineType } from "sanity";
import { CASE_STUDY_MATTER_TYPES } from "@/config/case-study.config";
import { practiceAreaById, resolvePracticeAreaIds } from "@/config/practice-areas.config";
import { coverImageField, postBodyField } from "./objects/postBody";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "matter", title: "Matter details" },
    { name: "seo", title: "SEO & Social" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      description: "Also used as the page title unless a separate SEO title is provided.",
      validation: (rule) =>
        rule.required().max(90).warning("Titles over ~60 characters are usually truncated in search results."),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "content",
      description: "The web address, e.g. \"commercial-arbitration\" becomes /case-studies/commercial-arbitration",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Short summary",
      type: "text",
      rows: 4,
      group: "content",
      description: "A concise, non-confidential overview shown on cards and in search results.",
      validation: (rule) => rule.required().max(320),
    }),
    { ...coverImageField, group: "content" },
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated at",
      type: "datetime",
      group: "content",
      description: "Optional. Set this only when the published case study is materially revised.",
    }),
    { ...postBodyField, title: "Full case study", group: "content" },

    { ...practiceAreasField, group: "matter", validation: (rule) => rule.unique().custom((ids, context) =>
      Array.isArray(ids) && ids.some((id) => typeof id !== "number" || !practiceAreaById(id)) ? "Select an existing practice area." :
      (Array.isArray(ids) && ids.length) || (Array.isArray(context.document?.practiceAreaSlugs) && context.document.practiceAreaSlugs.length)
        ? true : "Select at least one practice area",
    ) },
    { ...responsibleLawyersField, group: "matter" },
    defineField({
      name: "practiceAreaSlugs",
      title: "Legacy practice links",
      type: "array",
      group: "matter",
      of: [defineArrayMember({ type: "string" })],
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "matterType",
      title: "Matter type",
      type: "string",
      group: "matter",
      options: { list: [...CASE_STUDY_MATTER_TYPES] },
    }),
    defineField({
      name: "clientName",
      title: "Client name",
      type: "string",
      group: "matter",
      description: "Optional. Only publish a client name when you have clear permission; otherwise use Client type below.",
    }),
    defineField({
      name: "clientType",
      title: "Client type",
      type: "string",
      group: "matter",
      description: "A safe general description, e.g. \"Bangladeshi manufacturing company\" or \"Private individual\".",
    }),
    defineField({
      name: "industry",
      title: "Industry / sector",
      type: "string",
      group: "matter",
      description: "e.g. Banking, garments, technology, real estate or public sector.",
    }),
    defineField({
      name: "jurisdictions",
      title: "Jurisdictions",
      type: "array",
      group: "matter",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description: "Countries, courts or forums involved, e.g. Bangladesh, High Court Division or SIAC.",
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      group: "matter",
      description: "Optional, e.g. \"Eight months\" or \"Ongoing\".",
    }),
    defineField({
      name: "result",
      title: "Result / status",
      type: "string",
      group: "matter",
      description: "A short, accurate outcome, e.g. \"Resolved by settlement\". Avoid guarantees or unsupported claims.",
    }),
    defineField({
      name: "keyResults",
      title: "Key results",
      type: "array",
      group: "matter",
      description: "Optional highlight figures or outcomes. Add only results that may be disclosed.",
      of: [
        defineArrayMember({
          type: "object",
          name: "keyResult",
          title: "Key result",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "teamMembers",
      title: "Matter team",
      type: "array",
      group: "matter",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description: "Optional public-facing names or roles. Do not add internal-only information.",
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "confidentialityNote",
      title: "Confidentiality note",
      type: "text",
      rows: 2,
      group: "matter",
      description: "Optional, e.g. \"Certain details have been anonymised to protect client confidentiality.\"",
    }),
    defineField({
      name: "featured",
      title: "Featured case study",
      type: "boolean",
      group: "matter",
      initialValue: false,
      description: "Reserved for future featured placements; all published studies still appear on the Case Studies page.",
    }),
    defineField({ name: "seo", title: "SEO & Social", type: "seo", group: "seo" }),
  ],
  orderings: [{ title: "Newest first", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: {
      title: "title",
      practiceAreas: "practiceAreaIds",
      legacyPracticeAreas: "practiceAreaSlugs",
      media: "coverImage",
    },
    prepare({ title, practiceAreas, legacyPracticeAreas }) {
      const labels = resolvePracticeAreaIds(practiceAreas, legacyPracticeAreas).map(
        (id) => practiceAreaById(id)?.title ?? String(id),
      );
      return { title, subtitle: labels.join(" · ") || "No practice area selected" };
    },
  },
});
