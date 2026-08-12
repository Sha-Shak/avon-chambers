"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { mediaConfig } from "@/config/media.config";
import { urlForImage } from "@/sanity/image";
import type { InsightMeta } from "@/types";

type SortOrder = "newest" | "oldest";
const PAGE_SIZE = 9;

function byPublishedDate(a: InsightMeta, b: InsightMeta, order: SortOrder) {
  const difference =
    new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
  return order === "newest" ? -difference : difference;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    // Formatting in a fixed timezone makes the server and browser output
    // identical, including around midnight in the visitor's local timezone.
    timeZone: "UTC",
  });
}

/** A complete, date-sortable archive that keeps the listing manageable as it grows. */
export function InsightsCollection({ insights }: { insights: InsightMeta[] }) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [page, setPage] = useState(1);
  const sortedInsights = useMemo(
    () => [...insights].sort((a, b) => byPublishedDate(a, b, sortOrder)),
    [insights, sortOrder],
  );
  const totalPages = Math.ceil(sortedInsights.length / PAGE_SIZE);
  const pageStart = (page - 1) * PAGE_SIZE;
  const visibleInsights = sortedInsights.slice(pageStart, pageStart + PAGE_SIZE);

  function changeSortOrder(order: SortOrder) {
    setSortOrder(order);
    setPage(1);
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-foreground/10 pb-5">
        <p className="text-sm text-muted-foreground">
          {insights.length} {insights.length === 1 ? "article" : "articles"}
        </p>
        <label className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>Sort by</span>
          <select
            aria-label="Sort articles"
            value={sortOrder}
            onChange={(event) => changeSortOrder(event.target.value as SortOrder)}
            className="border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>

      <div className="divide-y divide-foreground/10 border-y border-foreground/10">
        {visibleInsights.map((insight, i) => (
          <FadeIn key={insight.slug} delay={i * 45}>
            <article className="grid gap-5 py-8 sm:grid-cols-[12rem_10rem_minmax(0,1fr)_auto] sm:items-start sm:gap-8">
              <Link
                href={`/insights/${insight.slug}`}
                className="relative aspect-4/3 overflow-hidden bg-secondary"
                aria-label={`Read ${insight.title}`}
              >
                {insight.coverImage?.asset ? (
                  <Image
                    src={urlForImage(insight.coverImage).width(480).height(360).url()}
                    alt={insight.coverImage.alt ?? ""}
                    fill
                    sizes="(min-width: 640px) 12rem, 100vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <Image
                    src={mediaConfig.brand.logo.src}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 12rem, 100vw"
                    className="object-contain p-10 opacity-20"
                  />
                )}
              </Link>
              <div className="text-xs text-muted-foreground">
                <p className="tracking-[0.12em] text-foreground uppercase">{insight.category}</p>
                <time className="mt-2 block" dateTime={insight.publishedAt}>
                  {formatDate(insight.publishedAt)}
                </time>
              </div>
              <div>
                <h2 className="text-2xl leading-snug text-foreground sm:text-3xl">
                  <Link href={`/insights/${insight.slug}`} className="hover:underline">
                    {insight.title}
                  </Link>
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {insight.excerpt}
                </p>
              </div>
              <Link
                href={`/insights/${insight.slug}`}
                className="inline-flex items-center gap-2 text-[0.75rem] tracking-[0.14em] text-foreground uppercase hover:underline sm:pt-1"
              >
                Read <ArrowRight className="size-3.5" />
              </Link>
            </article>
          </FadeIn>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-between gap-4" aria-label="Article pagination">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPage((currentPage) => currentPage - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Page {page} of {totalPages}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => setPage((currentPage) => currentPage + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </nav>
      )}
    </>
  );
}
