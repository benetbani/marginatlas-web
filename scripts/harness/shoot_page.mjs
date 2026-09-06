/**
 * THE PHOTOGRAPH TOOL for a rendered page: one section card and the band it
 * sits in, at each width, FROM THE VIEWPORT. Every capture scrolls the card
 * into a viewport tall enough to hold its band and clips there; nothing is
 * taken from a full-page capture, because a full-page capture paints a white
 * block over the page's fixed atmosphere layers (seen at 768 and, on a band,
 * at 1280, on 2026-09-05) and a photograph that lies is worse than none.
 * Moved from scratchpad/arch/shoot.mjs and viewport_shot.mjs on run 6 of the
 * build loop, which folded the two into one.
 *
 * usage: node scripts/harness/shoot_page.mjs <file-or-url> <#id | heading text> <out-prefix> [widths]
 *   widths default 1280,768,375. Writes <out>-<w>.jpeg (the card) and
 *   <out>-band-<w>.jpeg (its band) at device scale 2, and prints the measured
 *   rectangles. A heading text needle matches h1 to h3, exact then contains.
 *   A URL is fetched with a browser user agent.
 */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const [, , target, needle, out = "scratchpad/harness/shots/shot", widthsArg = "1280,768,375"] = process.argv;
if (!target || !needle) {
  console.error("usage: shoot_page.mjs <file-or-url> <#id | heading text> <out-prefix> [widths]");
  process.exit(2);
}
const url = /^https?:/i.test(target) ? target : pathToFileURL(resolve(target)).href;
const widths = widthsArg.split(",").map(Number);
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const PAD = 12;

const b = await chromium.launch();
for (const w of widths) {
  const ctx = await b.newContext({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 2, userAgent: UA });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "load", timeout: 60000 });
  await p.evaluate(() => (document.fonts ? document.fonts.ready : null));
  await p.evaluate(async () => { for (const im of document.images) { im.loading = "eager"; try { await im.decode(); } catch { /* the capture goes on */ } } });
  await p.waitForTimeout(250);
  const found = await p.evaluate((needle) => {
    let h = null;
    if (needle.startsWith("#")) h = document.querySelector(needle);
    else {
      const hs = [...document.querySelectorAll("h1,h2,h3")];
      const n = needle.toLowerCase();
      h = hs.find((e) => e.textContent.trim().toLowerCase() === n) || hs.find((e) => e.textContent.trim().toLowerCase().includes(n));
    }
    if (!h) return null;
    let card = h;
    if (!needle.startsWith("#")) {
      let el = h;
      for (let i = 0; i < 10 && el; i++) { el = el.parentElement; if (el && /rounded-\[/.test(String(el.className || ""))) { card = el; break; } }
      if (card === h) card = h.closest("[id]") || h.closest("section,article") || h;
    }
    const band = card.parentElement;
    const r = (e) => { const bb = e.getBoundingClientRect(); return { x: bb.x + scrollX, y: bb.y + scrollY, width: bb.width, height: bb.height }; };
    return { card: r(card), band: band ? r(band) : null, id: card.id || null, cls: String(card.className || "").slice(0, 120) };
  }, needle);
  if (!found) { console.log(w, "NOT FOUND"); await ctx.close(); continue; }
  const tall = Math.ceil(Math.max(found.card.height, found.band ? found.band.height : 0) + PAD * 4);
  await p.setViewportSize({ width: w, height: Math.min(6000, Math.max(900, tall)) });
  const shoot = async (rect, file) => {
    // Scroll so the rectangle sits inside the viewport, then clip in viewport coordinates.
    await p.evaluate((y) => window.scrollTo(0, Math.max(0, y)), rect.y - PAD * 2);
    await p.waitForTimeout(120);
    const sy = await p.evaluate(() => scrollY);
    await p.screenshot({ path: file, type: "jpeg", quality: 88, clip: { x: Math.max(0, rect.x - PAD), y: Math.max(0, rect.y - sy - PAD), width: Math.min(w, rect.width + PAD * 2), height: rect.height + PAD * 2 } });
  };
  await shoot(found.card, `${out}-${w}.jpeg`);
  if (found.band) await shoot(found.band, `${out}-band-${w}.jpeg`);
  const round = (o) => o && Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Math.round(v)]));
  console.log(w, JSON.stringify({ card: round(found.card), band: round(found.band), id: found.id, cls: found.cls }));
  await ctx.close();
}
await b.close();
