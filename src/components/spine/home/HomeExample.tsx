/**
 * THE WORKED EXAMPLE ON THE HOME PAGE (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 7; reformed by plan
 * docs/superpowers/plans/2026-10-10-home-reform, Task 3: the critique's P0.5, P1.4, P1.5, P1.7, P2.1, P2.2 and P2.5): the picker's own
 * case answered in four steps, in two open halves of one level (the zone stretches them, `even`).
 *
 * ONE ANATOMY FOR EVERY STEP (P1.4): its numeral and its name on one line, then its figure flush left, then its line, then its
 * drawing; one left edge for each half at every width. The figure stands at 16 for steps 1 and 4, at 30 for step 2 (the card's one 30)
 * and at 40 for step 3 (the page's one 40 and its first loud moment, LOUD_SEATS seat 1); beside a 16 the line is the third rung (12,
 * muted, and no focal words, so the zone's rule leaves it small), beside a 30 or a 40 it is 14 in ink2. Nothing stands between 16 and 30
 * in a half that holds a 30 or a 40 (clause 28). A hairline between steps 1 and 2 and between steps 3 and 4, none under the titles.
 *
 * Left, "Restaurants in London": step 1, the register's count; step 2, the typical yearly sales on a line of their own and the London
 * page's three marks drawn on a LOG strip (P0.5, MODEL 10.8: $76K to $2.5M is 33 times, and on a linear track the typical stood in the
 * left fifth with the names stepping), its names on one row, its round values $100K and $1.0M as small ticks, the typical's figure
 * not printed twice; the strip centred in the height the level lends; then the door to the London page. Right, "Does it pay?" (the
 * wallet glyph, money in and out, P2.1): step 3, break-even at 40 in the accent, then the share that already takes that much as 100
 * units in 25 columns, the 32 in the accent (fills follow their figure, PART 6) and the rest in the soft grey (P1.5); step 4, the UK's
 * insolvencies; then the door to the picker. The doors are ink at 14, weight 500, an arrow after, underlined on hover (P1.7).
 *
 * Every figure from src/lib/home/worked_example.ts, stamped, the same name and value as the London page prints
 * (tests/home/home_answers.test.ts holds that).
 */
import * as React from "react";
import { Box, Fig, Rail, StepMark, usd } from "@/components/spine/kit";
import { RangeStrip } from "@/components/spine/archetypes/RangeStrip";
import { CountUnits } from "@/components/spine/archetypes/BentoBand";
import { provAttrs } from "@/lib/spine/provenance";
import type { ExampleStep, WorkedExample } from "@/lib/home/worked_example";

/** Of 100: the share's whole. */
const WHOLE = 100;
/** A hundred units twenty-five to a row: four rows, about 16px a unit at 1280 and 12 on a phone (P1.5). */
const UNIT_COLUMNS = 25;
/** A door (P1.7): ink, 14 at weight 500, its arrow after it, underlined on hover only; the words stand in a span of their own. */
const DOOR = "tap-y inline-flex items-baseline gap-1 text-[length:var(--t-body)] font-medium leading-5 text-[var(--c-ink)] no-underline decoration-[var(--c-line-strong)] underline-offset-2 hover:underline";
/** The hairline between two steps, the interior line FactRows rules its rows with. */
const RULE = "border-t border-[var(--c-border)]";

/** The rung a step's figure stands at: 16 (steps 1 and 4), 30 (step 2), 40 (step 3). */
type Rung = "lead" | "focal" | "answer";

/** ONE STEP ON ONE ANATOMY (P1.4): its numeral and its name, its figure flush left, its line, then whatever it draws. */
function Step({ step, rung, className = "", children }: { step: ExampleStep; rung: Rung; className?: string; children?: React.ReactNode }) {
  return (
    <div data-step-block={step.n} className={`flex flex-col ${className}`}>
      <div data-step-head="" className="flex items-center gap-2">
        <StepMark n={step.n} />
        <span className="text-[length:var(--t-body)] leading-5 text-[var(--c-ink2)]">{step.label}</span>
      </div>
      {rung === "answer" ? (
        <div data-hero-figure className="fig mt-2 text-[length:var(--t-answer)] leading-none text-[var(--terra-text)]" {...provAttrs(step.prov)}>
          {step.figure}
        </div>
      ) : rung === "focal" ? (
        <Fig className="mt-2 block text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]" prov={step.prov}>{step.figure}</Fig>
      ) : (
        <Fig className="mt-2 block text-[length:var(--t-lead)] font-semibold leading-5 text-[var(--c-ink)]" prov={step.prov}>{step.figure}</Fig>
      )}
      {rung === "lead" ? (
        <p className="mt-1 text-pretty text-[length:var(--t-micro)] leading-4 text-[var(--c-muted)]">{step.line}</p>
      ) : (
        <p data-focal-words="" className="mt-2 text-pretty text-[length:var(--t-body)] leading-5 text-[var(--c-ink2)]">{step.line}</p>
      )}
      {children}
    </div>
  );
}

function Door({ href, words }: { href: string; words: string }) {
  return (
    <a href={href} className={DOOR}>
      <span>{words}</span>
      <span aria-hidden>&#8594;</span>
    </a>
  );
}

export function HomePlace({ ex }: { ex: WorkedExample }) {
  const P = ex.place;
  /* THE TYPICAL PRINTS ITS VALUE ON THE STRIP AT 14, AS ITS TWO NEIGHBOURS DO (critique pass 2, P0.2 and its Q2, ruled yes: a label on
     a drawing is its key, not a second statement; the London trade page prints its typical on its strip too): step 2's line above holds
     the section's figure at 30, so the strip's mark is no lead here. */
  const marks = P.strip.map((m) => (m.key === "typical" ? { ...m, lead: false } : m));
  return (
    <Box id="place" className="flex flex-col">
      <Rail icon="trade-restaurant" kicker={P.title} level={2} />
      <Step step={P.registered} rung="lead" />
      <Step step={P.sales} rung="focal" className={`mt-4 flex-1 ${RULE} pt-4`}>
        {/* THE STRIP CENTRED IN THE HEIGHT THE LEVEL LENDS (the trade page's `01 spread`): beside the taller "Does it pay?" the air stands
            above and below the strip, never in one block at the card's foot. */}
        <div className="flex flex-1 flex-col justify-center pt-4">
          <RangeStrip marks={marks} scale="log" fmt={usd} basis="" oneRow decades namesAbove />
        </div>
      </Step>
      <div className="pt-4">
        <Door href={ex.href} words={P.door} />
      </div>
    </Box>
  );
}

export function HomePays({ ex }: { ex: WorkedExample }) {
  const P = ex.pays;
  return (
    <Box id="pays" className="flex flex-col">
      <Rail icon="owner-keeps" kicker={P.title} level={2} />
      <Step step={P.breakEven} rung="answer">
        <div data-units-head="" className="mt-4 flex flex-wrap items-baseline gap-x-2">
          <Fig className="text-[length:var(--t-lead)] font-semibold leading-5 text-[var(--c-ink)]" prov={P.above.prov}>{P.above.figure}</Fig>
          <span className="text-[length:var(--t-body)] leading-5 text-[var(--c-ink2)]">{P.above.label}</span>
        </div>
        <CountUnits className="mt-2" whole={WHOLE} filled={P.above.part} columns={UNIT_COLUMNS} fine aria={`${P.above.figure}, ${P.above.label}`} />
      </Step>
      <Step step={P.insolvent} rung="lead" className={`mt-4 ${RULE} pt-4`} />
      <div className="mt-auto pt-4">
        <Door href="#search" words={P.door} />
      </div>
    </Box>
  );
}
