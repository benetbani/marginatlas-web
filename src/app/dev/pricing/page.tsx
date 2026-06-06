/**
 * Pricing redesign MOCKUP (preview route /dev/pricing — not live). Leads with the
 * generous free tier; Pro is for people who build on the data. Restrained two-column
 * comparison, not loud cards. Screenshot: node scripts/shot.mjs /dev/pricing
 */
import * as React from "react";
import { PageShell, ContentColumn } from "@/components/ui/page-shell";

export const dynamic = "force-dynamic";

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden className="shrink-0 mt-0.5 text-atlas-500">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Plan({
  name, price, per, blurb, features, cta, emphasis,
}: {
  name: string; price: string; per?: string; blurb: string; features: string[]; cta: string; emphasis?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-3">
        <h2 className="font-display text-2xl md:text-3xl text-ink-900">{name}</h2>
        {emphasis && <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-atlas-700">For builders</span>}
      </div>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="font-display text-4xl md:text-5xl text-ink-900 tabular-nums">{price}</span>
        {per && <span className="text-ink-500 text-sm">{per}</span>}
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-600 max-w-sm">{blurb}</p>
      <a
        href="#"
        className={
          "mt-7 inline-flex rounded-lg px-5 py-2.5 text-[15px] font-medium transition-colors " +
          (emphasis
            ? "bg-atlas-500 text-cream-50 hover:bg-atlas-600"
            : "border border-ink-300 text-ink-900 hover:border-ink-900")
        }
      >
        {cta}
      </a>
      <ul className="mt-8 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex gap-3 text-[15px] text-ink-700 leading-snug">
            <Check />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function PricingMockup() {
  return (
    <PageShell tone="paper">
      <ContentColumn width="wide" className="py-10 md:py-16">
        <nav aria-label="Breadcrumb" className="text-[13px] text-ink-500 mb-12">
          <a href="/" className="hover:text-ink-800">Home</a>
          <span className="mx-1.5 text-ink-300">/</span>
          <span className="text-ink-700">Pricing</span>
        </nav>

        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-atlas-700 mb-4">Pricing</div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.03] tracking-tight text-ink-900 max-w-3xl">
          Everything is free to read. Pay only to build on it.
        </h1>
        <p className="mt-7 text-lg md:text-xl leading-relaxed text-ink-700 max-w-2xl">
          The full atlas, every country and trade, is open to anyone with a browser. A small plan unlocks the data
          itself for the people who put it to work.
        </p>

        <section className="mt-16 md:mt-20 grid md:grid-cols-2 gap-12 lg:gap-24 border-t border-ink-100 pt-12">
          <Plan
            name="Free"
            price="$0"
            blurb="The whole publication, open. No account, no paywall, no trial clock."
            cta="Start reading"
            features={[
              "Every country, activity, and city",
              "Revenue, costs, margins and firm mix",
              "Compare any two markets",
              "The calculator and breakeven tools",
            ]}
          />
          <Plan
            name="Pro"
            price="$19"
            per="/ month"
            emphasis
            blurb="For analysts, founders and operators who pull the numbers into their own work."
            cta="Go Pro"
            features={[
              "Full API access",
              "Bulk CSV and spreadsheet export",
              "No rate limits, no scraping",
              "Saved comparisons and watchlists",
              "Methodology notes and source detail",
            ]}
          />
        </section>

        <p className="mt-16 text-sm text-ink-500 max-w-xl">
          Figures are modeled estimates, honest about their confidence. Pro does not buy better numbers, it buys the
          numbers in a form you can build with.
        </p>
      </ContentColumn>
    </PageShell>
  );
}
