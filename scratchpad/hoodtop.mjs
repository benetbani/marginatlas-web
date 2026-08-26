import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 340 }, deviceScaleFactor: 2 });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/hood-london.html');
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
await p.screenshot({ path: 'scratchpad/shots-glass/hood-top.jpeg', type: 'jpeg', quality: 88 });
console.log('  shot');
await b.close();
