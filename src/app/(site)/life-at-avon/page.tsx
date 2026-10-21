import { Breadcrumbs } from "@/components/breadcrumbs";
import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { PageBanner } from "@/components/page-banner";
import { PhotoGallery } from "@/components/gallery/photo-gallery";
import { siteConfig } from "@/config/site.config";
import { getGalleryCategories, getGalleryPhotos } from "@/lib/data";
import { buildSocialMetadata } from "@/lib/seo";

const DESCRIPTION = `Meet the people at ${siteConfig.name} and see everyday life at the Chambers.`;

export const metadata: Metadata = {
  title: "Life at Avon",
  description: DESCRIPTION,
  alternates: { canonical: "/life-at-avon" },
  ...buildSocialMetadata({
    title: `Life at Avon | ${siteConfig.name}`,
    description: DESCRIPTION,
    url: "/life-at-avon",
  }),
};

export default function LifeAtAvonPage() {
  const photos = getGalleryPhotos();
  const categories = getGalleryCategories();

  return (
    <div>
      <Breadcrumbs items={[
          { name: "Home", path: "/" },
          { name: "Life at Avon", path: "/life-at-avon" },
        ]} />

      <PageBanner
        image="lifeAtAvon"
        eyebrow="Life at Avon"
        title="A look inside Chambers"
        description={<>{DESCRIPTION}</>}
      />

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <FadeIn>
          <PhotoGallery photos={photos} categories={categories} />
        </FadeIn>
      </section>
    </div>
  );
}
