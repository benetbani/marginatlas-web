/**
 * src/components/spine/forms-v2.tsx
 *
 * CATALOG VERSION 2's VOCABULARY, IN A PLACE A PAGE CAN ACTUALLY REACH.
 *
 * Version 1 of rules/FORM-CATALOG.md had good forms in it. The catalog's own
 * entries cited `src/app/dev/spine-industry/forms.tsx` for several of them, and
 * that file was a DEV ROUTE: nothing shipping could import from it, and when the
 * route was deleted the forms went with it. So the law named shapes that no
 * builder could use, and every builder reached instead for the three drawings
 * the kit did export. All three are horizontal tracks. That is the whole
 * mechanism behind the ten trade sections the founder rejected on 2026-08-31,
 * where nine of ten readings came out as a line with a dot on it.
 *
 * This file exists so that cannot happen again. It sits in the kit's own folder,
 * beside kit.tsx, and holds four of the eight forms catalog v2 adds. Each is a
 * replacement for a reading that was being drawn as a track and never was a
 * position between two poles.
 *
 *   BenchmarkPair (I9)  one number against a reference. DRAWS NOTHING.
 *   StateWord     (I9)  a yes, a no, a not-applicable. DRAWS NOTHING.
 *   RankedTiles   (I6)  a short ranking, where the ORDER is the reading.
 *   OptionCards   (I6)  a choice among two to four comparable options.
 *
 * THE ONE RULE ALL FOUR SHARE: none of them may read as a line with a dot on it.
 * Two of the four draw nothing at all, and that is the point rather than an
 * omission. A number beside its reference is a complete answer. A word at figure
 * size is a complete answer. The urge to add a track or a meter underneath one
 * "so it looks designed" is the exact fault this file was written to end.
 *
 * WHAT THEY ALL DO WHEN THE DATA IS THIN: return null. Every input is nullable
 * and every form self-omits rather than framing an absence. A ranking of one and
 * a choice of one are not a ranking and a choice, so those return null too; the
 * form for a lone number is Stat or BenchmarkPair, in kit.tsx and here.
 *
 * TOKENS AND THE LADDER, NO EXCEPTIONS. Colour comes from the spine CSS vars
 * (SpineShell declares them), size from the eight-rung type ladder in
 * src/styles/atlas-spine.css. --t-small and --t-sub were retired when the ladder
 * was compressed on 2026-09-01 and appear nowhere below.
 *
 * WHY EVERY SPACE IS AN INLINE STYLE AND NOTHING ELSE IS. The v2 spine scope
 * carries the reset `.av2, .av2 * { margin:0; padding:0 }`. A universal selector
 * adds nothing to specificity, so `.av2 *` and Tailwind's `p-3` are BOTH (0,1,0)
 * and the winner is decided by source order alone: atlas-spine.css is imported
 * by the page and lands after globals.css, so on a real v2 route the reset takes
 * it. TradeSections.tsx found this with a screenshot and fixed only its outer
 * padding; here every structural space (the tile padding, the gaps, the rhythm
 * above a figure, the mt-auto that keeps four card feet on one line) is inline,
 * because an inline style is the only thing that outranks a descendant selector
 * without an !important. A form library that changes shape depending on which
 * scope it was dropped into is not a library. Everything that is NOT a space,
 * colour and size included, stays in tokens and utility classes.
 *
 * ACCENT IS RATIONED TO ONE THING PER FORM, and never to a hover state. The
 * leader's figure in RankedTiles, the usual choice in OptionCards, and in the
 * two silent forms an accent the caller has to ask for.
 */
import * as React from "react";

import { Fig } from "@/components/spine/kit";

/* ------------------------------------------------------------------ */
/* THE DIFFERENCE, IN WORDS                                            */
/* ------------------------------------------------------------------ */
/**
 * BenchmarkPair's whole job is to say how far apart two numbers are without
 * drawing a scale for them to sit on, which means the gap has to become English.
 *
 * IT ROUNDS TO PHRASES, NOT TO DECIMALS, for the same reason the trade sections'
 * yardstick does: "29.2% more" claims a precision neither figure has and a
 * reader cannot picture it anyway. The fraction list below is the set of
 * fractions people actually say out loud; the nearest one wins, judged in
 * RATIO space so a "third" is measured the way a reader hears it.
 *
 * THE DEAD BAND IS DELIBERATE. Inside three percent the two numbers are the
 * same as far as any of this site's sources can honestly tell, and printing
 * "about a twentieth more" off a rounded input would be a fabricated finding.
 */
const SAID_FRACTIONS: Array<[number, string]> = [
  [1 / 10, "about a tenth"],
  [1 / 8, "about an eighth"],
  [1 / 6, "about a sixth"],
  [1 / 5, "about a fifth"],
  [1 / 4, "about a quarter"],
  [1 / 3, "about a third"],
  [1 / 2, "about half"],
  [2 / 3, "about two thirds"],
  [3 / 4, "about three quarters"],
];
const TIMES_WORD = ["", "", "twice", "three times", "four times", "five times", "six times"];

export function differenceInWords(subject: number, reference: number): string {
  if (reference === 0) return "not comparable";
  const gap = (subject - reference) / Math.abs(reference);
  const size = Math.abs(gap);
  if (size < 0.03) return "the same, near enough";
  const direction = gap > 0 ? "more" : "less";
  if (size < 0.85) {
    /* NEAREST IN RATIO SPACE, WHICH IS WHAT THE PARAGRAPH ABOVE PROMISES and
       what an absolute difference does not deliver. Measured on the catalog's
       own worked example, $31 against $24: the gap is 0.29167, which sits at
       the exact arithmetic midpoint of a quarter and a third, so a subtraction
       decides it on floating-point noise and could say either on a rebuild. In
       ratio space a third is 1.14x the gap and a quarter is 0.86x of it, so a
       third wins by a margin, which is also the phrase the catalog uses. */
    let best = SAID_FRACTIONS[0];
    for (const candidate of SAID_FRACTIONS) {
      if (Math.abs(Math.log(candidate[0] / size)) < Math.abs(Math.log(best[0] / size))) best = candidate;
    }
    return `${best[1]} ${direction}`;
  }
  /* Past a certain distance a fraction stops being the way anyone says it: at
     2.4x nobody says "about one and a half more", they say "over twice". */
  if (gap < 0) return "a fraction of it";
  const multiple = subject / reference;
  const nearest = Math.round(multiple);
  if (nearest <= 6 && Math.abs(multiple - nearest) < 0.12) return `about ${TIMES_WORD[nearest]} as much`;
  const floor = Math.floor(multiple);
  if (floor <= 6) return `over ${TIMES_WORD[floor]} as much`;
  return "many times as much";
}

/* ------------------------------------------------------------------ */
/* BenchmarkPair , I9, free of every drawn budget                      */
/* ------------------------------------------------------------------ */
/**
 * ONE NUMBER AGAINST A REFERENCE, AND NOTHING IS DRAWN.
 *
 * "$31 here. The typical trade takes $24, so about a third more." That sentence
 * IS the form. The version-1 habit was to put those two numbers on a shared
 * track with a marker at each, which invents a scale (where is zero? where is
 * the top?) that neither figure came with, and which reads at a glance as the
 * same shape as a level, a ranking and a spread. Two figures and a sentence say
 * more, in less space, and cannot be misread as a position.
 *
 * DO NOT add a scale, a bar, a meter or a tick to place these on. If the reading
 * genuinely IS a position between two named poles, the form is SpectraTable and
 * the section should say which two poles.
 *
 * IT REFUSES WITHOUT THE REFERENCE. A BenchmarkPair with nothing to compare
 * against is a lone number, and the form for a lone number is Stat.
 */
export function BenchmarkPair({
  value,
  reference,
  referenceLabel,
  format = (n: number) => String(n),
  label,
  accent = false,
}: {
  /** The subject's figure. Null renders nothing. */
  value?: number | null;
  /** What it is measured against, in the same unit. Null renders nothing. */
  reference?: number | null;
  /** A noun phrase for the reference: "the typical trade", "the city median". */
  referenceLabel?: string | null;
  /** Formats both figures. Pass the kit's `usd` for money. */
  format?: (n: number) => string;
  /** Optional caption when the form stands outside a section rail. */
  label?: string | null;
  /** Marks the subject figure, the one accentable thing here. */
  accent?: boolean;
}) {
  if (value == null || !Number.isFinite(value)) return null;
  if (reference == null || !Number.isFinite(reference)) return null;
  if (!referenceLabel) return null;
  const said = differenceInWords(value, reference);
  const opener = referenceLabel.charAt(0).toUpperCase() + referenceLabel.slice(1);
  return (
    <div>
      {label ? (
        <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.06em] text-[var(--c-muted)]">
          {label}
        </div>
      ) : null}
      <div
        className="text-[length:var(--t-focal)] leading-none"
        style={{ marginTop: 2, color: accent ? "var(--terra-text)" : "var(--c-ink)" }}
      >
        <Fig>{format(value)}</Fig>
      </div>
      {/* THE REFERENCE LIVES IN THE SENTENCE, at the sentence's own size. It is
          set in the figure face so a reader's eye still registers it as a
          measurement rather than as a word, which is the only thing that has to
          survive the drop from 30 to 12. */}
      <p className="text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]" style={{ marginTop: 8 }}>
        {opener} sits at <Fig>{format(reference)}</Fig>. This is {said}.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* StateWord , I9, free of every drawn budget                          */
/* ------------------------------------------------------------------ */
/**
 * A WORD IS AN ANSWER. THIS FORM DRAWS NOTHING AT ALL.
 *
 * "Expected." "Not expected." "Not required here." Version 1 answered questions
 * like these with a meter reading 100 or 0, or with a dot pinned to one end of a
 * track, which is a continuous scale asserting itself over a binary fact and
 * takes a reader longer to decode than the word would have taken them to read.
 *
 * THE WORD IS SET IN THE SANS AT THE SECTION'S FIGURE SIZE, not in the figure
 * face: the figure face is for measurements, and this is not one. Its supporting
 * fact sits beneath at body rather than at micro, because with nothing drawn the
 * fact is the section's only evidence and should not read as fine print.
 *
 * DO NOT draw anything at all. Not a meter, not a pip, not a rule under the
 * word. If a drawing seems necessary here, the section is asking a different
 * question than the one it wrote down.
 */
export function StateWord({
  state,
  fact,
  label,
  accent = false,
}: {
  /** The state itself, already in the reader's words. Null renders nothing. */
  state?: string | null;
  /** One supporting fact. The section's only evidence, so it is not fine print. */
  fact?: React.ReactNode;
  /** Optional caption when the form stands outside a section rail. */
  label?: string | null;
  /** Marks the state word, the one accentable thing here. */
  accent?: boolean;
}) {
  if (!state) return null;
  return (
    <div>
      {label ? (
        <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.06em] text-[var(--c-muted)]">
          {label}
        </div>
      ) : null}
      <div
        className="text-[length:var(--t-focal)] leading-[1.1] tracking-[-0.01em]"
        style={{ marginTop: 4, color: accent ? "var(--terra-text)" : "var(--c-ink)" }}
      >
        {state}
      </div>
      {fact ? (
        <p className="max-w-[46ch] text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]" style={{ marginTop: 8 }}>
          {fact}
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RankedTiles , I6 tile set, shares the cap of 3                      */
/* ------------------------------------------------------------------ */
/**
 * A SHORT RANKING WHERE THE ORDER IS THE READING.
 *
 * Roles by how hard they are to fill, risks by how likely they are. Version 1
 * drew each of these as its own track with a marker on it, so four rankings on
 * one page came out as four identical lines and the reader had to read the
 * labels to tell them apart.
 *
 * THE TILES ARE ALL THE SAME SIZE, and that is the honesty of the form: it
 * claims an ORDER and claims nothing about the distances between the entries.
 * The moment a tile is sized by its value the form has become a bar chart with
 * extra steps, and bar charts have their own entry and their own budget.
 *
 * SIX IS THE CEILING. Past six a reader stops seeing an order and starts seeing
 * a wall, and the catalog sends that case to LollipopColumn, where the magnitude
 * can carry its own weight vertically.
 *
 * THE CALLER PASSES THEM ALREADY RANKED, first-best-first, and this component
 * does not sort. Half of the rankings on this site are best-when-low (risk,
 * difficulty, cost) and a component that sorted would have to guess a direction
 * it was never told.
 *
 * DO NOT size the tiles by value, and do not number them: the position IS the
 * rank, and an ordered list carries that to a screen reader for free.
 */
export type RankedTile = {
  /** The entry's name. An entry without one is dropped. */
  name?: string | null;
  /** Its figure, already formatted. An entry without one is dropped. */
  value?: React.ReactNode;
};

export function RankedTiles({ rows, ariaLabel }: { rows?: Array<RankedTile | null | undefined> | null; ariaLabel?: string }) {
  const kept = (rows ?? [])
    .filter((r): r is RankedTile => r != null && !!r.name && r.value != null && r.value !== "")
    .slice(0, 6);
  /* A RANKING OF ONE IS NOT A RANKING. One named thing with a figure is a Stat,
     and drawing a lone tile would imply five siblings that were withheld. */
  if (kept.length < 2) return null;
  return (
    <ol
      aria-label={ariaLabel}
      className="grid"
      style={{ listStyle: "none", margin: 0, padding: 0, gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(136px, 1fr))" }}
    >
      {kept.map((row, i) => (
        <li
          key={`${row.name}-${i}`}
          className="rounded-[10px]"
          /* Inline, not p-2.5: the .av2 reset outranks the utility class. */
          style={{ background: "var(--c-soft)", padding: "9px 11px" }}
        >
          <div className="truncate text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)]" title={row.name ?? undefined}>
            {row.name}
          </div>
          {/* THE LEADER TAKES THE ACCENT AND THE REST ARE INK, which is the
              whole of the colour in this form. The tile GROUND stays identical
              across all six on purpose: a warmer box would start to read as a
              bigger box, and size is the one thing these tiles must not say. */}
          <div
            className="text-[length:var(--t-head)] leading-none"
            style={{ marginTop: 2, color: i === 0 ? "var(--terra-text)" : "var(--c-ink)" }}
          >
            <Fig>{row.value}</Fig>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* OptionCards , I6 tile set, shares the cap of 3                      */
/* ------------------------------------------------------------------ */
/**
 * A CHOICE AMONG COMPARABLE OPTIONS: legal forms, packages, tiers.
 *
 * Version 1 rendered these as rows on a shared scale, which said the options
 * were points on one continuum and that the rightmost was the most of something.
 * They are not and it is not. A sole trader is not a worse limited company; it
 * is a different answer to the same question, and the reader is choosing rather
 * than measuring.
 *
 * SO THE CARDS DO NOT SHARE AN AXIS. Each holds its name, the ONE figure that
 * distinguishes it, and one line of what that means. Four is the ceiling: past
 * four the reader is no longer choosing, they are searching, and the form for
 * searching is a table.
 *
 * THE USUAL CHOICE IS MARKED, once, because the single most useful thing this
 * site can say about a menu of options is which one most people in this trade
 * and this place actually take. That mark is this form's one accent.
 *
 * DO NOT rank them on a scale, and do not exceed four. Passing five is not
 * silently truncated, because truncation would drop an option the reader needed
 * and say nothing about it; the form refuses instead, and the section is
 * re-framed as a table.
 */
export type OptionCard = {
  /** The option's name. An option without one is dropped. */
  name?: string | null;
  /** Its one distinguishing figure, already formatted. */
  figure?: React.ReactNode;
  /** What that figure counts: "a year", "of profit". Optional. */
  unit?: string | null;
  /** One line of what choosing it means. Optional but close to mandatory. */
  means?: string | null;
  /** The one most operators here take. At most one card should carry it. */
  usual?: boolean;
};

export function OptionCards({ options, ariaLabel }: { options?: Array<OptionCard | null | undefined> | null; ariaLabel?: string }) {
  const kept = (options ?? []).filter(
    (o): o is OptionCard => o != null && !!o.name && o.figure != null && o.figure !== "",
  );
  /* TWO TO FOUR, AND THE BOUNDS ARE BOTH REFUSALS. One option is not a choice;
     five is a table wearing this form's clothes. */
  if (kept.length < 2 || kept.length > 4) return null;
  /* One mark, even if a caller flags two. The first flagged card keeps it. */
  const usualAt = kept.findIndex((o) => o.usual === true);
  return (
    <ul
      aria-label={ariaLabel}
      className="grid"
      /* THE WRAP POINT IS MEASURED, NOT GUESSED, and the first value was wrong.
         At 158px, three options in a half-band card came out two-up with the
         third orphaned on a row of its own: 3 x 158 + 2 x 10 is 494 against the
         481px a 1280 half-band leaves inside a Box, so the grid dropped to two
         columns by four pixels. A form whose entry says "side by side" must not
         break its own line over arithmetic. 120px puts three in a row in a half
         band and four in a row in a full one; auto-fit collapses the empty
         tracks and 1fr shares the width out, so no card ever renders AT 120,
         which is only ever the point at which wrapping is better than reading. */
      style={{ listStyle: "none", margin: 0, padding: 0, gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))" }}
    >
      {kept.map((option, i) => {
        const isUsual = i === usualAt;
        return (
          <li
            key={`${option.name}-${i}`}
            className="flex h-full flex-col rounded-xl border"
            /* Outlined and unfilled, against RankedTiles' filled and unbordered
               tiles: two forms that share an idea must not share a silhouette. */
            style={{
              borderColor: isUsual ? "var(--terra-border)" : "var(--c-border)",
              padding: "12px 13px 11px",
            }}
          >
            <div className="text-[length:var(--t-body)] font-medium leading-snug text-[var(--c-ink)]">
              {option.name}
            </div>
            <div className="flex items-baseline" style={{ marginTop: 6, gap: 6 }}>
              <span className="text-[length:var(--t-head)] leading-none text-[var(--c-ink)]">
                <Fig>{option.figure}</Fig>
              </span>
              {option.unit ? (
                <span className="text-[length:var(--t-micro)] leading-none text-[var(--c-muted)]">{option.unit}</span>
              ) : null}
            </div>
            {/* THE MARK SITS UNDER THE FIGURE, WHICH A PHOTOGRAPH DECIDED. It was
                on the name's row, opposite the name, and at three cards to a
                half-band there is not room for both: "Limited company" pushed the
                tag onto a second line, which pushed that card's figure a line
                below its two neighbours' and broke the row a reader scans
                across. Under the figure it disturbs no alignment at all, because
                only one card in the set ever carries it. */}
            {isUsual ? (
              <div
                className="text-[length:var(--t-mark)] font-semibold uppercase tracking-[0.1em] text-[var(--terra-text)]"
                style={{ marginTop: 6 }}
              >
                Usual choice
              </div>
            ) : null}
            {/* THE FOOT IS PUSHED DOWN so the hairlines line up across cards of
                different prose lengths. Grid children already stretch to a
                common height; without mt-auto the rules would stagger. */}
            {option.means ? (
              <p
                className="border-t border-[var(--c-border)] text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)]"
                style={{ marginTop: "auto", paddingTop: 8 }}
              >
                {option.means}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
