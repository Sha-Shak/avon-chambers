import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The `<meta name="robots">` tag covers browsers and most crawlers, but
  // some SEO tools specifically check for the equivalent HTTP header too —
  // and non-HTML routes (redirects, the sitemap/robots.txt handlers) can't
  // carry a meta tag at all, so the header is the only way to reach them.
  // Keep this in sync with the `robots` metadata in (site)/layout.tsx.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "index, follow" }],
      },
      {
        // Sanity Studio: already excluded in robots.txt, but that only
        // asks crawlers not to fetch it — this blocks indexing outright
        // for anything that ignores robots.txt or reaches it via a link.
        source: "/studio/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      // Sanity-hosted content images (insight cover images, uploaded via
      // the Studio).
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Placeholder stock photography (hero slider, practice area cards)
      // until real firm photography replaces them — see media.config.ts.
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },

      
    ],
  },
};

export default nextConfig;
