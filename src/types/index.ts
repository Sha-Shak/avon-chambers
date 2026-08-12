import type { PortableTextBlock } from "@portabletext/types";

/**
 * Shared content types for Avon Chambers.
 *
 * Attorney and PracticeArea records are cross-referenced by slug
 * (attorney.practiceAreaSlugs <-> practiceArea.attorneySlugs) so either
 * side can be looked up from the other without duplicating data.
 */

export interface AttorneyStat {
  value: string;
  label: string;
}

export interface Attorney {
  slug: string;
  name: string;
  title: string;
  /** Short label shown on cards, e.g. "Corporate & M&A" */
  area: string;
  /** Full practice area names this attorney covers, for display */
  areas: string[];
  /** Practice area slugs this attorney covers, for cross-linking */
  practiceAreaSlugs: string[];
  photo: string;
  email: string;
  phone: string;
  intro: string;
  bio: string[];
  education: string[];
  admissions: string[];
  stats: AttorneyStat[];
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
  attorneySlugs: string[];
  caseStudySlugs: string[];
}

export interface CaseStudy {
  slug: string;
  area: string;
  title: string;
  metric: string;
  metricLabel: string;
  duration: string;
  result: string;
  summary: string;
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
  /** Optional short description for meta tags; falls back to `excerpt` when absent. */
  seoDescription?: string;
  keywords?: string[];
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
  closingDate?: string; // ISO date
  summary: string;
  applyEmail: string;
}

export interface JobPost extends JobPostMeta {
  body: PortableTextBlock[];
}
