import { siteConfig } from "@/config/site.config";
import { mediaConfig } from "@/config/media.config";
import { urlForImage } from "@/sanity/image";
import type { Lawyer, CaseStudy, Insight, JobPost, PracticeArea } from "@/types";

const abs = (pathname: string) => `${siteConfig.url}${pathname}`;

export function organizationId() {
  return `${siteConfig.url}/#organization`;
}

/** Site-wide LegalService record. Rendered once, in the root layout. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": organizationId(),
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: abs(mediaConfig.brand.logo.src),
    description: siteConfig.description,
    telephone: siteConfig.consultationPhoneE164,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.addressCountry,
    },
    areaServed: siteConfig.address.addressRegion,
    sameAs: Object.values(siteConfig.social).filter(Boolean),
  };
}

/**
 * Individual lawyer schema. Uses Person (not the schema.org "Attorney"
 * type, which represents the professional service/business rather than an
 * individual) with worksFor pointing back at the firm record above.
 */
export function lawyerSchema(lawyer: Lawyer) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: lawyer.name,
    jobTitle: lawyer.title,
    description: lawyer.intro,
    image: abs(lawyer.photo),
    url: abs(`/lawyers/${lawyer.slug}`),
    email: lawyer.email,
    telephone: lawyer.phone,
    worksFor: { "@id": organizationId() },
    knowsAbout: lawyer.areas,
    alumniOf: lawyer.education.map((line) => ({
      "@type": "CollegeOrUniversity",
      name: line.split(",")[1]?.trim().replace(/\s*\(.*\)$/, "") ?? line,
    })),
  };
}

export function practiceAreaSchema(area: PracticeArea) {
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: area.title,
    name: area.title,
    description: area.valueProp,
    url: abs(`/practice-areas/${area.slug}`),
    provider: { "@id": organizationId() },
    areaServed: siteConfig.address.addressRegion,
  };

  const faqPage =
    area.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: area.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return { service, faqPage };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

export function caseStudySchema(study: CaseStudy) {
  const image = study.coverImage?.asset ? urlForImage(study.coverImage).width(1600).url() : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    headline: study.seo?.metaTitle ?? study.title,
    name: study.title,
    description: study.seo?.metaDescription ?? study.excerpt,
    about: study.practiceAreaSlugs,
    genre: study.matterType,
    image,
    datePublished: study.publishedAt,
    dateModified: study.updatedAt ?? study.publishedAt,
    url: abs(`/case-studies/${study.slug}`),
    author: { "@id": organizationId() },
    publisher: { "@id": organizationId() },
    mainEntityOfPage: abs(`/case-studies/${study.slug}`),
  };
}

/** Rough word count from Portable Text blocks, for the BlogPosting `wordCount` field. */
function wordCount(body: Insight["body"]) {
  const text = body
    .filter((block) => block._type === "block")
    .flatMap((block) => (block.children ?? []).map((child) => child.text ?? ""))
    .join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

export function insightSchema(insight: Insight, author?: { name: string; url?: string }) {
  const authorName = author?.name ?? siteConfig.name;
  const image = insight.coverImage?.asset ? urlForImage(insight.coverImage.asset).width(1600).url() : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: insight.seo?.metaTitle ?? insight.title,
    description: insight.seo?.metaDescription ?? insight.excerpt,
    image,
    articleSection: insight.category,
    keywords: insight.seo?.keywords?.length ? insight.seo.keywords.join(", ") : undefined,
    wordCount: wordCount(insight.body),
    datePublished: insight.publishedAt,
    dateModified: insight.updatedAt ?? insight.publishedAt,
    url: abs(`/insights/${insight.slug}`),
    author: author?.url ? { "@type": "Person", name: authorName, url: author.url } : { "@type": "Person", name: authorName },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: abs(mediaConfig.brand.logo.src) },
    },
    mainEntityOfPage: abs(`/insights/${insight.slug}`),
  };
}

const JOB_TYPE_SCHEMA: Record<JobPost["type"], string> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACTOR",
  Internship: "INTERN",
};

export function jobPostingSchema(job: JobPost) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.seo?.metaDescription ?? job.summary,
    datePosted: job.postedAt,
    validThrough: job.closingDate,
    employmentType: JOB_TYPE_SCHEMA[job.type],
    hiringOrganization: {
      "@type": "Organization",
      name: siteConfig.name,
      sameAs: siteConfig.url,
      logo: abs(mediaConfig.brand.logo.src),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.address.addressLocality,
        addressRegion: siteConfig.address.addressRegion,
        addressCountry: siteConfig.address.addressCountry,
      },
    },
    directApply: false,
  };
}

/** Structured data for a News & Events or Pro Bono post — an Event for events, otherwise a NewsArticle. */
export function postSchema(post: {
  title: string;
  excerpt: string;
  path: string;
  publishedAt: string;
  imageUrl?: string;
  section: string;
  event?: { startDate?: string; location?: string };
}) {
  const url = abs(post.path);
  const publisher = {
    "@type": "Organization",
    name: siteConfig.name,
    logo: { "@type": "ImageObject", url: abs(mediaConfig.brand.logo.src) },
  };

  if (post.event) {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      name: post.title,
      description: post.excerpt,
      startDate: post.event.startDate ?? post.publishedAt,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: post.event.location
        ? { "@type": "Place", name: post.event.location }
        : { "@type": "Place", name: siteConfig.name, address: siteConfig.address.streetAddress },
      image: post.imageUrl,
      organizer: publisher,
      url,
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    image: post.imageUrl,
    articleSection: post.section,
    datePublished: post.publishedAt,
    url,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher,
    mainEntityOfPage: url,
  };
}
