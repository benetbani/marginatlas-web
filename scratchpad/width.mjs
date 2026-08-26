import { chromium } from 'playwright';
const b = await chromium.launch();
const pages = ['city-london','cell-london-restaurants','industry-restaurants','hood-london'];
for (const name of pages) {
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/' + name + '.html');
  await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const out = [];
    // a PROSE block: an element whose own text is a real sentence, not a label
    for (const e of document.querySelectorAll('p,li,div,span')) {
      const own = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
      if (own.length < 60) continue;
      if (!/[.,;]/.test(own)) continue;
      const s = getComputedStyle(e); const r = e.getBoundingClientRect();
      if (r.width < 100) continue;
      // characters per line = width / average glyph advance, measured not guessed
      const cv = document.createElement('canvas').getContext('2d');
      cv.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
      const adv = cv.measureText('abcdefghijklmnopqrstuvwxyz ').width / 27;
      const cpl = Math.round(r.width / adv);
      out.push({ cpl, w: Math.round(r.width), fs: s.fontSize, mw: s.maxWidth, txt: own.replace(/\s+/g,' ').slice(0, 54) });
    }
    return out.sort((a,b) => b.cpl - a.cpl);
  });
  const bad = r.filter(x => x.cpl > 75);
  console.log(`\n  ${name}   ${r.length} prose blocks, ${bad.length} wider than 75 characters per line`);
  for (const x of bad.slice(0, 6)) console.log(`     ${String(x.cpl).padStart(3)} cpl  ${String(x.w).padStart(4)}px  max-w ${x.mw.padEnd(8)}  "${x.txt}"`);
  await p.close();
}
await b.close();
