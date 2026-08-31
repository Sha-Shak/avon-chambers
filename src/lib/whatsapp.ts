import { siteConfig } from "@/config/site.config";

/**
 * Builds a wa.me click-to-chat URL from the site's WhatsApp number, with an
 * optional pre-filled message overriding the site-wide default (e.g. a
 * page-specific consultation heading, so the chat opens already in context).
 */
export function getWhatsAppUrl(message: string = siteConfig.whatsapp.message) {
  const digits = siteConfig.whatsapp.number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
