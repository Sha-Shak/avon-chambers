/**
 * Site-wide configuration: firm identity, contact details, and the handful
 * of editorial figures (e.g. total lawyer headcount) that are asserted in
 * copy across multiple pages. Change them here once instead of hunting
 * through JSX.
 *
 * NEXT_PUBLIC_SITE_URL must be set to the real production domain — see
 * .env.example. Metadata, JSON-LD, the sitemap and llms.txt all derive
 * their absolute URLs from siteConfig.url.
 *
 * This must also be set as an environment variable in the Netlify dashboard
 * (Site settings → Environment variables), not just here — NEXT_PUBLIC_*
 * values are baked in at build time, so the fallback below only helps local
 * dev/preview builds that don't set it. If it's wrong or missing there, the
 * live site will keep emitting canonical tags for the Netlify subdomain
 * instead of the real domain, however this fallback is set.
 */

const FALLBACK_URL = "https://www.avonchambers.com";

export const siteConfig = {
  name: "Avon Chambers",
  legalName: "Avon Chambers",
  shortName: "Avon Chambers",
  tagline: "Your Trusted Legal Partner",
  // Kept at or under 155 characters — the length search engines reliably
  // display in a result snippet before truncating with an ellipsis.
  description:
    "Avon Chambers is a Bangladesh-based set of law chambers with Barristers, Solicitors, Advocates and Legal Consultants providing practical legal advice.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL).replace(/\/$/, ""),
  /**
   * Site-wide meta keywords — carries little SEO weight with Google today,
   * but still read by some other search engines, directories and tools, and
   * doubles as a handy reference list of the firm's practice areas. Sourced
   * from the firm's own LinkedIn page tags.
   */
  keywords: [
    "Civil Litigation",
    "Criminal Law",
    "Family Law",
    "Constitutional Litigation",
    "Writs",
    "Arbitration",
    "International Commercial Arbitration",
    "Dispute Resolution",
    "Corporate Law",
    "Commercial Law",
    "Contracts",
    "International Commercial Contracts",
    "Company Law",
    "Mergers & Acquisitions",
    "Property Law",
    "Real Estate",
    "Banking Law",
    "Finance Law",
    "Taxation",
    "VAT",
    "Intellectual Property",
    "Copyright",
    "Trademarks",
    "Employment Law",
    "Labour Law",
    "IT Law",
    "Technology Law",
    "Data Protection",
    "Cybersecurity",
    "E-Commerce",
    "Start-Up Advisory",
    "Financial Crime",
    "Compliance",
    "Mediation",
    "Negotiation",
    "Legal Opinions",
    "Regulatory Advisory",
    "International Law",
    "Cross-Border Legal Matters",
    "Bangladesh Law",
  ],
  email: "avonchambers@gmail.com",
  consultationPhoneDisplay: "(88) 01841010059",
  consultationPhoneE164: "+8801841010059",
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
    linkedIn: "https://www.linkedin.com/company/avonchambers",
    facebook: "https://www.facebook.com/avonchambers",
    instagram: "https://www.instagram.com/avon.chambers",
    twitter: "https://x.com/avonchambers",
    threads: "https://www.threads.net/@avon.chambers",
    // youtube: "https://www.youtube.com/@avonchambers",
    // tiktok: "https://www.tiktok.com/@avonchambers",
  },
  /** WhatsApp click-to-chat, used by the floating WhatsApp button on every page. */
  whatsapp: {
    number: "+8801841010059",
    message: "Hello Avon Chambers, I'd like to book a consultation.",
  },
  /** Google Analytics 4 measurement ID, e.g. "G-XXXXXXXXXX". Leave unset to disable. */
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
} as const;

export type SiteConfig = typeof siteConfig;
