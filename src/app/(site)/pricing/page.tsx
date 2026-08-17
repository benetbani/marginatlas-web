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
  PRIMARY_CTA,
} from "@/components/monetization";
import { CheckoutButton } from "@/components/monetization/CheckoutButton";
import { isAuthEnabled } from "@/lib/feature_flags";
/* The matrix, the Free description and the anti-Trading-Economics callout moved
   to src/lib/pricing/matrix.ts when a second pricing surface was built. Two
   copies of a price list is how a site ends up quoting different features on
   different pages, which is the drift this file's own header warns about.
   Values were verified byte-identical across the move. */
import {
  MATRIX,
  FREE_DESCRIPTION,
  ANTI_TE_CALLOUT,
  type MatrixCellValue,
} from "@/lib/pricing/matrix";

export const metadata = {
  title: "Pricing - Margin Atlas",
  description:
    "Free to browse every benchmark. Basic $37/mo unlocks deeper " +
    "quartiles, year-over-year change, and saved cells. Premium $77/mo " +
    "adds comparison, export, alerts, and confidence bands. Cancel any time.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <article>
      {/* THE FOUR SECTION GROUNDS ARE GONE, and this is not a colour tweak.
          AtlasFrame paints a fixed photograph behind every route with no centre
          plate, so a `bg-cream-50` or `bg-cream-100` on a <section> is an opaque
          plate over the picture for the section's whole height. Four of them ran
          end to end here, which made /pricing a solid sheet from masthead to
          footer. A band is not a card: the bands go transparent and the cards
          below carry the surface. Same call as PricingFAQ's own wrapper in
          56cd786a, and PricingFAQ sits between two of these.

          The `mx-auto max-w-6xl px-6` wrappers went with them. SiteChrome
          already gives every route in this group `max-w-content mx-auto px-6`,
          so those made a 1024px column inside the site's 1072 and doubled the
          gutter: the same defect the cohesion audit named on the city page and
          on /tools. The reading-measure cap at the foot of the page is kept,
          because a paragraph does want one. */}
      <section className="pt-16 pb-12 sm:pt-20 sm:pb-16">
        {/* The masthead in ONE card, for the reason the tier cards below are
            cards: bare dark type on a photograph is the thing the two-surface
            rule exists to prevent, and this is the top of the page. */}
        <div className="atlas-card px-5 py-6 md:px-7 md:py-7">
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
      <section className="pb-14 sm:pb-16">
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <li><FreeCard /></li>
          <li><PaidCard tier="basic" highlighted /></li>
          <li><PaidCard tier="premium" /></li>
        </ul>
      </section>

      {/* Full feature matrix. */}
      <section className="py-14 sm:py-20">
        <div className="atlas-card px-5 py-6 md:px-7 md:py-7">
          <SectionEyebrow size="md">Side by side</SectionEyebrow>
          <h2 className="font-display mt-3 text-2xl sm:text-3xl leading-[1.1] tracking-[-0.02em] font-semibold text-ink-900 max-w-3xl">
            What sits inside each tier.
          </h2>

          {/* The table sits INSIDE the heading card, so it takes the soft
              variant: a second translucent fill stacked on a translucent one
              would only muddy the picture underneath both. */}
          <div className="atlas-card-soft mt-10 overflow-x-auto">
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
      <section className="py-12 sm:py-16">
        {/* `mx-auto max-w-3xl` REMOVED, for the same reason it went from the
            FAQ band: it centred this card at 768 inside a 1072 column, giving
            the page a third left edge at x=353 against the x=205 of the hero,
            the tier cards and the table. The reading measure is kept where it
            belongs, on the prose inside, which is the pattern the hero on this
            same page already uses. */}
        <div className="atlas-card px-5 py-6 md:px-7 md:py-7">
          <SectionEyebrow size="md">How we think about your card</SectionEyebrow>
          <p className="font-display mt-3 max-w-3xl text-balance text-base sm:text-lg text-ink-900 leading-relaxed">
            {ANTI_TE_CALLOUT}
          </p>
          <p className="mt-5 max-w-3xl text-sm text-ink-700 leading-relaxed">
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
  /* Canonical surface: was "rounded-2xl bg-cream-50 border border-parchment",
     a fully opaque hand-roll. .atlas-card is translucent at .955 so the
     photograph reads through it, and carries position:relative so it sits
     above AtlasFrame's fixed layers instead of sinking behind them. */
  return (
    <div className="atlas-card p-6 h-full flex flex-col">
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
  /* Both tiers are the canonical card now. Basic keeps its recommendation
     signal, and keeps it in tokens: .atlas-card sets the border WIDTH so a
     later border-color utility still wins, and shadow-lift is the elevation
     token that the hand-rolled shadow-[0_1px_3px...] was approximating by
     hand. Raw box-shadow values in components are banned; this one predated
     the rule. */
  const wrapperClasses = highlighted
    ? "atlas-card border-atlas-300 shadow-lift"
    : "atlas-card";
  const buttonClasses =
    tier === "basic"
      ? "bg-atlas-700 text-cream-50 hover:bg-atlas-800"
      : "bg-ink-900 text-cream-50 hover:bg-ink-800";
  // Billing is live only when auth is on AND Stripe is configured (server-only
  // env). Read at build time, so the pricing page keeps its newsletter CTA until
  // the founder activates Stripe, then auto-switches to real checkout.
  const billingLive = isAuthEnabled() && !!process.env.STRIPE_SECRET_KEY;
  return (
    <div className={`p-6 h-full flex flex-col ${wrapperClasses}`}>
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
      {/* The CTA. When billing is live (auth on AND Stripe configured) the
         button starts a Checkout session; until then it stays parked on the
         site-wide newsletter signup with the "we will email you" caption. The
         switch is build-time, so production is unchanged until activation. */}
      <div className="mt-6">
        {billingLive ? (
          <CheckoutButton
            tier={tier}
            className={`inline-flex w-full cursor-pointer justify-center items-center gap-1.5 rounded-full py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${buttonClasses}`}
          >
            {PRIMARY_CTA[tier]}
          </CheckoutButton>
        ) : (
          <>
            <a
              href="#newsletter"
              className={`inline-flex w-full justify-center items-center gap-1.5 rounded-full py-2.5 text-sm font-semibold transition-colors ${buttonClasses}`}
            >
              {tier === "basic" ? "Notify me when Basic opens" : "Notify me when Premium opens"}
            </a>
            <p className="mt-2 text-[11px] text-cocoa-700/80 text-center">
              We will email you when paid plans open.
            </p>
          </>
        )}
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
