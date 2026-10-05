/**
 * /pricing: one plan, Pro (milestone 2; masterplan step 12; his interview of 2026-09-26: 13, Pro sells depth; 14, $38 a month or
 * $238 a year; 17, each UK chapter opens free and Pro opens the rest; 20, checkout first, no trial; 33, dollars everywhere; 34,
 * cancel any time).
 *
 * Server component. Every price prints through src/lib/monetization/plan.ts (gate one-price) and every line of what Pro opens
 * through paywall_copy.ts, so this page and the home teaser cannot drift. One plan card, two buttons, what Pro opens, the
 * cancel-any-time block, and one line saying the prices are dollars. While billing is dormant (accounts off or no Stripe key)
 * the buttons are the site's notify-me link to the newsletter.
 *
 * The v34 bans this page still keeps: no trial copy, no money-back promise, no "Contact sales", no charm pricing, no countdown or
 * scarcity counter, no "Most popular" badge, no Free column and no comparison table (one plan has nothing to compare).
 */
import PricingFAQ from "@/components/billing/PricingFAQ";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { TIERS, CANCEL_ANYTIME_BLOCK, METHODOLOGY_HREF, METHODOLOGY_LABEL, PRO_OPENS } from "@/components/monetization";
import { CheckoutButton } from "@/components/monetization/CheckoutButton";
import { isAuthEnabled, isPaywallOn } from "@/lib/feature_flags";
import { priceLine } from "@/lib/monetization/plan";
import { ANTI_TE_CALLOUT } from "@/lib/pricing/matrix";

export const metadata = {
  title: "Pricing - Margin Atlas",
  description: `One plan, Pro: ${priceLine("month")} or ${priceLine("year")}. Each UK chapter opens free. Cancel any time.`,
  alternates: { canonical: "/pricing" },
};

const BUTTON = "inline-flex w-full cursor-pointer justify-center items-center gap-1.5 rounded-full py-2.5 text-sm font-semibold transition-colors disabled:opacity-60";

export default function PricingPage() {
  /* Billing is live only when accounts are on AND Stripe is configured (a server-only key), read at render, so the page keeps
     its notify-me link until the founder's launch-day switches (LAUNCH-SWITCHES.md). */
  const billingLive = isAuthEnabled() && !!process.env.STRIPE_SECRET_KEY;
  const pro = TIERS.pro;
  return (
    <article>
      <section className="pt-16 pb-12 sm:pt-20 sm:pb-16">
        <div className="atlas-card px-5 py-6 md:px-7 md:py-7">
          <SectionEyebrow size="md">Pricing</SectionEyebrow>
          <h1 className="font-display mt-3 text-balance text-4xl sm:text-5xl leading-[1.08] tracking-[-0.022em] font-semibold text-ink-900 max-w-3xl">
            One plan, Pro.
          </h1>
          {/* Ruling 17's wording from launch day (the paywall's switch); today's until then, which is true until then. */}
          <p className="font-display italic mt-4 text-balance text-base sm:text-lg text-cocoa-700 leading-relaxed max-w-xl">
            {isPaywallOn() ? "Each UK chapter opens free. Pro opens the rest." : "Every benchmark is free to read today."}
          </p>
        </div>
      </section>

      <section className="pb-14 sm:pb-16">
        <div className="atlas-card border-atlas-300 shadow-lift p-6 md:p-8">
          <p className="font-display text-[44px] font-bold leading-none tracking-[-0.025em] text-ink-900">{pro.name}</p>
          <div className="mt-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
            {billingLive ? (
              <>
                <div>
                  <CheckoutButton interval="month" className={`${BUTTON} bg-atlas-700 text-white hover:bg-atlas-800`}>
                    {priceLine("month")}
                  </CheckoutButton>
                </div>
                <div>
                  <CheckoutButton interval="year" className={`${BUTTON} bg-ink-900 text-white hover:bg-ink-800`}>
                    {priceLine("year")}
                  </CheckoutButton>
                  <p className="mt-2 text-center text-[11px] text-cocoa-700">billed annually</p>
                </div>
              </>
            ) : (
              <div className="min-[420px]:col-span-2">
                <a href="#newsletter" className={`${BUTTON} bg-atlas-700 text-white hover:bg-atlas-800`}>
                  Notify me when Pro opens
                </a>
                {/* Both prices, the yearly one as its total (v34 Part 4.2), read from the plan. */}
                <p className="mt-2 text-center text-[11px] text-cocoa-700 tabular-nums">
                  {priceLine("month")} or {priceLine("year")}
                </p>
              </div>
            )}
          </div>

          <h2 className="mt-8 font-display text-xl font-semibold text-ink-900">What Pro opens</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-800">
            {PRO_OPENS.map((line) => (
              <li key={line} className="flex gap-3">
                <span className="text-atlas-500 shrink-0" aria-hidden>
                  ·
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-3xl text-sm text-ink-700 leading-relaxed">{CANCEL_ANYTIME_BLOCK}</p>
          <p className="mt-2 text-sm text-ink-700">Prices in US dollars.</p>
        </div>
      </section>

      <PricingFAQ />

      <section className="py-12 sm:py-16">
        <div className="atlas-card px-5 py-6 md:px-7 md:py-7">
          <SectionEyebrow size="md">How we think about your card</SectionEyebrow>
          <p className="font-display mt-3 max-w-3xl text-balance text-base sm:text-lg text-ink-900 leading-relaxed">{ANTI_TE_CALLOUT}</p>
          <p className="mt-5 text-sm">
            <a href={METHODOLOGY_HREF} className="text-atlas-700 hover:text-atlas-900 font-medium">
              {METHODOLOGY_LABEL} &rarr;
            </a>
          </p>
        </div>
      </section>
    </article>
  );
}
