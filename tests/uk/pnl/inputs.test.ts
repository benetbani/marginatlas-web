/**
 * A trade's inputs from its recipe: London barbershops, the official valuation's London salon row, the register's hair and
 * beauty bands. The recipe's shares are the trade research's (estimates); rent, rates and the anchor are worked out.
 *
 * Run: npx tsx tests/uk/pnl/inputs.test.ts
 */
import { anchorSalesFromBands, buildInputs, premisesFromValuation, type Recipe } from "../../../src/lib/uk/pnl/inputs";
import { summarise } from "../../../src/lib/uk/pnl/model";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-pnl-inputs";
const FILE = "src/lib/uk/pnl/inputs.ts";
const REMEDY = "fix inputs.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

// The London row of the valuation statistics for Hairdressing/Beauty Salons (registers/uk/tables, read 2026-10-02)
const LONDON_SALONS = { rv_per_m2: 274, count: 1760, floorspace_k_m2: 107 };
const HAIR_BEAUTY_LONDON = [2405, 3740, 2655, 525, 245, 70, 40, 10, 5, 0];
const BARBERSHOPS: Recipe = {
  trade: "barbershops",
  research: "data/facts/industry/barbershops.json",
  retailHospitalityLeisure: true,
  utilitiesCarried: false,
  variable: [
    { key: "barbers' commission", driver: "Barber pay and commission", shareOfSales: 0.3, kind: "estimate", basis: "fixture" },
    { key: "supplies and product", driver: "Supplies and product", shareOfSales: 0.08, kind: "estimate", basis: "fixture" },
  ],
  sized: [{ key: "running costs", driver: "Other operating", shareOfSales: 0.12, kind: "estimate", basis: "fixture" }],
};

const p = premisesFromValuation(LONDON_SALONS);
check("the average London salon is 60.8 m2", Math.round(p.areaM2 * 10) / 10 === 60.8);
check("its rateable value is 16,657.95 (274 a m2)", p.rateableValue === 16_657.95);
check("the anchor: mean sales of the registered hair and beauty businesses under 5m, 139,406.36", anchorSalesFromBands(HAIR_BEAUTY_LONDON) === 139_406.36);
const inputs = buildInputs(BARBERSHOPS, { revenueBandsK: HAIR_BEAUTY_LONDON, premises: LONDON_SALONS, premisesCategory: "Hairdressing/Beauty Salons", place: "London", form: "sole trader" });
check("the recipe's shares pass through: 0.3 and 0.08 move with sales, 0.12 is sized", inputs.variable.map((x) => x.share).join(",") === "0.3,0.08" && inputs.sized.map((x) => x.share).join(",") === "0.12");
check("every share names its research file", inputs.variable.every((x) => x.source.endsWith("(data/facts/industry/barbershops.json)")));
check("the premises are worked out and name the average room (61 m2)", inputs.premises.rateableValue === 16_657.95 && inputs.premises.kind === "worked out" && inputs.premises.source.includes("(61 m2)"));
check("the anchor is worked out", inputs.anchorSales.value === 139_406.36 && inputs.anchorSales.kind === "worked out");
const s = summarise(inputs)!;
check("the recipe gives the model's worked example: break-even 64,112.98, the median owner keeps 25,407.33", s.breakEven.value === 64_112.98 && s.keeps.q50 === 25_407.33);
let threw = 0;
try { premisesFromValuation({ rv_per_m2: 0, count: 0, floorspace_k_m2: 0 }); } catch { threw++; }
try { buildInputs(BARBERSHOPS, { revenueBandsK: [0, 0, 0, 0, 0, 0, 0, 3, 2, 1], premises: LONDON_SALONS, premisesCategory: "Hairdressing/Beauty Salons", place: "London", form: "sole trader" }); } catch { threw++; }
check("an empty valuation row, and bands with nobody under 5m, are refused, not divided by", threw === 2);
const refusesRow = (row: { rv_per_m2: number; count: number; floorspace_k_m2: number }) => { try { premisesFromValuation(row); return false; } catch { return true; } };
check("a valuation row with no value, no floorspace or no premises is refused, each on its own",
  refusesRow({ rv_per_m2: 0, count: 5, floorspace_k_m2: 1 }) && refusesRow({ rv_per_m2: 274, count: 5, floorspace_k_m2: 0 }) && refusesRow({ rv_per_m2: 274, count: 0, floorspace_k_m2: 1 }));


// ---- what passes through unchanged (review additions)
const CTX = { revenueBandsK: HAIR_BEAUTY_LONDON, premises: LONDON_SALONS, premisesCategory: "Hairdressing/Beauty Salons", place: "London", form: "sole trader" as const };
check("recipe lines keep their keys and the basis they were given", inputs.variable.map((x) => x.key).join("|") === "barbers' commission|supplies and product" && inputs.sized[0].key === "running costs"
  && inputs.variable[0].source === "fixture (data/facts/industry/barbershops.json)" && inputs.sized[0].source === "fixture (data/facts/industry/barbershops.json)");
const looked = buildInputs({ ...BARBERSHOPS, variable: [{ ...BARBERSHOPS.variable[0], kind: "looked up" }, BARBERSHOPS.variable[1]] }, CTX);
check("a line's kind is the recipe's: looked up stays looked up, estimate stays estimate", looked.variable[0].kind === "looked up" && looked.variable[1].kind === "estimate" && looked.sized[0].kind === "estimate");
check("the rent line says what it is: the official estimate of a year's rent, the average room, the place, April 2021",
  inputs.premises.source === "the official estimate of a year's rent for the average hairdressing/beauty salons premises in London (61 m2), April 2021 valuation" && Math.round(inputs.premises.areaM2 * 10) / 10 === 60.8);
check("the anchor says what it is", inputs.anchorSales.source === "the mean sales of the registered businesses under 5m in London");
const other = buildInputs({ ...BARBERSHOPS, retailHospitalityLeisure: false }, { ...CTX, form: "company", place: "Leeds" });
check("a trade outside retail, hospitality and leisure pays the 43.2p small business multiplier, not the 38.2p one: break-even 65,456.35 (rates 7,196.23 on the average room)",
  other.premises.retailHospitalityLeisure === false && summarise(other)!.breakEven.value === 65_456.35);
check("the form and the place reach the inputs", other.form === "company" && other.premises.source.includes("in Leeds") && other.anchorSales.source.endsWith("in Leeds"));
check("a negative or non-numeric valuation row is refused", refusesRow({ rv_per_m2: -1, count: 5, floorspace_k_m2: 1 }) && refusesRow({ rv_per_m2: 274, count: -5, floorspace_k_m2: 1 })
  && refusesRow({ rv_per_m2: 274, count: 5, floorspace_k_m2: -1 }) && refusesRow({ rv_per_m2: NaN, count: 5, floorspace_k_m2: 1 }));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/pnl/inputs: all pass");
