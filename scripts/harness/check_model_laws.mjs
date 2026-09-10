/**
 * THE MODEL'S THIRTEEN LAWS, MEASURED (task 4, 2026-09-08; FIGURE FACE added
 * 2026-09-11). MODEL.md PART 8.5
 * names twelve new checks "so the model is defended and not merely stated."
 * The thirteenth, FIGURE FACE, is not from PART 8.5: it defends the type law
 * in PART 3, which said figures carry the display face and had never once
 * been true on a rendered page until the day the rule was written.
 * This file is check_readability.mjs's sibling, built the same way: the same
 * preflight, the same `--list` handling over scripts/harness/pages.json, the
 * same red shape (page, width, card, rule), the same exit contract, and the
 * same practice of stating this instrument's blind spot before its numbers
 * are trusted.
 *
 * THE THIRTEEN, each a comment above its own block in `inPage()`, quoting
 * PART 8.5's clause. Two, MEASURED ONCE (BANNED WORDS at the copy level, on
 * COUNTRY-only static data with no browser and no database) also live as the
 * gate `model-laws-copy` in scripts/verify_model_laws_copy.ts, alongside ROW
 * SENTENCE and DISTRICT ADJECTIVE; this file is the full thirteen, which needs
 * a browser and is run by hand (`npm run harness:laws`), never in the chain.
 *
 * REAL MARKUP, NAMED HONESTLY. The brief names five markers as if the real
 * pages already carried them (`data-band`, `data-block`, `data-fact-cell`,
 * `data-track`, `data-district-row`). Reading the actual components before
 * writing a single rule (this repo's own first law): only `data-track` and
 * `data-row`/`data-pole` exist today; `data-band`, `data-block`,
 * `data-fact-cell`, `data-district-row` do not. Modifying a component is out
 * of this task's scope, so every rule below is written to run on BOTH the
 * fixture (which carries the literal marker, by instruction) AND, wherever a
 * true structural equivalent already exists in the shipped kit, the real
 * thing:
 *   BLOCK  = `[data-block]`, literal only. No component stamps it; a real
 *            page reports UNMEASURED, never a fabricated zero (this repo's
 *            own working-method rule 1: a check that cannot observe the
 *            thing it counts must not report it absent with a figure
 *            attached).
 *   BAND   = `[data-band]` UNION the parent of any matched block, excluding
 *            the three known real singleton wrappers that are not a
 *            two-up section at all: `[data-hero]`, `[data-wide-table]`,
 *            `[data-terminus]` (kit.tsx's Band(), CompareTable.tsx,
 *            country/city-view.tsx, how-to-view.tsx). Without that
 *            exclusion this rule would fire on every hero and every
 *            terminus on every page, which is exactly the false-confident
 *            reading this repo has already paid for once (check_page_holes'
 *            own EVEN_BY_RULING exists for the same reason, one level up).
 *   FLAG   = `img[data-flag]` UNION `img[src*="flagcdn.com"]`, the real
 *            source CountryFlag.tsx renders. Needs the network to decode a
 *            real flag's natural size; the fixture ships its own data-URI
 *            SVG so it needs none.
 *   TRACK  = `[data-track]`, real, unchanged: PayBars.tsx already stamps it.
 *   DISTRICT ROW = `[data-district-row] [data-note]` (fixture) UNION two
 *            real selectors, not equally alive today. `#districts
 *            [data-notes] > div:last-child > div > span:last-child` read
 *            the wide notes list; commit `f21d511f` deleted that markup
 *            entirely, so this half can never match again unless that
 *            feature returns. `#districts [data-row] > span:first-child >
 *            span` read a note riding beside a phone row's name, and later
 *            also caught a regression where the district pill nested a span
 *            inside the name instead of sitting on it directly (that pill,
 *            and the whole name-marking branch it rode on, were deleted by
 *            task 14, 2026-09-10, so a district name is a bare text node
 *            again); this half stays LIVE as a guard
 *            against either fault returning, and finds nothing today. Both
 *            halves read zero elements on every real page today, so
 *            DISTRICT ADJECTIVE below is UNMEASURED there, not a clean
 *            pass; only the fixture still exercises it.
 *   FACT CELL = `[data-fact-cell]` (fixture) UNION `[data-kv-cell]`, the
 *            real attribute KvGrid.tsx stamps on every cell it draws, hero
 *            and otherwise. Reading every kv-cell rather than only the
 *            hero's four is a wider net than the model's letter, stated
 *            here rather than left implicit: a two-line cell is a two-line
 *            cell wherever KvGrid draws it.
 *   LABEL  = `[data-label]`, literal only (ROW SENTENCE's word-count half,
 *            and LABEL GAP's measured-gap half). No component stamps it;
 *            UNMEASURED on a real page, exactly like BLOCK.
 *   POLE   = `[data-pole]`, real: SpectraTable.tsx already stamps it.
 *   COL    = `[data-col]`, literal only (UNIT MIX). CompareTable.tsx's
 *            columns are parameterised per unit by construction and could
 *            not mix one even if this rule could see them; no other
 *            component marks a column at all. UNMEASURED on a real page.
 *
 * BANNED WORDS and EDGE and FOCAL and PLACEMENT need no new marker: they
 * read every leaf's own text, every card's own border colour, every card's
 * own font sizes, and the real `[data-track]`, which already exist.
 *
 * MEASURED ONCE OR PER WIDTH. BLOCK FLOOR, LONE CARD, FLAG and EDGE are
 * page-level or colour/geometry facts this site's fixed-token design does
 * not vary by viewport, so each runs once, at the widest width, exactly
 * check_page_holes.mjs's own convention for ACCENT BUDGET and its hierarchy
 * checks. The rest run at all three widths, because a real page draws a
 * DIFFERENT element for a phone row than for a desktop one (RankedBars'
 * `lg:hidden` / `hidden lg:block` split is exactly this), and the visibility
 * filter (`getClientRects().length`, and the same sr-only shape check
 * check_readability.mjs uses, so a screen-reader-only duplicate is not
 * scored twice) picks out whichever one actually renders at that width.
 * A finding is folded across WIDTHS ONLY, never across two genuinely
 * different findings (fixed in the review fix wave, 2026-09-08; the fold key
 * used to be (id, rule) alone, which discarded a second distinct violation
 * of the same rule on the same card and kept only its width). The fold key
 * is (card id, rule, detail text): the exact same (id, rule, detail) seen at
 * more than one width becomes one row naming every width it held at, so
 * this file's own fixture (no responsive rule at all) still reports one row
 * per law, not one per law per width. Two DIFFERENT findings under the same rule in the same
 * card, distinguished by their own detail text (two different BANNED WORDS
 * cells, two different DISTRICT ADJECTIVE notes), are never folded into each
 * other, at any width: they stay two rows, and if their measured figure
 * (a card width, say) differs between widths, the two figures print as two
 * rows, each correctly naming only the width it held at, rather than one
 * row claiming a width the page never had. A rule whose own detail sentence
 * does not vary by instance (PLACEMENT's wording is fixed text regardless of
 * which track is missing its line) still needs a COUNT, not just a key,
 * because many such elements in one card would otherwise share one key and
 * print as if there were only one: each row also carries the number of
 * matching elements seen at whichever width held the most, printed as
 * `(Nx)` when N is more than one, so fourteen real track violations print as
 * fourteen accounted for across their cards, not silently folded down to
 * three lines with the other eleven discarded.
 *
 * BLIND SPOTS, stated before this is trusted:
 *   FIGURE FACE SEES ONLY HTML TEXT CARRYING `.fig`. A number painted in an
 *   SVG `<text>`, in a canvas, inside a map popup built after load, or inside
 *   a leaf that simply never got the class can be in the wrong face and this
 *   rule will call the page clean.
 *   UNMEASURED IS NOT PASSED. BLOCK, LABEL and COL read zero elements on
 *   every real page today, because no component stamps their marker. That
 *   is printed as UNMEASURED, not silently absorbed as zero violations; a
 *   rule with zero live candidates has proven nothing about the real page,
 *   only about the fixture. FOCAL is the same failure by a different route
 *   (fixed in the review fix wave, 2026-09-08): it only ever fires on a card
 *   holding an element at 30px, and no shipped page carries one today, so
 *   both its branches were unreachable and it returned a silent passing
 *   zero, the exact "reports the thing absent, confidently, with a figure
 *   attached" failure this file's own working method exists to stop. A page
 *   with no 30px figure anywhere now prints FOCAL as UNMEASURED, not passed;
 *   PART 6 of the page model says every section card should HAVE a focal
 *   figure at 30, so a page with none is itself a finding, which is a later
 *   task's work, not this file's.
 *   THE DISTRICT-ROW SELECTOR IS POSITIONAL. See above: it reads
 *   RankedBars.tsx's current DOM shape, not a name, and breaks silently if
 *   that shape changes.
 *   FOCAL'S EVEN_BY_RULING IS A COPY, NOT AN IMPORT. Playwright serialises
 *   `inPage()` into the page itself, so it cannot import
 *   check_page_holes.mjs's set; the same four names are hand-kept here
 *   (compare-table, card-pager, pay-bars, terminus) and can drift from that
 *   file's frozen set if one changes without the other.
 *   EDGE ASSUMES A UNIFORM BORDER. It reads `borderTopColor` for the card's
 *   own edge, which is what `Box`'s single `border` utility always paints on
 *   all four sides; a future card with four different border colours would
 *   read only the top one.
 *   BANNED WORDS IS A WHOLE-CELL MATCH, ARTICLE-STRIPPED. "same", "baseline",
 *   "x1.00" and "world's highest" are matched after trimming a leading
 *   "the "/"a ", so `COPY.cityVerdict.cells.averageNote`'s literal "the
 *   baseline" matches "baseline"; a sentence merely CONTAINING one of these
 *   words (PayBars' current `edgeLabel`, "World's highest: {name}, {figure}")
 *   is not a whole cell and does not match, by the model's own qualifier.
 *   PART 8.5 also bans "any country name inside a chart's furniture", which
 *   this rule does not check: Step 2 of the task brief narrows BANNED WORDS
 *   to the four literal phrases only, and this file follows that narrower,
 *   concrete spec rather than the fuller prose clause.
 *
 * usage: node scripts/harness/check_model_laws.mjs <rendered.html ...>
 *        node scripts/harness/check_model_laws.mjs --list[=pages.json]
 */
import { chromium } from "playwright";
import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { basename } from "node:path";
import { preflight } from "./preflight.mjs";

preflight({ browser: true, name: "check_model_laws" });

/* MINOR 9 FIX (review fix wave, 2026-09-08): EVEN_BY_RULING (FOCAL's set,
   below) is a hand-kept copy of check_page_holes.mjs's own frozen four,
   because Playwright serialises inPage() into the page and cannot import a
   shared module there. Nothing asserted the two literals still matched, so
   they could drift silently. Extract both `new Set([...])` literals as text
   and compare them here, in Node, before either check runs. */
{
  const ownSrc = readFileSync(new URL(import.meta.url), "utf8");
  const otherPath = new URL("./check_page_holes.mjs", import.meta.url);
  const otherSrc = readFileSync(otherPath, "utf8");
  const extractRuling = (src) => {
    const m = src.match(/EVEN_BY_RULING\s*=\s*new Set\(\[([^\]]*)\]\)/);
    if (!m) return null;
    return m[1].split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean).sort().join(",");
  };
  const mine = extractRuling(ownSrc), theirs = extractRuling(otherSrc);
  if (mine == null || theirs == null || mine !== theirs) {
    console.error(`x check_model_laws: EVEN_BY_RULING has drifted between this file (${mine}) and check_page_holes.mjs (${theirs}). Update both literals to match before trusting FOCAL or NO LEAD.`);
    process.exit(2);
  }
}

const WIDTHS = [1280, 768, 375];
const args = process.argv.slice(2);
const listArg = args.find((a) => a === "--list" || a.startsWith("--list="));
const LIST = listArg && listArg.includes("=") ? listArg.slice("--list=".length) : "scripts/harness/pages.json";
const listed = listArg ? JSON.parse(readFileSync(LIST, "utf8")).pages.map((p) => `scratchpad/harness/pages/${p.surface}-${p.slugs.join("-")}.html`) : [];
const files = [...args.filter((a) => !a.startsWith("--")), ...listed];
if (files.length === 0) { console.error("usage: node scripts/harness/check_model_laws.mjs <rendered.html ...> | --list"); process.exit(2); }

/* THE BLOCK FLOOR (PART 8.2/8.3): 21 for a country, 17 for a city. A page
   this file cannot name (the fixture, or a future third surface) is held to
   the WEAKER of the two named floors, 17, stated here rather than invented
   silently: it is a real blind spot for a surface with its own true floor
   the model has not yet stated (how-to holds none today), and it is exactly
   what lets the fixture's three-block page prove the rule without inventing
   a name for itself. */
const FLOOR_BY_SURFACE = { country: 21, city: 17 };
function floorFor(name) {
  const m = name.match(/^([a-z]+)-/);
  const surface = m ? m[1] : null;
  if (surface === "howto") return null; // no floor is named for how-to in PART 8
  if (surface && FLOOR_BY_SURFACE[surface] != null) return FLOOR_BY_SURFACE[surface];
  return FLOOR_BY_SURFACE.city;
}

function inPage(ctx) {
  const { floor, wide } = ctx;
  const out = [];
  const unmeasured = [];
  const push = (id, rule, detail) => out.push({ id, rule, detail });

  /* SKIPPED ON PURPOSE, the same shape check_readability.mjs uses: an
     element (or an ancestor) collapsed to the sr-only box never reaches a
     reader's eye, so it must never produce a duplicate phantom finding
     beside the one visible copy. */
  const hiddenFromSight = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      if (cs.position === "absolute" && parseFloat(cs.width) <= 1 && parseFloat(cs.height) <= 1 && cs.overflow === "hidden") return true;
      n = n.parentElement;
    }
    return false;
  };
  const CARD = 'main [class*="rounded-[14px]"]';
  const cards = [...document.querySelectorAll(CARD)].filter((c) => c.getClientRects().length && !c.parentElement.closest(CARD));
  const cardIdOf = (el) => {
    const c = el.closest(CARD);
    if (c) return c.id || c.querySelector("[id]")?.id || "card";
    return el.closest("[id]")?.id || "page";
  };

  /* BLOCK FLOOR: "count the page's blocks against its floor, 21 and 17." A
     surface with no named floor (how-to) used to fall through this `if`
     silently, no push and no unmeasured line, so the report could claim
     UNMEASURED for a page that in truth ran no check at all (MINOR 7, review
     fix wave 2026-09-08); it now says so explicitly. */
  if (wide && floor != null) {
    const blocks = [...document.querySelectorAll("[data-block]")];
    if (blocks.length === 0) {
      unmeasured.push("BLOCK FLOOR: no [data-block] elements on this page; the count is unmeasured, not zero");
    } else if (blocks.length < floor) {
      push(cardIdOf(blocks[0]), "BLOCK FLOOR", `${blocks.length} blocks against a floor of ${floor}`);
    }
  } else if (wide && floor == null) {
    unmeasured.push("BLOCK FLOOR: no floor is named for this surface; the count is unmeasured, not zero");
  }

  /* LONE CARD: "a band with one child fails." */
  if (wide) {
    const CHROME = "[data-hero], [data-wide-table], [data-terminus]";
    const candidates = new Set([...document.querySelectorAll("[data-band]"), ...cards.map((c) => c.parentElement).filter(Boolean)]);
    for (const band of candidates) {
      if (!band || band === document.body || band === document.documentElement || band.tagName === "MAIN") continue;
      if (band.closest(CHROME)) continue;
      if (band.children.length !== 1) continue;
      const child = band.children[0];
      const id = child.id || child.querySelector("[id]")?.id || band.id || "band";
      push(id, "LONE CARD", `a band holding one child element (<${child.tagName.toLowerCase()}>)`);
    }
  }

  /* FLAG: "true ratio, radius 0, height from --flag-hero or --flag-row,
     never set by width." */
  if (wide) {
    const flagHero = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--flag-hero"));
    const flagRow = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--flag-row"));
    const flags = [...document.querySelectorAll('img[data-flag], img[src*="flagcdn.com"]')].filter((im) => im.getClientRects().length && !hiddenFromSight(im));
    for (const im of flags) {
      const b = im.getBoundingClientRect();
      const id = cardIdOf(im);
      if (im.naturalWidth && im.naturalHeight) {
        const rendered = b.width / b.height, real = im.naturalWidth / im.naturalHeight;
        if (Math.abs(rendered - real) > 0.02) push(id, "FLAG", `rendered ratio ${rendered.toFixed(2)} against its true ${real.toFixed(2)} (${Math.round(b.width)}x${Math.round(b.height)})`);
      }
      const okHeight = (Number.isFinite(flagHero) && Math.abs(b.height - flagHero) < 1) || (Number.isFinite(flagRow) && Math.abs(b.height - flagRow) < 1);
      if (!okHeight) push(id, "FLAG", `rendered height ${Math.round(b.height)}px is neither --flag-hero (${flagHero}px) nor --flag-row (${flagRow}px)`);
    }
  }

  /* LABEL GAP: "no label-to-figure gap over the row grid's third column at
     any width, and no justify-between row on a card wider than 420px." The
     measured-gap half reads [data-label], which no component stamps today
     (see the header comment); UNMEASURED, once, rather than a silent zero. */
  if (wide && document.querySelectorAll("[data-label]").length === 0) unmeasured.push("LABEL GAP (measured-gap half): no [data-label] elements on this page; unmeasured, not zero");
  for (const label of document.querySelectorAll("[data-label]")) {
    if (!label.getClientRects().length || hiddenFromSight(label)) continue;
    const card = label.closest(CARD);
    if (!card) continue;
    const row = label.closest('[style*="flex"], [class*="flex"], [class*="grid"]') || label.parentElement;
    const fig = row?.querySelector(".fig");
    if (!fig || fig === label) continue;
    const lb = label.getBoundingClientRect(), fb = fig.getBoundingClientRect();
    const cardW = card.getBoundingClientRect().width;
    const gap = fb.left - lb.right;
    if (gap > cardW / 3) push(cardIdOf(label), "LABEL GAP", `${Math.round(gap)}px between the label and its figure, over a third of the card's ${Math.round(cardW)}px`);
  }
  /* IMPORTANT 5 FIX (review fix wave, 2026-09-08): PART 5's clause is scoped
     to ROWS ("a row is NEVER justify-between across a card wider than
     420px"), not to any element the `justify-between` class happens to
     touch, and the bare class match caught `sm:justify-between` too, which
     is still a real row at any width the class applies. The false positive
     this narrowing removes is `#close`, the terminus's own closing-doors
     link list: chrome, not a label-to-figure row, the same thing
     check_page_holes.mjs already exempts by name ("the closing doors, which
     are chrome and not an answer"). A real row either draws a figure
     (`.fig`) or carries the row marker RankedBars/CompareTable already stamp
     (`[data-row]`); a chrome list carries neither. */
  for (const row of document.querySelectorAll('[style*="justify-content:space-between"], [class*="justify-between"]')) {
    if (!row.getClientRects().length || hiddenFromSight(row)) continue;
    if (row.closest("[data-terminus]")) continue;
    if (!row.matches("[data-row]") && !row.querySelector(".fig, [data-row]")) continue;
    const card = row.closest(CARD);
    if (!card) continue;
    const cardW = card.getBoundingClientRect().width;
    if (cardW > 420) push(cardIdOf(row), "LABEL GAP", `a justify-between row on a ${Math.round(cardW)}px card, over 420px`);
  }

  /* UNIT MIX: "one unit per column, no word where a column holds figures."
     No component marks a column with [data-col] today (see the header
     comment); UNMEASURED, once, rather than a silent zero. */
  if (wide && document.querySelectorAll("[data-col]").length === 0) unmeasured.push("UNIT MIX: no [data-col] elements on this page; unmeasured, not zero");
  for (const col of document.querySelectorAll("[data-col]")) {
    if (!col.getClientRects().length) continue;
    const units = new Set();
    for (const el of col.querySelectorAll("*")) {
      if (el.children.length || !el.getClientRects().length || hiddenFromSight(el)) continue;
      const t = (el.textContent || "").trim();
      if (!t) continue;
      if (/%$/.test(t)) units.add("%");
      else if (/^[$£€]/.test(t)) units.add("currency");
      else if (/^x[\d.]+$/i.test(t)) units.add("multiple");
    }
    if (units.size > 1) push(cardIdOf(col), "UNIT MIX", `mixed units in one column (${[...units].join(", ")})`);
  }

  /* BANNED WORDS: "same", "baseline", "x1.00", "world's highest", as a whole
     cell (Step 2 of the task brief; see the header comment for what this
     narrower, concrete spec leaves out of PART 8.5's fuller clause). */
  const BANNED = ["same", "baseline", "x1.00", "world's highest"];
  for (const el of document.querySelectorAll("main *")) {
    if (el.children.length || !el.getClientRects().length || hiddenFromSight(el)) continue;
    const raw = (el.textContent || "").trim();
    if (!raw) continue;
    const norm = raw.toLowerCase().replace(/^(the|a)\s+/, "");
    if (BANNED.includes(norm)) push(cardIdOf(el), "BANNED WORDS", `a cell reading exactly "${raw}"`);
  }

  /* DISTRICT ADJECTIVE: "a district row carries no free-text descriptor."
     Both real-page halves of districtNoteSel read zero elements on every
     page today (see the header comment: the notes-list half was deleted
     outright, the phone-row half stays live but idle): UNMEASURED, once,
     rather than a silent zero. */
  const districtNoteSel = "[data-district-row] [data-note], #districts [data-notes] > div:last-child > div > span:last-child, #districts [data-row] > span:first-child > span";
  if (document.querySelectorAll(districtNoteSel).length === 0) unmeasured.push("DISTRICT ADJECTIVE: no district-row free-text markup on this page; unmeasured, not zero");
  for (const el of document.querySelectorAll(districtNoteSel)) {
    if (!el.getClientRects().length || hiddenFromSight(el)) continue;
    const t = (el.textContent || "").trim();
    if (!t) continue;
    push(cardIdOf(el), "DISTRICT ADJECTIVE", `a district row carries the free text "${t}"`);
  }

  /* ROW SENTENCE: "a label over three words, or a spectra pole over three
     words or 24 characters, is a copy fault." The label half reads
     [data-label], the same marker LABEL GAP's measured-gap half reads
     (line ~228 above): no component stamps it today, so without its own
     UNMEASURED line a reader would see ROW SENTENCE firing on poles and
     wrongly conclude the whole rule is measured (IMPORTANT 3, review fix
     wave 2026-09-08). Mirrored from line 228. */
  if (document.querySelectorAll("[data-label]").length === 0) unmeasured.push("ROW SENTENCE (label half): no [data-label] elements on this page; unmeasured, not zero");
  for (const label of document.querySelectorAll("[data-label]")) {
    if (!label.getClientRects().length || hiddenFromSight(label)) continue;
    const t = (label.textContent || "").trim();
    const words = t.split(/\s+/).filter(Boolean);
    if (words.length > 3) push(cardIdOf(label), "ROW SENTENCE", `a label of ${words.length} words: "${t}"`);
  }
  for (const pole of document.querySelectorAll("[data-pole]")) {
    if (!pole.getClientRects().length || hiddenFromSight(pole)) continue;
    const t = (pole.textContent || "").trim();
    const words = t.split(/\s+/).filter(Boolean);
    if (words.length > 3 || t.length > 24) push(cardIdOf(pole), "ROW SENTENCE", `a pole of ${words.length} word(s), ${t.length} characters: "${t}"`);
  }

  /* FOCAL: "exactly one figure at 30 per card, and nothing between 16 and 30
     in that card." Exempt: EVEN_BY_RULING, check_page_holes.mjs's own
     frozen four, hand-kept here (see the header comment on why it cannot be
     imported, and the assertion at the top of this file that keeps the two
     literals from drifting). CRITICAL 2 FIX (review fix wave, 2026-09-08):
     both branches below only ever fire on a card that already holds a 30px
     element; a page with NO 30px element anywhere reds nothing and used to
     report nothing at all, which reads as a clean pass rather than as the
     rule never having had anything to measure. `any30` tracks whether any
     non-exempt card on this page holds one; if none do, the rule pushes
     UNMEASURED instead of silence, the same shape as BLOCK FLOOR above. */
  const EVEN_BY_RULING = new Set(["compare-table", "card-pager", "pay-bars", "terminus"]);
  let any30 = false;
  for (const card of cards) {
    const form = card.getAttribute("data-archetype") || card.querySelector("[data-archetype]")?.getAttribute("data-archetype") || "kit";
    if (EVEN_BY_RULING.has(form)) continue;
    const sizes = [...card.querySelectorAll("*")]
      .filter((el) => el.children.length === 0 && el.getClientRects().length && (el.textContent || "").trim() && !hiddenFromSight(el))
      .map((el) => parseFloat(getComputedStyle(el).fontSize));
    const at30 = sizes.filter((s) => Math.abs(s - 30) < 0.5).length;
    if (at30 > 0) any30 = true;
    const id = card.id || card.querySelector("[id]")?.id || "card";
    if (at30 > 1) push(id, "FOCAL", `${at30} figures at 30px in one card`);
    if (at30 >= 1) {
      const between = sizes.find((s) => s > 16 && s < 30 && Math.abs(s - 30) >= 0.5);
      if (between != null) push(id, "FOCAL", `a size of ${between}px between 16 and 30 in a card that already has a 30px figure`);
    }
  }
  if (!any30) unmeasured.push("FOCAL: no element on this page sits at 30px; the rule is unmeasured, not passed");

  /* PLACEMENT: "a figure drawn on a world track without its placement line
     fails." (PART 9 rule 5.) RankedBars.tsx's table form stamps every track
     with what its own far end IS: `data-track="world"` when it is a true
     world maximum, `data-track="set"` when it is only the heaviest member
     drawn on the same card (its own header comment). A "set" track is never
     a world track, so PART 9 rule 5 does not apply to it and it is skipped
     below. DECLARE, OR BE MEASURED: a track that says "set" is taken at its
     word; a track that declares nothing at all, `data-track`'s shape before
     this stamp existed, is still read exactly as before, because silence
     must never buy an exemption a real declaration has to earn, the same
     reasoning this file already applies elsewhere by reporting UNMEASURED
     rather than a false zero. */
  for (const track of document.querySelectorAll("[data-track]")) {
    if (!track.getClientRects().length || hiddenFromSight(track)) continue;
    if (track.getAttribute("data-track") === "set") continue; // declared: the set's own heaviest member, not the world's
    const hasPlacement = track.parentElement && track.parentElement.querySelector("[data-placement]");
    if (!hasPlacement) push(cardIdOf(track), "PLACEMENT", "a track with no placement line beside it");
  }

  /* EDGE: "the card border is --c-line-strong and every line inside it is
     --c-border" (correct); a fault is the two reading equal. A HAIRLINE IS A
     DIVIDER, NOT A BADGE: the first pass over real pages matched a dashed
     pill's own border (a tag/badge decoration with `border-radius`, not a
     row line) purely because it happens to share the card's edge colour,
     which is a different, unrelated design choice, not the row-divider
     defect this rule exists to catch. A hairline never has a radius, so an
     element with any rounding is excluded here. */
  if (wide) {
    for (const card of cards) {
      const cardBorder = getComputedStyle(card).borderTopColor;
      if (!cardBorder || /rgba?\(0,\s*0,\s*0,\s*0\)/.test(cardBorder)) continue;
      let matched = false;
      for (const el of card.querySelectorAll("*")) {
        if (!el.getClientRects().length) continue;
        const cs = getComputedStyle(el);
        if (parseFloat(cs.borderTopLeftRadius) > 0) continue; // a badge or a tile, not a divider
        for (const side of ["Top", "Bottom"]) {
          const w = parseFloat(cs[`border${side}Width`]);
          const c = cs[`border${side}Color`];
          if (w > 0 && c === cardBorder && !/rgba?\(0,\s*0,\s*0,\s*0\)/.test(c)) { matched = true; break; }
        }
        if (matched) break;
      }
      if (matched) push(card.id || card.querySelector("[id]")?.id || "card", "EDGE", "the card's outer edge is the same colour as a hairline divider inside it");
    }
  }

  /* TWO-LINE CELL: "a hero fact cell with more than two lines fails." A
     Range over the figure's own text, the true line-box count (finding A of
     check_readability.mjs's review, reused rather than reinvented). */
  const lineCountOf = (el) => {
    const r = document.createRange();
    r.selectNodeContents(el);
    return [...r.getClientRects()].filter((rc) => rc.width > 0.5 && rc.height > 0.5).length || 1;
  };
  for (const cell of document.querySelectorAll("[data-fact-cell], [data-kv-cell]")) {
    if (!cell.getClientRects().length || hiddenFromSight(cell)) continue;
    const fig = cell.querySelector(".fig") || cell;
    const lines = lineCountOf(fig);
    if (lines > 2) push(cardIdOf(cell), "TWO-LINE CELL", `a hero fact cell's figure wraps to ${lines} lines`);
  }

  /* FIGURE FACE: "the numbers are the product, and they carry the display
     face, never the body sans" (MODEL.md, the type law). Added 2026-09-11,
     after measuring that the design system had said this since the spine was
     built and had never once been true: `.fig` lived in an inline <style>
     inside SpineShell and read `var(--font-grotesk)`, a next/font slot that
     shell defined, so on every renderer that did not mount it the rule was
     absent, and on every renderer that mounted it without a real next/font
     transform the slot was the EMPTY STRING, which makes the whole
     font-family declaration invalid and drops it. 86 figures across the
     rendered city and country pages, every one of them Geist.

     THIS READS THE COMPUTED FONT, NEVER THE PRESENCE OF A CLASS, and that is
     the whole point: a `.fig` that is present and unstyled is exactly the
     fault being checked for, and a class-counting rule would have called the
     broken state clean for as long as it existed.

     Three findings, in this order, because the later ones are meaningless
     without the earlier ones:
       1. NO FACE DECLARED , `--font-num` does not resolve to anything other
          than the body face. One red for the page; the per-figure pass is
          skipped, because with no face to draw in every figure would red and
          the report would be noise rather than a finding.
       2. FACE DID NOT LOAD , the token names a different family from the
          body's, and a ten-digit probe in each measures the SAME width, so
          the named face is not actually on this machine and every figure is
          silently drawing a fallback. Also one red, also skips the pass.
       3. Per figure , any visible `.fig` whose computed first family is not
          the declared figure face, named by its card.

     THE BLIND SPOT, in one sentence: this sees only figures drawn as HTML
     text carrying `.fig`, so a number painted in an SVG `<text>`, in a canvas,
     inside a maplibre popup built after load, or inside a leaf that simply
     never got the class can be in the wrong face and this rule will call the
     page clean. */
  {
    const probe = document.createElement("span");
    probe.setAttribute("style", "position:absolute;left:-9999px;top:0;font-size:100px;font-weight:600;white-space:pre;font-variant-numeric:tabular-nums lining-nums");
    probe.textContent = "0000000000";
    document.body.appendChild(probe);
    const first = (list) => (list || "").split(",")[0].replace(/^\s*["']|["']\s*$/g, "").trim();
    probe.style.fontFamily = "var(--font-num)";
    const figFace = first(getComputedStyle(probe).fontFamily);
    const figW = probe.getBoundingClientRect().width;
    probe.style.fontFamily = getComputedStyle(document.body).fontFamily;
    const bodyFace = first(getComputedStyle(probe).fontFamily);
    const bodyW = probe.getBoundingClientRect().width;
    probe.remove();

    const figs = [...document.querySelectorAll(".fig")].filter((f) => f.getClientRects().length && !hiddenFromSight(f));
    if (!figFace || figFace === bodyFace) {
      push("page", "FIGURE FACE", `--font-num resolves to the body face (${bodyFace || "nothing"}); no figure on this page can carry the display face`);
    } else if (Math.abs(figW - bodyW) < 0.5) {
      push("page", "FIGURE FACE", `${figFace} is declared as the figure face and renders at the body face's exact width; it did not load, and every figure is drawing a fallback`);
    } else if (figs.length === 0) {
      unmeasured.push("FIGURE FACE: no .fig elements on this page; the face is unmeasured, not passed");
    } else {
      for (const f of figs) {
        const drawn = first(getComputedStyle(f).fontFamily);
        if (drawn !== figFace) push(cardIdOf(f), "FIGURE FACE", `a figure drawn in ${drawn}, not the figure face ${figFace}: "${(f.textContent || "").trim().slice(0, 24)}"`);
      }
    }
  }

  return { found: out, unmeasured };
}

const reds = [];
const browser = await chromium.launch();
for (const file of files) {
  const name = basename(file).replace(/\.html$/, "");
  if (!existsSync(file)) { reds.push({ name, w: "all", id: "-", rule: "NO RENDER", detail: "the list names this page and no render exists" }); continue; }
  const floor = floorFor(name);
  /* FOLDED ACROSS WIDTHS ONLY (CRITICAL 1 FIX, review fix wave 2026-09-08):
     the key used to be (id, rule) alone, which folded two DIFFERENT
     violations of the same rule on the same card into one row and silently
     dropped the second's detail, keeping only its width. Country-GB alone
     carries 14 `[data-track]` elements with no `[data-placement]` sibling,
     each a genuine PLACEMENT violation; the old key reported three. The key
     is now (id, rule, detail): the same exact finding seen at more than one
     width still folds to one row naming every width it held at (see the
     header comment), but two distinct findings under the same rule on the
     same card, however their detail differs, stay two rows. A rule whose
     detail text does not vary by instance (PLACEMENT's wording never names
     which track) would still fold many real elements under one key, so each
     row also carries `count`, the number of matching elements seen at
     whichever width held the most, so the true multiplicity prints instead
     of being silently discarded. */
  const perFile = new Map();
  const unmeasured = new Set();
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    /* Real flag images need a decode to report a true natural size; a
       data-URI fixture image needs no network for this and still benefits. */
    await page.evaluate(async () => { for (const im of document.images) { im.loading = "eager"; try { await im.decode(); } catch { /* not this check's business */ } } });
    const { found, unmeasured: um } = await page.evaluate(inPage, { floor, wide: w === WIDTHS[0] });
    const countThisWidth = new Map();
    for (const f of found) {
      const key = `${f.id}␟${f.rule}␟${f.detail}`;
      countThisWidth.set(key, (countThisWidth.get(key) || 0) + 1);
    }
    for (const f of found) {
      const key = `${f.id}␟${f.rule}␟${f.detail}`;
      const n = countThisWidth.get(key);
      const prior = perFile.get(key);
      if (prior) { prior.widths.add(w); prior.count = Math.max(prior.count, n); }
      else perFile.set(key, { id: f.id, rule: f.rule, detail: f.detail, widths: new Set([w]), count: n });
    }
    for (const u of um) unmeasured.add(u);
    console.log(`${name}@${w}: ${found.length} model-law finding(s)`);
    await ctx.close();
  }
  for (const v of perFile.values()) {
    reds.push({ name, w: [...v.widths].sort((a, b) => b - a).join("/"), id: v.id, rule: v.rule, detail: v.detail, count: v.count });
  }
  for (const u of unmeasured) console.log(`  ${name}: ${u}`);
}
await browser.close();
console.log(`model laws: ${files.length} page(s) x ${WIDTHS.length} widths, ${reds.length} red(s)`);
for (const r of reds) console.log(`  ${r.name}@${r.w} #${r.id}: ${r.rule}: ${r.detail}${r.count > 1 ? ` (${r.count}x)` : ""}`);
process.exit(reds.length ? 1 : 0);
