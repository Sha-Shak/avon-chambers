"use client";

import { useEffect } from "react";
import Script from "next/script";
import { siteConfig } from "@/config/site.config";

/** Queue events immediately; load the analytics library during browser idle time. */
export function Analytics() {
  if (!siteConfig.gaMeasurementId) return null;
  return (
    <>
      <ConversionEventTracker />
      <Script id="avon-ga-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        window.gtag = function(){ window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', ${JSON.stringify(siteConfig.gaMeasurementId)});
      `}</Script>
      <Script
        id="avon-ga"
        src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaMeasurementId}`}
        strategy="lazyOnload"
      />
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
        const analyticsWindow = window as Window & { gtag?: (...args: unknown[]) => void };
        analyticsWindow.gtag?.("event", eventName, {
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
