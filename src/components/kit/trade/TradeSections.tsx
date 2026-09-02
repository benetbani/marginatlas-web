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
   founder counted. Meter and SpectraTable are still here because tipping, the
   town hall and who-walks-in have not had their rows taken yet. */
import { Box, Rail, Fig, KV, Meter, SpectraTable, Expand, cap } from "@/components/spine/kit";
/* THE CATALOGUE'S OWN VOCABULARY, WHICH THIS FILE COULD NOT REACH UNTIL NOW.
   Every section below was written against a kit that exported three drawings,
   all three of them horizontal tracks, which is the whole mechanism behind the
   founder's 2026-09-01 rejection ("in all sections you have just used this
   horizontal bar with the points in between"). forms-v2.tsx holds the eight
   replacements; sections migrate onto them one at a time, each with its own
   photograph and its own commit. */
import { RankedTiles } from "@/components/spine/forms-v2";

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
 */
export interface PriceRow {
  item: string;
  price: number | null;
  note?: string;
}

export function WhatThingsCost({
  rows,
  typicalTicket,
  localHourlyPay,
  currency = "$",
  next,
  anchorId,
}: {
  rows: PriceRow[] | null;
  /** THE ANSWER: what one customer pays on a normal visit. Carried, never derived. */
  typicalTicket: number | null;
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
  const yard = held.length > 0 ? localPayPhrase(held[0].price, localHourlyPay) : null;
  /* THE ITEM KEEPS ITS OWN CAPITAL AND TAKES NO ARTICLE. An article machine
     would have to choose "a" or "an" from a letter, and it gets "an English
     breakfast" wrong the first time a trade sells one. The item names come from
     the trade profile as labels, and a label reads correctly as the subject of
     a headline-style line. */
  const consequence = yard ? `${held[0].item} costs ${yard} here.` : null;
  const showYard = localPayUnit(1, localHourlyPay) != null;

  return (
    <Section
      id={anchorId}
      kicker="What people pay here"
      icon="sale-tag"
      accent
      answer={<Fig>{money(typicalTicket, currency)}</Fig>}
      answerNote={
        ticketPhrase
          ? `What one customer pays on a normal visit. ${cap(ticketPhrase)}.`
          : "What one customer pays on a normal visit."
      }
      consequence={consequence}
      next={next}
    >
      {held.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            {/* THE HEADERS BOTTOM-ALIGN, AND IT IS NOT A NICETY. Photographed at
                the constitution's one-third width: "TYPICAL PRICE" wrapped to two
                lines beside "HOURS OF LOCAL PAY" wrapping to two lines, and top-
                aligned the four half-headers interleaved into one scrambled line
                that read "TYPICAL HOURS OF LOCAL / PRICE PAY". Bottom-aligned,
                each header's last word sits on the shared baseline and the two
                columns separate. The price header also stops wrapping: it is the
                one a reader looks for. */}
            <tr className="border-b border-[var(--c-border)]">
              <th scope="col" className="py-1.5 align-bottom text-left text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
                Item
              </th>
              <th scope="col" className="py-1.5 align-bottom text-right text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
                Typical price
              </th>
              {showYard ? (
                <th scope="col" className="py-1.5 pl-2 align-bottom text-right text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
                  Hours of local pay
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {held.map((r) => (
              <tr key={r.item} className="border-b border-[var(--c-border)] last:border-0">
                <td className="py-2 text-[length:var(--t-body)] text-[var(--c-ink)]">
                  {r.item}
                  {r.note ? (
                    <span className="ml-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">{r.note}</span>
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
 * FORM: Meter. One marker on a two-end labelled track.
 *
 * Tipping is a position on a known scale from "nobody does" to "always, and
 * they notice", which is exactly what a Meter is for. A percentage bar would
 * claim a precision that tipping custom does not have.
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
 * "NOT EXPECTED HERE" IS A REAL ANSWER AND RENDERS AS ONE. The section never
 * self-omits for a low value and never hedges: it says so in words at the same
 * size the share would have taken, in ink rather than accent because a custom
 * that does not exist is not a quantity to point at. This is the branch that
 * decides whether the section survives rule 21 or patronises half the world.
 *
 * THE CONSEQUENCE IS THE FUNCTIONAL HEART, and it is the one thing the old card
 * never said: tips change the WAGE BILL. They land on staff take-home without
 * landing on the owner's payroll, which is the only reason an owner needs to
 * know the custom at all.
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
     "0%" at focal would render absence as a quantity. Both halves have to agree
     before the card claims a customary share: a share with nobody expecting it
     is folklore, and an expectation with no share attached has no money in it. */
  const expected = typicalShare != null && typicalShare > 0 && expectation > 10;
  return (
    <Section
      kicker="Tipping"
      icon="payments"
      accent={expected}
      answer={expected ? <Fig>{typicalShare}%</Fig> : "Not expected here."}
      answerNote={expected ? "The customary share of the bill, on top of it." : undefined}
      consequence={
        expected
          ? `${expectation >= 55 ? "Expected" : "Offered rather than expected"} here, and it goes to the staff, so it lifts their take-home without lifting your wage cost.`
          : "Wages carry the whole of pay here, so budget the full cost of a shift into the rota."
      }
    >
      <Meter value={expectation} left="Not expected" right="Always expected" />
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
  const perWeek =
    total != null && typicalTicket != null && typicalTicket > 0
      ? Math.max(1, Math.round(total / typicalTicket / 52))
      : null;
  const consequence =
    seats != null && total != null && covered != null
      ? `${cap(wordFor(covered))} ${plural} cost ${money(total, currency)} a year and seat ${wordFor(seats)} more people${
          perWeek != null
            ? `, so they pay for themselves at about ${wordFor(perWeek)} extra ${perWeek === 1 ? "customer" : "customers"} a week`
            : ""
        }.`
      : null;
  const perUnitYard = localPayPhrase(annual, localHourlyPay);
  const totalYard = localPayUnit(total, localHourlyPay);

  return (
    <Section
      kicker="Putting tables on the pavement"
      icon="high-street"
      accent
      answer={<Fig>{money(annual, currency)}</Fig>}
      answerNote={`A year, per ${unit}.${perUnitYard ? ` ${cap(perUnitYard)}.` : ""}`}
      consequence={consequence}
    >
      {covered != null ? (
        <>
          <KV k="Covered" v={`${covered} ${plural}`} />
          <KV
            k="All of them"
            v={
              <>
                {money(total as number, currency)} a year
                {totalYard ? (
                  <span className="ml-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">{totalYard} of local pay</span>
                ) : null}
              </>
            }
          />
        </>
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
 * THE SKILL BAND STAYS AS IT WAS: a discrete four-step read, NOT a meter. A
 * continuous marker claims 2.7 means something. Skill level is a category: you
 * can train them in a week, or you cannot (FORM-CATALOG, PriceTierBand). A3
 * replaces it with the vertical StepLadder, whose rungs each carry their own
 * words, and that is a different subsection's photograph.
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
 * THE ACTIVE SKILL STEP READS IN INK, NOT TERRACOTTA, and that is a change from
 * what was here. A terracotta fill on the active step put the card's only accent
 * on its EVIDENCE while its answer sat in ink, which is the hierarchy upside
 * down. A darker border, a soft fill and an ink figure mark the step just as
 * unmistakably without spending an accent this card is not entitled to.
 *
 * THE CONSEQUENCE is what the level MEANS in time and money, which four numbered
 * boxes never said. Level 3 is not a number, it is "trained elsewhere, so expect
 * to hire rather than train".
 */
const SKILL_STEPS = [
  { n: 1, label: "Train in a week" },
  { n: 2, label: "Train in a season" },
  { n: 3, label: "Trained elsewhere" },
  { n: 4, label: "Licensed or certified" },
];

/** THE CONSEQUENCE, one line per step. Time and money, never a restated number. */
const SKILL_MEANS: Record<1 | 2 | 3 | 4, string> = {
  1: "You can train someone yourself in a week, so a gap in the rota costs a week rather than a season.",
  2: "You can train them yourself, but a new hire only earns their wage after a season of it.",
  3: "They are trained somewhere else, so expect to hire rather than train, and to pay what the market asks.",
  4: "The certificate belongs to the person and not to the business, so you are hiring a licence and waiting on whoever holds one.",
};

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
    <>{step?.label}.</>
  );

  return (
    <Section
      id={anchorId}
      kicker="Can you find the people"
      icon="hiring"
      sample
      answer={answer}
      answerKind="words"
      answerNote={hardest ? "The hardest role to fill, which is what will delay an opening." : undefined}
      consequence={level != null ? SKILL_MEANS[level] : null}
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
              families. Two subjects in one card need a named seam, or the four
              boxes read as a second, unexplained scale. */}
          <div className="mb-1.5 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
            How skilled they must be
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {SKILL_STEPS.map((s) => {
              const active = s.n === level;
              return (
                <div
                  key={s.n}
                  aria-current={active ? "step" : undefined}
                  className={
                    "rounded-md border px-2 py-2 text-center " +
                    (active
                      ? "border-[var(--c-line-strong)] bg-[var(--c-soft2)]"
                      : "border-[var(--c-border)]")
                  }
                >
                  <div
                    className={
                      "fig text-[length:var(--t-lead)] tabular-nums " +
                      (active ? "text-[var(--c-ink)]" : "text-[var(--c-muted)]")
                    }
                  >
                    {s.n}
                  </div>
                  <div
                    className={
                      "mt-0.5 text-[length:var(--t-micro)] leading-tight " +
                      (active ? "text-[var(--c-ink2)]" : "text-[var(--c-muted)]")
                    }
                  >
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>
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
 * FORM: SpectraTable, the two-pole character spectra the country and city pages
 * already use. Reusing it means a reader who has seen one page reads this one
 * without learning a new idiom (rule 32, one shared kit).
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
 * NO DIRECTION GRADIENT. These are neutral reads: neither end of "younger to
 * older" is better for business, and colouring one end would assert a direction
 * the data does not have (rule 28). The dots are INK, which is the default, and
 * saying so here is the point: money, residency and age have no better end, so
 * no end is marked and no dot carries the accent.
 *
 * WHAT CHANGED, 2026-09-01, constitution B3. Three unlabelled sliders were the
 * whole card, and a reader cannot act on a slider at 64.
 *
 * THE ANSWER is the PORTRAIT, composed from the three spectra into one phrase:
 * "Comfortable passers-by, middle-aged." That is what a reader wants and what
 * three sliders made them derive for themselves.
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
   which is the honest word for a spectrum sitting near its middle. */
const leanOf = (v: number): 0 | 1 | 2 => (v <= 40 ? 0 : v >= 60 ? 2 : 1);

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
      answer={portrait}
      answerNote="The room this trade sells to, read off the three spectra below."
      consequence={consequence}
    >
      <SpectraTable rows={mapped} />
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
 * FORM: Expand, the founder's own ratified expandable row from the legal-form
 * table. Name and worth visible collapsed, the explanation behind the click.
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
  currency = "$",
}: {
  rows: RegimeRow[] | null;
  currency?: string;
}) {
  const held = rows ?? [];
  if (held.length === 0) return null;
  const priced = held.filter((r) => r.worth != null);
  const total = priced.length === held.length ? priced.reduce((a, r) => a + (r.worth as number), 0) : null;

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
      answerNote={
        total != null
          ? "What they are worth to this trade in a year, together."
          : "What each is worth depends on a payroll this page does not know, so the count leads and the terms sit behind each row."
      }
      consequence={consequence}
    >
      <div className="space-y-2">
        {held.map((r) => (
          <Expand
            key={r.name}
            name="trade-regimes"
            title={r.name}
            right={
              r.worth != null ? (
                <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">{money(r.worth, currency)} a year</Fig>
              ) : null
            }
          >
            {r.detail}
          </Expand>
        ))}
      </div>
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
