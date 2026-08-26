import { chromium } from 'playwright';
import { readdirSync } from 'node:fs';
const files = readdirSync('scratchpad/universality').filter(f => f.endsWith('.html'));
const b = await chromium.launch();
const rows = [];
for (const f of files) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1200 } });
  await p.goto('file:///E:/atlas/website/scratchpad/universality/' + f);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
  const r = await p.evaluate(() => {
    const cards = [...document.querySelectorAll('div')].filter(e => getComputedStyle(e).backdropFilter !== 'none');
    const outer = cards.filter(c => !cards.some(o => o !== c && o.contains(c)));
    const wide = outer.filter(c => c.getBoundingClientRect().width > 1000 && !c.closest("[data-hero='1']")).length;
    // a card whose ink covers under 60% of its content box
    let airy = 0;
    for (const c of outer) {
      const cb = c.getBoundingClientRect(); const cs = getComputedStyle(c);
      const inner = Math.max(1, cb.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom));
      let top = cb.bottom, bot = cb.top;
      for (const e of c.querySelectorAll('*')) {
        const s = getComputedStyle(e); const bb = e.getBoundingClientRect();
        const drawn = [...e.childNodes].some(x => x.nodeType===3 && x.textContent.trim()) || e.tagName === 'svg' || s.backgroundColor !== 'rgba(0, 0, 0, 0)';
        if (drawn && bb.height > 2) { top = Math.min(top, bb.top); bot = Math.max(bot, bb.bottom); }
      }
      if (Math.max(0, bot - top) / inner < 0.6) airy++;
    }
    return { cards: outer.length, wide, airy };
  });
  rows.push([f.replace('.html',''), r]);
  await p.close();
}
await b.close();
const bad = rows.filter(([,r]) => r.wide || r.airy);
console.log(`\n  ${rows.length} pages checked, ${bad.length} with a layout finding\n`);
for (const [n, r] of rows) {
  const f = [];
  if (r.wide) f.push(`${r.wide} full-width`);
  if (r.airy) f.push(`${r.airy} under 60% ink`);
  console.log(`     ${n.padEnd(34)} ${String(r.cards).padStart(2)} cards   ${f.length ? f.join(', ') : 'ok'}`);
}
