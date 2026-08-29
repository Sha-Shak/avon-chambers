import { LawyerCard } from "@/components/cards/lawyer-card";
import { FadeIn } from "@/components/fade-in";
import { cn } from "@/lib/utils";
import type { Lawyer } from "@/types";

/** Grid columns shared by every lawyer listing on the site — keep this the
 *  single source of truth so the home, about, practice-area and directory
 *  sections can never drift out of sync with each other. */
export const LAWYER_GRID_COLUMNS_CLASS = "sm:grid-cols-2 lg:grid-cols-4";

/**
 * The lawyer-card grid used wherever lawyers are listed (home, about,
 * a practice area's "team" section, and the full directory). Centralizing it
 * means the columns, gap and reveal stagger only need to be tuned once.
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
  return (
    <div className={cn("grid", LAWYER_GRID_COLUMNS_CLASS, gap, className)}>
      {lawyers.map((lawyer, index) => (
        <FadeIn key={lawyer.slug} delay={index * delayStepMs}>
          <LawyerCard lawyer={lawyer} />
        </FadeIn>
      ))}
    </div>
  );
}
