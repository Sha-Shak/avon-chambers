import lawyersData from "@/data/lawyers.json";
import practiceAreasData from "@/data/practice-areas.json";
import galleryData from "@/data/gallery.json";
import type { Lawyer, PracticeArea, GalleryPhoto } from "@/types";

const lawyers = lawyersData as Lawyer[];
const practiceAreas = practiceAreasData as PracticeArea[];
const galleryPhotos = galleryData as GalleryPhoto[];

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

// ---- Life at Avon gallery ---------------------------------------------------

/** Edit src/data/gallery.json to add, remove or re-link photos — each entry's
 *  `src` can point anywhere (a placeholder today, Cloudinary later). Photos are
 *  shown in `order` sequence (lowest first) rather than file order, so the
 *  sequence can be changed without reshuffling the underlying JSON. */
export function getGalleryPhotos(): GalleryPhoto[] {
  return [...galleryPhotos].sort((a, b) => a.order - b.order);
}

/** Distinct categories in the order they first appear in gallery.json,
 *  used to render the "All" + per-category filter chips. */
export function getGalleryCategories(): string[] {
  return [...new Set(galleryPhotos.map((p) => p.category))];
}
