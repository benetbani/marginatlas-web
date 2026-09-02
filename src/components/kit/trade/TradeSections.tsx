/**
 * src/components/kit/trade/TradeSections.tsx
 *
 * The ten specialised per-trade sections the founder asked for on 2026-08-21,
 * in his own order of mention: tipping, the tax on taking public space, the
 * typical shape of the business, the three most-sold items, whether you can
 * hire and how skilled they need to be, who walks in, what can go wrong, the
 * deals and special regimes, and how clean the town hall is.
 *
 * ===================== READ BEFORE MOUNTING ANY OF THESE ==================
 *
 * THESE ARE WORKSHOP COMPONENTS UNTIL A REAL SOURCE EXISTS. Every one takes its
 * numbers as props and renders nothing when they are absent. None of them
 * invents a figure, and none may be mounted on a reader-facing route until
 * something real feeds it. The founder's "you don't even need to bother with
 * real data, it is all about design" and the standing "never fabricate a
 * figure" are both satisfied exactly one way: build the surface, show him the
 * surface, and let the data arrive later.
 *
 * SELF-OMISSION IS THE CONTRACT. Each section returns null rather than a
 * placeholder when it has nothing. A frame around a value that never arrives is
 * one of the named shapes of the defect class this whole effort is removing,
 * and nine components on the live country page already do it.
 *
 * EVERY FORM COMES FROM rules/FORM-CATALOG.md. Improvising a shape inline is a
 * defect, not initiative (rulebook rule 0). The form used is named in each
 * section's own comment, with why it and not a neighbour.
 *
 * THREE RULES THAT APPLY TO ALL TEN:
 *   1. No sentence beside a chart. The finding lives ON the visual: a marker, a
 *      struck figure, the focal number. A chart that needs a sentence is wrong,
 *      not under-captioned (rule 26).
 *   2. One scale, high reads good, everywhere. A risk, a cost or a burden is
 *      INVERTED before rendering, so a bad thing reads low (rules 29, 29A).
 *   3. The universality test, run before writing rather than after: imagine it
 *      rendering for Kinshasa, Dhaka, Tirana and La Paz. If the copy, the metric
 *      or the visual breaks or becomes condescending there, it is wrong (rule 21).
 *
 * ================= THE 2026-09-01 REDESIGN, WAVE 1 ========================
 *
 * The founder on seeing all ten: "this is not a graphical execution. These are
 * just shells." The diagnosis in design/blueprints/trade-sections.md is exact:
 * every one of the ten was a heading plus rows, nine carried no answer figure,
 * none carried a yardstick, and none stated a consequence.
 *
 * The constitution's fix is a FOUR-PART ANATOMY every section inherits rather
 * than re-implements: rail, THE ANSWER, THE EVIDENCE, THE CONSEQUENCE. It lives
 * in the one `Section` wrapper below, so hierarchy is a property of the family
 * and not of whoever wrote the tenth card.
 *
 * WAVE 1 did chapter A (TypicalSetup, WhatThingsCost) and built the wrapper and
 * the yardstick. The other eight carried a rail and their evidence and NO answer
 * and NO consequence, which the constitution's own empty state calls
 * non-conforming: a section renders when it has its ANSWER field.
 *
 * ================= THE 2026-09-01 REDESIGN, WAVE 2 ========================
 *
 * The remaining eight, to the same anatomy. Three things changed shape rather
 * than gaining a line, and each is written up at its own section below:
 *
 *   B1 + B2 MERGED INTO ONE CARD. "Can you hire" and "how skilled" answer one
 *   question, and two cards made the reader assemble the answer themselves.
 *   `CanYouHire` and `SkillLevel` survive as thin wrappers over the merged
 *   `PeopleYouNeed`, so no call site breaks and neither renders a half-card.
 *
 *   C2 PUBLIC SPACE lost the second of its two faults. It was a lone number in a
 *   card (the founder's named fault class) AND it drew that number at 42, out-
 *   sizing chapter A's 30 and inverting the page's own hierarchy. It now takes
 *   the wrapper's focal rung like every other answer, and it carries evidence
 *   and a break-even.
 *
 *   C5 WHAT GOES WRONG moved off Dots and onto the shared EaseScale. Dots draw a
 *   score with no ends named at all, so a reader could not tell whether four
 *   filled dots was good news; three risks on one labelled track are comparable
 *   at a glance, which is what the constitution asks of it.
 *
 * ============ THE 2026-09-02 MIGRATION, ONE SECTION AT A TIME ==============
 *
 * Wave 2's EaseScale answer above is exactly what the founder then rejected: he
 * saw all ten and said "in all sections you have just used this horizontal bar
 * with the points in between, which is so bad. You have overused it like crazy."
 * Nine of ten readings had come out as a line with a dot on it, because the kit
 * exported three drawings and all three were horizontal tracks.
 *
 * The catalogue's version 2 put a cap of TWO on that idea per page and gave every
 * other reading its own form; version 3 rebuilt seven of those forms after he
 * called them slop, and they now live in src/components/spine/forms-v2.tsx where
 * a shipping file can reach them. THIS FILE MIGRATES ONTO THEM ONE SECTION PER
 * COMMIT, each with its warrant, its declared width and its photograph, because a
 * batch of ten is what produced the work he rejected. The subsection queue at
 * E:/atlas/design/loop/SUBSECTION-QUEUE.md holds the order and the ledger beside
 * it holds what each photograph changed.
 */
import * as React from "react";
/* EaseScale IS GONE FROM THIS IMPORT, and its absence is the point of the two
   commits on 2026-09-02. It drew both the risk ranking and the role ranking as
   one left-to-right rail with markers on it, which is two of the nine tracks the
   founder counted. Meter survives for the TOWN HALL alone now (B6, untaken);
   tipping gave its Meter back on 2026-09-02, which returns the restaurant column
   to the cap of two rather than one over it. SpectraTable stays because
   who-walks-in is the one legitimate track on this page: three positions between
   two named poles, which is the reading the form exists for. */
import { Box, Rail, Fig, KV, Meter, SpectraTable, InlineDisclosure, cap } from "@/components/spine/kit";
/* THE CATALOGUE'S OWN VOCABULARY, WHICH THIS FILE COULD NOT REACH UNTIL NOW.
   Every section below was written against a kit that exported three drawings,
   all three of them horizontal tracks, which is the whole mechanism behind the
   founder's 2026-09-01 rejection ("in all sections you have just used this
   horizontal bar with the points in between"). forms-v2.tsx holds the eight
   replacements; sections migrate onto them one at a time, each with its own
   photograph and its own commit. */
import { BenchmarkPair, RankedTiles, StateWord, StepLadder } from "@/components/spine/forms-v2";

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

/**
 * THE SECTION, and it is the four-part anatomy itself rather than a shell that
 * happens to hold one. Every one of the ten passes through here, so the
 * hierarchy is a property of the family: a card cannot forget to have an answer
 * bigger than its rows, because it does not draw its own sizes.
 *
 * THE FOUR PARTS, in the constitution's own order:
 *   1. RAIL          , icon plus kicker. The settled spine opener.
 *   2. THE ANSWER    , one figure or one composed verdict phrase at focal (30),
 *                      the ONLY thing at that size in the card.
 *   3. THE EVIDENCE  , the children: rows, tables, bars, spectra, at body/micro.
 *   4. THE CONSEQUENCE, one line beneath a hairline, saying what the answer
 *                      means for the owner. Composed, never a restatement.
 *
 * FOCAL (30) AND NOT ANSWER (40), and the kit's own Stat cannot be used for it.
 * Stat's focal branch is 38 at phone and 42 at md, which is the MASTHEAD
 * treatment: the one dominant figure on a page. These are sections inside a page
 * whose answer is elsewhere, and a section that takes the page's answer size is
 * claiming to be the page. So the answer here is drawn at the 30 rung directly.
 *
 * THE ACCENT IS RATIONED TO THE ANSWER and appears nowhere else in the card, and
 * only where the answer is a quantity worth pointing AT. A price is; a headcount
 * is a shape rather than a price, and reads in ink.
 *
 * THE NEXT LINK IS PART OF THE ANATOMY, not decoration. Test 2 of five: an
 * answer that raises an obvious question and does not answer it wastes the
 * reader's second minute. It sits on the consequence row so the foot stays one
 * row deep, and it self-omits like everything else.
 *
 * THE INLINE PADDING IS NOT A STYLE PREFERENCE, it is a defence, and it was
 * found by looking at a screenshot rather than by reasoning.
 *
 * The v2 spine scope carries the reset `.av2, .av2 * { margin:0; padding:0 }`.
 * That selector has specificity (0,1,1); Tailwind's `p-5`, which is what the
 * kit's own Box uses, has (0,1,0). So the reset wins REGARDLESS of source
 * order, and every kit card rendered inside a spine-scoped page comes out with
 * its content flush against its own border. That is general, not specific to
 * these ten sections, and it is worth a look wherever else the two are combined.
 *
 * An inline style is the only thing that outranks a descendant selector without
 * an `!important`, so these sections carry their own padding and are immune to
 * the scope they are dropped into.
 *
 * THE COROLLARY, measured on the preview at 1280 and not reasoned about either:
 * outside `.av2` nothing resets Box's own `p-5`, so the two paddings STACK and
 * every card came out at 40px. `data-trade-section` exists so a host that is not
 * `.av2` can zero the outer one in a single rule instead of guessing.
 */
function Section({
  kicker,
  icon,
  sample,
  answer,
  answerKind = "figure",
  answerNote,
  accent = false,
  children,
  consequence,
  next,
  lean = false,
  id,
}: {
  kicker: string;
  icon?: React.ComponentProps<typeof Rail>["icon"];
  sample?: boolean;
  /** THE ANSWER. Absent means the section is a wave-2 skeleton, not a finished card. */
  answer?: React.ReactNode;
  /** WHETHER THE ANSWER IS A QUANTITY OR A PHRASE, and it is a ladder rule
   *  rather than a taste. The subsection procedure, step 5: "A WORD IS NOT A
   *  QUANTITY. A state, a name, a verdict phrase takes lead or section size,
   *  never focal or answer. Sizing a word like a figure was a named fault: it
   *  makes a card look shouted rather than designed." Version 3 of the form
   *  catalogue struck StateWord's 30px word for the same reason.
   *  A price, a headcount, a break-even is a `figure` and keeps the focal rung.
   *  A named risk, a named role, a verdict is `words` and takes the section
   *  rung at 24 with semibold weight (rule 35: 600, never 700), which still
   *  clears the 1.6x ratio against the 14px evidence beneath it.
   *  IT DEFAULTS TO `figure` so the sections not yet migrated render unchanged;
   *  each one opts in as its own row of the subsection queue comes up. */
  answerKind?: "figure" | "words";
  /** Sits BENEATH the answer at micro, never beside it competing. The yardstick's seat. */
  answerNote?: React.ReactNode;
  accent?: boolean;
  /** THE EVIDENCE. */
  children?: React.ReactNode;
  /** THE CONSEQUENCE. One line, composed from the section's own fields. */
  consequence?: React.ReactNode;
  /** THE EXPECTED CHOICE, one click. */
  next?: { label: string; href: string };
  /** THE CARD ASKS FOR THE NARROW COLUMN, and it is a width declaration rather
   *  than a style. Band's lone-child rule re-templates to two thirds and one
   *  third, which is right for a survivor still carrying a table or a chart and
   *  wrong for a card whose evidence is a few short rows: photographed at 1280,
   *  the risk card came out 693px wide with about 480px of nothing between each
   *  risk's name and its reading, three rows deep. That is the founder's first
   *  named fault class, big white space, and the fix is the width and not the
   *  content. `data-lean` moves the air OUTSIDE the card's edge, where an uneven
   *  band reads as a composition instead of as a hole. */
  lean?: boolean;
  id?: string;
}) {
  return (
    <Box id={id} data-trade-section="1" data-lean={lean ? "1" : undefined}>
      <div style={{ padding: "20px" }}>
        <Rail icon={icon} kicker={kicker} sample={sample} />
        {answer != null ? (
          <div className="mb-3.5">
            <div
              className={
                answerKind === "words"
                  ? "text-[length:var(--t-section)] font-semibold leading-snug tracking-[-0.01em]"
                  : "text-[length:var(--t-focal)] leading-none"
              }
              style={{ color: accent ? "var(--terra-text)" : "var(--c-ink)" }}
            >
              {answer}
            </div>
            {answerNote ? (
              <div className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">
                {answerNote}
              </div>
            ) : null}
          </div>
        ) : null}
        {children}
        {/* THE FOOT STACKS BEFORE IT WRAPS. Photographed at 375: side by side,
            the consequence took a third of the row and ran to three lines while
            the link sat alone at the top right with two lines of nothing under
            it. A wrapped row is not the same thing as a stacked one.
            THIS COMMENT LIVES ABOVE THE TERNARY, NOT INSIDE ITS BRANCH: a branch
            is one expression and a comment plus an element is two, which is a
            parse error the repo has now paid for four times. */}
        {consequence || next ? (
          <div className="mt-3.5 flex flex-col gap-2 border-t border-[var(--c-border)] pt-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-5">
            {consequence ? (
              <p className="min-w-0 flex-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)]">
                {consequence}
              </p>
            ) : null}
            {next ? (
              <a
                href={next.href}
                className="shrink-0 text-[length:var(--t-micro)] font-medium text-[var(--c-ink2)] transition hover:text-[var(--terra-text)]"
              >
                {next.label} &rarr;
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </Box>
  );
}

const money = (n: number, currency = "$") =>
  `${currency}${n >= 1000 ? n.toLocaleString() : String(n)}`;

/* ------------------------------------------------------------------ */
/* THE UNIVERSAL YARDSTICK                                             */
/* ------------------------------------------------------------------ */
/**
 * Hours of local pay, and nothing else, for every money figure in all ten.
 *
 * WHY THIS ONE. "$22 for a main course" tells a London reader nothing and a
 * Tirana reader less. A yardstick has to work in every country on earth (rule
 * 21; Dhaka is the test that kills every alternative), it must need no second
 * country's data, and it must convert a price into a unit the reader never has
 * to convert again. A peer-city comparison fails the first two outright, and no
 * peer prices are held for any trade anyway.
 *
 * IT RETURNS NULL WITHOUT A WAGE, so the money figure stands alone rather than
 * being judged against an estimate. That is the whole honesty of the device: a
 * yardstick built on a guessed wage would make every price on the site look
 * measured.
 *
 * IT ROUNDS TO PHRASES, NOT DECIMALS. "1.16 hours" claims a precision that
 * neither the price nor the wage has, and a reader cannot picture it anyway.
 * "an hour and a bit" is both truer and faster, which is the whole point: this
 * is the page's single biggest answer-in-two-seconds device.
 *
 * TWO EXPORTS, ONE CONVERSION. The unit alone ("half an hour") is what a table
 * column wants, where the header already says what the column measures and
 * three rows of "about ... of local pay" would be three-quarters noise. The
 * full phrase is what prose wants. Same arithmetic, one place.
 */
const HOURS_DAY = 8;
const HOURS_WEEK = 40;
const HOURS_MONTH = 173.33;
const HOURS_YEAR = 2080;
/* TWENTY, NOT TWELVE. The list stopped at twelve, which is all a DURATION ever
   needs (twelve months, twelve weeks). C2 counts seats, and four tables seating
   four people each printed "Four tables ... seat 16 more people": one sentence in
   two number systems, which reads as a bug rather than as a sentence. */
const WORD = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
  "nineteen", "twenty",
];
const wordFor = (n: number) => WORD[n] ?? String(n);

/** A count of some unit, in words. "a day", "a day and a half", "three days". */
function countPhrase(n: number, singular: string, plural: string): string {
  if (n < 1.35) return `a ${singular}`;
  if (n < 1.75) return `a ${singular} and a half`;
  return `${wordFor(Math.round(n))} ${plural}`;
}

/** The bare unit: "half an hour", "an hour and a bit", "six hours", "three years". */
export function localPayUnit(
  amount: number | null | undefined,
  hourlyPay: number | null | undefined,
): string | null {
  if (amount == null || !Number.isFinite(amount) || amount <= 0) return null;
  if (hourlyPay == null || !Number.isFinite(hourlyPay) || hourlyPay <= 0) return null;
  const h = amount / hourlyPay;
  /* UNDER AN HOUR IT IS MINUTES, and they are quartered rather than counted:
     "about twenty-three minutes" would be the false precision this exists to
     avoid, one unit down. */
  if (h < 1) {
    const m = h * 60;
    if (m < 8) return "a few minutes";
    if (m < 23) return "a quarter of an hour";
    if (m < 38) return "half an hour";
    if (m < 53) return "three quarters of an hour";
    return "an hour";
  }
  /* THE BANDS OVERLAP THEIR OWN CEILINGS ON PURPOSE. A cut at exactly five
     working days would print "five days" for one figure and "a week" for the
     next, which are the same duration in two vocabularies. Each band hands over
     early enough that the larger unit takes the ambiguous middle. */
  if (h < HOURS_DAY * 4.5) {
    if (h < HOURS_DAY) {
      if (h < 1.15) return "an hour";
      if (h < 1.4) return "an hour and a bit";
      if (h < 1.75) return "an hour and a half";
      return `${wordFor(Math.round(h))} hours`;
    }
    return countPhrase(h / HOURS_DAY, "day", "days");
  }
  if (h < HOURS_WEEK * 4.5) return countPhrase(h / HOURS_WEEK, "week", "weeks");
  if (h < HOURS_MONTH * 11.5) return countPhrase(h / HOURS_MONTH, "month", "months");
  const y = h / HOURS_YEAR;
  /* A FIT-OUT AT A LOW WAGE CAN RUN PAST A WORKING LIFETIME, and printing
     "forty-one years of local pay" reads as a taunt rather than a yardstick. */
  if (y >= 10) return "more than ten years";
  return countPhrase(y, "year", "years");
}

/**
 * Units that already carry their own hedge, so the prose form must not add a
 * second one. Found by running the helper over eight magnitudes rather than by
 * reading it: the two ends of the scale printed "about a few minutes of local
 * pay" and "about more than ten years of local pay", and both are the kind of
 * sentence that makes a reader distrust everything else on the card.
 */
const SELF_HEDGED = new Set(["a few minutes", "more than ten years"]);

/** The prose form: "about half an hour of local pay". Null when the wage is absent. */
export function localPayPhrase(
  amount: number | null | undefined,
  hourlyPay: number | null | undefined,
): string | null {
  const unit = localPayUnit(amount, hourlyPay);
  if (!unit) return null;
  return SELF_HEDGED.has(unit) ? `${unit} of local pay` : `about ${unit} of local pay`;
}

/* ================================================================== */
/* 1. TYPICAL SETUP                                                    */
/* ================================================================== */
/**
 * FORM: KV rows plus a count. Not a chart, deliberately.
 *
 * The founder's own worked example: "Typical business structure for example
 * HVAC operators, 5 people, 2 trucks, $5000 equipment, $200 electricity."
 *
 * This is the SHAPE of a business, not its accounts, and a shape is a list. A
 * bar chart of "5 people, 2 trucks" would be comparing a person to a van, which
 * is the "form = meaning" rule broken in one picture (rule 28). A lone number
 * may stay a number (rule 26). All of that still holds and none of it changed.
 *
 * WHAT CHANGED, 2026-09-01, constitution A1:
 *
 * THE ANSWER is the headcount, at focal, and it is its own field rather than the
 * first of six equal rows. It is what a reader pictures first and the figure
 * every other fact hangs off; buried in a grid it was doing none of that work.
 * Ink, not accent: a headcount is the shape of the business, not a price to
 * point at, and the accent budget in this band belongs to the money card beside
 * it.
 *
 * THE EVIDENCE is regrouped from a flat six into NAMED FAMILIES, because a flat
 * list of six makes the reader do the sorting. The constitution names the
 * restaurant's two, the place and the kit; the names are the caller's because a
 * plumber's two are the round and the kit and a page that printed "THE PLACE:
 * none" for him would be a shape forced onto a trade (rule 21). Two families is
 * the shape. Grouping is what turns a list into a shape.
 *
 * THE CONSEQUENCE is composed, and it never restates the answer, which is why it
 * says what those people are FOR rather than counting them again. Each clause
 * drops out with its field, so a trade holding none of them gets no line rather
 * than a sentence with a hole in it.
 *
 * IT RENDERS ONLY WITH ITS ANSWER, per the constitution's one empty state. Rows
 * without a headcount used to render, and that card is precisely the shell this
 * wave exists to stop: a border around facts with nothing leading them.
 */
export interface SetupFamily {
  /** A quiet micro-caps subhead: "The place", "The kit", "The round". */
  name: string;
  rows: Array<{ label: string; value: string }>;
}

export interface TypicalSetupProps {
  /** THE ANSWER. Its own field, never a row. */
  headcount: { low: number; high: number } | null;
  /** THE EVIDENCE, in named families. */
  families: SetupFamily[] | null;
  /** Consequence clauses. Each drops out when absent; none is ever estimated. */
  covers?: string | null;
  lease?: string | null;
  vehicles?: string | null;
  premises?: string | null;
  /** THE EXPECTED CHOICE: having seen the shape, they want the cost. */
  next?: { label: string; href: string };
  /** The caller owns the anchor, because one document can hold two trades. */
  anchorId?: string;
}

export function TypicalSetup({ headcount, families, covers, lease, vehicles, premises, next, anchorId }: TypicalSetupProps) {
  if (!headcount) return null;
  const held = (families ?? []).filter((f) => f.rows.length > 0);
  const one = headcount.low === headcount.high;
  const people = headcount.high === 1 ? "person" : "people";

  /* THE SENTENCE IS ASSEMBLED, NOT WRITTEN. One verb clause saying what the
     people are for, one tail saying what is signed behind them, and either half
     may be missing. The subject is "those people" so the headcount is referred
     to rather than repeated (rule N8: never a restatement of the figure). */
  const work: string[] = [];
  if (covers) work.push(`fill a room of ${covers}`);
  if (vehicles) work.push(`run ${vehicles}`);
  const tail = lease
    ? `on a lease of ${lease}`
    : premises && /^(none|no)\b/i.test(premises)
      ? "with no premises to rent"
      : null;
  const consequence =
    work.length > 0
      ? `Those ${people} ${work.join(" and ")}${tail ? `, ${tail}` : ""}.`
      : tail
        ? `Behind them sits ${tail.replace(/^on |^with /, "")}.`
        : null;

  return (
    <Section
      id={anchorId}
      kicker="What it takes to run one"
      icon="unit-economics"
      answer={
        <>
          <Fig>{one ? headcount.low : `${headcount.low} to ${headcount.high}`}</Fig>{" "}
          <span style={{ color: "var(--c-ink2)" }}>{people}</span>
        </>
      }
      consequence={consequence}
      next={next}
    >
      {held.length > 0 ? (
        <div className="grid gap-x-7 gap-y-4 sm:grid-cols-2">
          {held.map((f) => (
            <div key={f.name} className="min-w-0">
              <div className="mb-0.5 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
                {f.name}
              </div>
              {f.rows.map((r) => (
                <KV key={r.label} k={r.label} v={r.value} />
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </Section>
  );
}

/* ================================================================== */
/* 2. WHAT THINGS COST HERE                                            */
/* ================================================================== */
/**
 * FORM: the plain three-column table, which the founder called his
 * best-executed element in the July renders. Hairline rows, figures in the
 * figure face, direct headers, no in-cell bars.
 *
 * His example: "Typical business prices for 3 most sold items or services:
 * haircut, beard trimming, face mask, shit like that."
 *
 * THREE ROWS, NOT FIVE. The trade profile carries exactly three, because the
 * value here is that a reader recognises the list instantly. A longer list is a
 * menu, and a menu is not a benchmark.
 *
 * WHAT CHANGED, 2026-09-01, constitution A2. The table's form is untouched: the
 * founder praised it and praised form stays. What it lacked was any way to JUDGE
 * the prices, and a price nobody can judge is trivia with a border.
 *
 * THE ANSWER is the typical ticket, at focal: what one customer pays on a normal
 * visit. It is the figure that connects prices to revenue, and the one a reader
 * actually needs. Terracotta, because this is the card in the band whose answer
 * is a quantity worth pointing at.
 *
 * THE EVIDENCE gains ONE column, hours of local pay, and the column is the whole
 * reason the section now works: a reader can tell in two seconds whether these
 * prices are high or low FOR THIS PLACE, which no absolute figure can ever tell
 * them. It carries the bare unit because the header already says what it
 * measures. It disappears entirely without a wage figure rather than estimating
 * one.
 *
 * THE EXPECTED CHOICE IS DEFERRED, AND RECORDED AS DEFERRED. What a reader wants
 * next is these three items in a peer city. No peer prices are held for any
 * trade, and a switch that reveals nothing is worse than no switch. When they
 * exist this is where they go.
 *
 * IT RENDERS ONLY WITH ITS ANSWER, same empty state as A1. A price table with no
 * ticket above it is the exact card the founder called a shell.
 *
 * ============== B1, 2026-09-02: THE TICKET GAINS ITS REFERENCE =============
 *
 * The queue's row for this card reads "prices, each against a reference", and
 * the card had no reference in it anywhere. Hours of local pay is a YARDSTICK,
 * not a reference: it re-expresses one price in a second unit and says nothing
 * about whether the price is high or low FOR THIS TRADE. So the answer was a
 * lone number, which is the catalogue's own definition of the case BenchmarkPair
 * exists for: "use whenever one number is only meaningful beside another".
 *
 * ONE PAIR, NOT THREE, and that was settled by photographing three before
 * building one. Three BenchmarkPairs stacked in a 347px card draw three figures
 * at focal, which is three things competing for first place and therefore no
 * answer at all (step 5), and their badges came out in a ragged column 18px out
 * of line because each badge starts where its own figure ends. The reading this
 * card actually holds is ONE number against a reference (the ticket) plus an
 * itemisation of what makes it (the table), so it takes one of each. The
 * catalogue's own worked example for BenchmarkPair is this card's figures, to
 * the dollar.
 *
 * IT DEGRADES TO THE OLD CARD RATHER THAN TO NOTHING. BenchmarkPair self-omits
 * without a reference, verified by rendering it, so a caller holding no
 * reference would have lost the answer entirely. The reference is nullable and
 * the plain focal answer is the fallback, so the two pictures differ by a badge
 * and a basis line rather than by having a card at all.
 *
 * WHERE THE ACCENT WENT, and it is a decision rather than a default. Terracotta
 * marks the card's one answer. With a reference held, the answer is no longer
 * "$31", it is "$31, about a third more than the typical restaurant here": the
 * verdict is the new fact and the figure was always there, so the badge takes
 * the colour and the figure stays ink, which is also the form's own rationing.
 * Without a reference there is no verdict, so the figure takes it back.
 *
 * THE CONSEQUENCE STOPPED RESTATING A TABLE CELL. It read "Main course costs
 * about an hour and a bit of local pay here", which is the first row's third
 * column read aloud. It carries the TICKET's local-pay phrase now, which is the
 * one money fact in this card that the table does not hold.
 */
export interface PriceRow {
  item: string;
  price: number | null;
  note?: string;
}

export function WhatThingsCost({
  rows,
  typicalTicket,
  cityTypicalTicket,
  localHourlyPay,
  currency = "$",
  next,
  anchorId,
}: {
  rows: PriceRow[] | null;
  /** THE ANSWER: what one customer pays on a normal visit. Carried, never derived. */
  typicalTicket: number | null;
  /** THE REFERENCE: what a normal visit costs at the typical business of this
   *  trade in this city, in the same currency and on the same definition.
   *  Absent, the card keeps its plain focal answer rather than losing it: the
   *  form draws nothing without a reference, which was verified by rendering it
   *  rather than by reading the guard. NEVER derived from the three prices
   *  below, which are a menu and not a visit. */
  cityTypicalTicket?: number | null;
  /** The place's median hourly pay. Absent means no yardstick anywhere in the card. */
  localHourlyPay?: number | null;
  currency?: string;
  next?: { label: string; href: string };
  /** The caller owns the anchor, because one document can hold two trades. */
  anchorId?: string;
}) {
  if (typicalTicket == null) return null;
  const held = (rows ?? []).filter((r) => r.price != null);
  const ticketPhrase = localPayPhrase(typicalTicket, localHourlyPay);
  /* THE ONE MONEY FACT THE TABLE DOES NOT HOLD. The three rows carry their own
     hours of local pay in their own third column, so a consequence naming the
     first row's was that cell read aloud. The TICKET is not in the table at
     all, on purpose (a normal visit is a main and a drink, not the menu), so
     its yardstick is the sentence's. */
  const consequence = ticketPhrase ? `A normal visit is ${ticketPhrase}.` : null;
  const showYard = localPayUnit(1, localHourlyPay) != null;
  /* THE TWO PICTURES ARE ONE PICTURE WITH AND WITHOUT ITS VERDICT, and the
     branch is decided here rather than inside the form so the accent can move
     with it: the form colours its badge, and there is no badge to colour when
     no reference is held. */
  const benchmarked =
    cityTypicalTicket != null && Number.isFinite(cityTypicalTicket) && cityTypicalTicket !== 0;

  return (
    <Section
      id={anchorId}
      kicker="What people pay here"
      icon="sale-tag"
      accent={!benchmarked}
      answer={benchmarked ? undefined : <Fig>{money(typicalTicket, currency)}</Fig>}
      answerNote={benchmarked ? undefined : "What one customer pays on a normal visit."}
      consequence={consequence}
      next={next}
    >
      {/* THE ANSWER, WHEN IT HAS SOMETHING TO BE MEASURED AGAINST. It sits in
          the children rather than in the wrapper's answer slot because the form
          IS the composed answer: a label, then the figure and its verdict on one
          baseline, then the basis. The wrapper's slot draws a figure and a note
          under it, which would put the badge inside a box already sized at
          focal and hand the colour to the wrong object.
          THIS COMMENT LIVES ABOVE THE TERNARY: a branch is one expression. */}
      {benchmarked ? (
        <div style={{ marginBottom: 16 }}>
          <BenchmarkPair
            value={typicalTicket}
            reference={cityTypicalTicket}
            referenceLabel="the typical one of these in this city"
            format={(n) => money(n, currency)}
            label="A normal visit"
            accent
          />
        </div>
      ) : null}
      {held.length > 0 ? (
        <table data-idea="I8" className="w-full border-collapse">
          {/* THE COLUMNS ARE DECLARED, AND THE SPLIT WAS MEASURED RATHER THAN
              CHOSEN. Left to itself the table sized every column by its own
              content and handed the WIDEST of the three, 132px of a 307px card,
              to the muted yardstick, while the item name, which is the column a
              reader looks for, got 84 and needed 99. So "Glass of wine" wrapped
              and "Bathroom install" wrapped, and the support column had room to
              spare.
              THE SPLIT IS MEASURED IN THE PAGE'S OWN FONT AT 375, where the
              table has 285px and every constraint bites at once: the longest
              item name is 119px ("Bathroom install"), its longest single WORD is
              71, which is what a break would split, and NO yardstick column can
              ever hold every phrase on one line, because "three quarters of an
              hour" is 182px by itself. So the name is given enough to stay on
              one line and the SUPPORT column is the one that wraps, which is
              what support is for. At 46/22/32 the name gets 141px at 1280 and
              131 at 375, both clear of 119 with room. */}
          <colgroup>
            <col className={showYard ? "w-[46%]" : "w-[70%]"} />
            <col className={showYard ? "w-[22%]" : "w-[30%]"} />
            {showYard ? <col className="w-[32%]" /> : null}
          </colgroup>
          <thead>
            {/* THE HEADERS BOTTOM-ALIGN, AND IT IS NOT A NICETY. Photographed at
                the constitution's one-third width: "TYPICAL PRICE" wrapped to two
                lines beside "HOURS OF LOCAL PAY" wrapping to two lines, and top-
                aligned the four half-headers interleaved into one scrambled line
                that read "TYPICAL HOURS OF LOCAL / PRICE PAY". Bottom-aligned,
                each header's last word sits on the shared baseline and the two
                columns separate. Both of those heads have since been shortened
                (see the note below), so neither wraps at either width today, and
                the rule is kept because a longer unit in another currency or
                another language brings the wrap straight back. */}
            <tr className="border-b border-[var(--c-border)]">
              <th scope="col" className="py-1.5 align-bottom text-left text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
                Item
              </th>
              {/* TWO HEADS SHORTENED, AND NEITHER COSTS A WORD OF MEANING.
                  "TYPICAL PRICE" needs 116px and its first word alone needs 65
                  of a 63px column at 375, which is a mid-word break one pixel
                  away; and the answer directly above the table already names the
                  typical twice, in "A normal visit" and in "the typical one of
                  these in this city", so a third would be one hedge said three
                  times in one card. "HOURS OF LOCAL PAY" needs 173px and reads
                  as a unit the reader must convert; "OF LOCAL PAY" is 112 and
                  makes the head and its cell one phrase, "an hour and a bit of
                  local pay", which is the helper's own prose form. A8 made the
                  same move on LOWEST and HIGHEST.
                  THIS COMMENT LIVES ABOVE THE TERNARY, NOT INSIDE ITS BRANCH. */}
              <th scope="col" className="py-1.5 align-bottom text-right text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
                Price
              </th>
              {showYard ? (
                <th scope="col" className="py-1.5 pl-2 align-bottom text-right text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
                  Of local pay
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {held.map((r) => (
              <tr key={r.item} className="border-b border-[var(--c-border)] last:border-0">
                {/* THE NOTE SITS UNDER THE ITEM, NOT BESIDE IT. Photographed at
                    347px with it inline: "Glass of wine 175ml" broke after
                    "Glass of" and left "wine 175ml" on a second line, so the
                    item name wrapped while its two neighbours did not and the
                    row's own baseline went ragged. A note is support and belongs
                    on its own line under the thing it qualifies; the row is then
                    two lines by design instead of two lines by accident. */}
                <td className="py-2 text-[length:var(--t-body)] text-[var(--c-ink)]">
                  {r.item}
                  {r.note ? (
                    <span className="block text-[length:var(--t-micro)] leading-tight text-[var(--c-muted)]">
                      {r.note}
                    </span>
                  ) : null}
                </td>
                {/* Right-aligned AND tabular. Half the rule is useless without the
                    other half: right alignment only lines figures up if the digits
                    are the same width. */}
                <td className="fig whitespace-nowrap py-2 text-right text-[length:var(--t-body)] tabular-nums text-[var(--c-ink)]">
                  {money(r.price as number, currency)}
                </td>
                {/* THE YARDSTICK IS SUPPORT, NOT A SECOND PRICE. Micro and muted,
                    so the eye reads the money column and takes this as the gloss
                    on it. Two columns at the same weight would be two answers. */}
                {showYard ? (
                  <td className="py-2 pl-2 text-right text-[length:var(--t-micro)] leading-tight text-[var(--c-muted)]">
                    {localPayUnit(r.price, localHourlyPay)}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </Section>
  );
}

/* ================================================================== */
/* 3. TIPPING                                                          */
/* ================================================================== */
/**
 * FORM: StateWord. A mark on a disc, the state as a phrase, the fact beneath.
 *
 * ============== B2, 2026-09-02: THE METER YIELDS TO A STATE ===============
 *
 * WHAT WAS HERE WAS THE FOUNDER'S OWN COMPLAINT, DRAWN. A full-width terracotta
 * track with a black dot at 78 of 100, labelled "NOT EXPECTED" and "ALWAYS
 * EXPECTED": one of the three horizontal tracks left on this page, on a page
 * whose cap is two. The catalogue's StateWord entry names this exact card in as
 * many words: "Version 1 answered questions like these with a meter reading 100
 * or 0, or with a dot pinned to one end of a track, which is a continuous scale
 * asserting itself over a binary fact."
 *
 * AND THE TRACK PUBLISHED A NUMBER NOBODY HOLDS. `expectation` is a modelled
 * 0-to-100 score with no unit and no meaningful zero, and a marker positions it
 * to the pixel, so the drawing claimed that 78 is a measured distance along a
 * scale whose ends are two English phrases. That is A2's argument against a
 * lollipop, arriving on a track instead. The score still decides the branch and
 * chooses the phrase, and it is no longer DRAWN anywhere, so the card stops
 * asserting a precision it never had.
 *
 * IT ALSO CARRIED TWO ACCENTS. The share at focal in terracotta AND the track's
 * terracotta fill, in one card, which step 8 of the subsection procedure calls a
 * card with no answer. There is one now.
 *
 * UNIVERSALITY, and this section is one of the two most likely to fail it. In
 * much of the world the honest answer is "not expected", and that must render
 * as a real answer rather than as an empty section or a hedge.
 *
 * WHAT CHANGED, 2026-09-01, constitution C1. The bar led and the money was
 * buried beneath it, so the card's biggest element was a custom and its smallest
 * was the number.
 *
 * THE ANSWER is the SHARE. That is the money, so it takes the focal rung and the
 * accent, and the meter drops to where evidence belongs, underneath it.
 *
 * "NOT EXPECTED HERE" IS A REAL ANSWER AND RENDERS AS ONE, and it is now a
 * DESIGNED object rather than a sentence in the answer slot: a cross on a disc,
 * the phrase beside it, the fact under it, which is the same shape the expected
 * branch wears. The two branches are ONE PICTURE WITH AND WITHOUT ITS FIGURE,
 * which is the construction B1 uses in the same run for its verdict, so a
 * reader who has learned one meets the other.
 *
 * WHERE THE ANSWER SITS, AND WHY IT MOVES. Where a custom exists, the money is
 * the answer and takes the focal rung and the card's one accent, exactly as
 * constitution C1 ruled. Where none exists there IS no money, so the state row
 * carries the card alone, in ink, with no accent anywhere: a custom that does
 * not exist is not a quantity to point at. That is not two hierarchies for one
 * card, it is one card whose answer is whatever the place actually has, which is
 * the same construction ClearanceRing uses for a month that clears and a month
 * that does not.
 *
 * THE STATE CARRIES THE DEGREE NOW, which the consequence used to carry:
 * "Expected" above 55 and "Offered rather than expected" below it. A degree
 * belongs to the state it qualifies, not to a sentence three lines down.
 *
 * TWO OF THE FORM'S THREE MARKS ARE REACHED HERE, the tick and the cross. The
 * dash, "not applicable", is not a tipping state: a custom is either kept or it
 * is not. B3 is the row that reaches it.
 *
 * THE CONSEQUENCE IS THE FUNCTIONAL HEART, and it is the one thing the old card
 * never said: tips change the WAGE BILL. They land on staff take-home without
 * landing on the owner's payroll, which is the only reason an owner needs to
 * know the custom at all. It says what the owner DOES now, and the fact beside
 * the mark says who the money reaches, so neither is the other in other words.
 */
export function Tipping({
  expectation,
  typicalShare,
}: {
  /** 0 = nobody tips, 100 = always expected. */
  expectation: number | null;
  /** Percent of the bill, when there is a customary one. */
  typicalShare: number | null;
}) {
  if (expectation == null) return null;
  /* A ZERO IS NOT A MEASUREMENT OF A SHARE, it is the absence of a custom, and
     "0%" at focal would render absence as a quantity. A share with nobody
     expecting it is folklore, so either half saying no is a no.
     THREE STATES, NOT TWO, AND THE THIRD WAS FOUND BY PHOTOGRAPHING THE CARD IN
     EVERY BRANCH ITS READING CAN REACH. The guard used to require BOTH halves
     before the card said the custom existed, which collapsed "there is no
     custom" into "we do not hold the share": a place at 70 out of 100 with no
     share figure rendered "Not expected here", the opposite of what the card
     knew. The Meter used to hide that, badly, by drawing its marker at 70 beside
     the words denying it; with the track gone the contradiction would have been
     invisible instead of merely wrong. So a custom with no share attached says
     the custom exists and prints no figure, which is A4's own fix for the same
     fault class: render what is held, never a fallback that reads as measured. */
  const noCustom = expectation <= 10 || typicalShare === 0;
  const shareHeld = typicalShare != null && typicalShare > 0;
  const expected = !noCustom && shareHeld;
  const state = noCustom
    ? "Not expected here"
    : expectation >= 55
      ? "Expected"
      : "Offered rather than expected";
  return (
    <Section
      kicker="Tipping"
      icon="payments"
      accent={expected}
      answer={expected ? <Fig>{typicalShare}%</Fig> : undefined}
      answerNote={expected ? "The customary share of the bill, on top of it." : undefined}
      consequence={
        noCustom
          ? "Wages carry the whole of pay here, so budget the full cost of a shift into the rota."
          : "Budget the wage alone: a shift costs you the wage and pays the person more than it."
      }
    >
      <StateWord
        kind={noCustom ? "no" : "yes"}
        state={state}
        fact={
          noCustom
            ? "No customary top-up reaches the staff on top of their wage."
            : "Left on the bill and paid to the staff, never to the business."
        }
      />
    </Section>
  );
}

/* ================================================================== */
/* 4. PAYING FOR THE PAVEMENT                                          */
/* ================================================================== */
/**
 * FORM: KV rows under a focal figure. A lone number may stay a number (rule 26),
 * and this one was the counter-example the rule needs: it was a number and
 * NOTHING ELSE, in a card of its own, which is the founder's first named fault
 * class, big white space.
 *
 * His words: "Taxes for taking public space." A terrace, an A-board, a pavement
 * table.
 *
 * WHAT CHANGED, 2026-09-01, constitution C2. TWO faults, and the second was only
 * visible in a screenshot beside chapter A. The figure drew through the kit's
 * Stat at size="focal", which is 38 at phone and 42 at md: the MASTHEAD
 * treatment, a page's one dominant figure. A pavement licence was therefore
 * drawing LARGER than the headcount and the typical ticket, so the smallest fact
 * in the chapter was the biggest thing on the page. It now takes the wrapper's
 * focal rung, 30, like every other section answer.
 *
 * THE EVIDENCE is what the fee BUYS, which the card never said: how many tables
 * one licence covers, and therefore the total. A per-table fee with no count
 * beside it cannot be turned into a decision by anyone.
 *
 * THE CONSEQUENCE is the break-even, and it is the whole reason to read the
 * section: what those tables have to earn to pay for themselves. It is composed
 * from the fields and OMITTED ENTIRELY when the covers figure is absent, never
 * estimated from a typical table.
 *
 * THE YARDSTICK RIDES BOTH MONEY FIGURES, the per-table fee under the answer and
 * the total in its own row, because "$1,240 a year" is meaningless in Tirana and
 * "about a week and a half of local pay" is not.
 *
 * ============ B3, 2026-09-02, THE SUBSECTION QUEUE ========================
 *
 * WARRANT (step 1), and the row was taken as a candidate for CUTTING and is not
 * cut. A visitor reads this to decide WHETHER TO TAKE PAVEMENT SPACE AT ALL, and
 * whether the seats it buys earn back what the licence costs. Without it they
 * would have to find the council's own per-table fee and work out for themselves
 * how much extra trade a terrace has to bring before it is worth having, which is
 * the arithmetic that separates a terrace that is a business from one that is a
 * decoration. NOT A DUPLICATE, checked on the render: no other card in either
 * trade column states a licence fee, a table count or a break-even.
 *
 * THE FORM DID NOT MOVE AND THE QUEUE'S PREDICTION IS REFUSED, on the fixture
 * rather than on taste. The queue predicted "StateWord or BenchmarkPair".
 *   NOT BenchmarkPair (I9): it renders literally nothing without a REFERENCE, and
 *   there is none here. `localHourlyPay` is a YARDSTICK, which B1 settled in as
 *   many words: it re-expresses one figure in a second unit and says nothing
 *   about whether the figure is high or low. `typicalTicket` is what a CUSTOMER
 *   pays, not what a licence costs elsewhere. Reaching for the form would have
 *   deleted the card's answer rather than degrading it.
 *   NOT StateWord (I9): there is no yes-or-no field. `annual == null` makes the
 *   whole card self-omit, so "it does not apply here" is said by the card's
 *   ABSENCE, and a state row asserting it would be a branch nothing can reach,
 *   which is B2's own recorded refusal.
 * So the information is what it always was: ONE NUMBER STANDING ALONE for the
 * answer (I9) and PAIRED LABELLED FACTS for the evidence (KV, I8). What was
 * wrong was the composition, and three faults were measured on the photograph.
 *
 * ONE: THE CARD SAID ITS OWN FIGURES TWICE. The total and the count sat in KV
 * rows and then again in the consequence, word for word: "$4,960" and "four
 * tables" both printed twice in a card 281px tall. Every fact is stated once
 * now, in one place: the total is the ANSWER, the rate is its BASIS, the count
 * and the seats are the EVIDENCE, and the break-even is the CONSEQUENCE.
 *
 * TWO: THE ANSWER WAS THE WRONG FIGURE. It was the per-table rate, which is how
 * the council CHARGES; the reader pays the total, and the total is what decides
 * whether the terrace happens. The rate moves to the basis line under it, where
 * B1 already puts the figure an answer was measured against. Where no count is
 * held there is no total, so the rate takes the answer back and the card is
 * exactly what it was: the missing fact takes its own object away and the rest
 * holds, which is how B1 and B2 both degrade.
 *
 * THREE, AND IT IS THE HONESTY FAULT: A FREE LICENCE PRINTED A FABRICATED
 * BREAK-EVEN. Charging nothing for pavement space is ordinary, `annual` of 0
 * renders, and the break-even floored at one, so a city that charges nothing
 * said its tables "pay for themselves at about one extra customer a week". That
 * is A4's own fault class, a fallback that reads as measured, and it is the
 * "whether it applies at all" half of this row answered by the only state the
 * data can actually reach. A free licence now says so and states no payback.
 */
export function PublicSpaceCost({
  annual,
  unit,
  unitsCovered,
  seatsPerUnit,
  typicalTicket,
  localHourlyPay,
  currency = "$",
}: {
  annual: number | null;
  /** What the fee is charged per: a table, a square metre, a frontage metre. */
  unit: string | null;
  /** How many of them one licence typically covers. Absent kills the consequence. */
  unitsCovered?: number | null;
  /** How many more people each one seats. Absent kills the consequence. */
  seatsPerUnit?: number | null;
  /** What one customer pays, so the licence can be priced in customers. */
  typicalTicket?: number | null;
  localHourlyPay?: number | null;
  currency?: string;
}) {
  if (annual == null || !unit) return null;
  const plural = unit.endsWith("s") ? unit : `${unit}s`;
  const covered = unitsCovered != null && unitsCovered > 0 ? unitsCovered : null;
  const total = covered != null ? annual * covered : null;
  const seats = covered != null && seatsPerUnit != null && seatsPerUnit > 0 ? covered * seatsPerUnit : null;
  /* THE BREAK-EVEN IS COUNTED IN CUSTOMERS A WEEK, because that is the unit an
     owner already thinks in and a year of licence fees is not. It floors at one:
     a licence that pays for itself on half a customer a week still needs a whole
     customer to walk in, and "about zero extra customers a week" is not English. */
  /* A LICENCE THAT COSTS NOTHING IS A STATE THE WORLD HAS AND THE DATA REACHES.
     It is also the only place this card can honestly answer "does it apply at
     all": a trade that pays nothing for the space renders `annual` of 0, while a
     trade the charge does not touch renders no card. */
  const free = annual === 0;
  /* THE BREAK-EVEN REFUSES A ZERO BILL rather than flooring it to one customer.
     `Math.max(1, ...)` is right for a bill of $40 and a lie for a bill of $0, and
     the drawing a reader believes here is the sentence. */
  const perWeek =
    total != null && total > 0 && typicalTicket != null && typicalTicket > 0
      ? Math.max(1, Math.round(total / typicalTicket / 52))
      : null;
  /* THE CONSEQUENCE SAYS THE ONE THING NOTHING ELSE IN THE CARD SAYS. The count,
     the seats and the money are each stated once, above; repeating them here was
     the fault the photograph found. */
  const consequence = free
    ? `The space itself costs nothing here, so only the tables and the chairs are yours to pay for.`
    : perWeek != null
      ? `The space pays for itself at about ${wordFor(perWeek)} extra ${perWeek === 1 ? "customer" : "customers"} a week.`
      : `The licence costs the same whether the tables are full or empty.`;
  /* THE ANSWER IS WHAT THE OWNER PAYS, which is the whole licence and not the
     rate the council quotes. Without a count there is no total, so the rate
     takes the answer back and its own yardstick with it. */
  const answerFigure = total ?? annual;
  const answerYard = localPayPhrase(answerFigure, localHourlyPay);
  const basis =
    covered != null
      ? free
        ? `A year for the space. Nothing is charged for it here.`
        : `A year for the space, at ${money(annual, currency)} a ${unit}.`
      : `A year, per ${unit}.`;

  return (
    <Section
      kicker="Putting tables on the pavement"
      icon="high-street"
      accent
      answer={<Fig>{money(answerFigure, currency)}</Fig>}
      answerNote={`${basis}${answerYard ? ` ${cap(answerYard)}.` : ""}`}
      consequence={consequence}
    >
      {/* THE TWO FACTS SIT SIDE BY SIDE ON A WIDE CARD AND STACK ON A NARROW ONE,
          and both halves of that were measured rather than chosen.
          STACKED AT 624px each row ran a 96px label and a value to about 148px of
          a 584px card, leaving 436px of nothing under a full-width hairline, two
          rows deep: an empty rectangle three quarters of the card wide and taller
          than a line, which is step 7's own test failed. Side by side each fact
          gets a 280px cell and ends about 62px short of it.
          THE WRAPPER ALSO REMOVES A DOUBLE HAIRLINE that predates this row. KV
          carries `last:border-0`, and as direct children of the Section the last
          KV was never `:last-child`, because the foot div is: so the card drew a
          rule under SEATS and the foot's own rule 14px below it, two nearly
          parallel hairlines, which reads as a mistake rather than as a decision.
          Inside a wrapper the last row is last again.
          NEITHER ROW KEEPS ITS OWN RULE, at any width, and that is a decision the
          branches forced rather than a tidy-up. A rule under one cell of a
          two-cell row and none under the other is the same asymmetry seen from
          the other side; and putting one under the whole block instead lands it
          14px above the foot's own rule, which is the double hairline again.
          Two labelled facts are a PAIR, not a list, so the foot's rule closes
          them and nothing divides them.
          THE COLUMNS FOLLOW THE CARD'S OWN WIDTH AND NOT THE VIEWPORT'S. A first
          cut used `lg:grid-cols-2`, and the branch harness showed exactly what
          the third run recorded for LollipopColumn: a viewport breakpoint is a
          PROXY for a card width and it is wrong wherever a narrow card sits on a
          wide screen. At 327px with `lg` active the two cells collided into "4 /
          tables" and "16 / more / people". `auto-fit` with a 220px floor asks the
          card instead: two abreast above about 464px of content box, stacked
          below it, at every viewport. */}
      {covered != null ? (
        <div className="grid gap-x-6 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] [&>*]:border-b-0">
          <KV k="Covered" v={`${covered} ${plural}`} />
          {seats != null ? <KV k="Seats" v={`${seats} more people`} /> : null}
        </div>
      ) : null}
    </Section>
  );
}

/* ================================================================== */
/* 5 + 6. THE PEOPLE YOU NEED  (B1 CAN YOU HIRE + B2 SKILL LEVEL)      */
/* ================================================================== */
/**
 * ONE CARD, NOT TWO, and the merge is the design rather than a tidy-up.
 *
 * The founder's two asks were separate sentences: "availability of talent for
 * this specific activity in this place" and "how skilled they need to be, scale
 * of 1 to 4, simple." They are separate sentences and ONE question. A reader
 * looking at a card of role bars and a card of four numbered boxes has to hold
 * both and work out what will actually delay their opening. That assembly is the
 * reader's second minute, spent on something the page should have done.
 *
 * WARRANT (subsection procedure, step 1). A visitor reads this to decide WHICH
 * HIRE TO START LOOKING FOR FIRST, and how long that search will hold up an
 * opening. Without it they would have to sign a lease and then find out which
 * single role they cannot fill, which is the most expensive order to learn it in.
 *
 * TWO READINGS IN ONE CARD, AND THEY ARE TWO INFORMATION TYPES. The roles are a
 * RANKING; the skill level is a LEVEL ON A NAMED LADDER. The catalogue's index
 * points those at two different forms and they must not be fused into one
 * drawing. The 2026-09-02 migration therefore takes the RANKING only, which is
 * this card's own queue row; the ladder is its own row (A3, StepLadder) and its
 * four-step band is left standing here, untagged, until that row is taken. A
 * declaration lands with its fix and never before it.
 *
 * FORM FOR THE RANKING: RankedTiles (idea I6), AND THIS DISAGREES WITH THE
 * QUEUE, which predicted LollipopColumn. The queue's own rule is that a
 * prediction is not a licence and that steps 2 and 3 win, with the disagreement
 * written down. Three reasons, any one of which would be arguable and which
 * together are not:
 *
 *   RULE 29A CANNOT BE SATISFIED BY A LOLLIPOP HERE. Worse reads low, better
 *   reads high, and a burden is inverted before rendering. Availability is
 *   already inverted, so the hardest role is the LOWEST value and therefore the
 *   SHORTEST stem, while the form's one accent sits on entry one. That puts the
 *   card's whole answer on the smallest mark in the drawing. Drawing "hardness"
 *   tall instead fixes the picture and breaks the rule, which every other scale
 *   on the page obeys.
 *
 *   THE MAGNITUDE IS NOT A QUANTITY. It is a modelled 0-to-100 availability
 *   index with no unit and no meaningful zero, so stem heights would publish
 *   distances the data does not hold, and the figures above the dots would be
 *   naked numbers ("22", "41") that answer no question a reader asked. That is
 *   the same objection that moved the risk section off its track.
 *
 *   A TRADE WITH THREE ROLES WOULD RENDER NOTHING. LollipopColumn's floor is
 *   four entries, on the catalogue's own instruction, and a plumber has three.
 *   The card would keep its answer and lose its evidence.
 *
 * WHAT CARRIES THE DISTANCES INSTEAD: the word already held against each role,
 * "Hard", "Slow", "Quick", "Same week". That is the resolution this data
 * honestly has, it descends down the column so the spread is legible without an
 * axis, and it says in a reader's own language what a stem height would have
 * said in an invented one.
 *
 * THE SKILL READING IS A LADDER NOW (A3, 2026-09-02), and it was four boxes in a
 * row until then. It was never a meter and must never become one: a continuous
 * marker claims 2.7 means something, and skill level is a category, you can
 * train them in a week or you cannot. What changed is that the four boxes were
 * `grid-cols-4` with no responsive variant, so at 375 they held three-line
 * labels and one of them broke "Train in a season" across three lines with the
 * article stranded alone on the second. The catalogue's StepLadder (idea I4) is
 * VERTICAL, so the defect goes by construction rather than by a breakpoint, and
 * every rung gains room for its own words.
 *
 * THE NUMERALS WENT WITH THE BOXES, on the catalogue's own instruction: "DO NOT
 * number the rungs." A reader learns nothing from a "3" in a box, and the boxed
 * numeral was the largest thing in the lower half of this card while saying the
 * least. What replaces it as the mark is the FILLED marker on the connector.
 *
 * THE LADDER YIELDS THE ACCENT, and that is the one composition decision this
 * card forced back into the form library. Two forms now share this box, and each
 * rations its own accent, so together they would put two orange marks in one
 * card, which step 8 calls a card with no answer. The standing keeps it, because
 * the standing's leader IS the card's answer restated; the ladder marks its
 * reached rung by filling the marker in ink instead. `accent={false}` says so at
 * the call site rather than in a comment.
 *
 * EVERY RUNG CARRIES ITS OWN CONSEQUENCE, AND THE CARD'S FOOT LOST ONE. The four
 * long sentences that used to print under the card, one per level, now sit on
 * their own rungs in short form, which is the whole reason the catalogue draws
 * the rungs a reader is NOT on: someone at "trained elsewhere" now learns what
 * "train in a week" would have meant. Keeping the long sentence in the foot as
 * well would have printed the reached rung's meaning twice in one card, which is
 * the repeated-title fault a photograph already caught on this exact card once.
 *
 * THE ANSWER is the BINDING CONSTRAINT, named. The hardest role is what will
 * delay an opening, so the hardest role IS the answer, with the time it takes to
 * fill beside it in ink2 so the phrase has its own internal rank. Ink, never
 * accent: a role is not a quantity to point at, and the constitution rations the
 * accent to answers that are.
 *
 * IT IS SET AT THE SECTION RUNG AND NOT THE FOCAL ONE, the same correction the
 * risk card took: "Chef" is a name, and step 5 of the subsection procedure says
 * a name takes lead or section size and never the size a figure takes. At 24
 * semibold it still stands 1.7x over the 14px roles ranked beneath it.
 *
 * SCALE DIRECTION, rule 29A: scarcity is a BURDEN, so it is inverted before it
 * reaches this component. High reads "easy to find", never "scarce". The roles
 * are then ranked HARDEST FIRST, because the top of a list is where a reader
 * looks and the hardest role is the one that matters. On a standing the
 * inversion never reaches the reader, which is the second reason the form suits:
 * nobody has to learn which end of a scale is the bad one.
 *
 * THE SAMPLE TAG IS ON, for the whole card. The availability behind the order is
 * modelled rather than counted, and a modelled figure without the tag is a lie
 * the reader cannot see (step 8).
 *
 * WHAT A RUNG SAYS IS TIME AND MONEY, never a restated number. Level 3 is not a
 * "3", it is "hire rather than train, and pay what the market asks", and that is
 * the sentence a reader acts on.
 */
const SKILL_STEPS: Array<{ name: string; meaning: string }> = [
  { name: "Train in a week", meaning: "A gap in the rota costs a week, not a season." },
  { name: "Train in a season", meaning: "A new hire earns their wage after a season of it." },
  { name: "Trained elsewhere", meaning: "Hire rather than train, at what the market asks." },
  { name: "Licensed or certified", meaning: "You hire a licence, and it leaves when they do." },
];

/** [role, 0-100 where high = easy to find, word, optional time to fill]. Already inverted. */
export type HireRole = [string, number, string, string?];

export function PeopleYouNeed({
  roles,
  level,
  next,
  anchorId,
}: {
  roles: HireRole[] | null;
  /** The four-step read. Null renders the card on its roles alone. */
  level: 1 | 2 | 3 | 4 | null;
  /** THE EXPECTED CHOICE: having seen who they need, they want what those people cost. */
  next?: { label: string; href: string };
  anchorId?: string;
}) {
  const held = (roles ?? []).filter((r) => Number.isFinite(r[1]));
  /* HARDEST FIRST. The scale is already inverted, so the hardest role is the
     LOWEST value on it. Sorted on a copy: the caller's array is its own. */
  const ranked = [...held].sort((a, b) => a[1] - b[1]);
  const hardest = ranked[0];
  const step = level != null ? SKILL_STEPS[level - 1] : null;
  /* THE EMPTY STATE, the constitution's single one: no answer field, no card. */
  if (!hardest && !step) return null;

  /* THE ANSWER TAKES NO ARTICLE, for the reason written on the price table: an
     article machine picks "a" or "an" from a letter and gets it wrong the first
     time a trade needs a hostess or an hour. The role names arrive as labels, and
     a label reads correctly as the subject of a headline. */
  const answer = hardest ? (
    <>
      {hardest[0]}.{" "}
      <span style={{ color: "var(--c-ink2)" }}>{cap(hardest[3] ?? `${hardest[2]} to find`)}.</span>
    </>
  ) : (
    <>{step?.name}.</>
  );

  return (
    <Section
      id={anchorId}
      kicker="Can you find the people"
      icon="hiring"
      sample
      lean
      answer={answer}
      answerKind="words"
      answerNote={hardest ? "The hardest role to fill, which is what will delay an opening." : undefined}
      next={next}
    >
      {/* THE ANSWER SAYS HOW LONG, THE ROW SAYS HOW HARD, so the two never print
          the same words twice. That distinction was found by looking rather than
          by reasoning: photographed at 1280 on the old track, the card read
          "Chef. Months to fill." and then "Chef / months to fill" again directly
          underneath it, which reads as a bug and not as emphasis. The standing
          carries each role's difficulty word, which the answer does not. */}
      {ranked.length > 0 ? (
        <RankedTiles
          rows={ranked.map((r) => ({ name: r[0], value: r[2] }))}
          ariaLabel="Roles, hardest to fill first"
        />
      ) : null}
      {step ? (
        <div className={ranked.length > 0 ? "mt-5" : ""}>
          {/* THE SUBHEAD IS THE SAME QUIET MICRO-CAPS TypicalSetup USES over its
              families. Two subjects in one card need a named seam, or the ladder
              reads as a second, unexplained scale hanging off the standing. It
              carries the subsection's own title, so the reader is told what the
              second reading measures before they read a rung of it. */}
          <div className="mb-1.5 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
            How skilled they must be
          </div>
          {/* THE LADDER RUNS HARDEST-RUNG-FIRST WITHOUT BEING TOLD TO: the form
              reverses for the drawing and `reached` keeps counting from the
              lowest, which is the order this file has always written the steps
              in and the order a reader would climb them. */}
          <StepLadder
            steps={SKILL_STEPS.map((s) => ({ name: s.name, meaning: s.meaning }))}
            reached={level}
            accent={false}
            ariaLabel="How skilled the people must be"
          />
        </div>
      ) : null}
    </Section>
  );
}

/* BOTH OLD NAMES SURVIVE, and they are not dead weight. A trade can hold roles
   with no skill level, or a level with no roles, and each wrapper renders the
   merged card on what it has: the answer falls back to the skill step's own words
   when there are no roles to rank. Every existing call site keeps compiling and
   none of them can produce the two half-cards the merge exists to remove. */
export function CanYouHire({ roles }: { roles: HireRole[] | null }) {
  return <PeopleYouNeed roles={roles} level={null} />;
}

export function SkillLevel({ level }: { level: 1 | 2 | 3 | 4 | null }) {
  return <PeopleYouNeed roles={null} level={level} />;
}

/* ================================================================== */
/* 7. WHO WALKS IN                                                     */
/* ================================================================== */
/**
 * WARRANT (subsection procedure, step 1). A visitor reads this to decide WHAT TO
 * PUT ON THE PRICE LIST AND WHETHER TO SELL FOR A RETURN VISIT OR FOR THIS ONE.
 * Without it they would price for the room they imagine rather than the room that
 * walks past, and would build a repeat-trade business on a street of strangers,
 * or a one-visit business among people who were going to come back every week.
 * NOT A DUPLICATE, checked on the render: no other card in either trade column
 * describes the customer at all. The price card states what things cost; it does
 * not say who is paying, and a price list is set by the room and not by the menu.
 *
 * INFORMATION TYPE (step 2): A POSITION BETWEEN TWO NAMED POLES, three times.
 * That is one index row and it names one form, and it is the ONLY reading on this
 * page for which a horizontal track is the right drawing rather than the lazy one.
 *
 * FORM: SpectraTable (idea I1), the two-pole character spectra the country and
 * city pages already use. Reusing it means a reader who has seen one page reads
 * this one without learning a new idiom (rule 32, one shared kit). It renders in
 * the ratified NAMED form, not the compact one: the trait name leads the row and
 * the explanatory poles sit under the track's own ends, which is the founder's
 * 2026-08-30 order on the country page, and it is selected by giving each row a
 * `name` below.
 * BUDGET, counted on the render before building, per trade column: restaurant I1
 * 2 of 2, I4 1 of 2, I8 9, I9 2, I11 2 of 2 (at cap). This card renders ONE I1,
 * because the form tags its wrapper once and not once per row, so the arithmetic
 * that binds it is one of two. It KEEPS the track it has rather than spending a
 * new one; the town hall hands the other back in the commit after this.
 *
 * His three characteristics, verbatim: "Personas by 3 characteristics: Wealth,
 * Resident/tourist/expat/commuter (speculative mechanic tbh), Age cohort."
 *
 * HE FLAGGED THE MIDDLE ONE HIMSELF as speculative, and he is right: the
 * resident-versus-visitor split is the same quantity that lands on its clamp
 * floor or ceiling for 155 of 246 cities today. It is included because he asked
 * for it and because the FORM is sound; it must not render until a source
 * exists that varies.
 *
 * NO DIRECTION GRADIENT, AND IT IS A DECISION RATHER THAN A DEFAULT. The form
 * marks a favourable end where one exists (`gradient`, the country page's
 * government-and-business table). None of these three has one. A careful room is
 * not a worse room than a comfortable one: it is a different price list, which is
 * exactly what the consequence beneath says in both directions. A district of
 * passers-by is not worse than a district of locals: it is a first-visit sale
 * instead of a repeat one. And a younger room is not worse than an older one at
 * all. Colouring an end would assert a direction the data does not have (rule 28,
 * form equals meaning), and rule 29A only ever puts the accent on a GOOD end, so
 * where there is no good end there is no accent: the dots are INK and the card
 * carries no terracotta anywhere. It also fails rule 21 the moment it is tried,
 * because "comfortable is the good end" is a claim about Dhaka and La Paz that
 * nothing in this section measures.
 *
 * WHAT CHANGED, 2026-09-01, constitution B3. Three unlabelled sliders were the
 * whole card, and a reader cannot act on a slider at 64.
 *
 * THE ANSWER is the PORTRAIT, composed from the three spectra into one phrase:
 * "Comfortable passers-by, middle-aged." That is what a reader wants and what
 * three sliders made them derive for themselves.
 * IT TAKES THE SECTION RUNG AND NOT THE FOCAL ONE, and that is a ladder rule
 * rather than a taste. Step 5 of the subsection procedure: "A WORD IS NOT A
 * QUANTITY. A state, a name, a verdict phrase takes lead or section size, never
 * focal or answer. Sizing a word like a figure was a named fault: it makes a card
 * look shouted rather than designed." Photographed at 375 before the fix, the
 * portrait ran to three lines of 30px type and was four fifths of everything
 * above the drawing. B4's count branch made the same move for the same reason.
 *
 * IT CARRIES THE SAMPLE TAG, and it had none until 2026-09-02. All three spectra
 * are modelled 0-to-100 positions with no unit, one of which the founder himself
 * called speculative; the people card beside it tags an availability index of
 * exactly that kind, and step 8 is explicit that a modelled figure without the
 * tag is a lie the reader cannot see.
 *
 * THE EVIDENCE is the same three spectra in the ratified NAMED-ROW form, the
 * trait name leading and the explanatory poles under the track's own ends, which
 * is the founder's 2026-08-30 order on the country page.
 *
 * WHY EACH ROW DECLARES A `kind` AND NOT ITS OWN COPY. The portrait and the
 * consequence are English, and English cannot be assembled out of pole labels:
 * "Passing through" is a phrase, "Comfortable" is an adjective, and gluing them
 * gives "Comfortable passing through". The alternative, shipping the words in
 * with the data, would put this card's writing in a fixture where it would drift
 * per place and read as invented. So the three spectra the constitution fixes
 * declare WHICH they are, which is a structural fact rather than copy, and the
 * component owns one well-written vocabulary that every place renders.
 *
 * AGE CONTRIBUTES TO THE PORTRAIT AND NOT TO THE CONSEQUENCE, deliberately. What
 * an age skew does to a business (evenings against daytimes, say) is folklore
 * until something measures it, and the constitution's own worked consequence
 * names only money and residency.
 */
export type PersonaKind = "money" | "residency" | "age";

export interface PersonaSpectrum {
  /** Which of the three fixed spectra this row is. Drives the composed English. */
  kind: PersonaKind;
  spectrum: string;
  left: string;
  right: string;
  /** 0-100 position. */
  value: number;
}

/** The portrait's vocabulary: [leans left, sits in the middle, leans right]. */
const PORTRAIT: Record<PersonaKind, [string, string, string]> = {
  money: ["careful with money", "mixed incomes", "comfortable"],
  residency: ["passers-by", "a mix of locals and visitors", "locals"],
  age: ["younger", "middle-aged", "older"],
};

/** What each lean means for an owner. Null where nothing measured says anything. */
const PERSONA_MEANS: Record<PersonaKind, [string, string, string] | null> = {
  money: [
    "price at the bottom of the local range",
    "price for a mixed room, with a cheap option and a dear one",
    "price at the top of the local range",
  ],
  residency: [
    "win the sale on the first visit, because most of them will not come back",
    "expect some of the trade to repeat and some of it to pass through",
    "expect the same faces, so the trade is steady rather than seasonal",
  ],
  age: null,
};

/* THE MIDDLE IS A REAL BAND, NOT A HAIRLINE AT FIFTY. A cut at exactly 50 would
   make 49 and 51 render opposite portraits off a difference neither the data nor
   a reader can defend. Twenty points either side of centre reads as "mixed",
   which is the honest word for a spectrum sitting near its middle.
   THE TWO THRESHOLDS ARE NAMED BECAUSE THE DRAWING NEEDS THEM TOO. They used to
   live only inside this function, so the track below drew its own middle as a
   hairline at 50 while this read it as a band: photographed at 1280, the age dot
   at 45 sat visibly left of the tick under a portrait calling the room
   middle-aged. A threshold that lives in two places diverges, so the spectra
   table is passed these and draws the same middle this composes from. */
const LEAN_LO = 40;
const LEAN_HI = 60;
const leanOf = (v: number): 0 | 1 | 2 => (v <= LEAN_LO ? 0 : v >= LEAN_HI ? 2 : 1);

export function WhoWalksIn({ rows }: { rows: PersonaSpectrum[] | null }) {
  if (!rows || rows.length === 0) return null;
  /* MAPPED AT THE BOUNDARY, and it is worth saying why rather than just doing
     it. SpectraTable takes `rows: any[]` and reads `left_label`, `right_label`
     and `position_0_1`. The first version of this component passed its own
     prop names straight through, and because the parameter is `any[]`
     TypeScript said nothing: the section rendered as an empty grey bar with no
     labels and a marker parked at the default centre. It compiled, it ran, and
     it was blank.

     That is the same defect class this phase exists to remove, arriving through
     a loose type: a frame around a value that never came. Keeping readable prop
     names here and translating once means the wrong shape cannot recur, and a
     screenshot is what caught it. */
  const mapped = rows.map((r) => ({
    /* `name` IS WHAT SELECTS THE NAMED ROW. SpectraTable renders the compact
       two-pole row when a row has no name and the ratified named form when it
       has one, and the constitution asks for the named form here. */
    name: r.spectrum,
    spectrum: r.spectrum,
    left_label: r.left,
    right_label: r.right,
    position_0_1: Math.max(0, Math.min(1, r.value / 100)),
  }));

  /* THE PHRASE IS ASSEMBLED FROM WHAT IS HELD, and the join is the whole grammar:
     everything but the last word is an adjective phrase, and the last is a tail
     after a comma. "Comfortable passers-by, middle-aged." One spectrum alone
     still reads as a portrait; a spectrum with no vocabulary drops out silently
     rather than leaving a hole in the sentence. */
  const words = rows.map((r) => PORTRAIT[r.kind]?.[leanOf(r.value)]).filter(Boolean) as string[];
  const portrait =
    words.length === 0
      ? null
      : words.length === 1
        ? `${cap(words[0])}.`
        : `${cap(words.slice(0, -1).join(" "))}, ${words[words.length - 1]}.`;

  const clauses = rows.map((r) => PERSONA_MEANS[r.kind]?.[leanOf(r.value)]).filter(Boolean) as string[];
  const consequence = clauses.length > 0 ? `${cap(clauses.join(", and "))}.` : null;

  if (!portrait) return null;
  return (
    <Section
      kicker="Who walks in"
      icon="who-for"
      sample
      answer={portrait}
      answerKind="words"
      answerNote="The room this trade sells to, read off the three spectra below."
      consequence={consequence}
    >
      <SpectraTable rows={mapped} middle={[LEAN_LO, LEAN_HI]} />
    </Section>
  );
}

/* ================================================================== */
/* 8. WHAT CAN GO WRONG                                                */
/* ================================================================== */
/**
 * WARRANT (subsection procedure, step 1). A visitor reads this to decide WHICH
 * FAILURE TO SPEND MONEY AND ATTENTION ON BEFORE OPENING, and whether cover is
 * worth buying at all. Without it they would have to find out which of the three
 * actually bites this trade in this place the expensive way, after it has bitten.
 *
 * His words: "Also burglary risk, lawsuit risk, penality risk, other typical
 * risks."
 *
 * INFORMATION TYPE (step 2): A RANKING OF NAMED THINGS, worst first. The
 * catalogue's index sends a ranking of FEW things to RankedTiles and a ranking of
 * many to LollipopColumn. Three named risks is few, so RankedTiles, which is what
 * the queue predicted.
 *
 * FORM: RankedTiles (idea I6), and this is the SECOND change of form here. It was
 * Dots, then EaseScale, and EaseScale is the shape the founder rejected across
 * the whole page on 2026-09-01: "in all sections you have just used this
 * horizontal bar with the points in between... you have overused it like crazy."
 * The diagnosis is not that a track is ugly. A track is the right drawing for ONE
 * reading, a position between two named poles, and this is not that reading:
 * "bites often" and "rarely bites" are not two poles a risk sits between, they are
 * the top and bottom of an ORDER. Drawing three markers at 40, 50 and 70 on a
 * rail also publishes distances that a modelled 0-to-10 score does not hold. The
 * standing claims the order and claims nothing else, which is exactly as much as
 * this data can carry.
 *
 * THE BUDGET (step 3): the trade page is at the horizontal-track cap of two, so a
 * fourth I1 was never available here. This move SPENDS one I6 of three and
 * RETURNS one I1, which is the direction every remaining row of the queue has to
 * run in.
 *
 * INVERTED BEFORE IT ARRIVES, rule 29A: a big risk reads as a LOW score, so
 * this section runs the same direction as every other scale on the page. Two
 * boxes in one band that disagree about which end is good is a defect, and the
 * risk section is where that always happens. On a standing the inversion is
 * invisible to the reader, which is the point: they meet the worst risk at rank
 * one and never have to learn which end of a scale is the bad one.
 *
 * THE SEVERITY MUST BE DERIVED, NOT LITERAL. The chip this replaces read "rare"
 * on all twenty trades in the atlas because it was a hardcoded string. Callers
 * pass a score computed from figures the atlas holds, and a risk with no figure
 * behind it is omitted rather than given a default. The WORD on each marker is
 * derived from that score here, for the same reason.
 *
 * THE ANSWER is the biggest risk NAMED WITH ITS DRIVER, standing at rank one of
 * the list beneath it. IT IS SET AT THE SECTION RUNG AND NOT THE FOCAL ONE, which
 * is a correction rather than a preference: "Break-in" is a name, and step 5 of
 * the subsection procedure says a name takes lead or section size and never the
 * size a figure takes. At 30 it was a word shouted; at 24 semibold it is a
 * verdict, and it still stands 1.7x over the 14px names ranked under it.
 *
 * WHAT THE DRIVERS COST, said plainly because it is the one thing this form gives
 * up. EaseScale carried a fourth slot, so every risk could show what drives it. A
 * standing has two columns, the name and the reading, and a third would turn the
 * form into something the catalogue does not hold. So the WORST risk's driver
 * rides in the answer, where a reader needs it, and the other two are not printed.
 * That is a real loss and it buys the reading: three risks in rank order with
 * their frequency down one aligned column, legible in about a second, against
 * four markers on a rail that had to be decoded against its end labels first.
 *
 * COMPOSITION (step 4): the rank numerals align down the left at mark size, the
 * frequency words align down the right in the figure face, and the risk names run
 * between them. ADJACENCY carries the meaning: rank one sits directly under the
 * answer that named it, so the answer and the top row are read as one object.
 *
 * THE FREQUENCY WORD IS DERIVED AND COARSER THAN THE ORDER, deliberately. Two
 * risks can both read "Sometimes" and still rank one above the other, because the
 * score behind them is finer than the four words it is bucketed into. That is a
 * league table with equal points separated on goal difference, and it is honest;
 * printing "4.0" and "5.0" instead would claim a precision the score has not got.
 *
 * THE SAMPLE TAG IS ON, and it belongs to the whole card. Every one of these
 * scores is derived rather than counted, and step 8 of the procedure is blunt
 * about it: a modelled figure without the tag is a lie the reader cannot see.
 *
 * THE CONSEQUENCE IS A COST ONLY WHERE A COST EXISTS. With an insurance figure
 * the ranking becomes a decision; without one the ranking stands alone and the
 * card implies no price at all, because a made-up premium is the single most
 * actionable fabrication this section could carry.
 */
export interface RiskRow {
  /** "Break-in", "Being sued", "Fines and penalties". */
  risk: string;
  /** 0-10 where HIGH IS GOOD, i.e. 10 means this rarely bites here. */
  safety: number | null;
  /** What drives it, in a few words. Never a sentence explaining the chart. */
  driver?: string;
}

/** The word on the marker, derived from the score. Never a caller's string. */
const riskWord = (safety: number) =>
  safety <= 3 ? "Often" : safety <= 5 ? "Sometimes" : safety <= 7 ? "Occasional" : "Rare";

export function WhatGoesWrong({
  rows,
  insuranceAnnual,
  localHourlyPay,
  currency = "$",
}: {
  rows: RiskRow[] | null;
  /** What cover against these costs a year. Absent means no cost is implied. */
  insuranceAnnual?: number | null;
  localHourlyPay?: number | null;
  currency?: string;
}) {
  const held = (rows ?? []).filter((r) => r.safety != null);
  if (held.length === 0) return null;
  /* WORST FIRST, on a copy of the caller's array. Low is bad on this scale. */
  const ranked = [...held].sort((a, b) => (a.safety as number) - (b.safety as number));
  const worst = ranked[0];
  const yard = localPayPhrase(insuranceAnnual, localHourlyPay);
  const consequence =
    insuranceAnnual != null
      ? `Cover against these runs about ${money(insuranceAnnual, currency)} a year here${yard ? `, ${yard}` : ""}.`
      : null;

  return (
    <Section
      kicker="What tends to go wrong"
      icon="safety"
      sample
      lean
      answer={
        <>
          {worst.risk}.
          {worst.driver ? (
            <span style={{ color: "var(--c-ink2)", fontWeight: 400 }}> {cap(worst.driver)}.</span>
          ) : null}
        </>
      }
      answerKind="words"
      answerNote="The one most likely to bite here, and what makes it likely."
      consequence={consequence}
    >
      {/* THE ORDER IS THE READING, so the form is a standing and not a scale.
          The caller has already sorted worst first; RankedTiles never sorts,
          because half of this site's rankings are best-when-low and a component
          that sorted would be guessing a direction nobody told it. */}
      <RankedTiles
        rows={ranked.map((r) => ({ name: r.risk, value: riskWord(r.safety as number) }))}
        ariaLabel="Risks here, worst first"
      />
    </Section>
  );
}

/* ================================================================== */
/* 9. DEALS AND SPECIAL REGIMES                                        */
/* ================================================================== */
/**
 * FORM: a plain three-column table (I8), with the terms behind one disclosure.
 * Every name and every worth is visible; only the explanation is behind a click.
 * IT WAS a per-row `Expand`, the founder's own ratified expandable row from the
 * legal-form table, and B4 below says why that had to yield.
 *
 * His words, and the reason this one is worth building: "Government subsidies
 * in social contributions, deals for special sectors, special economic zones or
 * regimes, etc. For example: accounting firms that operate under blah blah
 * blah, get a 10% attribution cost under blah blah blah, tiny details that
 * matter."
 *
 * WHAT CHANGED, 2026-09-01, constitution C3. It was CatRows: a name and a
 * sentence of prose per row, so the reader had to read two paragraphs to learn
 * what two schemes were worth. The value here IS the tiny detail, and a tiny
 * detail only matters if its WORTH is legible without reading the detail.
 *
 * K6 HOLDS AND IS THE REASON THE WORTH SITS IN THE SUMMARY. "Never hide a
 * graphic behind a popup, expand or disclosure; disclosures exist only to move
 * BULLET TEXT out of the first view." No figure hides here: every worth is on
 * the collapsed row, and only the words explaining the scheme are behind the
 * click.
 *
 * THE ANSWER is what they are worth together, where every scheme carries a
 * figure, and THE COUNT where they do not. That branch is not a degraded state:
 * for a scheme whose worth depends on a payroll nobody here knows, the count is
 * the only honest headline and the card says why the money is missing.
 *
 * NOTHING RENDERS WITHOUT A SOURCE. A scheme is a legal fact with a name and a
 * rate; inventing one would be the single most damaging fabrication on the
 * site, because a reader might act on it.
 *
 * ============ B4, 2026-09-02, THE SUBSECTION QUEUE ========================
 *
 * WARRANT (step 1). A visitor reads this to decide WHETHER THERE IS MONEY HERE
 * WORTH THE PAPERWORK, and which of their costs a relief actually lands on.
 * Without it they would budget the full rate on premises and payroll and never
 * learn that a relief exists, which is money left on the table every year and
 * invisible from outside. NOT A DUPLICATE: no other card in either trade column
 * states a relief, a subsidy or a special regime.
 *
 * THE QUEUE PREDICTED OptionCards AND IT IS REFUSED, ON THE SEMANTICS, and this
 * is the row's finding. Step zero rendered OptionCards in every state its
 * reading reaches and measured its craft claim clean at 0.00px, so the form is
 * not at fault; it is simply not this card's form.
 *   THESE SCHEMES ADD. The card's own answer is their SUM and the code sums
 *   them: a trade claims every one it qualifies for. A choice is a set of
 *   answers to ONE question, of which the reader takes exactly one, which is
 *   what the form's entry says in as many words ("a sole trader is not a worse
 *   limited company; it is a different answer to the same question"). Drawing
 *   two entitlements as a choice tells a reader to pick one of two reliefs they
 *   can both have. That is not a style error, it costs them money.
 *   ITS "USUAL CHOICE" BADGE CANNOT BE USED AT ALL here, which is the same fact
 *   read off the form's own parts: there is no usual scheme, only the ones you
 *   qualify for. B8, registering by legal form, is the row OptionCards is for,
 *   because a legal form is genuinely exclusive.
 *
 * SO THE INFORMATION IS ENTITIES ACROSS SEVERAL METRICS: each scheme has a name,
 * a worth, and what that worth is in the reader's own labour. The index sends
 * that to a plain table, and the catalogue calls the three-column table "the
 * founder's best-executed element". It is ALSO B1's table one band up, meaning
 * the same thing at the same widths, which is step 9's predictability rather
 * than a repetition of it.
 *
 * EVERY DRAWN FORM WAS COUNTED FIRST AND EVERY ONE IS UNAVAILABLE OR WRONG, which
 * is A8's own path through step 3. Measured on the render, per trade column:
 * I1 2 of 2 AT CAP, so no track. I2 LollipopColumn has a floor of four entries
 * and there are two, so it renders nothing. I3 StackBar is free and the parts do
 * sum, and it is refused on ADJACENCY: this card's band partner is the town hall,
 * whose Meter draws a horizontal bar, so a stacked bar beside it puts two
 * horizontal bars in one band, which is A10's own argument and the founder's
 * 2026-09-01 complaint arriving from a new direction. I4 is free and these are
 * not an ordered sequence. I7 has nothing to clear. I11 RankedTiles is 2 of 2 AT
 * CAP and the order is not the reading anyway. I12 is not a range.
 *
 * AND ONE FAULT THAT FORCED A FORM WHATEVER ELSE WAS DECIDED: the worth used to
 * ride an `Expand`, and `Expand` is filed under Chrome, "free; never counts,
 * never carries data alone". The only copy of every figure in this card sat on a
 * chrome element, where no catalogue and no budget could see it. It also
 * stranded: photographed at 693px, each scheme's name ended about 150px in and
 * its money began about 400px later, which is A1's "pairs marooned across a gap"
 * in a different card. A table's columns divide the width by construction, so
 * the stranding cannot come back at any width.
 *
 * THE TERMS STAY, BEHIND ONE CLICK, because they are the founder's own reason for
 * the section ("tiny details that matter") and K6 allows exactly this: words move
 * out of the first view, figures never do. Every worth is in the table.
 */
export interface RegimeRow {
  /** The scheme's own name, as the law calls it. */
  name: string;
  /** What it is worth a year to this trade. Null where that is not knowable. */
  worth: number | null;
  /** The tiny detail, behind the click. Words only, never a figure of its own. */
  detail: React.ReactNode;
  /** Which cost it bites on. Drives the consequence; absent drops the clause. */
  cuts?: "staff" | "profit" | "premises";
}

const CUT_NOUN: Record<"staff" | "profit" | "premises", string> = {
  staff: "staff",
  profit: "profit",
  premises: "the premises",
};

export function DealsAndRegimes({
  rows,
  localHourlyPay,
  currency = "$",
}: {
  rows: RegimeRow[] | null;
  /** THE UNIVERSAL YARDSTICK, and this card had none. Rule 21: "$4,300 a year"
   *  is meaningless in Tirana and "about two months of local pay" is not. It is
   *  the third column, exactly as it is in B1's price table one band up. Absent,
   *  the column does not draw and the table is two columns wide. */
  localHourlyPay?: number | null;
  currency?: string;
}) {
  const held = rows ?? [];
  if (held.length === 0) return null;
  const priced = held.filter((r) => r.worth != null);
  const total = priced.length === held.length ? priced.reduce((a, r) => a + (r.worth as number), 0) : null;
  /* THE YARDSTICK COLUMN DRAWS ONLY WHERE A WAGE IS HELD, which is B1's own
     `showYard` guard reused rather than rediscovered. */
  const showYard = localPayUnit(1, localHourlyPay) != null && priced.length > 0;

  /* THE CONSEQUENCE SAYS WHAT THEY BITE ON, because two schemes worth the same
     money are different businesses if one cuts payroll and the other cuts rent.
     The count leads it only when the ANSWER is not already the count: repeating
     the answer one line under itself is rule N8's restatement. */
  const kinds = [...new Set(held.map((r) => r.cuts).filter(Boolean))] as Array<"staff" | "profit" | "premises">;
  let tail: string | null = null;
  if (kinds.length === 1) {
    const only = kinds[0];
    const subject = held.length === 1 ? "it cuts" : held.length === 2 ? "both cut" : "all of them cut";
    tail = `${subject} what you pay on ${CUT_NOUN[only]}${only === "profit" ? "" : " rather than on profit"}`;
  } else if (kinds.length > 1) {
    tail = `they cut what you pay on ${kinds.map((k) => CUT_NOUN[k]).join(" and on ")}`;
  }
  const scheme = held.length === 1 ? "scheme applies" : "schemes apply";
  const consequence = tail
    ? total != null
      ? `${cap(wordFor(held.length))} ${scheme} to this trade here, and ${tail}.`
      : `${cap(tail)}.`
    : null;

  return (
    <Section
      kicker="Schemes you may qualify for"
      icon="free-zone"
      accent={total != null}
      answer={total != null ? <Fig>{money(total, currency)}</Fig> : `${cap(wordFor(held.length))} ${held.length === 1 ? "scheme" : "schemes"}.`}
      {...(total == null ? { answerKind: "words" as const } : {})}
      answerNote={
        total != null
          ? held.length === 1
            ? /* A ONE-ROW TABLE MADE A PRE-EXISTING COPY FAULT VISIBLE: "what
                 THEY are worth, TOGETHER" of a single scheme. The consequence
                 was already singular-aware and the note was not. */
              "What it is worth to this trade in a year."
            : "What they are worth to this trade in a year, together."
          : "What each is worth depends on a payroll this page does not know, so the count leads and the terms sit behind the table."
      }
      consequence={consequence}
    >
      {/* THE COLUMN SPLIT IS DECLARED, NOT LEFT TO THE CONTENT, which is B1's own
          finding on this surface: left to itself a table hands the widest column
          to the muted support and starves the name. A scheme's name is the
          longest thing here by a distance ("Employment allowance for small
          employers" is a real name shape), so it takes the half and the two
          figure columns divide the rest. */}
      {/* THE DECLARATION LANDS WITH THE FIX, which is the wave-C rule applied
          to a card that was hiding its figures on chrome. B1's price table one
          band up carries the same tag meaning the same thing. */}
      <table data-idea="I8" className="w-full border-collapse">
        <colgroup>
          {/* B1'S OWN 46/22/32, MEASURED THERE AND REUSED HERE RATHER THAN
              GUESSED AGAIN. A first cut gave the name 50% and the yardstick 28,
              and at 327px that is an 86px column where "OF LOCAL PAY" broke to
              THREE lines and left a ragged block of capitals floating above two
              bottom-aligned heads. At 32% the column is 98px and the head takes
              two lines, which is exactly what it does one band up. */}
          <col className={showYard ? "w-[46%]" : "w-[70%]"} />
          <col className={showYard ? "w-[22%]" : "w-[30%]"} />
          {showYard ? <col className="w-[32%]" /> : null}
        </colgroup>
        <thead>
          {/* BOTTOM-ALIGNED, B1's rule, kept for the same reason: a longer unit
              in another currency brings the two-line head straight back, and
              top-aligned half-heads interleave into one scrambled line. */}
          <tr className="border-b border-[var(--c-border)]">
            <th scope="col" className="py-1.5 align-bottom text-left text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
              Scheme
            </th>
            <th scope="col" className="py-1.5 align-bottom text-right text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
              A year
            </th>
            {showYard ? (
              <th scope="col" className="py-1.5 pl-2 align-bottom text-right text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
                Of local pay
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {held.map((r) => (
            <tr key={r.name} className="border-b border-[var(--c-border)] last:border-0">
              <td className="py-2 text-[length:var(--t-body)] text-[var(--c-ink)]">{r.name}</td>
              {/* AN UNPRICED SCHEME SAYS SO, IN THE SPACE ITS FIGURES WOULD HAVE
                  TAKEN. A blank cell reads as an oversight and a dash reads as a
                  value; the row exists because the scheme exists and the money is
                  the part nobody holds. The words are the TYPE'S own ("null where
                  that is not knowable") and nothing more, because a cell claiming
                  WHY it is not knowable would be inventing a reason: a relief can
                  turn on a payroll, a turnover or a floor area, and this row
                  carries no field saying which.
                  IT SPANS BOTH FIGURE COLUMNS, which is not a nicety: at 327px the
                  money column is 67px and the phrase is about 78, so on its own it
                  would break across two lines in a table where every other cell is
                  one. Spanning gives it 165px and one line. */}
              {r.worth != null ? (
                <td className="fig whitespace-nowrap py-2 text-right text-[length:var(--t-body)] tabular-nums text-[var(--c-ink)]">
                  {money(r.worth, currency)}
                </td>
              ) : (
                <td
                  colSpan={showYard ? 2 : 1}
                  className="py-2 text-right text-[length:var(--t-micro)] leading-tight text-[var(--c-muted)]"
                >
                  Not knowable
                </td>
              )}
              {showYard && r.worth != null ? (
                <td className="py-2 pl-2 text-right text-[length:var(--t-micro)] leading-tight text-[var(--c-muted)]">
                  {localPayUnit(r.worth, localHourlyPay)}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
      {/* THE TINY DETAILS, WORDS ONLY, ONE CLICK. They were a per-row Expand,
          which is chrome, and the chrome was carrying every figure in the card.
          The figures are in the table now and only the prose is behind the
          click, which is exactly what K6 permits a disclosure to hold. */}
      <InlineDisclosure name="trade-regimes" className="group mt-4" summary="What each of these actually says">
        <div className="mt-2 space-y-2.5">
          {held.map((r) => (
            <p key={r.name} className="text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)]">
              <span className="font-semibold text-[var(--c-ink)]">{r.name}. </span>
              {r.detail}
            </p>
          ))}
        </div>
      </InlineDisclosure>
    </Section>
  );
}

/* ================================================================== */
/* 10. HOW CLEAN IS THE TOWN HALL                                      */
/* ================================================================== */
/**
 * FORM: Meter, inverted.
 *
 * His words: "Incidence of corruption of mayoral/government officials."
 *
 * INVERTED SO HIGH READS GOOD, rule 29A. Corruption is a burden, so the value
 * passed in is CLEANLINESS, and the ends are labelled accordingly. A meter
 * where right means "more corrupt" would be the only scale on the page pointing
 * the other way.
 *
 * THE UNIVERSALITY TEST IS THE HARD ONE HERE, harder than for tipping. This
 * section renders a judgement about a place's officials, and it must be a
 * published, comparable measure rather than an impression, or it is
 * condescending in exactly the places rule 21 names. If no such measure exists
 * for a country, this renders NOTHING. That is not a degraded state; for this
 * section it is the correct one.
 *
 * WHAT CHANGED, 2026-09-01, constitution C4.
 *
 * THE DIRECTION IS NAMED IN WORDS, INSIDE THE ANSWER. A bare 71 on a scale
 * nobody has named is the exact shape of a number a reader cannot use: high
 * might be clean or high might be corrupt, and a meter with two end labels a
 * line below does not settle it fast enough. The answer now says "of 100, high
 * is clean" in ink2 beside the figure, so the reading and its direction arrive
 * together and nothing has to be inferred from the track.
 *
 * THE SCALE IS NAMED PLAINLY AND NEVER BY AGENCY (the standing rule and its own
 * gate). "A published perception measure" is what a reader needs; whose measure
 * it is belongs to the provenance envelope, not to the card.
 *
 * THE CONSEQUENCE is what the reading predicts for an owner, which is whether a
 * permit moves on its own or needs chasing. That is the only thing this number
 * changes about anybody's week.
 *
 * IT CARRIES THE SAMPLE TAG ALWAYS, and it says the substitution in its own
 * words underneath. This is a NATIONAL measure standing in for a local one, and
 * a card that quietly let a country's reading pass as its town hall's would be
 * the honesty failure this whole section is most exposed to.
 */
export function TownHall({
  cleanliness,
  scale,
}: {
  /** 0-100, HIGH IS CLEAN. Already inverted from any corruption measure. */
  cleanliness: number | null;
  /** What the reader is looking at, in a few words. Never a sentence. */
  scale?: string;
}) {
  if (cleanliness == null) return null;
  const consequence =
    cleanliness >= 65
      ? "At this end a permit usually moves on its own, so budget the waiting rather than somebody to do the chasing."
      : cleanliness >= 40
        ? "In the middle a permit moves when it is followed up, so somebody has to own it rather than file it."
        : "At this end assume nothing moves unless it is chased, and budget somebody's week for the chasing.";
  return (
    <Section
      kicker="Dealing with the council"
      icon="corruption"
      sample
      answer={
        <>
          {/* THE DIRECTION DOES NOT BREAK IN HALF. Photographed at 375 and in the
              one-third column at 1280, the answer wrapped as "71 of 100, high is"
              over "clean", which reads as a sentence that ran out of room. Held
              together, it breaks after the comma instead and the two halves of
              the answer land one per line, which is what they are. */}
          <Fig>{cleanliness}</Fig>{" "}
          <span style={{ color: "var(--c-ink2)" }}>
            of 100, <span className="whitespace-nowrap">high is clean</span>
          </span>
        </>
      }
      consequence={consequence}
    >
      <Meter value={cleanliness} left="Expect friction" right="Straightforward" />
      <div className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">
        {scale ? `${scale}. ` : ""}Measured for the country rather than the town, so it stands in for the local read.
      </div>
    </Section>
  );
}
