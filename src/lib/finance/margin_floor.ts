/**
 * Plan v13 Wave 2 — defensive margin floor.
 *
 * SMB margins below these thresholds are not credible — a business
 * with sub-3% net margin has already failed. Every public render of
 * a margin number goes through clampMargin() before display.
 */

export type MarginKind = "gross" | "operating" | "net";

const FLOORS: Record<MarginKind, number> = {
  gross: 0.15,
  operating: 0.05,
  net: 0.03,
};

export function clampMargin(value: number, kind: MarginKind): number {
  if (!isFinite(value)) return FLOORS[kind];
  return Math.max(FLOORS[kind], value);
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
