/**
 * scripts/verify_loud_seats.mjs , THE LEDGER AND THE RENDER AGREE (plan-
 * 2026-09-17/04-PAGES.md step 40, 2026-09-19; MODEL.md PART 6, "three loud
 * moments or fewer, two quiet cards between loud ones", and PART 8's "THE
 * THREE LOUD MOMENTS" seat tables on 8.2, 8.3, 8.6, 8.7 and 8.8; his ruling
 * that a page carries three loud moments or fewer).
 *
 * WHAT IT ASSERTS. For every render in scripts/harness/pages.json (the chain's
 * own, written first by the `pages-fresh` gate; scripts/lib/page_renders.mjs),
 * the page's declared loud seats (`export const LOUD_SEATS` in the surface's
 * view, read off the source by scripts/lib/loud_seats.ts, the census's own
 * reader) and the page filter's measured accent count agree, card by card, at
 * the widest width:
 *   (a) every seat declared LIT carries exactly one accent figure in its card
 *       (text in `--terra-text`, counted by the page filter's own walk,
 *       scripts/lib/accent_walk.mjs, one function for both), or the card
 *       stands in a WITHHELD state by the archetypes' own markers (an
 *       AnswerCard's data-state="no-answer", a BentoMetric's
 *       data-withheld-line="focal", PayBars' data-withheld="1", a drawn
 *       blocked seat's data-blocked), which is the model's own "LIT where
 *       held or baseline; UNLIT where withheld", and the line says so;
 *   (b) every measured accent sits in the card of a seat declared LIT: an
 *       accent in a seat declared HELD EMPTY or NO HONEST CANDIDATE, or in a
 *       card no seat names, is a stray and is named;
 *   (c) the declarations parse: six pages, seats 1 to 3 once each, the three
 *       states, every LIT seat naming a card id; and the reader's vocabulary
 *       equals the type module's (src/lib/spine/loud_seats.ts).
 * So the ledger's LIT count and the measured count agree on every render, or
 * this gate reds and names the card. A missing accent is never read as
 * withheld on a card that prints its figure; a withheld card is never read
 * as lit.
 *
 * WHY IT MEASURES ITSELF AND DOES NOT READ THE FILTER'S FILE. The filter
 * writes scratchpad/harness/accents.json on every run, but in the chain's
 * pool the filter and this gate run at once, so a read of that file would
 * race its write and hold the page to the previous run's count. This gate
 * opens the same fresh renders with the same in-page function. One browser,
 * one width (1280, the filter's ACCENT BUDGET width), eight pages.
 *
 * WHY .mjs: under tsx a .ts entry runs as CommonJS and esbuild wraps the
 * walk's inner functions in `__name` helpers that do not exist inside the
 * page (page.evaluate serialises the function's source); an .mjs entry runs
 * as ESM and the walk arrives in the page as written. It imports the reader
 * (.ts) the way verify_country_seed_confidence.mjs imports strip_comments,
 * so it runs under tsx, the chain's runner, and not under plain node.
 *
 * WHAT IT PRINTS: one line per render (declared LIT, withheld on this render,
 * measured, and the verdict), the seats and the accents by card, written also
 * to scratchpad/harness/loud_seats.txt; then the reds in the one shape, or
 * the ok line with the counts.
 *
 * BLIND SPOT: a bento cluster's withheld marker is read at the cluster (its
 * cells carry no id), so a neighbour cell withheld beside a lit cell that
 * lost its colour would read as withheld; the clusters draw every cell on
 * every page today and BentoMetric throws on a cell with neither a figure
 * nor a line. It reads renders, not the site: a surface not in pages.json is
 * not measured, and the census's coverage gate is what puts a page there.
 *
 * Planted twice on 2026-09-19 and watched red: a seat declared LIT that is
 * not lit (the country's `12 money` flipped to LIT: "declared LIT and carries
 * no accent figure ... and the card is not withheld", on GB, where the card
 * is drawn), and a lit figure not declared (the country's customers strip
 * typical in the accent, re-rendered: "a lit figure not declared ...
 * #customers"). Unplanted the same hour.
 *
 * Usage: npx tsx scripts/verify_loud_seats.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { requireBrowser } from "./lib/local_only.mjs";
import { pageRenders, describeRenders, missingLine } from "./lib/page_renders.mjs";
import { red, redSummary } from "./lib/red.mjs";
import { accentWalk } from "./lib/accent_walk.mjs";
import { readLoudSeats, litCount, loudCardId, LOUD_STATES as READER_STATES } from "./lib/loud_seats.ts";
import { LOUD_STATES } from "../src/lib/spine/loud_seats.ts";

const RULE = "loud-seats";
const WIDTH = 1280;
const OUT = "scratchpad/harness/loud_seats.txt";
const MODULE = "src/lib/spine/loud_seats.ts";

const reds = [];
const lines = [];
const say = (s) => { lines.push(s); console.log(s); };

/* (c) THE TWO VOCABULARIES ARE ONE, asserted before anything is read. */
if (LOUD_STATES.length !== READER_STATES.length || LOUD_STATES.some((s, i) => s !== READER_STATES[i])) {
  red({ rule: RULE, file: "scripts/lib/loud_seats.ts", detail: `LOUD_STATES reads ${JSON.stringify(READER_STATES)} against ${MODULE}'s ${JSON.stringify(LOUD_STATES)}`, remedy: "make the reader's literal copy equal to the type module's" });
  process.exit(1);
}

/* THE DECLARATIONS, off the views' source. */
const declared = readLoudSeats();
for (const f of declared.faults) {
  const m = /^(.+?):(\d+): (.*)$/.exec(f);
  reds.push({ file: m ? m[1] : "src/components/spine", line: m ? Number(m[2]) : undefined, detail: m ? m[3] : f, remedy: "declare the page's three seats as literals in its view, MODEL.md PART 8's seat table for it" });
}
if (reds.length) {
  for (const r of reds) red({ rule: RULE, ...r });
  redSummary(RULE, reds.length, "fix the declarations above; nothing was measured", "the views' LOUD_SEATS");
  process.exit(1);
}

/* A BUILD SERVER HAS NO BROWSER: skip loudly there, as every browser gate does. */
await requireBrowser(RULE, "whether every render's accent figures are the seats its view declares LIT (MODEL.md PART 8's seat tables)");

const ENTRIES = pageRenders({ kinds: ["fresh"] });
say(`  ${describeRenders(ENTRIES, RULE)}`);
const PRESENT = ENTRIES.filter((e) => e.exists);
const MISSING = ENTRIES.filter((e) => !e.exists);
for (const m of MISSING) { say(missingLine(RULE, m)); reds.push({ file: m.path, detail: `no fresh render of ${m.name}, so its seats were not measured`, remedy: "run npx tsx scripts/verify_pages_fresh.mjs and fix what it names" }); }

const browser = await chromium.launch();
let measuredTotal = 0, litTotal = 0, withheldTotal = 0;
for (const entry of PRESENT) {
  const d = declared.declarations.get(entry.surface);
  if (!d) { reds.push({ file: entry.path, detail: `the render's surface "${entry.surface}" has no declaration`, remedy: "the surface's view exports LOUD_SEATS" }); continue; }
  const ids = d.seats.map((s) => loudCardId(s)).filter((s) => s != null);
  const ctx = await browser.newContext({ viewport: { width: WIDTH, height: 1200 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto(pathToFileURL(resolve(entry.path)).href, { waitUntil: "load" });
  await p.evaluate(() => document.fonts && document.fonts.ready);
  const walk = await p.evaluate(accentWalk, { ids });
  await ctx.close();
  const where = `${entry.name} (${entry.path})`;
  if (!walk.accentReadable) {
    reds.push({ file: entry.path, detail: `ACCENT UNREADABLE on ${entry.name}: the accent token does not resolve in this render, so its seats cannot be held to the ledger`, remedy: "read the page filter's ACCENT UNREADABLE line; the stylesheet or the token is missing from the render" });
    say(`${entry.name}: accent token unreadable; not measured`);
    continue;
  }
  const byCard = new Map();
  for (const a of walk.accents) byCard.set(a.card, [...(byCard.get(a.card) ?? []), a.text]);
  const litSeats = d.seats.filter((s) => s.state === "LIT");
  const litIds = new Set(litSeats.map((s) => loudCardId(s)));
  let withheld = 0;
  const seatLines = [];
  /* (a) every LIT seat: one accent, or withheld by the render's own markers. */
  for (const s of litSeats) {
    const id = loudCardId(s);
    const card = walk.cards[id];
    const n = byCard.get(id)?.length ?? 0;
    const label = `seat ${s.seat} ${s.card} (#${id})`;
    if (!card || !card.present) { reds.push({ file: d.file, line: d.line, detail: `${label} is declared LIT and the card is not on the render ${where}`, remedy: "draw the card, or correct the declaration's card id" }); seatLines.push(`  ${label}: LIT declared, card absent`); continue; }
    if (n === 1) { seatLines.push(`  ${label}: LIT, lit (${byCard.get(id)[0]})`); continue; }
    if (n === 0 && card.withheld) { withheld++; seatLines.push(`  ${label}: LIT declared, withheld on this render (the card's own state marker), unlit`); continue; }
    if (n === 0) { reds.push({ file: d.file, line: d.line, detail: `${label} is declared LIT and carries no accent figure on ${where}, and the card is not withheld`, remedy: "light the figure in the view (--terra-text on the seat's figure), or correct the declaration's state and condition" }); seatLines.push(`  ${label}: LIT declared, NOT LIT`); continue; }
    reds.push({ file: d.file, line: d.line, detail: `${label} carries ${n} accent figures on ${where} (${byCard.get(id).join("; ")}); a seat is one figure`, remedy: "one figure in the accent per card; the rest to ink" });
    seatLines.push(`  ${label}: LIT declared, ${n} accents`);
  }
  for (const s of d.seats.filter((x) => x.state !== "LIT")) seatLines.push(`  seat ${s.seat} ${s.card}: ${s.state}`);
  /* (b) every accent sits in a LIT seat's card. */
  for (const [card, texts] of byCard) {
    if (litIds.has(card)) continue;
    const held = d.seats.find((s) => s.state !== "LIT" && loudCardId(s) === card);
    if (held) reds.push({ file: d.file, line: d.line, detail: `seat ${held.seat} ${held.card} (#${card}) is declared ${held.state} and carries an accent on ${where} (${texts.join("; ")})`, remedy: "the seat's figure to ink until its condition is met, or declare it LIT with the condition" });
    else reds.push({ file: d.file, line: d.line, detail: `a lit figure not declared on ${where}: #${card}: ${texts.join("; ")}`, remedy: "that figure to ink (PART 6: anything terracotta not on the list goes to ink), or declare the seat if the model names it" });
    seatLines.push(`  #${card}: accent NOT DECLARED (${texts.join("; ")})`);
  }
  const litDeclared = litCount(d.seats);
  const measured = walk.accents.length;
  const agree = measured === litDeclared - withheld && [...byCard.keys()].every((c) => litIds.has(c)) && [...byCard.values()].every((t) => t.length === 1);
  say(`${entry.name}: declared LIT ${litDeclared} of 3, withheld on this render ${withheld}, measured ${measured}: ${agree ? "agree" : "DISAGREE"}`);
  for (const l of seatLines) say(l);
  measuredTotal += measured; litTotal += litDeclared; withheldTotal += withheld;
}
await browser.close();

mkdirSync("scratchpad/harness", { recursive: true });
writeFileSync(OUT, lines.join("\n") + "\n", "utf8");

if (reds.length) {
  for (const r of reds) red({ rule: RULE, ...r });
  redSummary(RULE, reds.length, `every render's accent figures are the seats its view declares LIT and nothing else (MODEL.md PART 8's seat tables; ${MODULE})`, `${PRESENT.length} renders at ${WIDTH}, ${measuredTotal} accents against ${litTotal} declared LIT less ${withheldTotal} withheld`);
  process.exit(1);
}
console.log(`ok ${RULE}: ${PRESENT.length} renders at ${WIDTH}, ${measuredTotal} accent figures, every one a seat declared LIT and every LIT seat lit or withheld (${litTotal} declared LIT, ${withheldTotal} withheld on these renders)`);
