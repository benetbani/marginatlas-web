import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 375, height: 3000 }, deviceScaleFactor: 2 });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/hood-london.html');
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
const el = await p.evaluateHandle(() => [...document.querySelectorAll('div')].find(e => (e.textContent||'').includes('Loudest takings') && getComputedStyle(e).display === 'grid'));
await el.asElement().screenshot({ path: 'scratchpad/shots-glass/myth375.jpeg', type: 'jpeg', quality: 92 });
console.log('  cropped');
await b.close();
