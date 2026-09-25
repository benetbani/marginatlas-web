/**
 * THE PAGE LAWS OF 2026-09-20, held on a rendered page. The founder, after the
 * renders of 2026-09-19 passed the page filter and failed his eye: "the
 * harness is not working correctly, I need to repeat this fact." The filter
 * (check_page_holes.mjs) measures a blank rectangle inside a card and a
 * full-width band, and nothing on his list. This file holds the list, MODEL.md
 * PART 9 clauses 50 to 58, one measurement each, on the same live renders the
 * filter reads, at the same three widths. His words are verbatim in
 * E:/atlas/rules/FOUNDER-VERDICTS.md under 2026-09-20; the checks are specified
 * in E:/atlas/design/loop/architecture/HARNESS-SPEC.md, "The page laws of
 * 2026-09-20", each with its blind spot.
 *
 * THE LEVEL RULES read the desktop composition only (1280): a level is a Band
 * (`[data-band]`, stamped by the kit) or the hero band (`[data-hero]`), and its
 * cards are its direct children. At 768 and 375 the bands stack, so a level
 * is one card and the rules have nothing to say.
 *   50 LEVEL OVER THREE   more than three cards on one level
 *   52 LEVEL UNFILLED     the cards cover under 95 percent of the level's width
 *                         (a lone card at two thirds with air beside it reds)
 *   53 LEVEL VISUALS      no visual card on a level, or three (a level that
 *                         is the terminus alone is exempt: doors, no data)
 * THE CARD RULES read every card at every width:
 *   51 TEXT WIDE          a run of text (60 characters or more) whose lines
 *                         measure over half the page's content width (1280 and
 *                         768; at 375 the column is the page)
 *   52 CARD FOOT BLANK    over 48px of nothing between a card's last ink and
 *                         its bottom edge
 *   52 HERO SIDE BLANK    the hero's rightmost ink ends before three quarters
 *                         of the card's width (1280 and 768)
 *   56 TEXT OUT OF BOX    a text leaf past its card's padding box
 *   56 TEXT OVERLAP       two text leaves of one card intersecting; an element
 *                         under `[data-overlay]` is exempt
 *   58 PARTS NOT REVEALED a card declaring `data-parts` over 1 with no
 *                         disclosure inside it (details, a tab list, a popup)
 * THE PAGE RULES read the page once at 1280:
 *   55 KIND REPEATED      one VISUAL archetype on more than two cards (his
 *                         words: "one kind of visual"; a figure card or a
 *                         fact grid is not a visual, and the first run
 *                         counted them, four kv-grids and four bento cells
 *                         read as a repeated kind; corrected 2026-09-20)
 *   55 KIND TWINS         one visual archetype on two cards with the same
 *                         variant
 *   64 KIND ADJACENT      two visual cards of one kind on one level, in one
 *                         cluster, or on neighbouring levels (his words on
 *                         the market bento, 2026-09-20 night: "two similar
 *                         graphics should have a considerable distance")
 *   -- ALIGNMENT        centred text that is not a mark's label, a sentence on
 *                         the right, or a column of figures with more than one
 *                         right edge (his ruling of 2026-09-23)
 *   -- GLOSS            at most one "?" a card, and never on a figure or on
 *                         the page's answer (his pop-up, 2026-09-22; the law
 *                         of the mechanism, not one of his numbered clauses)
 *   65 LONE FIGURE        a card whose readings are one figure: no second
 *                         figure, no drawing, no rows, no details ("a
 *                         subsection cannot be only with one number")
 * 54 (a text-only card's declared form) and 57 (the first question, the
 * family in the catalogue) are the composition's and the sheet's; the machine
 * holds 54 only as `data-text-form` where a card declares it.
 *
 * WHAT IS VISUAL: a card is visual when its archetype draws (bars, tracks, dots
 * on tracks, a breakdown, unit counts, photographs); a table, a fact grid, a
 * list, a figure, a seat and the exit are text-only. The map is this file's
 * until the archetypes stamp `data-visual` themselves; a stamp on the card
 * wins over the map, so an archetype can declare itself.
 *
 * BLIND SPOTS, stated: the level rules cannot tell a deliberate four-up
 * gallery (the city cards) from four sections, and pass it because the gallery
 * is one card; the fill rule cannot tell composed air inside a bento cell from
 * a hole under 48px; the twins rule reads a variant attribute, not the eye;
 * the visual map is a declaration and an empty drawing still declares itself
 * visual (the archetype harness catches the empty drawing).
 *
 * usage: node scripts/harness/check_page_laws.mjs <rendered.html ...>
 *        node scripts/harness/check_page_laws.mjs --list[=scripts/harness/pages.json] [--write-baseline]
 * The per-page ratchet is scripts/harness/page_laws_baseline.json, the page
 * filter's own rule: a page with no entry must have zero; a page may never
 * exceed its entry; --write-baseline lowers an entry that fell; nothing raises
 * one by hand.
 */
import { chromium } from "playwright";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { basename } from "node:path";
import { preflight } from "./preflight.mjs";
import { requireBrowser } from "../lib/local_only.mjs";

await requireBrowser("harness-page-laws", "the page laws of 2026-09-20 (levels, text measure, card feet, the hero's side, overlap, repeated kinds, parts) on every page in scripts/harness/pages.json");
preflight({ browser: true, name: "check_page_laws" });

const WIDTHS = [1280, 768, 375];
const args = process.argv.slice(2);
const listArg = args.find((a) => a === "--list" || a.startsWith("--list="));
const LIST = listArg && listArg.includes("=") ? listArg.slice("--list=".length) : "scripts/harness/pages.json";
const listed = listArg ? JSON.parse(readFileSync(LIST, "utf8")).pages.map((p) => `scratchpad/harness/pages/${p.surface}-${p.slugs.join("-")}.html`) : [];
const files = [...args.filter((a) => !a.startsWith("--")), ...listed];
if (files.length === 0) { console.error("usage: node scripts/harness/check_page_laws.mjs <rendered.html ...> | --list[=pages.json] [--write-baseline]"); process.exit(2); }

/* THE IN-PAGE WALK. Everything below runs inside the browser; it takes the
   viewport width so the level and measure rules know whether they apply. */
function inPage(width) {
  /* The four chart forms of 2026-09-25 (src/components/spine/charts/: a figure on the world's range, a bar list, a ring with its
     centre figure, a country's span against the world's) draw, so they are visual kinds like the rest. */
  /* The page-agnostic sections of the same night (src/components/spine/sections/) that draw: a cohort's curve, columns, a scale of
     rates, age bars, pies, a trip bar, a market bar, a price table with its bars. The apps directory and the thresholds are rows
     and a list, text-only, and are not here. */
  const VISUAL = new Set(["world-range", "bar-list", "donut-stat", "range-pair", "ranked-bars", "range-strip", "spectra-table", "pay-bars", "income-breakdown", "bento-band", "city-cards", "segment-bar", "hero-board", "donut", "ring", "month-bars", "share-bar", "bento-count", "survival-curve", "obstacles", "spend-by-income", "job-market", "age-mix", "origin", "customers-come", "market-hold", "stock-tiers"]);
  const VARIANT_KEYS = ["data-variant", "data-form", "data-marks", "data-columns", "data-look", "data-feature", "data-dot", "data-shape", "data-orientation"];
  const CARD = 'main [data-card]';
  const main = document.querySelector("main");
  const mainRect = main ? main.getBoundingClientRect() : document.body.getBoundingClientRect();
  const ms = main ? getComputedStyle(main) : null;
  const contentW = main ? mainRect.width - parseFloat(ms.paddingLeft) - parseFloat(ms.paddingRight) : mainRect.width;
  const cards = [...document.querySelectorAll(CARD)].filter((c) => c.getClientRects().length && !c.parentElement.closest(CARD));
  const idOf = (card) => card.id || card.closest("[data-archetype='bento-band'][id]")?.id || card.querySelector("[id]")?.id || (card.querySelector("h1,h2,h3")?.textContent || "").trim().toLowerCase() || "card";
  const archetypeOf = (card) => card.getAttribute("data-archetype") || card.querySelector("[data-archetype]")?.getAttribute("data-archetype") || "kit";
  const archetypeEl = (card) => (card.hasAttribute("data-archetype") ? card : card.querySelector("[data-archetype]")) || card;
  const isVisual = (card) => { const own = card.getAttribute("data-visual"); if (own === "1") return true; if (own === "0") return false; return VISUAL.has(archetypeOf(card)); };
  const variantOf = (card) => { const el = archetypeEl(card); const own = card.getAttribute("data-variant"); if (own) return own; return VARIANT_KEYS.map((k) => el.getAttribute(k) ?? card.getAttribute(k) ?? "").join("|"); };
  const hiddenLeaf = (el) => { const d = el.closest("details"); if (d && !d.open) { const sum = d.querySelector(":scope > summary"); if (!sum || !sum.contains(el)) return true; } return false; };
  const isInk = (el, es) => { const txt = (el.textContent || "").trim(); const leaf = el.children.length === 0 || el.tagName === "svg" || el.tagName === "IMG"; if (!leaf) return false; if (txt || el.tagName === "svg" || el.tagName === "IMG") return true; return /rgba?\((?!0, 0, 0, 0)/.test(es.backgroundColor); };
  const reds = [];
  const red = (id, rule, msg) => reds.push({ id, rule, msg });

  /* THE LEVELS, at 1280 only. */
  if (width >= 1280) {
    const bands = [...document.querySelectorAll("main [data-band], main [data-hero]")].filter((b) => b.getClientRects().length);
    for (const band of bands) {
      /* A BENTO CLUSTER IS ONE CARD (the spec's blind spot, stated): the
         cluster's root stamps `data-band="bento"` because it IS the band, and
         its children are cells, not cards; the four-cell premises and market
         clusters are one card each under clauses 50 and 53. The cluster fills
         its level by construction; a hole inside a cell is the page filter's. */
      if (band.getAttribute("data-band") === "bento") continue;
      const kids = [...band.children].filter((k) => k.getClientRects().length);
      if (kids.length === 0) continue;
      const br = band.getBoundingClientRect();
      const label = kids.map((k) => (k.matches(CARD) ? idOf(k) : idOf(k.querySelector(CARD) || k))).join(" | ");
      if (kids.length > 3) red(label, "LEVEL OVER THREE", `${kids.length} cards on one level; three is the cap (clause 50)`);
      const gap = parseFloat(getComputedStyle(band).columnGap) || 0;
      const covered = kids.reduce((s, k) => s + k.getBoundingClientRect().width, 0);
      const usable = br.width - gap * (kids.length - 1);
      const fill = usable > 0 ? covered / usable : 1;
      if (fill < 0.95) red(label, "LEVEL UNFILLED", `the cards cover ${Math.round(fill * 100)} percent of the level's ${Math.round(br.width)}px; ${kids.length === 1 ? "a lone card with air beside it" : "air between or beside the cards"} (clause 52)`);
      const visuals = kids.filter((k) => isVisual(k.matches(CARD) ? k : (k.querySelector(CARD) || k))).length;
      /* THE TERMINUS LEVEL HOLDS NO DATA (2026-09-20 evening): a level whose
         only card is the terminus is three doors out of the page, nothing to
         draw; clause 53 is his rule for the levels that carry a section's
         data ("at least one visualization" of the statistics on that level).
         The hero level is NOT exempt: the answer is data, and his design for
         the country's hero puts a picture and placed figures in it. */
      const terminusOnly = kids.length === 1 && archetypeOf(kids[0].matches(CARD) ? kids[0] : (kids[0].querySelector(CARD) || kids[0])) === "terminus";
      if (visuals === 0 && !terminusOnly) red(label, "LEVEL VISUALS", `no visual card on this level (clause 53); the cards are ${kids.map((k) => archetypeOf(k.matches(CARD) ? k : (k.querySelector(CARD) || k))).join(", ")}`);
      if (visuals > 2) red(label, "LEVEL VISUALS", `${visuals} visual cards on one level; two is the cap (clause 53)`);
    }
  }

  /* THE CARDS, at every width. */
  const heroCard = document.querySelector("main [data-hero] " + CARD.replace("main ", "")) || document.querySelector("main [data-hero]")?.querySelector('[data-card]');
  for (const card of cards) {
    const id = idOf(card);
    const cb = card.getBoundingClientRect(); const cs = getComputedStyle(card);
    const x0 = cb.left + parseFloat(cs.paddingLeft), x1 = cb.right - parseFloat(cs.paddingRight), y1 = cb.bottom - parseFloat(cs.paddingBottom);
    let lastInk = -Infinity, rightInk = -Infinity;
    const texts = [];
    for (const el of card.querySelectorAll("*")) {
      if (el.getClientRects().length === 0 || hiddenLeaf(el)) continue;
      const es = getComputedStyle(el);
      const b = el.getBoundingClientRect();
      if (parseFloat(es.borderBottomWidth) > 0 && !/rgba\(0, 0, 0, 0\)/.test(es.borderBottomColor)) { lastInk = Math.max(lastInk, b.bottom); rightInk = Math.max(rightInk, b.right); }
      if (!isInk(el, es) || b.width === 0 || b.height === 0) continue;
      lastInk = Math.max(lastInk, b.bottom); rightInk = Math.max(rightInk, b.right);
      const txt = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (txt && el.tagName !== "svg" && el.tagName !== "IMG") {
        /* the text's own extent, not the block's: a short line in a wide block is short */
        const r = document.createRange(); r.selectNodeContents(el); const tb = r.getBoundingClientRect();
        let rect = { left: (tb.width > 0 ? tb : b).left, right: (tb.width > 0 ? tb : b).right, top: (tb.width > 0 ? tb : b).top, bottom: (tb.width > 0 ? tb : b).bottom };
        /* WHAT A SCROLL CONTAINER CLIPS IS NOT ON SCREEN (the first run's own
           fault, 2026-09-20): a note inside the peers table's overflow-x
           container measured 389px past the card, and the eye saw a table
           that scrolls. The rect is cut to every clipping ancestor inside the
           card before it is judged. */
        /* the element's own box clips too: a truncated label (overflow hidden, an ellipsis) keeps its full text in the range rect */
        for (let p = el; p && p !== card; p = p.parentElement) {
          const ps = getComputedStyle(p);
          if (ps.overflowX !== "visible" || ps.overflowY !== "visible") { const pb = p.getBoundingClientRect(); rect = { left: Math.max(rect.left, pb.left), right: Math.min(rect.right, pb.right), top: Math.max(rect.top, pb.top), bottom: Math.min(rect.bottom, pb.bottom) }; }
        }
        rect.width = Math.max(0, rect.right - rect.left); rect.height = Math.max(0, rect.bottom - rect.top);
        texts.push({ el, txt, rect, overlay: !!el.closest("[data-overlay]"), inTable: !!el.closest("table, [role='table']") });
      }
    }
    /* 52 CARD FOOT BLANK */
    if (lastInk > -Infinity && y1 - lastInk > 48) red(id, "CARD FOOT BLANK", `${Math.round(y1 - lastInk)}px of nothing between the card's last ink and its bottom edge (clause 52)`);
    /* 52 HERO SIDE BLANK */
    if (card === heroCard && width >= 768 && rightInk > -Infinity) { const share = (rightInk - x0) / (x1 - x0); if (share < 0.75) red(id, "HERO SIDE BLANK", `the hero's ink ends at ${Math.round(share * 100)} percent of its width; the right ${Math.round((1 - share) * 100)} percent is empty (clause 52)`); }
    /* 51 TEXT WIDE */
    if (width >= 768) for (const t of texts) { if (t.inTable || t.txt.length < 60) continue; if (t.rect.width > contentW / 2 + 1) red(id, "TEXT WIDE", `a run of text measures ${Math.round(t.rect.width)}px, over half the page's ${Math.round(contentW)}px: "${t.txt.slice(0, 48)}..." (clause 51)`); }
    /* 56 TEXT OUT OF BOX and TEXT OVERLAP */
    for (const t of texts) { if (t.rect.right > x1 + 1 || t.rect.left < x0 - 1) red(id, "TEXT OUT OF BOX", `"${t.txt.slice(0, 40)}" runs ${Math.round(Math.max(t.rect.right - x1, x0 - t.rect.left))}px past the card's box (clause 56)`); }
    const seen = new Set();
    for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
      const a = texts[i], b = texts[j];
      if (a.overlay || b.overlay || a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const ox = Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left);
      const oy = Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top);
      /* LINE SPACING IS NOT OVERLAP (the first run's other fault): two stacked
         lines' boxes touch by a few pixels of leading on every card, and the
         hero's label sat "80x5px" on its figure. An overlap counts when the
         boxes share more than a third of the shorter one's height, which is
         what the eye reads as one text over another. Blind spot: two lines
         overlapping by under a third of their height pass. */
      const minH = Math.min(a.rect.height, b.rect.height);
      if (ox > 4 && oy > Math.max(4, minH * 0.34)) { const key = `${a.txt.slice(0, 20)}~${b.txt.slice(0, 20)}`; if (seen.has(key)) continue; seen.add(key); red(id, "TEXT OVERLAP", `"${a.txt.slice(0, 24)}" and "${b.txt.slice(0, 24)}" intersect by ${Math.round(ox)}x${Math.round(oy)}px (clause 56)`); }
    }
    /* 58 PARTS NOT REVEALED */
    const parts = Number(card.getAttribute("data-parts") || card.querySelector("[data-parts]")?.getAttribute("data-parts") || 0);
    if (width >= 1280 && parts > 1 && !card.querySelector("details, [role='tablist'], [data-popup]")) red(id, "PARTS NOT REVEALED", `the card declares ${parts} parts and shows them all at once; no plus, tab or popup inside it (clause 58)`);
  }

  /* THE PAGE, once at 1280: kinds, twins and distance. */
  if (width >= 1280) {
    const byKind = new Map();
    for (const card of cards) { if (!isVisual(card)) continue; const k = archetypeOf(card); if (!byKind.has(k)) byKind.set(k, []); byKind.get(k).push(card); }
    /* THE LEVELS IN ORDER, so "neighbouring" is a fact of the page and not of the DOM's depth: a card's level is its nearest band or hero; a bento's cells share their cluster's level. */
    const levels = [...document.querySelectorAll("main [data-band], main [data-hero]")].filter((b) => b.getClientRects().length && !b.parentElement.closest("[data-band], [data-hero]"));
    const levelOf = (card) => card.closest("[data-band], [data-hero]");
    for (const [kind, list] of byKind) {
      if (kind === "kit") continue;
      if (list.length > 2) red(list.map(idOf).join(" | "), "KIND REPEATED", `${kind} on ${list.length} cards; two is the cap (clause 55)`);
      else if (list.length === 2 && variantOf(list[0]) === variantOf(list[1])) red(list.map(idOf).join(" | "), "KIND TWINS", `${kind} twice with the same variant "${variantOf(list[0]) || "(none declared)"}"; two of one kind must look different (clause 55)`);
      /* 64 KIND ADJACENT: every pair of the kind, by the distance of their levels. */
      for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
        const la = levelOf(list[i]), lb = levelOf(list[j]);
        if (!la || !lb) continue;
        const ia = levels.indexOf(la), ib = levels.indexOf(lb);
        const gap = la === lb ? 0 : Math.abs(ia - ib);
        if (gap === 0) red(`${idOf(list[i])} | ${idOf(list[j])}`, "KIND ADJACENT", `${kind} twice on one level or in one cluster; two of one kind keep a level between them (clause 64)`);
        else if (gap === 1) red(`${idOf(list[i])} | ${idOf(list[j])}`, "KIND ADJACENT", `${kind} on neighbouring levels; two of one kind keep a level between them (clause 64)`);
      }
    }
    /* 65 LONE FIGURE: a card whose readings are one figure and nothing else.
       A reading is a figure (`.fig`), a grid cell, a row, a drawing, a plus,
       a table or a companion row; a card with exactly one figure and none of
       the rest is one number in a box. A card with no figure (a seat, a
       terminus, prose) is not this rule's. */
    /* ALIGNMENT (2026-09-23, his ruling: "solidify rules about text alignment,
       as I see that in some cases the alignment is not good, so either left,
       center or right, and it damages the readability"). The law is
       DISTANCES.md section 5.7, and three of its rules are mechanical:
         a. NOTHING IS CENTRED but a mark's own label, and a mark's label says
            so with `data-mark-label` (a month initial, a bar's name, a ring's
            caption). Centring a sentence or a figure costs the reader the one
            edge they were scanning down.
         b. A SENTENCE IS NEVER RIGHT ALIGNED. Right is for a figure in a
            column of figures; a run of five words or more on the right has no
            edge to line up with.
         c. FIGURES IN ONE COLUMN SHARE ONE RIGHT EDGE. Measured on the country
            hero board the day this was written: three figures in one column
            ending at 1094, 1074 and 1098, because every row was its own grid.
       The blind spot, stated: alignment made with a flex `justify-*` rather
       than `text-align` is invisible here; that is the model laws' LABEL GAP. */
    /* WHAT MAY BE CENTRED: a mark's own label or figure (`data-mark-label`, `data-mark`:
   a month initial, a bar's name, a strip's figure over its tick), the inside of a
   ring or a donut, and the glyph inside a control (a pager arrow, the gloss's
   question mark, a pill). Everything else that is centred is a fault. */
const ALIGN_EXEMPT = "[data-mark-label], [data-mark], [data-archetype='ring'], [data-archetype='donut'], button, a";
    for (const card of cards) {
      for (const el of card.querySelectorAll("*")) {
        if (el.children.length || !(el.textContent || "").trim() || !el.getClientRects().length) continue;
        const align = getComputedStyle(el).textAlign;
        const words = (el.textContent || "").trim().split(/\s+/).length;
        if (align === "center" && !el.closest(ALIGN_EXEMPT)) red(idOf(card), "ALIGNMENT", `centred text that is not a mark's label: "${(el.textContent || "").trim().slice(0, 32)}"`);
        if ((align === "right" || align === "end") && words >= 5) red(idOf(card), "ALIGNMENT", `a sentence of ${words} words on the right: "${(el.textContent || "").trim().slice(0, 32)}"`);
      }
    }
    for (const host of new Set([...document.querySelectorAll("main [data-row]")].map((r) => r.parentElement))) {
      const rs = [...host.children].filter((c) => c.matches("[data-row]"));
      if (rs.length < 2) continue;
      const cols = Math.max(...rs.map((r) => r.children.length));
      for (let i = 0; i < cols; i++) {
        const cells = rs.map((r) => r.children[i]).filter(Boolean).filter((c) => getComputedStyle(c).textAlign === "right");
        if (cells.length < 2) continue;
        const edges = [...new Set(cells.map((c) => Math.round(c.getBoundingClientRect().right)))];
        if (edges.length > 1) red(idOf(host.closest(CARD) || host), "ALIGNMENT", `a column of figures ending at ${edges.join(", ")}; one column, one right edge`);
      }
    }
    /* THE GLOSS, HIS POP-UP (2026-09-22, QUEUE ui:the-gloss). Not one of his
       numbered clauses: a law of the mechanism, written the run the mechanism
       was built, so it cannot spread into decoration. A card carries at most
       one "?", and it never hangs on a figure or on the page's answer, where
       it would read as doubt about the number instead of help with the word.
       The trigger is InfoTip's own button, found by its accessible name. */
    const TIP = '[aria-label="What this means"]';
    for (const card of cards) {
      const tips = [...card.querySelectorAll(TIP)];
      if (tips.length > 1) red(idOf(card), "GLOSS", `${tips.length} glosses on one card; one card, one word explained`);
      for (const t of tips) {
        if (t.closest(".fig") || t.closest("[data-answer]")) red(idOf(card), "GLOSS", "a gloss on a figure or on the page's answer; it belongs beside the words, not the number");
      }
    }
    for (const card of cards) {
      const figs = card.querySelectorAll(".fig").length;
      const others = card.querySelectorAll("[data-kv-cell], [data-row], [data-visual], details, table, [data-second], [data-track], [data-mark], [data-note], li").length;
      if (figs === 1 && others === 0) red(idOf(card), "LONE FIGURE", `one figure and nothing beside it: a second reading, a drawing or its details (clause 65)`);
    }
  }
  return { reds, cards: cards.length, contentW: Math.round(contentW) };
}

const reds = [];
const browser = await chromium.launch();
for (const file of files) {
  const name = basename(file).replace(/\.html$/, "");
  if (!existsSync(file)) { reds.push({ page: name, w: "all", id: "-", rule: "NO RENDER", msg: "the list names this page and no render exists under scratchpad/harness/pages" }); continue; }
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.evaluate(async () => { for (const im of document.images) { im.loading = "eager"; try { await im.decode(); } catch { /* not this check's business */ } } });
    const walk = await page.evaluate(inPage, w);
    if (walk.cards === 0) reds.push({ page: name, w, id: "page", rule: "NO SECTIONS", msg: "no section card found under main; the render or the landmark is broken" });
    for (const r of walk.reds) reds.push({ page: name, w, ...r });
    console.log(`${name}@${w}: ${walk.cards} cards, ${walk.reds.length} red(s)`);
    await ctx.close();
  }
}
await browser.close();
console.log(`page laws: ${files.length} page(s) x ${WIDTHS.length} widths, ${reds.length} red(s)`);
for (const r of reds) console.log(`  ${r.page}@${r.w} #${r.id}: ${r.rule}: ${r.msg}`);

/* THE PER-PAGE RATCHET, the page filter's rule: seeded at the first honest
   measurement, falling only, never raised by hand. */
const BASELINE = "scripts/harness/page_laws_baseline.json";
const WRITE_BASELINE = args.includes("--write-baseline");
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
let exit = 0;
if (over.length) { console.log(`page laws RATCHET: ${over.length} page(s) over their baseline: ${over.join("; ")}`); exit = 1; }
if (WRITE_BASELINE) {
  for (const name of files.map((f) => basename(f, ".html"))) { const have = byPage[name] ?? 0; if (!(name in base) || have < base[name]) base[name] = have; }
  for (const k of Object.keys(base)) if (base[k] === 0) delete base[k];
  writeFileSync(BASELINE, JSON.stringify(base, null, 2) + String.fromCharCode(10));
  console.log(`page laws RATCHET: baseline written to ${BASELINE}${under.length ? ` (lowered: ${under.join("; ")})` : ""}; a page over its entry is still red, the entry never rises`);
} else if (under.length) console.log(`page laws RATCHET: ${under.join("; ")} (run with --write-baseline to lower it)`);
const held = Object.entries(base).filter(([k]) => byPage[k]).map(([k, v]) => `${k} ${byPage[k]} of ${v}`);
if (held.length && !exit) console.log(`page laws RATCHET: holding at baseline on ${held.join(", ")}; his laws are not met there yet and this is not a pass`);
process.exit(exit);
