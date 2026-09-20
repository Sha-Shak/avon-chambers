import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { PostCollection } from "@/components/post-collection";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getAllNewsEvents } from "@/lib/content";
import { newsEventCard } from "@/lib/posts";
import { breadcrumbSchema } from "@/lib/schema";
import { buildOpenGraph } from "@/lib/seo";

const DESCRIPTION = `News, announcements and events from ${siteConfig.name} — what the Chambers has been up to, and what is coming next.`;

export const metadata: Metadata = {
  title: "News & Events",
  description: DESCRIPTION,
  alternates: { canonical: "/news-events" },
  openGraph: buildOpenGraph({
    title: `News & Events — ${siteConfig.name}`,
    description: DESCRIPTION,
    url: "/news-events",
  }),
};

export default async function NewsEventsPage() {
  const items = await getAllNewsEvents();

  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "News & Events", path: "/news-events" },
        ])}
      />

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
