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

  const totals = {
    currency: currency?.totals.flagged_total ?? 0,
    variance: variance?.totals.flagged_total ?? 0,
    smallN: (smallN?.buckets["<5"] ?? 0) + (smallN?.buckets["5-19"] ?? 0),
    yoy: yoy?.totals.flagged_transitions ?? 0,
    plausibility: plaus?.totals.flagged_total ?? 0,
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

      <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-2">
        <Stat label="Total flags" value={grandTotal} accent />
        <Stat label="Currency (Q1)" value={totals.currency} href={`?key=${sp.key}&tab=currency`} active={tab === "currency"} />
        <Stat label="Variance (Q3)" value={totals.variance} href={`?key=${sp.key}&tab=variance`} active={tab === "variance"} />
        <Stat label="Plausibility (PP)" value={totals.plausibility} href={`?key=${sp.key}&tab=plausibility`} active={tab === "plausibility"} />
        <Stat label="Small-n (Q12)" value={totals.smallN} href={`?key=${sp.key}&tab=smallN`} active={tab === "smallN"} />
        <Stat label="YoY (Q14)" value={totals.yoy} href={`?key=${sp.key}&tab=yoy`} active={tab === "yoy"} />
      </div>

      {tab === "currency" && currency ? <CurrencyTab data={currency} /> : null}
      {tab === "variance" && variance ? <VarianceTab data={variance} /> : null}
      {tab === "smallN" && smallN ? <SmallNTab data={smallN} /> : null}
      {tab === "yoy" && yoy ? <YoYTab data={yoy} /> : null}
      {tab === "plausibility" && plaus ? <PlausibilityTab data={plaus} /> : null}
      {tab === "tier" && tier ? <TierTab data={tier} /> : null}
    </div>
  );
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
