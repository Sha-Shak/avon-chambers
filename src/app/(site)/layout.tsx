import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { Analytics } from "@/components/analytics/google-analytics";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { siteConfig } from "@/config/site.config";
import { mediaConfig } from "@/config/media.config";
import { organizationSchema } from "@/lib/schema";
import { buildOpenGraph } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  alternates: { canonical: "/" },
  openGraph: buildOpenGraph({
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: "/",
  }),
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [mediaConfig.og.default.src],
  },
  icons: {
    icon: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  // Not read by Google, but some other search tools and SEO auditors still
  // look for a plain `<meta name="publisher">` tag.
  other: {
    publisher: siteConfig.name,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F5EF" },
    { media: "(prefers-color-scheme: dark)", color: "#12151f" },
  ],
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <JsonLd data={organizationSchema()} />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <WhatsAppButton />
      <Analytics />
    </div>
  );
}
