/* throwaway: try a candidate grid rule for the city tiles, in the shipped render,
   at every width and at 1..5 cities. Blind spot: it cannot test the pager arrows,
   which only mount above the page size. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/country-gb-new.html`).href;
const RULE = process.argv[2] || "repeat(auto-fill,minmax(8.5rem,1fr))";
const LGONLY = process.argv[3] !== "md";
const b = await chromium.launch();
for (const w of [375, 640, 768, 900, 1024, 1280]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const res = await p.evaluate(({ RULE, LGONLY, w }) => {
    const g = document.querySelector('#cities .grid');
    const proto = g.children[0];
    const base = [...g.children].map(c => c.cloneNode(true));
    const out = [];
    for (const n of [1, 2, 3, 4, 5]) {
      g.innerHTML = "";
      for (let i = 0; i < n; i++) g.appendChild(base[i % base.length].cloneNode(true));
      g.style.gridTemplateColumns = (LGONLY ? (w >= 1024) : (w >= 768)) ? RULE : "repeat(2,minmax(0,1fr))";
      const R = (e) => { const b = e.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width)]; };
      const tiles = [...g.children].map(R);
      const rows = [...new Set(tiles.map(t => t[1]))].length;
      const cols = tiles.filter(t => t[1] === tiles[0][1]).length;
      const gridW = Math.round(g.getBoundingClientRect().width);
      const lastRow = tiles.filter(t => t[1] === tiles[tiles.length - 1][1]);
      const tail = gridW - (lastRow[lastRow.length - 1][0] - Math.round(g.getBoundingClientRect().x) + lastRow[lastRow.length - 1][2]);
      const cut = [...g.querySelectorAll('span.truncate')].some(s => s.scrollWidth > s.clientWidth + 0.5);
      out.push({ n, rows, cols, tileW: tiles[0][2], gridW, tailPx: tail, cut });
    }
    return out;
  }, { RULE, LGONLY, w });
  console.log(w, res.map(r => `n=${r.n} ${r.cols}x${r.rows} tile=${r.tileW} tail=${r.tailPx}${r.cut ? " CUT" : ""}`).join(" | "));
  await p.close();
}
await b.close();
