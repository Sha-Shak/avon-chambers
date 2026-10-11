import { siteConfig } from "@/config/site.config";
import { createSocialImage } from "@/lib/social-image";

export const alt = `${siteConfig.name} | ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return createSocialImage();
}
