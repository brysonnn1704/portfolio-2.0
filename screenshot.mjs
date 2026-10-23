import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));

const url = process.argv[2] || 'http://localhost:5173/';
try {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 8000 });
} catch {
  await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded', timeout: 8000 });
}
await page.waitForTimeout(3000);
await page.screenshot({ path: 'preview.png', fullPage: false });
console.log('screenshot saved to preview.png');
await browser.close();
