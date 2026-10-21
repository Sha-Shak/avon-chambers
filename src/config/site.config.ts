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
const OFFICE_ADDRESS = {
  streetAddress: "Flat 4A, Level 3, Kanak Bindu, House 39A, Road No. 8",
  addressLocality: "Dhanmondi",
  addressRegion: "Dhaka",
  postalCode: "1205",
  addressCountry: "Bangladesh",
} as const;
const OFFICE_HOURS = { days: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"], opens: "09:30", closes: "18:30" } as const;
const displayTime = (value: string) => {
  const [hour, minutes] = value.split(":");
  return `${Number(hour) % 12 || 12}:${minutes}${Number(hour) < 12 ? "am" : "pm"}`;
};


export const siteConfig = {
  name: "Avon Chambers",
  legalName: "Avon Chambers",
  shortName: "Avon Chambers",
  tagline: "Stands by you, when it matters",
  // Kept at or under 155 characters — the length search engines reliably
  // display in a result snippet before truncating with an ellipsis.
  description:
    "Avon Chambers is a Bangladesh-based set of law chambers with Barristers, Solicitors, Advocates and Legal Consultants providing practical legal advice.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL).replace(/\/$/, ""),
  email: "info@avonchambers.com",
  consultationPhoneDisplay: "+880 1841-010059",
  consultationPhoneE164: "+8801841010059",
  openingHours: OFFICE_HOURS,
  officeHours: `${OFFICE_HOURS.days[0]} to ${OFFICE_HOURS.days.at(-1)}, ${displayTime(OFFICE_HOURS.opens)} to ${displayTime(OFFICE_HOURS.closes)}`,
  address: OFFICE_ADDRESS,
  addressBn: { streetAddress: "ফ্ল্যাট ৪এ, লেভেল ৩, কনক বিন্দু, হাউস ৩৯এ, রোড ৮", locality: "ধানমন্ডি, ঢাকা ১২০৫" },
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(`Avon Chambers, ${OFFICE_ADDRESS.streetAddress}, ${OFFICE_ADDRESS.addressLocality}, ${OFFICE_ADDRESS.addressRegion} ${OFFICE_ADDRESS.postalCode}, ${OFFICE_ADDRESS.addressCountry}`),
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
