import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { PageBanner } from "@/components/page-banner";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getAllCaseStudies } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema";
import { buildOpenGraph } from "@/lib/seo";

const DESCRIPTION = `Explore selected matters handled by ${siteConfig.name}, including the legal issues, approach and outcomes.`;

export const metadata: Metadata = {
  title: "Case Studies",
  description: DESCRIPTION,
  alternates: { canonical: "/case-studies" },
  openGraph: buildOpenGraph({
    title: `Case Studies — ${siteConfig.name}`,
    description: DESCRIPTION,
    url: "/case-studies",
  }),
};

export default async function CaseStudiesPage() {
  const caseStudies = await getAllCaseStudies();

  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
        ])}
      />

      <PageBanner
        image="caseStudies"
        eyebrow="Selected experience"
        title="Case Studies"
        description={<>A closer look at selected matters, the legal issues involved and how {siteConfig.name} approached them.</>}
      />

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        {caseStudies.length > 0 ? (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((study, i) => (
                <FadeIn key={study.slug} delay={i * 60}>
                  <CaseStudyCard study={study} />
                </FadeIn>
              ))}
            </div>
            <p className="mt-10 text-xs text-muted-foreground">Prior results do not guarantee a similar outcome.</p>
          </>
        ) : (
          <div className="mx-auto max-w-xl border border-dashed border-foreground/15 px-8 py-16 text-center">
            <p className="font-serif text-2xl text-foreground">Case studies are being prepared</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Selected matters will appear here once they have been reviewed and published.
            </p>
          </div>
        )}
      </section>

      <ConsultationSection
        eyebrow="Your matter could be next"
        heading="Tell us what you're facing. We'll tell you how we'd approach it."
      />
    </div>
  );
}
