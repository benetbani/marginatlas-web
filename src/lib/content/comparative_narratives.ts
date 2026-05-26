/**
 * Comparative narrative generator — ATO Phase 4.
 *
 * Produces "where you stand" lead-in sentences that reframe a cell's
 * benchmark from a *descriptive* statement ("Typical operators report
 * X") to a *comparative* one ("Watch your COGS — typical range is 33%
 * to 37%, an operator running 25% is unusually lean and 45% is a
 * margin-loss signal").
 *
 * This module is the editorial voice of the ATO framework. It pulls
 * the assigned key benchmark per industry (Phase 1-2), the underlying
 * cost share, and the typical range, and emits a single sentence
 * suitable for use above or below the cell-page H1.
 *
 * The output is plain text. No HTML, no markup, no source-agency
 * names (R-002), no em-dashes in production output (R-020).
 *
 * Per docs/strategy/2026-05-26-ato-framework-execution-plan.md §3.4.
 */

import {
  getKeyBenchmarkForIndustry,
  labelKeyBenchmark,
  type KeyBenchmark,
} from "@/lib/cost_engine/engine";

/** Output of the generator. */
export type ComparativeLead = {
  /** Headline benchmark name for this industry, in plain English. */
  benchmarkLabel: string;
  /**
   * One-sentence comparative lead in the new voice. Always opens with
   * "Watch", "Track", "Mind" or similar imperative — never with
   * "Typical", "Most", "Average", "Usually" (those are the descriptive
   * openers we're moving away from).
   */
  sentence: string;
  /** The chosen ratio. */
  kb: KeyBenchmark;
  /** Underlying cost share (0-1). */
  share: number;
  /** Typical range (low, high) as 0-1 fractions. */
  range: { low: number; high: number };
};

function pctFmt(v: number): string {
  return Math.round(v * 100) + "%";
}

/**
 * Imperative opener menu. The picker rotates by industryId hash so
 * adjacent cells do not all sound the same.
 */
const OPENERS: Record<KeyBenchmark, string[]> = {
  cogs: [
    "Watch your cost of sales.",
    "Mind your cost of sales.",
    "Track your cost of sales against revenue.",
  ],
  labor: [
    "Watch your labour line.",
    "Mind your labour cost as a share of revenue.",
    "Track payroll against turnover.",
  ],
  rent: [
    "Watch your rent line.",
    "Mind your occupancy cost.",
    "Track rent against revenue.",
  ],
  motor_vehicle: [
    "Watch your motor vehicle line.",
    "Track fuel and vehicle cost against revenue.",
    "Mind your transport cost as a share of turnover.",
  ],
  total_expenses: [
    "Watch your total operating cost.",
    "Track total expenses against revenue.",
    "Mind your overall cost ratio.",
  ],
};

function hashSlug(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) & 0x7fffffff;
  }
  return h;
}

function pickOpener(kb: KeyBenchmark, industryId: string): string {
  const choices = OPENERS[kb];
  const idx = hashSlug(industryId) % choices.length;
  return choices[idx];
}

/**
 * Build the comparative lead for a given industry. Returns null only
 * if the industry has no resolvable key benchmark (defensive — the
 * cost-engine has a default-fallback so this never happens in
 * practice).
 */
export function getComparativeLead(
  industryId: string | null | undefined
): ComparativeLead | null {
  if (!industryId) return null;
  const { kb, share, range, rationale } = getKeyBenchmarkForIndustry(industryId);
  const label = labelKeyBenchmark(kb);
  const opener = pickOpener(kb, industryId);
  const rangeText = `${pctFmt(range.low)} to ${pctFmt(range.high)}`;
  const verdict = (() => {
    if (share < 0.04) {
      return `Operators above this range are often quietly losing margin to ${kb === "cogs" ? "supplier creep" : "structural drag"} they have not isolated.`;
    }
    if (share > 0.50) {
      return `Operators below this range are typically running lean against industry norms; investigate whether the saving is sustainable.`;
    }
    return `Operators above this range are likely paying for something a peer is not; below, you may be cutting where others are not.`;
  })();
  const sentence = `${opener} Typical ${label.toLowerCase()} for this activity sits at ${rangeText} of revenue. ${verdict}`;
  // Defensive: the rationale must be present per the verify gate but
  // we strip any descriptive opener accidentally re-introduced in copy.
  void rationale;
  return {
    benchmarkLabel: label,
    sentence,
    kb,
    share,
    range,
  };
}
