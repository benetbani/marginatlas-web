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
 * beside kit.tsx, and holds all eight forms catalog v2 adds. Each is a
 * replacement for a reading that was being drawn as a track and never was a
 * position between two poles.
 *
 *   BenchmarkPair  (I9)  one number against a reference. DRAWS NOTHING.
 *   StateWord      (I9)  a yes, a no, a not-applicable. DRAWS NOTHING.
 *   RankedTiles    (I6)  a short ranking, where the ORDER is the reading.
 *   OptionCards    (I6)  a choice among two to four comparable options.
 *   LollipopColumn (I2)  a longer ranking, where the MAGNITUDE matters too.
 *   StepLadder     (I6)  a level on a ladder whose rungs have meanings.
 *   ThresholdBlock (I2)  what must be cleared, and what a period gives.
 *   RangeBracket   (I6)  a low, a high, and the typical held between them.
 *
 * THE ONE RULE ALL EIGHT SHARE: none of them may read as a line with a dot on
 * it. Two of the first four draw nothing at all, and that is the point rather
 * than an omission. A number beside its reference is a complete answer. A word
 * at figure size is a complete answer. The urge to add a track or a meter
 * underneath one "so it looks designed" is the exact fault this file was
 * written to end.
 *
 * THE SECOND FOUR DRAW, WHICH IS WHERE THE TEMPTATION IS STRONGEST. A form that
 * draws nothing cannot become a track by accident. A form that draws a length or
 * a position can, and from each of these four briefs the rejected shape is one
 * lazy decision away:
 *
 *   LollipopColumn  lay it on its side, and it is markers on a rail.
 *   StepLadder      join the steps up, and it is a track with a marker on it.
 *   ThresholdBlock  draw one bar and tick the threshold onto it, the same.
 *   RangeBracket    fill the middle, or rule a line end to end, the same.
 *
 * So each is built to make its own lazy decision awkward rather than merely
 * forbidden: the lollipop's stems stand up from a drawn zero line and its dots
 * ride above them, the ladder's steps are separated blocks that climb, the
 * threshold draws two lengths and no marker anywhere at all, and the bracket's
 * ends turn inward across open air that nothing crosses.
 *
 * EVERY FORM DECLARES ITS OWN VISUAL IDEA on its outermost element, as
 * data-idea="I2".."I9". scripts/verify_form_variety.mjs enforces the catalog's
 * per-page cap on each IDEA by counting those attributes on a rendered page,
 * because a machine cannot see that two drawings are the same shape: the shape
 * has to name itself. A form without the tag is invisible to that gate and its
 * page's budget is unenforced, which is why all eight carry it rather than only
 * the four added second.
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
 * leader's figure in RankedTiles, the leader's dot in LollipopColumn, the usual
 * choice in OptionCards, the reached step in StepLadder, the subject's own bar
 * in ThresholdBlock; and in the two silent forms and in RangeBracket, an accent
 * the caller has to ask for, because those three are the ones a section is
 * likeliest to place beside a figure that has already claimed the box's orange.
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
    <div data-idea="I9">
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
    <div data-idea="I9">
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
      data-idea="I6"
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
      data-idea="I6"
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

/* ------------------------------------------------------------------ */
/* LollipopColumn , I2 bar set, shares the cap of 3                    */
/* ------------------------------------------------------------------ */
/**
 * A RANKING WHOSE MAGNITUDES MATTER, STOOD UP ON END.
 *
 * RankedTiles is the form when the ORDER is the whole reading. Some rankings
 * are not like that: the gap between the top rent and the second rent is the
 * finding, and a set of equal tiles throws that away. The version-1 answer was
 * a row of horizontal bars, which is legal and which is also the single most
 * repeated shape on this site, so on a page already carrying a cost stack and a
 * break-even it is the third and fourth appearance of one silhouette.
 *
 * SO THIS ONE STANDS UP, AND THAT IS THE ENTIRE POINT OF THE FORM. The catalog
 * entry says it in four words, "do not rotate it", because a lollipop laid on
 * its side is a row of markers on rails, which is precisely the shape the
 * founder rejected. Vertical stems from a drawn zero line read differently from
 * every horizontal form on the page even at thumbnail size, and a thumbnail is
 * what this catalog version is being judged at.
 *
 * THE DOT IS ON TOP OF ITS STEM AND NEVER ON A TRACK. A dot ON a line says
 * "somewhere between these two ends". A dot ABOVE a baseline, at the top of a
 * stem that starts at zero, says "this much". Those are different sentences, so
 * the drawings have to be different too.
 *
 * THE ZERO LINE IS DRAWN ONCE ACROSS THE WHOLE SET, not per column: a baseline
 * broken by the gaps between columns stops reading as an axis and starts
 * reading as underlining. Every stem is measured from it against the largest
 * value in the set, so the tallest always reaches the top and the comparison is
 * between the entries rather than against a ceiling nobody stated.
 *
 * THE CALLER PASSES THEM ALREADY RANKED, as in RankedTiles and for the same
 * reason: half of this site's rankings are best-when-low and a component that
 * sorted would be guessing a direction nobody told it.
 *
 * DO NOT rotate it to horizontal, do not fill the area under the stems, and do
 * not draw a second line joining the dots. Each of those turns the form back
 * into something the page already has.
 */
export type LollipopEntry = {
  /** The entry's name, set beneath its stem. An entry without one is dropped. */
  name?: string | null;
  /** Its magnitude on a zero baseline. Non-finite or negative drops the entry. */
  value?: number | null;
};

export function LollipopColumn({
  rows,
  format = (n: number) => String(n),
  ariaLabel,
}: {
  /** The entries, already in rank order. Null renders nothing. */
  rows?: Array<LollipopEntry | null | undefined> | null;
  /** Formats every figure. Pass the kit's `usd` for money. */
  format?: (n: number) => string;
  /** Names the ranking for a screen reader: what is ranked, and which way. */
  ariaLabel?: string;
}) {
  const kept = (rows ?? [])
    .filter(
      (r): r is LollipopEntry & { value: number } =>
        r != null && !!r.name && r.value != null && Number.isFinite(r.value) && r.value >= 0,
    )
    .slice(0, 10);
  /* FOUR IS THE FLOOR AND THE CATALOG SET IT: use this "when a ranking's
     MAGNITUDE matters and there are more than four entries". Three stems are
     two comparisons, which a tile set says in less room and with no axis to
     learn. Five and six are deliberately legal in BOTH forms, because at that
     size the honest question is whether the distances matter and only the
     section knows. TEN IS THE CEILING, and it is a measurement rather than a
     taste: the names sit under the columns at the 12px read floor, and in a
     half-band card at 1280 an eleventh column leaves under 40px of name. */
  if (kept.length < 4) return null;
  const max = Math.max(...kept.map((r) => r.value));
  /* An all-zero set has nothing to draw and no honest ceiling to draw it
     against, so it self-omits rather than rendering ten bald dots sitting in a
     row on the zero line, which would be the rejected shape exactly. */
  if (max <= 0) return null;
  /* The stem's full height, the dot's diameter, and the room the figure above
     the dot needs. HEAD is fixed for every column, so all ten feet land on the
     one drawn line and all ten names start on one row. */
  const STEM = 92;
  const DOT = 9;
  const HEAD = STEM + DOT + 18;
  return (
    <div data-idea="I2" style={{ position: "relative" }}>
      {/* THE ZERO LINE: one element spanning the set, sitting exactly at the
          foot of every stem. Not a border on each column, because the column
          gap would cut it into dashes. */}
      <div
        aria-hidden
        style={{ position: "absolute", left: 0, right: 0, top: HEAD, height: 1, background: "var(--c-line-strong)" }}
      />
      <ol
        aria-label={ariaLabel}
        className="grid"
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          gridAutoFlow: "column",
          gridAutoColumns: "minmax(0, 1fr)",
          columnGap: 6,
        }}
      >
        {kept.map((row, i) => (
          <li key={`${row.name}-${i}`} style={{ minWidth: 0 }}>
            <div
              style={{
                height: HEAD,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <div
                className="text-[length:var(--t-micro)] leading-none"
                /* THE LEADER TAKES THE ACCENT, on its dot and on its own
                   figure, and that pair is the whole of the colour here. */
                style={{ marginBottom: 4, color: i === 0 ? "var(--terra-text)" : "var(--c-ink2)" }}
              >
                <Fig>{format(row.value)}</Fig>
              </div>
              <div
                aria-hidden
                style={{
                  width: DOT,
                  height: DOT,
                  borderRadius: "50%",
                  background: i === 0 ? "var(--terra)" : "var(--c-ink)",
                }}
              />
              {/* The stem stays thin on purpose: thicken it and the set becomes
                  a bar chart, which has its own entry and its own budget. */}
              <div
                aria-hidden
                style={{ width: 2, height: Math.round((row.value / max) * STEM), background: "var(--c-line-strong)" }}
              />
            </div>
            <div
              className="text-center text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]"
              style={{ paddingTop: 7 }}
            >
              {row.name}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* StepLadder , I6 tile set, shares the cap of 3                       */
/* ------------------------------------------------------------------ */
/**
 * A LEVEL ON A LADDER WHOSE RUNGS HAVE MEANINGS, AND ALL OF THEM ARE DRAWN.
 *
 * "How hard is this trade to enter" has about five real answers and they are
 * not five points on a continuum: learn it on the job, train in a week, take a
 * short course, hold a licence, serve an apprenticeship. Version 1 drew that as
 * a marker three fifths of the way along a track, which claims a precision that
 * does not exist (there is no such thing as 62 percent of a licence) and which
 * hides four of the five answers, since a reader can see the position but never
 * learns what the positions are.
 *
 * SO EVERY STEP IS DRAWN AND EVERY STEP CARRIES ITS OWN WORDS. The reader sees
 * where this trade sits AND what the rungs above and below it would have meant,
 * which is most of the value in the reading and all of what the track threw
 * away.
 *
 * THE BLOCKS CLIMB, AND NOTHING JOINS THEM UP. The rise is a fixed offset per
 * step, identical whatever the values are, so it says ORDER and never
 * magnitude; every block is the same size, which is what keeps this a tile set
 * rather than a bar chart with its numbers hidden. No baseline is drawn beneath
 * them for the same reason: a rule under a row of climbing blocks turns them
 * into columns of increasing height and re-tells the lie.
 *
 * IT REFUSES A LADDER WITH A HOLE IN IT. A missing step is not dropped and the
 * rest closed up, because closing up silently renumbers every rung and moves
 * the reached one to somewhere it is not. Three to six steps: below three there
 * is no ladder to climb, above six a reader is counting rather than reading,
 * and the form for a long ordered set is a table.
 *
 * DO NOT join the steps into a continuous track, and do not size them by
 * anything at all. Both turn this back into the shape it replaces.
 */
export function StepLadder({
  steps,
  reached,
  ariaLabel,
}: {
  /** The rungs' own words, first to last. Any missing one refuses the form. */
  steps?: Array<string | null | undefined> | null;
  /** Which rung this subject is on, counting from 1. Null renders nothing. */
  reached?: number | null;
  /** Names the ladder for a screen reader: what its rungs measure. */
  ariaLabel?: string;
}) {
  const rungs = steps ?? [];
  if (rungs.length < 3 || rungs.length > 6) return null;
  if (rungs.some((s) => typeof s !== "string" || s.trim() === "")) return null;
  if (reached == null || !Number.isInteger(reached) || reached < 1 || reached > rungs.length) return null;
  /* The block, and how far each one climbs above the last. HEAD is the tallest
     column's total, so the words beneath every block start on one line. */
  const BLOCK = 30;
  const RISE = 9;
  const HEAD = BLOCK + (rungs.length - 1) * RISE;
  return (
    <div data-idea="I6">
      <ol
        aria-label={ariaLabel}
        className="grid"
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          gridAutoFlow: "column",
          gridAutoColumns: "minmax(0, 1fr)",
          columnGap: 8,
        }}
      >
        {rungs.map((words, i) => {
          const here = i === reached - 1;
          return (
            <li key={`${words}-${i}`} aria-current={here ? "step" : undefined} style={{ minWidth: 0 }}>
              <div
                style={{
                  height: HEAD,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  paddingBottom: i * RISE,
                }}
              >
                <div
                  style={{
                    height: BLOCK,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                    border: "1px solid",
                    /* REACHED IS FILLED AND THE REST ARE HOLLOW, which is the
                       catalog's own anatomy and this form's one accent. The
                       ordinal inside the filled block stays ink rather than
                       going white: terracotta is a light fill and white on it
                       fails at 10px, which is the size an ordinal is. */
                    borderColor: here ? "var(--terra)" : "var(--c-border)",
                    background: here ? "var(--terra)" : "transparent",
                  }}
                >
                  <span
                    className="text-[length:var(--t-mark)] font-semibold leading-none"
                    style={{ color: here ? "var(--c-ink)" : "var(--c-muted)" }}
                  >
                    <Fig>{i + 1}</Fig>
                  </span>
                </div>
              </div>
              <div
                className="text-center text-[length:var(--t-micro)] leading-snug"
                style={{ paddingTop: 7, color: here ? "var(--c-ink)" : "var(--c-ink2)" }}
              >
                {words}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ThresholdBlock , I2 bar set, shares the cap of 3                    */
/* ------------------------------------------------------------------ */
/**
 * WHAT MUST BE CLEARED, AND WHAT A TYPICAL PERIOD ACTUALLY GIVES.
 *
 * Break-even is the reading this site exists to deliver, and version 1 drew it
 * as one bar with a tick on it, which is a track wearing a bar's clothes: the
 * eye has to find the tick, decide which side of it the fill ends on, and only
 * then learn whether the business covers its costs. Two lengths from one
 * baseline answer that before the reader has finished looking, because a longer
 * second bar IS the answer and needs no decoding at all.
 *
 * NO MARKER IS DRAWN ANYWHERE IN THIS FORM. That is the catalog's DO NOT
 * verbatim, and it is also the only thing standing between this and the
 * rejected shape: one bar plus one tick is a track, whatever it gets called.
 *
 * THERE IS NO EMPTY RAIL BEHIND EITHER BAR EITHER. A grey full-width track with
 * a filled portion in front of it is the meter this catalog version retired,
 * and it would put a right-hand end on the drawing that no data supports. Both
 * bars are measured against the larger of the two, so one of them always
 * reaches the full width and the comparison is between them and nothing else.
 *
 * THE GAP IS SAID IN WORDS, which is where the reading actually lands. The
 * default sentence is composed from the two figures with the same
 * fraction-rounding BenchmarkPair uses, so "clears it by $4.7K" is followed by
 * a phrase a reader can picture; inside the dead band it says the two land in
 * the same place rather than inventing a difference out of rounding.
 *
 * DO NOT draw one bar with a marker on it. DO NOT stack these two into a single
 * bar: they are not parts of a whole, they are two measurements of one thing.
 */
export function ThresholdBlock({
  needed,
  given,
  neededLabel,
  givenLabel,
  format = (n: number) => String(n),
  note,
}: {
  /** What has to be cleared. Null, non-finite or not above zero renders nothing. */
  needed?: number | null;
  /** What a typical period gives, in the same unit. Null renders nothing. */
  given?: number | null;
  /** Names the threshold: "break-even needs", "the licence demands". */
  neededLabel?: string | null;
  /** Names the subject: "a typical month takes". */
  givenLabel?: string | null;
  /** Formats both figures. Pass the kit's `usd` for money. */
  format?: (n: number) => string;
  /** Replaces the composed sentence where the section has better words. */
  note?: React.ReactNode;
}) {
  if (needed == null || !Number.isFinite(needed) || needed <= 0) return null;
  if (given == null || !Number.isFinite(given) || given < 0) return null;
  if (!neededLabel || !givenLabel) return null;
  const domain = Math.max(needed, given);
  const said = differenceInWords(given, needed);
  const composed =
    said === "the same, near enough"
      ? "The two land in the same place, near enough."
      : `${given >= needed ? "Clears it by" : "Falls short by"} ${format(Math.abs(given - needed))}. That is ${said}.`;
  /* The subject is drawn SECOND, beneath the line it has to clear, because that
     is the order a reader asks the question in: what does this need, and does
     it get there. It is also the row that carries the form's one accent. */
  const bars: Array<[string, number, boolean]> = [
    [neededLabel, needed, false],
    [givenLabel, given, true],
  ];
  return (
    <div data-idea="I2">
      {bars.map(([label, value, subject], i) => (
        <div key={label} style={{ marginTop: i === 0 ? 0 : 14 }}>
          <div className="flex items-baseline justify-between" style={{ gap: 12 }}>
            <span className="text-[length:var(--t-micro)] leading-none text-[var(--c-muted)]">{label}</span>
            <span className="text-[length:var(--t-head)] leading-none text-[var(--c-ink)]">
              <Fig>{format(value)}</Fig>
            </span>
          </div>
          {/* A minimum width, so a real but tiny value still draws something
              rather than vanishing and reading as a bar that failed to render. */}
          <div
            aria-hidden
            style={{
              marginTop: 6,
              height: 13,
              width: `${(value / domain) * 100}%`,
              minWidth: 3,
              borderRadius: 3,
              background: subject ? "var(--terra)" : "var(--c-line-strong)",
            }}
          />
        </div>
      ))}
      <p className="text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]" style={{ marginTop: 12 }}>
        {note ?? composed}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RangeBracket , I6 tile set, shares the cap of 3                     */
/* ------------------------------------------------------------------ */
/**
 * A LOW, A HIGH, AND THE TYPICAL HELD BETWEEN THEM, DRAWN AS A BRACKET.
 *
 * What it costs to open is a range and this site refuses to pretend otherwise.
 * The trouble is that every obvious drawing of a range is the rejected shape: a
 * filled span is a bar, a rule between two ticks with a dot on it is a track,
 * and a gradient between the ends asserts a direction the data has not got.
 *
 * A BRACKET IS THE ONE DRAWING THAT SAYS "BETWEEN" WITHOUT DRAWING A SCALE.
 * Both ends TURN INWARD, which is what makes the shape read as an enclosure
 * rather than as two loose ticks; the middle is OPEN AIR with nothing crossing
 * it, which is what stops it reading as a track; and the typical stands inside
 * as a NUMERAL rather than as a dot, because a dot inside a span is the exact
 * habit this file exists to break.
 *
 * THE NUMERAL'S POSITION IS ITS ONLY MARK, so it is anchored honestly. Near the
 * middle it is centred on its own value; within a fifth of either end it is
 * anchored by that edge instead, so a typical sitting close to the low end hugs
 * the low arm and can never overhang the bracket it belongs inside. The
 * alternative, clamping the position away from the ends, moves a real value to
 * a place it is not, and a form built to be honest about a range must not lie
 * about where inside the range the typical falls.
 *
 * IT REFUSES A TYPICAL FROM OUTSIDE ITS OWN RANGE rather than clamping it to an
 * end, because a typical above the high is a fault upstream and drawing it at
 * the high would hide that fault and publish a wrong number.
 *
 * DO NOT fill the interior, which makes it a bar. DO NOT rule a line from arm
 * to arm, which makes it a track. DO NOT swap the numeral for a dot.
 */
export function RangeBracket({
  lo,
  hi,
  typical,
  format = (n: number) => String(n),
  caption = "typical",
  endLabels = ["low", "high"],
  accent = false,
}: {
  /** The bottom of the honest range. Null renders nothing. */
  lo?: number | null;
  /** The top of it. Must be above `lo`, or nothing renders. */
  hi?: number | null;
  /** The typical, which must fall inside the range. Null renders nothing. */
  typical?: number | null;
  /** Formats every figure. Pass the kit's `usd` for money. */
  format?: (n: number) => string;
  /** The word under the numeral inside the bracket. */
  caption?: string | null;
  /** What the two ends are called: "cheapest" and "dearest", say. */
  endLabels?: [string, string];
  /** Marks the typical, the one accentable thing here. */
  accent?: boolean;
}) {
  if (lo == null || !Number.isFinite(lo)) return null;
  if (hi == null || !Number.isFinite(hi) || hi <= lo) return null;
  if (typical == null || !Number.isFinite(typical)) return null;
  if (typical < lo || typical > hi) return null;
  /* ARM is how far each end turns inward, OPEN the height of the air between
     the turns. The bracket is deliberately tall: a short one starts to read as
     a pair of ticks on a missing rail, which is the shape being avoided. */
  const ARM = 11;
  const OPEN = 52;
  const at = (typical - lo) / (hi - lo);
  const anchor = at < 0.2 ? "translateX(0)" : at > 0.8 ? "translateX(-100%)" : "translateX(-50%)";
  /* TWO PIXELS, WHICH A PHOTOGRAPH DECIDED. Drawn at the site's 1px hairline
     the arms came out as four faint ticks with a gap between them, which is
     the one reading this form cannot afford: a bracket that does not read as a
     bracket reads as the ends of a rail whose middle failed to render. This is
     a DRAWN MARK and not a card edge, so it takes the same weight as the
     lollipop's stem rather than the weight of a border. */
  const rule = "2px solid var(--c-line-strong)";
  return (
    <div
      data-idea="I6"
      role="img"
      aria-label={`${format(typical)} ${caption ?? "typical"}, between ${format(lo)} and ${format(hi)}`}
    >
      <div style={{ position: "relative", height: OPEN }}>
        <div
          aria-hidden
          style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: ARM, borderLeft: rule, borderTop: rule, borderBottom: rule }}
        />
        <div
          aria-hidden
          style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: ARM, borderRight: rule, borderTop: rule, borderBottom: rule }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            /* Measured from INSIDE the arms, so the numeral can never land on
               top of one of the turns. */
            left: `calc(${ARM}px + (100% - ${ARM * 2}px) * ${at.toFixed(4)})`,
            transform: `translateY(-50%) ${anchor}`,
            whiteSpace: "nowrap",
          }}
        >
          <div
            className="text-[length:var(--t-head)] leading-none"
            style={{ color: accent ? "var(--terra-text)" : "var(--c-ink)" }}
          >
            <Fig>{format(typical)}</Fig>
          </div>
          {caption ? (
            <div className="text-[length:var(--t-micro)] leading-none text-[var(--c-muted)]" style={{ marginTop: 5 }}>
              {caption}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex items-baseline justify-between" style={{ marginTop: 7, gap: 12 }}>
        <span className="text-[length:var(--t-micro)] leading-none text-[var(--c-muted)]">
          <Fig>{format(lo)}</Fig> {endLabels[0]}
        </span>
        <span className="text-[length:var(--t-micro)] leading-none text-[var(--c-muted)]">
          <Fig>{format(hi)}</Fig> {endLabels[1]}
        </span>
      </div>
    </div>
  );
}
