/* what each of the two cards actually prints, side by side, from the render */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1400 } });
await p.goto(pathToFileURL("E:/atlas/website/docs/loop/artifacts/final-pages/industry-restaurants.html").href, { waitUntil: "load" });
await p.waitForTimeout(300);
const out = await p.evaluate(() => {
  const grab = (id) => {
    const el = document.getElementById(id);
    if (!el) return { id, missing: true };
    const r = el.getBoundingClientRect();
    return { id, y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height),
      text: (el.textContent || "").replace(/\s+/g, " ").trim() };
  };
  const ids = [...document.querySelectorAll("[id]")].map(e => e.id).filter(Boolean);
  return { ids, kept: grab("kept"), neighbours: grab("neighbours") };
});
console.log("ALL IDS:", out.ids.join(" "));
console.log("\n#kept  y=%d %dx%d\n%s", out.kept.y, out.kept.w, out.kept.h, out.kept.text);
console.log("\n#neighbours  y=%d %dx%d\n%s", out.neighbours.y, out.neighbours.w, out.neighbours.h, out.neighbours.text);
await b.close();
