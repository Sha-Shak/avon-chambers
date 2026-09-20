import { Quote } from "lucide-react";
import { InteractiveMarquee } from "@/components/interactive-marquee";
import { cn } from "@/lib/utils";
import type { ClientTestimonial } from "@/types";

/**
 * Clients' words as a slow, auto-scrolling strip of frosted cards
 * that visitors can also drag or scroll themselves (see InteractiveMarquee).
 *
 * Every card is the same shape so the strip stays coherent; only the gold
 * corner brackets alternate — top-left + bottom-right on one card, top-right
 * + bottom-left on the next. It sits on a photo backdrop, where everything is
 * always dark, so it looks the same in light and dark theme.
 */
export function TestimonialMarquee({ testimonials }: { testimonials: ClientTestimonial[] }) {
  // The marquee repeats its items to loop. With an odd number of cards the
  // corner pattern would clash where one loop ends and the next begins (two
  // same-corner cards side by side), so odd lists are doubled to keep the
  // alternation unbroken.
  const cards = testimonials.length % 2 === 1 ? [...testimonials, ...testimonials] : testimonials;

  return (
    <InteractiveMarquee
      ariaLabel="Clients' testimonials"
      speedPxPerSec={28}
      className="[mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]"
      trackClassName="py-3"
      items={cards.map((testimonial, index) => (
        <figure
          key={index}
          className="frost-strong relative me-8 flex w-[min(84vw,25rem)] shrink-0 flex-col items-center px-9 py-11 text-center"
        >
          <Corner position={index % 2 === 0 ? "top-left" : "top-right"} />
          <Corner position={index % 2 === 0 ? "bottom-right" : "bottom-left"} />

          <Quote className="size-7 fill-gold/25 text-gold" strokeWidth={1.25} aria-hidden />
          <blockquote className="mt-6 flex-1 font-serif text-lg leading-relaxed text-foreground italic">
            {testimonial.quote}
          </blockquote>
          <span aria-hidden className="mt-8 flex items-center gap-2">
            <span className="h-px w-8 bg-gold/60" />
            <span className="size-1.5 rotate-45 bg-gold" />
            <span className="h-px w-8 bg-gold/60" />
          </span>
        </figure>
      ))}
    />
  );
}

/** A small L-shaped gold bracket sitting on one corner of a card. */
function Corner({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute size-8 border-gold",
        position === "top-left" && "-top-px -left-px border-t-2 border-l-2",
        position === "top-right" && "-top-px -right-px border-t-2 border-r-2",
        position === "bottom-left" && "-bottom-px -left-px border-b-2 border-l-2",
        position === "bottom-right" && "-right-px -bottom-px border-r-2 border-b-2",
      )}
    />
  );
}
