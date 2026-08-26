import { chromium } from 'playwright';
const b = await chromium.launch();
const TERRA = ["rgb(251, 132, 105)", "rgb(194, 65, 12)"];
for (const n of ['city-london','hood-london']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/' + n + '.html');
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  const r = await p.evaluate((T) => {
    const out = [];
    for (const e of document.querySelectorAll('*')) {
      const d = e.closest('details'); if (d && !d.open && !e.closest('summary')) continue;
      if (e.closest('td, th')) continue;
      const b = e.getBoundingClientRect(); if (b.width < 1 || b.height < 1) continue;
      const s = getComputedStyle(e);
      const own = [...e.childNodes].some(x => x.nodeType===3 && x.textContent.trim());
      const txt = (e.textContent||'').trim().replace(/\s+/g,' ').slice(0,26);
      if (own && T.includes(s.color)) out.push(`text  "${txt}"`);
      else if (T.includes(s.backgroundColor)) out.push(`fill  ${e.tagName} ${Math.round(b.width)}x${Math.round(b.height)}  "${txt}"`);
    }
    return out;
  }, TERRA);
  console.log(`\n  ${n}   ${r.length} accent marks`);
  r.forEach(x => console.log('     ' + x));
  await p.close();
}
await b.close();
