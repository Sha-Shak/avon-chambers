import { GoogleAnalytics } from "@next/third-parties/google";
import { siteConfig } from "@/config/site.config";

/**
 * Renders nothing unless NEXT_PUBLIC_GA_MEASUREMENT_ID is set (see
 * .env.example). Uses @next/third-parties, the officially maintained
 * package for this — it loads the GA script off the main thread via a
 * web worker (through Partytown) rather than a hand-rolled <Script> tag.
 */
export function Analytics() {
  if (!siteConfig.gaMeasurementId) return null;
  return <GoogleAnalytics gaId={siteConfig.gaMeasurementId} />;
}
