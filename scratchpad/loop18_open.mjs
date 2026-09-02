/* throwaway (C29): photograph a card with EVERY <details> on the page forced
   open, because the two figures this row moves on the cell page live behind an
   InlineDisclosure and the static render ships it shut. Same Range-rect text
   measurement as loop18_shoot.
   node scratchpad/loop18_open.mjs <file.html> <#id> <out> [widths] */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
const file = resolve(process.argv[2]), sel = process.argv[3], out = process.argv[4];
const widths = (process.argv[5] || "1280,768,375").split(",").map(Number);
const b = await chromium.launch();
for (const w of widths) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 2 });
  await p.goto(pathToFileURL(file).href, { waitUntil: "load" });
  await p.evaluate(() => { document.querySelectorAll("details").forEach((d) => (d.open = true)); });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(250);
  const info = await p.evaluate((sel) => {
    const card = document.querySelector(sel);
    if (!card) return null;
    const q = card.getBoundingClientRect();
    const textW = (el) => { const rg = document.createRange(); rg.selectNodeContents(el); return Math.round(rg.getBoundingClientRect().width * 10) / 10; };
    const bad = [];
    for (const el of card.querySelectorAll("*")) {
      if (el.children.length) continue;
      const t = (el.textContent || "").trim(); if (!t) continue;
      const cs = getComputedStyle(el);
      const isClip = cs.textOverflow === "ellipsis" || cs.overflow === "hidden" || cs.overflowX === "hidden";
      const box = Math.round(el.clientWidth * 10) / 10, need = textW(el);
      if (isClip && need > box + 0.5) bad.push(`CUT     "${t.slice(0, 40)}" box ${box} need ${need}`);
    }
    return { x: Math.round(q.x + scrollX), y: Math.round(q.y + scrollY), width: Math.round(q.width), height: Math.round(q.height), bad, scrollsX: document.documentElement.scrollWidth > innerWidth };
  }, sel);
  if (!info) { console.log(w, "NOT FOUND"); await p.close(); continue; }
  console.log(`@${w}  ${info.width}x${info.height}  scrollsX ${info.scrollsX}`);
  info.bad.forEach((s) => console.log("   " + s));
  await p.screenshot({ path: `${out}-${w}.jpeg`, quality: 90, type: "jpeg", fullPage: true, clip: { x: Math.max(0, info.x - 10), y: Math.max(0, info.y - 10), width: Math.min(w, info.width + 20), height: info.height + 20 } });
  await p.close();
}
await b.close();
