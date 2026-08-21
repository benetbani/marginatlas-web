"use client";
/**
 * Neighborhood-hub MASTHEAD , the answer-first, two-figure honest headline. NOT a
 * 4-cell equal scorecard: the page ranks districts by RENT LOAD, the knowable seed
 * input (rulebook v1 §5: a per-district "what you keep" ranking has no statistical
 * basis and never renders), so the masthead leads with the district where rent runs
 * lightest (the hero, terracotta, largest figure on the page) against the one where
 * it runs heaviest (grey support). District count is a caption, not a hero cell.
 * Count-up-safe: the hero rent figure rests at its real value and only animates on
 * mount (above the fold), reduced-motion safe. Prose comes from the seed / derived.
 */
import * as React from "react";
import { CountryFlag } from "@/components/CountryFlag";
import { Fig } from "@/components/spine/kit";
import { AtlasMark } from "@/components/spine/marks";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}
function useCountUp(target: number, reduced: boolean, ms = 560) {
  const [v, setV] = React.useState(target); // RESTS at target (SSR / no-JS / reduced-motion)
  React.useEffect(() => {
    if (reduced) { setV(target); return; }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const e = 1 - Math.pow(1 - t, 3);
      setV(target * e);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduced, ms]);
  return v;
}

type District = { name: string; slug?: string; rent_mult: number };

export function HoodMasthead({ d }: { d: any }) {
  const reduced = usePrefersReducedMotion();
  const districts: District[] = d.districts ?? [];
  // ONE order page-wide: rent load ascending, lightest lease first (founder D1).
  const byRent = [...districts].sort((a, b) => a.rent_mult - b.rent_mult);
  const best = byRent[0];
  const heavy = byRent[byRent.length - 1];
  // the masthead's whole read, "rent runs lightest" vs "rent runs heaviest", needs
  // two distinct districts to contrast. Compute with safe fallbacks here, then
  // degrade to nothing below, once every hook has run (rules of hooks: the early
  // return must follow every hook call, never sit between two).
  const bestRent = best?.rent_mult ?? 0;
  const rentShown = useCountUp(bestRent, reduced);

  // degrade rather than throw if the caller gate ever loosens and fewer than two
  // districts reach the masthead (it needs a lightest AND a heaviest to contrast).
  if (districts.length < 2 || !best || !heavy) return null;

  return (
    <section className="py-6 md:py-8">
      {/* upward navigation , wired to the city page (dev route until promotion). */}
      <a href={d.meta?.city_href ?? "/cities"} className="mb-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--c-border)] bg-white/70 px-3 py-1 text-xs font-semibold text-[var(--c-ink2)] transition hover:border-[var(--c-line-strong)] hover:text-[var(--c-ink)]">&#8592; Back to {d.meta?.city}</a>
      <div className="flex items-center gap-3.5">
        <CountryFlag iso2={d.meta?.iso2?.toLowerCase()} className="w-[36px] rounded-sm shadow-sm" />
        <h1 data-typography="custom" className="text-3xl font-semibold tracking-tight text-[var(--c-ink)] md:text-4xl">{d.meta?.city} neighborhoods</h1>
        {/* wayfinding: this page reads at district level (calm, muted) */}
        <AtlasMark id="alt-district" size={16} className="opacity-60" />
      </div>
      <p className="mt-2 max-w-2xl text-[13.5px] leading-snug text-[var(--c-ink2)]">
        Money moves street to street: each district ranked by rent load, the multiple its leases run against a district with no premium, lightest first, across <Fig className="text-[var(--c-ink)]">{districts.length}</Fig> districts.
      </p>

      {/* ONE dominant answer: the district where rent runs lightest (the single
          terracotta figure on the page). The heaviest lease and the city baseline sit
          in a smaller neutral support panel that FILLS the right half, so the card
          reads as two balanced panels, never a lone stat beside a blank middle band
          (rulebook v2 §17). Tokens/plain white, no warm wash; terracotta on the answer
          figure only (§37/§38). */}
      <div className="mt-5 rounded-[14px] border border-[var(--c-border)] bg-[var(--c-card)] px-5 py-5 md:px-6 md:py-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-stretch sm:gap-6">
          {/* HERO , the lightest lease, the one terracotta figure, one focal size */}
          <div className="min-w-0 sm:flex-1">
            <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">Rent runs lightest</div>
            <div className="mt-1.5 flex items-end gap-3.5">
              <Fig className="text-[48px] leading-none text-[var(--terra-text)]">x{rentShown.toFixed(2)}</Fig>
              <div className="pb-1.5">
                <div className="text-[length:var(--t-sub)] font-semibold leading-tight text-[var(--c-ink)]">{best.name}</div>
                <div className="text-[length:var(--t-micro)] text-[var(--c-muted)]">rent, x the city level</div>
              </div>
            </div>
          </div>

          {/* a hairline divider between the two panels */}
          <div className="hidden w-px shrink-0 bg-[var(--c-border)] sm:block" />

          {/* SUPPORT , heaviest lease + the city baseline, two neutral rows filling the
              right half. No accent here (terracotta stays on the hero answer only). */}
          <div className="sm:flex-1">
            <div className="flex items-baseline justify-between gap-3 border-b border-[var(--c-border)] pb-2.5">
              <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{d.meta?.support_label ?? "Heaviest rent"}</span>
              <span className="flex items-baseline gap-2">
                <Fig className="text-[length:var(--t-sub)] leading-none text-[var(--c-ink)]">x{heavy.rent_mult.toFixed(2)}</Fig>
                <span className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink2)]">{heavy.name}</span>
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-3 pt-2.5">
              <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">City baseline</span>
              <span className="flex items-baseline gap-2">
                <Fig className="text-[length:var(--t-sub)] leading-none text-[var(--c-ink)]">x1.00</Fig>
                <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">a comparable unit at the city rate</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
