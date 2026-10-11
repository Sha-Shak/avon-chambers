import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site.config";

/** Both social image endpoints use the same artwork and local brand asset. */
export async function createSocialImage() {
  // The existing .webp asset contains PNG data. Use its actual MIME type.
  const logo = await readFile(join(process.cwd(), "public/images/brand/Avon_Chambers_Logo.webp"));
  const logoSource = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#f7f5ef", color: "#18243b" }}>
      <div style={{ display: "flex", flex: 1, alignItems: "center", padding: "64px 84px", gap: 44 }}>
        {/* ImageResponse renders an embedded image without a network request. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSource} width={200} height={200} alt="Avon Chambers logo" />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 68, letterSpacing: -2 }}>{siteConfig.name}</div>
          <div style={{ display: "flex", width: 72, height: 3, background: "#b8935a", marginTop: 24, marginBottom: 24 }} />
          <div style={{ display: "flex", fontSize: 22, color: "#687080" }}>Barristers · Solicitors · Advocates</div>
          <div style={{ display: "flex", fontSize: 22, color: "#687080", marginTop: 8 }}>Legal Consultants</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", background: "#18243b", color: "#f7f5ef", padding: "44px 84px 38px", borderTop: "3px solid #b8935a" }}>
        <div style={{ display: "flex", fontSize: 43 }}>{siteConfig.tagline}</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, fontSize: 19, color: "#c8cbd2" }}>
          <span>Dhanmondi, Dhaka</span>
          <span>avonchambers.com</span>
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
