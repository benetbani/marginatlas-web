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
 *   - It reads the four BUILT London pages, not the live routes. A section that
 *     only renders for a different city is invisible to it.
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
 *
 * Usage: node scripts/verify_art_direction.mjs [--write-baseline]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { eachPage } from "./lib/measure_pages.mjs";

const BASELINE = "scripts/art_direction_baseline.json";

const collect = () => {
  /* The accent, as the tokens define it. Counted by computed colour rather than
     by class, because a class tells you what was WRITTEN and this asks what
     RENDERS. Declared inside the collector because this function is serialised
     into the page and cannot see anything from this file's scope. */
  const TERRA = ["rgb(251, 132, 105)", "rgb(194, 65, 12)"];
  const inDeadDetails = (e) => {
    const d = e.closest("details");
    return !!d && !d.open && !e.closest("summary");
  };
  const cards = [...document.querySelectorAll("div")].filter(
    (e) => getComputedStyle(e).backdropFilter !== "none",
  );
  const outer = cards.filter((c) => !cards.some((o) => o !== c && o.contains(c)));

  const sections = outer.map((c) => {
    const cb = c.getBoundingClientRect();

    /* E1, prose budget. Runs of 30+ characters carrying a space are sentences;
       a label, a figure and a unit are not. */
    let prose = 0;
    for (const e of c.querySelectorAll("*")) {
      if (inDeadDetails(e)) continue;
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
         violations. Cells are exempt; loose marks are not. */
      if (e.closest("td, th")) continue;
      const own = [...e.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim());
      const eb = e.getBoundingClientRect();
      if (eb.width < 1 || eb.height < 1) continue;
      if (!((own && TERRA.includes(s.color)) || TERRA.includes(s.backgroundColor))) continue;
      /* A HIGHLIGHTED ROW IS ONE MARK. The rank, the dot and the value that mark
         the lightest district sit at the two ends and the middle of one row, far
         further apart than any proximity test would collapse, and they mark ONE
         thing. Marks sharing a row are one mark. */
      const row = e.closest("li, tr, [role='row']");
      accentBoxes.push({ left: eb.left, top: eb.top, row });
    }
    const marks = [];
    for (const b of accentBoxes) {
      const near = marks.find(
        (m) =>
          (b.row && m.row === b.row) ||
          (Math.abs(m.left - b.left) < 24 && Math.abs(m.top - b.top) < 24),
      );
      if (near) { near.left = Math.min(near.left, b.left); near.top = Math.min(near.top, b.top); }
      else marks.push({ left: b.left, top: b.top, row: b.row });
    }
    const accents = marks.length;

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
    const marks = [...track.querySelectorAll("*")].filter((e) => {
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

  /* D6, THE SPACING LADDER. Chapter gap > band gap > card padding > slot gap, and
     no rung may equal or exceed the one outside it. Measured before this rule ran:
     the gap BETWEEN bands, the gap WITHIN a band and a card's own padding were all
     20px, so three of the four rungs were the same number and a reader had nothing
     telling them where one band ended and the next began.

     BLIND SPOT: the slot gap, the space between a card's own anatomy slots, is not
     measured here. It is set by utility classes on dozens of individual elements
     and picking one to stand for all of them would be a number pretending to be a
     measurement. The three outer rungs are the ones that carry the page's rhythm.

  /* D3, RHYTHM. No band repeats the split of the band immediately before it, and
     never three equal-halves bands in a row. A page of identical halves is as
     monotonous as a page of full widths, just narrower.

     Read from what each band RENDERS, not from what was written, so a split that
     silently fails to compile is caught as well as one that was typed twice.
     A band with one surviving child is skipped: its partner self-omitted, which
     is a data condition rather than a rhythm choice. */
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
      const texts = rows.map((r) => (cells(r, i).textContent || "").trim().replace(/\s+/g, " "));
      if (texts[0].length <= 3) continue;
      if (texts.every((t) => t === texts[0])) sameForAll.push(`${rows.length} rows all read "${texts[0].slice(0, 40)}"`);
    }
  }

  const ladder = [];
  const px = (v) => Math.round(parseFloat(v) || 0);
  const bandSplits = [];
  for (const el of document.querySelectorAll("div.grid")) {
    const cls = String(el.className);
    if (!/^mt-8 grid grid-cols-1 items-start gap-8/.test(cls)) continue;
    if (el.childElementCount < 2) continue;
    /* THE REAL SPLIT, NOT A CONDITIONAL VARIANT. The band's class also carries a
       has-only-child variant whose own md:grid-cols- token sits earlier in the
       string, and matching that made every lone-survivor band report the same
       split and fake a rhythm regression. Anchored to a space so only the
       unprefixed utility matches. */
    const m = cls.match(/(?:^|\s)md:grid-cols-(2|\[[^\]]+\])/);
    if (m) bandSplits.push(m[1]);
  }
  {
    const bandEls = [...document.querySelectorAll("div.grid")].filter((e) =>
      /^mt-8 grid grid-cols-1 items-start gap-8/.test(String(e.className)),
    );
    const bandGap = Math.max(0, ...bandEls.map((e) => px(getComputedStyle(e).marginTop)));
    const cardsAll = [...document.querySelectorAll("div")].filter(
      (e) => getComputedStyle(e).backdropFilter !== "none",
    );
    const outerCards = cardsAll.filter((c) => !cardsAll.some((o) => o !== c && o.contains(c)));
    const maxPad = Math.max(0, ...outerCards.map((e) => px(getComputedStyle(e).paddingTop)));
    let chapterGap = 0;
    for (const e of document.querySelectorAll("h2, h3, [data-movement]")) {
      const m = px(getComputedStyle(e).marginTop);
      if (m > chapterGap) chapterGap = m;
    }
    if (bandGap && maxPad) {
      if (chapterGap && chapterGap <= bandGap) ladder.push(`chapter gap ${chapterGap} is not larger than the band gap ${bandGap}`);
      if (bandGap <= maxPad) ladder.push(`band gap ${bandGap} is not larger than the largest card padding ${maxPad}`);
    }
  }

  const rhythm = [];
  for (let i = 1; i < bandSplits.length; i++) {
    if (bandSplits[i] === bandSplits[i - 1]) rhythm.push(`bands ${i} and ${i + 1} both split ${bandSplits[i]}`);
  }
  for (let i = 2; i < bandSplits.length; i++) {
    if (bandSplits[i] === "2" && bandSplits[i - 1] === "2" && bandSplits[i - 2] === "2") rhythm.push(`bands ${i - 1} to ${i + 1} are three equal halves in a row`);
  }

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
       marker doing its job. */
    if (/^sample$/i.test(own)) continue;
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

  return { sections, pageAccents, frontRepeats, looseNumerals, rhythm, ladder, sameForAll, falseLegends, wideDomains, bandCount: bandSplits.length };
};

const RULES = [
  /* E1's exemption is capped at ONE section per page, so it cannot be applied by
     the rule table, which sees one section at a time. It is applied below. */
  { key: "prose", rule: "E1", why: "over 220 characters of prose", test: (s) => s.prose > 220 && !s.editorial, show: (s) => `${s.prose} chars` },
  { key: "ink", rule: "E2", why: "under 60% ink coverage", test: (s) => s.inkPct < 60, show: (s) => `${s.inkPct}% ink of ${s.h}px` },
  { key: "accents", rule: "C2", why: "more than two accent marks", test: (s) => s.accents > 2, show: (s) => `${s.accents} accents` },
  { key: "nested", rule: "A5", why: "a bordered box inside the card", test: (s) => s.nestedBoxes > 0, show: (s) => `${s.nestedBoxes} nested` },
];

const pages = await eachPage(1440, collect);
const now = {};
let total = 0;

for (const { name, result } of pages) {
  const lines = [];
  /* ONE EDITORIAL SECTION PER PAGE. A page that declares two does not have an
     editorial section, it has a habit, so every one after the first is counted. */
  const editorials = result.sections.filter((x) => x.editorial);
  editorials.slice(1).forEach((x) => (x.editorial = false));
  for (const r of RULES) {
    const bad = result.sections.filter(r.test);
    now[`${name}:${r.key}`] = bad.length;
    total += bad.length;
    for (const s of bad) lines.push(`  ${r.rule}  ${r.why.padEnd(34)} ${r.show(s).padEnd(16)} "${s.label}"`);
  }
  /* THE PAGE BUDGET IS ITS SECTION COUNT, not a flat number. C1 asks every
     section to mark its answer, so a flat cap would force sections to stop doing
     that to satisfy a figure nobody chose for a reason. */
  const budget = result.sections.length;
  now[`${name}:pageAccents`] = result.pageAccents > budget ? 1 : 0;
  total += now[`${name}:pageAccents`];
  if (result.pageAccents > budget) lines.push(`  C2  ${String(result.pageAccents).padStart(2)} accent marks over ${budget} sections`);

  now[`${name}:wideDomain`] = result.wideDomains.length;
  total += result.wideDomains.length;
  for (const x of result.wideDomains) lines.push(`  G6  ${x}`);

  now[`${name}:falseLegend`] = result.falseLegends.length;
  total += result.falseLegends.length;
  for (const x of result.falseLegends) lines.push(`  C4  ${x}`);

  now[`${name}:sameForAll`] = result.sameForAll.length;
  total += result.sameForAll.length;
  for (const x of [...new Set(result.sameForAll)]) lines.push(`  H3  ${x}`);

  now[`${name}:ladder`] = result.ladder.length;
  total += result.ladder.length;
  for (const l of result.ladder) lines.push(`  D6  ${l}`);

  now[`${name}:rhythm`] = result.rhythm.length;
  total += result.rhythm.length;
  for (const r of result.rhythm) lines.push(`  D3  ${r}`);

  now[`${name}:numerals`] = result.looseNumerals;
  total += result.looseNumerals;
  if (result.looseNumerals) lines.push(`  F1  ${String(result.looseNumerals).padStart(2)} figure(s) without tabular numerals`);

  now[`${name}:frontRepeat`] = result.frontRepeats.length;
  total += result.frontRepeats.length;
  for (const f of result.frontRepeats) lines.push(`  H4  repeated in the first screen         ${f}`);

  console.log(`\n  ${name}   ${lines.length} finding(s)`);
  lines.forEach((l) => console.log("   " + l));
}

console.log(`\n  ${total} art-direction finding(s) across the four pages.\n`);

if (process.argv.includes("--write-baseline")) {
  writeFileSync(BASELINE, JSON.stringify(now, null, 2) + "\n");
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
console.log("PASS verify_art_direction.\n");
