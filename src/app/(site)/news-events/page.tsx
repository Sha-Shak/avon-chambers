import { Breadcrumbs } from "@/components/breadcrumbs";
import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { PostCollection } from "@/components/post-collection";
import { ConsultationSection } from "@/components/consultation-section";
import { siteConfig } from "@/config/site.config";
import { getAllNewsEvents } from "@/lib/content";
import { newsEventCard } from "@/lib/posts";
import { buildSocialMetadata } from "@/lib/seo";

const DESCRIPTION = `The latest news, announcements and events from ${siteConfig.name}.`;

export async function generateMetadata(): Promise<Metadata> {
  const items = await getAllNewsEvents();

  return {
    title: "News & Events",
    description: DESCRIPTION,
    alternates: { canonical: "/news-events" },
    robots: items.length > 0 ? undefined : { index: false, follow: true },
    ...buildSocialMetadata({
      title: `News & Events | ${siteConfig.name}`,
      description: DESCRIPTION,
      url: "/news-events",
    }),
  };
}

export default async function NewsEventsPage() {
  const items = await getAllNewsEvents();

  return (
    <div>
      <Breadcrumbs items={[
          { name: "Home", path: "/" },
          { name: "News & Events", path: "/news-events" },
        ]} />

      <PageBanner
        image="newsEvents"
        eyebrow="News & Events"
        title="Moments and milestones from Chambers"
        description={DESCRIPTION}
      />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <PostCollection
          posts={items.map(newsEventCard)}
          cta="Read more"
          emptyMessage="Announcements and upcoming events will appear here. Please check back soon."
        />
      </section>

      <ConsultationSection eyebrow="Stay in touch" heading="Have a question for the Chambers?" />
    </div>
  );
}
