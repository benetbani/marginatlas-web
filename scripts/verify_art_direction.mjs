/**
 * verify_art_direction , the measurable half of E:\atlas\design\ART-DIRECTION.md.
 *
 * The art direction was ratified 2026-08-25 after the founder found seven faults
 * that 116 gates could not see. Its section J lists which of its rules are
 * machine-checkable and which are judgment; this file is section J's first
 * column. The judgment half is checked by opening the picture, and nothing here
 * substitutes for that.
 *
 * ONE FILE, SEVERAL NAMED CHECKS. Each reports its own count and its own
 * offenders, so a failure says which RULE broke rather than which script.
 *
 * BLIND SPOTS, all of them, stated before any number here is quoted:
 *
 *   - It reads the six spine pages as the harness renders them (the fresh
 *     entries of scripts/lib/page_renders.mjs, written by the pages-fresh gate
 *     at the head of the chain since plan step 14b, 2026-09-17; before that,
 *     four London snapshots frozen on 2026-09-08), not the live routes. A
 *     section that only renders for a different city is invisible to it. The
 *     baseline keeps its old keys (cell-london-restaurants, country-gb-new),
 *     which the module maps; the first line printed says what was read.
 *   - Chrome reports a laid-out rect for content inside a CLOSED <details> that
 *     it never paints. Everything here skips collapsed disclosures, because a
 *     first version of this measurement counted fourteen overlaps and twelve
 *     were that.
 *   - Ink coverage measures EXTENT, top drawn thing to bottom drawn thing, not
 *     density. A card with content only at its two ends reads as full here and
 *     looks empty to a person.
 *   - Terracotta is counted by computed colour, so a mark that is terracotta by
 *     virtue of an image or a gradient is not counted.
 *   - It cannot tell a section that is full width BY DESIGN from one that is
 *     full width by neglect. That is what the hero attribute is for.
 *   - D3 reads the split each zone DECLARES (its data-zone attribute), not the
 *     tracks the stylesheet draws, so it cannot tell a split that failed to draw
 *     as declared from one that drew as declared. D6 reads one width (1440) and
 *     cannot see a margin or an element standing between two zones. Each is said
 *     again where it is read; the first also in scripts/lib/zone_rhythm.mjs.
 *
 * Usage: node scripts/verify_art_direction.mjs [--write-baseline]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { eachPage, renderEntries, describeRenders, nameWithKey, missingLine } from "./lib/measure_pages.mjs";
import { requireBrowser } from "./lib/local_only.mjs";
import { OPENED } from "./lib/open_panels.mjs";
import { zoneRhythm, zoneLadder, NO_ZONE_READ } from "./lib/zone_rhythm.mjs";

/* A BUILD SERVER HAS NO BROWSER. This gate photographs real pages, so it cannot
   run where chromium is not installed, and trying killed a production deploy on
   2026-08-27. It skips loudly there and runs unchanged on the design machine. */
await requireBrowser("art-direction", "the measured art-direction counters");

const BASELINE = "scripts/art_direction_baseline.json";
const RULE = "art-direction";

const entries = renderEntries();
console.log(`  ${describeRenders(entries, RULE)}`);
const missing = entries.filter((e) => !e.exists);

const collect = () => {
  /* The accent, as the tokens define it. Counted by computed colour rather than
     by class, because a class tells you what was WRITTEN and this asks what
     RENDERS. Declared inside the collector because this function is serialised
     into the page and cannot see anything from this file's scope. */
  const TERRA = ["rgb(251, 132, 105)", "rgb(194, 65, 12)"];
  /* The first reading's rule; since plan 2026-10-13 (Task 1E) the page is judged again with every plus open. */
  const inDeadDetails = (e) => {
    const d = e.closest("details");
    return !!d && !d.open && !e.closest("summary");
  };
  /* Card definition repointed 2026-09-08, fix wave Finding 2. The glass is
     gone (CARD_SURFACE in kit.tsx no longer sets a backdrop-filter), so
     `backdropFilter !== "none"` is false for every element on every page and
     this gate used to find zero cards while reporting success. Repointed at
     the harness's own single definition of a card
     (scripts/harness/check_page_holes.mjs): a `main [class*="rounded-[14px]"]`
     element that has client rects and is not nested inside another one. */
  const cards = [...document.querySelectorAll('main [data-card]')].filter(
    (c) => c.getClientRects().length && !c.parentElement.closest('[data-card]'),
  );
  const outer = cards;

  const sections = outer.map((c) => {
    const cb = c.getBoundingClientRect();

    /* E1, prose budget. Runs of 30+ characters carrying a space are sentences;
       a label, a figure and a unit are not.

       NOT WHAT NOBODY SEES. Found 2026-09-08: the neighbourhood page's map
       (SpineMap.tsx) injects a scoped stylesheet with a plain `<style>` tag, and
       a `<style>` element's CSS text is an ordinary text-node CHILD in the DOM,
       so it was being summed as 1437 characters of "prose" on a page with none ,
       CSS syntax, not a sentence a reader meets. The same walk also double-counted
       a table's screen-reader-only caption (Tailwind `sr-only`: a real 1x1px
       element, present for assistive tech, invisible to a sighted reader) once
       for itself and once for the visible paragraph carrying the same words,
       reading a single sentence as two. Both are "nobody sees this row of
       characters", which is what a rendered-size guard tests directly rather than
       enumerating every way markup can hide text: `<style>`/`<script>` compute a
       zero rect (UA default `display:none`), and a clip-based sr-only technique
       computes 1x1. A 220-character BUDGET has to be a budget over what is
       actually on the page. */
    let prose = 0;
    for (const e of c.querySelectorAll("*")) {
      if (inDeadDetails(e)) continue;
      const eb = e.getBoundingClientRect();
      if (eb.width < 2 || eb.height < 2) continue;
      const own = [...e.childNodes]
        .filter((x) => x.nodeType === 3 && x.textContent.trim())
        .map((x) => x.textContent.trim())
        .join(" ");
      if (own.length >= 30 && /\s/.test(own)) prose += own.length;
    }

    /* E2, ink coverage. */
    let top = cb.bottom;
    let bot = cb.top;
    for (const e of c.querySelectorAll("*")) {
      if (inDeadDetails(e)) continue;
      const s = getComputedStyle(e);
      const drawn =
        [...e.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim()) ||
        e.tagName === "svg" ||
        s.backgroundColor !== "rgba(0, 0, 0, 0)";
      const b = e.getBoundingClientRect();
      if (drawn && b.height > 2) {
        top = Math.min(top, b.top);
        bot = Math.max(bot, b.bottom);
      }
    }
    /* MEASURED AGAINST THE CONTENT BOX, NOT THE BORDER BOX. A card's own padding
       is not emptiness, and on a SHORT card it is most of the difference: the
       neighbourhood hero is 121px tall of which 48 is its top and bottom padding,
       so 71px of content read as 59% and looked like a crater. E2 is about a card
       stretched past what it holds, which is the content box's business. */
    const cs = getComputedStyle(c);
    const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const inner = Math.max(1, cb.height - padY);
    const ink = Math.max(0, bot - top);

    /* C2, accent budget. A mark counts once whether it is coloured text, a fill
       or a border on a data element. */
    /* A MARK, NOT A NODE. "Median" and "$57K" and the dot beside them are three
       elements carrying one accent: they are ONE mark on the chart, and C2 asks
       how many things claim to be the answer, not how many DOM nodes hold the
       colour. Accented elements whose boxes sit within 24px of each other collapse
       into one mark. Before this every page failed the budget and the number said
       nothing about the design. */
    const accentBoxes = [];
    for (const e of c.querySelectorAll("*")) {
      if (inDeadDetails(e)) continue;
      const s = getComputedStyle(e);
      /* A COMPARED SET MARKS ONE BEST PER ROW BY DESIGN. C1 requires it, so
         counting table cells against a two-per-section budget put the rule in
         conflict with itself: a three-row comparison is correct and read as three
         violations. Cells are exempt; loose marks are not.

         THE SPECTRA TABLE IS THE SAME SHAPE IN DIVS, found 2026-09-08. It draws
         one dot per named trait (SpectraTable.tsx), each row its own `<div
         data-spectrum-row>` rather than a `<tr>`, so the td/th exemption above
         never saw it: three London "dealing with people" reads, one terracotta
         dot each, counted as three loose marks on one card. It is the identical
         compared set C1 already requires and this file already exempts, drawn
         with the archetype's own markup instead of a literal table, so it gets
         the identical exemption rather than a second rule that happens to agree. */
      if (e.closest("td, th, [data-archetype='spectra-table']")) continue;
      const own = [...e.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim());
      const eb = e.getBoundingClientRect();
      if (eb.width < 1 || eb.height < 1) continue;
      /* AN ACCENT DRAWN IN SVG IS AN ACCENT. This read CSS colour only, so every
         terracotta stroke and fill on the site was invisible to it: a chart could
         paint its whole finding in the accent and score zero. Found when a chart
         was ported from SVG text to real text and its count jumped from 2 to 4
         without one pixel of colour changing. */
      /* AN ICON GLYPH IS CHROME, NOT A MARK. The section icons carry terracotta
         details two to five pixels across inside a fourteen-pixel glyph. Ten of
         them on one page. They are not claiming to be the answer to anything, and
         counting them against the answer budget made every section on the site
         look over-marked the moment SVG paint became visible to this check.
         Whether an icon should carry the accent at all is C5's question, colour on
         chrome, and it is a separate one from C2's. */
      if (e.closest("svg.ma-glyph, .spine-ic")) continue;
      const svgPaint = [s.fill, s.stroke].filter(Boolean);
      const painted = svgPaint.some((v) => TERRA.includes(v)) && e.namespaceURI === "http://www.w3.org/2000/svg";
      if (!((own && TERRA.includes(s.color)) || TERRA.includes(s.backgroundColor) || painted)) continue;
      /* A HIGHLIGHTED ROW IS ONE MARK. The rank, the dot and the value that mark
         the lightest district sit at the two ends and the middle of one row, far
         further apart than any proximity test would collapse, and they mark ONE
         thing. Marks sharing a row are one mark. */
      const row = e.closest("li, tr, [role='row']");
      accentBoxes.push({ l: eb.left, r: eb.right, t: eb.top, b: eb.bottom, row });
    }
    /* BOXES WITHIN 24px, TRANSITIVELY, which is what the rule above always said
       and what the code did not do: it compared top-left CORNERS, so two elements
       that physically touch scored as two marks whenever their corners were far
       apart. A label beside its own dot is the ordinary case and it failed.
       Transitive because a mark can be drawn as a chain: a name, a dot, a line
       across the plot, a dot, a name, tracing ONE district through a chart. That
       is one thing claiming to be the answer, which is what C2 counts. */
    const gap = (a, b) =>
      Math.max(0, Math.max(a.l - b.r, b.l - a.r)) + Math.max(0, Math.max(a.t - b.b, b.t - a.b));
    const parent = accentBoxes.map((_, i) => i);
    const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
    for (let i = 0; i < accentBoxes.length; i++) {
      for (let j = i + 1; j < accentBoxes.length; j++) {
        const a = accentBoxes[i], b = accentBoxes[j];
        if ((a.row && a.row === b.row) || gap(a, b) < 24) parent[find(i)] = find(j);
      }
    }
    const accents = new Set(accentBoxes.map((_, i) => find(i))).size;

    /* A5, a bordered box inside a bordered card. */
    let nestedBoxes = 0;
    for (const e of c.querySelectorAll("div")) {
      const s = getComputedStyle(e);
      const b = e.getBoundingClientRect();
      if (s.borderTopWidth === "0px" || parseFloat(s.borderTopLeftRadius) < 6) continue;
      if (b.width < 200 || b.height < 60) continue;
      if (b.width > cb.width - 8) continue; // the card's own inner wrapper
      /* AN INSET STAT PANEL IS NOT A NESTED SECTION. A5 forbids a SECTION inside a
         section, and what makes a section is its rail: an icon and a name. Two
         stat panels sitting beside a chart, carrying a figure each and no rail,
         are the card's own furniture. Counting them read a correct composition as
         two violations. */
      if (!e.querySelector("[data-rail], h2, h3")) continue;
      nestedBoxes++;
    }

    return {
      w: Math.round(cb.width),
      h: Math.round(cb.height),
      prose,
      kit: !!c.closest('[data-composition="kit"]'),
      inkPct: Math.min(100, Math.round((ink / inner) * 100)),
      accents,
      nestedBoxes,
      editorial: !!c.querySelector("[data-editorial='1']") || c.matches("[data-editorial='1']"),
      label: (c.textContent || "").trim().replace(/\s+/g, " ").slice(0, 36),
    };
  });

  /* G6, A SCALE'S DOMAIN FOLLOWS ITS DATA.
     Caught by hand on 2026-08-24: the rent strip was a divergence chart drawn
     symmetrically whatever the numbers did, and every London district is heavier
     than the city rate, so half the track was blank on all seven rows and the word
     LIGHTER labelled a region no bar could reach. A scale whose marks use less
     than half their track is reserving room for values that cannot occur.

     BLIND SPOTS, both real. It finds MARKS, small absolutely-positioned dots and
     handles, so it sees dot plots and marker scales and does NOT see the bar
     strip that motivated it, where the data is drawn as bar widths. And a scale
     legitimately padded at both ends to make room for its labels looks the same
     as one with a domain that is too wide; the 50% floor is set low for that
     reason, and the four scales on these pages measure 57, 59, 93 and 95. */
  const wideDomains = [];
  for (const track of document.querySelectorAll('[role="img"]')) {
    const tb = track.getBoundingClientRect();
    if (tb.width < 120 || tb.height > 200) continue;
    /* A TRACK THAT DRAWS EVERY COUNTRY IS ITS OWN DOMAIN (2026-10-04, the UK page reform; WorldRange.tsx `hairlines`): the world's
       values stand on it as hairlines from its lowest to its highest, so its span is the data's by construction, and the peers'
       hollow marks clustering at one end (four small-business loan rates of 4.3 to 4.5% on a world that reaches 78%) is a reading,
       not room reserved for values that cannot occur. */
    if (track.querySelector("[data-track-hairlines]")) continue;
    /* A BAR IS NOT A MARK (2026-10-04, the band page): a column's fill is drawn as its height from a baseline (`data-bar`), the
       form this rule says above it does not read; on the band the spending-by-income columns kept their own 144px instead of
       the directory's height beside them, and three short fills of 37 by 20 to 34 read as three marks bunched on a track. */
    const marks = [...track.querySelectorAll("*")].filter((e) => {
      if (e.hasAttribute("data-bar")) return false;
      if (getComputedStyle(e).position !== "absolute") return false;
      const b = e.getBoundingClientRect();
      return b.width > 2 && b.width < 40 && b.height > 2 && b.height < 40;
    });
    if (marks.length < 3) continue;
    const xs = marks.map((m) => {
      const b = m.getBoundingClientRect();
      return ((b.left + b.width / 2 - tb.left) / tb.width) * 100;
    });
    const span = Math.max(...xs) - Math.min(...xs);
    if (span < 50) wideDomains.push(`${marks.length} marks use ${Math.round(span)}% of a track: "${(track.getAttribute("aria-label") || "").slice(0, 40)}"`);
  }

  /* C4, A LEGEND MAY NOT NAME A COLOUR THAT IS NOT ON THE PAGE.
     Caught by hand on 2026-08-24: the district map's legend read "terracotta =
     lighter than the city", and no London district is below the city rate, so it
     promised a reader a colour they could never find. Any text naming the accent
     is checked against whether the accent actually renders in the same section. */
  const falseLegends = [];
  for (const c of outer) {
    let names = false;
    for (const e of c.querySelectorAll("*")) {
      if (inDeadDetails(e)) continue;
      const own = [...e.childNodes]
        .filter((x) => x.nodeType === 3 && x.textContent.trim())
        .map((x) => x.textContent.trim())
        .join(" ");
      if (/terracotta|orange/i.test(own)) names = true;
    }
    if (!names) continue;
    let has = false;
    for (const e of c.querySelectorAll("*")) {
      const st = getComputedStyle(e);
      if (TERRA.includes(st.color) || TERRA.includes(st.backgroundColor)) { has = true; break; }
    }
    if (!has) falseLegends.push(`a legend names the accent and no mark in the section carries it: "${(c.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40)}"`);
  }

  /* H3, A LABEL THAT READS THE SAME FOR EVERY ROW IS NOT A LABEL.
     Founder's rulebook §7 and this direction's H3. Caught by hand on 2026-08-24:
     seven district chips all read "rent runs heavier than the city", including the
     one the page's own headline called the LIGHTEST. Every London district is above
     the city rate, so the grade was identical for every row on every page it could
     appear on. Nothing stopped that, and nothing stopped it coming back.

     A repeated structure is a list or a table body with three or more rows. For
     each position within the row, the text at that position is collected across
     all rows; if every row says the same thing and it is longer than three
     characters, that position carries no information.

     BLIND SPOT: a column that is identical because the DATA is identical, rather
     than because the label was written once, reads the same here. That distinction
     needs the source, not the page. Three rows minimum keeps the noise down.

  /* D6, THE SPACING LADDER (on the zones since plan 2026-10-12 rhythm-air-inside, Task 1D; judged by
     scripts/lib/zone_rhythm.mjs). On a band page the rungs, outermost first, are the distance from one level to
     the next (one zone's padding below plus the next one's above), the distance between two sections side by
     side in a level (the level's column gap), and a kept box's padding (a lever, a picker, the sortable table, a
     door). DISTANCES 2.5 states the three as 128, 64 and 20 at 1024 and up, and no rung may equal or fall under
     the one inside it. The ladder of the card page, which this replaced, was chapter gap, band gap, card padding,
     slot gap; its chapter rung is not read here: a band page opens a chapter under the same padding as any level
     and marks it with its numbered head (MODEL PART 10.2). Measured before the rule ran, on that page: the gap
     BETWEEN bands, the gap WITHIN a band and a card's own padding were all 20px, so three of the four rungs were
     the same number and a reader had nothing telling them where one band ended and the next began.

     READ AT ONE WIDTH ON PURPOSE, 1440: the zone padding and the gap between two sections step up with the
     width (globals.css, THE ZONES; src/components/spine/zones.tsx), and DISTANCES 2.5 states the rungs at 1024
     and up, so this reads them where they are stated and does not judge the narrower steps.

     BLIND SPOT: the distances inside a section (the title to its content, one group to the next, a fact row to
     the next, the slot gap between a card's own anatomy slots) are not measured here. They are set by utility
     classes on dozens of individual elements and picking one to stand for all of them would be a number
     pretending to be a measurement; the spacing pin holds the kit's shared pieces to the ladder inside a
     section (tests/spine/spacing_pin.test.ts). The three rungs read here are the ones that carry the page's
     rhythm. This measurement cannot distinguish a page that draws no kept box from one whose kept box the
     reading's three selectors do not name (the kept-box rung is judged only where one is found), and it cannot
     see a margin or an element standing between two zones (the distance from one level to the next is the two
     paddings and nothing else).

  /* D3, RHYTHM (on the zones since plan 2026-10-12 rhythm-air-inside, Task 1D; judged by
     scripts/lib/zone_rhythm.mjs). No zone repeats the split of the zone immediately before it, and never three
     equal-halves zones in a row. A page of identical halves is as monotonous as a page of full widths, just
     narrower. A wide zone holds no split (the hero, the peers table, the close), so two of them side by side are
     no repeat; a zone left holding one section is a split of its own, "lone", and two lone zones side by side
     are one.

     READ FROM THE SPLIT EACH ZONE DECLARES, NOT FROM THE TRACKS IT DRAWS. The reading is the data-zone attribute
     the Zone component writes (src/components/spine/zones.tsx: wide, lone, 1-1, 2-1, 1-2, 3-2, 2-3, 1-1-1) on
     each visible zone in page order, which is `zoneSplits` below: the split the page asked for and the number of
     sections it gave, which is what was written, not what the browser laid out. The reading it replaced found a
     level by the old Band class, which no live page has carried since the band page of 2026-10-04, so it read
     nothing and passed on every page; it did take the split from the computed track sizes, which the attribute
     does not give.

     BLIND SPOT: this measurement cannot distinguish a split that silently failed to compile (a column class the
     stylesheet did not generate, a `:has()` variant that did not apply) from one that drew as declared, and it
     cannot say how a lone zone's section is drawn (in the left two thirds, or the left third where it is lean):
     the attribute says "lone" and no more, so two lone zones side by side read as one repeat however each is
     drawn.

     NO WIDTH TO CHOOSE: the attribute is the same at 1440, 768 and 375, so D3 has no width of its own (D6,
     above, is the one read at 1440). D3 governs the SPLIT, a choice a page makes, and below `lg` the ratio waits
     (D4 hands the width to the content), so a level is equal halves or one column there and a narrow render's
     tracks show the same shape whatever was chosen; the attribute shows the choice at every width. Do NOT add a
     second width here to make the tablet fail: what is actually wrong at 768 is content, not rhythm, and it is
     measured in C21. */
  const sameForAll = [];
  /* A REPEATED STRUCTURE IS NOT ONLY A LIST. Written first against ol, ul and
     tbody, this could not see the fault it exists for: the seven district chips
     that all read the same are BUTTONS in a plain div. Any parent whose visible
     element children are three or more of the same tag is a repeated structure. */
  const structures = [];
  for (const parent of document.querySelectorAll("ol, ul, tbody, div")) {
    const rows = [...parent.children].filter(
      (r) => r.nodeType === 1 && r.getBoundingClientRect().height > 2,
    );
    if (rows.length < 3) continue;
    if (!rows.every((r) => r.tagName === rows[0].tagName)) continue;
    structures.push(rows);
  }
  for (const rows of structures) {
    const width = Math.min(...rows.map((r) => r.children.length));
    /* Position 0 is the row itself when a row has no element children, which is
       how a chip row reads: the button IS the cell. */
    const cells = (r, i) => (width ? r.children[i] : r);
    for (let i = 0; i < Math.max(1, width); i++) {
      /* On a kit render, a band's sections share four rows and the fourth is the caption "Place, 2026." (kit3.card's anatomy,
         his FV 2109: "the sections of one band share four rows"); the approved v8 industry render prints the same place caption
         on each of a band's three sections (FOUNDER-VERDICTS 2026-10-22, "v8 is the approved industry target."). A shared
         caption is the band's anatomy, not a repeated content row; any other same-for-all column still counts. */
      if (rows.every((r) => { const c = cells(r, i); return c !== r && !!c.matches && c.matches("p.caption") && !!c.closest('[data-composition="kit"]'); })) continue;
      const texts = rows.map((r) => (cells(r, i).textContent || "").trim().replace(/\s+/g, " "));
      if (texts[0].length <= 3) continue;
      if (texts.every((t) => t === texts[0])) sameForAll.push(`${rows.length} rows all read "${texts[0].slice(0, 40)}"`);
    }
  }

  const px = (v) => Math.round(parseFloat(v) || 0);
  /* D3 AND D6 READ THE ZONES (plan 2026-10-12 rhythm-air-inside, Task 1D; spec section 3 item 4). Both found a level by the old Band class
     (`mt-8 grid grid-cols-1 items-start gap-8`), which no live page has carried since the band page of 2026-10-04, so each read nothing
     and passed on every page. A level is a zone: `main [data-zone]` in page order, its split the attribute the Zone component writes
     (src/components/spine/zones.tsx: wide, lone, 1-1, 2-1, 1-2, 3-2, 2-3, 1-1-1). D6's rungs on a band page (DISTANCES 2.5): a level to the
     next, one zone's padding below and the next one's above; two sections side by side, the level's column gap; a kept box, its padding.
     The judging is scripts/lib/zone_rhythm.mjs's, in node. */
  const zoneEls = [...document.querySelectorAll("main [data-zone]")].filter((z) => z.getClientRects().length);
  /* A lone zone standing on the right (`data-zone-side="end"`, plan Q4's option C; final review I3, 2026-10-15) is a split of its own,
     "lone-end", so lone zones that alternate their side are no repeat; two on one side still are. */
  const zoneSplits = zoneEls.map((z) => { const s = z.getAttribute("data-zone") || ""; return s === "lone" && z.getAttribute("data-zone-side") === "end" ? "lone-end" : s; });
  /* A zone that opens a chapter starts D3 afresh (plan 2026-10-13 country-page-journey, Q4's answer A; scripts/lib/zone_rhythm.mjs). */
  const zoneStarts = zoneEls.map((z) => !!z.querySelector(":scope > [data-chapter-head]"));
  const levelGaps = zoneEls.slice(1).map((z, i) => px(getComputedStyle(zoneEls[i]).paddingBottom) + px(getComputedStyle(z).paddingTop));
  const pairGaps = zoneEls.map((z) => z.querySelector(":scope > [data-zone-level]")).filter((l) => l && l.children.length > 1).map((l) => px(getComputedStyle(l).columnGap));
  const keptPads = [...document.querySelectorAll("main [data-zone] [data-keep-card], main [data-zone] [data-instrument], main [data-zone] [data-lever-card]")].filter((e) => e.getClientRects().length).map((e) => px(getComputedStyle(e).paddingTop));

  /* F1, TABULAR NUMERALS. Founder, 2026-08-25: every table, chart and visual
     follows written conventions for how its elements render. A column of numbers
     is scanned vertically and proportional numerals make equal values look
     unequal, so a figure that stacks with other figures has to be tabular.

     BLIND SPOT: this cannot tell a figure that STACKS from one that stands alone.
     A scale's two end labels sit at opposite ends and never align with anything,
     so they are counted here and are not really a fault. The number is a ratchet,
     not a verdict, and it is the stacked ones worth spending on. */
  let looseNumerals = 0;
  for (const e of document.querySelectorAll("*")) {
    if (inDeadDetails(e)) continue;
    const own = [...e.childNodes]
      .filter((x) => x.nodeType === 3 && x.textContent.trim())
      .map((x) => x.textContent.trim())
      .join(" ");
    if (!own || !/^[+-]?[$£€x]?[\d][\d,. ]*(K|M|%|pp|\/10)?$/i.test(own)) continue;
    if (e.getBoundingClientRect().width < 1) continue;
    if (/tabular-nums/.test(getComputedStyle(e).fontVariantNumeric)) continue;
    looseNumerals++;
  }

  /* C2 page budget, and H4 front repetition. */
  const pageAccents = sections.reduce((a, s) => a + s.accents, 0);

  /* THE PAGE'S ANSWER IS EXEMPT, AND THE RULE WAS WRONG WITHOUT THAT.
     H4 says the hero answers and the sections below evidence it, then counted the
     evidencing as a repeat. Evidencing an answer necessarily restates it: a hero
     reading "rent runs lightest, x1.20, South London" is proved by a strip whose
     first row is "1 South London x1.20", and that is the page working rather than
     the page repeating.

     What the founder actually saw on 2026-08-25 was a hero carrying a SECOND panel
     that restated three of the strip's figures wholesale, and a hero card stating
     its own focal twice. Both are gone. So the strings the hero itself carries are
     exempt, and everything else in the first screen still counts. */
  /* EXACTLY ONE ELEMENT IS EXEMPT: the hero's largest figure.
     A hero states ONE answer and the section below proves it, which is the page
     working, so one occurrence of that figure has to be free. But the exemption
     has to be an ELEMENT and not a string, and not a block either. Three earlier
     attempts got this wrong and each one hid a fault that had just been fixed:
     exempting anything the hero touched, then anything it said once, then the
     focal's whole parent block. Each was found by putting the real fault back and
     watching the rule stay quiet.

     Dropping one element and counting the rest handles every case seen:
       hero focal + strip proving it        one left, silent, correct
       hero focal + hero tile + strip       two left, fires, correct
       hero carrying a non-answer figure    not the largest, fires, correct */
  let exemptEl = null;
  {
    let max = 0;
    for (const e of document.querySelectorAll("[data-hero='1'] *")) {
      const b = e.getBoundingClientRect();
      if (b.width < 1 || b.height < 1) continue;
      if (![...e.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim())) continue;
      const fs = parseFloat(getComputedStyle(e).fontSize) || 0;
      if (fs > max) { max = fs; exemptEl = e; }
    }
  }

  const seen = new Map();
  for (const e of document.querySelectorAll("*")) {
    if (inDeadDetails(e)) continue;
    const own = [...e.childNodes]
      .filter((x) => x.nodeType === 3 && x.textContent.trim())
      .map((x) => x.textContent.trim())
      .join(" ")
      .replace(/\s+/g, " ");
    if (own.length < 4) continue;
    /* A ZERO-SIZE BOX IS NOT ON THE PAGE. <title>, <style> and every SVG <title>
       accessibility label report a rect at 0,0 with no width or height, and the
       map's pin titles carry a district name each. They were being counted as
       repeats at the very top of the page, which is both wrong and the worst
       possible place to be wrong, since the top of the page is what this rule is
       about. A first probe of this hid it by truncating its own output. */
    const rb = e.getBoundingClientRect();
    if (rb.width < 1 || rb.height < 1) continue;
    /* THE HONESTY TAG IS NOT REPETITION. "sample" marks every section whose
       figures are modelled, and it is REQUIRED to appear on each of them. H4 is
       about the page telling a reader the same THING twice, not about a chrome
       marker doing its job.
       KEPT DELIBERATELY WHILE THE MARK IS HIDDEN (2026-09-11): the word draws
       nowhere today because `areSampleMarksVisible()` is off, so this clause
       currently matches nothing. It stays because the switch is a switch: the day
       the marks come back, a page carrying eight of them must not be read as a
       page repeating itself eight times, and rediscovering that would cost the
       same afternoon it cost the first time. */
    if (/^sample$/i.test(own)) continue;
    if (e === exemptEl) continue;
    /* A REPEATED LABEL IS THE SITE OBEYING H8, NOT THE PAGE REPEATING ITSELF.
       H8 requires one measurement to be named the same way throughout, so a metric
       label WILL appear wherever that metric appears: the city masthead shows
       "Customer income $65K" and the quick reads show "Customer income, High",
       which is a figure and a position, two different things under the one name
       the site is obliged to use. Counting that put two of this direction's own
       rules against each other.

       What the founder saw was a FIGURE stated twice, so a figure is what counts.
       The district-chip fault, seven rows carrying identical words and no number,
       is caught by H3 and does not need this rule. */
    if (!/\d/.test(own)) continue;
    /* A DRAWING LABELLING ITS OWN MARK IS NOT THE PAGE SPEAKING TWICE, and this
       clause is the fourth narrowing this file has needed for the same reason as
       the three above it: the rule was counting the page working.

       The comment at the head of this block already says so in as many words,
       "evidencing an answer necessarily restates it", and the remedy it built was
       an exemption for ONE element, the hero's largest figure. That covers a hero
       whose own figure is echoed once. It cannot cover a card that states TWO
       figures a drawing below must then label, which is the atlas's actual shape:
       the city verdict card names the lightest district AND the heaviest, and the
       ranking under it is a LollipopColumn, whose entries each print their own
       value above their own dot because that is what makes a height readable as a
       quantity rather than as a column of numbers.

       MEASURED BEFORE THE CHANGE, on both pages that fired. City: "x3.00" in the
       verdict card's ends-of-the-spread strip at y=484, and the same string as the
       West End stem's own label at y=784. Hood: "x1.20" in the masthead (already
       exempt), the same string as the cheapest stem's label at y=689, and the
       detail panel's own answer at y=874.

       AND THE PAGES CANNOT BE FIXED, WHICH IS WHAT SETTLES IT. On the hood page
       the two answer-size figures are `design/blueprints/hood.md`'s own declared
       pair, and verify_blueprint_conformance refused a row that tried to change
       one of them by name. On the city page the verdict strip is what a phone
       reader meets the far end of the ladder in, which the ranking's own entry
       depends on. The only remaining move is to strip a form of its data labels,
       and a finding whose only remedy is to break a ratified form has stopped
       measuring the page.

       THE LINE IS THE CATALOGUE'S, NOT MINE. Its budget table names exactly three
       ideas that carry NO DRAWN MARKS: I8 a table, I9 a figure alone, I11 ranked
       rows. Every other idea draws, so a figure inside one of those is a mark's
       value. Counted across the four gated pages, the whole set this exempts in
       the first screen is fourteen runs and every one is a bare figure: seven
       district multiples on each lollipop, three axis marks on the cell page's
       pay track and the margin ladder's "$100 of sales". Not one is a sentence,
       because a card's head and foot sit OUTSIDE the form's own element. */
    const ideaHost = e.closest("[data-idea]")?.getAttribute("data-idea");
    if (ideaHost && !["I8", "I9", "I11"].includes(ideaHost)) continue;
    const top = rb.top + window.scrollY;
    if (top > 900) continue;
    /* A REPEAT INSIDE ONE SECTION IS THE FORM WORKING. A tier band names its two
       poles and marks the value, so the word "Deep" legitimately appears three
       times inside one card; counting that told the reader nothing and buried the
       real finding, which was a figure printed in three DIFFERENT sections of the
       first screen. Keyed by the section a run sits in, and only a run that
       crosses sections counts. */
    const card = e.closest("[data-hero='1']") || e.closest("div[style*='backdrop']") || e.closest("main > div") || document.body;
    if (!seen.has(own)) seen.set(own, { ys: new Set(), cards: new Set() });
    seen.get(own).ys.add(Math.round(top));
    seen.get(own).cards.add(card);
  }
  const frontRepeats = [...seen.entries()]
    .filter(([, v]) => v.cards.size > 1)
    .map(([t, v]) => [t, v.ys])
    .filter(([, ys]) => ys.size > 1)
    .map(([t, ys]) => `"${t.slice(0, 36)}" at ${[...ys].sort((a, b) => a - b).join(", ")}`);

  /* A KIT PAGE (body `data-composition="kit"`): the industry page v4, drawn in the approved target's chapters and bands, not in zones. */
  const kit = !!document.querySelector('[data-composition="kit"]');
  return { sections, pageAccents, frontRepeats, looseNumerals, zoneSplits, zoneStarts, levelGaps, pairGaps, keptPads, sameForAll, falseLegends, wideDomains, kit };
};

const RULES = [
  /* E1's exemption is capped at ONE section per page, so it cannot be applied by
     the rule table, which sees one section at a time. It is applied below. */
  /* E1 on a kit page: not read. The industry page v4's cards carry the approved target's own sentences (his "Go" of 2026-10-21, after his
     "openly discussed the raw reality ... where does the margin come from", FOUNDER-VERDICTS 2026-10-21): the question, the figure's words
     and one note a card, 239 to 414 characters, which his word on the page sets over the 220 budget of 2026-08-25. `kit` is the card's page. */
  { key: "prose", rule: "E1", why: "over 220 characters of prose", test: (s) => s.prose > 220 && !s.editorial && !s.kit, show: (s) => `${s.prose} chars` },
  { key: "ink", rule: "E2", why: "under 60% ink coverage", test: (s) => s.inkPct < 60, show: (s) => `${s.inkPct}% ink of ${s.h}px` },
  { key: "accents", rule: "C2", why: "more than two accent marks", test: (s) => s.accents > 2, show: (s) => `${s.accents} accents` },
  { key: "nested", rule: "A5", why: "a bordered box inside the card", test: (s) => s.nestedBoxes > 0, show: (s) => `${s.nestedBoxes} nested` },
];

const pages = await eachPage(1440, collect, { opened: true });
const now = {};
let total = 0;

/* ONE PAGE'S FINDINGS, judged from one reading: each rule's count and its lines. Moved out of the loop unchanged but for the counts, which
   it returns instead of writing (plan 2026-10-13 country-page-journey, Task 1E), so the closed and the opened reading are judged alike. */
function judge(result) {
  const counts = {};
  const lines = [];
  /* ONE EDITORIAL SECTION PER PAGE. A page that declares two does not have an
     editorial section, it has a habit, so every one after the first is counted. */
  const editorials = result.sections.filter((x) => x.editorial);
  editorials.slice(1).forEach((x) => (x.editorial = false));
  for (const r of RULES) {
    const bad = result.sections.filter(r.test);
    counts[r.key] = bad.length;
    for (const s of bad) lines.push(`  ${r.rule}  ${r.why.padEnd(34)} ${r.show(s).padEnd(16)} "${s.label}"`);
  }
  /* THE PAGE BUDGET IS ITS SECTION COUNT, not a flat number. C1 asks every
     section to mark its answer, so a flat cap would force sections to stop doing
     that to satisfy a figure nobody chose for a reason. */
  const budget = result.sections.length;
  counts.pageAccents = result.pageAccents > budget ? 1 : 0;
  if (result.pageAccents > budget) lines.push(`  C2  ${String(result.pageAccents).padStart(2)} accent marks over ${budget} sections`);

  counts.wideDomain = result.wideDomains.length;
  for (const x of result.wideDomains) lines.push(`  G6  ${x}`);

  counts.falseLegend = result.falseLegends.length;
  for (const x of result.falseLegends) lines.push(`  C4  ${x}`);

  counts.sameForAll = result.sameForAll.length;
  for (const x of [...new Set(result.sameForAll)]) lines.push(`  H3  ${x}`);

  /* D6 AND D3 ON THE ZONES, judged in node from what the page measured (scripts/lib/zone_rhythm.mjs). */
  /* THE KIT PAGE IS EXEMPT FROM D3 AND D6, BY DESIGN AND WITH ITS REASON (the rule below: "a surface that draws no zone by design must be
     exempted here, with its reason"): the industry page v4 lays out the approved target's chapters and bands (his "Go" of 2026-10-21,
     FOUNDER-VERDICTS "The industry page (/industries/restaurants) v4 approved"; sheets/kit/kit.css: chapters 80 apart, pairs 20 apart,
     cards padded 28, two pairs of halves in a row in chapter 01), which his word on the page sets over DISTANCES 2.5's rungs and the zone
     rhythm. Every other rule of this gate reads it as any page. */
  if (result.kit) lines.push("  D3  D6  not read: a kit page draws the approved target's chapters, not zones (his v4 Go)");
  const ladder = result.kit ? [] : zoneLadder(result);
  const rhythm = result.kit ? [] : zoneRhythm(result.zoneSplits, result.zoneStarts);
  counts.ladder = ladder.length;
  for (const l of ladder) lines.push(`  D6  ${l}`);

  counts.rhythm = rhythm.length;
  for (const r of rhythm) lines.push(`  D3  ${r}`);

  counts.numerals = result.looseNumerals;
  if (result.looseNumerals) lines.push(`  F1  ${String(result.looseNumerals).padStart(2)} figure(s) without tabular numerals`);

  counts.frontRepeat = result.frontRepeats.length;
  for (const f of result.frontRepeats) lines.push(`  H4  repeated in the first screen         ${f}`);
  return { counts, lines };
}

for (const entry of pages) {
  /* The baseline is keyed by the page's OLD name (`key`); the line below prints the harness's name with the key beside it when they differ. */
  const { key: name, result } = entry;
  /* THE OPENED READING (plan 2026-10-13 country-page-journey, Task 1E; spec section 5): each rule judged on the page as it arrives and with
     every plus open; a rule's count is the larger of the two, and a finding only the open page makes is named so. */
  const closed = judge(result);
  const open = entry.openedResult ? judge(entry.openedResult) : { counts: {}, lines: [] };
  for (const k of new Set([...Object.keys(closed.counts), ...Object.keys(open.counts)])) {
    const v = Math.max(closed.counts[k] ?? 0, open.counts[k] ?? 0);
    now[`${name}:${k}`] = v;
    total += v;
  }
  const lines = [...closed.lines, ...open.lines.filter((l) => !closed.lines.includes(l)).map((l) => `${l}${OPENED}`)];
  console.log(`\n  ${nameWithKey(entry)}   ${lines.length} finding(s)`);
  lines.forEach((l) => console.log("   " + l));
}

console.log(`\n  ${total} art-direction finding(s) across ${pages.length} page(s).\n`);
for (const m of missing) console.log(missingLine(RULE, m));

/* A RENDER THAT DREW NO ZONE WAS NOT JUDGED (plan 2026-10-12 rhythm-air-inside, Task 1D; the plan's standing ruling: no gate may pass
   having read nothing). D3 and D6 find a level by `main [data-zone]`, so a render that holds none gave them nothing to judge, which is how
   the old reading went blind: it looked for a class no page carried. zoneRhythm already names it under the page; this stops the run, ahead
   of the baseline's write and its compare, so no baseline can absorb it and none can be written over it. EVERY RENDER THIS GATE READS IS A
   BAND PAGE (the nine surfaces of scripts/harness/pages.json each draw their levels with Zone: country, howto, city, cell, industry, hood,
   home, openings, calculator), so none is exempt; a surface that draws no zone by design must be exempted here, with its reason, when it joins that list. */
const unread = pages.filter((p) => !p.result.zoneSplits.length && !p.result.kit);
if (unread.length) {
  for (const p of unread) console.log(`x ${RULE} ${p.path}: ${NO_ZONE_READ}`);
  process.exit(1);
}

if (process.argv.includes("--write-baseline")) {
  /* The re-seed history is the record of every baseline raised with its
     reason (plan step 14b, 2026-09-17); a write keeps it, or the reasons vanish. */
  let history = null;
  try { history = JSON.parse(readFileSync(BASELINE, "utf8"))._reseed_history ?? null; } catch { /* first write */ }
  writeFileSync(BASELINE, JSON.stringify(history ? { ...now, _reseed_history: history } : now, null, 2) + "\n");
  console.log(`  wrote ${BASELINE}\n`);
  process.exit(0);
}
const base = JSON.parse(readFileSync(BASELINE, "utf8"));
const grew = Object.entries(now).filter(([k, v]) => v > (base[k] ?? 0));
if (grew.length) {
  console.log("x verify_art_direction: findings GREW. This baseline may only come DOWN.");
  grew.forEach(([k, v]) => console.log(`     ${k}: ${base[k] ?? 0} -> ${v}`));
  console.log("\n  The rules are in E:\\atlas\\design\\ART-DIRECTION.md, sections A, C, E and H.\n");
  process.exit(1);
}
if (missing.length) {
  console.log(`x verify_art_direction: ${missing.length} listed render(s) could not be read, so the findings above are of the pages that were.`);
  process.exit(1);
}
console.log("PASS verify_art_direction.\n");
