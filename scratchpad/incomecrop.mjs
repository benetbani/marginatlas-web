import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 3000 }, deviceScaleFactor: 2 });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/city-london.html');
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
const el = await p.evaluateHandle(() => {
  const c = [...document.querySelectorAll('div')].filter(e => (e.textContent||'').includes('What customers earn here') && getComputedStyle(e).backdropFilter !== 'none');
  return c[c.length - 1];
});
await el.asElement().screenshot({ path: 'scratchpad/shots-glass/income.jpeg', type: 'jpeg', quality: 92 });
console.log('  cropped');
await b.close();
