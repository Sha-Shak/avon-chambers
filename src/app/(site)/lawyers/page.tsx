import { Breadcrumbs } from "@/components/breadcrumbs";
import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { LawyerGrid } from "@/components/lawyer-grid";
import { ConsultationSection } from "@/components/consultation-section";
import { siteConfig } from "@/config/site.config";
import { getLawyersByTier } from "@/lib/data";
import { buildSocialMetadata } from "@/lib/seo";

const DESCRIPTION = `Meet the barristers, advocates and legal consultants at ${siteConfig.name} in Dhanmondi, Dhaka. View their practice areas, qualifications and experience.`;

export const metadata: Metadata = {
  title: "Our Lawyers in Bangladesh",
  description: DESCRIPTION,
  alternates: { canonical: "/lawyers" },
  ...buildSocialMetadata({ title: `Lawyers | ${siteConfig.name}`, description: DESCRIPTION, url: "/lawyers" }),
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
      <Breadcrumbs items={[
          { name: "Home", path: "/" },
          { name: "Lawyers", path: "/lawyers" },
        ]} />

      <PageBanner
        image="lawyers"
        eyebrow="Lawyers"
        title="Our Lawyers in Bangladesh"
        description={<>{siteConfig.name} comprises Barristers, Solicitors, Advocates and Legal Consultants working individually and collectively to provide professional legal services.</>}
      />

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        {leadPartner && <LawyerGrid lawyers={[leadPartner]} />}
        {otherPartners.length > 0 && <LawyerGrid lawyers={otherPartners} className="mt-12" />}
        <LawyerGrid lawyers={restOfTeam} className="mt-12" />
      </section>

      <ConsultationSection eyebrow="Book a consultation" heading="Not sure who to speak with? Start here." />
    </div>
  );
}
