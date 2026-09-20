import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { PageBanner, type BannerKey } from "@/components/page-banner";
import { PostBody } from "@/components/post-body";
import { formatPostDate } from "@/lib/posts";
import type { PortableTextBlock } from "@portabletext/types";

/** Shared layout for a single News & Events / Pro Bono post. */
export function PostArticle({
  backHref,
  backLabel,
  fallbackBanner,
  cover,
  badge,
  title,
  excerpt,
  dateLabel,
  dateIso,
  location,
  body,
  children,
}: {
  backHref: string;
  backLabel: string;
  fallbackBanner: BannerKey;
  cover?: { src: string; alt: string };
  badge: string;
  title: string;
  excerpt: string;
  dateLabel?: string;
  dateIso: string;
  location?: string;
  body: PortableTextBlock[];
  /** Rendered after the article, e.g. a "more posts" section. */
  children?: ReactNode;
}) {
  return (
    <div>
      <PageBanner image={cover ?? fallbackBanner} eyebrow={badge} title={title} />

      <article>
        <div className="mx-auto max-w-3xl px-6 pt-12 lg:px-10 lg:pt-16">
          <FadeIn>
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-[0.6875rem] tracking-[0.2em] text-muted-foreground uppercase hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" /> {backLabel}
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-foreground/10 py-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4" />
                {dateLabel ? `${dateLabel} ` : ""}
                <time dateTime={dateIso}>{formatPostDate(dateIso)}</time>
              </span>
              {location && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4" /> {location}
                </span>
              )}
            </div>
            <p className="mt-8 font-serif text-xl leading-relaxed text-foreground sm:text-2xl">{excerpt}</p>
          </FadeIn>
        </div>

        <div className="mx-auto max-w-3xl px-6 py-12 lg:px-10 lg:py-16">
          <PostBody value={body} />
        </div>
      </article>

      {children}
    </div>
  );
}
