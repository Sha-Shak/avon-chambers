import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { AttorneyDirectory } from "@/components/attorney-directory";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getAllAttorneys } from "@/lib/data";
import { breadcrumbSchema } from "@/lib/schema";

const DESCRIPTION = `Meet the legal professionals of ${siteConfig.name}, a Bangladesh-based set of law chambers.`;

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

      <section className="border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <FadeIn className="max-w-3xl">
            <p className="eyebrow">Attorneys</p>
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
        <AttorneyDirectory attorneys={attorneys} />
      </section>

      <ConsultationSection eyebrow="Book a consultation" heading="Not sure who to speak with? Start here." />
    </div>
  );
}
