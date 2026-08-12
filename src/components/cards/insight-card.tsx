import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAttorney } from "@/lib/data";
import { mediaConfig } from "@/config/media.config";
import { urlForImage } from "@/sanity/image";
import type { InsightMeta } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function InsightCard({ insight }: { insight: InsightMeta }) {
  const author = insight.authorSlug
    ? getAttorney(insight.authorSlug)
    : undefined;

  return (
    <article className="flex h-full flex-col bg-card">
      {/* object-contain (never object-cover) so cover images of any aspect ratio sit fully
          visible on their neutral frame instead of being cropped or stretched. */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-secondary">
        {insight.coverImage?.asset ? (
          <Image
            // Only constrain width: passing both width AND height makes the Sanity image
            // pipeline auto center-crop to that exact aspect ratio, even with fit=max. A
            // width-only request returns the full, uncropped image at any aspect ratio,
            // and object-contain below fits it cleanly into the frame.
            src={urlForImage(insight.coverImage.asset).width(900).url()}
            alt={insight.coverImage.alt ?? insight.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Image
              src={mediaConfig.brand.logo.src}
              alt=""
              width={40}
              height={40}
              className="opacity-15"
            />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-foreground/70 px-5 py-3 text-cream backdrop-blur-sm">
          <div className="flex items-center gap-2 text-[0.6875rem] tracking-[0.12em] uppercase">
            <span>{insight.category}</span>
            <span aria-hidden>·</span>
            <time
              dateTime={insight.publishedAt}
              className="tracking-normal normal-case"
            >
              {formatDate(insight.publishedAt)}
            </time>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-8">
        <h3 className="text-xl leading-snug text-foreground">
          <Link href={`/insights/${insight.slug}`} className="hover:underline">
            {insight.title}
          </Link>
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {insight.excerpt}
        </p>
        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>{author ? author.name : "Avon Chambers"}</span>
          <span>{insight.readingTime}</span>
        </div>
        <Link
          href={`/insights/${insight.slug}`}
          className="mt-6 inline-flex items-center gap-2 text-[0.75rem] tracking-[0.14em] text-foreground uppercase"
        >
          Read article <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}
