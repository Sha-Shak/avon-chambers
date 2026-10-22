import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { inspect } from './seo-html.mjs';

const origin = 'https://www.avonchambers.com';
const paths = ['/practice-areas/intellectual-property-law', '/practice-areas/corporate-commercial', '/practice-areas', '/insights', '/about', '/case-studies', '/news-events/high-court-rejects-habeas-corpus-shortcut-in-child-custody-dispute-family-court-appeal-cannot-be', '/news-events/high-court-stays-unfair-suspension-of-college-officer', '/careers', '/pro-bono', '/studio'];
const temporary = await mkdtemp(path.join(tmpdir(), 'avon-indexing-'));
const records = [];
for (let start = 0; start < paths.length; start += 3) {
  const batch = await Promise.all(paths.slice(start, start + 3).map(async (pathname, i) => {
    const key = start + i;
    const url = origin + pathname;
    let status = 0;
    let error;
    try {
      const { stdout } = await promisify(execFile)('curl', ['--http1.1', '--compressed', '--silent', '--show-error', '--max-time', '45', '--dump-header', `${temporary}/${key}.headers`, '--output', `${temporary}/${key}.html`, '--write-out', '%{http_code}', url]);
      status = Number(stdout);
    } catch { error = 'HTTP download incomplete; not an indexing verdict'; }
    const headers = await readFile(`${temporary}/${key}.headers`, 'utf8').catch(() => '');
    const last = headers.trim().split(/\r?\n\r?\n/).at(-1);
    const fields = Object.fromEntries(last.split(/\r?\n/).slice(1).flatMap((line) => { const colon = line.indexOf(':'); return colon < 0 ? [] : [[line.slice(0, colon).toLowerCase(), line.slice(colon + 1).trim()]]; }));
    const html = await readFile(`${temporary}/${key}.html`, 'utf8').catch(() => '');
    const page = inspect(html, url, status);
    const htmlResponse = fields['content-type']?.includes('text/html');
    const robots = htmlResponse ? page.robots : null;
    const blocked = /noindex|none/i.test(`${robots ?? ''} ${fields['x-robots-tag'] ?? ''}`);
    return { checkedAt: new Date().toISOString(), url, status, error, location: fields.location ?? null, contentType: fields['content-type'], metaRobots: robots, xRobotsTag: fields['x-robots-tag'] ?? null, canonical: page.canonical || null, h1: page.h1, internalLinks: [...page.links], publicIndexingPermission: !status ? 'unverified' : status >= 300 && status < 400 ? 'redirect; inspect destination' : status !== 200 ? 'non-200' : blocked ? 'noindex' : 'allowed', googleLiveInspection: 'recorded separately from Search Console UI', intellectualPropertyCopyPresent: pathname === '/practice-areas/corporate-commercial' ? /Intellectual Property Protection & Registration/.test(page.text) && /Intellectual Property Licensing & Enforcement/.test(page.text) : undefined };
  }));
  records.push(...batch);
}
const output = 'docs/audits/live-inspection';
await mkdir(output, { recursive: true });
await writeFile(`${output}/http-results.json`, JSON.stringify(records, null, 2));
const csv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const rows = [['URL', 'Status', 'Location', 'Initial HTML robots', 'HTTP X-Robots-Tag', 'Canonical', 'Public indexing permission', 'H1', 'Internal links', 'Fetch issue'], ...records.map((row) => [row.url, row.status || 'FETCH_FAILED', row.location, row.metaRobots, row.xRobotsTag, row.canonical, row.publicIndexingPermission, row.h1.join(' | '), row.internalLinks.length, row.error])];
await writeFile(`${output}/http-results.csv`, rows.map((row) => row.map(csv).join(',')).join('\n') + '\n');
console.log(JSON.stringify(records.map(({ url, status, metaRobots, xRobotsTag, canonical, publicIndexingPermission, error }) => ({ url, status, metaRobots, xRobotsTag, canonical, publicIndexingPermission, error })), null, 2));
console.log(`Raw response evidence: ${temporary}`);
