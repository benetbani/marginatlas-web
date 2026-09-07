/**
 * CROP ONE STORY from the archetype sheet by its kind and key, from the
 * viewport (no full-page capture, no fixed-layer artefact). Moved from
 * scratchpad/arch/crop_story.mjs on run 6 of the build loop.
 *
 * usage: node scripts/harness/crop_story.mjs "<kind>/<key>" <out-prefix> [widths]
 *   kind is the sheet's data-stories value (answer-card, ranked-bars,
 *   compare-table, card-pager, tiers-table, range-strip, spectra-table,
 *   note-list, terminus, pay-bars); key is the story's data-story value
 *   ("GB", "GB:wide", "DE:premises"). Widths default 1280. Writes
 *   <out>-<w>.jpeg and prints the rectangle.
 */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { preflight } from "./preflight.mjs";

/* THE GROUND FIRST (sys:harness-preflight, run 24): the site root, the browser on disk, free memory printed; a wrong ground stops here with the remedy. */
preflight({ browser: true, name: "crop_story" });

const [, , key, out = "scratchpad/harness/shots/story", widthsArg = "1280"] = process.argv;
if (!key || !key.includes("/")) { console.error('usage: crop_story.mjs "<kind>/<key>" <out-prefix> [widths]'); process.exit(2); }
const url = pathToFileURL(resolve("scratchpad/harness/archetypes.html")).href;
const PAD = 12;
const b = await chromium.launch();
for (const w of widthsArg.split(",").map(Number)) {
  const ctx = await b.newContext({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "load", timeout: 60000 });
  await p.evaluate(() => (document.fonts ? document.fonts.ready : null));
  await p.evaluate(async () => { for (const im of document.images) { im.loading = "eager"; try { await im.decode(); } catch { /* the capture goes on */ } } });
  await p.waitForTimeout(250);
  const box = await p.evaluate((key) => {
    const [kind, k] = key.split("/");
    const s = document.querySelector(`[data-stories="${kind}"] [data-story="${k}"]`);
    if (!s) return null;
    let card = s.querySelector("[data-archetype]") || s;
    for (let i = 0; i < 6 && card && card !== s; i++) { if (/rounded-\[/.test(String(card.className || ""))) break; card = card.parentElement; }
    if (!card || card === s) card = s;
    const bb = card.getBoundingClientRect();
    return { x: bb.x + scrollX, y: bb.y + scrollY, width: bb.width, height: bb.height };
  }, key);
  if (!box) { console.log(w, "NOT FOUND"); await ctx.close(); continue; }
  await p.setViewportSize({ width: w, height: Math.min(6000, Math.max(900, Math.ceil(box.height + PAD * 4))) });
  await p.evaluate((y) => window.scrollTo(0, Math.max(0, y)), box.y - PAD * 2);
  await p.waitForTimeout(120);
  const sy = await p.evaluate(() => scrollY);
  await p.screenshot({ path: `${out}-${w}.jpeg`, type: "jpeg", quality: 88, clip: { x: Math.max(0, box.x - PAD), y: Math.max(0, box.y - sy - PAD), width: Math.min(w, box.width + PAD * 2), height: box.height + PAD * 2 } });
  console.log(w, JSON.stringify(Object.fromEntries(Object.entries(box).map(([k, v]) => [k, Math.round(v)]))));
  await ctx.close();
}
await b.close();
