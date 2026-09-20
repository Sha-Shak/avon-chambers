import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";
import { getAllLawyers, getAllPracticeAreas } from "@/lib/data";
import { getAllInsights, getAllJobPosts, getAllNewsEvents, getAllProBonoPosts, isJobOpen } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/practice-areas`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteConfig.url}/lawyers`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/case-studies`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/insights`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteConfig.url}/careers`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${siteConfig.url}/life-at-avon`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/news-events`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteConfig.url}/pro-bono`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteConfig.url}/policies`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const practiceAreaPages: MetadataRoute.Sitemap = getAllPracticeAreas().map((area) => ({
    url: `${siteConfig.url}/practice-areas/${area.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const lawyerPages: MetadataRoute.Sitemap = getAllLawyers().map((lawyer) => ({
    url: `${siteConfig.url}/lawyers/${lawyer.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const [insights, jobs, newsEvents, proBonoPosts] = await Promise.all([
    getAllInsights(),
    getAllJobPosts(),
    getAllNewsEvents(),
    getAllProBonoPosts(),
  ]);

  const insightPages: MetadataRoute.Sitemap = insights
    .filter((insight) => !insight.seo?.noIndex)
    .map((insight) => ({
      url: `${siteConfig.url}/insights/${insight.slug}`,
      lastModified: insight.updatedAt ?? insight.publishedAt,
      changeFrequency: "yearly",
      priority: 0.6,
    }));

  const jobPages: MetadataRoute.Sitemap = jobs
    .filter(isJobOpen)
    .filter((job) => !job.seo?.noIndex)
    .map((job) => ({
      url: `${siteConfig.url}/careers/${job.slug}`,
      lastModified: job.updatedAt ?? job.postedAt,
      changeFrequency: "weekly",
      priority: 0.5,
    }));

  const newsEventPages: MetadataRoute.Sitemap = newsEvents
    .filter((item) => !item.seo?.noIndex)
    .map((item) => ({
      url: `${siteConfig.url}/news-events/${item.slug}`,
      lastModified: item.publishedAt,
      changeFrequency: "yearly",
      priority: 0.5,
    }));

  const proBonoPages: MetadataRoute.Sitemap = proBonoPosts
    .filter((post) => !post.seo?.noIndex)
    .map((post) => ({
      url: `${siteConfig.url}/pro-bono/${post.slug}`,
      lastModified: post.publishedAt,
      changeFrequency: "yearly",
      priority: 0.5,
    }));

  return [
    ...staticPages,
    ...practiceAreaPages,
    ...lawyerPages,
    ...insightPages,
    ...jobPages,
    ...newsEventPages,
    ...proBonoPages,
  ];
}
