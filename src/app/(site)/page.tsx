import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Gem, ShieldCheck, Target } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { Hero, type HeroSlide } from "@/components/hero";
import { AnimatedNumber } from "@/components/animated-number";
import { PracticeAreaCard } from "@/components/cards/practice-area-card";
import { ArticlesCarousel } from "@/components/articles-carousel";
import { ConsultationSection } from "@/components/consultation-section";
import { TestimonialMarquee } from "@/components/testimonial-marquee";
import { InteractiveMarquee } from "@/components/interactive-marquee";
import { siteConfig } from "@/config/site.config";
import { mediaConfig } from "@/config/media.config";
import { getAllPracticeAreas } from "@/lib/data";
import { buildOpenGraph } from "@/lib/seo";
import { getAllInsights } from "@/lib/content";
import testimonialsData from "@/data/testimonials.json";
import type { ClientTestimonial } from "@/types";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: buildOpenGraph({
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: "/",
  }),
};

/**
 * Copy for each hero beat, paired index-for-index with `mediaConfig.hero.homeSlides`:
 * branding first, then the chambers' approach, then what it practises.
 */
const heroContent: Omit<HeroSlide, "image">[] = [
  {
    eyebrow: `${siteConfig.name} · ${siteConfig.address.addressLocality}`,
    heading: siteConfig.tagline,
    subheading: "Avon Chambers brings together Barristers, Solicitors, Advocates and Legal Consultants to provide practical legal advice and representation",
  },
  {
    eyebrow: "Our commitment",
    heading: "Dedicated service, Professional expertise, Practical solutions",
    subheading: "We are a dynamic and vibrant chambers committed to clear advice, high professional standards and confidentiality",
  },
  {
    eyebrow: "Practice areas",
    heading: "Comprehensive legal advice under one roof",
    subheading: "Our lawyers have individual expertise across a range of legal matters, serving corporate and private clients",
  },
];

const heroSlides: HeroSlide[] = heroContent.map((content, i) => ({
  ...content,
  image: mediaConfig.hero.homeSlides[i],
}));

const trustBadges = [
  {
    value: "Service",
    label: "Dedicated service",
  },
  {
    value: "Advice",
    label: "Practical legal advice",
  },
  { value: "Expertise", label: "Professional expertise" },
  { value: "Care", label: "Confidentiality assured" },
  { value: "Support", label: "Always in touch" },
];

const differentiators = [
  {
    icon: Gem,
    title: "Dedicated service",
    copy: "We are committed to providing outstanding legal services, support and guidance throughout the process.",
  },
  {
    icon: Target,
    title: "Professional expertise",
    copy: "Our team brings individual expertise across a wide variety of legal specializations.",
  },
  {
    icon: Clock,
    title: "Practical solutions",
    copy: "We provide commercially focused advice that responds to each client’s legal needs.",
  },
  {
    icon: ShieldCheck,
    title: "Specific expertise",
    copy: "We serve corporate firms, companies and private clients across a range of legal matters.",
  },
];

/**
 * Recognition shown in the "Acclamation" section, one card each: the
 * publication's logo, the highlight, then the detail. Logos come from
 * `mediaConfig.recognition`.
 */
const acclamations = [
  {
    logo: mediaConfig.recognition.lawAsia,
    source: "Asia Business Law Journal",
    highlight: "Top Corporate Lawyer",
    years: ["2024", "2025", "2026"],
    detail:
      "The Managing Partner of Avon Chambers, Mr. Asif Bin Anwar, has found mention as a Top Corporate Lawyer in the Asia Business Law Journal, consecutively for the last three years: 2024, 2025 and 2026.",
  },
  {
    logo: mediaConfig.recognition.legal500,
    source: "The Legal 500",
    highlight: "Recommended Lawyer",
    years: [],
    detail:
      "The Managing Partner of Avon Chambers, Mr. Asif Bin Anwar, has also found mention as a recommended lawyer in The Legal 500 for a number of years.",
  },
];

const testimonials = testimonialsData as ClientTestimonial[];

const process = [
  {
    step: "01",
    title: "Consultation",
    copy: "A confidential conversation about your legal matter and how we may assist.",
  },
  {
    step: "02",
    title: "Initial assessment",
    copy: "We listen carefully, review the relevant information and identify the legal issues.",
  },
  {
    step: "03",
    title: "Strategy",
    copy: "We provide practical advice and a clear approach tailored to your requirements.",
  },
  {
    step: "04",
    title: "Resolution",
    copy: "We provide support and representation throughout the process.",
  },
];

export default async function HomePage() {
  const practiceAreas = getAllPracticeAreas();
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
      <section className="tone-alt border-b border-foreground/10">
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
            {practiceAreas.length} disciplines, practised deliberately narrowly.
          </h2>
        </FadeIn>
        <InteractiveMarquee
          ariaLabel="Practice areas"
          className="mt-14"
          trackClassName="gap-4"
          speedPxPerSec={26}
          items={practiceAreas.map((p) => (
            <div key={p.slug} className="w-[min(86vw,22rem)] shrink-0 lg:w-[calc((100vw-8.5rem)/4)] lg:max-w-[18rem]">
              <PracticeAreaCard area={p} />
            </div>
          ))}
        />
      </section>

      {/* 4. Why Avon Chambers */}
      <section className="bg-navy text-cream">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
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

      {/* 5. Acclamation */}
      <section className="tone-alt border-y border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <FadeIn className="max-w-2xl">
            <p className="eyebrow">Recognition</p>
            <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">Acclamation</h2>
          </FadeIn>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {acclamations.map((a, i) => (
              <FadeIn key={a.source} delay={i * 80} className="frost flex flex-col rounded-md p-3">
                <div className="flex h-40 items-center justify-center rounded-sm bg-white px-8 sm:h-48">
                  <Image
                    src={a.logo.src}
                    alt={a.logo.alt}
                    width={a.logo.width}
                    height={a.logo.height}
                    sizes="(min-width: 768px) 20rem, 60vw"
                    className="max-h-32 w-auto object-contain sm:max-h-40"
                  />
                </div>
                <div className="flex flex-1 flex-col px-6 pt-8 pb-7 lg:px-8">
                  <p className="eyebrow">{a.source}</p>
                  <h3 className="mt-4 text-2xl text-foreground sm:text-3xl">{a.highlight}</h3>
                  {a.years.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Years recognised">
                      {a.years.map((year) => (
                        <li
                          key={year}
                          className="rounded-full border border-gold/70 px-3.5 py-1 text-[0.75rem] tracking-[0.12em] text-foreground"
                        >
                          {year}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{a.detail}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="dark bg-navy text-foreground">
        <div className="py-24 lg:py-32">
          <FadeIn className="mx-auto max-w-2xl px-6 text-center">
            <p className="text-[0.6875rem] tracking-[0.2em] text-muted-foreground uppercase">Client experience</p>
            <h2 className="mt-5 text-3xl sm:text-4xl">Clients&rsquo; Testimonials</h2>
            <span aria-hidden className="mx-auto mt-6 block h-px w-16 bg-gold/70" />
          </FadeIn>
          <FadeIn className="mt-16">
            <TestimonialMarquee testimonials={testimonials} />
          </FadeIn>
        </div>
      </section>

      {/* 7. Process */}
      <section className="border-t border-foreground/10">
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

      {/* 8. Articles */}
      <section className="tone-alt border-y border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
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
        {latestInsights.length > 0 ? (
          <FadeIn className="mt-14">
            <ArticlesCarousel insights={latestInsights} />
          </FadeIn>
        ) : (
          <FadeIn className="mt-14 border-t border-foreground/10 pt-8 text-muted-foreground">
            New writing is on its way — check back shortly.
          </FadeIn>
        )}
        </div>
      </section>

      {/* 9. Final CTA */}
      <ConsultationSection />
    </div>
  );
}
