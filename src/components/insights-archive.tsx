import { articlePagePath } from "@/lib/article-pagination";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageBanner } from "@/components/page-banner";
import { InsightsCollection } from "@/components/insights-collection";
import { ConsultationSection } from "@/components/consultation-section";
import { siteConfig } from "@/config/site.config";
import { getAllInsights } from "@/lib/content";

export async function InsightsArchive({ page = 1 }: { page?: number }) {
  const insights = await getAllInsights();

  return (
    <div>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Articles", path: "/insights" },
          ...(page > 1
            ? [{ name: `Page ${page}`, path: articlePagePath(page) }]
            : []),
        ]}
      />

      <PageBanner
        image="articles"
        eyebrow="Notes and analysis"
        title="Articles"
        description={
          <>
            Articles from the lawyers at {siteConfig.name} on legal developments
            and the questions that matter to our clients.
          </>
        }
      />

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        {insights.length > 0 ? (
          <InsightsCollection insights={insights} page={page} />
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
