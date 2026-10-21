import { phoneE164 } from "@/lib/contact";
import { practiceSeo } from "@/lib/page-seo";
import { siteConfig } from "@/config/site.config";
import { mediaConfig } from "@/config/media.config";
import { urlForImage } from "@/sanity/image";
import { resolveSeoText, resolveSeoTitle } from "@/lib/seo";
import { practiceAreaById } from "@/config/practice-areas.config";
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
    areaServed: siteConfig.address.addressCountry,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: siteConfig.openingHours.days.map((day) => `https://schema.org/${day}`),
      opens: siteConfig.openingHours.opens,
      closes: siteConfig.openingHours.closes,
    },
    sameAs: Object.values(siteConfig.social).filter(Boolean),
  };
}

/**
 * Individual lawyer schema. Uses Person (not the schema.org "Attorney"
 * type, which represents the professional service/business rather than an
 * individual) with worksFor pointing back at the firm record above.
 */
export function personId(slug: string) {
  return `${abs(`/lawyers/${slug}`)}#person`;
}

export function lawyerSchema(lawyer: Lawyer) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId(lawyer.slug),
    name: lawyer.name,
    jobTitle: lawyer.title,
    description: lawyer.intro,
    image: abs(lawyer.photo),
    url: abs(`/lawyers/${lawyer.slug}`),
    email: lawyer.email,
    telephone: lawyer.phone ? phoneE164(lawyer.phone) : undefined,
    worksFor: { "@id": organizationId() },
    knowsAbout: [...new Set(lawyer.practiceAreaIds.map((id) => practiceAreaById(id)?.title).filter(Boolean))],
    hasCredential: [
      ...lawyer.admissions.map((name) => ({ "@type": "EducationalOccupationalCredential", credentialCategory: "Professional admission", name })),
      ...lawyer.education.map((name) => ({ "@type": "EducationalOccupationalCredential", credentialCategory: "Education and training", name })),
    ],
    sameAs: lawyer.profileLinks?.map((link) => link.url),
  };
}

export function practiceAreaSchema(area: PracticeArea) {
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${abs(`/practice-areas/${area.slug}`)}#service`,
    serviceType: area.title,
    name: area.title,
    description: practiceSeo(area).description,
    url: abs(`/practice-areas/${area.slug}`),
    provider: { "@id": organizationId() },
    areaServed: siteConfig.address.addressCountry,
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
    headline: resolveSeoTitle(study.seo?.metaTitle, study.title),
    name: study.title,
    description: resolveSeoText(study.seo?.metaDescription, study.excerpt),
    about: study.practiceAreaIds.map((id) => practiceAreaById(id)?.title).filter(Boolean),
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

export function insightSchema(
  insight: Insight,
  author?: { name: string; url?: string },
  reviewer?: { name: string; url?: string },
) {
  const authorName = author?.name ?? siteConfig.name;
  const image = insight.coverImage?.asset ? urlForImage(insight.coverImage.asset).width(1600).url() : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: resolveSeoTitle(insight.seo?.metaTitle, insight.title),
    description: resolveSeoText(insight.seo?.metaDescription, insight.excerpt),
    image,
    articleSection: insight.category,
    keywords: insight.seo?.keywords?.length ? insight.seo.keywords.join(", ") : undefined,
    wordCount: wordCount(insight.body),
    datePublished: insight.publishedAt,
    dateModified: insight.updatedAt ?? insight.publishedAt,
    url: abs(`/insights/${insight.slug}`),
    author: author
      ? { "@type": "Person", "@id": author.url ? `${author.url}#person` : undefined, name: authorName, url: author.url }
      : { "@type": "Organization", "@id": organizationId(), name: siteConfig.name },
    lastReviewed: reviewer && insight.reviewedAt ? insight.reviewedAt : undefined,
    reviewedBy: reviewer
      ? { "@type": "Person", "@id": reviewer.url ? `${reviewer.url}#person` : undefined, name: reviewer.name, url: reviewer.url }
      : undefined,
    publisher: {
      "@type": "Organization",
      "@id": organizationId(),
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
    description: resolveSeoText(job.seo?.metaDescription, job.summary),
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
  updatedAt?: string;
  imageUrl?: string;
  section: string;
  event?: { startDate?: string; location?: string };
}) {
  const url = abs(post.path);
  const publisher = {
    "@type": "Organization",
    "@id": organizationId(),
    name: siteConfig.name,
    logo: { "@type": "ImageObject", url: abs(mediaConfig.brand.logo.src) },
  };

  if (post.event?.startDate) {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      name: post.title,
      description: post.excerpt,
      startDate: post.event.startDate,
      location: post.event.location
        ? { "@type": "Place", name: post.event.location }
        : undefined,
      image: post.imageUrl,
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
    dateModified: post.updatedAt ?? post.publishedAt,
    url,
    author: { "@type": "Organization", "@id": organizationId(), name: siteConfig.name },
    publisher,
    mainEntityOfPage: url,
  };
}


export function webPageSchema(path: string, name: string, type: "WebPage" | "AboutPage" | "ContactPage" | "ProfilePage" = "WebPage", entityId = organizationId()) {
  const url = abs(path);
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    inLanguage: path.startsWith("/bn/") ? "bn-BD" : "en-BD",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": organizationId() },
    mainEntity: { "@id": entityId },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: `${siteConfig.url}/`,
    name: siteConfig.name,
    publisher: { "@id": organizationId() },
    inLanguage: ["en-BD", "bn-BD"],
  };
}
