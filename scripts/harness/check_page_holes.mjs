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
 * THE PAGE'S HIERARCHY (the founder, 2026-09-07: "the graphics don't know what
 * to emphasize, how to emphasize, how to show by not showing"). Three more
 * measurements, taken once per page at the widest width: ACCENT BUDGET (at
 * most three accent figures on a page, so one page has one order of
 * emphasis and not one per card), NO LEAD (a card drawing one text size and
 * nothing above it has no order for the eye; the forms a ruling makes even
 * are exempt and named), WALL (a card whose
 * text density passes 0.55 characters per pixel of width per 100 of height,
 * ruling 15). The page's brief in design/loop/build/briefs/ names which three
 * figures may be loud; this file only counts them.
 *
 * BLIND SPOT: a static render loads web fonts if the network answers and the
 * fallback stack if not, so a wrap can differ by a line; and it cannot tell a
 * hole that waits for data from a hole in the design, which is why every red
 * names its section.
 *
 * usage: node scripts/harness/check_page_holes.mjs <rendered.html ...> [--shots]
 *        node scripts/harness/check_page_holes.mjs --list[=scripts/harness/pages.json] [--shots]
 *        (--list reads every page in the list and expects its render under
 *        scratchpad/harness/pages/; a listed page with no render is a red, NO RENDER)
 *        node scripts/harness/check_page_holes.mjs <rendered.html> --section=<id> [--shots]
 *   THE TARGETED FORM (plan step 21, 2026-09-17): the card rules (WHITE SPACE,
 *   ROWS CUT, NO LEAD, WALL) run on the one section card whose id is named, at
 *   the same three widths. The PAGE rules are about the whole page and still
 *   run on it, unfiltered, because they cannot be asked of one card: ACCENT
 *   BUDGET counts every accent on the page, ACCENT UNREADABLE is the token,
 *   BOTCHED MOBILE's sideways scroll and NO SECTIONS are the page. An id no
 *   card carries stops with exit 2 and the ids the page holds.
 */
import { chromium } from "playwright";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { basename } from "node:path";
import { preflight } from "./preflight.mjs";

/* THE GROUND FIRST (sys:harness-preflight, run 24): the site root, the browser on disk, free memory printed; a wrong ground stops here with the remedy. */
preflight({ browser: true, name: "check_page_holes" });

const WIDTHS = [1280, 768, 375];
const args = process.argv.slice(2);
const shots = args.includes("--shots");
/* THE LIST (sys:page-filter-list, run 12): the pages the filter reads every run
   live in scripts/harness/pages.json, one entry per page on an archetype. */
const listArg = args.find((a) => a === "--list" || a.startsWith("--list="));
const LIST = listArg && listArg.includes("=") ? listArg.slice("--list=".length) : "scripts/harness/pages.json";
const listed = listArg ? JSON.parse(readFileSync(LIST, "utf8")).pages.map((p) => `scratchpad/harness/pages/${p.surface}-${p.slugs.join("-")}.html`) : [];
const files = [...args.filter((a) => !a.startsWith("--")), ...listed];
/* THE ONE CARD, when asked for: its id as the walk reports it (the card's own
   id, else the first id inside it, else its heading's text). */
const SECTION = args.find((a) => a.startsWith("--section="))?.slice("--section=".length) ?? null;
if (SECTION === "") { console.error("usage: --section=<id> names a section card; the id is empty"); process.exit(2); }
if (files.length === 0) { console.error("usage: node scripts/harness/check_page_holes.mjs <rendered.html ...> [--shots] | --list[=pages.json] [--shots]"); process.exit(2); }

/* THE FORMS THAT ARE EVEN BY A RULING, so NO LEAD never fires on them: the
   comparison table's equal rows (ruling 8) and the peers table the founder
   praised for saying little, the city pager's equal card heights (ruling 7),
   the two pay bars sharing one track (ruling 13), and the closing doors, which
   are chrome and not an answer. Measured on the country and city pages at
   1280 on 2026-09-07: every one of these draws a single text size, and every
   other form draws at least one ladder step above its median. */
function inPage() {
  /* THIS SET IS FROZEN AT FOUR (task 4, 2026-09-08). When eighteen section
     briefs were reviewed, seven asked to be added to it, which is a card
     asking to be excused from having a hierarchy. It does not grow: a
     section that cannot pass NO LEAD (or, since PART 8.5, FOCAL, its sibling
     rule in check_model_laws.mjs, which hand-keeps this same four names
     because it cannot import this file's function once Playwright has
     serialised it into the page) is redesigned, never exempted. */
  const EVEN_BY_RULING = new Set(["compare-table", "card-pager", "pay-bars", "terminus"]);
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
  /* ROWS CUT: a chart that declares how many rows it holds must draw them all
     at this width (the district ranking drew five of seven on a phone). */
  const cut = [...document.querySelectorAll("[data-expect-rows]")].filter((el) => el.getClientRects().length).map((el) => { const expect = Number(el.getAttribute("data-expect-rows")); const drawn = [...el.querySelectorAll("[data-row]")].filter((r) => r.getClientRects().length).length; const card = el.closest('[class*="rounded-[14px]"]'); return { id: card?.id || card?.querySelector("[id]")?.id || "chart", expect, drawn }; }).filter((c) => c.drawn < c.expect);
  /* THE PAGE'S HIERARCHY (the founder's art-direction ruling of 2026-09-07):
     ACCENT BUDGET counts every text element in the accent colour on the page
     (a mark the founder ruled, like the people table's dots, carries
     data-founder-accent and is not counted); NO LEAD finds a card whose
     largest text is under 1.4 times its median text size, a card with no
     order for the eye; WALL finds a card whose text runs over 0.55 characters
     per pixel of card width per 100 pixels of height, a wall of prose
     (ruling 15).
     THE INSTRUMENT'S BLIND SPOT, stated before it is trusted: the accent is
     read by resolving the token on a probe element, and an unresolved token
     computes to the inherited ink, which would make every word on the page an
     accent. A second probe with a token that cannot exist says what
     unresolved looks like; when the two agree the count is not taken and the
     page says so, rather than reporting a page of false accents. */
  const probe = (token) => { const d = document.createElement("div"); d.style.color = "var(" + token + ")"; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; };
  const accentRgb = probe("--terra-text");
  const accentReadable = accentRgb !== probe("--no-such-token-xyz");
  const accents = !accentReadable ? [] : [...document.querySelectorAll("main *")].filter((el) => el.getClientRects().length && el.children.length === 0 && (el.textContent || "").trim() && !el.closest("[data-founder-accent]") && getComputedStyle(el).color === accentRgb).map((el) => (el.closest('[class*="rounded-[14px]"]')?.id || "card") + ": " + (el.textContent || "").trim().slice(0, 16));
  const hierarchy = [];
  for (const card of cards) {
    const id = card.id || card.querySelector("[id]")?.id || "card";
    const sizes = [...card.querySelectorAll("*")].filter((el) => el.getClientRects().length && el.children.length === 0 && (el.textContent || "").trim()).map((el) => parseFloat(getComputedStyle(el).fontSize)).sort((a, b) => a - b);
    const form = card.getAttribute("data-archetype") || card.querySelector("[data-archetype]")?.getAttribute("data-archetype") || "kit";
    if (sizes.length >= 3 && !EVEN_BY_RULING.has(form)) { const median = sizes[Math.floor(sizes.length / 2)]; const lead = sizes[sizes.length - 1]; if (lead <= median) hierarchy.push({ id, rule: "NO LEAD", detail: `every word in this card is ${median}px, so nothing leads the eye (form: ${form})` }); }
    const cb = card.getBoundingClientRect(); const chars = (card.textContent || "").replace(/\s+/g, " ").trim().length; const density = chars / (cb.width * cb.height / 100);
    if (density > 0.55) hierarchy.push({ id, rule: "WALL", detail: `${chars} characters in a ${Math.round(cb.width)}x${Math.round(cb.height)} card, ${density.toFixed(2)} per pixel of width per 100 of height` });
  }
  return { out, cut, accents, accentReadable, hierarchy, pageScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 };
}

const reds = [];
const red = (page, w, id, msg) => reds.push({ page, w, id, msg });
const browser = await chromium.launch();
for (const file of files) {
  const name = basename(file).replace(/\.html$/, "");
  if (!existsSync(file)) { reds.push({ page: name, w: "all", id: "-", msg: "NO RENDER: the list names this page and no render exists under scratchpad/harness/pages" }); continue; }
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.evaluate(async () => { for (const im of document.images) { im.loading = "eager"; try { await im.decode(); } catch { /* not this check's business */ } } });
    const walk = await page.evaluate(inPage);
    /* THE FILTER, at the point the walk hands its cards back: the card rules
       read only the named card; the page rules below read the page. */
    if (SECTION != null && !walk.out.some((c) => c.id === SECTION)) {
      console.error(`check_page_holes --section=${SECTION}: no section card with that id on ${name} at ${w}; the cards are: ${walk.out.map((c) => c.id).join(", ") || "(none)"}`);
      await browser.close();
      process.exit(2);
    }
    const out = SECTION == null ? walk.out : walk.out.filter((c) => c.id === SECTION);
    const cut = SECTION == null ? walk.cut : walk.cut.filter((c) => c.id === SECTION);
    const hierarchy = SECTION == null ? walk.hierarchy : walk.hierarchy.filter((h) => h.id === SECTION);
    const { accents, accentReadable, pageScroll } = walk;
    for (const c of cut) red(name, w, c.id, `ROWS CUT: the chart declares ${c.expect} rows and draws ${c.drawn}`);
    const BUDGET = 3;
    if (w === WIDTHS[0] && !accentReadable) red(name, w, "page", "ACCENT UNREADABLE: the accent token does not resolve in this render, so the page's accents were not counted");
    if (w === WIDTHS[0] && accentReadable && accents.length > BUDGET) red(name, w, "page", `ACCENT BUDGET: ${accents.length} accent figures on one page, over ${BUDGET} (${accents.join("; ")})`);
    if (w === WIDTHS[0]) for (const h of hierarchy) red(name, w, h.id, `${h.rule}: ${h.detail}`);
    if (pageScroll) red(name, w, "page", "BOTCHED MOBILE: the page scrolls sideways");
    /* A PAGE WITH NO SECTION CARD UNDER MAIN IS NOT A PASS: a render that lost
       its landmark or its cards would otherwise sail through with zero holes. */
    if (walk.out.length === 0) red(name, w, "page", "NO SECTIONS: no section card found under main; the render or the landmark is broken");
    for (const c of out) {
      const minW = Math.max(120, c.cardW / 4), minH = Math.max(120, c.cardH / 4);
      if (c.holeW >= minW && c.holeH >= minH) red(name, w, c.id, `WHITE SPACE: a blank rectangle ${c.holeW}x${c.holeH} inside a ${c.cardW}x${c.cardH} card${c.siblings > 1 ? ` (one of ${c.siblings} in its band)` : ""}`);
    }
    if (shots) {
      mkdirSync("scratchpad/harness/shots", { recursive: true });
      await page.screenshot({ path: `scratchpad/harness/shots/page-${name}${SECTION == null ? "" : `-only-${SECTION}`}-${w}.jpeg`, type: "jpeg", quality: 80, fullPage: true });
    }
    console.log(`${name}@${w}${SECTION == null ? "" : ` #${SECTION}`}: ${out.length} section card${out.length === 1 ? "" : "s"}, ${out.filter((c) => c.holeW >= Math.max(120, c.cardW / 4) && c.holeH >= Math.max(120, c.cardH / 4)).length} with a hole`);
    await ctx.close();
  }
}
await browser.close();
console.log(`page holes${SECTION == null ? "" : ` (--section=${SECTION}, page rules on the whole page)`}: ${files.length} page(s) x ${WIDTHS.length} widths, ${reds.length} red(s)`);
for (const r of reds) console.log(`  ${r.page}@${r.w} #${r.id}: ${r.msg}`);

/* THE PER-PAGE RATCHET (plan step 3, 2026-09-17). Three pages that had never
   been measured joined the list with their spines (the trade, industry and
   neighbourhood pages) and the filter found 34 reds on them and none on the
   three that were already clean. Those are file 04's work, one page at a
   time. Until then a page's count is held in scripts/harness/page_holes_baseline.json
   the way the copy gate and the cream gate hold theirs: a page with no entry
   must have zero; a page with an entry may not EXCEED it; a page that comes
   in under its entry lowers it in the same commit (run with --write-baseline
   after reading the reds) and the file can never be raised by hand. The exit
   is red when any page exceeds, so a new fault on the country page still
   fails, and a fault on a page that was already red is still printed above
   and counted here, never hidden. A --section run is one card and is not
   ratcheted. */
const BASELINE = "scripts/harness/page_holes_baseline.json";
const WRITE_BASELINE = process.argv.includes("--write-baseline");
let exit = 0;
if (SECTION == null) {
  const byPage = {};
  for (const r of reds) byPage[r.page] = (byPage[r.page] ?? 0) + 1;
  let base = {};
  try { base = JSON.parse(readFileSync(BASELINE, "utf8")); } catch { base = {}; }
  const over = [], under = [];
  for (const name of files.map((f) => basename(f, ".html"))) {
    const have = byPage[name] ?? 0, allowed = base[name] ?? 0;
    if (have > allowed) over.push(`${name}: ${have} against a baseline of ${allowed}`);
    else if (have < allowed) under.push(`${name}: ${have}, baseline ${allowed} can fall`);
  }
  if (over.length) { console.log(`page holes RATCHET: ${over.length} page(s) over their baseline: ${over.join("; ")}`); exit = 1; }
  if (under.length && WRITE_BASELINE) {
    for (const name of files.map((f) => basename(f, ".html"))) { const have = byPage[name] ?? 0; if (have < (base[name] ?? 0)) base[name] = have; if (!(name in base) && have === 0) delete base[name]; }
    for (const k of Object.keys(base)) if (base[k] === 0) delete base[k];
    writeFileSync(BASELINE, JSON.stringify(base, null, 2) + String.fromCharCode(10));
    console.log(`page holes RATCHET: baseline lowered and written: ${under.join("; ")}`);
  } else if (under.length) console.log(`page holes RATCHET: ${under.join("; ")} (run with --write-baseline to lower it)`);
  const held = Object.entries(base).filter(([k]) => byPage[k]).map(([k, v]) => `${k} ${byPage[k]} of ${v}`);
  if (held.length && !exit) console.log(`page holes RATCHET: holding at baseline on ${held.join(", ")}; these are file 04's work and not a pass`);
} else if (reds.length) exit = 1;
process.exit(exit);
