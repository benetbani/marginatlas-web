/**
 * The bill to register never prints beside a table that contradicts it
 * (plan step 44, 2026-09-17: "The bill to open never prints both").
 *
 * WHY THIS EXISTS, and it is the fault it was written against. The country
 * page's `04 entry-bill` prints the shard's all-in registration bill and the
 * days until trading (data/facts/country/<ISO2>.json, `costs.license_setup_usd`
 * and `setup.total_days`) in the same band as the registering table, which
 * prints the formation file's LLC row (data/legal/business_formation_costs_v1.json,
 * the government fee and the filing days). Counted on 2026-09-17 over the
 * 148 countries holding both: the shard's days are FEWER than the table's
 * filing days on 81, and the shard's bill is LOWER than the table's fee alone
 * on 51, which cannot both be true (a company cannot trade before it is
 * registered; a bill that includes the fee cannot be smaller than the fee).
 * Every figure is individually real, so no other gate can see it; only the
 * PAIR, two inches apart on one level, is a visibly wrong number.
 *
 * WHAT IS PROVED:
 *
 *   1. THE BRIEF'S OWN CASES, on the pure guard with the figures typed from
 *      research/2026-09-11/country/04-entry-bill.md sections 2.4 and 4: the
 *      exemplars that pass both tests (GB, DE against its first LLC row, FR
 *      and US where equal is consistent), the named failures on days (AU, CH,
 *      AE, IN, NG) and on the bill (NG, CA, MY, KW, QA), Rwanda's $0 that
 *      prints as a figure, a country with no bill (the not-on-file line), a
 *      country with no LLC row (nothing to check, every figure prints), and a
 *      placeholder tag (a fill, withheld as not on file).
 *   2. THE LIVE FILES OBEY THE GUARD, for every country the taxonomy lists:
 *      a printed bill is never below the LLC fee, printed days never below
 *      the LLC days, every slot holds a figure OR a stated line and never
 *      both or neither (PART 5, both directions), the not-on-file line prints
 *      exactly where the shard holds no bill, a country with no LLC row
 *      prints everything it holds, and the reference the guard read is the
 *      masthead's own LLC cell (one accessor, one row), so the days here can
 *      never be fewer than the registration time printed two bands up.
 *   3. THE COUNTS ARE A RATCHET. Withheld bills (51), withheld days (83) and
 *      bills not on file (4) may FALL as the data track reconciles the two
 *      sources (DATA-REQUIREMENTS entry 2's amendment) and never rise; a fall
 *      is printed with the new numbers for MODEL.md 8.2's row, which states
 *      the split (both 91, bill alone 49, days alone 21, neither 34).
 *
 * NEGATIVE-TESTED, in the file: assertion 2 is replayed against the UNGUARDED
 * pair (every held figure printed) and must report the contradictions; if it
 * reports none, the check has stopped checking and the test exits 1.
 */
import { COUNTRIES } from "../../src/lib/taxonomy";
import { buildEntryBill, guardEntryBill, ENTRY_BILL_METRICS } from "../../src/lib/spine/entry_bill_rows";
import { countryFigure, type CountryBankFigure } from "../../src/lib/facts/country_shard";
import { getFormationRowByTier } from "../../src/lib/tax/country_rates";
import { buildHeroFacts } from "../../src/lib/spine/hero_facts";
import { COPY } from "../../src/lib/spine/copy";
import { red } from "../../scripts/lib/red";

const RULE = "entry-bill-guard";
const GUARD = "src/lib/spine/entry_bill_rows.ts";
const SHARDS = "data/facts/country";
/** Every red names the rule, the file it is in and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const fail = (detail: string, file = GUARD, remedy = "fix the guard in entry_bill_rows.ts so a figure below the table's is withheld with its line; never clip a figure and never raise this test's ceiling") => {
  red({ rule: RULE, file, detail, remedy });
  process.exit(1);
};
const codes = (COUNTRIES as any[]).map((c) => String(c.code ?? c.iso2 ?? "").toUpperCase()).filter((c) => c.length === 2);

/* ---- 1. THE BRIEF'S OWN CASES, on the pure guard ------------------------- */
const held = (value: number): CountryBankFigure => ({ value, tag: "held" });
const modeled = (value: number): CountryBankFigure => ({ value, tag: "modeled" });
type Expect = "printed" | "disagrees" | "not-on-file";
const cases: Array<{ name: string; bill: CountryBankFigure | null; days: CountryBankFigure | null; table: { costUsd: number | null; days: number | null } | null; bill_: Expect; days_: Expect }> = [
  { name: "GB, the exemplar: $148 against $15, 21 days against 1", bill: modeled(148), days: modeled(21), table: { costUsd: 15, days: 1 }, bill_: "printed", days_: "printed" },
  { name: "DE against its first LLC row, the UG: $1,150 against $400, 21 against 14", bill: modeled(1150), days: held(21), table: { costUsd: 400, days: 14 }, bill_: "printed", days_: "printed" },
  { name: "FR, equal days are consistent: $321 against $250, 14 against 14", bill: modeled(321), days: held(14), table: { costUsd: 250, days: 14 }, bill_: "printed", days_: "printed" },
  { name: "US, equal days: $500 against $150, 7 against 7", bill: modeled(500), days: modeled(7), table: { costUsd: 150, days: 7 }, bill_: "printed", days_: "printed" },
  { name: "NG fails both: $33 against $100, 5 against 14", bill: modeled(33), days: modeled(5), table: { costUsd: 100, days: 14 }, bill_: "disagrees", days_: "disagrees" },
  { name: "CA, the bill three dollars under the fee: $247 against $250", bill: modeled(247), days: held(7), table: { costUsd: 250, days: 7 }, bill_: "disagrees", days_: "printed" },
  { name: "MY: $290 against $350", bill: modeled(290), days: held(14), table: { costUsd: 350, days: 14 }, bill_: "disagrees", days_: "printed" },
  { name: "KW: $970 against $2,000", bill: modeled(970), days: held(30), table: { costUsd: 2000, days: 30 }, bill_: "disagrees", days_: "printed" },
  { name: "QA: $1,648 against $3,000", bill: modeled(1648), days: held(30), table: { costUsd: 3000, days: 30 }, bill_: "disagrees", days_: "printed" },
  { name: "AU, days fewer: 3 against 7", bill: modeled(491), days: modeled(3), table: { costUsd: 400, days: 7 }, bill_: "printed", days_: "disagrees" },
  { name: "CH: 14 against 21", bill: modeled(900), days: modeled(14), table: { costUsd: 600, days: 21 }, bill_: "printed", days_: "disagrees" },
  { name: "AE: 10 against 21", bill: held(5446), days: modeled(10), table: { costUsd: 3000, days: 21 }, bill_: "printed", days_: "disagrees" },
  { name: "IN: 12 against 14", bill: modeled(200), days: modeled(12), table: { costUsd: 100, days: 14 }, bill_: "printed", days_: "disagrees" },
  { name: "RW, a zero bill against a zero fee prints as a figure", bill: modeled(0), days: held(2), table: { costUsd: 0, days: 1 }, bill_: "printed", days_: "printed" },
  { name: "no bill on file, the days judged on their own", bill: null, days: modeled(21), table: { costUsd: 200, days: 21 }, bill_: "not-on-file", days_: "printed" },
  { name: "no bill on file and the days fewer (IS, SN)", bill: null, days: modeled(7), table: { costUsd: 400, days: 14 }, bill_: "not-on-file", days_: "disagrees" },
  { name: "no LLC row: nothing to check, both print", bill: modeled(50), days: modeled(7), table: null, bill_: "printed", days_: "printed" },
  { name: "an LLC row holding no fee: the days checked, the bill not", bill: modeled(10), days: modeled(3), table: { costUsd: null, days: 7 }, bill_: "printed", days_: "disagrees" },
  { name: "a placeholder tag is a fill and is not on file", bill: { value: 100, tag: "placeholder" }, days: held(7), table: { costUsd: 15, days: 1 }, bill_: "not-on-file", days_: "printed" },
];
for (const c of cases) {
  const v = guardEntryBill(c.bill, c.days, c.table);
  const got = (s: typeof v.bill): Expect => (s.state === "printed" ? "printed" : s.reason);
  if (got(v.bill) !== c.bill_) fail(`${c.name}: the bill is ${got(v.bill)}, expected ${c.bill_}`);
  if (got(v.days) !== c.days_) fail(`${c.name}: the days are ${got(v.days)}, expected ${c.days_}`);
  if (v.bill.state === "printed" && v.bill.value !== c.bill!.value) fail(`${c.name}: the printed bill is ${v.bill.value}, not the shard's ${c.bill!.value}; a figure is never clipped`);
  if (v.days.state === "printed" && v.days.value !== c.days!.value) fail(`${c.name}: the printed days are ${v.days.value}, not the shard's ${c.days!.value}; a figure is never clipped`);
}

/* ---- 2. THE LIVE FILES OBEY THE GUARD ------------------------------------ */
const W = COPY.entryBill.withheld;
let built = 0, both = 0, billOnly = 0, daysOnly = 0, neither = 0, billWithheld = 0, daysWithheld = 0, notOnFile = 0, noTable = 0;
const faults: string[] = [];
for (const iso2 of codes) {
  const d = buildEntryBill(iso2);
  if (!d) continue;
  built++;
  const llc = getFormationRowByTier(iso2, "LLC");
  const billPrints = d.figure != null, daysPrints = "figure" in d.second;
  /* Every slot: a figure or a line, never both, never neither (PART 5). */
  if ((d.figure != null) === (d.withheld != null)) faults.push(`${iso2}: the focal slot holds ${d.figure != null ? "a figure and a line" : "neither a figure nor a line"}`);
  if (!("figure" in d.second) && !("withheld" in d.second)) faults.push(`${iso2}: the second slot holds neither a figure nor a line`);
  /* The guard's own invariants against the table it read. */
  if (billPrints && llc && llc.costUsd != null && d.figures.bill! < llc.costUsd) faults.push(`${iso2}: prints a bill of $${d.figures.bill} beside a table fee of $${llc.costUsd}`);
  if (daysPrints && llc && llc.days != null && d.figures.days! < llc.days) faults.push(`${iso2}: prints ${d.figures.days} days beside a table wait of ${llc.days}`);
  /* The not-on-file line prints exactly where the shard holds no bill. */
  const shardBill = countryFigure(iso2, ENTRY_BILL_METRICS.bill);
  if ((shardBill == null) !== (d.withheld === W.billNotOnFile)) faults.push(`${iso2}: the shard ${shardBill == null ? "holds no bill" : "holds a bill"} and the card ${d.withheld === W.billNotOnFile ? "says it is not on file" : "does not say so"}`);
  /* No LLC row: nothing withheld for disagreement. */
  if (!llc) { noTable++; if (d.withheld === W.bill || ("withheld" in d.second && d.second.withheld === W.days)) faults.push(`${iso2}: no LLC row and a figure withheld for disagreeing with it`); }
  /* The reference is the masthead's own LLC cell: one accessor, one row. */
  const heroDays = buildHeroFacts(iso2).cells.find((c) => c.key === "llc-time")?.value ?? null;
  const heroParsed = heroDays ? parseInt(heroDays, 10) : null;
  if ((d.table?.days ?? null) !== heroParsed) faults.push(`${iso2}: the guard read ${d.table?.days ?? "no"} filing days and the masthead prints ${heroDays ?? "none"}`);
  /* The basis names a unit for every printed figure and for none withheld. */
  if (billPrints !== (d.basis ?? "").toLowerCase().includes(COPY.entryBill.basisBill)) faults.push(`${iso2}: the bill ${billPrints ? "prints" : "is withheld"} and the basis ${billPrints ? "does not say what it is" : "describes it"}`);
  if (daysPrints !== (d.basis ?? "").toLowerCase().includes(COPY.entryBill.basisDays)) faults.push(`${iso2}: the days ${daysPrints ? "print" : "are withheld"} and the basis ${daysPrints ? "does not say what they are" : "describes them"}`);
  if (billPrints !== (d.foot ?? "").includes(COPY.entryBill.foot)) faults.push(`${iso2}: the bill ${billPrints ? "prints" : "is withheld"} and the share-capital foot is ${billPrints ? "missing" : "printed"}`);
  if (d.sample !== /modelled/.test(d.foot ?? "")) faults.push(`${iso2}: the card is ${d.sample ? "modelled and the foot does not say so" : "held and the foot says modelled"}`);
  if (billPrints && daysPrints) both++; else if (billPrints) billOnly++; else if (daysPrints) daysOnly++; else neither++;
  if (d.withheld === W.bill) billWithheld++;
  if ("withheld" in d.second && d.second.withheld === W.days) daysWithheld++;
  if (d.withheld === W.billNotOnFile) notOnFile++;
}
if (built < 190) fail(`only ${built} of ${codes.length} countries build a card; the shards are gone`, SHARDS, "restore data/facts/country/<ISO2>.json from the warehouse export (page-data/tools/export/to_website.py)");
if (faults.length) fail(`${faults.length} live fault(s) against the guard: ` + faults.slice(0, 20).join("; "));
for (const iso2 of ["SV", "GE", "IS", "SN"]) {
  const d = buildEntryBill(iso2);
  if (!d || d.withheld !== W.billNotOnFile) fail(`${iso2} holds no bill on file (the brief's four) and the card ${d ? `reads "${d.withheld ?? d.figure}"` : "does not build"}`, `${SHARDS}/${iso2}.json`, "if the shard now holds a bill, drop the country from this list and lower the not-on-file ceiling; otherwise fix the not-on-file branch in entry_bill_rows.ts");
}

/* ---- 3. THE COUNTS, A RATCHET THAT FALLS AND NEVER RISES ----------------- */
const CEILING = { billWithheld: 51, daysWithheld: 83, notOnFile: 4 };
const over: string[] = [], under: string[] = [];
for (const [k, v] of Object.entries(CEILING) as Array<[keyof typeof CEILING, number]>) {
  const have = { billWithheld, daysWithheld, notOnFile }[k];
  if (have > v) over.push(`${k} ${have} against a ceiling of ${v}`);
  else if (have < v) under.push(`${k} ${have}, the ceiling ${v} can fall`);
}
if (over.length) fail(`the guard withholds more than the fixture measured on 2026-09-17: ${over.join("; ")}`, SHARDS, "a new disagreement between a shard and its formation row entered the files; reconcile the two rows (DATA-REQUIREMENTS entry 2) rather than raising the ceiling");

/* ---- NEGATIVE TEST: the unguarded pair must still be caught -------------- */
let caught = 0;
for (const iso2 of codes) {
  const bill = countryFigure(iso2, ENTRY_BILL_METRICS.bill), days = countryFigure(iso2, ENTRY_BILL_METRICS.days);
  const llc = getFormationRowByTier(iso2, "LLC");
  if (!llc) continue;
  if ((bill && llc.costUsd != null && bill.value < llc.costUsd) || (days && llc.days != null && days.value < llc.days)) caught++;
}
if (caught === 0) fail("the negative test caught nothing: replayed against the unguarded pair, assertion 2 must report the countries whose shard figure sits below the table's, and it reported none, so the check has stopped checking", "tests/spine/entry_bill_guard.test.ts", "re-read the two files this test compares; if the data track has reconciled every row, retire the negative test with the reason");

console.log(
  `PASS entry_bill_guard. ${cases.length} of the brief's cases hold on the pure guard; ${built} countries build the card and none prints a figure below the table beside it; the reference is the masthead's LLC row on every one. Printed: both on ${both}, the bill alone on ${billOnly}, the days alone on ${daysOnly}, neither on ${neither} (${billWithheld} bills and ${daysWithheld} days withheld for disagreeing, ${notOnFile} bills not on file, ${noTable} countries with no LLC row). Unguarded, ${caught} countries would contradict their table.${under.length ? ` Ceiling can fall: ${under.join("; ")}.` : ""}`,
);
process.exit(0);
