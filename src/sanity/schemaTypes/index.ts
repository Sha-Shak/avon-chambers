import type { SchemaTypeDefinition } from "sanity";
import { insight } from "./insight";
import { jobPost } from "./jobPost";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [insight, jobPost],
};
