/**
 * /admin/review — Plan v11 Q15: single review queue across all Q1-Q14
 * data quality scans.
 *
 * Gated by ?key=<ADMIN_KEY>. Reads the JSON snapshots produced by the
 * scanner scripts and renders one consolidated tab per check. Each flag
 * carries a unique cell signature; founder can mark correct / wrong /
 * defer via a future POST endpoint (Plan v11 finisher).
 */
import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function loadJson<T = unknown>(filename: string): T | null {
  const candidates = [
    path.resolve(process.cwd(), "data/quality", filename),
    path.resolve(process.cwd(), "delivery/quality", filename),
  ];
  for (const p of candidates) {
    try {
      return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
    } catch {
      continue;
    }
  }
  return null;
}

type CurrencyReport = {
  generated_at: string;
  totals: { cells_scanned: number; flagged_total: number; by_country: Record<string, number> };
  samples: Array<{
    country: string;
    geo_id?: string | null;
    industry_id: string;
    size_band: string;
    stored_revenue: number;
    stored_revenue_peer_ratio: number;
    converted_revenue_usd: number;
    converted_peer_ratio: number;
    peer_median_usd: number;
    fx_rate: number;
  }>;
};

type VarianceReport = {
  generated_at: string;
  totals: { flagged_total: number };
  samples: Array<{
    industry_id: string;
    size_band: string;
    n_countries: number;
    max_min_ratio: number;
    lowest_country: string;
    lowest_revenue: number;
    highest_country: string;
    highest_revenue: number;
    median_revenue: number;
  }>;
};

type TierReport = {
  tier_counts: Record<string, number>;
  tier_violations: Record<string, number>;
};

type SmallNReport = {
  buckets: Record<string, number>;
  by_country_top_30_thin: Record<string, Record<string, number>>;
};

type YoYReport = {
  totals: { flagged_transitions: number };
  samples: Array<{
    country: string;
    geo_id?: string | null;
    industry_id: string;
    size_band: string;
    year_from: number;
    year_to: number;
    revenue_from: number;
    revenue_to: number;
    ratio: number;
  }>;
};

type PlausibilityReport = {
  totals: {
    flagged_total: number;
    by_check: Record<string, number>;
  };
  samples: Array<Record<string, unknown>>;
};

type TaxVerifiedReport = {
  summary: {
    total_verified?: number;
    matches?: number;
    minor_deltas?: number;
    flags?: number;
    pending?: number;
  };
  results: Record<string, {
    our_cit: number;
    canonical_cit?: number;
    canonical_cit_range?: [number, number];
    delta_pp?: number | string;
    verdict: "match" | "minor_delta" | "flag";
    notes: string;
    source_url: string;
  }>;
};

type RentVerifiedReport = {
  summary: {
    total_verified?: number;
    matches?: number;
    minor_deltas?: number;
    flags?: number;
    pending_cities?: number;
  };
  results: Record<string, {
    our_value_usd_sqm_yr: number;
    canonical_usd_sqm_yr: number;
    canonical_basis: string;
    delta_pct: string;
    verdict: "match" | "minor_delta" | "flag";
    notes: string;
    source_url: string;
  }>;
  review_queue?: Array<{ city_id: string; issue: string; severity: string }>;
};

type MarginVerifiedReport = {
  summary: {
    matches?: number;
    minor_deltas?: number;
    flags?: number;
    pending?: number;
  };
  important_caveat?: string;
  results: Record<string, {
    our_op_margin: number;
    damodaran_op_margin?: number;
    damodaran_op_margin_proxy?: number;
    delta_pp: number;
    verdict: "match" | "minor_delta" | "flag";
    notes: string;
    source_url: string;
  }>;
};

type TaxonomyBundlingReport = {
  version: string;
  generated_at: string;
  total_industries: number;
  flagged_count: number;
  split_count: number;
  rename_count: number;
  flagged: Array<{
    industry_id: string;
    current_name: string;
    current_audience?: string;
    current_sector_id?: string;
    current_examples: string[];
    current_keywords?: string[];
    current_naics_3: string[];
    severity_score: number;
    dubious_because: string;
    suggested_splits: Array<{
      new_id: string;
      new_name: string;
      examples_subset: string[];
      naics_3_subset: string[];
      sector_id: string;
    }>;
    recommended_action: "split" | "rename" | "keep";
  }>;
};

function fmtMoney(v: number | null | undefined): string {
  if (v == null || !isFinite(v)) return "—";
  const sign = v < 0 ? "−" : "";
  const abs = Math.abs(v);
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(0)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

export default async function ReviewQueue({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; tab?: string }>;
}) {
  const sp = await searchParams;
  const required = process.env.ADMIN_KEY;
  if (!required || sp.key !== required) {
    notFound();
  }

  const currency = loadJson<CurrencyReport>("currency_sanity_v1.json");
  const variance = loadJson<VarianceReport>("variance_audit_v1.json");
  const tier = loadJson<TierReport>("tier_integrity_v1.json");
  const smallN = loadJson<SmallNReport>("small_n_v1.json");
  const yoy = loadJson<YoYReport>("yoy_stability_v1.json");
  const plaus = loadJson<PlausibilityReport>("plausibility_scan_v1.json");
  const taxVerified = loadJson<TaxVerifiedReport>("tax_rates_verified_v1.json");
  const rentVerified = loadJson<RentVerifiedReport>("commercial_rent_verified_v1.json");
  const marginVerified = loadJson<MarginVerifiedReport>("industry_margins_verified_v1.json");
  const taxonomyBundling = loadJson<TaxonomyBundlingReport>("taxonomy_bundling_audit_v1.json");

  const totals = {
    currency: currency?.totals.flagged_total ?? 0,
    variance: variance?.totals.flagged_total ?? 0,
    smallN: (smallN?.buckets["<5"] ?? 0) + (smallN?.buckets["5-19"] ?? 0),
    yoy: yoy?.totals.flagged_transitions ?? 0,
    plausibility: plaus?.totals.flagged_total ?? 0,
    taxFlags: (taxVerified?.summary.flags ?? 0) + (taxVerified?.summary.minor_deltas ?? 0),
    rentFlags: (rentVerified?.summary.flags ?? 0) + (rentVerified?.summary.minor_deltas ?? 0),
    marginFlags: (marginVerified?.summary.flags ?? 0) + (marginVerified?.summary.minor_deltas ?? 0),
  };
  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);

  const tab = sp.tab || "currency";

  return (
    <div className="py-12">
      <div className="text-xs uppercase tracking-wide text-clay-700 font-semibold">
        internal review
      </div>
      <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-ink-900">
        Data quality review queue
      </h1>
      <p className="mt-2 text-sm text-ink-700/80 max-w-2xl">
        Consolidated output of Plan v11 quality scans Q1, Q3, Q12, Q13,
        Q14, and Plan v10 Track PP. Nothing here is auto-corrected.
        Decisions go into a Supabase review_decisions table once that
        ships (Q15 finisher).
      </p>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-7 gap-2">
        <Stat label="Total flags" value={grandTotal} accent />
        <Stat label="Currency (Q1)" value={totals.currency} href={`?key=${sp.key}&tab=currency`} active={tab === "currency"} />
        <Stat label="Variance (Q3)" value={totals.variance} href={`?key=${sp.key}&tab=variance`} active={tab === "variance"} />
        <Stat label="Plausibility (PP)" value={totals.plausibility} href={`?key=${sp.key}&tab=plausibility`} active={tab === "plausibility"} />
        <Stat label="Small-n (Q12)" value={totals.smallN} href={`?key=${sp.key}&tab=smallN`} active={tab === "smallN"} />
        <Stat label="YoY (Q14)" value={totals.yoy} href={`?key=${sp.key}&tab=yoy`} active={tab === "yoy"} />
        <Stat label="Verifications" value={totals.taxFlags + totals.rentFlags + totals.marginFlags} href={`?key=${sp.key}&tab=verifications`} active={tab === "verifications"} />
      </div>

      {tab === "currency" && currency ? <CurrencyTab data={currency} /> : null}
      {tab === "variance" && variance ? <VarianceTab data={variance} /> : null}
      {tab === "smallN" && smallN ? <SmallNTab data={smallN} /> : null}
      {tab === "yoy" && yoy ? <YoYTab data={yoy} /> : null}
      {tab === "plausibility" && plaus ? <PlausibilityTab data={plaus} /> : null}
      {tab === "tier" && tier ? <TierTab data={tier} /> : null}
      {tab === "verifications" ? <VerificationsTab tax={taxVerified} rent={rentVerified} margin={marginVerified} taxonomy={taxonomyBundling} /> : null}
    </div>
  );
}

function VerificationsTab({
  tax,
  rent,
  margin,
  taxonomy,
}: {
  tax: TaxVerifiedReport | null;
  rent: RentVerifiedReport | null;
  margin: MarginVerifiedReport | null;
  taxonomy: TaxonomyBundlingReport | null;
}) {
  return (
    <section className="mt-10 space-y-10">
      <div>
        <h2 className="text-xl font-semibold text-ink-900">
          Q5 — Tax rate cross-validation
          {tax ? ` (${tax.summary.total_verified ?? 0}/${(tax.summary.total_verified ?? 0) + (tax.summary.pending ?? 0)} countries)` : ""}
        </h2>
        <p className="mt-1 text-sm text-ink-700/80 max-w-3xl">
          Each country&apos;s stored corporate income tax rate cross-checked against PwC Worldwide Tax Summaries 2024 (and KPMG/national tax offices where useful).
        </p>
        {tax ? (
          <>
            <div className="mt-3 flex gap-2 text-xs">
              <Pill tone="moss">{tax.summary.matches ?? 0} matches</Pill>
              <Pill tone="amber">{tax.summary.minor_deltas ?? 0} minor deltas</Pill>
              <Pill tone="clay">{tax.summary.flags ?? 0} flags</Pill>
              <Pill tone="ink">{tax.summary.pending ?? 0} pending</Pill>
            </div>
            <div className="mt-4 overflow-x-auto rounded-xl border border-ink-200">
              <table className="w-full text-xs">
                <thead className="bg-cream-100 text-ink-900 text-left">
                  <tr>
                    <th className="py-2 px-2">Country</th>
                    <th className="py-2 px-2 text-right">Stored CIT</th>
                    <th className="py-2 px-2 text-right">Canonical</th>
                    <th className="py-2 px-2 text-right">Delta</th>
                    <th className="py-2 px-2">Verdict</th>
                    <th className="py-2 px-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(tax.results).map(([iso, r]) => (
                    <tr key={iso} className="border-t border-ink-200/40 align-top">
                      <td className="py-1.5 px-2 font-medium">{iso}</td>
                      <td className="py-1.5 px-2 text-right tabular-nums">{(r.our_cit * 100).toFixed(1)}%</td>
                      <td className="py-1.5 px-2 text-right tabular-nums">
                        {r.canonical_cit != null
                          ? `${(r.canonical_cit * 100).toFixed(1)}%`
                          : r.canonical_cit_range
                          ? `${(r.canonical_cit_range[0] * 100).toFixed(0)}-${(r.canonical_cit_range[1] * 100).toFixed(0)}%`
                          : "—"}
                      </td>
                      <td className="py-1.5 px-2 text-right tabular-nums">
                        {typeof r.delta_pp === "number" ? `${r.delta_pp > 0 ? "+" : ""}${r.delta_pp.toFixed(1)}pp` : r.delta_pp ?? "—"}
                      </td>
                      <td className="py-1.5 px-2">
                        <VerdictPill v={r.verdict} />
                      </td>
                      <td className="py-1.5 px-2 max-w-[360px] text-ink-700/85">{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="mt-3 text-xs text-ink-700/60">No tax_rates_verified_v1.json on disk.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-ink-900">
          Q7 — Commercial rent cross-validation
          {rent ? ` (${rent.summary.total_verified ?? 0}/${(rent.summary.total_verified ?? 0) + (rent.summary.pending_cities ?? 0)} cities)` : ""}
        </h2>
        <p className="mt-1 text-sm text-ink-700/80 max-w-3xl">
          Each city&apos;s stored office rent (USD per sqm per year) checked against Cushman &amp; Wakefield / Colliers / JLL 2024 reports.
        </p>
        {rent ? (
          <>
            <div className="mt-3 flex gap-2 text-xs">
              <Pill tone="moss">{rent.summary.matches ?? 0} matches</Pill>
              <Pill tone="amber">{rent.summary.minor_deltas ?? 0} minor deltas</Pill>
              <Pill tone="clay">{rent.summary.flags ?? 0} flags</Pill>
              <Pill tone="ink">{rent.summary.pending_cities ?? 0} pending</Pill>
            </div>
            <div className="mt-4 overflow-x-auto rounded-xl border border-ink-200">
              <table className="w-full text-xs">
                <thead className="bg-cream-100 text-ink-900 text-left">
                  <tr>
                    <th className="py-2 px-2">City</th>
                    <th className="py-2 px-2 text-right">Stored</th>
                    <th className="py-2 px-2 text-right">Canonical</th>
                    <th className="py-2 px-2 text-right">Delta</th>
                    <th className="py-2 px-2">Verdict</th>
                    <th className="py-2 px-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(rent.results).map(([city, r]) => (
                    <tr key={city} className="border-t border-ink-200/40 align-top">
                      <td className="py-1.5 px-2 font-medium">{city}</td>
                      <td className="py-1.5 px-2 text-right tabular-nums">${r.our_value_usd_sqm_yr}</td>
                      <td className="py-1.5 px-2 text-right tabular-nums">${r.canonical_usd_sqm_yr}</td>
                      <td className="py-1.5 px-2 text-right tabular-nums">{r.delta_pct}</td>
                      <td className="py-1.5 px-2"><VerdictPill v={r.verdict} /></td>
                      <td className="py-1.5 px-2 max-w-[360px] text-ink-700/85">{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rent.review_queue && rent.review_queue.length > 0 ? (
              <div className="mt-4 rounded-xl border border-clay-300 bg-clay-50 p-3">
                <div className="text-xs uppercase tracking-wide font-semibold text-clay-700">Founder review queue</div>
                <ul className="mt-2 space-y-1.5 text-sm text-ink-900">
                  {rent.review_queue.map((q, i) => (
                    <li key={i}>
                      <span className="font-medium">{q.city_id}</span> — {q.issue}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        ) : (
          <p className="mt-3 text-xs text-ink-700/60">No commercial_rent_verified_v1.json on disk.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-ink-900">
          Q9 — Industry operating-margin cross-validation
          {margin ? ` (${(margin.summary.matches ?? 0) + (margin.summary.minor_deltas ?? 0) + (margin.summary.flags ?? 0)}/180 industries)` : ""}
        </h2>
        <p className="mt-1 text-sm text-ink-700/80 max-w-3xl">
          Stored operating margins cross-checked against Damodaran NYU 2024 dataset.
        </p>
        {margin?.important_caveat ? (
          <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-ink-900">
            <span className="font-semibold uppercase tracking-wide text-amber-900">Caveat —</span> {margin.important_caveat}
          </div>
        ) : null}
        {margin ? (
          <>
            <div className="mt-3 flex gap-2 text-xs">
              <Pill tone="moss">{margin.summary.matches ?? 0} matches</Pill>
              <Pill tone="amber">{margin.summary.minor_deltas ?? 0} minor</Pill>
              <Pill tone="clay">{margin.summary.flags ?? 0} flags</Pill>
              <Pill tone="ink">{margin.summary.pending ?? 0} pending</Pill>
            </div>
            <div className="mt-4 overflow-x-auto rounded-xl border border-ink-200">
              <table className="w-full text-xs">
                <thead className="bg-cream-100 text-ink-900 text-left">
                  <tr>
                    <th className="py-2 px-2">Industry</th>
                    <th className="py-2 px-2 text-right">Atlas op-margin</th>
                    <th className="py-2 px-2 text-right">Damodaran</th>
                    <th className="py-2 px-2 text-right">Δpp</th>
                    <th className="py-2 px-2">Verdict</th>
                    <th className="py-2 px-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(margin.results).map(([id, r]) => (
                    <tr key={id} className="border-t border-ink-200/40 align-top">
                      <td className="py-1.5 px-2 font-medium">{id}</td>
                      <td className="py-1.5 px-2 text-right tabular-nums">{(r.our_op_margin * 100).toFixed(1)}%</td>
                      <td className="py-1.5 px-2 text-right tabular-nums">
                        {((r.damodaran_op_margin ?? r.damodaran_op_margin_proxy ?? 0) * 100).toFixed(1)}%
                        {r.damodaran_op_margin_proxy ? "*" : ""}
                      </td>
                      <td className="py-1.5 px-2 text-right tabular-nums">{r.delta_pp > 0 ? "+" : ""}{r.delta_pp.toFixed(1)}</td>
                      <td className="py-1.5 px-2"><VerdictPill v={r.verdict} /></td>
                      <td className="py-1.5 px-2 max-w-[420px] text-ink-700/85">{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="mt-3 text-xs text-ink-700/60">No industry_margins_verified_v1.json on disk.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-ink-900">
          Taxonomy — industry bundling audit
          {taxonomy ? ` (${taxonomy.flagged_count}/${taxonomy.total_industries} flagged)` : ""}
        </h2>
        <p className="mt-1 text-sm text-ink-700/80 max-w-3xl">
          Industries that bundle two or more unrelated business models —
          e.g. <span className="font-mono text-xs">auto_dealers_gas</span> mixes
          motor-vehicle dealers (NAICS 441) with gasoline stations (NAICS 447).
          Multi-NAICS-3 bundles and conjunction names are scored;
          severity reflects how confident the heuristic is that a split
          is needed. Action links carry the decision into a query string
          for a follow-up split script.
        </p>
        {taxonomy ? (
          <>
            <div className="mt-3 flex gap-2 text-xs">
              <Pill tone="clay">{taxonomy.split_count} split candidates</Pill>
              <Pill tone="amber">{taxonomy.rename_count} rename candidates</Pill>
              <Pill tone="ink">{taxonomy.total_industries - taxonomy.flagged_count} clean</Pill>
            </div>
            <div className="mt-4 overflow-x-auto rounded-xl border border-ink-200">
              <table className="w-full text-xs">
                <thead className="bg-cream-100 text-ink-900 text-left">
                  <tr>
                    <th className="py-2 px-2">Industry</th>
                    <th className="py-2 px-2 text-right">Sev</th>
                    <th className="py-2 px-2">Why dubious</th>
                    <th className="py-2 px-2">Suggested splits</th>
                    <th className="py-2 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {taxonomy.flagged.map((f) => (
                    <tr key={f.industry_id} className="border-t border-ink-200/40 align-top">
                      <td className="py-1.5 px-2 max-w-[200px]">
                        <div className="font-medium text-ink-900">{f.current_name}</div>
                        <div className="text-[10px] font-mono text-ink-700/70">{f.industry_id}</div>
                        <div className="mt-0.5 text-[10px] text-ink-700/60">
                          NAICS-3: {f.current_naics_3.join(", ") || "—"}
                        </div>
                      </td>
                      <td className="py-1.5 px-2 text-right tabular-nums font-semibold">
                        {f.severity_score}
                      </td>
                      <td className="py-1.5 px-2 max-w-[320px] text-ink-700/85">
                        {f.dubious_because}
                      </td>
                      <td className="py-1.5 px-2 max-w-[260px]">
                        {f.suggested_splits.length === 0 ? (
                          <span className="text-ink-700/50">—</span>
                        ) : (
                          <ul className="space-y-1">
                            {f.suggested_splits.map((s) => (
                              <li key={s.new_id} className="text-[11px]">
                                <span className="font-medium">{s.new_name}</span>
                                <span className="ml-1 font-mono text-[10px] text-ink-700/70">
                                  {s.new_id}
                                </span>
                                {s.naics_3_subset.length > 0 ? (
                                  <span className="ml-1 text-[10px] text-ink-700/60">
                                    [{s.naics_3_subset.join(",")}]
                                  </span>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                      <td className="py-1.5 px-2">
                        <div className="flex flex-col gap-1">
                          <a
                            href={`?decision=split&id=${f.industry_id}`}
                            className="text-[10px] px-2 py-0.5 rounded border border-clay-300 bg-clay-50 text-clay-900 hover:bg-clay-100 text-center"
                          >
                            Split
                          </a>
                          <a
                            href={`?decision=rename&id=${f.industry_id}`}
                            className="text-[10px] px-2 py-0.5 rounded border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 text-center"
                          >
                            Rename
                          </a>
                          <a
                            href={`?decision=keep&id=${f.industry_id}`}
                            className="text-[10px] px-2 py-0.5 rounded border border-parchment bg-cream-100 text-ink-900 hover:bg-cream-200 text-center"
                          >
                            Keep
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="mt-3 text-xs text-ink-700/60">No taxonomy_bundling_audit_v1.json on disk. Run <span className="font-mono">python scripts/quality/audit_industry_bundling.py</span>.</p>
        )}
      </div>
    </section>
  );
}

function Pill({ tone, children }: { tone: "moss" | "amber" | "clay" | "ink"; children: React.ReactNode }) {
  const map = {
    moss: "bg-moss-100 text-moss-900 border-moss-300",
    amber: "bg-amber-100 text-amber-900 border-amber-300",
    clay: "bg-clay-100 text-clay-900 border-clay-300",
    ink: "bg-cream-100 text-ink-900 border-parchment",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-medium ${map[tone]}`}>
      {children}
    </span>
  );
}

function VerdictPill({ v }: { v: "match" | "minor_delta" | "flag" }) {
  const map = {
    match: { tone: "moss" as const, label: "match" },
    minor_delta: { tone: "amber" as const, label: "minor" },
    flag: { tone: "clay" as const, label: "flag" },
  };
  const m = map[v];
  return <Pill tone={m.tone}>{m.label}</Pill>;
}

function Stat({
  label,
  value,
  accent,
  href,
  active,
}: {
  label: string;
  value: number;
  accent?: boolean;
  href?: string;
  active?: boolean;
}) {
  const content = (
    <div
      className={`p-3 rounded-xl border ${
        active
          ? "bg-ink-900 text-cream-50 border-ink-900"
          : accent
          ? "bg-atlas-50 text-atlas-900 border-atlas-300"
          : "bg-cream-100 border-parchment text-ink-900"
      } transition`}
    >
      <div className={`text-xs uppercase tracking-wide font-medium ${active ? "text-cream-200" : "text-ink-700/70"}`}>
        {label}
      </div>
      <div className="mt-0.5 text-xl font-semibold tabular-nums">
        {value.toLocaleString()}
      </div>
    </div>
  );
  if (href) return <a href={href} className="block">{content}</a>;
  return content;
}

function CurrencyTab({ data }: { data: CurrencyReport }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-ink-900">
        Q1 — Currency conversion sanity ({data.totals.flagged_total.toLocaleString()} flags)
      </h2>
      <p className="mt-1 text-sm text-ink-700/80 max-w-3xl">
        Cells where revenue/firm is 10× a peer median AND dividing by the
        country&apos;s local-to-USD FX rate brings it into 0.1-10× range —
        i.e. almost certainly stored in local currency.
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {Object.entries(data.totals.by_country).slice(0, 12).map(([c, n]) => (
          <span key={c} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-clay-100 border border-clay-300 text-clay-900 font-medium">
            {c} · {n.toLocaleString()}
          </span>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-ink-200">
        <table className="w-full text-xs">
          <thead className="bg-cream-100 text-ink-900">
            <tr className="text-left">
              <th className="py-2 px-2">Cell</th>
              <th className="py-2 px-2 text-right">Stored</th>
              <th className="py-2 px-2 text-right">If local→USD</th>
              <th className="py-2 px-2 text-right">Peer median</th>
              <th className="py-2 px-2 text-right">FX</th>
            </tr>
          </thead>
          <tbody>
            {data.samples.slice(0, 100).map((s, i) => (
              <tr key={i} className="border-t border-ink-200/40">
                <td className="py-1.5 px-2">
                  <a
                    href={`/${s.country.toLowerCase()}/${(s.geo_id || s.country).toLowerCase()}/${s.industry_id.replace(/_/g, "-")}`}
                    className="text-atlas-700 hover:text-atlas-900"
                  >
                    {s.country} · {s.industry_id} · {s.size_band}
                  </a>
                </td>
                <td className="py-1.5 px-2 text-right tabular-nums text-clay-700">
                  {fmtMoney(s.stored_revenue)} ({s.stored_revenue_peer_ratio}×)
                </td>
                <td className="py-1.5 px-2 text-right tabular-nums text-moss-700">
                  {fmtMoney(s.converted_revenue_usd)} ({s.converted_peer_ratio}×)
                </td>
                <td className="py-1.5 px-2 text-right tabular-nums">
                  {fmtMoney(s.peer_median_usd)}
                </td>
                <td className="py-1.5 px-2 text-right tabular-nums">÷{s.fx_rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function VarianceTab({ data }: { data: VarianceReport }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-ink-900">
        Q3 — Cross-country variance ({data.totals.flagged_total.toLocaleString()} flagged groups)
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-ink-200">
        <table className="w-full text-xs">
          <thead className="bg-cream-100 text-ink-900">
            <tr className="text-left">
              <th className="py-2 px-2">Industry / size</th>
              <th className="py-2 px-2 text-right">N countries</th>
              <th className="py-2 px-2 text-right">Max/Min</th>
              <th className="py-2 px-2">Lowest</th>
              <th className="py-2 px-2">Highest</th>
              <th className="py-2 px-2 text-right">Median</th>
            </tr>
          </thead>
          <tbody>
            {data.samples.slice(0, 100).map((s, i) => (
              <tr key={i} className="border-t border-ink-200/40">
                <td className="py-1.5 px-2">{s.industry_id} · {s.size_band}</td>
                <td className="py-1.5 px-2 text-right tabular-nums">{s.n_countries}</td>
                <td className="py-1.5 px-2 text-right tabular-nums font-medium text-clay-700">{s.max_min_ratio}×</td>
                <td className="py-1.5 px-2 text-xs">{s.lowest_country} {fmtMoney(s.lowest_revenue)}</td>
                <td className="py-1.5 px-2 text-xs">{s.highest_country} {fmtMoney(s.highest_revenue)}</td>
                <td className="py-1.5 px-2 text-right tabular-nums">{fmtMoney(s.median_revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SmallNTab({ data }: { data: SmallNReport }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-ink-900">Q12 — Small sample</h2>
      <div className="mt-3 grid grid-cols-3 md:grid-cols-6 gap-2 text-sm">
        {Object.entries(data.buckets).map(([k, v]) => (
          <div key={k} className="p-3 rounded-lg bg-cream-100 border border-parchment">
            <div className="text-xs uppercase text-ink-700/70">{k}</div>
            <div className="text-lg font-semibold text-ink-900 tabular-nums">{v.toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-ink-900 mb-2">Countries with most thin cells</h3>
        <div className="overflow-x-auto rounded-xl border border-ink-200">
          <table className="w-full text-xs">
            <thead className="bg-cream-100"><tr className="text-left"><th className="py-2 px-2">Country</th><th className="py-2 px-2 text-right">&lt; 5</th><th className="py-2 px-2 text-right">5-19</th><th className="py-2 px-2 text-right">20-49</th><th className="py-2 px-2 text-right">200+</th><th className="py-2 px-2 text-right">null</th></tr></thead>
            <tbody>
              {Object.entries(data.by_country_top_30_thin).map(([c, b]) => (
                <tr key={c} className="border-t border-ink-200/40">
                  <td className="py-1.5 px-2 font-mono">{c}</td>
                  <td className="py-1.5 px-2 text-right tabular-nums">{(b["<5"] ?? 0).toLocaleString()}</td>
                  <td className="py-1.5 px-2 text-right tabular-nums">{(b["5-19"] ?? 0).toLocaleString()}</td>
                  <td className="py-1.5 px-2 text-right tabular-nums">{(b["20-49"] ?? 0).toLocaleString()}</td>
                  <td className="py-1.5 px-2 text-right tabular-nums">{(b["200+"] ?? 0).toLocaleString()}</td>
                  <td className="py-1.5 px-2 text-right tabular-nums">{(b["null"] ?? 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function YoYTab({ data }: { data: YoYReport }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-ink-900">
        Q14 — Year-over-year stability ({data.totals.flagged_transitions.toLocaleString()} flagged transitions)
      </h2>
      <p className="mt-1 text-sm text-ink-700/80">&gt;50% YoY change excluding 2020-2021 pandemic transitions.</p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-ink-200">
        <table className="w-full text-xs">
          <thead className="bg-cream-100"><tr className="text-left"><th className="py-2 px-2">Cell</th><th className="py-2 px-2">Transition</th><th className="py-2 px-2 text-right">From</th><th className="py-2 px-2 text-right">To</th><th className="py-2 px-2 text-right">Ratio</th></tr></thead>
          <tbody>
            {data.samples.slice(0, 100).map((s, i) => (
              <tr key={i} className="border-t border-ink-200/40">
                <td className="py-1.5 px-2 text-xs">{s.country} · {s.geo_id} · {s.industry_id} · {s.size_band}</td>
                <td className="py-1.5 px-2 tabular-nums">{s.year_from}→{s.year_to}</td>
                <td className="py-1.5 px-2 text-right tabular-nums">{fmtMoney(s.revenue_from)}</td>
                <td className="py-1.5 px-2 text-right tabular-nums">{fmtMoney(s.revenue_to)}</td>
                <td className="py-1.5 px-2 text-right tabular-nums font-medium">{s.ratio}×</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PlausibilityTab({ data }: { data: PlausibilityReport }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-ink-900">
        Plan v10 PP — Cross-country plausibility ({data.totals.flagged_total.toLocaleString()} flags)
      </h2>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {Object.entries(data.totals.by_check).map(([k, n]) => (
          <span key={k} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream-100 border border-parchment text-ink-900">
            {k} · {n.toLocaleString()}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm text-ink-700/80">Already documented in /admin/anomalies + cell-page warning chips.</p>
    </section>
  );
}

function TierTab({ data }: { data: TierReport }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-ink-900">Q13 — Tier integrity</h2>
      <div className="mt-3 grid grid-cols-3 md:grid-cols-5 gap-2 text-sm">
        {Object.entries(data.tier_counts).map(([t, c]) => {
          const v = data.tier_violations[t] || 0;
          return (
            <div key={t} className="p-3 rounded-lg bg-cream-100 border border-parchment">
              <div className="text-xs uppercase text-ink-700/70">Tier {t}</div>
              <div className="text-lg font-semibold text-ink-900 tabular-nums">{c.toLocaleString()}</div>
              <div className="text-[10px] text-clay-700">{v.toLocaleString()} violations</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
