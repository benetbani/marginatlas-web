/**
 * THE TERRACOTTA BAND, "READ FROM THE RECORD" (plan docs/superpowers/plans/2026-10-10-home-reform, Task 5; the spec
 * docs/superpowers/specs/2026-10-10-home-reform-design.md, decision 7 and sections 1, 5 and 6, and its critique, section 4). His request
 * of 2026-10-10: "add 1 section in terracotta background to signify some stats for the site". The home's four evidence counts, each
 * recomputed here from its own source and never from the builder's own reading: the official datasets the UK pages print from (the
 * items of the sources list's publishers classed `official`, the coordinator's ruling of 2026-10-10; a publisher with no class is a
 * red), the law's finite values for 2026-27, the London trade pages that print a takings figure (as the page prints it,
 * tradeHeadFigure) and the trades with a publishable UK failure rate (read straight from data/uk/registers/failures.json), the two trade
 * counts against the trade pages served; the month from the register slices' build day. Holds the builder (src/lib/home/site_counts.ts):
 * each count stamped counted, the band drawn with all four counts and nothing with fewer, today's counts as a tripwire. Holds the
 * drawing (src/components/spine/home/HomeRecord.tsx): a zone and never a card, its four figures at 30 and stamped, the trades' two with
 * their pages served, ink on the terracotta and no grey, its heading of four words and its one line. Fails on a count typed into either
 * file or a number typed into the band's words, on a slot or ledger count, and on a count of countries, cities or the trade list. Reads the home's render,
 * scratchpad/harness/pages/home-gb.html, where the harness wrote it, and defers those checks where it did not (a build server).
 *
 * Run: npx tsx tests/home/site_counts.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { buildSiteCounts, siteCountsFrom, registerMonth, SITE_COUNTS_MIN, type SiteCount } from "../../src/lib/home/site_counts";
import { HomeRecord } from "../../src/components/spine/home/HomeRecord";
import { UK_SOURCES, WORLD_SOURCES } from "../../src/lib/spine/uk_sources";
import { UK_2026_27 } from "../../src/lib/uk/law/params_2026_27";
import { londonPagesRead } from "../../src/lib/home/how_made";
import { tradeHeadFigure } from "../../src/lib/spine/trade_head";
import { REGISTER_BUILT } from "../../src/lib/spine/checked";
import { SLUG_TO_INDUSTRY } from "../../src/lib/taxonomy";
import { RETIRED } from "../../src/lib/taxonomy/retired";
import { COPY } from "../../src/lib/spine/copy";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "site-counts";
const BUILDER = "src/lib/home/site_counts.ts";
const DRAWING = "src/components/spine/home/HomeRecord.tsx";
const REMEDY = "build the band's four counts in src/lib/home/site_counts.ts from their sources, each stamped counted, and draw them in HomeRecord.tsx as the critique's section 4 holds them";
let failed = 0;
let deferred = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? BUILDER, detail: label, remedy: at?.remedy ?? REMEDY }); };
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
/** A string as React writes it into markup. */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
const reEsc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const C = COPY.home.record;

/* TODAY'S COUNTS, read by a scratch script outside the repo on 2026-10-10 at website 51cc3b8b before this file was written (the
   critique's section 4 printed the last three; its 36 datasets hold the 32 official ones and 4 that are not): a tripwire, so a count
   that moves is read by a person before the home prints it. A count that moved with its source is set here; the builder is never
   edited to meet this. The four publishers that are not official today, by key, are the same kind of pin. */
const TODAY = { sources: 32, laws: 68, sales: 111, failures: 117, served: 138, month: "October 2026" };
const NOT_OFFICIAL_TODAY = ["ukfinance", "brc", "worldpanel", "sellers"];

/* THE CLASS OF EVERY PUBLISHER (the coordinator's ruling of 2026-10-10: the label "Official datasets" counts the official ones): each
   entry of both lists says `official`, true for a public body (a department, an agency, a regulator, a public corporation, the official
   record), false for a trade body, a commercial panel or a seller's own page. A publisher with no class is a red. */
const unclassed = [...UK_SOURCES, ...WORLD_SOURCES].filter((s) => typeof (s as { official?: unknown }).official !== "boolean").map((s) => s.key);
check(`every publisher is classed official or not (${UK_SOURCES.length} in the UK list, ${WORLD_SOURCES.length} outside it)${unclassed.length ? `; no class: ${unclassed.join(", ")}` : ""}`, unclassed.length === 0, { file: "src/lib/spine/uk_sources.ts", remedy: "give every entry of UK_SOURCES and WORLD_SOURCES official: true (a public body: a department, an agency, a regulator, a public corporation, the official record) or official: false (a trade body, a commercial panel, a seller's own page)" });
/* Both lists sorted before they are compared: the pin is the set of four, not the order the sources list happens to stand in. */
const notOfficial = UK_SOURCES.filter((s) => s.official === false).map((s) => s.key).sort();
check(`the publishers that are not official are today's four (${notOfficial.join(", ") || "none"})`, JSON.stringify(notOfficial) === JSON.stringify([...NOT_OFFICIAL_TODAY].sort()), { file: "tests/home/site_counts.test.ts", remedy: "a publisher's class changed, or one was added: confirm it in src/lib/spine/uk_sources.ts (true only for a public body), then set NOT_OFFICIAL_TODAY here" });

/* THE SOURCES, READ AGAIN HERE. 1. The official datasets: every item of a publisher classed official, distinct by title; the items of
   the publishers that are not, and the list of the sources outside the UK, are not among them. */
const items = UK_SOURCES.filter((s) => s.official === true).flatMap((s) => s.items);
const titles = new Set(items.map((i) => i.title));
const other = UK_SOURCES.filter((s) => s.official !== true).flatMap((s) => s.items).length;
const world = WORLD_SOURCES.flatMap((s) => s.items).length;
/* 2. The law's values: every finite number in the year's parameters, walked here again; an open top band (Infinity) is a bound. */
let finite = 0;
let open = 0;
const walk = (v: unknown): void => {
  if (typeof v === "number") { if (Number.isFinite(v)) finite++; else open++; return; }
  if (Array.isArray(v)) { v.forEach(walk); return; }
  if (v !== null && typeof v === "object") Object.values(v as Record<string, unknown>).forEach(walk);
};
walk(UK_2026_27);
/* 3 and 4. The trade pages served, restated from the taxonomy as the routing gates restate it; a takings figure as the London page
   prints it (tradeHeadFigure, tests/home/how_made.test.ts's own reading); a failure rate as the slice holds it, publishable and real. */
const served = Object.keys(SLUG_TO_INDUSTRY).filter((s) => !Object.hasOwn(RETIRED, s));
const sales = served.filter((s) => tradeHeadFigure({ isLondon: true, slug: s })?.usd != null).length;
type FailuresFile = { trades?: Record<string, { uk_rate?: { value?: unknown; publishable?: unknown } }> };
const failuresFile = JSON.parse(readFileSync("data/uk/registers/failures.json", "utf8")) as FailuresFile;
const failures = served.filter((s) => {
  const r = failuresFile.trades?.[s]?.uk_rate;
  return !!r && r.publishable === true && typeof r.value === "number" && Number.isFinite(r.value) && r.value >= 0;
}).length;
/* The month: the register slices' build day, as the band's line writes it. */
const month = REGISTER_BUILT ? new Date(`${REGISTER_BUILT}T00:00:00Z`).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }) : null;

/* THE BUILDER. */
const built = buildSiteCounts();
check(`the band builds: four counts and the month (${built ? `${built.counts.length} counts, ${built.month}` : "nothing"})`, !!built && built.counts.length === 4 && !!built.month);
const counts: SiteCount[] = built?.counts ?? [];
const by = (k: string) => counts.find((c) => c.key === k) ?? null;
const S = by("sources"), L = by("laws"), T = by("sales"), F = by("failures");
check(`the official datasets are the official publishers' items, ${items.length}, each distinct; the ${other} of publishers that are not official and the ${world} outside the UK are not among them (built: ${S?.figure ?? "none"})`, !!S && S.value === items.length && titles.size === items.length && S.figure === items.length.toLocaleString("en-US"));
check(`the law's values are its finite numbers, ${finite}, the ${open} open top bands left out (built: ${L?.figure ?? "none"})`, !!L && L.value === finite && L.figure === finite.toLocaleString("en-US"));
check(`the London trade pages that print a takings figure, ${sales} of the ${served.length} served (built: ${T ? `${T.figure} of ${T.of?.figure ?? "none"}` : "none"})`, !!T && T.value === sales && T.of?.value === served.length && londonPagesRead()?.printing === sales);
check(`the trades with a publishable UK failure rate, ${failures} of the ${served.length} served (built: ${F ? `${F.figure} of ${F.of?.figure ?? "none"}` : "none"})`, !!F && F.value === failures && F.of?.value === served.length);
check(`the month is the register slices' build month, ${month ?? "none"} (built: ${built?.month ?? "none"})`, !!month && built?.month === month && registerMonth() === month);
const now: Record<keyof typeof TODAY, string | number | undefined> = { sources: S?.value, laws: L?.value, sales: T?.value, failures: F?.value, served: T?.of?.value, month: built?.month };
const moved = (Object.keys(TODAY) as Array<keyof typeof TODAY>).filter((k) => now[k] !== TODAY[k]);
check(`the band prints today's counts (${moved.length ? moved.map((k) => `${k} ${String(now[k])} against ${TODAY[k]}`).join(", ") : `${TODAY.sources}, ${TODAY.laws}, ${TODAY.sales} of ${TODAY.served}, ${TODAY.failures} of ${TODAY.served}, ${TODAY.month}`})`, moved.length === 0, { file: "tests/home/site_counts.test.ts", remedy: "a count moved with its source: read the change (git log on the source the checks above name), then set TODAY in tests/home/site_counts.test.ts to the new count; never edit the builder to meet TODAY" });

/* EVERY COUNT STAMPED, AND ONLY THE FOUR. */
const SRC: Record<string, RegExp> = { sources: /^lib\/spine\/uk_sources\.ts:/, laws: /^lib\/uk\/law\/params_2026_27\.ts:/, sales: /^uk\/registers\/turnover\.json:/, failures: /^uk\/registers\/failures\.json:/ };
check(`every count is stamped counted from its own source (${counts.map((c) => `${c.key}: ${c.prov.src}`).join("; ") || "none"})`, counts.length === 4 && counts.every((c) => c.prov.kind === "counted" && (SRC[c.key]?.test(c.prov.src) ?? false)));
check(`the band's counts are the four named, in its order (${counts.map((c) => c.key).join(", ") || "none"})`, JSON.stringify(counts.map((c) => c.key)) === JSON.stringify(["sources", "laws", "sales", "failures"]));
check("only the two trade counts carry the pages served, each stamped counted, and no figure is the served list itself", counts.filter((c) => c.of).map((c) => c.key).join(",") === "sales,failures" && counts.every((c) => !c.of || (c.of.prov.kind === "counted" && c.of.prov.src.startsWith("lib/taxonomy:"))) && counts.every((c) => c.value !== served.length), { remedy: "a trade count stands against the pages served; the served list is never a figure of its own (his ruling of 2026-10-07)" });
const first = counts[0] ?? null;
/* ALL FOUR OR NO BAND (the closing cleanup of plan 2026-10-10, item 18). The band was allowed to draw with three counts, a layout nothing
   tested and nothing ever drew; a count whose source fails now draws no band, so the row is always four siblings and a visitor is never
   shown a band with a figure missing. */
check(`the band draws with all ${SITE_COUNTS_MIN} counts and nothing with fewer, or with no month`, !!first && SITE_COUNTS_MIN === 4 && [0, 1, 2, 3].every((missing) => siteCountsFrom([first, first, first, first].map((c, i) => (i === missing ? null : c)), "m") === null) && siteCountsFrom([first, first, first, first], "m")?.counts.length === 4 && siteCountsFrom([first, first, first, first], null) === null, { remedy: "SITE_COUNTS_MIN is 4 in src/lib/home/site_counts.ts: a band with a count missing is not drawn" });

/* NOTHING TYPED, NO SLOT, NO LIST COUNT (the plan's Global Constraints: every figure from its builder, never typed; counts are
   evidence, never allocated slots; no country, city or trade-list count on the home). Comments stripped; a size class such as
   `w-36` is a size, not a count. */
const codeOf = (file: string) => stripCommentLines(readFileSync(file, "utf8").replace(/\r/g, "").replace(/\{\s*\/\*(?:(?!\*\/)[\s\S])*\*\/\s*\}/g, "").split("\n")).join("\n");
const values = [...new Set([items.length, finite, sales, failures, served.length])];
for (const file of [BUILDER, DRAWING]) {
  const code = codeOf(file);
  const typed = values.filter((v) => new RegExp(`(?<![\\w.\\-\\[])${v}(?![\\w.])`).test(code));
  check(`${file} types none of the counts ${values.join(", ")} (${typed.join(", ") || "none typed"})`, typed.length === 0, { file, remedy: "read every count from its builder (src/lib/home/site_counts.ts), never write it" });
}
/* THE BAND'S WORDS TYPE NO NUMBER EITHER (the closing cleanup of plan 2026-10-10, item 16). The heading, the line, the word before a
   page count and the four labels live in COPY.home.record, which the loop above does not read, so a count typed into them (the line
   "117 trades", a label "32 datasets") passed. The line's {month} is the register slices' build month, filled from the builder when
   the band draws; the words themselves hold no digit at all. */
const copyWords = JSON.stringify(COPY.home.record).replace("{month}", "");
const copyDigits = copyWords.match(/\d+/g) ?? [];
check(`the band's words (COPY.home.record, less its {month}) type no number (${copyDigits.join(", ") || "none typed"}; the counts are ${values.join(", ")})`, copyDigits.length === 0, { file: "src/lib/spine/copy.ts", remedy: "write the band's words without a number: every count comes from src/lib/home/site_counts.ts and the month fills {month} when the band draws" });
const builderCode = codeOf(BUILDER);
/* ONE LIST OF THE TRADES SERVED: the builder takes it from the London takings count's own reading (how_made.ts), as the sales count does,
   instead of walking the taxonomy a second time. */
check("the builder takes the trade pages served from how_made.ts (servedTrades) and does not walk the taxonomy itself", /import\s*\{[^}]*\bservedTrades\b[^}]*\}\s*from\s*"@\/lib\/home\/how_made"/.test(builderCode) && !/\bSLUG_TO_INDUSTRY\b|\bRETIRED\b/.test(builderCode), { remedy: "export servedTrades from src/lib/home/how_made.ts (londonPagesRead reads it too) and import it in src/lib/home/site_counts.ts" });
const LIST_WORDS =["regional_cells", "extrapolated_cells", "coverage", "atlas_ledger", "getAtlasLedger", "COUNTRIES", "countriesTotal", "city_list", "buildCityCards"];
const listReads = LIST_WORDS.filter((w) => new RegExp(`\\b${w}\\b`).test(builderCode));
check(`the builder reads no slot, ledger, country or city list (${listReads.join(", ") || "none"})`, listReads.length === 0, { remedy: "count records the UK pages read or pages that print a figure (critique section 4), never cells, slots, countries, cities or the trade list" });
const drawingCode = codeOf(DRAWING);
check("the drawing builds nothing of its own: it draws the counts it is handed", !/\bbuild[A-Z]\w*\(/.test(drawingCode) && /from "@\/lib\/home\/site_counts"/.test(drawingCode), { file: DRAWING, remedy: "HomeRecord draws the SiteCounts it is handed; home-view.tsx calls buildSiteCounts" });

/* THE COPY (the plan's copy rules): a heading of four words, one line of twelve at most and no semicolon, labels of four. */
const line = month ? C.line.replace("{month}", month) : "";
check(`the heading "${C.title}" is four words at most, the line "${line}" twelve at most with no semicolon, every label four at most`, words(C.title) <= 4 && !!line && words(line) <= 12 && !line.includes(";") && Object.values(C.labels).every((l) => words(l) <= 4), { file: "src/lib/spine/copy.ts", remedy: "COPY.home.record: a heading of four words, one line of twelve, labels of four" });

/* THE DRAWING, as HomeRecord writes it and, where the harness wrote it, as the home's render carries it. */
const GREYS = ["--c-ink2", "--c-muted", "--terra-text", "text-ink-", "text-cocoa-", "text-atlas-", "text-white", "text-gray-"];
function holdBand(where: string, band: string): void {
  const at = { file: DRAWING, remedy: "draw the band as HomeRecord holds it (critique section 4): a wide zone on the terracotta tone, its heading and line in ink, the four counts as a list of pairs, each figure through Fig with its stamp" };
  check(`${where}: a wide zone on the terracotta tone, one level and one cell, never a card`, /^<section data-zone="wide" data-tone="terra" data-zone-label="[^"]+" id="record" aria-labelledby="record-title">/.test(band) && band.includes('<div data-zone-level="" class="grid grid-cols-1"><div data-zone-cell="" class="min-w-0">') && !/data-card|data-block|spine-card|data-keep-card/.test(band), at);
  const head = /<h2 id="record-title"[^>]*>([^<]*)<\/h2>/.exec(band)?.[1] ?? "";
  check(`${where}: its heading is "${C.title}" at 20 on 28, four words (read: "${head}")`, head === esc(C.title) && words(head) <= 4 && /<h2 id="record-title"[^>]*--t-head[^>]*leading-7/.test(band), at);
  check(`${where}: its one line, "${line}"`, !!line && band.includes(`>${esc(line)}</p>`) && (band.match(/<p /g) ?? []).length === 1, at);
  const cells = [...band.matchAll(/<div data-count="([a-z]+)" class="([^"]*)">([\s\S]*?)<\/dd><\/div>/g)];
  check(`${where}: ${cells.length} pairs in a list of sibling figures, each the label first to a reader and the figure first to the eye`, /<dl data-sibling-figures=""/.test(band) && cells.length === counts.length && cells.every((c) => /\bflex-col-reverse\b/.test(c[2]) && c[3].indexOf("<dt") > -1 && c[3].indexOf("<dt") < c[3].indexOf("<dd")), at);
  for (const c of counts) {
    const cell = cells.find((x) => x[1] === c.key)?.[3] ?? "";
    const fig = new RegExp(`<span class="fig text-\\[length:var\\(--t-focal\\)\\] leading-none" data-src="${reEsc(esc(c.prov.src))}" data-kind="counted">${reEsc(c.figure)}</span>`).test(cell);
    const label = cell.includes(`>${esc(C.labels[c.key])}</dt>`);
    const of = c.of ? new RegExp(`<span data-of="" class="[^"]*--t-lead[^"]*"> ${reEsc(C.of)} <span class="fig " data-src="${reEsc(esc(c.of.prov.src))}" data-kind="counted">${reEsc(c.of.figure)}</span></span>`).test(cell) : !cell.includes("data-of");
    check(`${where}: ${c.key} prints ${c.figure}${c.of ? ` ${C.of} ${c.of.figure}` : ""} at 30, stamped counted, under "${C.labels[c.key]}"`, fig && label && of, at);
  }
  const grey = GREYS.filter((g) => band.includes(g));
  check(`${where}: ink on the terracotta, no grey and no red text (${grey.join(", ") || "none"})`, grey.length === 0 && (band.match(/text-\[var\(--c-ink\)\]/g) ?? []).length >= 2 + 2 * counts.length && !band.includes("--t-answer"), at);
  check(`${where}: its rules are the band's own`, band.includes("border-[var(--band-rule)]") && !/border-\[var\(--c-(?:border|line-strong)\)\]/.test(band), at);
}
if (built) holdBand("the drawing", renderToStaticMarkup(React.createElement(HomeRecord, { record: built })));

const render = existsSync("scratchpad/harness/pages/home-gb.html") ? readFileSync("scratchpad/harness/pages/home-gb.html", "utf8") : "";
if (render) {
  const from = render.indexOf('<section data-zone="wide" data-tone="terra"');
  const next = from < 0 ? -1 : render.indexOf("<section data-zone", from + 1);
  const band = from < 0 ? "" : render.slice(from, next < 0 ? undefined : next);
  const proofsAt = render.indexOf(`data-zone-label="${esc(COPY.home.proofs.label)}"`);
  const footAt = render.indexOf(`data-zone-label="${esc(COPY.home.citiesLabel)}"`);
  check("the home's render draws the band once, after the proofs and before the foot", from > 0 && (render.match(/data-tone="terra"/g) ?? []).length === 1 && proofsAt > 0 && proofsAt < from && footAt > from, { file: "src/components/spine/home/home-view.tsx", remedy: "list the record zone after the proofs and before the foot in SpineHomeBody's zones, then render the home (bash scratchpad/reform/render_some.sh \"home gb\")" });
  if (band) holdBand("the home's render", band);
} else { deferred++; console.log("DEFER  scratchpad/harness/pages/home-gb.html is not rendered here; the render's checks did not run"); }

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log(deferred ? `home/site_counts: all pass, ${deferred} deferred (render: not rendered here)` : "home/site_counts: all pass");
