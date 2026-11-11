// Mobile check of the wallet sheet.
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('.reskin/tools/node_modules/'));
const { chromium } = require('playwright-core');
const base = process.argv[2] || 'http://127.0.0.1:4330';

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--no-sandbox'] }).catch(() => chromium.launch({ args: ['--no-sandbox'] }));
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await page.goto(`${base}/participate`, { waitUntil: 'networkidle' });
await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.locator('[data-l-deposit]').click();
await page.waitForTimeout(400);
await page.screenshot({ path: '.reskin/wallet-07-mobile-connect.png' });
const overflow = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
await page.locator('.wallet-list button').first().click();
await page.waitForTimeout(700);
await page.fill('#l-dep', '500');
await page.locator('[data-l-deposit]').click();
await page.waitForTimeout(400);
await page.screenshot({ path: '.reskin/wallet-08-mobile-confirm.png' });
await page.locator('.sheet-card .act--solid').click();
await page.waitForTimeout(900);
await page.screenshot({ path: '.reskin/wallet-09-mobile-pending.png' });
await page.waitForTimeout(1600);
console.log(JSON.stringify({ ok: true, overflow, position: await page.locator('[data-l-pos]').innerText() }));
await browser.close();
