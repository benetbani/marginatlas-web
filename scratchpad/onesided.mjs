import { chromium } from 'playwright';
const b = await chromium.launch();
for (const name of ['city-london','cell-london-restaurants','industry-restaurants','hood-london']) {
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/' + name + '.html');
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const out = [];
    for (const card of document.querySelectorAll('div')) {
      const s = getComputedStyle(card);
      if (s.backdropFilter === 'none') continue;           // cards only
      const cb = card.getBoundingClientRect();
      if (cb.width < 240 || cb.height < 90) continue;
      const padL = parseFloat(s.paddingLeft), padR = parseFloat(s.paddingRight);
      const inner = { l: cb.left + padL, r: cb.right - padR, w: cb.width - padL - padR };
      let maxR = inner.l, minL = inner.r, maxB = cb.top, ink = 0;
      const walk = (e) => { for (const c of e.children) {
        const s2 = getComputedStyle(c);
        const has = [...c.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())
          || s2.backgroundColor !== 'rgba(0, 0, 0, 0)' || c.tagName === 'SVG' || c.tagName === 'IMG';
        const r2 = c.getBoundingClientRect();
        if (has && r2.width > 2 && r2.height > 2) { maxR = Math.max(maxR, r2.right); minL = Math.min(minL, r2.left); maxB = Math.max(maxB, r2.bottom); ink++; }
        walk(c);
      }};
      walk(card);
      if (!ink) continue;
      const rightGap = Math.round(inner.r - maxR);
      const bottomGap = Math.round(cb.bottom - parseFloat(s.paddingBottom) - maxB);
      if (rightGap > inner.w * 0.34 || bottomGap > 70) {
        out.push({ w: Math.round(cb.width), h: Math.round(cb.height), rightGap, bottomGap,
          pct: Math.round((rightGap / inner.w) * 100),
          txt: (card.textContent||'').trim().replace(/\s+/g,' ').slice(0, 48) });
      }
    }
    // keep the outermost only
    return out.filter((x,i) => !out.some((y,j) => j!==i && y.txt.startsWith(x.txt.slice(0,30)) && y.w > x.w));
  });
  console.log('\n  ' + name + '   ' + r.length + ' card(s) with a large one-sided gap');
  for (const x of r) console.log(`     ${String(x.w).padStart(4)}x${String(x.h).padStart(4)}  right gap ${String(x.rightGap).padStart(4)}px (${String(x.pct).padStart(2)}%)  bottom gap ${String(x.bottomGap).padStart(4)}px   "${x.txt}"`);
  await p.close();
}
await b.close();
