import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { PostCollection } from "@/components/post-collection";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getAllProBonoPosts } from "@/lib/content";
import { proBonoCard } from "@/lib/posts";
import { breadcrumbSchema } from "@/lib/schema";
import { buildOpenGraph } from "@/lib/seo";

const DESCRIPTION = `Pro bono services and community work by the lawyers of ${siteConfig.name} — legal aid, outreach and awareness for those who need it most.`;

export const metadata: Metadata = {
  title: "Pro Bono Services",
  description: DESCRIPTION,
  alternates: { canonical: "/pro-bono" },
  openGraph: buildOpenGraph({
    title: `Pro Bono Services — ${siteConfig.name}`,
    description: DESCRIPTION,
    url: "/pro-bono",
  }),
};

export default async function ProBonoPage() {
  const posts = await getAllProBonoPosts();

  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Pro Bono Services", path: "/pro-bono" },
        ])}
      />

      <PageBanner
        image="proBono"
        eyebrow="Pro Bono Services"
        title="Giving back through the law"
        description={DESCRIPTION}
      />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <PostCollection
          posts={posts.map(proBonoCard)}
          cta="Read the story"
          emptyMessage="Stories from our pro bono and community work will appear here. Please check back soon."
        />
      </section>

      <ConsultationSection eyebrow="Need legal help?" heading="Talk to us about your situation." />
    </div>
  );
}
