/**
 * Calculator redesign MOCKUP (preview route /dev/calculator — not live). A
 * static representation of the tool: clean inline controls, then a result that
 * marks "you" against the typical on the visx distribution. Real Kenya data.
 * Screenshot: node scripts/shot.mjs /dev/calculator
 */
import * as React from "react";
import { getCellBySlug } from "@/lib/cells";
import { PageShell, ContentColumn } from "@/components/ui/page-shell";
import { PercentileStrip } from "@/components/charts/PercentileStrip";

export const dynamic = "force-dynamic";

function usd(n: number | null | undefined): string {
  if (n == null) return "–";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return "$" + Math.round(n / 1e3) + "K";
  return "$" + Math.round(n);
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400 mb-2">{label}</span>
      {children}
    </label>
  );
}
const fieldCls = "flex items-center gap-2 rounded-lg border border-ink-200 bg-cream-50 px-3.5 py-2.5 text-[15px] text-ink-900";

export default async function CalculatorMockup() {
  const cell = await getCellBySlug("ke", "kenya", "restaurants");
  const p10 = cell.rev_p10 ?? 0;
  const p25 = cell.rev_p25 ?? 0;
  const p50 = cell.revenue_per_firm ?? cell.rev_p50 ?? 0;
  const p75 = cell.rev_p75 ?? 0;
  const p90 = cell.rev_p90 ?? 0;
  const margin = cell.net_margin ?? 0.14;

  const you = 40000; // sample input for the mockup
  const mult = p50 > 0 ? you / p50 : 0;
  const pct = you >= p90 ? 6 : you >= p75 ? 18 : you >= p50 ? 40 : you >= p25 ? 65 : 85;
  const takeHome = you * margin;

  return (
    <PageShell tone="paper">
      <ContentColumn width="wide" className="py-10 md:py-16">
        <nav aria-label="Breadcrumb" className="text-[13px] text-ink-500 mb-12">
          <a href="/" className="hover:text-ink-800">Home</a>
          <span className="mx-1.5 text-ink-300">/</span>
          <span className="text-ink-700">Calculator</span>
        </nav>

        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-atlas-700 mb-4">Calculator</div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.03] tracking-tight text-ink-900 max-w-3xl">
          How does your shop compare?
        </h1>
        <p className="mt-7 text-lg md:text-xl leading-relaxed text-ink-700 max-w-2xl">
          Enter what your business makes. See exactly where you land against the typical firm, and what an owner like
          you usually keeps.
        </p>

        {/* controls */}
        <div className="mt-10 flex flex-wrap items-end gap-4 lg:gap-5">
          <Control label="Activity">
            <span className={fieldCls + " min-w-[180px] justify-between"}>
              Restaurants
              <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden className="text-ink-400"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
            </span>
          </Control>
          <Control label="Country">
            <span className={fieldCls + " min-w-[150px] justify-between"}>
              Kenya
              <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden className="text-ink-400"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
            </span>
          </Control>
          <Control label="Your annual revenue">
            <span className={fieldCls + " min-w-[150px] tabular-nums"}>$ 40,000</span>
          </Control>
          <button className="rounded-lg bg-atlas-500 px-5 py-2.5 text-[15px] font-medium text-cream-50 hover:bg-atlas-600 transition-colors">
            Compare
          </button>
        </div>

        {/* result */}
        <section className="mt-14 md:mt-20 border-t border-ink-100 pt-12">
          <p className="font-display text-2xl md:text-3xl leading-snug text-ink-900 max-w-3xl">
            A restaurant in Kenya at <span className="tabular-nums">{usd(you)}</span> sits in the top{" "}
            <span className="text-atlas-700 tabular-nums">{pct}%</span>, about{" "}
            <span className="tabular-nums">{mult >= 2 ? Math.round(mult) : mult.toFixed(1)}x</span> the typical{" "}
            <span className="tabular-nums">{usd(p50)}</span>.
          </p>

          <div className="mt-10 max-w-3xl">
            <PercentileStrip p10={p10} p25={p25} p50={p50} p75={p75} p90={p90} you={you} format={usd} />
          </div>

          <p className="mt-8 text-lg leading-relaxed text-ink-700 max-w-2xl">
            At a typical <strong className="text-ink-900">{Math.round(margin * 100)}% margin</strong> for the trade, an
            owner at your level keeps roughly <strong className="text-ink-900 tabular-nums">{usd(takeHome)}</strong> a
            year. Run leaner on food and rent and the rest is upside.
          </p>
        </section>
      </ContentColumn>
    </PageShell>
  );
}
