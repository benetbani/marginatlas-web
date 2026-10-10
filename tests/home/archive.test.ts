/**
 * THE ARCHIVE, KEPT AND DATED (the spec docs/superpowers/specs/2026-10-09-home-introduction-design.md in the design repo, section 4,
 * proof 2, approved as written on 2026-10-09; plan docs/superpowers/plans/2026-10-09-home-introduction.md, Tasks 1, 2, 8 and 10). The
 * site keeps, month by month, the liquidation and administration notices as published and a dated copy of the company register,
 * whose free file is replaced every month; data/home/archive.json is that archive's own count, read from its log by
 * scripts/data/home/export_home.py.
 *
 * Holds the slice: it is its source's (scripts/lib/home_export.ts), and where the archive is not on this machine (a build server) its
 * source is deferred, never passed; the manifest's rows are its months and its copies; the months run one after another with no gap,
 * each a whole count of notices, the first and the last named; the copies are days, in order, none twice; the months of the year the
 * failure rates read hold exactly the notices those rates read (data/home/method.json); and, where the archive's log is on this
 * machine, the months, their counts and the copies are the log's own, read again here.
 *
 * Run: npx tsx tests/home/archive.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { holdHomeExport, homePassLine } from "../../scripts/lib/home_export";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { buildArchive, monthName, daysWords } from "../../src/lib/home/archive";
import type { Provenance } from "../../src/lib/spine/provenance";
import { buildProofs } from "../../src/lib/home/proofs";
import { buildJoins } from "../../src/lib/home/how_made";
import { ProofArchive } from "../../src/components/spine/home/HomeProofs";
import { COPY } from "../../src/lib/spine/copy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-archive";
const FILE = "data/home/archive.json";
const REMEDY = "re-run python -P scripts/data/home/export_home.py archive (after each monthly archive run), never edit data/home by hand";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY }); };

type Export = { gazette: { first: string; last: string; months: Array<{ month: string; notices: number }> }; register: { copies: string[] } };

/** A string as React writes it into markup. */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

/** The month after `ym` (YYYY-MM). */
const nextMonth = (ym: string) => { const y = Number(ym.slice(0, 4)), m = Number(ym.slice(5)); return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`; };

const held = holdHomeExport("archive.json", check);
const d = (held?.data ?? null) as Export | null;
if (held && d) {
  const months = d.gazette?.months ?? [];
  const copies = d.register?.copies ?? [];
  check(`the manifest's rows are the slice's: ${months.length} months and ${copies.length} register copies (${held.entry.rows})`, held.entry.rows === months.length + copies.length);
  const run = months.every((m, i) => /^\d{4}-\d{2}$/.test(m.month) && (i === 0 || m.month === nextMonth(months[i - 1].month)));
  check(`the months run one after another, ${d.gazette?.first} to ${d.gazette?.last}, no gap (${months.length})`, months.length > 0 && run && months[0].month === d.gazette.first && months[months.length - 1].month === d.gazette.last);
  check("each month holds a whole count of notices", months.every((m) => Number.isInteger(m.notices) && m.notices >= 0));
  check(`the register copies are days, in order, none twice (${copies.join(", ")})`, copies.length > 0 && copies.every((c, i) => /^\d{4}-\d{2}-\d{2}$/.test(c) && !Number.isNaN(Date.parse(c)) && (i === 0 || c > copies[i - 1])));
  /* THE YEAR THE FAILURE RATES READ (method.json's source line names it: "published 2025-10-01 to 2026-09-30"): the archive's months
     of that year hold exactly the notices those rates read, so the archive is the joins' own year, kept. */
  const METHOD_AT = { file: "data/home/method.json", remedy: "re-run python -P scripts/data/home/export_home.py method" };
  let method: { notices: number; source: string } | null = null;
  try { method = JSON.parse(readFileSync("data/home/method.json", "utf8")) as { notices: number; source: string }; } catch { /* a missing or truncated file: the check below is this gate's own red for it, not a stack */ }
  check("the failure rates' file reads, and holds the notices they read and the dates they were published (data/home/method.json)", !!method && Number.isInteger(method.notices) && typeof method.source === "string", METHOD_AT);
  if (method) {
    const span = /published (\d{4}-\d{2})-\d{2} to (\d{4}-\d{2})-\d{2}/.exec(method.source);
    const year = span ? months.filter((m) => m.month >= span[1] && m.month <= span[2]) : [];
    const sum = year.reduce((s, m) => s + m.notices, 0);
    check(`the months of the joins' year (${span ? `${span[1]} to ${span[2]}` : "not named"}) hold the ${method.notices.toLocaleString("en-US")} notices the failure rates read (${sum.toLocaleString("en-US")})`, !!span && year.length === 12 && sum === method.notices, { file: "data/home/method.json", remedy: "re-run python -P scripts/data/home/export_home.py method and archive, so both read the archive's year" });
  }

  /* THE LOG, READ AGAIN, where it is on this machine (a build server holds no archive: the holder deferred it above). */
  const src = held.entry.sources.find((s) => s.key === "archive");
  check("the manifest names the archive's log the slice was read from (archive)", !!src);
  if (src && existsSync(src.path)) {
    type Run = { gazette?: { added?: Array<{ month?: string; notices?: number }> }; companies_house?: { added?: Array<{ file?: string }> } };
    const log = JSON.parse(readFileSync(src.path, "utf8")) as { runs: Run[] };
    const counts = new Map<string, number>();
    const days = new Set<string>();
    for (const r of log.runs) {
      for (const a of r.gazette?.added ?? []) if (typeof a.month === "string" && /^\d{4}-\d{2}$/.test(a.month)) counts.set(a.month, (counts.get(a.month) ?? 0) + (a.notices ?? 0));
      for (const a of r.companies_house?.added ?? []) { const m = /BasicCompanyData(?:AsOneFile)?-(\d{4}-\d{2}-\d{2})/.exec(a.file ?? ""); if (m) days.add(m[1]); }
    }
    const fromLog = [...counts].sort(([a], [b]) => a.localeCompare(b)).map(([month, notices]) => ({ month, notices }));
    check(`the months and their notices are the log's own, read again here (${fromLog.length} months)`, JSON.stringify(fromLog) === JSON.stringify(months));
    check(`the register copies are the log's own (${[...days].sort().join(", ")})`, JSON.stringify([...days].sort()) === JSON.stringify(copies));
  }
}

/* THE BUILDER (plan Task 2): src/lib/home/archive.ts, the months and the copies counted from the slice, as a reader says them. */
const BUILT_AT = { file: "src/lib/home/archive.ts", remedy: "count the months and the copies from data/home/archive.json and say them as a reader does (monthName, daysWords)" };
const built = buildArchive();
check("the archive builds", !!built, BUILT_AT);
if (built && d) {
  check(`the months are the slice's: ${built.months}, ${built.firstName} to ${built.lastName}`, built.months === d.gazette.months.length && built.firstName === monthName(d.gazette.first) && built.lastName === monthName(d.gazette.last), BUILT_AT);
  check(`the register copies are the slice's: ${built.copies}, ${built.copiesWords}`, built.copies === d.register.copies.length && built.copiesWords === daysWords(d.register.copies), BUILT_AT);
  check("a month and days as a reader says them", monthName("2025-10") === "October 2025" && daysWords(["2026-05-01", "2026-10-01"]) === "1 May and 1 October 2026" && daysWords(["2026-12-01", "2027-01-01"]) === "1 December 2026 and 1 January 2027" && daysWords(["2026-05-01"]) === "1 May 2026", BUILT_AT);
  check("every figure says where it came from, counted", built.prov.months.src.startsWith("home/archive.json:") && built.prov.copies.src.startsWith("home/archive.json:") && built.prov.months.kind === "counted" && built.prov.copies.kind === "counted", BUILT_AT);
  /* EACH MONTH'S NOTICES (plan 2026-10-10, the home reformed to ship, Task 4; the spec's decision 8): the series is the slice's months
     and their counts, in order; its last twelve, the months the home's second proof draws, sum to the joins' notices, proof 1's figure. */
  check(`the series is the slice's months and their notices (${built.series.length})`, JSON.stringify(built.series) === JSON.stringify(d.gazette.months.map((m) => ({ month: m.month, notices: m.notices }))), BUILT_AT);
  const joins = buildJoins();
  const drawn = built.series.slice(-12);
  const sum = drawn.reduce((s, m) => s + m.notices, 0);
  check(`the twelve months drawn, ${drawn[0]?.month} to ${drawn[drawn.length - 1]?.month}, hold the joins' ${joins?.notices.figure ?? "(no joins)"} notices (${sum.toLocaleString("en-US")})`, drawn.length === 12 && !!joins && sum === joins.notices.value, { file: "data/home/method.json", remedy: "re-run python -P scripts/data/home/export_home.py method and archive, so the last twelve months the archive holds are the year the joins read" });
}

/* THE SECOND PROOF (plan Task 8; reformed by plan 2026-10-10, the home reformed to ship, Task 4: the spec's decision 8 and the critique's
   P0.6 and P1.7): the archive, its figure the months held, its line how a month is counted, the last twelve months as quiet columns
   in their own order, each column reading the month's own count, its row the register copies, its door About the figures' #archive;
   quiet, every figure stamped. */
const PROOF_AT = { file: "src/components/spine/home/HomeProofs.tsx", remedy: "draw the second proof as ProofArchive holds it: a door card to /about-data#archive (its title the stretched link, an arrow at its row's end), the months at 30, the last twelve months as MonthBars with start, tone ink and counts, standing above the link (relative z-20), the register copies as a row, quiet, every figure stamped" };
const proofs = buildProofs();
if (proofs && built) {
  const p = proofs.archive;
  const drawn = built.series.slice(-12);
  const n = (v: number) => v.toLocaleString("en-US");
  check(`the second proof is the archive: ${p.figure}, ${p.row.value} register copies of ${p.row.note}`, p.figure === COPY.home.proofs.archive.figure.replace("{n}", String(built.months)) && p.line === COPY.home.proofs.archive.words.replace("{first}", monthName(drawn[0].month)).replace("{last}", monthName(drawn[drawn.length - 1].month)) && p.row.value === String(built.copies) && p.row.note === built.copiesWords && p.href === "/about-data#archive", { file: "src/lib/home/proofs.ts", remedy: "take the second proof's figures from buildArchive, its line's months the twelve it draws" });
  check(`its months are the last twelve held, from ${p.months?.start}, read as counts`, !!p.months && p.months.start === drawn[0].month && JSON.stringify(p.months.points) === JSON.stringify(drawn.map((m) => ({ month: Number(m.month.slice(5, 7)) - 1, value: m.notices }))) && p.months.counts.words === COPY.home.proofs.archive.readout && p.months.counts.aria === COPY.home.proofs.archive.aria, { file: "src/lib/home/proofs.ts", remedy: "hand ProofArchive the last twelve of buildArchive().series as points (the calendar month, its notices), start the first of them, counts the copy's readout and aria" });
  const html = renderToStaticMarkup(React.createElement(ProofArchive, { p }));
  const raw = html.replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  check("it is a door card to About the figures' #archive, its title an h2", /id="archive"/.test(html) && /data-keep-card=""/.test(html) && /<a href="\/about-data#archive"/.test(html) && new RegExp(`<h2 [^>]*data-rail-title=""[^>]*>${COPY.home.proofs.archive.kicker}</h2>`).test(html), PROOF_AT);
  check("its figure is the card's 30, its copies a row", new RegExp(`data-focal="1" class="fig text-\\[length:var\\(--t-focal\\)\\][^"]*" data-src="home/archive\\.json:gazette\\.months" data-kind="counted">${p.figure}<`).test(html) && /data-archetype="fact-rows"/.test(html) && /data-row="copies"/.test(html), PROOF_AT);
  /* THE LINE AND THE ROW'S DAYS, AS DRAWN (fix round B): the line stands as the card's one small line, and the row names its days under
     its label (a date's spaces are held unbreakable in the markup, so they are read as spaces here). */
  const plain = html.replace(/\xa0/g, " ");
  const runs = (h: string) => h.replace(/<[^>]+>/g, "|").replace(/\|+/g, "|");
  check(`its line is drawn as the card's one small line ("${p.line}")`, plain.includes(`>${esc(p.line)}</p>`), PROOF_AT);
  check(`its row names its days, "${p.row.note}", under "${p.row.label}"`, runs(/data-row="copies"[\s\S]*?<\/dd>/.exec(plain)?.[0] ?? "").includes(`|${esc(p.row.label)}|${esc(p.row.note)}|`), PROOF_AT);
  /* THE COLUMNS (the spec's decision 8; the critique's P0.6): twelve, in their own order, each reading its month's notices; the label
     every month with its count; the years under their first months; the busiest in ink2 and the rest in the soft grey. */
  const bars = /<div data-archetype="month-bars"[\s\S]*?<div data-years=""[\s\S]*?<\/div>/.exec(html)?.[0] ?? "";
  const readings = [...bars.matchAll(/data-readout-figure="([^"]*)" data-readout-words="([^"]*)"/g)].map((m) => `${m[1]} ${m[2]}`);
  const want = drawn.map((m) => `${n(m.notices)} notices in ${monthName(m.month)}`);
  check(`the twelve months stand as columns in their own order, each reading its own count ("${readings[0]}" to "${readings[readings.length - 1]}")`, /data-points="12"/.test(bars) && JSON.stringify(readings) === JSON.stringify(want), PROOF_AT);
  const label = /aria-roledescription="chart" aria-label="([^"]*)"/.exec(bars)?.[1] ?? "";
  check("the drawing's label says every month with its count", label.startsWith(COPY.home.proofs.archive.aria.split("{first}")[0]) && drawn.every((m) => label.includes(`${monthName(m.month)} ${n(m.notices)}`)), PROOF_AT);
  const years = [...bars.matchAll(/data-year="(\d{4})"/g)].map((m) => m[1]);
  const wantYears = drawn.filter((m, i) => m.month.slice(5, 7) === "01" || (i === 0 && 13 - Number(m.month.slice(5, 7)) >= 3)).map((m) => m.month.slice(0, 4));
  check(`the years stand under their first months (${years.join(", ")})`, years.length > 0 && JSON.stringify(years) === JSON.stringify(wantYears), PROOF_AT);
  const columns = [...bars.matchAll(/data-month-bar="\d+"[^>]*style="height:[^;]*;background:([^"]*)"/g)].map((m) => m[1]);
  check(`quiet: the busiest month in ink2, the other eleven in the soft grey, no accent (${columns.filter((c) => c === "var(--c-ink2)").length} and ${columns.filter((c) => c === "var(--c-soft2)").length})`, columns.length === 12 && columns.filter((c) => c === "var(--c-ink2)").length === 1 && columns.filter((c) => c === "var(--c-soft2)").length === 11 && !/var\(--terra/.test(bars), PROOF_AT);
  check("the columns stand above the door's stretched link, so a tap there reads a month", /<div class="relative z-20 mt-auto"><div data-archetype="month-bars"/.test(html), PROOF_AT);
  check("quiet: no figure in the accent", !/(?:^|[\s"])text-\[var\(--terra-text\)\]/.test(html), PROOF_AT);
  const figs = [...html.matchAll(/<[^>]+class="[^"]*\bfig\b[^"]*"[^>]*>/g)].map((m) => m[0]);
  check(`every figure says where it came from (${figs.length})`, figs.length === 2 && figs.every((f) => /data-src="home\/archive\.json:/.test(f) && /data-kind="counted"/.test(f)), PROOF_AT);
  check("the door: its title the link, stretched over the card, an arrow at the row's end, the edge to ink2 on hover", /<a href="\/about-data#archive" class="min-w-0 flex-1 text-\[var\(--c-ink\)\] no-underline after:absolute after:inset-0 after:z-10 after:rounded-\[12px\]">/.test(raw) && /<span aria-hidden="true" class="mt-1 shrink-0 [^"]*text-\[var\(--c-ink2\)\]">→<\/span>/.test(raw) && /id="archive"[^>]*class="[^"]*hover:border-\[var\(--c-ink2\)\]/.test(raw), PROOF_AT);
}

async function main(): Promise<void> {
  /* ABOUT THE FIGURES' #archive (plan Task 2), where the second proof's door lands: the builder's months and copies, no source named. */
  (globalThis as unknown as { React: typeof React }).React = React;
  const { default: AboutDataPage } = await import("../../src/app/(site)/about-data/page");
  const about = renderToStaticMarkup(React.createElement(AboutDataPage));
  const at = about.indexOf('id="archive"');
  const section = at < 0 ? "" : about.slice(at, about.indexOf("<h2", at + 1)).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const ABOUT_AT = { file: "src/app/(site)/about-data/page.tsx", remedy: "print #archive from buildArchive (src/lib/home/archive.ts): the months, the first and the last, the register copies' days; no source named there" };
  check("About the figures holds #archive", at > 0, ABOUT_AT);
  if (built) check(`#archive prints the builder's months and copies (${built.months} months, ${built.firstName} to ${built.lastName}, ${built.copiesWords})`, section.includes(`${built.months} months of notices`) && section.includes(`${built.firstName} to ${built.lastName}`) && section.includes(built.copiesWords), ABOUT_AT);
  check("#archive names no source (R-002: the sources section does)", !/Gazette|Companies House/.test(section), ABOUT_AT);

  /* EACH FIGURE #ARCHIVE PRINTS CARRIES ITS BUILDER'S PROVENANCE (the plan's Global Constraint "Figures": data-src and data-kind, provAttrs
     in src/lib/spine/provenance.ts): the figure as printed sits inside the element that holds its builder's two attributes, in this
     section, so a figure left bare, or stamped with another figure's source, is a red. The builder stamps the months (the count) and the
     copies (their days); the first and the last month are the ends of the months' list, so they carry the months' stamp. */
  if (built) {
    const STAMPED_AT = { file: "src/app/(site)/about-data/page.tsx", remedy: "wrap each figure in <span {...provAttrs(x.prov)}> (provAttrs from @/lib/spine/provenance), x the builder's own prov (src/lib/home/archive.ts), the words around it unchanged" };
    const rawSection = at < 0 ? "" : about.slice(at, about.indexOf("<h2", at + 1));
    const escaped = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
    const figures: Array<[string, Provenance]> = [[String(built.months), built.prov.months], [built.firstName, built.prov.months], [built.lastName, built.prov.months], [built.copiesWords, built.prov.copies]];
    const left = figures.filter(([figure, prov]) => !rawSection.includes(`<span data-src="${escaped(prov.src)}" data-kind="${prov.kind}">${escaped(figure)}</span>`)).map(([figure]) => figure);
    check(`#archive's months (${built.months}), first (${built.firstName}) and last (${built.lastName}) month and copies' days (${built.copiesWords}) each carry their builder's data-src and data-kind${left.length ? `; without its builder's stamp: ${left.join(", ")}` : ""}`, left.length === 0, STAMPED_AT);
  }
  /* THE HOME'S RENDER (Task 10), where the harness wrote it: the second proof, stamped, behind its door. */
  const home = existsSync("scratchpad/harness/pages/home-gb.html") ? readFileSync("scratchpad/harness/pages/home-gb.html", "utf8") : "";
  if (home && proofs) {
    const at = home.indexOf('id="archive"');
    check("the home prints the second proof, stamped, behind its door", at > 0 && home.slice(at, at + 4000).includes(`>${proofs.archive.figure}<`) && home.slice(at, at + 4000).includes('href="/about-data#archive"'), { file: "src/components/spine/home/home-view.tsx", remedy: "seat ProofArchive second in the proofs zone" });
  } else if (!home) console.log("DEFER  scratchpad/harness/pages/home-gb.html is not rendered here; the home's render check did not run");
  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log(homePassLine("home/archive", held));
}

main().catch((e) => { console.error(e); process.exit(1); });
