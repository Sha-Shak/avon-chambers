import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RelatedLegalServices } from "../src/components/related-legal-services";
import { InsightsCollection } from "../src/components/insights-collection";
import { getAllLawyers, getAllPracticeAreas } from "../src/lib/data";
import {
  articlePageCount,
  articlePagePath,
} from "../src/lib/article-pagination";

test("related services link only to the selected existing service and lawyer", () => {
  const area = getAllPracticeAreas().find(
    (area) => area.slug === "property-real-estate",
  )!;
  const lawyer = getAllLawyers()[0];
  const html = renderToStaticMarkup(
    createElement(RelatedLegalServices, {
      practiceAreaIds: [area.id, area.id, 99999],
      responsibleLawyerSlugs: [lawyer.slug, lawyer.slug, "unknown-lawyer"],
    }),
  );
  assert.match(html, new RegExp(`href="/practice-areas/${area.slug}"`));
  assert.match(html, new RegExp(`href="/lawyers/${lawyer.slug}"`));
  assert.match(html, /href="https:\/\/wa.me\//);
  assert.ok(html.includes(encodeURIComponent(area.title)));
  assert.equal((html.match(/href="\/practice-areas\//g) ?? []).length, 1);
  assert.equal((html.match(/href="\/lawyers\//g) ?? []).length, 1);
  assert.ok(!html.includes("unknown-lawyer"));
});

test("untagged documents do not invent service or lawyer relationships", () => {
  assert.equal(
    renderToStaticMarkup(createElement(RelatedLegalServices, {})),
    "",
  );
});

test("archive pagination exposes real destinations and server-renders later articles", () => {
  const insights = Array.from({ length: 19 }, (_, index) => ({
    slug: `article-${index + 1}`,
    title: `Article ${index + 1}`,
    category: "Corporate",
    excerpt: "Legal analysis.",
    publishedAt: new Date(Date.UTC(2026, 0, 20 - index)).toISOString(),
    readingTime: "5 min read",
  }));
  const first = renderToStaticMarkup(
    createElement(InsightsCollection, { insights }),
  );
  const second = renderToStaticMarkup(
    createElement(InsightsCollection, { insights, page: 2 }),
  );
  assert.match(first, /href="\/insights\/page\/2"/);
  assert.match(second, /href="\/insights\/article-10"/);
  assert.match(second, /href="\/insights"/);
  assert.match(second, /href="\/insights\/page\/3"/);
  assert.equal(articlePagePath(1), "/insights");
  assert.equal(articlePageCount(19), 3);
});
