"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { mediaConfig } from "@/config/media.config";
import { formatPostDate, type PostCardData } from "@/lib/posts";
import { cn } from "@/lib/utils";

const ALL = "All";

export function PostCard({ post, cta = "Read more" }: { post: PostCardData; cta?: string }) {
  return (
    <article className="frost group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={post.href} className="relative block aspect-3/2 overflow-hidden bg-secondary" aria-label={post.title}>
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.imageAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            loading="lazy"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Image src={mediaConfig.brand.logo.src} alt="" width={44} height={44} className="opacity-15" />
          </div>
        )}
        <span className="absolute top-4 left-4 bg-navy/75 px-3 py-1 text-[0.625rem] tracking-[0.14em] text-cream uppercase backdrop-blur-sm">
          {post.badge}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-7">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          {post.meta && (
            <>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" /> {post.meta}
              </span>
            </>
          )}
        </div>
        <h3 className="mt-4 text-xl leading-snug text-foreground">
          <Link href={post.href} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <Link
          href={post.href}
          className="mt-6 inline-flex items-center gap-2 text-[0.75rem] tracking-[0.14em] text-foreground uppercase"
        >
          {cta} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

/** A filterable grid of posts — the filter chips are built from whatever badges the posts carry. */
export function PostCollection({
  posts,
  emptyMessage,
  cta,
}: {
  posts: PostCardData[];
  emptyMessage: string;
  cta?: string;
}) {
  const [active, setActive] = useState(ALL);
  const filters = useMemo(() => [...new Set(posts.map((p) => p.badge))], [posts]);
  const visible = active === ALL ? posts : posts.filter((p) => p.badge === active);

  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-xl border border-dashed border-foreground/15 px-8 py-16 text-center">
        <p className="font-serif text-2xl text-foreground">Nothing here just yet</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      {filters.length > 1 && (
        <div className="flex flex-wrap gap-2.5">
          {[ALL, ...filters].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              aria-pressed={active === filter}
              className={cn(
                "inline-flex items-center rounded-full border px-4 py-1.5 text-[0.75rem] tracking-wide transition-all duration-200 active:scale-95",
                active === filter
                  ? "border-foreground bg-foreground text-background shadow-sm"
                  : "border-foreground/15 text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      )}
      <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", filters.length > 1 && "mt-10")}>
        {visible.map((post, i) => (
          <FadeIn key={post.slug} delay={Math.min(i, 8) * 55}>
            <PostCard post={post} cta={cta} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
