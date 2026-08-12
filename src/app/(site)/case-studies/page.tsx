import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getAllCaseStudies } from "@/lib/data";
import { breadcrumbSchema } from "@/lib/schema";

const DESCRIPTION = `Selected outcomes from ${siteConfig.name}: settlements, acquisitions and defences across corporate, commercial litigation and employment matters in New York.`;

export const metadata: Metadata = {
  title: "Case Studies",
  description: DESCRIPTION,
  alternates: { canonical: "/case-studies" },
  openGraph: { title: `Case Studies — ${siteConfig.name}`, description: DESCRIPTION, url: "/case-studies" },
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

      <section className="border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <FadeIn className="max-w-2xl">
            <p className="eyebrow">Selected outcomes</p>
            <h1 className="mt-4 text-4xl text-foreground sm:text-5xl">Case Studies</h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              A sample of matters we&rsquo;ve resolved for clients, described at the level of detail our
              confidentiality obligations allow. Each links back to the practice area and, where public, the
              partner who led it.
            </p>
          </FadeIn>
        </div>
      </section>

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
