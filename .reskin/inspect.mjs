// Inspect one selector's computed colours and ancestor chain.
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('.reskin/tools/node_modules/'));
const { chromium } = require('playwright-core');

const [, , baseUrl, route, selector] = process.argv;
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--no-sandbox'] }).catch(() => chromium.launch({ args: ['--no-sandbox'] }));
const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(new URL(route, baseUrl).toString(), { waitUntil: 'networkidle' });
await page.waitForTimeout(900);
const info = await page.evaluate((sel) => {
  const el = document.querySelector(sel);
  if (!el) return { missing: true };
  const chain = [];
  let n = el;
  while (n && n !== document.body) {
    const cs = getComputedStyle(n);
    chain.push({ tag: n.tagName, cls: String(n.className).slice(0, 60), bg: cs.backgroundColor, color: cs.color, display: cs.display, hidden: n.hasAttribute && n.hasAttribute('hidden') });
    n = n.parentElement;
  }
  return { chain };
}, selector);
console.log(JSON.stringify(info, null, 1));
await b.close();
