import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/fade-in";
import { PostCard } from "@/components/post-collection";
import { PostArticle } from "@/components/post-article";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { mediaConfig } from "@/config/media.config";
import { getAllProBonoPosts, getProBonoPost, getProBonoSlugs } from "@/lib/content";
import { pictureUrl, proBonoCard } from "@/lib/posts";
import { breadcrumbSchema, postSchema } from "@/lib/schema";
import { buildOpenGraph } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = await getProBonoSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getProBonoPost(slug);
  if (!post) return { title: "Unavailable", robots: { index: false, follow: false } };

  const title = post.seo?.metaTitle ?? post.title;
  const description = post.seo?.metaDescription ?? post.excerpt;
  const image = pictureUrl(post.seo?.ogImage ?? post.coverImage, 1200, 630) ?? mediaConfig.og.default.src;

  return {
    title,
    description,
    keywords: post.seo?.keywords,
    alternates: { canonical: `/pro-bono/${post.slug}` },
    robots: post.seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: buildOpenGraph({
      title: `${title} — ${siteConfig.name}`,
      description,
      url: `/pro-bono/${post.slug}`,
      type: "article",
      image: { url: image },
      publishedTime: post.publishedAt,
    }),
    twitter: { card: "summary_large_image", title: `${title} — ${siteConfig.name}`, description, images: [image] },
  };
}

export default async function ProBonoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getProBonoPost(slug);
  if (!post) notFound();

  const more = (await getAllProBonoPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);
  const coverUrl = pictureUrl(post.coverImage, 2000, 1000);

  return (
    <>
      <JsonLd
        data={postSchema({
          title: post.title,
          excerpt: post.excerpt,
          path: `/pro-bono/${post.slug}`,
          publishedAt: post.publishedAt,
          imageUrl: pictureUrl(post.coverImage, 1600),
          section: post.category,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Social Commitments and Probono Services", path: "/pro-bono" },
          { name: post.title, path: `/pro-bono/${post.slug}` },
        ])}
      />

      <PostArticle
        backHref="/pro-bono"
        backLabel="All pro bono work"
        fallbackBanner="proBono"
        cover={coverUrl ? { src: coverUrl, alt: post.coverImage?.alt ?? post.title } : undefined}
        badge={post.category}
        title={post.title}
        excerpt={post.excerpt}
        dateIso={post.publishedAt}
        body={post.body}
      >
        {more.length > 0 && (
          <section className="border-t border-foreground/10 bg-secondary/50">
            <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
              <FadeIn className="max-w-2xl">
                <p className="eyebrow">Keep reading</p>
                <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">More pro bono work</h2>
              </FadeIn>
              <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {more.map((p, i) => (
                  <FadeIn key={p.slug} delay={i * 60}>
                    <PostCard post={proBonoCard(p)} cta="Read the story" />
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
