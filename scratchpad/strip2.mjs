import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/city-london.html');
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
const r = await p.evaluate(() => {
  const cell = [...document.querySelectorAll('div')].find(e => (e.textContent||'').trim().startsWith('Self-employed') && e.children.length >= 2);
  if (!cell) return 'not found';
  const box = cell.parentElement;
  const s = getComputedStyle(box);
  return { container: Math.round(box.getBoundingClientRect().width),
           display: s.display, cols: s.gridTemplateColumns,
           children: box.children.length,
           childW: [...box.children].map(c => Math.round(c.getBoundingClientRect().width)) };
});
console.log(JSON.stringify(r));
await b.close();
