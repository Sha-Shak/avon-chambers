import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Avon Chambers content")
    .items([
      S.listItem()
        .title("Articles (blog)")
        .schemaType("insight")
        .child(S.documentTypeList("insight").title("Articles").defaultOrdering([{ field: "publishedAt", direction: "desc" }])),
      S.listItem()
        .title("Case Studies")
        .schemaType("caseStudy")
        .child(S.documentTypeList("caseStudy").title("Case Studies").defaultOrdering([{ field: "publishedAt", direction: "desc" }])),
      S.listItem()
        .title("News & Events")
        .schemaType("newsEvent")
        .child(S.documentTypeList("newsEvent").title("News & Events").defaultOrdering([{ field: "publishedAt", direction: "desc" }])),
      S.listItem()
        .title("Pro Bono")
        .schemaType("proBono")
        .child(S.documentTypeList("proBono").title("Pro Bono posts").defaultOrdering([{ field: "publishedAt", direction: "desc" }])),
      S.listItem()
        .title("Careers")
        .schemaType("jobPost")
        .child(S.documentTypeList("jobPost").title("Job postings").defaultOrdering([{ field: "postedAt", direction: "desc" }])),
    ]);
