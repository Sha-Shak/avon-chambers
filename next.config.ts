import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
