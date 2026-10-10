/**
 * THE JOINS, THE HOME'S FIRST PROOF (the spec docs/superpowers/specs/2026-10-09-home-introduction-design.md in the design repo, sections
 * 4 and 6, approved as written on 2026-10-09; plan docs/superpowers/plans/2026-10-09-home-introduction.md, Tasks 2, 8 and 10). A year of
 * liquidation and administration notices matched by name to the company register, the technique that gives failure rates by trade
 * where the official figures stop at broad industry; how figures are made, the home card that printed it until that plan, retired, its
 * London trade pages a line on About the figures. The notices and names come from data/home/method.json (the registers' failures table,
 * by scripts/data/home/export_home.py); the trade pages are counted from this repo's files.
 *
 * Holds the slice: it is its source's (scripts/lib/home_export.ts), a source this machine lacks ends the last line as deferred; the
 * manifest's row count is its content's (one); its counts nest; its source line is the register slice's own; and, where the failures
 * table is on this machine, its four counts and its source line are the table's own, read again. Holds the builders
 * (src/lib/home/how_made.ts): the join's three counts and the share of names found, each stamped; the London trade pages counted as their
 * pages print them, never as the builder reads them. Holds About the figures: #failures prints the join, #reading the pages read, each
 * figure inside the element that holds its builder's data-src and data-kind, no source named in either. Holds the proof
 * (src/lib/home/proofs.ts, HomeProofs.tsx) and, where the harness wrote it, the home's render.
 *
 * Run: npx tsx tests/home/how_made.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { holdHomeExport, homePassLine } from "../../scripts/lib/home_export";
import { buildJoins, londonPagesRead } from "../../src/lib/home/how_made";
import { buildProofs } from "../../src/lib/home/proofs";
import { ProofJoins } from "../../src/components/spine/home/HomeProofs";
import { londonTradeSales } from "../../src/lib/uk/registers/london_trade";
import { tradeHeadFigure } from "../../src/lib/spine/trade_head";
import { buildLondonTradeSales } from "../../src/lib/spine/country_depth_rows";
import { SLUG_TO_INDUSTRY } from "../../src/lib/taxonomy";
import { RETIRED } from "../../src/lib/taxonomy/retired";
import { COPY } from "../../src/lib/spine/copy";
import type { Provenance } from "../../src/lib/spine/provenance";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-how-made";
const FILE = "data/home/method.json";
const REMEDY = "re-run python -P scripts/data/home/export_home.py method, never edit data/home by hand; then draw the first proof from the slice";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY }); };

/** A source table read as JSON; one cut off or damaged is a red of its own and null, never a SyntaxError stack. */
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
  check(`the counts nest: ${d.matched_names} names matched of ${d.names} names in ${d.notices} notices, ${d.unmatched_notices} notices unmatched`, [d.notices, d.names, d.matched_names, d.unmatched_notices].every((x) => Number.isInteger(x) && x >= 0) && d.notices > 0 && d.matched_names <= d.names && d.names <= d.notices && d.unmatched_notices <= d.notices);
  const failures = JSON.parse(readFileSync("data/uk/registers/failures.json", "utf8")) as { source: string };
  check("the notices are the year the failure rates were read from (the register slice's own source line)", d.source === failures.source, { file: "data/uk/registers/failures.json", remedy: "re-run registers/uk/export_for_site.py, then python -P scripts/data/home/export_home.py method, so both read one table" });
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

/* THE JOIN (Task 2). */
const JOINS_AT = { file: "src/lib/home/how_made.ts", remedy: "read the join's three counts from data/home/method.json in buildJoins, each stamped counted" };
const joins = buildJoins();
check("the join builds", !!joins, JOINS_AT);
if (joins && d) {
  const n = (v: number) => v.toLocaleString("en-US");
  check(`the join's counts are the slice's (${joins.notices.figure} notices, ${joins.matched.figure} of ${joins.names.figure} names)`, joins.notices.value === d.notices && joins.names.value === d.names && joins.matched.value === d.matched_names && joins.notices.figure === n(d.notices) && joins.names.figure === n(d.names) && joins.matched.figure === n(d.matched_names), JOINS_AT);
  check(`the share of names found is the slice's (${joins.share.toFixed(1)} of 100)`, Math.abs(joins.share - (100 * d.matched_names) / d.names) < 1e-9, JOINS_AT);
  check("every count says where it came from, counted", [joins.notices, joins.names, joins.matched].every((c) => c.prov.src.startsWith("home/method.json:") && c.prov.kind === "counted"), JOINS_AT);
}

/* THE PAGES READ, HELD TO THE PAGES AND NOT TO THE BUILDER'S OWN PREDICATE (Task 2). A London trade page prints a takings figure where its
   head gives a dollar one (tradeHeadFigure); the pages served are the sitemap's London list, restated from the taxonomy, as the routing
   gates restate it (a gate cannot read the sitemap's module, which builds the database client on load). */
const PAGES_AT = { file: "src/lib/home/how_made.ts", remedy: "count the London trade pages that print a takings figure (tradeHeadFigure) out of the pages served, the taxonomy's trade slugs that are not retired" };
const pages = londonPagesRead();
const served = Object.keys(SLUG_TO_INDUSTRY).filter((s) => !Object.hasOwn(RETIRED, s));
const printing = served.filter((s) => tradeHeadFigure({ isLondon: true, slug: s })?.usd != null);
const closed = served.filter((s) => londonTradeSales(s)?.q50.open === false);
const apart = [...closed.filter((s) => !printing.includes(s)), ...printing.filter((s) => !closed.includes(s))];
check(`the trades whose median falls in a closed band are exactly the pages that print a takings figure (${printing.length} of the ${served.length} served)${apart.length ? `; apart on ${apart.join(", ")}` : ""}`, apart.length === 0, PAGES_AT);
check(`the London trade pages are counted as they print (${pages ? `${pages.printing} of ${pages.served}` : "none"}; the UK page's money card ranks ${buildLondonTradeSales()?.rows.length} of them)`, !!pages && pages.printing === printing.length && pages.served === served.length && printing.length >= (buildLondonTradeSales()?.rows.length ?? Number.POSITIVE_INFINITY), PAGES_AT);

/* THE FIRST PROOF (Task 8). */
const PROOF_AT = { file: "src/components/spine/home/HomeProofs.tsx", remedy: "draw the first proof as ProofJoins holds it: a door card to /about-data#failures, its title an h2, the notices at 30 and the names found as a lead ring, quiet, every figure stamped" };
const proofs = buildProofs();
check("the proofs build", !!proofs, { file: "src/lib/home/proofs.ts", remedy: "build the proofs from buildJoins, buildArchive and buildHomeAnswers' answer" });
if (proofs && joins) {
  const p = proofs.joins;
  check(`the first proof is the join: ${p.figure} notices, the ring ${p.ring.figure} of ${p.ring.names}`, p.figure === joins.notices.figure && p.prov.src === joins.notices.prov.src && p.ring.figure === joins.matched.figure && p.ring.names === joins.names.figure && p.ring.value === joins.share && p.href === "/about-data#failures", { file: "src/lib/home/proofs.ts", remedy: "take the first proof's figures from buildJoins" });
  const html = renderToStaticMarkup(React.createElement(ProofJoins, { p }));
  check("it is a door card to About the figures' #failures, its title an h2", /id="joins"/.test(html) && /data-keep-card=""/.test(html) && /<a href="\/about-data#failures"/.test(html) && new RegExp(`<h2 [^>]*data-rail-title=""[^>]*>${COPY.home.proofs.joins.kicker}</h2>`).test(html), PROOF_AT);
  check("its figure is the card's 30, the ring's at 16 in a lead ring", /data-focal="1" class="fig text-\[length:var\(--t-focal\)\][^"]*" data-src="home\/method\.json:notices" data-kind="counted">/.test(html) && /data-archetype="ring"/.test(html) && /class="relative h-24 w-24"/.test(html) && /--t-lead[^"]*" data-src="home\/method\.json:matched_names" data-kind="counted">/.test(html), PROOF_AT);
  check("the ring's caption names the names held, stamped", /data-src="home\/method\.json:names" data-kind="counted">/.test(html), PROOF_AT);
  check("quiet: no figure in the accent, and no word of countries or estimates", !/(?:^|[\s"])text-\[var\(--terra-text\)\]/.test(html) && !/countr|estimate/i.test(html.replace(/<[^>]+>/g, " ")), PROOF_AT);
  const figs = [...html.matchAll(/<[^>]+class="[^"]*\bfig\b[^"]*"[^>]*>/g)].map((m) => m[0]);
  check(`every figure says where it came from (${figs.length})`, figs.length === 3 && figs.every((f) => /data-src="home\/method\.json:/.test(f) && /data-kind="counted"/.test(f)), PROOF_AT);
  check("one small line, the focal's", (html.match(/<p /g) ?? []).length === 1 && html.includes(COPY.home.proofs.joins.words), PROOF_AT);
}

async function main(): Promise<void> {
  /* ABOUT THE FIGURES (Task 2): #failures prints the join, #reading the pages read; no source named in either. */
  (globalThis as unknown as { React: typeof React }).React = React;
  const { default: AboutDataPage } = await import("../../src/app/(site)/about-data/page");
  const about = renderToStaticMarkup(React.createElement(AboutDataPage));
  const section = (id: string) => { const at = about.indexOf(`id="${id}"`); return at < 0 ? "" : about.slice(at, about.indexOf("<h2", at + 1)).replace(/<[^>]+>/g, " ").replace(/\s+/g, " "); };
  const ABOUT_AT = { file: "src/app/(site)/about-data/page.tsx", remedy: "print #failures from buildJoins and #reading's pages line from londonPagesRead (src/lib/home/how_made.ts), never typed, no source named" };
  check("About the figures holds #failures", /id="failures"/.test(about), ABOUT_AT);
  if (joins) check(`#failures prints the notices, ${joins.notices.figure}, and the names found, ${joins.matched.figure} of the ${joins.names.figure}`, section("failures").includes(joins.notices.figure) && section("failures").includes(`${joins.matched.figure} of the ${joins.names.figure}`), ABOUT_AT);
  if (pages) check(`#reading prints the London trade pages read from the band counts, ${pages.printing} of the ${pages.served}`, section("reading").includes(`${pages.printing} of the ${pages.served} London trade pages`), ABOUT_AT);
  check("neither names a source (R-002: the sources section does)", !/Gazette|Companies House/.test(section("failures") + section("reading")), ABOUT_AT);

  /* EACH FIGURE ABOUT PRINTS CARRIES ITS BUILDER'S PROVENANCE (the plan's Global Constraint "Figures": data-src and data-kind, provAttrs in
     src/lib/spine/provenance.ts; fix round A, carried through Task 10's rewrite): the figure as printed sits inside the element that holds
     its builder's two attributes, in the section that prints it, so a figure left bare, or stamped with another figure's source, is a red. */
  const STAMPED_AT = { file: "src/app/(site)/about-data/page.tsx", remedy: "wrap each figure in <span {...provAttrs(x.prov)}> (provAttrs from @/lib/spine/provenance), x the builder's own prov (src/lib/home/how_made.ts), the words around it unchanged" };
  const rawSection = (id: string) => { const at = about.indexOf(`id="${id}"`); return at < 0 ? "" : about.slice(at, about.indexOf("<h2", at + 1)); };
  const escaped = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  /** The figures of `figures` that `id`'s section does not print inside `<span data-src="its prov's src" data-kind="its kind">figure</span>`: bare, or stamped with another's source. */
  const unstamped = (id: string, figures: Array<[string, Provenance]>) => figures.filter(([figure, prov]) => !rawSection(id).includes(`<span data-src="${escaped(prov.src)}" data-kind="${prov.kind}">${escaped(figure)}</span>`)).map(([figure]) => figure);
  if (pages) {
    const left = unstamped("reading", [[`${pages.printing} of the ${pages.served}`, pages.prov]]);
    check(`#reading's pages line (${pages.printing} of the ${pages.served}) carries its builder's data-src and data-kind${left.length ? `; without its builder's stamp: ${left.join(", ")}` : ""}`, left.length === 0, STAMPED_AT);
  }
  if (joins) {
    const left = unstamped("failures", [[joins.notices.figure, joins.notices.prov], [joins.matched.figure, joins.matched.prov], [joins.names.figure, joins.names.prov]]);
    check(`#failures' notices (${joins.notices.figure}), names matched (${joins.matched.figure}) and names (${joins.names.figure}) each carry their builder's data-src and data-kind${left.length ? `; without its builder's stamp: ${left.join(", ")}` : ""}`, left.length === 0, STAMPED_AT);
  }

  /* THE HOME'S RENDER (Task 10), where the harness wrote it: the first proof, stamped, behind its door; how figures are made gone. */
  const home = existsSync("scratchpad/harness/pages/home-gb.html") ? readFileSync("scratchpad/harness/pages/home-gb.html", "utf8") : "";
  if (home && joins) {
    const at = home.indexOf('id="joins"');
    check("the home prints the first proof, stamped, behind its door, and no longer how figures are made", at > 0 && home.slice(at, at + 4000).includes(`>${joins.notices.figure}<`) && home.slice(at, at + 4000).includes('href="/about-data#failures"') && !/id="how-made"/.test(home), { file: "src/components/spine/home/home-view.tsx", remedy: "seat ProofJoins first in the proofs zone" });
  } else if (!home) console.log("DEFER  scratchpad/harness/pages/home-gb.html is not rendered here; the home's render check did not run");

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log(homePassLine("home/how_made", held));
}

main().catch((e) => { console.error(e); process.exit(1); });
