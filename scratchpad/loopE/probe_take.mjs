import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/country-gb-new.html`).href;
const b = await chromium.launch();
for (const w of [1280, 900, 768, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const out = await p.evaluate(() => {
    const r = (e) => { const b = e.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; };
    const lines = (el) => { // count visual lines via Range rects on the text node set
      const rg = document.createRange(); rg.selectNodeContents(el);
      const rects = [...rg.getClientRects()].filter(x => x.width > 1 && x.height > 1);
      const ys = [...new Set(rects.map(x => Math.round(x.top)))];
      return ys.map(y => { const rs = rects.filter(x => Math.round(x.top) === y); return { y, x0: Math.round(Math.min(...rs.map(a=>a.left))), x1: Math.round(Math.max(...rs.map(a=>a.right))), wpx: Math.round(Math.max(...rs.map(a=>a.right)) - Math.min(...rs.map(a=>a.left))) }; });
    };
    const take = document.querySelector('#take');
    const sub = take.querySelector('p');
    const left = take.querySelector('.fig')?.parentElement;
    const clause = left?.querySelector('div:last-child');
    const grid = take.querySelector('.grid');
    return {
      card: r(take),
      sub: { box: r(sub), text: sub.textContent.trim(), lines: lines(sub) },
      left: left ? r(left) : null,
      clause: clause ? { box: r(clause), text: clause.textContent.trim(), lines: lines(clause) } : null,
      grid: grid ? r(grid) : null,
      notes: [...take.querySelectorAll('.grid > div')].map(d => ({ label: d.firstElementChild.textContent.trim(), box: r(d), noteLines: d.lastElementChild ? lines(d.lastElementChild).length : 0 })),
    };
  });
  console.log("=== " + w + " ===");
  console.log(JSON.stringify(out, null, 1));
  await p.close();
}
await b.close();
