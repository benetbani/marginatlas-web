"use client";

/**
 * PaywallModalRoot — v34 Phase B.
 *
 * Listens for the `atlas:open-paywall` custom event on window and
 * renders the paywall surface. Mounted once at layout.tsx so any
 * primitive on any page can trigger it without prop drilling.
 *
 * v34 research-locked rules embedded here:
 *  - At most TWO trust signals. Field study, n=288,169 transactions:
 *    more than two seals REDUCES completion. We use exactly two:
 *    Methodology link + cancel-anytime block.
 *  - NO padlock icon on the headline. (Conclusion 1A.4.)
 *  - Modal headline names the JOB the user is trying to do, not the
 *    tier. (Part 3.3.) Tier reveal is in the sub-copy.
 *  - Mobile = bottom-sheet, NOT centered modal interrupt. (1A.10.)
 *  - Two tiers rendered side by side. Basic is the recommended
 *    default (subtle atlas-50 highlight).
 *  - Pre-Phase-D: primary CTA navigates to /pricing, not Stripe.
 *  - Dismiss paths: X button, ESC key, backdrop click, "Not now"
 *    link. (No modal-trap.)
 *  - Microcopy: pulled verbatim from paywall_copy.ts.
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 * Part 6 Phase B + Part 3 microcopy + Part 4 tier matrix.
 */

import { useEffect, useState, useCallback } from "react";
import {
  OPEN_PAYWALL_EVENT,
  OpenPaywallDetail,
  PaywallEntryPoint,
  PaywallTier,
} from "./events";
import {
  MODAL_HEADLINES,
  TIERS,
  CANCEL_ANYTIME_BLOCK,
  METHODOLOGY_LABEL,
  METHODOLOGY_HREF,
  PRIMARY_CTA,
  DISMISS_LABEL,
  PRICING_HREF,
} from "./paywall_copy";
import {
  trackPaywallOpen,
  trackPaywallCta,
  trackPaywallDismiss,
} from "./analytics";

type ModalState = {
  open: boolean;
  entry: PaywallEntryPoint;
  highlightedTier: PaywallTier;
};

const INITIAL: ModalState = {
  open: false,
  entry: "generic",
  highlightedTier: "basic",
};

export function PaywallModalRoot() {
  const [state, setState] = useState<ModalState>(INITIAL);

  const close = useCallback(() => {
    setState((s) => {
      if (s.open) trackPaywallDismiss(s.entry);
      return { ...s, open: false };
    });
  }, []);

  // Listen for atlas:open-paywall on window.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<OpenPaywallDetail>).detail;
      if (!detail) return;
      trackPaywallOpen(detail.entry, detail.tier);
      setState({
        open: true,
        entry: detail.entry,
        highlightedTier: detail.tier,
      });
    };
    window.addEventListener(OPEN_PAYWALL_EVENT, handler);
    return () => window.removeEventListener(OPEN_PAYWALL_EVENT, handler);
  }, []);

  // ESC key + body-scroll lock while open.
  useEffect(() => {
    if (!state.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [state.open, close]);

  if (!state.open) return null;

  const headline = MODAL_HEADLINES[state.entry] || MODAL_HEADLINES.generic;

  return (
    <div
      data-v34-paywall="root"
      data-v34-entry={state.entry}
      role="dialog"
      aria-modal="true"
      aria-labelledby="v34-paywall-headline"
      className="fixed inset-0 z-50"
    >
      {/* Backdrop. Click to dismiss. */}
      <button
        type="button"
        aria-label="Close paywall"
        onClick={close}
        className="absolute inset-0 bg-ink-900/30 backdrop-blur-[1px] cursor-default"
      />

      {/* Panel. Mobile = bottom-sheet (max-h 85vh, anchored bottom).
         Desktop = centered. */}
      <div
        className={[
          "absolute left-0 right-0 mx-auto",
          // Mobile: anchored to bottom of viewport, slide-up. Desktop:
          // centered with max-width.
          "bottom-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2",
          "w-full sm:max-w-2xl",
          "bg-cream-50 sm:rounded-2xl rounded-t-2xl sm:rounded-b-2xl",
          "shadow-[0_-8px_40px_rgba(0,0,0,0.18)] sm:shadow-[0_24px_60px_rgba(0,0,0,0.18)]",
          "border border-ink-200",
          "max-h-[85vh] overflow-y-auto",
        ].join(" ")}
      >
        {/* Mobile grabber bar (visual cue this is dismissable). */}
        <div className="sm:hidden flex justify-center pt-2">
          <div className="w-10 h-1 bg-ink-300 rounded-full" />
        </div>

        {/* Close button — top right on desktop, integrated on mobile. */}
        <div className="flex items-start justify-between px-6 pt-5 sm:pt-6">
          <h2
            id="v34-paywall-headline"
            className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink-900"
          >
            {headline}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="ml-3 -mr-2 -mt-1 inline-flex items-center justify-center w-9 h-9 rounded-full text-ink-700 hover:bg-ink-100 transition-colors"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              &times;
            </span>
          </button>
        </div>

        {/* Two-tier comparison. Basic on the left (recommended highlight),
           Premium on the right. */}
        <div className="px-6 mt-4 grid sm:grid-cols-2 gap-3">
          <TierCard
            tier="basic"
            highlighted={state.highlightedTier === "basic"}
            entry={state.entry}
          />
          <TierCard
            tier="premium"
            highlighted={state.highlightedTier === "premium"}
            entry={state.entry}
          />
        </div>

        {/* Trust signals — EXACTLY TWO. Methodology + cancel-anytime block.
           No third signal. (Conclusion 1A.8.) */}
        <div className="px-6 mt-5 pt-4 border-t border-ink-200">
          <p className="text-xs text-ink-700 leading-relaxed">
            {CANCEL_ANYTIME_BLOCK}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <a
              href={METHODOLOGY_HREF}
              className="text-atlas-700 hover:text-atlas-900 font-medium"
            >
              {METHODOLOGY_LABEL} &rarr;
            </a>
            <button
              type="button"
              onClick={close}
              className="text-ink-700 hover:text-ink-900"
            >
              {DISMISS_LABEL}
            </button>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
}

function TierCard({
  tier,
  highlighted,
  entry,
}: {
  tier: PaywallTier;
  highlighted: boolean;
  entry: PaywallEntryPoint;
}) {
  const spec = TIERS[tier];
  const wrapperClasses = [
    "rounded-xl p-4 border transition-colors",
    highlighted
      ? "bg-atlas-50 border-atlas-300"
      : "bg-white border-ink-200",
  ].join(" ");
  const buttonClasses =
    tier === "basic"
      ? "bg-atlas-700 text-cream-50 hover:bg-atlas-800"
      : "bg-ink-900 text-cream-50 hover:bg-ink-800";

  return (
    <div className={wrapperClasses} data-v34-tier-card={tier}>
      <div className="flex items-baseline justify-between">
        <div className="font-display text-lg font-semibold text-ink-900">
          {spec.name}
        </div>
        <div className="tabular-nums text-sm text-ink-700">
          <span className="font-semibold text-ink-900">${spec.priceMonthly}</span>
          /mo
        </div>
      </div>
      <p className="mt-2 text-sm text-ink-800 leading-relaxed">
        {spec.description}
      </p>
      <p className="mt-2 text-xs text-ink-700 tabular-nums">
        or ${spec.priceAnnualPerMonth}/mo billed annually as $
        {spec.priceAnnualTotal}
      </p>
      <a
        href={PRICING_HREF}
        onClick={() => trackPaywallCta(entry, tier)}
        className={[
          "mt-3 inline-flex w-full justify-center items-center",
          "px-4 py-2.5 rounded-full text-sm font-semibold transition-colors",
          buttonClasses,
        ].join(" ")}
      >
        {PRIMARY_CTA[tier]}
      </a>
    </div>
  );
}
