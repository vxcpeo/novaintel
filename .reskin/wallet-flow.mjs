// Drive the wallet flow end to end and report what a user would see.
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('.reskin/tools/node_modules/'));
const { chromium } = require('playwright-core');

const base = process.argv[2] || 'http://127.0.0.1:4330';
const out = path.resolve(process.argv[3] || '.reskin/wallet-flow');

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--no-sandbox'],
}).catch(() => chromium.launch({ args: ['--no-sandbox'] }));

const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
const log = [];
const text = async () => (await page.evaluate(() => document.body.innerText)).toLowerCase();
const say = (m) => {
  log.push(m);
  console.log(m);
};

await page.goto(`${base}/desk`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
say(`desk loaded: ${page.url()}`);

// 1. connect
await page.getByRole('button', { name: /connect wallet/i }).first().click();
await page.waitForTimeout(400);
say(`picker: ${await page.locator('.sheet-card h3').innerText()} / ${await page.locator('.wallet-list button').count()} option(s)`);
await page.screenshot({ path: `${out}-01-connect.png` });
await page.locator('.wallet-list button').first().click();
await page.waitForTimeout(700);
const header = await page.locator('.masthead-tools button').first().innerText();
say(`connected, header shows: ${header}`);

// 2. register agent
await page.locator('[data-register]').click();
await page.waitForTimeout(500);
say(`tx sheet: ${await page.locator('.sheet-card h3').innerText()} | rows ${await page.locator('.wallet-rows li').count()}`);
await page.screenshot({ path: `${out}-02-confirm.png` });
await page.getByRole('button', { name: /^confirm$/i }).click();
await page.waitForTimeout(700);
say(`pending state: ${await page.locator('.sheet-card h3').innerText()}`);
await page.screenshot({ path: `${out}-03-pending.png` });
await page.waitForTimeout(1800);
const agentPanel = await page.locator('[data-agent-panel]').isVisible();
say(`agent panel visible: ${agentPanel}`);
const line = await page.locator('[data-a-line]').innerText();
const score = await page.locator('[data-a-score]').innerText();
say(`agent line ${line} · score ${score}`);

// 3. borrow
await page.locator('[data-borrow]').click();
await page.waitForTimeout(400);
await page.getByRole('button', { name: /^confirm$/i }).click();
await page.waitForTimeout(2400);
const owed = await page.locator('[data-a-owed]').innerText();
const usdg = await page.locator('[data-usdg]').innerText();
say(`after borrow: owed ${owed} · wallet USDG ${usdg}`);
await page.screenshot({ path: `${out}-04-agent.png` });

// 4. deposit on participate
await page.goto(`${base}/participate`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.fill('#l-dep', '500');
await page.locator('[data-l-deposit]').click();
await page.waitForTimeout(400);
await page.getByRole('button', { name: /^confirm$/i }).click();
await page.waitForTimeout(2400);
const pos = await page.locator('[data-l-pos]').innerText();
const total = await page.locator('[data-l-total]').innerText();
say(`after deposit: position ${pos} · pool ${total}`);
await page.screenshot({ path: `${out}-05-deposit.png` });

// 5. leak check on every route
const routes = ['/', '/board', '/crew', '/agents', '/seats', '/participate', '/stocks', '/launches', '/protocol', '/nasyai', '/desk', '/use', '/log', '/contact', '/privacy', '/start', '/brand'];
const bad = /(testnet|devnet|this preview|live backend|live site|not a real|example of|the board is empty|demo|fake)/i;
let leaks = 0;
for (const r of routes) {
  await page.goto(base + r, { waitUntil: 'networkidle' });
  await page.waitForTimeout(350);
  const body = await text();
  const hit = body.match(bad);
  if (hit) {
    leaks += 1;
    say(`LEAK ${r}: "${hit[0]}"`);
  }
}
say(`leak scan: ${leaks} route(s) with flagged wording`);

// 6. wallet persists after reload
await page.goto(`${base}/desk`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const stillConnected = await page.locator('.masthead-tools button').first().innerText();
say(`after reload header: ${stillConnected}`);

console.log('\nJSON ' + JSON.stringify({ ok: true, log }, null, 1));
await browser.close();
