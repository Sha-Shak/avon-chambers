import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { InsightsArchive } from "@/components/insights-archive";
import { articlePageCount, articlePagePath } from "@/lib/article-pagination";
import { getAllInsights } from "@/lib/content";
import { buildSocialMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site.config";

export async function generateStaticParams() {
  const count = articlePageCount((await getAllInsights()).length);
  // Keep the route available when new articles are published after a deployment.
  return Array.from({ length: Math.max(0, count - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
}

async function resolvePage(params: Promise<{ page: string }>) {
  const { page: value } = await params;
  if (!/^[1-9]\d*$/.test(value)) notFound();
  const page = Number(value);
  if (page === 1) permanentRedirect("/insights");
  if (page > articlePageCount((await getAllInsights()).length)) notFound();
  return page;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const page = await resolvePage(params);
  const title = `Articles, page ${page}`;
  const description = `Articles and legal insights from ${siteConfig.name} in Bangladesh.`;
  return {
    title,
    description,
    alternates: { canonical: articlePagePath(page) },
    ...buildSocialMetadata({
      title: `${title} | ${siteConfig.name}`,
      description,
      url: articlePagePath(page),
    }),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  return <InsightsArchive page={await resolvePage(params)} />;
}
