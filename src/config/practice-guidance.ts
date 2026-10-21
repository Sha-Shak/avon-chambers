/** Preparation guidance, not a statement of filing requirements or promised timelines. */
export const PRACTICE_PROCESS = [
  { title: "Discuss your matter", copy: "Tell us what happened, what you need to achieve and whether any deadline is approaching." },
  { title: "Review the information", copy: "We assess the documents, identify the legal issues and discuss the available options and next steps." },
  { title: "Agree the scope", copy: "Before work begins, we agree the services and fees. Timing depends on the matter, the documents and any court or regulatory process." },
];

const COMMON = ["A short summary of the facts and key dates", "Relevant correspondence and any notices or orders already received"];
export const PRACTICE_DOCUMENTS: Record<number, string[]> = {
  1: [...COMMON, "The decision or government action you wish to challenge", "Any previous applications and supporting records"],
  2: [...COMMON, "Company formation and ownership records", "Relevant contracts, resolutions and transaction documents"],
  3: [...COMMON, "Contracts, payment records and supporting evidence", "Pleadings and case papers if proceedings have begun"],
  4: [...COMMON, "The contract and arbitration or mediation clause", "Notices, claims and any award already issued"],
  5: [...COMMON, "Copies of the complaint, case papers and any bail or court orders available", "Relevant supporting documents and evidence"],
  6: [...COMMON, "Loan agreements and financing documents", "Security documents, account statements and payment records"],
  7: [...COMMON, "Investment proposals and corporate ownership records", "Any registration, approval or regulatory correspondence"],
  8: [...COMMON, "Existing corporate structure and transaction documents", "Project agreements and restructuring proposals"],
  9: [...COMMON, "Title deeds, ownership history and available land records", "Mutation records, property agreements and transaction documents"],
  10: [...COMMON, "Tax returns, assessments and relevant financial records", "VAT documents and correspondence with the tax authorities"],
  11: [...COMMON, "Employment contracts and workplace policies", "Relevant pay records, notices and workplace correspondence"],
  12: [...COMMON, "Cross-border agreements and transaction documents", "Relevant foreign proceedings or regulatory correspondence"],
  13: [...COMMON, "Founders' agreements, investment documents and technology contracts", "Relevant intellectual property and regulatory records"],
  14: [...COMMON, "Marriage and other family records relevant to your matter", "Existing agreements, court papers and supporting financial documents"],
  15: [...COMMON, "Relevant policies, agreements and technical descriptions", "Available evidence and correspondence concerning the issue"],
};
