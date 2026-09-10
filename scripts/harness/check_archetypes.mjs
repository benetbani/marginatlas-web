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
 *  ACCENT: at most one accent-coloured text element per card. A ranked-bars
 *    card carries none , its one loud moment is a BLACK PILL on the row the
 *    card declares as the leader (`data-leader-key`), not a colour (task 12,
 *    2026-09-10), so its own law is stricter: zero accent text, exactly one
 *    pill, on the leader's row, whether that pill sits on the NAME or on the
 *    FIGURE (widened, task 13 fix wave; on the districts card the reference
 *    is always the leader, so its pill always sits on the NAME). Checked at
 *    every width because the pill is drawn in three forms (the bar figure,
 *    the wide table, the phone table) and only one of the three shows at a
 *    time.
 *  TRACKS ADRIFT / OUT OF ORDER: on a ranked card every track begins at one
 *    left edge and runs one length within a pixel, and the bars drawn in them
 *    rise in the order their values do. Both halves of one law, and one
 *    fault: a per-row column template let the reference row's track begin
 *    40px left of its siblings', so the cheapest district drew the longer bar
 *    (task 13 alignment fix, 2026-09-10).
 *  ROWS CUT: a drawing that declares its row count draws every row at every
 *    width (the sheet's copy of the page filter's rule; ranked bars declare
 *    both their forms since run 25).
 *  HEADLINE: an answer card at page level draws exactly one h1; at section
 *    level (a page's second answer, the city's verdict) none, so a page keeps
 *    one headline (city:verdict, run 23).
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
 *  INCOME BREAKDOWN: every drawn segment's share plus net sums to a hundred
 *    within a stated tolerance (task 11); no segment renders under six
 *    pixels wide (a sliver no hatch or swatch could carry); the legend names
 *    exactly the drawn segments, no fewer and no more.
 * BLIND SPOT: it measures a static render with web fonts loaded from the
 * network if reachable and the fallback stack if not; a wrap that depends on
 * the exact font can differ by a line. It cannot judge taste.
 * usage: node scripts/harness/check_archetypes.mjs [--shots]
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { preflight } from "./preflight.mjs";

/* THE GROUND FIRST (sys:harness-preflight, run 24): the site root, the browser on disk, free memory printed; a wrong ground stops here with the remedy. */
preflight({ browser: true, name: "check_archetypes" });

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
    r.level = card.getAttribute("data-level") || ""; r.h1 = card.querySelectorAll("h1").length;
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
      /* THE PILL LAW'S GROUND TRUTH (task 12): the card declares its own
         leader once, on the root (`data-leader-key`), independently of
         wherever the pill itself renders; comparing the two is what makes
         "a pill on a non-leader" a provable fault rather than a tautology.
         The pill's ROW comes from its `[data-row]` ancestor, so the check
         holds wherever inside that row the pill sits, its figure or its name
         (task 13 fix wave). Only the VISIBLE pill counts , at any width all
         but one of the three forms (bar figure, wide table, phone table) is
         display:none, exactly the same getClientRects() test the rest of this
         walk uses. */
      r.leaderKey = card.getAttribute("data-leader-key") || "";
      const pills = [...card.querySelectorAll("[data-pill]")].filter((el) => el.getClientRects().length > 0);
      r.pillCount = pills.length;
      r.pillKey = pills.length ? (pills[0].closest("[data-row]")?.getAttribute("data-row") || "") : "";
      /* THE DRAWN LENGTH BESIDE THE DECLARED VALUE (task 13 alignment fix,
         2026-09-10), for whichever of the three forms is visible at this
         width. A row's mark is the fill inside its `[data-track]` in the table
         form (a width) and the standing column in the bars form (a height);
         the phone form draws no mark and is dropped by the null below rather
         than counted as a zero-length bar. Only visible rows: at any width two
         of the three forms are display:none, the same getClientRects() test
         the rest of this walk uses. */
      r.ranked = [...card.querySelectorAll("[data-row][data-value]")]
        .filter((el) => el.getClientRects().length > 0)
        .map((el) => {
          const track = el.querySelector("[data-track]");
          const fill = track ? track.firstElementChild : null;
          const column = el.querySelector("div[aria-hidden]");
          const tb = track ? track.getBoundingClientRect() : null;
          const fb = fill ? fill.getBoundingClientRect() : null;
          const cb3 = column ? column.getBoundingClientRect() : null;
          return {
            key: el.getAttribute("data-row"),
            value: Number(el.getAttribute("data-value")),
            trackLeft: tb ? +tb.left.toFixed(2) : null,
            trackW: tb ? +tb.width.toFixed(2) : null,
            drawn: fb ? +fb.width.toFixed(2) : cb3 ? +cb3.height.toFixed(2) : null,
          };
        })
        .filter((x) => x.drawn != null && Number.isFinite(x.value));
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
    if (r.kind === "income-breakdown") {
      r.incomeSegs = [...card.querySelectorAll("[data-seg-key]")].map((el) => ({
        key: el.getAttribute("data-seg-key"),
        share: parseFloat(el.getAttribute("data-seg-share")),
        widthPx: el.getBoundingClientRect().width,
      }));
      r.incomeLegendKeys = [...card.querySelectorAll("[data-legend-key]")].map((el) => el.getAttribute("data-legend-key"));
    }
    /* THE FOUNDER'S PLUS lives at the FOOT of another archetype's card once a
       real section adopts it (review finding 2, 2026-09-08): the outer card's
       kind then wins and is never "detail-panel", so gating collection on
       r.kind would stop seeing the panel the moment it is used as designed.
       Find it wherever it sits , `card` itself for the archetype's own
       standalone stories, or a descendant once it is nested , the same
       precedent as the kv-grid nested inside an answer card, above. */
    const panel = r.kind === "detail-panel" ? card : card.querySelector("[data-archetype='detail-panel']");
    r.hasDetailPanel = !!panel;
    if (panel) {
      const det = panel.querySelector("details");
      r.openOnLoad = !!det && det.hasAttribute("open");
      const sum = det && det.querySelector("summary");
      r.summaryHit = sum ? Math.round(sum.getBoundingClientRect().height) : 0;
      /* THE MEASUREMENT (review finding 1): a line count is the INNER box ,
         padding stripped , divided by the line-height, exactly as doorLines
         does it above; the full-box version reads padding as an extra line
         and reds a genuinely one-line summary as wrapped. */
      r.summaryLines = sum ? (() => {
        const scs = getComputedStyle(sum);
        const slh = parseFloat(scs.lineHeight) || parseFloat(scs.fontSize) * 1.5;
        const inner = sum.getBoundingClientRect().height - parseFloat(scs.paddingTop) - parseFloat(scs.paddingBottom);
        return Math.max(1, Math.round(inner / slh));
      })() : 1;
      r.panelGraphics = det ? det.querySelectorAll("svg, canvas, img, [data-archetype]").length : 0;
      /* THE OPENED PASS (review finding 3): a closed <details> reports zero
         client rects for every descendant, so the walk at the top of this
         loop never sees a row behind the plus , a wall of prose or an
         off-ladder size could hide there forever. Open it, fold the newly
         visible body into the SAME fields (sizes/overflow/accents) the rules
         below already read for every card regardless of kind, read the row
         count it declares against the rows it actually draws open, then put
         it back the way a reader found it. */
      if (det) {
        const wasOpen = det.open;
        det.open = true;
        /* NOT KEYED TO A dl (re-review, 2026-09-08). The panel's body is a
           definition list today, but the law this component serves is that a
           disclosure moves BULLET TEXT, so a future body could be a list. If
           this selector missed, the opened pass would walk nothing AND leave
           the row fields undefined, so ROWS CUT would stop too, and the whole
           finding it exists to close would return invisibly. Fall back to the
           details element itself, which always exists here. */
        const body = det.querySelector("dl") ?? det;
        if (body) {
          for (const el of [body, ...body.querySelectorAll("*")]) {
            if (el.getClientRects().length === 0) continue;
            const bcs = getComputedStyle(el);
            if (el.scrollWidth > el.clientWidth + 1 && bcs.overflowX !== "hidden" && bcs.display !== "inline") r.overflow.push(el.className.toString().slice(0, 40));
            const btxt = (el.textContent || "").trim();
            if (btxt && el.children.length === 0) {
              const bfs = parseFloat(bcs.fontSize); r.sizes.push(bfs);
              if (bcs.color === accentRgb) r.accents++;
            }
          }
          r.panelRowsExpect = Number(panel.getAttribute("data-rows") || "0");
          r.panelRowsDrawn = [...body.querySelectorAll("[data-detail-row]")].filter((row) => row.getClientRects().length).length;
        }
        det.open = wasOpen;
      }
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
  const cut = [...document.querySelectorAll("[data-stories] [data-expect-rows]")].filter((el) => el.getClientRects().length).map((el) => { const expect = Number(el.getAttribute("data-expect-rows")); const drawn = [...el.querySelectorAll("[data-row]")].filter((r) => r.getClientRects().length).length; const story = el.closest("[data-story]"); const inst = story?.closest("[data-stories]")?.getAttribute("data-stories") + ":" + story?.getAttribute("data-story"); return { inst, expect, drawn }; }).filter((c) => c.drawn < c.expect);
  return { out, cut, pageScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 };
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
  const { out, cut, pageScroll } = await page.evaluate(inPage);
  for (const c of cut) red(c.inst, w, "ROWS CUT", `the drawing declares ${c.expect} rows and draws ${c.drawn}`);
  if (pageScroll) red("page", w, "BOTCHED MOBILE", "the page scrolls sideways");
  for (const r of out) {
    if (r.overflow.length) red(r.inst, w, "BOTCHED MOBILE", `overflowing: ${r.overflow.join(" | ")}`);
    for (const s of new Set(r.sizes)) if (!LADDER.has(Math.round(s))) red(r.inst, w, "LADDER", `font size ${s}px is not on the ladder`);
    if (r.kind === "answer-card") {
      if (r.level === "section" && r.h1 > 0) red(r.inst, w, "HEADLINE", `a section-level answer card draws ${r.h1} h1`);
      if (r.level === "page" && r.h1 !== 1) red(r.inst, w, "HEADLINE", `${r.h1} h1 on a page-level answer card`);
      if (r.state === "no-answer") { if (w === WIDTHS[0]) data(r.inst, "NO ANSWER", "no small-business regime row is on file; the card shows the state word"); }
      else if (r.answerSizes.length !== 1) red(r.inst, w, "NO HIERARCHY", `${r.answerSizes.length} answer figures`);
      else { const next = Math.max(...r.sizes.filter((s) => s < r.answerSizes[0] - 0.5)); if (r.answerSizes[0] / next < 1.6) red(r.inst, w, "NO HIERARCHY", `answer ${r.answerSizes[0]} against ${next}, under 1.6x`); }
    }
    if (r.kind === "ranked-bars" && w === WIDTHS[0]) {
      for (const b of r.bars) if (b.ruleTop != null && b.top < b.ruleTop - 1) red(r.inst, w, "WORLD MAX", `bar ${b.key} rises above the world's-best rule`);
    }
    /* THE PILL LAW (task 12, 2026-09-10), replacing the old "exactly one
       accent text" rule: the card's one mark is a BLACK PILL now, not a
       colour, so a clean card carries ZERO accent text. EXACTLY ONE PILL PER
       CARD, ON THE REFERENCE MEMBER, WHETHER THAT PILL SITS ON THE NAME OR ON
       THE FIGURE (widened, task 13 fix wave): a set rebased onto one of its
       own members prints no figure for that member, so its pill moves to the
       name, and the rule follows the law rather than the reverse. It is not
       loosened by the move: both halves still hold, the count and the row it
       lands on, because the row is read from the pill's own `[data-row]`
       ancestor and compared against the card's declared leader. Checked at
       every width, not just 1280 like WORLD MAX above , the pill is drawn in
       every form (bar figure, wide table, phone table) and only one form is
       ever visible, so a fix that lands on one and forgets another must be
       caught at whichever width shows the broken one. */
    /* THE BARS AGREE WITH THEIR OWN NUMBERS (task 13 alignment fix,
       2026-09-10). Two halves of one law, because on this card they were one
       fault: every track on a ranked card starts at one left edge and runs one
       length, and the bars drawn in them rise in the order the values do. It
       is the check that was missing when each row carried the column template
       separately: the reference row's empty figure cell collapsed its middle
       column, its track began 40px left of its siblings' and ran 40px longer,
       and the CHEAPEST district drew a 150px bar against the 144px of a
       district that costs more , inverted, on a card that exists to be read by
       eye. Measured on the rendered page, not from the photograph.
       TOLERANCE: 1px, one device pixel. Every row is laid out from one
       template against one container width, so a genuine geometry difference
       is a whole column wide, tens of pixels (the fault above was 40), while
       the browser's own subpixel rounding of that one template is under a
       pixel; and an inversion under a pixel is not visible to the eye this
       rule protects. A tolerance loose enough to swallow a column would have
       let this defect through, which is the failure being closed.
       BLIND SPOT: `data-value` is the component's own declaration of what the
       bar draws, so this proves the DRAWING against the number the component
       holds, not against the figure the reader sees. A row whose declared
       value and printed figure disagreed would pass here; that is a data
       fault, and this is the geometry rule. */
    if (r.kind === "ranked-bars") {
      const RANK_TOL = 1;
      const rr = r.ranked || [];
      const tracked = rr.filter((x) => x.trackW != null);
      if (tracked.length > 1) {
        const lefts = tracked.map((x) => x.trackLeft), widths = tracked.map((x) => x.trackW);
        const dl = Math.max(...lefts) - Math.min(...lefts), dw = Math.max(...widths) - Math.min(...widths);
        if (dl > RANK_TOL || dw > RANK_TOL) red(r.inst, w, "TRACKS ADRIFT", `${tracked.length} tracks on one card at lefts ${Math.min(...lefts)}..${Math.max(...lefts)} and widths ${Math.min(...widths)}..${Math.max(...widths)}; one origin and one length, within ${RANK_TOL}px`);
      }
      const inverted = [];
      for (const a of rr) for (const b of rr) if (a.value > b.value && a.drawn < b.drawn - RANK_TOL) inverted.push(`${a.key} (${a.value}) draws ${a.drawn}px against ${b.key} (${b.value}) at ${b.drawn}px`);
      if (inverted.length) red(r.inst, w, "OUT OF ORDER", `${inverted.length} bar(s) drawn out of the order of their values: ${inverted[0]}`);
      if (r.accents > 0) red(r.inst, w, "ACCENT", `${r.accents} accent-coloured text(s); the card's one mark is a pill now, not a colour`);
      if (r.pillCount !== 1) red(r.inst, w, "ACCENT", `${r.pillCount} pill(s) on the card; exactly one, on the reference member`);
      else if (r.pillKey !== r.leaderKey) red(r.inst, w, "ACCENT", `the pill sits on "${r.pillKey}", not the reference member "${r.leaderKey}"`);
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
    if (r.kind === "income-breakdown") {
      const segs = r.incomeSegs || [];
      // RULE 1, PLANTED FAULT PROVED (task-11-report.md): a segment set
      // summing to 130 was fed through a temporary story and reded here
      // before this line was trusted.
      const sum = segs.reduce((a, s) => a + (Number.isFinite(s.share) ? s.share : 0), 0);
      if (segs.length && Math.abs(sum - 100) > 0.5) red(r.inst, w, "DOES NOT ADD UP", `segments plus net sum to ${sum.toFixed(2)}, not 100`);
      // RULE 2 (the drawn count matching the declared count at every width)
      // is the shared ROWS CUT mechanism above, fed by this card's own
      // data-expect-rows/data-row pair; no separate rule needed here.
      // RULE 3, PLANTED FAULT PROVED: a segment forced to a 0.4-percent
      // share rendered under six pixels wide and reded here before this
      // line was trusted.
      const widths = segs.map((s) => s.widthPx).filter((n) => Number.isFinite(n));
      if (widths.length) { const thinnest = Math.min(...widths); if (thinnest < 6) red(r.inst, w, "SLIVER", `a segment renders ${thinnest.toFixed(1)}px wide, under 6`); }
      // RULE 4, PLANTED FAULT PROVED: a legend entry deleted by hand, and a
      // bar segment added with no legend entry, each reded here in turn
      // before this line was trusted.
      const segKeys = segs.map((s) => s.key).sort();
      const legKeys = (r.incomeLegendKeys || []).slice().sort();
      const missing = segKeys.filter((k) => !legKeys.includes(k));
      const extra = legKeys.filter((k) => !segKeys.includes(k));
      if (missing.length) red(r.inst, w, "LEGEND MISMATCH", `drawn but not named in the legend: ${missing.join(", ")}`);
      if (extra.length) red(r.inst, w, "LEGEND MISMATCH", `named in the legend but not drawn: ${extra.join(", ")}`);
    }
    if (r.hasDetailPanel) {
      /* THE FOUNDER'S PLUS (2026-09-08): a panel is closed on arrival, its summary
         is one line of ink2 that says what opens, and what opens is rows of text.
         The type is the construction (DetailRow carries no children, so a
         drawing cannot reach this path); this is the measurement. Gated on the
         panel's own presence, not the outer card's kind (review finding 2), so
         these keep firing once a real section nests the panel at the foot of a
         ranked-bars or answer-card. */
      if (r.openOnLoad) red(r.inst, w, "OPEN ON LOAD", "a detail panel is open before anyone clicks it");
      if (r.summaryLines > 1) red(r.inst, w, "SUMMARY WRAP", `the summary takes ${r.summaryLines} lines; it is one line at every width`);
      if (r.panelGraphics) red(r.inst, w, "HIDDEN GRAPHIC", `${r.panelGraphics} drawing(s) inside a disclosure`);
      if (w === WIDTHS[2] && r.summaryHit < 44) red(r.inst, w, "BOTCHED MOBILE", `the plus target is ${r.summaryHit}px tall, under 44`);
      if (r.panelRowsExpect != null && r.panelRowsDrawn != null && r.panelRowsDrawn < r.panelRowsExpect) red(r.inst, w, "ROWS CUT", `the panel declares ${r.panelRowsExpect} rows and draws ${r.panelRowsDrawn} once open`);
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
/* INDEX (sys:stories-index, run 21): every link in the stories index points at a
   story the sheet holds, and every story is listed. Read from the sheet's text,
   no browser needed; a rule here rather than a second script, because the chain's
   single-gate-chain gate forbids an npm script that names two gate scripts. */
{
  const html = readFileSync(file, "utf8");
  const links = [...html.matchAll(/href="#(story-[^"]+)"/g)].map((m) => m[1]);
  const ids = new Set([...html.matchAll(/<section id="(story-[^"]+)"/g)].map((m) => m[1]));
  const linked = new Set(links);
  for (const l of links) if (!ids.has(l)) red("index", "all", "INDEX", `a link to #${l} and no story with that id`);
  for (const id of ids) if (!linked.has(id)) red("index", "all", "INDEX", `the story ${id} is not in the index`);
  console.log(`index links: ${links.length} links, ${ids.size} stories; ${links.filter((l) => !ids.has(l)).length} dangling, ${[...ids].filter((id) => !linked.has(id)).length} unlisted`);
}
const byInst = {};
for (const r of reds) (byInst[`${r.inst}@${w(r)}`] ??= []).push(`${r.rule}: ${r.msg}`);
function w(r) { return r.w; }
console.log(`archetype harness: ${instances.length} instances x ${WIDTHS.length} widths, ${reds.length} design red(s), ${datas.length} data red(s)`);
for (const [k, v] of Object.entries(byInst)) console.log(`  ${k}\n    ${v.join("\n    ")}`);
if (datas.length) { console.log("  DATA, for the data track, not the drawing:"); for (const d of datas) console.log(`    ${d.inst}: ${d.rule}, ${d.msg}`); }
process.exit(reds.length ? 1 : 0);
