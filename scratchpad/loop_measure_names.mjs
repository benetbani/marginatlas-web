/* throwaway, kept because the fifth run's estimate was 6px out and 6px was the
   whole margin. Measures, in the page's OWN font at the 12px read floor, what a
   LollipopColumn's name row actually needs: the width of each name, the width of
   its LONGEST SINGLE WORD (which is what the break-word guard splits, and
   therefore the number a column must clear), and the column width the card is
   currently giving them.

   ITS BLIND SPOT, stated before anyone quotes it: the entries `narrowCount`
   drops are hidden with a class, not removed from the DOM, so the per-name rows
   below list every entry while the column width is the one the VISIBLE set is
   getting. Read the verdict as "would the widest name in the whole set fit the
   current column", which is the conservative question and the one that matters
   when you are choosing the count. Fonts also render a little wider at a small
   viewport, about 5px on an eleven-character word, so measure at the width you
   are deciding for rather than scaling a number from 1280.

   node scratchpad/loop_measure_names.mjs <page-slug> [viewport] */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";

const slug = process.argv[2];
const width = Number(process.argv[3] || 1280);
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width, height: 1400 } });
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(200);
const out = await p.evaluate(() => {
  const probe = document.createElement("span");
  probe.style.cssText =
    "position:absolute;visibility:hidden;white-space:nowrap;font-size:12px;line-height:1.375";
  document.body.appendChild(probe);
  const w = (s) => {
    probe.textContent = s;
    return Math.ceil(probe.getBoundingClientRect().width);
  };
  return [...document.querySelectorAll('[data-idea="I2"] ol')].map((ol) => {
    const cells = [...ol.querySelectorAll("li > div:last-child, li button > div:last-child")];
    const names = cells.map((c) => c.textContent.trim()).filter(Boolean);
    const col = ol.querySelector("li")
      ? Math.round(ol.querySelector("li").getBoundingClientRect().width)
      : null;
    return {
      column: col,
      needs: Math.max(0, ...names.map((n) => Math.max(...n.split(/\s+/).map(w)))),
      names: names.map((n) => ({ n, full: w(n), longestWord: Math.max(...n.split(/\s+/).map(w)) })),
    };
  });
});
for (const set of out) {
  const verdict = set.column != null && set.column >= set.needs ? "FITS" : "BREAKS MID-WORD";
  console.log(`${width}px: column ${set.column}px, longest word ${set.needs}px -> ${verdict}`);
  for (const n of set.names) console.log(`   ${String(n.longestWord).padStart(4)}  ${n.full.toString().padStart(4)}  ${n.n}`);
}
await b.close();
