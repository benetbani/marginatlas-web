/**
 * /dev/london-commercial , direction prototype (noindex, internal).
 *
 * NOT the shipped page. A focused, spacious, commercial-SaaS treatment of the
 * London restaurants exemplar, built to react to (founder direction 2026-06-16:
 * Stripe-level polish, sales-driven, less dense, NOT data-journalism). Real
 * London figures, hardcoded as the filled exemplar so the route renders without
 * the heavy data path. Tokens only, no em-dashes, USD.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "London restaurants , direction prototype",
  robots: { index: false, follow: false },
};

const DATA = {
  revenue: 503000,
  takeHome: 48000,
  marginPct: 10,
  firms: 8200,
  hundred: [
    { label: "Cost of goods", value: 30, cls: "bg-cocoa-300" },
    { label: "Payroll", value: 33, cls: "bg-cocoa-500" },
    { label: "Rent", value: 15, cls: "bg-ink-700" },
    { label: "Everything else", value: 12, cls: "bg-cream-400" },
    { label: "Owner keeps", value: 10, cls: "bg-moss-600", kept: true },
  ],
  wages: [
    { role: "Head chef", low: 48000, median: 60000, high: 78000 },
    { role: "Server", low: 26000, median: 31000, high: 38000 },
    { role: "Kitchen porter", low: 22000, median: 24000, high: 27000 },
  ],
  verdict:
    "The headline revenue is real, but a London restaurant is a wages-and-rent business, not a high-margin one.",
  points: [
    "Rent takes a bigger bite here than almost anywhere else in the country.",
    "Skilled kitchen staff are hard to keep, and the wage floor keeps rising.",
    "Pricing power is real: the right room can charge up, and that is the lever that makes the model work.",
  ],
};

function usdK(n: number): string {
  return `$${Math.round(n / 1000)}K`;
}
function usdFull(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

const WAGE_MAX = 80000;

export default function Page() {
  return (
    <main className="min-h-screen bg-cream-75 font-sans text-ink-900 antialiased">
      {/* top bar */}
      <header className="sticky top-0 z-20 border-b border-cream-300/70 bg-cream-75/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="font-display text-xl tracking-tight">
            Margin <span className="text-atlas-700">Atlas</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-ink-600 md:flex">
            <span>Countries</span>
            <span>Industries</span>
            <span>Cities</span>
            <span>Compare</span>
          </nav>
          <a
            href="#"
            className="rounded-full bg-ink-900 px-5 py-2 text-sm font-medium text-cream-50 transition-colors hover:bg-ink-800"
          >
            Get the data
          </a>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden border-b border-cream-300/70 bg-gradient-to-b from-atlas-50 to-cream-75">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-atlas-700">
            Restaurants · London · United Kingdom
          </p>

          <h1 className="mt-6 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight text-ink-900 md:text-6xl">
            A London restaurant brings in about{" "}
            <span className="text-atlas-700 tabular-nums">$503K</span> a year.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-600 md:text-xl">
            The owner keeps about{" "}
            <span className="font-semibold text-ink-900 tabular-nums">$48K</span>{" "}
            of it. Strong revenue, thin take-home. Rent and wages decide it, not
            the dining room.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#breakdown"
              className="rounded-full bg-atlas-600 px-6 py-3 text-sm font-semibold text-cream-50 shadow-card transition-colors hover:bg-atlas-700"
            >
              See the full breakdown
            </a>
            <a
              href="#"
              className="rounded-full border border-cream-300 bg-cream-50 px-6 py-3 text-sm font-semibold text-ink-800 transition-colors hover:border-ink-300"
            >
              Compare another city
            </a>
          </div>

          {/* anchored proof strip */}
          <dl className="mt-14 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-xl border border-cream-300 bg-cream-300 shadow-card">
            {[
              { k: "Typical revenue", v: usdFull(DATA.revenue) },
              { k: "Owner take-home", v: usdFull(DATA.takeHome) },
              { k: "Net margin", v: `${DATA.marginPct}%` },
            ].map((s) => (
              <div key={s.k} className="bg-cream-50 px-5 py-5">
                <dt className="text-xs uppercase tracking-wide text-ink-500">
                  {s.k}
                </dt>
                <dd className="mt-1 font-display text-2xl text-ink-900 tabular-nums">
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* where every $100 goes */}
      <section id="breakdown" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl tracking-tight text-ink-900 md:text-4xl">
            Where every $100 of revenue goes
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-600">
            For all the money through the till, only the last sliver is the
            owner&rsquo;s. The kitchen and the lease take the rest.
          </p>
        </div>

        {/* the bar */}
        <div className="mt-12">
          <div className="flex h-16 w-full overflow-hidden rounded-xl shadow-card">
            {DATA.hundred.map((seg) => (
              <div
                key={seg.label}
                className={`${seg.cls} flex items-center justify-center`}
                style={{ width: `${seg.value}%` }}
              >
                {seg.kept ? (
                  <span className="px-1 text-sm font-semibold text-cream-50 tabular-nums">
                    ${seg.value}
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          {/* legend */}
          <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
            {DATA.hundred.map((seg) => (
              <div key={seg.label} className="flex items-start gap-3">
                <span
                  className={`${seg.cls} mt-1 h-3 w-3 shrink-0 rounded-sm`}
                  aria-hidden
                />
                <div>
                  <dt
                    className={`text-sm ${seg.kept ? "font-semibold text-ink-900" : "text-ink-600"}`}
                  >
                    {seg.label}
                  </dt>
                  <dd className="font-display text-xl text-ink-900 tabular-nums">
                    ${seg.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* the honest take , dark panel for rhythm */}
      <section className="bg-ink-900 text-cream-100">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-atlas-300">
            The honest take
          </p>
          <p className="mt-6 max-w-3xl font-display text-2xl leading-snug text-cream-50 md:text-4xl md:leading-[1.2]">
            {DATA.verdict}
          </p>
          <ul className="mt-12 grid gap-x-12 gap-y-6 md:grid-cols-3">
            {DATA.points.map((p, i) => (
              <li key={i} className="border-t border-cream-50/15 pt-4">
                <span className="font-display text-lg text-atlas-300 tabular-nums">
                  0{i + 1}
                </span>
                <p className="mt-2 text-base leading-relaxed text-cream-100/90">
                  {p}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* what the work pays */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl tracking-tight text-ink-900 md:text-4xl">
            What the work pays
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-600">
            The payroll line, made concrete. Typical London salaries, low to
            high, with the median marked.
          </p>
        </div>

        <div className="mt-12 divide-y divide-cream-300 border-y border-cream-300">
          {DATA.wages.map((w) => {
            const lo = (w.low / WAGE_MAX) * 100;
            const hi = (w.high / WAGE_MAX) * 100;
            const med = (w.median / WAGE_MAX) * 100;
            return (
              <div
                key={w.role}
                className="grid grid-cols-1 items-center gap-4 py-6 md:grid-cols-[180px_1fr_120px]"
              >
                <div className="font-medium text-ink-900">{w.role}</div>
                <div className="relative h-2 w-full rounded-full bg-cream-200">
                  <div
                    className="absolute h-2 rounded-full bg-cocoa-300"
                    style={{ left: `${lo}%`, width: `${hi - lo}%` }}
                  />
                  <div
                    className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cream-50 bg-atlas-600 shadow-subtle"
                    style={{ left: `${med}%` }}
                    aria-hidden
                  />
                </div>
                <div className="text-right text-sm text-ink-600 tabular-nums">
                  <span className="font-semibold text-ink-900">
                    {usdK(w.median)}
                  </span>{" "}
                  median
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* conversion band */}
      <section className="border-t border-cream-300 bg-atlas-50">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 py-16 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl tracking-tight text-ink-900 md:text-3xl">
              This is one of 34,000 benchmarks.
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-ink-600">
              Every industry, every major city, 191 countries. See the numbers
              before you commit a single pound.
            </p>
          </div>
          <a
            href="#"
            className="shrink-0 rounded-full bg-atlas-600 px-7 py-3.5 text-sm font-semibold text-cream-50 shadow-card transition-colors hover:bg-atlas-700"
          >
            See pricing
          </a>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-12 text-sm text-ink-500">
        <p className="font-display text-base text-ink-900">
          Margin <span className="text-atlas-700">Atlas</span>
        </p>
        <p className="mt-2 max-w-xl">
          Direction prototype. London figures shown are the filled exemplar.
        </p>
      </footer>
    </main>
  );
}
