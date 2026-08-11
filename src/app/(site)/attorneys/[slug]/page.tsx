import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getAllAttorneys, getAttorney, getPracticeAreasForAttorney } from "@/lib/data";
import { attorneySchema, breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return getAllAttorneys().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const attorney = getAttorney(slug);
  if (!attorney) return { title: "Unavailable", robots: { index: false, follow: false } };

  const title = `${attorney.name}, ${attorney.title}`;
  return {
    title,
    description: attorney.intro,
    alternates: { canonical: `/attorneys/${attorney.slug}` },
    openGraph: {
      title: `${title} — ${siteConfig.name}`,
      description: attorney.intro,
      url: `/attorneys/${attorney.slug}`,
      type: "profile",
      images: [{ url: attorney.photo }],
    },
  };
}

export default async function AttorneyProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const attorney = getAttorney(slug);
  if (!attorney) notFound();

  const areaLinks = getPracticeAreasForAttorney(attorney);

  return (
    <div>
      <JsonLd data={attorneySchema(attorney)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Attorneys", path: "/attorneys" },
          { name: attorney.name, path: `/attorneys/${attorney.slug}` },
        ])}
      />

      <section className="bg-navy text-cream">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.38fr_0.62fr] lg:gap-20 lg:px-10 lg:py-28">
          <FadeIn>
            <div className="relative aspect-3/4 w-full overflow-hidden">
              <Image
                src={attorney.photo}
                alt={`Portrait of ${attorney.name}`}
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </FadeIn>
          <FadeIn delay={100} className="self-center">
            <Link
              href="/attorneys"
              className="text-[0.6875rem] tracking-[0.2em] text-cream/50 uppercase hover:text-cream"
            >
              Attorneys
            </Link>
            <h1 className="mt-7 text-4xl leading-[1.1] sm:text-5xl">{attorney.name}</h1>
            <p className="mt-4 text-base text-cream/70">{attorney.title}</p>
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
            <p className="mt-9 max-w-xl text-base leading-relaxed text-cream/70">{attorney.intro}</p>
          </FadeIn>
        </div>
      </section>

      <section className="border-b border-navy/10 bg-secondary/60">
        <FadeIn className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 lg:grid-cols-4 lg:px-10">
          {attorney.stats.map((s) => (
            <div key={s.label} className="min-w-0 border-l border-navy/15 pl-5">
              <p className="font-serif text-3xl text-navy">{s.value}</p>
              <p className="mt-1 text-xs leading-snug text-slate">{s.label}</p>
            </div>
          ))}
        </FadeIn>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[0.62fr_0.38fr]">
          <FadeIn>
            <p className="eyebrow">Biography</p>
            <h2 className="mt-5 text-2xl text-navy sm:text-3xl">About {attorney.name.split(" ")[0]}</h2>
            <div className="mt-8 space-y-6">
              {attorney.bio.map((p) => (
                <p key={p.slice(0, 24)} className="text-base leading-relaxed text-slate">
                  {p}
                </p>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={80} className="space-y-12">
            <div>
              <p className="eyebrow">Education</p>
              <ul className="mt-5 space-y-4 border-t border-navy/15 pt-5">
                {attorney.education.map((e) => (
                  <li key={e} className="text-sm leading-relaxed text-slate">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow">Bar admissions</p>
              <ul className="mt-5 space-y-4 border-t border-navy/15 pt-5">
                {attorney.admissions.map((e) => (
                  <li key={e} className="text-sm leading-relaxed text-slate">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow">Contact</p>
              <ul className="mt-5 space-y-4 border-t border-navy/15 pt-5 text-sm text-slate">
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-slate" strokeWidth={1.5} />
                  <a href={`tel:${attorney.phone.replace(/[^\d+]/g, "")}`} className="hover:text-navy">
                    {attorney.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-slate" strokeWidth={1.5} />
                  <a href={`mailto:${attorney.email}`} className="break-all hover:text-navy">
                    {attorney.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-slate" strokeWidth={1.5} />
                  <span className="leading-relaxed">
                    {siteConfig.address.streetAddress}
                    <br />
                    {siteConfig.address.addressLocality}, {siteConfig.address.addressRegion}{" "}
                    {siteConfig.address.postalCode}
                  </span>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-y border-navy/10 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
          <FadeIn className="max-w-2xl">
            <p className="eyebrow">Representative work</p>
            <h2 className="mt-5 text-3xl text-navy sm:text-4xl">Notable matters</h2>
          </FadeIn>
          <ol className="mt-14 grid gap-10 sm:grid-cols-2">
            {attorney.notableCases.map((c, i) => (
              <FadeIn key={c.slice(0, 24)} as="li" delay={i * 60} className="border-t border-navy/20 pt-6">
                <span className="font-serif text-sm text-slate">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-4 text-base leading-relaxed text-navy">{c}</p>
              </FadeIn>
            ))}
          </ol>
          <FadeIn className="mt-12">
            <p className="text-xs text-slate">Prior results do not guarantee a similar outcome.</p>
          </FadeIn>
        </div>
      </section>

      {(attorney.awards.length > 0 || attorney.publications.length > 0) && (
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
          <div className="grid gap-16 lg:grid-cols-2">
            {attorney.awards.length > 0 && (
              <FadeIn>
                <p className="eyebrow">Recognition</p>
                <h2 className="mt-5 text-2xl text-navy sm:text-3xl">Awards</h2>
                <ul className="mt-8 divide-y divide-navy/10 border-t border-navy/15">
                  {attorney.awards.map((w) => (
                    <li key={w} className="py-5 text-sm leading-relaxed text-slate">
                      {w}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            )}
            {attorney.publications.length > 0 && (
              <FadeIn delay={80}>
                <p className="eyebrow">Writing</p>
                <h2 className="mt-5 text-2xl text-navy sm:text-3xl">Publications</h2>
                <ul className="mt-8 divide-y divide-navy/10 border-t border-navy/15">
                  {attorney.publications.map((w) => (
                    <li key={w} className="py-5 text-sm leading-relaxed text-slate">
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
        eyebrow={`${attorney.title} · ${attorney.area}`}
        heading={`Book a consultation with ${attorney.name}.`}
        blurb={`Consultations with ${attorney.name} run 45 minutes and are held in person or by call, at your preference.`}
        submitLabel={`Request time with ${attorney.name.split(" ")[0]}`}
        contactPhone={attorney.phone}
        contactEmail={attorney.email}
        attorneySlug={attorney.slug}
      />
    </div>
  );
}
