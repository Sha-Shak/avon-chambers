import type { SchemaTypeDefinition } from "sanity";
import { insight } from "./insight";
import { jobPost } from "./jobPost";
import { seo } from "./objects/seo";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [insight, jobPost, seo],
};
