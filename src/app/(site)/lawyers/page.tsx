import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { LawyerGrid } from "@/components/lawyer-grid";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getLawyersByTier } from "@/lib/data";
import { breadcrumbSchema } from "@/lib/schema";
import { buildOpenGraph } from "@/lib/seo";

const DESCRIPTION = `Meet the legal professionals of ${siteConfig.name}, a Bangladesh-based set of law chambers.`;

export const metadata: Metadata = {
  title: "Lawyers",
  description: DESCRIPTION,
  alternates: { canonical: "/lawyers" },
  openGraph: buildOpenGraph({ title: `Lawyers — ${siteConfig.name}`, description: DESCRIPTION, url: "/lawyers" }),
};

export default function LawyersPage() {
  const tiers = getLawyersByTier();

  // Partners get their own row split — the most senior partner alone,
  // then the rest — rather than one flat row; every other tier is already
  // in its intended display order via each lawyer's `position`.
  const partners = tiers.find((t) => t.tier === "Partner")?.lawyers ?? [];
  const [leadPartner, ...otherPartners] = partners;
  // Senior Associates, Associates and Of Counsel all flow through one
  // undivided section (no border/background split between them), wrapping
  // naturally at up to 4 per row.
  const restOfTeam = [
    ...(tiers.find((t) => t.tier === "Senior Associate")?.lawyers ?? []),
    ...(tiers.find((t) => t.tier === "Associate")?.lawyers ?? []),
    ...(tiers.find((t) => t.tier === "Of Counsel")?.lawyers ?? []),
  ];

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

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        {leadPartner && <LawyerGrid lawyers={[leadPartner]} />}
        {otherPartners.length > 0 && <LawyerGrid lawyers={otherPartners} className="mt-12" />}
        <LawyerGrid lawyers={restOfTeam} className="mt-12" />
      </section>

      <ConsultationSection eyebrow="Book a consultation" heading="Not sure who to speak with? Start here." />
    </div>
  );
}
