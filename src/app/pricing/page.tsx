/**
 * /pricing — three calm tiers, full feature matrix, FAQ, trust strip.
 * Server component. No client state on this route.
 */

import Link from "next/link";
import { Check, Minus } from "@phosphor-icons/react/dist/ssr";
import PricingFAQ from "@/components/billing/PricingFAQ";

type Tier = {
  id: "free" | "pro" | "team";
  name: string;
  price: string;
  priceSub: string;
  lede: string;
  features: string[];
  cta: { kind: "badge" | "primary" | "outline"; label: string; href: string };
  emphasized?: boolean;
};

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    priceSub: "forever, no card",
    lede: "Browse every benchmark.",
    features: [
      "Read every cell page",
      "World map and country grid",
      "Compare any two cities, side by side",
      "Save up to 5 cells",
    ],
    cta: { kind: "badge", label: "You're using this now", href: "#" },
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    priceSub: "per month",
    lede: "Saved cells, alerts, deep export.",
    features: [
      "Save up to 50 cells",
      "Weekly digest of changes in your watchlist",
      "Export any cell to CSV or PDF",
      "Custom percentile lines on your charts",
      "Hide cells flagged Modeled, if you want",
      "Atlas calculator with your own inputs",
    ],
    cta: { kind: "primary", label: "Start Pro free for 14 days", href: "/signup?plan=pro" },
    emphasized: true,
  },
  {
    id: "team",
    name: "Team",
    price: "$79",
    priceSub: "per month, 5 seats",
    lede: "Shared library, team alerts, API access.",
    features: [
      "Everything in Pro for every seat",
      "Shared saved-cells library",
      "Team-wide alert routing",
      "API access, 100K calls per month",
      "Priority support inside one business day",
      "Methodology office hours, every two weeks",
    ],
    cta: { kind: "outline", label: "Talk to us about a team", href: "/contact?topic=team" },
  },
];

type MatrixCellValue = boolean | string;
type MatrixRow = { group: string; label: string; values: [MatrixCellValue, MatrixCellValue, MatrixCellValue] };

const MATRIX: MatrixRow[] = [
  { group: "Browsing",        label: "Cell pages and benchmarks",      values: [true, true, true] },
  { group: "Browsing",        label: "World map and country grid",     values: [true, true, true] },
  { group: "Browsing",        label: "Compare two places",             values: [true, true, true] },
  { group: "Browsing",        label: "Smart Waterfall breakdown",      values: [true, true, true] },
  { group: "Browsing",        label: "Multi-cell comparison table",    values: [true, true, true] },
  { group: "Save and recall", label: "Saved cells",                    values: ["5", "50", "Unlimited"] },
  { group: "Save and recall", label: "Watchlist",                      values: [false, true, true] },
  { group: "Save and recall", label: "Recent history (30 days)",       values: [false, true, true] },
  { group: "Alerts",          label: "Weekly digest",                  values: [false, true, true] },
  { group: "Alerts",          label: "Cell-level alerts",              values: [false, true, true] },
  { group: "Alerts",          label: "Team-wide routing",              values: [false, false, true] },
  { group: "Export",          label: "Copy chart as image",            values: [true, true, true] },
  { group: "Export",          label: "Cell as CSV",                    values: [false, true, true] },
  { group: "Export",          label: "Cell as PDF",                    values: [false, true, true] },
  { group: "Export",          label: "Bulk export, up to 50 cells",    values: [false, true, true] },
  { group: "Custom view",     label: "Custom percentile lines",        values: [false, true, true] },
  { group: "Custom view",     label: "Atlas calculator",               values: [false, true, true] },
  { group: "Custom view",     label: "Hide modeled cells",             values: [false, true, true] },
  { group: "API",             label: "Read-only API",                  values: [false, false, true] },
  { group: "API",             label: "API calls per month",            values: ["\u2014", "\u2014", "100K"] },
  { group: "API",             label: "Webhook for cell refreshes",     values: [false, false, true] },
  { group: "Collaboration",   label: "Shared library",                 values: [false, false, true] },
  { group: "Collaboration",   label: "Seats included",                 values: ["1", "1", "5"] },
  { group: "Collaboration",   label: "Add more seats",                 values: [false, false, "+$14 each"] },
  { group: "Support",         label: "Methodology page",               values: [true, true, true] },
  { group: "Support",         label: "Email support",                  values: [false, "3 days", "1 business day"] },
  { group: "Support",         label: "Methodology office hours",       values: [false, false, true] },
];

export default function PricingPage() {
  return (
    <article>
      <section className="bg-cream-50 border-b border-parchment">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-12 sm:pt-20 sm:pb-16">
          <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">Pricing</p>
          <h1 className="font-display mt-3 text-balance text-4xl sm:text-5xl leading-[1.08] tracking-[-0.022em] font-semibold text-ink-900 max-w-3xl">
            Three ways to use Atlas.
          </h1>
          <p className="font-display italic mt-4 text-balance text-base sm:text-lg text-cocoa-700 leading-relaxed max-w-xl">
            Browsing every benchmark is free, and will stay free. Paid tiers exist for readers who want to save cells, get alerts, and pull the data out of the page.
          </p>
        </div>
      </section>

      <section className="bg-cream-50">
        <div className="mx-auto max-w-6xl px-6 pb-14 sm:pb-16">
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TIERS.map((t) => <li key={t.id}><TierCard tier={t} /></li>)}
          </ul>
        </div>
      </section>

      <section className="bg-cream-100 border-t border-b border-parchment">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
          <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">Side by side</p>
          <h2 className="font-display mt-3 text-2xl sm:text-3xl leading-[1.1] tracking-[-0.02em] font-semibold text-ink-900 max-w-3xl">
            What sits inside each tier.
          </h2>

          <div className="mt-10 overflow-x-auto rounded-lg bg-cream-50 border border-parchment">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-cream-100">
                  <th className="text-left px-4 py-3 text-[11px] tracking-[0.16em] uppercase font-semibold text-cocoa-700/85">Feature</th>
                  {["Free", "Pro", "Team"].map((c) => (
                    <th key={c} scope="col" className="text-center px-4 py-3 text-[11px] tracking-[0.16em] uppercase font-semibold text-cocoa-700/85" style={{ width: "16%" }}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row, i) => {
                  const showGroup = i === 0 || row.group !== MATRIX[i - 1].group;
                  return (
                    <Fragment key={row.label}>
                      {showGroup && (
                        <tr className="bg-cream-100">
                          <td colSpan={4} className="px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-semibold text-atlas-700">
                            {row.group}
                          </td>
                        </tr>
                      )}
                      <tr className="border-t border-parchment">
                        <td className="px-4 py-3 text-[14px] text-ink-900">{row.label}</td>
                        {row.values.map((v, ci) => (
                          <td key={ci} className="text-center px-4 py-3 tabular-nums text-ink-900">
                            <MatrixCell value={v} />
                          </td>
                        ))}
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <PricingFAQ />

      <section className="bg-cream-50 border-t border-parchment">
        <div className="mx-auto max-w-6xl px-6 py-10 text-center">
          <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">Trust</p>
          <p className="font-display mt-2 text-balance text-lg sm:text-xl font-medium text-ink-900">
            Used by operators in 60+ countries.
          </p>
        </div>
      </section>
    </article>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  const emphasized = !!tier.emphasized;
  return (
    <div
      className={`rounded-2xl p-6 h-full flex flex-col ${
        emphasized
          ? "bg-white border border-amber-200 shadow-[0_1px_2px_rgba(154,52,18,0.06),_0_10px_28px_rgba(154,52,18,0.08)]"
          : "bg-cream-50 border border-parchment"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-xl font-semibold tracking-[-0.01em] text-ink-900">{tier.name}</span>
        {emphasized && (
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-atlas-700">
            Most picked
          </span>
        )}
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display tabular-nums font-bold text-[44px] leading-none tracking-[-0.025em] text-ink-900">
          {tier.price}
        </span>
        <span className="text-sm text-cocoa-700">{tier.priceSub}</span>
      </div>
      <p className="font-display italic mt-2 text-base text-cocoa-700">{tier.lede}</p>

      <ul className="mt-5 space-y-2.5 flex-1">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-ink-900">
            <Check size={14} weight="regular" aria-hidden="true" className="text-atlas-700 mt-0.5 shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {tier.cta.kind === "badge" && (
          <span className="inline-flex w-full justify-center items-center gap-1.5 rounded-md py-2.5 text-sm font-semibold bg-cream-100 border border-parchment text-cocoa-700">
            {tier.cta.label}
          </span>
        )}
        {tier.cta.kind === "primary" && (
          <Link
            href={tier.cta.href}
            className="inline-flex w-full justify-center items-center gap-1.5 rounded-md py-2.5 text-sm font-semibold bg-atlas-500 text-white hover:opacity-90 transition-opacity"
          >
            {tier.cta.label}
          </Link>
        )}
        {tier.cta.kind === "outline" && (
          <Link
            href={tier.cta.href}
            className="inline-flex w-full justify-center items-center gap-1.5 rounded-md py-2.5 text-sm font-semibold border border-cocoa-700/25 text-cocoa-700 hover:bg-cream-100 transition-colors"
          >
            {tier.cta.label}
          </Link>
        )}
      </div>
    </div>
  );
}

function MatrixCell({ value }: { value: MatrixCellValue }) {
  if (value === true) return <Check size={16} weight="regular" aria-label="included" className="inline-block text-atlas-700" />;
  if (value === false) return <Minus size={12} weight="regular" aria-label="not included" className="inline-block text-cocoa-700/30" />;
  return <span className="text-sm font-semibold text-ink-900">{value}</span>;
}

// Local Fragment to avoid an extra React import line.
function Fragment({ children }: { children: React.ReactNode }) { return <>{children}</>; }
