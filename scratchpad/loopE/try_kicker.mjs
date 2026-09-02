import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/country-gb-new.html`).href;
const CANDS = ["What an owner keeps, trade by trade", "What an owner keeps, by trade", "What an owner keeps"];
const b = await chromium.launch();
for (const w of [1280, 900, 768, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const res = await p.evaluate(({ CANDS }) => {
    const money = document.querySelector('#money');
    const h = money.querySelector('h3') || money.querySelector('[class*="uppercase"]');
    const out = [];
    for (const c of CANDS) {
      h.textContent = c;
      const r = h.getBoundingClientRect();
      const rg = document.createRange(); rg.selectNodeContents(h);
      const ys = new Set([...rg.getClientRects()].filter(x=>x.width>1).map(x=>Math.round(x.top)));
      out.push({ c, lines: ys.size, h: Math.round(r.height), cardH: Math.round(money.getBoundingClientRect().height), tag: h.tagName + "." + h.className.slice(0,40) });
    }
    return out;
  }, { CANDS });
  console.log("=== " + w + " ===");
  for (const r of res) console.log(`  lines=${r.lines} kickerH=${r.h} cardH=${r.cardH}  "${r.c}"  [${r.tag}]`);
  await p.close();
}
await b.close();
