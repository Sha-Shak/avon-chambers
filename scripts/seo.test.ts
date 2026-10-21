import assert from "node:assert/strict";
import test from "node:test";
import { phoneE164, phoneDisplay } from "../src/lib/contact";
import { practiceSeo } from "../src/lib/page-seo";
import { getAllLawyers, getAllPracticeAreas, getPracticeAreasForLawyer } from "../src/lib/data";
import { prepareArticleBody } from "../src/lib/article-body";
import { practiceLocalizations } from "../src/data/practice-localizations";

test("Bangladesh contact variants produce one E164 number and display format", () => {
  for (const phone of ["01841010059", "8801841010059", "+8801841010059", "+880 1841-010059", "(88) 01841010059"]) {
    assert.equal(phoneE164(phone), "+8801841010059");
    assert.equal(phoneDisplay(phone), "+880 1841-010059");
  }
  assert.equal(phoneE164("+61 400 123 456"), "+61400123456");
});

test("all practice pages have distinct local SEO descriptions", () => {
  const pages = getAllPracticeAreas().map(practiceSeo);
  assert.equal(new Set(pages.map((page) => page.description)).size, pages.length);
  for (const page of pages) {
    assert.match(page.title, /Dhaka/);
    assert.match(page.description, /Dhaka/);
    assert.ok(page.description.length <= 165);
  }
});

test("profile practice labels use canonical titles without duplicate IDs", () => {
  for (const lawyer of getAllLawyers()) {
    const practices = getPracticeAreasForLawyer(lawyer);
    assert.equal(new Set(practices.map((area) => area.id)).size, practices.length);
    for (const area of practices) assert.equal(area.displayTitle, area.title);
  }
});

test("article linking preserves markup and never nests or repeats links", () => {
  const body = [{ _key: "paragraph", _type: "block", style: "normal", markDefs: [{ _key: "existing", _type: "link", href: "https://example.com" }], children: [
    { _key: "a", _type: "span", marks: ["strong"], text: "Asif Bin Anwar has an continuing responsibility. " },
    { _key: "b", _type: "span", marks: [], text: "Asif Bin Anwar works with Maeesha Dhusharima." },
    { _key: "c", _type: "span", marks: ["existing"], text: "Nazifa Sarwar" },
  ] }];
  const result = prepareArticleBody(body);
  const block = result[0];
  assert.equal(block.children.map((span) => span.text).join(""), "Asif Bin Anwar has a continuing responsibility. Asif Bin Anwar works with Maeesha Dhusharima.Nazifa Sarwar");
  assert.equal(block.markDefs?.filter((mark) => mark.href === "/lawyers/asif-bin-anwar").length, 1);
  assert.equal(block.markDefs?.filter((mark) => mark.href === "/lawyers/maeesha-dhusharima").length, 1);
  assert.equal(block.markDefs?.filter((mark) => mark.href === "/lawyers/nazifa-sarwar").length, 0);
  assert.equal(body[0].markDefs.length, 1, "source body is not mutated");
  assert.ok(block.children[0].marks?.includes("strong"));
});

test("Bangla routes map only to published English services", () => {
  for (const [slug, translation] of Object.entries(practiceLocalizations)) {
    assert.ok(getAllPracticeAreas().some((area) => area.slug === slug));
    assert.ok(translation.faqs.every((faq) => faq.q && faq.a));
  }
});

test("organization hours and person credentials use existing business data", async () => {
  process.env.NEXT_PUBLIC_SANITY_DATASET ??= "production";
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= "testproject";
  const { organizationSchema, lawyerSchema, insightSchema } = await import("../src/lib/schema");
  const firm = organizationSchema();
  assert.equal(firm.openingHoursSpecification.opens, "09:30");
  assert.equal(firm.openingHoursSpecification.closes, "18:30");
  assert.ok(!firm.openingHoursSpecification.dayOfWeek.includes("https://schema.org/Friday"));
  const lawyer = getAllLawyers()[0];
  assert.deepEqual(lawyerSchema(lawyer).hasCredential.map((credential) => credential.name), lawyer.admissions);
  const article = insightSchema({ slug: "example", title: "Example", excerpt: "Summary", category: "Corporate", publishedAt: "2026-10-21", readingTime: "1 min read", body: [] });
  assert.equal(article.author["@type"], "Organization");
  assert.equal(article.lastReviewed, undefined, "never manufacture a legal review");
});

test("every practice has a complete Bangla translation with matching sections", async () => {
  const { banglaPractice, banglaPractices, banglaGuidance } = await import("../src/lib/practice-bangla");
  const { PRACTICE_PROCESS, PRACTICE_DOCUMENTS } = await import("../src/config/practice-guidance");
  const originals = getAllPracticeAreas();
  assert.equal(banglaPractices.length, originals.length);
  assert.equal(Object.keys(practiceLocalizations).length, originals.length);
  assert.equal(new Set(banglaPractices.map((area) => area.id)).size, originals.length);
  function assertBengali(text: string) {
    assert.match(text, /[\u0980-\u09ff]/);
    assert.doesNotMatch(text, /[—–]/, "avoid dash-heavy copy");
  }
  for (const source of originals) {
    const translated = banglaPractice(source);
    assert.equal(translated.id, source.id);
    assert.equal(translated.slug, source.slug);
    assert.equal(translated.image.src, source.image.src);
    assert.equal(translated.overview.length, source.overview.length, source.slug);
    assert.equal(translated.services.length, source.services.length, source.slug);
    assert.equal(translated.faqs.length, source.faqs.length, source.slug);
    for (const value of [translated.title, translated.copy, translated.valueProp, translated.image.alt,
      ...translated.overview, ...translated.services.flatMap((service) => [service.title, service.copy]),
      ...translated.faqs.flatMap((faq) => [faq.q, faq.a])]) assertBengali(value);
    for (const document of source.documents ?? PRACTICE_DOCUMENTS[source.id] ?? []) assertBengali(banglaGuidance(document));
    for (const step of source.process ?? PRACTICE_PROCESS) {
      assertBengali(banglaGuidance(step.title));
      assertBengali(banglaGuidance(step.copy));
    }
    assert.notEqual(translated.title, source.title);
    assert.notEqual(translated.services[0].copy, source.services[0].copy);
  }
});
