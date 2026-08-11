import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site.config";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1E2A44",
          color: "#F7F4EC",
          padding: "72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#B8935A",
            }}
          >
            <span>{siteConfig.name}</span>
          </div>
          <div style={{ display: "flex", marginTop: 40, fontSize: 64, lineHeight: 1.15, maxWidth: 920 }}>
            {siteConfig.tagline}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(247,244,236,0.25)",
            paddingTop: 28,
            fontSize: 22,
            color: "rgba(247,244,236,0.7)",
          }}
        >
          <span>Est. {siteConfig.foundingDate}</span>
          <span>{siteConfig.address.addressLocality}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
