import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";

/**
 * The original robots.txt already allowed everything via a trailing
 * `User-agent: * / Allow: /` rule, so AI crawlers were never actually
 * blocked. This version keeps that same permissive default and adds
 * explicit entries for the major AI crawlers anyway, because several of
 * them (and the tools built on top of them) look for their own named
 * user-agent line rather than trusting the wildcard - naming them removes
 * any ambiguity about intent.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "Twitterbot", allow: "/" },
      { userAgent: "facebookexternalhit", allow: "/" },
      // AI crawlers / answer engines - explicitly welcomed so genuine
      // content can be read and cited accurately.
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "*", allow: "/", disallow: ["/api/", "/studio/"] },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
