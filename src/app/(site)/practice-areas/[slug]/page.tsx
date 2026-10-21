import { PracticeLanguageSwitcher } from "@/components/practice-language-switcher";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { LawyerGrid } from "@/components/lawyer-grid";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { InsightCard } from "@/components/cards/insight-card";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { PracticeAreaIcon } from "@/lib/icons";
import {
  getAllPracticeAreas,
  getAllLawyers,
  getLawyersForPracticeArea,
  getPracticeArea,
} from "@/lib/data";
import { getCaseStudiesByPracticeArea, getInsightsByPracticeArea } from "@/lib/content";
import { breadcrumbSchema, practiceAreaSchema } from "@/lib/schema";
import { buildSocialMetadata } from "@/lib/seo";
import { practiceLocalizations } from "@/data/practice-localizations";
import { PRACTICE_PROCESS, PRACTICE_DOCUMENTS } from "@/config/practice-guidance";
import { practiceSeo, practiceAnswer } from "@/lib/page-seo";
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
  const { title: seoTitle, description } = practiceSeo(area);

  return {
    title: seoTitle,
    description,
    alternates: {
      canonical: `/practice-areas/${area.slug}`,
      ...(practiceLocalizations[area.slug] ? { languages: {
        "en-BD": `/practice-areas/${area.slug}`,
        "bn-BD": `/bn/practice-areas/${area.slug}`,
        "x-default": `/practice-areas/${area.slug}`,
      } } : {}),
    },
    ...buildSocialMetadata({
      title: `${seoTitle} | ${siteConfig.name}`,
      description,
      url: `/practice-areas/${area.slug}`,
    }),
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

  const reviewer = area.reviewedBySlug ? getAllLawyers().find((lawyer) => lawyer.slug === area.reviewedBySlug) : undefined;
  const process = area.process ?? PRACTICE_PROCESS;
  const documents = area.documents ?? PRACTICE_DOCUMENTS[area.id] ?? [];
  const relatedLawyers = getLawyersForPracticeArea(area.id);
  const [relatedCases, relatedInsights] = await Promise.all([
    getCaseStudiesByPracticeArea(area.id),
    getInsightsByPracticeArea(area.id),
  ]);
  const relatedAreas = getAllPracticeAreas().filter((candidate) =>
    candidate.id !== area.id && relatedLawyers.some((lawyer) => lawyer.practiceAreaIds.includes(candidate.id)),
  ).slice(0, 4);
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
          preload
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
            {practiceLocalizations[area.slug] && (
              <PracticeLanguageSwitcher locale="en" slug={area.slug} />
            )}
            <h1 className="mt-8 text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">{area.title} in Dhaka, Bangladesh</h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-cream/70">{practiceAnswer(area)}</p>
            {reviewer && area.reviewedAt && (
              <p className="mt-5 text-sm text-cream/80">Last reviewed by <Link className="underline" href={`/lawyers/${reviewer.slug}`}>{reviewer.name}</Link>{" "}
                on <time dateTime={area.reviewedAt}>{new Date(area.reviewedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time>.
              </p>
            )}
          </FadeIn>
        </div>
      </section>

      <section className="border-b border-foreground/10 bg-secondary/50">
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

      <section className="border-b border-foreground/10">
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

      {(process.length || documents.length) ? (
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-2 lg:px-10">
          {process.length > 0 && (
            <div><h2 className="text-2xl">Process and timeline</h2><ol className="mt-6 space-y-5">
              {process.map((step) => <li key={step.title}><h3 className="font-medium">{step.title}</h3><p className="mt-2 text-muted-foreground">{step.copy}</p></li>)}
            </ol></div>
          )}
          {documents.length > 0 && (
            <div><h2 className="text-2xl">Documents to prepare</h2><p className="mt-3 text-sm text-muted-foreground">These can help us assess your matter. Bring what you have; we will confirm any additional documents needed for your case.</p><ul className="mt-6 list-disc space-y-3 pl-5">
              {documents.map((document) => <li key={document}>{document}</li>)}
            </ul></div>
          )}
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.35fr_0.65fr]">
          <FadeIn>
            <p className="eyebrow">Common questions</p>
            <h2 className="mt-5 text-2xl text-foreground sm:text-3xl">What clients ask before engaging us</h2>
          </FadeIn>
          <div>
            <div className="border-t border-foreground/15">
              {area.faqs.map((f) => (
                <details key={f.q} className="group border-b border-foreground/15">
                  <summary className="cursor-pointer py-6 text-base text-foreground">{f.q}</summary>
                  <p className="pb-6 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {relatedLawyers.length > 0 && (
        <section className="border-y border-foreground/10 bg-secondary/50">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
            <FadeIn className="max-w-2xl">
              <p className="eyebrow">The team</p>
              <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">Lawyers in this practice</h2>
            </FadeIn>
            <LawyerGrid lawyers={relatedLawyers} gap="gap-8" className="mt-14" />
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

      {relatedInsights.length > 0 && (
        <section className="border-t border-foreground/10 bg-secondary/50">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
            <FadeIn className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div className="max-w-2xl">
                <p className="eyebrow">Related analysis</p>
                <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">Articles on {area.title}</h2>
              </div>
              <Link
                href="/insights"
                className="inline-flex items-center gap-2 text-[0.75rem] tracking-[0.14em] text-foreground uppercase"
              >
                All articles <ArrowUpRight className="size-4" />
              </Link>
            </FadeIn>
            <div className="mt-14 grid gap-px border border-foreground/10 bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
              {relatedInsights.map((insight, index) => (
                <FadeIn key={insight.slug} delay={index * 60}>
                  <InsightCard insight={insight} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedAreas.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <h2 className="text-2xl text-foreground">Related practice areas</h2>
          <ul className="mt-6 flex flex-wrap gap-4">
            {relatedAreas.map((related) => (
              <li key={related.id}><Link className="underline" href={`/practice-areas/${related.slug}`}>{related.title}</Link></li>
            ))}
          </ul>
        </section>
      )}

      <ConsultationSection
        eyebrow={`${area.title} · Book a consultation`}
        heading={`Speak with a ${area.title.toLowerCase()} partner.`}
      />
    </div>
  );
}
