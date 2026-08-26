import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1200 } });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/industry-restaurants.html');
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
await p.screenshot({ path: 'scratchpad/shots-glass/industry-1280.jpeg', type: 'jpeg', quality: 74, fullPage: true });
console.log('  shot');
await b.close();
