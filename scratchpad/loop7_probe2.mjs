import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL("E:/atlas/website/scratchpad/loop7/optioncards.html").href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1400, height: 1200 } });
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(400);
const out = await p.evaluate(() => {
  const R = (n) => Math.round(n * 10) / 10;
  return [...document.querySelectorAll('[data-idea="I6"]')].map((set) => {
    const probe = set.closest("[data-probe]")?.getAttribute("data-probe") ?? "?";
    const cards = [...set.querySelectorAll('[role="listitem"]')];
    const sw = set.getBoundingClientRect().width;
    // header gap: bottom of the title to top of the figure, per card
    const gaps = cards.map((c) => {
      const t = c.querySelector("[class*='font-sans']") || c.querySelector("div > div");
      const title = [...c.querySelectorAll("*")].find((e) => e.className && String(e.className).includes("leading-snug") && e.tagName !== "P");
      const fig = c.querySelector(".fig");
      if (!title || !fig) return null;
      return R(fig.getBoundingClientRect().top - title.getBoundingClientRect().bottom);
    });
    // the void on the last visual row
    const boxes = cards.map((c) => c.getBoundingClientRect());
    const lastTop = Math.max(...boxes.map((r) => Math.round(r.top)));
    const lastRow = boxes.filter((r) => Math.round(r.top) === lastTop);
    const used = lastRow.reduce((a, r) => a + r.width, 0) + 10 * (lastRow.length - 1);
    const voidW = R(sw - used);
    const rowH = R(Math.max(...lastRow.map((r) => r.height)));
    return { probe, setW: R(sw), nLastRow: lastRow.length, voidW, voidPct: R((voidW / sw) * 100), voidH: rowH, gaps };
  });
});
for (const s of out) {
  console.log(`${s.probe.padEnd(14)} setW=${s.setW} lastRow=${s.nLastRow} VOID=${s.voidW}px (${s.voidPct}% of set) x ${s.voidH}px tall | headerGap=[${s.gaps.join(",")}]`);
}
await b.close();
