import Link from "next/link";
import { Languages } from "lucide-react";

/** Links to the equivalent page, with no client script or translation request. */
export function PracticeLanguageSwitcher({ locale, slug }: { locale: "en" | "bn"; slug?: string }) {
  const path = `/practice-areas${slug ? `/${slug}` : ""}`;
  const label = locale === "bn" ? "ভাষা নির্বাচন" : "Choose language";
  return (
    <nav aria-label={label} className="mt-6 inline-flex max-w-full items-center gap-1 rounded-full border border-cream/30 bg-navy/80 p-1 text-cream shadow-sm">
      <Languages aria-hidden="true" className="mx-2 size-4 shrink-0 text-cream/70" />
      {(["en", "bn"] as const).map((language) => {
        const active = locale === language;
        const text = language === "bn" ? "বাংলা" : "English";
        const className = `inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition-colors ${active ? "bg-cream text-navy" : "hover:bg-cream/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"}`;
        return active ? (
          <span key={language} lang={language} aria-current="true" className={className}>{text}</span>
        ) : (
          <Link key={language} href={`${language === "bn" ? "/bn" : ""}${path}`} hrefLang={`${language}-BD`} lang={language} aria-label={language === "bn" ? "এই পৃষ্ঠাটি বাংলায় পড়ুন" : "Read this page in English"} className={className}>{text}</Link>
        );
      })}
    </nav>
  );
}
