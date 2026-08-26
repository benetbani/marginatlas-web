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
      // words in SENTENCES (a run with a space and 30+ chars), vs any drawn graphic
      let sentenceChars = 0;
      for (const e of c.querySelectorAll('*')) {
        const d = e.closest('details'); if (d && !d.open && !e.closest('summary')) continue;
        const own = [...e.childNodes].filter(x => x.nodeType===3 && x.textContent.trim()).map(x=>x.textContent.trim()).join(' ');
        if (own.length >= 30 && /\s/.test(own)) sentenceChars += own.length;
      }
      const gfx = c.querySelectorAll('svg, canvas, table').length
        + [...c.querySelectorAll('div')].filter(e => { const s = getComputedStyle(e); const b = e.getBoundingClientRect();
            return s.backgroundColor !== 'rgba(0, 0, 0, 0)' && b.height < 24 && b.width > 24; }).length;
      return { sentenceChars, gfx, label: (c.textContent||'').trim().replace(/\s+/g,' ').slice(0, 36) };
    }).filter(x => x.sentenceChars > 140 && x.gfx < 3);
  });
  console.log(`\n  ${n}   ${r.length} section(s) that are mostly sentences with little drawn`);
  r.forEach(x => console.log(`     ${String(x.sentenceChars).padStart(4)} chars of prose, ${x.gfx} drawn marks   "${x.label}"`));
  await p.close();
}
await b.close();
