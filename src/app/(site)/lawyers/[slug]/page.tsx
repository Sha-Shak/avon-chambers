import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site.config";
import { getAllLawyers, getLawyer, getPracticeAreasForLawyer } from "@/lib/data";
import { lawyerSchema, breadcrumbSchema } from "@/lib/schema";

/** Widest column count the stats row reaches (its `lg:grid-cols-4`) — a
 *  shorter, filtered list is centered instead of stretched to fill it. */
const MAX_STAT_COLUMNS = 4;

export function generateStaticParams() {
  return getAllLawyers().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lawyer = getLawyer(slug);
  if (!lawyer) return { title: "Unavailable", robots: { index: false, follow: false } };

  const title = `${lawyer.name}, ${lawyer.title}`;
  return {
    title,
    description: lawyer.intro,
    alternates: { canonical: `/lawyers/${lawyer.slug}` },
    openGraph: {
      title: `${title} — ${siteConfig.name}`,
      description: lawyer.intro,
      url: `/lawyers/${lawyer.slug}`,
      type: "profile",
      images: [{ url: lawyer.photo }],
    },
  };
}

export default async function LawyerProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lawyer = getLawyer(slug);
  if (!lawyer) notFound();

  const areaLinks = getPracticeAreasForLawyer(lawyer);

  // Some records carry placeholder stat slots ("N/A" or an empty value) for
  // a figure that hasn't been supplied yet — skip those rather than showing
  // a blank stat block.
  const visibleStats = lawyer.stats.filter(
    (s) => s.value.trim() !== "" && s.value.trim().toUpperCase() !== "N/A",
  );
  const isPartialStatsRow = visibleStats.length > 0 && visibleStats.length < MAX_STAT_COLUMNS;

  const hasBio = lawyer.bio.length > 0;
  const hasEducation = lawyer.education.length > 0;
  const hasAdmissions = lawyer.admissions.length > 0;
  const hasPhone = lawyer.phone.trim() !== "";

  const sidebar = (
    <div className="space-y-12">
      {hasEducation && (
        <div>
          <p className="eyebrow">Education</p>
          <ul className="mt-5 space-y-4 border-t border-foreground/15 pt-5">
            {lawyer.education.map((e) => (
              <li key={e} className="text-sm leading-relaxed text-muted-foreground">
                {e}
              </li>
            ))}
          </ul>
        </div>
      )}
      {hasAdmissions && (
        <div>
          <p className="eyebrow">Bar admissions</p>
          <ul className="mt-5 space-y-4 border-t border-foreground/15 pt-5">
            {lawyer.admissions.map((e) => (
              <li key={e} className="text-sm leading-relaxed text-muted-foreground">
                {e}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <p className="eyebrow">Contact</p>
        <ul className="mt-5 space-y-4 border-t border-foreground/15 pt-5 text-sm text-muted-foreground">
          {hasPhone && (
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <a href={`tel:${lawyer.phone.replace(/[^\d+]/g, "")}`} className="hover:text-foreground">
                {lawyer.phone}
              </a>
            </li>
          )}
          <li className="flex gap-3">
            <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
            <a href={`mailto:${lawyer.email}`} className="break-all hover:text-foreground">
              {lawyer.email}
            </a>
          </li>
          <li className="flex gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
            <span className="leading-relaxed">
              {siteConfig.address.streetAddress}
              <br />
              {siteConfig.address.addressLocality}, {siteConfig.address.addressRegion}{" "}
              {siteConfig.address.postalCode}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div>
      <JsonLd data={lawyerSchema(lawyer)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Lawyers", path: "/lawyers" },
          { name: lawyer.name, path: `/lawyers/${lawyer.slug}` },
        ])}
      />

      <section className="bg-navy text-cream">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.38fr_0.62fr] lg:gap-20 lg:px-10 lg:py-28">
          <FadeIn>
            <div className="relative aspect-3/4 w-full overflow-hidden">
              <Image
                src={lawyer.photo}
                alt={`Portrait of ${lawyer.name}`}
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </FadeIn>
          <FadeIn delay={100} className="self-center">
            <Link
              href="/lawyers"
              className="text-[0.6875rem] tracking-[0.2em] text-cream/50 uppercase hover:text-cream"
            >
              Lawyers
            </Link>
            <h1 className="mt-7 text-4xl leading-[1.1] sm:text-5xl">{lawyer.name}</h1>
            <p className="mt-4 text-base text-cream/70">{lawyer.title}</p>
            {areaLinks.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {areaLinks.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/practice-areas/${p.slug}`}
                    className="border border-cream/25 px-4 py-2 text-[0.6875rem] tracking-[0.14em] text-cream/80 uppercase transition-colors hover:bg-cream hover:text-navy"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            )}
            <p className="mt-9 max-w-xl text-base leading-relaxed text-cream/70">{lawyer.intro}</p>
          </FadeIn>
        </div>
      </section>

      {visibleStats.length > 0 && (
        <section className="border-b border-foreground/10 bg-secondary/60">
          <FadeIn
            className={cn(
              "mx-auto max-w-7xl px-6 py-12 lg:px-10",
              isPartialStatsRow ? "flex flex-wrap justify-center gap-8" : "grid grid-cols-2 gap-8 lg:grid-cols-4",
            )}
          >
            {visibleStats.map((s) => (
              <div
                key={s.label}
                className={cn(
                  "min-w-0 border-l border-foreground/15 pl-5",
                  isPartialStatsRow && "w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]",
                )}
              >
                <p className="font-serif text-3xl text-foreground">{s.value}</p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </FadeIn>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
        {hasBio ? (
          <div className="grid gap-16 lg:grid-cols-[0.62fr_0.38fr]">
            <FadeIn>
              <p className="eyebrow">Biography</p>
              <h2 className="mt-5 text-2xl text-foreground sm:text-3xl">About {lawyer.name.split(" ")[0]}</h2>
              <div className="mt-8 space-y-6">
                {lawyer.bio.map((p) => (
                  <p key={p.slice(0, 24)} className="text-base leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={80}>{sidebar}</FadeIn>
          </div>
        ) : (
          <FadeIn className="max-w-md">{sidebar}</FadeIn>
        )}
      </section>

      {lawyer.notableCases.length > 0 && (
        <section className="border-y border-foreground/10 bg-secondary/50">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
            <FadeIn className="max-w-2xl">
              <p className="eyebrow">Representative work</p>
              <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">Notable matters</h2>
            </FadeIn>
            <ol className="mt-14 grid gap-10 sm:grid-cols-2">
              {lawyer.notableCases.map((c, i) => (
                <FadeIn key={c.slice(0, 24)} as="li" delay={i * 60} className="border-t border-foreground/20 pt-6">
                  <span className="font-serif text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-4 text-base leading-relaxed text-foreground">{c}</p>
                </FadeIn>
              ))}
            </ol>
            <FadeIn className="mt-12">
              <p className="text-xs text-muted-foreground">Prior results do not guarantee a similar outcome.</p>
            </FadeIn>
          </div>
        </section>
      )}

      {(lawyer.awards.length > 0 || lawyer.publications.length > 0) && (
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
          <div className="grid gap-16 lg:grid-cols-2">
            {lawyer.awards.length > 0 && (
              <FadeIn>
                <p className="eyebrow">Recognition</p>
                <h2 className="mt-5 text-2xl text-foreground sm:text-3xl">Awards</h2>
                <ul className="mt-8 divide-y divide-navy/10 border-t border-foreground/15">
                  {lawyer.awards.map((w) => (
                    <li key={w} className="py-5 text-sm leading-relaxed text-muted-foreground">
                      {w}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            )}
            {lawyer.publications.length > 0 && (
              <FadeIn delay={80}>
                <p className="eyebrow">Writing</p>
                <h2 className="mt-5 text-2xl text-foreground sm:text-3xl">Publications</h2>
                <ul className="mt-8 divide-y divide-navy/10 border-t border-foreground/15">
                  {lawyer.publications.map((w) => (
                    <li key={w} className="py-5 text-sm leading-relaxed text-muted-foreground">
                      {w}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            )}
          </div>
        </section>
      )}

      <ConsultationSection
        eyebrow={`${lawyer.title} · ${lawyer.area}`}
        heading={`Book a consultation with ${lawyer.name}.`}
        blurb={`Consultations with ${lawyer.name} run 45 minutes and are held in person or by call, at your preference.`}
        contactPhone={hasPhone ? lawyer.phone : undefined}
        contactEmail={lawyer.email}
      />
    </div>
  );
}
