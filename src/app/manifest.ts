import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";
import { mediaConfig } from "@/config/media.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F7F4EC",
    theme_color: "#1E2A44",
    icons: [
      {
        src: mediaConfig.brand.favicon,
        sizes: "64x64",
        type: "image/png",
      },
    ],
  };
}
