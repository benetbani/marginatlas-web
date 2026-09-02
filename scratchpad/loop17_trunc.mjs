/* throwaway: every clipped text node on a page, at a list of widths.
   Run 15's lesson: a block's rect is the CONTAINER's width, so text is measured
   with scrollWidth against clientWidth on the clipped node itself, after
   document.fonts.ready.
   node scratchpad/loop17_trunc.mjs <slug> [w1,w2,...] */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";

const slug = process.argv[2];
const widths = (process.argv[3] || "375,768,1024,1280,1440").split(",").map(Number);
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href;
const b = await chromium.launch();
for (const w of widths) {
  const p = await b.newPage({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(200);
  const hits = await p.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll("*")) {
      const cs = getComputedStyle(el);
      const clipped = cs.textOverflow === "ellipsis" || cs.overflowX === "hidden" || cs.overflow === "hidden";
      if (!clipped) continue;
      if (el.scrollWidth <= el.clientWidth + 1) continue;
      const t = (el.textContent || "").trim().replace(/\s+/g, " ");
      if (!t || t.length < 2) continue;
      out.push(`${el.clientWidth}<${el.scrollWidth}  "${t.slice(0, 48)}"`);
    }
    return out;
  });
  console.log(`\n${slug} @${w}: ${hits.length} clipped`);
  hits.slice(0, 20).forEach((h) => console.log("   " + h));
  await p.close();
}
await b.close();
