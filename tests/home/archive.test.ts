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
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-archive";
const FILE = "data/home/archive.json";
const REMEDY = "re-run python -P scripts/data/home/export_home.py archive (after each monthly archive run), never edit data/home by hand";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY }); };

type Export = { gazette: { first: string; last: string; months: Array<{ month: string; notices: number }> }; register: { copies: string[] } };

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
  const method = JSON.parse(readFileSync("data/home/method.json", "utf8")) as { notices: number; source: string };
  const span = /published (\d{4}-\d{2})-\d{2} to (\d{4}-\d{2})-\d{2}/.exec(method.source);
  const year = span ? months.filter((m) => m.month >= span[1] && m.month <= span[2]) : [];
  const sum = year.reduce((s, m) => s + m.notices, 0);
  check(`the months of the joins' year (${span ? `${span[1]} to ${span[2]}` : "not named"}) hold the ${method.notices.toLocaleString("en-US")} notices the failure rates read (${sum.toLocaleString("en-US")})`, !!span && year.length === 12 && sum === method.notices, { file: "data/home/method.json", remedy: "re-run python -P scripts/data/home/export_home.py method and archive, so both read the archive's year" });

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
    check(`#archive's months (${built.months}), first (${built.firstName}) and last (${built.lastName}) month and copies' days (${built.copiesWords}) each carry their builder's data-src and data-kind${left.length ? `; left bare: ${left.join(", ")}` : ""}`, left.length === 0, STAMPED_AT);
  }
  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log(homePassLine("home/archive", held));
}

main().catch((e) => { console.error(e); process.exit(1); });
