"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AttorneyGrid } from "@/components/attorney-grid";
import { Button } from "@/components/ui/button";
import type { Attorney } from "@/types";

/**
 * Attorneys revealed per "page". 4 divides evenly into every breakpoint's
 * column count (1 on mobile, 2 on sm, 4 on lg — see ATTORNEY_GRID_COLUMNS_CLASS
 * in attorney-grid.tsx) so a batch always completes whole rows instead of
 * leaving a partial row dangling. If the grid's columns ever change, update
 * this to their least common multiple to stay row-aligned at every breakpoint.
 */
const DEFAULT_ITEMS_PER_PAGE = 4;

/** Floor time the spinner stays up for, so an auto-triggered load reads as
    a deliberate fetch rather than a flicker — mirrors RouteLoader's approach. */
const LOAD_MORE_DELAY_MS = 500;

export function AttorneyDirectory({
  attorneys,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
}: {
  attorneys: Attorney[];
  /** Attorneys revealed per batch. Defaults to a value that stays row-aligned at every breakpoint — see {@link DEFAULT_ITEMS_PER_PAGE}. */
  itemsPerPage?: number;
}) {
  const [visibleCount, setVisibleCount] = useState(Math.min(itemsPerPage, attorneys.length));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const timeoutRef = useRef<number | undefined>(undefined);
  const hasMore = visibleCount < attorneys.length;

  const loadMore = useCallback(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setIsLoadingMore(true);
    timeoutRef.current = window.setTimeout(() => {
      setVisibleCount((count) => Math.min(count + itemsPerPage, attorneys.length));
      loadingRef.current = false;
      setIsLoadingMore(false);
    }, LOAD_MORE_DELAY_MS);
  }, [attorneys.length, itemsPerPage]);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

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
      <AttorneyGrid attorneys={attorneys.slice(0, visibleCount)} />
      {hasMore && (
        <div ref={sentinelRef} className="mt-12 flex justify-center">
          {isLoadingMore ? (
            <div
              className="flex flex-col items-center gap-3"
              role="status"
              aria-live="polite"
              aria-label="Loading more attorneys"
            >
              <Image
                src="/images/brand/Avon_Chambers_Logo.webp"
                alt=""
                width={40}
                height={40}
                className="size-10 animate-[spin_2.5s_linear_infinite] object-contain motion-reduce:animate-none"
              />
            </div>
          ) : (
            <Button type="button" variant="navyOutline" onClick={loadMore}>
              Load more attorneys
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
