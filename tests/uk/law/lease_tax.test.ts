/**
 * Tax on a lease's rent: NPV at 3.5%, the highest-of-the-first-five rule, SDLT and LTT bands.
 *
 * Run: npx tsx tests/uk/law/lease_tax.test.ts
 */
import { leaseRentNpv, sdltOnLeaseRent, lttOnLeaseRent } from "../../../src/lib/uk/law/lease_tax";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-lease-tax";
const FILE = "src/lib/uk/law/lease_tax.ts";
const REMEDY = "fix lease_tax.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};
const years = (n: number, rent: number) => Array.from({ length: n }, () => rent);

check("25,000 for 5 years: NPV 112,876.31", leaseRentNpv(years(5, 25_000)) === 112_876.31);
check("no SDLT on it", sdltOnLeaseRent(112_876.31) === 0);
check("25,000 for 10 years: NPV 207,915.13", leaseRentNpv(years(10, 25_000)) === 207_915.13);
check("SDLT 579.15", sdltOnLeaseRent(207_915.13) === 579.15);
check("LTT in Wales: nothing (nil band to 225,000)", lttOnLeaseRent(207_915.13) === 0);
check("15 years: NPV 287,935.27, SDLT 1,379.35, LTT 629.35", leaseRentNpv(years(15, 25_000)) === 287_935.27 && sdltOnLeaseRent(287_935.27) === 1379.35 && lttOnLeaseRent(287_935.27) === 629.35);
check("half the first year rent-free: NPV 195,837.84, SDLT 458.38", leaseRentNpv([12_500, ...years(9, 25_000)]) === 195_837.84 && sdltOnLeaseRent(195_837.84) === 458.38);
check("years after the fifth take the highest of the first five", leaseRentNpv([20_000, 20_000, 20_000, 25_000, 25_000, 0, 0, 0, 0, 0]) === 193_906.95);
check("an empty lease has no NPV", leaseRentNpv([]) === 0);
check("the highest of the first five, wherever it falls: 30,000 then four years of 20,000 then five empty years, NPV 214,009.47", leaseRentNpv([30_000, 20_000, 20_000, 20_000, 20_000, 0, 0, 0, 0, 0]) === 214_009.47);
check("year five the single highest and year six higher still: years 6 to 10 take year five's 30,000, NPV 212,767.37", leaseRentNpv([20_000, 20_000, 20_000, 20_000, 30_000, 40_000, 0, 0, 0, 0]) === 212_767.37);
check("SDLT's 2% band, the official worked example: an NPV of 5,100,000 pays 48,500 + 2,000 = 50,500.00", sdltOnLeaseRent(5_100_000) === 50_500);
check("LTT's 2% band: an NPV of 2,100,000 pays 17,750 + 2,000 = 19,750.00", lttOnLeaseRent(2_100_000) === 19_750);
const refuses = (f: () => unknown) => { try { f(); return false; } catch { return true; } };
check("a negative rent, or one that is not a number, is refused, after year five too (where the rule would hide it)", refuses(() => leaseRentNpv([25_000, -1])) && refuses(() => leaseRentNpv([Number.NaN])) && refuses(() => leaseRentNpv([25_000, 25_000, 25_000, 25_000, 25_000, 0, Number.NaN])));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/lease_tax: all pass");
