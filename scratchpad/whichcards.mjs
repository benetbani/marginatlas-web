import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/hood-london.html');
await p.waitForTimeout(400);
const r = await p.evaluate(() => {
  const out = [];
  for (const e of document.querySelectorAll('div,section,article')) {
    const s = getComputedStyle(e); const r = e.getBoundingClientRect();
    if (r.width < 180 || r.height < 40) continue;
    if (s.borderTopWidth === '0px' || s.backgroundColor === 'rgba(0, 0, 0, 0)') continue;
    if (s.backdropFilter !== 'none') continue;
    out.push({ bg: s.backgroundColor, rad: s.borderTopLeftRadius, pad: s.paddingTop,
      cls: (e.className || '').toString().slice(0, 70),
      txt: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 46) });
  }
  return out;
});
r.forEach(x => console.log(`  r${x.rad.padEnd(5)} p${x.pad.padEnd(5)} ${x.txt}\n        ${x.cls}`));
await b.close();
