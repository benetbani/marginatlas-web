import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const b = await chromium.launch();
for (const slug of ["country-gb-new"]) {
  const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href;
  for (const w of [375, 768, 900]) {
    const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 1 });
    await p.goto(url, { waitUntil: "load" });
    await p.evaluate(() => document.fonts.ready);
    const o = await p.evaluate(() => [...document.querySelectorAll('h3')].map(h => {
      const rg = document.createRange(); rg.selectNodeContents(h);
      const rects = [...rg.getClientRects()].filter(x => x.width > 1);
      const ys = [...new Set(rects.map(x => Math.round(x.top)))].sort((a,b)=>a-b);
      const last = rects.filter(x => Math.round(x.top) === ys[ys.length-1]);
      const lastW = last.length ? Math.round(Math.max(...last.map(a=>a.right)) - Math.min(...last.map(a=>a.left))) : 0;
      const first = rects.filter(x => Math.round(x.top) === ys[0]);
      const firstW = first.length ? Math.round(Math.max(...first.map(a=>a.right)) - Math.min(...first.map(a=>a.left))) : 0;
      return { t: h.textContent.trim(), lines: ys.length, firstW, lastW };
    }));
    console.log(`--- ${slug} @ ${w} ---`);
    for (const r of o) console.log(`  ${r.lines} line(s)  first=${r.firstW} last=${r.lastW}  ${r.t}`);
    await p.close();
  }
}
await b.close();
