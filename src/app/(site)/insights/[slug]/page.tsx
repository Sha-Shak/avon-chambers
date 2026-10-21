import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { InsightCard } from "@/components/cards/insight-card";
import { ConsultationSection } from "@/components/consultation-section";
import { prepareArticleBody } from "@/lib/article-body";
import { PostBody } from "@/components/post-body";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { mediaConfig } from "@/config/media.config";
import { getLawyer } from "@/lib/data";
import { practiceAreaById } from "@/config/practice-areas.config";
import { getAllInsights, getInsight, getInsightSlugs } from "@/lib/content";
import { breadcrumbSchema, insightSchema } from "@/lib/schema";
import { buildSocialMetadata, resolveSeoText, resolveSeoTitle } from "@/lib/seo";
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
  if (!insight)
    return { title: "Unavailable", robots: { index: false, follow: false } };

  const author = insight.authorSlug ? getLawyer(insight.authorSlug) : undefined;
  const title = resolveSeoTitle(insight.seo?.metaTitle, insight.title);
  const description = resolveSeoText(insight.seo?.metaDescription, insight.excerpt);
  const ogImageAsset = insight.seo?.ogImage?.asset ?? insight.coverImage?.asset;
  const image = ogImageAsset
    ? urlForImage(ogImageAsset).width(1200).height(630).url()
    : mediaConfig.og.default.src;

  return {
    title,
    description,
    authors: author
      ? [{ name: author.name, url: `${siteConfig.url}/lawyers/${author.slug}` }]
      : [{ name: siteConfig.name, url: siteConfig.url }],
    alternates: { canonical: `/insights/${insight.slug}` },
    robots: insight.seo?.noIndex ? { index: false, follow: true } : undefined,
    ...buildSocialMetadata({
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `/insights/${insight.slug}`,
      type: "article",
      image: { url: image },
      publishedTime: insight.publishedAt,
      modifiedTime: insight.updatedAt ?? insight.publishedAt,
    }),
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = await getInsight(slug);
  if (!insight) notFound();

  const author = insight.authorSlug
    ? getLawyer(insight.authorSlug)
    : undefined;
  const reviewer = insight.reviewedBySlug ? getLawyer(insight.reviewedBySlug) : undefined;
  const practiceAreas = (insight.practiceAreaIds ?? [])
    .map(practiceAreaById)
    .filter((area) => area !== undefined);
  const morePosts = (await getAllInsights())
    .filter((i) => i.slug !== insight.slug)
    .slice(0, 3);

  return (
    <div>
      <JsonLd
        data={insightSchema(
          insight,
          author ? { name: author.name, url: `${siteConfig.url}/lawyers/${author.slug}` } : undefined,
          reviewer ? { name: reviewer.name, url: `${siteConfig.url}/lawyers/${reviewer.slug}` } : undefined,
        )}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Articles", path: "/insights" },
          { name: insight.title, path: `/insights/${insight.slug}` },
        ])}
      />

      <article>
        <section className="border-b border-foreground/10">
          <div className="mx-auto max-w-3xl px-6 py-20 lg:px-10 lg:py-28">
            <FadeIn>
              <Link
                href="/insights"
                className="inline-flex items-center gap-2 text-[0.6875rem] tracking-[0.2em] text-muted-foreground uppercase hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" /> All articles
              </Link>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="tracking-[0.12em] text-foreground uppercase">
                  {insight.category}
                </span>
                <span aria-hidden>·</span>
                <time dateTime={insight.publishedAt}>
                  {formatDate(insight.publishedAt)}
                </time>
                {insight.updatedAt && (
                  <>
                    <span aria-hidden>·</span>
                    <span>
                      Updated <time dateTime={insight.updatedAt}>{formatDate(insight.updatedAt)}</time>
                    </span>
                  </>
                )}
                <span aria-hidden>·</span>
                <span>{insight.readingTime}</span>
              </div>
              {reviewer && insight.reviewedAt && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Last reviewed by <Link className="underline" href={`/lawyers/${reviewer.slug}`}>{reviewer.name}</Link>{" "}
                  on <time dateTime={insight.reviewedAt}>{formatDate(insight.reviewedAt)}</time>.
                </p>
              )}
              <h1 className="mt-6 text-4xl leading-[1.12] text-foreground sm:text-5xl">
                {insight.title}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                {insight.excerpt}
              </p>
              {(author || reviewer) && (
                <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-foreground/10 pt-6">
                  {author && (
                    <Link href={`/lawyers/${author.slug}`} className="inline-flex items-center gap-3 hover:opacity-80">
                      <Image
                        src={author.photo}
                        style={{ objectPosition: author.avatarPosition ?? "50% 0%" }}
                        alt=""
                        width={40}
                        height={40}
                        className="size-10 rounded-full object-cover"
                      />
                      <span>
                        <span className="block text-xs text-muted-foreground">Written by</span>
                        <span className="block text-sm text-foreground">{author.name} · {author.title}</span>
                      </span>
                    </Link>
                  )}
                  {reviewer && (
                    <Link href={`/lawyers/${reviewer.slug}`} className="inline-flex items-center gap-3 hover:opacity-80">
                      <Image
                        src={reviewer.photo}
                        style={{ objectPosition: reviewer.avatarPosition ?? "50% 0%" }}
                        alt=""
                        width={40}
                        height={40}
                        className="size-10 rounded-full object-cover"
                      />
                      <span>
                        <span className="block text-xs text-muted-foreground">Reviewed by</span>
                        <span className="block text-sm text-foreground">{reviewer.name} · {reviewer.title}</span>
                      </span>
                    </Link>
                  )}
                </div>
              )}
              {practiceAreas.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {practiceAreas.map((area) => (
                    <Link
                      key={area.slug}
                      href={`/practice-areas/${area.slug}`}
                      className="rounded-full border border-foreground/15 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                    >
                      {area.title}
                    </Link>
                  ))}
                </div>
              )}
            </FadeIn>
          </div>
        </section>

        {insight.coverImage?.asset && (
          <FadeIn className="mx-auto max-w-5xl px-6 pt-12 lg:px-10">
            <div className="relative aspect-16/9 w-full overflow-hidden">
              <Image
                src={urlForImage(insight.coverImage)
                  .width(1600)
                  .height(900)
                  .url()}
                alt={insight.coverImage.alt ?? insight.title}
                fill
                sizes="(min-width: 1024px) 960px, 100vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </FadeIn>
        )}

        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-20">
          <PostBody value={prepareArticleBody(insight.body)} />
          {author && (
            <aside className="mt-12 border-t border-foreground/15 pt-8" aria-label="About the author">
              <h2 className="text-xl text-foreground">About {author.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{author.intro}</p>
              <Link className="mt-3 inline-block underline" href={`/lawyers/${author.slug}`}>View {author.name}&apos;s profile</Link>
            </aside>
          )}
          {insight.references && insight.references.length > 0 && (
            <div className="mt-14 border-t border-foreground/10 pt-8">
              <h2 className="text-xl text-foreground">References and sources</h2>
              <ul className="mt-5 space-y-3">
                {insight.references.map((reference) => (
                  <li key={reference.url}>
                    <a
                      href={reference.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground underline decoration-foreground/25 underline-offset-4 hover:text-foreground"
                    >
                      {reference.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-12 border-t border-foreground/10 pt-6 text-xs leading-relaxed text-muted-foreground">
            This article provides general information and does not constitute legal advice. Legal outcomes depend on the facts and applicable law. Seek advice about your specific circumstances.
          </p>
        </section>
      </article>

      {morePosts.length > 0 && (
        <section className="border-t border-foreground/10 bg-secondary/50">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
            <FadeIn className="max-w-2xl">
              <p className="eyebrow">Keep reading</p>
              <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">
                More from the firm
              </h2>
            </FadeIn>
            <div className="mt-14 grid gap-px border border-foreground/10 bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
              {morePosts.map((post, i) => (
                <FadeIn key={post.slug} delay={i * 60}>
                  <InsightCard insight={post} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      <ConsultationSection />
    </div>
  );
}
