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
    home: {
      src: "/images/hero-office.jpg",
      alt: "Attorneys of Avon Chambers in conference with a client",
      width: 1600,
      height: 1104,
    },
  },
  /** Fallback used when an attorney record has no working photo. */
  placeholderAvatar: {
    src: "/images/brand/attorney-placeholder.svg",
    alt: "Portrait placeholder",
    width: 700,
    height: 800,
  },
  /** Default Open Graph / Twitter card image for pages without a more specific one. */
  og: {
    default: {
      src: "/images/og/default.jpg",
      width: 1200,
      height: 630,
    },
  },
} as const;

export type MediaConfig = typeof mediaConfig;
