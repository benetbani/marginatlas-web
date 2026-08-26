import { chromium } from 'playwright';
const b = await chromium.launch();
for (const W of [1440, 1280, 768, 375])
for (const n of ['city-london','cell-london-restaurants','industry-restaurants','hood-london']) {
  const p = await b.newPage({ viewport: { width: W, height: 1000 } });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/' + n + '.html');
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    // text runs that overlap another text run (not ancestor/descendant)
    const runs = [];
    for (const e of document.querySelectorAll('*')) {
      const own = [...e.childNodes].filter(x => x.nodeType === 3 && x.textContent.trim()).map(x => x.textContent.trim()).join(' ');
      if (!own) continue;
      const b = e.getBoundingClientRect();
      if (b.width < 4 || b.height < 4) continue;
      /* Chrome reports a laid-out rect for content inside a CLOSED <details> that it
         never paints. Fourteen 'overlaps' were that, and none was on the page. */
      const d = e.closest('details'); if (d && !d.open && !e.closest('summary')) continue;
      if (getComputedStyle(e).visibility === 'hidden' || getComputedStyle(e).opacity === '0') continue;
      runs.push({ e, b, t: own.slice(0, 26) });
    }
    const over = [];
    for (let i = 0; i < runs.length; i++) for (let j = i + 1; j < runs.length; j++) {
      const A = runs[i], B = runs[j];
      if (A.e.contains(B.e) || B.e.contains(A.e)) continue;
      const ox = Math.min(A.b.right, B.b.right) - Math.max(A.b.left, B.b.left);
      const oy = Math.min(A.b.bottom, B.b.bottom) - Math.max(A.b.top, B.b.top);
      if (ox > 3 && oy > 3) over.push(`"${A.t}" X "${B.t}"  (${Math.round(ox)}x${Math.round(oy)}px)`);
    }
    // sections whose ink fills less than half their height
    const cards = [...document.querySelectorAll('div')].filter(e => getComputedStyle(e).backdropFilter !== 'none');
    const outer = cards.filter(c => !cards.some(o => o !== c && o.contains(c)));
    const airy = [];
    for (const c of outer) {
      const cb = c.getBoundingClientRect(); let top = cb.bottom, bot = cb.top;
      for (const e of c.querySelectorAll('*')) {
        const has = [...e.childNodes].some(x => x.nodeType === 3 && x.textContent.trim()) || e.tagName === 'svg' || getComputedStyle(e).backgroundColor !== 'rgba(0, 0, 0, 0)';
        const b2 = e.getBoundingClientRect();
        if (has && b2.height > 2) { top = Math.min(top, b2.top); bot = Math.max(bot, b2.bottom); }
      }
      const ink = Math.max(0, bot - top), gap = Math.round(cb.height - ink);
      if (gap > 90) airy.push(`${Math.round(cb.height)}px tall, ${gap}px empty  "${(c.textContent||'').trim().replace(/\s+/g,' ').slice(0,34)}"`);
    }
    return { over: [...new Set(over)], airy };
  });
  console.log(`\n  ${n}`);
  if (r.over.length || r.airy.length) console.log(`    OVERLAPS ${r.over.length}`); r.over.slice(0,6).forEach(x => console.log('       ' + x));
  console.log(`    AIRY SECTIONS ${r.airy.length}`); r.airy.forEach(x => console.log('       ' + x));
  await p.close();
}
await b.close();
