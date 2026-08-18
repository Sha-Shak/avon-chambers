import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { PracticeAreaCard } from "@/components/cards/practice-area-card";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getAllPracticeAreas } from "@/lib/data";
import { breadcrumbSchema } from "@/lib/schema";

const DESCRIPTION = `Explore the legal practice areas of ${siteConfig.name}, a Bangladesh-based set of law chambers.`;

export const metadata: Metadata = {
  title: "Practice Areas",
  description: DESCRIPTION,
  alternates: { canonical: "/practice-areas" },
  openGraph: { title: `Practice Areas — ${siteConfig.name}`, description: DESCRIPTION, url: "/practice-areas" },
};

export default function PracticeAreasPage() {
  const practiceAreas = getAllPracticeAreas();
  const approach = [
    { value: "Service", label: "Dedicated service" },
    { value: String(practiceAreas.length), label: "Practice areas" },
    { value: "Advice", label: "Practical legal advice" },
    { value: "Care", label: "Confidentiality assured" },
  ];

  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Practice Areas", path: "/practice-areas" },
        ])}
      />

      <section className="border-b border-foreground/10">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:px-10 lg:py-28">
          <FadeIn>
            <p className="eyebrow">Practice areas</p>
            <h1 className="mt-6 text-4xl leading-[1.1] text-foreground sm:text-5xl">
              Comprehensive legal advice under one roof.
            </h1>
            <p className="mt-7 text-base leading-relaxed text-muted-foreground">
              Avon Chambers brings together Barristers, Solicitors, Advocates and Legal Consultants with
              individual expertise in a range of legal matters. Explore our {practiceAreas.length} practice
              areas to learn how we may assist.
            </p>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              We provide professional advice and all-round legal services to corporate firms, companies and
              private clients, with practical solutions tailored to their requirements.
            </p>
          </FadeIn>
          <FadeIn delay={120} className="grid grid-cols-2 gap-8 self-center">
            {approach.map((a) => (
              <div key={a.label} className="border-l border-foreground/15 pl-5">
                <span className="block font-serif text-3xl text-foreground">{a.value}</span>
                <p className="mt-2 text-xs leading-snug text-muted-foreground">{a.label}</p>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <FadeIn className="max-w-2xl">
          <p className="eyebrow">What we handle</p>
          <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">Select an area</h2>
        </FadeIn>
        <div className="mt-14 grid gap-px border border-foreground/10 bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
          {practiceAreas.map((area, i) => (
            <FadeIn key={area.slug} delay={i * 60} className="flex bg-card">
              <PracticeAreaCard area={area} />
            </FadeIn>
          ))}
        </div>
      </section>

      <ConsultationSection
        eyebrow="Not sure which area applies?"
        heading="Describe the situation. We'll tell you who should handle it."
      />
    </div>
  );
}
