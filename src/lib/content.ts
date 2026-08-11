import { client } from "@/sanity/client";
import type { Insight, InsightMeta, JobPost, JobPostMeta } from "@/types";

const INSIGHT_META_FIELDS = `
  "slug": slug.current,
  title,
  category,
  excerpt,
  authorSlug,
  publishedAt,
  readingTime,
  coverImage
`;

const JOB_META_FIELDS = `
  "slug": slug.current,
  title,
  department,
  location,
  type,
  postedAt,
  closingDate,
  summary,
  applyEmail
`;

// ---- Insights (blog) --------------------------------------------------

export async function getAllInsights(): Promise<InsightMeta[]> {
  return client.fetch(
    `*[_type == "insight" && defined(slug.current)] | order(publishedAt desc) { ${INSIGHT_META_FIELDS} }`,
    {},
    { next: { revalidate: 60 } },
  );
}

export async function getInsightSlugs(): Promise<string[]> {
  const insights = await client.fetch<{ slug: string }[]>(
    `*[_type == "insight" && defined(slug.current)]{ "slug": slug.current }`,
  );
  return insights.map((i) => i.slug);
}

export async function getInsight(slug: string): Promise<Insight | undefined> {
  const result = await client.fetch<Insight | null>(
    `*[_type == "insight" && slug.current == $slug][0]{ ${INSIGHT_META_FIELDS}, body }`,
    { slug },
    { next: { revalidate: 60 } },
  );
  return result ?? undefined;
}

export async function getInsightsByAuthor(authorSlug: string): Promise<InsightMeta[]> {
  const insights = await getAllInsights();
  return insights.filter((i) => i.authorSlug === authorSlug);
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
