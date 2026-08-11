import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { AttorneyCard } from "@/components/cards/attorney-card";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getAllAttorneys } from "@/lib/data";
import { breadcrumbSchema } from "@/lib/schema";

const DESCRIPTION = `Meet the attorneys of ${siteConfig.name} — a boutique New York practice where a partner leads every matter.`;

export const metadata: Metadata = {
  title: "Attorneys",
  description: DESCRIPTION,
  alternates: { canonical: "/attorneys" },
  openGraph: { title: `Attorneys — ${siteConfig.name}`, description: DESCRIPTION, url: "/attorneys" },
};

export default function AttorneysPage() {
  const attorneys = getAllAttorneys();

  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Attorneys", path: "/attorneys" },
        ])}
      />

      <section className="border-b border-navy/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <FadeIn className="max-w-3xl">
            <p className="eyebrow">Attorneys</p>
            <h1 className="mt-6 text-4xl leading-[1.1] text-navy sm:text-5xl">
              {siteConfig.stats.totalLawyers} lawyers. The one you meet is the one who does the work.
            </h1>
            <p className="mt-7 text-base leading-relaxed text-slate">
              Every engagement at {siteConfig.name} is led by a partner from the first call to the last
              filing. Associates support the mechanics; they do not inherit the matter.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {attorneys.map((a, i) => (
            <FadeIn key={a.slug} delay={i * 60}>
              <AttorneyCard attorney={a} />
            </FadeIn>
          ))}
        </div>
      </section>

      <ConsultationSection eyebrow="Book a consultation" heading="Not sure who to speak with? Start here." />
    </div>
  );
}
