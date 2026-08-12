"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FadeIn({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  variant = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  /** Direction the content settles in from. Defaults to "up", the idiom used across most of the site. */
  variant?: "up" | "left" | "right";
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Safety net: if IntersectionObserver never fires for any reason (a
    // hydration hiccup, a browser without support, an element whose size
    // makes the threshold hard to hit), force this visible after a short
    // delay rather than leaving it at opacity:0 forever. Losing the reveal
    // animation once in a while is a minor cosmetic issue; content that
    // never becomes visible is not.
    const safetyTimer = setTimeout(() => setVisible(true), 2000);

    if (typeof IntersectionObserver === "undefined") {
      return () => clearTimeout(safetyTimer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          clearTimeout(safetyTimer);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => {
      clearTimeout(safetyTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(`fade-${variant}`, className)}
    >
      {children}
    </Tag>
  );
}
