"use client";

import { useEffect, useState } from "react";
import { InsightCard } from "@/components/cards/insight-card";
import { cn } from "@/lib/utils";
import type { InsightMeta } from "@/types";

/**
 * Auto-advancing groups of the latest articles. Each slide uses the same card
 * grid as the Articles listing so visitors can scan several posts at once.
 */
export function ArticlesCarousel({
  insights,
  intervalMs = 7000,
}: {
  insights: InsightMeta[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slides = Array.from(
    { length: Math.ceil(insights.length / 3) },
    (_, slideIndex) => insights.slice(slideIndex * 3, slideIndex * 3 + 3),
  );

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      intervalMs,
    );
    return () => clearInterval(timer);
  }, [paused, slides.length, intervalMs]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid">
        {slides.map((slide, i) => (
          <div
            key={slide.map((insight) => insight.slug).join("-")}
            aria-hidden={i !== index}
            className={cn(
              "col-start-1 row-start-1 transition-opacity duration-700 ease-out",
              i === index ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <div className="grid gap-px border border-foreground/10 bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
              {slide.map((insight) => (
                <InsightCard key={insight.slug} insight={insight} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.map((insight) => insight.slug).join("-")}
              type="button"
              aria-label={`Show article group ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "size-2 rounded-full transition-colors",
                i === index
                  ? "bg-foreground"
                  : "bg-foreground/25 hover:bg-foreground/50",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
