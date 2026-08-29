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
