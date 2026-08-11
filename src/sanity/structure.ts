import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Avon Chambers content")
    .items([
      S.listItem()
        .title("Insights (blog)")
        .schemaType("insight")
        .child(S.documentTypeList("insight").title("Insights").defaultOrdering([{ field: "publishedAt", direction: "desc" }])),
      S.listItem()
        .title("Careers")
        .schemaType("jobPost")
        .child(S.documentTypeList("jobPost").title("Job postings").defaultOrdering([{ field: "postedAt", direction: "desc" }])),
    ]);
