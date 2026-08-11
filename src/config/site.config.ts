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

const FALLBACK_URL = "https://www.avonchambers.netlify.app";

export const siteConfig = {
  name: "Avon Chambers",
  legalName: "Avon Chambers",
  shortName: "Avon Chambers",
  tagline: "Boutique Counsel for Consequential Matters",
  description:
    "Avon Chambers is a boutique New York law firm representing companies, founders and families in corporate, litigation, family, immigration, real estate and employment matters.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL).replace(/\/$/, ""),
  foundingDate: "1998",
  email: "avonchambers.client@gmail.com",
  consultationPhoneDisplay: "(88) 01521327783",
  consultationPhoneE164: "+8801521327783",
  officeHours: "Sat–Thurs, 9:30am – 6:30pm",
  address: {
    streetAddress: "Road 8, House 12",
    addressLocality: "Dhanmondi",
    addressRegion: "Dhaka",
    postalCode: "1209",
    addressCountry: "Bangladesh",
  },
  social: {
    linkedIn: "",
    facebook: "",
    instagram: "",
    youtube: "",
    twitter: "",
  },
  /**
   * Editorial firm-wide figures used in marketing copy (About, Practice
   * Areas, homepage trust bar). `totalLawyers` is the firm's real total
   * headcount — deliberately NOT derived from attorneys.length, because
   * the site currently publishes full profiles for the partners and
   * senior associates only, not every lawyer at the firm. Keep this in
   * sync with reality yourself; it will not auto-update as you add or
   * remove entries in data/attorneys.json.
   */
  stats: {
    totalLawyers: 10,
    foundedYear: 1998,
    mattersResolved: "1,400+",
    favourableOutcomes: "94%",
    jurisdictions: 12,
    responseCommitment: "4 hrs",
    barAssociation: "NYSBA",
  },
  /** Google Analytics 4 measurement ID, e.g. "G-XXXXXXXXXX". Leave unset to disable. */
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
} as const;

export type SiteConfig = typeof siteConfig;
