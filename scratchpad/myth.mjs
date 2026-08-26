import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 3000 }, deviceScaleFactor: 2 });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/hood-london.html');
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
const box = await p.evaluate(() => {
  const c = [...document.querySelectorAll('div')].find(e => (e.textContent||'').includes('Revenue rank vs rent rank') && getComputedStyle(e).backdropFilter !== 'none');
  const r = c.getBoundingClientRect();
  return { x: Math.max(0, r.left - 8), y: r.top - 40, width: Math.min(1270, r.width + 16), height: r.height + 50 };
});
await p.screenshot({ path: 'scratchpad/shots-glass/myth.jpeg', type: 'jpeg', quality: 92, clip: box });
console.log('  cropped', JSON.stringify(box));
await b.close();
