import { InsightsArchive } from "@/components/insights-archive";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import { getAllInsights } from "@/lib/content";
import { buildSocialMetadata } from "@/lib/seo";

const DESCRIPTION = `Articles and legal insights from ${siteConfig.name} in Bangladesh.`;

export async function generateMetadata(): Promise<Metadata> {
  const insights = await getAllInsights();

  return {
    title: "Articles",
    description: DESCRIPTION,
    alternates: { canonical: "/insights" },
    robots: insights.length > 0 ? undefined : { index: false, follow: true },
    ...buildSocialMetadata({
      title: `Articles | ${siteConfig.name}`,
      description: DESCRIPTION,
      url: "/insights",
    }),
  };
}

export default function InsightsPage() { return <InsightsArchive />; }
