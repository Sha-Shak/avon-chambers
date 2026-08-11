import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/legal-placeholder";

export const metadata: Metadata = {
  title: "Accessibility",
  robots: { index: false, follow: true },
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <LegalPlaceholder
      title="Accessibility"
      note="This page is a placeholder for the firm's accessibility statement — what standard the site targets (commonly WCAG 2.1 AA) and how to report an issue. The site itself has been built with semantic HTML, visible keyboard focus states and reduced-motion support, but an accessibility statement should reflect an actual review, not a boilerplate claim. Replace the content of this page (src/app/accessibility/page.tsx) once that's ready, and remove the noindex tag in its metadata."
    />
  );
}
