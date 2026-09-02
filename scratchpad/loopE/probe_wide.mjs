import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/country-gb-new.html`).href;
const b = await chromium.launch();
for (const w of [1440, 1920]) {
  const p = await b.newPage({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const o = await p.evaluate(() => { const R=(e)=>{const b=e.getBoundingClientRect();return [Math.round(b.x),Math.round(b.width)];};
    const c=document.querySelector('#cities'); const g=c.querySelector('.grid');
    return { band:R(c.parentElement), card:R(c), grid:R(g), tiles:[...g.children].map(R) }; });
  console.log(w, JSON.stringify(o));
  await p.close();
}
await b.close();
