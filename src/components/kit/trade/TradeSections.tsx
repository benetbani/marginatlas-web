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
 */
import * as React from "react";
import { Box, Head, KV, Stat, Meter, EaseScale, SpectraTable, CatRows, Dots } from "@/components/spine/kit";

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

/**
 * A section shell. `relative` is inherited from Box, which is a card by rule.
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
 */
function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ComponentProps<typeof Head>["icon"];
  children: React.ReactNode;
}) {
  return (
    <Box>
      <div style={{ padding: "20px" }}>
        <Head icon={icon}>{title}</Head>
        <div style={{ marginTop: "12px" }}>{children}</div>
      </div>
    </Box>
  );
}

const money = (n: number, currency = "$") =>
  `${currency}${n >= 1000 ? n.toLocaleString() : String(n)}`;

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
 */
export interface TypicalSetupProps {
  rows: Array<{ label: string; value: string }> | null;
}

export function TypicalSetup({ rows }: TypicalSetupProps) {
  if (!rows || rows.length === 0) return null;
  return (
    <Section title="What it takes to run one" icon="unit-economics">
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
    <Section title="What people pay here" icon="sale-tag">
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
    <Section title="Tipping" icon="payments">
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
    <Section title="Putting tables on the pavement" icon="high-street">
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
    <Section title="Can you find people" icon="hiring">
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
    <Section title="How skilled they need to be" icon="staffing-rota">
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
    <Section title="Who walks in" icon="who-for">
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
    <Section title="What tends to go wrong" icon="safety">
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
    <Section title="Schemes you may qualify for" icon="free-zone">
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
    <Section title="Dealing with the council" icon="corruption">
      <Meter value={cleanliness} left="Expect friction" right="Straightforward" />
      {scale ? (
        <div className="mt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">{scale}</div>
      ) : null}
    </Section>
  );
}
