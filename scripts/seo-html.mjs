import { parse } from 'parse5';
const base = 'https://www.avonchambers.com';
const unfinished = /\b(?:PLACEHOLDER|TODO)\b|lorem\s+ipsum|for client review|\[insert (?:text|copy|title)\]/i;
export const exclude = (pathname) => /^\/(?:_|api(?:\/|$)|studio(?:\/|$))/.test(pathname) || /\.[^/]+$/.test(pathname);

export function inspect(html, url, status = 200, headers = {}) {
  const document = parse(html);
  const record = { url, status, title: '', canonical: '', canonicalCount: 0, robots: headers['x-robots-tag'] ?? '', h1: [], inlinks: new Set(), links: new Set(), sitemap: false, jsonLd: [], errors: [], text: '' };
  function text(node) { return node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join(' '); }
  function walk(node) {
    const attrs = Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
    if (attrs.alt) record.text += ` ${attrs.alt}`;
    if (attrs['aria-label']) record.text += ` ${attrs['aria-label']}`;
    if (node.tagName === 'title') record.title = text(node).trim();
    if (node.tagName === 'h1') record.h1.push(text(node).replace(/\s+/g, ' ').trim());
    if (node.tagName === 'link' && attrs.rel === 'canonical') { record.canonical = attrs.href; record.canonicalCount += 1; }
    if (node.tagName === 'meta' && attrs.name === 'robots') record.robots += ` ${attrs.content}`;
    if (node.tagName === 'meta' && ['description', 'og:title', 'og:description'].includes(attrs.name ?? attrs.property)) record.text += ` ${attrs.content}`;
    if (node.tagName === 'a' && attrs.href) {
      try {
        const target = new URL(attrs.href, url);
        if (target.origin === new URL(base).origin && !exclude(target.pathname)) record.links.add(target.origin + target.pathname);
      } catch { /* A malformed public link is reported below. */ record.errors.push(`Invalid link: ${attrs.href}`); }
    }
    if (node.tagName === 'script' && attrs.type === 'application/ld+json') {
      try { record.jsonLd.push(JSON.parse(text(node))); } catch { record.errors.push('Invalid JSON-LD'); }
    }
    if (['script', 'style', 'template', 'svg'].includes(node.tagName)) return;
    if (node.nodeName === '#text') record.text += ` ${node.value}`;
    for (const child of node.childNodes ?? []) walk(child);
  }
  walk(document);
  record.robots = record.robots.trim() || 'index, follow (default)';
  if (unfinished.test(record.text)) record.errors.push(`Unfinished public copy: ${record.text.match(unfinished)?.[0]}`);
  if (status === 200 && !/noindex/i.test(record.robots)) {
    if (!record.title) record.errors.push('Missing title');
    if (record.canonicalCount !== 1) record.errors.push(`Expected one canonical, got ${record.canonicalCount}`);
    if (record.h1.length !== 1) record.errors.push(`Expected one H1, got ${record.h1.length}`);
    let selfCanonical = false;
    try { selfCanonical = new URL(record.canonical).href === new URL(url).href; } catch { /* Missing or malformed. */ }
    if (!selfCanonical) record.errors.push(`Canonical mismatch: ${record.canonical}`);
  }
  return record;
}

