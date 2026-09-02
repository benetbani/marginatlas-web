/* throwaway: E1's prose count per card, on every gated page, with the runs
   broken out so a title, an answer and a data label can be told from a sentence.
   node scratchpad/loop17_prose.mjs [--runs] */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";

const PAGES = ["city-london", "cell-london-restaurants", "industry-restaurants", "hood-london"];
const showRuns = process.argv.includes("--runs");
const b = await chromium.launch();
for (const slug of PAGES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto(pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  const rows = await p.evaluate(() => {
    const inDead = (e) => { const d = e.closest("details"); return !!d && !d.open && !e.closest("summary"); };
    const cards = [...document.querySelectorAll("div")].filter((e) => getComputedStyle(e).backdropFilter !== "none");
    const outer = cards.filter((c) => !cards.some((o) => o !== c && o.contains(c)));
    return outer.map((c) => {
      const runs = [];
      for (const e of c.querySelectorAll("*")) {
        if (inDead(e)) continue;
        const own = [...e.childNodes].filter((x) => x.nodeType === 3 && x.textContent.trim()).map((x) => x.textContent.trim()).join(" ");
        if (own.length >= 30 && /\s/.test(own)) runs.push(own);
      }
      return {
        id: c.id || (c.textContent || "").trim().replace(/\s+/g, " ").slice(0, 28),
        editorial: c.hasAttribute("data-editorial"),
        total: runs.reduce((a, r) => a + r.length, 0),
        runs,
      };
    });
  });
  await p.close();
  console.log(`\n${slug}`);
  for (const r of rows.sort((a, b2) => b2.total - a.total)) {
    const flag = r.total > 220 && !r.editorial ? " *** OVER ***" : r.editorial ? " (editorial)" : "";
    console.log(`  ${String(r.total).padStart(4)}  ${r.id}${flag}`);
    if (showRuns && (r.total > 150 || flag)) r.runs.forEach((x) => console.log(`         ${String(x.length).padStart(4)}  ${x.slice(0, 110)}`));
  }
}
await b.close();
