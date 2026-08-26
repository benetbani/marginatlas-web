import { chromium } from 'playwright';
const b = await chromium.launch();
for (const n of ['city-london','cell-london-restaurants','industry-restaurants','hood-london']) {
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/' + n + '.html');
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const seen = new Map();
    for (const e of document.querySelectorAll('*')) {
      const own = [...e.childNodes].filter(x => x.nodeType===3 && x.textContent.trim()).map(x=>x.textContent.trim()).join(' ').replace(/\s+/g,' ');
      if (own.length < 4) continue;
      const d = e.closest('details'); if (d && !d.open && !e.closest('summary')) continue;
      const y = Math.round(e.getBoundingClientRect().top + window.scrollY);
      if (!seen.has(own)) seen.set(own, []);
      seen.get(own).push(y);
    }
    return [...seen.entries()].filter(([t, ys]) => ys.length > 1 && new Set(ys).size > 1)
      .map(([t, ys]) => ({ t: t.slice(0, 44), n: new Set(ys).size, ys: [...new Set(ys)].sort((a,b)=>a-b).slice(0,4) }))
      .sort((a,b) => a.ys[0] - b.ys[0]);
  });
  console.log(`\n  ${n}   ${r.length} repeated strings`);
  r.slice(0, 8).forEach(x => console.log(`     x${x.n} at y=${x.ys.join(', ')}   "${x.t}"`));
  await p.close();
}
await b.close();
