import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const base = process.argv[2] ?? 'https://www.avonchambers.com';
const output = process.argv[3] ?? 'docs/audits/lighthouse-production';
const pages = [ ['home', '/'], ['practices', '/practice-areas'], ['corporate', '/practice-areas/corporate-commercial'], ['lawyer', '/lawyers/asif-bin-anwar'], ['article', '/insights/amendments-to-the-cyber-protection-act-2026'], ['news', '/news-events/high-court-stays-unfair-suspension-of-college-officer'] ];
await mkdir(output, { recursive: true });
const summary = [];
// Keep runs sequential: concurrent Chrome instances distort CPU measurements.
for (const [name, path] of pages) for (const device of ['mobile', 'desktop']) {
  const file = `${output}/${name}-${device}.json`;
  const args = ['--yes', 'lighthouse', new URL(path, base).href, '--quiet', '--output=json', `--output-path=${file}`, '--only-categories=performance,accessibility', '--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage'];
  if (device === 'desktop') args.push('--preset=desktop');
  const code = await new Promise((resolve) => { const child = spawn('npx', args, { stdio: 'inherit' }); child.on('error', () => resolve(1)); child.on('close', resolve); });
  if (code !== 0) { summary.push({ name, device, error: `Lighthouse exited ${code}` }); continue; }
  const report = JSON.parse(await readFile(file, 'utf8'));
  const metric = (id) => report.audits[id]?.numericValue;
  summary.push({ name, device, requestedUrl: report.requestedUrl, finalUrl: report.finalDisplayedUrl, fetchTime: report.fetchTime, performance: report.categories.performance.score, accessibility: report.categories.accessibility.score, LCP_ms: metric('largest-contentful-paint'), CLS: metric('cumulative-layout-shift'), TBT_ms: metric('total-blocking-time'), FCP_ms: metric('first-contentful-paint'), runtimeError: report.runtimeError, warnings: report.runWarnings });
  await writeFile(`${output}/summary.json`, JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary.at(-1)));
}
await writeFile(`${output}/summary.json`, JSON.stringify(summary, null, 2));
