/**
 * verify_cell_data.mjs - the spine-2 cell-file reconciliation gate.
 *
 * Standalone (NOT wired into prebuild yet; Wave 5 does that). Run:
 *   node scripts/verify_cell_data.mjs [path-to-cell-json]
 *
 * Checks, per the schema-owner brief:
 *  (a) modelRoom arithmetic: revenue x (1 - food%) - staff - rent - running
 *      equals ownerKeeps within $500
 *  (b) staff roster (all-in) sums to the staff line within 3%
 *  (c) rent + rates matches the 3C public-input build within 1%
 *  (d) every figure has a valid tier; every non-measured figure has a basis
 *  (e) population quartiles are ordered p25 < p50 < p75
 *  (f) currency: usd ~= gbp x pinned rate within 1% wherever both exist
 *  (g) no source-agency name appears in any user-facing string (basis,
 *      claim, reality, reason) - extends the verify_no_source_agencies list
 *      with the UK agencies this cell draws on
 *  (+) opening total equals the sum of its taken components within 1%;
 *      cash-before-open equals opening + trade-build losses within 1%;
 *      the daily floor re-derives from the cost stack within $5
 *
 * Exits 1 with the offending figures printed.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const file = resolve(
  process.cwd(),
  process.argv[2] ?? "data/cells/restaurants-in-london.json",
);
const cell = JSON.parse(readFileSync(file, "utf-8"));

/** The 3C rebuild of the modelled room's rent + rates, GBP native:
 * 100 sqm x 437 GBP/sqm rent = 43,700; RV 43,700 x 0.382 = 16,693 rates. */
const RENT_AND_RATES_3C_GBP = 60393;

const TIERS = new Set(["measured", "built", "thin"]);

/* Agency list: the tokens from scripts/verify_no_source_agencies.ts, plus
 * the UK agencies and dataset names this cell's research drew on. Short
 * tokens are matched on word boundaries to avoid false positives. */
const AGENCY_TOKENS = [
  "Eurostat", "Destatis", "INSEE", "ISTAT", "e-Stat", "IBGE", "INEGI",
  "OECD", "ONS", "NOMIS", "Nomis", "StatCan", "US Census", "Census Bureau",
  "World Bank", "VOA", "DESNZ", "HMRC", "DBT", "Companies House",
  "GOV.UK", "gov.uk", "ASHE", "IDBR", "Food Standards Agency", "CIPD",
  "Valuation Office",
];

const failures = [];
const fail = (rule, path, msg) => failures.push(`[${rule}] ${path}: ${msg}`);

const isFigure = (o) =>
  o !== null && typeof o === "object" && !Array.isArray(o) &&
  (typeof o.tier === "string" || o.value === null);

/* ------------------------- (d)(g) walk all figures ------------------------ */

const USER_FACING_KEYS = ["basis", "claim", "reality", "reason"];

function agencyScan(text, path, key) {
  for (const token of AGENCY_TOKENS) {
    const re = token.length <= 5
      ? new RegExp(`(^|[^A-Za-z])${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^A-Za-z]|$)`)
      : new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    if (re.test(text)) {
      fail("g", `${path}.${key}`, `source-agency leak "${token}" in user-facing string: "${text.slice(0, 80)}..."`);
    }
  }
}

function walk(node, path) {
  if (node === null || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((item, i) => walk(item, `${path}[${i}]`));
    return;
  }
  if (isFigure(node)) {
    if (node.value === null) {
      if (typeof node.reason !== "string" || node.reason.length === 0) {
        fail("d", path, "null figure without a reason");
      }
    } else {
      if (!TIERS.has(node.tier)) {
        fail("d", path, `invalid or missing tier "${node.tier}"`);
      }
      if (node.tier !== "measured" && (typeof node.basis !== "string" || node.basis.trim().length === 0)) {
        fail("d", path, `non-measured figure (tier "${node.tier}") without a basis`);
      }
      if (!("claim" in node) && (typeof node.unit !== "string" || node.unit.length === 0)) {
        fail("d", path, "figure without a unit");
      }
    }
  }
  for (const key of USER_FACING_KEYS) {
    if (typeof node[key] === "string") agencyScan(node[key], path, key);
  }
  for (const [k, v] of Object.entries(node)) {
    if (k === "sources") continue; // metadata only, never rendered
    walk(v, path ? `${path}.${k}` : k);
  }
}
walk(cell, "");

/* --------------------------- (f) currency check --------------------------- */

const rate = cell.meta?.currency?.usdPerGbp;
if (typeof rate !== "number" || !(rate > 0)) {
  fail("f", "meta.currency.usdPerGbp", `pinned rate missing or invalid: ${rate}`);
}

function checkPair(usd, gbp, path) {
  if (typeof usd !== "number" || typeof gbp !== "number") return;
  if (usd === 0 && gbp === 0) return;
  const expected = gbp * rate;
  const denom = Math.max(Math.abs(usd), 1e-9);
  const err = Math.abs(usd - expected) / denom;
  if (err > 0.01) {
    fail("f", path, `usd ${usd} vs gbp ${gbp} x ${rate} = ${expected.toFixed(2)} (off ${(err * 100).toFixed(2)}%)`);
  }
}

function walkCurrency(node, path) {
  if (node === null || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((item, i) => walkCurrency(item, `${path}[${i}]`));
    return;
  }
  if ("gbp" in node) {
    if (typeof node.gbp === "number") {
      checkPair(node.value, node.gbp, path);
    } else if (node.gbp !== null && typeof node.gbp === "object") {
      checkPair(node.lo, node.gbp.lo, `${path}.lo`);
      checkPair(node.hi, node.gbp.hi, `${path}.hi`);
      if ("taken" in node.gbp) checkPair(node.taken, node.gbp.taken, `${path}.taken`);
    }
  }
  for (const [k, v] of Object.entries(node)) {
    if (k === "sources") continue;
    walkCurrency(v, path ? `${path}.${k}` : k);
  }
}
walkCurrency(cell, "");

/* ------------------------ (a) modelRoom arithmetic ------------------------ */

const m = cell.modelRoom;
const point = (f) => (f && typeof f.taken === "number" ? f.taken : f?.value);

const revenue = point(m?.revenue);
const foodPct = point(m?.food?.pct);
const staffLine = point(m?.staff?.line);
const rentTotal = point(m?.rentAndRates?.total);
const runningTotal = point(m?.running?.total);
const ownerKeeps = point(m?.ownerKeeps);

if ([revenue, foodPct, staffLine, rentTotal, runningTotal, ownerKeeps].some((v) => typeof v !== "number")) {
  fail("a", "modelRoom", "one of revenue / food.pct / staff.line / rentAndRates.total / running.total / ownerKeeps is missing");
} else {
  const derived = revenue * (1 - foodPct / 100) - staffLine - rentTotal - runningTotal;
  if (Math.abs(derived - ownerKeeps) > 500) {
    fail("a", "modelRoom.ownerKeeps",
      `revenue x (1 - food%) - staff - rent - running = ${derived.toFixed(0)} but ownerKeeps = ${ownerKeeps} (off $${Math.abs(derived - ownerKeeps).toFixed(0)}, tolerance $500)`);
  }
}

/* --------------------------- (b) roster vs line --------------------------- */

const rosterAllIn = point(m?.staff?.rosterAllIn);
if (typeof rosterAllIn === "number" && typeof staffLine === "number") {
  const err = Math.abs(rosterAllIn - staffLine) / staffLine;
  if (err > 0.03) {
    fail("b", "modelRoom.staff.rosterAllIn",
      `roster all-in ${rosterAllIn} vs staff line ${staffLine} (off ${(err * 100).toFixed(1)}%, tolerance 3%)`);
  }
  const wageSum = (m.staff.roster ?? []).reduce((acc, r) => acc + (r.wage?.value ?? 0), 0);
  const rosterWages = point(m.staff.rosterWages);
  if (typeof rosterWages === "number" && Math.abs(wageSum - rosterWages) > rosterWages * 0.005) {
    fail("b", "modelRoom.staff.rosterWages",
      `roster role wages sum to ${wageSum} but rosterWages says ${rosterWages}`);
  }
} else {
  fail("b", "modelRoom.staff", "rosterAllIn or staff line missing");
}

/* --------------------------- (c) rent 3C build ---------------------------- */

const rentGbp = m?.rentAndRates?.total?.gbp;
if (typeof rentGbp !== "number") {
  fail("c", "modelRoom.rentAndRates.total.gbp", "missing GBP native for the rent + rates total");
} else {
  const err = Math.abs(rentGbp - RENT_AND_RATES_3C_GBP) / RENT_AND_RATES_3C_GBP;
  if (err > 0.01) {
    fail("c", "modelRoom.rentAndRates.total",
      `GBP ${rentGbp} vs 3C build ${RENT_AND_RATES_3C_GBP} (off ${(err * 100).toFixed(2)}%, tolerance 1%)`);
  }
}

/* ------------------------- (e) quartiles ordered -------------------------- */

const q = cell.population?.quartiles;
if (!q?.p25 || !q?.p50 || !q?.p75) {
  fail("e", "population.quartiles", "p25/p50/p75 missing");
} else if (!(q.p25.value < q.p50.value && q.p50.value < q.p75.value)) {
  fail("e", "population.quartiles",
    `not ordered: p25 ${q.p25.value} / p50 ${q.p50.value} / p75 ${q.p75.value}`);
}

/* ---------------------- (+) internal sum consistency ---------------------- */

const o = cell.opening;
if (o) {
  const parts = [o.fitout, o.depositAndFirstRent, o.openingStock, o.companyRegistration, o.foodBusinessRegistration, o.licence, o.insuranceYear1];
  const sum = parts.reduce((acc, f) => acc + (point(f) ?? 0), 0);
  const total = point(o.total);
  if (typeof total === "number" && Math.abs(sum - total) / total > 0.01) {
    fail("+", "opening.total", `component takens sum to ${sum} but total says ${total} (tolerance 1%)`);
  }
}

const y = cell.year1;
if (y) {
  const expected = (point(y.openingCosts) ?? 0) + (point(y.tradeBuildLosses) ?? 0);
  const got = point(y.cashBeforeOpen);
  if (typeof got === "number" && Math.abs(expected - got) / got > 0.01) {
    fail("+", "year1.cashBeforeOpen", `openingCosts + tradeBuildLosses = ${expected} but cashBeforeOpen says ${got}`);
  }
  const oc = point(y.openingCosts);
  const ot = point(cell.opening?.total);
  if (typeof oc === "number" && typeof ot === "number" && oc !== ot) {
    fail("+", "year1.openingCosts", `duplicates opening.total but differs: ${oc} vs ${ot}`);
  }
}

const days = point(m?.assumptions?.openDaysPerYear);
const committed = point(m?.dailyFloor?.committedCostPerOpenDay);
if (typeof days === "number" && typeof committed === "number") {
  const derived = (staffLine + rentTotal + runningTotal) / days;
  if (Math.abs(derived - committed) > 5) {
    fail("+", "modelRoom.dailyFloor.committedCostPerOpenDay",
      `(staff + rent + running) / ${days} = ${derived.toFixed(0)} but figure says ${committed}`);
  }
  const breakeven = point(m.dailyFloor.breakevenTakings);
  if (typeof breakeven === "number") {
    const derivedBe = derived / (1 - foodPct / 100);
    if (Math.abs(derivedBe - breakeven) > 5) {
      fail("+", "modelRoom.dailyFloor.breakevenTakings",
        `committed / (1 - food%) = ${derivedBe.toFixed(0)} but figure says ${breakeven}`);
    }
  }
}

/* --------------------------------- report --------------------------------- */

if (failures.length > 0) {
  console.error(`✗ verify_cell_data: ${failures.length} failure(s) in ${file}\n`);
  for (const f of failures) console.error("  " + f);
  process.exit(1);
}

console.log(`✓ verify_cell_data: ${file}`);
console.log("  (a) modelRoom arithmetic closes within $500");
console.log("  (b) staff roster reconciles with the staff line within 3%");
console.log("  (c) rent + rates matches the 3C public-input build within 1%");
console.log("  (d) every figure tiered; every non-measured figure carries a basis");
console.log("  (e) population quartiles ordered");
console.log("  (f) USD/GBP consistent at the pinned rate within 1%");
console.log("  (g) no source-agency names in user-facing strings");
console.log("  (+) opening / year-1 / daily-floor sums internally consistent");
