"use client";

import { useEffect } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { sendGAEvent } from "@next/third-parties/google";
import { siteConfig } from "@/config/site.config";

/**
 * Renders nothing unless NEXT_PUBLIC_GA_MEASUREMENT_ID is set (see
 * .env.example). Uses @next/third-parties, the officially maintained
 * package for this — it loads the GA script off the main thread via a
 * web worker (through Partytown) rather than a hand-rolled <Script> tag.
 */
export function Analytics() {
  if (!siteConfig.gaMeasurementId) return null;
  return (
    <>
      <ConversionEventTracker />
      <GoogleAnalytics gaId={siteConfig.gaMeasurementId} />
    </>
  );
}

/** Track the contact actions that represent a useful enquiry signal. */
function ConversionEventTracker() {
  useEffect(() => {
    function trackClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const href = link.getAttribute("href") ?? "";
      let eventName: string | undefined;
      if (href.startsWith("tel:")) eventName = "contact_phone_click";
      else if (href.startsWith("mailto:")) eventName = "contact_email_click";
      else if (/^(?:https?:\/\/)?(?:wa\.me|api\.whatsapp\.com)/i.test(href)) eventName = "contact_whatsapp_click";
      else if (href === "/contact" || href.startsWith("/contact?")) eventName = "consultation_click";

      if (eventName) {
        sendGAEvent("event", eventName, {
          page_path: window.location.pathname,
          link_text: link.textContent?.trim().slice(0, 80) || undefined,
        });
      }
    }

    document.addEventListener("click", trackClick);
    return () => document.removeEventListener("click", trackClick);
  }, []);

  return null;
}
