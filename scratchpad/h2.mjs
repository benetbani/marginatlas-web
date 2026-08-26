import { chromium } from 'playwright';
import { readdirSync } from 'node:fs';
const files = readdirSync('scratchpad/universality').filter(f => f.endsWith('.html'));
const b = await chromium.launch();
const hits = [];
for (const f of files) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1200 } });
  await p.goto('file:///E:/atlas/website/scratchpad/universality/' + f);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
  const r = await p.evaluate(() => {
    const out = [];
    const cards = [...document.querySelectorAll('div')].filter(e => getComputedStyle(e).backdropFilter !== 'none');
    const outer = cards.filter(c => !cards.some(o => o !== c && o.contains(c)));
    for (const c of outer) {
      // the section's display figures: text at >=24px that is a number
      const figs = [];
      for (const e of c.querySelectorAll('*')) {
        const own = [...e.childNodes].filter(x=>x.nodeType===3&&x.textContent.trim()).map(x=>x.textContent.trim()).join(' ');
        if (!own || own.length > 12) continue;
        if (parseFloat(getComputedStyle(e).fontSize) < 24) continue;
        const m = own.match(/[\d][\d,.]*/); if (m) figs.push(m[0]);
      }
      if (!figs.length) continue;
      out.push(`__figs ${figs.join(',')}`);
      for (const e of c.querySelectorAll('*')) {
        const d = e.closest('details'); if (d && !d.open && !e.closest('summary')) continue;
        const own = [...e.childNodes].filter(x=>x.nodeType===3&&x.textContent.trim()).map(x=>x.textContent.trim()).join(' ');
        if (own.length < 25 || !/\s/.test(own)) continue;
        for (const g of figs) if (own.includes(g)) out.push(`figure ${g} restated in "${own.slice(0,64)}"`);
      }
    }
    return [...new Set(out)];
  });
  for (const h of r) hits.push(`${f.replace('.html','')}: ${h}`);
  await p.close();
}
await b.close();
console.log(`\n  ${hits.length} sentence(s) restating a figure in the same card\n`);
[...new Set(hits)].slice(0,12).forEach(h => console.log('     ' + h));
