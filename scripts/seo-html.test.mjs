import assert from 'node:assert/strict';
import test from 'node:test';
import { inspect } from './seo-html.mjs';

const document = (content, extra = '') => `<html><head><title>Example</title><link rel="canonical" href="https://www.avonchambers.com/example">${extra}</head><body><main><h1>Example</h1>${content}</main></body></html>`;
test('deployment gate detects unfinished visible copy and metadata', () => {
  for (const content of ['TODO: approve this', 'PLACEHOLDER', 'Lorem ipsum', 'For client review', '<img alt="Placeholder image">']) {
    assert.ok(inspect(document(content), 'https://www.avonchambers.com/example').errors.some((error) => error.includes('Unfinished')));
  }
  const page = inspect(document('Approved text', '<meta name="description" content="For client review">'), 'https://www.avonchambers.com/example');
  assert.ok(page.errors.some((error) => error.includes('Unfinished')));
});
test('deployment gate ignores source comments, scripts, CSS and input placeholder attributes', () => {
  const page = inspect(document('Approved text<!-- TODO --><script>const TODO = "PLACEHOLDER";</script><style>.placeholder{display:none}</style><input placeholder="Your name">'), 'https://www.avonchambers.com/example');
  assert.deepEqual(page.errors, []);
});
test('root URL canonical forms are equivalent, but other canonical conflicts fail', () => {
  const home = '<title>Home</title><link rel="canonical" href="https://www.avonchambers.com"><h1>Home</h1>';
  assert.deepEqual(inspect(home, 'https://www.avonchambers.com/').errors, []);
  assert.ok(inspect(document('Approved text'), 'https://www.avonchambers.com/other').errors.some((error) => error.includes('Canonical mismatch')));
});
test('crawler records crawlable anchors, noindex headers and malformed structured data', () => {
  const page = inspect(document('<a href="/lawyers/asif-bin-anwar">Asif Bin Anwar</a><script type="application/ld+json">{bad}</script>'), 'https://www.avonchambers.com/example', 200, { 'x-robots-tag': 'noindex, nofollow' });
  assert.ok(page.links.has('https://www.avonchambers.com/lawyers/asif-bin-anwar'));
  assert.match(page.robots, /noindex/);
  assert.ok(page.errors.includes('Invalid JSON-LD'));
});

test('deployment gate rejects duplicate canonical tags even if their URLs agree', () => {
  const page = inspect(document('Approved text', '<link rel="canonical" href="https://www.avonchambers.com/example">'), 'https://www.avonchambers.com/example');
  assert.ok(page.errors.some((error) => error.includes('Expected one canonical')));
});
