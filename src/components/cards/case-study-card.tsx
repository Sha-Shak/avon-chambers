import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { practiceAreaTitle } from "@/config/case-study.config";
import { mediaConfig } from "@/config/media.config";
import { pictureUrl } from "@/lib/posts";
import type { CaseStudyMeta } from "@/types";

export function CaseStudyCard({ study }: { study: CaseStudyMeta }) {
  const href = `/case-studies/${study.slug}`;
  const imageUrl = pictureUrl(study.coverImage, 900, 600);
  const primaryArea = study.practiceAreaSlugs[0]
    ? practiceAreaTitle(study.practiceAreaSlugs[0])
    : "Case study";
  const highlight = study.keyResults?.[0];

  return (
    <article className="frost group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={href} className="relative block aspect-3/2 overflow-hidden bg-secondary" aria-label={study.title}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={study.coverImage?.alt ?? study.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            loading="lazy"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Image src={mediaConfig.brand.logo.src} alt="" width={48} height={48} className="opacity-15" />
          </div>
        )}
        <span className="absolute top-4 left-4 bg-navy/80 px-3 py-1 text-[0.625rem] tracking-[0.14em] text-cream uppercase backdrop-blur-sm">
          {primaryArea}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-7">
        {study.matterType && <p className="eyebrow">{study.matterType}</p>}
        <h2 className="mt-4 text-xl leading-snug text-foreground">
          <Link href={href} className="hover:underline">
            {study.title}
          </Link>
        </h2>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{study.excerpt}</p>

        {highlight && (
          <div className="mt-6 border-t border-foreground/10 pt-5">
            <p className="font-serif text-2xl text-foreground">{highlight.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{highlight.label}</p>
          </div>
        )}

        <Link
          href={href}
          className="mt-6 inline-flex items-center gap-2 text-[0.75rem] tracking-[0.14em] text-foreground uppercase"
        >
          Read case study <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
