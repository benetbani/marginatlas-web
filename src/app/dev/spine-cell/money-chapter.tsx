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
import { Box, Rail, Fig, InlineDisclosure, TERRA, TRACK, usd } from "@/components/spine/kit";
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

/* short display names for the waterfall's cost steps (7 columns need tight labels) */
const SHORT_COST: Record<string, string> = {
  "Food & drink cost": "Food",
  "Rent & rates": "Rent",
  "Other running costs": "Other",
};

/* SteppedWaterfall , the money identity DRAWN (Visual Dictionary idiom #12, max 1/page):
 * each $100 of sales spent left to right, every decrement a labeled floating drop with
 * connector rules at the running level, the final kept bar terracotta (the one accent).
 * Pure SVG, zero baseline drawn, values in Space Grotesk. */
function SteppedWaterfall({ costs, keep }: { costs: Array<{ name: string; pct: number }>; keep: number }) {
  const cols = costs.length + 2; // sales + decrements + keep
  const W = 480, H = 168, padL = 8, padR = 8, chartTop = 18, axisY = 128;
  const slot = (W - padL - padR) / cols;
  const bw = slot * 0.6;
  const bx = (i: number) => padL + i * slot + (slot - bw) / 2;
  const Y = (v: number) => chartTop + (1 - v / 100) * (axisY - chartTop);
  let level = 100;
  const steps = costs.map((c) => { const from = level; level -= c.pct; return { ...c, from, to: level }; });
  const grotesk = { fontFamily: "var(--font-grotesk)", fontWeight: 600 } as const;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
      aria-label={`Each $100 of sales: ${costs.map((c) => `${c.name} takes $${c.pct}`).join(", ")}; the owner keeps $${keep}`}>
      {/* start: the full $100 of sales */}
      <rect x={bx(0)} y={Y(100)} width={bw} height={Y(0) - Y(100)} rx={2} fill="#e7e5e3" />
      <text x={bx(0) + bw / 2} y={Y(100) - 6} textAnchor="middle" fontSize={10.5} fill="#1b1b1a" style={grotesk}>$100</text>
      <text x={bx(0) + bw / 2} y={axisY + 13} textAnchor="middle" fontSize={9} fill="#8c8c8a">Sales</text>
      {/* the decrements, size-ordered, each a floating drop from the running level */}
      {steps.map((s, i) => (
        <g key={s.name}>
          {/* connector at the level where the previous column ended */}
          <line x1={bx(i) + bw} y1={Y(s.from)} x2={bx(i + 1) + bw} y2={Y(s.from)} stroke="#d8d4d1" strokeWidth={1} strokeDasharray="2 2" />
          <rect x={bx(i + 1)} y={Y(s.from)} width={bw} height={Math.max(1, Y(s.to) - Y(s.from))} rx={2} fill="#c1c1bf" />
          <text x={bx(i + 1) + bw / 2} y={Y(s.from) - 6} textAnchor="middle" fontSize={10} fill="#1b1b1a" style={grotesk}>-{s.pct}</text>
          <text x={bx(i + 1) + bw / 2} y={axisY + 13} textAnchor="middle" fontSize={9} fill="#8c8c8a">{SHORT_COST[s.name] ?? s.name}</text>
        </g>
      ))}
      {/* the kept slice: what is left, from the zero baseline, terracotta */}
      <line x1={bx(steps.length) + bw} y1={Y(keep)} x2={bx(steps.length + 1) + bw} y2={Y(keep)} stroke="#d8d4d1" strokeWidth={1} strokeDasharray="2 2" />
      <rect x={bx(steps.length + 1)} y={Y(keep)} width={bw} height={Math.max(1.5, Y(0) - Y(keep))} rx={2} fill={TERRA} />
      <text x={bx(steps.length + 1) + bw / 2} y={Y(keep) - 6} textAnchor="middle" fontSize={10.5} fill="#c2410c" style={grotesk}>${keep}</text>
      <text x={bx(steps.length + 1) + bw / 2} y={axisY + 13} textAnchor="middle" fontSize={9} fill="#8c8c8a">Keeps</text>
      {/* the zero baseline, drawn */}
      <line x1={padL} y1={Y(0)} x2={W - padR} y2={Y(0)} stroke="#c9c9c7" strokeWidth={1} />
    </svg>
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
        <Rail icon="owner-keeps" kicker="What the owner keeps" verdict={d.owner?.surface_line} />
        <FormatTag />
      </div>
      {costs.length ? <SteppedWaterfall costs={costs} keep={keepPct} /> : null}
      <div className="mt-1 text-[11px] text-[var(--c-muted)]">Each $100 of sales, spent left to right; the last bar is what the owner keeps.</div>
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

/* BreakEven , WI-3/4 brief:
 * decision: how full the room must be to clear costs. Number: break-even covers vs the typical day (real headroom).
 * focal: the covers-a-day figure; a single length bar reads break-even as a FRACTION of actual typical covers.
 * width: rail half. terracotta target: the break-even fill on the real-covers track.
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
  const pct = Math.max(4, Math.min(100, (covers / typical) * 100));
  return (
    <Box className="md:flex-[2]">
      <div className="flex items-center justify-between gap-2">
        <Rail icon="break-even" kicker="When it clears costs" verdict={b.surface_line} />
        <FormatTag />
      </div>
      <div className="flex items-baseline gap-2">
        <CountFig value={covers} fmt={(n) => Math.round(n)} className="text-3xl leading-none text-[var(--c-ink)]" />
        <span className="text-[13px] text-[var(--c-ink2)]">covers a day to break even</span>
      </div>
      {/* real headroom: break-even covers as a share of the typical day's covers */}
      <div className="mt-3">
        <div className="relative h-8 overflow-hidden rounded-lg border border-[var(--c-border)]" style={{ background: TRACK }} role="img" aria-label={`Break-even at ${Math.round(covers)} of about ${typical} typical daily covers`}>
          <div className="h-full rounded-l-lg" style={{ width: `${pct}%`, background: TERRA }} />
          <span className="absolute inset-y-0 left-2 flex items-center text-[11px] font-semibold text-white">{Math.round(covers)} covers</span>
          <span className="absolute inset-y-0 right-2 flex items-center text-[11px] font-medium text-[var(--c-ink2)]">{typical} typical</span>
        </div>
        {/* the interpretation ADDS the headroom (the gap), never a third restatement of the fraction */}
        <div className="mt-1.5 text-[11px] text-[var(--c-muted)]">That leaves about <Fig className="text-[var(--c-ink2)]">{Math.max(0, Math.round(typical - covers))}</Fig> covers of headroom on a typical day.</div>
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
        <Rail icon="startup-cost" kicker="What it costs to open one" />
        <FormatTag />
      </div>
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
        <CountFig value={total} fmt={(n) => money(n)} className="text-2xl text-[var(--c-ink)]" />
        <span className="text-[13px] text-[var(--c-ink2)]">to open the doors{paybackMonths != null ? <>, repaid in about <Fig className="text-[var(--terra-text)]">{paybackLabel(paybackMonths)}</Fig> of the owner&rsquo;s typical take</> : null}.</span>
      </div>
      {/* the three big lines, visible: lollipops on a shared zero-based track */}
      <div className="space-y-2">
        {topItems.map((it) => {
          const v = Math.round(it.usd * scale);
          const p = Math.max(3, (v / maxItem) * 100);
          return (
            <div key={it.name} className="grid grid-cols-[110px_1fr_52px] items-center gap-3">
              <span className="min-w-0 truncate text-[12px] text-[var(--c-ink2)]">{it.name}</span>
              <span className="relative block h-4" role="img" aria-label={`${it.name} about ${money(v)}`}>
                <span aria-hidden className="absolute top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full" style={{ background: TRACK }} />
                <span aria-hidden className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full" style={{ width: `${p}%`, background: "#9a9a98" }} />
                <span aria-hidden className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${p}%`, background: "#1b1b1a", boxShadow: "0 0 0 1px #e3e3e3" }} />
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
