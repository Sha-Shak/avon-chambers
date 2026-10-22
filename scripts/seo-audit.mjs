import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import { inspect, exclude } from './seo-html.mjs';
import { readdir, readFile, mkdir, writeFile, mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';

const live = process.argv.includes('--live');
const strict = process.argv.includes('--strict');
const fromHome = process.argv.includes('--from-home');
const base = 'https://www.avonchambers.com';
const directory = process.env.SEO_AUDIT_OUTPUT ?? `docs/audits/${live ? 'production' : 'build'}`;
const csv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(entries.map((entry) => entry.isDirectory() ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)]));
  return groups.flat();
}
async function fetchPage(url, userAgent = 'AvonChambersTechnicalAudit/1.0') {
  const temporary = await mkdtemp(path.join(tmpdir(), 'avon-crawl-'));
  try {
    const { stdout } = await promisify(execFile)('curl', ['--http1.1', '--compressed', '--silent', '--show-error', '--max-time', '30', '--dump-header', `${temporary}/headers`, '--output', `${temporary}/body`, '--write-out', '%{http_code}', '--user-agent', userAgent, url]);
    const raw = await readFile(`${temporary}/headers`, 'utf8');
    const last = raw.trim().split(/\r?\n\r?\n/).at(-1);
    const headers = Object.fromEntries(last.split(/\r?\n/).slice(1).flatMap((line) => { const colon = line.indexOf(':'); return colon < 0 ? [] : [[line.slice(0, colon).toLowerCase(), line.slice(colon + 1).trim()]]; }));
    return { url, status: Number(stdout), headers, body: await readFile(`${temporary}/body`, 'utf8') };
  } catch (error) { return { url, status: 0, headers: {}, body: '', error: `Incomplete HTTP fetch (curl ${error.code ?? 'error'}); indexability not verified` }; }
  finally { await rm(temporary, { recursive: true, force: true }); }
}

const sitemapText = live ? (await fetchPage(`${base}/sitemap.xml`)).body : await readFile('.next/server/app/sitemap.xml.body', 'utf8');
const sitemapUrls = new Set([...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replaceAll('&amp;', '&')));
if (!sitemapUrls.size) throw new Error('No sitemap URLs found');
const records = new Map();
let robots;
if (live) {
  const pending = new Set(fromHome ? [`${base}/`] : [`${base}/`, ...sitemapUrls]);
  while (pending.size && records.size < 200) {
    for (const url of pending) if (records.has(url)) pending.delete(url);
    const batch = [...pending].slice(0, 3);
    batch.forEach((url) => pending.delete(url));
    if (records.size % 15 === 0) console.log(`Crawled ${records.size} pages; ${pending.size + batch.length} queued`);
    for (const result of await Promise.all(batch.map((url) => fetchPage(url)))) {
      const page = inspect(result.body, result.url, result.status, result.headers);
      if (result.error) page.errors.push(result.error);
      if (result.status && result.status !== 200) page.errors.push(`HTTP ${result.status}${result.headers.location ? ` → ${result.headers.location}` : ''}`);
      records.set(page.url, page);
      if (page.status === 200) for (const link of page.links) if (!records.has(link)) pending.add(link);
    }
  }
  robots = await fetchPage(`${base}/robots.txt`);
  const variants = ['http://avonchambers.com/', 'http://www.avonchambers.com/', 'https://avonchambers.com/', `${base}/practice-areas/corporate-commercial/`, `${base}/Practice-Areas/Corporate-Commercial`, `${base}/?utm_source=seo-audit`, `${base}/this-page-does-not-exist-seo-audit`];
  const probes = [];
  for (const url of variants) { const result = await fetchPage(url); const page = inspect(result.body, url, result.status, result.headers); probes.push({ url, status: result.status, location: result.headers.location, canonical: page.canonical, robots: page.robots }); }
  const comparisons = [];
  for (const slug of ['foreign-investment-facilitation', 'corporate-restructuring-project-documentation']) {
    const url = `${base}/practice-areas/${slug}`;
    const result = await fetchPage(url, 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
    const crawler = inspect(result.body, url, result.status, result.headers);
    const normal = records.get(url);
    comparisons.push({ url, ordinaryStatus: normal?.status, googlebotUserAgentStatus: crawler.status, sameVisibleText: normal?.text.replace(/\s+/g, ' ').trim() === crawler.text.replace(/\s+/g, ' ').trim(), canonical: crawler.canonical });
  }
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/url-variants.json`, JSON.stringify(probes, null, 2));
  await writeFile(`${directory}/crawler-comparison.json`, JSON.stringify(comparisons, null, 2));
} else {
  const root = '.next/server/app';
  for (const file of (await files(root)).filter((file) => file.endsWith('.html'))) {
    let route = '/' + path.relative(root, file).replace(/\.html$/, '').split(path.sep).join('/');
    if (route === '/index') route = '/';
    if (exclude(route)) continue;
    records.set(base + route, inspect(await readFile(file, 'utf8'), base + route));
  }
}
for (const page of records.values()) {
  page.sitemap = sitemapUrls.has(page.url);
  for (const target of page.links) records.get(target)?.inlinks.add(page.url);
}
// A disconnected cluster can have inlinks and still be unreachable from Home.
// Traverse actual HTML anchors, without adding sitemap URLs to this graph.
const depths = new Map([[`${base}/`, 0]]);
for (const [url, depth] of depths) {
  for (const target of records.get(url)?.links ?? []) {
    if (!depths.has(target) && records.get(target)?.status === 200) depths.set(target, depth + 1);
  }
}
for (const page of records.values()) {
  if (page.sitemap && !page.status) page.errors.push('Sitemap URL could not be verified because its fetch failed');
  else if (page.sitemap && (page.status !== 200 || /noindex/i.test(page.robots))) page.errors.push('Sitemap contains a non-indexable URL');
  if (page.status === 200 && !/noindex/i.test(page.robots)) {
    if (!page.sitemap) page.errors.push('Indexable page missing from sitemap');
    if (page.url !== `${base}/` && page.inlinks.size === 0) page.errors.push('Orphan: no internal inlinks');
    if (!depths.has(page.url)) page.errors.push('Unreachable from homepage HTML links');
    if (/\/(?:bn\/)?practice-areas\/[^/]+$/.test(page.url) && (depths.get(page.url) ?? Infinity) > 3) page.errors.push('Service page is more than three clicks from Home');
  }
}
const missing = [...sitemapUrls].filter((url) => !records.has(url));
await mkdir(directory, { recursive: true });
const fields = ['URL', 'Status', 'Title', 'Canonical', 'Meta robots', 'H1', 'Internal inlinks', 'Clicks from Home', 'Sitemap inclusion', 'Issues'];
const rows = [...records.values()].sort((a, b) => a.url.localeCompare(b.url)).map((page) => [page.url, page.status || 'FETCH_FAILED', page.title, page.canonical, page.robots, page.h1.join(' | '), page.inlinks.size, depths.get(page.url) ?? 'unreachable', page.sitemap ? 'yes' : 'no', page.errors.join('; ')]);
await writeFile(`${directory}/inventory.csv`, [fields, ...rows].map((row) => row.map(csv).join(',')).join('\n') + '\n');
const summary = { measuredAt: new Date().toISOString(), mode: live ? `Production HTTP crawl of server-rendered HTML${fromHome ? ', seeded only from Home' : ''}; separate Lighthouse reports cover JavaScript-rendered templates` : 'Production build HTML validation', pages: records.size, sitemapUrls: sitemapUrls.size, reachableFromHome: [...records.values()].filter((page) => depths.has(page.url)).length, serviceDepths: [...records.values()].filter((page) => /\/(?:bn\/)?practice-areas\/[^/]+$/.test(page.url)).map((page) => ({ url: page.url, clicks: depths.get(page.url) ?? null })), missing, issues: [...records.values()].filter((page) => page.errors.length).map((page) => ({ url: page.url, errors: page.errors })), robots: robots ? { status: robots.status, body: robots.body } : undefined };
await writeFile(`${directory}/summary.json`, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
if (strict && (summary.issues.length || missing.length)) process.exitCode = 1;
