import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/legal-placeholder";

export const metadata: Metadata = {
  title: "Lawyer Advertising",
  robots: { index: false, follow: true },
  alternates: { canonical: "/lawyer-advertising" },
};

export default function LawyerAdvertisingPage() {
  return (
    <LegalPlaceholder
      title="Lawyer Advertising"
      note="This page is a placeholder. Advertising and professional-conduct requirements vary by jurisdiction and should be confirmed with the chambers' own counsel before publication. Replace this placeholder with approved content and remove the noindex tag when ready."
    />
  );
}
