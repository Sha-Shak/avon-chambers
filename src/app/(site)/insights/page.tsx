import { Breadcrumbs } from "@/components/breadcrumbs";
import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { InsightsCollection } from "@/components/insights-collection";
import { ConsultationSection } from "@/components/consultation-section";
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

export default async function InsightsPage() {
  const insights = await getAllInsights();

  return (
    <div>
      <Breadcrumbs items={[
          { name: "Home", path: "/" },
          { name: "Articles", path: "/insights" },
        ]} />

      <PageBanner
        image="articles"
        eyebrow="Notes and analysis"
        title="Articles"
        description={<>Articles from the lawyers at {siteConfig.name} on legal developments and the questions that matter to our clients.</>}
      />

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        {insights.length > 0 ? (
          <InsightsCollection insights={insights} />
        ) : (
          <p className="max-w-xl text-muted-foreground">
            Articles will be published here soon.
          </p>
        )}
      </section>

      <ConsultationSection
        eyebrow="Have a question of your own?"
        heading="Ask the partner who'd actually handle it."
      />
    </div>
  );
}
