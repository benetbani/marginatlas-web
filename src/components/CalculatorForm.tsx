"use client";

/**
 * CalculatorForm — /calculator page.
 *
 * Reframed for the Reformation Bible (Section 8 features #2 break-even and #6
 * owner take-home; Section 25 voice: blunt, skeptical of easy money). The two
 * strongest hooks are FREE here. The form keeps its full interactivity from the
 * v32 hotfix: an explicit Region selector (per-country options), an optional
 * Size band, never a silent default, and it always shows which cell answered.
 *
 * Pure client-side computation. It fetches the cell via /api/cell-lookup, then:
 *   - places the user's revenue in the p10..p90 distribution (percentile),
 *   - models break-even revenue and owner take-home from the trade's cost
 *     structure via computeBreakeven (a pure function, safe on the client).
 * No data collected. Modules that cannot be computed return null, never a
 * placeholder.
 */
import { useEffect, useMemo, useState } from "react";
import { fmtMoney } from "@/lib/format/money";
import { getRegionsForCountry } from "@/lib/regions/regions-by-country";
import { computeBreakeven, type BreakevenBreakdown } from "@/lib/economics/breakeven";
import { PercentileStrip } from "@/components/charts/PercentileStrip";

type Props = {
  /** `measured` marks a country that holds benchmarks at all. */
  countries: { code: string; name: string; measured?: boolean }[];
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

const fieldCls =
  "mt-1.5 w-full rounded-lg border border-parchment bg-cream-50 px-3 py-2.5 text-sm text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
const labelCls =
  "block text-[11px] font-semibold uppercase tracking-[0.14em] text-cocoa-500";

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

/** The five percentile points, present and ordered, for the distribution strip. */
function stripPoints(
  c: CellResult,
): { p10: number; p25: number; p50: number; p75: number; p90: number } | null {
  const { rev_p10, rev_p25, rev_p50, rev_p75, rev_p90 } = c;
  if (
    rev_p10 == null ||
    rev_p25 == null ||
    rev_p50 == null ||
    rev_p75 == null ||
    rev_p90 == null
  ) {
    return null;
  }
  if (!(rev_p10 < rev_p90) || rev_p10 <= 0) return null;
  return { p10: rev_p10, p25: rev_p25, p50: rev_p50, p75: rev_p75, p90: rev_p90 };
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
  // The revenue value that produced the current result, captured at submit so
  // the read does not drift while the user retypes before re-running.
  const [submittedRevenue, setSubmittedRevenue] = useState<number | null>(null);
  const [submittedIndustryId, setSubmittedIndustryId] = useState<string>("");

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

  // Break-even + owner take-home, modelled from the trade's cost structure.
  // Pure and synchronous; recomputed from the submitted inputs only.
  const breakeven: BreakevenBreakdown | null = useMemo(() => {
    if (!submittedIndustryId || submittedRevenue == null) return null;
    return computeBreakeven(submittedIndustryId, submittedRevenue, null);
  }, [submittedIndustryId, submittedRevenue]);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);
    setPct(null);
    setSubmittedRevenue(null);
    setSubmittedIndustryId("");
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
      setSubmittedRevenue(rev);
      setSubmittedIndustryId(ind.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed.");
    } finally {
      setLoading(false);
    }
  }

  const strip = result ? stripPoints(result) : null;
  const typical = result?.rev_p50 ?? null;
  const industryLabel = result?.industry_name?.toLowerCase() ?? "firms";

  return (
    <div className="atlas-card p-5 md:p-6">
      <form onSubmit={run} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className={labelCls}>Country</span>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={fieldCls}
            >
              {/* Split into what holds benchmarks and what does not.
                  101 of the 195 countries carry none, and a flat list sent a
                  reader through country, region, industry and revenue before
                  the form could tell them so. The split says it at the first
                  input instead of the fifth.

                  Both groups stay selectable, and deliberately: break-even is
                  modelled from the trade's cost structure, not from the
                  country, so that half of the tool answers anywhere. Only the
                  comparison against comparable firms needs a cell, and the
                  group label is scoped to the country because a country with
                  benchmarks can still be missing one specific region and trade,
                  which the form already says when it happens. */}
              <optgroup label="With benchmarks">
                {countries
                  .filter((c) => c.measured)
                  .map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
              </optgroup>
              {/* "No benchmarks yet", not "not measured yet". The gate on
                  provenance vocabulary in labels is right: how a figure was
                  produced is our word, what a reader can get from it is theirs. */}
              <optgroup label="No benchmarks yet">
                {countries
                  .filter((c) => !c.measured)
                  .map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
              </optgroup>
            </select>
          </label>
          <label className="block">
            <span className={labelCls}>Region</span>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className={fieldCls}
            >
              <option value="">Pick a region</option>
              {regionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelCls}>Industry</span>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className={fieldCls}
            >
              {industries.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelCls}>Size band</span>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className={fieldCls}
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
          <span className={labelCls}>Your annual revenue (USD)</span>
          <input
            type="text"
            inputMode="numeric"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            placeholder="e.g. 850000"
            className={`${fieldCls} tabular-nums`}
          />
        </label>
        <button
          type="submit"
          disabled={loading || !revenue || !region}
          className="rounded-lg bg-atlas-500 px-5 py-2.5 text-sm font-medium text-cream-50 transition-colors hover:bg-atlas-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50"
        >
          {loading ? "Running the numbers" : "Show me the numbers"}
        </button>
      </form>

      {error ? (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-clay-300 bg-clay-100 px-3 py-2 text-sm text-clay-900"
        >
          {error}
        </div>
      ) : null}

      {result && submittedRevenue != null ? (
        <div className="mt-8 border-t border-parchment/70 pt-8">
          {/* The verdict line: where the user lands against the typical firm. */}
          {pct != null && typical != null ? (
            <p className="max-w-2xl font-serif text-xl leading-snug text-ink-900 sm:text-2xl">
              At {fmtMoney(submittedRevenue)}, a {industryLabel} business in{" "}
              <span className="text-ink-900">{result.geo_name}</span> sits around
              the{" "}
              <span className="text-atlas-700 tabular-nums">{pct}th</span>{" "}
              percentile. The typical firm does{" "}
              <span className="tabular-nums">{fmtMoney(typical)}</span>.
            </p>
          ) : (
            <p className="max-w-2xl font-serif text-xl leading-snug text-ink-900 sm:text-2xl">
              Here is how {fmtMoney(submittedRevenue)} reads for a {industryLabel}{" "}
              business in{" "}
              <span className="text-ink-900">{result.geo_name}</span>.
            </p>
          )}

          {/* Distribution: the user's number marked against the full range. */}
          {strip ? (
            <div className="mt-7 max-w-3xl">
              <PercentileStrip
                p10={strip.p10}
                p25={strip.p25}
                p50={strip.p50}
                p75={strip.p75}
                p90={strip.p90}
                you={submittedRevenue}
                format={(n) => fmtMoney(n)}
              />
            </div>
          ) : null}

          {/* Break-even: the sales you actually need. Free. Omitted when the
              trade has no modelled cost structure. */}
          {breakeven ? (
            <section
              aria-labelledby="calc-breakeven-heading"
              className="mt-9"
            >
              <h2
                id="calc-breakeven-heading"
                data-typography="custom"
                className="text-xs font-semibold uppercase tracking-[0.14em] text-atlas-700"
              >
                What it takes to break even
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <article className="rounded-lg border border-parchment/70 bg-cream-50 p-4">
                  <h3
                    data-typography="custom"
                    className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-500"
                  >
                    Sales to break even
                  </h3>
                  <p className="mt-1 font-serif text-2xl leading-none text-ink-900 tabular-nums">
                    {fmtMoney(breakeven.breakevenRevenueMonthly * 12)}
                  </p>
                  <p className="mt-1 text-xs text-cocoa-500">a year</p>
                </article>
                <article className="rounded-lg border border-parchment/70 bg-cream-50 p-4">
                  <h3
                    data-typography="custom"
                    className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-500"
                  >
                    Monthly
                  </h3>
                  <p className="mt-1 font-serif text-2xl leading-none text-ink-900 tabular-nums">
                    {fmtMoney(breakeven.breakevenRevenueMonthly)}
                  </p>
                  <p className="mt-1 text-xs text-cocoa-500">in sales each month</p>
                </article>
                <article className="rounded-lg border border-parchment/70 bg-cream-50 p-4">
                  <h3
                    data-typography="custom"
                    className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-500"
                  >
                    Orders a day
                  </h3>
                  <p className="mt-1 font-serif text-2xl leading-none text-ink-900 tabular-nums">
                    {Math.max(1, Math.round(breakeven.breakevenOrdersDaily))}
                  </p>
                  <p className="mt-1 text-xs text-cocoa-500">
                    near {fmtMoney(breakeven.aov)} a ticket
                  </p>
                </article>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-graphite">
                This is the floor. It holds the trade&apos;s fixed costs, rent,
                payroll, utilities, insurance, licensing, against a{" "}
                {Math.round(breakeven.grossMargin * 100)}% gross margin and asks
                what sales clear them. Below this line the business runs at a
                loss.
              </p>

              {/* Owner take-home: everything above break-even, before tax. */}
              <div className="mt-5 rounded-lg border border-parchment/70 bg-cream-50 p-5">
                <h3
                  data-typography="custom"
                  className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-500"
                >
                  What is left for the owner
                </h3>
                {(() => {
                  const breakevenAnnual = breakeven.breakevenRevenueMonthly * 12;
                  const ownerPreTax =
                    (submittedRevenue - breakevenAnnual) * breakeven.grossMargin;
                  if (ownerPreTax > 0) {
                    return (
                      <>
                        <p className="mt-1 font-serif text-3xl leading-none text-moss-700 tabular-nums">
                          {fmtMoney(ownerPreTax)}
                        </p>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-graphite">
                          Everything above break-even is the owner&apos;s pay,
                          before tax. At your revenue that is roughly this much a
                          year, and tax, debt, and any unpaid family labour still
                          come out of it.
                        </p>
                      </>
                    );
                  }
                  return (
                    <>
                      <p className="mt-1 font-serif text-3xl leading-none text-clay-700 tabular-nums">
                        {fmtMoney(ownerPreTax)}
                      </p>
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-graphite">
                        At this revenue the firm has not cleared break-even, so
                        there is nothing left for the owner yet. It needs to reach{" "}
                        {fmtMoney(breakevenAnnual)} in sales before the owner gets
                        paid at all.
                      </p>
                    </>
                  );
                })()}
              </div>
            </section>
          ) : null}

          {/* The five-point bracket, for the reader who wants the raw spread. */}
          {strip ? (
            <div className="mt-9 grid grid-cols-5 gap-1 text-center text-xs">
              {(
                [
                  { k: "p10", label: "Bottom 10%" },
                  { k: "p25", label: "Lower mid" },
                  { k: "p50", label: "Typical" },
                  { k: "p75", label: "Upper mid" },
                  { k: "p90", label: "Top 10%" },
                ] as const
              ).map(({ k, label }) => (
                <div
                  key={k}
                  className="rounded-lg border border-parchment/70 bg-cream-50 p-2"
                >
                  <div className="text-[10px] uppercase tracking-wide text-cocoa-500">
                    {label}
                  </div>
                  <div className="mt-0.5 font-medium text-ink-900 tabular-nums">
                    {fmtMoney(result[`rev_${k}` as keyof CellResult] as number | null)}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {result.url ? (
            <a
              href={result.url}
              className="mt-7 inline-block text-sm font-medium text-atlas-700 hover:text-atlas-900"
            >
              See the full benchmark for this cell
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
