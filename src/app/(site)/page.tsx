import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Gem, ShieldCheck, Target } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { Hero, type HeroSlide } from "@/components/hero";
import { AnimatedNumber } from "@/components/animated-number";
import { PracticeAreaCard } from "@/components/cards/practice-area-card";
import { AttorneyCard } from "@/components/cards/attorney-card";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { ArticlesCarousel } from "@/components/articles-carousel";
import { ConsultationSection } from "@/components/consultation-section";
import { siteConfig } from "@/config/site.config";
import { mediaConfig } from "@/config/media.config";
import {
  getAllAttorneys,
  getAllCaseStudies,
  getAllPracticeAreas,
} from "@/lib/data";
import { getAllInsights } from "@/lib/content";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: "/",
  },
};

/**
 * Copy for each hero beat, paired index-for-index with `mediaConfig.hero.homeSlides`:
 * branding first, then the firm's track record, then what it practises.
 */
const heroContent: Omit<HeroSlide, "image">[] = [
  {
    eyebrow: `${siteConfig.name} · ${siteConfig.address.addressLocality}`,
    heading:
      "Counsel for the matters that decide the direction of a company or a family.",
    subheading: `A boutique practice of ${siteConfig.stats.totalLawyers} lawyers. Every engagement is led by a partner, priced before it begins, and judged only by the outcome it produces.`,
  },
  {
    eyebrow: "Track record",
    heading: `${siteConfig.stats.mattersResolved} matters resolved. ${siteConfig.stats.favourableOutcomes} favourable outcomes.`,
    subheading:
      "Twenty-eight years representing companies, founders and families in matters where the outcome mattered most — audited by the clients who came back for the next one.",
  },
  {
    eyebrow: "Practice areas",
    heading: "Six disciplines, one partner, start to finish.",
    subheading:
      "Corporate, litigation, family, immigration, real estate and employment law — practised deliberately narrowly, never handed down to someone junior.",
  },
];

const heroSlides: HeroSlide[] = heroContent.map((content, i) => ({
  ...content,
  image: mediaConfig.hero.homeSlides[i],
}));

const trustBadges = [
  {
    value: siteConfig.foundingDate,
    label: `Founded · ${new Date().getFullYear() - Number(siteConfig.foundingDate)} years of practice`,
  },
  {
    value: siteConfig.stats.barAssociation,
    label: "State Bar Association member",
  },
  { value: siteConfig.stats.mattersResolved, label: "Matters resolved" },
  { value: siteConfig.stats.favourableOutcomes, label: "Favourable outcomes" },
  {
    value: String(siteConfig.stats.jurisdictions),
    label: "Jurisdictions covered",
  },
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
  {
    step: "01",
    title: "Consultation",
    copy: "A confidential 45-minute conversation with the partner who would lead your matter.",
  },
  {
    step: "02",
    title: "Case Assessment",
    copy: "We review the record, map exposure and give you a written view of realistic outcomes.",
  },
  {
    step: "03",
    title: "Strategy",
    copy: "An agreed plan with milestones, decision points and a fixed scope of fees.",
  },
  {
    step: "04",
    title: "Resolution",
    copy: "Negotiation, filing or trial — executed to the outcome we set out to reach.",
  },
];

export default async function HomePage() {
  const practiceAreas = getAllPracticeAreas();
  const attorneys = getAllAttorneys();
  const featuredCaseStudies = getAllCaseStudies().slice(0, 3);
  const latestInsights = await getAllInsights();

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Hero */}
      <section className="border-b border-foreground/10">
        <FadeIn>
          <Hero
            slides={heroSlides}
            intervalMs={mediaConfig.hero.sliderIntervalMs}
          />
        </FadeIn>
      </section>

      {/* 2. Trust bar */}
      <section className="border-b border-foreground/10 bg-secondary/60">
        <FadeIn className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-8 px-6 py-12 sm:grid-cols-3 lg:grid-cols-5 lg:px-10">
          {trustBadges.map((b) => (
            <div
              key={b.label}
              className="min-w-0 border-l border-foreground/15 pl-4"
            >
              <AnimatedNumber
                value={b.value}
                className="block font-serif text-2xl text-foreground"
              />
              <p className="mt-1 text-xs leading-snug text-muted-foreground">
                {b.label}
              </p>
            </div>
          ))}
        </FadeIn>
      </section>

      {/* 3. Practice areas */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <FadeIn className="max-w-2xl">
          <p className="eyebrow">Practice areas</p>
          <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">
            Six disciplines, practised deliberately narrowly.
          </h2>
        </FadeIn>
        <div className="mt-14 grid gap-px border border-foreground/10 bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
          {practiceAreas.map((p, i) => (
            <FadeIn key={p.slug} delay={i * 60} className="flex bg-card">
              <PracticeAreaCard area={p} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 4. Why Avon Chambers */}
      <section className="relative bg-navy text-cream">
        <Image
          src={mediaConfig.accents.whyAvonChambers.src}
          alt={mediaConfig.accents.whyAvonChambers.alt}
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/95 via-navy/90 to-navy/95" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <FadeIn className="max-w-2xl">
            <p className="text-[0.6875rem] tracking-[0.2em] text-cream/50 uppercase">
              Why {siteConfig.name}
            </p>
            <h2 className="mt-5 text-3xl sm:text-4xl">
              Small by design. Accountable by consequence.
            </h2>
          </FadeIn>
          <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((d, i) => (
              <FadeIn
                key={d.title}
                delay={i * 70}
                className="border-t border-cream/20 pt-6"
              >
                <d.icon className="size-5 text-cream/70" strokeWidth={1.25} />
                <h3 className="mt-5 text-lg text-cream">{d.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/60">
                  {d.copy}
                </p>
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
            <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">
              Featured case studies
            </h2>
          </div>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-[0.75rem] tracking-[0.14em] text-foreground uppercase"
          >
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
      <section className="border-y border-foreground/10 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <FadeIn className="max-w-2xl">
            <p className="eyebrow">The practice</p>
            <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">
              Attorneys
            </h2>
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
          <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">
            In their words
          </h2>
        </FadeIn>
        <div className="mt-14 grid gap-10 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn
              key={t.name}
              delay={i * 70}
              as="blockquote"
              className="border-t border-foreground/15 pt-6"
            >
              <p className="text-base leading-relaxed text-muted-foreground italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-8">
                <p className="text-sm text-foreground not-italic">{t.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t.role}</p>
              </footer>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 8. Process */}
      <section className="border-y border-foreground/10 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <FadeIn className="max-w-2xl">
            <p className="eyebrow">How we work</p>
            <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">
              Four steps, no ambiguity
            </h2>
          </FadeIn>
          <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <FadeIn key={p.step} as="li" delay={i * 70} className="relative">
                <span className="font-serif text-sm text-muted-foreground">
                  {p.step}
                </span>
                <div className="mt-4 flex items-center gap-3">
                  <span className="size-2 shrink-0 rounded-full bg-foreground" />
                  <span className="h-px flex-1 bg-foreground/20" />
                </div>
                <h3 className="mt-5 text-lg text-foreground">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {p.copy}
                </p>
              </FadeIn>
            ))}
          </ol>
        </div>
      </section>

      {/* 9. Articles */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <FadeIn className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Articles</p>
            <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">
              Latest writing
            </h2>
          </div>
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-[0.75rem] tracking-[0.14em] text-foreground uppercase"
          >
            All articles <ArrowUpRight className="size-4" />
          </Link>
        </FadeIn>
        {latestInsights.length > 0 && (
          <FadeIn className="mt-14">
            <ArticlesCarousel insights={latestInsights} />
          </FadeIn>
        )}
      </section>

      {/* 10. Final CTA */}
      <ConsultationSection />
    </div>
  );
}
