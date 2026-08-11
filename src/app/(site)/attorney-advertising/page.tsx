import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/legal-placeholder";

export const metadata: Metadata = {
  title: "Attorney Advertising",
  robots: { index: false, follow: true },
  alternates: { canonical: "/attorney-advertising" },
};

export default function AttorneyAdvertisingPage() {
  return (
    <LegalPlaceholder
      title="Attorney Advertising"
      note="This page is a placeholder. Attorney advertising disclosures are governed by state bar rules that vary by jurisdiction (New York's are in Rule 7.1 of the Rules of Professional Conduct) and should be confirmed with the firm's own counsel rather than generated. Replace the content of this page (src/app/attorney-advertising/page.tsx) once that's ready, and remove the noindex tag in its metadata."
    />
  );
}
