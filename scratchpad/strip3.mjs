import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/city-london.html');
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
const r = await p.evaluate(() => {
  const cell = [...document.querySelectorAll('div')].find(e => (e.textContent||'').trim().startsWith('Self-employed') && e.children.length >= 2);
  const box = cell.parentElement;
  const out = [];
  let e = box;
  for (let i = 0; i < 4 && e; i++, e = e.parentElement) {
    const s = getComputedStyle(e);
    out.push({ cls: String(e.className).slice(0, 96), w: Math.round(e.getBoundingClientRect().width), display: s.display, cols: s.gridTemplateColumns.slice(0,40) });
  }
  return out;
});
r.forEach(x => console.log('  w=' + String(x.w).padStart(5) + '  ' + x.display.padEnd(6) + '  cols=' + x.cols.padEnd(22) + '  ' + x.cls));
await b.close();
