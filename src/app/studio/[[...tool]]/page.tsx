import { NextStudio, metadata as studioMetadata } from "next-sanity/studio";
import type { Metadata } from "next";
import config from "../../../../sanity.config";
import { mediaConfig } from "@/config/media.config";

export const dynamic = "force-static";

export const metadata: Metadata = {
  ...studioMetadata,
  robots: { index: false, follow: false },
  icons: { icon: mediaConfig.brand.favicon },
};

export { viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
