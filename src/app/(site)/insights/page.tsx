import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { InsightsCollection } from "@/components/insights-collection";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getAllInsights } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema";

const DESCRIPTION = `Practical notes and analysis from the partners of ${siteConfig.name} on corporate, litigation, employment, immigration and family law in New York.`;

export const metadata: Metadata = {
  title: "Articles",
  description: DESCRIPTION,
  alternates: { canonical: "/insights" },
  openGraph: {
    title: `Articles — ${siteConfig.name}`,
    description: DESCRIPTION,
    url: "/insights",
  },
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

      <section className="border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <FadeIn className="max-w-2xl">
            <p className="eyebrow">Notes and analysis</p>
            <h1 className="mt-4 text-4xl text-foreground sm:text-5xl">
              Articles
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Practical writing from the partners at {siteConfig.name} — the
              questions clients actually ask, answered in the open.
            </p>
          </FadeIn>
        </div>
      </section>

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
