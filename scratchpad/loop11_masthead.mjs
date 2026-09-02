/* throwaway: list every visible text node in a page's masthead band with its
   computed font-size, weight, colour and measured box, largest first. C7 needs
   to know what the hero figure OUTRANKS, not only what size it is. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";

const slug = process.argv[2];
const width = Number(process.argv[3] ?? 1280);
const bandIndex = Number(process.argv[4] ?? 0); // which direct child of <main>
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width, height: 1400 }, deviceScaleFactor: 1 });
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(250);
const rows = await p.evaluate((bandIndex) => {
  const band = document.querySelector("main").children[bandIndex];
  const out = [];
  const walk = (el) => {
    for (const node of el.childNodes) {
      if (node.nodeType === 3 && node.textContent.trim()) {
        const cs = getComputedStyle(el);
        const r = document.createRange();
        r.selectNodeContents(node);
        const rect = r.getBoundingClientRect();
        out.push({
          text: node.textContent.trim().slice(0, 44),
          px: Math.round(parseFloat(cs.fontSize) * 10) / 10,
          weight: cs.fontWeight,
          colour: cs.color,
          family: cs.fontFamily.split(",")[0].replace(/["']/g, ""),
          w: Math.round(rect.width),
          h: Math.round(rect.height),
          tag: el.tagName.toLowerCase(),
        });
      } else if (node.nodeType === 1) walk(node);
    }
  };
  walk(band);
  return out;
}, bandIndex);
rows.sort((a, c) => c.px - a.px);
for (const r of rows) {
  console.log(
    `${String(r.px).padStart(5)}px  w${String(r.weight).padStart(3)}  ${String(r.w).padStart(4)}x${String(r.h).padStart(3)}  ${r.family.padEnd(14)} ${r.colour.padEnd(18)} <${r.tag}> ${r.text.replace(/\s+/g, " ")}`,
  );
}
await b.close();
