/**
 * Central media registry.
 *
 * Every site-wide image (logo, hero art, OG image, fallbacks) is declared
 * here with its path and alt text, so replacing a photo or refreshing the
 * brand mark is a one-file edit — nothing in components/ or app/ hardcodes
 * an image path directly.
 *
 * Per-person photos live alongside each record in data/attorneys.json
 * instead, since those are 1:1 with a specific attorney rather than a
 * site-wide asset — see that file's `photo` field.
 *
 * Paths are relative to /public. Drop a replacement file at the same path
 * and this config (and every page that reads it) picks it up automatically.
 */

export const mediaConfig = {
  brand: {
    logo: {
      src: "/images/brand/Avon_Chambers_Logo.webp",
      alt: "Avon Chambers monogram",
      width: 40,
      height: 40,
    },
    favicon: "/favicon.png",
  },
  hero: {
    /**
     * Homepage hero slideshow — one image per narrative beat (branding,
     * track record, practice areas); see `heroContent` in the homepage for
     * the matching copy. The firm's own photo leads, followed by placeholder
     * stock photography (hotlinked from Unsplash) — swap any entry for real
     * firm photography later; nothing else needs to change.
     */
    homeSlides: [
      {
        src: "https://res.cloudinary.com/x1h1eyhj/image/upload/v1786546841/avon-chambers-office.png",
        alt: "Attorneys of Avon Chambers in conference with a client",
      },
      {
        src: "https://res.cloudinary.com/x1h1eyhj/image/upload/v1786545610/Stack_of_Law_Books.jpg",
        alt: "Avon Chambers Office",
      },
      {
        src: "https://res.cloudinary.com/x1h1eyhj/image/upload/v1786546383/avon-chambers-office-02.jpg",
        alt: "Avon Chambers Office",
      },
    ],
    /** How long each hero slide stays on screen before advancing, in milliseconds. */
    sliderIntervalMs: 6000,
  },
  /**
   * Law/court-themed accent photography for section backgrounds (e.g. the
   * homepage "Why Avon Chambers" band). Placeholder Unsplash photography —
   * swap for real firm photography later.
   */
  accents: {
    whyAvonChambers: {
      src: "https://images.unsplash.com/photo-1483600516620-7254872369ae?w=1920&auto=format&fit=crop&q=80",
      alt: "Looking up at courthouse columns and ceiling detail",
    },
  },
  /** Fallback used when an attorney record has no working photo. */
  placeholderAvatar: {
    src: "/images/brand/attorney-placeholder.svg",
    alt: "Portrait placeholder",
    width: 700,
    height: 800,
  },
  /**
   * Default Open Graph / Twitter card image for pages without a more
   * specific one (e.g. an insight's own cover image). Points at the hero
   * photo until a dedicated 1200x630 OG image is supplied — drop one in
   * at /public/images/og/default.jpg and update the path here.
   */
  og: {
    default: {
      src: "/images/hero-office.jpg",
      width: 1600,
      height: 1104,
    },
  },
} as const;

export type MediaConfig = typeof mediaConfig;
