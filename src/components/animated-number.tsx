"use client";

import { useEffect, useRef, useState } from "react";

const NUMBER_PATTERN = /^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/;

function parts(value: string) {
  const match = value.match(NUMBER_PATTERN);
  if (!match) return null;
  const [, prefix, numString, suffix] = match;
  const decimals = numString.includes(".") ? numString.split(".")[1].length : 0;
  const useGrouping = numString.replace(/\D/g, "").length >= 4;
  return { prefix, suffix, decimals, useGrouping, target: parseFloat(numString.replace(/,/g, "")) };
}

function format(n: number, decimals: number, useGrouping: boolean) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping });
}

/**
 * Counts up from zero to the numeric value it's given, then settles on the
 * exact original string. Values with no digits (e.g. "NYSBA") render as-is —
 * there's nothing to animate. Starts once scrolled into view.
 */
export function AnimatedNumber({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const parsed = parts(value);
  const [display, setDisplay] = useState(() => (parsed ? `${parsed.prefix}${format(0, parsed.decimals, parsed.useGrouping)}${parsed.suffix}` : value));

  useEffect(() => {
    const el = ref.current;
    if (!el || !parsed) return;

    const animate = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setDisplay(value);
        return;
      }
      const duration = 1400;
      const start = performance.now();
      let raf: number;
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        if (progress < 1) {
          setDisplay(`${parsed.prefix}${format(parsed.target * eased, parsed.decimals, parsed.useGrouping)}${parsed.suffix}`);
          raf = requestAnimationFrame(tick);
        } else {
          setDisplay(value);
        }
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    };

    const safetyTimer = setTimeout(() => setDisplay(value), 2000);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          clearTimeout(safetyTimer);
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      clearTimeout(safetyTimer);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
