"use client";
/**
 * WhereToTrade , the city page's SIGNATURE moment. The old split (district
 * conveyor, then a chapter-weight Movement, then a separate map) is merged into
 * ONE coordinated pairing: a tall real MapLibre map beside a ranked district
 * list, cross-linked on hover. The list ranks by RENT LOAD, lightest first (the
 * founder's D1 call, 2026-07-11): rent is the held, knowable figure. The old
 * derived per-district "keep index" is DELETED , rulebook v1 §5 names it an
 * unknowable metric, never rendered , and the district x trade ProMatrix built
 * on it is deleted with it (it squared the banned figure).
 *
 * form: a dot plot on one shared, drawn domain, INVERTED per rule 29A so the
 * lighter (better) rent reads RIGHT and the heavier (worse) rent reads LEFT ,
 * rent is a cost/burden, so cheaper is the good end and carries terracotta. The
 * city-average x1 is the drawn reference line at the RIGHT (the cheapest point),
 * labelled once; every inner district sits to its left. Dots, not bars (§25).
 * focal: the map + the lightest-rent district; terracotta on the leader's dot only.
 * map: ink pins, terra ONLY on the rent-load leader; uniform pin size; label
 * declutter priority follows rent rank (points passed in rank order), so the
 * packed West End trio yields its labels first.
 * width: Full. The revenue-vs-city counterpoint stays one tap away in a quiet
 * disclosure; no cross-district revenue-vs-keep verdict footer (rulebook v1 §15).
 */
import * as React from "react";
import { Box, Rail, Fig, InfoTip, TERRA } from "@/components/spine/kit";
import { SpineMap, type SpinePoint } from "@/components/spine/SpineMap";

type District = { name: string; slug: string; character: string; rev_vs_city_pct: number; rent_mult: number; lat: number; lng: number };

export function WhereToTrade({ d }: { d: any }) {
  const w = d.where_to_trade ?? {};
  const list: District[] = w.list ?? [];
  const [hover, setHover] = React.useState<string | null>(null);
  // Null-guard (real-data promotion): omit the whole section when no district set.
  if (list.length === 0) return null;
  // D1 (founder, 2026-07-11): rank by rent load, lightest first. The seed rent
  // multiple is the ranked figure, plainly labelled , nothing derived.
  const rows: District[] = list.slice().sort((a, b) => a.rent_mult - b.rent_mult);
  const sample = w._meta?.confidence === "placeholder" || w._meta?.confidence === "modeled";

  // dot-plot geometry: one shared DATA-DERIVED domain , x1 is the drawn floor AND the
  // city-average reference; the far end sits just past the heaviest district, so a
  // high-spread city never renders a dot past the track (§21, the hardcoded 2.8 clipped).
  const maxRent = Math.max(...rows.map((r) => r.rent_mult), 1.2);
  const DOMAIN: [number, number] = [1, Math.round((maxRent + 0.2) * 10) / 10];
  // INVERTED (rule 29A): rent is a cost/burden, so the cheaper (better) end reads
  // RIGHT (pos 100) and the heavier (worse) end reads LEFT (pos 0). The city floor
  // x1 lands at the right, the lightest-rent leader's dot sits just left of it.
  const posOf = (v: number) => Math.max(0, Math.min(100, ((DOMAIN[1] - v) / (DOMAIN[1] - DOMAIN[0])) * 100));

  // map points in RENT-RANK order (declutter keeps labels by array priority, so
  // the lightest-rent districts keep their names and the packed West End trio
  // yields first). Uniform pin size; ink pins, terra = the rent-load leader;
  // the rent multiple rides the hover/focus popup.
  const points: SpinePoint[] = rows
    .filter((x) => Number.isFinite(x.lat) && Number.isFinite(x.lng))
    .map((x, i) => ({
      name: x.name, slug: x.slug, lat: x.lat, lng: x.lng,
      signal: 50, signalLabel: `rent x${x.rent_mult} the city level`, sub: x.character,
      tone: i === 0 ? "terra" : "ink",
      href: "/dev/spine-hood",
    }));

  // The map self-omits when no district carries real coordinates (real-data promotion
  // holds no lat/lng); the ranked rent-load list then takes the full width alone.
  const hasMap = points.length > 0;

  return (
    <Box>
      {/* "By district" , plain, and deliberately NOT "Where to trade": this chapter's
          Movement heading (city-view.tsx) already carries those words, and the same
          words on two labels is the exact defect the rulebook's residue pass exists
          to kill , so the box's own kicker carries different words. */}
      <Rail icon="best-areas" tone="terra" kicker="By district" sample={sample} />
      <div className={hasMap ? "grid gap-4 lg:grid-cols-[1.35fr_1fr] lg:items-stretch" : "grid gap-4"}>
        {/* the map , the highest-craft object, given real height. Omitted with no coords. */}
        {hasMap ? (
          <div className="min-w-0">
            <SpineMap points={points} ariaLabel="Map of London districts" fitPadding={56} />
          </div>
        ) : null}
        {/* the ranked list , a rent-load dot plot against the drawn city = x1 line */}
        <div className="min-w-0">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Ranked by rent load, lightest first</span>
            <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">rent, x the city level<InfoTip gloss="The district's commercial rent as a multiple of the city-average level; x1 is the city average." /></span>
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
                    <span className="min-w-0 truncate text-[length:var(--t-body)] text-[var(--c-ink)]">{r.name}</span>
                    <Fig className={`shrink-0 text-[length:var(--t-body)] ${isLead ? "font-semibold text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>x{r.rent_mult}</Fig>
                  </div>
                  {/* dot at the rent multiple on the shared, INVERTED track (cheaper = right,
                      rule 29A); the city-average x1 is the drawn line at the right edge, and
                      every district sits to its LEFT (all pay above the city average) */}
                  <div className="relative mt-1.5 h-2" role="img" aria-label={`${r.name}: rent ${r.rent_mult} times the city-average level`}>
                    <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full" style={{ background: "var(--c-border)" }} />
                    <span className="absolute -bottom-[2px] -top-[2px] w-px bg-[var(--c-line-strong)]" style={{ left: `${posOf(1)}%` }} />
                    <span className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${posOf(r.rent_mult)}%`, background: isLead ? TERRA : "var(--c-ink)", boxShadow: "0 0 0 1px var(--c-border)" }} />
                  </div>
                  <div className="mt-0.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">
                    <span className="truncate">{r.character}</span>
                  </div>
                </a>
              );
            })}
          </div>
          {/* the shared axis, drawn once: the labelled city floor + the far end. The
              revenue-vs-city disclosure and its "loud names take the most, but rent takes
              it back" footer are DELETED (§15 cross-entity verdict footer; §18): the list
              reads on rent load alone, the founder's D1 metric. */}
          <div aria-hidden className="relative mt-1 h-4 text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">
            <Fig className="absolute left-0">x{DOMAIN[1]}</Fig>
            <span className="absolute right-0 whitespace-nowrap">city = x1</span>
          </div>
        </div>
      </div>
    </Box>
  );
}
