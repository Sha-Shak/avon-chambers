import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { PageBanner } from "@/components/page-banner";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getAllCaseStudies } from "@/lib/data";
import { breadcrumbSchema } from "@/lib/schema";
import { buildOpenGraph } from "@/lib/seo";

const DESCRIPTION = `Learn about the legal services and practice areas offered by ${siteConfig.name} in Bangladesh.`;

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

export default function CaseStudiesPage() {
  const caseStudies = getAllCaseStudies();

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
        eyebrow="Our services"
        title="Practice Areas"
        description={<>Avon Chambers provides practical legal advice and representation across a range of legal matters. Contact us to discuss the support you require.</>}
      />

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-3">
          {caseStudies.map((study, i) => (
            <FadeIn key={study.slug} delay={i * 60}>
              <CaseStudyCard study={study} />
            </FadeIn>
          ))}
        </div>
        <p className="mt-10 text-xs text-muted-foreground">Prior results do not guarantee a similar outcome.</p>
      </section>

      <ConsultationSection
        eyebrow="Your matter could be next"
        heading="Tell us what you're facing. We'll tell you how we'd approach it."
      />
    </div>
  );
}
