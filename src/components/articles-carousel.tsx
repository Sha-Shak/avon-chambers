"use client";

import { useEffect, useState } from "react";
import { FeaturedInsightCard } from "@/components/cards/featured-insight-card";
import { cn } from "@/lib/utils";
import type { InsightMeta } from "@/types";

/**
 * Auto-advancing "quick view" of the latest articles, one at a time, in the
 * same large editorial treatment as the Articles listing page's featured
 * post. Built to handle several articles gracefully — with only one it just
 * renders that one, no dots, no timer, nothing that implies more exists.
 */
export function ArticlesCarousel({ insights, intervalMs = 7000 }: { insights: InsightMeta[]; intervalMs?: number }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || insights.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => setIndex((i) => (i + 1) % insights.length), intervalMs);
    return () => clearInterval(timer);
  }, [paused, insights.length, intervalMs]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="grid">
        {insights.map((insight, i) => (
          <div
            key={insight.slug}
            aria-hidden={i !== index}
            className={cn(
              "col-start-1 row-start-1 transition-opacity duration-700 ease-out",
              i === index ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <FeaturedInsightCard insight={insight} priority={i === 0} />
          </div>
        ))}
      </div>

      {insights.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {insights.map((insight, i) => (
            <button
              key={insight.slug}
              type="button"
              aria-label={`Show article ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "size-2 rounded-full transition-colors",
                i === index ? "bg-foreground" : "bg-foreground/25 hover:bg-foreground/50",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
