import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 375, height: 1000 } });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/hood-london.html');
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
const r = await p.evaluate(() => [...document.querySelectorAll('button.nerow span')]
  .filter(e => String(e.className).includes('truncate'))
  .map(e => ({ t: e.textContent, clipped: e.scrollWidth > e.clientWidth + 1 })));
console.log('  truncated names: ' + r.filter(x => x.clipped).length + ' of ' + r.length);
r.forEach(x => console.log('    ' + (x.clipped ? 'CLIPPED ' : 'ok      ') + x.t));
await b.close();
