import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto('http://127.0.0.1:5174/', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForTimeout(3500);
await page.screenshot({ path: 'preview.png', fullPage: false });
console.log('screenshot saved');
await browser.close();
