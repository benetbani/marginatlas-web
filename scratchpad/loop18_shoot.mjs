/* throwaway (C29/C43): photograph a card by #id from ANY html file (a final page
   or a scratchpad render), at a list of widths, and report its measured geometry
   plus every clipped text node inside it. Text is measured after
   document.fonts.ready, and a text width is taken from a Range rect rather than
   the element's box, which is run 15's lesson and run 17's: a block's rect is its
   CONTAINER's width, so an element rect can never tell you a name was cut.
   node scratchpad/loop18_shoot.mjs <file.html> <#id> <outPrefix> [w1,w2,...] */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const file = resolve(process.argv[2]);
const sel = process.argv[3];
const out = process.argv[4];
const widths = (process.argv[5] || "1280,768,375").split(",").map(Number);
const url = pathToFileURL(file).href;
const b = await chromium.launch();
for (const w of widths) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(250);
  const info = await p.evaluate((sel) => {
    const card = document.querySelector(sel);
    if (!card) return null;
    const r = (e) => { const q = e.getBoundingClientRect(); return { x: Math.round(q.x + scrollX), y: Math.round(q.y + scrollY), width: Math.round(q.width), height: Math.round(q.height) }; };
    /* THE RANGE RECT, not the element rect: a Range around an element's own text
       measures the TEXT, so a name in a 69px column that needs 105px is visible
       here and invisible in the element's box, which is always the column's. */
    const textW = (el) => {
      const rg = document.createRange();
      rg.selectNodeContents(el);
      const q = rg.getBoundingClientRect();
      return Math.round(q.width * 10) / 10;
    };
    const clipped = [];
    for (const el of card.querySelectorAll("*")) {
      if (el.children.length) continue;
      const t = (el.textContent || "").trim();
      if (!t) continue;
      const cs = getComputedStyle(el);
      const isClip = cs.textOverflow === "ellipsis" || cs.overflow === "hidden" || cs.overflowX === "hidden";
      const box = Math.round(el.clientWidth * 10) / 10;
      const need = textW(el);
      const lines = Math.round(el.getBoundingClientRect().height / (parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4));
      if (isClip && need > box + 0.5) clipped.push({ kind: "CUT", t: t.slice(0, 40), box, need, size: cs.fontSize });
      else if (!isClip && lines > 1 && t.length < 40) clipped.push({ kind: "wrapped", t: t.slice(0, 40), box, need, lines, size: cs.fontSize });
    }
    return { card: r(card), clipped, scrollsX: document.documentElement.scrollWidth > window.innerWidth };
  }, sel);
  if (!info) { console.log(w, "NOT FOUND", sel); await p.close(); continue; }
  console.log(`\n@${w}  card ${info.card.width}x${info.card.height} at (${info.card.x},${info.card.y})  page scrolls sideways: ${info.scrollsX}`);
  for (const c of info.clipped) console.log(`   ${c.kind.padEnd(8)} "${c.t}"  box ${c.box} need ${c.need} ${c.size}${c.lines ? " lines " + c.lines : ""}`);
  const pad = 10;
  await p.screenshot({
    path: `${out}-${w}.jpeg`, quality: 90, type: "jpeg", fullPage: true,
    clip: { x: Math.max(0, info.card.x - pad), y: Math.max(0, info.card.y - pad), width: Math.min(w, info.card.width + pad * 2), height: info.card.height + pad * 2 },
  });
  await p.close();
}
await b.close();
