"use client";
/**
 * WhereToTrade , the city page's SIGNATURE moment. The old split (district
 * conveyor, then a chapter-weight Movement, then a separate map) is merged into
 * ONE coordinated pairing: a tall real MapLibre map beside a ranked district
 * list, cross-linked on hover. The list ranks by the honest KEEP INDEX (what the
 * owner keeps of each pound), not by raw revenue , so the loud names slide and a
 * few quieter districts climb. That re-rank is the whole editorial point.
 *
 * WI-3 brief:
 * decision: where to trade, judged by what you keep, not what comes in.
 * number: each district's keep index vs the city baseline of 100 (a divergent bar).
 * focal: the map + the #1-keep district; terracotta on the leading keep bar only.
 * width: Full. Encoding: map = position (orientation); list = length (magnitude).
 * disclosure: the district x trade owner-keep matrix behind a Pro veil.
 */
import * as React from "react";
import { Box, Rail, Fig, InlineDisclosure, TERRA } from "@/components/spine/kit";
import { LockVeil } from "@/components/spine/kit-index";
import { SpineMap, type SpinePoint } from "@/components/spine/SpineMap";

type District = { name: string; slug: string; character: string; rev_vs_city_pct: number; rent_mult: number; lat: number; lng: number };
type Row = District & { keep: number };

/* keep index = (1 + rev/100) / rent_mult x 100. Derived, not fabricated: the same
 * formula the neighborhood page uses. 100 = keeps the city-average share of a pound. */
function keepIndex(d: District): number {
  return Math.round(((1 + d.rev_vs_city_pct / 100) / d.rent_mult) * 100);
}

export function WhereToTrade({ d, trades }: { d: any; trades: any[] }) {
  const w = d.where_to_trade ?? {};
  const list: District[] = w.list ?? [];
  const rows: Row[] = list.map((x) => ({ ...x, keep: keepIndex(x) })).sort((a, b) => b.keep - a.keep);
  const lead = rows[0];
  const revLeader = list.reduce((a, b) => (b.rev_vs_city_pct > a.rev_vs_city_pct ? b : a), list[0]);
  const [hover, setHover] = React.useState<string | null>(null);

  // bar geometry: length encodes the keep index on a 0..100 track, so the leader is
  // the LONGEST bar (not the shortest). The city baseline (100) sits at the right edge
  // as a reference tick, and every inner district visibly falls short of it , the
  // honest read that all these premium districts keep below the city average.
  const AXIS = 100;

  // map points: FIXED size (orientation, not magnitude , magnitude lives in the list bars),
  // the keep index shown in the hover popup so the map still carries the decision figure.
  const points: SpinePoint[] = list
    .filter((x) => Number.isFinite(x.lat) && Number.isFinite(x.lng))
    .map((x) => ({
      name: x.name, slug: x.slug, lat: x.lat, lng: x.lng,
      signal: 50, signalLabel: `keeps ${keepIndex(x)} vs 100`, sub: x.character,
      href: "/dev/spine-hood",
    }));

  return (
    <Box className="citytop">
      <Rail icon="best-areas" tone="terra" kicker="Where to trade" verdict={w.read} />
      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr] lg:items-stretch">
        {/* the map , the highest-craft object, given real height */}
        <div className="min-w-0">
          <SpineMap points={points} ariaLabel="Map of London districts" fitPadding={56} />
        </div>
        {/* the ranked list , by keep index, divergent from the 100 baseline */}
        <div className="min-w-0">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Ranked by what you keep</span>
            <span className="text-[10.5px] text-[var(--c-muted)]">index, city = 100</span>
          </div>
          <div className="space-y-1">
            {rows.map((r, i) => {
              const mag = (r.keep / AXIS) * 100; // length = keep, leader longest
              const on = hover === r.slug;
              const isLead = i === 0;
              return (
                <a
                  key={r.slug}
                  href="/dev/spine-hood"
                  onMouseEnter={() => setHover(r.slug)}
                  onMouseLeave={() => setHover(null)}
                  className="hov -mx-2 block rounded-md px-2 py-1.5 transition-colors"
                  style={on ? { background: "var(--c-soft)" } : undefined}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className={`min-w-0 truncate text-[12.5px] ${isLead ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink)]"}`}>{r.name}</span>
                    <Fig className={`shrink-0 text-[12.5px] ${isLead ? "font-bold text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{r.keep}</Fig>
                  </div>
                  {/* length encodes the keep index; the city baseline (100) is the right-edge tick */}
                  <div className="relative mt-1 h-2 overflow-hidden rounded-full" role="img" aria-label={`${r.name}: keep index ${r.keep} of a city baseline of 100`} style={{ background: "#efece9" }}>
                    <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${mag}%`, background: isLead ? TERRA : "#c8c8c6" }} />
                    <span className="absolute inset-y-0 right-0 w-px bg-[var(--c-line-strong)]" title="city average = 100" />
                  </div>
                  <div className="mt-0.5 text-[10.5px] text-[var(--c-muted)]">
                    <span className="truncate">{r.character}</span>
                  </div>
                </a>
              );
            })}
          </div>
          {/* revenue-vs-city deltas moved off every row into one quiet disclosure:
              the list reads on keep alone, the revenue counterpoint is one tap away. */}
          <InlineDisclosure name="wtt-rev" summary="See revenue against the city" className="group mt-2 border-t border-[var(--c-border)] pt-2">
            <div className="mt-2 divide-y divide-[var(--c-border)]">
              {rows.map((r) => (
                <div key={r.slug} className="flex items-baseline justify-between gap-3 py-1.5">
                  <span className="min-w-0 truncate text-[11.5px] text-[var(--c-ink2)]">{r.name}</span>
                  <Fig className="shrink-0 text-[12px] text-[var(--c-ink)]">{r.rev_vs_city_pct >= 0 ? "+" : ""}{r.rev_vs_city_pct}%</Fig>
                </div>
              ))}
              <div className="pt-1.5 text-[10.5px] text-[var(--c-muted)]">Revenue against the city average. The loud names take the most, but rent takes it back.</div>
            </div>
          </InlineDisclosure>
        </div>
      </div>

      {/* the honest re-rank, stated plainly */}
      <p className="mt-3 border-t border-[var(--c-border)] pt-3 text-[12px] leading-snug text-[var(--c-ink2)]">
        <span className="font-semibold text-[var(--c-ink)]">{revLeader?.name}</span> takes the most revenue, but
        <span className="font-semibold text-[var(--c-ink)]"> {lead?.name}</span> keeps the most of it. {w.keep_note}
      </p>

      {/* Pro seam , the free tier gets the map + the keep re-rank; Pro unlocks the
          full district x trade owner-keep matrix. Real derived values, value-visible
          under a calm veil, kept in the DOM for crawlers. */}
      <div className="mt-4 border-t border-[var(--c-border)] pt-4">
        <LockVeil headline="Every district, every trade" note="See what the owner keeps for each trade in each district, ranked, with the rent load on every cell." cta="Unlock with Pro">
          <ProMatrix rows={rows} trades={trades} />
        </LockVeil>
      </div>
    </Box>
  );
}

/* district x trade owner-keep matrix behind the Pro veil. Each cell = the trade's
 * base net margin scaled by the district's keep index (derived, entity-scoped, %). */
function ProMatrix({ rows, trades }: { rows: Row[]; trades: any[] }) {
  const cols = trades.slice(0, 4);
  const grid = `minmax(0,1.1fr) repeat(${cols.length},minmax(0,1fr))`;
  const cell = (baseMargin: number, keep: number) => Math.round(baseMargin * (keep / 100));
  return (
    // min-height guard: the LockVeil's centered overlay card runs ~190px, and the
    // veil clips anything taller than its children , the matrix must always contain it.
    <div className="min-h-[220px]">
      <div className="grid items-end gap-2 border-b border-[var(--c-border)] pb-1.5" style={{ gridTemplateColumns: grid }}>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">District</span>
        {cols.map((t) => <span key={t.slug} className="truncate text-right text-[11px] font-semibold text-[var(--c-ink)]">{t.name}</span>)}
      </div>
      <div className="divide-y divide-[var(--c-border)]">
        {rows.slice(0, 6).map((r) => (
          <div key={r.slug} className="grid items-center gap-2 py-1.5" style={{ gridTemplateColumns: grid }}>
            <span className="min-w-0 truncate text-[11px] text-[var(--c-ink2)]">{r.name}</span>
            {cols.map((t) => <Fig key={t.slug} className="text-right text-[12px] text-[var(--c-ink)]">{cell(t.net_margin_pct, r.keep)}%</Fig>)}
          </div>
        ))}
      </div>
      <div className="mt-1.5 text-[10.5px] text-[var(--c-muted)]">Owner-keep %, trade margin adjusted for each district's rent load.</div>
    </div>
  );
}
