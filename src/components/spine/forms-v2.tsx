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
 *   BenchmarkPair  (I9)  one number, with its verdict on the same baseline.
 *   StateWord      (I9)  a yes, a no, a not-applicable, as a marked status row.
 *   RankedTiles    (I6)  a short ranking, where the ORDER is the reading.
 *   OptionCards    (I6)  a choice among two to four comparable options.
 *   LollipopColumn (I2)  a longer ranking, where the MAGNITUDE matters too.
 *   StepLadder     (I6)  a level on a ladder whose rungs have meanings.
 *   ClearanceRing  (I7)  what must be cleared, and whether a period clears it.
 *   RangeBracket   (I6)  a low, a high, and the typical held between them.
 *
 * THE ONE RULE ALL EIGHT SHARE: none of them may read as a line with a dot on
 * it.
 *
 * WHAT VERSION 3 STRUCK, 2026-09-01, and it was written in this header as law.
 * The two lines above used to end "DRAWS NOTHING", and the paragraph here used
 * to argue that a number beside its reference and a word at figure size were
 * each a complete answer. The founder saw all eight rendered and kept one:
 * "with the exception of the lollipop form, all the other ones are completely
 * mediocre slop... the design is very unnatural and not expected." He is right
 * about these two, and the reason is diagnosable. A reader looking at a figure
 * beside a sentence is not being SHOWN a relationship, only told about one, and
 * "a word at figure size" is a fallback dressed as a principle. Neither of them
 * carries a quantity, so neither gets a chart. Both get a COMPOSITION instead,
 * which is the thing a stated purpose never specifies: what sits where, what
 * shares a baseline, and which adjacency carries the meaning. The lollipop
 * survived because it was the only one of the eight that was DRAWN, and a
 * drawing is not the same claim as a chart.
 *
 * THE SECOND FOUR DRAW, WHICH IS WHERE THE TEMPTATION IS STRONGEST. A form that
 * draws nothing cannot become a track by accident. A form that draws a length or
 * a position can, and from each of these four briefs the rejected shape is one
 * lazy decision away:
 *
 *   LollipopColumn  lay it on its side, and it is markers on a rail.
 *   StepLadder      hang ONE marker off the connector, and it is a track.
 *   ClearanceRing   put a tick on the closed ring, and it is a track bent round.
 *   RangeBracket    fill the middle, or rule a line end to end, the same.
 *
 * So each is built to make its own lazy decision awkward rather than merely
 * forbidden: the lollipop's stems stand up from a drawn zero line and its dots
 * ride above them, the ladder runs its connector DOWN through a marker for
 * every named rung so no marker's position is the reading, the clearance ring
 * carries no mark at all and lets a second lap outside it say what a mark would
 * have said, and the bracket's ends turn inward across open air that nothing
 * crosses.
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
 * choice in OptionCards, the reached rung in StepLadder, the closed sweep in
 * ClearanceRing; and in the two silent forms and in RangeBracket, an accent
 * the caller has to ask for, because those three are the ones a section is
 * likeliest to place beside a figure that has already claimed the box's orange.
 */
import * as React from "react";

import { Fig } from "@/components/spine/kit";
/* THE BOUGHT COMPONENT, NOT A HAND-ROLLED PILL. Founder, 2026-09-01: "always
   try to stick with the components that we have from shadcn." BenchmarkPair's
   verdict is a real Badge: its radius, its 12px semibold, its tracking and its
   focus ring all come from src/components/ui/badge.tsx, and only the surface
   colours are re-skinned to the spine's tokens through className, which is what
   twMerge in `cn` is there for.
   ITS PADDING IS PASSED INLINE, and that is not a style preference. The v2
   scope carries `.av2, .av2 * {margin:0;padding:0}` (atlas-spine.css:142), a
   descendant selector at the same specificity as any utility class and later in
   source order, so a Badge dropped into a v2 route loses its px-2.5 py-0.5 and
   collapses to a text-sized sliver with a border. The header above says every
   structural space in this file is inline for exactly this reason; the bought
   component's own padding is no exception to it. */
import { Badge } from "@/components/ui/badge";
/* THE BOUGHT CARD, for the same founder instruction and with the same caveat.
   OptionCards is built from Card / CardHeader / CardTitle / CardContent rather
   than from a hand-rolled bordered div, and every one of their paddings is
   re-passed inline for the reason recorded above the Badge import. */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
/* THE DIRECTION, AS A SHAPE                                           */
/* ------------------------------------------------------------------ */
/**
 * WHICH WAY THE GAP RUNS, on the same dead band the words use.
 *
 * It is a separate function from differenceInWords because the badge needs the
 * direction as a SHAPE and the sentence needs it as a word, and deriving the
 * shape by reading the string back out ("does it end in 'more'?") would be a
 * parser sitting between two functions that both already have the numbers.
 * DEAD_BAND is shared so the two can never disagree about what counts as level.
 */
const DEAD_BAND = 0.03;
type Direction = "up" | "down" | "level";

function directionOf(subject: number, reference: number): Direction {
  if (reference === 0) return "level";
  const gap = (subject - reference) / Math.abs(reference);
  if (Math.abs(gap) < DEAD_BAND) return "level";
  return gap > 0 ? "up" : "down";
}

/**
 * THE MARK IN THE BADGE. A solid triangle up or down, a bar for level, drawn in
 * currentColor so it takes whichever ink the badge is wearing and can never
 * become a second accent by itself. It is aria-hidden: the badge's words
 * already say "more" or "less", so a screen reader that also announced the
 * triangle would hear the direction twice.
 */
function DirectionMark({ direction }: { direction: Direction }) {
  return (
    <svg aria-hidden width="9" height="9" viewBox="0 0 9 9" style={{ display: "block", flex: "none" }}>
      {direction === "level" ? (
        <rect x="0" y="3.75" width="9" height="1.5" fill="currentColor" />
      ) : (
        <polygon points={direction === "up" ? "4.5,0.6 9,7.6 0,7.6" : "4.5,8.4 0,1.4 9,1.4"} fill="currentColor" />
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* BenchmarkPair , I9, free of every drawn budget                      */
/* ------------------------------------------------------------------ */
/**
 * THE FIGURE AND ITS VERDICT ON ONE BASELINE.
 *
 * Three lines, and the middle one is the form:
 *
 *   WHAT A TABLE SPENDS            <- the label, micro caps, muted
 *   $31  [^ about a third more]    <- ONE baseline row: figure, then verdict
 *   against $24, the typical trade <- the basis, micro muted, named once
 *
 * WHAT THIS REPLACES AND WHY. Version 2 set the figure at focal and then wrote
 * the comparison out as a sentence underneath: "The typical trade in this city
 * sits at $24. This is about a third more." Every fact was present and none of
 * it was composed, so the founder read it as text at three sizes in a rounded
 * rectangle, which is what it was. The gap between $31 and $24 is the whole
 * reading, and a clause is the one place a reading can hide.
 *
 * SO THE COMPARISON BECOMES AN OBJECT. The verdict is a Badge, sitting on the
 * figure's own baseline and a hand's width to its right, close enough that the
 * eye takes the two in as one thing rather than as a number and then a remark
 * about it. That adjacency is the entire design: number, verdict, and only then
 * what it was measured against. It is also the best-solved shape in dashboard
 * work, which is a reason to use it rather than a reason to avoid it.
 *
 * WHY THE ROW ALIGNS ON THE BASELINE AND NOT ON CENTRES. A 30px figure and a
 * 26px pill centred against each other float: neither sits on anything, and the
 * pair reads as two objects that happen to be side by side. Aligned on the
 * baseline they stand on one invisible line, which is what "one object" means
 * typographically, and it is the same claim the lollipop makes by drawing its
 * zero line: things that share a baseline are being compared.
 *
 * DO NOT add a scale, a bar, a meter or a tick for these two figures to sit on.
 * Neither of them came with a zero and neither came with a ceiling. If the
 * reading genuinely IS a position between two named poles, the form is
 * SpectraTable and the section should say which two poles.
 *
 * IT REFUSES WITHOUT THE REFERENCE, and refuses on a zero one. A BenchmarkPair
 * with nothing to compare against is a lone number, and the form for a lone
 * number is Stat; a reference of zero has no gap that can be put in words, and
 * a badge reading "not comparable" is a designed object saying nothing.
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
  /** Marks the VERDICT, which is the one accentable thing here: the figure is
   *  the subject and the badge is the finding, so the colour goes on the
   *  finding. One accent, and never on a hover. */
  accent?: boolean;
}) {
  if (value == null || !Number.isFinite(value)) return null;
  if (reference == null || !Number.isFinite(reference)) return null;
  if (reference === 0) return null;
  if (!referenceLabel) return null;
  const said = differenceInWords(value, reference);
  const direction = directionOf(value, reference);
  return (
    <div data-idea="I9">
      {label ? (
        <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.06em] text-[var(--c-muted)]">
          {label}
        </div>
      ) : null}
      {/* THE ONE BASELINE ROW. It wraps rather than shrinks, because a badge
          squeezed onto a second line still sits under its own figure, while a
          badge crushed to two words has lost the verdict it was carrying. */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          flexWrap: "wrap",
          columnGap: 10,
          rowGap: 4,
          marginTop: label ? 6 : 0,
        }}
      >
        <div className="text-[length:var(--t-focal)] leading-none" style={{ color: "var(--c-ink)" }}>
          <Fig>{format(value)}</Fig>
        </div>
        <Badge
          variant="outline"
          /* THE NEUTRAL SKIN IS THE ONE THAT HAD TO BE MEASURED, because most
             sections will not spend their accent here. Rendered first at
             --c-soft on the card's white with a --c-border ring, it came out a
             shade away from the paper on both counts and read as a faint
             outline rather than as an object, beside a terracotta twin that
             read as one. --c-soft2 over --c-line-strong is the same pair of
             tokens one step apart, and it holds its own at 12px. */
          className={
            accent
              ? "border-[var(--terra-border)] bg-[var(--terra-soft)] text-[var(--terra-text)] hover:bg-[var(--terra-soft)]"
              : "border-[var(--c-line-strong)] bg-[var(--c-soft2)] text-[var(--c-ink2)] hover:bg-[var(--c-soft2)]"
          }
          /* Inline, not px-2.5 py-0.5: see the import note. The hover classes
             above restate the resting fill rather than dropping it, because the
             bought variants all change colour on hover and nothing in a form is
             interactive. */
          style={{ padding: "4px 10px", gap: 6 }}
        >
          <DirectionMark direction={direction} />
          {said}
        </Badge>
      </div>
      {/* THE BASIS, and the reference figure is named exactly once on the form.
          It is set in the figure face so the eye still reads it as a
          measurement at 12px, which is the one thing that has to survive the
          drop from 30. */}
      <p className="text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]" style={{ marginTop: 8 }}>
        against <Fig>{format(reference)}</Fig>, {referenceLabel}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* StateWord , I9, free of every drawn budget                          */
/* ------------------------------------------------------------------ */
/**
 * THE STATE ROW: A MARK, A TINT, A PHRASE.
 *
 * "Expected." "Not expected." "Not required here." Version 1 answered questions
 * like these with a meter reading 100 or 0, or with a dot pinned to one end of a
 * track, which is a continuous scale asserting itself over a binary fact. That
 * much was right to remove. What replaced it was the word set at focal, 30px,
 * alone in a card, and the founder read that as slop, correctly: A WORD IS NOT
 * A QUANTITY AND SIZING IT LIKE ONE WAS THE FAULT. Thirty pixels of "Not
 * required here" is a headline pretending to be a figure, and it leaves the
 * form's whole top half empty while saying nothing the phrase did not.
 *
 * SO THE STATE GETS THE TREATMENT A STATE ACTUALLY HAS, everywhere this idiom
 * is solved well: a disc on the left carrying one mark, then the state as a
 * phrase, then the consequence under it. The disc holds the weight the type
 * used to hold, and it does it in 36 pixels instead of in a 30px word.
 *
 *   (o)  Not required here          <- 36px disc, then the phrase at lead
 *        No council permit covers   <- the consequence at body, ink2,
 *        tables on the pavement.       hanging on the phrase's left edge
 *
 * THE MARK IS A SHAPE AND THE TINT IS ONE TINT. A tick, a cross, a dash: the
 * kind is carried by the drawing, never by a colour, because this palette is
 * terracotta and cool neutrals with no green in it and a red or green disc
 * would be inventing a semantic ramp the site does not own. The disc's tint is
 * the same soft grey whichever mark it holds, unless the caller asks for the
 * accent, and then the disc takes it and nothing else does.
 *
 * IT IS A ROW AND NOT A STACK, which is the part that has to survive edits: the
 * disc is optically centred against the phrase, and the consequence hangs off
 * the phrase's left edge rather than the form's, so the two lines of text read
 * as one block that the disc is labelling.
 *
 * DO NOT set the state at answer or focal size, and DO NOT render it without
 * the mark. Both were tried; the founder saw the result.
 */
export type StateKind = "yes" | "no" | "na";

/**
 * THE MARKS. A tick, a cross, a bar, on a 16 box, stroked in currentColor at
 * 2px so a 36px disc holds a mark heavy enough to read at thumbnail size. Round
 * caps and joins, because a square-cut tick at this weight reads as a smudge.
 */
function StateMark({ kind }: { kind: StateKind }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" style={{ display: "block" }}>
      {kind === "yes" ? <polyline points="3.2,8.6 6.5,11.9 12.8,4.6" {...common} /> : null}
      {kind === "no" ? (
        <>
          <line x1="4.4" y1="4.4" x2="11.6" y2="11.6" {...common} />
          <line x1="11.6" y1="4.4" x2="4.4" y2="11.6" {...common} />
        </>
      ) : null}
      {kind === "na" ? <line x1="3.6" y1="8" x2="12.4" y2="8" {...common} /> : null}
    </svg>
  );
}

export function StateWord({
  state,
  fact,
  label,
  kind = "na",
  accent = false,
}: {
  /** The state itself, already in the reader's words. Null renders nothing. */
  state?: string | null;
  /** One supporting fact. The section's only evidence, so it is not fine print. */
  fact?: React.ReactNode;
  /** Optional caption when the form stands outside a section rail. */
  label?: string | null;
  /** Which mark the disc holds: a tick, a cross, or a dash.
   *  IT DEFAULTS TO "na", THE DASH, and that default is an honesty rule rather
   *  than a convenience. The catalog forbids rendering this form without a
   *  mark, and a caller that has not said yes or no has not asserted either, so
   *  the neutral mark is the only one that can be drawn on its behalf. The
   *  alternative, guessing the kind by reading the state string for the word
   *  "not", would put a cross on "not required" and a tick on "no permit
   *  needed", which is the same fact answered two opposite ways. */
  kind?: StateKind;
  /** Marks the DISC, which is the one accentable thing here: the catalog gives
   *  the disc the weight, so it also gets the colour when a section asks. The
   *  phrase stays in ink. One accent, and never on a hover. */
  accent?: boolean;
}) {
  if (!state) return null;
  /* 36 is the catalog's number, and it is the size at which a 16px mark still
     has air around it and the disc still reads as a status rather than as a
     button. */
  const DISC = 36;
  return (
    <div data-idea="I9">
      {label ? (
        <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.06em] text-[var(--c-muted)]">
          {label}
        </div>
      ) : null}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: label ? 8 : 0 }}>
        <div
          style={{
            flex: "none",
            width: DISC,
            height: DISC,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: accent ? "var(--terra-soft)" : "var(--c-soft2)",
            color: accent ? "var(--terra-text)" : "var(--c-ink)",
          }}
        >
          <StateMark kind={kind} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          {/* THE PHRASE IS CENTRED AGAINST THE DISC, by giving its line the
              disc's own height, so a one-line state and a two-line state both
              sit level with the mark instead of hanging from its top edge. */}
          <div style={{ minHeight: DISC, display: "flex", alignItems: "center" }}>
            <span className="text-[length:var(--t-lead)] font-semibold leading-snug tracking-[-0.01em] text-[var(--c-ink)]">
              {state}
            </span>
          </div>
          {fact ? (
            <p
              className="max-w-[46ch] text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]"
              style={{ marginTop: 4 }}
            >
              {fact}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RankedTiles , I6 tile set, shares the cap of 3                      */
/* ------------------------------------------------------------------ */
/**
 * THE STANDING: A SHORT RANKING WHERE THE ORDER IS THE READING.
 *
 * Roles by how hard they are to fill, risks by how likely they are. Version 1
 * drew each of these as its own track with a marker on it, so four rankings on
 * one page came out as four identical lines and the reader had to read the
 * labels to tell them apart.
 *
 * WHAT VERSION 3 STRUCK, AND IT WAS THE WHOLE COMPOSITION. Version 2 answered
 * that with equal chips in a wrapping grid, and the grid DESTROYED THE VERY
 * ORDER THE FORM EXISTS TO SHOW: a reader who reaches the end of a row and
 * wraps to the start of the next has lost the sequence, because "further right"
 * and "further down" are two directions claiming to be one ranking. Five tiles
 * in a three-up grid put the fourth-hardest role directly beneath the hardest,
 * which reads as a pair. The founder saw the result and called it slop.
 *
 * SO IT IS A STANDING NOW, ONE ENTRY PER ROW, hairline-ruled, which is how
 * every ranking anyone actually reads is set:
 *
 *   1   Chef                              14 wks
 *   ---------------------------------------------
 *   2   Sous chef                          6 wks
 *   ---------------------------------------------
 *   3   Bartender                          4 wks
 *
 * THE TWO ALIGNMENTS ARE THE DESIGN, and there is nothing else in the form. The
 * rank numerals line up down the left at mark size, so the sequence is legible
 * without counting; the figures are right-aligned in the figure face, so the
 * digits stack into a column a reader can compare down without reading a single
 * word. Both are tabular, which is what makes a column of digits a column
 * rather than a ragged edge.
 *
 * THE RANK IS NUMBERED NOW, reversing version 1's "do not number them". That
 * rule was written for a form whose position on the page WAS the rank; in rows,
 * a reader arriving mid-list from a scroll has no way to know whether the row
 * under their eye is the second or the fifth, and an ordered list's own marker
 * is suppressed the moment `list-style` goes to none.
 *
 * ALL ROWS ARE THE SAME HEIGHT, and that is the honesty of the form: it claims
 * an ORDER and claims nothing about the distances between the entries. The
 * moment a row is sized by its value the form has become a bar chart with extra
 * steps, and bar charts have their own entry and their own budget.
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
 * DO NOT WRAP THESE INTO A GRID. DO NOT FILL THE ROWS, and do not size them by
 * value: a filled row is a bar and a sized row is a chart.
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
     and drawing a lone row would imply five siblings that were withheld. */
  if (kept.length < 2) return null;
  return (
    <ol data-idea="I6" aria-label={ariaLabel} style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {kept.map((row, i) => {
        const leader = i === 0;
        return (
          <li
            key={`${row.name}-${i}`}
            style={{
              display: "flex",
              alignItems: "baseline",
              /* THE RULE SITS ABOVE EVERY ROW BUT THE FIRST, so the standing
                 never closes with a hairline of its own. A trailing rule sits a
                 few pixels inside the card's edge and reads as a second, badly
                 aligned card edge rather than as a division between entries. */
              borderTop: i === 0 ? undefined : "1px solid var(--c-border)",
              gap: 10,
              paddingTop: i === 0 ? 0 : 8,
              paddingBottom: 8,
            }}
          >
            {/* THE RANK COLUMN IS FIXED-WIDTH, not shrink-to-fit: at a set of
                ten the two-digit row would otherwise push its name a character
                right of the nine above it and bend the left edge of the list. */}
            <span
              className="text-[length:var(--t-mark)] leading-none text-[var(--c-muted)]"
              style={{ flex: "none", width: 14 }}
            >
              <Fig>{i + 1}</Fig>
            </span>
            <span
              className="min-w-0 flex-1 truncate text-[length:var(--t-body)] leading-none"
              title={row.name ?? undefined}
              /* THE LEADER'S NAME IS THE ONLY SEMIBOLD ONE. Weight and colour
                 are doing one job between them, and the row carries no fill and
                 no chip: a warmer ground would start to read as a bigger row,
                 and size is the one thing this form must not say. */
              style={{
                fontWeight: leader ? 600 : 400,
                color: leader ? "var(--c-ink)" : "var(--c-ink2)",
              }}
            >
              {row.name}
            </span>
            {/* THE FIGURE COLUMN IS THE SECOND ALIGNMENT. Right-aligned and
                tabular, so a reader compares the digits down the column without
                reading a name, and the leader's is the form's one accent. */}
            <span
              className="text-[length:var(--t-body)] leading-none"
              style={{ flex: "none", textAlign: "right", color: leader ? "var(--terra-text)" : "var(--c-ink)" }}
            >
              <Fig>{row.value}</Fig>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* OptionCards , I6 tile set, shares the cap of 3                      */
/* ------------------------------------------------------------------ */
/**
 * THE CHOICE, ALIGNED ACROSS.
 *
 * A choice among comparable options: legal forms, packages, licence tiers.
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
 * WHAT VERSION 3 STRUCK, AND IT IS THE WHOLE ENTRY. Cards side by side are only
 * a comparison if the eye can scan ACROSS them, and version 2 broke every row's
 * alignment, which is what made three cards read as three unrelated boxes. A
 * two-line name pushed its own figure a line below its neighbours', the accent
 * mark pushed it again, and the feet were rescued after the fact by an mt-auto
 * that pinned only the last row. Nothing else in the card lined up with
 * anything, so the set said "here are three things" where it had to say "here
 * are three answers to one question".
 *
 * SO THE ROWS ARE NORMALISED BY THE GRID ITSELF, and that is the craft:
 *
 *   Sole trader        Limited company  [usual choice]   Partnership
 *   ----------------   ------------------------------    ----------------
 *   $0    a year       $310   a year                     $140   a year     <- ONE baseline
 *   ................   ..............................    ................  <- ONE height
 *   Nothing to file    Accounts and a fee every year,    One return each,
 *   beyond your tax    and the business owes its debts   and the liability
 *   return.            rather than you.                  is shared.
 *
 * HOW, MECHANICALLY: the set is a two-row grid, header then content, and every
 * card takes `grid-template-rows: subgrid` across both. The tallest header in
 * the set sets the header row for all of them, so a name that wraps to two
 * lines lifts every card's header together instead of dropping its own figure.
 * The figure row beneath is a single line at a fixed size, so the hairline
 * under it lands at one height across the set for free. The alternative, a
 * min-height guessed at two lines of a 14px name, is a number that is wrong at
 * every width except the one it was measured at.
 *
 * THE BOUGHT COMPONENTS, NOT HAND-ROLLED BOXES. Founder, 2026-09-01: "always
 * try to stick with the components that we have from shadcn." This is a real
 * Card, CardHeader, CardTitle and CardContent from src/components/ui/card.tsx,
 * and the usual pick's mark is a real Badge. Only three things are re-skinned
 * through className: the title drops the display face and the 20/24px display
 * size, because at head size it would out-shout the figure it introduces and
 * Space Grotesk is this site's FIGURE face; the hairline moves to the spine's
 * own --c-border; and the badge takes the accent surface. EVERY PADDING IS
 * PASSED INLINE, which is not a preference: the v2 scope carries
 * `.av2, .av2 * {margin:0;padding:0}`, a descendant selector at the same
 * specificity as CardHeader's own p-6 and later in source order, so a bought
 * card dropped into a v2 route loses its padding and collapses onto its border.
 *
 * ONE ACCENT, AND IT IS THE BADGE. The card frames stay identical, all of them
 * on the same neutral hairline, because identical frames are what let the eye
 * read the shared baseline running across them; tinting the usual card's border
 * as well would spend the accent twice and blur the one row that matters.
 *
 * DO NOT rank them on a scale, and do not exceed four. Passing five is not
 * silently truncated, because truncation would drop an option the reader needed
 * and say nothing about it; the form refuses instead, and the section is
 * re-framed as a table.
 *
 * DO NOT let a name's length move a figure.
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
    /* A DIV WITH role="list" RATHER THAN A ul, so each Card can be the grid item
       itself and subgrid onto the set's own two rows. A ul whose children were
       divs would be invalid, and wrapping each Card in an li would put a second
       subgrid between the set and the card for no reading. */
    <div
      data-idea="I6"
      role="list"
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
      style={{
        margin: 0,
        padding: 0,
        gap: 10,
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        /* THE TWO ROWS EVERY CARD SUBGRIDS ONTO. `auto` lets the tallest header
           in the set decide the header row for all of them; `1fr` gives the
           rest of the height to the content so the feet finish level. */
        gridTemplateRows: "auto 1fr",
      }}
    >
      {kept.map((option, i) => {
        const isUsual = i === usualAt;
        return (
          <Card
            key={`${option.name}-${i}`}
            role="listitem"
            variant="band"
            className="border-[var(--c-border)]"
            style={{
              display: "grid",
              gridTemplateRows: "subgrid",
              gridRow: "span 2",
              minWidth: 0,
            }}
          >
            <CardHeader
              className="space-y-0"
              /* flex-row and the paddings both beat the component's own classes
                 from the style attribute, which is the only place that survives
                 the v2 reset. */
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                justifyContent: "space-between",
                flexWrap: "wrap",
                columnGap: 8,
                rowGap: 6,
                padding: "12px 13px 0",
              }}
            >
              <CardTitle className="font-sans text-[length:var(--t-body)] font-medium leading-snug tracking-normal text-[var(--c-ink)] md:text-[length:var(--t-body)]">
                {option.name}
              </CardTitle>
              {/* THE ONE ACCENT. It is a real Badge on the accent surface, and
                  it sits in the HEADER rather than under the figure, which is
                  where version 2 had to hide it to stop it breaking the row.
                  Subgrid makes that workaround unnecessary: a badge that wraps
                  under its own name lifts every card's header together. */}
              {isUsual ? (
                <Badge
                  variant="outline"
                  className="border-[var(--terra-border)] bg-[var(--terra-soft)] text-[var(--terra-text)] hover:bg-[var(--terra-soft)]"
                  style={{ padding: "3px 9px" }}
                >
                  Usual choice
                </Badge>
              ) : null}
            </CardHeader>
            <CardContent style={{ padding: "0 13px 12px" }}>
              {/* THE SHARED BASELINE. One line, one fixed size, so this row is
                  the same height in every card and the hairline under it needs
                  no help to line up. */}
              <div style={{ display: "flex", alignItems: "baseline", columnGap: 6, marginTop: 9 }}>
                <span className="text-[length:var(--t-head)] leading-none text-[var(--c-ink)]">
                  <Fig>{option.figure}</Fig>
                </span>
                {option.unit ? (
                  <span className="min-w-0 truncate text-[length:var(--t-micro)] leading-none text-[var(--c-muted)]">
                    {option.unit}
                  </span>
                ) : null}
              </div>
              {option.means ? (
                <p
                  className="text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]"
                  /* THREE LINES IS THE CATALOG'S CAP and it is enforced rather
                     than trusted, because one long `means` in a set of four
                     would otherwise decide the height of all four cards. */
                  style={{
                    marginTop: 10,
                    paddingTop: 9,
                    borderTop: "1px solid var(--c-border)",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {option.means}
                </p>
              ) : null}
            </CardContent>
          </Card>
        );
      })}
    </div>
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
 * THE LADDER, AND A LADDER IS VERTICAL.
 *
 * "How hard is this trade to enter" has about five real answers and they are
 * not five points on a continuum: learn it on the job, train in a week, take a
 * short course, hold a licence, serve an apprenticeship. Version 1 drew that as
 * a marker three fifths of the way along a track, which claims a precision that
 * does not exist (there is no such thing as 62 percent of a licence) and which
 * hides four of the five answers, since a reader can see the position but never
 * learns what the positions are.
 *
 * SO EVERY RUNG IS DRAWN AND EVERY RUNG CARRIES ITS OWN WORDS. The reader sees
 * where this trade sits AND what the rungs above and below it would have meant,
 * which is most of the value in the reading and all of what the track threw
 * away.
 *
 * WHAT VERSION 3 STRUCK. Version 2 drew the rungs as five boxes climbing left
 * to right by a fixed offset, each holding a numeral in a rounded square. Two
 * faults, and the founder saw both. The climb was a GIMMICK: a ladder read
 * sideways is a staircase graphic, and the offset was decoration standing in
 * for a relationship the form had already refused to claim. And the numerals
 * were furniture: a reader learns nothing from a "3" in a box that the rung's
 * own words do not already say, and five boxed digits across a card is the
 * shape of a progress tracker, not of a scale of difficulty.
 *
 * SO IT IS VERTICAL NOW, hardest at the top, read downward, and it looks like
 * what it is:
 *
 *   [ ] Years of apprenticeship
 *    |  Three or four years under someone else's name
 *   [#] Licensed or certified                 <- reached: filled, semibold ink
 *    |  An exam and a licence before you open
 *   [ ] A short course
 *    |  Two or three weekends and a certificate
 *
 * THE CONNECTOR IS WHAT MAKES IT ONE OBJECT. A 1px rule runs down through every
 * marker, from the top marker's centre to the bottom marker's centre, so five
 * rungs read as one ladder rather than as five stacked tiles. It is drawn per
 * rung as a full-height segment in the marker column, and the space between
 * rungs is padding on the TEXT column rather than on the row, so the segments
 * meet and the line never breaks into dashes across the gaps.
 *
 * THAT IS NOT THE TRACK THIS FORM REPLACES, and the difference is countable. A
 * track is one rail carrying ONE marker, and the reading is the marker's
 * POSITION along it. This is a rule carrying a marker for every named rung, and
 * the reading is which of the named rungs is filled. Take the words away from a
 * track and nothing is left to read; take them away from this and the form is
 * gone, which is the test.
 *
 * THE MARKERS ARE SQUARES AND ALL THE SAME SIZE. Square, because the dots on
 * this site belong to LollipopColumn and two forms sharing an idea must not
 * share a silhouette; the same size, because sizing a marker by anything would
 * make this a bar chart with its numbers hidden, and bar charts have their own
 * entry and their own budget.
 *
 * IT REFUSES A LADDER WITH A HOLE IN IT. A missing rung is not dropped and the
 * rest closed up, because closing up silently renumbers the ladder and moves
 * the reached rung to somewhere it is not. Three to six rungs: below three
 * there is no ladder to climb, above six a reader is counting rather than
 * reading, and the form for a long ordered set is a table.
 *
 * DO NOT number the rungs, and do not size them by anything at all.
 */
export type LadderRung = {
  /** The rung's own words: "Licensed or certified". A rung without one refuses
   *  the whole form, because a ladder cannot have an unnamed rung in it. */
  name?: string | null;
  /** What standing on it would mean, one short line. Optional, and the form is
   *  poorer without it: the reason every rung is drawn is so that the reader
   *  learns what the ones they are not on would have meant. */
  meaning?: string | null;
};

export function StepLadder({
  steps,
  reached,
  ariaLabel,
}: {
  /** The rungs IN CLIMBING ORDER, lowest first, which is the order anyone
   *  writes a ladder down in. The component draws them hardest-at-the-top,
   *  because a ladder is read downward; the caller never has to think about
   *  which way the drawing runs. Any rung missing its name refuses the form. */
  steps?: Array<LadderRung | null | undefined> | null;
  /** Which rung this subject is on, counting from 1 AT THE LOWEST, in the same
   *  order the caller passed. Null renders nothing. */
  reached?: number | null;
  /** Names the ladder for a screen reader: what its rungs measure. */
  ariaLabel?: string;
}) {
  const rungs = steps ?? [];
  if (rungs.length < 3 || rungs.length > 6) return null;
  if (rungs.some((r) => r == null || typeof r.name !== "string" || r.name.trim() === "")) return null;
  if (reached == null || !Number.isInteger(reached) || reached < 1 || reached > rungs.length) return null;
  const climbing = rungs as LadderRung[];
  /* HARDEST AT THE TOP. The reversal happens here and nowhere else, so
     `reached` keeps meaning what the caller said it meant. */
  const shown = climbing.map((rung, i) => ({ rung, here: i === reached - 1 })).reverse();
  /* M is the marker's edge, C where its centre sits below the rung's top, which
     is the optical middle of the first line of a 14px name at leading-snug.
     GAP is the air under a rung, and it belongs to the TEXT column: put it on
     the row instead and the connector breaks in every gap. */
  const M = 9;
  const C = 10;
  const GAP = 14;
  return (
    <div data-idea="I6">
      <ol aria-label={ariaLabel} style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {shown.map(({ rung, here }, i) => {
          const first = i === 0;
          const last = i === shown.length - 1;
          return (
            <li
              key={`${rung.name}-${i}`}
              aria-current={here ? "step" : undefined}
              style={{ display: "grid", gridTemplateColumns: `${M}px 1fr`, columnGap: 11 }}
            >
              <div style={{ position: "relative" }}>
                {/* THE CONNECTOR SEGMENT. It stops AT the first and last
                    markers' centres rather than running past them, because a
                    rule overshooting the end of a ladder reads as a scale that
                    continues somewhere the form is not showing. */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: (M - 1) / 2,
                    width: 1,
                    background: "var(--c-line-strong)",
                    top: first ? C : 0,
                    ...(last ? { height: first ? 0 : C } : { bottom: 0 }),
                  }}
                />
                {/* THE MARKER, AND THE REACHED ONE IS THIS FORM'S ONE ACCENT.
                    Filled where the subject stands, hollow everywhere else, so
                    the answer is legible before a single word is read. */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 0,
                    top: C - M / 2,
                    width: M,
                    height: M,
                    borderRadius: 2,
                    border: `1px solid ${here ? "var(--terra)" : "var(--c-line-strong)"}`,
                    background: here ? "var(--terra)" : "var(--c-card)",
                  }}
                />
              </div>
              <div style={{ minWidth: 0, paddingBottom: last ? 0 : GAP }}>
                <div
                  className="text-[length:var(--t-body)] leading-snug"
                  style={{ fontWeight: here ? 600 : 400, color: here ? "var(--c-ink)" : "var(--c-ink2)" }}
                >
                  {rung.name}
                </div>
                {/* THE MEANING STAYS LEGIBLE ON EVERY RUNG, not only the reached
                    one. The whole reason all five are drawn is that the reader
                    learns what the other four would have meant, and greying the
                    unreached ones out of readability throws that away again. */}
                {rung.meaning ? (
                  <div
                    className="text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]"
                    style={{ marginTop: 2 }}
                  >
                    {rung.meaning}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ClearanceRing , I7 area, cap of 1                                   */
/* ------------------------------------------------------------------ */
/**
 * WHAT MUST BE CLEARED, AND WHETHER A TYPICAL PERIOD CLEARS IT.
 *
 * Break-even is the reading this site exists to deliver, and it has been drawn
 * wrong twice. Version 1 drew one bar with a tick on it, a track wearing a
 * bar's clothes: the eye has to find the tick, decide which side of it the fill
 * ends on, and only then learn whether the business covers its costs. Version 2
 * answered that with TWO LENGTHS FROM ONE BASELINE, which is a two-row bar
 * chart, which is the exact silhouette the whole catalog exists to stop the
 * pages repeating. The founder saw it rendered and it went out with the rest.
 * ThresholdBlock is struck; this replaces it.
 *
 * A RATIO AGAINST A TARGET THE DATA ITSELF SETS IS A RING, and that idiom is
 * already bought: scratchpad/freeblocks/chart-radial-shape.json and
 * chart-radial-simple.json, a sweep on a closed track with the answer standing
 * in the middle of it. This is that shape, drawn to the spine's tokens.
 *
 *   THE FULL CIRCLE IS THE THRESHOLD. Not a ceiling anyone invented: the ring
 *   closes at exactly what break-even needs, so "all the way round" and "paid
 *   for" are the same fact, and a reader who sees an unclosed ring has read the
 *   shortfall before reading a number.
 *
 *   PAST IT THE SURPLUS TAKES A SECOND LAP, thinner and lighter, outside the
 *   ring it has already closed. That is what makes clearing VISIBLE instead of
 *   merely stated: the drawing runs out of track and keeps going. A form that
 *   stopped at the closed circle would look identical whether a month cleared
 *   break-even by a hundred pounds or by half again.
 *
 *   THE CLEARANCE STANDS IN THE MIDDLE at focal and signed, with one word under
 *   it saying which way it runs, and the two figures are named plainly beneath
 *   the drawing. The centre answers the question; the line under it says what
 *   the question was measured from.
 *
 * IT IS NOT THE GAUGE, and the two are worth keeping apart because they share
 * an idea and therefore a budget. Gauge is a needle on a 0-to-100 SCORE, a
 * scale this site invented and has to explain. This is a ratio against a target
 * the data itself sets, in the reader's own money, and it explains nothing
 * because there is nothing to explain: the ring is full or it is not.
 *
 * ONE ACCENT, SPENT ON CLEARING. The sweep is terracotta when the period clears
 * and ink when it falls short, so the colour is carrying the finding rather
 * than decorating the form. A shortfall gets no red: this palette has no red in
 * it, and inventing a semantic ramp for one drawing would be a second language
 * on one page.
 *
 * WHAT THE DRAWING SATURATES AT, said out loud because a saturated drawing that
 * does not admit it is a lie. The surplus lap is capped at one full turn, so a
 * month taking three times break-even draws the same closed outer ring as one
 * taking twice. At that point the ring has said all it can say, which is
 * "cleared it by at least as much again", and that IS true; the exact figure is
 * standing in the middle of it at 30px.
 *
 * DO NOT draw one bar with a marker on it. DO NOT draw two bars from one
 * baseline. DO NOT put a needle, a tick or a marker anywhere on this ring: a
 * mark on a closed track is a position again, and a position is what both
 * rejected versions were.
 */
export function ClearanceRing({
  needed,
  given,
  neededLabel,
  givenLabel,
  format = (n: number) => String(n),
  note,
}: {
  /** What has to be cleared. Null, non-finite or not above zero renders nothing,
   *  because a threshold of zero has no ring to close. */
  needed?: number | null;
  /** What a typical period gives, in the same unit. Null renders nothing. */
  given?: number | null;
  /** A verb phrase naming the threshold, lower case: "break-even needs". */
  neededLabel?: string | null;
  /** A verb phrase naming the subject: "a typical month takes". */
  givenLabel?: string | null;
  /** Formats every figure. Pass the kit's `usd` for money. */
  format?: (n: number) => string;
  /** Replaces the composed line beneath where the section has better words. */
  note?: React.ReactNode;
}) {
  if (needed == null || !Number.isFinite(needed) || needed <= 0) return null;
  if (given == null || !Number.isFinite(given) || given < 0) return null;
  if (!neededLabel || !givenLabel) return null;
  const clears = given > needed;
  const gap = Math.abs(given - needed);
  /* The three states are drawn from the two figures alone and never from a
     rounded string: "level" is EXACT equality here, because unlike a ratio this
     is money against money and a dead band would be inventing a tolerance the
     section did not ask for. */
  const word = given === needed ? "level" : clears ? "clear" : "short";
  const centre = clears ? `+${format(gap)}` : format(gap);

  /* THE GEOMETRY. R1 is the threshold ring; the surplus lap sits outside it,
     thinner, with a 3px of air between so the two never read as one thick
     stroke. Everything is measured from the centre of a 168 box so the outer
     lap's outer edge lands clear of the viewBox at 71.5 of 84. */
  const CX = 84;
  const R1 = 56;
  const W1 = 13;
  const W2 = 5;
  const R2 = R1 + W1 / 2 + 3 + W2 / 2;
  const C1 = 2 * Math.PI * R1;
  const C2 = 2 * Math.PI * R2;
  const closed = Math.min(given / needed, 1);
  const spare = clears ? Math.min((given - needed) / needed, 1) : 0;
  return (
    <div data-idea="I7">
      {/* THE RING AND ITS CENTRE SHARE A POSITIONING CONTEXT rather than being
          pulled together with a negative margin. The svg scales with the card,
          so any offset measured in pixels against a 168 box is wrong the moment
          the card is narrower than that; an absolutely positioned centre is
          right at every width. */}
      <div style={{ position: "relative", width: 168, maxWidth: "100%", margin: "0 auto" }}>
        <svg
          viewBox="0 0 168 168"
          style={{ width: "100%", display: "block" }}
          role="img"
          aria-label={`${givenLabel} ${format(given)} against ${neededLabel} ${format(needed)}: ${
            word === "level" ? "level" : `${format(gap)} ${word}`
          }`}
        >
          {/* THE TRACK IS THE THRESHOLD, and it is the only track in the form. An
              outer track behind the surplus lap would draw a second ceiling that
              no figure in the data supports. */}
          <circle cx={CX} cy={CX} r={R1} fill="none" stroke="var(--c-soft2)" strokeWidth={W1} />
          <circle
            cx={CX}
            cy={CX}
            r={R1}
            fill="none"
            stroke={clears ? "var(--terra)" : "var(--c-ink)"}
            strokeWidth={W1}
            strokeLinecap="round"
            strokeDasharray={`${(closed * C1).toFixed(2)} ${C1.toFixed(2)}`}
            /* Twelve o'clock, clockwise, which is the only starting point a reader
               does not have to be told about. */
            transform={`rotate(-90 ${CX} ${CX})`}
          />
          {spare > 0 ? (
            <circle
              cx={CX}
              cy={CX}
              r={R2}
              fill="none"
              stroke="var(--terra-border)"
              strokeWidth={W2}
              strokeLinecap="round"
              strokeDasharray={`${(spare * C2).toFixed(2)} ${C2.toFixed(2)}`}
              transform={`rotate(-90 ${CX} ${CX})`}
            />
          ) : null}
        </svg>
        {/* THE CENTRE IS HTML, NOT AN SVG <text>, so the clearance is set in the
            same ladder rung and the same figure face as every other answer in
            the kit rather than in whatever an svg inherits. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeContent: "center",
            justifyItems: "center",
            rowGap: 5,
            pointerEvents: "none",
          }}
        >
          <div className="text-[length:var(--t-focal)] leading-none" style={{ color: "var(--c-ink)" }}>
            <Fig>{centre}</Fig>
          </div>
          <div className="text-[length:var(--t-micro)] leading-none text-[var(--c-muted)]">{word}</div>
        </div>
      </div>
      <p
        className="text-center text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]"
        style={{ marginTop: 12 }}
      >
        {note ?? (
          <>
            {neededLabel} <Fig>{format(needed)}</Fig>, {givenLabel} <Fig>{format(given)}</Fig>
          </>
        )}
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
