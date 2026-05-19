"use client";

/**
 * CompareToMeClient — "how do I compare?" calculator.
 *
 * Privacy-by-design: the user's numbers stay in component state. The
 * only network call is the cell-lookup, which sends nothing personal.
 */

import { useEffect, useMemo, useState } from "react";
import { ComboField, type ComboOption } from "@/components/ComboField";
import { INDUSTRIES, INDUSTRY_BY_ID } from "@/lib/taxonomy";

const US_REGIONS = [
  "california", "texas", "new-york", "florida", "illinois", "pennsylvania",
  "ohio", "georgia", "north-carolina", "michigan", "washington",
  "massachusetts", "virginia", "new-jersey", "arizona",
];

type CompactCell = {
  country: string;
  region: string | null;
  industry: string;
  year: number | null;
  revenue_per_firm: number | null;
  rev_p10: number | null;
  rev_p90: number | null;
  n_enterprises: number | null;
  n_employees: number | null;
  payroll_per_employee: number | null;
  quality_score: number | null;
};

function fmtMoney(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "—";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

export function CompareToMeClient() {
  const [region, setRegion] = useState("california");
  const [industry, setIndustry] = useState("restaurants");
  const [myRevenue, setMyRevenue] = useState<string>("");
  // Plan v13 Wave 4a — headcount input removed (avg-staff comparison gone).

  const [cell, setCell] = useState<CompactCell | null>(null);
  const [loading, setLoading] = useState(false);

  const industryOptions: ComboOption[] = useMemo(
    () =>
      INDUSTRIES.map((i) => ({
        value: i.id,
        label: i.name,
        examples: i.examples,
        keywords: i.keywords,
      })),
    []
  );

  useEffect(() => {
    if (!industry) return;
    setLoading(true);
    const qs = new URLSearchParams({ country: "US", industry, region });
    fetch(`/api/cell-lookup?${qs.toString()}`)
      .then((r) => r.json())
      .then((j) => setCell(j.cell || null))
      .catch(() => setCell(null))
      .finally(() => setLoading(false));
  }, [region, industry]);

  const myRevenueNum = parseFloat(myRevenue.replace(/[^0-9.]/g, "")) || 0;

  // Compute percentile rank of user revenue within p10/p25/p50/p75/p90
  const percentileRank = useMemo(() => {
    if (!cell || !myRevenueNum) return null;
    const anchors: [number, number][] = [
      [0.10, cell.rev_p10 ?? 0],
      [0.50, cell.revenue_per_firm ?? 0],
      [0.90, cell.rev_p90 ?? 0],
    ].filter(([, v]) => v > 0) as [number, number][];
    if (anchors.length < 2) return null;
    // Find which segment we fall in and linearly interpolate
    const v = myRevenueNum;
    if (v <= anchors[0][1]) {
      // Below p10: scale within [0, anchors[0][0]]
      return Math.max(0, (v / anchors[0][1]) * anchors[0][0]);
    }
    for (let i = 0; i < anchors.length - 1; i++) {
      const [pLow, vLow] = anchors[i];
      const [pHigh, vHigh] = anchors[i + 1];
      if (v >= vLow && v <= vHigh) {
        const frac = (v - vLow) / Math.max(vHigh - vLow, 1);
        return pLow + frac * (pHigh - pLow);
      }
    }
    // Above p90: cap at 0.99
    return 0.99;
  }, [cell, myRevenueNum]);

  const revVsTypical = cell?.revenue_per_firm && myRevenueNum
    ? (myRevenueNum - cell.revenue_per_firm) / cell.revenue_per_firm
    : null;

  // Plan v13 Wave 4a — headcount-vs-typical comparison removed because the
  // avg-employees-per-firm denominator (n_enterprises) is unreliable.

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="card space-y-4">
          <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
            Your firm
          </div>
          <div>
            <label className="text-xs text-ink-700/70 mb-1 block">Industry</label>
            <ComboField
              id="cm-industry"
              label=""
              options={industryOptions}
              value={industry}
              onChange={setIndustry}
            />
          </div>
          <div>
            <label className="text-xs text-ink-700/70 mb-1 block">Region (US)</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-white border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-atlas-500/30"
            >
              {US_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-ink-700/70 mb-1 block">
              Your yearly revenue (USD)
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="e.g. 750000"
              value={myRevenue}
              onChange={(e) => setMyRevenue(e.target.value)}
              className="w-full bg-white border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-atlas-500/30"
            />
          </div>
          <p className="text-xs text-ink-700/60">
            Numbers stay in your browser. We never send them to a server.
          </p>
        </div>

        {/* Results */}
        <div className="card space-y-4">
          <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
            Where you sit
          </div>
          {loading && <div className="text-sm text-ink-700/70">Loading benchmarks…</div>}
          {!loading && !cell && (
            <div className="text-sm text-ink-700/70">
              Pick an industry and region above to load the benchmark.
            </div>
          )}
          {cell && (
            <>
              <div>
                <div className="text-xs text-ink-700/70 mb-1">
                  Industry: {INDUSTRY_BY_ID[industry]?.name || industry} in {cell.region} ({cell.year})
                </div>
                <div className="text-xs text-ink-700/70">
                  Typical firm earns <strong>{fmtMoney(cell.revenue_per_firm)}</strong>
                  &nbsp;· bottom 10% earns <strong>{fmtMoney(cell.rev_p10)}</strong>
                  &nbsp;· top 10% earns <strong>{fmtMoney(cell.rev_p90)}</strong>
                </div>
              </div>

              {/* Percentile bar */}
              {percentileRank != null && (
                <div className="space-y-2">
                  <div className="text-xs text-ink-700/70">
                    Your revenue puts you at roughly the{" "}
                    <strong className="text-ink-900">
                      {Math.round(percentileRank * 100)}
                      {ordinal(Math.round(percentileRank * 100))}
                    </strong>{" "}
                    percentile.
                  </div>
                  <div className="relative h-7 bg-slate-100/70 rounded overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-atlas-200 via-atlas-400 to-atlas-600"
                      style={{ width: "100%" }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-ink-900"
                      style={{ left: `${percentileRank * 100}%` }}
                      title="Your position"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-ink-700/60">
                    <span>Bottom 10%</span>
                    <span>Typical</span>
                    <span>Top 10%</span>
                  </div>
                </div>
              )}

              {revVsTypical != null && (
                <div className="mt-2">
                  <div className="border border-ink-200 rounded-lg p-3">
                    <div className="text-[10px] uppercase tracking-wide text-ink-700/60">
                      Revenue vs typical
                    </div>
                    <div
                      className={`text-2xl font-semibold ${
                        revVsTypical >= 0 ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {revVsTypical >= 0 ? "+" : ""}
                      {(revVsTypical * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
