/**
 * TurnoverBandChip — ATO Phase 6.
 *
 * Small chip that displays the cell's turnover band (small / medium /
 * large) and the USD threshold range for that band. Mounted near the
 * existing size-band chip on the cell page.
 *
 * Returns null when the cell has no turnover_band classification
 * (unknown revenue) so the chip silently degrades.
 */

import * as React from "react";
import type { Cell } from "@/lib/cells";
import {
  labelTurnoverBand,
  getBandThresholds,
  fmtBandThreshold,
} from "@/lib/finance/turnover_band";

type Props = {
  cell: Cell;
};

export function TurnoverBandChip({ cell }: Props) {
  const band = cell.turnover_band;
  if (!band || band === "unknown") return null;
  const thresholds = getBandThresholds(cell.industry_id ?? null);
  const range = thresholds[band];
  const low = fmtBandThreshold(range.min_usd);
  const high = fmtBandThreshold(range.max_usd);
  const rangeLabel = range.max_usd == null ? `${low} ${high}` : `${low} to ${high}`;

  return (
    <span
      className="inline-flex items-baseline gap-1.5 px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wide font-semibold bg-atlas-50 text-atlas-700 border border-atlas-100"
      title={`Turnover band by revenue: ${rangeLabel} USD per year.`}
    >
      <span aria-hidden>$</span>
      <span>{labelTurnoverBand(band)} band</span>
      <span className="font-normal text-atlas-700/70 normal-case tracking-normal">
        {rangeLabel}
      </span>
    </span>
  );
}
