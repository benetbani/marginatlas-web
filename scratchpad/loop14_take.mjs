/* throwaway: measure the country masthead's two blocks and the air between/below
   them, at 1280 and 375, AFTER document.fonts.ready (run 13's correction). */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL("E:/atlas/website/docs/loop/artifacts/final-pages/country-gb-new.html").href;
const b = await chromium.launch();
for (const w of [1280, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const out = await p.evaluate(() => {
    const card = document.querySelector("#take");
    const row = card.querySelector(":scope > div:last-child");
    const kids = [...row.children];
    const r = (e) => { const b = e.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; };
    return { card: r(card), blocks: kids.map(r), rowBox: r(row) };
  });
  const [left, right] = out.blocks;
  const gap = right ? right.x - (left.x + left.w) : null;
  const belowShorter = right ? Math.abs(left.h - right.h) : null;
  console.log(w, JSON.stringify({ card: out.card, left, right, gapPx: gap,
    gapShareOfCard: gap != null ? +(gap / out.card.w).toFixed(3) : null,
    heightDelta: belowShorter, thirdOfCard: Math.round(out.card.w / 3) }));
  await p.close();
}
await b.close();
