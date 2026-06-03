/**
 * Cell-page redesign MOCKUP v2 (preview route /dev/cell — not live).
 * Fuller editorial direction: hero, distribution, a real P&L readout, firm mix,
 * and an honest trust section. Real Kenya data. No cards, no floating metrics.
 * Screenshot: node scripts/shot.mjs /dev/cell
 */
import * as React from "react";
import { getCellBySlug } from "@/lib/cells";
import { PageShell, ContentColumn } from "@/components/ui/page-shell";
import { PercentileStrip } from "@/components/charts/PercentileStrip";

export const dynamic = "force-dynamic";

function usd(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return "$" + Math.round(n / 1e3) + "K";
  return "$" + Math.round(n);
}

const COST = [
  { key: "cogs", label: "Cost of goods", bar: "bg-ink-700" },
  { key: "labor", label: "Labor", bar: "bg-atlas-500" },
  { key: "rent", label: "Rent and space", bar: "bg-cocoa-500" },
  { key: "other", label: "Everything else", bar: "bg-ink-200" },
] as const;

const BANDS = ["1-4", "5-9", "10-19", "20-49", "50-99", "100+"];
const BAND_SHADE = ["bg-atlas-500", "bg-atlas-400", "bg-atlas-300", "bg-atlas-200", "bg-atlas-100", "bg-ink-200"];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400 mb-6">{children}</h2>;
}

export default async function CellMockup() {
  const cell = await getCellBySlug("ke", "kenya", "restaurants");
  const p10 = cell.rev_p10 ?? 0;
  const p25 = cell.rev_p25 ?? 0;
  const p50 = cell.revenue_per_firm ?? cell.rev_p50 ?? 0;
  const p75 = cell.rev_p75 ?? 0;
  const p90 = cell.rev_p90 ?? 0;
  const margin = cell.net_margin ?? 0.1;
  const net = cell.net_profit ?? p50 * margin;
  const cs = cell.cost_structure;
  const firms = cell.firm_distribution;
  const bands = firms ? BANDS.filter((b) => (firms[b] ?? 0) > 0) : [];
  const firmTotal = bands.reduce((s, b) => s + (firms?.[b] ?? 0), 0) || 1;

  return (
    <PageShell tone="paper">
      <ContentColumn width="wide" className="py-10 md:py-16">
        <nav aria-label="Breadcrumb" className="text-[13px] text-ink-500 mb-12">
          <a href="/" className="hover:text-ink-800">Home</a>
          <span className="mx-1.5 text-ink-300">/</span>
          <a href="/ke" className="hover:text-ink-800">Kenya</a>
          <span className="mx-1.5 text-ink-300">/</span>
          <span className="text-ink-700">Restaurants</span>
        </nav>

        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-atlas-700 mb-4">
          Food and Drink, Kenya
        </div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.03] tracking-tight text-ink-900 max-w-3xl">
          How much does a restaurant make in Kenya?
        </h1>
        <p className="mt-7 text-lg md:text-xl leading-relaxed text-ink-700 max-w-2xl">
          A typical restaurant in Kenya turns over about{" "}
          <strong className="text-ink-900 font-semibold tabular-nums">{usd(p50)}</strong> a year. The busiest tenth
          reach <strong className="text-ink-900 font-semibold tabular-nums">{usd(p90)}</strong>, while the smallest sit
          near <strong className="text-ink-900 font-semibold tabular-nums">{usd(p10)}</strong>.
        </p>
        <div className="mt-7 inline-flex items-center gap-2 text-sm text-ink-500">
          <span>Showing</span>
          <span className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-cream-50 px-3 py-1.5 font-medium text-ink-900">
            All sizes
            <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden className="text-ink-400">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
            </svg>
          </span>
        </div>

        <section className="mt-16 md:mt-24">
          <Eyebrow>Where they land</Eyebrow>
          <PercentileStrip p10={p10} p25={p25} p50={p50} p75={p75} p90={p90} format={usd} />
          <p className="mt-6 text-base leading-relaxed text-ink-600 max-w-xl">
            Half of Kenyan restaurants fall between{" "}
            <span className="tabular-nums text-ink-800">{usd(p25)}</span> and{" "}
            <span className="tabular-nums text-ink-800">{usd(p75)}</span> a year. The spread is wide: a kibanda and a
            full sit-down place are both "a restaurant," and the gap shows.
          </p>
        </section>

        <section className="mt-16 md:mt-24 border-t border-ink-100 pt-12">
          <Eyebrow>What it costs to run</Eyebrow>
          <div className="grid md:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
            <p className="text-lg leading-relaxed text-ink-700">
              On a typical <span className="tabular-nums text-ink-900">{usd(p50)}</span> of revenue, the owner takes
              home about <strong className="text-ink-900 tabular-nums">{usd(net)}</strong>, a{" "}
              <strong className="text-atlas-700">{Math.round(margin * 100)}% margin</strong>. Food and casual labor eat
              most of it; charcoal, gas and odd costs sit in the rest.
            </p>
            {cs && (
              <div>
                <div className="flex h-2.5 w-full overflow-hidden rounded-full">
                  {COST.map((c) => {
                    const v = cs[c.key];
                    if (!v) return null;
                    return <div key={c.key} className={c.bar} style={{ width: `${v}%` }} aria-label={`${c.label} ${v}%`} />;
                  })}
                </div>
                <dl className="mt-5 divide-y divide-ink-100">
                  {COST.map((c) => {
                    const v = cs[c.key];
                    if (!v) return null;
                    return (
                      <div key={c.key} className="flex items-center justify-between py-2.5 text-sm">
                        <dt className="inline-flex items-center gap-2.5 text-ink-700">
                          <span className={`inline-block h-2.5 w-2.5 rounded-sm ${c.bar}`} aria-hidden />
                          {c.label}
                        </dt>
                        <dd className="tabular-nums text-ink-500">
                          {v}% <span className="text-ink-800">{usd((p50 * v) / 100)}</span>
                        </dd>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between py-3 text-sm font-semibold">
                    <dt className="text-atlas-700">Owner keeps</dt>
                    <dd className="tabular-nums text-ink-900">
                      {Math.round(margin * 100)}% <span>{usd(net)}</span>
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </section>

        {firms && bands.length > 0 && (
          <section className="mt-16 md:mt-24 border-t border-ink-100 pt-12">
            <Eyebrow>Who runs these</Eyebrow>
            <div className="grid md:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
              <p className="text-lg leading-relaxed text-ink-700">
                Almost all are tiny.{" "}
                <strong className="text-ink-900 tabular-nums">{Math.round(firms["1-4"] ?? 0)}%</strong> run with one to
                four people, family-and-a-cook scale. A kitchen with twenty or more staff is the rare exception, not the
                norm.
              </p>
              <div>
                <div className="flex h-2.5 w-full overflow-hidden rounded-full">
                  {bands.map((b, i) => (
                    <div key={b} className={BAND_SHADE[i] ?? "bg-ink-200"} style={{ width: `${(firms[b] / firmTotal) * 100}%` }} aria-label={`${b} staff, ${Math.round(firms[b])}%`} />
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-600">
                  {bands.map((b, i) => (
                    <span key={b} className="inline-flex items-center gap-2">
                      <span className={`inline-block h-2 w-2 rounded-sm ${BAND_SHADE[i] ?? "bg-ink-200"}`} aria-hidden />
                      {b} <strong className="text-ink-900 tabular-nums">{Math.round(firms[b])}%</strong>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mt-16 md:mt-24 border-t border-ink-100 pt-12">
          <Eyebrow>How we know this</Eyebrow>
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl">
            <div>
              <div className="text-sm font-semibold text-ink-900 mb-1.5">Modeled estimate</div>
              <p className="text-sm leading-relaxed text-ink-600">
                Built from national small-business surveys and sector field reports, not a per-firm census. A considered
                estimate, not a measurement.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-ink-900 mb-1.5">Local currency</div>
              <p className="text-sm leading-relaxed text-ink-600">
                Modeled in Kenyan shillings, shown in dollars at a recent rate. The informal micro base sits below any
                global minimum, on purpose.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-ink-900 mb-1.5">What is included</div>
              <p className="text-sm leading-relaxed text-ink-600">
                Cafes, bistros, fast food and sit-down dining, from the roadside kibanda to a full kitchen. Hotels and
                pure bars are counted elsewhere.
              </p>
            </div>
          </div>
        </section>
      </ContentColumn>
    </PageShell>
  );
}
