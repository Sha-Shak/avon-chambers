import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Published content only, served off Sanity's CDN - fast, and exactly
  // what a public marketing site needs. The Studio itself (src/app/studio)
  // always talks to the live API directly, so editors immediately see
  // their own unpublished drafts there regardless of this setting.
  useCdn: true,
});
