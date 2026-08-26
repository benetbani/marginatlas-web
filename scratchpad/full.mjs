import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1200 } });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/city-london.html');
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
await p.screenshot({ path: 'scratchpad/shots-glass/city-final.jpeg', type: 'jpeg', quality: 72, fullPage: true });
console.log('  shot');
await b.close();
