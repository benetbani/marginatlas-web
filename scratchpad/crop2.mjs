import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/city-london.html');
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
const el = await p.evaluateHandle(() => {
  const c = [...document.querySelectorAll('div')].filter(e => (e.textContent||'').includes('Peer cities, side by side') && getComputedStyle(e).backdropFilter !== 'none');
  return c[c.length - 1];
});
await el.asElement().scrollIntoViewIfNeeded();
await p.waitForTimeout(200);
await el.asElement().screenshot({ path: 'scratchpad/shots-glass/peers.jpeg', type: 'jpeg', quality: 90 });
console.log('  cropped');
await b.close();
