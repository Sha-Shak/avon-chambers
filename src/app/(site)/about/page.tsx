import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/fade-in";
import { AnimatedNumber } from "@/components/animated-number";
import { AttorneyGrid } from "@/components/attorney-grid";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getFeaturedAttorneys, getAllPracticeAreas } from "@/lib/data";
import { breadcrumbSchema, organizationId } from "@/lib/schema";
import { PracticeAreaIcon } from "@/lib/icons";

const TITLE = `About ${siteConfig.name}`;
const DESCRIPTION = `${siteConfig.name} is a Bangladesh-based set of law chambers providing professional legal advice and representation to corporate and private clients.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/about", type: "website" },
};

const principles = [
  {
    title: "Dedicated service",
    body: "We are committed to providing clients with outstanding legal services, support and guidance throughout the process.",
  },
  {
    title: "Professional expertise",
    body: "Our team includes Barristers, Solicitors, Advocates and Legal Consultants with expertise across a variety of legal matters.",
  },
  {
    title: "Practical solutions",
    body: "We work to understand each client’s needs and provide commercially focused, practical legal advice.",
  },
  {
    title: "Confidentiality assured",
    body: "We maintain high professional standards and treat client matters with care and confidentiality.",
  },
];

const timeline = [
  { year: "Our chambers", body: "Avon Chambers is a vibrant and progressive set of law chambers serving corporate firms, companies and private clients." },
  { year: "Our team", body: "Our lawyers work individually and collectively, enabling clients to draw on the experience of the team as a whole." },
  { year: "Our reach", body: "We have experience and associations with law firms overseas, including in England and India." },
];

const steps = [
  {
    step: "01",
    title: "Tell us what happened",
    body: "Contact us to discuss your legal matter and the support you need.",
  },
  {
    step: "02",
    title: "Receive practical advice",
    body: "Our team will provide professional advice tailored to the relevant legal issues.",
  },
  {
    step: "03",
    title: "We do the work",
    body: "We provide support and representation throughout the legal process.",
  },
];

export default function AboutPage() {
  const practiceAreas = getAllPracticeAreas();
  const featured = getFeaturedAttorneys();
  const facts = [
    { value: "Service", label: "Dedicated service" },
    { value: "Team", label: "Legal professionals" },
    { value: String(practiceAreas.length), label: "Practice areas" },
    { value: "Advice", label: "Practical solutions" },
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
              Professional legal expertise under one roof.
            </h1>
            <p className="mt-7 text-base leading-relaxed text-muted-foreground">
              {siteConfig.name} is a Bangladesh-based set of law chambers comprising seasoned Barristers,
              Solicitors, Advocates and Legal Consultants. We provide professional legal services to
              corporate firms, companies and private clients across a range of legal matters.
            </p>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Our lawyers bring individual expertise and work collectively as a team, giving clients access
              to comprehensive specialist legal advice. We are vibrant, progressive and bold, and look
              forward to being of service.
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
          <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">Our commitment</h2>
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
            <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">A glimpse of our chambers</h2>
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
          <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">Our legal practices</h2>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Our lawyers have individual expertise in a number of areas, helping clients obtain comprehensive
            specialist legal advice under one roof.
          </p>
        </FadeIn>
        <div className="mt-12 grid gap-px border border-foreground/10 bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
          {practiceAreas.map((area, i) => (
            <FadeIn key={area.slug} delay={i * 50} className="bg-card">
              <Link
                href={`/practice-areas/${area.slug}`}
                className="group flex h-full items-center justify-between gap-4 p-8"
              >
                <span className="flex min-w-0 items-center gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy text-cream">
                    <PracticeAreaIcon name={area.icon} className="size-4" strokeWidth={1.25} />
                  </span>
                  <span className="font-serif text-lg text-foreground">{area.title}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="border-y border-foreground/10 bg-background">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <FadeIn className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow">The people</p>
              <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">Our legal professionals</h2>
            </div>
            <Link
              href="/attorneys"
              className="inline-flex items-center gap-2 text-[0.75rem] tracking-[0.14em] text-foreground uppercase"
            >
              All attorneys <ArrowUpRight className="size-4" />
            </Link>
          </FadeIn>
          <AttorneyGrid attorneys={featured} className="mt-14" />
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
        blurb="Discuss your legal matter with Avon Chambers and learn how we may assist."
      />
    </div>
  );
}
