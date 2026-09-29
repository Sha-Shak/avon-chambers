import { readFileSync } from "node:fs";

const areas = JSON.parse(readFileSync(new URL("../src/data/practice-areas.json", import.meta.url), "utf8"));
const lawyers = JSON.parse(readFileSync(new URL("../src/data/lawyers.json", import.meta.url), "utf8"));
const errors = [];
const ids = new Set();
const slugs = new Set();

for (const area of areas) {
  if (!Number.isSafeInteger(area.id) || area.id < 1 || ids.has(area.id)) {
    errors.push(`Invalid or duplicate practice ID: ${area.id}`);
  }
  if (!area.slug || slugs.has(area.slug)) errors.push(`Missing or duplicate practice slug: ${area.slug}`);
  ids.add(area.id);
  slugs.add(area.slug);
}

for (const lawyer of lawyers) {
  if (!Array.isArray(lawyer.practiceAreaIds) || lawyer.areas.length !== lawyer.practiceAreaIds.length) {
    errors.push(`${lawyer.slug}: areas and practiceAreaIds must have the same number of entries`);
    continue;
  }
  lawyer.practiceAreaIds.forEach((id, index) => {
    if (!ids.has(id)) errors.push(`${lawyer.slug}: unknown practice ID ${id} at index ${index}`);
  });
}

if (errors.length) {
  errors.forEach((error) => console.error(error));
  process.exitCode = 1;
} else {
  console.log(`Validated ${areas.length} practice areas and ${lawyers.length} lawyer records.`);
}
