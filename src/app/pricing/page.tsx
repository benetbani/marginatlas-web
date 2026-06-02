/**
 * /pricing — v34-locked. Free / Basic / Premium.
 *
 * Server component. The tier cards and matrix render directly from
 * the same paywall_copy.ts that the modal uses, so the two surfaces
 * cannot drift.
 *
 * v34 rules enforced here:
 *  - Tier names: Free / Basic / Premium (exact)
 *  - Prices: $0 / $37 / $77 monthly; annual shown as monthly equiv
 *    PLUS the actual yearly total in the same line
 *  - NO trial copy anywhere
 *  - NO money-back guarantee copy
 *  - NO "Contact sales" or opaque enterprise tier
 *  - NO charm pricing
 *  - NO countdown timer, scarcity counter
 *  - Basic visually highlighted (atlas-50) but no aggressive
 *    "Most popular" badge
 *  - Cancel-anytime block + anti-Trading-Economics callout at the
 *    bottom, both copied verbatim from paywall_copy.ts where
 *    available
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 * Part 4 (tier matrix) + Part 3 (microcopy lexicon).
 */

import { Check, Minus } from "@phosphor-icons/react/dist/ssr";
import PricingFAQ from "@/components/billing/PricingFAQ";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import {
  TIERS,
  CANCEL_ANYTIME_BLOCK,
  METHODOLOGY_HREF,
  METHODOLOGY_LABEL,
} from "@/components/monetization";

export const metadata = {
  title: "Pricing - Margin Atlas",
  description:
    "Free to browse every benchmark. Basic $37/mo unlocks deeper " +
    "quartiles, year-over-year change, and saved cells. Premium $77/mo " +
    "adds comparison, export, alerts, and confidence bands. Cancel any time.",
};

// The Free row needs its own metadata since paywall_copy.ts only
// describes the paid tiers.
const FREE_DESCRIPTION =
  "Median, top decile, and bottom decile for every cell. The character " +
  "of every place we cover. No account required.";

// v34 Part 3.7 - anti-Trading-Economics callout (verbatim).
const ANTI_TE_CALLOUT =
  "What we will never do: no auto-trial, no card-required-to-preview, " +
  "no friction to cancel, no surprise renewal-price hikes. The price " +
  "you sign up at is the price you pay until you decide otherwise.";

type MatrixCellValue = boolean | string;
type MatrixRow = {
  group: string;
  label: string;
  values: [MatrixCellValue, MatrixCellValue, MatrixCellValue]; // free / basic / premium
};

// v34 Part 4.1 feature matrix, exact.
const MATRIX: MatrixRow[] = [
  // Browsing
  { group: "Browsing", label: "Cell pages (read)",        values: [true, true, true] },
  { group: "Browsing", label: "Median (p50)",             values: [true, true, true] },
  { group: "Browsing", label: "Top decile (p90)",         values: [true, true, true] },
  { group: "Browsing", label: "Bottom decile (p10)",      values: [true, true, true] },
  { group: "Browsing", label: "Headline cost line",       values: [true, true, true] },
  { group: "Browsing", label: "Grand setup-cost total",   values: [true, true, true] },
  { group: "Browsing", label: "City character",           values: [true, true, true] },
  { group: "Browsing", label: "Failure modes",            values: [true, true, true] },
  { group: "Browsing", label: "Tangible units",           values: [true, true, true] },
  { group: "Browsing", label: "If you opened today",      values: [true, true, true] },
  { group: "Browsing", label: "Narrative paragraph",      values: [true, true, true] },

  // Depth (Basic unlocks)
  { group: "Depth",    label: "Lower-mid quartile (p25)", values: [false, true, true] },
  { group: "Depth",    label: "Upper-mid quartile (p75)", values: [false, true, true] },
  { group: "Depth",    label: "Year-over-year deltas",    values: [false, true, true] },
  { group: "Depth",    label: "Source citation per line", values: [false, true, true] },

  // Personal workspace (Basic unlocks)
  { group: "Workspace", label: "Saved cells (watchlist)", values: [false, "25 max", "Unlimited"] },
  { group: "Workspace", label: "Saved searches",          values: [false, true, true] },

  // Power (Premium unlocks)
  { group: "Power",     label: "Cell comparison (side by side)", values: [false, false, true] },
  { group: "Power",     label: "CSV export",                values: [false, false, true] },
  { group: "Power",     label: "Email alerts on cell updates", values: [false, false, true] },
  { group: "Power",     label: "Confidence intervals",      values: [false, false, true] },
  { group: "Power",     label: "Seasonality calendar",      values: [false, false, true] },
  { group: "Power",     label: "Public-company peers panel",values: [false, false, true] },
  { group: "Power",     label: "Equipment shopping list",   values: [false, false, true] },
];

export default function PricingPage() {
  return (
    <article>
      <section className="bg-cream-50 border-b border-parchment">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-12 sm:pt-20 sm:pb-16">
          <SectionEyebrow size="md">Pricing</SectionEyebrow>
          <h1 className="font-display mt-3 text-balance text-4xl sm:text-5xl leading-[1.08] tracking-[-0.022em] font-semibold text-ink-900 max-w-3xl">
            Three ways to use Atlas.
          </h1>
          <p className="font-display italic mt-4 text-balance text-base sm:text-lg text-cocoa-700 leading-relaxed max-w-xl">
            Browsing every benchmark is free and will stay free. Paid tiers
            exist for readers who want deeper quartiles, saved cells, and
            the data out of the page.
          </p>
        </div>
      </section>

      {/* Tier cards: Free | Basic (highlighted) | Premium, left to right. */}
      <section className="bg-cream-50">
        <div className="mx-auto max-w-6xl px-6 pb-14 sm:pb-16">
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <li><FreeCard /></li>
            <li><PaidCard tier="basic" highlighted /></li>
            <li><PaidCard tier="premium" /></li>
          </ul>
        </div>
      </section>

      {/* Full feature matrix. */}
      <section className="bg-cream-100 border-t border-b border-parchment">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
          <SectionEyebrow size="md">Side by side</SectionEyebrow>
          <h2 className="font-display mt-3 text-2xl sm:text-3xl leading-[1.1] tracking-[-0.02em] font-semibold text-ink-900 max-w-3xl">
            What sits inside each tier.
          </h2>

          <div className="mt-10 overflow-x-auto rounded-lg bg-cream-50 border border-parchment">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-cream-100">
                  <th className="text-left px-4 py-3 text-[11px] tracking-[0.16em] uppercase font-semibold text-cocoa-700/85">Feature</th>
                  {["Free", "Basic", "Premium"].map((c) => (
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

      {/* v34 Part 3.7 anti-Trading-Economics callout +
          Part 3.6 cancel-anytime block. Both verbatim. */}
      <section className="bg-cream-50 border-t border-parchment">
        <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
          <SectionEyebrow size="md">How we think about your card</SectionEyebrow>
          <p className="font-display mt-3 text-balance text-base sm:text-lg text-ink-900 leading-relaxed">
            {ANTI_TE_CALLOUT}
          </p>
          <p className="mt-5 text-sm text-ink-700 leading-relaxed">
            {CANCEL_ANYTIME_BLOCK}
          </p>
          <p className="mt-5 text-sm">
            <a
              href={METHODOLOGY_HREF}
              className="text-atlas-700 hover:text-atlas-900 font-medium"
            >
              {METHODOLOGY_LABEL} &rarr;
            </a>
          </p>
        </div>
      </section>
    </article>
  );
}

function FreeCard() {
  return (
    <div className="rounded-2xl p-6 h-full flex flex-col bg-cream-50 border border-parchment">
      <div className="flex items-center justify-between">
        <span className="font-display text-xl font-semibold tracking-[-0.01em] text-ink-900">Free</span>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display tabular-nums font-bold text-[44px] leading-none tracking-[-0.025em] text-ink-900">$0</span>
        <span className="text-sm text-cocoa-700">no account needed</span>
      </div>
      <p className="font-display italic mt-2 text-base text-cocoa-700">Browse every benchmark.</p>
      <p className="mt-3 text-sm text-ink-800 leading-relaxed flex-1">
        {FREE_DESCRIPTION}
      </p>
      <div className="mt-6">
        <span className="inline-flex w-full justify-center items-center gap-1.5 rounded-full py-2.5 text-sm font-semibold bg-cream-100 border border-parchment text-cocoa-700">
          You're using this now
        </span>
      </div>
    </div>
  );
}

function PaidCard({
  tier,
  highlighted = false,
}: {
  tier: "basic" | "premium";
  highlighted?: boolean;
}) {
  const spec = TIERS[tier];
  const wrapperClasses = highlighted
    ? "bg-white border border-atlas-300 shadow-[0_1px_3px_rgb(0_0_0/0.05),_0_8px_28px_rgb(0_0_0/0.06)]"
    : "bg-cream-50 border border-parchment";
  const buttonClasses =
    tier === "basic"
      ? "bg-atlas-700 text-cream-50 hover:bg-atlas-800"
      : "bg-ink-900 text-cream-50 hover:bg-ink-800";
  return (
    <div className={`rounded-2xl p-6 h-full flex flex-col ${wrapperClasses}`}>
      <div className="flex items-center justify-between">
        <span className="font-display text-xl font-semibold tracking-[-0.01em] text-ink-900">
          {spec.name}
        </span>
        {/* No 'Most popular' / 'Best value' badge. The atlas border + soft
           shadow on Basic is the recommendation signal. v34 rule. */}
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display tabular-nums font-bold text-[44px] leading-none tracking-[-0.025em] text-ink-900">
          ${spec.priceMonthly}
        </span>
        <span className="text-sm text-cocoa-700">per month</span>
      </div>
      {/* v34 Part 4.2: annual shown as monthly equiv + the actual
         yearly total in the same line. */}
      <p className="mt-2 text-xs text-cocoa-700 tabular-nums">
        or ${spec.priceAnnualPerMonth}/mo billed annually as $
        {spec.priceAnnualTotal}
      </p>
      <p className="mt-4 text-sm text-ink-800 leading-relaxed flex-1">
        {spec.description}
      </p>
      {/* Pre-Phase-D: Stripe is parked per founder. CTAs scroll to the
         site-wide newsletter signup with the refusal microcopy in the
         caption. Phase D will swap the href to a Stripe Checkout URL
         and the caption disappears. */}
      <div className="mt-6">
        <a
          href="#newsletter"
          className={`inline-flex w-full justify-center items-center gap-1.5 rounded-full py-2.5 text-sm font-semibold transition-colors ${buttonClasses}`}
        >
          {tier === "basic" ? "Notify me when Basic opens" : "Notify me when Premium opens"}
        </a>
        <p className="mt-2 text-[11px] text-cocoa-700/80 text-center">
          We will email you when paid plans open.
        </p>
      </div>
    </div>
  );
}

function MatrixCell({ value }: { value: MatrixCellValue }) {
  if (value === true)
    return <Check size={16} weight="regular" aria-label="included" className="inline-block text-atlas-700" />;
  if (value === false)
    return <Minus size={12} weight="regular" aria-label="not included" className="inline-block text-cocoa-700/30" />;
  return <span className="text-sm font-semibold text-ink-900">{value}</span>;
}

function Fragment({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
