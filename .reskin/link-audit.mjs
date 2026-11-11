// Collect every external href rendered on every route.
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('.reskin/tools/node_modules/'));
const { chromium } = require('playwright-core');
const base = process.argv[2] || 'http://127.0.0.1:4340';
const routes = ['/', '/board', '/crew', '/agents', '/seats', '/participate', '/stocks', '/launches', '/protocol', '/nasyai', '/desk', '/use', '/log', '/contact', '/privacy', '/start', '/brand'];

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--no-sandbox'] }).catch(() => chromium.launch({ args: ['--no-sandbox'] }));
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
const found = new Map();

for (const route of routes) {
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const hrefs = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')));
  for (const h of hrefs) {
    if (!h) continue;
    if (h.startsWith('/') || h.startsWith('#')) continue;
    const key = h;
    if (!found.has(key)) found.set(key, []);
    found.get(key).push(route);
  }
}

console.log('external or non-relative hrefs:');
for (const [href, where] of [...found.entries()].sort()) {
  console.log(`  ${href}   (${[...new Set(where)].join(', ')})`);
}
console.log('total distinct:', found.size);
await browser.close();
