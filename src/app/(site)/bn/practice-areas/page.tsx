import { Breadcrumbs } from "@/components/breadcrumbs";
import { PracticeLanguageSwitcher } from "@/components/practice-language-switcher";
import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { PracticeAreaCard } from "@/components/cards/practice-area-card";
import { PageBanner } from "@/components/page-banner";
import { ConsultationSection } from "@/components/consultation-section";
import { mediaConfig } from "@/config/media.config";
import { getAllPracticeAreas } from "@/lib/data";
import { banglaPractice } from "@/lib/practice-bangla";
import { buildSocialMetadata } from "@/lib/seo";

const description = "বাংলাদেশের অ্যাভন চেম্বার্সের ১৫টি আইনি সেবার ক্ষেত্র সম্পর্কে বাংলায় জানুন। প্রতিটি ক্ষেত্রে সেবা, কাজের ধাপ, প্রয়োজনীয় নথি ও সাধারণ প্রশ্নের পূর্ণ বিবরণ রয়েছে।";
const social = buildSocialMetadata({ title: "সেবার ক্ষেত্র | অ্যাভন চেম্বার্স", description, url: "/bn/practice-areas" });
export const metadata: Metadata = {
  title: "সেবার ক্ষেত্র",
  description,
  alternates: {
    canonical: "/bn/practice-areas",
    languages: { "en-BD": "/practice-areas", "bn-BD": "/bn/practice-areas", "x-default": "/practice-areas" },
  },
  ...social,
  openGraph: { ...social.openGraph, locale: "bn_BD", alternateLocale: ["en_BD"] },
};

export default function BanglaPracticeAreasPage() {
  const areas = getAllPracticeAreas().map(banglaPractice);
  const approach = [
    { value: "সেবা", label: "নিবেদিত সেবা" },
    { value: areas.length.toLocaleString("bn-BD"), label: "সেবার ক্ষেত্র" },
    { value: "পরামর্শ", label: "বাস্তবসম্মত আইনি পরামর্শ" },
    { value: "যত্ন", label: "গোপনীয়তার নিশ্চয়তা" },
  ];
  return (
    <div lang="bn" className="[&_h1]:leading-normal [&_h2]:leading-normal [&_h3]:leading-normal">
      <Breadcrumbs items={[{ name: "হোম", path: "/" }, { name: "সেবার ক্ষেত্র", path: "/bn/practice-areas" }]} />
      <PageBanner image={{ ...mediaConfig.banners.practiceAreas, alt: "অ্যাভন চেম্বার্সের তাকজুড়ে আইনের বই" }} eyebrow="সেবার ক্ষেত্র" title="এক ঠিকানায় পূর্ণাঙ্গ আইনি পরামর্শ">
        <PracticeLanguageSwitcher locale="bn" />
      </PageBanner>
      <section className="border-b border-foreground/10">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:px-10 lg:py-24">
          <FadeIn>
            <p className="text-base leading-relaxed text-muted-foreground">অ্যাভন চেম্বার্সে বিভিন্ন আইনি বিষয়ে নিজ নিজ দক্ষতাসম্পন্ন ব্যারিস্টার, সলিসিটর, অ্যাডভোকেট ও আইনি পরামর্শক একসঙ্গে কাজ করেন। আমরা কীভাবে সহায়তা করতে পারি, তা জানতে আমাদের {areas.length.toLocaleString("bn-BD")}টি সেবার ক্ষেত্র দেখুন।</p>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">করপোরেট প্রতিষ্ঠান, কোম্পানি ও ব্যক্তিগত ক্লায়েন্টকে তাঁদের প্রয়োজন অনুযায়ী বাস্তবসম্মত সমাধানসহ পেশাগত পরামর্শ এবং সার্বিক আইনি সেবা দিই।</p>
          </FadeIn>
          <FadeIn delay={120} className="grid grid-cols-2 gap-8 self-center">
            {approach.map((item) => <div key={item.label} className="border-l border-foreground/15 pl-5"><span className="block text-3xl text-foreground">{item.value}</span><p className="mt-2 text-xs leading-snug text-muted-foreground">{item.label}</p></div>)}
          </FadeIn>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <FadeIn className="max-w-2xl"><p className="eyebrow">আমরা যেসব বিষয় নিয়ে কাজ করি</p><h2 className="mt-5 text-3xl text-foreground sm:text-4xl">সেবার ক্ষেত্র বেছে নিন</h2></FadeIn>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, index) => <FadeIn key={area.slug} delay={index * 60} className="flex"><PracticeAreaCard area={area} locale="bn" /></FadeIn>)}
        </div>
      </section>
      <ConsultationSection locale="bn" eyebrow="কোন ক্ষেত্রে সহায়তা প্রয়োজন, বুঝতে পারছেন না?" heading="আপনার পরিস্থিতি জানান। বিষয়টি কার দেখা উচিত, আমরা জানাব।" />
    </div>
  );
}
