/* THROWAWAY. Photograph each labelled Row of a scratchpad harness page.
 * Usage: node scratchpad/loop7_shoot_harness.mjs <html-under-scratchpad> <out-prefix>
 */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { mkdirSync } from "node:fs";

const file = process.argv[2];
const out = process.argv[3];
mkdirSync(out.slice(0, out.lastIndexOf("/")), { recursive: true });
const url = pathToFileURL(`E:/atlas/website/${file}`).href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2 });
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(500);
const boxes = await p.evaluate(() =>
  [...document.querySelectorAll("section")].map((s, i) => {
    const r = s.getBoundingClientRect();
    return { i, y: Math.round(r.y + scrollY), h: Math.round(r.height), x: Math.round(r.x + scrollX), w: Math.round(r.width) };
  }),
);
for (const bx of boxes) {
  if (bx.h < 10) continue;
  await p.screenshot({
    path: `${out}-s${bx.i}.jpeg`,
    quality: 90,
    type: "jpeg",
    fullPage: true,
    clip: { x: Math.max(0, bx.x - 8), y: Math.max(0, bx.y - 8), width: Math.min(1400, bx.w + 16), height: bx.h + 16 },
  });
  console.log(`${out}-s${bx.i}.jpeg  ${bx.w}x${bx.h}`);
}
await b.close();
