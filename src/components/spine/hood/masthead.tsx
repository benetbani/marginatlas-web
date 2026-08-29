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
import { Fig, CARD_SURFACE } from "@/components/spine/kit";
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
      {/* A REAL MEASURE, NOT A REM CAP. This was max-w-2xl, a fixed 672px, and at
          13.5px that is 103 CHARACTERS PER LINE, measured: the widest text on any
          of the four pages, on the first sentence a reader meets here. A rem cap
          looks like restraint and is a width; ch is the measure. Rulebook v2 §17,
          and the width ratchet exists to migrate exactly this class.

          THE SENTENCE ALSO HAD FOUR CLAUSES AND AN APPOSITION IN THE MIDDLE. It
          defined rent load in passing, halfway through, against "a district with
          no premium", which is not what the page calls that baseline three inches
          below: the hero says "a comparable unit at the city rate". Same facts,
          same order, three short sentences, and the baseline is now named the way
          the rest of the page names it (§13). */}
      <p className="mt-2 max-w-[52ch] text-[13.5px] leading-snug text-[var(--c-ink2)]">
        Money moves street to street. Rent load is what a district&rsquo;s leases run against the city rate. All <Fig className="text-[var(--c-ink)]">{districts.length}</Fig> are ranked here, lightest first.
      </p>

      {/* THE HERO STATES THE ANSWER AND NOTHING THE STRIP ALREADY STATES.
          Founder, 2026-08-25: "you are repeating the front part."

          It used to carry a second panel holding the heaviest lease and the city
          baseline, and that panel's own comment said what it was for: it FILLED
          the right half so the card would not read as a lone stat beside a blank
          band. Filling a hole with figures a reader is about to meet again is
          padding, not composition. Measured: the strip 255px below opens on the
          lightest and closes on the heaviest, and its centre line is labelled
          CITY X1.00, so both support rows were the strip repeated early. They
          fail differentiation against it, which is §41's second ground, and they
          are the reason this card measured 59% ink.

          What is left is the answer, once, at full size, and the strip proves it.
          A hero states; the section below evidences. */}
      {/* AND THE CARD NOW TAKES THE WIDTH ITS CONTENT NEEDS.
          The note above is right that nothing should be invented to fill this
          space, and it left the card stretching the full 1072 with the answer in
          its left 45% and a blank band across the rest. Photographed at 1280:
          1072 by 121, and over half of it nothing. A hero is ALLOWED the full
          width. It is not obliged to take it, and taking it for one figure is the
          wide-for-no-reason emptiness the whole effort exists to remove.
          Shrink-to-fit rather than a chosen number, so the card is exactly as wide
          as the answer, the district name and the one line explaining the unit,
          at any width and in any place. The space then falls OUTSIDE the border,
          where an off-centre block reads as composition instead of as a hole. Same
          decision as the lone lean card in the band kit, same day, same reason. */}
      {/* id="head" , the section's constitutional id, declared in the SPINE table of
          design/blueprints/hood.md. The blueprint gate reads the ids out of the
          rendered page and fails when the page and the table disagree, so this
          attribute is the binding and not a convenience anchor. */}
      <div id="head" className="mt-5 rounded-[14px] border border-[var(--c-border)] px-5 py-5 md:w-fit md:px-6 md:py-6" style={CARD_SURFACE}>
        <h3 data-typography="custom" className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">Rent runs lightest</h3>
        <div className="mt-1.5 flex flex-wrap items-end gap-x-3.5 gap-y-1">
          <Fig className="text-[48px] leading-none text-[var(--terra-text)]">x{rentShown.toFixed(2)}</Fig>
          <div className="pb-1.5">
            <div className="text-[length:var(--t-sub)] font-semibold leading-tight text-[var(--c-ink)]">{best.name}</div>
            <div className="text-[length:var(--t-micro)] text-[var(--c-muted)]">rent, x the city level, against a comparable unit at the city rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}
