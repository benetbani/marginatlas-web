/**
 * scripts/verify_money_shown_own_rows.ts , THE TRADE PAGE PRINTS A TAKE-HOME
 * ONLY OFF A ROW OF ITS OWN (QUEUE trust:revenue-filled, launch-blocking,
 * 2026-09-19; the controller's step between plan steps 34 and 35).
 *
 * WHAT IT ASSERTS. For every prerendered trade cell, the trade page's money
 * gate (`moneyShown`, src/lib/cells/cell_view.ts, carried to the seed as
 * `meta.money_shown` by src/lib/spine/adapt_cell.ts and read by every
 * builder on the page) is true only where the figures are the place's own:
 * the curated London entry (getLondonEntry, whose take-home and margin rest
 * on no row), or a cell the trust gate passes (src/lib/cells/trust.ts, six
 * guards, the sixth the fill mark `_revenueFilled` that fillMissingFields
 * sets when it supplied the headline revenue from a per-industry anchor)
 * whose net margin is the engine's own reading and not the clamp's 3 percent
 * floor (src/lib/finance/margin_floor.ts; raw against clamped, as
 * across_cities.ts records `netMarginFloored`). Two lines per cell:
 *   1. money shown off the London entry implies the row is not filled and
 *      the margin is not the floor;
 *   2. a take-home on the seed (`ownerTakeHome`, the figure `00 take` prints
 *      at 40 through tradeHeroFacts) exists only where money is shown.
 * A cell failing either is a take-home printed off a filled or floored row,
 * the fault the third dispatch of plan step 34 found (945 filled and 22
 * floored of the slate's 1,029 resolved rows; Paris plumbers printed $19.5K
 * at 3 percent as the city's own), and the gate exits 1 naming it.
 *
 * THE WALK SET, read from the route files themselves so the list cannot drift
 * from what the build prerenders: the tuples inside `generateStaticParams` of
 * src/app/[country]/[geo]/[industry]/page.tsx (the cell route) and of its
 * opening/page.tsx (the opening route, which reads the same gate), plus the
 * sheet's exemplars (CELL_INSTANCES in src/lib/spine/trade_hero_facts.ts),
 * which are the cells the stories draw. Thirty-one routes on 2026-09-19 (forty
 * before the opening route's list was trimmed from twenty to the eight that
 * resolve under the sixth guard), walked in about fifteen seconds. `--slate`
 * widens the walk to the fifteen-city slate
 * (src/lib/markets/major_cities.ts) times the 243 trades, the across route's
 * and the industry page's cells, about eight minutes, for the counts by hand;
 * `--json=<path>` writes every row walked.
 *
 * WHAT IT PRINTS beside the verdict: the counts (walked, resolved, trusted,
 * money shown, filled, floored, London entries) and the same by country, so
 * the record can say what the gate lets through and where.
 *
 * THE BLIND SPOT, stated. The walk resolves cells through the database
 * (loadCellView runs getCellBySlug), so it needs NEXT_PUBLIC_SUPABASE_URL to
 * start (src/lib/supabase.ts constructs the client at import; .env.local is
 * loaded below the way scripts/harness/env.cjs loads it for the renders) and
 * says whether it had one. A lookup that times out or fails falls back to the
 * synthesized stand-in (cells.ts), which the trust gate refuses, so such a
 * cell passes here VACUOUSLY: this gate cannot distinguish "the row is not the
 * city's own" from "the database did not answer in its budget". The one
 * instrument is the query ledger (src/lib/query_log.ts): its non-ok outcomes
 * are counted and printed, and a run where EVERY walked cell resolved
 * synthetic is named as a run that proved nothing, not as a pass with digits.
 * Like pages-fresh, it does not red on a slow table: a deploy must not fall to
 * a network blip (CLAUDE.md), and the fault this gate exists for is in code,
 * not in the database's mood. Also unseen: the legacy cell page and the
 * neighbourhood route build the same view with their own floored flag
 * (page.tsx, [sub]/page.tsx); their moneyShown is the same function's and is
 * not walked here.
 *
 * PLANTED ONCE, 2026-09-19: the sixth guard was removed from trust.ts and the
 * gate ran red on eight of the forty routes it walked that day (the opening
 * route's list still at twenty), each named with its route and its
 * figures (de/berlin/restaurants at $49,092 and 11.3 percent, gb/london/
 * shoe-repair at $64,355, the other filled rows off the London entry; the
 * four filled rows that are also floored stayed withheld by the floor in
 * cell_view.ts, which is the other half of the gate doing its work); the
 * guard restored, green on the same forty. The plant's output is in the
 * loop's DEBUG row.
 *
 * Run: npx tsx scripts/verify_money_shown_own_rows.ts [--slate] [--json=<path>]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { red, redSummary } from "./lib/red";

const RULE = "money-shown-own-rows";
const CELL_ROUTE = "src/app/[country]/[geo]/[industry]/page.tsx";
const OPENING_ROUTE = "src/app/[country]/[geo]/[industry]/opening/page.tsx";
const VIEW = "src/lib/cells/cell_view.ts";
const REMEDY = `read ${VIEW} (moneyShown) and src/lib/cells/trust.ts (the sixth guard): a take-home prints only off the London entry or a trusted, unfloored row`;

type Route = [string, string, string];

/* .env.local the way the harness preload loads it; the value is never read here. */
try { process.loadEnvFile(".env.local"); } catch { /* no env file: the adapter says so */ }

const slate = process.argv.includes("--slate");
const jsonOut = process.argv.find((a) => a.startsWith("--json="))?.slice(7);

/** The `{ country, geo, industry }` tuples inside a route file's generateStaticParams, read as text so nothing of the page is imported. */
function staticParamsOf(file: string): Route[] {
  const src = readFileSync(file, "utf8");
  const start = src.indexOf("generateStaticParams");
  if (start === -1) return [];
  const body = src.slice(start);
  const end = body.indexOf("\n}\n");
  const fn = end === -1 ? body : body.slice(0, end);
  const out: Route[] = [];
  for (const m of fn.matchAll(/country:\s*"([^"]+)",\s*geo:\s*"([^"]+)",\s*industry:\s*"([^"]+)"/g)) out.push([m[1], m[2], m[3]]);
  return out;
}

async function main() {
  const routes = new Map<string, { route: Route; sets: string[] }>();
  const add = (r: Route, set: string) => {
    const k = r.join("/");
    const e = routes.get(k);
    if (e) e.sets.push(set); else routes.set(k, { route: r, sets: [set] });
  };
  const cellStatic = staticParamsOf(CELL_ROUTE);
  const openingStatic = staticParamsOf(OPENING_ROUTE);
  for (const r of cellStatic) add(r, "cell");
  for (const r of openingStatic) add(r, "opening");
  if (cellStatic.length === 0 || openingStatic.length === 0) {
    red({ rule: RULE, file: cellStatic.length === 0 ? CELL_ROUTE : OPENING_ROUTE, detail: "no static params could be read out of generateStaticParams", remedy: "the route's list changed shape; read it and mend staticParamsOf in this gate" });
    redSummary(RULE, 1, "the walk set must be read off the route files");
    process.exit(1);
  }

  const { CELL_INSTANCES } = await import("../src/lib/spine/trade_hero_facts");
  for (const [handle, inst] of Object.entries(CELL_INSTANCES)) add(inst.route, `sheet:${handle}`);
  if (slate) {
    const { MAJOR_CITIES } = await import("../src/lib/markets/major_cities");
    const { ALL_INDUSTRIES, industryToSlug } = await import("../src/lib/taxonomy");
    for (const city of MAJOR_CITIES) for (const ind of ALL_INDUSTRIES) add([city.country, city.slug, industryToSlug(ind.id)], "slate");
  }

  const urlPresence = process.env.NEXT_PUBLIC_SUPABASE_URL ? "present" : "ABSENT";
  console.log(`${RULE}: walking ${routes.size} routes (${cellStatic.length} cell static params, ${openingStatic.length} opening static params, ${Object.keys(CELL_INSTANCES).length} sheet exemplars${slate ? ", the slate" : ""}; Supabase URL ${urlPresence})`);

  const { loadCellView } = await import("../src/lib/spine/adapt_cell");
  const { queryLedger } = await import("../src/lib/query_log");

  type Row = { route: string; country: string; sets: string[]; resolved: boolean; synthetic: boolean; trusted: boolean; london: boolean; moneyShown: boolean; filled: boolean; floored: boolean; takeHome: number | null; netMarginPct: number | null; error?: string };
  const rows: Row[] = [];
  const findings: Array<{ file: string; detail: string }> = [];
  const started = Date.now();
  let n = 0;
  for (const { route, sets } of routes.values()) {
    const [country, geo, industry] = route;
    const key = route.join("/");
    let row: Row = { route: key, country, sets, resolved: false, synthetic: false, trusted: false, london: false, moneyShown: false, filled: false, floored: false, takeHome: null, netMarginPct: null };
    try {
      const loaded = await loadCellView(country, geo, industry);
      if (loaded) {
        row = {
          ...row,
          resolved: true,
          synthetic: !!loaded.cell.is_synthetic,
          trusted: loaded.trustedLocalCell,
          london: loaded.isLondon,
          moneyShown: loaded.moneyShown,
          filled: loaded.revenueFilled,
          floored: loaded.netMarginFloored,
          takeHome: loaded.ownerTakeHome,
          netMarginPct: loaded.netMarginPct,
        };
      }
    } catch (e) {
      row.error = String((e as Error)?.message ?? e);
    }
    rows.push(row);
    /* Line 1: money shown off the London entry implies a row of its own. */
    if (row.moneyShown && !row.london && (row.filled || row.floored)) {
      findings.push({ file: VIEW, detail: `/${key}: money shown on a ${row.filled ? "filled" : ""}${row.filled && row.floored ? " and " : ""}${row.floored ? "floored" : ""} row off the London entry (take-home ${row.takeHome == null ? "none" : "$" + Math.round(row.takeHome).toLocaleString("en-US")}, net ${row.netMarginPct == null ? "none" : row.netMarginPct.toFixed(1) + "%"})` });
    }
    /* Line 1, the other half: money shown implies the London entry or a trusted cell. */
    if (row.moneyShown && !row.london && !row.trusted) {
      findings.push({ file: VIEW, detail: `/${key}: money shown on a cell the trust gate refuses, off the London entry` });
    }
    /* Line 2: a take-home on the seed only where money is shown. */
    if (row.takeHome != null && !row.moneyShown) {
      findings.push({ file: "src/lib/spine/adapt_cell.ts", detail: `/${key}: the seed carries a take-home ($${Math.round(row.takeHome).toLocaleString("en-US")}) with money not shown` });
    }
    if (row.error) findings.push({ file: "src/lib/spine/adapt_cell.ts", detail: `/${key}: loadCellView threw: ${row.error}` });
    n++;
    if (slate && n % 250 === 0) console.log(`  ${n} of ${routes.size} (${((Date.now() - started) / 1000).toFixed(0)}s)`);
  }

  if (jsonOut) writeFileSync(jsonOut, JSON.stringify({ at: new Date().toISOString(), slate, rows }, null, 1));

  /* The counts, whole and by country. */
  const count = (rs: Row[]) => ({ walked: rs.length, resolved: rs.filter((r) => r.resolved && !r.synthetic).length, synthetic: rs.filter((r) => r.synthetic).length, trusted: rs.filter((r) => r.trusted).length, moneyShown: rs.filter((r) => r.moneyShown).length, filled: rs.filter((r) => r.filled).length, floored: rs.filter((r) => r.floored).length, london: rs.filter((r) => r.london).length });
  const all = count(rows);
  console.log(`  walked ${all.walked}: resolved ${all.resolved}, synthetic ${all.synthetic}, trusted ${all.trusted}, money shown ${all.moneyShown} (London entry ${all.london}), filled ${all.filled}, floored ${all.floored}`);
  const countries = [...new Set(rows.map((r) => r.country))].sort();
  console.log("  country  walked  trusted  money  filled  floored  london");
  for (const c of countries) {
    const k = count(rows.filter((r) => r.country === c));
    console.log(`  ${c.padEnd(8)} ${String(k.walked).padStart(6)}  ${String(k.trusted).padStart(7)}  ${String(k.moneyShown).padStart(5)}  ${String(k.filled).padStart(6)}  ${String(k.floored).padStart(7)}  ${String(k.london).padStart(6)}`);
  }
  const nonOk = queryLedger.filter((q) => q.outcome !== "ok");
  console.log(`  query outcomes not ok: ${nonOk.length}${nonOk.length ? " (" + [...new Set(nonOk.map((q) => q.label.split(":")[0]))].join(", ") + "; a cell whose lookup fell back resolves synthetic and passes here vacuously)" : ""}`);
  if (all.walked > 0 && all.resolved === 0) {
    console.log(`  EVERY WALKED CELL RESOLVED SYNTHETIC: the database did not answer (Supabase URL ${urlPresence}); this run proved nothing about the gate and is not a pass with digits`);
  }
  console.log(`  ${((Date.now() - started) / 1000).toFixed(1)} s`);

  for (const f of findings) red({ rule: RULE, ...f, remedy: REMEDY });
  if (findings.length) {
    redSummary(RULE, findings.length, REMEDY, `${all.walked} walked`);
    process.exit(1);
  }
  console.log(`${RULE}: PASS (${all.walked} walked, ${all.moneyShown} show money, none off a filled or floored row but through the London entry)`);
}

main().catch((e) => {
  red({ rule: RULE, file: "scripts/verify_money_shown_own_rows.ts", detail: `the gate threw: ${String((e as Error)?.message ?? e)}`, remedy: "run it alone and read the error; a missing NEXT_PUBLIC_SUPABASE_URL stops the adapter at import" });
  process.exit(1);
});
