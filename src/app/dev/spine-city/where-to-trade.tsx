"use client";
/**
 * WhereToTrade , the city page's SIGNATURE moment. The old split (district
 * conveyor, then a chapter-weight Movement, then a separate map) is merged into
 * ONE coordinated pairing: a tall real MapLibre map beside a ranked district
 * list, cross-linked on hover. The list ranks by the honest KEEP INDEX (what the
 * owner keeps of each pound), not by raw revenue , so the loud names slide and a
 * few quieter districts climb. That re-rank is the whole editorial point.
 *
 * WI-3 brief (P2 refit , the audit's re-visual for the signature section):
 * decision: where to trade, judged by what you keep, not what comes in.
 * number: each district's keep index against a DRAWN city = 100 reference line.
 * form: a dot plot on one shared, drawn 50..110 domain , the old 0-based bars
 * compressed the 60..87 spread into the last third of the track and fused the
 * 100 baseline to the rounded track end. Dots spread the honest range; the
 * reference line at 100 is drawn on every row and labelled once on the axis.
 * focal: the map + the #1-keep district; terracotta on the leader's dot only.
 * map: ink pins, terra ONLY on the keep leader (8 fixed terra dots said nothing);
 * uniform pin size; label declutter priority follows keep rank (points passed in
 * keep order), so the packed West End trio yields its labels first.
 * width: Full. disclosure: the district x trade owner-keep matrix behind a Pro veil.
 */
import * as React from "react";
import { Box, Rail, Fig, InfoTip, InlineDisclosure, TERRA } from "@/components/spine/kit";
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
  const [hover, setHover] = React.useState<string | null>(null);
  // Null-guard (real-data promotion): omit the whole section when no district set.
  if (list.length === 0) return null;
  const rows: Row[] = list.map((x) => ({ ...x, keep: keepIndex(x) })).sort((a, b) => b.keep - a.keep);
  const lead = rows[0];
  const revLeader = list.reduce((a, b) => (b.rev_vs_city_pct > a.rev_vs_city_pct ? b : a), list[0]);

  // dot-plot geometry: one shared drawn domain. 50 is the drawn floor (labelled on
  // the axis, so the non-zero start is visible, never hidden), 100 is the city
  // reference line, 110 gives the line air. The 60..87 spread occupies the honest
  // middle of the track instead of huddling at the end of a 0-based bar.
  const DOMAIN: [number, number] = [50, 110];
  const posOf = (v: number) => ((v - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * 100;
  const refPos = posOf(100);

  // map points in KEEP order (declutter keeps labels by array priority, so the
  // best keepers keep their names and the packed West End trio yields first).
  // Uniform pin size (no unlabelled size encoding); ink pins, terra = the leader;
  // the keep index rides the hover/focus popup.
  const points: SpinePoint[] = rows
    .filter((x) => Number.isFinite(x.lat) && Number.isFinite(x.lng))
    .map((x, i) => ({
      name: x.name, slug: x.slug, lat: x.lat, lng: x.lng,
      signal: 50, signalLabel: `keeps ${x.keep} vs 100`, sub: x.character,
      tone: i === 0 ? "terra" : "ink",
      href: "/dev/spine-hood",
    }));

  // The map self-omits when no district carries real coordinates (real-data promotion
  // holds no lat/lng); the ranked keep-index list then takes the full width alone.
  const hasMap = points.length > 0;

  return (
    <Box className="citytop">
      {/* "By district" , plain, and deliberately NOT "Where to trade": this chapter's
          Movement call (city-view.tsx) still carries eyebrow="Where to trade" (a dead,
          unrendered prop per the kit patch) alongside this box's OWN kicker, which used
          to read the identical string. Same words, two labels, is the exact defect the
          rulebook's residue pass exists to kill , so the surviving, rendered label here
          carries different words even though the eyebrow itself no longer renders. */}
      <Rail icon="best-areas" tone="terra" kicker="By district" />
      <div className={hasMap ? "grid gap-4 lg:grid-cols-[1.35fr_1fr] lg:items-stretch" : "grid gap-4"}>
        {/* the map , the highest-craft object, given real height. Omitted with no coords. */}
        {hasMap ? (
          <div className="min-w-0">
            <SpineMap points={points} ariaLabel="Map of London districts" fitPadding={56} />
          </div>
        ) : null}
        {/* the ranked list , a keep-index dot plot against the drawn city = 100 line */}
        <div className="min-w-0">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Ranked by what you keep</span>
            <span className="text-[10.5px] text-[var(--c-muted)]">keep index<InfoTip gloss="Revenue vs the city, divided by the rent load; 100 keeps the city-average share of each sale." /></span>
          </div>
          <div className="space-y-1">
            {rows.map((r, i) => {
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
                  {/* dot at the keep index on the shared 50..110 track; the city
                      average is the drawn line every district visibly falls short of */}
                  <div className="relative mt-1.5 h-2" role="img" aria-label={`${r.name}: keep index ${r.keep}, against the city average of 100`}>
                    <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full" style={{ background: "#efece9" }} />
                    <span className="absolute -bottom-[2px] -top-[2px] w-px bg-[var(--c-line-strong)]" style={{ left: `${refPos}%` }} />
                    <span className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${posOf(r.keep)}%`, background: isLead ? TERRA : "#1b1b1a", boxShadow: "0 0 0 1px #e3e3e3" }} />
                  </div>
                  <div className="mt-0.5 text-[10.5px] text-[var(--c-muted)]">
                    <span className="truncate">{r.character}</span>
                  </div>
                </a>
              );
            })}
          </div>
          {/* the shared axis, drawn once: the labelled floor + the city line */}
          <div aria-hidden className="relative mt-1 h-4 text-[9px] uppercase tracking-wide text-[var(--c-muted)]">
            <Fig className="absolute left-0">{DOMAIN[0]}</Fig>
            <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${refPos}%` }}>city = 100</span>
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
          under a calm veil, kept in the DOM for crawlers. Omitted when no trade carries
          a real margin to fill the matrix. */}
      {trades.some((t) => t?.net_margin_pct != null) ? (
        <div className="mt-4 border-t border-[var(--c-border)] pt-4">
          <LockVeil headline="Every district, every trade" note="See what the owner keeps for each trade in each district, ranked, with the rent load on every cell." cta="Unlock with Pro">
            <ProMatrix rows={rows} trades={trades.filter((t) => t?.net_margin_pct != null)} />
          </LockVeil>
        </div>
      ) : null}
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
