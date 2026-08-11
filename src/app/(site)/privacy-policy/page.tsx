import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/legal-placeholder";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: false, follow: true },
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPlaceholder
      title="Privacy Policy"
      note="This page is a placeholder. A firm privacy policy needs to accurately describe what this specific site collects (the consultation form, and analytics if enabled) and should be drafted or reviewed by the firm's own counsel before publishing — not generated boilerplate. Replace the content of this page (src/app/privacy-policy/page.tsx) once that's ready, and remove the noindex tag in its metadata."
    />
  );
}
