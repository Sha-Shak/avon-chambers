import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { InsightsCollection } from "@/components/insights-collection";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getAllInsights } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema";
import { buildOpenGraph } from "@/lib/seo";

const DESCRIPTION = `Articles and legal insights from ${siteConfig.name} in Bangladesh.`;

export const metadata: Metadata = {
  title: "Articles",
  description: DESCRIPTION,
  alternates: { canonical: "/insights" },
  openGraph: buildOpenGraph({
    title: `Articles — ${siteConfig.name}`,
    description: DESCRIPTION,
    url: "/insights",
  }),
};

export default async function InsightsPage() {
  const insights = await getAllInsights();

  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Articles", path: "/insights" },
        ])}
      />

      <PageBanner
        image="articles"
        eyebrow="Notes and analysis"
        title="Articles"
        description={<>Practical writing from the partners at {siteConfig.name} — the questions clients actually ask, answered in the open.</>}
      />

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        {insights.length > 0 ? (
          <InsightsCollection insights={insights} />
        ) : (
          <p className="max-w-xl text-muted-foreground">
            New writing is on its way — check back shortly.
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
