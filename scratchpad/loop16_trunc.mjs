/* C19: count TRUNCATED country names on the countries list, at several widths.
   `truncate` clips with an ellipsis and leaves no trace in the DOM, so the test
   is scrollWidth > clientWidth on the name element, cross-checked with a Range
   rect (run 15's lesson: a block element's own rect is its COLUMN, not its
   text). */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";

const url = pathToFileURL("E:/atlas/website/docs/loop/artifacts/final-pages/countries-list.html").href;
const widths = (process.argv[2] || "375,640,768,900,1024,1280,1440").split(",").map(Number);
const b = await chromium.launch();
for (const w of widths) {
  const p = await b.newPage({ viewport: { width: w, height: 1200 } });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(350);
  const r = await p.evaluate(() => {
    const names = [...document.querySelectorAll("article section a span > span:first-child")];
    const cut = [];
    let colW = 0;
    for (const n of names) {
      const clip = n.scrollWidth - n.clientWidth;
      colW = n.clientWidth;
      if (clip > 0) cut.push({ name: (n.textContent || "").trim(), need: n.scrollWidth, have: n.clientWidth });
    }
    /* the widest name on the page, measured by Range so it is the TEXT and not
       the column, so a later row knows what width would actually hold them. */
    let widest = { name: "", w: 0 };
    for (const n of names) {
      const rg = document.createRange();
      rg.selectNodeContents(n);
      const ww = rg.getBoundingClientRect().width;
      if (ww > widest.w) widest = { name: (n.textContent || "").trim(), w: Math.round(ww) };
    }
    const tile = document.querySelector("article section a");
    const tb = tile.getBoundingClientRect();
    const flag = tile.querySelector("img");
    const fb = flag.getBoundingClientRect();
    return {
      total: names.length,
      cut: cut.length,
      colW,
      widest,
      tile: [Math.round(tb.width), Math.round(tb.height)],
      flag: [Math.round(fb.width), Math.round(fb.height)],
      sample: cut.slice(0, 10).map((c) => `${c.name} (${c.need} in ${c.have})`),
    };
  });
  console.log(`${w}: ${r.cut} of ${r.total} names truncated. name column ${r.colW}px, widest name "${r.widest.name}" ${r.widest.w}px, tile ${r.tile.join("x")}, flag ${r.flag.join("x")}`);
  if (r.cut) console.log(`     ${r.sample.join(" | ")}`);
  await p.close();
}
await b.close();
