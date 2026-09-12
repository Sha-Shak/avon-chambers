import { LawyerCard } from "@/components/cards/lawyer-card";
import { FadeIn } from "@/components/fade-in";
import { cn } from "@/lib/utils";
import type { Lawyer } from "@/types";

/**
 * Card width per breakpoint, paired with each supported `gap`. A plain
 * `w-1/3` alongside a flex `gap` overflows a 3-up row (the gap adds width
 * on top of the three 33% shares), which wraps the 3rd card onto its own
 * line — so each share subtracts its portion of the gap via `calc()`,
 * keeping true 2-up/3-up rows at their breakpoints.
 */
const ITEM_WIDTH_BY_GAP: Record<string, string> = {
  "gap-12": "w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-2rem)]",
  "gap-8": "w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]",
};

/**
 * The lawyer-card grid used wherever lawyers are listed (home, about,
 * a practice area's "team" section, and the full directory). Centralizing it
 * means the columns, gap and reveal stagger only need to be tuned once.
 *
 * Always a centered flex-wrap row rather than a CSS grid: flexbox centers
 * each wrapped line independently, so a remainder row (e.g. 5 cards wrapping
 * to 4 + 1) auto-centers with no special-casing by count.
 */
export function LawyerGrid({
  lawyers,
  gap = "gap-12",
  delayStepMs = 60,
  className,
}: {
  lawyers: Lawyer[];
  /** Tailwind gap utility, e.g. "gap-8" or "gap-12" — sections vary this to match their surrounding rhythm. */
  gap?: string;
  /** Stagger, in ms, between each card's reveal animation. */
  delayStepMs?: number;
  className?: string;
}) {
  if (lawyers.length === 0) return null;

  const itemWidth = ITEM_WIDTH_BY_GAP[gap] ?? ITEM_WIDTH_BY_GAP["gap-12"];

  return (
    <div className={cn("flex flex-wrap justify-center", gap, className)}>
      {lawyers.map((lawyer, index) => (
        <FadeIn key={lawyer.slug} delay={index * delayStepMs} className={itemWidth}>
          <LawyerCard lawyer={lawyer} />
        </FadeIn>
      ))}
    </div>
  );
}
