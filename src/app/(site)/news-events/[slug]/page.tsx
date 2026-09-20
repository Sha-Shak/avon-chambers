import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/fade-in";
import { PostCard } from "@/components/post-collection";
import { PostArticle } from "@/components/post-article";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { mediaConfig } from "@/config/media.config";
import { getAllNewsEvents, getNewsEvent, getNewsEventSlugs } from "@/lib/content";
import { newsEventCard, pictureUrl } from "@/lib/posts";
import { breadcrumbSchema, postSchema } from "@/lib/schema";
import { buildOpenGraph } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = await getNewsEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsEvent(slug);
  if (!item) return { title: "Unavailable", robots: { index: false, follow: false } };

  const title = item.seo?.metaTitle ?? item.title;
  const description = item.seo?.metaDescription ?? item.excerpt;
  const image = pictureUrl(item.seo?.ogImage ?? item.coverImage, 1200, 630) ?? mediaConfig.og.default.src;

  return {
    title,
    description,
    keywords: item.seo?.keywords,
    alternates: { canonical: `/news-events/${item.slug}` },
    robots: item.seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: buildOpenGraph({
      title: `${title} — ${siteConfig.name}`,
      description,
      url: `/news-events/${item.slug}`,
      type: "article",
      image: { url: image },
      publishedTime: item.publishedAt,
    }),
    twitter: { card: "summary_large_image", title: `${title} — ${siteConfig.name}`, description, images: [image] },
  };
}

export default async function NewsEventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getNewsEvent(slug);
  if (!item) notFound();

  const isEvent = item.kind === "Event";
  const more = (await getAllNewsEvents()).filter((i) => i.slug !== item.slug).slice(0, 3);
  const coverUrl = pictureUrl(item.coverImage, 2000, 1000);

  return (
    <>
      <JsonLd
        data={postSchema({
          title: item.title,
          excerpt: item.excerpt,
          path: `/news-events/${item.slug}`,
          publishedAt: item.publishedAt,
          imageUrl: pictureUrl(item.coverImage, 1600),
          section: item.kind,
          event: isEvent ? { startDate: item.eventDate, location: item.location } : undefined,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "News & Events", path: "/news-events" },
          { name: item.title, path: `/news-events/${item.slug}` },
        ])}
      />

      <PostArticle
        backHref="/news-events"
        backLabel="All news & events"
        fallbackBanner="newsEvents"
        cover={coverUrl ? { src: coverUrl, alt: item.coverImage?.alt ?? item.title } : undefined}
        badge={item.kind}
        title={item.title}
        excerpt={item.excerpt}
        dateLabel={isEvent ? "Event date:" : undefined}
        dateIso={isEvent && item.eventDate ? item.eventDate : item.publishedAt}
        location={isEvent ? item.location : undefined}
        body={item.body}
      >
        {more.length > 0 && (
          <section className="border-t border-foreground/10 bg-secondary/50">
            <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
              <FadeIn className="max-w-2xl">
                <p className="eyebrow">Keep reading</p>
                <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">More from Chambers</h2>
              </FadeIn>
              <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {more.map((post, i) => (
                  <FadeIn key={post.slug} delay={i * 60}>
                    <PostCard post={newsEventCard(post)} />
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        )}
        <ConsultationSection />
      </PostArticle>
    </>
  );
}
