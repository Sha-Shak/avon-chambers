import { defineArrayMember, defineField } from "sanity";
import { PRACTICE_AREA_OPTIONS } from "@/config/practice-areas.config";
import lawyers from "@/data/lawyers.json";

/** Shared by every publishable Sanity document; values use the existing site directory. */
export const practiceAreasField = defineField({
  name: "practiceAreaIds",
  title: "Related practice areas",
  type: "array",
  description:
    "Tag only the existing services relevant to this document. Published pages link to those services and appear on the matching service pages.",
  of: [defineArrayMember({ type: "number" })],
  options: { list: PRACTICE_AREA_OPTIONS, layout: "grid" },
  validation: (rule) =>
    rule
      .unique()
      .custom((ids) =>
        !ids ||
        ids.every((id) =>
          PRACTICE_AREA_OPTIONS.some((area) => area.value === id),
        )
          ? true
          : "Select an existing practice area.",
      ),
});

export const responsibleLawyersField = defineField({
  name: "responsibleLawyerSlugs",
  title: "Responsible lawyers",
  type: "array",
  description:
    "Select the lawyers responsible for this matter or update. Their public profiles appear alongside the related services. This does not change the article's author or reviewer.",
  of: [defineArrayMember({ type: "string" })],
  options: {
    list: [...lawyers]
      .sort((a, b) => a.position - b.position)
      .map((lawyer) => ({ title: lawyer.name, value: lawyer.slug })),
    layout: "grid",
  },
  validation: (rule) =>
    rule
      .unique()
      .custom((slugs) =>
        !slugs ||
        slugs.every((slug) => lawyers.some((lawyer) => lawyer.slug === slug))
          ? true
          : "Select a lawyer from the existing directory.",
      ),
});
