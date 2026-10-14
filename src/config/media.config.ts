/**
 * Central media registry.
 *
 * Every site-wide image (logo, hero art, OG image, fallbacks) is declared
 * here with its path and alt text, so replacing a photo or refreshing the
 * brand mark is a one-file edit — nothing in components/ or app/ hardcodes
 * an image path directly.
 *
 * Per-person photos live alongside each record in data/lawyers.json
 * instead, since those are 1:1 with a specific lawyer rather than a
 * site-wide asset — see that file's `photo` field.
 *
 * Paths are relative to /public. Drop a replacement file at the same path
 * and this config (and every page that reads it) picks it up automatically.
 */

/**
 * One picture. `position` is the CSS object-position — which part of the
 * photo stays in view when it's cropped to a wide strip (e.g. "center 60%"
 * keeps a little more of the lower half). Omit it to centre the photo.
 */
export interface MediaImage {
  src: string;
  alt: string;
  position?: string;
}

const image = (src: string, alt: string, position?: string): MediaImage => ({ src, alt, position });

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
     * the matching copy. All slideshow photos are stored locally in public/images.
     * Swap a file or update its path here to change the photography. The third value
     * of each image is its focal point (CSS object-position, "x% y%") — it
     * decides which part of the photo stays in view when the hero crops it, so
     * move it if a slide's main subject is getting cut off.
     */
    homeSlides: [
      image(
        "/images/hero/avon-chambers-office.webp",
        "Lawyers of Avon Chambers in conference with a client",
        // The monogram sits near the top of this photo, so favour the top
        // (and the right, where the desk is) when it's cropped to a wide strip.
        "65% 12%",
      ),
      image("/images/backgrounds/office-1200-900-3.webp", "Avon Chambers Office", "60% 55%"),
      image("/images/backgrounds/office-1200-900-5.webp", "A partner's room at Avon Chambers", "55% 62%"),
    ],
    /** How long each hero slide stays on screen before advancing, in milliseconds. */
    sliderIntervalMs: 6000,
  },
  /**
   * PAGE BANNERS — the wide photo behind the heading at the top of each page
   * (components/page-banner.tsx). Change a link here and that page updates.
   * Landscape photos work best; `position` picks the part that stays visible.
   */
  banners: {
    about: image("/images/backgrounds/office-1200-800-1.webp", "The reception at Avon Chambers", "center 40%"),
    practiceAreas: image("/images/backgrounds/office-interrior.webp", "Law books lining the shelves at Avon Chambers", "center 45%"),
    lawyers: image("/images/backgrounds/office-1200-900-5.webp", "A partner's room at Avon Chambers", "center 55%"),
    articles: image("/images/backgrounds/office-1200-800-2.webp", "The Avon Chambers monogram beside a reception desk", "center 45%"),
    careers: image("/images/backgrounds/office-1200-900-3.webp", "The open-plan workspace at Avon Chambers", "center 55%"),
    contact: image("/images/backgrounds/office-1200-900-6.webp", "The lounge at Avon Chambers", "center 55%"),
    lifeAtAvon: image("/images/backgrounds/office-1200-800-4.webp", "The workspace at Avon Chambers", "center 55%"),
    caseStudies: image("/images/backgrounds/office-1200-900-8.webp", "The boardroom at Avon Chambers", "center 60%"),
    policies: image("/images/backgrounds/office-1200-900-2.webp", "A quiet corner of the reception at Avon Chambers", "center 50%"),
    newsEvents: image("/images/backgrounds/office-1200-900-4.webp", "The workspace at Avon Chambers", "center 55%"),
    proBono: image("/images/backgrounds/office-1200-900-7.webp", "A meeting room at Avon Chambers", "center 60%"),
  },
  /**
   * HOME PAGE BACKDROPS — photos behind the frosted-glass sections of the
   * home page (one per band). Office photographs only — no people. Keep each one a different scene, and different from the hero slides above (components/section-backdrop.tsx). Same idea as banners: swap a
   * link and that section's background changes.
   */
  backdrops: {
    practiceAreas: image("/images/backgrounds/office-1200-800-2.webp", "The Avon Chambers monogram beside a reception desk", "center 45%"),
    acclamation: image("/images/backgrounds/office-interrior.webp", "Law books lining the shelves at Avon Chambers", "center 45%"),
    whyAvonChambers: image("/images/backgrounds/office-1200-900-8.webp", "The boardroom at Avon Chambers", "center 55%"),
    testimonials: image("/images/backgrounds/office-1200-900-6.webp", "The lounge at Avon Chambers", "center 55%"),
    process: image("/images/backgrounds/office-1200-900-2.webp", "A plant on the reception desk at Avon Chambers", "center 50%"),
    consultation: image("/images/backgrounds/office-1200-900-7.webp", "A meeting room at Avon Chambers", "center 55%"),
    articles: image("/images/backgrounds/office-1200-900-1.webp", "The fluted monogram wall at Avon Chambers", "center 40%"),
  },
  /**
   * Logos of publications and directories that have recognised the firm,
   * shown on the home page "Acclamation" section. Files live in
   * public/images — drop in a replacement and update the path here.
   */
  recognition: {
    lawAsia: { src: "/images/law.asia_trans.png", alt: "Law.asia", width: 1200, height: 1200 },
    legal500: { src: "/images/legal500.png", alt: "The Legal 500", width: 596, height: 335 },
  },
  /** Fallback used when a lawyer record has no working photo. */
  placeholderAvatar: {
    src: "/images/brand/lawyer-placeholder.svg",
    alt: "Portrait placeholder",
    width: 700,
    height: 800,
  },
  /** Landscape brand card shared by pages without their own cover image. */
  og: {
    default: {
      src: "/social-image",
      width: 1200,
      height: 630,
    },
  },
} as const;

export type MediaConfig = typeof mediaConfig;
