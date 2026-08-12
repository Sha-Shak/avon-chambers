import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/fade-in";
import { AnimatedNumber } from "@/components/animated-number";
import { AttorneyCard } from "@/components/cards/attorney-card";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getFeaturedAttorneys, getAllPracticeAreas } from "@/lib/data";
import { breadcrumbSchema, organizationId } from "@/lib/schema";

const TITLE = `About ${siteConfig.name} — Boutique New York Law Firm Since ${siteConfig.foundingDate}`;
const DESCRIPTION = `${siteConfig.name} is a ${siteConfig.stats.totalLawyers}-lawyer New York firm founded in ${siteConfig.foundingDate}. A partner leads every matter, fees are scoped in writing, and we answer within ${siteConfig.stats.responseCommitment}.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/about", type: "website" },
};

const principles = [
  {
    title: "A partner leads every matter",
    body: "The lawyer you meet at the consultation negotiates, drafts and appears. Associates support the mechanics; they never inherit the file.",
  },
  {
    title: "Scope and fees in writing first",
    body: "Before work begins you receive a written scope, the fee basis, and the name of the partner accountable for the outcome. No surprise revisions.",
  },
  {
    title: "We decline what we don't do well",
    body: `${siteConfig.stats.totalLawyers} lawyers cannot credibly practise everything. If your matter sits outside our six areas, we say so on the first call and point you somewhere better.`,
  },
  {
    title: `Answers within ${siteConfig.stats.responseCommitment}`,
    body: "Every client enquiry received on a business day gets a substantive reply from the partner or their direct line by the end of that day.",
  },
];

const timeline = [
  {
    year: "1998",
    body: "Helena Marchetti leaves a Wall Street corporate group and opens the firm on a single premise: the clients who most need a partner's judgement should actually receive it.",
  },
  {
    year: "2004",
    body: "The litigation practice opens under Daniel Osgood, giving corporate clients trial capability without an outside referral.",
  },
  {
    year: "2011",
    body: "Family law and immigration are added after years of handling both informally for existing business clients.",
  },
  {
    year: "2019",
    body: `The firm moves to ${siteConfig.address.streetAddress}, putting all ${siteConfig.stats.totalLawyers} lawyers on one floor — still the reason matters cross practice areas without being handed off.`,
  },
  {
    year: "Today",
    body: "Six practice areas, ten lawyers, and a deliberate cap on growth: we take the number of matters our partners can personally lead.",
  },
];

const steps = [
  {
    step: "01",
    title: "Tell us what happened",
    body: "A 45-minute consultation with the partner who would lead the matter. Privileged, whether or not we go on to act.",
  },
  {
    step: "02",
    title: "Get a written assessment",
    body: "Where you stand, the realistic outcomes, the likely timeline, and what it costs — in writing, before you commit.",
  },
  {
    step: "03",
    title: "We do the work",
    body: "Your partner runs the matter end to end, with scheduled updates and no unexplained billing.",
  },
];

export default function AboutPage() {
  const practiceAreas = getAllPracticeAreas();
  const featured = getFeaturedAttorneys();
  const facts = [
    { value: siteConfig.foundingDate, label: "Year the firm was founded" },
    { value: String(siteConfig.stats.totalLawyers), label: "Lawyers, one floor" },
    { value: String(practiceAreas.length), label: "Practice areas" },
    { value: siteConfig.stats.responseCommitment, label: "Response commitment" },
  ];

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: TITLE,
          description: DESCRIPTION,
          url: `${siteConfig.url}/about`,
          about: { "@id": organizationId() },
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <section className="border-b border-foreground/10">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:px-10 lg:py-28">
          <FadeIn>
            <p className="eyebrow">Our firm</p>
            <h1 className="mt-6 text-4xl leading-[1.1] text-foreground sm:text-5xl">
              A ten-lawyer firm built so the partner you hire is the partner you get.
            </h1>
            <p className="mt-7 text-base leading-relaxed text-muted-foreground">
              {siteConfig.name} has practised from lower Manhattan since {siteConfig.foundingDate}. We advise
              founders, closely held businesses, executives and families across six areas of law — and we
              have stayed small on purpose, because the alternative is delegation dressed up as capacity.
            </p>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Most of our work arrives by referral from clients we advised through something difficult: a
              shareholder dispute, an acquisition, a custody arrangement, a visa refused two weeks before a
              start date. What they tend to remember is not the outcome alone but knowing, at every point,
              who was accountable for it.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild variant="navy" size="xl" className="rounded-none">
                <Link href="/contact">Book a consultation</Link>
              </Button>
              <Button asChild variant="navyOutline" size="xl" className="rounded-none">
                <Link href="/attorneys">Meet the attorneys</Link>
              </Button>
            </div>
          </FadeIn>
          <FadeIn delay={120} className="grid grid-cols-2 gap-8 self-center">
            {facts.map((f) => (
              <div key={f.label} className="border-l border-foreground/15 pl-5">
                <AnimatedNumber value={f.value} className="block font-serif text-3xl text-foreground" />
                <p className="mt-2 text-xs leading-snug text-muted-foreground">{f.label}</p>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <FadeIn className="max-w-2xl">
          <p className="eyebrow">How we work</p>
          <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">Four commitments we put in writing</h2>
        </FadeIn>
        <div className="mt-14 grid gap-px border border-foreground/10 bg-foreground/10 sm:grid-cols-2">
          {principles.map((p, i) => (
            <FadeIn key={p.title} delay={i * 60} className="bg-card p-8 lg:p-10">
              <h3 className="font-serif text-xl text-foreground">{p.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="border-y border-foreground/10 bg-background">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <FadeIn className="max-w-2xl">
            <p className="eyebrow">History</p>
            <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">Twenty-eight years, deliberately small</h2>
          </FadeIn>
          <ol className="mt-14 space-y-10">
            {timeline.map((t, i) => (
              <FadeIn key={t.year} delay={i * 50}>
                <li className="grid gap-4 border-t border-foreground/10 pt-6 sm:grid-cols-[8rem_1fr] sm:gap-10">
                  <p className="font-serif text-2xl text-foreground">{t.year}</p>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                </li>
              </FadeIn>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <FadeIn className="max-w-2xl">
          <p className="eyebrow">What we handle</p>
          <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">Six practice areas</h2>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Each area is led by a partner with at least a decade in it. Select one to see how we approach
            the work, what it costs, and who would run your matter.
          </p>
        </FadeIn>
        <div className="mt-12 grid gap-px border border-foreground/10 bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
          {practiceAreas.map((area, i) => (
            <FadeIn key={area.slug} delay={i * 50} className="bg-card">
              <Link
                href={`/practice-areas/${area.slug}`}
                className="group flex h-full items-center justify-between gap-4 p-8"
              >
                <span className="font-serif text-lg text-foreground">{area.title}</span>
                <ArrowRight
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="border-y border-foreground/10 bg-background">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <FadeIn className="max-w-2xl">
            <p className="eyebrow">The people</p>
            <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">Who you would be working with</h2>
          </FadeIn>
          <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((a, i) => (
              <FadeIn key={a.slug} delay={i * 60}>
                <AttorneyCard attorney={a} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <FadeIn className="max-w-2xl">
          <p className="eyebrow">What happens next</p>
          <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">Three steps to an answer</h2>
        </FadeIn>
        <div className="mt-14 grid gap-px border border-foreground/10 bg-foreground/10 lg:grid-cols-3">
          {steps.map((s, i) => (
            <FadeIn key={s.step} delay={i * 60} className="bg-card p-8 lg:p-10">
              <p className="text-[0.6875rem] tracking-[0.2em] text-muted-foreground uppercase">{s.step}</p>
              <h3 className="mt-5 font-serif text-xl text-foreground">{s.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      <ConsultationSection
        eyebrow="Book a consultation"
        heading="Start with a conversation, not a retainer."
        blurb="Forty-five minutes with the partner who would lead your matter. You leave with a view of where you stand, whether or not you instruct us."
      />
    </div>
  );
}
