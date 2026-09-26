/**
 * Categories available to editors when publishing an Article in Sanity.
 *
 * Most mirror the firm's practice areas. A small number of broader legal
 * categories cover common law-firm commentary that crosses practice-area
 * boundaries. Some values intentionally retain the original short labels so
 * existing published articles remain compatible.
 */
export const ARTICLE_CATEGORIES = [
  { title: "Constitutional Law & Writs", value: "Constitutional Law & Writs" },
  { title: "Corporate & Commercial Law", value: "Corporate" },
  { title: "Civil Litigation & Dispute Resolution", value: "Litigation" },
  { title: "Arbitration & Mediation", value: "Arbitration & Mediation" },
  { title: "Criminal Litigation", value: "Criminal Litigation" },
  { title: "Banking, Finance & Investment", value: "Banking, Finance & Investment" },
  {
    title: "Foreign Investment & Investment Facilitation",
    value: "Foreign Investment & Investment Facilitation",
  },
  {
    title: "Corporate Restructuring & Project Documentation",
    value: "Corporate Restructuring & Project Documentation",
  },
  { title: "Property & Real Estate", value: "Real Estate" },
  { title: "Taxation & VAT", value: "Taxation & VAT" },
  { title: "Employment & Labour Law", value: "Employment" },
  { title: "International & Cross-Border Law", value: "International & Cross-Border Law" },
  {
    title: "Telecommunications, IT & Technology",
    value: "Telecommunications, IT & Technology",
  },
  { title: "Data Protection & Cybersecurity", value: "Data Protection & Cybersecurity" },
  { title: "Intellectual Property", value: "Intellectual Property" },
  { title: "Regulatory & Compliance", value: "Regulatory & Compliance" },
  { title: "Insolvency & Bankruptcy", value: "Insolvency & Bankruptcy" },
  { title: "Immigration Law", value: "Immigration" },
  { title: "Family Law", value: "Family Law" },
  { title: "New & Developing Areas", value: "New & Developing Areas" },
  { title: "Legal Updates & Commentary", value: "Legal Updates & Commentary" },
] as const;
