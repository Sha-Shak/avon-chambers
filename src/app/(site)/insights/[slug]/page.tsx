import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getAttorney } from "@/lib/data";
import { getAllInsights, getInsight, getInsightSlugs } from "@/lib/content";
import { breadcrumbSchema, insightSchema } from "@/lib/schema";
import { urlForImage } from "@/sanity/image";

export async function generateStaticParams() {
  const slugs = await getInsightSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = await getInsight(slug);
  if (!insight) return { title: "Unavailable", robots: { index: false, follow: false } };

  return {
    title: insight.title,
    description: insight.excerpt,
    alternates: { canonical: `/insights/${insight.slug}` },
    openGraph: {
      title: `${insight.title} — ${siteConfig.name}`,
      description: insight.excerpt,
      url: `/insights/${insight.slug}`,
      type: "article",
      publishedTime: insight.publishedAt,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = await getInsight(slug);
  if (!insight) notFound();

  const author = insight.authorSlug ? getAttorney(insight.authorSlug) : undefined;
  const morePosts = (await getAllInsights()).filter((i) => i.slug !== insight.slug).slice(0, 3);

  return (
    <div>
      <JsonLd data={insightSchema(insight, author?.name ?? siteConfig.name)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Articles", path: "/insights" },
          { name: insight.title, path: `/insights/${insight.slug}` },
        ])}
      />

      <article>
        <section className="border-b border-navy/10">
          <div className="mx-auto max-w-3xl px-6 py-20 lg:px-10 lg:py-28">
            <FadeIn>
              <Link
                href="/insights"
                className="inline-flex items-center gap-2 text-[0.6875rem] tracking-[0.2em] text-slate uppercase hover:text-navy"
              >
                <ArrowLeft className="size-3.5" /> All articles
              </Link>
              <div className="mt-8 flex items-center gap-3 text-xs text-slate">
                <span className="tracking-[0.12em] text-navy uppercase">{insight.category}</span>
                <span aria-hidden>·</span>
                <span>{formatDate(insight.publishedAt)}</span>
                <span aria-hidden>·</span>
                <span>{insight.readingTime}</span>
              </div>
              <h1 className="mt-6 text-4xl leading-[1.12] text-navy sm:text-5xl">{insight.title}</h1>
              <p className="mt-6 text-base leading-relaxed text-slate">{insight.excerpt}</p>
              {author && (
                <Link
                  href={`/attorneys/${author.slug}`}
                  className="mt-8 inline-flex items-center gap-3 border-t border-navy/10 pt-6 hover:opacity-80"
                >
                  <span className="text-sm text-navy">{author.name}</span>
                  <span className="text-xs text-slate">{author.title}</span>
                </Link>
              )}
            </FadeIn>
          </div>
        </section>

        {insight.coverImage?.asset && (
          <FadeIn className="mx-auto max-w-5xl px-6 pt-12 lg:px-10">
            <div className="relative aspect-16/9 w-full overflow-hidden">
              <Image
                src={urlForImage(insight.coverImage).width(1600).height(900).url()}
                alt={insight.coverImage.alt ?? insight.title}
                fill
                sizes="(min-width: 1024px) 960px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </FadeIn>
        )}

        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="prose-insight prose">
            <PortableText value={insight.body} />
          </div>
        </section>
      </article>

      {morePosts.length > 0 && (
        <section className="border-t border-navy/10 bg-secondary/50">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
            <FadeIn className="max-w-2xl">
              <p className="eyebrow">Keep reading</p>
              <h2 className="mt-5 text-3xl text-navy sm:text-4xl">More from the firm</h2>
            </FadeIn>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {morePosts.map((post) => (
                <Link key={post.slug} href={`/insights/${post.slug}`} className="block bg-card p-8 hover:bg-secondary/70">
                  <p className="eyebrow">{post.category}</p>
                  <h3 className="mt-4 text-lg text-navy">{post.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ConsultationSection />
    </div>
  );
}
