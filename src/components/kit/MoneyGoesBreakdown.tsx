/**
 * MoneyGoesBreakdown - where each $100 of sales goes (design-system 10.1).
 *
 * A horizontal stacked bar over a ruled line-item table, read per $100 so the
 * shares are tangible (not abstract percentages). The cost rows are one quiet
 * neutral ladder; the KEPT row is the single accent moment. This replaces the
 * generic net-profit waterfall divs.
 *
 * That sentence said "quiet warm neutrals" and "the one moss moment (profit
 * kept = moss)" until 2026-08-18, and both halves had stopped being true: moss
 * is a banned hue and the kept slice went terracotta on 2026-08-17, and the
 * cost ramp was three-fifths cool by then. See COST_FILL for the ladder and the
 * reasoning behind it.
 *
 * Input is a list of line items already expressed as dollars per $100 (the page
 * derives them from the cost structure and the net margin). Self-omitting: with
 * fewer than two items, or a total that does not land near $100, it returns null
 * rather than draw a misleading bar.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 * Server-renderable (no client JS).
 */
import * as React from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export type MoneyGoesItem = {
  /** Row label, e.g. "Payroll", "Rent", "What the owner keeps". */
  label: string;
  /** Dollars out of every $100 of sales. */
  perHundred: number | null | undefined;
  /** The single kept row carries the moss accent. At most one. */
  kept?: boolean;
  /** Optional one-line clarifier shown under the label. */
  hint?: string;
};

export type MoneyGoesBreakdownProps = {
  items: MoneyGoesItem[];
  /** Section eyebrow. */
  eyebrow?: string;
  /** Section heading. */
  heading?: string;
  /** Optional lede under the heading. */
  lede?: string;
  /** Anchor id for the sticky nav. */
  id?: string;
  className?: string;
};

function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v) && v >= 0;
}

/**
 * The cost segments, cycled in order. The kept segment takes the accent and is
 * handled separately below, so these never carry it.
 *
 * ANSWERED 2026-08-18, AND THE ANSWER IS ONE NEUTRAL LADDER. The question the
 * previous comment left open is resolved here, with the reasoning, because a
 * ramp nobody will decide is a ramp that stays wrong.
 *
 * What it was, measured and then photographed at 900px wide on a bench that
 * feeds it the real /gb/london/restaurants decomposition:
 *
 * (written without the utility prefix on purpose: Tailwind's content scan does
 * not strip comments, so naming a retired utility in prose re-emits its rule)
 *
 *   1  cocoa-300      #c3b39c   h35 s25%   L .4626   warm tan
 *   2  paper-400      #bfbfbf   h0  s0%    L .5209   true neutral
 *   3  paper-250      #e8e8e8   h0  s0%    L .8070   true neutral
 *   4  parchment      #e3e3e3   h0  s0%    L .7682   true neutral
 *   5  cocoa-500/70   #87745d   h33 s18%   L .1843   warm dark
 *
 * FIVE REASONS, none of them "a hue reading disliked it".
 *
 * 1. The ramp was already three-fifths neutral, so "cocoa = costs" was not a
 *    rule this component obeyed. Two segments said cost-is-warm and three said
 *    otherwise, in the same bar, about the same quantity.
 * 2. The alternation encoded nothing. On the real page the segments drew $30
 *    tan, $34 grey, $15 sand, $15 grey: the two lines that are exactly EQUAL
 *    wear different hues, and the two that differ by four dollars wear
 *    different hues too. Colour that varies without meaning is noise.
 * 3. A stacked mass of one quantity is the shape the site already has a rule
 *    for: intensity in one hue, which `scores/band_tone.ts` implements and
 *    `verify_palette_membership`'s own header prescribes.
 * 4. The site was already converging this way without this file. The sweep of
 *    2026-08-17 took cocoa off thirty decorative fills onto `paper-400`, and
 *    `charts/LikeForLikeBars` carries a comment explaining why its peer bars
 *    are paper-400 and NOT cocoa-300. Leaving this bar warm made it the one
 *    holdout, which is the opposite of what the cohesion pass is for.
 * 5. Steps 3 and 4 were 0.039 apart in luminance, which is invisible. Two of
 *    the four cost segments were not separable from each other, and barely
 *    from the card behind them. That was a legibility defect on top of the
 *    hue one, and it is the reason this is a re-ramp rather than a recolour
 *    of segments 1 and 5.
 *
 * WHERE COCOA-AS-COST SURVIVES, so the ratified job is not quietly deleted:
 * `cells/CellDecisionStack` draws kept-versus-costs as TWO segments, terracotta
 * against cocoa. There the hue carries a real distinction, it is one hue doing
 * one job against the accent, and it has no cool sibling beside it to disagree
 * with. That bar is untouched. The rule is not "cocoa is banned from costs", it
 * is "a ladder within one category does not change hue partway up".
 *
 * The ladder, darkest to lightest, every step an existing token and a true
 * neutral (s=0%). Adjacent deltas .173 / .074 / .087 / .066, so every pair is
 * separable, against the .039 pair this replaces:
 *
 *   1  paper-400   #bfbfbf   L .5209
 *   2  paper-350   #d9d9d9   L .6938
 *   3  parchment   #e3e3e3   L .7682
 *   4  paper-200   #eeeeee   L .8550
 *   5  paper-100   #f6f6f6   L .9216
 *
 * Darkest FIRST because these lists are written largest cost first, so the
 * heaviest block reads heaviest. The fifth step is faint on a near-white card
 * and that is accepted: it is reached only by a six-line decomposition, and the
 * bar's own parchment border contains it.
 */
const COST_FILL = [
  "bg-paper-400",
  "bg-paper-350",
  "bg-parchment",
  "bg-paper-200",
  "bg-paper-100",
] as const;

export function MoneyGoesBreakdown({
  items,
  eyebrow = "Where the money goes",
  heading = "Every $100 of sales",
  lede,
  id,
  className,
}: MoneyGoesBreakdownProps) {
  const clean = items.filter(
    (it): it is MoneyGoesItem & { perHundred: number } => isNum(it.perHundred),
  );
  const total = clean.reduce((s, it) => s + it.perHundred, 0);
  // Silence out unless the items form a believable $100 decomposition.
  if (clean.length < 2 || total < 80 || total > 120) return null;

  // Normalise widths to the actual total so the bar always spans full width
  // even if the inputs sum a little off 100 (rounding).
  const widthPct = (v: number) => `${(v / total) * 100}%`;

  /* THE PRINTED COLUMN DID NOT SUM TO THE HUNDRED THE HEADING PROMISES.

     Photographed at 1280x900 on /industries/restaurants: under a heading
     reading "Every $100 of a sale" and a caption reading "Read as dollars out
     of every $100", the four rows printed $35, $55, $4 and $7. That is 101.
     /gb/london/restaurants prints $30, $34, $15, $15 and $5, which is 99. Every
     figure was right on its own and the column contradicted its own total, in a
     sum a reader does in their head without meaning to.

     The cause is that each row was rounded INDEPENDENTLY off the raw share
     while the bar directly above them was already normalised to the actual
     total and drawn full width. So the picture said "these are the parts of a
     hundred" and the numbers said otherwise.

     Largest remainder against the normalised share fixes it, and it is a
     display change rather than a data one: the shares are untouched, the bar is
     untouched, and the residue goes to the rows with the largest fractional
     parts rather than to whichever row happened to be first. It is the standard
     apportionment and it is strictly more honest than printing parts that do
     not make their stated whole.

     NORMALISING IS SAFE HERE ONLY BECAUSE THE COMPONENT ALREADY DOES IT. The
     guard above admits any total from 80 to 120, so a naive push to 100 could
     inflate a genuinely short decomposition. This does not push the DATA to
     100: it prints the same normalised share the bar has always drawn, which
     the heading and the caption both already assert. */
  const scaled = clean.map((it) => (it.perHundred / total) * 100);
  const dollars = scaled.map((v) => Math.floor(v));
  let residue = 100 - dollars.reduce((s, v) => s + v, 0);
  const byFraction = scaled
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < byFraction.length && residue > 0; k += 1, residue -= 1) {
    dollars[byFraction[k].i] += 1;
  }
  const fmtAt = (i: number) => `$${dollars[i]}`;

  // The kept slice is the answer the section is really about. Find its centre on
  // the bar so a single vermillion tick can mark it (the one focal-subject accent
  // per the chart grammar; the moss fill carries the "profit" meaning, the tick
  // carries the "look here").
  let acc = 0;
  let keptCenter: number | null = null;
  for (const it of clean) {
    const w = (it.perHundred / total) * 100;
    if (it.kept && keptCenter == null) keptCenter = acc + w / 2;
    acc += w;
  }

  let costIdx = 0;

  return (
    <section
      id={id}
      aria-label={heading}
      className={[
        // Canonical surface: was "rounded-lg border border-parchment bg-cream-50".
        "atlas-card",
        "px-5 py-5 md:px-7 md:py-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <SectionEyebrow className="mb-1">{eyebrow}</SectionEyebrow>
      <h2 className="font-display text-xl font-medium tracking-tight text-ink-900 md:text-2xl">
        {heading}
      </h2>
      {lede ? (
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-cocoa-700 md:text-base">
          {lede}
        </p>
      ) : null}

      {/* the stacked bar, with a vermillion tick marking the kept slice */}
      <div className={["relative", keptCenter != null ? "mt-9" : "mt-5"].join(" ")}>
        {keptCenter != null ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-[1.1rem] z-10 flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${Math.max(4, Math.min(96, keptCenter))}%` }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-700">
              Kept
            </span>
            <span className="mt-0.5 block h-2.5 w-[3px] rounded-sm bg-atlas-500 ring-2 ring-white" />
          </div>
        ) : null}
        <div
          className="flex h-5 w-full overflow-hidden rounded-full border border-parchment"
          role="img"
          aria-label="Stacked share of every hundred dollars of sales; the owner's kept slice is marked."
        >
          {clean.map((it, i) => {
            /* The kept slice takes the accent the "Kept" marker above it
               already uses, so the tick and the slice it points at are one
               colour. It was moss-500 until 2026-08-17, which is banned, and it
               disagreed with its own marker the whole time. */
            const fill = it.kept
              ? "bg-atlas-500"
              : COST_FILL_at(costIdx++);
            return (
              <div
                key={i}
                className={fill}
                style={{ width: widthPct(it.perHundred) }}
                title={`${it.label}: ${fmtAt(i)}`}
              />
            );
          })}
        </div>
      </div>

      {/* the ruled line-item table */}
      <dl className="mt-5 divide-y divide-parchment border-y border-parchment">
        {clean.map((it, i) => (
          <div
            key={i}
            className="flex items-baseline justify-between gap-4 py-2.5"
          >
            <dt className="min-w-0">
              <span
                className={[
                  "text-sm",
                  it.kept
                    ? "font-semibold text-atlas-700"
                    : "text-cocoa-700",
                ].join(" ")}
              >
                {it.label}
              </span>
              {it.hint ? (
                <span className="mt-0.5 block text-[11px] text-cocoa-700">
                  {it.hint}
                </span>
              ) : null}
            </dt>
            <dd
              className={[
                "shrink-0 font-display tabular-nums",
                it.kept
                  ? "text-lg font-semibold text-atlas-700"
                  : "text-base text-ink-900",
              ].join(" ")}
            >
              {fmtAt(i)}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[11px] text-cocoa-700">
        Read as dollars out of every $100 a typical firm takes in. Modeled from
        the cost structure; the local market shifts the exact split.
      </p>
    </section>
  );
}

// Cycle the cost fills without mutating the shared array; defined as a helper so
// the kept segment can break the cycle cleanly above.
function COST_FILL_at(i: number): string {
  return COST_FILL[i % COST_FILL.length];
}
