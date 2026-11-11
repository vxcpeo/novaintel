// Quick visual capture: node .reskin/shot.mjs <baseUrl> <route> <out.png> [width] [height] [full]
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('.reskin/tools/node_modules/'));
const { chromium } = require('playwright-core');

const [, , baseUrl, route, outFile, w = '1440', h = '900', full = ''] = process.argv;

const launch = async () => {
  const candidates = [
    process.env.RESKIN_CHROME,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ].filter(Boolean);
  for (const executablePath of candidates) {
    try {
      return await chromium.launch({ executablePath, args: ['--no-sandbox', '--hide-scrollbars'] });
    } catch (err) {
      if (process.env.DEBUG) console.error(executablePath, String(err).slice(0, 200));
    }
  }
  return chromium.launch({ args: ['--no-sandbox', '--hide-scrollbars'] });
};

const browser = await launch();
try {
  const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
  const url = new URL(route, baseUrl).toString();
  const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch((e) => ({ status: () => `ERR ${e.message}` }));
  await page.waitForTimeout(700);
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const step = Math.max(300, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await sleep(40);
    }
    window.scrollTo(0, 0);
    await sleep(120);
  });
  await page.screenshot({ path: path.resolve(outFile), fullPage: full === 'full' });
  const meta = await page.evaluate(() => ({
    title: document.title,
    h1: [...document.querySelectorAll('h1')].map((n) => n.innerText.slice(0, 80)),
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    height: document.documentElement.scrollHeight,
    classes: [...new Set([...document.querySelectorAll('[class]')].flatMap((el) => [...el.classList]))].length,
  }));
  console.log(JSON.stringify({ status: typeof res.status === 'function' ? res.status() : res, url, out: path.resolve(outFile), ...meta }, null, 2));
} finally {
  await browser.close();
}
