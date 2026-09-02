/* throwaway (C43): what the two cutting cards actually need, measured with a
   Range rect after document.fonts.ready, at a width list. Prints the card's
   inner width, the space each name column is given, and what the longest name
   and the longest single WORD in the set need at the printed size. The word
   matters on its own: C19 found that wrapping alone did not finish the
   countries list, because 27 single-word names still overflowed a column a word
   has no way to break inside.
   node scratchpad/loop18_c43.mjs <file.html> <#card> <widths> */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
const file = resolve(process.argv[2]), sel = process.argv[3];
const widths = (process.argv[4] || "1440,1280,1024,900,768,640,480,375").split(",").map(Number);
const b = await chromium.launch();
for (const w of widths) {
  const p = await b.newPage({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1 });
  await p.goto(pathToFileURL(file).href, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(150);
  const r = await p.evaluate((sel) => {
    const card = document.querySelector(sel);
    if (!card) return null;
    const textW = (el, s) => {
      const probe = document.createElement("span");
      probe.style.cssText = "position:absolute;left:-9999px;white-space:nowrap";
      const cs = getComputedStyle(el);
      probe.style.font = cs.font;
      probe.style.fontSize = cs.fontSize;
      probe.style.fontWeight = cs.fontWeight;
      probe.style.fontFamily = cs.fontFamily;
      probe.style.letterSpacing = cs.letterSpacing;
      probe.textContent = s;
      el.parentElement.appendChild(probe);
      const rg = document.createRange(); rg.selectNodeContents(probe);
      const wd = Math.round(rg.getBoundingClientRect().width * 10) / 10;
      probe.remove();
      return wd;
    };
    const names = [];
    for (const el of card.querySelectorAll("*")) {
      if (el.children.length) continue;
      const t = (el.textContent || "").trim(); if (!t || t.length < 3) continue;
      const cs = getComputedStyle(el);
      if (!(cs.textOverflow === "ellipsis" || cs.overflow === "hidden" || cs.overflowX === "hidden")) continue;
      const rg = document.createRange(); rg.selectNodeContents(el);
      const need = Math.round(rg.getBoundingClientRect().width * 10) / 10;
      const box = Math.round(el.clientWidth * 10) / 10;
      const words = t.split(/\s+/).map((word) => [word, textW(el, word)]).sort((a, c) => c[1] - a[1]);
      names.push({ t, box, need, cut: need > box + 0.5, longestWord: words[0][0], wordW: words[0][1], size: cs.fontSize });
    }
    const cb = card.getBoundingClientRect();
    const cs = getComputedStyle(card);
    return { card: Math.round(cb.width), inner: Math.round(cb.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - parseFloat(cs.borderLeftWidth) * 2), names };
  }, sel);
  if (!r) { console.log(`@${w} NOT FOUND`); await p.close(); continue; }
  console.log(`\n@${w}  card ${r.card}  inner ${r.inner}`);
  for (const n of r.names) console.log(`   ${n.cut ? "CUT " : "ok  "} "${n.t}" box ${n.box} needs ${n.need} at ${n.size}, longest word "${n.longestWord}" ${n.wordW}`);
  await p.close();
}
await b.close();
