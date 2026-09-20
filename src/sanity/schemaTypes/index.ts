import type { SchemaTypeDefinition } from "sanity";
import { insight } from "./insight";
import { jobPost } from "./jobPost";
import { newsEvent } from "./newsEvent";
import { proBono } from "./proBono";
import { seo } from "./objects/seo";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [insight, jobPost, newsEvent, proBono, seo],
};
