/**
 * One-time migration: seeds your Sanity dataset with the 4 Insights posts
 * and 2 job postings this project originally shipped as markdown files, so
 * you're not starting from a blank Studio.
 *
 * Usage (after you've created a Sanity project and added its project ID +
 * dataset to .env.local - see README):
 *   SANITY_API_WRITE_TOKEN=sk... npm run migrate:sanity
 *
 * The write token needs "Editor" permissions. Create one at
 * https://www.sanity.io/manage -> your project -> API -> Tokens.
 * NEVER put a write token in NEXT_PUBLIC_* - it must stay server/script-only.
 *
 * Safe to run more than once: documents use deterministic IDs
 * (insight-<slug>, jobPost-<slug>), so re-running overwrites rather than
 * duplicating.
 */
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { config } from "dotenv";

config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset) {
  throw new Error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET first (see .env.local).");
}
if (!token) {
  throw new Error("Set SANITY_API_WRITE_TOKEN (a write-capable token from sanity.io/manage) before running this.");
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-01-01", useCdn: false });

// --- minimal markdown -> Portable Text -------------------------------
// Covers exactly what these 6 seed files use: ## headings, **bold**,
// paragraphs, and "- " bullet lists. Not a general-purpose converter -
// content written in the Studio afterwards uses its own rich text editor
// and never touches this.
let keyCounter = 0;
const key = () => `k${keyCounter++}`;

function parseInline(text: string) {
  const spans: { _type: "span"; _key: string; text: string; marks: string[] }[] = [];
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  for (const part of parts) {
    const bold = part.startsWith("**") && part.endsWith("**");
    spans.push({ _type: "span", _key: key(), text: bold ? part.slice(2, -2) : part, marks: bold ? ["strong"] : [] });
  }
  return spans;
}

function markdownToBlocks(markdown: string) {
  const blocks: Record<string, unknown>[] = [];
  const lines = markdown.trim().split("\n");
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push({ _type: "block", _key: key(), style: "normal", markDefs: [], children: parseInline(paragraph.join(" ")) });
    paragraph = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === "") {
      flushParagraph();
      continue;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      blocks.push({ _type: "block", _key: key(), style: "h2", markDefs: [], children: parseInline(line.slice(3)) });
      continue;
    }
    if (line.startsWith("- ")) {
      flushParagraph();
      blocks.push({
        _type: "block",
        _key: key(),
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: parseInline(line.slice(2)),
      });
      continue;
    }
    paragraph.push(line);
  }
  flushParagraph();
  return blocks;
}

// --- run -----------------------------------------------------------------

type SeedDoc = { _id: string; _type: string; [key: string]: unknown };

async function migrateDir(dir: string, mapDoc: (slug: string, data: Record<string, unknown>, body: string) => SeedDoc) {
  if (!fs.existsSync(dir)) {
    console.warn(`Skipping ${dir} - not found (already deleted after the Sanity migration?).`);
    return;
  }
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  for (const filename of files) {
    const slug = filename.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
    const { data, content } = matter(raw);
    const doc = mapDoc(slug, data, content);
    await client.createOrReplace(doc);
    console.log(`  ✓ ${doc._id}`);
  }
}

async function main() {
  console.log("Migrating Insights...");
  await migrateDir(path.join(process.cwd(), "src/content/insights"), (slug, data, content) => ({
    _id: `insight-${slug}`,
    _type: "insight",
    title: data.title,
    slug: { _type: "slug", current: slug },
    category: data.category,
    excerpt: data.excerpt,
    authorSlug: data.authorSlug,
    publishedAt: new Date(data.publishedAt as string).toISOString(),
    readingTime: data.readingTime,
    body: markdownToBlocks(content),
  }));

  console.log("Migrating Careers...");
  await migrateDir(path.join(process.cwd(), "src/content/careers"), (slug, data, content) => ({
    _id: `jobPost-${slug}`,
    _type: "jobPost",
    title: data.title,
    slug: { _type: "slug", current: slug },
    department: data.department,
    location: data.location,
    type: data.type,
    postedAt: new Date(data.postedAt as string).toISOString(),
    closingDate: data.closingDate ? new Date(data.closingDate as string).toISOString() : undefined,
    summary: data.summary,
    applyEmail: data.applyEmail,
    body: markdownToBlocks(content),
  }));

  console.log("Done. Check /studio to see the migrated content.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
