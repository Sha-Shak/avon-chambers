import { Breadcrumbs } from "@/components/breadcrumbs";
import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { JobCard } from "@/components/cards/job-card";
import { siteConfig } from "@/config/site.config";
import { getAllJobPosts, isJobOpen } from "@/lib/content";
import { buildSocialMetadata } from "@/lib/seo";

const DESCRIPTION = `Career opportunities at ${siteConfig.name}, a Bangladesh-based set of law chambers.`;

export async function generateMetadata(): Promise<Metadata> {
  const openRoles = (await getAllJobPosts()).filter(isJobOpen);

  return {
    title: "Careers",
    description: DESCRIPTION,
    alternates: { canonical: "/careers" },
    robots: openRoles.length > 0 ? undefined : { index: false, follow: true },
    ...buildSocialMetadata({
      title: `Careers | ${siteConfig.name}`,
      description: DESCRIPTION,
      url: "/careers",
    }),
  };
}

export default async function CareersPage() {
  const openRoles = (await getAllJobPosts()).filter(isJobOpen);

  return (
    <div>
      <Breadcrumbs items={[
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
        ]} />

      <PageBanner
        image="careers"
        eyebrow="Careers"
        title={`Work at ${siteConfig.name}`}
        description={<>View our current vacancies below. To apply, email your application to the team.</>}
      />

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        {openRoles.length > 0 ? (
          <div className="space-y-5">
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
