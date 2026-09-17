/**
 * src/lib/spine/checks_rows.ts
 *
 * BEFORE YOU COMMIT, the country page's `18 checks` (MODEL.md 8.2; plan step
 * 31, fifth dispatch, 2026-09-18): THE QUESTION LIST, written to NoteList's
 * law (a label over one line, hairlines between, no figure, no paragraph, no
 * tap state) and carrying no `data-editorial`, because `16 locals` is the
 * page's one prose section (PART 9 clause 44, R9). The card PRINTS ZERO
 * FIGURES by design: its subject is the reader's own plan, not a measurement
 * of the country. Two held figures only STEER which of two pre-written
 * questions appears, and neither is printed. Pure over the files,
 * synchronous, no database, so the harness and the copy gates can build
 * every country.
 *
 * THE BANK IS THE SITE'S ONE (M20). `CHECKS_BANK` below is the composition's
 * section 9 table keyed by row and branch, its strings taken from
 * COPY.checks once and never retyped; the trade page's `02 suits` (plan step
 * 33) reads the same keys where its subject matches, so a check is the same
 * words on both pages. A row is `{ label, fact }`, NoteList's own note type,
 * because the form IS NoteList's.
 *
 * THE TWO STEERING FIGURES, each with its file and field:
 *
 *  - THE REGIME: `getSmbRegime(iso2)` over `SMB_EFFECTIVE_RATES` in
 *    src/lib/tax/smb_effective_rates.ts, the hero's own lookup, held for 58
 *    of 195 and null on 137 (counted 2026-09-18). Held: "Is there a real
 *    margin left after tax and payroll?"; not held: "Do you know what tax and
 *    payroll will take?".
 *  - THE WAIT: the hero's LLC registration time, read through
 *    buildHeroFacts()'s `llc-time` cell exactly as the glance reads it
 *    (glance_rows.ts: "one builder, so the glance can never contradict the
 *    masthead"), which is the LLC row's `setup_days` in
 *    data/legal/business_formation_costs_v1.json through
 *    getFormationRowByTier(iso2, "LLC"). NEVER `daysToStart` in
 *    country_metrics.ts: that is the sole-trader pick and differs from the
 *    hero on 132 of the 152 (measured 2026-09-17, plan step 31's second
 *    dispatch). The page carries one registration time, and this row turns
 *    on it. Over 21 days: "Have you planned for the weeks before you can
 *    trade?"; 21 or under: "Have you tested the demand before you sign a
 *    lease?". WHERE THE DAYS ARE NULL THE ROW SELF-OMITS (R10, clause 45): a
 *    question about a wait the page cannot state would be a verdict in
 *    disguise. Counted over the 195 on 2026-09-18: three rows print on 152
 *    (33 over the threshold, 119 at or under), two rows on the 43 with no
 *    LLC row on file. The basis line says which: "Three questions, nothing
 *    scored." or "Two questions, nothing scored.".
 *
 * The bill card beside the registering table prints a DIFFERENT days figure,
 * the shard's `setup.total_days` (entry_bill_rows.ts says why the two are not
 * one quantity); this row reads the hero's, the one the page calls the
 * registration time, and its guard reads the same LLC row as its reference.
 */
import { getSmbRegime } from "@/lib/tax/smb_effective_rates";
import { buildHeroFacts } from "@/lib/spine/hero_facts";
import { COPY } from "@/lib/spine/copy";
import type { LocalNote } from "@/lib/spine/locals_rows";

/** The registration wait, in days, above which the third row asks about the weeks of paperwork. */
export const WAIT_DAYS_THRESHOLD = 21;

export type CheckRowKey = "price" | "margin" | "wait";
export type CheckBranch = "always" | "held" | "notHeld" | "over" | "under";

/** THE BANK: every row and branch, the composition's section 9 table, from COPY once. */
export const CHECKS_BANK: Record<CheckRowKey, Partial<Record<CheckBranch, LocalNote>>> = {
  price: { always: { label: COPY.checks.rows.price.label, fact: COPY.checks.rows.price.question } },
  margin: {
    held: { label: COPY.checks.rows.margin.label, fact: COPY.checks.rows.margin.held },
    notHeld: { label: COPY.checks.rows.margin.label, fact: COPY.checks.rows.margin.notHeld },
  },
  wait: {
    over: { label: COPY.checks.rows.wait.label, fact: COPY.checks.rows.wait.over },
    under: { label: COPY.checks.rows.wait.label, fact: COPY.checks.rows.wait.under },
  },
};

/** One row of the bank by its key and branch; a pair the bank does not hold throws, because it is a typo in source and never a data state. */
export function checkRow(key: CheckRowKey, branch: CheckBranch): LocalNote {
  const row = CHECKS_BANK[key][branch];
  if (!row) throw new Error(`checks_rows: no row for ${key}/${branch}; the bank holds ${Object.keys(CHECKS_BANK[key]).join(", ")}`);
  return row;
}

export type CheckRow = LocalNote & { key: CheckRowKey; branch: CheckBranch };

export type ChecksData = {
  iso2: string;
  /** Two or three rows, in the bank's order, each carrying the branch that chose it. */
  rows: CheckRow[];
  /** "Three questions, nothing scored." or "Two questions, nothing scored.", by the row count. */
  basis: string;
  /** True where a small-business regime row is on file (58 of 195). */
  regimeHeld: boolean;
  /** The hero's LLC registration time, or null where the formation file holds no LLC row (43 of 195). */
  days: number | null;
};

/** The hero's LLC registration time as the glance reads it, or null. */
export function heroRegistrationDays(iso2: string): number | null {
  const cell = buildHeroFacts(iso2).cells.find((c) => c.key === "llc-time") ?? null;
  const days = cell ? parseInt(cell.value, 10) : NaN;
  return cell && Number.isFinite(days) && days > 0 ? days : null;
}

export function buildChecks(iso2In: string): ChecksData {
  const iso2 = iso2In.toUpperCase();
  const regimeHeld = getSmbRegime(iso2) != null;
  const days = heroRegistrationDays(iso2);
  const rows: CheckRow[] = [
    { key: "price", branch: "always", ...checkRow("price", "always") },
    regimeHeld ? { key: "margin", branch: "held", ...checkRow("margin", "held") } : { key: "margin", branch: "notHeld", ...checkRow("margin", "notHeld") },
  ];
  if (days != null) {
    const branch: CheckBranch = days > WAIT_DAYS_THRESHOLD ? "over" : "under";
    rows.push({ key: "wait", branch, ...checkRow("wait", branch) });
  }
  return { iso2, rows, basis: rows.length === 3 ? COPY.checks.basis.three : COPY.checks.basis.two, regimeHeld, days };
}
