import { chromium } from 'playwright';
const b = await chromium.launch();
for (const n of ['city-london','cell-london-restaurants','industry-restaurants','hood-london']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/' + n + '.html');
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const cards = [...document.querySelectorAll('div')].filter(e => getComputedStyle(e).backdropFilter !== 'none');
    const outer = cards.filter(c => !cards.some(o => o !== c && o.contains(c)));
    return outer.map(c => {
      const r = c.getBoundingClientRect();
      // widest single horizontal run of content inside
      let minL = r.right, maxR = r.left;
      for (const e of c.querySelectorAll('*')) {
        const t = [...e.childNodes].some(x => x.nodeType === 3 && x.textContent.trim());
        const b2 = e.getBoundingClientRect();
        if ((t || e.tagName === 'SVG') && b2.width > 2) { minL = Math.min(minL, b2.left); maxR = Math.max(maxR, b2.right); }
      }
      return { w: Math.round(r.width), h: Math.round(r.height), ink: Math.round(maxR - minL),
        label: (c.textContent||'').trim().replace(/\s+/g,' ').slice(0, 40) };
    });
  });
  const full = r.filter(x => x.w > 1000);
  console.log(`\n  ${n}   ${r.length} sections, ${full.length} wider than 1000px`);
  for (const x of r) console.log(`     ${String(x.w).padStart(5)}px wide  ${String(x.h).padStart(4)}px tall   "${x.label}"`);
  await p.close();
}
await b.close();
