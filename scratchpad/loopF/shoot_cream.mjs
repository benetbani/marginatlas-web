/* throwaway (loop run F, row 1): photograph the SAME surface from the committed
   render and from the re-rendered one, at 1280 and 375, and report the computed
   background of every element whose declared background is var(--c-card).
   The point of the row is that a colour must not move; a picture plus a computed
   value is what proves it, not the fact that a gate went green. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";

const pages = [
  ["home", "docs/loop/artifacts/final-pages/home.html", "scratchpad/loopF/HEAD-home.html"],
  ["cell", "docs/loop/artifacts/final-pages/cell-london-restaurants.html", "scratchpad/loopF/HEAD-cell-london-restaurants.html"],
  ["country", "docs/loop/artifacts/final-pages/country-gb-new.html", "scratchpad/loopF/HEAD-country-gb-new.html"],
];

const b = await chromium.launch();
for (const [name, after, before] of pages) {
  for (const [tag, rel] of [["before", before], ["after", after]]) {
    for (const w of [1280, 375]) {
      const p = await b.newPage({ viewport: { width: w, height: 1500 }, deviceScaleFactor: 2 });
      await p.goto(pathToFileURL(`E:/atlas/website/${rel}`).href, { waitUntil: "load" });
      await p.waitForTimeout(300);
      const probe = await p.evaluate(() => {
        const root = getComputedStyle(document.documentElement);
        const card = root.getPropertyValue("--c-card").trim();
        const surfaces = [...document.querySelectorAll("*")].filter((e) => {
          const inline = e.getAttribute("style") || "";
          const cls = typeof e.className === "string" ? e.className : "";
          return /var\(--c-card\)/.test(inline) || /\bbg-\[var\(--c-card\)\]/.test(cls);
        });
        const seen = {};
        for (const e of surfaces) {
          const bg = getComputedStyle(e).backgroundColor;
          seen[bg] = (seen[bg] || 0) + 1;
        }
        return { card, surfaceCount: surfaces.length, computed: seen, height: document.body.scrollHeight };
      });
      console.log(name, tag, w, JSON.stringify(probe));
      await p.screenshot({ path: `scratchpad/loopF/${name}-${tag}-${w}.jpeg`, quality: 82, type: "jpeg", clip: { x: 0, y: 0, width: w, height: 1500 } });
      await p.close();
    }
  }
}
await b.close();

/* The "before" copies are made with:
     git show HEAD:docs/loop/artifacts/final-pages/<page>.html > scratchpad/loopF/HEAD-<page>.html
   and deleted after the run; they are 1.3MB each and reproducible in one command. */
