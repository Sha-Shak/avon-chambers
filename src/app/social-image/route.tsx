import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site.config";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", background: "#101e30", color: "#f7f5ef", padding: "90px", border: "18px solid #b69a5a" }}>
      <div style={{ display: "flex", fontSize: 76, fontWeight: 700 }}>{siteConfig.name}</div>
      <div style={{ display: "flex", fontSize: 38, marginTop: 30, color: "#dfc58c" }}>{siteConfig.tagline}</div>
      <div style={{ display: "flex", fontSize: 24, marginTop: 70 }}>Barristers · Solicitors · Advocates · Legal Consultants</div>
    </div>,
    { width: 1200, height: 630 },
  );
}
