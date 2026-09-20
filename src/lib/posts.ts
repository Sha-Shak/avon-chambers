import { urlForImage } from "@/sanity/image";
import type { NewsEventMeta, ProBonoMeta, SanityPicture } from "@/types";

/** Plain, serialisable card data — safe to hand from server pages to client components. */
export interface PostCardData {
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  badge: string;
  /** ISO date shown on the card (an Event's own date, otherwise the publish date). */
  date: string;
  /** Extra line under the date, e.g. an event's location. */
  meta?: string;
  imageUrl?: string;
  imageAlt: string;
}

export function pictureUrl(picture: SanityPicture | null | undefined, width: number, height?: number) {
  if (!picture?.asset) return undefined;
  const builder = urlForImage(picture).width(width);
  return (height ? builder.height(height) : builder).url();
}

export function newsEventCard(item: NewsEventMeta): PostCardData {
  return {
    slug: item.slug,
    href: `/news-events/${item.slug}`,
    title: item.title,
    excerpt: item.excerpt,
    badge: item.kind,
    date: item.kind === "Event" && item.eventDate ? item.eventDate : item.publishedAt,
    meta: item.kind === "Event" ? item.location : undefined,
    imageUrl: pictureUrl(item.coverImage, 900, 600),
    imageAlt: item.coverImage?.alt ?? item.title,
  };
}

export function proBonoCard(item: ProBonoMeta): PostCardData {
  return {
    slug: item.slug,
    href: `/pro-bono/${item.slug}`,
    title: item.title,
    excerpt: item.excerpt,
    badge: item.category,
    date: item.publishedAt,
    imageUrl: pictureUrl(item.coverImage, 900, 600),
    imageAlt: item.coverImage?.alt ?? item.title,
  };
}

export function formatPostDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    // Fixed timezone so the server and browser render identical text.
    timeZone: "UTC",
  });
}
