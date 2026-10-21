import { Breadcrumbs } from "@/components/breadcrumbs";
import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { PostCollection } from "@/components/post-collection";
import { ConsultationSection } from "@/components/consultation-section";
import { siteConfig } from "@/config/site.config";
import { getAllProBonoPosts } from "@/lib/content";
import { proBonoCard } from "@/lib/posts";
import { buildSocialMetadata } from "@/lib/seo";

const DESCRIPTION = `Legal aid, community outreach and pro bono work by the lawyers of ${siteConfig.name}.`;

export async function generateMetadata(): Promise<Metadata> {
  const hasPublishedContent = (await getAllProBonoPosts()).length > 0;
  return {
    title: "Social Commitments and Pro Bono Services",
    description: DESCRIPTION,
    alternates: { canonical: "/pro-bono" },
    robots: hasPublishedContent ? undefined : { index: false, follow: true },
    ...buildSocialMetadata({
      title: `Social Commitments and Pro Bono Services | ${siteConfig.name}`,
      description: DESCRIPTION,
      url: "/pro-bono",
    }),
  };
}

export default async function ProBonoPage() {
  const posts = await getAllProBonoPosts();

  return (
    <div>
      <Breadcrumbs items={[
          { name: "Home", path: "/" },
          { name: "Social Commitments and Pro Bono Services", path: "/pro-bono" },
        ]} />

      <PageBanner
        image="proBono"
        eyebrow="Social Commitments and Pro Bono Services"
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
