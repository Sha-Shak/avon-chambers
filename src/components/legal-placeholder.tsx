import { FadeIn } from "@/components/fade-in";
import { siteConfig } from "@/config/site.config";

/**
 * The footer previously linked all four of these pages to "#". Rather than
 * leave the links dead or invent legal boilerplate a real firm shouldn't
 * publish without its own counsel reviewing it, each page is a real,
 * indexable URL with an honest placeholder and a noindex tag until the firm
 * supplies reviewed copy — see each page.tsx for where to drop it in.
 */
export function LegalPlaceholder({ title, note }: { title: string; note: string }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 lg:px-10 lg:py-32">
      <FadeIn>
        <p className="eyebrow">Legal</p>
        <h1 className="mt-4 text-4xl text-foreground sm:text-5xl">{title}</h1>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground">{note}</p>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          In the meantime, direct any questions to{" "}
          <a href={`mailto:${siteConfig.email}`} className="text-foreground hover:underline">
            {siteConfig.email}
          </a>
          .
        </p>
      </FadeIn>
    </div>
  );
}
