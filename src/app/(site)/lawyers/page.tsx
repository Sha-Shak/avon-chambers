import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { LawyerGrid } from "@/components/lawyer-grid";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getLawyersByTier, type LawyerTier } from "@/lib/data";
import { breadcrumbSchema } from "@/lib/schema";
import { buildOpenGraph } from "@/lib/seo";

const DESCRIPTION = `Meet the legal professionals of ${siteConfig.name}, a Bangladesh-based set of law chambers.`;

export const metadata: Metadata = {
  title: "Lawyers",
  description: DESCRIPTION,
  alternates: { canonical: "/lawyers" },
  openGraph: buildOpenGraph({ title: `Lawyers — ${siteConfig.name}`, description: DESCRIPTION, url: "/lawyers" }),
};

/** Section heading per tier — plural where that reads naturally, "Of Counsel" stays as-is. */
const TIER_LABELS: Record<LawyerTier, string> = {
  Partner: "Partners",
  "Senior Associate": "Senior Associates",
  Associate: "Associates",
  "Of Counsel": "Of Counsel",
};

export default function LawyersPage() {
  const tiers = getLawyersByTier();

  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Lawyers", path: "/lawyers" },
        ])}
      />

      <section className="border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <FadeIn className="max-w-3xl">
            <p className="eyebrow">Lawyers</p>
            <h1 className="mt-6 text-4xl leading-[1.1] text-foreground sm:text-5xl">
              Legal professionals with a broad range of expertise.
            </h1>
            <p className="mt-7 text-base leading-relaxed text-muted-foreground">
              {siteConfig.name} comprises Barristers, Solicitors, Advocates and Legal Consultants working
              individually and collectively to provide professional legal services.
            </p>
          </FadeIn>
        </div>
      </section>

      {tiers.map(({ tier, lawyers }, i) => (
        <section
          key={tier}
          className={
            i % 2 === 1
              ? "border-y border-foreground/10 bg-secondary/50"
              : "mx-auto max-w-7xl px-6 lg:px-10"
          }
        >
          <div className={i % 2 === 1 ? "mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32" : "py-24 lg:py-32"}>
            <FadeIn className="max-w-2xl">
              <h2 className="text-3xl text-foreground sm:text-4xl">{TIER_LABELS[tier]}</h2>
            </FadeIn>
            <LawyerGrid lawyers={lawyers} className="mt-14" />
          </div>
        </section>
      ))}

      <ConsultationSection eyebrow="Book a consultation" heading="Not sure who to speak with? Start here." />
    </div>
  );
}
