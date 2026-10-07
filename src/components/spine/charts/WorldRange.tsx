/**
 * WorldRange, A FIGURE DRAWN ON THE WORLD'S RANGE (2026-09-25). His words that day: the numbers "you just blast them over there
 * with no relation to each other". A row here is a figure and where it stands: the country's value as a marker on a track that runs
 * from the world's lowest to its highest, the middle half of the countries shaded, no median (plan 06, task B2). The value is read in
 * the row's head beside its label; the track says whether it is dear or cheap without a sentence. The bullet chart of his shadcn
 * blocks (chart-card26's band and reference line), drawn here in the page's own marks and on the server, so the page carries it in
 * its first byte and the harness reads it.
 *
 * THE LAW: the label, then the figure in the very next column (PART 5's row, never a justify-between gap); the track under them at
 * the row's full width; the world's ends under the track at the micro rung; one marker, terracotta, the only accent in the row.
 * `scale="log"` for a field whose world spans orders of magnitude (pay, prices of a service), linear otherwise.
 */
import * as React from "react";
import { Fig, Ico } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/brand/icons";
import type { WorldRange } from "@/lib/spine/world_stats";

export type WorldRangeRow = {
  key: string;
  label: string;
  /** The figure as printed, with its unit words after it. */
  display: string;
  unit?: string;
  value: number;
  /** The world's range, or null: the row then prints its figure alone, no track (a figure newer than the world's set is not placed on it). */
  range: WorldRange | null;
  /** The world's two ends, as printed (the same formatter as the figure). */
  fmt: (v: number) => string;
  icon?: AtlasIconId;
  scale?: "linear" | "log";
  /** The level word among the countries, or null. */
  level?: string | null;
  /** No head: the card's own figure above is this row's value (2026-09-25). */
  headless?: boolean;
  /** EVERY COUNTRY AS A HAIRLINE (2026-10-04, research R4, pattern P3): the values the range and the placement were counted from,
   *  each a faint 1px mark on the track, so the reader sees where the world crowds and whether this country sits in the crowd or
   *  alone at an edge. world_stats.ts `worldValues` (fills left out). */
  hairlines?: number[];
  /** THE PAGE'S PEERS ON THE TRACK (research R4, pattern P2; peer_marks.ts): hollow marks, named once in a key line under the
   *  track in the order they stand, with their figures. Three at the least, or none. */
  peers?: Array<{ name: string; value: number }> | null;
  /** The key line's first word ("Peers"). */
  peersWord?: string;
  /** A REFERENCE ON THE TRACK (2026-10-04): a rate of the country's own that the figure is read against (the central bank's rate
   *  under the small-business loan rate), a small ink triangle above the track at its value, named in the key line with its
   *  figure. Above the track, so it never sits on a peer's ring or the country's dot. */
  refs?: Array<{ key: string; label: string; value: number; /** As the source states it ("3.75%": a rate set in quarter points is never "3.8%"). */ display?: string }> | null;
  /** What the range is the range of, for the track's spoken label, where it is not the world (the home page's "London's trades"). */
  among?: string;
};

/** A LOG TRACK'S SCALE MARKS (2026-10-04, the design review: "the scale is logarithmic but only 1.3% and 78% are labelled, so
 *  6.61% sits 40% of the way along"): the round values 1, 2 and 5 times a power of ten inside the range, each a small tick under
 *  the track with its figure on the ends' line, none within 12% of an end (the ends print there) or 9% of another. */
function logTicks(r: WorldRange): number[] {
  const out: number[] = [];
  if (!(r.min > 0) || !(r.max > r.min)) return out;
  for (let e = Math.floor(Math.log10(r.min)); e <= Math.ceil(Math.log10(r.max)); e++) {
    for (const m of [1, 2, 5]) {
      const v = m * 10 ** e;
      const at = pos(v, r, "log");
      if (v <= r.min || v >= r.max || at < 12 || at > 88) continue;
      if (out.length && at - pos(out[out.length - 1], r, "log") < 9) continue;
      out.push(v);
    }
  }
  return out;
}

/** How far, in percent of the track, a peer's mark must stand from the country's dot to be drawn (the dot's 8px radius and the
 *  ring's 6px, plus a pixel, on a 343px phone track). */
const PEER_CLEAR = 4.5;

function pos(v: number, r: WorldRange, scale: "linear" | "log"): number {
  const lo = scale === "log" ? Math.log(r.min) : r.min;
  const hi = scale === "log" ? Math.log(r.max) : r.max;
  const x = scale === "log" ? Math.log(Math.max(v, r.min)) : v;
  if (hi <= lo) return 50;
  return Math.max(0, Math.min(100, ((x - lo) / (hi - lo)) * 100));
}

/** `ends` (2026-09-26, the United Kingdom's electricity, the dearest on file): the words an end prints when the row's own figure
 *  prints the same, so the card's figure is never printed twice (the figure at 30 above, again at the track's end). */
export type RangeEnds = { lowest: string; highest: string };

/** `showEnds` (2026-10-07, the home's trades card): false draws the track and its marks without the line of the range's two ends
 *  (and, on a log track, its scale labels, which are the ends' companions), for a card that prints one figure and lets the drawing
 *  be its second reading with no figure beside it (the card's `$220K`, never `$104K` and `$1.0M` unlabelled around it). The track's
 *  spoken label still names the range. Default true, so every other use is unchanged. It is not `ends`, which is the words an end
 *  prints in place of a figure the card already says. */
export function WorldRangeRows({ rows, headless = false, ends, showEnds = true }: { rows: WorldRangeRow[]; headless?: boolean; ends?: RangeEnds; showEnds?: boolean }) {
  const live = rows.filter((r) => r && Number.isFinite(r.value));
  if (live.length === 0) return null;
  return (
    <div data-archetype="world-range" data-visual="1" data-form={headless || live.every((r) => r.headless) ? "under-figure" : "rows"} data-marks={live.some((r) => r.refs && r.refs.length) ? "reference" : undefined} data-rows={String(live.length)} className="flex flex-col gap-5">
      {live.map((r) => {
        const scale = r.scale ?? "linear";
        const range = r.range;
        return (
          <div key={r.key} data-row={r.key}>
            {headless || r.headless ? null : <div className="flex items-center gap-3">
              {r.icon ? <Ico id={r.icon} tone="terra" /> : null}
              <span data-label className="text-[length:var(--t-body)] text-[var(--c-ink)]">{r.label}</span>
              <span className="whitespace-nowrap">
                <Fig className="text-[length:var(--t-lead)] font-semibold text-[var(--c-ink)]">{r.display}</Fig>
                {r.unit ? <span className="ml-1 text-[length:var(--t-micro)] text-[var(--c-muted)]">{r.unit}</span> : null}
              </span>
              {r.level ? (
                <span data-level={r.level} className="ml-auto rounded-md border border-[var(--c-border)] bg-[var(--c-soft)] px-2 py-0.5 text-[length:var(--t-micro)] font-semibold text-[var(--c-ink2)]">{r.level}</span>
              ) : null}
            </div>}
            {range ? <Track r={r} range={range} scale={scale} headless={headless || !!r.headless} ends={ends} showEnds={showEnds} /> : null}
          </div>
        );
      })}
    </div>
  );
}

function Track({ r, range, scale, headless, ends, showEnds }: { r: WorldRangeRow; range: WorldRange; scale: "linear" | "log"; headless: boolean; ends?: RangeEnds; showEnds: boolean }) {
  const at = pos(r.value, range, scale);
  const a = pos(range.p25, range, scale);
  const b = pos(range.p75, range, scale);
  const own = r.fmt(r.value);
  const low = ends && own === r.fmt(range.min) ? ends.lowest : r.fmt(range.min);
  const high = ends && own === r.fmt(range.max) ? ends.highest : r.fmt(range.max);
  return (
          <>
            <div className={`relative ${r.refs && r.refs.length ? "mt-4" : headless ? "mt-1" : "mt-3"} h-3`} role="img" aria-label={`${r.label}: ${r.display}${r.unit ? ` ${r.unit}` : ""}; ${r.among ?? "the world"} from ${r.fmt(range.min)} to ${r.fmt(range.max)}${r.peers && r.peers.length ? `; ${r.peers.map((p) => `${p.name} ${r.fmt(p.value)}`).join(", ")}` : ""}${r.refs && r.refs.length ? `; ${r.refs.map((x) => `${x.label} ${x.display ?? r.fmt(x.value)}`).join(", ")}` : ""}`}>
              <span aria-hidden className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[var(--c-soft2)]" />
              <span aria-hidden data-track-band className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-[var(--c-border)]" style={{ left: `${a}%`, width: `${Math.max(1, b - a)}%` }} />
              {/* THE COUNTRIES THE RANGE WAS COUNTED FROM, one hairline each, in one drawing (a mark per country would be 197 nodes):
                  where they crowd the marks darken, which is the information; nothing on the strip carries a word. */}
              {r.hairlines && r.hairlines.length ? (
                <svg aria-hidden data-track-hairlines={String(r.hairlines.length)} className="absolute inset-x-0 top-1/2 h-2 w-full -translate-y-1/2 overflow-visible" viewBox="0 0 100 8" preserveAspectRatio="none">
                  <path d={r.hairlines.map((v) => `M${pos(v, range, scale).toFixed(2)} 0V8`).join("")} stroke="var(--c-ink2)" strokeOpacity={0.32} strokeWidth={1} vectorEffect="non-scaling-stroke" fill="none" />
                </svg>
              ) : null}
              {/* NO MEDIAN, DRAWN OR NAMED (plan 06, task B2; PART 9 clause 46): the world's median was computed over a profile where 146 of
                  197 countries are interpolated and 52 hold one fill value (electricity's 0.13), so it was not a statistic of the world. */}
              {/* A PEER UNDER THE COUNTRY'S OWN DOT IS NOT DRAWN (2026-10-04, the borrowing track at 375: four peers a few pixels left
                  of the United Kingdom's dot showed as a "C", a ring cut by the dot): within 4.5% of the track (15px of a 343px
                  phone track, the two marks' radii) the dot stands alone and the key line still names the peer with its figure. */}
              {(r.peers ?? []).filter((p) => Math.abs(Math.max(2, Math.min(98, pos(p.value, range, scale))) - Math.max(2, Math.min(98, at))) >= PEER_CLEAR).map((p) => (
                <span key={p.name} aria-hidden data-mark="peer" className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--c-ink2)] bg-[var(--c-surface)]" style={{ left: `${Math.max(2, Math.min(98, pos(p.value, range, scale)))}%` }} />
              ))}
              {(r.refs ?? []).map((x) => (
                <span key={x.key} aria-hidden data-mark="reference" className="absolute -top-2.5 h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-[var(--c-ink)]" style={{ left: `${Math.max(2, Math.min(98, pos(x.value, range, scale)))}%` }} />
              ))}
              {/* THE DOT PINNED INSIDE ITS TRACK (the chain's scale-end clamp, 2026-09-25): centred on its own value, a country at the
                  world's highest or lowest hung half off the card's edge (the United Kingdom's electricity is the world's dearest). */}
              <span aria-hidden data-mark="value" className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--c-card)] shadow-subtle" style={{ left: `${Math.max(2, Math.min(98, at))}%`, background: "var(--terra)" }} />
            </div>
            {showEnds && scale === "log" ? (
              <div aria-hidden className="relative h-1.5">
                {logTicks(range).map((v) => (
                  <span key={v} data-scale-tick className="absolute top-0 h-1.5 w-px bg-[var(--c-line-strong)]" style={{ left: `${Math.max(12, Math.min(88, pos(v, range, scale)))}%` }} />
                ))}
              </div>
            ) : null}
            {showEnds ? (
              <div className={`relative ${scale === "log" ? "mt-0.5" : "mt-2"} h-4 text-[length:var(--t-micro)] text-[var(--c-muted)]`}>
                <span data-end="low" className="absolute left-0 tabular-nums">{low}</span>
                {scale === "log"
                  ? logTicks(range).map((v) => (
                      <span key={v} data-scale-label className="absolute -translate-x-1/2 tabular-nums" style={{ left: `${Math.max(12, Math.min(88, pos(v, range, scale)))}%` }}>{r.fmt(v)}</span>
                    ))
                  : null}
                <span data-end="high" className="absolute right-0 tabular-nums">{high}</span>
              </div>
            ) : null}
            {/* THE PEERS NAMED ONCE, in the order their marks stand, each with its figure: a key, not a sentence (no comparison word, no
                difference, no rank; clause 15). On a phone it wraps under itself; the marks above stay unlabelled. A key is part of
                the drawing, so it is drawn as the site's other keys are (the survival strip's, the job market's), not as a line of
                copy under the figure. */}
            {r.peers && r.peers.length ? (
              <div data-peers-key="" className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[length:var(--t-micro)] leading-4 text-[var(--c-ink2)]">
                <span className="inline-flex items-center gap-1">
                  <span aria-hidden className="inline-block h-3 w-3 rounded-full border-2 border-[var(--c-ink2)] bg-[var(--c-surface)]" />
                  {r.peersWord ?? "Peers"}
                </span>
                {r.peers.map((p) => (
                  <span key={p.name} className="whitespace-nowrap">
                    {p.name} <Fig className="text-[length:var(--t-micro)] text-[var(--c-ink)]">{r.fmt(p.value)}</Fig>
                  </span>
                ))}
              </div>
            ) : null}
            {/* THE REFERENCE NAMED ONCE, under the peers, with its glyph and its figure (a key, not a sentence). */}
            {r.refs && r.refs.length ? (
              <div data-refs-key="" className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[length:var(--t-micro)] leading-4 text-[var(--c-ink2)]">
                {r.refs.map((x) => (
                  <span key={x.key} className="inline-flex items-center gap-1 whitespace-nowrap">
                    <span aria-hidden className="inline-block h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-[var(--c-ink)]" />
                    {x.label} <Fig className="text-[length:var(--t-micro)] text-[var(--c-ink)]">{x.display ?? r.fmt(x.value)}</Fig>
                  </span>
                ))}
              </div>
            ) : null}
          </>
  );
}
