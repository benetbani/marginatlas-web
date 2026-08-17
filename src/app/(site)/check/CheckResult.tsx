/**
 * /check result — ATO Phase 7.
 *
 * Pure render. Consumes a CheckVerdict from the verdict engine and
 * displays the per-ratio comparison + headline summary.
 */

import * as React from "react";
import type { CheckVerdict, RatioStatus } from "@/lib/check/verdict_engine";

type Props = {
  verdict: CheckVerdict;
};

function pct(v: number | null): string {
  if (v == null) return "-";
  return Math.round(v * 100) + "%";
}

/**
 * Chip classes per ratio status.
 *
 * WHAT WAS HERE, and it broke three separate rules at once: six raw hex
 * literals inline (tokens only), a stock `emerald` ramp no token file on this
 * site defines, and a red/blue/green traffic-light on an axis that is NOT
 * good-versus-bad. "Above typical" is bad for a cost ratio and good for a
 * revenue one, so the colour was asserting a verdict the data does not carry.
 *
 * THE AXIS IS DIRECTION, so it is drawn with intensity and the word, which is
 * the replacement the palette gate names in its own failure message. Both
 * departures are terracotta and differ by WEIGHT, mapped onto the thing they
 * actually mean: above reads heavier because it is more, below lighter because
 * it is less. These are steps 3 and 2 of the ladder in scores/band_tone.ts, so
 * this page stops carrying a private scale. In-range is the quiet state, which
 * is correct on a page whose job is to show a reader which rows are off, and
 * every chip prints its own label beside the colour.
 */
function statusColour(status: RatioStatus): string {
  switch (status) {
    case "above":
      return "text-atlas-700 bg-atlas-100 border-atlas-300";
    case "below":
      return "text-atlas-700 bg-atlas-50 border-atlas-200";
    case "in_range":
      return "text-ink-900 bg-parchment border-parchment";
    case "unknown":
      return "text-ink-500 bg-paper-100 border-ink-200";
  }
}

function statusLabel(status: RatioStatus): string {
  switch (status) {
    case "above":
      return "Above typical";
    case "below":
      return "Below typical";
    case "in_range":
      return "In range";
    case "unknown":
      return "Not supplied";
  }
}

export function CheckResult({ verdict }: Props) {
  return (
    <section
      aria-labelledby="check-result-heading"
      className="atlas-card overflow-hidden"
    >
      <div className="px-5 py-5 md:px-8 md:py-7 bg-white border-b border-ink-100">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-atlas-700 mb-2">
          Your comparative verdict
        </div>
        <h2
          id="check-result-heading"
          className="font-display text-xl md:text-2xl leading-snug text-ink-900 mb-2"
        >
          {verdict.headline}
        </h2>
        <p className="text-sm text-cocoa-700/80">
          {verdict.industryLabel}, {verdict.bandLabel}. The one ratio
          most predictive of true turnover for this industry is{" "}
          <span className="font-semibold">
            {verdict.keyBenchmark === "cogs"
              ? "cost of sales"
              : verdict.keyBenchmark === "labor"
                ? "labour cost"
                : verdict.keyBenchmark === "rent"
                  ? "rent"
                  : verdict.keyBenchmark === "motor_vehicle"
                    ? "motor vehicle"
                    : "total expenses"}
          </span>
          .
        </p>
      </div>

      <ul className="divide-y divide-ink-100">
        {verdict.ratios.map((r) => (
          <li key={r.ratio} className="px-5 py-4 md:px-8 md:py-5">
            <div className="flex items-baseline justify-between gap-3 mb-1.5 flex-wrap">
              <div className="font-display text-base md:text-lg font-semibold text-ink-900">
                {r.label}
              </div>
              <span
                className={
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wide font-semibold border " +
                  statusColour(r.status)
                }
              >
                {statusLabel(r.status)}
              </span>
            </div>
            <div className="flex items-baseline gap-4 text-sm text-cocoa-700/85 mb-1.5 flex-wrap">
              <span>
                You: <span className="font-semibold text-ink-900 tabular-nums">{pct(r.yourShare)}</span>
              </span>
              <span>
                Typical: <span className="tabular-nums">{pct(r.range.low)} to {pct(r.range.high)}</span>
                {r.estimated && (
                  <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide font-semibold bg-paper-100 text-ink-500 border border-ink-200">
                    Estimate
                  </span>
                )}
              </span>
            </div>
            <p className="text-xs md:text-sm text-cocoa-700/75 leading-relaxed">
              {r.message}
            </p>
          </li>
        ))}
      </ul>

      {verdict.estimated && (
        <div className="px-5 py-4 md:px-8 md:py-5 bg-white border-t border-ink-100">
          <p className="text-xs text-cocoa-700/70 leading-relaxed">
            Typical ranges here are read at the sector level. Treat them
            as orientation, not a measured benchmark for this exact
            group.
          </p>
        </div>
      )}
    </section>
  );
}
