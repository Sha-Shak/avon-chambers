"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryPhoto } from "@/types";

const ALL = "All";
/** Cap on the stagger so a large filtered set doesn't feel sluggish to reveal. */
const MAX_STAGGER_MS = 420;

export function PhotoGallery({
  photos,
  categories,
}: {
  photos: GalleryPhoto[];
  categories: string[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (activeCategory === ALL ? photos : photos.filter((p) => p.category === activeCategory)),
    [photos, activeCategory],
  );

  // Filtering while the lightbox is open would leave its index pointing at
  // the wrong photo (or out of range) — closing it keeps things simple and
  // correct rather than trying to re-map the index across category changes.
  const changeCategory = (category: string) => {
    if (category === activeCategory) return;
    setActiveCategory(category);
    setLightboxIndex(null);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {[ALL, ...categories].map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => changeCategory(category)}
            aria-pressed={activeCategory === category}
            className={cn(
              "inline-flex items-center rounded-full border px-4 py-1.5 text-[0.75rem] tracking-wide transition-all duration-200 ease-out active:scale-95",
              activeCategory === category
                ? "border-foreground bg-foreground text-background shadow-sm"
                : "border-foreground/15 text-muted-foreground hover:-translate-y-0.5 hover:border-foreground/30 hover:text-foreground",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Remounting on category change (via `key`) restarts the stagger
          below, so switching filters replays the reveal instead of the new
          set just snapping into place. */}
      <MasonryGrid key={activeCategory} photos={filtered} onOpen={setLightboxIndex} />

      {lightboxIndex !== null && (
        <Lightbox photos={filtered} index={lightboxIndex} onIndexChange={setLightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
}

function MasonryGrid({ photos, onOpen }: { photos: GalleryPhoto[]; onOpen: (index: number) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // rAF rather than a bare state-set-on-mount: guarantees the initial
    // (hidden) styles have actually painted first, so the transition to
    // visible is what animates rather than the element just appearing.
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="mt-10 columns-2 gap-1.5 sm:gap-2 lg:columns-3">
      {photos.map((photo, index) => (
        <button
          key={photo.id}
          type="button"
          onClick={() => onOpen(index)}
          style={{ transitionDelay: `${Math.min(index * 45, MAX_STAGGER_MS)}ms` }}
          className={cn(
            "group relative mb-1.5 block w-full cursor-pointer overflow-hidden rounded-xl bg-secondary shadow-sm transition-all duration-500 ease-out sm:mb-2 sm:rounded-2xl",
            "hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/15",
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
        >
          <GalleryImage photo={photo} />

          <span className="absolute top-1.5 left-1.5 rounded-full bg-navy/50 px-2 py-0.5 text-[0.5625rem] tracking-[0.08em] text-cream/90 uppercase backdrop-blur-sm sm:top-3 sm:left-3 sm:px-3 sm:py-1 sm:text-[0.625rem] sm:tracking-[0.1em]">
            {photo.category}
          </span>

          <div
            className={cn(
              "absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-navy/90 via-navy/10 to-transparent p-2.5 text-left opacity-0 transition-opacity duration-300 sm:gap-3 sm:p-4",
              "group-hover:opacity-100 group-focus-visible:opacity-100",
            )}
          >
            <p className="translate-y-1 text-xs text-cream transition-transform duration-300 group-hover:translate-y-0 sm:text-sm">
              {photo.title}
            </p>
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-cream/15 text-cream backdrop-blur-sm sm:size-8">
              <Maximize2 className="size-3 sm:size-3.5" />
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

function GalleryImage({ photo }: { photo: GalleryPhoto }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-secondary" />}
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="(min-width: 1024px) 33vw, 50vw"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-auto w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.04]",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </>
  );
}

function Lightbox({
  photos,
  index,
  onIndexChange,
  onClose,
}: {
  photos: GalleryPhoto[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const photo = photos[index];
  const [entered, setEntered] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Plays the fade/scale-out before actually unmounting, so closing feels
  // like a reverse of the open rather than an abrupt cut.
  const handleClose = () => {
    setEntered(false);
    closeTimer.current = setTimeout(onClose, 200);
  };

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + photos.length) % photos.length);
      if (e.key === "ArrowRight") onIndexChange((index + 1) % photos.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, photos.length]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-navy/95 p-4 backdrop-blur-sm transition-opacity duration-200",
        entered ? "opacity-100" : "opacity-0",
      )}
      onClick={handleClose}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={handleClose}
        className="absolute top-5 right-5 z-10 grid size-10 place-items-center rounded-full bg-navy/50 text-cream/80 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:text-cream active:scale-90"
      >
        <X className="size-5" />
      </button>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index - 1 + photos.length) % photos.length);
            }}
            className="absolute left-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-navy/50 text-cream/80 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:text-cream active:scale-90 sm:left-6 sm:size-11"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index + 1) % photos.length);
            }}
            className="absolute right-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-navy/50 text-cream/80 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:text-cream active:scale-90 sm:right-6 sm:size-11"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      )}

      <div
        className={cn(
          "flex max-h-full max-w-4xl flex-col items-center transition-all duration-300 ease-out",
          entered ? "scale-100 opacity-100" : "scale-95 opacity-0",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-h-[75vh] max-w-full overflow-hidden rounded-lg">
          <Image
            key={photo.id}
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="90vw"
            className="max-h-[75vh] w-auto max-w-full object-contain"
            priority
          />
        </div>
        <div className="mt-5 max-w-xl text-center">
          <p className="text-base text-cream">{photo.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-cream/60">{photo.description}</p>
          <p className="mt-3 text-[0.6875rem] tracking-[0.14em] text-cream/40 uppercase">
            {index + 1} / {photos.length} · {photo.category}
          </p>
        </div>
      </div>
    </div>
  );
}
