import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/legal-placeholder";

export const metadata: Metadata = {
  title: "Terms of Engagement",
  robots: { index: false, follow: true },
  alternates: { canonical: "/terms-of-engagement" },
};

export default function TermsOfEngagementPage() {
  return (
    <LegalPlaceholder
      title="Terms of Engagement"
      note="This page is a placeholder. Terms of engagement are a substantive legal document specific to how this firm actually engages clients, and should come from the firm itself, not be generated. Replace the content of this page (src/app/terms-of-engagement/page.tsx) once that's ready, and remove the noindex tag in its metadata."
    />
  );
}
