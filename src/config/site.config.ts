/**
 * Site-wide configuration: firm identity, contact details, and the handful
 * of editorial figures (e.g. total lawyer headcount) that are asserted in
 * copy across multiple pages. Change them here once instead of hunting
 * through JSX.
 *
 * NEXT_PUBLIC_SITE_URL must be set to the real production domain before
 * launch — see .env.example. Metadata, JSON-LD, the sitemap and llms.txt
 * all derive their absolute URLs from siteConfig.url.
 */

const FALLBACK_URL = "https://avonchambers.com";

export const siteConfig = {
  name: "Avon Chambers",
  legalName: "Avon Chambers",
  shortName: "Avon Chambers",
  tagline: "Your Trusted Legal Partner",
  description:
    "Avon Chambers is a Bangladesh-based set of law chambers comprising Barristers, Solicitors, Advocates and Legal Consultants, providing practical legal advice and representation across a range of matters.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL).replace(/\/$/, ""),
  email: "avonchambers@gmail.com",
  consultationPhoneDisplay: "(88) 01521327783",
  consultationPhoneE164: "+8801521327783",
  officeHours: "Sat–Thurs, 9:30am – 6:30pm",
  address: {
    streetAddress: "Flat 4A, Level 3, Kanak Bindu, House 39A, Road No. 8",
    addressLocality: "Dhanmondi",
    addressRegion: "Dhaka",
    postalCode: "1205",
    addressCountry: "Bangladesh",
  },
  /**
   * Social profile links, shown in the footer, contact page and the
   * consultation CTA, and fed into the Organization JSON-LD `sameAs` list.
   * These links are configured centrally so they can be updated without
   * changing shared layout components.
   */
  social: {
    linkedIn: "https://www.linkedin.com/company/avon-chambers",
    facebook: "https://www.facebook.com/avonchambers",
    instagram: "https://www.instagram.com/avonchambers",
    twitter: "https://x.com/avonchambers",
    threads: "https://www.threads.net/@avonchambers",
    youtube: "https://www.youtube.com/@avonchambers",
    tiktok: "https://www.tiktok.com/@avonchambers",
  },
  /** WhatsApp click-to-chat, used by the floating WhatsApp button on every page. */
  whatsapp: {
    number: "+8801521327783",
    message: "Hello Avon Chambers, I'd like to book a consultation.",
  },
  /** Google Analytics 4 measurement ID, e.g. "G-XXXXXXXXXX". Leave unset to disable. */
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
} as const;

export type SiteConfig = typeof siteConfig;
