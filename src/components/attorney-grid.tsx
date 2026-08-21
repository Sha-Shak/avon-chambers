import { AttorneyCard } from "@/components/cards/attorney-card";
import { FadeIn } from "@/components/fade-in";
import { cn } from "@/lib/utils";
import type { Attorney } from "@/types";

/** Grid columns shared by every attorney listing on the site — keep this the
 *  single source of truth so the home, about, practice-area and directory
 *  sections can never drift out of sync with each other. */
export const ATTORNEY_GRID_COLUMNS_CLASS = "sm:grid-cols-2 lg:grid-cols-4";

/**
 * The attorney-card grid used wherever attorneys are listed (home, about,
 * a practice area's "team" section, and the full directory). Centralizing it
 * means the columns, gap and reveal stagger only need to be tuned once.
 */
export function AttorneyGrid({
  attorneys,
  gap = "gap-12",
  delayStepMs = 60,
  className,
}: {
  attorneys: Attorney[];
  /** Tailwind gap utility, e.g. "gap-8" or "gap-12" — sections vary this to match their surrounding rhythm. */
  gap?: string;
  /** Stagger, in ms, between each card's reveal animation. */
  delayStepMs?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid", ATTORNEY_GRID_COLUMNS_CLASS, gap, className)}>
      {attorneys.map((attorney, index) => (
        <FadeIn key={attorney.slug} delay={index * delayStepMs}>
          <AttorneyCard attorney={attorney} />
        </FadeIn>
      ))}
    </div>
  );
}
