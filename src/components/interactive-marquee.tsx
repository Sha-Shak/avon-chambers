"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** How long a user interaction (drag/wheel) pauses the auto-scroll before it resumes. */
const RESUME_DELAY_MS = 2600;

/**
 * A marquee that auto-scrolls sideways, but hands control to the user the moment
 * they touch it: drag (mouse or touch) or spin the wheel to move it yourself,
 * and it quietly resumes auto-scrolling a couple of seconds after you let go.
 *
 * Renders each item once. Automatic scrolling reverses at either end.
 *
 * `items` takes already-rendered elements (one per item, in a stable order)
 * rather than a render-prop, so a Server Component caller can build the cards
 * itself — functions can't cross the server/client boundary, but JSX can.
 */
export function InteractiveMarquee({
  items,
  speedPxPerSec = 34,
  ariaLabel,
  className,
  trackClassName,
}: {
  items: ReactNode[];
  speedPxPerSec?: number;
  ariaLabel: string;
  className?: string;
  trackClassName?: string;
}) {
  const directionRef = useRef(1);

  const trackRef = useRef<HTMLDivElement>(null);
  const pausedUntilRef = useRef(0);
  const draggingRef = useRef(false);
  const hoveredRef = useRef(false);
  const dragRef = useRef({ startX: 0, startScrollLeft: 0, moved: false, pointerId: 0 });
  const reducedMotionRef = useRef(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const wrapScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    if (track.scrollLeft >= maxScroll - 1) directionRef.current = -1;
    if (track.scrollLeft <= 1) directionRef.current = 1;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  }, []);

  useEffect(() => {
    if (reducedMotionRef.current) return;
    let last: number | null = null;
    let raf = 0;

    const step = (now: number) => {
      if (last === null) last = now;
      const dt = Math.min(now - last, 50);
      last = now;
      const track = trackRef.current;
      if (track && visibleRef.current && !document.hidden && !draggingRef.current && !hoveredRef.current && !track.contains(document.activeElement) && now >= pausedUntilRef.current) {
        track.scrollLeft += (directionRef.current * speedPxPerSec * dt) / 1000;
        wrapScroll();
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [speedPxPerSec, wrapScroll]);

  const pause = useCallback((ms = RESUME_DELAY_MS) => {
    pausedUntilRef.current = performance.now() + ms;
  }, []);

  // Native listener (not React's onWheel) so preventDefault actually takes
  // effect — the wheel event is passive by default, which would otherwise
  // let the page scroll vertically at the same time.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      if ((delta < 0 && track.scrollLeft <= 0) || (delta > 0 && track.scrollLeft >= maxScroll - 1)) return;
      e.preventDefault();
      track.scrollLeft += delta;
      wrapScroll();
      pause();
    };

    track.addEventListener("wheel", handleWheel, { passive: false });
    return () => track.removeEventListener("wheel", handleWheel);
  }, [pause, wrapScroll]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    draggingRef.current = true;
    dragRef.current = { startX: e.clientX, startScrollLeft: track.scrollLeft, moved: false, pointerId: e.pointerId };
    // Pointer capture is intentionally NOT taken here. Capturing on every
    // pointerdown — even a plain click with no movement — retargets the
    // click event that follows to this element instead of whatever was
    // actually under the pointer, silently swallowing every card link.
    // It's taken lazily in onPointerMove, only once a drag is confirmed.
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const track = trackRef.current;
    if (!track) return;
    const dx = e.clientX - dragRef.current.startX;
    if (!dragRef.current.moved && Math.abs(dx) > 3) {
      dragRef.current.moved = true;
      track.setPointerCapture(dragRef.current.pointerId);
    }
    if (dragRef.current.moved) {
      track.scrollLeft = dragRef.current.startScrollLeft - dx;
    }
  }, []);

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      wrapScroll();
      pause();
      const track = trackRef.current;
      if (track?.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
    },
    [pause, wrapScroll],
  );

  const onScroll = useCallback(() => {
    if (draggingRef.current) wrapScroll();
  }, [wrapScroll]);

  const onPointerEnter = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") hoveredRef.current = true;
  }, []);

  const onPointerLeave = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse") hoveredRef.current = false;
      endDrag(e);
    },
    [endDrag],
  );

  const onClickCapture = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (dragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current.moved = false;
    }
  }, []);

  if (items.length === 0) return null;

  return (
    <div className={cn("overflow-hidden", className)} role="group" aria-label={ariaLabel}>
      <div
        ref={trackRef}
        className={cn(
          "flex cursor-grab touch-pan-y overflow-x-auto scroll-auto [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden",
          trackClassName,
        )}
        style={{ overscrollBehaviorX: "contain" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerCancel={endDrag}
        onScroll={onScroll}
        onClickCapture={onClickCapture}
        onFocusCapture={() => { hoveredRef.current = true; }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) hoveredRef.current = false;
        }}
      >
        {items.map((item, index) => (
          <div key={index} className="contents">{item}</div>
        ))}
      </div>
    </div>
  );
}
