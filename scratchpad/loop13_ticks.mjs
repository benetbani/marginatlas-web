/* loop13: measure the drawn tick positions of a country-page tick scale against
   the TRUE LINEAR fraction of the same figures, which is what a reader without a
   stated scale will read off the picture. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const slug = process.argv[2], sel = process.argv[3], w = Number(process.argv[4] || 1280);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: w, height: 1400 } });
await p.goto(pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href, { waitUntil: "load" });
const out = await p.evaluate((sel) => {
  const scale = [...document.querySelectorAll(sel + ' [role="img"]')].find((e) => e.querySelectorAll("span").length >= 3);
  if (!scale) return null;
  const sb = scale.getBoundingClientRect();
  const ticks = [...scale.querySelectorAll("span")].filter((s) => (s.getAttribute("style") || "").includes("left"))
    .map((s) => { const r = s.getBoundingClientRect(); return +(((r.left - sb.left) / sb.width) * 100).toFixed(1); });
  return { label: scale.getAttribute("aria-label"), boxW: Math.round(sb.width), ticks };
}, sel);
console.log(JSON.stringify(out, null, 1));
if (out) {
  const vals = (out.label.match(/\$[\d.,]+K?/g) || []).map((s) => {
    const n = parseFloat(s.replace(/[$,]/g, ""));
    return /K/.test(s) ? n * 1000 : n;
  });
  const lo = Math.min(...vals), hi = Math.max(...vals);
  console.log("figures:", vals.join(", "));
  console.log("DRAWN  fraction between the outer marks:", out.ticks.map((t, i) =>
    ((t - out.ticks[0]) / (out.ticks[out.ticks.length - 1] - out.ticks[0]) * 100).toFixed(1) + "%").join("  "));
  console.log("TRUE   linear fraction of the same set :", vals.map((v) => (((v - lo) / (hi - lo)) * 100).toFixed(1) + "%").join("  "));
}
await b.close();
