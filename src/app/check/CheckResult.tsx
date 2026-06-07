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

function statusColour(status: RatioStatus): string {
  switch (status) {
    case "above":
      return "text-[#B23A2A] bg-[#FBE8E1] border-[#F5C9B8]";
    case "below":
      return "text-[#2A5BA8] bg-[#E1ECFB] border-[#B8CCF0]";
    case "in_range":
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "unknown":
      return "text-ink-500 bg-ink-50 border-ink-200";
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
      className="rounded-2xl bg-white border border-ink-200 overflow-hidden"
    >
      <div className="px-5 py-5 md:px-8 md:py-7 bg-cream-50 border-b border-ink-100">
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
                  <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide font-semibold bg-ink-50 text-ink-500 border border-ink-200">
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
        <div className="px-5 py-4 md:px-8 md:py-5 bg-cream-50 border-t border-ink-100">
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
