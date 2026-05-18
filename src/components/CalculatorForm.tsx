"use client";

/**
 * CalculatorForm — client component for the /calculator page.
 *
 * Pure client-side computation: fetches the cell via /api/cell-lookup,
 * then renders the user's percentile from the cell's p10/p25/p50/p75/p90
 * via linear interpolation. No data collection.
 */
import { useState } from "react";

type Props = {
  countries: { code: string; name: string }[];
  industries: { id: string; name: string; slug: string }[];
};

type CellResult = {
  geo_name?: string;
  industry_name?: string;
  year?: number;
  rev_p10: number | null;
  rev_p25: number | null;
  rev_p50: number | null;
  rev_p75: number | null;
  rev_p90: number | null;
  url?: string;
};

const DEFAULT_GEO: Record<string, string> = {
  US: "california",
  GB: "gb",
  DE: "germany",
  FR: "france",
  IT: "italy",
  ES: "madrid",
  JP: "japan",
  BR: "br-sp",
  MX: "mx-cmx",
  CA: "ca-on",
  AU: "australia",
  IN: "india",
  CH: "ch",
  AE: "ae",
  AL: "al",
};

function percentileFor(amount: number, c: CellResult): number | null {
  const points: Array<[number, number]> = [];
  if (c.rev_p10 != null) points.push([c.rev_p10, 10]);
  if (c.rev_p25 != null) points.push([c.rev_p25, 25]);
  if (c.rev_p50 != null) points.push([c.rev_p50, 50]);
  if (c.rev_p75 != null) points.push([c.rev_p75, 75]);
  if (c.rev_p90 != null) points.push([c.rev_p90, 90]);
  if (points.length < 2) return null;
  if (amount <= points[0][0]) return Math.max(1, Math.round(points[0][1] * (amount / points[0][0])));
  if (amount >= points[points.length - 1][0]) {
    // Beyond p90 — extrapolate up to 99
    const last = points[points.length - 1];
    return Math.min(99, last[1] + Math.round(Math.min((amount / last[0] - 1) * 9, 9)));
  }
  for (let i = 0; i < points.length - 1; i++) {
    const [v0, p0] = points[i];
    const [v1, p1] = points[i + 1];
    if (amount >= v0 && amount <= v1) {
      const ratio = (amount - v0) / Math.max(1, v1 - v0);
      return Math.round(p0 + ratio * (p1 - p0));
    }
  }
  return null;
}

function fmtMoney(v: number | null | undefined): string {
  if (v == null) return "—";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

export function CalculatorForm({ countries, industries }: Props) {
  const [country, setCountry] = useState("US");
  const [industry, setIndustry] = useState("restaurants");
  const [revenue, setRevenue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CellResult | null>(null);
  const [error, setError] = useState("");
  const [pct, setPct] = useState<number | null>(null);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);
    setPct(null);
    try {
      const rev = parseFloat(revenue.replace(/[, $]/g, ""));
      if (!isFinite(rev) || rev <= 0) {
        setError("Enter a revenue number greater than zero.");
        setLoading(false);
        return;
      }
      const ind = industries.find((i) => i.id === industry);
      if (!ind) {
        setError("Pick an industry.");
        setLoading(false);
        return;
      }
      const geo = DEFAULT_GEO[country] || country.toLowerCase();
      const url = `/api/cell-lookup?country=${country}&region=${geo}&industry=${ind.id}`;
      const r = await fetch(url);
      if (!r.ok) {
        setError(`No cell found for ${ind.name} in ${country}. Try another industry.`);
        setLoading(false);
        return;
      }
      const body = await r.json();
      if (!body.cell) {
        setError(`No cell found for ${ind.name} in ${country}. Try another country or industry.`);
        setLoading(false);
        return;
      }
      const cell = body.cell as CellResult & { region?: string; industry?: string; cellUrl?: string };
      const adapted: CellResult = {
        ...cell,
        geo_name: cell.region || undefined,
        industry_name: cell.industry || ind.name,
        url: cell.cellUrl || `/${country.toLowerCase()}/${geo}/${ind.slug}`,
      };
      setResult(adapted);
      const p = percentileFor(rev, adapted);
      setPct(p);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <form onSubmit={run} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs uppercase tracking-wide text-ink-700/70 font-medium">
              Country
            </span>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-ink-200 bg-white text-sm"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wide text-ink-700/70 font-medium">
              Industry
            </span>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-ink-200 bg-white text-sm"
            >
              {industries.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="text-xs uppercase tracking-wide text-ink-700/70 font-medium">
            Your annual revenue (USD)
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            placeholder="e.g. 850000"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-ink-200 bg-white text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={loading || !revenue}
          className="px-5 py-2.5 rounded-full bg-ink-900 text-cream-50 hover:bg-ink-800 transition text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Looking up…" : "Show me where I sit"}
        </button>
      </form>

      {error ? (
        <div className="mt-4 px-3 py-2 rounded-lg bg-clay-100 border border-clay-300 text-sm text-clay-900">
          {error}
        </div>
      ) : null}

      {result && pct != null ? (
        <div className="mt-6 rounded-xl border border-atlas-300 bg-atlas-50 p-5">
          <div className="text-xs uppercase tracking-wide text-atlas-700 font-semibold">
            Your percentile
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <div className="text-5xl font-bold text-atlas-700 tabular-nums">
              {pct}
              <span className="text-2xl font-medium">th</span>
            </div>
            <div className="text-sm text-ink-700">
              out of comparable {result.industry_name?.toLowerCase()} firms in{" "}
              {result.geo_name}.
            </div>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-1 text-xs text-center">
            {(["p10", "p25", "p50", "p75", "p90"] as const).map((k) => (
              <div key={k} className="p-2 rounded bg-white border border-ink-200">
                <div className="text-ink-700/60 uppercase tracking-wide text-[10px]">
                  {k}
                </div>
                <div className="font-medium text-ink-900 tabular-nums">
                  {fmtMoney(result[`rev_${k}` as keyof CellResult] as number | null)}
                </div>
              </div>
            ))}
          </div>
          {result.url ? (
            <a
              href={result.url}
              className="mt-4 inline-block text-sm text-atlas-700 hover:text-atlas-900 font-medium"
            >
              See the full cell →
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
