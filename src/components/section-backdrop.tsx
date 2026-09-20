import type { ReactNode } from "react";
import Image from "next/image";
import { mediaConfig } from "@/config/media.config";
import { cn } from "@/lib/utils";

export type BackdropKey = keyof typeof mediaConfig.backdrops;

/**
 * A full-width section with a photograph behind it, meant to hold
 * frosted-glass panels (the `frost` utility). The photo comes from
 * `mediaConfig.backdrops` — swap the link there to change it.
 *
 * Used on the home page only. A navy tint keeps the text legible, and the
 * top and bottom edges fade to solid navy so neighbouring bands blend rather
 * than end in a hard line. The section is always dark (the `dark` class
 * re-themes everything inside it), so its cards and text look the same in
 * light and dark theme.
 */
export function SectionBackdrop({
  image,
  className,
  children,
}: {
  image: BackdropKey;
  className?: string;
  children: ReactNode;
}) {
  const backdrop = mediaConfig.backdrops[image];

  return (
    <section className={cn("dark relative isolate overflow-hidden bg-navy text-foreground", className)}>
      <Image
        src={backdrop.src}
        alt={backdrop.alt}
        fill
        sizes="100vw"
        loading="lazy"
        style={{ objectPosition: backdrop.position ?? "center" }}
        className="-z-20 object-cover"
      />
      {/* A navy tint so the photo is atmosphere rather than a competing picture... */}
      <div className="absolute inset-0 -z-10 bg-navy/60" />
      {/* ...and solid navy at the top and bottom edges. Neighbouring backdrop
          sections then meet on a shared navy seam, so the photos read as one
          continuous band instead of separate pictures dropped in. */}
      <div className="absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-navy to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-navy to-transparent" />
      {children}
    </section>
  );
}
