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
  return getAllLawyers().filter((lawyer) =>
    getPracticeAreasForLawyer(lawyer).some((area) => area.slug === practiceAreaSlug),
  );
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

/**
 * Older lawyer records use precise matter-level slugs, while the public site
 * now has 15 broader canonical Practice Areas. Resolve those legacy labels to
 * their nearest public page so profile badges and reciprocal lawyer listings
 * remain useful without flattening the detailed wording in each biography.
 */
function canonicalPracticeAreaSlug(slug: string, label: string): string | undefined {
  if (getPracticeArea(slug)) return slug;

  const subject = `${slug} ${label}`.toLowerCase();
  if (/constitutional|administrative|writ|judicial-review|policy-advocacy|government-institutions/.test(subject)) return "constitutional-litigation-writ";
  if (/foreign-investment/.test(subject)) return "foreign-investment-facilitation";
  if (/restructur|project|power-energy|public-private|insolvency|debt-restructuring/.test(subject)) return "corporate-restructuring-project-documentation";
  if (/banking|financial|artha-rin|loan-recovery/.test(subject)) return "banking-finance-law";
  if (/employment|labour/.test(subject)) return "employment-labour-law";
  if (/arbitration|mediation|alternative-dispute|\badr\b|adjudication/.test(subject)) return "arbitration";
  if (/criminal|fraud|forgery|white-collar|animal-welfare/.test(subject)) return "criminal-law";
  if (/property|real-estate|\bland\b|lease|tenancy|mortgage|inheritance|succession/.test(subject)) return "property-real-estate";
  if (/family|divorce|custody|guardianship|maintenance|personal-law/.test(subject)) return "family-law";
  if (/\btax\b|customs/.test(subject)) return "taxation";
  if (/international|cross-border|admiralty/.test(subject)) return "international-law";
  if (/telecommunication|information-technology|e-commerce|cyber|startup/.test(subject)) return "it-technology-startups";
  if (/intellectual-property|emerging|digital/.test(subject)) return "new-developing-areas";
  if (/corporate|commercial|company|contract|regulatory|compliance|fmcg|industry-establishment|merger|acquisition/.test(subject)) return "corporate-commercial";
  if (/litigation|dispute|legal-advisory/.test(subject)) return "civil-litigation";
  return undefined;
}

export function getPracticeAreasForLawyer(lawyer: Lawyer): (PracticeArea & { displayTitle: string })[] {
  const bySlug = new Map(practiceAreas.map((area) => [area.slug, area]));
  const resolved = new Map<string, PracticeArea & { displayTitle: string }>();

  lawyer.practiceAreaSlugs.forEach((slug, index) => {
    const displayTitle = lawyer.areas[index] ?? slug;
    const canonicalSlug = canonicalPracticeAreaSlug(slug, displayTitle);
    const area = canonicalSlug ? bySlug.get(canonicalSlug) : undefined;
    if (area && !resolved.has(area.slug)) resolved.set(area.slug, { ...area, displayTitle });
  });

  return [...resolved.values()];
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
