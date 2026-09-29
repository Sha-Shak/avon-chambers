import practiceAreasData from "@/data/practice-areas.json";
import type { PracticeArea } from "@/types";

const practiceAreas = practiceAreasData as PracticeArea[];

/** One source for the site's practice-area ID, public slug, and display name. */
export const PRACTICE_AREA_OPTIONS = practiceAreas.map(({ id, title }) => ({ title, value: id }));

export function practiceAreaById(id: number): PracticeArea | undefined {
  return practiceAreas.find((area) => area.id === id);
}

export function practiceAreaBySlug(slug: string): PracticeArea | undefined {
  return practiceAreas.find((area) => area.slug === slug);
}

/** Read older Sanity documents that still store slugs until they are edited. */
export function resolvePracticeAreaIds(ids?: number[] | null, legacySlugs?: string[] | null): number[] {
  const resolved = ids?.length
    ? ids
    : (legacySlugs ?? [])
        .map((slug) => practiceAreaBySlug(slug)?.id)
        .filter((id): id is number => id !== undefined);
  return [...new Set(resolved)].filter((id) => practiceAreaById(id) !== undefined);
}
