/**
 * Shared options for Sanity's Case Study editor and the public website.
 * Keep the practice-area slugs aligned with src/data/practice-areas.json.
 */
export const CASE_STUDY_PRACTICE_AREAS = [
  { title: "Constitutional Law & Writs", value: "constitutional-litigation-writ" },
  { title: "Corporate & Commercial Law", value: "corporate-commercial" },
  { title: "Civil Litigation & Dispute Resolution", value: "civil-litigation" },
  { title: "Arbitration & Mediation", value: "arbitration" },
  { title: "Criminal Litigation", value: "criminal-law" },
  { title: "Banking, Finance & Investment", value: "banking-finance-law" },
  { title: "Foreign Investment & Investment Facilitation", value: "foreign-investment-facilitation" },
  { title: "Corporate Restructuring & Project Documentation", value: "corporate-restructuring-project-documentation" },
  { title: "Property & Real Estate", value: "property-real-estate" },
  { title: "Taxation", value: "taxation" },
  { title: "Employment & Labour Law", value: "employment-labour-law" },
  { title: "International Law", value: "international-law" },
  { title: "Telecommunications, IT & Technology", value: "it-technology-startups" },
  { title: "Family Law", value: "family-law" },
  { title: "New & Developing Areas", value: "new-developing-areas" },
] as const;

export const CASE_STUDY_MATTER_TYPES = [
  "Advisory",
  "Arbitration",
  "Dispute resolution",
  "Investigation",
  "Litigation",
  "Mediation",
  "Regulatory",
  "Transaction",
  "Other",
] as const;

export function practiceAreaTitle(slug: string) {
  return CASE_STUDY_PRACTICE_AREAS.find((area) => area.value === slug)?.title ?? slug;
}
