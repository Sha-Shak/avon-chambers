import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { ConsultationSection } from "@/components/consultation-section";
import { FadeIn } from "@/components/fade-in";
import { PageBanner } from "@/components/page-banner";
import { PostBody } from "@/components/post-body";
import { JsonLd } from "@/components/seo/json-ld";
import { practiceAreaTitle } from "@/config/case-study.config";
import { mediaConfig } from "@/config/media.config";
import { siteConfig } from "@/config/site.config";
import { getAllCaseStudies, getCaseStudy, getCaseStudySlugs } from "@/lib/content";
import { pictureUrl, formatPostDate } from "@/lib/posts";
import { breadcrumbSchema, caseStudySchema } from "@/lib/schema";
import { buildOpenGraph } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return { title: "Unavailable", robots: { index: false, follow: false } };

  const title = study.seo?.metaTitle ?? study.title;
  const description = study.seo?.metaDescription ?? study.excerpt;
  const image = pictureUrl(study.seo?.ogImage ?? study.coverImage, 1200, 630) ?? mediaConfig.og.default.src;

  return {
    title,
    description,
    keywords: study.seo?.keywords,
    alternates: { canonical: `/case-studies/${study.slug}` },
    robots: study.seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: buildOpenGraph({
      title: `${title} — ${siteConfig.name}`,
      description,
      url: `/case-studies/${study.slug}`,
      type: "article",
      image: { url: image },
      publishedTime: study.publishedAt,
      modifiedTime: study.updatedAt ?? study.publishedAt,
    }),
    twitter: { card: "summary_large_image", title: `${title} — ${siteConfig.name}`, description, images: [image] },
  };
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();

  const moreStudies = (await getAllCaseStudies()).filter((item) => item.slug !== study.slug).slice(0, 3);
  const coverUrl = pictureUrl(study.coverImage, 2000, 1100);
  const client = study.clientName ?? study.clientType;
  const facts = [
    { label: "Matter type", value: study.matterType },
    { label: "Client", value: client },
    { label: "Industry", value: study.industry },
    { label: "Jurisdiction", value: study.jurisdictions?.join(" · ") },
    { label: "Duration", value: study.duration },
    { label: "Result / status", value: study.result },
    { label: "Matter team", value: study.teamMembers?.join(" · ") },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  return (
    <>
      <JsonLd data={caseStudySchema(study)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
          { name: study.title, path: `/case-studies/${study.slug}` },
        ])}
      />

      <PageBanner
        image={coverUrl ? { src: coverUrl, alt: study.coverImage?.alt ?? study.title } : "caseStudies"}
        eyebrow={study.matterType ?? "Case study"}
        title={study.title}
      />

      <article>
        <div className="mx-auto max-w-7xl px-6 pt-12 lg:px-10 lg:pt-16">
          <FadeIn className="mx-auto max-w-4xl">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-[0.6875rem] tracking-[0.2em] text-muted-foreground uppercase hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" /> All case studies
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-foreground/10 py-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4" />
                <time dateTime={study.publishedAt}>{formatPostDate(study.publishedAt)}</time>
              </span>
              {study.practiceAreaSlugs.map((areaSlug) => (
                <Link key={areaSlug} href={`/practice-areas/${areaSlug}`} className="hover:text-foreground">
                  {practiceAreaTitle(areaSlug)}
                </Link>
              ))}
            </div>

            <p className="mt-8 font-serif text-xl leading-relaxed text-foreground sm:text-2xl">{study.excerpt}</p>
          </FadeIn>
        </div>

        {(facts.length > 0 || (study.keyResults?.length ?? 0) > 0) && (
          <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.38fr)] lg:px-10 lg:py-16">
            {study.keyResults && study.keyResults.length > 0 && (
              <FadeIn className="frost grid gap-px overflow-hidden border border-foreground/10 bg-foreground/10 sm:grid-cols-2">
                {study.keyResults.map((item) => (
                  <div key={`${item.value}-${item.label}`} className="bg-background/75 p-7 backdrop-blur-xl">
                    <p className="font-serif text-3xl text-foreground">{item.value}</p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </FadeIn>
            )}

            {facts.length > 0 && (
              <FadeIn delay={80} className="frost p-7">
                <h2 className="text-lg text-foreground">Matter at a glance</h2>
                <dl className="mt-5 divide-y divide-foreground/10 border-t border-foreground/10">
                  {facts.map((fact) => (
                    <div key={fact.label} className="grid gap-1 py-4 sm:grid-cols-[7rem_1fr]">
                      <dt className="text-xs text-muted-foreground">{fact.label}</dt>
                      <dd className="text-sm leading-relaxed text-foreground">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </FadeIn>
            )}
          </section>
        )}

        <section className="mx-auto max-w-3xl px-6 py-12 lg:px-10 lg:py-16">
          <PostBody value={study.body} />
          {study.confidentialityNote && (
            <p className="mt-12 border-t border-foreground/10 pt-6 text-xs leading-relaxed text-muted-foreground">
              {study.confidentialityNote}
            </p>
          )}
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Prior results do not guarantee a similar outcome. Every matter depends on its own facts and circumstances.
          </p>
        </section>
      </article>

      {moreStudies.length > 0 && (
        <section className="border-t border-foreground/10 bg-secondary/50">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
            <FadeIn className="max-w-2xl">
              <p className="eyebrow">Selected experience</p>
              <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">More case studies</h2>
            </FadeIn>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {moreStudies.map((item, index) => (
                <FadeIn key={item.slug} delay={index * 60}>
                  <CaseStudyCard study={item} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      <ConsultationSection eyebrow="Discuss a legal matter" heading="Tell us what you are facing" />
    </>
  );
}
