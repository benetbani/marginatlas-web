/**
 * London trades from the register slices (data/uk/registers): barbershops and restaurants end to end, and every reason a
 * trade's money is withheld. Expected values agreed to the penny with the independent Python implementation (2026-10-02).
 *
 * Run: npx tsx tests/uk/pnl/london.test.ts
 */
import { londonTradeInputs, londonTradeSummary, londonWithholding } from "../../../src/lib/uk/pnl/london";
import { bestCompanyTakeHome } from "../../../src/lib/uk/law/take_home";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-pnl-london";
const FILE = "src/lib/uk/pnl/london.ts";
const REMEDY = "re-export the slices with python registers/uk/export_for_site.py or fix london.ts; never edit data/uk/registers by hand";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

const barber = londonTradeInputs("barbershops");
check("barbershops: the register's London bands for the hair and beauty code", barber !== null && barber.revenueBandsK.join(",") === "2405,3740,2655,525,245,70,40,10,5,0");
check("barbershops: the London salon row's rateable value 16,657.95 and the anchor 139,406.36", barber!.premises.rateableValue === 16_657.95 && barber!.anchorSales.value === 139_406.36);
const b = londonTradeSummary("barbershops")!;
check("barbershops: break-even 64,112.98 and the median owner keeps 25,407.33, the model test's figures", b.breakEven.value === 64_112.98 && b.keeps.q50 === 25_407.33);

const rest = londonTradeInputs("restaurants")!;
check("restaurants: the average London restaurant (203 m2) at a rateable value of 73,374.79, the anchor 597,440.87", rest.premises.rateableValue === 73_374.79 && rest.anchorSales.value === 597_440.87);
const r = londonTradeSummary("restaurants")!;
check("restaurants: the average room's business breaks even at 556,017.36; 32 of 100 registered restaurants take that (0.3212)", r.breakEven.value === 556_017.36 && Math.round(r.shareAbove!.value * 10_000) / 10_000 === 0.3212);
check("restaurants: the median business (281,941.82) keeps 13,756.27 on a margin of 5.03%", r.keeps.q50 === 13_756.27 && Math.round(r.marginAtMedian * 10_000) / 10_000 === 0.0503);
check("restaurants: its room's rateable value 34,626.73 is above small business relief: rates 13,227.41", r.medianBill.lines[4].amount === 34_626.73 && r.medianBill.lines[5].amount === 13_227.41);

check("withheld, with the reason: grocery stores have the data and no recipe", londonWithholding("grocery-stores") === "no recipe");
check("withheld: dry cleaners' premises are valued as shops", londonWithholding("dry-cleaning-laundry") === "its premises are valued as shops, an average over unlike occupiers");
check("withheld: 40 veterinary premises are too few for the valuation's rounding", londonWithholding("veterinary-pet-care") === "40 veterinary clinics / animal clinics premises in London, too few for the valuation's rounding");
check("withheld: accountants' premises are valued as offices", londonWithholding("accounting-tax")!.startsWith("its premises are valued as offices"));
check("withheld: hotels have no kind of premises in the valuation statistics", londonWithholding("hotels-lodging") === "no kind of premises for the trade");
check("withheld: 15 coffee roasters in London are under the register's floor of 40", londonWithholding("coffee-roasters") === "15 businesses in London on the register, under the 40 its figures need");
check("withheld: an unknown trade has no bands", londonWithholding("no-such-trade") === "no London turnover bands for the trade's code" && londonTradeSummary("no-such-trade") === null);
check("built: barbershops are not withheld", londonWithholding("barbershops") === null);
check("the floor of 100 premises lets exactly 100 through: garden centres' 100 premises reach the recipe check", londonWithholding("garden-centers-nurseries") === "no recipe");
check("withheld: 60 dance schools' premises are too few for the valuation's rounding", londonWithholding("dance-studios") === "60 dance schools & centres premises in London, too few for the valuation's rounding");
check("withheld: pet training has a kind of premises but no London valuation row for it", londonWithholding("pet-training") === "no London valuation row for pet grooming parlours");
check("withheld: 30 hostels are under the register's floor, said before they lack a kind of premises", londonWithholding("hostels") === "30 businesses in London on the register, under the 40 its figures need");
check("the loader names London in the rent and anchor sentences, and the median's rent line says it is scaled",
  barber!.premises.source === "the official estimate of a year's rent for the average hairdressing/beauty salons premises in London (61 m2), April 2021 valuation"
  && barber!.anchorSales.source === "the mean sales of the registered businesses under 5m in London"
  && b.medianBill.lines[3].source === "the official estimate of a year's rent for the average hairdressing/beauty salons premises in London (61 m2), April 2021 valuation, scaled to this business's sales: 34 m2 at the same rent per m2 (the size rule)");
check("withheld: cabinet makers' premises are valued as factories, workshops and warehouses, an average over unlike occupiers (446 m2)", londonWithholding("cabinet-making")!.startsWith("its premises are valued as factories,workshops and warehouses"));
check("the company form reaches the model: the median barbershop as a company keeps the company optimum on 29,917.75",
  londonTradeSummary("barbershops", "company")!.keeps.q50 === bestCompanyTakeHome(29_917.75).takeHome && londonTradeSummary("barbershops")!.keeps.q50 === 25_407.33);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/pnl/london: all pass");
