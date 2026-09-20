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
const cloud = (path: string) => `https://res.cloudinary.com/x1h1eyhj/image/upload/${path}`;

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
     * firm photography later; nothing else needs to change. The third value
     * of each image is its focal point (CSS object-position, "x% y%") — it
     * decides which part of the photo stays in view when the hero crops it, so
     * move it if a slide's main subject is getting cut off.
     */
    homeSlides: [
      image(
        cloud("v1786546841/avon-chambers-office.png"),
        "Lawyers of Avon Chambers in conference with a client",
        // The monogram sits near the top of this photo, so favour the top
        // (and the right, where the desk is) when it's cropped to a wide strip.
        "65% 12%",
      ),
      image(cloud("v1789754268/Office-1200-900-3.webp"), "Avon Chambers Office", "60% 55%"),
      image(cloud("v1789754260/Office-1200-900-5.webp"), "A partner's room at Avon Chambers", "55% 62%"),
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
    about: image(cloud("v1789754276/Office-1200-800-1.webp"), "The reception at Avon Chambers", "center 40%"),
    practiceAreas: image(cloud("v1789754261/Office-1200-800-5.webp"), "Law books lining the shelves at Avon Chambers", "center 45%"),
    lawyers: image(cloud("v1789754260/Office-1200-900-5.webp"), "A partner's room at Avon Chambers", "center 55%"),
    articles: image(cloud("v1789754273/Office-1200-800-2.webp"), "The Avon Chambers monogram beside a reception desk", "center 45%"),
    careers: image(cloud("v1789754268/Office-1200-900-3.webp"), "The open-plan workspace at Avon Chambers", "center 55%"),
    contact: image(cloud("v1789754259/Office-1200-900-6.webp"), "The lounge at Avon Chambers", "center 55%"),
    lifeAtAvon: image(cloud("v1789754265/Office-1200-800-4.webp"), "The workspace at Avon Chambers", "center 55%"),
    caseStudies: image(cloud("v1789754261/Office-1200-900-8.webp"), "The boardroom at Avon Chambers", "center 60%"),
    policies: image(cloud("v1789754274/Office-1200-900-2.webp"), "A quiet corner of the reception at Avon Chambers", "center 50%"),
    newsEvents: image(cloud("v1789754263/Office-1200-900-4.webp"), "The workspace at Avon Chambers", "center 55%"),
    proBono: image(cloud("v1789754267/Office-1200-900-7.webp"), "A meeting room at Avon Chambers", "center 60%"),
  },
  /** Law/court-themed accent photography for section backgrounds (the "Why Avon Chambers" band). */
  accents: {
    whyAvonChambers: {
      src: "https://images.unsplash.com/photo-1483600516620-7254872369ae?w=1920&auto=format&fit=crop&q=80",
      alt: "Looking up at courthouse columns and ceiling detail",
    },
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
  /**
   * Default Open Graph / Twitter card image for pages without a more
   * specific one (e.g. an insight's own cover image, or a lawyer's own
   * portrait). Currently the brand monogram — a 300x300 square, not the
   * 1200x630 landscape crop most platforms prefer, so it may get cropped
   * tight or letterboxed in some link previews. Swap for a dedicated
   * 1200x630 image later if that becomes worth fixing.
   */
  og: {
    default: {
      src: "/images/brand/Avon_Chambers_Logo.webp",
      width: 300,
      height: 300,
    },
  },
} as const;

export type MediaConfig = typeof mediaConfig;
