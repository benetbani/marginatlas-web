"use client";
/**
 * The money chapter , the client half that reads the FormatContext so the chosen
 * subtype PROPAGATES: the owner-keeps stepped waterfall (derived from the $100 split,
 * always closing to 100), cost-to-open lollipops + derived payback, and the break-even
 * headroom all re-read for the format the reader actually means. Focal figures count
 * up once on scroll-in (reduced-motion safe). Terracotta is rationed to exactly one
 * element per Box (the kept step / the payback figure / the break-even fill). The
 * owner's $ take appears at hero scale in the masthead + control-room trio ONLY ,
 * this file never restates it big (Final Ascent dedup).
 *
 * PROPAGATION IS TOTAL: every figure a format switch touches either recomputes from
 * the picked subtype (break-even numerator AND denominator, payback = capex / take)
 * or is format-neutral prose the seed keeps number-free (break_even.surface_line).
 * The signature interaction must never render side-by-side contradictions.
 *
 * All prose comes from the seed (owner.surface_line, break_even.surface_line),
 * so scaled cells read specific, not templated.
 */
import * as React from "react";
import { Box, Rail, Fig, InfoTip, InlineDisclosure, TERRA, TRACK, usd } from "@/components/spine/kit";
import { AtlasWaterfall } from "@/components/kit/charts/AtlasWaterfall";
import { useFormat, useCountUp, useInView } from "./format-picker";

const money = usd; // ONE money grammar page-set-wide (kit usd: $43K / $1.4M)
function useReduced() {
  const [r, setR] = React.useState(false);
  React.useEffect(() => { const mq = window.matchMedia("(prefers-reduced-motion: reduce)"); setR(mq.matches); }, []);
  return r;
}

/* a focal figure that counts up the first time it scrolls into view */
function CountFig({ value, fmt, className }: { value: number; fmt: (n: number) => React.ReactNode; className?: string }) {
  const reduced = useReduced();
  const { ref, seen } = useInView<HTMLSpanElement>();
  // rest at the real value; animate up only once it scrolls into view (never render 0)
  const v = useCountUp(value, reduced, 520, seen);
  return <span ref={ref} className={`fig ${className ?? ""}`}>{fmt(v)}</span>;
}

/* a small "reflecting: Fast casual" tag so the propagation is legible */
function FormatTag() {
  const ctx = useFormat();
  if (!ctx) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--c-border)] bg-[var(--c-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--c-ink2)]">
      {ctx.sel.name}
    </span>
  );
}

/* OwnerKeeps , WI-3/4 brief (merged, Final Ascent):
 * decision: how much of turnover actually reaches the owner. The headline $ figure is
 * REMOVED (it lives once at hero scale in the masthead and once in the control-room trio);
 * this card's unique content is the PATH, a true stepped gross-to-net waterfall derived
 * from the $100 split (the one margin source, so the numbers always close to 100).
 * Format propagation: the kept slice follows the picker; the cost steps re-scale
 * proportionally to close the identity (same contract as CostToOpen's line items).
 * width: WideRail chart half. terracotta target: the kept step only.
 * disclosure: the cost-driver notes (names + mechanisms, figures live in the chart). */
export function OwnerKeeps({ d }: { d: any }) {
  const ctx = useFormat();
  const items: any[] = d.money_split?.items ?? [];
  // The card's unique content is the gross-to-net waterfall drawn from the $100
  // split. With no honest split there is nothing to draw, so omit the whole card
  // rather than render an empty shell.
  if (items.length === 0) return null;
  const baseKeep = items.find((it) => it.kept)?.pct ?? d.margins?.net_pct ?? 0;
  const keepPct = ctx ? ctx.sel.keeps_pct : baseKeep;
  // re-scale the non-kept slices so steps + keep always sum to exactly 100
  // (largest-remainder rounding; at the blended default the seed integers pass through).
  const nonKept = items.filter((it) => !it.kept);
  const restSum = nonKept.reduce((a, it) => a + it.pct, 0) || 1;
  const target = 100 - keepPct;
  const exact = nonKept.map((it) => ({ name: it.name, raw: (it.pct * target) / restSum }));
  const floored = exact.map((e) => ({ name: e.name, pct: Math.floor(e.raw), frac: e.raw - Math.floor(e.raw) }));
  let remainder = target - floored.reduce((a, e) => a + e.pct, 0);
  const byFrac = [...floored].sort((a, b) => b.frac - a.frac);
  for (let i = 0; i < byFrac.length && remainder > 0; i++, remainder--) byFrac[i].pct += 1;
  const costs = floored.map(({ name, pct }) => ({ name, pct })).sort((a, b) => b.pct - a.pct);
  const drivers: any[] = d.cost_drivers ?? [];
  return (
    <Box className="md:flex-[3]">
      <div className="flex items-start justify-between gap-2">
        <Rail icon="owner-keeps" kicker="What the owner keeps" sample />
        <FormatTag />
      </div>
      {/* THE MONEY IDENTITY, on the chart library rather than hand cut SVG.
          The drawing it replaced scaled its own TEXT with its box, so the same
          labels were unreadable on a phone and oversized in a wide band. This
          one holds a real size at every width, wraps a long cost name onto a
          second line instead of running it into its neighbour, and renders
          NOTHING at all if the split does not close to the opening figure. */}
      <AtlasWaterfall
        start={{ label: "Sales", value: 100 }}
        steps={costs.map((c) => ({ label: c.name, value: c.pct }))}
        end={{ label: "Keeps", value: keepPct }}
        prefix="$"
        height={190}
      />
      <InlineDisclosure name="ownerkeeps" summary="What moves the margin">
        <div className="mt-2 divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
          {drivers.map((c) => (
            <div key={c.name} className="grid grid-cols-[130px_1fr] items-baseline gap-3 py-2">
              <span className="text-[12px] font-medium text-[var(--c-ink)]">{c.name}</span>
              <span className="text-[11.5px] leading-snug text-[var(--c-ink2)]">{c.note}</span>
            </div>
          ))}
        </div>
      </InlineDisclosure>
    </Box>
  );
}

/* BreakEven , WI-3/4 brief (rulebook v1 sections 25/26, 2026-07-11: the headroom
 * fill bar is gone; a lone number may stay a number, and the page's bar budget is
 * spent elsewhere):
 * decision: how full the room must be to clear costs. Number: break-even covers vs the typical day (real headroom).
 * focal: the covers-a-day figure; the headroom reads as figures in words below it.
 * width: rail half. terracotta target: none (the break-even figure is the read).
 * No invented ceiling: both numbers are measured (subtype break-even + typical daily covers). */
export function BreakEven({ d }: { d: any }) {
  const ctx = useFormat();
  const b = d.break_even ?? {};
  // TOTAL propagation: BOTH the break-even numerator and the typical-day denominator
  // follow the picked format (seed subtypes carry typical_covers_per_day per format).
  // The verdict line is format-neutral BY DESIGN (the seed bakes no numbers into it),
  // so the picker can never render a contradicting sentence here.
  const covers = ctx ? ctx.sel.break_even_covers_per_day : (b.covers_per_day ?? 0);
  const typical = (ctx ? ctx.sel.typical_covers_per_day : b.typical_covers_per_day) ?? Math.max(covers, 1);
  /* BOTH MARKERS ARE POSITIONED FROM THE SAME DOMAIN, and the typical-day tick is
     no longer pinned to the right edge.

     WHY, measured rather than felt. The domain is the larger of the two numbers,
     so when break-even sits ABOVE a typical day, which is exactly what an
     unprofitable trade looks like and which the copy one file over already
     branches on, the right edge became the BREAK-EVEN value while the tick
     sitting on it still read "a typical day". The picture then showed the
     typical-day mark to the RIGHT of the break-even dot: a comfortable cushion,
     drawn on the trades that have none. The two figure tiles directly below it
     said zero headroom and over a hundred percent of a typical day, so the
     section contradicted itself, and the drawing was the half a reader believes.

     The clamp is gone with it. It pushed the dot to 96% of the track, which made
     "you cannot break even on a typical day" look like "you are nearly there".
     Both markers are centred on their own value now, so at the extremes they
     hang half over the end of the track, which is what a value at the end of a
     scale should look like. */
  const domain = Math.max(typical, covers, 1);
  const bePct = (covers / domain) * 100;
  const typPct = (typical / domain) * 100;
  return (
    <Box className="md:flex-[2]">
      <div className="flex items-center justify-between gap-2">
        <Rail icon="break-even" kicker="When it clears costs" sample />
        <FormatTag />
      </div>
      <div className="flex items-baseline gap-2">
        <CountFig value={covers} fmt={(n) => Math.round(n)} className="text-3xl leading-none text-[var(--c-ink)]" />
        <span className="text-[13px] text-[var(--c-ink2)]">covers<InfoTip gloss="One cover is one customer served; a table of four is four covers." /> a day to break even</span>
      </div>
      {/* the headroom ON a visual, not in prose (rulebook 26/30): break-even
          (terracotta) sits partway along a full typical day (the ink tick at the
          track's end). The gap is the room you still have. Markers are positioned,
          never a fill bar. */}
      <div className="mt-4 border-t border-[var(--c-border)] pt-4">
        <div className="mb-2 flex items-baseline justify-between text-[length:var(--t-micro)] text-[var(--c-muted)]">
          <span className="inline-flex items-center gap-1.5"><span aria-hidden className="h-2 w-2 rounded-full" style={{ background: TERRA }} /><Fig className="text-[var(--terra-text)]">{Math.round(covers)}</Fig> to break even</span>
          <span className="inline-flex items-center gap-1.5"><Fig className="text-[var(--c-ink)]">{Math.round(typical)}</Fig> a typical day<span aria-hidden className="h-2.5 w-[2px] rounded-full" style={{ background: "var(--c-ink)" }} /></span>
        </div>
        <div className="relative h-1.5 rounded-full" role="img" aria-label={`Break-even at ${Math.round(covers)} covers, of about ${Math.round(typical)} on a typical day`} style={{ background: TRACK }}>
          <span aria-hidden className="absolute top-1/2 h-3 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: `${typPct}%`, background: "var(--c-ink)" }} />
          <span aria-hidden className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${bePct}%`, background: TERRA, boxShadow: "0 0 0 1px #e3e3e3" }} />
        </div>
      </div>
      {/* the headroom made explicit as figures, not a caption sentence (rulebook 26): the
          cushion of covers between break-even and a typical day, and how much of a typical
          day break-even already consumes. Both follow the picked format, and fill the rail
          to its neighbour's height (rulebook 17). No bar: plain figures (rule 26 corollary). */}
      <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--c-border)]" style={{ background: "var(--c-border)" }}>
        <div className="bg-[var(--c-card)] px-3.5 py-2.5">
          <Fig className="text-[length:var(--t-sub)] text-[var(--c-ink)]">{Math.max(0, Math.round(typical - covers))}</Fig>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">covers of headroom</div>
        </div>
        <div className="bg-[var(--c-card)] px-3.5 py-2.5">
          <Fig className="text-[length:var(--t-sub)] text-[var(--c-ink)]">{Math.round((covers / Math.max(typical, 1)) * 100)}%</Fig>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">of a typical day</div>
        </div>
      </div>
    </Box>
  );
}

/* CostToOpen , WI-4 brief (enriched, Final Ascent):
 * decision: the up-front cash to open. Number: total to open (subtype-propagated) + payback
 * with its basis NAMED (capex over the owner's yearly take). The top-3 line items are
 * VISIBLE as lollipops on a shared drawn track (idiom #5; a collapsed one-number card
 * wasted the half-band); the full stack sits behind the disclosure.
 * width: Even half. terracotta target: the payback figure only (lollipop dots stay ink). */
export function CostToOpen({ d }: { d: any }) {
  const ctx = useFormat();
  const items: any[] = d.setup?.items ?? [];
  if (items.length === 0) return null; // omitted when the cell holds no real setup costs
  const seedTotal = items.reduce((a, b) => a + (b.usd || 0), 0);
  const total = ctx ? ctx.sel.cost_to_open_usd : seedTotal;
  // scale the line items to the selected subtype's total so the stack stays honest to the headline
  const scale = seedTotal > 0 ? total / seedTotal : 1;
  // payback DERIVES from the picked format (identity in the seed: payback = capex / annual
  // owner take), so it can never contradict the picker: fast casual ~31 months, full service
  // ~55 months, fine dining ~102 months. No stored payback field is read.
  const take = ctx ? ctx.sel.take_home_usd : (d.owner?.take_home_usd ?? 0);
  const paybackMonths = take > 0 && total > 0 ? Math.round((total / take) * 12) : null;
  const paybackLabel = (mo: number) => {
    if (mo <= 36) return `${mo} months`;
    const y = Math.round((mo / 12) * 2) / 2; // nearest half year past 3 years
    return `${y} years`;
  };
  const ranked = [...items].sort((a, b) => (b.usd || 0) - (a.usd || 0));
  const topItems = ranked.slice(0, 3);
  const maxItem = Math.max(1, ...topItems.map((it) => it.usd * scale));
  return (
    <Box className="md:flex-[3]">
      <div className="flex items-start justify-between gap-2">
        {/* same section-opener treatment as the sibling money cards (Rail kicker, not a bold Head) */}
        <Rail icon="startup-cost" kicker="What it costs to open one" sample />
        <FormatTag />
      </div>
      {/* schematic, not a sentence: the total and the payback as two figure+label reads */}
      <div className="mb-3 flex flex-wrap items-end gap-x-6 gap-y-1">
        <div>
          {/* THE ACCENT SITS ON THE CARD'S OWN ANSWER. This card is called "What it
              costs to open one", and the cost to open was in plain ink while the
              payback figure beside it wore the accent. The support figure was
              carrying the mark that belongs to the answer, so the eye landed on the
              second-most-important number on the card. Rule 37. */}
          <CountFig value={total} fmt={(n) => money(n)} className="text-2xl text-[var(--terra-text)]" />
          <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">to open the doors</div>
        </div>
        {paybackMonths != null ? (
          <div>
            <Fig className="text-2xl text-[var(--c-ink)]">{paybackLabel(paybackMonths)}</Fig>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">to earn it back</div>
          </div>
        ) : null}
      </div>
      {/* the three big lines, visible: lollipops on a shared zero-based track */}
      <div className="space-y-2">
        {topItems.map((it) => {
          const v = Math.round(it.usd * scale);
          const p = Math.max(3, (v / maxItem) * 100);
          return (
            <div key={it.name} className="grid grid-cols-[110px_1fr_52px] items-center gap-3">
              <span className="min-w-0 truncate text-[12px] text-[var(--c-ink2)]">{it.name}</span>
              {/* THE STACK, ratified 2026-08-09 (option A of /dev/options/opening).
                  Was three lollipops: a dot on a rule, where the dot carried the
                  value and the length carried it a second time. His grammar is a
                  bar , lightest neutral behind, one fill, largest line in
                  terracotta and the rest on the neutral ramp, which is
                  emphasis-not-categorical. The dominant line here is the fit-out
                  at roughly four fifths of the total, and the point of the
                  drawing is that it dwarfs everything under it. */}
              {/* THESE BARS WERE NOT BEING DRAWN AT ALL, and no check could see it.
                  They asked for two greys that are declared ONLY inside the v2
                  stylesheet's scope, every selector of which sits under one class
                  with no root block anywhere in the file. This page never enters
                  that scope: the live spine tree does not carry that class on a
                  single element. An undefined custom property makes the whole
                  declaration invalid, and an invalid background computes to
                  transparent, so the track and the two smaller bars painted
                  NOTHING. Read out of a real browser: rgba(0, 0, 0, 0) for all
                  three. Only the largest bar survived, because terracotta is
                  declared again at the root by the shell.
                  So a visitor saw one orange bar floating in white space, on a
                  drawing whose entire point is that the fit-out dwarfs what sits
                  under it. There was nothing left to dwarf.
                  The neutral is the SAME VALUE the missing one held. The track
                  moves by a hair and now matches the break-even track on the
                  card beside it, which it never did. */}
              <span className="relative block h-4" role="img" aria-label={`${it.name} about ${money(v)}`}>
                <span aria-hidden className="absolute inset-y-0 w-full rounded-[2px]" style={{ background: TRACK }} />
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 rounded-[2px]"
                  /* THE LONGEST BAR IS NOT AN ANSWER, IT IS THE LONGEST BAR. Rule 37
                     gives the accent to answers only, and this card's answer is the
                     total above it, which now carries it. The largest cost line was
                     wearing it too, so the card had two accents and a reader's eye had
                     two places to land. The colour was also telling them nothing the
                     drawing did not already say: it is the longest bar on a shared
                     track, which is the whole encoding. */
                  style={{ width: `${p}%`, background: "var(--chart-4)" }}
                />
              </span>
              <Fig className="text-right text-[12.5px] text-[var(--c-ink)]">{money(v)}</Fig>
            </div>
          );
        })}
      </div>
      <InlineDisclosure name="costopen" summary="See the full line-item stack">
        <div className="mt-2 divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
          {items.map((it) => (
            <div key={it.name} className="flex items-center justify-between py-1.5">
              <span className="text-[12px] text-[var(--c-ink2)]">{it.name}</span>
              <Fig className="text-[12.5px] text-[var(--c-ink)]">{money(Math.round(it.usd * scale))}</Fig>
            </div>
          ))}
        </div>
      </InlineDisclosure>
    </Box>
  );
}
