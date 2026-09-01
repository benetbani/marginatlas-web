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
 * WHAT WAVE 1 DID AND DID NOT DO, stated so the gap is legible rather than
 * mysterious. Chapter A (TypicalSetup, WhatThingsCost) is redesigned to the
 * constitution. The other eight are UNTOUCHED except for one mechanical rename,
 * `title=` to `kicker=`, which is the cost of all ten sharing one wrapper. They
 * therefore render today with a rail and their evidence and NO answer and NO
 * consequence, which is knowingly non-conforming: the constitution's own empty
 * state says a section renders when it has its ANSWER field. Wave 2 gives them
 * one, copying chapter A's pattern. Until then their shape is the honest record
 * of what is missing, not a claim that they are finished.
 */
import * as React from "react";
import { Box, Rail, KV, Stat, Meter, EaseScale, SpectraTable, CatRows, Dots } from "@/components/spine/kit";

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
  answerNote,
  accent = false,
  children,
  consequence,
  next,
  id,
}: {
  kicker: string;
  icon?: React.ComponentProps<typeof Rail>["icon"];
  sample?: boolean;
  /** THE ANSWER. Absent means the section is a wave-2 skeleton, not a finished card. */
  answer?: React.ReactNode;
  /** Sits BENEATH the answer at micro, never beside it competing. The yardstick's seat. */
  answerNote?: React.ReactNode;
  accent?: boolean;
  /** THE EVIDENCE. */
  children?: React.ReactNode;
  /** THE CONSEQUENCE. One line, composed from the section's own fields. */
  consequence?: React.ReactNode;
  /** THE EXPECTED CHOICE, one click. */
  next?: { label: string; href: string };
  id?: string;
}) {
  return (
    <Box id={id} data-trade-section="1">
      <div style={{ padding: "20px" }}>
        <Rail icon={icon} kicker={kicker} sample={sample} />
        {answer != null ? (
          <div className="mb-3.5">
            <div
              className="text-[length:var(--t-focal)] leading-none"
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
const WORD = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
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
 * may stay a number (rule 26).
 *
 * NO ANSWER, NO CONSEQUENCE, YET. This is one of the ten skeletons the shared
 * anatomy above now hosts unchanged. Chapter A of the constitution redesigns it
 * in the very next commit; it is left alone here so the anatomy lands on its own
 * and can be read without a redesign mixed into it.
 */
export interface TypicalSetupProps {
  rows: Array<{ label: string; value: string }> | null;
}

export function TypicalSetup({ rows }: TypicalSetupProps) {
  if (!rows || rows.length === 0) return null;
  return (
    <Section kicker="What it takes to run one" icon="unit-economics">
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 lg:grid-cols-3">
        {rows.map((r) => (
          <KV key={r.label} k={r.label} v={r.value} />
        ))}
      </div>
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
 */
export interface PriceRow {
  item: string;
  price: number | null;
  note?: string;
}

export function WhatThingsCost({
  rows,
  currency = "$",
}: {
  rows: PriceRow[] | null;
  currency?: string;
}) {
  const held = (rows ?? []).filter((r) => r.price != null);
  if (held.length === 0) return null;
  return (
    <Section kicker="What people pay here" icon="sale-tag">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--c-border)]">
            <th scope="col" className="py-1.5 text-left text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
              Item
            </th>
            <th scope="col" className="py-1.5 text-right text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
              Typical price
            </th>
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
              <td className="fig py-2 text-right text-[length:var(--t-body)] tabular-nums text-[var(--c-ink)]">
                {money(r.price as number, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
 * as a real answer rather than as an empty section or a hedge. It does: the
 * marker sits at the left end and the share reads as nothing.
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
  return (
    <Section kicker="Tipping" icon="payments">
      <Meter value={expectation} left="Not expected" right="Always expected" />
      {typicalShare != null ? (
        <div className="mt-3">
          <Stat value={`${typicalShare}%`} label="Customary share of the bill" />
        </div>
      ) : null}
    </Section>
  );
}

/* ================================================================== */
/* 4. PAYING FOR THE PAVEMENT                                          */
/* ================================================================== */
/**
 * FORM: Stat. A lone number may stay a number (rule 26); the corollary that
 * every lone number must become a chart was repealed for being a
 * bar-manufacturing machine.
 *
 * His words: "Taxes for taking public space." A terrace, an A-board, a
 * pavement table. It is one annual figure and a unit, and drawing it as
 * anything would be decoration.
 */
export function PublicSpaceCost({
  annual,
  unit,
  currency = "$",
}: {
  annual: number | null;
  /** What the fee is charged per: a table, a square metre, a frontage metre. */
  unit: string | null;
  currency?: string;
}) {
  if (annual == null || !unit) return null;
  return (
    <Section kicker="Putting tables on the pavement" icon="high-street">
      <Stat value={money(annual, currency)} label={`A year, per ${unit}`} size="focal" />
    </Section>
  );
}

/* ================================================================== */
/* 5. CAN YOU HIRE                                                     */
/* ================================================================== */
/**
 * FORM: EaseScale. Several labelled markers on ONE shared left-right scale
 * with end labels, so the roles are compared against each other rather than
 * each getting its own track.
 *
 * His words: "Availability of talent for this specific activity in this place
 * (influenced by unemployment and young unemployment in that country or
 * province)."
 *
 * SCALE DIRECTION, rule 29A: scarcity is a BURDEN, so it is inverted before it
 * reaches this component. High and right reads "easy to find", never "scarce".
 */
export function CanYouHire({
  roles,
}: {
  /** [role, 0-100 where high = easy to find, word, optional sub]. Already inverted. */
  roles: Array<[string, number, string, string?]> | null;
}) {
  if (!roles || roles.length === 0) return null;
  return (
    <Section kicker="Can you find people" icon="hiring">
      <EaseScale rows={roles} endLabels={["Hard to find", "Easy to find"]} />
    </Section>
  );
}

/* ================================================================== */
/* 6. HOW SKILLED THEY NEED TO BE                                      */
/* ================================================================== */
/**
 * FORM: a discrete four-step band, per the founder's "scale of 1 to 4, simple".
 *
 * NOT A METER, and that is the whole reason this is a separate component rather
 * than a second call to the one above. A continuous marker on a track claims
 * that 2.7 means something. Skill level is a category: you can train them in a
 * week, or you cannot. A continuous meter for a categorical read is false
 * precision (FORM-CATALOG, PriceTierBand).
 */
const SKILL_STEPS = [
  { n: 1, label: "Train in a week" },
  { n: 2, label: "Train in a season" },
  { n: 3, label: "Trained elsewhere" },
  { n: 4, label: "Licensed or certified" },
];

export function SkillLevel({ level }: { level: 1 | 2 | 3 | 4 | null }) {
  if (level == null) return null;
  return (
    <Section kicker="How skilled they need to be" icon="staffing-rota">
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
                  ? "border-[var(--terra-border)] bg-[var(--terra-soft)]"
                  : "border-[var(--c-border)]")
              }
            >
              <div
                className={
                  "fig text-[length:var(--t-lead)] tabular-nums " +
                  (active ? "text-[var(--terra-text)]" : "text-[var(--c-muted)]")
                }
              >
                {s.n}
              </div>
              <div className="mt-0.5 text-[length:var(--t-micro)] leading-tight text-[var(--c-muted)]">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
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
 * the data does not have (rule 28).
 */
export interface PersonaSpectrum {
  spectrum: string;
  left: string;
  right: string;
  /** 0-100 position. */
  value: number;
}

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
    spectrum: r.spectrum,
    left_label: r.left,
    right_label: r.right,
    position_0_1: Math.max(0, Math.min(1, r.value / 100)),
  }));
  return (
    <Section kicker="Who walks in" icon="who-for">
      <SpectraTable rows={mapped} />
    </Section>
  );
}

/* ================================================================== */
/* 8. WHAT CAN GO WRONG                                                */
/* ================================================================== */
/**
 * FORM: Dots, the 0-10 score rows the July country render used.
 *
 * His words: "Also burglary risk, lawsuit risk, penality risk, other typical
 * risks."
 *
 * INVERTED BEFORE IT ARRIVES, rule 29A: a big risk reads as a LOW score, so
 * this section runs the same direction as every other scale on the page. Two
 * boxes in one band that disagree about which end is good is a defect, and the
 * risk section is where that always happens.
 *
 * THE SEVERITY MUST BE DERIVED, NOT LITERAL. The chip this replaces read "rare"
 * on all twenty trades in the atlas because it was a hardcoded string. Callers
 * pass a score computed from figures the atlas holds, and a risk with no figure
 * behind it is omitted rather than given a default.
 */
export interface RiskRow {
  /** "Break-in", "Being sued", "Fines and penalties". */
  risk: string;
  /** 0-10 where HIGH IS GOOD, i.e. 10 means this rarely bites here. */
  safety: number | null;
  /** What drives it, in a few words. Never a sentence explaining the chart. */
  driver?: string;
}

export function WhatGoesWrong({ rows }: { rows: RiskRow[] | null }) {
  const held = (rows ?? []).filter((r) => r.safety != null);
  if (held.length === 0) return null;
  return (
    <Section kicker="What tends to go wrong" icon="safety">
      <div className="space-y-2">
        {held.map((r) => (
          <div key={r.risk} className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[length:var(--t-body)] text-[var(--c-ink)]">{r.risk}</div>
              {r.driver ? (
                <div className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{r.driver}</div>
              ) : null}
            </div>
            <Dots score={r.safety as number} max={10} />
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ================================================================== */
/* 9. DEALS AND SPECIAL REGIMES                                        */
/* ================================================================== */
/**
 * FORM: CatRows. Key on the left, the detail on the right, hairline between.
 *
 * His words, and the reason this one is worth building: "Government subsidies
 * in social contributions, deals for special sectors, special economic zones or
 * regimes, etc. For example: accounting firms that operate under blah blah
 * blah, get a 10% attribution cost under blah blah blah, tiny details that
 * matter."
 *
 * The value is the TINY DETAIL, so the form has to hold prose-length values
 * without turning into a chart. CatRows is the schematic row list the rulebook
 * already sanctions for exactly this (rule 19: schematic content, no invented
 * prose paragraphs).
 *
 * NOTHING RENDERS WITHOUT A SOURCE. A scheme is a legal fact with a name and a
 * rate; inventing one would be the single most damaging fabrication on the
 * site, because a reader might act on it.
 */
export function DealsAndRegimes({
  rows,
}: {
  rows: Array<[string, React.ReactNode]> | null;
}) {
  if (!rows || rows.length === 0) return null;
  return (
    <Section kicker="Schemes you may qualify for" icon="free-zone">
      <CatRows rows={rows} />
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
  return (
    <Section kicker="Dealing with the council" icon="corruption">
      <Meter value={cleanliness} left="Expect friction" right="Straightforward" />
      {scale ? (
        <div className="mt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">{scale}</div>
      ) : null}
    </Section>
  );
}
