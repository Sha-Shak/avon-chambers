import lawyersData from "@/data/lawyers.json";
import practiceAreasData from "@/data/practice-areas.json";
import caseStudiesData from "@/data/case-studies.json";
import type { Lawyer, CaseStudy, PracticeArea } from "@/types";

const lawyers = lawyersData as Lawyer[];
const practiceAreas = practiceAreasData as PracticeArea[];
const caseStudies = caseStudiesData as CaseStudy[];

// ---- Lawyers ----------------------------------------------------------

export function getAllLawyers(): Lawyer[] {
  return [...lawyers].sort((a, b) => a.position - b.position);
}

export function getFeaturedLawyers(): Lawyer[] {
  return getAllLawyers().filter((l) => l.featured);
}

export function getLawyer(slug: string): Lawyer | undefined {
  return lawyers.find((l) => l.slug === slug);
}

export function getLawyers(slugs: string[]): Lawyer[] {
  const bySlug = new Map(lawyers.map((l) => [l.slug, l]));
  return slugs.map((s) => bySlug.get(s)).filter((l): l is Lawyer => Boolean(l));
}

export function getLawyersForPracticeArea(practiceAreaSlug: string): Lawyer[] {
  return getAllLawyers().filter((l) => l.practiceAreaSlugs.includes(practiceAreaSlug));
}

/** Seniority tiers shown as separate sections on the lawyers directory —
 *  order here is the display order (most senior first). A lawyer's tier is
 *  derived from their `title` rather than stored separately, so the two can
 *  never drift out of sync. */
export const LAWYER_TIERS = ["Partner", "Senior Associate", "Associate", "Of Counsel"] as const;
export type LawyerTier = (typeof LAWYER_TIERS)[number];

export function getLawyerTier(lawyer: Lawyer): LawyerTier {
  if (lawyer.title.includes("Partner")) return "Partner";
  if (lawyer.title === "Senior Associate") return "Senior Associate";
  if (lawyer.title === "Of Counsel") return "Of Counsel";
  return "Associate";
}

/** Every lawyer grouped into their seniority tier, ordered by `position`
 *  within each tier — powers the segmented /lawyers directory. Editing a
 *  lawyer's `position` in lawyers.json is the one place that controls their
 *  order, both here and in `getAllLawyers()` — lower sorts first. Tiers with
 *  no one in them are omitted rather than rendered empty. */
export function getLawyersByTier(): { tier: LawyerTier; lawyers: Lawyer[] }[] {
  return LAWYER_TIERS.map((tier) => ({
    tier,
    lawyers: getAllLawyers().filter((l) => getLawyerTier(l) === tier),
  })).filter((group) => group.lawyers.length > 0);
}

// ---- Practice areas -------------------------------------------------------

export function getAllPracticeAreas(): PracticeArea[] {
  return practiceAreas;
}

export function getPracticeArea(slug: string): PracticeArea | undefined {
  return practiceAreas.find((p) => p.slug === slug);
}

export function getPracticeAreasForLawyer(lawyer: Lawyer): PracticeArea[] {
  return practiceAreas.filter((p) => lawyer.practiceAreaSlugs.includes(p.slug));
}

// ---- Case studies ---------------------------------------------------------

export function getAllCaseStudies(): CaseStudy[] {
  return caseStudies;
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function getCaseStudies(slugs: string[]): CaseStudy[] {
  const bySlug = new Map(caseStudies.map((c) => [c.slug, c]));
  return slugs.map((s) => bySlug.get(s)).filter((c): c is CaseStudy => Boolean(c));
}
