/**
 * THE WHITE-SPACE FILTER FOR A RENDERED PAGE. The founder, 2026-09-05, on the
 * salaries card beside the note list: "correct massive white space... the
 * harness should have a clear filter to remove massive white spaces at
 * sections." The site's emptiness gate (E6) reads four static artefacts under
 * docs and never the country page, which is how a card three fifths blank
 * passed a chain of 136 gates. This check reads a LIVE render of a page from
 * scripts/harness/render_page.tsx and measures every section card at three
 * widths.
 *
 * WHAT IT MEASURES, the same rule as E6 so one rule holds site-wide: the
 * largest empty rectangle inside each section card, on an occupancy grid of
 * every inked leaf (text, images, filled tracks, hairlines). A card fails when
 * that rectangle is at least a quarter of the card each way, floored at 120px.
 * Equal heights are the rule (founder ruling 7 of 2026-09-04), so a hole is
 * never fixed by unstretching a card; it is fixed by pairing cards whose
 * contents come close to one height, or by giving the short card its content.
 *
 * BLIND SPOT: a static render loads web fonts if the network answers and the
 * fallback stack if not, so a wrap can differ by a line; and it cannot tell a
 * hole that waits for data from a hole in the design, which is why every red
 * names its section.
 *
 * usage: node scripts/harness/check_page_holes.mjs <rendered.html ...> [--shots]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { basename } from "node:path";

const WIDTHS = [1280, 768, 375];
const args = process.argv.slice(2);
const shots = args.includes("--shots");
const files = args.filter((a) => !a.startsWith("--"));
if (files.length === 0) { console.error("usage: node scripts/harness/check_page_holes.mjs <rendered.html ...> [--shots]"); process.exit(2); }

function inPage() {
  const out = [];
  const cards = [...document.querySelectorAll('main [class*="rounded-[14px]"]')].filter((c) => c.getClientRects().length && !c.parentElement.closest('[class*="rounded-[14px]"]'));
  for (const card of cards) {
    const id = card.id || card.querySelector("[id]")?.id || (card.querySelector("h1,h2,h3")?.textContent || "").trim().toLowerCase() || "card";
    const cb = card.getBoundingClientRect(); const cs = getComputedStyle(card);
    const x0 = cb.left + parseFloat(cs.paddingLeft), x1 = cb.right - parseFloat(cs.paddingRight), y0 = cb.top + parseFloat(cs.paddingTop), y1 = cb.bottom - parseFloat(cs.paddingBottom);
    const W = x1 - x0, H = y1 - y0, COLS = 48, ROW = 6; const nRows = Math.max(1, Math.round(H / ROW));
    const grid = Array.from({ length: nRows }, () => new Uint8Array(COLS));
    const mark = (b) => {
      const c0 = Math.max(0, Math.floor((b.left - x0) / W * COLS)), c1 = Math.min(COLS - 1, Math.ceil((b.right - x0) / W * COLS) - 1);
      const r0 = Math.max(0, Math.floor((b.top - y0) / ROW)), r1 = Math.min(nRows - 1, Math.ceil((b.bottom - y0) / ROW) - 1);
      for (let rr = r0; rr <= r1; rr++) for (let cc = c0; cc <= c1; cc++) grid[rr][cc] = 1;
    };
    for (const el of card.querySelectorAll("*")) {
      if (el.getClientRects().length === 0) continue;
      const es = getComputedStyle(el);
      const b0 = el.getBoundingClientRect();
      /* a hairline is ink: row rules and dividers break the emptiness the eye would read as a hole */
      if (parseFloat(es.borderBottomWidth) > 0 && !/rgba\(0, 0, 0, 0\)/.test(es.borderBottomColor)) mark({ left: b0.left, right: b0.right, top: b0.bottom - 2, bottom: b0.bottom + 2 });
      if (parseFloat(es.borderTopWidth) > 0 && !/rgba\(0, 0, 0, 0\)/.test(es.borderTopColor)) mark({ left: b0.left, right: b0.right, top: b0.top - 2, bottom: b0.top + 2 });
      const txt = (el.textContent || "").trim(); const isLeaf = el.children.length === 0 || el.tagName === "svg" || el.tagName === "IMG";
      if (!isLeaf || (!txt && el.tagName !== "svg" && el.tagName !== "IMG" && !es.backgroundColor.match(/rgba?\((?!0, 0, 0, 0)/))) continue;
      if (b0.width === 0 || b0.height === 0) continue;
      mark(b0);
    }
    let best = { area: 0, w: 0, h: 0 }; const hts = new Array(COLS).fill(0);
    for (let rr = 0; rr < nRows; rr++) {
      for (let cc = 0; cc < COLS; cc++) hts[cc] = grid[rr][cc] ? 0 : hts[cc] + 1;
      const st = [];
      for (let cc = 0; cc <= COLS; cc++) {
        const h = cc < COLS ? hts[cc] : 0;
        while (st.length && hts[st[st.length - 1]] >= h) { const top = st.pop(); const height = hts[top]; const width = st.length ? cc - st[st.length - 1] - 1 : cc; const area = height * width; if (area > best.area) best = { area, w: width, h: height }; }
        st.push(cc);
      }
    }
    const band = card.parentElement; const bb = band ? band.getBoundingClientRect() : null;
    out.push({ id, cardW: Math.round(W), cardH: Math.round(H), holeW: Math.round(best.w / COLS * W), holeH: best.h * ROW, bandW: bb ? Math.round(bb.width) : null, siblings: band ? band.children.length : 1, x: Math.round(cb.left), y: Math.round(cb.top + scrollY) });
  }
  return { out, pageScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 };
}

const reds = [];
const red = (page, w, id, msg) => reds.push({ page, w, id, msg });
const browser = await chromium.launch();
for (const file of files) {
  const name = basename(file).replace(/\.html$/, "");
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.evaluate(async () => { for (const im of document.images) { im.loading = "eager"; try { await im.decode(); } catch { /* not this check's business */ } } });
    const { out, pageScroll } = await page.evaluate(inPage);
    if (pageScroll) red(name, w, "page", "BOTCHED MOBILE: the page scrolls sideways");
    /* A PAGE WITH NO SECTION CARD UNDER MAIN IS NOT A PASS: a render that lost
       its landmark or its cards would otherwise sail through with zero holes. */
    if (out.length === 0) red(name, w, "page", "NO SECTIONS: no section card found under main; the render or the landmark is broken");
    for (const c of out) {
      const minW = Math.max(120, c.cardW / 4), minH = Math.max(120, c.cardH / 4);
      if (c.holeW >= minW && c.holeH >= minH) red(name, w, c.id, `WHITE SPACE: a blank rectangle ${c.holeW}x${c.holeH} inside a ${c.cardW}x${c.cardH} card${c.siblings > 1 ? ` (one of ${c.siblings} in its band)` : ""}`);
    }
    if (shots) {
      mkdirSync("scratchpad/harness/shots", { recursive: true });
      await page.screenshot({ path: `scratchpad/harness/shots/page-${name}-${w}.jpeg`, type: "jpeg", quality: 80, fullPage: true });
    }
    console.log(`${name}@${w}: ${out.length} section cards, ${out.filter((c) => c.holeW >= Math.max(120, c.cardW / 4) && c.holeH >= Math.max(120, c.cardH / 4)).length} with a hole`);
    await ctx.close();
  }
}
await browser.close();
console.log(`page holes: ${files.length} page(s) x ${WIDTHS.length} widths, ${reds.length} red(s)`);
for (const r of reds) console.log(`  ${r.page}@${r.w} #${r.id}: ${r.msg}`);
process.exit(reds.length ? 1 : 0);
