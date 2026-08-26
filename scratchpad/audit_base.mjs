import { chromium } from 'playwright';
const b = await chromium.launch();
for (const f of ['CITY','CELL','HOOD','INDUSTRY']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  try { await p.goto('file:///E:/atlas/' + f + '-PREVIEW.html'); } catch { console.log('  ' + f + ' missing'); continue; }
  await p.waitForTimeout(500);
  const r = await p.evaluate(() => {
    const cards = [...document.querySelectorAll('section,article,div')].filter(e => {
      const s = getComputedStyle(e); const b = e.getBoundingClientRect();
      return s.borderTopWidth !== '0px' && b.width > 200 && b.height > 70 && s.backgroundColor !== 'rgba(0, 0, 0, 0)';
    });
    const outer = cards.filter(c => !cards.some(o => o !== c && o.contains(c)));
    const widths = outer.map(c => Math.round(c.getBoundingClientRect().width));
    const maxW = Math.max(...widths, 0);
    return { n: outer.length, full: widths.filter(w => w > maxW * 0.9).length, maxW,
             hist: [...new Set(widths)].sort((a,b)=>b-a).slice(0,6) };
  });
  console.log(`  ${f.padEnd(9)} ${String(r.n).padStart(3)} sections, widest ${r.maxW}px, ${r.full} at full width   widths: ${r.hist.join(', ')}`);
  await p.close();
}
await b.close();
