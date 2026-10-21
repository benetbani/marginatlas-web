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
 *   56 TEXT CUT           a text cut to an ellipsis or a line clamp: an element
 *                         whose text-overflow is ellipsis and whose text is
 *                         wider than its box, or whose line clamp hides lines
 *                         (2026-09-26: the UK page's legal forms "S...", "L...",
 *                         "J..." and "United Kin..." at 768, London's peer
 *                         cities cut to four letters, all passing every rule)
 *   56 TEXT OVERLAP       two text leaves of one card intersecting; an element
 *                         under `[data-overlay]` is exempt
 *   58 PARTS NOT REVEALED a card declaring `data-parts` over 1 with no
 *                         disclosure inside it (details, a tab list, a popup)
 *   8  ROW TOPS           two figures in one row of a key-value grid more than
 *                         2px apart (his ruling 8 of 2026-09-04, equal rows in
 *                         every case; 2026-09-26: the phone photograph found
 *                         the UK's "Getting paid" figures 18px apart once the
 *                         icons squeezed a label to three lines, and no rule
 *                         read a page's grids at every width; planted by
 *                         putting the tile back on the label's line at 375)
 *   -- COLUMN ENDS        a drawn column (a filled box 4 wide or more, 24 tall
 *                         or more, twice as tall as wide) whose top corners
 *                         round past 2px (2026-10-01, the three critics his
 *                         message of 2026-09-27 sent: a rounded top hides
 *                         where a bar ends; Obstacles and SpendByIncome ended
 *                         at 8px because `rounded-t-sm` is 8px in this
 *                         config, the month bars at 2px; proven on the renders
 *                         that carried the 8px tops)
 *   -- CRUMB CUT          the trail back up (Crumbs.tsx) at every width: a text
 *                         run on the nav's visible line that crosses its edge,
 *                         or a trail on two lines (release 3 job C, 2026-10-16:
 *                         13 of 22 longest trails were cut mid-word at 320 and
 *                         375 and no rule saw it, the crumb being outside every
 *                         card; the reading is scripts/lib/crumb_cut.mjs, its
 *                         blind spot stated there, and a nav whose visible line
 *                         gave the reading no text is a red of its own)
 *   -- TAP SIZE           at 375, a control or a link in a card whose tap
 *                         (its box, its absolute `::before` or `::after`, a
 *                         box's labels) is under 44 tall or 24 wide
 *                         (2026-10-01: the "?" took 14 by 14, the cover boxes
 *                         16, the sort heads 24, the switch 26, the pager 32;
 *                         a text field, a select and a link inside a sentence
 *                         are exempt and said)
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
 *                         (a level is a zone on a band page, since plan 2026-10-13)
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
import { openPanels, OPENED } from "../lib/open_panels.mjs";
import { crumbCutInPage } from "../lib/crumb_cut.mjs";

await requireBrowser("harness-page-laws", "the page laws of 2026-09-20 (levels, text measure, card feet, the hero's side, overlap, repeated kinds, parts) on every page in scripts/harness/pages.json");
preflight({ browser: true, name: "check_page_laws" });

const WIDTHS = [1280, 768, 375];
const args = process.argv.slice(2);
const listArg = args.find((a) => a === "--list" || a.startsWith("--list="));
const LIST = listArg && listArg.includes("=") ? listArg.slice("--list=".length) : "scripts/harness/pages.json";
/* The list's renders stand in HARNESS_PAGES_DIR when it is set (a planted list's own directory, as scripts/lib/page_renders.mjs reads it;
   the chain never sets it), else in scratchpad/harness/pages. */
const PAGES_DIR = process.env.HARNESS_PAGES_DIR || "scratchpad/harness/pages";
const listed = listArg ? JSON.parse(readFileSync(LIST, "utf8")).pages.map((p) => `${PAGES_DIR}/${p.surface}-${p.slugs.join("-")}.html`) : [];
const files = [...args.filter((a) => !a.startsWith("--")), ...listed];
if (files.length === 0) { console.error("usage: node scripts/harness/check_page_laws.mjs <rendered.html ...> | --list[=pages.json] [--write-baseline]"); process.exit(2); }

/* THE IN-PAGE WALK. Everything below runs inside the browser; it takes the
   viewport width so the level and measure rules know whether they apply. */
function inPage({ width, pageName, opened = false }) {
  /* The four chart forms of 2026-09-25 (src/components/spine/charts/: a figure on the world's range, a bar list, a ring with its
     centre figure, a country's span against the world's) draw, so they are visual kinds like the rest. */
  /* The page-agnostic sections of the same night (src/components/spine/sections/) that draw: a cohort's curve, columns, a scale of
     rates, age bars, pies, a trip bar, a market bar, a price table with its bars. The apps directory and the thresholds are rows
     and a list, text-only, and are not here. */
  const VISUAL = new Set(["world-range", "bar-list", "range-pair", "ranked-bars", "range-strip", "spectra-table", "pay-bars", "income-breakdown", "bento-band", "city-cards", "segment-bar", "hero-board", "donut", "ring", "month-bars", "share-bar", "bento-count", "survival-curve", "obstacles", "spend-by-income", "spend-by-age", "job-market", "age-mix", "origin", "customers-come", "market-hold", "stock-tiers"]);
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
  /* A FILLED KIT 3 PANEL IS INK (version 3's `data-surface="panel"`: a cell of the hero, his approval of version 3 and of the industry
     page v6 on it, 2026-10-21): its ground is drawn to its edges, so the hero's cells end where their grounds end, not where their words
     do. Only a page drawn on version 3 declares surfaces. */
  const kit3Panel = (el, es) => !!el.closest(".kit3") && el.getAttribute("data-surface") === "panel" && /rgba?\((?!0, 0, 0, 0)/.test(es.backgroundColor);
  const isInk = (el, es) => { const txt = (el.textContent || "").trim(); const leaf = el.children.length === 0 || el.tagName === "svg" || el.tagName === "IMG"; if (!leaf) return false; if (txt || el.tagName === "svg" || el.tagName === "IMG") return true; return /rgba?\((?!0, 0, 0, 0)/.test(es.backgroundColor); };
  const reds = [];
  const red = (id, rule, msg) => reds.push({ id, rule, msg });

  /* THE LEVELS, at 1280 only, on the closed reading (plan 2026-10-13, Task 1E). */
  if (width >= 1280 && !opened) {
    const bands = [...document.querySelectorAll("main [data-band], main [data-hero]")].filter((b) => b.getClientRects().length);
    for (const band of bands) {
      /* A BENTO CLUSTER IS ONE CARD (the spec's blind spot, stated): the
         cluster's root stamps `data-band="bento"` because it IS the band, and
         its children are cells, not cards; the four-cell premises and market
         clusters are one card each under clauses 50 and 53. The cluster fills
         its level by construction; a hole inside a cell is the page filter's. */
      if (band.getAttribute("data-band") === "bento") continue;
      /* A LEVEL ON A BAND PAGE IS A ZONE (MODEL.md PART 10, "what it supersedes, on a band page only": clauses 50, 52 and 53):
         a masthead standing in its zone is read by the zone laws below, never as a bento level that must fill and draw. */
      if (band.closest("[data-zone]")) continue;
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
      if (kit3Panel(el, es) && b.width && b.height) { lastInk = Math.max(lastInk, b.bottom); rightInk = Math.max(rightInk, b.right); }
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
    /* 8 ROW TOPS: in every key-value grid of the card, the cells standing in one row (their tops within 4px) put their figures
       within 2px of one another. */
    for (const grid of card.querySelectorAll("[data-archetype='kv-grid']")) {
      if (!grid.getClientRects().length) continue;
      const rowsByTop = new Map();
      for (const cell of grid.querySelectorAll("[data-kv-cell]")) {
        const fig = cell.querySelector(".fig");
        if (!fig || !cell.getClientRects().length) continue;
        const k = Math.round(cell.getBoundingClientRect().top / 4);
        if (!rowsByTop.has(k)) rowsByTop.set(k, []);
        rowsByTop.get(k).push(Math.round(fig.getBoundingClientRect().top));
      }
      for (const tops of rowsByTop.values()) if (tops.length > 1 && Math.max(...tops) - Math.min(...tops) > 2) red(id, "ROW TOPS", `figures in one grid row at tops ${tops.join(", ")}, ${Math.max(...tops) - Math.min(...tops)}px apart (ruling 8)`);
    }
    /* -- COLUMN ENDS (2026-10-01, the critics' chart lesson: "it's hard to tell where the bar ends with a rounded top"): a drawn
       column, a filled box at least 4 wide, 24 tall and twice as tall as wide, ends square, its top corners 2px at most, the
       month bars' corner. Ticks (under 4 wide), dots and the hero's rank marks (under 24 tall) are not columns. Blind spot: a
       column drawn in SVG, or one whose rounding is a clip-path, is not read. */
    for (const el of card.querySelectorAll("[data-visual] *")) {
      if (el.closest("svg, img, button, a, input") || el.matches("[data-card]") || el.querySelector("[data-card]") || !el.getClientRects().length || hiddenLeaf(el)) continue;
      const b = el.getBoundingClientRect();
      if (b.width < 4 || b.height < 24 || b.height < b.width * 2) continue;
      const es = getComputedStyle(el);
      const filled = !/rgba\(0, 0, 0, 0\)|transparent/.test(es.backgroundColor) || es.backgroundImage !== "none";
      const corner = Math.max(parseFloat(es.borderTopLeftRadius) || 0, parseFloat(es.borderTopRightRadius) || 0);
      if (filled && corner > 2) red(id, "COLUMN ENDS", `a column ${Math.round(b.width)} by ${Math.round(b.height)} ends in a ${Math.round(corner)}px round; a column ends square, 2px at most, so the reader sees where it ends`);
    }
    /* -- TAP SIZE (2026-10-01, the critics' "interactive feedback"; Apple's 44 and WCAG's 24): at 375, every control and every
       link in a card takes a tap 44 tall and 24 wide, counting its tap area (a `::before` or `::after` drawn absolute, the
       `.tap` and `.tap-y` utilities) and, for a box, every label of it. Exempt and said: a text field and a select (a typed
       field and the native picker; their boxes are the look), and a link inside a sentence (WCAG's inline exception). */
    if (width === 375) {
      const hit = (el) => {
        const r = el.getBoundingClientRect(); let w = r.width, h = r.height;
        for (const pseudo of ["::before", "::after"]) {
          const ps = getComputedStyle(el, pseudo);
          if (ps.content && ps.content !== "none" && ps.position === "absolute") { w = Math.max(w, parseFloat(ps.width) || 0); h = Math.max(h, parseFloat(ps.height) || 0); }
        }
        return { w, h };
      };
      for (const el of card.querySelectorAll("button, summary, [role='button'], a[href], input[type='checkbox'], input[type='radio'], input[type='range']")) {
        if (!el.getClientRects().length || hiddenLeaf(el) || el.getBoundingClientRect().width < 2) continue;
        if (el.matches("a[href]") && el.parentElement && el.parentElement.matches("p, li") && [...el.parentElement.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
        let { w, h } = hit(el);
        if (el.matches("input[type='checkbox'], input[type='radio']")) for (const lab of [...(el.labels || [])]) { const l = hit(lab); w = Math.max(w, l.w); h = Math.max(h, l.h); }
        if (h < 43.5 || w < 23.5) red(id, "TAP SIZE", `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 28)}" takes a tap ${Math.round(w)} by ${Math.round(h)}; 44 tall and 24 wide at the least`);
      }
    }
    /* 52 CARD FOOT BLANK */
    if (lastInk > -Infinity && y1 - lastInk > 48) red(id, "CARD FOOT BLANK", `${Math.round(y1 - lastInk)}px of nothing between the card's last ink and its bottom edge (clause 52)`);
    /* 52 HERO SIDE BLANK */
    if (card === heroCard && width >= 768 && rightInk > -Infinity) { const share = (rightInk - x0) / (x1 - x0); if (share < 0.75) red(id, "HERO SIDE BLANK", `the hero's ink ends at ${Math.round(share * 100)} percent of its width; the right ${Math.round((1 - share) * 100)} percent is empty (clause 52)`); }
    /* 51 TEXT WIDE */
    /* THE HERO PLATE'S BASIS LINE ON KIT-VERSION 3 is one line under its answer, as the approved industry page v6 draws it at every width
       over 560 ("v6 is the approved industry target.", 2026-10-21): 79 characters, the reading measure's own length, not a paragraph run
       across the page. Held to half the page it wraps and leaves the plate's right side a hole (the page filter's WHITE SPACE). That one
       line (`.kit3 .fig-card .as`) is not read here; every other run is. */
    const kit3Basis = (t) => !!t.el && !!t.el.closest(".kit3 .fig-card .as");
    if (width >= 768) for (const t of texts) { if (t.inTable || t.txt.length < 60 || kit3Basis(t)) continue; if (t.rect.width > contentW / 2 + 1) red(id, "TEXT WIDE", `a run of text measures ${Math.round(t.rect.width)}px, over half the page's ${Math.round(contentW)}px: "${t.txt.slice(0, 48)}..." (clause 51)`); }
    /* 56 TEXT OUT OF BOX and TEXT OVERLAP */
    for (const t of texts) { if (t.rect.right > x1 + 1 || t.rect.left < x0 - 1) red(id, "TEXT OUT OF BOX", `"${t.txt.slice(0, 40)}" runs ${Math.round(Math.max(t.rect.right - x1, x0 - t.rect.left))}px past the card's box (clause 56)`); }
    /* 56 TEXT CUT: text the reader cannot read because its box cut it, to an ellipsis or at a clamp. Blind spot: text clipped by an
       overflow-hidden box with no ellipsis and no clamp (it reads as TEXT OUT OF BOX only when it passes the card's own box). */
    for (const el of card.querySelectorAll("*")) {
      if (!el.getClientRects().length || hiddenLeaf(el)) continue;
      const cs = getComputedStyle(el);
      const ellipsis = cs.textOverflow === "ellipsis" && cs.overflowX !== "visible" && el.scrollWidth > el.clientWidth + 1;
      const clamped = cs.webkitLineClamp && cs.webkitLineClamp !== "none" && el.scrollHeight > el.clientHeight + 1;
      if (ellipsis || clamped) red(id, "TEXT CUT", `"${(el.textContent || "").trim().slice(0, 40)}" is cut ${ellipsis ? `to ${el.clientWidth} of its ${el.scrollWidth}px` : "at its line clamp"}; a label wraps or its column grows, it is never cut (clause 56)`);
    }
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

  /* THE PAGE, once at 1280: kinds, twins and distance; on the closed reading (plan 2026-10-13, Task 1E). */
  if (width >= 1280 && !opened) {
    const byKind = new Map();
    for (const card of cards) { if (!isVisual(card)) continue; const k = archetypeOf(card); if (!byKind.has(k)) byKind.set(k, []); byKind.get(k).push(card); }
    /* THE LEVELS IN ORDER, so "neighbouring" is a fact of the page and not of the DOM's depth: a card's level is its nearest band or hero; a bento's cells share their cluster's level. */
    /* A ZONE IS A LEVEL (plan 2026-10-13 country-page-journey, Task 1E; MODEL PART 10 keeps clause 64 on a band page): the old reading found a
       level by [data-band] or [data-hero] alone, which no zone carries, so on a band page it compared the hero and nothing else. A card's level
       is its outermost zone, band or hero; the levels are those, in page order. */
    const LEVEL = "[data-zone], [data-band], [data-hero]";
    const levels = [...document.querySelectorAll("main [data-zone], main [data-band], main [data-hero]")].filter((b) => b.getClientRects().length && !b.parentElement.closest(LEVEL));
    const levelOf = (card) => { let l = card.closest(LEVEL); while (l && l.parentElement && l.parentElement.closest(LEVEL)) l = l.parentElement.closest(LEVEL); return l; };
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
        /* The page's answer is `data-answer="1"`; since plan 2026-10-13 (country-page-journey, Task 1C) a slot or a list declares its
           answer type in `data-answer` too, and a gloss beside a slot's title is no gloss on the answer. */
        if (t.closest(".fig") || t.closest('[data-answer="1"]')) red(idOf(card), "GLOSS", "a gloss on a figure or on the page's answer; it belongs beside the words, not the number");
      }
    }
    for (const card of cards) {
      const figs = card.querySelectorAll(".fig").length;
      const others = card.querySelectorAll("[data-kv-cell], [data-row], [data-visual], details, table, [data-second], [data-track], [data-mark], [data-note], li").length;
      if (figs === 1 && others === 0) red(idOf(card), "LONE FIGURE", `one figure and nothing beside it: a second reading, a drawing or its details (clause 65)`);
    }
  }

  /* THE ZONES, THE BAND PAGE'S OWN LAWS (2026-10-04, his ruling of that day: "abandon the bento in favor of a more traditional
     thing where the sections have alternating background colors ... the rendering of the tables ... has a horrible execution";
     the design in docs/superpowers/specs/2026-10-04-uk-page-reform-design.md, sections 3 to 5). They run only where a page draws
     zones, at every width, and each reads the thing he saw rather than a class:
       ZONE TONES    neighbouring zones are not one colour, and every zone is paper (#ffffff) or tint (#f6f6f5), but for the one
                     terracotta zone, the home's band, accepted once and on home-gb only (plan 2026-10-10, Task 5), its colour --terra-full read from the stylesheet (plan 2026-10-13, Task 5).
       ZONE PAD      a zone's padding is the ladder's: 40 / 48 / 64 at 375 / 768 / 1024 and up; the first zone 24 / 32 / 48, and its first section stands on that padding's edge (plan 2026-10-12 rhythm-air-inside, Task 1C).
       ZONE SPLIT    a zone that declares a pair draws two cells, and no cell stands empty.
       OPEN SECTION  a section card on a zone stands open (no edge, no fill), and a box that stays on a zone holds something the
                     reader operates (a control, a link): the card he kept for instruments and doors, nothing else.
       SPLIT ROW     at 375, a table row's figures stand on one line (the old peer table wrapped five figures under two rows of
                     heads), and a form's figures stand on its name's first line.
       HEAD LINES    at 375, a column head of a phone table is two lines at the most.
     Their blind spots, stated: a row drawn without `data-row` inside a phone table, or a figure cell without `data-col`, is not
     read by SPLIT ROW; a band painted by something other than a zone is not a zone. */
  const zones = [...document.querySelectorAll("main [data-zone]")].filter((z) => z.getClientRects().length);
  /* LEVEL HEIGHT's own count of what it read (below), returned with the walk: zones declaring two cells, and levels of two read side by side. */
  let levelPairs = 0, levelsRead = 0;
  /* The zones are read closed (plan 2026-10-13 country-page-journey, Task 1E): a plus a reader opened is his. */
  if (zones.length && !opened) {
    const PAPER = "rgb(255, 255, 255)", TINT = "rgb(246, 246, 245)";
    /* THE ONE TERRACOTTA ZONE (his request of 2026-10-10 for one section in terracotta; his decision of 2026-10-13, one solid statement on
       the brand terracotta at full strength; plan 2026-10-13 home-quiet-editorial, Task 5): the home's band, accepted once and only on
       home-gb; on any other page, or a second time on the home, a red. Its colour is read from the token, never typed, so the token's value
       stays one line in globals.css; a token that does not resolve probes as transparent and is a red of its own, or a band left unpainted
       would match it and pass. */
    const TERRA = (() => { const d = document.createElement("div"); d.style.backgroundColor = "var(--terra-full)"; document.body.appendChild(d); const c = getComputedStyle(d).backgroundColor; d.remove(); return c; })(), TERRA_PAGE = "home-gb";
    if (/^rgba\(0, 0, 0, 0\)$|^transparent$/.test(TERRA)) red("page", "ZONE TONES", "the band's colour --terra-full does not resolve; the one terracotta zone cannot be told from an unpainted one");
    let terra = 0;
    const want = width >= 1024 ? [48, 64] : width >= 768 ? [32, 48] : [24, 40];
    let prev = null;
    zones.forEach((z, i) => {
      const cs = getComputedStyle(z);
      const zid = z.getAttribute("data-zone-label") || z.getAttribute("aria-label") || z.querySelector("[id]")?.id || `zone ${i + 1}`;
      const bg = cs.backgroundColor;
      if (bg === TERRA) {
        terra++;
        if (pageName !== TERRA_PAGE) red(zid, "ZONE TONES", `a zone painted the band's terracotta (${bg}) on ${pageName}; the one terracotta zone is the home's band, on ${TERRA_PAGE}`);
        else if (terra > 1) red(zid, "ZONE TONES", `a second terracotta zone (${bg}); the home holds one, its band`);
      } else if (bg !== PAPER && bg !== TINT) red(zid, "ZONE TONES", `a zone painted ${bg}; a zone is paper (${PAPER}) or tint (${TINT})`);
      if (prev && prev === bg) red(zid, "ZONE TONES", `two neighbouring zones in one colour (${bg}); zones alternate`);
      prev = bg;
      const top = Math.round(parseFloat(cs.paddingTop)), bottom = Math.round(parseFloat(cs.paddingBottom));
      const wantTop = i === 0 ? want[0] : want[1];
      if (top !== wantTop || bottom !== want[1]) red(zid, "ZONE PAD", `padding ${top} above and ${bottom} below; the ladder asks ${wantTop} and ${want[1]} at ${width}`);
      /* THE FIRST SECTION STANDS ON ITS ZONE'S PADDING EDGE (plan 2026-10-12 rhythm-air-inside, Task 1C; spec section 3): ZONE PAD read the
         padding and nothing inside it, so the kit's hero wrapper's mt-8 stood every spine masthead 32 under it, 96 under the bar at 1024 up
         against DISTANCES 2.3's 64 (R1 2026-10-12, section 5). With the site column's 16 above the zone the masthead then stands 40 / 48 / 64
         under the bar where the zone opens the column; a breadcrumb ahead of the zone keeps its own height and the rule reads inside the zone. */
      if (i === 0) {
        const first = z.querySelector(":scope > [data-zone-level] > [data-zone-cell] > *");
        if (first) {
          const gap = Math.round(first.getBoundingClientRect().top - z.getBoundingClientRect().top);
          if (gap !== top) red(zid, "ZONE PAD", `the first section stands ${gap} under its zone's top edge, ${gap - top} more than the zone's padding of ${top}; nothing inside the first zone adds to the masthead's 64 under the bar at 1024 up (DISTANCES 2.3)`);
        }
      }
      const split = z.getAttribute("data-zone");
      const cells = [...z.querySelectorAll(":scope > [data-zone-level] > [data-zone-cell]")];
      const cellsAsked = split === "wide" || split === "lone" ? 1 : split === "1-1-1" ? 3 : 2;
      if (width >= 1280 && split && cellsAsked === 2) levelPairs++;
      if (split && cells.length !== cellsAsked) red(zid, "ZONE SPLIT", `a zone declared ${split} draws ${cells.length} cell(s)`);
      for (const c of cells) {
        const r = c.getBoundingClientRect();
        if (r.height < 8 || !(c.textContent || "").trim()) red(zid, "ZONE SPLIT", `an empty cell in a zone (${Math.round(r.width)} by ${Math.round(r.height)})`);
      }
      /* LEVEL HEIGHT (final review I3, 2026-10-15; his ruling 7 of 2026-09-04: "two sections on one horizontal level share one height, no
         matter what"). A zone is an open level, so the air beside a short section stands outside every card, where the holes' WHITE SPACE
         (inside a card) cannot see it. At 1280, on the closed reading, a level of two cells side by side: their content bottoms (the
         lowest drawn element in each cell, measured from the level's top) differ by at most max(48px, a fifth of the taller).
         BLIND SPOT, stated: it reads the closed page at one width; a pair equal at 1280 may part at 1024 or once a plus is opened (a
         reader's opening is his), and it measures boxes, so a cell's drawn but empty box counts as content.
         IT COUNTS WHAT IT READS (the fix wave's re-review, Important 1, 2026-10-15; a gate never passes having read nothing): each level of two
         read side by side counts, beside the zones that declare two cells, and the run reds a page that declares a level of two and reads
         none, a run that read no page at 1280, a ledger page that reads no level, and a list that gave the law no level at all. */
      if (width >= 1280 && cells.length === 2) {
        const [ca, cb] = cells;
        const ra = ca.getBoundingClientRect(), rb = cb.getBoundingClientRect();
        if (Math.abs(ra.top - rb.top) < 2 && ra.right <= rb.left + 1) {
          levelsRead++;
          const inkBottom = (cell) => { let b = cell.getBoundingClientRect().top; for (const el of cell.querySelectorAll("*")) { const er = el.getBoundingClientRect(); if (er.width > 0 && er.height > 0 && el.getClientRects().length) b = Math.max(b, er.bottom); } return b; };
          const top = Math.min(ra.top, rb.top);
          const ha = Math.round(inkBottom(ca) - top), hb = Math.round(inkBottom(cb) - top);
          const taller = Math.max(ha, hb), diff = Math.abs(ha - hb), allowed = Math.round(Math.max(48, taller / 5));
          if (diff > allowed) red(zid, "LEVEL HEIGHT", `the two sections of a level end ${diff}px apart (${ha} and ${hb} tall), over the ${allowed} allowed (max of 48 and a fifth of the taller); two sections on one level share one height (ruling 7)`);
        }
      }
      for (const card of z.querySelectorAll("[data-card]")) {
        const ccs = getComputedStyle(card);
        const edged = parseFloat(ccs.borderTopWidth) > 0 || (ccs.backgroundColor !== "rgba(0, 0, 0, 0)" && ccs.backgroundColor !== "transparent");
        const kept = card.hasAttribute("data-keep-card");
        /* A card that is itself a link is a door (a city card): it keeps its box by the same ruling, and its control is itself. */
        const door = card.matches("a[href]");
        if (!kept && !door && edged) red(idOf(card), "OPEN SECTION", "a section card on a zone still draws its box (an edge or a fill); a section stands open on the band");
        /* A disclosure's summary is a control (the plus opens in place), and his masthead board is the one card kept as the page's
           lead object by his design of 2026-09-20 (research R3, 3.7: "it must read as one object beside open content"). */
        if (kept && card.getAttribute("data-archetype") !== "hero-board" && !card.querySelector("input, select, textarea, button, a[href], summary")) red(idOf(card), "OPEN SECTION", "a card kept on a zone holds no control and no link; a box on the band is for an instrument or a door");
      }
      for (const inst of z.querySelectorAll("[data-instrument], [data-lever-card]")) {
        if (!inst.querySelector("input, select, textarea, button, a[href], summary")) red(idOf(inst.closest("[data-card]") || inst), "OPEN SECTION", "an instrument panel with nothing to operate");
      }
    });
  }
  /* THE PHONE TABLES ON EVERY PAGE, NOT ONLY ON A BAND PAGE (the code review of 2026-10-04: the tables are shared components, the
     reform changed their phone form on every page, and inside the zones' block nothing read a card page's tables). */
  {
    if (width <= 400) {
      for (const row of document.querySelectorAll("main [data-phone-table] [data-row]")) {
        if (!row.getClientRects().length) continue;
        const tops = [...row.querySelectorAll("[data-col]")].filter((c) => c.getClientRects().length).map((c) => Math.round(c.getBoundingClientRect().top));
        if (tops.length > 1 && Math.max(...tops) - Math.min(...tops) > 4) red(idOf(row.closest(CARD) || row), "SPLIT ROW", `row "${(row.querySelector("[data-label]")?.textContent || "").trim().slice(0, 24)}": its figures stand on more than one line (tops ${[...new Set(tops)].join(", ")})`);
      }
      /* A legal form's readings stand on ONE line: on the name's first line where the name keeps its column, or on a line of their
         own under the whole name (research R2's pattern f, a table under 330px wide); never level with a name's second line. */
      for (const row of document.querySelectorAll("main [data-tier-row]")) {
        if (!row.getClientRects().length) continue;
        const name = row.querySelector("[data-label]");
        if (!name) continue;
        const nr = name.getBoundingClientRect();
        const cells = [...row.querySelectorAll("[data-col]")].filter((c) => c.getClientRects().length);
        if (!cells.length) continue;
        const tops = cells.map((c) => c.getBoundingClientRect().top);
        const label = (name.textContent || "").trim().slice(0, 24);
        if (Math.max(...tops) - Math.min(...tops) > 4) { red(idOf(row.closest(CARD) || row), "SPLIT ROW", `form "${label}": its readings stand on more than one line`); continue; }
        const under = Math.min(...tops) >= nr.bottom - 2;
        if (!under) for (const c of cells) {
          if (Math.abs(c.getBoundingClientRect().top - nr.top) > 6) red(idOf(row.closest(CARD) || row), "SPLIT ROW", `form "${label}": its ${c.getAttribute("data-col")} stands off its name's first line`);
        }
      }
      for (const head of document.querySelectorAll("main [data-phone-table] [data-sort-head]")) {
        if (!head.getClientRects().length) continue;
        const lh = parseFloat(getComputedStyle(head).lineHeight) || 16;
        const lines = Math.round(head.getBoundingClientRect().height / lh);
        if (lines > 2) red(idOf(head.closest(CARD) || head), "HEAD LINES", `the head "${(head.textContent || "").trim().slice(0, 24)}" stands on ${lines} lines at ${width}; two at the most`);
      }
    }
  }
  return { reds, cards: cards.length, contentW: Math.round(contentW), levels: { declared: levelPairs, read: levelsRead } };
}

const reds = [];
/* LEVEL HEIGHT's reading, page by page at 1280: { declared, read }. */
const levelSeen = {};
const browser = await chromium.launch();
for (const file of files) {
  const name = basename(file).replace(/\.html$/, "");
  if (!existsSync(file)) { reds.push({ page: name, w: "all", id: "-", rule: "NO RENDER", msg: `the list names this page and no render exists under ${PAGES_DIR}` }); continue; }
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.evaluate(async () => { for (const im of document.images) { im.loading = "eager"; try { await im.decode(); } catch { /* not this check's business */ } } });
    const walk = await page.evaluate(inPage, { width: w, pageName: name });
    if (w >= 1280) levelSeen[name] = walk.levels;
    if (walk.cards === 0) reds.push({ page: name, w, id: "page", rule: "NO SECTIONS", msg: "no section card found under main; the render or the landmark is broken" });
    for (const r of walk.reds) reds.push({ page: name, w, ...r });
    /* CRUMB CUT (scripts/lib/crumb_cut.mjs): the trail stands outside every card, so the card walk above never reads it. */
    const crumb = await page.evaluate(crumbCutInPage);
    for (const c of crumb.cuts) reds.push({ page: name, w, id: "crumb", rule: "CRUMB CUT", msg: `${c.msg} ("${c.trail.slice(0, 60)}")` });
    if (crumb.navs > 0 && crumb.runs === 0) reds.push({ page: name, w, id: "crumb", rule: "CRUMB CUT", msg: "the page draws a trail and its visible line gave the reading no text; the reading measured nothing" });
    /* THE OPENED READING (plan 2026-10-13 country-page-journey, Task 1E; spec section 5): the card rules read again with every plus open; a red
       only the open page makes is the plus's, named so. Levels, zones and the page's kinds are read closed (a plus a reader opened is his). */
    if (await page.evaluate(openPanels)) {
      const ow = await page.evaluate(inPage, { width: w, pageName: name, opened: true });
      const said = new Set(walk.reds.map((r) => `${r.id}␟${r.rule}`));
      for (const r of ow.reds) if (!said.has(`${r.id}␟${r.rule}`)) reds.push({ page: name, w, ...r, msg: `${r.msg}${OPENED}` });
    }
    console.log(`${name}@${w}: ${walk.cards} cards, ${walk.reds.length} red(s); trail ${crumb.navs ? `${crumb.runs} run(s) read, ${crumb.cuts.length} cut` : "none drawn"}`);
    await ctx.close();
  }
}
await browser.close();
const levelTotal = Object.values(levelSeen).reduce((a, l) => a + l.read, 0);
console.log(`page laws: ${files.length} page(s) x ${WIDTHS.length} widths, ${reds.length} red(s); LEVEL HEIGHT read ${levelTotal} level(s) of two at 1280 (${Object.entries(levelSeen).map(([k, l]) => `${k} ${l.read} of ${l.declared} declared`).join(", ") || "no page read at 1280"})`);
for (const r of reds) console.log(`  ${r.page}@${r.w} #${r.id}: ${r.rule}: ${r.msg}`);

/* THE PER-PAGE RATCHET, the page filter's rule: seeded at the first honest
   measurement, falling only, never raised by hand. */
const BASELINE = "scripts/harness/page_laws_baseline.json";
const WRITE_BASELINE = args.includes("--write-baseline");
/* LEVEL HEIGHT KEEPS ITS OWN LEDGER (final review I3, 2026-10-15): the law is new on every page type, so each page's first measurement of it
   is seeded in scripts/harness/level_height_baseline.json (never added to a page's ratchet here, which would raise it), and falls the same
   way: a page with no entry must have zero, an entry never rises. */
const LEVEL_RULE = "LEVEL HEIGHT", LEVEL_BASELINE = "scripts/harness/level_height_baseline.json";
const byPage = {}, levelByPage = {};
for (const r of reds) {
  if (r.rule === LEVEL_RULE) levelByPage[r.page] = (levelByPage[r.page] ?? 0) + 1;
  else byPage[r.page] = (byPage[r.page] ?? 0) + 1;
}
let levelBase = {};
try { levelBase = JSON.parse(readFileSync(LEVEL_BASELINE, "utf8")); } catch { levelBase = {}; }
const levelOver = [], levelUnder = [];
for (const name of files.map((f) => basename(f, ".html"))) {
  const have = levelByPage[name] ?? 0, allowed = typeof levelBase[name] === "number" ? levelBase[name] : 0;
  if (have > allowed) levelOver.push(`${name}: ${have} against a first measurement of ${allowed}`);
  else if (have < allowed) levelUnder.push(`${name}: ${have}, first measurement ${allowed} can fall`);
}
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
if (levelOver.length) { console.log(`page laws LEVEL HEIGHT: ${levelOver.length} page(s) over their ledger (${LEVEL_BASELINE}): ${levelOver.join("; ")}`); exit = 1; }
/* LEVEL HEIGHT READ NOTHING (the fix wave's re-review, Important 1): the law reds what it measured, so it must also say when it measured
   nothing. A page that declares a level of two and reads none side by side (a drifted grid, a cell reading that matches nothing), a run
   that read no page at 1280 (the widths), a ledger page whose entry says it draws uneven levels and that reads none (lowered only by
   --write-baseline), and a list run whose pages gave the law no level at all, each red. A page passed by hand that declares no level of
   two is not red: it holds nothing for the law to read, and the summary line says so. */
const levelNothing = [];
if (files.some((f) => existsSync(f)) && !Object.keys(levelSeen).length) levelNothing.push(`the run read no page at 1280 (widths ${WIDTHS.join(", ")}), so the law measured nothing`);
for (const [name, l] of Object.entries(levelSeen)) {
  if (l.declared > 0 && l.read === 0) levelNothing.push(`${name}: declares ${l.declared} zone${l.declared === 1 ? "" : "s"} of two and the law read none side by side at 1280`);
  else if (!WRITE_BASELINE && typeof levelBase[name] === "number" && levelBase[name] > 0 && l.read === 0) levelNothing.push(`${name}: its ledger entry ${levelBase[name]} says it draws uneven levels and the law read no level of two there (lower it with --write-baseline if the page no longer draws one)`);
}
if (listArg && Object.keys(levelSeen).length && levelTotal === 0) levelNothing.push(`the list's ${files.length} page(s) gave the law no level of two at 1280`);
if (levelNothing.length) { for (const m of levelNothing) console.log(`page laws LEVEL HEIGHT READ NOTHING: ${m}`); exit = 1; }
if (levelUnder.length && !WRITE_BASELINE) console.log(`page laws LEVEL HEIGHT: ${levelUnder.join("; ")} (run with --write-baseline to lower it)`);
if (WRITE_BASELINE && levelUnder.length) {
  for (const name of files.map((f) => basename(f, ".html"))) { const have = levelByPage[name] ?? 0; if (typeof levelBase[name] === "number" && have < levelBase[name]) levelBase[name] = have; }
  for (const k of Object.keys(levelBase)) if (levelBase[k] === 0) delete levelBase[k];
  writeFileSync(LEVEL_BASELINE, JSON.stringify(levelBase, null, 2) + String.fromCharCode(10));
  console.log(`page laws LEVEL HEIGHT: ledger lowered (${levelUnder.join("; ")})`);
}
if (WRITE_BASELINE) {
  for (const name of files.map((f) => basename(f, ".html"))) { const have = byPage[name] ?? 0; if (!(name in base) || have < base[name]) base[name] = have; }
  for (const k of Object.keys(base)) if (base[k] === 0) delete base[k];
  writeFileSync(BASELINE, JSON.stringify(base, null, 2) + String.fromCharCode(10));
  console.log(`page laws RATCHET: baseline written to ${BASELINE}${under.length ? ` (lowered: ${under.join("; ")})` : ""}; a page over its entry is still red, the entry never rises`);
} else if (under.length) console.log(`page laws RATCHET: ${under.join("; ")} (run with --write-baseline to lower it)`);
const held = Object.entries(base).filter(([k]) => byPage[k]).map(([k, v]) => `${k} ${byPage[k]} of ${v}`);
if (held.length && !exit) console.log(`page laws RATCHET: holding at baseline on ${held.join(", ")}; his laws are not met there yet and this is not a pass`);
process.exit(exit);
