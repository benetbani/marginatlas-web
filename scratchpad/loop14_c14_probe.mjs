/* throwaway: run the form-variety gate's OWN per-card query against the C14
   harness, and measure each before/after card pair box for box. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL("E:/atlas/website/scratchpad/loop14/c14-dots.html").href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1400, height: 1200 }, deviceScaleFactor: 1 });
await p.goto(url, { waitUntil: "load" });
await p.evaluate(() => document.fonts.ready);
const out = await p.evaluate(() => {
  const CARD_SEL = '[class*="rounded-[14px]"][class*="border"], .atlas-card';
  const rows = [];
  for (const card of document.querySelectorAll(CARD_SEL)) {
    const inner = {};
    for (const el of card.querySelectorAll("[data-idea]")) {
      if (el.closest(CARD_SEL) !== card) continue;
      const k = el.getAttribute("data-idea");
      inner[k] = (inner[k] || 0) + 1;
    }
    const r = card.getBoundingClientRect();
    rows.push({ id: card.id, counts: inner,
      crowded: Object.entries(inner).filter(([, n]) => n >= 3).map(([k, n]) => `${k}x${n}`),
      box: `${Math.round(r.width)}x${Math.round(r.height)}` });
  }
  return rows;
});
for (const r of out) console.log(String(r.id).padEnd(16), JSON.stringify(r.counts).padEnd(14), "crowded:", r.crowded.length ? r.crowded.join(",") : "none", " box:", r.box);
const pairs = [["lens-old-520","lens-new-520"],["lens-old-343","lens-new-343"],["risk-old-520","risk-new-520"],["risk-old-343","risk-new-343"],["solo-old-520","solo-new-520"],["solo-old-343","solo-new-343"]];
for (const [a, c] of pairs) {
  const A = out.find((x) => x.id === a), B = out.find((x) => x.id === c);
  console.log(a, "->", c, A && B ? (A.box === B.box ? "IDENTICAL BOX " + A.box : "DIFFERENT " + A.box + " vs " + B.box) : "missing");
}
await b.close();
