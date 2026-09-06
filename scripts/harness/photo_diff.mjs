/**
 * BEFORE AND AFTER, SIDE BY SIDE: one picture from two photographs, both at the
 * same scale, each under its label and its size, with the size delta printed
 * between them, so a ledger entry can show a fix in one image instead of two
 * that the reader has to hold in mind together. The build loop's system row
 * sys:photo-diff (run 15, 2026-09-06).
 *
 * usage: node scripts/harness/photo_diff.mjs <before.jpeg> <after.jpeg> <out.jpeg> [before-label] [after-label]
 *   Both inputs are shown at one scale (the harness photographs are device
 *   scale 2, so each is laid out at half its pixel width and captured at
 *   device scale 2, pixel for pixel). When the pair is wider than 1800
 *   layout pixels both are shrunk by one factor, printed on the picture.
 *   Prints the two sizes and the delta; exit 2 on a missing file.
 */
import { chromium } from "playwright";
import { readFileSync, existsSync } from "node:fs";
import { extname } from "node:path";

const [, , beforePath, afterPath, out, beforeLabel = "before", afterLabel = "after"] = process.argv;
if (!beforePath || !afterPath || !out) {
  console.error("usage: photo_diff.mjs <before.jpeg> <after.jpeg> <out.jpeg> [before-label] [after-label]");
  process.exit(2);
}
for (const f of [beforePath, afterPath]) {
  if (!existsSync(f)) { console.error(`photo_diff: no such file ${f}`); process.exit(2); }
}
const mime = (f) => (/^\.(jpe?g)$/i.test(extname(f)) ? "image/jpeg" : "image/png");
const uri = (f) => `data:${mime(f)};base64,${readFileSync(f).toString("base64")}`;

const SCALE = 2; // the harness photographs' device scale; one layout pixel is two picture pixels
const MAX_LAYOUT_W = 1800;
const GAP = 24, PAD = 16;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body { margin: 0; background: #f4f2ee; font-family: ui-sans-serif, system-ui, sans-serif; color: #1c1b19; }
  #wrap { display: inline-flex; align-items: flex-start; gap: ${GAP}px; padding: ${PAD}px; }
  figure { margin: 0; }
  figcaption { font-size: 13px; line-height: 18px; margin-bottom: 6px; color: #4a4843; white-space: nowrap; }
  figcaption b { color: #1c1b19; font-weight: 600; }
  img { display: block; outline: 1px solid #d8d4cc; }
  #delta { align-self: center; max-width: 180px; font-size: 13px; line-height: 18px; color: #4a4843; }
  #delta b { display: block; font-size: 15px; color: #1c1b19; margin-bottom: 4px; }
</style></head><body><div id="wrap">
  <figure><figcaption><b>${beforeLabel}</b> <span id="bsize"></span></figcaption><img id="b" src="${uri(beforePath)}"></figure>
  <div id="delta"></div>
  <figure><figcaption><b>${afterLabel}</b> <span id="asize"></span></figcaption><img id="a" src="${uri(afterPath)}"></figure>
</div></body></html>`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 2000, height: 1200 }, deviceScaleFactor: SCALE });
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: "load" });
const info = await page.evaluate(({ SCALE, MAX_LAYOUT_W, GAP, PAD }) => {
  const b = document.getElementById("b"), a = document.getElementById("a");
  const bw = b.naturalWidth, bh = b.naturalHeight, aw = a.naturalWidth, ah = a.naturalHeight;
  let layoutScale = 1 / SCALE;
  const natural = (bw + aw) / SCALE + GAP + 180 + PAD * 2;
  if (natural > MAX_LAYOUT_W) layoutScale = layoutScale * (MAX_LAYOUT_W / natural);
  b.style.width = `${bw * layoutScale}px`; a.style.width = `${aw * layoutScale}px`;
  const dw = aw - bw, dh = ah - bh;
  const word = (d, what) => d === 0 ? `${what} unchanged` : `${what} ${d < 0 ? Math.abs(d) + " px less" : d + " px more"}`;
  const pct = bh ? Math.round((dh / bh) * 100) : 0;
  document.getElementById("bsize").textContent = `${bw}×${bh} px`;
  document.getElementById("asize").textContent = `${aw}×${ah} px`;
  const shrunk = layoutScale < 1 / SCALE ? ` Both shown at ${Math.round(layoutScale * SCALE * 100)}% to fit.` : "";
  document.getElementById("delta").innerHTML = `<b>${dh === 0 && dw === 0 ? "same size" : word(dh, "height")}${dh !== 0 ? ` (${pct > 0 ? "+" : ""}${pct}%)` : ""}</b>${word(dw, "width")}.${shrunk}`;
  const r = document.getElementById("wrap").getBoundingClientRect();
  return { bw, bh, aw, ah, dw, dh, pct, width: Math.ceil(r.width), height: Math.ceil(r.height), layoutScale };
}, { SCALE, MAX_LAYOUT_W, GAP, PAD });
await page.setViewportSize({ width: Math.max(320, info.width), height: Math.max(200, info.height) });
await page.waitForTimeout(100);
await page.screenshot({ path: out, type: /\.png$/i.test(out) ? "png" : "jpeg", ...(/\.png$/i.test(out) ? {} : { quality: 90 }), clip: { x: 0, y: 0, width: info.width, height: info.height } });
console.log(`before ${info.bw}x${info.bh}  after ${info.aw}x${info.ah}  delta width ${info.dw >= 0 ? "+" : ""}${info.dw} height ${info.dh >= 0 ? "+" : ""}${info.dh} (${info.pct >= 0 ? "+" : ""}${info.pct}%)  shown at ${Math.round(info.layoutScale * SCALE * 100)}%  wrote ${out} ${info.width}x${info.height} layout px`);
await browser.close();
