/* throwaway (C29): the WIDTH PRICE of the money grammar, measured rather than
   estimated. Renders the widest string each grammar can produce, in the atlas's
   own figure face at the sizes money is printed at, and measures it with a Range
   rect on a rendered page (the fig class carries tabular numerals, so a digit's
   advance is the same whichever digit it is).
   node scratchpad/loop18_figwidth.mjs */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
await p.goto(pathToFileURL("E:/atlas/website/docs/loop/artifacts/final-pages/country-gb-new.html").href, { waitUntil: "load" });
await p.evaluate(() => document.fonts.ready);
const rows = await p.evaluate(() => {
  const host = document.querySelector(".av2") || document.body;
  const probe = document.createElement("span");
  probe.className = "fig";
  probe.style.cssText = "position:absolute;left:-9999px;white-space:nowrap;font-weight:600";
  host.appendChild(probe);
  const w = (s, size) => {
    probe.style.fontSize = size;
    probe.textContent = s;
    const rg = document.createRange();
    rg.selectNodeContents(probe);
    return Math.round(rg.getBoundingClientRect().width * 10) / 10;
  };
  const out = [];
  for (const size of ["14px", "12.5px", "20px", "30px"])
    for (const s of ["$10K", "$137K", "$1.4M", "$9,999", "$1,512", "$3,360", "$999"])
      out.push([size, s, w(s, size)]);
  probe.remove();
  return out;
});
for (const [size, s, wd] of rows) console.log(`${size.padStart(7)}  ${s.padEnd(8)} ${wd}px`);
await b.close();
