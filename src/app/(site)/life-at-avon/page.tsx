import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { PhotoGallery } from "@/components/gallery/photo-gallery";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { getGalleryCategories, getGalleryPhotos } from "@/lib/data";
import { breadcrumbSchema } from "@/lib/schema";
import { buildOpenGraph } from "@/lib/seo";

const DESCRIPTION = `A look inside ${siteConfig.name} — the office, the people, and the moments in between the casework.`;

export const metadata: Metadata = {
  title: "Life at Avon",
  description: DESCRIPTION,
  alternates: { canonical: "/life-at-avon" },
  openGraph: buildOpenGraph({
    title: `Life at Avon — ${siteConfig.name}`,
    description: DESCRIPTION,
    url: "/life-at-avon",
  }),
};

export default function LifeAtAvonPage() {
  const photos = getGalleryPhotos();
  const categories = getGalleryCategories();

  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Life at Avon", path: "/life-at-avon" },
        ])}
      />

      <section className="border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <FadeIn className="max-w-3xl">
            <p className="eyebrow">Life at Avon</p>
            <h1 className="mt-6 text-4xl leading-[1.1] text-foreground sm:text-5xl">
              A look inside Chambers
            </h1>
            <p className="mt-7 text-base leading-relaxed text-muted-foreground">{DESCRIPTION}</p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <FadeIn>
          <PhotoGallery photos={photos} categories={categories} />
        </FadeIn>
      </section>
    </div>
  );
}
