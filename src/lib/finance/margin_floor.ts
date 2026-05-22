/**
 * Plan v13 Wave 2 — defensive margin floor.
 * Plan v28 Lane A — defensive margin ceiling.
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
