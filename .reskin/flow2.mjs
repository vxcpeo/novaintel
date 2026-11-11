// Exercise the remaining money flows: stake, claim, holder sign-in, X link, lane request.
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('.reskin/tools/node_modules/'));
const { chromium } = require('playwright-core');
const base = process.argv[2] || 'http://127.0.0.1:4330';

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--no-sandbox'] }).catch(() => chromium.launch({ args: ['--no-sandbox'] }));
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
const log = [];
const say = (m) => { log.push(m); console.log(m); };
const confirm = async () => {
  await page.locator('.sheet-card .act--solid').click();
  await page.waitForTimeout(2400);
};

await page.goto(`${base}/participate`, { waitUntil: 'networkidle' });
await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.locator('[data-l-deposit]').click();
await page.waitForTimeout(300);
await page.locator('.wallet-list button').first().click();
await page.waitForTimeout(700);
say(`connected: ${await page.locator('.masthead-tools button').first().innerText()}`);

// deposit then withdraw
await page.fill('#l-dep', '750');
await page.locator('[data-l-deposit]').click();
await page.waitForTimeout(350);
await confirm();
say(`position after deposit: ${await page.locator('[data-l-pos]').innerText()}`);
await page.locator('[data-l-max]').click();
await page.waitForTimeout(250);
say(`max fills: ${await page.locator('#l-wd').inputValue()}`);
await page.locator('[data-l-withdraw]').click();
await page.waitForTimeout(350);
await confirm();
say(`position after withdraw: ${await page.locator('[data-l-pos]').innerText()}`);

// stake
await page.locator('#s-amt').fill('250');
await page.locator('[data-s-stake-btn]').click();
await page.waitForTimeout(350);
await confirm();
say(`stake: ${await page.locator('[data-s-stake]').innerText()} · free ${await page.locator('[data-s-free]').innerText()}`);
await page.locator('[data-s-claim]').click();
await page.waitForTimeout(350);
await confirm();
say(`claimed, usdg now ${await page.locator('[data-s-free]').innerText()}`);

// holder sign-in + X link
await page.goto(`${base}/nasyai`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
await page.locator('[data-h-signin]').click();
await page.waitForTimeout(500);
const sigTitle = await page.locator('.sheet-card h3').innerText();
await page.locator('.sheet-card .act--solid').click();
await page.waitForTimeout(1200);
say(`sign-in sheet: ${sigTitle} · tier now ${await page.locator('[data-h-tier]').innerText()}`);
await page.locator('[data-h-link]').waitFor({ state: 'visible' }).catch(() => {});
const linkVisible = await page.locator('[data-h-link]').isVisible().catch(() => false);
say(`link panel visible: ${linkVisible}`);
if (linkVisible) {
  await page.locator('#xh').fill('nasyai_demo');
  await page.locator('[data-h-code]').click();
  await page.waitForTimeout(400);
  await page.locator('.sheet-card .act--solid').click();
  await page.waitForTimeout(1200);
  say(`x linked: ${await page.locator('[data-h-x]').innerText()}`);
  await page.screenshot({ path: '.reskin/wallet-06-holder.png' });
}

// seats lane
await page.goto(`${base}/seats`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const hasForm = await page.locator('[data-soon-form]').count();
say(`seats form present: ${hasForm > 0}`);
console.log('\n' + JSON.stringify({ ok: true, log }, null, 1));
await browser.close();
