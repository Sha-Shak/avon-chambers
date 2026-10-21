import first from "@/data/bn/practices-1-3.json";
import second from "@/data/bn/practices-4-6.json";
import third from "@/data/bn/practices-7-10.json";
import fourth from "@/data/bn/practices-11-13.json";
import fifth from "@/data/bn/practices-14-15.json";
import type { PracticeArea } from "@/types";

export const banglaPractices = [...first, ...second, ...third, ...fourth, ...fifth];

/** Keep route IDs, images and relationships identical to the English source. */
export function banglaPractice(area: PracticeArea): PracticeArea {
  const text = banglaPractices.find((item) => item.id === area.id);
  if (!text) throw new Error(`Missing Bangla practice ${area.id}`);
  return {
    ...area,
    title: text.title,
    copy: text.copy,
    valueProp: text.valueProp,
    image: { ...area.image, alt: text.alt },
    overview: text.overview,
    services: text.services.map(([title, copy]) => ({ title, copy })),
    faqs: text.faqs.map(([q, a]) => ({ q, a })),
  };
}

const guidance: Record<string, string> = {
  "Discuss your matter": "আপনার বিষয়টি আলোচনা করুন",
  "Tell us what happened, what you need to achieve and whether any deadline is approaching.": "কী ঘটেছে, আপনি কী অর্জন করতে চান এবং কোনো সময়সীমা আসন্ন কি না, তা জানান।",
  "Review the information": "তথ্য পর্যালোচনা",
  "We assess the documents, identify the legal issues and discuss the available options and next steps.": "আমরা নথি মূল্যায়ন করি, আইনি প্রশ্ন চিহ্নিত করি এবং প্রাপ্য বিকল্প ও পরবর্তী পদক্ষেপ আলোচনা করি।",
  "Agree the scope": "কাজের পরিধি নির্ধারণ",
  "Before work begins, we agree the services and fees. Timing depends on the matter, the documents and any court or regulatory process.": "কাজ শুরুর আগে সেবা ও ফি নির্ধারণ করা হয়। সময় নির্ভর করে বিষয়, নথি এবং আদালত বা নিয়ন্ত্রক প্রক্রিয়ার ওপর।",
  "A short summary of the facts and key dates": "ঘটনা ও গুরুত্বপূর্ণ তারিখের সংক্ষিপ্ত বিবরণ",
  "Relevant correspondence and any notices or orders already received": "প্রাসঙ্গিক চিঠিপত্র এবং ইতিমধ্যে পাওয়া নোটিশ বা আদেশ",
  "The decision or government action you wish to challenge": "আপনি যে সিদ্ধান্ত বা সরকারি কার্যক্রম চ্যালেঞ্জ করতে চান",
  "Any previous applications and supporting records": "আগের আবেদন ও সহায়ক রেকর্ড",
  "Company formation and ownership records": "কোম্পানি গঠন ও মালিকানার রেকর্ড",
  "Relevant contracts, resolutions and transaction documents": "প্রাসঙ্গিক চুক্তি, সিদ্ধান্ত ও লেনদেনের নথি",
  "Contracts, payment records and supporting evidence": "চুক্তি, অর্থপ্রদানের রেকর্ড ও সহায়ক প্রমাণ",
  "Pleadings and case papers if proceedings have begun": "মামলা শুরু হয়ে থাকলে আরজি, জবাব ও মামলার কাগজপত্র",
  "The contract and arbitration or mediation clause": "চুক্তি এবং সালিশ বা মধ্যস্থতার ধারা",
  "Notices, claims and any award already issued": "নোটিশ, দাবি ও ইতিমধ্যে দেওয়া রোয়েদাদ",
  "Copies of the complaint, case papers and any bail or court orders available": "অভিযোগ, মামলার কাগজপত্র এবং পাওয়া যায় এমন জামিন বা আদালতের আদেশের কপি",
  "Relevant supporting documents and evidence": "প্রাসঙ্গিক সহায়ক নথি ও সাক্ষ্যপ্রমাণ",
  "Loan agreements and financing documents": "ঋণ চুক্তি ও অর্থায়নের নথি",
  "Security documents, account statements and payment records": "জামানতের নথি, হিসাব বিবরণী ও অর্থপ্রদানের রেকর্ড",
  "Investment proposals and corporate ownership records": "বিনিয়োগ প্রস্তাব ও করপোরেট মালিকানার রেকর্ড",
  "Any registration, approval or regulatory correspondence": "নিবন্ধন, অনুমোদন বা নিয়ন্ত্রক কর্তৃপক্ষের সঙ্গে চিঠিপত্র",
  "Existing corporate structure and transaction documents": "বিদ্যমান করপোরেট কাঠামো ও লেনদেনের নথি",
  "Project agreements and restructuring proposals": "প্রকল্প চুক্তি ও পুনর্গঠন প্রস্তাব",
  "Title deeds, ownership history and available land records": "মালিকানার দলিল, মালিকানার ইতিহাস ও পাওয়া যায় এমন ভূমি রেকর্ড",
  "Mutation records, property agreements and transaction documents": "নামজারির রেকর্ড, সম্পত্তির চুক্তি ও লেনদেনের নথি",
  "Tax returns, assessments and relevant financial records": "কর রিটার্ন, কর নির্ধারণ ও প্রাসঙ্গিক আর্থিক রেকর্ড",
  "VAT documents and correspondence with the tax authorities": "ভ্যাটের নথি ও কর কর্তৃপক্ষের সঙ্গে চিঠিপত্র",
  "Employment contracts and workplace policies": "চাকরির চুক্তি ও কর্মক্ষেত্রের নীতিমালা",
  "Relevant pay records, notices and workplace correspondence": "প্রাসঙ্গিক বেতনের রেকর্ড, নোটিশ ও কর্মক্ষেত্রের চিঠিপত্র",
  "Cross-border agreements and transaction documents": "আন্তঃসীমান্ত চুক্তি ও লেনদেনের নথি",
  "Relevant foreign proceedings or regulatory correspondence": "প্রাসঙ্গিক বিদেশি কার্যধারা বা নিয়ন্ত্রক কর্তৃপক্ষের চিঠিপত্র",
  "Founders' agreements, investment documents and technology contracts": "প্রতিষ্ঠাতাদের চুক্তি, বিনিয়োগের নথি ও প্রযুক্তি চুক্তি",
  "Relevant intellectual property and regulatory records": "প্রাসঙ্গিক মেধাসম্পদ ও নিয়ন্ত্রক রেকর্ড",
  "Marriage and other family records relevant to your matter": "আপনার বিষয়সংশ্লিষ্ট বিবাহ ও অন্যান্য পারিবারিক রেকর্ড",
  "Existing agreements, court papers and supporting financial documents": "বিদ্যমান চুক্তি, আদালতের কাগজপত্র ও সহায়ক আর্থিক নথি",
  "Relevant policies, agreements and technical descriptions": "প্রাসঙ্গিক নীতিমালা, চুক্তি ও প্রযুক্তিগত বিবরণ",
  "Available evidence and correspondence concerning the issue": "বিষয়সংক্রান্ত প্রাপ্ত সাক্ষ্যপ্রমাণ ও চিঠিপত্র",
};

/** Missing preparation copy should fail a build rather than silently publish English. */
export function banglaGuidance(source: string): string {
  const translated = guidance[source];
  if (!translated) throw new Error(`Missing Bangla preparation guidance: ${source}`);
  return translated;
}
