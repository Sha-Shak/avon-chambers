import Image from "next/image";
import { InteractiveMarquee } from "@/components/interactive-marquee";
import type { ClientTestimonial } from "@/types";

const FALLBACK_AVATAR = "/images/brand/attorney-placeholder.svg";

export function TestimonialsMarquee({ testimonials }: { testimonials: ClientTestimonial[] }) {
  return (
    <InteractiveMarquee
      ariaLabel="Client experience"
      className="testimonials-marquee"
      trackClassName="py-1"
      items={testimonials.map((testimonial, index) => (
        <figure
          key={`${testimonial.name}-${index}`}
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
      ))}
    />
  );
}
