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

async function main(): Promise<void> {
  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log(homePassLine("home/archive", held));
}

main().catch((e) => { console.error(e); process.exit(1); });
