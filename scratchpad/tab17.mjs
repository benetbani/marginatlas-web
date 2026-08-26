import { chromium } from 'playwright';
import { readdirSync } from 'node:fs';
const files = readdirSync('scratchpad/universality').filter(f => f.endsWith('.html'));
const b = await chromium.launch();
let bad = 0;
for (const f of files) {
  const p = await b.newPage({ viewport: { width: 768, height: 1200 } });
  await p.goto('file:///E:/atlas/website/scratchpad/universality/' + f);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
  const r = await p.evaluate(() => {
    const cards = [...document.querySelectorAll('div')].filter(e => getComputedStyle(e).backdropFilter !== 'none');
    const outer = cards.filter(c => !cards.some(o => o !== c && o.contains(c)));
    return {
      over: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      cramped: outer.filter(c => c.getBoundingClientRect().width < 260).length,
    };
  });
  if (r.over || r.cramped) { bad++; console.log(`  ${f.replace('.html','').padEnd(34)} h-scroll=${r.over} cramped=${r.cramped}`); }
  await p.close();
}
await b.close();
console.log(`\n  ${files.length} pages at 768px, ${bad} with a finding\n`);
