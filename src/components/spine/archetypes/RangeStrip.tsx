/**
 * RangeStrip , THE RANGE-STRIP ARCHETYPE. Up to five named marks of ONE
 * quantity on ONE scale: a hairline track, a tick per mark placed by value,
 * the figure over its tick and the name under it, the ends pinned inside the
 * box, a basis line beneath in the practical register. Log scale where the
 * span runs to many times (rents), linear where it does not (pay). One mark
 * may carry the accent when the strip is a spread around an answer (the
 * typical pay); a set of places carries none.
 *
 * Built for the founder's rulings of 2026-09-04: premises "in five metrics"
 * (12), practical words instead of "x7.7 prime street against the edge of
 * town" (10, 11), and the same strip on city pages with city figures. The
 * marks are whatever the data holds; a mark not held is not drawn and the
 * basis says what the strip covers.
 *
 * THE LAW INSIDE IT: figures at a quantity's size over their marks (B3), the
 * name under the mark, nothing drawn between marks that means anything, the
 * scale's domain from the data (G6), labels that never overlap: when two
 * marks sit closer than a label's width the labels step to alternate rows,
 * and the harness checks it. Fewer than two marks and the strip becomes a
 * figure with its label, never a track with one tick.
 *
 * THE LEAD MARK IS INK (MODEL.md 8.2, `13 customers`: "the typical goes to
 * ink, giving up the accent it held"; plan step 31's sixth dispatch,
 * 2026-09-18). A mark may be the strip's LEAD, `lead`, drawn in ink with an
 * ink tick: the size says which mark is the answer of the spread, and the
 * colour says nothing, because the country page's accents are the hero's and
 * the staff card's (PART 6) and the strip is not on that list. `accent`
 * survives as a separate flag (the head rung in terracotta) for a strip the
 * model lets mark a member in colour; none does today, since the city's
 * premises strip left with 8.3's `04` bento. A mark can be lead, accent,
 * both or neither; the country's customers strip and the city's earnings
 * strip are lead only.
 *
 * THE LEAD IS THE CARD'S 30 (M3: "the typical mark is the card's 30 in ink
 * on every strip that holds one"; 8.3's `07`: "the typical is the card's 30
 * in ink, the site's strip law"; plan step 32's fourth dispatch,
 * 2026-09-18). It drew at the head rung, 20, for one day, and FOCAL redded
 * every strip that held it for holding no 30 (country-GB and country-AF
 * `#customers`, city-london `#earnings`, in the laws list of that morning).
 * At `--t-focal` the figure's box is 30 tall, so when a lead sits in the
 * strip the track, the ticks and the names all sit 12 lower than they would
 * (the lead's row is 30 where a body figure's is 14, the stepped row is 18
 * down, and 18 plus 30 meets the ticks at 42 without the shift), and the box
 * is 12 taller; a strip with no lead draws exactly what it drew before, so
 * the premises strips and the industry's `14 worth` do not move. A lead
 * figure is about twice the width of a body one, so it centres only between
 * a quarter and three quarters of the track and hangs inward outside that
 * band, where a body figure centres between 15 and 85 percent; measured on
 * the city's stories at 375 before the thresholds were set. Fewer than two
 * marks and the lead is the same 30 alone, a figure with its label.
 *
 * THREE OPT-IN PROPS, FOR THE HOME'S WORKED EXAMPLE AND THE TRADE PAGES' SALES
 * STRIP (plan 2026-10-10, the home reformed to ship, Task 3; the critique's
 * P0.5), each off by default, so every other strip draws exactly what it
 * drew. `oneRow` keeps every name on one row, for marks that stand far apart
 * (on a log track the London restaurant's typical sits at 46 percent, its
 * neighbours at 6 and 94); only the home's strip passes it, because a trade
 * page's marks may stand close and its names must step. `decades`, on a log
 * track only, prints every power of ten strictly inside the range as a 6px
 * tick under the track with its figure under it, in grey (MODEL 10.8: "a log
 * track prints its round values ... so its distances are not read as even"),
 * none within 4 percent of the track of any mark (the London pharmacies'
 * typical, $1.04M, stands 1.1 percent from the round $1M, and the strip
 * printed that figure twice, "$1.0M" under the typical and "$1.0M" under the
 * track, before the scale's labels were printed round: critique pass 4, item
 * P2.4), and steps the names 14 lower to clear them. The
 * home's strip and every trade page's sales strip (cell-view.tsx `Spread`)
 * pass it with scale="log". The figure is at the micro rung, not the mark
 * rung: the readability harness's READ SIZE reds any text under 12px in a
 * card. (`headless`, a mark with no figure, went when the home's typical began
 * to print its figure: nothing passes it now.)
 *
 * `namesAbove`, THE DATA ABOVE THE TRACK AND THE SCALE ALONE BELOW IT (plan
 * 2026-10-10, the home reformed to ship, critique pass 2, P0.2; the home and
 * every trade page's sales strip pass it with `decades`), off by default. With
 * the names under the track the column under the bottom tenth's tick read
 * "$76K, $100K, Bottom tenth", and a reader took the bottom tenth for $100K
 * (it is $76K). Now every mark is one block over its tick: its name (12, muted)
 * with its figure (14 semibold ink, or the lead's 30) directly under it, then
 * the track, and under the track only the round values, each a 6px tick in
 * ink2 with its figure at 12 in muted under it. The blocks stand on the figure
 * line, so the lead's name stands above the others'. Marks that step (three or
 * more, unless `oneRow`) step as they did, the stepped block the lower, nearer
 * the track, and the upper blocks' ticks reach up to them on a hairline, so
 * every block stays tied to its tick. A mark's own figure stands a name's
 * height under it; the nearest figure that is not its own, a round value
 * under the track, is more than 48px from any name in its column (the
 * critique's done-when, held by the browser probe). The end labels' inward
 * rule (`align`) is unchanged.
 */
import * as React from "react";
import { Fig } from "@/components/spine/kit";
import type { Provenance } from "@/lib/spine/provenance";

export type StripMark = { key: string; label: string; value: number; accent?: boolean; lead?: boolean; sub?: string; /** Where the figure came from (plan 06, task B5). */ prov?: Provenance };
export type RangeStripProps = {
  marks: StripMark[];
  scale?: "log" | "linear";
  fmt: (v: number) => string;
  /** The basis line beneath the strip. AN EMPTY STRING DRAWS NOTHING (plan
   *  step 33's sixth dispatch, 2026-09-18): the trade page's `14 worth` stands
   *  its basis and note at the card's foot, the one-object card's composition
   *  (the opener at the top, the basis at the foot, the object centred in
   *  what is left), and an empty paragraph under the track would be an
   *  invisible 18px that shifts the centre. Every other caller passes its
   *  basis here and nothing changes for it. */
  basis: string;
  /** One quiet line beneath the basis (an absent spread, an extra figure). */
  note?: string | null;
  /** A single extra figure under a hairline (the electricity rate). */
  extra?: { value: string; label: string } | null;
  /** Every name on one row, never stepping (plan 2026-10-10, home reform, Task 3). Off by default. */
  oneRow?: boolean;
  /** On a log track, every power of ten inside the range as a small tick with its figure (MODEL 10.8; plan 2026-10-10, home reform, Task 3). Off by default. */
  decades?: boolean;
  /** Every mark's name and figure above the track, the round values alone under it (plan 2026-10-10, home reform, critique pass 2, P0.2). Off by default. */
  namesAbove?: boolean;
};

const PAD = 6; // percent of the track kept clear at each end so end labels stay inside the box
/* THE ROUND VALUES' ROW: a 6px tick under the track, its figure 9px under the track's line at the micro rung (12 tall), the names 14 lower. */
const SCALE_ROW = 14;
/* NAMES ABOVE (`namesAbove`), in px. A mark's block is its name (the micro rung, 12 on 12) and, 6 under it, its figure (the body rung, 14 on 14, or the lead's 30 on 30). */
const NAME_H = 12;
const NAME_GAP = 6;
const FIG_H = 14;
const LEAD_H = 30;
/* The block's bottom to the mark's tick top, the tick's reach above the track, and the gap between a stepped block and the block over it. */
const BLOCK_TO_TICK = 10;
const TICK_UP = 6;
const ROW_GAP = 6;
/* Under the track: the round value's tick (6px, from the track's line) and the gap to its figure (6px), the figure 12 tall; with no round value, the room the marks' ticks take. */
const ROUND_TICK = 6;
const ROUND_GAP = 6;
const BELOW_ROUNDS = 1 + ROUND_TICK + ROUND_GAP + NAME_H + 2;
const BELOW_BARE = 12;
/* A ROUND VALUE IS PRINTED ROUND (critique pass 4, fix round F2, item P2.4; MODEL 10.8: a log track's round values are there to be round): the marks'
   formatter keeps one decimal for millions because "$2.5M" needs it, so a whole $1,000,000 came out "$1.0M" under the track and read as a measured
   figure. The scale's labels take the formatter's words with a whole value's ".0" dropped before its unit (K, M or B): "$100K" and "$1M". Only the
   scale goes through this: a mark prints through `fmt` as it always did, so the home and the London page still print equal figures. */
const roundLabel = (fmt: (v: number) => string, v: number) => fmt(v).replace(/\.0(?=[KMB])/, "");

export function RangeStrip({ marks, scale = "linear", fmt, basis, note, extra, oneRow = false, decades = false, namesAbove = false }: RangeStripProps) {
  const live = marks.filter((m) => Number.isFinite(m.value));
  if (live.length === 0) return null;
  if (live.length === 1) {
    const m = live[0];
    return (
      <div data-archetype="range-strip" data-idea="I12" data-marks="1">
        <div className="text-[length:var(--t-body)] font-medium leading-snug text-[var(--c-ink2)]">{m.label}</div>
        <Fig className={`mt-1 block font-semibold leading-none ${m.lead ? "text-[length:var(--t-focal)]" : "text-[length:var(--t-head)]"} ${m.accent ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`} prov={m.prov}>{fmt(m.value)}</Fig>
        {basis ? <p className="mt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</p> : null}
        {note ? <p className="mt-0.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{note}</p> : null}
        {extra ? <Extra extra={extra} /> : null}
      </div>
    );
  }
  const sorted = [...live].sort((a, b) => a.value - b.value);
  const lo = sorted[0].value, hi = sorted[sorted.length - 1].value;
  const useLog = scale === "log" && lo > 0 && hi / lo >= 3;
  const pos = (v: number) => {
    if (hi === lo) return 50;
    const t = useLog ? (Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo)) : (v - lo) / (hi - lo);
    return PAD + t * (100 - 2 * PAD);
  };
  /* LABELS STEP TO A SECOND ROW when two marks sit closer than about 18% of
     the track, which is the width of a five-character figure at body size in
     a 300px card. Alternation keeps every label readable at every width. */
  const placed = sorted.map((m) => ({ m, x: pos(m.value) }));
  /* END LABELS ALIGN INWARD: a label centred on a tick near either end pokes
     past the card (measured by the harness: two labels outside on every
     premises strip). Below 15% a label hangs right of its tick, above 85% it
     hangs left, in between it centres. */
  const align = (x: number, wide = false): React.CSSProperties => {
    const [lo, hi] = wide ? [25, 75] : [15, 85];
    return x < lo ? { left: `${x}%`, transform: "translateX(0)", textAlign: "left" } : x > hi ? { left: `${x}%`, transform: "translateX(-100%)", textAlign: "right" } : { left: `${x}%`, transform: "translateX(-50%)", textAlign: "center" };
  };
  /* EVERY SECOND MARK STEPS, whenever the strip holds three or more. A rule
     on distance cannot know a label's width at render time and let a middle
     label collide with an end one (measured by the harness on every premises
     strip); alternation is deterministic and holds for five marks. */
  /* `oneRow` keeps them on one row: the caller's marks stand far apart (the header says when). */
  const rows = placed.map((_, i) => (live.length >= 3 && !oneRow ? i % 2 : 0));
  const twoRows = rows.some((r) => r === 1);
  /* THE LEAD'S SHIFT: a lead figure is 30 tall where a body figure is 14, so the track and everything under it sit 12 lower (the header says why). */
  const shift = live.some((m) => m.lead) ? 12 : 0;
  /* THE ROUND VALUES (`decades`, MODEL 10.8): every power of ten strictly inside a log range, none within 4 percent of the track of any
     mark, an end mark or a middle one (a round value that close would stand against the mark's own tick, and when the mark's figure
     reads as the round value, as the London pharmacies' $1.04M ("$1.0M") and the 10^6 round value ("$1M") do, the strip would print one value twice). */
  const rounds: number[] = [];
  if (useLog && decades) {
    for (let e = Math.ceil(Math.log10(lo)); e <= Math.floor(Math.log10(hi)); e++) {
      const v = 10 ** e;
      if (v > lo && v < hi && placed.every((p) => Math.abs(p.x - pos(v)) >= 4)) rounds.push(v);
    }
  }
  const scaleRow = rounds.length ? SCALE_ROW : 0;
  const figClass = (m: StripMark) => `block font-semibold leading-none ${m.lead ? "text-[length:var(--t-focal)]" : m.accent ? "text-[length:var(--t-head)]" : "text-[length:var(--t-body)]"} ${m.accent ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`;
  if (namesAbove) {
    /* THE DATA ABOVE THE TRACK, THE SCALE ALONE BELOW IT (the header says why). A mark is one block, its name over its figure, the
       blocks of a row bottom-aligned on one figure line, so the lead's name stands above the others'. Row 0 is the upper row; a
       stepped mark (row 1) stands a row lower, nearer the track, and the upper blocks' ticks reach up to them on a hairline. */
    const blockH = (m: StripMark) => NAME_H + NAME_GAP + (m.lead ? LEAD_H : FIG_H);
    const rowH = (r: number) => Math.max(0, ...placed.filter((_, i) => rows[i] === r).map((p) => blockH(p.m)));
    const h0 = rowH(0), h1 = rowH(1);
    const base = twoRows ? h0 + ROW_GAP + h1 : h0;
    const track = base + BLOCK_TO_TICK + TICK_UP;
    const blockTop = (i: number) => (rows[i] === 1 ? h0 + ROW_GAP + (h1 - blockH(placed[i].m)) : h0 - blockH(placed[i].m));
    return (
      <div data-archetype="range-strip" data-idea="I12" data-marks={String(live.length)} data-scale={useLog ? "log" : "linear"} data-names="above">
        <div className="relative" style={{ height: track + (rounds.length ? BELOW_ROUNDS : BELOW_BARE) }}>
          {/* each mark's name, then its figure under it, both over the tick */}
          {placed.map((p, i) => (
            <React.Fragment key={p.m.key}>
              <div data-mark-label={p.m.key} className="absolute whitespace-nowrap text-[length:var(--t-micro)] leading-none text-[var(--c-muted)]" style={{ ...align(p.x, !!p.m.lead), top: blockTop(i) }}>{p.m.label}</div>
              <div data-mark={p.m.key} className="absolute whitespace-nowrap" style={{ ...align(p.x, !!p.m.lead), top: blockTop(i) + NAME_H + NAME_GAP }}>
                <Fig className={figClass(p.m)} prov={p.m.prov}>{fmt(p.m.value)}</Fig>
              </div>
            </React.Fragment>
          ))}
          {/* the track and the ticks: each stands at its place on the track, which `pos` keeps inside the padded track, and says so by its clamp (the scale-end gate reads the placement) */}
          <div aria-hidden className="absolute inset-x-0 h-px bg-[var(--c-line-strong)]" style={{ top: track }} />
          {placed.map((p, i) => (
            <React.Fragment key={`t-${p.m.key}`}>
              {twoRows && rows[i] === 0 ? <div aria-hidden data-mark-leader className="absolute w-px -translate-x-1/2 bg-[var(--c-line-strong)]" style={{ left: `${Math.min(100 - PAD, Math.max(PAD, p.x))}%`, top: h0 + 2, height: base + BLOCK_TO_TICK - h0 - 2 }} /> : null}
              <div aria-hidden className="absolute w-px -translate-x-1/2" style={{ left: `${Math.min(100 - PAD, Math.max(PAD, p.x))}%`, top: track - TICK_UP, height: 13, background: p.m.accent ? "var(--terra)" : "var(--c-ink)" }} />
            </React.Fragment>
          ))}
          {/* the round values of a log track, the scale alone under the track: a 6px tick in ink2 hanging from it and its figure under that */}
          {rounds.map((v) => (
            <React.Fragment key={`r-${v}`}>
              <div aria-hidden data-scale-tick className="absolute w-px -translate-x-1/2 bg-[var(--c-ink2)]" style={{ left: `${Math.min(100 - PAD, Math.max(PAD, pos(v)))}%`, top: track + 1, height: ROUND_TICK }} />
              <div aria-hidden data-scale-label className="absolute -translate-x-1/2 whitespace-nowrap text-[length:var(--t-micro)] leading-none tabular-nums text-[var(--c-muted)]" style={{ left: `${Math.min(100 - PAD, Math.max(PAD, pos(v)))}%`, top: track + 1 + ROUND_TICK + ROUND_GAP }}>{roundLabel(fmt, v)}</div>
            </React.Fragment>
          ))}
        </div>
        {basis ? <p className="mt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</p> : null}
        {note ? <p className="mt-0.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{note}</p> : null}
        {extra ? <Extra extra={extra} /> : null}
      </div>
    );
  }
  return (
    <div data-archetype="range-strip" data-idea="I12" data-marks={String(live.length)} data-scale={useLog ? "log" : "linear"}>
      <div className="relative" style={{ height: (twoRows ? 104 : 72) + shift + scaleRow }}>
        {/* the figures, over their ticks */}
        {placed.map((p, i) => (
          <div key={p.m.key} data-mark={p.m.key} className="absolute whitespace-nowrap" style={{ ...align(p.x, !!p.m.lead), top: rows[i] === 1 ? 18 : 0 }}>
            <Fig className={figClass(p.m)} prov={p.m.prov}>{fmt(p.m.value)}</Fig>
          </div>
        ))}
        {/* the track and the ticks */}
        <div aria-hidden className="absolute inset-x-0 h-px bg-[var(--c-line-strong)]" style={{ top: (twoRows ? 48 : 36) + shift }} />
        {placed.map((p) => (
          <div key={`t-${p.m.key}`} aria-hidden className="absolute w-px -translate-x-1/2" style={{ left: `${p.x}%`, top: (twoRows ? 42 : 30) + shift, height: 13, background: p.m.accent ? "var(--terra)" : "var(--c-ink)" }} />
        ))}
        {/* the round values of a log track, under the track: a short tick and its figure, each pinned inside the padded track */}
        {rounds.map((v) => (
          <React.Fragment key={`r-${v}`}>
            <div aria-hidden data-scale-tick className="absolute h-1.5 w-px -translate-x-1/2 bg-[var(--c-line-strong)]" style={{ left: `${Math.min(100 - PAD, Math.max(PAD, pos(v)))}%`, top: (twoRows ? 48 : 36) + shift + 1 }} />
            <div aria-hidden data-scale-label className="absolute -translate-x-1/2 whitespace-nowrap text-[length:var(--t-micro)] leading-none tabular-nums text-[var(--c-muted)]" style={{ left: `${Math.min(100 - PAD, Math.max(PAD, pos(v)))}%`, top: (twoRows ? 48 : 36) + shift + 9 }}>{roundLabel(fmt, v)}</div>
          </React.Fragment>
        ))}
        {/* the names, under their ticks, stepping to a second row when crowded */}
        {placed.map((p, i) => (
          <div key={`l-${p.m.key}`} data-mark-label={p.m.key} className="absolute whitespace-nowrap text-[length:var(--t-micro)] text-[var(--c-muted)]" style={{ ...align(p.x), top: (twoRows ? 60 : 48) + shift + scaleRow + rows[i] * 18 }}>{p.m.label}</div>
        ))}
      </div>
      {basis ? <p className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</p> : null}
      {note ? <p className="mt-0.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{note}</p> : null}
      {extra ? <Extra extra={extra} /> : null}
    </div>
  );
}

function Extra({ extra }: { extra: { value: string; label: string } }) {
  return (
    <div className="mt-3 flex flex-wrap items-baseline gap-x-2 border-t border-[var(--c-border)] pt-3">
      <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{extra.value}</Fig>
      <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{extra.label}</span>
    </div>
  );
}
