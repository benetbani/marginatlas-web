import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL("E:/atlas/website/docs/loop/artifacts/final-pages/country-gb-new.html").href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 768, height: 900 } });
await p.goto(url, { waitUntil: "networkidle" });
console.log(JSON.stringify(await p.evaluate(() => {
  const strip = document.querySelectorAll("#take > div")[document.querySelectorAll("#take > div").length - 1];
  return [...strip.children].map((tile) => {
    const val = tile.firstElementChild;
    const lab = tile.children[1];
    const vb = val.getBoundingClientRect(), lb = lab.getBoundingClientRect();
    const cs = getComputedStyle(val);
    return { text: val.textContent, valTop: Math.round(vb.top*10)/10, valH: Math.round(vb.height*10)/10, lineHeight: cs.lineHeight, labTop: Math.round(lb.top*10)/10 };
  });
}, null), null, 1));
await b.close();
