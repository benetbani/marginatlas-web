/**
 * THE HARNESS CHECKS for the archetype stories, from the rendered page and its
 * photographs, at three widths. Each red names the instance, the width, the
 * element and the rule, in the founder's own failure words. Exit 1 on any red.
 *
 * Checks (HARNESS-SPEC 5, 6, 7, 8 as far as a static render can carry them):
 *  UNIVERSALITY: no element overflows its box, no page scroll sideways.
 *  LONE STAT / HOLE: no blank rectangle inside a card over a quarter of the
 *    card each way (E6), floored at 120px.
 *  UNEQUAL ROWS: in every key-value grid, cells in one row share their
 *    figure's top edge within 2px (ruling 8).
 *  NO HIERARCHY: each card has exactly one element at the answer size, at
 *    least 1.6x the next size (rule 16).
 *  LADDER: every font size on the ladder.
 *  ACCENT: at most one accent-coloured text element per card.
 *  PROMISE: a subtitle naming registration only when a registration cell
 *    renders.
 *  REPETITION: no micro label repeated inside one card.
 * BLIND SPOT: it measures a static render with web fonts loaded from the
 * network if reachable and the fallback stack if not; a wrap that depends on
 * the exact font can differ by a line. It cannot judge taste.
 * usage: node scripts/harness/check_archetypes.mjs [--shots]
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";

const LADDER = new Set([10, 12, 14, 16, 20, 24, 30, 40]);
const WIDTHS = [1280, 768, 375];
const shots = process.argv.includes("--shots");
const file = "scratchpad/harness/archetypes.html";
const instances = JSON.parse(readFileSync("scratchpad/harness/instances.json", "utf8"));
const reds = [];
const datas = [];
const red = (inst, w, rule, msg) => reds.push({ inst, w, rule, msg });
const data = (inst, rule, msg) => datas.push({ inst, rule, msg });

function inPage() {
  const ladder = [10, 12, 14, 16, 20, 24, 30, 40];
  const out = [];
  const accentRgb = (() => { const d = document.createElement("div"); d.style.color = "var(--terra-text)"; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; })();
  for (const story of document.querySelectorAll("[data-story]")) {
    const inst = story.getAttribute("data-story");
    const card = story.querySelector("[data-archetype='answer-card']");
    const r = { inst, overflow: [], sizes: [], accents: 0, answerSizes: [], rows: [], labels: [], hole: null, subtitle: "", cells: [], state: "" };
    if (!card) { out.push(r); continue; }
    for (const el of card.querySelectorAll("*")) {
      const cs = getComputedStyle(el);
      if (el.scrollWidth > el.clientWidth + 1 && cs.overflowX !== "hidden" && cs.display !== "inline") r.overflow.push(el.className.toString().slice(0, 40));
      const txt = (el.textContent || "").trim();
      if (txt && el.children.length === 0) {
        const fs = parseFloat(cs.fontSize); r.sizes.push(fs);
        if (cs.color === accentRgb) r.accents++;
      }
    }
    r.state = card.querySelector("[data-state]")?.getAttribute("data-state") || "";
    const ans = card.querySelector("[data-answer] .fig");
    if (ans) r.answerSizes.push(parseFloat(getComputedStyle(ans).fontSize));
    const grid = card.querySelector("[data-archetype='kv-grid']");
    if (grid) {
      const cells = [...grid.querySelectorAll("[data-kv-cell]")];
      r.cells = cells.map((c) => c.getAttribute("data-kv-cell"));
      const figs = cells.map((c) => { const f = c.querySelector(".fig"); const b = f.getBoundingClientRect(); const cb = c.getBoundingClientRect(); return { top: Math.round(b.top), left: Math.round(cb.left), cellTop: Math.round(cb.top) }; });
      // group cells into rows by cellTop
      const rows = new Map(); for (const f of figs) { const k = Math.round(f.cellTop / 4); if (!rows.has(k)) rows.set(k, []); rows.get(k).push(f.top); }
      r.rows = [...rows.values()];
      r.labels = cells.map((c) => c.querySelector("div div")?.textContent?.trim() || "");
    }
    r.subtitle = card.querySelector("p")?.textContent || "";
    // the largest empty rectangle inside the card (E6), on a 6px grid
    const cb = card.getBoundingClientRect(); const cs = getComputedStyle(card);
    const x0 = cb.left + parseFloat(cs.paddingLeft), x1 = cb.right - parseFloat(cs.paddingRight), y0 = cb.top + parseFloat(cs.paddingTop), y1 = cb.bottom - parseFloat(cs.paddingBottom);
    const W = x1 - x0, H = y1 - y0, COLS = 48, ROW = 6; const nRows = Math.max(1, Math.round(H / ROW));
    const grid2 = Array.from({ length: nRows }, () => new Uint8Array(COLS));
    for (const el of card.querySelectorAll("*")) {
      const txt = (el.textContent || "").trim(); const isLeaf = el.children.length === 0 || el.tagName === "svg" || el.tagName === "IMG";
      if (!isLeaf || (!txt && el.tagName !== "svg" && el.tagName !== "IMG" && !getComputedStyle(el).backgroundColor.match(/rgba?\((?!0, 0, 0, 0)/))) continue;
      const b = el.getBoundingClientRect(); if (b.width === 0 || b.height === 0) continue;
      const c0 = Math.max(0, Math.floor((b.left - x0) / W * COLS)), c1 = Math.min(COLS - 1, Math.ceil((b.right - x0) / W * COLS) - 1);
      const r0 = Math.max(0, Math.floor((b.top - y0) / ROW)), r1 = Math.min(nRows - 1, Math.ceil((b.bottom - y0) / ROW) - 1);
      for (let rr = r0; rr <= r1; rr++) for (let cc = c0; cc <= c1; cc++) grid2[rr][cc] = 1;
    }
    // largest empty rectangle (histogram method)
    let best = { area: 0, w: 0, h: 0 }; const hts = new Array(COLS).fill(0);
    for (let rr = 0; rr < nRows; rr++) {
      for (let cc = 0; cc < COLS; cc++) hts[cc] = grid2[rr][cc] ? 0 : hts[cc] + 1;
      const st = [];
      for (let cc = 0; cc <= COLS; cc++) {
        const h = cc < COLS ? hts[cc] : 0;
        while (st.length && hts[st[st.length - 1]] >= h) { const top = st.pop(); const height = hts[top]; const width = st.length ? cc - st[st.length - 1] - 1 : cc; const area = height * width; if (area > best.area) best = { area, w: width, h: height }; }
        st.push(cc);
      }
    }
    r.hole = { wPx: Math.round(best.w / COLS * W), hPx: best.h * ROW, cardW: Math.round(W), cardH: Math.round(H) };
    out.push(r);
  }
  return { out, pageScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 };
}

const browser = await chromium.launch();
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  const { out, pageScroll } = await page.evaluate(inPage);
  if (pageScroll) red("page", w, "BOTCHED MOBILE", "the page scrolls sideways");
  for (const r of out) {
    if (r.overflow.length) red(r.inst, w, "BOTCHED MOBILE", `overflowing: ${r.overflow.join(" | ")}`);
    for (const s of new Set(r.sizes)) if (!LADDER.has(Math.round(s))) red(r.inst, w, "LADDER", `font size ${s}px is not on the ladder`);
    if (r.state === "no-answer") { if (w === WIDTHS[0]) data(r.inst, "NO ANSWER", "no small-business regime row is on file; the card shows the state word"); }
    else if (r.answerSizes.length !== 1) red(r.inst, w, "NO HIERARCHY", `${r.answerSizes.length} answer figures`);
    else { const next = Math.max(...r.sizes.filter((s) => s < r.answerSizes[0] - 0.5)); if (r.answerSizes[0] / next < 1.6) red(r.inst, w, "NO HIERARCHY", `answer ${r.answerSizes[0]} against ${next}, under 1.6x`); }
    if (r.accents > 1) red(r.inst, w, "ACCENT", `${r.accents} accent texts in one card`);
    for (const row of r.rows) if (Math.max(...row) - Math.min(...row) > 2) red(r.inst, w, "UNEQUAL", `figures in one grid row at tops ${row.join(", ")}`);
    const dup = r.labels.filter((l, i) => l && r.labels.indexOf(l) !== i); if (dup.length) red(r.inst, w, "REPETITION", `label repeated: ${[...new Set(dup)].join(", ")}`);
    const promisesRegister = /register/i.test(r.subtitle); const hasRegister = r.cells.includes("llc-cost");
    if (promisesRegister && !hasRegister) red(r.inst, w, "PROMISE", `the subtitle promises registration and no registration cell renders`);
    if (r.hole && r.hole.wPx >= Math.max(120, r.hole.cardW / 4) && r.hole.hPx >= Math.max(120, r.hole.cardH / 4)) red(r.inst, w, "LONE STAT", `a blank rectangle ${r.hole.wPx}x${r.hole.hPx} inside a ${r.hole.cardW}x${r.hole.cardH} card`);
  }
  if (shots) {
    mkdirSync("scratchpad/harness/shots", { recursive: true });
    await page.screenshot({ path: `scratchpad/harness/shots/archetypes-${w}.jpeg`, type: "jpeg", quality: 85, fullPage: true });
  }
  await ctx.close();
}
await browser.close();
const byInst = {};
for (const r of reds) (byInst[`${r.inst}@${w(r)}`] ??= []).push(`${r.rule}: ${r.msg}`);
function w(r) { return r.w; }
console.log(`archetype harness: ${instances.length} instances x ${WIDTHS.length} widths, ${reds.length} design red(s), ${datas.length} data red(s)`);
for (const [k, v] of Object.entries(byInst)) console.log(`  ${k}\n    ${v.join("\n    ")}`);
if (datas.length) { console.log("  DATA, for the data track, not the drawing:"); for (const d of datas) console.log(`    ${d.inst}: ${d.rule}, ${d.msg}`); }
process.exit(reds.length ? 1 : 0);
