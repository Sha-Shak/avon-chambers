import { lawyerPortraitAlt } from "@/lib/page-seo";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Lawyer } from "@/types";

export function LawyerCard({ lawyer, locale = "en" }: { lawyer: Lawyer; locale?: "en" | "bn" }) {
  const bn = locale === "bn";
  const roles: Record<string, string> = { "Managing Partner": "ম্যানেজিং পার্টনার", "Partner": "পার্টনার", "Senior Associate": "সিনিয়র অ্যাসোসিয়েট", "Associate": "অ্যাসোসিয়েট", "Of Counsel": "উপদেষ্টা আইনজীবী" };
  const title = bn ? roles[lawyer.title] ?? lawyer.title : lawyer.title;
  const labels: Record<string, string> = {
    "Litigation, Arbitration & Corporate Law": "মামলা, সালিশ ও করপোরেট আইন",
    "Corporate, Commercial, Employment & Labour, Family": "করপোরেট, বাণিজ্যিক, চাকরি ও শ্রম এবং পারিবারিক আইন",
    "Corporate & Commercial Law, Regulatory Compliance, Intellectual Property & Dispute Resolution": "করপোরেট ও বাণিজ্যিক আইন, নিয়ন্ত্রক পরিপালন, মেধাসম্পদ ও বিরোধ নিষ্পত্তি",
    "Litigation, Dispute Resolution, Corporate & Commercial, M&A, Banking & Finance": "মামলা, বিরোধ নিষ্পত্তি, করপোরেট ও বাণিজ্যিক আইন, একীভূতকরণ ও অধিগ্রহণ, ব্যাংকিং ও অর্থায়ন",
    "Civil, Criminal, Tax & Company Law": "দেওয়ানি, ফৌজদারি, কর ও কোম্পানি আইন",
    "Corporate & Commercial Law, Litigation & Arbitration": "করপোরেট ও বাণিজ্যিক আইন, মামলা ও সালিশ",
    "Civil, Commercial & Corporate Litigation": "দেওয়ানি, বাণিজ্যিক ও করপোরেট মামলা",
    "Litigation, Arbitration, Corporate & Multidisciplinary Advisory": "মামলা, সালিশ, করপোরেট ও বিভিন্ন আইনি বিষয়ে পরামর্শ",
    "Commercial, Civil, Criminal & Family Litigation": "বাণিজ্যিক, দেওয়ানি, ফৌজদারি ও পারিবারিক মামলা",
    "Contracts, Company, Compliance, E-Commerce & Cyber Law": "চুক্তি, কোম্পানি, বিধি পরিপালন, ই-কমার্স ও সাইবার আইন",
    "Civil & Commercial Litigation, Criminal Litigation, Family Matters & Arbitration": "দেওয়ানি ও বাণিজ্যিক মামলা, ফৌজদারি মামলা, পারিবারিক বিষয় ও সালিশ",
    "Criminal, Civil, Land & Family Litigation": "ফৌজদারি, দেওয়ানি, জমি ও পারিবারিক মামলা",
  };
  const area = bn ? labels[lawyer.area] ?? lawyer.area : lawyer.area;
  return (
    <Link href={`/lawyers/${lawyer.slug}`} className="group block">
      <div className="relative aspect-3/4 w-full overflow-hidden bg-secondary">
        <Image
          src={lawyer.photo}
          alt={bn ? `${lawyer.name}, ${title}, অ্যাভন চেম্বার্স` : lawyerPortraitAlt(lawyer)}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
        />
      </div>
      <h3 lang="en" className="mt-5 text-lg text-foreground">{lawyer.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{title}</p>
      <p className="mt-3 text-xs tracking-[0.12em] text-foreground uppercase">{area}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-[0.75rem] tracking-[0.14em] text-foreground uppercase">
        {locale === "bn" ? "পরিচিতি দেখুন (ইংরেজি)" : "View profile"}
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
