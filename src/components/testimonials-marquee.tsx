import type { CSSProperties } from "react";
import Image from "next/image";
import type { ClientTestimonial } from "@/types";

const FALLBACK_AVATAR = "/images/brand/attorney-placeholder.svg";

/**
 * The track is built from whole repeats of the testimonial set and shifted by
 * exactly one repeat, so the loop is seamless. Spacing lives on each card as a
 * trailing margin (not a flex `gap`) so one repeat is precisely 1/nth of the
 * track width — a `gap` would leave the shift half a gap short and make the
 * loop jump.
 */
const MIN_TRACK_ITEMS = 12;

/** Seconds a card takes to travel its own slot; keeps the pace set-size agnostic. */
const SECONDS_PER_ITEM = 28;

export function TestimonialsMarquee({ testimonials }: { testimonials: ClientTestimonial[] }) {
  if (testimonials.length === 0) return null;

  const repeats = Math.max(2, Math.ceil(MIN_TRACK_ITEMS / testimonials.length));

  return (
    <div className="testimonials-marquee overflow-hidden" role="group" aria-label="Client experience">
      <div
        className="testimonials-marquee-track flex w-max py-1"
        style={
          {
            "--marquee-shift": `-${100 / repeats}%`,
            "--marquee-duration": `${testimonials.length * SECONDS_PER_ITEM}s`,
          } as CSSProperties
        }
      >
        {Array.from({ length: repeats }, (_, repeat) =>
          testimonials.map((testimonial, index) => (
            <figure
              key={`${repeat}-${testimonial.name}-${index}`}
              aria-hidden={repeat > 0 || undefined}
              className="me-6 flex w-[min(86vw,24rem)] shrink-0 flex-col border border-foreground/10 bg-card p-8 lg:w-[18rem]"
            >
              <blockquote className="flex-1 text-base leading-relaxed text-muted-foreground italic">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3 border-t border-foreground/10 pt-5">
                <Image
                  src={testimonial.image ?? FALLBACK_AVATAR}
                  alt={testimonial.image ? testimonial.name : ""}
                  width={44}
                  height={44}
                  className="size-11 rounded-full border border-foreground/10 object-cover"
                />
                <div>
                  <p className="text-sm text-foreground">{testimonial.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </figcaption>
            </figure>
          )),
        )}
      </div>
    </div>
  );
}
