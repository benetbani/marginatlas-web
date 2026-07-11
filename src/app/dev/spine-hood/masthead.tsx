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
import { Fig, InfoTip } from "@/components/spine/kit";
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
  const heroNote =
    d.meta?.hero_note ??
    (best?.rent_mult != null
      ? `Rent here runs x${best.rent_mult.toFixed(2)} the city rate, the lightest lease of the ${districts.length} districts.`
      : null);

  // degrade rather than throw if the caller gate ever loosens and fewer than two
  // districts reach the masthead (it needs a lightest AND a heaviest to contrast).
  if (districts.length < 2 || !best || !heavy) return null;

  return (
    <section className="py-6 md:py-8">
      {/* upward navigation , wired to the city page (dev route until promotion). */}
      <a href={d.meta?.city_href ?? "/dev/spine-city"} className="mb-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--c-border)] bg-white/70 px-3 py-1 text-xs font-semibold text-[var(--c-ink2)] transition hover:border-[var(--terra-border)] hover:text-[var(--terra-text)]">&#8592; Back to {d.meta?.city}</a>
      <div className="flex items-center gap-3.5">
        <CountryFlag iso2={d.meta?.iso2?.toLowerCase()} className="w-[36px] rounded-sm shadow-sm" />
        <h1 data-typography="custom" className="text-3xl font-semibold tracking-tight text-[var(--c-ink)] md:text-4xl">{d.meta?.city} neighborhoods</h1>
        {/* wayfinding: this page reads at district level (calm, muted) */}
        <AtlasMark id="alt-district" size={16} className="opacity-60" />
      </div>
      <p className="mt-2 max-w-2xl text-[13.5px] leading-snug text-[var(--c-ink2)]">
        Money moves street to street: each district ranked by rent load, the multiple of the city rate its leases run, lightest first, across <Fig className="text-[var(--c-ink)]">{districts.length}</Fig> districts.
      </p>

      {/* ONE dominant hero: the district where rent runs lightest (terracotta, the
          single largest figure on the page). The heaviest-lease district is demoted to
          a small neutral supporting stat inside the same card, not a co-equal cell. */}
      <div className="mt-5 rounded-[14px] border border-[var(--terra-border)] bg-[var(--c-card)] px-5 py-5 md:px-6 md:py-6"
        style={{ backgroundImage: "linear-gradient(180deg,#fff7f4 0%,#ffffff 55%)" }}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* HERO , the lightest rent, the one terracotta figure */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--terra-text)]"><AtlasMark id="best" size={15} />Rent runs lightest</div>
            <div className="mt-1 flex items-end gap-3.5">
              <Fig className="text-[60px] leading-none text-[var(--terra-text)] md:text-[76px]">x{rentShown.toFixed(2)}</Fig>
              <div className="pb-1.5">
                <div className="text-[19px] font-semibold leading-tight text-[var(--c-ink)] md:text-[22px]">{best.name}</div>
                <div className="text-[11px] text-[var(--c-muted)]">rent, x the city level<InfoTip gloss="x1.00 is the city-average rent for a comparable unit; below it a lease runs lighter, above it heavier." /></div>
              </div>
            </div>
            {/* seed note first; the fallback derives from the data itself (the lightest
                district's real rent multiple). Nothing renders without either. */}
            {heroNote ? (
              <p className="mt-2.5 max-w-md text-[12.5px] leading-snug text-[var(--c-ink2)]">{heroNote}</p>
            ) : null}
          </div>

          {/* SUPPORT , the heaviest-lease district, a small neutral stat, not a co-hero */}
          <div className="shrink-0 rounded-[12px] border border-[var(--c-border)] bg-[var(--c-soft)] px-4 py-3 sm:w-[200px]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{d.meta?.support_label ?? "Heaviest rent"}</div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <Fig className="text-[22px] leading-none text-[var(--c-ink)]">x{heavy.rent_mult.toFixed(2)}</Fig>
              <span className="text-[12.5px] font-semibold text-[var(--c-ink)]">{heavy.name}</span>
            </div>
            {d.meta?.support_note ? (
              <p className="mt-1.5 text-[11px] leading-snug text-[var(--c-muted)]">{d.meta.support_note}</p>
            ) : (
              <p className="mt-1.5 text-[11px] leading-snug text-[var(--c-muted)]">
                The heaviest lease of the <Fig className="text-[var(--c-ink2)]">{districts.length}</Fig> districts, against a city level of x1.00.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
