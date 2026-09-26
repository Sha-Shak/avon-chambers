import type { PortableTextBlock } from "@portabletext/types";

/**
 * Shared content types for Avon Chambers.
 *
 * Lawyer and PracticeArea records are cross-referenced by slug
 * (lawyer.practiceAreaSlugs <-> practiceArea.lawyerSlugs) so either
 * side can be looked up from the other without duplicating data.
 */

export interface LawyerStat {
  value: string;
  label: string;
}

export interface Lawyer {
  slug: string;
  name: string;
  title: string;
  /** Short label shown on cards, e.g. "Corporate & M&A" */
  area: string;
  /** Full practice area names this lawyer covers, for display */
  areas: string[];
  /** Practice area slugs this lawyer covers, for cross-linking */
  practiceAreaSlugs: string[];
  photo: string;
  email: string;
  phone: string;
  intro: string;
  bio: string[];
  education: string[];
  admissions: string[];
  stats: LawyerStat[];
  notableCases: string[];
  awards: string[];
  publications: string[];
  /** Show on homepage / About "featured team" grids */
  featured: boolean;
  /** Display order within listings (lower = earlier) */
  position: number;
}

export interface PracticeAreaService {
  title: string;
  copy: string;
}

export interface PracticeAreaFaq {
  q: string;
  a: string;
}

export interface PracticeAreaImage {
  src: string;
  alt: string;
}

export interface PracticeArea {
  slug: string;
  title: string;
  /** lucide-react icon name, resolved at render time */
  icon: string;
  copy: string;
  valueProp: string;
  /** Representative photo shown on the practice area card and detail hero. */
  image: PracticeAreaImage;
  overview: string[];
  services: PracticeAreaService[];
  faqs: PracticeAreaFaq[];
  lawyerSlugs: string[];
}

export interface CaseStudyKeyResult {
  value: string;
  label: string;
}

export interface CaseStudyMeta {
  slug: string;
  title: string;
  excerpt: string;
  practiceAreaSlugs: string[];
  matterType?: string;
  clientName?: string;
  clientType?: string;
  industry?: string;
  jurisdictions?: string[];
  duration?: string;
  result?: string;
  keyResults?: CaseStudyKeyResult[];
  teamMembers?: string[];
  confidentialityNote?: string;
  featured?: boolean;
  publishedAt: string;
  updatedAt?: string;
  coverImage?: SanityPicture | null;
  seo?: SeoFields;
}

export interface CaseStudy extends CaseStudyMeta {
  body: PortableTextBlock[];
}

/** A client's words. Testimonials are shown anonymously, so only the quote is needed. */
export interface ClientTestimonial {
  quote: string;
}

/**
 * One photo in the "Life at Avon" gallery. `width`/`height` are the actual
 * pixel dimensions of `src` — required so the masonry grid can lay images
 * out at their true aspect ratio (portrait, landscape, or square) without a
 * layout shift once the image loads.
 */
export interface GalleryPhoto {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  description: string;
  category: string;
  /** Display sequence in the "All" masonry view — lower numbers appear first. */
  order: number;
}

/**
 * Optional overrides for search/social metadata, set on the "SEO & Social"
 * panel of any Sanity document. Every field is optional — the page always
 * has a sensible fallback (its own title/excerpt/cover image) — so this is
 * absent entirely on documents where no one has opened that panel.
 */
export interface SeoFields {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: { asset?: { _ref: string }; alt?: string } | null;
  noIndex?: boolean;
}

export interface InsightMeta {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  authorSlug?: string;
  publishedAt: string; // ISO date
  updatedAt?: string; // ISO date, only set once a post is actually revised
  readingTime: string;
  seo?: SeoFields;
  coverImage?: { asset?: { _ref: string }; alt?: string } | null;
}

export interface Insight extends InsightMeta {
  body: PortableTextBlock[];
}

export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";

export interface JobPostMeta {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  postedAt: string; // ISO date
  updatedAt?: string; // ISO date, only set once a posting is actually revised
  closingDate?: string; // ISO date
  summary: string;
  applyEmail: string;
  seo?: SeoFields;
}

export interface JobPost extends JobPostMeta {
  body: PortableTextBlock[];
}

export interface SanityPicture {
  asset?: { _ref: string };
  alt?: string;
}

export type NewsEventKind = "News" | "Event";

export interface NewsEventMeta {
  slug: string;
  title: string;
  kind: NewsEventKind;
  excerpt: string;
  publishedAt: string; // ISO date
  eventDate?: string; // ISO date, Events only
  location?: string; // Events only
  coverImage?: SanityPicture | null;
  seo?: SeoFields;
}

export interface NewsEvent extends NewsEventMeta {
  body: PortableTextBlock[];
}

export interface ProBonoMeta {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  publishedAt: string; // ISO date
  coverImage?: SanityPicture | null;
  seo?: SeoFields;
}

export interface ProBonoPost extends ProBonoMeta {
  body: PortableTextBlock[];
}
