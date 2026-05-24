"use client";

/**
 * CalculatorForm — /calculator page.
 *
 * Plan v32 hotfix. Founder reported that picking "Restaurants" gave
 * California data without warning. Root cause: the form auto-defaulted
 * region to California for US without a visible selector. Fix: add an
 * explicit Region selector (per-country options) and an optional Size
 * band; never silently default; always show which cell answered.
 *
 * Pure client-side computation: fetches the cell via /api/cell-lookup,
 * then renders the user's percentile from p10/p25/p50/p75/p90 via
 * linear interpolation. No data collected.
 */
import { useEffect, useMemo, useState } from "react";
import { fmtMoney } from "@/lib/format/money";
import { getRegionsForCountry } from "@/lib/regions/regions-by-country";

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

const SIZE_BANDS = [
  { value: "", label: "Any size" },
  { value: "1", label: "Solo (1 person)" },
  { value: "2-9", label: "Very small (2-9)" },
  { value: "10-49", label: "Small (10-49)" },
  { value: "50-249", label: "Medium (50-249)" },
];

function percentileFor(amount: number, c: CellResult): number | null {
  const points: Array<[number, number]> = [];
  if (c.rev_p10 != null) points.push([c.rev_p10, 10]);
  if (c.rev_p25 != null) points.push([c.rev_p25, 25]);
  if (c.rev_p50 != null) points.push([c.rev_p50, 50]);
  if (c.rev_p75 != null) points.push([c.rev_p75, 75]);
  if (c.rev_p90 != null) points.push([c.rev_p90, 90]);
  if (points.length < 2) return null;
  const first = points[0];
  const last = points[points.length - 1];
  if (amount < first[0]) {
    return Math.max(1, first[1] - Math.round(Math.min((1 - amount / first[0]) * 9, 9)));
  }
  if (amount > last[0]) {
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

export function CalculatorForm({ countries, industries }: Props) {
  const [country, setCountry] = useState("US");
  const [region, setRegion] = useState("");
  const [industry, setIndustry] = useState("restaurants");
  const [size, setSize] = useState("");
  const [revenue, setRevenue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CellResult | null>(null);
  const [error, setError] = useState("");
  const [pct, setPct] = useState<number | null>(null);

  // Per-country region options; reset region when country changes.
  const regionOptions = useMemo(() => {
    const name = countries.find((c) => c.code === country)?.name || country;
    return getRegionsForCountry(country, name);
  }, [country, countries]);

  useEffect(() => {
    // When country changes, force the user to re-pick a region instead of
    // silently inheriting the previous one (which would land on the wrong cell).
    setRegion("");
  }, [country]);

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
      if (!region) {
        setError("Pick a region so the comparison runs against the right cell.");
        setLoading(false);
        return;
      }
      const params = new URLSearchParams({
        country,
        region,
        industry: ind.id,
      });
      if (size) params.set("size", size);
      const url = `/api/cell-lookup?${params.toString()}`;
      const r = await fetch(url);
      if (!r.ok) {
        setError(`No cell found for ${ind.name} in that region. Try another combination.`);
        setLoading(false);
        return;
      }
      const body = await r.json();
      if (!body.cell) {
        setError(`No cell found for ${ind.name} in that region. Try another combination.`);
        setLoading(false);
        return;
      }
      const cell = body.cell as CellResult & { region?: string; industry?: string; cellUrl?: string };
      const adapted: CellResult = {
        ...cell,
        geo_name: cell.region || region,
        industry_name: cell.industry || ind.name,
        url: cell.cellUrl || `/${country.toLowerCase()}/${region}/${ind.slug}`,
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
              Region
            </span>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-ink-200 bg-white text-sm"
            >
              <option value="">Pick a region…</option>
              {regionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
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
          <label className="block">
            <span className="text-xs uppercase tracking-wide text-ink-700/70 font-medium">
              Size band
            </span>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-ink-200 bg-white text-sm"
            >
              {SIZE_BANDS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
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
          disabled={loading || !revenue || !region}
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
          <div className="mt-1 flex items-baseline gap-2 flex-wrap">
            <div className="text-4xl md:text-5xl font-bold text-atlas-700 tabular-nums">
              {pct}
              <span className="text-xl md:text-2xl font-medium">th</span>
            </div>
            <div className="text-sm text-ink-700">
              of {result.industry_name?.toLowerCase()} in{" "}
              <span className="font-semibold text-ink-900">{result.geo_name}</span>.
            </div>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-1 text-xs text-center">
            {(
              [
                { k: "p10", label: "Bottom 10%" },
                { k: "p25", label: "Lower mid" },
                { k: "p50", label: "Typical" },
                { k: "p75", label: "Upper mid" },
                { k: "p90", label: "Top 10%" },
              ] as const
            ).map(({ k, label }) => (
              <div key={k} className="p-2 rounded bg-white border border-ink-200">
                <div className="text-ink-700/60 tracking-wide text-[10px]">
                  {label}
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
