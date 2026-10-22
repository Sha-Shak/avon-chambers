import Link from "next/link";
import { practiceAreaById } from "@/config/practice-areas.config";
import { getLawyer } from "@/lib/data";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import type { LegalRelationships } from "@/types";

/** Explicit editorial relationships, rendered as crawlable links in the initial HTML. */
export function RelatedLegalServices({
  practiceAreaIds,
  responsibleLawyerSlugs,
}: LegalRelationships) {
  const areas = [...new Set(practiceAreaIds ?? [])]
    .map(practiceAreaById)
    .filter((area) => area !== undefined);
  const lawyers = [...new Set(responsibleLawyerSlugs ?? [])]
    .map(getLawyer)
    .filter((lawyer) => lawyer !== undefined);
  if (!areas.length && !lawyers.length) return null;

  return (
    <section
      aria-label="Related legal services"
      className="border-y border-foreground/10 bg-secondary/50"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-2 lg:px-10 lg:py-16">
        {areas.length > 0 && (
          <div>
            <h2 className="text-2xl text-foreground">Related legal services</h2>
            <ul className="mt-5 space-y-5">
              {areas.map((area) => (
                <li key={area.id}>
                  <Link
                    href={`/practice-areas/${area.slug}`}
                    className="inline-flex min-h-11 items-center text-lg underline underline-offset-4"
                  >
                    {area.title}
                  </Link>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {area.copy}
                  </p>
                  <a
                    href={getWhatsAppUrl(
                      `I would like to enquire about ${area.title}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex min-h-11 items-center text-sm underline underline-offset-4"
                  >
                    Enquire about {area.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {lawyers.length > 0 && (
          <div>
            <h2 className="text-2xl text-foreground">Responsible lawyers</h2>
            <ul className="mt-5 space-y-3">
              {lawyers.map((lawyer) => (
                <li key={lawyer.slug}>
                  <Link
                    href={`/lawyers/${lawyer.slug}`}
                    className="inline-flex min-h-11 flex-col justify-center underline underline-offset-4"
                  >
                    <span>{lawyer.name}</span>
                    <span className="mt-1 text-sm text-muted-foreground">
                      {lawyer.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
