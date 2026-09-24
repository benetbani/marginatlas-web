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
import { preflight } from "./preflight.mjs";

/* THE GROUND FIRST (sys:harness-preflight, run 24): the site root, the browser on disk, free memory printed; a wrong ground stops here with the remedy. */
preflight({ browser: true, name: "shoot_page" });

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
  /* BOTH FACES, ASKED FOR BY NAME, BEFORE THE SHUTTER. `document.fonts.ready`
     alone resolves as soon as the faces the page has ALREADY USED have
     arrived; a webfont nothing has drawn yet is still "loading" at that
     moment, so a capture could print the figure face's fallback and look
     like a finished page. Measured on 2026-09-11, before the figure face was
     wired: Space Grotesk sat at `loading` while `fonts.ready` had resolved.
     This file's own rule is that a photograph which lies is worse than none. */
  await p.evaluate(async () => {
    if (!document.fonts) return;
    for (const w of [400, 500, 600, 700]) {
      await Promise.allSettled([document.fonts.load(`${w} 16px Geist`), document.fonts.load(`${w} 16px 'Space Grotesk'`)]);
    }
    await document.fonts.ready;
  });
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
  /* A LIVE PAGE'S CHROME (2026-09-24): a URL carries the site's sticky header
     (`header.sticky`, top 0), and a capture that scrolls the card to the top
     of the window shoots the header over the card's opener (measured on the
     live trade page: the licence card's kicker covered at 1280, its lead's
     label at 375). A render has no chrome. So on a URL every `header` whose
     position is sticky or fixed is hidden before the shutter, in place, and
     nothing inside the page's cards is touched. */
  if (/^https?:/i.test(target)) await p.evaluate(() => { for (const el of document.querySelectorAll("header")) { const pos = getComputedStyle(el).position; if (pos === "sticky" || pos === "fixed") el.style.visibility = "hidden"; } });
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
