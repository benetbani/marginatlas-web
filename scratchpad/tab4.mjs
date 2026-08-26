import { chromium } from 'playwright';
const b = await chromium.launch();
for (const n of ['city-london','cell-london-restaurants','industry-restaurants','hood-london']) {
  const p = await b.newPage({ viewport: { width: 768, height: 1200 } });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/' + n + '.html');
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  const r = await p.evaluate(() => {
    const over = document.documentElement.scrollWidth > document.documentElement.clientWidth;
    const cards = [...document.querySelectorAll('div')].filter(e => getComputedStyle(e).backdropFilter !== 'none');
    const outer = cards.filter(c => !cards.some(o => o !== c && o.contains(c)));
    // cards narrower than 260px are cramped at this width
    const cramped = outer.filter(c => c.getBoundingClientRect().width < 260).map(c => Math.round(c.getBoundingClientRect().width) + 'px "' + (c.textContent||'').trim().replace(/\s+/g,' ').slice(0,28) + '"');
    // any element wider than the viewport
    const spill = [...document.querySelectorAll('*')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 780 && r.left < 0 === false && r.right > 776; }).length;
    return { h: document.documentElement.scrollHeight, over, cards: outer.length, cramped, spill };
  });
  await p.screenshot({ path: `scratchpad/shots-glass/T768-${n}.jpeg`, type: 'jpeg', quality: 70, fullPage: true });
  console.log(`  ${n.padEnd(26)} ${String(r.h).padStart(5)}px  ${r.cards} cards  h-scroll=${r.over}  spill=${r.spill}  cramped=${r.cramped.length}`);
  r.cramped.forEach(c => console.log('       ' + c));
  await p.close();
}
await b.close();
