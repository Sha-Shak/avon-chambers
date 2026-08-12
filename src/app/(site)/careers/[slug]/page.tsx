import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { ArrowLeft, Briefcase, MapPin } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getJobPost, getJobPostSlugs } from "@/lib/content";
import { breadcrumbSchema, jobPostingSchema } from "@/lib/schema";

export async function generateStaticParams() {
  const slugs = await getJobPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobPost(slug);
  if (!job) return { title: "Unavailable", robots: { index: false, follow: false } };

  return {
    title: job.title,
    description: job.summary,
    alternates: { canonical: `/careers/${job.slug}` },
    openGraph: { title: `${job.title} — ${siteConfig.name}`, description: job.summary, url: `/careers/${job.slug}` },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobPost(slug);
  if (!job) notFound();

  return (
    <div>
      <JsonLd data={jobPostingSchema(job)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
          { name: job.title, path: `/careers/${job.slug}` },
        ])}
      />

      <section className="border-b border-foreground/10">
        <div className="mx-auto max-w-3xl px-6 py-20 lg:px-10 lg:py-28">
          <FadeIn>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-[0.6875rem] tracking-[0.2em] text-muted-foreground uppercase hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" /> All roles
            </Link>
            <p className="eyebrow mt-8">{job.department}</p>
            <h1 className="mt-4 text-4xl leading-[1.1] text-foreground sm:text-5xl">{job.title}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" strokeWidth={1.5} /> {job.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="size-4" strokeWidth={1.5} /> {job.type}
              </span>
              <span>Posted {formatDate(job.postedAt)}</span>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="prose-insight prose">
          <PortableText value={job.body} />
        </div>
        <FadeIn delay={80} className="mt-12 border-t border-foreground/15 pt-8">
          <p className="text-sm text-muted-foreground">
            Apply by emailing{" "}
            <a href={`mailto:${job.applyEmail}?subject=${encodeURIComponent(job.title)}`} className="text-foreground hover:underline">
              {job.applyEmail}
            </a>{" "}
            directly — no account, portal or CV upload required.
          </p>
          <Button asChild variant="navy" size="xl" className="mt-6 rounded-none">
            <a href={`mailto:${job.applyEmail}?subject=${encodeURIComponent(job.title)}`}>Email your application</a>
          </Button>
        </FadeIn>
      </section>
    </div>
  );
}
