import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deliver the small Tailwind stylesheet with HTML instead of a blocking round trip.
  experimental: { inlineCss: true },
  trailingSlash: false,
  async headers() {
    const preview = process.env.NETLIFY === "true" && ["deploy-preview", "branch-deploy"].includes(process.env.CONTEXT ?? "");
    return [...(preview ? [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }] : []), {
      source: "/studio/:path*",
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    }];
  },
  images: {
    qualities: [60, 75],
    remotePatterns: [
      // Sanity-hosted content images (insight cover images, uploaded via
      // the Studio).
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Placeholder stock photography (hero slider, practice area cards)
      // until real firm photography replaces them — see media.config.ts.
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Placeholder photos for the "Life at Avon" gallery until real event
      // photography (via Cloudinary) replaces them — see gallery.config.ts.
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  // The four legal pages used to each live at their own route; they're now
  // sections of one consolidated /policies page. Redirect the old URLs so
  // existing links and bookmarks still resolve.
  async redirects() {
    return [
      // Intellectual property services were consolidated into Corporate & Commercial.
      // Preserve the old public URL instead of serving the noindex not-found page.
      { source: "/practice-areas/intellectual-property-law", destination: "/practice-areas/corporate-commercial", permanent: true },
      { source: "/terms-of-engagement", destination: "/policies#terms-of-engagement", permanent: true },
      { source: "/privacy-policy", destination: "/policies#privacy-policy", permanent: true },
      { source: "/lawyer-advertising", destination: "/policies#lawyer-advertising", permanent: true },
      { source: "/accessibility", destination: "/policies#accessibility", permanent: true },
    ];
  },
};

export default nextConfig;
