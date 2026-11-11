// Check the converted controls: Buy $NASYAI copies, Chart and buy copies, no navigation.
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('.reskin/tools/node_modules/'));
const { chromium } = require('playwright-core');
const base = process.argv[2] || 'http://127.0.0.1:4340';

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--no-sandbox'] }).catch(() => chromium.launch({ args: ['--no-sandbox'] }));
const context = await browser.newContext({ viewport: { width: 1440, height: 950 }, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
const log = [];

const clip = () => page.evaluate(() => navigator.clipboard.readText().catch(() => ''));

await page.goto(`${base}/nasyai`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const buy = page.getByRole('button', { name: /buy \$nasyai/i }).first();
const before = page.url();
await buy.click();
await page.waitForTimeout(400);
log.push(`buy button: url changed=${page.url() !== before}, clipboard=${(await clip()).slice(0, 18)}…`);

await page.goto(`${base}/launches`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const chart = page.getByRole('button', { name: /chart and buy/i }).first();
const before2 = page.url();
await chart.click();
await page.waitForTimeout(400);
log.push(`chart button: url changed=${page.url() !== before2}, clipboard=${(await clip()).slice(0, 18)}…`);

// protocol address cell + stocks address cell are plain text now
await page.goto(`${base}/protocol`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const addrLinks = await page.evaluate(() => document.querySelectorAll('a[href^="http"]').length);
log.push(`protocol external anchors: ${addrLinks}`);
const addrText = await page.evaluate(() => {
  const td = [...document.querySelectorAll('td.type-mon')].find((n) => /^0x[0-9a-fA-F]{40}$/.test(n.textContent.trim()));
  return td ? td.textContent.trim().slice(0, 12) : 'none';
});
log.push(`protocol address rendered as text: ${addrText}…`);

console.log(JSON.stringify({ ok: true, log }, null, 1));
await browser.close();
