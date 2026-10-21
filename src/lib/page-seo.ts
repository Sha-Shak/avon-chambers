import type { Lawyer, PracticeArea } from "@/types";
import { siteConfig } from "@/config/site.config";

/** Service-specific summaries derived from the firm's published service list. */
const PRACTICE_SUMMARIES: Record<number, { title: string; description: string }> = {
  1: { title: "Writ Petition & Constitutional Lawyers in Dhaka", description: "Avon Chambers in Dhaka advises on writ petitions, judicial review, fundamental rights and challenges to government decisions in Bangladesh." },
  2: { title: "Corporate & Commercial Lawyers in Dhaka", description: "Corporate lawyers at Avon Chambers, Dhaka advise on company formation, commercial contracts, governance, shareholder disputes and intellectual property." },
  3: { title: "Civil Litigation Lawyers in Dhaka", description: "Avon Chambers in Dhaka handles civil suits, contractual disputes, money recovery and appeals for individuals and businesses in Bangladesh." },
  4: { title: "Arbitration & Mediation Lawyers in Dhaka", description: "Avon Chambers in Dhaka advises on arbitration agreements, proceedings, awards and mediation for commercial and other disputes in Bangladesh." },
  5: { title: "Criminal Defence & Bail Lawyers in Dhaka", description: "Criminal lawyers at Avon Chambers in Dhaka advise on defence, bail, complaints and criminal proceedings before the courts of Bangladesh." },
  6: { title: "Banking & Finance Lawyers in Dhaka", description: "Avon Chambers in Dhaka advises lenders, businesses and borrowers on financing, banking documents, security, investment and financial disputes." },
  7: { title: "Foreign Investment Lawyers in Dhaka", description: "Avon Chambers in Dhaka advises on foreign investment in Bangladesh, including structuring, regulatory approvals, registration and investment facilitation." },
  8: { title: "Corporate Restructuring Lawyers in Dhaka", description: "Avon Chambers in Dhaka advises on corporate restructuring, transaction structuring and project documentation for businesses in Bangladesh." },
  9: { title: "Property & Real Estate Lawyers in Dhaka", description: "Property lawyers at Avon Chambers, Dhaka advise on purchases, title checks, due diligence, ownership, leases and real estate disputes in Bangladesh." },
  10: { title: "Tax & VAT Lawyers in Dhaka", description: "Tax lawyers at Avon Chambers in Dhaka advise on income tax, VAT, tax planning, compliance and disputes for businesses and individuals in Bangladesh." },
  11: { title: "Employment & Labour Lawyers in Dhaka", description: "Avon Chambers in Dhaka advises employers and employees on contracts, workplace policies, termination, separation and labour disputes in Bangladesh." },
  12: { title: "International & Cross-Border Lawyers in Dhaka", description: "Avon Chambers in Dhaka advises on cross-border transactions, foreign investment, international commercial contracts and related legal issues." },
  13: { title: "Technology & Startup Lawyers in Dhaka", description: "Avon Chambers in Dhaka advises on startup formation, founders' agreements, investment, technology contracts, intellectual property and regulatory matters." },
  14: { title: "Family & Divorce Lawyers in Dhaka", description: "Family lawyers at Avon Chambers, Dhaka advise on divorce, child custody, guardianship, dower and maintenance matters in Bangladesh." },
  15: { title: "Cyber Law & Data Protection Lawyers in Dhaka", description: "Avon Chambers in Dhaka advises on emerging legal issues involving artificial intelligence, privacy, data protection, cybersecurity and technology." },
};

export function practiceSeo(area: PracticeArea) {
  return PRACTICE_SUMMARIES[area.id] ?? {
    title: `${area.title} in Dhaka`,
    description: `${siteConfig.name} in Dhaka advises on ${area.title.toLowerCase()}. ${area.valueProp}`,
  };
}

export function practiceAnswer(area: PracticeArea) {
  return `${siteConfig.name} advises on ${area.title.toLowerCase()} from its office in Dhanmondi, Dhaka, serving clients across Bangladesh. ${area.valueProp}`;
}

export function lawyerPortraitAlt(lawyer: Lawyer) {
  return `${lawyer.name}, ${lawyer.title}, ${siteConfig.name}`;
}
