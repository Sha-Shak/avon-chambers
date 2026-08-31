import { LawyerCard } from "@/components/cards/lawyer-card";
import { FadeIn } from "@/components/fade-in";
import { cn } from "@/lib/utils";
import type { Lawyer } from "@/types";

/** Grid columns shared by every lawyer listing on the site — keep this the
 *  single source of truth so the home, about, practice-area and directory
 *  sections can never drift out of sync with each other. */
export const LAWYER_GRID_COLUMNS_CLASS = "sm:grid-cols-2 lg:grid-cols-4";

/** Widest column count `LAWYER_GRID_COLUMNS_CLASS` reaches (its `lg:grid-cols-4`) —
 *  used to size cards identically when a shorter list is centered instead of gridded. */
const MAX_COLUMNS = 4;

/**
 * The lawyer-card grid used wherever lawyers are listed (home, about,
 * a practice area's "team" section, and the full directory). Centralizing it
 * means the columns, gap and reveal stagger only need to be tuned once.
 *
 * A list shorter than `MAX_COLUMNS` would otherwise sit flush left with an
 * empty trailing cell (CSS grid never centers a partial row on its own), so
 * those switch to a centered flex row instead — cards keep the exact width
 * they'd have in the full grid, they just don't stretch to fill it.
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

  const isPartialRow = lawyers.length < MAX_COLUMNS;

  return (
    <div
      className={cn(
        isPartialRow ? "flex flex-wrap justify-center" : cn("grid", LAWYER_GRID_COLUMNS_CLASS),
        gap,
        className,
      )}
    >
      {lawyers.map((lawyer, index) => (
        <FadeIn
          key={lawyer.slug}
          delay={index * delayStepMs}
          className={isPartialRow ? "w-full sm:w-1/2 lg:w-1/4" : undefined}
        >
          <LawyerCard lawyer={lawyer} />
        </FadeIn>
      ))}
    </div>
  );
}
