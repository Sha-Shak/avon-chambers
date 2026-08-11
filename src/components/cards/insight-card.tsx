import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAttorney } from "@/lib/data";
import type { InsightMeta } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

export function InsightCard({ insight }: { insight: InsightMeta }) {
  const author = insight.authorSlug ? getAttorney(insight.authorSlug) : undefined;

  return (
    <article className="bg-card p-8">
      <div className="flex items-center gap-3 text-xs text-slate">
        <span className="tracking-[0.12em] text-navy uppercase">{insight.category}</span>
        <span aria-hidden>·</span>
        <span>{formatDate(insight.publishedAt)}</span>
      </div>
      <h3 className="mt-6 text-xl leading-snug text-navy">
        <Link href={`/insights/${insight.slug}`} className="hover:underline">
          {insight.title}
        </Link>
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-slate">{insight.excerpt}</p>
      <div className="mt-6 flex items-center justify-between text-xs text-slate">
        <span>{author ? author.name : "Avon Chambers"}</span>
        <span>{insight.readingTime}</span>
      </div>
      <Link
        href={`/insights/${insight.slug}`}
        className="mt-6 inline-flex items-center gap-2 text-[0.75rem] tracking-[0.14em] text-navy uppercase"
      >
        Read article <ArrowRight className="size-3.5" />
      </Link>
    </article>
  );
}
