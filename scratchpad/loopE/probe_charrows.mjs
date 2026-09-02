import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/country-gb-new.html`).href;
const b = await chromium.launch();
for (const w of [1280, 1024, 900, 800, 768]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const o = await p.evaluate(() => {
    const band = document.querySelector('#character').parentElement;
    const cards = [...band.children];
    const rowsOf = (c) => [...c.querySelectorAll('[data-idea="I1"] > div')].map(d => Math.round(d.getBoundingClientRect().top));
    const kick = (c) => { const h = c.querySelector('h3'); const rg = document.createRange(); rg.selectNodeContents(h);
      return { t: h.textContent.trim(), lines: new Set([...rg.getClientRects()].filter(x=>x.width>1).map(x=>Math.round(x.top))).size }; };
    const a = rowsOf(cards[0]), bb = rowsOf(cards[1]);
    return { kick: cards.map(kick), heights: cards.map(c => Math.round(c.getBoundingClientRect().height)),
      rowDelta: a.map((v, i) => (bb[i] ?? 0) - v) };
  });
  console.log(w, JSON.stringify(o));
  await p.close();
}
await b.close();
