/**
 * scripts/verify_cell_lattice.mjs , THE NUMBER GATE, JSON layer.
 *
 * verify_lattice.mjs asserts the same relationships against the three frozen
 * MOCKUPS. The mockups are one city and one trade; they stop being the product
 * the moment the port reads real files. This gate is the mockup gate's
 * successor: it runs the MODEL and LATTICE checks over EVERY file in
 * data/cells/, so the arithmetic that four review rounds kept getting wrong
 * cannot come back with country #2.
 *
 *   node scripts/verify_cell_lattice.mjs                 every data/cells/*.json
 *   node scripts/verify_cell_lattice.mjs path/to/one.json  one file
 *
 * Exit 1 on any failure, with the offending figures printed.
 *
 * ---------------------------------------------------------------------------
 * DIVISION OF LABOUR with scripts/verify_cell_data.mjs (the schema owner's gate)
 *
 *   verify_cell_data     ONE file, deep: the London-pinned 3C rent + rates
 *                        build, quartile ordering, and the opening / year-one /
 *                        daily-floor sum consistency. Those are schema-shape
 *                        and single-city build checks and are NOT repeated here.
 *   verify_cell_lattice  EVERY file, the invariants: M1 revenue identity,
 *                        M2 cost stack, M3 roster, M7 one-object/no-divergent-
 *                        duplicate, provenance, currency, and the cross-cell
 *                        lattice. These are re-asserted here rather than
 *                        delegated because verify_cell_data carries city-pinned
 *                        constants (RENT_AND_RATES_3C_GBP) that would fire
 *                        falsely on the second city, so it cannot be run over
 *                        the glob as-is.
 * ---------------------------------------------------------------------------
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { resolve, join, basename } from "node:path";

const ROOT = process.cwd();
const CELL_DIR = resolve(ROOT, "data/cells");
const COUNTRY_DIR = resolve(ROOT, "data/countries");

/* ---------------------------------------------------------------- files --- */
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
let files;
if (args.length) {
  files = args.map((a) => resolve(ROOT, a));
} else {
  if (!existsSync(CELL_DIR)) {
    console.error(`x verify_cell_lattice: ${CELL_DIR} does not exist. The gate has nothing to guard, which is a failure, not a pass.`);
    process.exit(1);
  }
  files = readdirSync(CELL_DIR).filter((f) => f.endsWith(".json")).map((f) => join(CELL_DIR, f));
}
if (!files.length) {
  console.error("x verify_cell_lattice: no cell files matched. A gate with nothing to check has not passed.");
  process.exit(1);
}

/* ------------------------------------------------------------- reporting --- */
const fails = [];
const notes = [];
const deferred = [];
const fail = (id, file, msg) => fails.push(`${id.padEnd(6)} ${basename(file)}  ${msg}`);
const ok = (id, file, msg) => notes.push(`${id.padEnd(6)} ${basename(file)}  ${msg}`);
/** A check that could not run. NEVER silent: it prints, and it is counted in
 *  the summary, because "the gate went green" must never mean "the gate did
 *  nothing". */
const defer = (id, msg, willRunWhen) => deferred.push({ id, msg, willRunWhen });

const near = (a, b, tol) => Math.abs(a - b) <= tol;
const money = (n) => (typeof n === "number" ? Math.round(n).toLocaleString() : String(n));

/* ------------------------------------------------- the agency token list ---
 * Re-read from the two files that already own it, never re-typed: the site
 * gate's list plus the cell gate's UK extension. If either list cannot be
 * parsed the gate FAILS rather than scanning against an empty list, which is
 * the exact "silently passes" shape this project has been bitten by. */
function tokensFrom(path, label) {
  if (!existsSync(path)) {
    fails.push(`PROV   ${label}  cannot read the agency list at ${path}`);
    return [];
  }
  const src = readFileSync(path, "utf8");
  const m = /AGENCY_TOKENS\s*(?::[^=]*)?=\s*\[([\s\S]*?)\]/.exec(src);
  if (!m) {
    fails.push(`PROV   ${label}  AGENCY_TOKENS array not found in ${path}`);
    return [];
  }
  return [...m[1].matchAll(/["']([^"']+)["']/g)].map((x) => x[1]);
}
const AGENCY_TOKENS = [...new Set([
  ...tokensFrom(resolve(ROOT, "scripts/verify_no_source_agencies.ts"), "site list"),
  ...tokensFrom(resolve(ROOT, "scripts/verify_cell_data.mjs"), "cell list"),
])];
if (AGENCY_TOKENS.length < 10) {
  fails.push(`PROV   agency list  only ${AGENCY_TOKENS.length} tokens parsed; refusing to scan against a stub list`);
}

/* Strings a reader actually sees. `sources`, `notes` and `falsifier` are
 * editorial metadata for the research trail and are excluded, exactly as
 * verify_cell_data excludes `sources`. */
const USER_FACING_KEYS = ["basis", "claim", "reality", "reason", "description", "label", "caption", "title", "role"];
const METADATA_KEYS = new Set(["sources", "notes", "falsifier", "provenance", "freshnessWatch", "correctionsOutOfScope"]);

const TIERS = new Set(["measured", "built", "thin"]);

/* --------------------------------------------------------------- M7 rules ---
 * Paths that hold the SAME quantity on purpose. Divergence here is the M7
 * defect in its purest form: one number, two homes, edited once. */
const ALIASES = [
  { a: "population.medianRevenue", b: "population.quartiles.p50", why: "the median IS the p50 of the same distribution" },
  { a: "modelRoom.rentAndRates.depositAndFirstRent", b: "opening.depositAndFirstRent", why: "one deposit, quoted in the cost stack and in the opening bill" },
];

/* Leaf names too generic to imply "same quantity". A collision on one of these
 * is reported as a note, not a failure; a collision on a compound name
 * (openingCosts, depositAndFirstRent, cashBeforeOpen) is the defect. */
const GENERIC_LEAVES = new Set([
  "pct", "total", "value", "cost", "line", "wage", "count", "share", "rate",
  "amount", "days", "pos", "mid", "lo", "hi", "p25", "p50", "p75", "sites",
  "median", "proxy", "sub", "num",
]);

/* Figures that are national, not city-level: two cells in one country must
 * print the same number or one of them is wrong. */
const NATIONAL_PATHS = [
  "opening.companyRegistration",
  "opening.foodBusinessRegistration",
];

/* ------------------------------------------------------------- utilities --- */
const isFigure = (o) =>
  o !== null && typeof o === "object" && !Array.isArray(o) &&
  (typeof o.tier === "string" || o.value === null);

/** The single number a figure stands for: `taken` when it is a range. */
const point = (f) => {
  if (!f || typeof f !== "object") return undefined;
  if (typeof f.taken === "number") return f.taken;
  if (typeof f.value === "number") return f.value;
  return undefined;
};

function collectFigures(cell) {
  const out = [];
  (function walk(node, path) {
    if (node === null || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach((item, i) => walk(item, `${path}[${i}]`));
      return;
    }
    if (isFigure(node)) out.push({ path, fig: node });
    for (const [k, v] of Object.entries(node)) {
      if (METADATA_KEYS.has(k)) continue;
      walk(v, path ? `${path}.${k}` : k);
    }
  })(cell, "");
  return out;
}

function at(cell, path) {
  return path.split(".").reduce((n, k) => {
    if (n == null) return undefined;
    const m = /^(.*)\[(\d+)\]$/.exec(k);
    return m ? n[m[1]]?.[Number(m[2])] : n[k];
  }, cell);
}

/* =========================================================================
   Per-file checks
   ========================================================================= */
const loaded = [];

for (const file of files) {
  let cell;
  try {
    cell = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    fail("PARSE", file, `not valid JSON: ${String(e).slice(0, 120)}`);
    continue;
  }
  loaded.push({ file, cell });

  const m = cell.modelRoom ?? {};
  const figures = collectFigures(cell);

  /* ----- M1. revenue is orders x spend x days, exactly ------------------- */
  {
    const orders = point(m.assumptions?.ordersPerDay);
    const spend = point(m.assumptions?.spendPerHead);
    const days = point(m.assumptions?.openDaysPerYear);
    const rev = point(m.revenue);
    if ([orders, spend, days, rev].some((v) => typeof v !== "number")) {
      fail("M1", file, "cannot run: one of assumptions.ordersPerDay / spendPerHead / openDaysPerYear / revenue is missing. The stated model must be reproducible from its own inputs.");
    } else {
      const calc = orders * spend * days;
      if (!near(calc, rev, 1)) {
        fail("M1", file, `revenue ${orders} orders x ${spend} x ${days} days = ${money(calc)} but the file carries ${money(rev)}`);
      } else {
        ok("M1", file, `revenue reconciles at $${money(calc)}`);
      }
      // The native currency must reproduce the same identity, or the page
      // prints a GBP scenario that is not the USD one.
      const spendGbp = m.assumptions?.spendPerHead?.gbp;
      const revGbp = m.revenue?.gbp;
      if (typeof spendGbp === "number" && typeof revGbp === "number") {
        const calcGbp = orders * spendGbp * days;
        const err = Math.abs(calcGbp - revGbp) / revGbp;
        if (err > 0.01) {
          fail("M1", file, `native: ${orders} x ${spendGbp} x ${days} = ${money(calcGbp)} but revenue.gbp is ${money(revGbp)} (off ${(err * 100).toFixed(2)}%, tolerance 1%)`);
        } else {
          ok("M1", file, `the native-currency identity holds within ${(err * 100).toFixed(2)}%`);
        }
      }
    }
  }

  /* ----- M2. the cost stack lands on what the owner keeps ---------------- */
  {
    const rev = point(m.revenue);
    const foodPct = point(m.food?.pct);
    const staff = point(m.staff?.line);
    const rent = point(m.rentAndRates?.total);
    const running = point(m.running?.total);
    const keeps = point(m.ownerKeeps);
    if ([rev, foodPct, staff, rent, running, keeps].some((v) => typeof v !== "number")) {
      fail("M2", file, "cannot run: revenue / food.pct / staff.line / rentAndRates.total / running.total / ownerKeeps incomplete");
    } else {
      const derived = rev * (1 - foodPct / 100) - staff - rent - running;
      if (!near(derived, keeps, 500)) {
        fail("M2", file, `revenue x (1 - ${foodPct}%) - staff - rent - running = ${money(derived)} but ownerKeeps is ${money(keeps)} (off $${money(Math.abs(derived - keeps))}, tolerance $500)`);
      } else {
        ok("M2", file, `the cost stack reconciles to $${money(keeps)}`);
      }
    }
  }

  /* ----- M3. the roster fits inside the staff line ----------------------- */
  {
    const staff = point(m.staff?.line);
    const allIn = point(m.staff?.rosterAllIn);
    if (typeof staff !== "number" || typeof allIn !== "number") {
      fail("M3", file, "cannot run: staff.line or staff.rosterAllIn missing. A rota with no budget to sit in is not a rota.");
    } else {
      const err = Math.abs(allIn - staff) / staff;
      if (err > 0.03) {
        fail("M3", file, `the roster all-in is $${money(allIn)} against a staff line of $${money(staff)} (off ${(err * 100).toFixed(1)}%, tolerance 3%)`);
      } else {
        ok("M3", file, `the roster fits the staff line ($${money(allIn)} of $${money(staff)}, ${(err * 100).toFixed(1)}%)`);
      }
      const roles = m.staff?.roster ?? [];
      const wageSum = roles.reduce((a, r) => a + (point(r.wage) ?? 0), 0);
      const stated = point(m.staff?.rosterWages);
      if (roles.length && typeof stated === "number") {
        if (Math.abs(wageSum - stated) > stated * 0.005) {
          fail("M3", file, `${roles.length} roles sum to $${money(wageSum)} but rosterWages says $${money(stated)}`);
        } else {
          ok("M3", file, `${roles.length} roles sum to the stated wage bill`);
        }
      }
    }
  }

  /* ----- M7. one number, one home --------------------------------------- */
  {
    /* (a) declared aliases: the same quantity written twice on purpose. */
    let checked = 0;
    for (const al of ALIASES) {
      const A = at(cell, al.a), B = at(cell, al.b);
      const a = point(A), b = point(B);
      if (typeof a !== "number" || typeof b !== "number") continue;
      checked++;
      if (Math.abs(a - b) > Math.max(1, Math.abs(a) * 0.001)) {
        fail("M7", file, `${al.a} = ${money(a)} but ${al.b} = ${money(b)}; ${al.why}`);
      }
    }
    ok("M7", file, `${checked} of ${ALIASES.length} declared aliases present and in agreement`);

    /* (b) the same label twice with two different numbers. A compound leaf
       name is a quantity's NAME; the same name on two disagreeing figures is
       a duplicated-but-divergent value, which is the defect M7 exists for. */
    const groups = new Map();
    for (const { path, fig } of figures) {
      const leaf = path.split(".").pop().replace(/\[\d+\]$/, "");
      const key = `${leaf}|${fig.unit ?? ""}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ path, leaf, v: point(fig) });
    }
    for (const [key, members] of groups) {
      if (members.length < 2) continue;
      // Siblings in one list (roster[0].wage, roster[1].wage) differ by design.
      const families = new Set(members.map((x) => x.path.replace(/\[\d+\]/g, "[]")));
      const values = new Set(members.map((x) => x.v));
      if (values.size === 1) {
        ok("M7", file, `"${key}" appears ${members.length} times and every copy agrees (${money(members[0].v)})`);
        continue;
      }
      if (families.size === 1) continue; // one array, many rows
      const leaf = members[0].leaf;
      const detail = members.map((x) => `${x.path}=${money(x.v)}`).join("  vs  ");
      if (GENERIC_LEAVES.has(leaf)) {
        ok("M7", file, `"${key}" is a generic leaf on ${members.length} distinct quantities, not a duplicate: ${detail}`);
      } else {
        fail("M7", file, `"${leaf}" names two different numbers: ${detail}. One quantity, one home, or give them different names.`);
      }
    }

    /* (c) a model figure copied outside modelRoom. The hero, the calculator
       and the method table must read ONE object; a stray copy is the drift
       the mockup gate caught as "the hero model yields X but the page prints Y". */
    const declared = new Set(ALIASES.flatMap((x) => [x.a, x.b]));
    const stack = [
      ["modelRoom.revenue", point(m.revenue)],
      ["modelRoom.staff.line", point(m.staff?.line)],
      ["modelRoom.rentAndRates.total", point(m.rentAndRates?.total)],
      ["modelRoom.running.total", point(m.running?.total)],
      ["modelRoom.food.cost", point(m.food?.cost)],
      ["modelRoom.ownerKeeps", point(m.ownerKeeps)],
    ].filter(([, v]) => typeof v === "number" && Math.abs(v) >= 1000);
    for (const { path, fig } of figures) {
      if (path.startsWith("modelRoom") || declared.has(path)) continue;
      const v = point(fig);
      if (typeof v !== "number") continue;
      for (const [name, sv] of stack) {
        if (v === sv) {
          fail("M7", file, `${path} holds ${money(v)}, the same number as ${name}. Reference the model, do not copy it, or declare the pair in ALIASES.`);
        }
      }
    }
  }

  /* ----- PROVENANCE ------------------------------------------------------ */
  {
    let tiered = 0, missingTier = 0, missingBasis = 0, leaks = 0;
    for (const { path, fig } of figures) {
      if (fig.value === null && !("taken" in fig)) {
        if (typeof fig.reason !== "string" || !fig.reason.trim()) {
          fail("PROV", file, `${path}: an absent figure with no reason. An absence must state why.`);
        }
        continue;
      }
      if (!TIERS.has(fig.tier)) {
        fail("PROV", file, `${path}: tier "${fig.tier}" is not one of measured / built / thin`);
        missingTier++;
      } else {
        tiered++;
      }
      if (fig.tier !== "measured" && (typeof fig.basis !== "string" || !fig.basis.trim())) {
        fail("PROV", file, `${path}: a ${fig.tier} figure with no basis. A number that is not measured must say how it was built.`);
        missingBasis++;
      }
    }
    /* agency leak scan over user-facing strings only */
    (function scan(node, path) {
      if (node === null || typeof node !== "object") return;
      if (Array.isArray(node)) return node.forEach((x, i) => scan(x, `${path}[${i}]`));
      for (const key of USER_FACING_KEYS) {
        const text = node[key];
        if (typeof text !== "string") continue;
        for (const token of AGENCY_TOKENS) {
          const esc = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const re = token.length <= 5
            ? new RegExp(`(^|[^A-Za-z])${esc}([^A-Za-z]|$)`)
            : new RegExp(esc, "i");
          if (re.test(text)) {
            fail("PROV", file, `${path}.${key}: source-agency leak "${token}" in a user-facing string: "${text.slice(0, 70)}..."`);
            leaks++;
          }
        }
      }
      for (const [k, v] of Object.entries(node)) {
        if (METADATA_KEYS.has(k)) continue;
        scan(v, path ? `${path}.${k}` : k);
      }
    })(cell, "");
    if (!missingTier && !missingBasis && !leaks) {
      ok("PROV", file, `${tiered} figures tiered, every built figure carries a basis, ${AGENCY_TOKENS.length} agency tokens scanned clean`);
    }
  }

  /* ----- CURRENCY -------------------------------------------------------- */
  {
    const rate = cell.meta?.currency?.usdPerGbp;
    if (typeof rate !== "number" || !(rate > 0)) {
      fail("FX", file, `meta.currency.usdPerGbp missing or invalid (${rate}); with no pinned rate the two currencies cannot be checked against each other`);
    } else {
      let pairs = 0, bad = 0;
      const checkPair = (usd, gbp, path) => {
        if (typeof usd !== "number" || typeof gbp !== "number") return;
        if (usd === 0 && gbp === 0) return;
        pairs++;
        const expected = gbp * rate;
        const err = Math.abs(usd - expected) / Math.max(Math.abs(usd), 1e-9);
        if (err > 0.01) {
          bad++;
          fail("FX", file, `${path}: usd ${money(usd)} against gbp ${money(gbp)} x ${rate} = ${money(expected)} (off ${(err * 100).toFixed(2)}%, tolerance 1%)`);
        }
      };
      (function walkFx(node, path) {
        if (node === null || typeof node !== "object") return;
        if (Array.isArray(node)) return node.forEach((x, i) => walkFx(x, `${path}[${i}]`));
        if ("gbp" in node) {
          if (typeof node.gbp === "number") checkPair(node.value, node.gbp, path);
          else if (node.gbp && typeof node.gbp === "object") {
            checkPair(node.lo, node.gbp.lo, `${path}.lo`);
            checkPair(node.hi, node.gbp.hi, `${path}.hi`);
            if ("taken" in node.gbp) checkPair(node.taken, node.gbp.taken, `${path}.taken`);
          }
        }
        for (const [k, v] of Object.entries(node)) {
          if (METADATA_KEYS.has(k)) continue;
          walkFx(v, path ? `${path}.${k}` : k);
        }
      })(cell, "");
      if (!pairs) {
        fail("FX", file, `a pinned rate of ${rate} is declared but no figure carries both currencies, so nothing was checked`);
      } else if (!bad) {
        ok("FX", file, `${pairs} currency pairs hold at the pinned ${rate}`);
      }
    }
  }
}

/* =========================================================================
   CROSS-CELL , the lattice. One cell cannot contradict itself; two cells can.
   ========================================================================= */
{
  const byCountry = new Map();
  for (const { file, cell } of loaded) {
    const c = cell.meta?.country?.slug ?? "?";
    if (!byCountry.has(c)) byCountry.set(c, []);
    byCountry.get(c).push({ file, cell });
  }

  /* X1. national constants must agree across the cells of one country. */
  let x1Ran = 0;
  for (const [country, group] of byCountry) {
    if (group.length < 2) continue;
    x1Ran++;
    const rates = new Set(group.map((g) => g.cell.meta?.currency?.usdPerGbp));
    if (rates.size > 1) {
      fail("X1", group[0].file, `${country}: cells pin different exchange rates (${[...rates].join(", ")}); one country, one pinned rate per publication`);
    }
    for (const p of NATIONAL_PATHS) {
      const vals = group.map((g) => ({ f: g.file, v: point(at(g.cell, p)) })).filter((x) => typeof x.v === "number");
      const distinct = new Set(vals.map((x) => x.v));
      if (distinct.size > 1) {
        fail("X1", vals[0].f, `${country}: ${p} differs across cells (${vals.map((x) => `${basename(x.f)}=${money(x.v)}`).join(", ")}); this is a national figure`);
      }
    }
    ok("X1", group[0].file, `${country}: ${group.length} cells agree on the pinned rate and ${NATIONAL_PATHS.length} national figures`);
  }
  if (!x1Ran) {
    defer("X1", "national-constant agreement across cells of one country did not run: no country has two cell files yet.",
      "a second cell lands in the same country");
  }

  /* X2. a city figure must sit below its country counterpart where the rule
     applies (London rent is more than twice the national rate, so the London
     keep-share cannot exceed the national one). Needs the country file. */
  const countryFiles = existsSync(COUNTRY_DIR) && statSync(COUNTRY_DIR).isDirectory()
    ? readdirSync(COUNTRY_DIR).filter((f) => f.endsWith(".json"))
    : [];
  if (!countryFiles.length) {
    defer("X2", "city-below-country did not run: data/countries/ holds no country file to compare against. THIS IS NOT A PASS , the city keep-share is currently unchecked against its national counterpart.",
      "the first country file is written; the rule is keepShare(city) <= keepShare(country) for the same trade");
  } else {
    let compared = 0;
    for (const { file, cell } of loaded) {
      const slug = cell.meta?.country?.slug;
      const cf = countryFiles.find((f) => basename(f, ".json") === slug);
      if (!cf) {
        fail("X2", file, `country "${slug}" has no file in data/countries/, so this cell's figures sit above nothing`);
        continue;
      }
      const country = JSON.parse(readFileSync(join(COUNTRY_DIR, cf), "utf8"));
      const trade = cell.meta?.trade?.slug;
      const rev = point(cell.modelRoom?.revenue);
      const keeps = point(cell.modelRoom?.ownerKeeps);
      const nat = country.trades?.[trade];
      const natKeepPct = point(nat?.keepPct) ?? nat?.keepPct;
      if (typeof rev !== "number" || typeof keeps !== "number" || typeof natKeepPct !== "number") {
        fail("X2", file, `cannot compare ${trade} against the country file: city revenue/keeps or country keepPct missing`);
        continue;
      }
      compared++;
      const cityKeepPct = (keeps / rev) * 100;
      if (cityKeepPct >= natKeepPct - 0.5) {
        fail("X2", file, `${trade}: the city keeps ${cityKeepPct.toFixed(1)}% against a national ${natKeepPct}%, but city rent runs well above the national rate`);
      }
    }
    if (compared) ok("X2", loaded[0].file, `${compared} city figures sit below their country counterpart`);
  }

  /* X3. the copy-paste tell: one trade, two cities, the same model. */
  const byTrade = new Map();
  for (const { file, cell } of loaded) {
    const k = `${cell.meta?.country?.slug}/${cell.meta?.trade?.slug}`;
    if (!byTrade.has(k)) byTrade.set(k, []);
    byTrade.get(k).push({ file, cell });
  }
  let x3Ran = 0;
  for (const [k, group] of byTrade) {
    if (group.length < 2) continue;
    x3Ran++;
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = group[i], b = group[j];
        if (a.cell.meta?.city?.slug === b.cell.meta?.city?.slug) {
          fail("X3", a.file, `${k}: two files carry the same city (${a.cell.meta?.city?.slug})`);
          continue;
        }
        const ra = point(a.cell.modelRoom?.revenue), rb = point(b.cell.modelRoom?.revenue);
        if (typeof ra === "number" && ra === rb) {
          fail("X3", a.file, `${k}: ${basename(a.file)} and ${basename(b.file)} model identical revenue (${money(ra)}) in different cities; a copied model is not a second reading`);
        }
      }
    }
  }
  if (!x3Ran) {
    defer("X3", "same-trade / different-city divergence did not run: no trade has two cells yet.",
      "the same trade is published in a second city");
  }
}

/* ------------------------------------------------------------- report ----- */
console.log(`\nverify_cell_lattice  (${files.length} cell file${files.length > 1 ? "s" : ""})\n` + "=".repeat(74));
for (const n of notes) console.log("  ok    " + n);

if (deferred.length) {
  console.log("\n  " + "-".repeat(70));
  console.log(`  CHECKS THAT COULD NOT RUN , ${deferred.length}. These are NOT passes.`);
  for (const d of deferred) {
    console.log(`  NOTE   ${d.id}  ${d.msg}`);
    console.log(`         runs when: ${d.willRunWhen}`);
  }
  console.log("  " + "-".repeat(70));
}

if (fails.length) {
  console.log("");
  for (const f of fails) console.log("  FAIL  " + f);
  console.log(`\n${fails.length} failure${fails.length > 1 ? "s" : ""}, ${notes.length} checks passed, ${deferred.length} deferred.\n`);
  process.exit(1);
}
console.log(`\nall ${notes.length} checks passed across ${files.length} file${files.length > 1 ? "s" : ""}; ${deferred.length} deferred and printed above.\n`);
