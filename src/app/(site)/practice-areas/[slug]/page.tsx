import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { AttorneyGrid } from "@/components/attorney-grid";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PracticeAreaIcon } from "@/lib/icons";
import {
  getAllPracticeAreas,
  getAttorneys,
  getCaseStudies,
  getPracticeArea,
} from "@/lib/data";
import { breadcrumbSchema, practiceAreaSchema } from "@/lib/schema";
import { siteConfig } from "@/config/site.config";

export function generateStaticParams() {
  return getAllPracticeAreas().map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = getPracticeArea(slug);
  if (!area) return { title: "Unavailable", robots: { index: false, follow: false } };

  return {
    title: area.title,
    description: area.valueProp,
    alternates: { canonical: `/practice-areas/${area.slug}` },
    openGraph: {
      title: `${area.title} — ${siteConfig.name}`,
      description: area.valueProp,
      url: `/practice-areas/${area.slug}`,
    },
  };
}

export default async function PracticeAreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = getPracticeArea(slug);
  if (!area) notFound();

  const relatedAttorneys = getAttorneys(area.attorneySlugs);
  const relatedCases = getCaseStudies(area.caseStudySlugs);
  const { service, faqPage } = practiceAreaSchema(area);

  return (
    <div>
      <JsonLd data={service} />
      {faqPage && <JsonLd data={faqPage} />}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Practice Areas", path: "/practice-areas" },
          { name: area.title, path: `/practice-areas/${area.slug}` },
        ])}
      />

      <div className="relative aspect-21/9 w-full overflow-hidden">
        <Image
          src={area.image.src}
          alt={area.image.alt}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </div>

      <section className="bg-navy text-cream">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <FadeIn className="max-w-3xl">
            <div className="flex items-center gap-4">
              <PracticeAreaIcon name={area.icon} className="size-6 text-cream/60" strokeWidth={1.25} />
              <Link
                href="/practice-areas"
                className="text-[0.6875rem] tracking-[0.2em] text-cream/50 uppercase hover:text-cream"
              >
                Practice areas
              </Link>
            </div>
            <h1 className="mt-8 text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">{area.title}</h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-cream/70">{area.valueProp}</p>
          </FadeIn>
        </div>
      </section>

      <section className="border-b border-foreground/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[0.35fr_0.65fr] lg:px-10 lg:py-28">
          <FadeIn>
            <p className="eyebrow">Overview</p>
            <h2 className="mt-5 text-2xl text-foreground sm:text-3xl">What we handle</h2>
          </FadeIn>
          <FadeIn delay={80} className="space-y-6">
            {area.overview.map((p) => (
              <p key={p.slice(0, 24)} className="text-base leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </FadeIn>
        </div>
      </section>

      <section className="border-b border-foreground/10 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
          <FadeIn className="max-w-2xl">
            <p className="eyebrow">How we help</p>
            <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">Services within {area.title}</h2>
          </FadeIn>
          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {area.services.map((s, i) => (
              <FadeIn key={s.title} delay={i * 60} className="border-t border-foreground/20 pt-6">
                <span className="font-serif text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-xl text-foreground">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.copy}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.35fr_0.65fr]">
          <FadeIn>
            <p className="eyebrow">Common questions</p>
            <h2 className="mt-5 text-2xl text-foreground sm:text-3xl">What clients ask before engaging us</h2>
          </FadeIn>
          <FadeIn delay={80}>
            <Accordion type="single" collapsible className="border-t border-foreground/15">
              {area.faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`} className="border-b border-foreground/15">
                  <AccordionTrigger className="py-6 text-left text-base text-foreground hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </section>

      {relatedAttorneys.length > 0 && (
        <section className="border-y border-foreground/10 bg-secondary/50">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
            <FadeIn className="max-w-2xl">
              <p className="eyebrow">The team</p>
              <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">Attorneys in this practice</h2>
            </FadeIn>
            <AttorneyGrid attorneys={relatedAttorneys} gap="gap-8" className="mt-14" />
          </div>
        </section>
      )}

      {relatedCases.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
          <FadeIn className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow">Selected outcomes</p>
              <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">Related case studies</h2>
            </div>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-[0.75rem] tracking-[0.14em] text-foreground uppercase"
            >
              All case studies <ArrowUpRight className="size-4" />
            </Link>
          </FadeIn>
          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {relatedCases.map((c, i) => (
              <FadeIn key={c.slug} delay={i * 60}>
                <CaseStudyCard study={c} />
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      <ConsultationSection
        eyebrow={`${area.title} · Book a consultation`}
        heading={`Speak with a ${area.title.toLowerCase()} partner.`}
      />
    </div>
  );
}
