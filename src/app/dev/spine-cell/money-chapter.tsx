"use client";
/**
 * The money chapter , the client half that reads the FormatContext so the chosen
 * subtype PROPAGATES: owner-keeps, the gross-to-net waterfall, cost-to-open and the
 * break-even headroom all re-read for the format the reader actually means. Focal
 * figures count up once on scroll-in (reduced-motion safe). Terracotta is rationed
 * to exactly one element per Box (the kept slice / the hero figure).
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
import { Box, Head, Rail, Fig, Waterfall, InlineDisclosure, TERRA, TRACK } from "@/components/spine/kit";
import { useFormat, useCountUp, useInView } from "./format-picker";

const money = (v: number) => (v >= 1e6 ? "$" + (v / 1e6).toFixed(1) + "M" : "$" + Math.round(v / 1000) + "K");
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

/* OwnerKeeps , WI-3/4 brief:
 * decision: how much of turnover actually reaches the owner. Number: take-home (subtype-propagated).
 * focal: the take-home figure (counts up); gross-to-net waterfall shows what eats it.
 * width: WideRail chart half. terracotta target: the kept (net) waterfall slice + the take-home figure.
 * disclosure: the three cost drivers behind one InlineDisclosure. */
export function OwnerKeeps({ d }: { d: any }) {
  const ctx = useFormat();
  const m = d.margins ?? {};
  const keepPct = ctx ? ctx.sel.keeps_pct : m.net_pct;
  const take = ctx ? ctx.sel.take_home_usd : (d.owner?.take_home_usd ?? 0);
  // waterfall reads real measured shares; only the net slice moves with the subtype.
  // Terracotta discipline: the hero take-home figure is the ONE terracotta mark in this
  // Box, so the waterfall's kept slice stays neutral (same "kept" meaning, not double-marked).
  const rows: Array<[string, number, boolean?]> = [
    ["Gross margin", m.gross_pct],
    ["Operating margin", m.operating_pct],
    ["Owner keeps (net)", keepPct, false],
  ];
  const drivers: any[] = d.cost_drivers ?? [];
  return (
    <Box className="md:flex-[3]">
      <div className="flex items-center justify-between gap-2">
        <Head icon="owner-keeps">What the owner keeps</Head>
        <FormatTag />
      </div>
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3">
        <CountFig value={take} fmt={(n) => money(n)} className="text-3xl text-[var(--terra-text)]" />
        <span className="text-sm text-[var(--c-ink2)]">a year, about <Fig className="text-[var(--c-ink)]">{keepPct}%</Fig> of sales.</span>
      </div>
      <Waterfall rows={rows} />
      <InlineDisclosure name="ownerkeeps" summary="What moves the margin">
        <div className="mt-2 divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
          {drivers.map((c) => (
            <div key={c.name} className="grid grid-cols-[130px_1fr] items-baseline gap-3 py-2">
              <span className="text-[12px] font-medium text-[var(--c-ink)]">{c.name} <Fig className="text-[var(--c-muted)]">{c.pct_of_sales}c/$1</Fig></span>
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
        <CountFig value={covers} fmt={(n) => Math.round(n)} className="text-[38px] leading-none text-[var(--c-ink)]" />
        <span className="text-[13px] text-[var(--c-ink2)]">covers a day to break even</span>
      </div>
      {/* real headroom: break-even covers as a share of the typical day's covers */}
      <div className="mt-3">
        <div className="relative h-8 overflow-hidden rounded-lg border border-[var(--c-border)]" style={{ background: TRACK }} role="img" aria-label={`Break-even at ${Math.round(covers)} of about ${typical} typical daily covers`}>
          <div className="h-full rounded-l-lg" style={{ width: `${pct}%`, background: TERRA }} />
          <span className="absolute inset-y-0 left-2 flex items-center text-[11px] font-semibold text-white">{Math.round(covers)} covers</span>
          <span className="absolute inset-y-0 right-2 flex items-center text-[11px] font-medium text-[var(--c-ink2)]">{typical} typical</span>
        </div>
        <div className="mt-1.5 text-[11px] text-[var(--c-muted)]">Break-even fills <Fig className="text-[var(--c-ink2)]">{Math.round(pct)}%</Fig> of a typical day.</div>
      </div>
    </Box>
  );
}

/* CostToOpen , WI-4 brief:
 * decision: the up-front cash to open. Number: total to open (subtype-propagated) + payback.
 * focal: the total figure (counts up). width: Full. terracotta target: the payback figure only.
 * disclosure: the line-item cost stack behind one InlineDisclosure. */
export function CostToOpen({ d }: { d: any }) {
  const ctx = useFormat();
  const items: any[] = d.setup?.items ?? [];
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
  return (
    <Box className="md:flex-[3]">
      <div className="flex items-center justify-between gap-2">
        <Head icon="startup-cost">What it costs to open one</Head>
        <FormatTag />
      </div>
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
        <CountFig value={total} fmt={(n) => money(n)} className="text-3xl text-[var(--c-ink)]" />
        <span className="text-[13px] text-[var(--c-ink2)]">to open the doors{paybackMonths != null ? <>, paying back in about <Fig className="text-[var(--terra-text)]">{paybackLabel(paybackMonths)}</Fig></> : null}.</span>
      </div>
      <InlineDisclosure name="costopen" summary="See the line-item stack">
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
