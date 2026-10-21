import { getAllPracticeAreas } from "@/lib/data";
import { banglaPractice } from "@/lib/practice-bangla";

/** Metadata and language-link catalogue for every complete Bangla practice page. */
export const practiceLocalizations = Object.fromEntries(
  getAllPracticeAreas().map((source) => {
    const area = banglaPractice(source);
    return [area.slug, {
      title: area.title,
      description: area.copy,
      summary: area.valueProp,
      services: area.services.map((service) => service.title),
      faqs: area.faqs,
    }];
  }),
);
