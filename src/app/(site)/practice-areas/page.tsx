import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { PracticeAreaCard } from "@/components/cards/practice-area-card";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getAllAttorneys, getAllPracticeAreas } from "@/lib/data";
import { breadcrumbSchema } from "@/lib/schema";

const DESCRIPTION = `Six practice areas at ${siteConfig.name}: corporate law, litigation, family law, immigration, real estate and employment law — each led by a partner.`;

export const metadata: Metadata = {
  title: "Practice Areas",
  description: DESCRIPTION,
  alternates: { canonical: "/practice-areas" },
  openGraph: { title: `Practice Areas — ${siteConfig.name}`, description: DESCRIPTION, url: "/practice-areas" },
};

export default function PracticeAreasPage() {
  const practiceAreas = getAllPracticeAreas();
  const totalLawyers = getAllAttorneys().length;

  const approach = [
    { value: String(siteConfig.stats.totalLawyers), label: "Lawyers in the firm" },
    { value: String(practiceAreas.length), label: "Practice areas" },
    { value: "1", label: "Partner per matter" },
    { value: siteConfig.stats.responseCommitment, label: "Response commitment" },
  ];

  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Practice Areas", path: "/practice-areas" },
        ])}
      />

      <section className="border-b border-navy/10">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:px-10 lg:py-28">
          <FadeIn>
            <p className="eyebrow">Practice areas</p>
            <h1 className="mt-6 text-4xl leading-[1.1] text-navy sm:text-5xl">
              We practise six areas of law, and decline the rest.
            </h1>
            <p className="mt-7 text-base leading-relaxed text-slate">
              A firm of {siteConfig.stats.totalLawyers} lawyers cannot credibly do everything, so we do not
              try. Each of our {practiceAreas.length} practice areas is led by a partner who has spent at
              least a decade in it, and each engagement is scoped and priced in writing before work begins.
            </p>
            <p className="mt-5 text-base leading-relaxed text-slate">
              The areas overlap on purpose. A shareholder dispute is a corporate matter and a litigation
              matter; an executive hire is employment and immigration. Because the whole firm sits on one
              floor, those matters are handled by the people who see both sides of them rather than passed
              between departments.
            </p>
          </FadeIn>
          <FadeIn delay={120} className="grid grid-cols-2 gap-8 self-center">
            {approach.map((a) => (
              <div key={a.label} className="border-l border-navy/15 pl-5">
                <p className="font-serif text-3xl text-navy">{a.value}</p>
                <p className="mt-2 text-xs leading-snug text-slate">{a.label}</p>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <FadeIn className="max-w-2xl">
          <p className="eyebrow">What we handle</p>
          <h2 className="mt-5 text-3xl text-navy sm:text-4xl">Select an area</h2>
        </FadeIn>
        <div className="mt-14 grid gap-px border border-navy/10 bg-navy/10 sm:grid-cols-2 lg:grid-cols-3">
          {practiceAreas.map((area, i) => (
            <FadeIn key={area.slug} delay={i * 60} className="flex bg-card">
              <PracticeAreaCard area={area} />
            </FadeIn>
          ))}
        </div>
        {totalLawyers < siteConfig.stats.totalLawyers && (
          <p className="mt-6 text-xs text-slate">
            Full profiles are published for our partners and senior associates; the firm total above reflects
            everyone currently practising at {siteConfig.name}.
          </p>
        )}
      </section>

      <ConsultationSection
        eyebrow="Not sure which area applies?"
        heading="Describe the situation. We'll tell you who should handle it."
      />
    </div>
  );
}
