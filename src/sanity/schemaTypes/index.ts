import type { SchemaTypeDefinition } from "sanity";
import { caseStudy } from "./caseStudy";
import { insight } from "./insight";
import { jobPost } from "./jobPost";
import { newsEvent } from "./newsEvent";
import { proBono } from "./proBono";
import { seo } from "./objects/seo";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [insight, caseStudy, jobPost, newsEvent, proBono, seo],
};
