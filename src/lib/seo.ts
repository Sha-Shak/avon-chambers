import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import { mediaConfig } from "@/config/media.config";

/**
 * Next.js does NOT deep-merge `openGraph` between a layout and a page — a
 * page that defines its own `openGraph` object entirely replaces the
 * layout's, silently dropping any field it doesn't repeat itself (image,
 * siteName, locale, type included). Every page on this site defined its own
 * narrower `openGraph`, which is why og:image, og:site_name and og:locale
 * were missing everywhere except pages that happened to repeat them.
 *
 * Always build a page's `openGraph` through this helper instead of writing
 * the object literal directly, so the shared fields can never be dropped
 * again — only title/description/url (and optionally a specific image) vary
 * per page.
 */
export function buildOpenGraph({
  title,
  description,
  url,
  type = "website",
  image,
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description: string;
  url: string;
  type?: "website" | "article" | "profile";
  /** Page-specific image, e.g. a lawyer's portrait or an insight's cover image — defaults to the site's general OG image. */
  image?: { url: string; width?: number; height?: number; alt?: string };
  /** `type: "article"` only — ISO timestamps for the article's Open Graph metadata. */
  publishedTime?: string;
  modifiedTime?: string;
}): NonNullable<Metadata["openGraph"]> {
  const fallback = mediaConfig.og.default;

  return {
    title,
    description,
    url,
    siteName: siteConfig.name,
    locale: "en_US",
    type,
    ...(publishedTime ? { publishedTime } : {}),
    ...(modifiedTime ? { modifiedTime } : {}),
    images: [
      image ?? {
        url: fallback.src,
        width: fallback.width,
        height: fallback.height,
        alt: title,
      },
    ],
  } as NonNullable<Metadata["openGraph"]>;
}
