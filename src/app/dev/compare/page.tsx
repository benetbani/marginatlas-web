/**
 * Compare redesign MOCKUP (preview route /dev/compare — not live). Two countries
 * side by side (Kenya vs Germany): the same activities, their typical revenue,
 * the gap made plain. Editorial columns, no card grid. Screenshot: scripts/shot.mjs.
 */
import * as React from "react";
import { getTopIndustriesForCountry } from "@/lib/cells";
import { PageShell, ContentColumn } from "@/components/ui/page-shell";

export const dynamic = "force-dynamic";

const A = { iso: "KE", name: "Kenya" };
const B = { iso: "DE", name: "Germany" };

function usd(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return "$" + Math.round(n / 1e3) + "K";
  return "$" + Math.round(n);
}

export default async function CompareMockup() {
  const [a, b] = await Promise.all([
    getTopIndustriesForCountry(A.iso, 40),
    getTopIndustriesForCountry(B.iso, 40),
  ]);
  const bMap = new Map(b.map((x) => [x.industry_id, x.revenue_per_firm]));
  const rows = a
    .filter((x) => bMap.has(x.industry_id) && x.revenue_per_firm != null && (bMap.get(x.industry_id) ?? 0) > 0)
    .map((x) => ({ name: x.industry_name, a: x.revenue_per_firm ?? 0, b: bMap.get(x.industry_id) ?? 0 }))
    .slice(0, 16);

  const ratios = rows.map((r) => r.b / r.a).filter((x) => isFinite(x) && x > 0).sort((x, y) => x - y);
  const medianRatio = ratios.length ? ratios[Math.floor(ratios.length / 2)] : 0;

  return (
    <PageShell tone="paper">
      <ContentColumn width="wide" className="py-10 md:py-16">
        <nav aria-label="Breadcrumb" className="text-[13px] text-ink-500 mb-12">
          <a href="/" className="hover:text-ink-800">Home</a>
          <span className="mx-1.5 text-ink-300">/</span>
          <span className="text-ink-700">Compare</span>
        </nav>

        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-atlas-700 mb-4">Compare</div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.03] tracking-tight text-ink-900 max-w-3xl">
          {A.name} and {B.name}, the same trades
        </h1>
        <p className="mt-7 text-lg md:text-xl leading-relaxed text-ink-700 max-w-2xl">
          The same small business earns very different money in different places. A typical {B.name} firm turns over
          roughly <strong className="text-ink-900 tabular-nums">{medianRatio >= 1 ? Math.round(medianRatio) : (medianRatio).toFixed(1)}x</strong>{" "}
          a {A.name} one, before you adjust for what a dollar buys.
        </p>

        {/* comparison */}
        <section className="mt-14 md:mt-20">
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 sm:gap-x-10 items-baseline pb-3 border-b border-ink-200 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
            <span>Activity</span>
            <span className="text-right w-20 sm:w-28">{A.name}</span>
            <span className="text-right w-20 sm:w-28">{B.name}</span>
          </div>
          <div>
            {rows.map((r) => (
              <div key={r.name} className="grid grid-cols-[1fr_auto_auto] gap-x-6 sm:gap-x-10 items-center border-b border-ink-100 py-3.5">
                <span className="text-[15px] text-ink-800 min-w-0 truncate">{r.name}</span>
                <span className="text-right w-20 sm:w-28 tabular-nums text-sm text-ink-600">{usd(r.a)}</span>
                <span className="text-right w-20 sm:w-28 tabular-nums text-sm font-medium text-ink-900">{usd(r.b)}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink-500 max-w-xl">
            Figures are a typical firm's annual revenue, before adjusting for local prices. Open any row to see the full
            picture for each country.
          </p>
        </section>
      </ContentColumn>
    </PageShell>
  );
}
