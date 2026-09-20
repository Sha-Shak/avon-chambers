import type { ReactNode } from "react";
import Image from "next/image";
import { FadeIn } from "@/components/fade-in";
import { mediaConfig, type MediaImage } from "@/config/media.config";

export type BannerKey = keyof typeof mediaConfig.banners;

/**
 * The header of every top-level page: a wide office photograph under a deep
 * navy wash, with the page's eyebrow, title and intro set in cream on top.
 *
 * The wash is heavier on the left (where the text sits) and lifts toward the
 * right so the photograph still reads, and the text is always cream-on-navy
 * regardless of light/dark theme — which keeps the contrast the same over
 * any image dropped in later. Banner links live in `mediaConfig.banners`.
 */
export function PageBanner({
  image,
  eyebrow,
  title,
  description,
  children,
}: {
  /** A key from `mediaConfig.banners`, or a specific picture (e.g. a post's own cover image). */
  image: BannerKey | MediaImage;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  /** Optional extra content under the intro, e.g. a row of links or chips. */
  children?: ReactNode;
}) {
  const banner = typeof image === "string" ? mediaConfig.banners[image] : image;

  return (
    <section className="relative isolate overflow-hidden bg-navy text-cream">
      <Image
        src={banner.src}
        alt={banner.alt}
        fill
        priority
        sizes="100vw"
        style={{ objectPosition: banner.position ?? "center" }}
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/80 via-navy/40 to-navy/5" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy/70 via-transparent via-45% to-navy/15" />

      <div className="mx-auto flex min-h-[22rem] max-w-7xl items-end px-6 py-14 sm:min-h-[28rem] lg:min-h-[32rem] lg:px-10 lg:py-16">
        <FadeIn className="max-w-3xl">
          {eyebrow && (
            <p className="flex items-center gap-4 text-[0.6875rem] tracking-[0.2em] text-cream/70 uppercase">
              <span className="h-px w-10 bg-gold" aria-hidden />
              {eyebrow}
            </p>
          )}
          <h1 className="mt-5 text-4xl leading-[1.1] text-cream sm:text-5xl lg:text-6xl">{title}</h1>
          {description && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream/90">{description}</p>
          )}
          {children}
        </FadeIn>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-cream/15" />
    </section>
  );
}
