/**
 * THE COST SIMULATOR'S DEFAULTS (plan 2026-10-13 cost-simulator, Task 2; spec section 3: "a fallback test pins city to country to none with its line;
 * a no-fill test reds any of the known fills reaching an input"; R7 table 4.1 row for row).
 *
 * The place a view names; London on model.ts's business (the break-even at the defaults is model.ts's to the penny, Q1 answer A); Leeds and
 * "anywhere in" the UK on England's rows, said; Edinburgh off the law's reach, said; Berlin's rows summed by hand in Task 1 reached through the
 * real files (the same 1,095,484.12); REVIEW FOCUS 3, a city with no rent, by taking Berlin's rent out of the fact store and then Germany's; and
 * the no-fill sweep over every trade the calculator offers in three places.
 * BLIND SPOT, stated: it holds what the files say on the day it runs; a shard figure that is wrong in the file passes as that file's figure.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/simulator/defaults.test.ts
 */
import cityListJson from "../../data/cities/city_list_v1.json";
import { allFacts, loadFacts } from "../../src/lib/facts/store";
import { shardLadderNet } from "../../src/lib/spine/trade_net";
import { startupCapitalArchetypeKeyed } from "../../src/lib/markets/startup_capital_archetypes";
import { hasCountrySpecificRates } from "../../src/lib/tax";
import { listCountryProfiles } from "../../src/lib/economic_profile";
import { getAovCityTierMultiplier } from "../../src/lib/economics/breakeven";
import { getCityTier } from "../../src/lib/cities/city_tier";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "calc-defaults";
const FILE = "src/lib/simulator/defaults.ts";
const REMEDY = "every default reads R7 4.1's row in its order (city, then country, then none), carries its stamp and says its level in its line; a place that lacks a figure says so or leaves the field empty, never a fill";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const KINDS = new Set(["counted", "worked out", "looked up", "estimate", "yours"]);

async function main(): Promise<void> {
  const P = await import("../../src/lib/simulator/place").catch(() => null);
  const B = await import("../../src/lib/simulator/bundle").catch(() => null);
  const D = await import("../../src/lib/simulator/defaults").catch(() => null);
  check("the place module is there", !!P, "src/lib/simulator/place.ts");
  check("the bundle module is there", !!B, "src/lib/simulator/bundle.ts");
  check("the defaults builder is there", !!D);
  if (!P || !B || !D) { redSummary(RULE, failed, REMEDY, "modules missing"); process.exit(1); }
  const E = await import("../../src/lib/simulator/engine");
  const L = await import("../../src/lib/uk/pnl/london");
  const M = await import("../../src/lib/uk/pnl/model");
  const { COPY } = await import("../../src/lib/spine/copy");
  const W = COPY.calculator;
  const place = (country: string | null, city: string | null, trade: string | null) => P.resolvePlace({ country, city, trade });
  const at = (country: string, city: string | null, trade: string) => { const p = place(country, city, trade); if (!p) throw new Error(`no place ${country}/${city}/${trade}`); return { p, b: D.buildBundle(p, { cell: null }) }; };
  const run = (b: ReturnType<typeof D.buildBundle>) => E.simulate(B.toEngine(b, B.FRESH));
  const value = (o: { held: boolean; value?: number }) => (o.held ? (o as { value: number }).value : null);

  /* THE PLACE A VIEW NAMES (Reading 16; spec: "an unknown country, city or trade answers 404"). */
  check("no words is London restaurants", JSON.stringify(place(null, null, null) && [place(null, null, null)!.iso2, place(null, null, null)!.city, place(null, null, null)!.trade]) === JSON.stringify(["GB", "london", "restaurants"]), "src/lib/simulator/place.ts");
  check("a country with no city is anywhere in it; a city with no country names nothing", place("de", null, "restaurants")?.city === null && place(null, "berlin", "restaurants") === null, "src/lib/simulator/place.ts");
  check("an unknown country, city or trade, a city of another country, and a built-in name are no place", [place("xx", null, "restaurants"), place("gb", "atlantis", "restaurants"), place("gb", "london", "time-travel"), place("gb", "berlin", "restaurants"), place("gb", "london", "constructor"), place("gb", "__proto__", "restaurants")].every((x) => x === null), "src/lib/simulator/place.ts");
  const gbCities = (cityListJson as { cities: Array<{ slug: string; iso2: string }> }).cities.filter((c) => c.iso2.toUpperCase() === "GB").map((c) => c.slug).sort();
  check(`every UK city in the list has its nation, and no other (${gbCities.join(", ")})`, JSON.stringify(Object.keys(P.GB_CITY_NATION).sort()) === JSON.stringify(gbCities), "src/lib/simulator/place.ts");

  /* LONDON ON MODEL.TS'S BUSINESS (Reading 1; Q1 answer A). */
  const { b: lb } = at("gb", "london", "restaurants");
  const lm = L.londonTradeInputs("restaurants")!;
  const lr = run(lb);
  check(`London restaurants run on the UK model in pounds (${lb.path}, ${lb.currency})`, lb.path === "uk-model" && lb.currency === "GBP");
  check(`the break-even at the defaults is model.ts's to the penny (${value(lr.breakEven)} against ${M.breakEvenSales(lm)})`, value(lr.breakEven) === M.breakEvenSales(lm));
  check(`the floor space and the rent are the valuation's, worked out, at the city's level (${lb.inputs.area.value}, ${lb.inputs.rent.value}, ${lb.inputs.area.stamp?.kind}, ${lb.inputs.area.level})`, lb.inputs.area.value === lm.premises.areaM2 && lb.inputs.rent.value === 362 && lb.inputs.area.stamp?.kind === "worked out" && lb.inputs.area.level === "city" && lb.inputs.area.line === W.lines.area.valuation);
  // Q1 answer A: the valuation's rent carries no service charge and the sales are the register's mean under 5m. Answer B: the city's service charge and bandQuantile(bands, 0.5).
  check(`Q1: the service charge stands empty with its line, and the sales are the anchor (${lb.inputs.service.value}, ${lb.inputs.sales.value})`, lb.inputs.service.value === null && lb.inputs.service.line === W.lines.service.valuation && lb.inputs.sales.value === lm.anchorSales.value && lb.inputs.sales.line === W.lines.sales.register);
  check(`the trade's roles stand at nought heads as hires on top, the owner's seat marked (${lb.roles.map((r) => `${r.key} ${r.heads}`).join(", ")})`, lb.roles.length > 0 && lb.roles.every((r) => r.heads === 0) && lb.roles.some((r) => r.owner) && lb.ukLaw?.allowance === false);
  check("the staff and running lines are the recipe's at the anchor", JSON.stringify(lb.lines.map((l) => [l.key, l.amountYear])) === JSON.stringify([["crew", 179232.26], ["running", 71692.9]]));
  check(`no running share off the model, the goods are the recipe's 36% (${lb.inputs.runShare.value}, ${lb.inputs.goods.value})`, lb.inputs.runShare.value === null && Math.abs((lb.inputs.goods.value ?? 0) - 0.36) < 1e-12);
  check(`the owner keeps the profit by default, a profit goal stands unset (${B.toEngine(lb, B.FRESH).ownerPay}, ${B.toEngine(lb, B.FRESH).targetProfit})`, B.toEngine(lb, B.FRESH).ownerPay === null && B.toEngine(lb, B.FRESH).targetProfit === null && lb.inputs.owner.value !== null);

  /* ENGLAND'S ROWS, SAID (Reading 2). */
  const { b: leeds } = at("gb", "leeds", "restaurants");
  const em = L.geographyTradeInputs("restaurants", L.ENGLAND, "England")!;
  check(`Leeds restaurants run on England's rows and say so (${leeds.inputs.area.line})`, leeds.path === "uk-model" && leeds.inputs.area.level === "nation" && leeds.inputs.area.line === "Leeds holds none. This is England's.");
  check(`Leeds' break-even is England's model.ts break-even (${value(run(leeds).breakEven)} against ${M.breakEvenSales(em)})`, value(run(leeds).breakEven) === M.breakEvenSales(em));
  const { p: anyUk, b: anyUkB } = at("gb", null, "restaurants");
  check(`anywhere in the UK reads England's rows (${anyUk.nation}, ${anyUkB.path}, ${anyUkB.inputs.area.level})`, anyUk.nation === "england" && anyUkB.path === "uk-model" && anyUkB.inputs.area.level === "nation" && anyUkB.inputs.area.line === W.lines.area.valuation);
  check("London's own functions keep their words", L.londonWithholding("constructor") === "no London turnover bands for the trade's code", "src/lib/uk/pnl/london.ts");

  /* SCOTLAND: no England rates, no rUK income tax, the employer's law still the UK's. */
  const { b: edi } = at("gb", "edinburgh", "restaurants");
  check(`Edinburgh: the world rows in pounds, no rates, no income tax, the hire law the UK's (${edi.path}, ${edi.rates}, ${edi.tax.law}, ${!!edi.ukLaw})`, edi.path === "world" && edi.currency === "GBP" && edi.rates === null && edi.tax.law === "none" && !!edi.ukLaw);

  /* BERLIN THROUGH THE REAL FILES: Task 1's hand-worked rows, reached by the builder. */
  const { b: be } = at("de", "berlin", "restaurants");
  const br = run(be);
  check(`Berlin restaurants: the world rows in dollars, 242 m2 from 22 a worker, rent 608 and service 40 the city's (${be.path}, ${be.inputs.area.value}, ${be.inputs.rent.value}, ${be.inputs.service.value})`, be.path === "world" && be.currency === "USD" && be.inputs.area.value === 242 && be.inputs.area.level === "sector" && be.inputs.rent.value === 608 && be.inputs.rent.level === "city" && be.inputs.service.value === 40);
  check(`Berlin's roles at the city's wage, Germany's employer rate (${be.roles.map((r) => `${r.key} ${r.heads}x${r.pay.value}`).join(", ")}; ${be.inputs.oncost.value})`, be.roles.find((r) => r.owner)?.heads === 0 && be.roles.find((r) => r.key === "head_chef_or_kitchen_lead")?.pay.value === 54120 && be.inputs.oncost.value === 0.197 && be.inputs.oncost.level === "country");
  check(`Berlin's break-even through the files is Task 1's by hand, 1,095,484.12 (${value(br.breakEven)})`, value(br.breakEven) === 1095484.12);
  check(`the ticket is the trade's spend per head times the city tier's multiplier (${be.inputs.ticket.value})`, be.inputs.ticket.value === 22 * getAovCityTierMultiplier("restaurants", getCityTier("berlin")));
  check(`no tax outside the UK, and the bank lending rate as the loan's (${be.tax.law}, ${be.inputs.loanRate.level})`, be.tax.law === "none" && be.inputs.loanRate.level === "country" && be.inputs.loanAmount.value === null);
  /* The profile's bank_lending_rate_pct holds a fraction (0.045 for Germany; src/lib/spine/adapt_country.ts multiplies it by 100), and the loan lever
     and the engine take a percent (annualRatePct), as the UK's 7.5 is: found on the Berlin render at 1280, where the lever read "0". */
  check(`Germany's loan rate is its lending rate in percent, 4.5 (${be.inputs.loanRate.value})`, be.inputs.loanRate.value === 4.5);
  check(`the money to open it is built from the city's fit-out where no cell holds a bill (${be.opening.kind}: ${be.opening.lines.map((l) => `${l.key} ${l.amount}`).join(", ")})`, be.opening.kind === "built" && be.opening.lines[0]?.key === "fit-out" && be.opening.lines[0]?.amount === 1100 * 242);
  check(`at most five notes of where figures come from (${be.notes.length}: ${be.notes.map((n) => n.label).join(", ")})`, be.notes.length >= 1 && be.notes.length <= 5);

  /* THE OWNER'S SEAT WHEREVER THE ROLE NAMES THE OWNER (the final review's C1, the controller's ruling): "Barber (owner-operator)" as well as
     "Owner or general manager"; the seat takes one head off the role's typical count (the owner keeps the profit), the rest stay staff. */
  const { shardRoles } = await import("../../src/lib/spine/team_rows");
  const seatFaults: string[] = [];
  let seats = 0;
  for (const t of P.simulatorTrades()) {
    const p = place("de", "berlin", t.slug);
    if (!p) continue;
    const b = D.buildBundle(p, { cell: null });
    for (const r of shardRoles(p.industryId)) {
      if (!/\bowner\b/i.test(r.role)) continue;
      seats++;
      const role = b.roles.find((x) => x.name === r.name && x.sub === r.sub);
      if (!role || !role.owner || role.heads !== Math.max(0, r.headcount - 1)) seatFaults.push(`${t.slug}: "${r.role}" ${role ? `${role.heads}${role.owner ? "" : " unmarked"}` : "missing"} against ${Math.max(0, r.headcount - 1)}`);
    }
  }
  check(`every one of ${seats} roles naming the owner stands at its count less one and is marked the owner's (${seatFaults.slice(0, 4).join("; ") || "all"})`, seats > 100 && seatFaults.length === 0);
  const barber = D.buildBundle(place("gb", "manchester", "barbershops")!, { cell: null }).roles.find((r) => /owner/i.test(`${r.name} ${r.sub ?? ""}`));
  check(`barbershops' "Barber (owner-operator)" stands at nought (${barber?.name} ${barber?.sub}: ${barber?.heads})`, !!barber && barber.owner && barber.heads === 0);

  /* THE COST OF GOODS OFF THE RECIPES (the final review's I1, the controller's ruling): the shard's own supplies or goods driver where it holds one,
     never 1 - gross margin then (a service trade's gross margin leaves its direct labour inside, which the team already pays); 1 - gross margin
     only where no such driver exists, its line saying the share may include direct labour. */
  const { b: plumbers } = at("de", "berlin", "plumbers");
  check(`plumbers' goods are their "Materials and parts" driver, 20% (${plumbers.inputs.goods.value}, ${plumbers.inputs.goods.stamp?.src}, "${plumbers.inputs.goods.line}")`, plumbers.inputs.goods.value === 0.2 && /cost_structure\.cost_drivers\./.test(plumbers.inputs.goods.stamp?.src ?? "") && plumbers.inputs.goods.line === W.lines.goods.driver);
  const marginLines: string[] = [];
  let onDrivers = 0;
  for (const t of P.simulatorTrades()) {
    const b = D.buildBundle(place("de", "berlin", t.slug)!, { cell: null });
    const src = b.inputs.goods.stamp?.src ?? "";
    if (/cost_structure\.cost_drivers\./.test(src)) onDrivers++;
    if (/margin_ladder/.test(src) && b.inputs.goods.line !== W.lines.goods.margin) marginLines.push(`${t.slug}: "${b.inputs.goods.line}"`);
  }
  check(`the goods of ${onDrivers} trades rest on their own drivers, and every share left by the gross margin says it may hold direct labour (${marginLines.slice(0, 3).join("; ") || "all"})`, onDrivers > 60 && marginLines.length === 0 && /direct labour/.test(W.lines.goods.margin));

  /* REVIEW FOCUS 3, A CITY WITH NO RENT: Berlin's rent taken out of the store, then Germany's. */
  const saved = allFacts();
  loadFacts(saved.filter((f) => !(f.entityId === "DE-berlin" && f.metric === "realestate.rent_secondary_usd_sqm_yr")));
  const noCity = D.buildBundle(place("de", "berlin", "restaurants")!, { cell: null });
  check(`no city rent: the country's, said (${noCity.inputs.rent.value}, ${noCity.inputs.rent.level}, "${noCity.inputs.rent.line}")`, noCity.inputs.rent.level === "country" && noCity.inputs.rent.value !== null && noCity.inputs.rent.line === "Berlin holds none. This is Germany's.");
  loadFacts(allFacts().filter((f) => !(f.entityId === "DE" && f.metric === "costs.commercial_rent_usd_sqm_yr")));
  const noRent = D.buildBundle(place("de", "berlin", "restaurants")!, { cell: null });
  const nr = run(noRent);
  check(`no country rent either: the field empty with its line, the break-even waiting for it (${noRent.inputs.rent.value}, "${noRent.inputs.rent.line}", ${JSON.stringify(nr.breakEven)})`, noRent.inputs.rent.value === null && noRent.inputs.rent.stamp === null && noRent.inputs.rent.level === "none" && noRent.inputs.rent.line === W.lines.rent.none && !nr.breakEven.held && (nr.breakEven.needs ?? []).includes("rent"));
  loadFacts([...saved]);

  /* THE NO-FILL SWEEP: every trade the calculator offers, in London, in Berlin and anywhere in Afghanistan. */
  const profiles = new Set(listCountryProfiles().map((x) => x.iso2));
  const trades = P.simulatorTrades();
  let bundles = 0;
  const faults: string[] = [];
  for (const t of trades) for (const [c, city] of [["gb", "london"], ["de", "berlin"], ["af", null]] as const) {
    const p = place(c, city, t.slug);
    if (!p) { faults.push(`${c}/${city}/${t.slug}: no place`); continue; }
    const b = D.buildBundle(p, { cell: null });
    bundles++;
    const where = `${c}/${city ?? "anywhere"}/${t.slug}`;
    for (const [k, x] of Object.entries(b.inputs)) {
      if (x.value === null && x.stamp !== null) faults.push(`${where} ${k}: a stamp with no figure`);
      if (x.value !== null && (!x.stamp || !x.stamp.src || !KINDS.has(x.stamp.kind))) faults.push(`${where} ${k}: a figure with no stamp`);
      if (x.value !== null && !Number.isFinite(x.value)) faults.push(`${where} ${k}: ${x.value}`);
      if (x.stamp && /default_fallback/.test(x.stamp.src)) faults.push(`${where} ${k}: a file's fallback row`);
    }
    if (b.inputs.goods.stamp && /margin_ladder/.test(b.inputs.goods.stamp.src) && shardLadderNet(p.industryId)?.fill) faults.push(`${where}: the 42/10/5 ladder reached the cost of goods`);
    if (b.opening.kind === "archetype" && startupCapitalArchetypeKeyed(p.trade) === null) faults.push(`${where}: the 80,000 archetype default reached the money to open`);
    if (p.iso2 !== "GB" && b.inputs.oncost.value !== null && !hasCountrySpecificRates(p.iso2)) faults.push(`${where}: the tax table's fallback rate reached the employer charges`);
    if (p.iso2 !== "GB" && b.inputs.loanRate.value !== null && !profiles.has(p.iso2)) faults.push(`${where}: the profile's fallback row reached the loan rate`);
    if (b.roles.some((r) => r.pay.value !== null && !r.pay.stamp)) faults.push(`${where}: a pay with no stamp`);
  }
  check(`no fill reaches an input on ${bundles} bundles of ${trades.length} trades (${faults.slice(0, 6).join("; ") || "none"})`, bundles === trades.length * 3 && faults.length === 0);

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("simulator/defaults: all pass");
  process.exit(0);
}

main().catch((e) => { console.error("x calc-defaults crashed:", e); process.exit(1); });
