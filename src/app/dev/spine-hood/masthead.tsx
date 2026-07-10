"use client";
/**
 * Neighborhood-hub MASTHEAD , the answer-first, two-figure honest headline. NOT a
 * 4-cell equal scorecard: the page's thesis is "revenue is the liar, keep is the
 * truth", so the masthead leads with the district that KEEPS the most (the hero,
 * terracotta, largest figure on the page) set in tension against the loud one that
 * TAKES the most (grey support). District count is a caption, not a hero cell.
 * Count-up-safe: the hero keep figure rests at its real value and only animates on
 * mount (above the fold), reduced-motion safe. Prose comes from the seed / derived.
 */
import * as React from "react";
import { CountryFlag } from "@/components/CountryFlag";
import { Fig, InfoTip } from "@/components/spine/kit";
import { keepIndex } from "@/components/spine/keep";
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

type District = { name: string; slug?: string; rev_vs_city_pct: number; rent_mult: number };

export function HoodMasthead({ d }: { d: any }) {
  const reduced = usePrefersReducedMotion();
  const districts: District[] = d.districts ?? [];
  const byRev = [...districts].sort((a, b) => b.rev_vs_city_pct - a.rev_vs_city_pct);
  const byKeep = [...districts].sort((a, b) => keepIndex(b) - keepIndex(a));
  const loud = byRev[0];
  const best = byKeep[0];
  // defensive: keepIndex(undefined) throws (it reads d.rev_vs_city_pct straight off
  // its argument), and the masthead's whole thesis, "keeps the most" vs "the loud
  // one", needs two distinct districts to contrast. Guard the crash here with a
  // safe fallback, then degrade to nothing below, once every hook has run (rules
  // of hooks: the early return must follow every hook call, never sit between two).
  const bestKeep = best ? keepIndex(best) : 0;
  const loudKeep = loud ? keepIndex(loud) : 0;
  const keepShown = Math.round(useCountUp(bestKeep, reduced));
  const heroNote =
    d.meta?.hero_note ??
    (best?.rent_mult != null
      ? `Rent here runs x${best.rent_mult.toFixed(2)} the city rate, light enough that more of each pound stays.` +
        (best.slug !== loud?.slug ? " It is not the loudest name in the city." : "")
      : null);

  // degrade rather than throw if the caller gate ever loosens and fewer than two
  // districts reach the masthead (it needs a keeper AND a loud one to contrast).
  if (districts.length < 2 || !best || !loud) return null;

  return (
    <section className="py-6 md:py-8">
      {/* upward navigation , wired to the city page (dev route until promotion). */}
      <a href={d.meta?.city_href ?? "/dev/spine-city"} className="mb-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--c-border)] bg-white/70 px-3 py-1 text-xs font-semibold text-[var(--c-ink2)] transition hover:border-[var(--terra-border)] hover:text-[var(--terra-text)]">&#8592; Back to {d.meta?.city}</a>
      <div className="flex items-center gap-3.5">
        <CountryFlag iso2={d.meta?.iso2?.toLowerCase()} className="w-[36px] rounded-sm shadow-sm" />
        <h1 data-typography="custom" className="text-3xl font-bold tracking-tight text-[var(--c-ink)] md:text-4xl">{d.meta?.city} neighborhoods</h1>
        {/* wayfinding: this page reads at district level (calm, muted) */}
        <AtlasMark id="alt-district" size={16} className="opacity-60" />
      </div>
      <p className="mt-2 max-w-2xl text-[13.5px] leading-snug text-[var(--c-ink2)]">
        Money moves street to street: each district ranked by what an owner keeps after rent, not by takings, against a city baseline of 100; across <Fig className="text-[var(--c-ink)]">{districts.length}</Fig> districts the two orders are nearly opposite.
      </p>

      {/* ONE dominant hero: the district that keeps the most (terracotta, the single
          largest figure on the page). The loud, highest-revenue district is demoted to
          a small neutral supporting stat inside the same card, not a co-equal cell. */}
      <div className="mt-5 rounded-[14px] border border-[var(--terra-border)] bg-[var(--c-card)] px-5 py-5 md:px-6 md:py-6"
        style={{ backgroundImage: "linear-gradient(180deg,#fff7f4 0%,#ffffff 55%)" }}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* HERO , best keep, the one terracotta figure */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--terra-text)]"><AtlasMark id="best" size={15} />Keeps the most</div>
            <div className="mt-1 flex items-end gap-3.5">
              <Fig className="text-[60px] leading-none text-[var(--terra-text)] md:text-[76px]">{keepShown}</Fig>
              <div className="pb-1.5">
                <div className="text-[19px] font-bold leading-tight text-[var(--c-ink)] md:text-[22px]">{best.name}</div>
                <div className="text-[11px] text-[var(--c-muted)]">keep index, city baseline 100<InfoTip gloss="100 keeps the same share of each pound as the city average; revenue lift divided by rent load." /></div>
              </div>
            </div>
            {/* seed note first; the fallback derives from the data itself (the best
                keeper's real rent multiple), and the loudest-name contrast only appends
                when the keeper is not itself the loudest. Nothing renders without either. */}
            {heroNote ? (
              <p className="mt-2.5 max-w-md text-[12.5px] leading-snug text-[var(--c-ink2)]">{heroNote}</p>
            ) : null}
          </div>

          {/* SUPPORT , the highest-revenue district, a small neutral stat, not a co-hero */}
          <div className="shrink-0 rounded-[12px] border border-[var(--c-border)] bg-[var(--c-soft)] px-4 py-3 sm:w-[200px]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{d.meta?.support_label ?? "Top takings, heaviest lease"}</div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <Fig className="text-[22px] leading-none text-[var(--c-ink)]">+{loud.rev_vs_city_pct}%</Fig>
              <span className="text-[12.5px] font-semibold text-[var(--c-ink)]">{loud.name}</span>
            </div>
            {d.meta?.support_note ? (
              <p className="mt-1.5 text-[11px] leading-snug text-[var(--c-muted)]">{d.meta.support_note}</p>
            ) : (
              <p className="mt-1.5 text-[11px] leading-snug text-[var(--c-muted)]">
                Highest revenue in the city, yet a keep index of <Fig className="text-[var(--c-ink2)]">{loudKeep}</Fig> sits below the city baseline of 100.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
