// Probe computed colors for elements containing a given text.
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('.reskin/tools/node_modules/'));
const { chromium } = require('playwright-core');

const [, , baseUrl, route, text] = process.argv;

const launch = async () => {
  try {
    return await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--no-sandbox'] });
  } catch {
    return chromium.launch({ args: ['--no-sandbox'] });
  }
};

const b = await launch();
const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(new URL(route, baseUrl).toString(), { waitUntil: 'networkidle' });
await page.waitForTimeout(900);
const rows = await page.evaluate((needle) => {
  const out = [];
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walk.nextNode())) {
    if (!n.nodeValue.includes(needle)) continue;
    const el = n.parentElement;
    const cs = getComputedStyle(el);
    let bgEl = el;
    let bg = cs.backgroundColor;
    while (bgEl && (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent')) {
      bgEl = bgEl.parentElement;
      if (!bgEl) break;
      bg = getComputedStyle(bgEl).backgroundColor;
    }
    out.push({ tag: el.tagName, cls: String(el.className), color: cs.color, bgElCls: bgEl ? String(bgEl.className) : '', bg, size: cs.fontSize, weight: cs.fontWeight });
  }
  return out;
}, text);
console.log(JSON.stringify(rows, null, 1));
await b.close();
