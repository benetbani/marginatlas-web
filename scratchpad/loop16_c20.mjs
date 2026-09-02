/* C20: what a reader sees FIRST and SECOND on each spine masthead, measured
   rather than reasoned. Reports, per page per width:
     - the h1: its text, its computed size, its Range-measured text width
     - every visible text node at 20px or more, largest first, marked FIGURE
       (it carries a digit) or WORD
     - the largest figure on the page, and the ratio between the top two
   Text widths come from a Range rect, never the element box: run 15's lesson,
   a block element's rect is its COLUMN. Fonts are awaited before measuring:
   run 12's lesson. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";

const slugs = (process.argv[2] || "cell-london-restaurants,city-london,hood-london,country-gb-new").split(",");
const widths = (process.argv[3] || "1280,375").split(",").map(Number);
const floor = Number(process.argv[4] || 20);

const b = await chromium.launch();
for (const slug of slugs) {
  const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href;
  for (const w of widths) {
    const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 1 });
    await p.goto(url, { waitUntil: "load" });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(400);
    const out = await p.evaluate((floor) => {
      const rows = [];
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walk.nextNode())) {
        const t = (n.textContent || "").trim();
        if (!t) continue;
        const el = n.parentElement;
        if (!el) continue;
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        const px = parseFloat(cs.fontSize);
        if (!(px >= floor)) continue;
        const r = document.createRange();
        r.selectNodeContents(n);
        const rect = r.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) continue;
        rows.push({
          text: t.replace(/\s+/g, " ").slice(0, 46),
          px: Math.round(px * 10) / 10,
          weight: cs.fontWeight,
          colour: cs.color,
          tag: el.tagName.toLowerCase(),
          w: Math.round(rect.width),
          y: Math.round(rect.top + scrollY),
          figure: /\d/.test(t),
          sect: (el.closest("section[id]") || el.closest("[id]"))?.id ?? "",
        });
      }
      rows.sort((a, c) => c.px - a.px || c.w - a.w);
      const h1 = document.querySelector("h1");
      let h1m = null;
      if (h1) {
        const r = document.createRange();
        r.selectNodeContents(h1);
        const rect = r.getBoundingClientRect();
        h1m = {
          text: (h1.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60),
          px: Math.round(parseFloat(getComputedStyle(h1).fontSize) * 10) / 10,
          w: Math.round(rect.width),
          lines: Math.round(rect.height / parseFloat(getComputedStyle(h1).lineHeight || "0") || 0),
          cls: (h1.getAttribute("class") || "").slice(0, 120),
        };
      }
      const figs = rows.filter((r) => r.figure);
      return { rows: rows.slice(0, 16), h1: h1m, topFigure: figs[0] ?? null, secondFigure: figs[1] ?? null };
    }, floor);
    console.log(`\n===== ${slug} @ ${w} =====`);
    if (out.h1) console.log(`  h1  ${out.h1.px}px  textW ${out.h1.w}  "${out.h1.text}"\n      class ${out.h1.cls}`);
    console.log(`  largest figure: ${out.topFigure ? `${out.topFigure.px}px "${out.topFigure.text}" (#${out.topFigure.sect}, w${out.topFigure.w})` : "(none at or above the floor)"}`);
    if (out.h1 && out.topFigure) {
      const a = out.topFigure.px, c = out.h1.px;
      console.log(`  RATIO figure/h1 = ${(a / c).toFixed(2)}x   h1/figure = ${(c / a).toFixed(2)}x`);
    }
    for (const r of out.rows) {
      console.log(`   ${String(r.px).padStart(5)}px w${String(r.weight).padStart(3)} ${r.figure ? "FIG " : "WORD"} ${String(r.w).padStart(4)}px y${String(r.y).padStart(5)} ${r.colour.padEnd(20)} <${r.tag}> #${r.sect.padEnd(12)} ${r.text}`);
    }
    await p.close();
  }
}
await b.close();
