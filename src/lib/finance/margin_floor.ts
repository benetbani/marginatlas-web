/**
 * Defensive margin floor.
 * Defensive margin ceiling.
 *
 * SMB margins below these thresholds are not credible — a business
 * with sub-3% net margin has already failed. Above the ceiling band,
 * a margin is not a normal SMB outcome (40% net for a hotel is a
 * formula error, not a business). Every public render of a margin
 * number goes through clampMargin() before display.
 */
import marginCapsJson from "./margin_caps.json";
import industriesJson from "../taxonomy/industries.json";

export type MarginKind = "gross" | "operating" | "net";

const FLOORS: Record<MarginKind, number> = {
  gross: 0.15,
  operating: 0.05,
  net: 0.03,
};

// Default absolute ceilings — applied when no industry context is known.
const ABSOLUTE_CEILINGS: Record<MarginKind, number> = {
  gross: 0.90,
  operating: 0.50,
  net: 0.40,
};

type Cap = { typical_low: number; typical_high: number; investigate: number; hard_cap: number };
const CAPS = marginCapsJson as unknown as {
  default_fallback: Cap;
  sectors: Record<string, Cap>;
};
const INDUSTRY_TO_SECTOR = new Map<string, string>();
for (const ind of (industriesJson as { industries: Array<{ id: string; sector_id: string }> }).industries) {
  INDUSTRY_TO_SECTOR.set(ind.id, ind.sector_id);
}

function netCeilingFor(industryId?: string | null): number {
  if (!industryId) return ABSOLUTE_CEILINGS.net;
  const sector = INDUSTRY_TO_SECTOR.get(industryId);
  if (!sector) return ABSOLUTE_CEILINGS.net;
  return (CAPS.sectors[sector] || CAPS.default_fallback).hard_cap;
}

export function clampMargin(value: number, kind: MarginKind, industryId?: string | null): number {
  if (!isFinite(value)) return FLOORS[kind];
  let ceiling = ABSOLUTE_CEILINGS[kind];
  if (kind === "net") {
    ceiling = netCeilingFor(industryId);
  }
  return Math.min(ceiling, Math.max(FLOORS[kind], value));
}

export function clampMargins(m: {
  gross_margin?: number | null;
  operating_margin?: number | null;
  net_margin?: number | null;
}) {
  return {
    gross_margin: m.gross_margin != null ? clampMargin(m.gross_margin, "gross") : null,
    operating_margin: m.operating_margin != null ? clampMargin(m.operating_margin, "operating") : null,
    net_margin: m.net_margin != null ? clampMargin(m.net_margin, "net") : null,
  };
}

/**
 * Clamp a net margin expressed as a WHOLE-NUMBER PERCENT (e.g. 12 for 12%),
 * returning a percent. Boards carry net margin in two shapes: as a fraction
 * (0..1, run through clampMargin directly) and as a pre-multiplied percent
 * (the curated London economics figure). This is the percent-form sibling of
 * clampMargin: it reuses the exact same FLOORS.net / per-industry hard_cap
 * band, so a 0.4% or a 95% net margin can never reach a board no matter which
 * shape it arrived in. Non-finite input returns the floor (as a percent), the
 * same defensive default clampMargin uses. Pure.
 */
export function clampNetMarginPct(valuePct: number, industryId?: string | null): number {
  if (!isFinite(valuePct)) return FLOORS.net * 100;
  return clampMargin(valuePct / 100, "net", industryId) * 100;
}

/**
 * Bound a survival triple (share surviving to year 1, 3, 5; whole-number
 * percents) so a board can never print a survival curve that is impossible on
 * its face. Two invariants are enforced, silently:
 *
 *   1. Range: every present value is clamped into 0..100.
 *   2. Monotonicity: a later year can never exceed an earlier one. yr3 is
 *      pulled down to yr1 if it sits above it, and yr5 down to yr3, so the
 *      displayed curve always satisfies 0 <= yr5 <= yr3 <= yr1 <= 100.
 *
 * A non-finite value (null, NaN, Infinity) is returned as null so the row
 * dashes rather than printing garbage. A later year is only ever pulled DOWN
 * to its predecessor, never pushed up, so a present-but-low figure is never
 * inflated. Pure; no clamp ever loosens an already-valid curve.
 */
export function boundSurvivalCurve(curve: {
  yr1?: number | null;
  yr3?: number | null;
  yr5?: number | null;
}): { yr1: number | null; yr3: number | null; yr5: number | null } {
  const into0to100 = (v: number | null | undefined): number | null =>
    v != null && isFinite(v) ? Math.max(0, Math.min(100, v)) : null;

  const yr1 = into0to100(curve.yr1);
  let yr3 = into0to100(curve.yr3);
  let yr5 = into0to100(curve.yr5);

  // Monotone non-increasing: clamp each later year down to the previous one
  // (only when both are present, so a missing earlier year does not zero a
  // later one).
  if (yr1 != null && yr3 != null && yr3 > yr1) yr3 = yr1;
  if (yr3 != null && yr5 != null && yr5 > yr3) yr5 = yr3;

  return { yr1, yr3, yr5 };
}

/**
 * The largest competitor density (firms per 10k residents) a board will
 * DISPLAY. Set so it cannot contradict the crowding gauge, which saturates at
 * 25 firms per 10k: a category four times denser than a saturated high street
 * is not a real per-place reading but a wrong-scale or wrong-geo artifact, so
 * the displayed number dashes rather than print an absurd figure. The gauge's
 * crowdingScore is unaffected (it already saturates), so this only guards the
 * literal "N per 10k residents" text.
 */
export const DENSITY_PER_10K_DISPLAY_CAP = 100;

/**
 * Sanitise a competitor-density figure (firms per 10k residents) for DISPLAY.
 * Returns the value unchanged when it is a finite, non-negative number at or
 * below DENSITY_PER_10K_DISPLAY_CAP; returns null (so the row dashes) when it
 * is non-finite, negative, or implausibly large. The board keeps feeding the
 * raw density to crowdingScore for the gauge (which saturates); this only
 * decides whether the literal number is shown. Pure.
 */
export function displayDensityPer10k(per10k: number | null | undefined): number | null {
  if (per10k == null || !isFinite(per10k)) return null;
  if (per10k < 0) return null;
  if (per10k > DENSITY_PER_10K_DISPLAY_CAP) return null;
  return per10k;
}
