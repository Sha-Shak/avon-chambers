import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Decorative reveals must never hide server-rendered content or require hydration. */
export function FadeIn({ children, className, as: Tag = "div", variant = "up" }: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  variant?: "up" | "left" | "right";
}) {
  return <Tag className={cn(`fade-${variant}`, className)}>{children}</Tag>;
}
