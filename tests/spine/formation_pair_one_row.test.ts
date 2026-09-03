/**
 * The registration fee and the registration wait come off ONE row (C31, 2026-09-03).
 *
 * WHY THIS EXISTS, and it is the fault it was written against rather than a
 * hypothetical. The country page's peers table prints "Cost to register" and
 * "Time to register" side by side as one country's pair. Until today those two
 * columns were resolved by TWO SEPARATE PICK ORDERS over one file,
 * `data/legal/business_formation_costs_v1.json`:
 *
 *   the FEE  , src/lib/tax/country_rates.ts        , Sole Trader ?? first NON-Freelancer ?? row 0
 *   the WAIT , src/lib/economics/country_metrics.ts, Sole Trader ?? Freelancer ?? LLC ?? min(days)
 *
 * They agree wherever a Sole Trader tier exists and disagree everywhere else,
 * which is 8 of the 152 countries in the file. Belgium printed "$1,200" (its
 * limited company) beside "7 days" (its freelancer). On five of the eight the
 * printed pair sat on NO row of the source at all. It reached 23 of the atlas's
 * 51 peer tables, 35 rows, and it was invisible to all 134 gates because every
 * figure was individually real: only the PAIRING was invented.
 *
 * WHAT IS PROVED, and the first assertion is deliberately implementation-blind:
 *
 *   1. THE PAIR EXISTS IN THE SOURCE. For every country the atlas holds, some
 *      single row of the raw JSON carries exactly the fee the fee accessor
 *      returns AND exactly the wait the snapshot returns. This catches any
 *      future re-divergence however it is written, including a third private
 *      picker copied into a fourth file, because it never looks at the pick
 *      order , only at whether the printed pair is a fact.
 *   2. IT IS THE SAME ROW BOTH MODULES CHOSE. The cross-module identity:
 *      `getCountryEconomicsSnapshot(iso).daysToStart` equals the `days` of the
 *      row `getTypicalFormationRow(iso)` picks. Assertion 1 alone can pass on a
 *      coincidence (three of the eight broken countries had two tiers sharing a
 *      filing time, so their invented pair happened to match a real row).
 *   3. THE EIGHT NAMED COUNTRIES RESOLVE. ES, MX, BE, GR, RO, AR, MA and TN are
 *      asserted by name, so a regression that only touches the no-Sole-Trader
 *      branch cannot hide behind 144 passing countries.
 *
 * NEGATIVE-TESTED: re-running assertion 1 against the OLD fee picker, which the
 * file below reconstructs, must report the eight. If it reports none, the check
 * has stopped checking and the test says so and exits 1.
 */
import formationJson from "../../data/legal/business_formation_costs_v1.json";
import {
  getTypicalFormationRow,
  getTypicalFormationCostUsd,
} from "../../src/lib/tax/country_rates";
import { getCountryEconomicsSnapshot } from "../../src/lib/economics/country_metrics";

type Row = {
  tier?: string;
  setup_cost_usd?: number;
  setup_days?: number;
  complexity_score?: number;
};
const COUNTRIES = (formationJson as { countries?: Record<string, Row[]> }).countries ?? {};

/** The eight the defect reached, from the measurement in country_rates.ts. */
const NO_SOLE_TRADER = ["ES", "MX", "BE", "GR", "RO", "AR", "MA", "TN"];

const fail = (msg: string) => {
  console.error("x formation_pair_one_row: " + msg);
  process.exit(1);
};

/** Does any single row of this country carry BOTH figures? */
function pairSitsOnOneRow(rows: Row[], fee: number | null, days: number | null): boolean {
  if (fee == null && days == null) return true;
  return rows.some(
    (r) =>
      (fee == null || r.setup_cost_usd === fee) && (days == null || r.setup_days === days),
  );
}

function main() {
  const isos = Object.keys(COUNTRIES);
  if (isos.length < 100) fail(`the formation file holds ${isos.length} countries; the fixture is gone`);

  /* ---- 1. THE PAIR EXISTS IN THE SOURCE, for every country ---------------- */
  const invented: string[] = [];
  for (const iso of isos) {
    const rows = COUNTRIES[iso];
    if (!Array.isArray(rows) || rows.length === 0) continue;
    const fee = getTypicalFormationCostUsd(iso);
    const days = getCountryEconomicsSnapshot(iso).daysToStart;
    if (!pairSitsOnOneRow(rows, fee, days)) {
      invented.push(`${iso} prints $${fee} / ${days} days, which sits on no row of the file`);
    }
  }
  if (invented.length > 0) {
    fail(
      `${invented.length} country pair(s) exist in no row of the source:\n  ` +
        invented.join("\n  "),
    );
  }

  /* ---- 2. IT IS THE SAME ROW BOTH MODULES CHOSE -------------------------- */
  const split: string[] = [];
  for (const iso of isos) {
    const pick = getTypicalFormationRow(iso);
    if (!pick) continue;
    const days = getCountryEconomicsSnapshot(iso).daysToStart;
    const fee = getTypicalFormationCostUsd(iso);
    if (fee !== pick.costUsd) split.push(`${iso}: the fee accessor returned $${fee}, the picked ${pick.tier} row holds $${pick.costUsd}`);
    if (days !== pick.days) split.push(`${iso}: the snapshot returned ${days} days, the picked ${pick.tier} row holds ${pick.days}`);
  }
  if (split.length > 0) {
    fail(`the two modules are back on different rows:\n  ` + split.join("\n  "));
  }

  /* ---- 3. THE EIGHT NAMED COUNTRIES -------------------------------------- */
  for (const iso of NO_SOLE_TRADER) {
    const rows = COUNTRIES[iso];
    if (!Array.isArray(rows) || rows.length === 0) fail(`${iso} left the formation file; this test's fixture needs rewriting`);
    if (rows.some((r) => r.tier === "Sole Trader")) {
      fail(`${iso} now HAS a Sole Trader tier, so it no longer exercises the branch this test guards; pick a replacement country with none`);
    }
    const pick = getTypicalFormationRow(iso)!;
    const days = getCountryEconomicsSnapshot(iso).daysToStart;
    if (pick.costUsd == null || days == null) fail(`${iso} lost a figure: fee ${pick.costUsd}, days ${days}`);
    if (days !== pick.days) fail(`${iso} still splits its pair: fee from ${pick.tier}, ${days} days from elsewhere`);
  }

  /* ---- NEGATIVE TEST: the old picker must still be caught ----------------- */
  const oldFee = (rows: Row[]) =>
    rows.find((r) => r.tier === "Sole Trader") ??
    rows.find((r) => r.tier !== "Freelancer") ??
    rows[0];
  let caught = 0;
  for (const iso of isos) {
    const rows = COUNTRIES[iso];
    if (!Array.isArray(rows) || rows.length === 0) continue;
    const fee = oldFee(rows)?.setup_cost_usd ?? null;
    const days = getCountryEconomicsSnapshot(iso).daysToStart;
    if (!pairSitsOnOneRow(rows, fee, days)) caught++;
  }
  if (caught === 0) {
    fail(
      "the negative test caught nothing: replayed against the pre-C31 fee picker, assertion 1 must report the countries whose pair sits on no row. It reported none, so the check has stopped checking.",
    );
  }

  console.log(
    `PASS formation_pair_one_row. ${isos.length} countries: every registration fee and wait sit on one row of the source, both modules pick the same row, and the ${NO_SOLE_TRADER.length} countries with no Sole Trader tier resolve. The pre-C31 picker is still caught (${caught} country/countries).`,
  );
  process.exit(0);
}

main();
