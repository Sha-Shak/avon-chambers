"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  eyebrow: string;
  heading: string;
  subheading: string;
  image: { src: string; alt: string };
}

/**
 * The homepage hero: a full-bleed photo slideshow with the copy — on a
 * frosted glass panel — floating on top. Text and image share one index so
 * they cross-fade together (branding → track record → practice areas).
 *
 * One layout at every breakpoint (no separate mobile-stacked variant): the
 * photo always fills the section, so there's nothing to reflow between
 * screen sizes, and the glass panel guarantees the text reads clearly
 * against any photo underneath it, in either theme.
 */
export function Hero({ slides, intervalMs }: { slides: readonly HeroSlide[]; intervalMs: number }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), intervalMs);
    return () => clearInterval(timer);
  }, [paused, slides.length, intervalMs]);

  return (
    <div
      className="relative h-[38rem] sm:h-[42rem] lg:h-[44rem]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <Image
          key={slide.image.src}
          src={slide.image.src}
          alt={slide.image.alt}
          fill
          sizes="100vw"
          className={cn(
            "object-cover transition-[opacity,transform] duration-[1600ms] ease-out",
            i === index ? "scale-100 opacity-100" : "scale-105 opacity-0",
          )}
          priority={i === 0}
        />
      ))}

      {/* Gradient wash so the glass panel and dots stay legible over any part of any photo. */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-navy/25" />
      <div className="hero-ambient absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-cream/5" />

      <div className="relative z-10 flex h-full items-end px-6 pb-14 sm:items-center sm:pb-0 lg:px-10">
        <div className="relative w-full max-w-2xl p-10 sm:p-14 lg:ml-[max(-1.5rem,calc((100vw-80rem)/2-1.5rem))]">
          {/* Blended glass: fades at its own edges. Kept separate from the text below so the
              fade never touches — and never dims — the text itself. */}
          <div className="hero-panel-blend absolute inset-0 bg-navy/65 backdrop-blur-md" />
          <div className="relative">
            <div className="grid">
              {slides.map((slide, i) => (
                <div
                  key={slide.heading}
                  aria-hidden={i !== index}
                  className={cn(
                    "col-start-1 row-start-1 translate-y-3 transition-[opacity,transform] duration-1000 ease-out",
                    i === index ? "translate-y-0 opacity-100" : "pointer-events-none opacity-0",
                  )}
                >
                  <p className="text-[0.6875rem] tracking-[0.2em] text-cream/60 uppercase">{slide.eyebrow}</p>
                  <h1 className="mt-5 text-3xl leading-[1.12] text-cream sm:text-4xl lg:text-5xl">{slide.heading}</h1>
                  <p className="mt-5 text-sm leading-relaxed text-cream/75 sm:text-base">{slide.subheading}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center bg-cream px-6 text-[0.8125rem] tracking-[0.14em] whitespace-nowrap text-navy uppercase transition-colors hover:bg-cream/90"
              >
                Book a Consultation
              </Link>
              <Link
                href="/practice-areas"
                className="inline-flex h-12 items-center justify-center border border-cream/40 px-6 text-[0.8125rem] tracking-[0.14em] whitespace-nowrap text-cream uppercase transition-colors hover:bg-cream/10"
              >
                Explore Practice Areas
              </Link>
            </div>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute right-6 bottom-6 z-10 flex gap-2 lg:right-10">
          {slides.map((slide, i) => (
            <button
              key={slide.image.src}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "size-2 rounded-full transition-colors",
                i === index ? "bg-cream" : "bg-cream/40 hover:bg-cream/70",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
