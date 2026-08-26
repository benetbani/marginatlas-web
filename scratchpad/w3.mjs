import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [375, 768, 1024, 1280]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/cell-london-restaurants.html');
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  const r = await p.evaluate(() => {
    const el = [...document.querySelectorAll('span')].find(e => (e.textContent||'').startsWith('A lease step-up'));
    if (!el) return null;
    const s = getComputedStyle(el), bb = el.getBoundingClientRect();
    const cv = document.createElement('canvas').getContext('2d');
    cv.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
    return { cpl: Math.round(bb.width / (cv.measureText('abcdefghijklmnopqrstuvwxyz ').width/27)), px: Math.round(bb.width) };
  });
  console.log(`   ${String(w).padStart(4)}px viewport   note ${String(r?.px).padStart(4)}px   ${String(r?.cpl).padStart(3)} characters per line`);
  await p.close();
}
await b.close();
