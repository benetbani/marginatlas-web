/* throwaway: report a final page's BAND SEQUENCE, measured at 1280.
   For each direct child of <main>: its role (hero / band / loose), its computed
   grid-template-columns, the ratio that implies, its measured column widths and
   the cards it holds. This is the count C8 asks for, read off the render rather
   than off the Band calls. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";

const slug = process.argv[2];
const width = Number(process.argv[3] ?? 1280);
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width, height: 1400 }, deviceScaleFactor: 1 });
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(250);
const rows = await p.evaluate(() => {
  const main = document.querySelector("main");
  const out = [];
  for (const el of [...main.children]) {
    const cs = getComputedStyle(el);
    const gtc = cs.gridTemplateColumns;
    const kids = [...el.children].map((k) => {
      const r = k.getBoundingClientRect();
      const id = k.id || "";
      const label = (k.querySelector("h2,h3,h1")?.textContent || k.textContent || "").trim().slice(0, 46);
      return { id, w: Math.round(r.width), h: Math.round(r.height), label };
    });
    // ratio implied by the measured column widths
    let ratio = "";
    const ws = gtc.split(" ").map((v) => parseFloat(v)).filter((v) => !Number.isNaN(v));
    if (ws.length === 2) {
      const r = ws[0] / ws[1];
      const table = { "1-1": 1, "1-2": 0.5, "2-1": 2, "2-3": 2 / 3, "3-2": 1.5 };
      let best = "", bd = 1e9;
      for (const [k, v] of Object.entries(table)) { const d = Math.abs(r - v); if (d < bd) { bd = d; best = k; } }
      ratio = `${best} (measured ${r.toFixed(2)})`;
    }
    out.push({
      tag: el.tagName.toLowerCase(),
      hero: el.getAttribute("data-hero") || "",
      cls: (el.className || "").toString().slice(0, 60),
      gtc,
      ratio,
      w: Math.round(el.getBoundingClientRect().width),
      kids,
    });
  }
  return out;
});
let i = 0;
for (const r of rows) {
  i++;
  const kind = r.hero ? "HERO (full width)" : r.gtc === "none" ? "LOOSE (not a Band)" : r.ratio || r.gtc;
  console.log(`${String(i).padStart(2)}. ${kind}  w=${r.w}  <${r.tag}>`);
  for (const k of r.kids) console.log(`      ${String(k.w).padStart(4)}x${String(k.h).padStart(4)}  ${k.id ? "#" + k.id + " " : ""}${k.label.replace(/\s+/g, " ")}`);
}
await b.close();
