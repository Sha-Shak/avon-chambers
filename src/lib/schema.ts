import { siteConfig } from "@/config/site.config";
import { mediaConfig } from "@/config/media.config";
import { urlForImage } from "@/sanity/image";
import type { Attorney, CaseStudy, Insight, JobPost, PracticeArea } from "@/types";

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
    foundingDate: siteConfig.foundingDate,
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
 * Individual attorney schema. Uses Person (not the schema.org "Attorney"
 * type, which represents the professional service/business rather than an
 * individual) with worksFor pointing back at the firm record above.
 */
export function attorneySchema(attorney: Attorney) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: attorney.name,
    jobTitle: attorney.title,
    description: attorney.intro,
    image: abs(attorney.photo),
    url: abs(`/attorneys/${attorney.slug}`),
    email: attorney.email,
    telephone: attorney.phone,
    worksFor: { "@id": organizationId() },
    knowsAbout: attorney.areas,
    alumniOf: attorney.education.map((line) => ({
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
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.title,
    about: study.area,
    abstract: study.summary,
    provider: { "@id": organizationId() },
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
    headline: insight.title,
    description: insight.seoDescription ?? insight.excerpt,
    image,
    articleSection: insight.category,
    keywords: insight.keywords?.length ? insight.keywords.join(", ") : undefined,
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
    description: job.summary,
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
