import attorneysData from "@/data/attorneys.json";
import practiceAreasData from "@/data/practice-areas.json";
import caseStudiesData from "@/data/case-studies.json";
import type { Attorney, CaseStudy, PracticeArea } from "@/types";

const attorneys = attorneysData as Attorney[];
const practiceAreas = practiceAreasData as PracticeArea[];
const caseStudies = caseStudiesData as CaseStudy[];

// ---- Attorneys ----------------------------------------------------------

export function getAllAttorneys(): Attorney[] {
  return [...attorneys].sort((a, b) => a.position - b.position);
}

export function getFeaturedAttorneys(): Attorney[] {
  return getAllAttorneys().filter((a) => a.featured);
}

export function getAttorney(slug: string): Attorney | undefined {
  return attorneys.find((a) => a.slug === slug);
}

export function getAttorneys(slugs: string[]): Attorney[] {
  const bySlug = new Map(attorneys.map((a) => [a.slug, a]));
  return slugs.map((s) => bySlug.get(s)).filter((a): a is Attorney => Boolean(a));
}

export function getAttorneysForPracticeArea(practiceAreaSlug: string): Attorney[] {
  return getAllAttorneys().filter((a) => a.practiceAreaSlugs.includes(practiceAreaSlug));
}

// ---- Practice areas -------------------------------------------------------

export function getAllPracticeAreas(): PracticeArea[] {
  return practiceAreas;
}

export function getPracticeArea(slug: string): PracticeArea | undefined {
  return practiceAreas.find((p) => p.slug === slug);
}

export function getPracticeAreasForAttorney(attorney: Attorney): PracticeArea[] {
  return practiceAreas.filter((p) => attorney.practiceAreaSlugs.includes(p.slug));
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
