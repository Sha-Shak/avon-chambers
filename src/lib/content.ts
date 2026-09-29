import { client } from "@/sanity/client";
import { ARTICLE_CATEGORY_BY_PRACTICE_AREA_ID } from "@/config/article.config";
import { practiceAreaById, resolvePracticeAreaIds } from "@/config/practice-areas.config";
import type { CaseStudy, CaseStudyMeta, Insight, InsightMeta, JobPost, JobPostMeta, NewsEvent, NewsEventMeta, ProBonoMeta, ProBonoPost } from "@/types";

const SEO_FIELDS = `
  seo{
    metaTitle,
    metaDescription,
    keywords,
    ogImage,
    noIndex
  }
`;

const INSIGHT_META_FIELDS = `
  "slug": slug.current,
  title,
  category,
  excerpt,
  authorSlug,
  reviewedBySlug,
  practiceAreaIds,
  "legacyPracticeAreaSlugs": practiceAreaSlugs,
  references[]{ title, url },
  publishedAt,
  updatedAt,
  readingTime,
  coverImage,
  ${SEO_FIELDS}
`;

const JOB_META_FIELDS = `
  "slug": slug.current,
  title,
  department,
  location,
  type,
  postedAt,
  updatedAt,
  closingDate,
  summary,
  applyEmail,
  ${SEO_FIELDS}
`;

const NEWS_EVENT_META_FIELDS = `
  "slug": slug.current,
  title,
  kind,
  excerpt,
  publishedAt,
  eventDate,
  location,
  coverImage,
  ${SEO_FIELDS}
`;

const PRO_BONO_META_FIELDS = `
  "slug": slug.current,
  title,
  category,
  excerpt,
  publishedAt,
  coverImage,
  ${SEO_FIELDS}
`;

const CASE_STUDY_META_FIELDS = `
  "slug": slug.current,
  title,
  excerpt,
  practiceAreaIds,
  "legacyPracticeAreaSlugs": practiceAreaSlugs,
  matterType,
  clientName,
  clientType,
  industry,
  jurisdictions,
  duration,
  result,
  keyResults[]{ value, label },
  teamMembers,
  confidentialityNote,
  featured,
  publishedAt,
  updatedAt,
  coverImage,
  ${SEO_FIELDS}
`;

// ---- Case studies ---------------------------------------------------------

type LegacyPracticeLinks = { practiceAreaIds?: number[]; legacyPracticeAreaSlugs?: string[] };

function withPracticeAreaIds<T extends LegacyPracticeLinks>(item: T): T & { practiceAreaIds: number[] } {
  const { legacyPracticeAreaSlugs, ...rest } = item;
  return {
    ...rest,
    practiceAreaIds: resolvePracticeAreaIds(item.practiceAreaIds, legacyPracticeAreaSlugs),
  } as T & { practiceAreaIds: number[] };
}

export async function getAllCaseStudies(): Promise<CaseStudyMeta[]> {
  const studies = await client.fetch<(CaseStudyMeta & LegacyPracticeLinks)[]>(
    `*[_type == "caseStudy" && defined(slug.current)] | order(publishedAt desc) { ${CASE_STUDY_META_FIELDS} }`,
    {},
    { next: { revalidate: 60 } },
  );
  return studies.map(withPracticeAreaIds);
}

export async function getCaseStudySlugs(): Promise<string[]> {
  const studies = await client.fetch<{ slug: string }[]>(
    `*[_type == "caseStudy" && defined(slug.current)]{ "slug": slug.current }`,
  );
  return studies.map((study) => study.slug);
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | undefined> {
  const result = await client.fetch<(CaseStudy & LegacyPracticeLinks) | null>(
    `*[_type == "caseStudy" && slug.current == $slug][0]{ ${CASE_STUDY_META_FIELDS}, body }`,
    { slug },
    { next: { revalidate: 60 } },
  );
  return result ? withPracticeAreaIds(result) : undefined;
}

export async function getCaseStudiesByPracticeArea(practiceAreaId: number): Promise<CaseStudyMeta[]> {
  const area = practiceAreaById(practiceAreaId);
  if (!area) return [];
  const studies = await client.fetch<(CaseStudyMeta & LegacyPracticeLinks)[]>(
    `*[_type == "caseStudy" && defined(slug.current) && ($practiceAreaId in coalesce(practiceAreaIds, []) || (count(coalesce(practiceAreaIds, [])) == 0 && $legacySlug in coalesce(practiceAreaSlugs, [])))] | order(publishedAt desc) [0...3] { ${CASE_STUDY_META_FIELDS} }`,
    { practiceAreaId, legacySlug: area.slug },
    { next: { revalidate: 60 } },
  );
  return studies.map(withPracticeAreaIds);
}

// ---- Insights (blog) --------------------------------------------------

export async function getAllInsights(): Promise<InsightMeta[]> {
  const insights = await client.fetch<(InsightMeta & LegacyPracticeLinks)[]>(
    `*[_type == "insight" && defined(slug.current)] | order(publishedAt desc) { ${INSIGHT_META_FIELDS} }`,
    {},
    { next: { revalidate: 60 } },
  );
  return insights.map(withPracticeAreaIds);
}

export async function getInsightSlugs(): Promise<string[]> {
  const insights = await client.fetch<{ slug: string }[]>(
    `*[_type == "insight" && defined(slug.current)]{ "slug": slug.current }`,
  );
  return insights.map((i) => i.slug);
}

export async function getInsight(slug: string): Promise<Insight | undefined> {
  const result = await client.fetch<(Insight & LegacyPracticeLinks) | null>(
    `*[_type == "insight" && slug.current == $slug][0]{ ${INSIGHT_META_FIELDS}, body }`,
    { slug },
    { next: { revalidate: 60 } },
  );
  return result ? withPracticeAreaIds(result) : undefined;
}

export async function getInsightsByAuthor(authorSlug: string): Promise<InsightMeta[]> {
  const insights = await getAllInsights();
  return insights.filter((i) => i.authorSlug === authorSlug);
}

export async function getInsightsByPracticeArea(practiceAreaId: number): Promise<InsightMeta[]> {
  const area = practiceAreaById(practiceAreaId);
  if (!area) return [];
  const category = ARTICLE_CATEGORY_BY_PRACTICE_AREA_ID[practiceAreaId] ?? "";
  const insights = await client.fetch<(InsightMeta & LegacyPracticeLinks)[]>(
    `*[_type == "insight" && defined(slug.current) && ($practiceAreaId in coalesce(practiceAreaIds, []) || (count(coalesce(practiceAreaIds, [])) == 0 && $legacySlug in coalesce(practiceAreaSlugs, [])) || (count(coalesce(practiceAreaIds, [])) == 0 && count(coalesce(practiceAreaSlugs, [])) == 0 && category == $category))] | order(publishedAt desc) [0...3] { ${INSIGHT_META_FIELDS} }`,
    { practiceAreaId, legacySlug: area.slug, category },
    { next: { revalidate: 60 } },
  );
  return insights.map(withPracticeAreaIds);
}

// ---- Careers (job posts) -----------------------------------------------

export async function getAllJobPosts(): Promise<JobPostMeta[]> {
  return client.fetch(
    `*[_type == "jobPost" && defined(slug.current)] | order(postedAt desc) { ${JOB_META_FIELDS} }`,
    {},
    { next: { revalidate: 60 } },
  );
}

export async function getJobPostSlugs(): Promise<string[]> {
  const jobs = await client.fetch<{ slug: string }[]>(
    `*[_type == "jobPost" && defined(slug.current)]{ "slug": slug.current }`,
  );
  return jobs.map((j) => j.slug);
}

export async function getJobPost(slug: string): Promise<JobPost | undefined> {
  const result = await client.fetch<JobPost | null>(
    `*[_type == "jobPost" && slug.current == $slug][0]{ ${JOB_META_FIELDS}, body }`,
    { slug },
    { next: { revalidate: 60 } },
  );
  return result ?? undefined;
}

/** Job posts past their closing date are hidden from listings but keep working as direct links. */
export function isJobOpen(job: Pick<JobPostMeta, "closingDate">): boolean {
  if (!job.closingDate) return true;
  return new Date(job.closingDate).getTime() >= Date.now();
}

// ---- News & Events -------------------------------------------------------

export async function getAllNewsEvents(): Promise<NewsEventMeta[]> {
  return client.fetch(
    `*[_type == "newsEvent" && defined(slug.current)] | order(publishedAt desc) { ${NEWS_EVENT_META_FIELDS} }`,
    {},
    { next: { revalidate: 60 } },
  );
}

export async function getNewsEventSlugs(): Promise<string[]> {
  const items = await client.fetch<{ slug: string }[]>(
    `*[_type == "newsEvent" && defined(slug.current)]{ "slug": slug.current }`,
  );
  return items.map((i) => i.slug);
}

export async function getNewsEvent(slug: string): Promise<NewsEvent | undefined> {
  const result = await client.fetch<NewsEvent | null>(
    `*[_type == "newsEvent" && slug.current == $slug][0]{ ${NEWS_EVENT_META_FIELDS}, body }`,
    { slug },
    { next: { revalidate: 60 } },
  );
  return result ?? undefined;
}

// ---- Pro Bono --------------------------------------------------------------

export async function getAllProBonoPosts(): Promise<ProBonoMeta[]> {
  return client.fetch(
    `*[_type == "proBono" && defined(slug.current)] | order(publishedAt desc) { ${PRO_BONO_META_FIELDS} }`,
    {},
    { next: { revalidate: 60 } },
  );
}

export async function getProBonoSlugs(): Promise<string[]> {
  const items = await client.fetch<{ slug: string }[]>(
    `*[_type == "proBono" && defined(slug.current)]{ "slug": slug.current }`,
  );
  return items.map((i) => i.slug);
}

export async function getProBonoPost(slug: string): Promise<ProBonoPost | undefined> {
  const result = await client.fetch<ProBonoPost | null>(
    `*[_type == "proBono" && slug.current == $slug][0]{ ${PRO_BONO_META_FIELDS}, body }`,
    { slug },
    { next: { revalidate: 60 } },
  );
  return result ?? undefined;
}
