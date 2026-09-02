/* throwaway: every visible text run on a page at or above a size floor, largest
   first, with its section. Answers "what does the hero outrank" and "does any
   other figure reach the answer rung". */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";

const slug = process.argv[2];
const floor = Number(process.argv[3] ?? 24);
const width = Number(process.argv[4] ?? 1280);
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width, height: 1400 }, deviceScaleFactor: 1 });
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(250);
const rows = await p.evaluate((floor) => {
  const out = [];
  const walk = (el) => {
    for (const node of el.childNodes) {
      if (node.nodeType === 3 && node.textContent.trim()) {
        const cs = getComputedStyle(el);
        const px = parseFloat(cs.fontSize);
        if (px >= floor) {
          const r = document.createRange();
          r.selectNodeContents(node);
          const rect = r.getBoundingClientRect();
          if (rect.width < 1) continue;
          let host = el;
          while (host && !host.id && host !== document.body) host = host.parentElement;
          out.push({
            text: node.textContent.trim().slice(0, 40),
            px: Math.round(px * 10) / 10,
            colour: cs.color,
            w: Math.round(rect.width),
            id: host && host.id ? host.id : "",
            tag: el.tagName.toLowerCase(),
          });
        }
      } else if (node.nodeType === 1) walk(node);
    }
  };
  walk(document.querySelector("main"));
  return out;
}, floor);
rows.sort((a, c) => c.px - a.px);
for (const r of rows) console.log(`${String(r.px).padStart(5)}px  ${String(r.w).padStart(4)}px  ${r.colour.padEnd(18)} ${(r.id ? "#" + r.id : "-").padEnd(12)} <${r.tag}> ${r.text.replace(/\s+/g, " ")}`);
console.log(`\n${rows.length} run(s) at or above ${floor}px`);
await b.close();
