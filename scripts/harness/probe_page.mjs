/**
 * THE PAGE PROBE: every band and every section card of a rendered page at
 * each width, with the card's size and the height its content wants before
 * the equal-heights rule stretches it. The table the build loop's page row
 * reads (run 4). Moved from scratchpad/arch/page_probe.mjs on run 6.
 *
 * usage: node scripts/harness/probe_page.mjs <rendered.html> [widths]
 */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { preflight } from "./preflight.mjs";

/* THE GROUND FIRST (sys:harness-preflight, run 24): the site root, the browser on disk, free memory printed; a wrong ground stops here with the remedy. */
preflight({ browser: true, name: "probe_page" });

const [, , file, widthsArg = "1280,768,375"] = process.argv;
if (!file) { console.error("usage: probe_page.mjs <rendered.html> [widths]"); process.exit(2); }
const b = await chromium.launch();
for (const w of widthsArg.split(",").map(Number)) {
  const p = await (await b.newContext({ viewport: { width: w, height: 1200 } })).newPage();
  await p.goto(pathToFileURL(resolve(file)).href, { waitUntil: "load" });
  await p.evaluate(() => document.fonts && document.fonts.ready);
  const rows = await p.evaluate(() => {
    const cards = [...document.querySelectorAll('main [class*="rounded-[14px]"]')].filter((c) => c.getClientRects().length && !c.parentElement.closest('[class*="rounded-[14px]"]'));
    const bands = new Map();
    for (const c of cards) {
      const band = c.parentElement; if (!bands.has(band)) bands.set(band, []);
      const cb = c.getBoundingClientRect(); const cs = getComputedStyle(c);
      let bottom = cb.top + parseFloat(cs.paddingTop);
      /* a closed plus's hidden rows are not content (sys:closed-plus-ink, 2026-09-19): a closed <details> reports rects for what it hides */
      for (const el of c.querySelectorAll("*")) { if (!el.getClientRects().length) continue; { const d = el.closest("details"); if (d && !d.open) { const sum = d.querySelector(":scope > summary"); if (!sum || !sum.contains(el)) continue; } } const r = el.getBoundingClientRect(); if (r.height > 0 && r.bottom > bottom && r.bottom <= cb.bottom + 1) bottom = r.bottom; }
      const natural = Math.round(bottom - cb.top + parseFloat(cs.paddingBottom));
      bands.get(band).push({ id: c.id || c.querySelector("[id]")?.id || "?", w: Math.round(cb.width), h: Math.round(cb.height), natural });
    }
    return [...bands.entries()].map(([band, cs]) => ({
      band: (band.getAttribute("data-hero") != null ? "hero " : "") + (band.closest("[data-terminus]") ? "terminus " : "") + (band.closest("[data-wide-table]") ? "wide-table " : "") + String(band.className).replace(/\[&:has[^\]]*\]:\S+/g, "").replace(/mt-8 grid grid-cols-1 items-stretch gap-8 \[&>\*\]:h-full/, "band").trim(),
      cards: cs,
    }));
  });
  console.log(`--- ${w} ---`);
  for (const r of rows) console.log(r.band.padEnd(44), r.cards.map((c) => `${c.id} ${c.w}x${c.h} (content ${c.natural})`).join(" | "));
  await p.context().close();
}
await b.close();
