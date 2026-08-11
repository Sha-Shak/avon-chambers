import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Gem, ShieldCheck, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/fade-in";
import { PracticeAreaCard } from "@/components/cards/practice-area-card";
import { AttorneyCard } from "@/components/cards/attorney-card";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { InsightCard } from "@/components/cards/insight-card";
import { ConsultationSection } from "@/components/consultation-section";
import { siteConfig } from "@/config/site.config";
import { mediaConfig } from "@/config/media.config";
import { getAllAttorneys, getAllCaseStudies, getAllPracticeAreas } from "@/lib/data";
import { getAllInsights } from "@/lib/content";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: { title: `${siteConfig.name} — ${siteConfig.tagline}`, description: siteConfig.description, url: "/" },
};

const trustBadges = [
  { value: siteConfig.foundingDate, label: `Founded · ${new Date().getFullYear() - Number(siteConfig.foundingDate)} years of practice` },
  { value: siteConfig.stats.barAssociation, label: "State Bar Association member" },
  { value: siteConfig.stats.mattersResolved, label: "Matters resolved" },
  { value: siteConfig.stats.favourableOutcomes, label: "Favourable outcomes" },
  { value: String(siteConfig.stats.jurisdictions), label: "Jurisdictions covered" },
];

const differentiators = [
  {
    icon: Gem,
    title: "Boutique attention",
    copy: "A partner leads every matter. No files handed down, no rotating associates.",
  },
  {
    icon: Target,
    title: "Documented track record",
    copy: `${siteConfig.stats.mattersResolved} matters resolved, including nine-figure disputes across three circuits.`,
  },
  {
    icon: Clock,
    title: `${siteConfig.stats.responseCommitment} response`,
    copy: "Client calls and emails answered the same business day — in writing, on record.",
  },
  {
    icon: ShieldCheck,
    title: "Specific expertise",
    copy: "Sector depth in fintech, healthcare, construction and cross-border employment.",
  },
];

const testimonials = [
  {
    quote:
      "They took a dispute we thought would define our year and closed it in under three months. Clear advice, no theatre.",
    name: "M. Aldridge",
    role: "Chief Executive, Manufacturing Group",
  },
  {
    quote:
      "The partner who pitched us is the partner who argued our case. That alone set them apart from the larger firms.",
    name: "S. Whitfield",
    role: "General Counsel, Fintech Platform",
  },
  {
    quote:
      "During the most difficult year of my life they were calm, precise and always reachable. I never felt like a file number.",
    name: "J. Carrington",
    role: "Private Client",
  },
];

const process = [
  { step: "01", title: "Consultation", copy: "A confidential 45-minute conversation with the partner who would lead your matter." },
  { step: "02", title: "Case Assessment", copy: "We review the record, map exposure and give you a written view of realistic outcomes." },
  { step: "03", title: "Strategy", copy: "An agreed plan with milestones, decision points and a fixed scope of fees." },
  { step: "04", title: "Resolution", copy: "Negotiation, filing or trial — executed to the outcome we set out to reach." },
];

export default async function HomePage() {
  const practiceAreas = getAllPracticeAreas();
  const attorneys = getAllAttorneys();
  const featuredCaseStudies = getAllCaseStudies().slice(0, 3);
  const latestInsights = (await getAllInsights()).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Hero */}
      <section className="border-b border-navy/10">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-28">
          <FadeIn>
            <p className="eyebrow">
              {siteConfig.name} · {siteConfig.address.addressLocality}
            </p>
            <h1 className="mt-6 text-4xl leading-[1.08] text-navy sm:text-5xl lg:text-6xl">
              Counsel for the matters that decide the direction of a company or a family.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-slate">
              A boutique practice of {siteConfig.stats.totalLawyers} lawyers. Every engagement is led by a
              partner, priced before it begins, and judged only by the outcome it produces.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="navy" size="xl" className="rounded-none">
                <Link href="/contact">Book a Consultation</Link>
              </Button>
              <Button asChild variant="navyOutline" size="xl" className="rounded-none">
                <Link href="/practice-areas">Explore Practice Areas</Link>
              </Button>
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <Image
              src={mediaConfig.hero.home.src}
              alt={mediaConfig.hero.home.alt}
              width={mediaConfig.hero.home.width}
              height={mediaConfig.hero.home.height}
              className="aspect-4/3 w-full object-cover"
              priority
            />
          </FadeIn>
        </div>
      </section>

      {/* 2. Trust bar */}
      <section className="border-b border-navy/10 bg-secondary/60">
        <FadeIn className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-8 px-6 py-12 sm:grid-cols-3 lg:grid-cols-5 lg:px-10">
          {trustBadges.map((b) => (
            <div key={b.label} className="min-w-0 border-l border-navy/15 pl-4">
              <p className="font-serif text-2xl text-navy">{b.value}</p>
              <p className="mt-1 text-xs leading-snug text-slate">{b.label}</p>
            </div>
          ))}
        </FadeIn>
      </section>

      {/* 3. Practice areas */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <FadeIn className="max-w-2xl">
          <p className="eyebrow">Practice areas</p>
          <h2 className="mt-5 text-3xl text-navy sm:text-4xl">Six disciplines, practised deliberately narrowly.</h2>
        </FadeIn>
        <div className="mt-14 grid gap-px border border-navy/10 bg-navy/10 sm:grid-cols-2 lg:grid-cols-3">
          {practiceAreas.map((p, i) => (
            <FadeIn key={p.slug} delay={i * 60} className="flex bg-card">
              <PracticeAreaCard area={p} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 4. Why Avon Chambers */}
      <section className="bg-navy text-cream">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <FadeIn className="max-w-2xl">
            <p className="text-[0.6875rem] tracking-[0.2em] text-cream/50 uppercase">Why {siteConfig.name}</p>
            <h2 className="mt-5 text-3xl sm:text-4xl">Small by design. Accountable by consequence.</h2>
          </FadeIn>
          <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((d, i) => (
              <FadeIn key={d.title} delay={i * 70} className="border-t border-cream/20 pt-6">
                <d.icon className="size-5 text-cream/70" strokeWidth={1.25} />
                <h3 className="mt-5 text-lg text-cream">{d.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/60">{d.copy}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Case studies */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <FadeIn className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Selected outcomes</p>
            <h2 className="mt-5 text-3xl text-navy sm:text-4xl">Featured case studies</h2>
          </div>
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-[0.75rem] tracking-[0.14em] text-navy uppercase">
            All case studies <ArrowUpRight className="size-4" />
          </Link>
        </FadeIn>
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {featuredCaseStudies.map((c, i) => (
            <FadeIn key={c.slug} delay={i * 70}>
              <CaseStudyCard study={c} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 6. Attorneys */}
      <section className="border-y border-navy/10 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <FadeIn className="max-w-2xl">
            <p className="eyebrow">The practice</p>
            <h2 className="mt-5 text-3xl text-navy sm:text-4xl">Attorneys</h2>
          </FadeIn>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {attorneys.map((a, i) => (
              <FadeIn key={a.slug} delay={i * 70}>
                <AttorneyCard attorney={a} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <FadeIn className="max-w-2xl">
          <p className="eyebrow">Client experience</p>
          <h2 className="mt-5 text-3xl text-navy sm:text-4xl">In their words</h2>
        </FadeIn>
        <div className="mt-14 grid gap-10 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 70} as="blockquote" className="border-t border-navy/15 pt-6">
              <p className="text-base leading-relaxed text-slate italic">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-8">
                <p className="text-sm text-navy not-italic">{t.name}</p>
                <p className="mt-1 text-xs text-slate">{t.role}</p>
              </footer>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 8. Process */}
      <section className="border-y border-navy/10 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <FadeIn className="max-w-2xl">
            <p className="eyebrow">How we work</p>
            <h2 className="mt-5 text-3xl text-navy sm:text-4xl">Four steps, no ambiguity</h2>
          </FadeIn>
          <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <FadeIn key={p.step} as="li" delay={i * 70} className="relative">
                <span className="font-serif text-sm text-slate">{p.step}</span>
                <div className="mt-4 flex items-center gap-3">
                  <span className="size-2 shrink-0 rounded-full bg-navy" />
                  <span className="h-px flex-1 bg-navy/20" />
                </div>
                <h3 className="mt-5 text-lg text-navy">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate">{p.copy}</p>
              </FadeIn>
            ))}
          </ol>
        </div>
      </section>

      {/* 9. Insights */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <FadeIn className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Insights</p>
            <h2 className="mt-5 text-3xl text-navy sm:text-4xl">Latest writing</h2>
          </div>
          <Link href="/insights" className="inline-flex items-center gap-2 text-[0.75rem] tracking-[0.14em] text-navy uppercase">
            All insights <ArrowUpRight className="size-4" />
          </Link>
        </FadeIn>
        <div className="mt-14 grid gap-px border border-navy/10 bg-navy/10 lg:grid-cols-3">
          {latestInsights.map((insight, i) => (
            <FadeIn key={insight.slug} delay={i * 70}>
              <InsightCard insight={insight} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 10. Final CTA */}
      <ConsultationSection />
    </div>
  );
}
