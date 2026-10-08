/**
 * HOW FIGURES ARE MADE (plan 2026-10-08, home sections, section 4; his ideas of 2026-10-08, "the deep techniques used to derive
 * data", "unmatched archival capability" and "the global coverage", merged as the audit found them honest). Each technique shown
 * by a figure it produced, in two rows: the names matched and the London trade pages. No row counts countries and the home prints
 * no estimates line, so the global coverage is not built (his ruling of 2026-10-07: the home's 195 counter is wrong). The notices
 * and names counts come from data/home/method.json (the registers' failures table, by scripts/data/home/export_home.py); the
 * trade pages are counted from this repo's files.
 *
 * Holds the slice: it is its source's (scripts/lib/home_export.ts), a source this machine lacks ends the last line as deferred; the
 * manifest's row count is its content's (one); its counts nest (names matched within names, names within notices, the unmatched
 * notices within the notices); its source line is the register slice's own (data/uk/registers/failures.json), so the two name one
 * year of notices; and, where the failures table is on this machine, its four counts and its source line are the table's own, read
 * again.
 *
 * Holds the builder (src/lib/home/how_made.ts): the focal is the slice's notices; the names matched are the slice's, of its names;
 * the London trade pages are counted as their pages print them, never as the builder reads them: the trades whose page prints a
 * takings figure (tradeHeadFigure, which the page, its description and its share card read), of the London trade pages served
 * (the taxonomy's trade slugs that are not retired, the sitemap's list), at least the trades the UK page's money card ranks; no
 * row counts countries and the copy holds no countries row (his ruling of 2026-10-07: the home's 195 counter is wrong); every
 * figure stamped; the focal's line twelve words at most; each row's label three words at most and its note twelve, no semicolon; the
 * copy's checks name the copy.
 *
 * Holds the drawing (src/components/spine/home/HomeHowMade.tsx): a box with its id, the focal and its two ruled rows; quiet, no
 * accent; every figure stamped; no word of countries or of estimates anywhere in it (his ruling of 2026-10-07); one supporting line;
 * the door to About the figures; the title the copy's.
 *
 * Run: npx tsx tests/home/how_made.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { holdHomeExport, homePassLine } from "../../scripts/lib/home_export";
import { buildHowMade } from "../../src/lib/home/how_made";
import { londonTradeSales } from "../../src/lib/uk/registers/london_trade";
import { tradeHeadFigure } from "../../src/lib/spine/trade_head";
import { buildLondonTradeSales } from "../../src/lib/spine/country_depth_rows";
import { SLUG_TO_INDUSTRY } from "../../src/lib/taxonomy";
import { RETIRED } from "../../src/lib/taxonomy/retired";
import { COPY } from "../../src/lib/spine/copy";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HomeHowMade } from "../../src/components/spine/home/HomeHowMade";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-how-made";
const FILE = "data/home/method.json";
const REMEDY = "re-run python -P scripts/data/home/export_home.py method, never edit data/home by hand; then draw section 4 from the slice and the repo's own counts";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY }); };

/** A source table read as JSON. One that is cut off or damaged is a red of its own, with its path and the remedy, and null: the
 *  checks that need the table are skipped, so the gate ends on its summary and never on a SyntaxError stack. */
function readTable<T>(name: string, path: string): T | null {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    check(`the ${name} table reads as JSON`, false, { file: path, remedy: "restore the source file, then re-run the export" });
    return null;
  }
}

type Export = { notices: number; names: number; matched_names: number; unmatched_notices: number; source: string };

const held = holdHomeExport("method.json", check);
const d = (held?.data ?? null) as Export | null;
if (held && d) {
  check(`the manifest's rows are the slice's: one (${held.entry.rows})`, held.entry.rows === 1);
  check(`the counts nest: ${d.matched_names} names matched of ${d.names} names in ${d.notices} notices, ${d.unmatched_notices} notices unmatched`, [d.notices, d.names, d.matched_names, d.unmatched_notices].every((n) => Number.isInteger(n) && n >= 0) && d.notices > 0 && d.matched_names <= d.names && d.names <= d.notices && d.unmatched_notices <= d.notices);
  const failures = JSON.parse(readFileSync("data/uk/registers/failures.json", "utf8")) as { source: string };
  check("the notices are the year the failure rates were read from (the register slice's own source line)", d.source === failures.source, { file: "data/uk/registers/failures.json", remedy: "re-run registers/uk/export_for_site.py, then python -P scripts/data/home/export_home.py method, so both read one table" });

  /* THE TABLE, READ AGAIN, where it is on this machine. A machine without it is deferred by the holder, and its key ends the last line. */
  const src = held.entry.sources.find((s) => s.key === "failures");
  check("the manifest names the failures table the counts were read from (failures)", !!src);
  if (src && existsSync(src.path)) {
    const table = readTable<{ match?: Record<string, unknown>; source?: unknown }>("failures", src.path);
    if (table) {
      const differs = [...(["notices", "names", "matched_names", "unmatched_notices"] as const).filter((k) => table.match?.[k] !== d[k]), ...(table.source !== d.source ? ["source"] : [])];
      check(`the four counts and the source line are the table's own, read again here${differs.length ? `: differs on ${differs.join(", ")}` : ""}`, differs.length === 0);
    }
  }
}

/* THE BUILDER (plan Task 12). */
const COPY_FILE = "src/lib/spine/copy.ts";
const TRADES_AT = { file: "src/lib/home/how_made.ts", remedy: "count the London trade pages that print a takings figure (tradeHeadFigure) out of the pages served, the taxonomy's trade slugs that are not retired, the sitemap's list" };
const built = buildHowMade();
check("section 4 builds", !!built);
if (built && d) {
  const n = (v: number) => v.toLocaleString("en-US");
  check(`the focal is the slice's notices, ${built.notices.figure}`, built.notices.figure === n(d.notices) && built.notices.prov.src === "home/method.json:notices" && built.notices.prov.kind === "counted");
  const row = (key: string) => built.rows.find((r) => r.key === key);
  check(`the names matched are the slice's, of its names (${row("matched")?.value})`, row("matched")?.value === `${n(d.matched_names)} of ${n(d.names)}`);
  /* THE TRADE PAGES, HELD TO THE PAGES AND NOT TO THE BUILDER'S OWN PREDICATE. A London trade page prints a takings figure where its
     head gives a dollar one (tradeHeadFigure: the page, its description and its share card read it; a trade whose median falls in
     an open band prints an edge in words and gives none). The pages served are the sitemap's London list, every trade slug of the
     taxonomy that is not retired (src/app/sitemap.ts, src/lib/home/destination.ts). A gate cannot read that list from the sitemap:
     its module builds the database client on load and so needs the database address, which a gate never has. So the sitemap's
     rule is restated here from the taxonomy, as the routing gates restate it (tests/routing/edge_not_found.test.ts). */
  const served = Object.keys(SLUG_TO_INDUSTRY).filter((s) => !Object.hasOwn(RETIRED, s));
  const printing = served.filter((s) => tradeHeadFigure({ isLondon: true, slug: s })?.usd != null);
  const closed = served.filter((s) => londonTradeSales(s)?.q50.open === false);
  const apart = [...closed.filter((s) => !printing.includes(s)), ...printing.filter((s) => !closed.includes(s))];
  check(`the trades whose median falls in a closed band are exactly the pages that print a takings figure (${printing.length} of the ${served.length} served)${apart.length ? `; apart on ${apart.join(", ")}` : ""}`, apart.length === 0, TRADES_AT);
  check(`the London trade pages are counted as they print (${row("trades")?.value}; the UK page's money card ranks ${buildLondonTradeSales()?.rows.length} of them, one a code)`, row("trades")?.value === `${n(printing.length)} of ${n(served.length)}` && printing.length >= (buildLondonTradeSales()?.rows.length ?? Number.POSITIVE_INFINITY), TRADES_AT);
  check("no row counts countries (his ruling of 2026-10-07: the home's 195 counter is wrong)", !built.rows.some((r) => /countr/i.test(r.label)) && !Object.keys(COPY.home.howMade).includes("countries"), { file: COPY_FILE, remedy: "take the countries row and its words out of COPY.home.howMade; the home prints no count of countries (his ruling of 2026-10-07)" });
  check("every figure says where it came from", built.rows.every((r) => r.prov.src.length > 0 && r.prov.kind === "counted"));
  check("the door goes to About the figures", built.link.href === "/about-data" && built.link.label === COPY.home.howMade.link);
  const words = built.notices.words.split(/\s+/).filter(Boolean).length;
  check(`the focal's line is twelve words at most, no semicolon ("${built.notices.words}")`, words <= 12 && !built.notices.words.includes(";"), { file: COPY_FILE, remedy: "cut COPY.home.howMade.words to twelve words at most and no semicolon, the card's one supporting line" });
  /* THE ROWS' NOTES are drawn by FactRows, whose words the copy gate cannot see, so this is the only check on them. */
  check(`the title is four words at most, every row's label three and its note twelve at most with no semicolon ("${COPY.home.howMade.kicker}")`, COPY.home.howMade.kicker.split(/\s+/).length <= 4 && built.rows.every((r) => r.label.split(/\s+/).length <= 3 && r.note.split(/\s+/).length <= 12 && !r.note.includes(";")), { file: COPY_FILE, remedy: "cut COPY.home.howMade.kicker to four words at most, each row's label (COPY.home.howMade.matched.label, COPY.home.howMade.trades.label) to three, and each row's note (COPY.home.howMade.matched.note, COPY.home.howMade.trades.note) to twelve words with no semicolon" });
}

/* THE DRAWING (plan Task 14): quiet (no accent), the focal and two ruled rows, no count of countries and no estimates line, every
   figure stamped, one supporting line, the door to About the figures. A red here is the component's to put right (the slice and the
   counts are held above), so its finding names HomeHowMade and the law it is drawn by, and never the export. */
const DRAWN_AT = { file: "src/components/spine/home/HomeHowMade.tsx", remedy: "draw section 4 as HomeHowMade holds it, quiet with no accent, the focal and two ruled rows, no count of countries and no estimates line (his ruling of 2026-10-07), every figure stamped, one supporting line and the door to About the figures" };
if (built) {
  const html = renderToStaticMarkup(React.createElement(HomeHowMade, { how: built }));
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  check("the section is a box with its id, its figure and its rows", /id="how-made"/.test(html) && /data-archetype="fact-rows"/.test(html) && (html.match(/data-row="/g) ?? []).length === built.rows.length, DRAWN_AT);
  check("no figure in the accent (a quiet section)", !/(?:^|[\s"])text-\[var\(--terra-text\)\]/.test(html), DRAWN_AT);
  const figs = [...html.matchAll(/<[^>]+class="[^"]*\bfig\b[^"]*"[^>]*>/g)].map((m) => m[0]);
  check(`every figure says where it came from (${figs.length})`, figs.length === 1 + built.rows.length && figs.every((f) => /data-src="/.test(f) && /data-kind="counted"/.test(f)), DRAWN_AT);
  check("no count of countries and no estimates line, in any words (his ruling of 2026-10-07)", !/countr/i.test(text) && !/estimate/i.test(text), DRAWN_AT);
  check("one supporting line, the focal's", (html.match(/<p /g) ?? []).length === 1 && html.includes(built.notices.words), DRAWN_AT);
  check("the door to About the figures", html.includes(`href="${built.link.href}"`) && html.includes(built.link.label) && /tap-y/.test(html), DRAWN_AT);
  const title = /<h3[^>]*>([^<]*)<\/h3>/.exec(html)?.[1] ?? "";
  check(`the title is the copy's, four words at most ("${title}")`, title === COPY.home.howMade.kicker && title.split(/\s+/).length <= 4, DRAWN_AT);
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log(homePassLine("home/how_made", held));
