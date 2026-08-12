"use client";

import { useMemo, useState } from "react";
import { FeaturedInsightCard } from "@/components/cards/featured-insight-card";
import { InsightCard } from "@/components/cards/insight-card";
import { FadeIn } from "@/components/fade-in";
import type { InsightMeta } from "@/types";

type SortOrder = "newest" | "oldest";

function byPublishedDate(a: InsightMeta, b: InsightMeta, order: SortOrder) {
  const difference =
    new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
  return order === "newest" ? -difference : difference;
}

/** Keeps every article visible while letting readers order the archive by publication date. */
export function InsightsCollection({ insights }: { insights: InsightMeta[] }) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const sortedInsights = useMemo(
    () => [...insights].sort((a, b) => byPublishedDate(a, b, sortOrder)),
    [insights, sortOrder],
  );
  const [featured, ...remainingInsights] = sortedInsights;

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
            onChange={(event) => setSortOrder(event.target.value as SortOrder)}
            className="border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>

      {featured && (
        <FeaturedInsightCard
          insight={featured}
          label={sortOrder === "newest" ? "Latest" : "First published"}
        />
      )}
      {remainingInsights.length > 0 && (
        <div className="mt-16 grid gap-px border border-foreground/10 bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
          {remainingInsights.map((insight, i) => (
            <FadeIn key={insight.slug} delay={i * 60}>
              <InsightCard insight={insight} />
            </FadeIn>
          ))}
        </div>
      )}
    </>
  );
}
