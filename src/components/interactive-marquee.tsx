"use client";

import { Fragment, useCallback, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Minimum number of item-slots to fill before repeating the set, so the loop never feels short. */
const MIN_TRACK_ITEMS = 12;

/** How long a user interaction (drag/wheel) pauses the auto-scroll before it resumes. */
const RESUME_DELAY_MS = 2600;

/**
 * A marquee that auto-scrolls sideways, but hands control to the user the moment
 * they touch it: drag (mouse or touch) or spin the wheel to move it yourself,
 * and it quietly resumes auto-scrolling a couple of seconds after you let go.
 *
 * Built on native horizontal scroll (not a CSS keyframe transform) so drag and
 * wheel input can drive the same `scrollLeft` the rAF loop advances. At least
 * three repeats of the item set are rendered so the loop can always jump
 * backward or forward by exactly one repeat-width without a visible seam.
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
  const repeats = Math.max(3, Math.ceil(MIN_TRACK_ITEMS / Math.max(items.length, 1)));

  const trackRef = useRef<HTMLDivElement>(null);
  const pausedUntilRef = useRef(0);
  const draggingRef = useRef(false);
  const hoveredRef = useRef(false);
  const dragRef = useRef({ startX: 0, startScrollLeft: 0, moved: false });
  const reducedMotionRef = useRef(false);

  const wrapScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const repeatWidth = track.scrollWidth / repeats;
    if (repeatWidth <= 0) return;
    const lower = repeatWidth * 0.5;
    const upper = repeatWidth * (repeats - 1.5);
    if (track.scrollLeft < lower) {
      track.scrollLeft += repeatWidth;
    } else if (track.scrollLeft > upper) {
      track.scrollLeft -= repeatWidth;
    }
  }, [repeats]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollLeft = track.scrollWidth / repeats;
  }, [repeats]);

  useEffect(() => {
    if (reducedMotionRef.current) return;
    let last: number | null = null;
    let raf = 0;

    const step = (now: number) => {
      if (last === null) last = now;
      const dt = now - last;
      last = now;
      const track = trackRef.current;
      if (track && !draggingRef.current && !hoveredRef.current && now >= pausedUntilRef.current) {
        track.scrollLeft += (speedPxPerSec * dt) / 1000;
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
    dragRef.current = { startX: e.clientX, startScrollLeft: track.scrollLeft, moved: false };
    track.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const track = trackRef.current;
    if (!track) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 3) dragRef.current.moved = true;
    track.scrollLeft = dragRef.current.startScrollLeft - dx;
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
      >
        {Array.from({ length: repeats }, (_, repeat) => (
          <Fragment key={repeat}>
            {items.map((item, index) => (
              // `contents` keeps this wrapper out of the box tree so the item
              // beneath it is still a direct flex child of the track — that's
              // what lets align-items:stretch equalize every card's height.
              <div key={`${repeat}-${index}`} className="contents" aria-hidden={repeat > 0 || undefined}>
                {item}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
