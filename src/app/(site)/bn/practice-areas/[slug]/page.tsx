import { PostCard } from "@/components/post-collection";
import { JobCard } from "@/components/cards/job-card";
import { newsEventCard, proBonoCard } from "@/lib/posts";
import { webPageSchema } from "@/lib/schema";
import { Breadcrumbs } from "@/components/breadcrumbs";
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
import { getCaseStudiesByPracticeArea, getInsightsByPracticeArea, getNewsEventsByPracticeArea, getProBonoByPracticeArea, getJobsByPracticeArea } from "@/lib/content";
import { practiceAreaSchema } from "@/lib/schema";
import { buildSocialMetadata } from "@/lib/seo";
import { practiceLocalizations } from "@/data/practice-localizations";
import { PRACTICE_PROCESS, PRACTICE_DOCUMENTS } from "@/config/practice-guidance";
import { banglaPractice, banglaGuidance as t } from "@/lib/practice-bangla";
import { siteConfig } from "@/config/site.config";

export const dynamicParams = false;
export function generateStaticParams() {
  return getAllPracticeAreas().map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const original = getPracticeArea(slug);
  const area = original ? banglaPractice(original) : undefined;
  if (!area) return { title: "Unavailable", robots: { index: false, follow: false } };
  const seoTitle = `${area.title} | ঢাকা, বাংলাদেশ`;
  const description = area.copy;

  const social = buildSocialMetadata({ title: `${seoTitle} | ${siteConfig.name}`, description, url: `/bn/practice-areas/${area.slug}` });
  return {
    title: seoTitle,
    description,
    alternates: {
      canonical: `/bn/practice-areas/${area.slug}`,
      ...(practiceLocalizations[area.slug] ? { languages: {
        "en-BD": `/practice-areas/${area.slug}`,
        "bn-BD": `/bn/practice-areas/${area.slug}`,
        "x-default": `/practice-areas/${area.slug}`,
      } } : {}),
    },
    ...social,
    openGraph: { ...social.openGraph, locale: "bn_BD", alternateLocale: ["en_BD"] },
  };
}

export default async function PracticeAreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const original = getPracticeArea(slug);
  const area = original ? banglaPractice(original) : undefined;
  if (!area) notFound();

  const reviewer = area.reviewedBySlug ? getAllLawyers().find((lawyer) => lawyer.slug === area.reviewedBySlug) : undefined;
  const process = (area.process ?? PRACTICE_PROCESS).map((step) => ({ title: t(step.title), copy: t(step.copy) }));
  const documents = (area.documents ?? PRACTICE_DOCUMENTS[area.id] ?? []).map(t);
  const relatedLawyers = getLawyersForPracticeArea(area.id);
  const [relatedCases, relatedInsights, relatedNews, relatedProBono, relatedJobs] = await Promise.all([
    getCaseStudiesByPracticeArea(area.id),
    getInsightsByPracticeArea(area.id),
    getNewsEventsByPracticeArea(area.id),
    getProBonoByPracticeArea(area.id),
    getJobsByPracticeArea(area.id),
  ]);
  const relatedAreas = getAllPracticeAreas().filter((candidate) =>
    candidate.id !== area.id && relatedLawyers.some((lawyer) => lawyer.practiceAreaIds.includes(candidate.id)),
  ).slice(0, 4).map(banglaPractice);
  const schemas = practiceAreaSchema(area);
  const service = { ...schemas.service, "@id": `${siteConfig.url}/bn/practice-areas/${area.slug}#service`, description: area.copy, url: `${siteConfig.url}/bn/practice-areas/${area.slug}` };
  const faqPage = schemas.faqPage ? { ...schemas.faqPage, inLanguage: "bn-BD" } : undefined;

  return (
    <div lang="bn" className="[&_h1]:leading-normal [&_h2]:leading-normal [&_h3]:leading-normal">
      <JsonLd data={service} />
      <JsonLd data={webPageSchema(`/bn/practice-areas/${area.slug}`, area.title, "WebPage", service["@id"])} />
      {faqPage && <JsonLd data={faqPage} />}
      <Breadcrumbs items={[
          { name: "হোম", path: "/" },
          { name: "সেবার ক্ষেত্র", path: "/bn/practice-areas" },
          { name: area.title, path: `/bn/practice-areas/${area.slug}` },
        ]} />

      <div className="relative aspect-21/9 w-full overflow-hidden">
        <Image
          src={area.image.src}
          alt={area.image.alt}
          fill
          sizes="100vw"
          preload
          quality={60}
          className="object-cover"
        />
      </div>

      <section className="bg-navy text-cream">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <FadeIn className="max-w-3xl">
            <div className="flex items-center gap-4">
              <PracticeAreaIcon name={area.icon} className="size-6 text-cream/60" strokeWidth={1.25} />
              <Link
                href="/bn/practice-areas"
                className="text-[0.6875rem] tracking-[0.2em] text-cream/50 uppercase hover:text-cream"
              >
                সেবার ক্ষেত্র
              </Link>
            </div>
            {practiceLocalizations[area.slug] && (
              <PracticeLanguageSwitcher locale="bn" slug={area.slug} />
            )}
            <h1 className="mt-8 text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">ঢাকা, বাংলাদেশে {area.title}</h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-cream/70">অ্যাভন চেম্বার্স ঢাকার ধানমন্ডির কার্যালয় থেকে সারা বাংলাদেশের ক্লায়েন্টকে {area.title} বিষয়ে পরামর্শ দেয়। {area.valueProp}</p>
            {reviewer && area.reviewedAt && (
              <p className="mt-5 text-sm text-cream/80">সর্বশেষ পর্যালোচনা করেছেন <Link className="underline" href={`/lawyers/${reviewer.slug}`}>{reviewer.name}</Link>{" "}
                তারিখ <time dateTime={area.reviewedAt}>{new Date(area.reviewedAt).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time>.
              </p>
            )}
          </FadeIn>
        </div>
      </section>

      <section className="border-b border-foreground/10 bg-secondary/50">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[0.35fr_0.65fr] lg:px-10 lg:py-28">
          <FadeIn>
            <p className="eyebrow">পরিচিতি</p>
            <h2 className="mt-5 text-2xl text-foreground sm:text-3xl">আমরা যেসব বিষয় নিয়ে কাজ করি</h2>
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
            <p className="eyebrow">আমাদের সহায়তা</p>
            <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">{area.title}: আমাদের সেবা</h2>
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
            <div><h2 className="text-2xl">কাজের ধাপ ও সময়সীমা</h2><ol className="mt-6 space-y-5">
              {process.map((step) => <li key={step.title}><h3 className="font-medium">{step.title}</h3><p className="mt-2 text-muted-foreground">{step.copy}</p></li>)}
            </ol></div>
          )}
          {documents.length > 0 && (
            <div><h2 className="text-2xl">প্রস্তুত রাখার নথি</h2><p className="mt-3 text-sm text-muted-foreground">এই নথিগুলো আপনার বিষয়টি মূল্যায়নে সহায়ক। আপনার কাছে যা আছে তা নিয়ে আসুন। অতিরিক্ত কী কী নথি প্রয়োজন, আমরা তা জানাব।</p><ul className="mt-6 list-disc space-y-3 pl-5">
              {documents.map((document) => <li key={document}>{document}</li>)}
            </ul></div>
          )}
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.35fr_0.65fr]">
          <FadeIn>
            <p className="eyebrow">সাধারণ প্রশ্ন</p>
            <h2 className="mt-5 text-2xl text-foreground sm:text-3xl">কাজ শুরু করার আগে ক্লায়েন্টদের প্রশ্ন</h2>
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
              <p className="eyebrow">আমাদের দল</p>
              <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">এই ক্ষেত্রে কর্মরত আইনজীবী</h2>
            </FadeIn>
            <LawyerGrid lawyers={relatedLawyers} locale="bn" gap="gap-8" className="mt-14" />
          </div>
        </section>
      )}

      {relatedCases.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
          <FadeIn className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow">নির্বাচিত ফলাফল</p>
              <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">সংশ্লিষ্ট মামলার বিবরণ (ইংরেজি)</h2>
            </div>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-[0.75rem] tracking-[0.14em] text-foreground uppercase"
            >
              সব মামলার বিবরণ (ইংরেজি) <ArrowUpRight className="size-4" />
            </Link>
          </FadeIn>
          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {relatedCases.map((c, i) => (
              <FadeIn key={c.slug} delay={i * 60}>
                <div lang="en"><CaseStudyCard study={c} /></div>
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
                <p className="eyebrow">সংশ্লিষ্ট বিশ্লেষণ</p>
                <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">{area.title} বিষয়ক নিবন্ধ (ইংরেজি)</h2>
              </div>
              <Link
                href="/insights"
                className="inline-flex items-center gap-2 text-[0.75rem] tracking-[0.14em] text-foreground uppercase"
              >
                সব নিবন্ধ (ইংরেজি) <ArrowUpRight className="size-4" />
              </Link>
            </FadeIn>
            <div className="mt-14 grid gap-px border border-foreground/10 bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
              {relatedInsights.map((insight, index) => (
                <FadeIn key={insight.slug} delay={index * 60}>
                  <div lang="en"><InsightCard insight={insight} /></div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedNews.length > 0 && <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10"><h2 className="text-2xl">সংশ্লিষ্ট সংবাদ ও মামলার আপডেট (ইংরেজি)</h2><div lang="en" className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{relatedNews.map((post) => <PostCard key={post.slug} post={newsEventCard(post)} />)}</div></section>}

      {relatedProBono.length > 0 && <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10"><h2 className="text-2xl">সংশ্লিষ্ট প্রো বোনো উদ্যোগ</h2><div lang="en" className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{relatedProBono.map((post) => <PostCard key={post.slug} post={proBonoCard(post)} />)}</div></section>}
      {relatedJobs.length > 0 && <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10"><h2 className="text-2xl">এই সেবার ক্ষেত্রে কাজের সুযোগ</h2><div lang="en" className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{relatedJobs.map((job) => <JobCard key={job.slug} job={job} />)}</div></section>}

      {relatedAreas.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <h2 className="text-2xl text-foreground">সংশ্লিষ্ট সেবার ক্ষেত্র</h2>
          <ul className="mt-6 flex flex-wrap gap-4">
            {relatedAreas.map((related) => (
              <li key={related.id}><Link className="underline" href={`/bn/practice-areas/${related.slug}`}>{related.title}</Link></li>
            ))}
          </ul>
        </section>
      )}

      <ConsultationSection
        locale="bn" eyebrow={`${area.title} · পরামর্শের সময় নিন`}
        heading={`${area.title} বিষয়ে আমাদের পার্টনারের সঙ্গে কথা বলুন।`}
      />
    </div>
  );
}
