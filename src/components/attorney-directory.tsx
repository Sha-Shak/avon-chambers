"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AttorneyCard } from "@/components/cards/attorney-card";
import { FadeIn } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import type { Attorney } from "@/types";

const PAGE_SIZE = 2;

export function AttorneyDirectory({ attorneys }: { attorneys: Attorney[] }) {
  const [visibleCount, setVisibleCount] = useState(Math.min(PAGE_SIZE, attorneys.length));
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = visibleCount < attorneys.length;

  const loadMore = useCallback(() => {
    setVisibleCount((count) => Math.min(count + PAGE_SIZE, attorneys.length));
  }, [attorneys.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) loadMore();
    }, { rootMargin: "180px" });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div>
      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {attorneys.slice(0, visibleCount).map((attorney, index) => (
          <FadeIn key={attorney.slug} delay={index * 60}>
            <AttorneyCard attorney={attorney} />
          </FadeIn>
        ))}
      </div>
      {hasMore && (
        <div ref={sentinelRef} className="mt-12 flex justify-center">
          <Button type="button" variant="navyOutline" onClick={loadMore}>
            Load more attorneys
          </Button>
        </div>
      )}
    </div>
  );
}
