/**
 * THE LEASE, BY LAW (milestone 2, masterplan step 24; his ruling 28 of 2026-09-26; DATA-REQUIREMENTS item 73): the builder against
 * the law it reads (data/uk/law/lease_law.json, from the research of 2026-10-02, section 73) and the law engine's tax on a lease.
 *
 * Run: npx tsx tests/spine/lease_by_law.test.ts
 */
import { readFileSync } from "node:fs";
import { buildLeaseByLaw, LEASE_LAW, type LeaseLaw } from "../../src/lib/spine/sections/lease_by_law";
import { leaseRentNpv, sdltOnLeaseRent } from "../../src/lib/uk/law/lease_tax";
import { sumPennies, pennies } from "../../src/lib/uk/law/money";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "lease-by-law";
const FILE = "src/lib/spine/sections/lease_by_law.ts";
const REMEDY = "build the lease from data/uk/law/lease_law.json and the law engine: every row sourced, the tax the engine's, 'signed for' only from parts that are all held";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

const lease = buildLeaseByLaw();
check("the lease builds for England and Wales", !!lease);
if (lease) {
  check(`the figure is the least notice a landlord gives to end a protected lease, 6 months (s.25) (${lease.focal.months})`, lease.focal.months === 6 && lease.focal.prov.src.startsWith("uk/law/lease_law.json:landlord_notice_months"));
  check(`the stated unit's rent is London's shop valuation for 80 square metres (${lease.rentGbp})`, typeof lease.rentGbp === "number" && lease.rentGbp > 0);
  for (const t of lease.tax) {
    const expected = sdltOnLeaseRent(leaseRentNpv(Array(t.years).fill(lease.rentGbp)));
    check(`the stamp duty on ${t.years} years equals the law engine's for the same rent (${t.gbp} against ${expected})`, t.gbp === expected);
  }
  check("the stamp duty is given for 5 and for 10 years", lease.tax.map((t) => t.years).join(",") === "5,10");
  check("a tax that is due carries its 14 days to pay, from the law file; none due, none", lease.tax.every((t) => (t.gbp > 0 ? t.dueDays === 14 : t.dueDays === null)));
  check("'signed for' withholds: the break clause, the deposit and the solicitor's fee are not held", lease.signedFor === null);
  const fields = LEASE_LAW.fields as Record<string, { source_url?: string }>;
  check("every row names the law field it reads, and every field carries an https source", lease.rows.length >= 6 && lease.rows.every((r) => { const key = String(r.prov?.src ?? "").split(":")[1]; return !!key && /^https:\/\//.test(fields[key]?.source_url ?? ""); }));
  check("every label is three words at most", lease.rows.every((r) => String(r.label).split(/\s+/).length <= 3));
  check("every note is one line of twelve words at most, with no semicolon or em dash", lease.rows.every((r) => !r.note || (r.note.split(/\s+/).length <= 12 && !/[;—]/.test(r.note))));
}

// The research's worked example (73.6): 25,000 a year, 10 years, SDLT 579.15; 5 years, none.
const example = buildLeaseByLaw(LEASE_LAW, { rentGbp: 25000 });
check(`the research's example: 10 years at 25,000 is 579.15 (${example?.tax.find((t) => t.years === 10)?.gbp})`, example?.tax.find((t) => t.years === 10)?.gbp === 579.15);
check(`and 5 years is nothing (${example?.tax.find((t) => t.years === 5)?.gbp})`, example?.tax.find((t) => t.years === 5)?.gbp === 0);

// 'signed for' from a law that holds every part: the rent to the first break, the deposit, the fee and the tax, summed.
const full: LeaseLaw = {
  ...LEASE_LAW,
  fields: {
    ...LEASE_LAW.fields,
    break_first_months: { value: 36, source_url: "https://example.org/break", quote: "fixture", checked: "2026-10-05" },
    deposit_months: { value: 3, source_url: "https://example.org/deposit", quote: "fixture", checked: "2026-10-05" },
    legal_fee_gbp: { value: 1500, source_url: "https://example.org/fee", quote: "fixture", checked: "2026-10-05" },
    lease_years: { value: 10, source_url: "https://example.org/term", quote: "fixture", checked: "2026-10-05" },
  },
};
const held = buildLeaseByLaw(full, { rentGbp: 25000 });
const parts = [pennies(25000 * 36 / 12), pennies(25000 * 3 / 12), 1500, sdltOnLeaseRent(leaseRentNpv(Array(10).fill(25000)))];
check(`with every part held, 'signed for' is their sum (${held?.signedFor?.gbp} against ${sumPennies(parts)})`, held?.signedFor?.gbp === sumPennies(parts));
const missing: LeaseLaw = { ...full, fields: { ...full.fields } };
delete (missing.fields as Record<string, unknown>).deposit_months;
check("one part missing, it withholds", buildLeaseByLaw(missing, { rentGbp: 25000 })?.signedFor === null);

// The data file holds no field it does not source.
const raw = JSON.parse(readFileSync("data/uk/law/lease_law.json", "utf8")) as { fields: Record<string, { source_url?: string; quote?: string; checked?: string }> };
check("every field in the data file has its page, its quote and its day", Object.values(raw.fields).every((f) => /^https:\/\//.test(f.source_url ?? "") && !!f.quote && /^\d{4}-\d{2}-\d{2}$/.test(f.checked ?? "")));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/lease_by_law: all pass");
