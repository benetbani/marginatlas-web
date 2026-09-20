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
 * writing a single rule (this repo's own first law): on 2026-09-08 only
 * `data-track` and `data-row`/`data-pole` existed; `data-band`,
 * `data-block`, `data-fact-cell`, `data-district-row` did not, and this file
 * printed UNMEASURED for the three markers nothing stamped rather than a
 * fabricated zero. PLAN STEP 11 (2026-09-17) STAMPED THREE OF THEM, so the
 * sentence "no component stamps it" below each was true for nine days and is
 * false now; each entry says what stamps it today. Every rule still runs on
 * BOTH the fixture (which carries the literal marker) AND the real thing:
 *   BLOCK  = `[data-block]`, REAL since step 11: kit.tsx's `Box` stamps its
 *            `id` as its block name whenever it has one (a caller may pass
 *            `data-block` and that wins), NeighborhoodExplorer's `HoodCard`
 *            does the same, and the cards that are neither (the cell
 *            masthead's hero card, the hood masthead's `#head`, MythChapter's
 *            `#ranks`) and the Boxes drawn without an id (the country's
 *            locals and second character table, the city's demand, risks,
 *            living, runway and second character table, the cell's suits,
 *            week, catchment, seasonality, related and format cards, the
 *            industry's breakeven, ramp, payback, seasonality and
 *            where-pays) name their block explicitly. What is NOT stamped,
 *            on purpose: the hood page's map (`SpineMap`, a drawing in a
 *            frame, and PART 8.8 counts "0 maps" among its blocks), the
 *            city cards and pager cards docked inside a card, and any
 *            rounded box that is chrome inside a section. BLOCK FLOOR counts
 *            only a `[data-block]` that is not inside another `[data-block]`,
 *            so a card docked inside a card is one block, never two.
 *   BAND   = `[data-band]` UNION the parent of any matched block, excluding
 *            the three known real singleton wrappers that are not a
 *            two-up section at all: `[data-hero]`, `[data-wide-table]`,
 *            `[data-terminus]` (kit.tsx's Band(), CompareTable.tsx,
 *            country/city-view.tsx, how-to-view.tsx). Without that
 *            exclusion this rule would fire on every hero and every
 *            terminus on every page, which is exactly the false-confident
 *            reading this repo has already paid for once (check_page_holes'
 *            own EVEN_BY_RULING exists for the same reason, one level up).
 *            `[data-band]` is REAL since plan step 32's second dispatch
 *            (2026-09-18): BentoBand.tsx stamps `data-band="bento"` on a
 *            cluster's root. The kit's Band() still stamps nothing and is
 *            read by the parent inference, as before. A card INSIDE a
 *            declared band reads that band as its band, not its own parent:
 *            a bento cell sits alone in its placement wrapper, one child
 *            each, and the parent inference read the city's four-cell
 *            premises cluster as four lone cards the first time it rendered.
 *            The cluster is the band and holds four children (MODEL.md 8.3,
 *            "the cluster IS the band"); the wrapper is not a band at all.
 *   FLAG   = `img[data-flag]` UNION `img[src*="flagcdn.com"]`, the real
 *            source CountryFlag.tsx renders. It no longer needs the network:
 *            the ratio clause that had to decode a real flag's natural size
 *            was replaced on 2026-09-11 by a token-width clause and an
 *            `object-fit` clause, both of which read only the rendered box and
 *            the computed style. So a broken flag image is now measured as
 *            correctly as a loaded one, which is a gain: the old clause was
 *            silently unmeasured whenever flagcdn.com was unreachable.
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
 *   LABEL  = `[data-label]`, REAL since step 11 (ROW SENTENCE's word-count
 *            half, and LABEL GAP's measured-gap half): the label cell of
 *            every row form stamps it, which is the element holding the
 *            row's name text and nothing wider. RankedBars (the name under
 *            each bar, the name cell of the table form, the name of the
 *            phone row), CompareTable (the name in both forms), MarkList
 *            (the name cell), PayBars (the label in both of its forms),
 *            IncomeBreakdown (each legend name; its `data-row` sits on the
 *            bar's segments, which hold no text), DetailPanel (the `dt`,
 *            unmeasured while the panel is closed, which is its law),
 *            SpectraTable (the trait name, never a pole, which carries
 *            `data-pole`), TiersTable (the tier name) and forms-v2's
 *            LollipopColumn (the name under each stem). The brief's
 *            call-site list said PayBars, DetailPanel and SpectraTable
 *            "already stamp `data-row`"; they do not (PayBars stamps
 *            `data-pay`, the other two `data-rows`, a count on the root), and
 *            the stamp went on anyway because the rule reads the page. The
 *            three bespoke tables that took `data-col` (below) carry it on
 *            their row names too: the cell page's peers table, the industry
 *            page's rent table and the hood page's district comparison,
 *            whose metric rows also took `data-row` so the gap pairs a
 *            metric's name with its own first figure.
 *   POLE   = `[data-pole]`, real: SpectraTable.tsx already stamps it.
 *   COL    = `[data-col]`, REAL since step 11 (UNIT MIX): CompareTable.tsx
 *            stamps `data-col={c.key}` on every VALUE cell in both of its
 *            forms and on no head. A per-cell stamp means one element can
 *            never show a column's mix on its own, so the rule GROUPS the
 *            cells by (closest card, key) and reads the units across the
 *            group; the fixture's `#unit` is written the same way, two
 *            cells sharing one key. The brief named CompareTable alone, and
 *            with that alone four of the six pages (how-to, cell, industry,
 *            hood) still printed UNMEASURED because they mount no
 *            CompareTable; PART 5's unit law binds every table, so the four
 *            other figure tables stamp their value cells too: TiersTable
 *            (`fee`, `time`; the country and the how-to), the cell page's
 *            peers table (interactive.tsx, per column key), the industry
 *            page's rent table (where-pays.tsx, `rent-load`) and the hood
 *            page's district comparison (NeighborhoodExplorer.tsx, keyed by
 *            the METRIC, because that table is transposed and a metric's
 *            row is the set of cells sharing one unit).
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
 *   UNMEASURED IS NOT PASSED. Until plan step 11 BLOCK, LABEL and COL read
 *   zero elements on every real page, because no component stamped their
 *   marker, and that was printed as UNMEASURED, not silently absorbed as
 *   zero violations: a rule with zero live candidates has proven nothing
 *   about the real page, only about the fixture. The three UNMEASURED lines
 *   are kept for a page that mounts no row form, no table or no card, and
 *   on the six listed pages exactly one still prints: UNIT MIX on the
 *   industry page, which draws no table at all for restaurants (its rent
 *   table self-omits without rent-load rows), so there is no column to
 *   read; the composition's `06` table (8.7) ends that the day it lands.
 *   The line is not reworded to "nothing to measure", because a future
 *   bespoke table drawn without the marker would then pass in silence,
 *   which is the blind spot the line exists to name. FOCAL was the same
 *   failure by a different route (fixed in the review fix wave, 2026-09-08):
 *   it only ever fired on a card holding an element at 30px, and three of
 *   the six pages carry none, so both its branches were unreachable there
 *   and it returned a silent passing zero. STEP 11 SETTLED WHY, by measuring
 *   the six renders at 1280 (scratchpad/step11-focal-probe.txt): `--t-focal`
 *   resolves to 30px on every page; the country, the how-to and the hood
 *   page hold ZERO leaves at 30px and zero `t-focal` uses, visible or
 *   hidden; the city holds two (Tailwind's `text-3xl`, which is 30px, on
 *   the demand card's spend and the runway card's ratio, neither through
 *   the token), the cell two (`#opening`'s total through the token and
 *   `#breakeven`'s figure) and the industry page two (`#spend`, `#open`,
 *   through the token). So it is not an instrument fault: the pages predate
 *   MODEL.md PART 4 (its own words, "the built country page uses 30 zero
 *   times"), and the rule was not unmeasured but INCOMPLETE: PART 4 says "every section card takes exactly
 *   one focal at 30", which makes zero as much a finding as two, and the
 *   rule now judges every top-level `[data-block]` card that is not in
 *   EVEN_BY_RULING as 0, 1 or more. It always measures; the only UNMEASURED
 *   it can still print is a page with no block marker and no 30px element.
 *   `blocked-seat` joined the set on plan step 31 (2026-09-17) by the
 *   controller's dispatch, "8.2: a seat holds no figure by its law"; the
 *   reasoning, and PART 4's sentence that reads against it, are written
 *   once at the literal in check_page_holes.mjs and not repeated here.
 *   LABEL GAP'S MEASURED HALF STOPS AT 420px, BY THE MODEL'S OWN CLAUSE.
 *   PART 5: "Below 420px, and only there, the row is `[1fr auto]` and the
 *   gap is the card's own inner width." Read without that clause the half
 *   would red every phone row on every page for obeying the model, so it
 *   applies exactly where its sibling clause ("no justify-between row on a
 *   card wider than 420px") applies: a card wider than 420px, at every
 *   width the page draws one. The row it measures is the label's own row
 *   (`[data-row]`, `[data-spectrum-row]`, `[data-detail-row]`, else the
 *   nearest flex or grid box), and the figure is the first `.fig` AFTER the
 *   label inside that row, so PayBars' flat grid (label, track, figure as
 *   three siblings, no row element) pairs each label with its own figure
 *   and never the first row's, and SpectraTable's rows, which hold no
 *   figure, are skipped rather than paired with the card's foot.
 *   THE LABEL BOX IS THE CELL, NOT THE INK. `getBoundingClientRect()` on a
 *   grid cell is the column's width, so a short name in a 22ch column
 *   measures the gap from the column's edge, not from the last letter; the
 *   model's own geometry sets that column, so the wider reading would red
 *   the model's own law.
 *   THE DISTRICT-ROW SELECTOR IS POSITIONAL. See above: it reads
 *   RankedBars.tsx's current DOM shape, not a name, and breaks silently if
 *   that shape changes.
 *   FOCAL'S EVEN_BY_RULING IS A COPY, NOT AN IMPORT. Playwright serialises
 *   `inPage()` into the page itself, so it cannot import
 *   check_page_holes.mjs's set; the same six names are hand-kept here
 *   (compare-table, card-pager, pay-bars, terminus, since step 11
 *   tiers-table, which MODEL.md 8.6 names "table-family, exempt from the
 *   focal rung by its own law", and since step 31 blocked-seat, "8.2: a seat
 *   holds no figure by its law") and can drift from that file's set if one
 *   changes without the other; the assertion at the top of this file stops
 *   either running when they differ.
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
 *        node scripts/harness/check_model_laws.mjs --list[=pages.json] [--render] [--ratchet [--write-baseline]]
 *        --render renders the list first (otherwise the last run's renders are read, and their age is printed);
 *        --ratchet holds each page to scripts/harness/model_laws_baseline.json (exit 1 only when a page is over it).
 */
import { chromium } from "playwright";
import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { basename } from "node:path";
import { preflight } from "./preflight.mjs";
import { requireBrowser } from "../lib/local_only.mjs";

/* A BUILD SERVER HAS NO BROWSER (scripts/lib/local_only.mjs, the rule every
   browser gate follows since 2026-08-27): Vercel clones website/ alone and
   holds no chromium, and on 2026-09-19 the first push after the harness
   joined the chain failed its deploy on this gate's own preflight, which
   STOPs where the browser is absent, the right answer on the design machine
   and the wrong one on a build server. The skip is loud and says what was
   not checked; the gate runs unchanged here. The chain is proved end to end
   before a push by `npm run verify:deploy`, which is where this gate holds
   the deploy. */
await requireBrowser("harness-laws", "the model-laws list (BLOCK FLOOR, FOCAL, LONE CARD, LABEL GAP, EDGE, ROW SENTENCE) on every page in scripts/harness/pages.json");
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
if (files.length === 0) { console.error("usage: node scripts/harness/check_model_laws.mjs <rendered.html ...> | --list [--render]"); process.exit(2); }

/* THE RENDER'S AGE IS PRINTED, AND --render MAKES A FRESH ONE (plan step 12,
   2026-09-17). This script reads whatever `render_page.tsx` last wrote under
   scratchpad/harness/pages; on its own it renders nothing. The trap it sets:
   an edit to a component, then `harness:laws --list`, then a reading of a
   page that predates the edit, believed. It happened the hour this comment
   was written (a track declared "scale" in the source, the list still
   reading the old bare stamp from a render twenty minutes older). So the
   head line names the oldest render's age, and `--render` runs the page
   renderer over the list first, the same command harness.mjs uses. */
if (listArg && args.includes("--render")) {
  const { spawnSync: spawnRender } = await import("node:child_process");
  const cmd = [process.execPath, "node_modules/tsx/dist/cli.mjs", "--tsconfig", "scripts/tsconfig.harness.json", "--require", "./scripts/harness/env.cjs", "--require", "./scripts/spikes/stub_next_font.cjs", "scripts/harness/render_page.tsx", "--list", LIST];
  const r = spawnRender(cmd[0], cmd.slice(1), { stdio: "inherit" });
  if (r.status !== 0) { console.error(`check_model_laws: the render exited ${r.status}; nothing measured`); process.exit(r.status ?? 1); }
}
{
  const { statSync: statRender } = await import("node:fs");
  const ages = files.filter((f) => existsSync(f)).map((f) => (Date.now() - statRender(f).mtimeMs) / 60000);
  if (ages.length) console.log(`renders read from scratchpad/harness/pages, the oldest ${Math.round(Math.max(...ages))} min old (npm run harness:laws -- --list --render for fresh ones)`);
}

/* THE BLOCK FLOOR (PART 8.2, 8.3, 8.6, 8.7, 8.8): five floors, below. A page
   this file cannot name (the fixture, or a future third surface) is held to
   the WEAKER of the two named floors, 17, stated here rather than invented
   silently: it is a real blind spot for a surface with its own true floor
   the model has not yet stated (how-to holds none today), and it is exactly
   what lets the fixture's three-block page prove the rule without inventing
   a name for itself. */
/* Five floors since 2026-09-17 (plan step 3), each as MODEL.md PART 8 states it:
   8.2 country 21, 8.3 city 17, 8.6 trade (the cell surface) 16, 8.7 industry 12,
   8.8 neighbourhood 7 and provisional. The renderer names the trade surface
   "cell" and the neighbourhood "hood"; the keys follow the renderer's stems. */
/* howto 6 since 2026-09-18: PART 8.9 (plan step 36) wrote the how-to page's
   spine and named its floor, six blocks; until then this function returned
   null for it and BLOCK FLOOR printed "no floor is named". */
/* country 17 since 2026-09-20: his hero (MODEL 8.2 row 00's bracket) took
   `01 glance` into itself and dissolved `02 world-seat` into the sections its
   figures belong to; his corrections 6 and 8 the same day took the rent tiers
   (`05 premises`) to the city page and the workforce seat (`07`) off the page
   until its figures exist; so 8.2 is seventeen blocks and the FLOOR paragraph
   says so. */
/* cell 14 since 2026-09-20: `10 watch`, the drawn blocked seat, left the trade page (no seat in front of him; item 53), and `07 peers` draws only where a peer resolves (off the United States none does, item 57; the one-row table under "Not gathered yet" was the line he refused), so 8.6 is fourteen blocks on London and fifteen where the peers stand. */
/* city 16 since 2026-09-20 (evening): `13 locals`, the drawn blocked seat, left the city page until its notes (item 6; the "Not gathered yet" line he refused), so 8.3 is sixteen blocks, and London stands at 15 of them on ruling 30 alone (`10 easiest`, HIS). */
/* industry 11 since 2026-09-20 (evening): `06 places` draws only as the table, never as the seat whose "Not gathered yet" line he refused, and no trade holds four cities with their own figures today (the own-row law), so 8.7 is eleven blocks on every trade until the slate fills (item 57's cousin, the industry's own count). */
const FLOOR_BY_SURFACE = { country: 13, city: 16, cell: 14, industry: 11, hood: 7, howto: 6 };
function floorFor(name) {
  const m = name.match(/^([a-z]+)-/);
  const surface = m ? m[1] : null;
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
     beside the one visible copy.
     AND THE ROWS BEHIND A CLOSED PLUS (plan step 34's second dispatch,
     2026-09-18). The header above has always said of DetailPanel's `dt`
     "unmeasured while the panel is closed, which is its law", and it was
     not: Chromium reports client rects for the content of a closed
     <details>, so the `getClientRects().length` guard every rule uses let
     the rows through, and the day the industry page's `04 open` put the
     shard's licence names behind its plus, ROW SENTENCE reported four
     labels a reader cannot see until he clicks. This measurement could not
     distinguish a closed plus's row from a drawn one. An ancestor that is a
     closed <details> hides everything but its summary, the art-direction
     gate's own inDeadDetails; the archetype checker still opens every panel
     and reads what it holds, which is that instrument's law. Planted and
     watched: with the panel opened in the render the four rows fire, closed
     they do not. */
  const hiddenFromSight = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      if (cs.position === "absolute" && parseFloat(cs.width) <= 1 && parseFloat(cs.height) <= 1 && cs.overflow === "hidden") return true;
      if (n.tagName === "DETAILS" && !n.open) { const sum = n.querySelector(":scope > summary"); if (!sum || !sum.contains(el)) return true; }
      n = n.parentElement;
    }
    return false;
  };
  const CARD = 'main [class*="rounded-[14px]"]';
  const cards = [...document.querySelectorAll(CARD)].filter((c) => c.getClientRects().length && !c.parentElement.closest(CARD));
  /* A card is addressed by its id, else by its block name (plan step 11: a
     Box drawn without an id now names its block, so "demand" or "living"
     prints where "card" did), else by the cluster it is a cell of (plan step
     32, second dispatch: a bento's cells carry no id of their own and the
     cluster is the section, so a finding on any cell names the cluster, the
     way `--section=<id>` names it), else by the first id inside it. */
  const CLUSTER = "[data-archetype='bento-band'][id]";
  const cardIdOf = (el) => {
    const c = el.closest(CARD);
    if (c) return c.id || c.getAttribute("data-block") || c.closest(CLUSTER)?.id || c.querySelector("[id]")?.id || "card";
    return el.closest("[id]")?.id || "page";
  };

  /* BLOCK FLOOR: "count the page's blocks against its floor, 21 and 17." A
     surface with no named floor (how-to) used to fall through this `if`
     silently, no push and no unmeasured line, so the report could claim
     UNMEASURED for a page that in truth ran no check at all (MINOR 7, review
     fix wave 2026-09-08); it now says so explicitly.
     TOP-LEVEL BLOCKS ONLY (plan step 11): a `[data-block]` inside another
     `[data-block]` is a card docked in a card and is one block with it, the
     way the fixture's `#floor` holds its three and the way a future docked
     grid would sit inside its answer card; counting it would let a page
     reach its floor by nesting. The finding names the page, not a card: it
     is the whole page's count, and `blocks[0]`'s id was a misleading address
     for it. THE HOW-TO SURFACE: PART 8 names no floor for it, so the count is
     printed and the comparison is left unmeasured, in one honest line. */
  const topBlocks = [...document.querySelectorAll("[data-block]")].filter((b) => !b.parentElement?.closest("[data-block]"));
  /* THE COUNT IS RETURNED WHETHER OR NOT IT IS A FINDING (plan step 50,
     2026-09-19): until then a page at its floor printed nothing about BLOCK
     FLOOR at all, so a reader of the output could not tell "21 against 21"
     from "the rule did not run", and the launch checklist
     (scripts/verify_launch_ready.ts) reads its floor line off this output.
     The line below the reds prints it; no red, no ratchet row, no baseline
     is touched by it. */
  const blocks = wide ? topBlocks.length : null;
  if (wide && floor != null) {
    if (topBlocks.length === 0) {
      unmeasured.push("BLOCK FLOOR: no [data-block] elements on this page; the count is unmeasured, not zero");
    } else if (topBlocks.length < floor) {
      push("page", "BLOCK FLOOR", `${topBlocks.length} blocks against a floor of ${floor}`);
    }
  } else if (wide && floor == null) {
    unmeasured.push(`BLOCK FLOOR: ${topBlocks.length} blocks counted, and no floor is named for this surface in MODEL.md PART 8; the floor is unmeasured, not passed`);
  }

  /* LONE CARD: "a band with one child fails." A card inside a declared band
     (`[data-band]`, a bento cluster's root) is judged by that band and never
     by its own placement wrapper; every other card by its parent (the BAND
     note in the header). */
  if (wide) {
    const CHROME = "[data-hero], [data-wide-table], [data-terminus]";
    const bandOf = (c) => c.parentElement?.closest("[data-band]") ?? c.parentElement;
    const candidates = new Set([...document.querySelectorAll("[data-band]"), ...cards.map(bandOf).filter(Boolean)]);
    for (const band of candidates) {
      if (!band || band === document.body || band === document.documentElement || band.tagName === "MAIN") continue;
      if (band.closest(CHROME)) continue;
      if (band.children.length !== 1) continue;
      const child = band.children[0];
      const id = child.id || child.querySelector("[id]")?.id || band.id || "band";
      push(id, "LONE CARD", `a band holding one child element (<${child.tagName.toLowerCase()}>)`);
    }
  }

  /* FLAG: "one width and one height from the tokens, the flag FITTED inside
     that box rather than stretched to it, radius 0."
     THE RATIO CLAUSE WAS REPLACED 2026-09-11, and the replacement is the point.
     This rule used to read "true ratio ... never set by width", the same law
     verify_flag_marks.mjs carried, and it was right while width was `auto`. The
     founder then ruled the opposite of its premise:
     "all-flags-same-width-please-madatory-always". A flag's box is now 1.5x its
     rung wide whatever the flag's own shape, so the old clause failed every
     non-3:2 flag in the world for obeying the law , which it did, immediately,
     seven times across the country and city pages the moment the component
     changed. The ratio is replaced by the two clauses that together say the same
     thing under the new law: the WIDTH is a token (one width everywhere), and
     `object-fit` is `contain` (fitted with air, never stretched or cropped, so
     no flag is distorted). */
  if (wide) {
    const rootCs = getComputedStyle(document.documentElement);
    const flagHero = parseFloat(rootCs.getPropertyValue("--flag-hero"));
    const flagRow = parseFloat(rootCs.getPropertyValue("--flag-row"));
    const flagHeroW = parseFloat(rootCs.getPropertyValue("--flag-hero-w"));
    const flagRowW = parseFloat(rootCs.getPropertyValue("--flag-row-w"));
    const flags = [...document.querySelectorAll('img[data-flag], img[src*="flagcdn.com"]')].filter((im) => im.getClientRects().length && !hiddenFromSight(im));
    for (const im of flags) {
      const b = im.getBoundingClientRect();
      const id = cardIdOf(im);
      const okHeight = (Number.isFinite(flagHero) && Math.abs(b.height - flagHero) < 1) || (Number.isFinite(flagRow) && Math.abs(b.height - flagRow) < 1);
      if (!okHeight) push(id, "FLAG", `rendered height ${Math.round(b.height)}px is neither --flag-hero (${flagHero}px) nor --flag-row (${flagRow}px)`);
      const okWidth = (Number.isFinite(flagHeroW) && Math.abs(b.width - flagHeroW) < 1) || (Number.isFinite(flagRowW) && Math.abs(b.width - flagRowW) < 1);
      if (!okWidth) push(id, "FLAG", `rendered width ${Math.round(b.width)}px is neither --flag-hero-w (${flagHeroW}px) nor --flag-row-w (${flagRowW}px); every flag is one width (his ruling of 2026-09-11)`);
      const fit = getComputedStyle(im).objectFit;
      if (fit !== "contain" && fit !== "scale-down") push(id, "FLAG", `object-fit: ${fit}; a flag in a fixed box is fitted with air, never stretched or cropped to fill it`);
    }
  }

  /* LABEL GAP: "no label-to-figure gap over the row grid's third column at
     any width, and no justify-between row on a card wider than 420px." The
     measured-gap half reads [data-label], stamped on every row form's label
     cell since plan step 11 (see the header comment); the UNMEASURED line
     stays for a page that mounts no row form at all.
     THE ROW IS THE LABEL'S OWN ROW, checked against every stamped component
     (step 11): the row marker first (`[data-row]` on RankedBars, CompareTable,
     MarkList, IncomeBreakdown and forms-v2; `[data-spectrum-row]` on
     SpectraTable; `[data-detail-row]` on DetailPanel; `[data-tier-row]` on
     TiersTable), then the nearest flex or grid box, then the parent. Without
     the marker first, CompareTable's name sits in its own flex span (flag
     and name) and the search stopped there, finding no figure and measuring
     nothing; TiersTable's name sits in its `flex-1` name block, the same
     dead end (measured on the country page's `#setup`: no figure found);
     SpectraTable's name climbed to the card's grid and paired with the
     card's FOOT figure.
     THE FIGURE IS THE FIRST `.fig` AFTER THE LABEL inside that row, in
     document order: PayBars draws label, track and figure as three sibling
     grid cells with no row element, so "the first .fig in the row" was the
     first ROW's figure for every label below it. A row whose only figure
     PRECEDES its label (the bars form, name under the bar; PayBars' flat
     form, figure then label) falls back to that figure, and its gap is
     negative, which is what a stacked or adjacent pair measures.
     A CARD OF 420px OR LESS IS THE MODEL'S OWN PHONE FORM (PART 5: "Below
     420px, and only there, the row is [1fr auto] and the gap is the card's
     own inner width"), the same clause the justify-between half already
     reads at 420; the measured half shares it, or it would red every phone
     row on every page for obeying the model. It still runs at every width,
     because a card can be wider than 420px at 768 (a stacked band) and the
     grid geometry must hold there too ("at any width"). */
  if (wide && document.querySelectorAll("[data-label]").length === 0) unmeasured.push("LABEL GAP (measured-gap half): no [data-label] elements on this page; unmeasured, not zero");
  const ROW_MARKERS = "[data-row], [data-spectrum-row], [data-detail-row], [data-tier-row]";
  for (const label of document.querySelectorAll("[data-label]")) {
    if (!label.getClientRects().length || hiddenFromSight(label)) continue;
    const card = label.closest(CARD);
    if (!card) continue;
    const cardW = card.getBoundingClientRect().width;
    if (cardW <= 420) continue; // the phone form, licensed by PART 5
    const row = label.closest(ROW_MARKERS) || label.closest('[style*="flex"], [class*="flex"], [class*="grid"]') || label.parentElement;
    if (!row) continue;
    const figs = [...row.querySelectorAll(".fig")].filter((f) => f !== label && !label.contains(f) && f.getClientRects().length && !hiddenFromSight(f));
    const fig = figs.find((f) => label.compareDocumentPosition(f) & Node.DOCUMENT_POSITION_FOLLOWING) || figs[0];
    if (!fig) continue;
    const lb = label.getBoundingClientRect(), fb = fig.getBoundingClientRect();
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
     CompareTable stamps `data-col={key}` on every value cell since plan
     step 11 (see the header comment); the UNMEASURED line stays for a page
     with no table.
     A COLUMN IS A GROUP OF CELLS, NOT ONE ELEMENT (step 11): the stamp is
     per cell, so the rule gathers every visible `[data-col]` under one card
     that shares one key, and reads the units across the whole group; read
     one cell at a time, a per-cell stamp could never show a mix. A cell's
     unit is read from its own leaves: a trailing %, a leading currency
     sign, a multiple, a day count, a millions count.
     THE SECOND HALF, the model's own words ("no word where a column holds
     figures", PART 8.5; "any bare word standing where a figure belongs",
     PART 5; "a label never stands where a number goes", his ruling of
     2026-09-10): in a group that holds at least one figure, a cell whose
     text has letters and no digit is a finding, except a bare dash or an
     empty cell, which is the withheld cell clause 18 licenses. A cell
     reading "Free" for a zero fee, or "n/a", is exactly the fault; "3 days"
     is a figure with its unit and passes. Planted once on a story
     (compare-table, a usd cell set to 0 so it printed "Free") and seen red
     by name before the plant was removed; the fixture's `#word` keeps the
     fault on file. */
  if (wide && document.querySelectorAll("[data-col]").length === 0) unmeasured.push("UNIT MIX: no [data-col] elements on this page; unmeasured, not zero");
  {
    const unitOf = (t) => {
      if (/%$/.test(t)) return "%";
      if (/^[$£€]/.test(t)) return "currency";
      if (/^x[\d.]+$/i.test(t) || /^[\d.]+x$/i.test(t)) return "multiple";
      if (/\bdays?$/i.test(t)) return "days";
      if (/^[\d.,]+M$/.test(t)) return "millions";
      if (/^[\d.,]+$/.test(t)) return "count"; // a bare number is a unit of its own beside a % or a $
      return null;
    };
    const groups = new Map();
    for (const col of document.querySelectorAll("[data-col]")) {
      if (!col.getClientRects().length || hiddenFromSight(col)) continue;
      const key = `${cardIdOf(col)}␟${col.getAttribute("data-col") ?? ""}`;
      if (!groups.has(key)) groups.set(key, { cells: [] });
      groups.get(key).cells.push(col);
    }
    for (const [key, g] of groups) {
      const units = new Set();
      const words = [];
      let figures = 0;
      for (const cell of g.cells) {
        /* THE WORD TEST READS THE WHOLE CELL, THE UNIT EACH FIGURE LEAF: a phone
           cell that prints its column's head beside its figure ("Turnover
           $340K", the cell page's peers table under 640px) is a figure, not a
           word, and its unit comes from the leaf that holds the digits. */
        const leaves = [...cell.querySelectorAll("*")].filter((el) => !el.children.length && el.getClientRects().length && !hiddenFromSight(el) && (el.textContent || "").trim());
        const texts = leaves.length ? leaves.map((el) => (el.textContent || "").trim()) : [(cell.textContent || "").trim()];
        const whole = texts.join(" ").trim();
        if (!whole || /^[–—-]$/.test(whole)) continue; // withheld: an en dash, clause 18
        if (/\d/.test(whole)) {
          figures++;
          for (const t of texts) { if (/\d/.test(t)) { const u = unitOf(t); if (u) units.add(u); } }
        } else if (/\p{L}/u.test(whole)) words.push(whole);
      }
      const colName = key.split("␟")[1];
      if (units.size > 1) push(cardIdOf(g.cells[0]), "UNIT MIX", `mixed units in one column${colName ? ` (${colName})` : ""} (${[...units].join(", ")})`);
      if (figures > 0) for (const w of words) push(cardIdOf(g.cells[0]), "UNIT MIX", `a word where a figure goes: "${w}" in a column${colName ? ` (${colName})` : ""} that holds figures`);
    }
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
     in that card." Exempt: EVEN_BY_RULING, check_page_holes.mjs's own set,
     hand-kept here (see the header comment on why it cannot be imported,
     and the assertion at the top of this file that keeps the two literals
     from drifting): the four frozen on 2026-09-08, and `tiers-table` since
     plan step 11 because MODEL.md 8.6 names the form "table-family, exempt
     from the focal rung by its own law" (the `06 team` row), and
     `blocked-seat` since plan step 31 (8.2: a seat holds no figure by its
     law; the note at check_page_holes.mjs's literal); nothing else
     the model does not name in so many words. CRITICAL 2 FIX (review fix
     wave, 2026-09-08): both branches below only ever fire on a card that
     already holds a 30px element; a page with NO 30px element anywhere
     redded nothing and used to report nothing at all, which reads as a
     clean pass rather than as the rule never having had anything to measure.
     THE THIRD OUTCOME (plan step 11): PART 4, "every section card now takes
     exactly one focal at 30", makes ZERO a finding as much as two, and the
     header comment records the measurement that settled it (three of the
     six pages hold no 30px leaf at all, and the token resolves everywhere).
     So every top-level `[data-block]` card that is not exempt is judged 0,
     1 or more, and the rule always measures; the old `any30` line survives
     only for a page with no block marker and no 30px element, where there
     is truly nothing to judge. The two older halves still run over every
     rounded card as before, block or not, so nothing they caught is lost. */
  const EVEN_BY_RULING = new Set(["compare-table", "card-pager", "pay-bars", "terminus", "tiers-table", "blocked-seat"]);
  const formOf = (card) => card.getAttribute("data-archetype") || card.querySelector("[data-archetype]")?.getAttribute("data-archetype") || "kit";
  const sizesOf = (card) => [...card.querySelectorAll("*")]
    .filter((el) => el.children.length === 0 && el.getClientRects().length && (el.textContent || "").trim() && !hiddenFromSight(el))
    .map((el) => parseFloat(getComputedStyle(el).fontSize));
  const idOfCard = (card) => card.id || card.getAttribute("data-block") || card.closest(CLUSTER)?.id || card.querySelector("[id]")?.id || "card";
  let any30 = false;
  for (const card of cards) {
    if (EVEN_BY_RULING.has(formOf(card))) continue;
    const sizes = sizesOf(card);
    const at30 = sizes.filter((s) => Math.abs(s - 30) < 0.5).length;
    if (at30 > 0) any30 = true;
    const id = idOfCard(card);
    if (at30 > 1) push(id, "FOCAL", `${at30} figures at 30px in one card`);
    if (at30 >= 1) {
      const between = sizes.find((s) => s > 16 && s < 30 && Math.abs(s - 30) >= 0.5);
      if (between != null) push(id, "FOCAL", `a size of ${between}px between 16 and 30 in a card that already has a 30px figure`);
    }
  }
  /* THE ZERO CASE READS THE WHOLE LADDER, NOT ONE RUNG (controller, plan step
     11's record, 2026-09-17). PART 4's table gives 40 to "the page's answer,
     exactly one per page, in the hero" and 30 to "a section's own focal": the
     hero's figure IS its 40, and a 30 beside it would be a second loud figure
     in one card, so a block holding a leaf at 40 has its focal at the rung
     above and is not judged empty. A prose form holds no figure by its own
     law (`note-list`, PART 8's one prose section a page), so it is not judged
     either. Both readings are written into PART 4 in the same commit; neither
     is a loosening of the rule, because a card that could carry a 30 and does
     not still reds, which is 47 cards on the six pages the day this landed
     minus the heroes and the prose. */
  const FOCAL_EXEMPT_FORMS = new Set([...EVEN_BY_RULING, "note-list"]);
  for (const block of topBlocks) {
    if (!block.getClientRects().length || FOCAL_EXEMPT_FORMS.has(formOf(block))) continue;
    const sizes = sizesOf(block);
    const at30 = sizes.filter((s) => Math.abs(s - 30) < 0.5).length;
    const at40 = sizes.filter((s) => Math.abs(s - 40) < 0.5).length;
    if (at30 > 0) any30 = true;
    if (at30 === 0 && at40 === 0) push(idOfCard(block), "FOCAL", "no focal figure at 30 in this card (PART 4: every section card takes exactly one)");
  }
  if (!any30 && topBlocks.length === 0) unmeasured.push("FOCAL: no [data-block] card and no element at 30px on this page; the rule is unmeasured, not passed");

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
    const ceiling = track.getAttribute("data-track");
    if (ceiling === "set") continue; // declared: the set's own heaviest member, not the world's
    /* "scale" (plan step 12): a spectrum between two poles has no maximum at
       either end; MODEL.md 8.2 says of a fixed-ended track "not a world
       track ... clause 5 and the PLACEMENT check do not reach it". */
    if (ceiling === "scale") continue;
    if (ceiling === "" || ceiling == null) push(cardIdOf(track), "PLACEMENT", "a track that declares no ceiling (every data-track says world, set or scale; plan step 12)");
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
      if (matched) push(idOfCard(card), "EDGE", "the card's outer edge is the same colour as a hairline divider inside it");
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

  return { found: out, unmeasured, blocks };
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
  let blocksAtWide = null;
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    /* Real flag images need a decode to report a true natural size; a
       data-URI fixture image needs no network for this and still benefits. */
    await page.evaluate(async () => { for (const im of document.images) { im.loading = "eager"; try { await im.decode(); } catch { /* not this check's business */ } } });
    const { found, unmeasured: um, blocks } = await page.evaluate(inPage, { floor, wide: w === WIDTHS[0] });
    if (blocks != null) blocksAtWide = blocks;
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
  /* The floor line on every page, met or not (plan step 50): the reds above carry a breach; this line carries the count. */
  if (blocksAtWide != null && floor != null && blocksAtWide >= floor) console.log(`  ${name}: BLOCK FLOOR: ${blocksAtWide} blocks against a floor of ${floor}, met`);
}
await browser.close();
console.log(`model laws: ${files.length} page(s) x ${WIDTHS.length} widths, ${reds.length} red(s)`);
for (const r of reds) console.log(`  ${r.name}@${r.w} #${r.id}: ${r.rule}: ${r.detail}${r.count > 1 ? ` (${r.count}x)` : ""}`);

/* THE PER-PAGE RATCHET (plan step 14b, 2026-09-17), the same shape as
   check_page_holes.mjs's: with --ratchet, a page's row count is held to
   scripts/harness/model_laws_baseline.json and the exit is 1 only when a
   page is OVER its number; a page under it prints the fall and
   --write-baseline lowers the file in the same commit; a page not in the
   file is seeded at its first measurement and announced, never silently
   accepted. Without --ratchet the exit is 1 on any red, as before, which is
   the form the controller reads while working. The baseline is the standing
   backlog DEBUG.md section 7 records (the rows the pages carry before file
   04 rebuilds them), and a baseline falls and never rises: the day a rule is
   made to measure more, the new rows are recorded there with their reason
   and the file is reseeded by hand, in the open. This is what lets the list
   run in the chain (gate `harness-laws`) without a standing red hiding the
   next real one. */
const RATCHET = args.includes("--ratchet");
if (RATCHET) {
  const BASELINE = "scripts/harness/model_laws_baseline.json";
  const WRITE_BASELINE = args.includes("--write-baseline");
  const stored = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : {};
  const have = {};
  for (const f of files) have[basename(f).replace(/\.html$/, "")] = 0;
  for (const r of reds) have[r.name] = (have[r.name] || 0) + 1;
  const over = [], under = [], held = [], seeded = [];
  for (const [name, n] of Object.entries(have)) {
    if (!(name in stored)) { seeded.push(`${name}: ${n} (first measurement)`); stored[name] = n; continue; }
    if (n > stored[name]) over.push(`${name}: ${n} against a baseline of ${stored[name]}`);
    else if (n < stored[name]) { under.push(`${name}: ${n}, baseline ${stored[name]} can fall`); if (WRITE_BASELINE) stored[name] = n; }
    else held.push(`${name} ${n}`);
  }
  let exit = 0;
  if (over.length) { console.log(`model laws RATCHET: ${over.length} page(s) over their baseline: ${over.join("; ")}. Remedy: fix the card the new row names, or record the row in DEBUG.md section 7 with its reason and reseed the file by hand; never raise it to pass`); exit = 1; }
  if (seeded.length || (WRITE_BASELINE && under.length)) {
    const { writeFileSync: writeBaseline } = await import("node:fs");
    writeBaseline(BASELINE, JSON.stringify(stored, null, 2) + String.fromCharCode(10));
    if (seeded.length) console.log(`model laws RATCHET: seeded and written: ${seeded.join("; ")}`);
    if (WRITE_BASELINE && under.length) console.log(`model laws RATCHET: baseline lowered and written: ${under.join("; ")}`);
  } else if (under.length) console.log(`model laws RATCHET: ${under.join("; ")} (run with --write-baseline to lower it)`);
  if (held.length && !exit) console.log(`model laws RATCHET: holding at baseline on ${held.join(", ")}; these rows are file 04's work and not a pass`);
  process.exit(exit);
}
process.exit(reds.length ? 1 : 0);
