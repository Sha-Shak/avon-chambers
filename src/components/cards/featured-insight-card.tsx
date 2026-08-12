import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAttorney } from "@/lib/data";
import { urlForImage } from "@/sanity/image";
import type { InsightMeta } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Larger, two-column treatment for a single article — used standalone and inside `ArticlesCarousel`. */
export function FeaturedInsightCard({
  insight,
  priority = true,
  label = "Latest",
}: {
  insight: InsightMeta;
  priority?: boolean;
  label?: string;
}) {
  const author = insight.authorSlug
    ? getAttorney(insight.authorSlug)
    : undefined;

  return (
    <article className="grid gap-10 border border-foreground/10 bg-card lg:grid-cols-2">
      <div className="relative aspect-4/3 w-full bg-secondary lg:aspect-auto">
        {insight.coverImage?.asset ? (
          <Image
            src={urlForImage(insight.coverImage.asset).width(1200).url()}
            alt={insight.coverImage.alt ?? insight.title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="font-serif text-2xl text-foreground/15">
              {insight.category}
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center p-8 lg:p-12">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="eyebrow">{label}</span>
          <span aria-hidden>·</span>
          <span className="tracking-[0.12em] text-foreground uppercase">
            {insight.category}
          </span>
          <span aria-hidden>·</span>
          <time dateTime={insight.publishedAt}>
            {formatDate(insight.publishedAt)}
          </time>
        </div>
        <h2 className="mt-6 text-3xl leading-snug text-foreground sm:text-4xl">
          <Link href={`/insights/${insight.slug}`} className="hover:underline">
            {insight.title}
          </Link>
        </h2>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          {insight.excerpt}
        </p>
        <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground">
          <span>{author ? author.name : "Avon Chambers"}</span>
          <span>{insight.readingTime}</span>
        </div>
        <Link
          href={`/insights/${insight.slug}`}
          className="mt-8 inline-flex items-center gap-2 text-[0.75rem] tracking-[0.14em] text-foreground uppercase"
        >
          Read article <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}
