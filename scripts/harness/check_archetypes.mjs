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
 *  NOTES: a label on one line, a fact within four lines, at most five notes
 *    (the founder's wall-of-text verdict, 2026-08-27).
 *  TERMINUS: at most three doors, one pill, distinct first words, a door on
 *    one line from 768 up and within two on a phone.
 *  PAY BARS: every fill inside its track, the edge label inside the card, the
 *    two words present, a withheld pair drawing no bar.
 *  KV GRID: when its groups sit side by side, their first figures share one
 *    top (the reserved heading line), and no group is left alone in a row.
 *  SPECTRA: rows one height, every dot inside its track (a read of 0 or 1
 *    at the ends, never clamped), pole words on one line, one dot colour a table.
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
const instancesByKind = JSON.parse(readFileSync("scratchpad/harness/instances.json", "utf8"));
const instances = Object.values(instancesByKind).flat();
const reds = [];
const datas = [];
const red = (inst, w, rule, msg) => reds.push({ inst, w, rule, msg });
const data = (inst, rule, msg) => datas.push({ inst, rule, msg });

function inPage() {
  const ladder = [10, 12, 14, 16, 20, 24, 30, 40];
  const out = [];
  const accentRgb = (() => { const d = document.createElement("div"); d.style.color = "var(--terra-text)"; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; })();
  for (const story of document.querySelectorAll("[data-story]")) {
    const inst = story.closest("[data-stories]")?.getAttribute("data-stories") + ":" + story.getAttribute("data-story");
    const card = story.querySelector("[data-archetype]");
    const r = { inst, kind: card?.getAttribute("data-archetype") || "", overflow: [], sizes: [], accents: 0, answerSizes: [], rows: [], labels: [], hole: null, subtitle: "", cells: [], state: "", bars: [], tableRows: [], selfOmit: !!story.querySelector("[data-self-omit]") };
    if (!card) { out.push(r); continue; }
    for (const el of card.querySelectorAll("*")) {
      if (el.getClientRects().length === 0) continue; // display:none at this width
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
    r.subtitle = r.kind === "answer-card" ? (card.querySelector("p")?.textContent || "") : "";
    if (r.kind === "ranked-bars") {
      const top = card.querySelector("[data-idea='I2'] > div:first-child");
      const topY = top ? top.getBoundingClientRect().top : null;
      r.bars = [...card.querySelectorAll("[data-bar]")].map((li) => { const bar = li.querySelector("div[aria-hidden]"); const b = bar.getBoundingClientRect(); return { key: li.getAttribute("data-bar"), top: Math.round(b.top), h: Math.round(b.height), ruleTop: topY == null ? null : Math.round(topY) }; });
    }
    if (r.kind === "card-pager") {
      const cards = [...card.querySelectorAll("[data-card]")].filter((el) => el.getClientRects().length);
      const rowsMap = new Map(); for (const el of cards) { const b = el.getBoundingClientRect(); const k = Math.round(b.top / 4); if (!rowsMap.has(k)) rowsMap.set(k, []); rowsMap.get(k).push(Math.round(b.height)); }
      r.cardRows = [...rowsMap.values()];
      r.namesCut = cards.filter((el) => { const n = el.querySelector("span span"); return n && n.scrollWidth > n.clientWidth + 1; }).length;
      r.noImage = cards.filter((el) => !el.querySelector("img")).map((el) => el.getAttribute("data-card"));
      r.brokenImage = cards.filter((el) => { const im = el.querySelector("img"); return im && (!im.complete || im.naturalWidth === 0); }).map((el) => el.getAttribute("data-card"));
      r.imageCount = cards.length - r.noImage.length;
    }
    if (r.kind === "range-strip") {
      const labels = [...card.querySelectorAll("[data-mark-label]")].map((el) => el.getBoundingClientRect());
      const figs = [...card.querySelectorAll("[data-mark]")].map((el) => el.getBoundingClientRect());
      const overlaps = (rs) => { let n = 0; for (let a = 0; a < rs.length; a++) for (let b = a + 1; b < rs.length; b++) { const A = rs[a], B = rs[b]; if (A.left < B.right - 1 && B.left < A.right - 1 && A.top < B.bottom - 1 && B.top < A.bottom - 1) n++; } return n; };
      r.stripOverlaps = overlaps(labels) + overlaps(figs);
      const cb = card.getBoundingClientRect();
      r.stripOut = [...labels, ...figs].filter((b) => b.left < cb.left - 1 || b.right > cb.right + 1).length;
    }
    if (r.kind === "tiers-table") {
      const trs = [...card.querySelectorAll("[data-tier-row]")].filter((el) => el.getClientRects().length);
      r.tierRows = trs.map((el) => Math.round(el.getBoundingClientRect().height));
      r.headsCount = [...card.querySelectorAll("span")].filter((el) => el.getClientRects().length && /^(Fee|Time|Paperwork)$/.test((el.textContent || "").trim())).length;
    }
    if (r.kind === "spectra-table") {
      const trs = [...card.querySelectorAll("[data-spectrum-row]")].filter((el) => el.getClientRects().length);
      r.spectraRows = trs.map((el) => Math.round(el.getBoundingClientRect().height));
      r.dotsOut = 0; r.poleWraps = 0; const dotColors = new Set();
      for (const tr of trs) {
        const track = tr.querySelector("[data-track]"); const dot = tr.querySelector("[data-dot]");
        if (track && dot) { const t = track.getBoundingClientRect(), d = dot.getBoundingClientRect(); if (d.left < t.left - 0.5 || d.right > t.right + 0.5) r.dotsOut++; dotColors.add(getComputedStyle(dot).backgroundColor); }
        for (const p of tr.querySelectorAll("[data-pole]")) { const ps = getComputedStyle(p); const lh = parseFloat(ps.lineHeight) || parseFloat(ps.fontSize) * 1.25; if (p.getBoundingClientRect().height > lh * 1.5) r.poleWraps++; }
      }
      r.dotColors = dotColors.size;
    }
    if (r.kind === "note-list") {
      const lineOf = (el) => { const cs = getComputedStyle(el); return parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.3; };
      r.noteCount = card.querySelectorAll("[data-note]").length;
      r.labelWraps = [...card.querySelectorAll("[data-note-label]")].filter((el) => el.getBoundingClientRect().height > lineOf(el) * 1.5).length;
      r.factLines = [...card.querySelectorAll("[data-note-fact]")].map((el) => Math.round(el.getBoundingClientRect().height / lineOf(el)));
    }
    if (r.kind === "terminus") {
      const doors = [...card.querySelectorAll("[data-door]")];
      r.doorCount = doors.length;
      r.pillCount = doors.filter((d) => d.getAttribute("data-door-kind") === "pill").length;
      r.doorFirstWords = doors.map((d) => (d.textContent || "").trim().split(/\s+/)[0].toLowerCase());
      r.doorLines = doors.map((d) => { const cs = getComputedStyle(d); const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5; const inner = d.getBoundingClientRect().height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom); return Math.round(inner / lh); });
    }
    if (r.kind === "pay-bars") {
      const root = card.querySelector("[data-archetype='pay-bars']");
      r.payWithheld = root?.getAttribute("data-withheld") === "1";
      r.payBars = [...card.querySelectorAll("[data-bar]")].length;
      r.payOut = [...card.querySelectorAll("[data-track]")].filter((t) => { const b = t.querySelector("[data-bar]"); if (!b) return false; const tb = t.getBoundingClientRect(), bb = b.getBoundingClientRect(); return bb.right > tb.right + 0.5 || bb.left < tb.left - 0.5; }).length;
      const edge = card.querySelector("[data-edge]"); const cb2 = card.getBoundingClientRect();
      r.payEdgeOut = edge ? (edge.getBoundingClientRect().right > cb2.right + 1 || edge.scrollWidth > edge.clientWidth + 1 ? 1 : 0) : 0;
      const txt = card.textContent || ""; r.payWords = (/Minimum salary/.test(txt) ? 1 : 0) + (/Average salary/.test(txt) ? 1 : 0);
    }
    if (r.kind === "kv-grid") {
      const gs = [...card.querySelectorAll("[data-kv-group]")].filter((g) => g.getClientRects().length);
      const tops = gs.map((g) => Math.round(g.getBoundingClientRect().top));
      const sideBySide = gs.length > 1 && Math.max(...tops) - Math.min(...tops) <= 2;
      r.kvSide = sideBySide;
      r.kvFirstFigTops = sideBySide ? gs.map((g) => { const f = g.querySelector("[data-kv-cell] .fig"); return f ? Math.round(f.getBoundingClientRect().top) : null; }).filter((t) => t != null) : [];
    }
    if (r.kind === "compare-table") {
      const visible = [...card.querySelectorAll("[data-row]")].filter((el) => el.getBoundingClientRect().height > 0);
      r.tableRows = visible.map((el) => Math.round(el.getBoundingClientRect().height));
    }
    // the largest empty rectangle inside the card (E6), on a 6px grid
    const cb = card.getBoundingClientRect(); const cs = getComputedStyle(card);
    const x0 = cb.left + parseFloat(cs.paddingLeft), x1 = cb.right - parseFloat(cs.paddingRight), y0 = cb.top + parseFloat(cs.paddingTop), y1 = cb.bottom - parseFloat(cs.paddingBottom);
    const W = x1 - x0, H = y1 - y0, COLS = 48, ROW = 6; const nRows = Math.max(1, Math.round(H / ROW));
    const grid2 = Array.from({ length: nRows }, () => new Uint8Array(COLS));
    const mark = (b) => {
      const c0 = Math.max(0, Math.floor((b.left - x0) / W * COLS)), c1 = Math.min(COLS - 1, Math.ceil((b.right - x0) / W * COLS) - 1);
      const r0 = Math.max(0, Math.floor((b.top - y0) / ROW)), r1 = Math.min(nRows - 1, Math.ceil((b.bottom - y0) / ROW) - 1);
      for (let rr = r0; rr <= r1; rr++) for (let cc = c0; cc <= c1; cc++) grid2[rr][cc] = 1;
    };
    for (const el of card.querySelectorAll("*")) {
      if (el.getClientRects().length === 0) continue;
      const es = getComputedStyle(el);
      /* A HAIRLINE IS INK: a table's row rules and a list's dividers break the
         emptiness the eye would otherwise read as a hole, which is the same
         rule the site's own emptiness gate states. */
      const b0 = el.getBoundingClientRect();
      if (parseFloat(es.borderBottomWidth) > 0 && !/rgba\(0, 0, 0, 0\)/.test(es.borderBottomColor)) mark({ left: b0.left, right: b0.right, top: b0.bottom - 2, bottom: b0.bottom + 2 });
      if (parseFloat(es.borderTopWidth) > 0 && !/rgba\(0, 0, 0, 0\)/.test(es.borderTopColor)) mark({ left: b0.left, right: b0.right, top: b0.top - 2, bottom: b0.top + 2 });
      const txt = (el.textContent || "").trim(); const isLeaf = el.children.length === 0 || el.tagName === "svg" || el.tagName === "IMG";
      if (!isLeaf || (!txt && el.tagName !== "svg" && el.tagName !== "IMG" && !es.backgroundColor.match(/rgba?\((?!0, 0, 0, 0)/))) continue;
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
  /* Lazy images never enter a headless viewport; force them so a broken path
     is a red and a slow one is not. */
  await page.evaluate(async () => { for (const im of document.images) { im.loading = "eager"; try { await im.decode(); } catch { /* reported by the check */ } } });
  const { out, pageScroll } = await page.evaluate(inPage);
  if (pageScroll) red("page", w, "BOTCHED MOBILE", "the page scrolls sideways");
  for (const r of out) {
    if (r.overflow.length) red(r.inst, w, "BOTCHED MOBILE", `overflowing: ${r.overflow.join(" | ")}`);
    for (const s of new Set(r.sizes)) if (!LADDER.has(Math.round(s))) red(r.inst, w, "LADDER", `font size ${s}px is not on the ladder`);
    if (r.kind === "answer-card") {
      if (r.state === "no-answer") { if (w === WIDTHS[0]) data(r.inst, "NO ANSWER", "no small-business regime row is on file; the card shows the state word"); }
      else if (r.answerSizes.length !== 1) red(r.inst, w, "NO HIERARCHY", `${r.answerSizes.length} answer figures`);
      else { const next = Math.max(...r.sizes.filter((s) => s < r.answerSizes[0] - 0.5)); if (r.answerSizes[0] / next < 1.6) red(r.inst, w, "NO HIERARCHY", `answer ${r.answerSizes[0]} against ${next}, under 1.6x`); }
    }
    if (r.kind === "ranked-bars" && w === WIDTHS[0]) {
      for (const b of r.bars) if (b.ruleTop != null && b.top < b.ruleTop - 1) red(r.inst, w, "WORLD MAX", `bar ${b.key} rises above the world's-best rule`);
      if (r.accents !== 1) red(r.inst, w, "ACCENT", `${r.accents} accent texts; the leader's figure should be the one`);
    }
    if (r.kind === "card-pager") {
      for (const row of r.cardRows || []) if (Math.max(...row) - Math.min(...row) > 2) red(r.inst, w, "UNEQUAL", `cards in one row at heights ${row.join(", ")}`);
      if (r.namesCut) red(r.inst, w, "BOTCHED MOBILE", `${r.namesCut} city name(s) cut`);
      if (r.brokenImage && r.brokenImage.length) red(r.inst, w, "IMAGE BROKEN", `image did not load: ${r.brokenImage.join(", ")}`);
      if (w === WIDTHS[0] && r.noImage && r.noImage.length) data(r.inst, "IMAGE MISSING", `${r.noImage.length} card(s) without a photograph: ${r.noImage.join(", ")}`);
    }
    if (r.kind === "range-strip") {
      if (r.stripOverlaps) red(r.inst, w, "NO HIERARCHY", `${r.stripOverlaps} overlapping label(s) on the strip`);
      if (r.stripOut) red(r.inst, w, "BOTCHED MOBILE", `${r.stripOut} strip label(s) outside the card`);
    }
    if (r.kind === "tiers-table") {
      const hs = r.tierRows || []; if (hs.length > 1 && Math.max(...hs) - Math.min(...hs) > 2) red(r.inst, w, "UNEQUAL", `tier rows at heights ${hs.join(", ")}`);
      if (r.headsCount !== 3) red(r.inst, w, "REPETITION", `the three heads appear ${r.headsCount} times`);
    }
    if (r.kind === "spectra-table") {
      const hs = r.spectraRows || []; if (hs.length > 1 && Math.max(...hs) - Math.min(...hs) > 2) red(r.inst, w, "UNEQUAL", `spectrum rows at heights ${hs.join(", ")}`);
      if (r.dotsOut) red(r.inst, w, "OFF TRACK", `${r.dotsOut} dot(s) outside the track`);
      if (r.poleWraps) red(r.inst, w, "BOTCHED MOBILE", `${r.poleWraps} pole word(s) wrap to a second line`);
      if (r.dotColors > 1) red(r.inst, w, "ACCENT", `${r.dotColors} dot colours in one table`);
    }
    if (r.kind === "note-list") {
      if (r.labelWraps) red(r.inst, w, "WALL OF TEXT", `${r.labelWraps} label(s) wrap: a label that wraps is a sentence`);
      const walls = (r.factLines || []).filter((n) => n > 4).length; if (walls) red(r.inst, w, "WALL OF TEXT", `${walls} fact(s) run past four lines`);
      if (r.noteCount > 5) red(r.inst, w, "OVERLOAD", `${r.noteCount} notes, over five`);
    }
    if (r.kind === "terminus") {
      if (r.doorCount > 3) red(r.inst, w, "OVERLOAD", `${r.doorCount} doors, over three`);
      if (r.pillCount > 1) red(r.inst, w, "NO HIERARCHY", `${r.pillCount} pills; one door is the heavy one`);
      const fw = r.doorFirstWords || []; if (new Set(fw).size !== fw.length) red(r.inst, w, "REPETITION", `doors share a first word: ${fw.join(", ")}`);
      const cap = w >= 768 ? 1 : 2; const wrapped = (r.doorLines || []).filter((n) => n > cap).length; if (wrapped) red(r.inst, w, "BOTCHED MOBILE", `${wrapped} door(s) run past ${cap} line(s)`);
    }
    if (r.kind === "pay-bars") {
      if (r.payOut) red(r.inst, w, "WORLD MAX", `${r.payOut} fill(s) outside the track`);
      if (r.payEdgeOut) red(r.inst, w, "BOTCHED MOBILE", "the edge label is cut or outside the card");
      if (r.payWithheld && r.payBars) red(r.inst, w, "PROMISE", "a withheld pair draws a bar");
      if (!r.payWithheld && r.payBars === 2 && r.payWords !== 2) red(r.inst, w, "REPETITION", `the two words appear ${r.payWords} times, not twice`);
    }
    if (r.kind === "kv-grid" && r.kvSide) {
      const t = r.kvFirstFigTops || []; if (t.length > 1 && Math.max(...t) - Math.min(...t) > 2) red(r.inst, w, "UNEQUAL", `groups side by side with first figures at tops ${t.join(", ")}`);
    }
    if (r.kind === "compare-table" && r.tableRows.length > 1) {
      const hs = r.tableRows; if (Math.max(...hs) - Math.min(...hs) > 2) red(r.inst, w, "UNEQUAL", `table rows at heights ${hs.join(", ")}`);
    }
    if (r.kind !== "ranked-bars" && r.accents > 1) red(r.inst, w, "ACCENT", `${r.accents} accent texts in one card`);
    for (const row of r.rows) if (Math.max(...row) - Math.min(...row) > 2) red(r.inst, w, "UNEQUAL", `figures in one grid row at tops ${row.join(", ")}`);
    const dup = r.labels.filter((l, i) => l && r.labels.indexOf(l) !== i); if (dup.length) red(r.inst, w, "REPETITION", `label repeated: ${[...new Set(dup)].join(", ")}`);
    const promisesRegister = /register/i.test(r.subtitle); const hasRegister = r.cells.includes("llc-cost");
    if (r.kind === "answer-card" && promisesRegister && !hasRegister) red(r.inst, w, "PROMISE", `the subtitle promises registration and no registration cell renders`);
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
