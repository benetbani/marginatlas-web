import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1400 } });
await p.goto(pathToFileURL("E:/atlas/website/docs/loop/artifacts/final-pages/industry-restaurants.html").href, { waitUntil: "load" });
await p.waitForTimeout(300);
const out = await p.evaluate(() => {
  const g = (id) => { const e = document.getElementById(id); if (!e) return null; const r = e.getBoundingClientRect();
    return { y: Math.round(r.y+scrollY), w: Math.round(r.width), h: Math.round(r.height), t: (e.textContent||"").replace(/\s+/g," ").trim().slice(0, 320) }; };
  return Object.fromEntries(["ladder","kept","spend","neighbours","split","open","survival","suits","myths","close"].map(id => [id, g(id)]));
});
for (const [k, v] of Object.entries(out)) console.log("\n#" + k, v ? `y=${v.y} ${v.w}x${v.h}` : "MISSING", "\n  ", v ? v.t : "");
await b.close();
