import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { JobCard } from "@/components/cards/job-card";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getAllJobPosts, isJobOpen } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema";

const DESCRIPTION = `Open roles at ${siteConfig.name}, a boutique New York law firm. Apply directly by email — no portal, no account required.`;

export const metadata: Metadata = {
  title: "Careers",
  description: DESCRIPTION,
  alternates: { canonical: "/careers" },
  openGraph: { title: `Careers — ${siteConfig.name}`, description: DESCRIPTION, url: "/careers" },
};

export default async function CareersPage() {
  const openRoles = (await getAllJobPosts()).filter(isJobOpen);

  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
        ])}
      />

      <section className="border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <FadeIn className="max-w-2xl">
            <p className="eyebrow">Careers</p>
            <h1 className="mt-4 text-4xl text-foreground sm:text-5xl">Work at {siteConfig.name}</h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              We stay small on purpose, so every hire matters. Below are the roles we&rsquo;re actively
              filling — apply directly by email, no account or portal required.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        {openRoles.length > 0 ? (
          <div>
            {openRoles.map((job) => (
              <JobCard key={job.slug} job={job} />
            ))}
          </div>
        ) : (
          <p className="max-w-xl border-t border-foreground/15 pt-8 text-muted-foreground">
            We don&apos;t have any open roles right now, but we&rsquo;re always glad to hear from strong
            candidates. Send a note to{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-foreground hover:underline">
              {siteConfig.email}
            </a>
            .
          </p>
        )}
      </section>
    </div>
  );
}
