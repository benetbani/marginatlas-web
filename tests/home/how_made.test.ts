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
 * (src/lib/home/proofs.ts, HomeProofs.tsx) and, where the harness wrote it, the home's render; since plan 2026-10-10 (the home
 * reformed to ship, Task 4) the proof's ring reads the names found in 100, in ink, and its title is the door, with its arrow.
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

/* THE FIRST PROOF (Task 8 of the home introduction; reformed by plan 2026-10-10, the home reformed to ship, Task 4: the critique's
   P1.6, P1.7 and P1.9). The ring prints the names found in 100 and its caption the copy's words alone (the two counts it is worked
   out from stand on About the figures' #failures), in ink, its cap butt above 90 so no notch shows; the title is the door, stretched
   over the card, an arrow at its row's end, the card's edge in ink2 on hover, the title at 20 on 28. */
const PROOF_AT = { file: "src/components/spine/home/HomeProofs.tsx", remedy: "draw the first proof as ProofJoins holds it: a door card to /about-data#failures (its title an h2 at 20 and the stretched link, an arrow at the title row's end, the edge to ink2 on hover), the notices at 30 and the names found in 100 as a lead ring in ink with its caption, quiet, every figure stamped" };
const proofs = buildProofs();
check("the proofs build", !!proofs, { file: "src/lib/home/proofs.ts", remedy: "build the proofs from buildJoins, buildArchive and buildHomeAnswers' answer" });
if (proofs && joins) {
  const p = proofs.joins;
  check(`the first proof is the join: ${p.figure} notices, the ring "${p.ring.figure}" "${p.ring.caption}"`, p.figure === joins.notices.figure && p.prov.src === joins.notices.prov.src && p.ring.value === joins.share && p.ring.figure === String(Math.round(joins.share)) && p.ring.prov.src === "home/method.json:matched_names of names" && p.ring.prov.kind === "worked out" && p.ring.caption === COPY.home.proofs.joins.ring && p.href === "/about-data#failures", { file: "src/lib/home/proofs.ts", remedy: "take the first proof's figures from buildJoins: the ring's figure the share of names found, rounded, stamped worked out from home/method.json:matched_names of names; its caption COPY.home.proofs.joins.ring alone" });
  const html = renderToStaticMarkup(React.createElement(ProofJoins, { p }));
  /** The markup with the two entities React writes into a class read back, so a class is matched as it is written. */
  const raw = html.replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  /* THE TITLE NAMES WHAT IS DRAWN (the closing cleanup of plan 2026-10-10, the home reformed to ship, item 8). "Failures by trade" named no
     drawn thing: the 31,926 are notices of four kinds, the solvent liquidations among them, and what the card draws is the match of
     their names to the register. The title is "Matched by name", three words. That it stands on one line at 20 beside the chip and the
     arrow from 1024 to 1440 is a measure of pixels, which this file cannot take (the browser probe's, kept in the report). */
  const joinsTitle = COPY.home.proofs.joins.kicker;
  check(`the first proof is titled "${joinsTitle}", three words, naming the match it draws`, joinsTitle === "Matched by name" && joinsTitle.split(" ").length === 3, { file: "src/lib/spine/copy.ts", remedy: "title the first proof \"Matched by name\" (COPY.home.proofs.joins.kicker): the card draws the match of the notices' names to the register, and \"Failures by trade\" named no drawn thing" });
  check("it is a door card to About the figures' #failures, its title an h2", /id="joins"/.test(html) && /data-keep-card=""/.test(html) && /<a href="\/about-data#failures"/.test(html) && new RegExp(`<h2 [^>]*data-rail-title=""[^>]*>${COPY.home.proofs.joins.kicker}</h2>`).test(html), PROOF_AT);
  check(`its figure is the card's 30, the ring's "${p.ring.figure}" at 16 in a lead ring, worked out`, /data-focal="1" class="fig text-\[length:var\(--t-focal\)\][^"]*" data-src="home\/method\.json:notices" data-kind="counted">/.test(html) && /data-archetype="ring"/.test(html) && /class="relative h-24 w-24"/.test(html) && new RegExp(`--t-lead[^"]*" data-src="home/method\\.json:matched_names of names" data-kind="worked out">${p.ring.figure}<`).test(html), PROOF_AT);
  check(`the ring is drawn at the builder's share, ${Math.round(joins.share)} of 100 (${joins.share.toFixed(1)})`, new RegExp(`data-archetype="ring"[^>]*data-share="${Math.round(joins.share)}"`).test(html), PROOF_AT);
  /* The ring's account to a screen reader is the figure and the caption together ("97 in 100 names found in the register"), not "97 of
     the whole" beside a caption that says what the 97 is of (the closing cleanup of plan 2026-10-10, item 13). */
  const ringLabel = /<svg [^>]*aria-label="([^"]*)"/.exec(html)?.[1] ?? "";
  check(`the ring is labelled by its figure and its caption: "${ringLabel}"`, ringLabel === `${p.ring.figure} ${p.ring.caption}`, { file: "src/components/spine/archetypes/Ring.tsx", remedy: "Ring: the svg's aria-label is the figure then the caption's words when a caption is given, so the home's ring reads \"97 in 100 names found in the register\"" });
  check(`the ring's caption reads "${COPY.home.proofs.joins.ring}", the copy's words alone`, new RegExp(`data-mark-label="true"[^>]*>${COPY.home.proofs.joins.ring}</div>`).test(html), PROOF_AT);
  /* The caption balances its two lines (fix round 2b; the Task 4 review's concern 1): in the 22ch box it broke as "in 100 names found in the"
     and "register", at every width, a word left alone under the ring. */
  check("the ring's caption balances its lines (text-balance on its element), so no word is left alone on the second line", /<div data-mark-label="true" class="[^"]*\btext-balance\b[^"]*">/.test(html), { file: "src/components/spine/archetypes/Ring.tsx", remedy: "Ring size lead: text-balance on the caption's element, so the joins' caption breaks as \"in 100 names found\" and \"in the register\" and not with \"register\" alone" });
  const ring = html.slice(html.indexOf('data-archetype="ring"'));
  check("the ring in ink: ink2 on the soft grey, its cap butt above 90, no terracotta in it", /stroke="var\(--c-soft2\)"/.test(ring) && /stroke="var\(--c-ink2\)"[^>]*stroke-linecap="butt"/.test(ring) && !/var\(--terra/.test(ring), PROOF_AT);
  check("quiet: no figure in the accent, and no word of countries or estimates", !/(?:^|[\s"])text-\[var\(--terra-text\)\]/.test(html) && !/countr|estimate/i.test(html.replace(/<[^>]+>/g, " ")), PROOF_AT);
  const figs = [...html.matchAll(/<[^>]+class="[^"]*\bfig\b[^"]*"[^>]*>/g)].map((m) => m[0]);
  check(`every figure says where it came from (${figs.length}: the notices, the ring's and the two counts at the foot)`, figs.length === 4 && figs.every((f) => /data-src="home\/method\.json:/.test(f) && /data-kind="(counted|worked out)"/.test(f)), PROOF_AT);
  check("one small line, the focal's", (html.match(/<p /g) ?? []).length === 1 && html.includes(COPY.home.proofs.joins.words), PROOF_AT);
  /* THE LINE SAYS WHAT IS DONE TO EACH NOTICE, AND THE TITLE SAYS THE MATCH (critique pass 2, P0.1 and P2.10): "matched by name" stood in the
     title and in the line, and in step 4 above, three times in two screens. The line now reads "Liquidation and administration notices a
     year, each looked up in the register." (twelve words) and leaves the match to the title. */
  /* The words the home prints that say it, by their copy: the joins' title, the joins' line and step 4's line (the render check below reads the page itself). */
  const sayers = [COPY.home.proofs.joins.kicker, COPY.home.proofs.joins.words, COPY.home.example.insolvent].filter((s) => /matched by name/i.test(s));
  check(`"matched by name" is said by ${sayers.length} of the home's words (the joins' title and step 4's line), never a third`, sayers.length <= 2, { file: "src/lib/spine/copy.ts", remedy: "COPY.home.proofs.joins.words says what is done to each notice (\"each looked up in the register\") and leaves \"matched by name\" to the card's title and step 4's line" });
  check(`the line is "${p.line}", twelve words at most, and says "matched by name" nowhere (the title does)`, p.line === COPY.home.proofs.joins.words && p.line.split(" ").length <= 12 && !/matched by name/i.test(p.line) && !p.line.includes(";"), { file: "src/lib/spine/copy.ts", remedy: "COPY.home.proofs.joins.words: \"Liquidation and administration notices a year, each looked up in the register.\"" });
  /* THE CARD SHOWS ITS WORKING (critique pass 2, P0.1): 30,510 of 31,376 is the ring's 97, and a proof card lets the reader check it. The
     two counts the builder returns stand as rows at the card's foot, each stamped counted from home/method.json, and the ring stands in its
     row form (the caption beside it, left-aligned) at `mt-5`, so no ring floats centred in a left-aligned card over a block of nothing. */
  /* CRITIQUE PASS 3, FIX ROUND D1, ITEM P2.4: "31,926" over "Names in notices 31,376" put two five-digit numbers that differ in one digit with
     no word for the gap, which a careful reader takes for a typo. method.json holds 31,926 notices and 31,376 names, so a name is counted once
     however many notices carry it, and the row's label says so: two words, the model laws' row length held. */
  check(`the first working row is labelled "${COPY.home.proofs.joins.names}": different names, not the notices' names, so a name counted once explains the gap to the notices`, COPY.home.proofs.joins.names === "Different names" && COPY.home.proofs.joins.names.split(" ").length <= 2, { file: "src/lib/spine/copy.ts", remedy: "COPY.home.proofs.joins.names: \"Different names\"" });
  check(`the card shows its working: "${COPY.home.proofs.joins.names}" ${joins.names.figure} and "${COPY.home.proofs.joins.found}" ${joins.matched.figure}, each counted from the file`, p.rows.length === 2 && p.rows[0].label === COPY.home.proofs.joins.names && p.rows[0].value === joins.names.figure && p.rows[0].prov.src === "home/method.json:names" && p.rows[0].prov.kind === "counted" && p.rows[1].label === COPY.home.proofs.joins.found && p.rows[1].value === joins.matched.figure && p.rows[1].prov.src === "home/method.json:matched_names" && p.rows[1].prov.kind === "counted" && html.includes(`data-src="home/method.json:names" data-kind="counted">${joins.names.figure}<`) && html.includes(`data-src="home/method.json:matched_names" data-kind="counted">${joins.matched.figure}<`), { file: "src/lib/home/proofs.ts", remedy: "give ProofJoins two rows from buildJoins' names and matched counts, each stamped with the builder's own prov, and draw them with FactRows at the foot" });
  check("the ring stands 20px under the line (the focal's 16 and mt-1) and 12px over the foot's hairline at the least (mb-3), in its row form, the caption beside it, left-aligned at 14 in ink2; the rows at the foot under their hairline (mt-auto border-t); nothing else is pushed to the foot", /<div class="mb-3 mt-1"><div data-archetype="ring"[^>]*class="flex items-center gap-4">/.test(html) && /<div data-mark-label="true" class="max-w-\[20ch\] text-balance text-left text-\[length:var\(--t-body\)\] leading-5 text-\[var\(--c-ink2\)\]">/.test(html) && /<div class="mt-auto border-t border-\[var\(--c-border\)\]"><div class="\[container-type:inline-size\]/.test(html) && (html.match(/\bmt-auto\b/g) ?? []).length === 1, PROOF_AT);
  check("the door: its title the link, stretched over the card, an arrow at the row's end, the edge to ink2 on hover, the title at 20 on 28", /<div data-door-title="" class="flex items-start gap-2"><a href="\/about-data#failures" class="min-w-0 flex-1 text-\[var\(--c-ink\)\] no-underline after:absolute after:inset-0 after:z-10 after:rounded-\[12px\]">/.test(raw) && /<span aria-hidden="true" class="mt-1 shrink-0 text-\[length:var\(--t-body\)\] leading-5 text-\[var\(--c-ink2\)\]">→<\/span><\/div>/.test(raw) && /id="joins"[^>]*class="[^"]*\brelative isolate\b[^"]*hover:border-\[var\(--c-ink2\)\][^"]*\[&_\[data-rail-title\]\]:text-\[length:var\(--t-head\)\] \[&_\[data-rail-title\]\]:leading-7/.test(raw), PROOF_AT);
}

async function main(): Promise<void> {
  /* ABOUT THE FIGURES (Task 2): #failures prints the join, #reading the pages read; no source named in either. */
  (globalThis as unknown as { React: typeof React }).React = React;
  const { default: AboutDataPage } = await import("../../src/app/(site)/about-data/page");
  const about = renderToStaticMarkup(React.createElement(AboutDataPage));
  const section = (id: string) => { const at = about.indexOf(`id="${id}"`); return at < 0 ? "" : about.slice(at, about.indexOf("<h2", at + 1)).replace(/<[^>]+>/g, " ").replace(/\s+/g, " "); };
  const ABOUT_AT = { file: "src/app/(site)/about-data/page.tsx", remedy: "print #failures from buildJoins and #reading's pages line from londonPagesRead (src/lib/home/how_made.ts), never typed, no source named" };
  check("About the figures holds #failures", /id="failures"/.test(about), ABOUT_AT);
  /* The destination keeps its own name: the door's subject is the join, and the section under it is failures, trade by trade. */
  check("About's destination heading stays \"Failures, trade by trade\" (the first proof's door lands on it)", /<h2 id="failures"[^>]*>Failures, trade by trade<\/h2>/.test(about), ABOUT_AT);
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
    /* "MATCHED BY NAME" IS SAID TWICE AT MOST (critique pass 2, P2.10): step 4's line and the joins' title said it, and the joins' own line a
       third time within two screens; the joins' line now says what is done to each notice and leaves the match to the title. */
    const spoken = home.replace(/<style[\s\S]*?<\/style>/g, "").replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    const matchedCount = (spoken.match(/matched by name/gi) ?? []).length;
    check(`"matched by name" stands ${matchedCount} times on the home (step 4's line and the joins' title), never a third`, matchedCount <= 2, { file: "src/lib/spine/copy.ts", remedy: "COPY.home.proofs.joins.words says what is done to each notice (\"each looked up in the register\") and leaves \"matched by name\" to the card's title and step 4's line" });
    check("the home prints the first proof, stamped, behind its door, and no longer how figures are made", at > 0 && home.slice(at, at + 4000).includes(`>${joins.notices.figure}<`) && home.slice(at, at + 4000).includes('href="/about-data#failures"') && !/id="how-made"/.test(home), { file: "src/components/spine/home/home-view.tsx", remedy: "seat ProofJoins first in the proofs zone" });
  } else if (!home) console.log("DEFER  scratchpad/harness/pages/home-gb.html is not rendered here; the home's render check did not run");

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log(homePassLine("home/how_made", held));
}

main().catch((e) => { console.error(e); process.exit(1); });
