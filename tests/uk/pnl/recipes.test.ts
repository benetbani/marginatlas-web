/**
 * Every recipe keeps the protocol in src/lib/uk/pnl/recipes.ts, and its London figures pass two screens before a page may
 * print them: at least a quarter of the registered businesses reach break-even (a trade whose average premises needs more
 * than three in four of its businesses take is a recipe or a premises mismatch, not a finding), and the median business's
 * margin is above 0 and below 60% (beyond that a cost line is missing).
 *
 * Run: npx tsx tests/uk/pnl/recipes.test.ts
 */
import fs from "node:fs";
import { RECIPES } from "../../../src/lib/uk/pnl/recipes";
import { londonTradeSummary, londonWithholding } from "../../../src/lib/uk/pnl/london";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-pnl-recipes";
const FILE = "src/lib/uk/pnl/recipes.ts";
const REMEDY = "rebuild the recipe from its research file by the protocol at the top of recipes.ts; never loosen a screen to admit a recipe";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

type Fact = { metric: string; value: unknown };
const PREMISES_DRIVER = /rent|occupancy|facility/i;

function drivers(file: string): { name: string; pct: number }[] {
  const facts = (JSON.parse(fs.readFileSync(file, "utf8")) as { facts: Fact[] }).facts;
  const names = facts.filter((f) => f.metric === "cost_structure.cost_drivers.*.name").map((f) => String(f.value));
  const pcts = facts.filter((f) => f.metric === "cost_structure.cost_drivers.*.pct_of_revenue").map((f) => Number(f.value));
  return names.map((name, i) => ({ name, pct: pcts[i] }));
}

check("nail salons' commission is its basis exactly: 40% of sales on five technicians of six", RECIPES["nail-salons"].variable[0].shareOfSales === (0.4 * 5) / 6);
check("seven recipes, each keyed by its own trade", Object.keys(RECIPES).length === 7 && Object.entries(RECIPES).every(([slug, r]) => r.trade === slug));
for (const [slug, r] of Object.entries(RECIPES)) {
  const entity = slug.replace(/-/g, "_");
  check(`${slug}: its research file is its own (data/facts/industry/${entity}.json)`, r.research === `data/facts/industry/${entity}.json` && fs.existsSync(r.research));
  const ds = drivers(r.research);
  const lines = [...r.variable, ...r.sized];
  const v = r.variable.reduce((a, x) => a + x.shareOfSales, 0), s = r.sized.reduce((a, x) => a + x.shareOfSales, 0);
  check(`${slug}: every share is in (0, 1) and together they leave something of each pound (${(v + s).toFixed(4)})`, lines.every((x) => x.shareOfSales > 0 && x.shareOfSales < 1) && v + s < 1);
  check(`${slug}: every line is an estimate with a basis`, lines.every((x) => x.kind === "estimate" && x.basis.trim().length > 0));
  const named = (x: { driver: string }) => ds.find((d) => d.name === x.driver);
  check(`${slug}: every line names one of its research drivers`, lines.every((x) => named(x) !== undefined));
  check(`${slug}: a line carries its driver's share, a commission at most that (the owner's chair is paid by the profit)`,
    lines.every((x) => { const d = named(x); if (!d) return false; return /commission/i.test(x.key) ? /commission/i.test(d.name) && x.shareOfSales <= d.pct / 100 : Math.abs(d.pct / 100 - x.shareOfSales) < 1e-9; }));
  const carried = lines.map((x) => x.driver);
  check(`${slug}: every driver is classed once: premises dropped (rent and rates are measured), every other carried exactly once`,
    ds.every((d) => (PREMISES_DRIVER.test(d.name) ? !carried.includes(d.name) : carried.filter((c) => c === d.name).length === 1)));
  check(`${slug}: utilitiesCarried is ${r.utilitiesCarried}, as its drivers say`, r.utilitiesCarried === ds.some((d) => /utilit/i.test(d.name) && !PREMISES_DRIVER.test(d.name)));
  const why = londonWithholding(slug);
  check(`${slug}: its London money can be built${why ? ` (withheld: ${why})` : ""}`, why === null);
  const sum = londonTradeSummary(slug);
  const share = sum?.shareAbove?.value ?? 0;
  check(`${slug}: at least a quarter of registered businesses reach break-even (${share.toFixed(4)})`, share >= 0.25);
  const m = sum?.marginAtMedian ?? 0;
  check(`${slug}: the median business's margin is above 0 and below 60% (${m.toFixed(4)})`, m > 0 && m < 0.6);
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/pnl/recipes: all pass");
