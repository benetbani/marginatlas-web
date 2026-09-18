/**
 * src/lib/spine/income_rows.ts
 *
 * THE INCOME BREAKDOWN'S ROWS (task 11, 2026-09-10): a headline net income
 * percentage plus the cost lines that make up the rest of a sector's
 * revenue, read from data/finance/industry_cost_profile_v1.json.
 *
 * PROVENANCE, READ FROM THE FILE ITSELF before this was written. Its own
 * `anchor` field: "Cost shares are global-baseline (US/EU-anchored,
 * internal-only); the modifier matrix flexes each line by country profile."
 * Its own `convention` field: the nine shares plus the typical net margin
 * "= ~1.0" (approximately, not exactly, by that field's own wording). This
 * builder flexes nothing by country, so every figure it returns is MODELLED
 * for the trade worldwide, never measured for one place. That is why the
 * card wears the sample mark unconditionally (IncomeBreakdown.tsx) and why
 * his ruling of 2026-09-08 on this exact section keeps it quiet, the accent
 * moved off it.
 *
 * THE NET PERCENTAGE IS THE IMPLIED MARGIN, one minus the nine cost shares,
 * not net_margin_typical_low/high. Read before this was written:
 * scripts/verify_cost_share_invariant.ts already gates this same file on
 * exactly that identity ("Implied margin = 1.0 - sum_of_cost_shares",
 * checked against net_margin_hard_cap) and treats the low/high pair as a
 * validity RANGE for that implied figure, never as a second way to compute
 * it. Drawing net_margin_typical_* here instead would let this card
 * disagree with the identity that gate already proves for the same file, on
 * the same numbers, for no reason.
 *
 * THE RESIDUAL LAW (his instruction, this exact task): the segments and the
 * net percentage must sum to one hundred; if they do not, the difference is
 * named as its own segment, never absorbed and never hidden. Because net is
 * defined as the implied margin above, that identity holds BY CONSTRUCTION
 * for every sector this file holds today (checked: all 25 sectors and the
 * default fallback balance to within floating-point noise, far under the
 * tolerance below; see task-11-report.md). The residual branch near the
 * bottom of this file exists to keep that true if a future edit to the
 * source file, or a bug in this one, ever breaks it. It is proved by a
 * planted fault during this task's own verification, not assumed from
 * never having failed.
 */
import { COPY } from "@/lib/spine/copy";
import icpJson from "../../../data/finance/industry_cost_profile_v1.json";

type CostProfile = Record<string, unknown>;
type IcpFile = { sectors: Record<string, CostProfile> };
const ICP = icpJson as unknown as IcpFile;

const SHARE_KEYS = [
  "cogs_share",
  "labor_share",
  "rent_share",
  "energy_share",
  "marketing_share",
  "software_share",
  "insurance_share",
  "motor_vehicle_share",
  "other_overhead_share",
] as const;

export type IncomeSegment = { key: string; label: string; share: number };
export type IncomeBreakdownData = { netPct: number; segments: IncomeSegment[]; modelled: true };

/** At most this many cost lines are named on their own; the rest join one
 *  bucket. Four individual lines plus the bucket plus net is six rows in
 *  the legend, past which a legend reads as a list rather than a chart. */
const NAMED_SEGMENT_CAP = 4;

/** A cost line under three percent of revenue is a sliver no hatch can
 *  carry a legible legend swatch for; it joins the bucket regardless of its
 *  rank. A fraction, not points, to compare directly against the file's own
 *  units. */
const MIN_SHARE_TO_NAME = 0.03;

/** Fewer than two named lines and this is one figure wearing a chart's
 *  costume, not a breakdown: the section self-omits, the law every
 *  archetype in this file already follows. Never reached by the 25 sectors
 *  this file holds today (every one clears three, checked); kept for the
 *  sector it does not hold yet. */
const MIN_NAMED_SEGMENTS = 2;

/** The tolerance scripts/verify_cost_share_invariant.ts already gates this
 *  same file to (0.005 of revenue). Reused rather than invented so the two
 *  checks on the same numbers can never quietly disagree. Percentage
 *  points, since every value compared against it below already is. */
const TOLERANCE_PP = 0.5;

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/**
 * THE PURE COMPUTE, separated from the file lookup below so a fault can be
 * planted against it directly (a hand-built profile, never a real sector)
 * without touching the shipped data file. `buildIncomeBreakdown` is the one
 * a page calls; this is the one a proof script calls.
 */
export function buildIncomeBreakdownFromProfile(profile: CostProfile): IncomeBreakdownData | null {
  const shares = profileCostLines(profile);
  if (shares.length === 0) return null;

  const sumShares = shares.reduce((a, s) => a + s.share, 0);
  const netFrac = 1 - sumShares;
  const hardCap = num(profile.net_margin_hard_cap) ?? 1;
  // Cannot happen on data that already clears verify_cost_share_invariant.ts
  // (checked: it does, for all 25 sectors and the fallback); guarded anyway,
  // because this builder must be honest on its own, not on the gate's word.
  if (!Number.isFinite(netFrac)) return null;
  if (netFrac < -TOLERANCE_PP / 100) return null; // the nine shares alone already overrun revenue
  if (netFrac > hardCap + TOLERANCE_PP / 100) return null; // the shares are suspiciously thin; nothing credible to draw

  const netPct = netFrac * 100;
  const segments = composeIncomeSegments(shares, netPct);
  if (!segments) return null;
  return { netPct, segments, modelled: true };
}

/** One cost line before composition: its key, the label the legend prints,
 *  and its share of revenue as a FRACTION (the profile's own unit; a shard's
 *  percent is divided by a hundred at the door in split_rows.ts). */
export type CostLine = { key: string; label: string; share: number };

/** The profile's nine lines as cost lines, the ones held above zero, biggest
 *  first, each under the one-word label the copy table gives it. Exported
 *  so the trade page's split (split_rows.ts) reads the SAME lines off the
 *  same file when a shard's own drivers are not held (R7: one feed). */
export function profileCostLines(profile: CostProfile): CostLine[] {
  return SHARE_KEYS
    .map((key) => ({ key, label: COPY.incomeBreakdown.lines[key], share: num(profile[key]) ?? 0 }))
    .filter((s) => s.share > 0)
    .sort((a, b) => b.share - a.share);
}

/** The profile a sector is filed under, or null when the file holds none. */
export function sectorProfile(sector: string): CostProfile | null {
  return ICP.sectors?.[sector] ?? null;
}

/**
 * THE ONE LAW OF THE SEGMENTS (R7, MODEL.md PART 9 clause 42: "the income
 * breakdown under a second law ... cannot happen"), pulled out of the profile
 * builder on plan step 33's third dispatch (2026-09-18) so the trade page's
 * `05 split` composes its bar by THIS function and no other, with the net
 * pinned from outside (the one net builder's figure) instead of implied from
 * the shares. Given cost lines as fractions of revenue and a net in percent:
 *  - the largest few named individually (NAMED_SEGMENT_CAP), a line under
 *    MIN_SHARE_TO_NAME never named;
 *  - the rest one bucket, "Smaller costs", which is never allowed to outweigh
 *    a named line (lines are pulled in until it does not);
 *  - fewer than MIN_NAMED_SEGMENTS named lines is not a breakdown: null;
 *  - the lines plus the net short of a hundred by more than the tolerance is a
 *    residual NAMED as its own segment ("Unallocated"), never absorbed;
 *  - the lines plus the net OVER a hundred by more than the tolerance is a
 *    model claiming more than the whole of revenue: null, never scaled to fit.
 * Every branch is the profile builder's own, unchanged; only the seam moved.
 */
export function composeIncomeSegments(lines: CostLine[], netPct: number): IncomeSegment[] | null {
  if (!Number.isFinite(netPct)) return null;
  const shares = lines.filter((s) => Number.isFinite(s.share) && s.share > 0).sort((a, b) => b.share - a.share);
  if (shares.length === 0) return null;
  const sumShares = shares.reduce((a, s) => a + s.share, 0);

  // THE LARGEST FEW BY SHARE, NAMED INDIVIDUALLY: shares is sorted
  // descending already, so the first line under the floor ends the list,
  // nothing after it could have cleared it either.
  const named: CostLine[] = [];
  for (let i = 0; i < shares.length && i < NAMED_SEGMENT_CAP; i++) {
    if (shares[i].share < MIN_SHARE_TO_NAME) break;
    named.push(shares[i]);
  }
  if (named.length < MIN_NAMED_SEGMENTS) return null;

  let namedEnd = named.length;
  let other = sumShares - named.reduce((a, s) => a + s.share, 0);
  // NEVER LET THE BUCKET OUTWEIGH A NAMED LINE (his instruction): pull the
  // next-largest unlabelled share in, one at a time, until the bucket is no
  // longer the bar's biggest piece. Each pull strictly shrinks `other` (it
  // moves one positive value out of it), so this always terminates. Never
  // iterates on the 25 sectors shipped today, checked; proved instead by a
  // planted fault, recorded in task-11-report.md.
  while (other > named[0].share && namedEnd < shares.length) {
    other -= shares[namedEnd].share;
    named.push(shares[namedEnd]);
    namedEnd++;
  }

  const segments: IncomeSegment[] = named.map((s) => ({ key: s.key, label: s.label, share: s.share * 100 }));
  if (other > 0.00005) {
    segments.push({ key: "other", label: COPY.incomeBreakdown.otherLabel, share: other * 100 });
  }

  const drawnTotal = segments.reduce((a, s) => a + s.share, 0) + netPct;
  const residual = 100 - drawnTotal;
  if (residual > TOLERANCE_PP) {
    // A REAL RESIDUAL, NAMED, NEVER ABSORBED: the numbers did not balance to
    // the stated tolerance. Named as its own segment rather than folded into
    // "other" (a different concept: the small named lines' own aggregate)
    // or silently dropped.
    segments.push({ key: "unallocated", label: COPY.incomeBreakdown.residualLabel, share: residual });
  } else if (residual < -TOLERANCE_PP) {
    // The model claims more than the whole of revenue. Scaling the numbers
    // down to fit would be exactly the fabrication this task exists to
    // prevent, so the section self-omits instead of drawing a lie.
    return null;
  }
  return segments;
}

/** The residual law's tolerance, in percentage points, for the gates that count residuals the way this file does. */
export const INCOME_TOLERANCE_PP = TOLERANCE_PP;

export function buildIncomeBreakdown(sector: string): IncomeBreakdownData | null {
  const profile = sectorProfile(sector);
  if (!profile) return null;
  return buildIncomeBreakdownFromProfile(profile);
}
