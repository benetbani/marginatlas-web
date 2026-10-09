/**
 * /pricing: one plan, Pro (milestone 2; masterplan step 12; his interview of 2026-09-26: 13, Pro sells depth; 17, each UK chapter
 * opens free and Pro opens the rest; 20, checkout first, no trial; 33, dollars everywhere; 34, cancel any time; and his decision
 * of 2026-10-09 on the price: the page leads with the year).
 *
 * Server component. Every price prints through src/lib/monetization/plan.ts (gate one-price) and every line of what Pro opens
 * through paywall_copy.ts, so this page and the home teaser cannot drift. One plan card: the year first, its headline and one
 * plain line with the year's total and the saving, the month's price one line away (plain text under the saving line while billing
 * is dormant, one click under the year's button once it is live), what Pro opens, the cancel-any-time block, and one line saying
 * the prices are dollars. While billing is dormant (accounts off or no
 * Stripe key) the button is the site's notify-me link to the newsletter. tests/monetization/pricing_page.test.ts holds the page
 * as drawn: the lead, the order, and no dollar figure but the plan's own.
 *
 * The v34 bans this page still keeps: no trial copy, no money-back promise, no "Contact sales", no charm pricing, no countdown or
 * scarcity counter, no "Most popular" badge, no Free column and no comparison table (one plan has nothing to compare).
 */
import PricingFAQ from "@/components/billing/PricingFAQ";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { TIERS, CANCEL_ANYTIME_BLOCK, METHODOLOGY_HREF, METHODOLOGY_LABEL, PRO_OPENS } from "@/components/monetization";
import { CheckoutButton } from "@/components/monetization/CheckoutButton";
import { isAuthEnabled, isPaywallOn } from "@/lib/feature_flags";
import { monthToMonthLine, priceLine, yearlyHeadline, yearlySavingLine } from "@/lib/monetization/plan";
import { ANTI_TE_CALLOUT } from "@/lib/pricing/matrix";

export const metadata = {
  title: "Pricing - Margin Atlas",
  description: `One plan, Pro: ${yearlyHeadline()}, ${monthToMonthLine()}. Each UK chapter opens free. Cancel any time.`,
  alternates: { canonical: "/pricing" },
};

/* One pill. Full width on a phone, its own width from 640px, so the single button does not stretch across a wide card. */
const BUTTON = "inline-flex w-full cursor-pointer justify-center items-center gap-1.5 rounded-full px-8 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 sm:w-auto";

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

          {/* THE YEAR FIRST (his decision of 2026-10-09): the year written by the month, then one plain line with its total (v34
              Part 4.2) and the saving, all read from the plan. The month's price comes after, one line away: plain text under the
              saving line while billing is dormant (after the notify-me link, its "or" would read as an "or" on the link), and once
              billing is live the second checkout under the year's, with the site's 44px tap and a name for a screen reader that
              does not open with "or" ("Get Pro " is hidden text before the visible line). */}
          <h2 className="mt-6 text-balance font-display text-2xl sm:text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink-900 tabular-nums">
            {yearlyHeadline()}
          </h2>
          <p className="mt-2 text-sm text-ink-700 tabular-nums">{yearlySavingLine()}</p>
          {billingLive ? null : <p className="mt-1 text-sm text-ink-700 tabular-nums">{monthToMonthLine()}</p>}

          {billingLive ? (
            <div className="mt-5">
              <CheckoutButton interval="year" className={`${BUTTON} bg-atlas-700 text-white hover:bg-atlas-800`}>
                {`Get Pro for ${priceLine("year")}`}
              </CheckoutButton>
              <div className="mt-1 text-center sm:text-left">
                <CheckoutButton interval="month" className="inline-flex min-h-11 cursor-pointer items-center text-sm font-medium tabular-nums text-atlas-700 underline underline-offset-4 hover:text-atlas-900 disabled:opacity-60">
                  <span className="sr-only">Get Pro </span>
                  {monthToMonthLine()}
                </CheckoutButton>
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <a href="#newsletter" className={`${BUTTON} bg-atlas-700 text-white hover:bg-atlas-800`}>
                Notify me when Pro opens
              </a>
            </div>
          )}

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
          {/* From launch day, the terms' cancelling section (masterplan step 30), which exists only once the switch is on. */}
          {isPaywallOn() ? (
            <p className="mt-2 text-sm">
              <a href="/terms#refunds" className="text-atlas-700 hover:text-atlas-900 font-medium">
                How cancelling works
              </a>
            </p>
          ) : null}
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
