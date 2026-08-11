import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Sanity-hosted content images (insight cover images, uploaded via
      // the Studio). Everything else on the site is a local file under
      // /public, so this is currently the only remote source that's needed.
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
