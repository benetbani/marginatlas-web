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
 * the London trade pages read from the band counts are counted from the register slice, at least the trades the UK page's money
 * card ranks; no row counts countries and the copy holds no countries row (his ruling of 2026-10-07: the home's 195 counter is
 * wrong); every figure stamped; the focal's line twelve words at most.
 *
 * Run: npx tsx tests/home/how_made.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { holdHomeExport, homePassLine } from "../../scripts/lib/home_export";
import turnoverJson from "../../data/uk/registers/turnover.json";
import { buildHowMade } from "../../src/lib/home/how_made";
import { londonTradeSales } from "../../src/lib/uk/registers/london_trade";
import { buildLondonTradeSales } from "../../src/lib/spine/country_depth_rows";
import { SLUG_TO_INDUSTRY } from "../../src/lib/taxonomy";
import { COPY } from "../../src/lib/spine/copy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-how-made";
const FILE = "data/home/method.json";
const REMEDY = "re-run python -P scripts/data/home/export_home.py method, never edit data/home by hand; then draw section 4 from the slice and the repo's own counts";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY }); };

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
    const table = JSON.parse(readFileSync(src.path, "utf8")) as { match?: Record<string, unknown>; source?: unknown };
    const differs = [...(["notices", "names", "matched_names", "unmatched_notices"] as const).filter((k) => table.match?.[k] !== d[k]), ...(table.source !== d.source ? ["source"] : [])];
    check(`the four counts and the source line are the table's own, read again here${differs.length ? `: differs on ${differs.join(", ")}` : ""}`, differs.length === 0);
  }
}

/* THE BUILDER (plan Task 12). */
const built = buildHowMade();
check("section 4 builds", !!built);
if (built && d) {
  const n = (v: number) => v.toLocaleString("en-US");
  check(`the focal is the slice's notices, ${built.notices.figure}`, built.notices.figure === n(d.notices) && built.notices.prov.src === "home/method.json:notices" && built.notices.prov.kind === "counted");
  const row = (key: string) => built.rows.find((r) => r.key === key);
  check(`the names matched are the slice's, of its names (${row("matched")?.value})`, row("matched")?.value === `${n(d.matched_names)} of ${n(d.names)}`);
  const trades = Object.keys((turnoverJson as { trades: Record<string, unknown> }).trades).filter((s) => Object.hasOwn(SLUG_TO_INDUSTRY, s) && londonTradeSales(s)?.q50.open === false).length;
  check(`the London trade pages read from the band counts are counted (${row("trades")?.value}; the UK page's money card ranks ${buildLondonTradeSales()?.rows.length} of them, one a code)`, row("trades")?.value === n(trades) && trades >= (buildLondonTradeSales()?.rows.length ?? Number.POSITIVE_INFINITY));
  check("no row counts countries (his ruling of 2026-10-07: the home's 195 counter is wrong)", !built.rows.some((r) => /countr/i.test(r.label)) && !Object.keys(COPY.home.howMade).includes("countries"));
  check("every figure says where it came from", built.rows.every((r) => r.prov.src.length > 0 && r.prov.kind === "counted"));
  check("the door goes to About the figures", built.link.href === "/about-data" && built.link.label === COPY.home.howMade.link);
  const words = built.notices.words.split(/\s+/).filter(Boolean).length;
  check(`the focal's line is twelve words at most, no semicolon ("${built.notices.words}")`, words <= 12 && !built.notices.words.includes(";"));
  check(`the title is four words at most, and every row's label three ("${COPY.home.howMade.kicker}")`, COPY.home.howMade.kicker.split(/\s+/).length <= 4 && built.rows.every((r) => r.label.split(/\s+/).length <= 3));
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log(homePassLine("home/how_made", held));
