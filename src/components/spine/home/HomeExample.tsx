/**
 * THE WORKED EXAMPLE ON THE HOME PAGE (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 7; the home's spec of
 * 2026-10-09, sections 2 and 5, approved as written): the picker's own case answered in four steps, in two open halves of one level
 * (the zone stretches them, `even`). Left, "Restaurants in London": step 1 a row, the register's count, its numeral where a row's glyph
 * stands and its note the card's one small line; then step 2, the typical yearly sales, the card's one 30, drawn on the London page's own
 * strip with the bottom and top tenths, its line at 14 under its head and the strip centred in the height the level lends, the steps
 * ruled apart (RULE); then the door to the London page. Right, "Does it pay?": step 3, break-even, the page's one 40 and its first loud
 * moment (LOUD_SEATS seat 1), its line at 14; the share that takes that much as 100 units in ink2 (one accent a card); step 4 as a row
 * ruled off from the units (RULE); then the door to the picker. Left to right, or down a phone, the steps run in order. Every figure from
 * src/lib/home/worked_example.ts, stamped, the same name and value as the London page prints (tests/home/home_answers.test.ts holds that).
 */
import * as React from "react";
import { Box, Fig, Rail, StepMark, usd } from "@/components/spine/kit";
import { FactRows } from "@/components/spine/archetypes/FactRows";
import { RangeStrip } from "@/components/spine/archetypes/RangeStrip";
import { CountUnits } from "@/components/spine/archetypes/BentoBand";
import { provAttrs } from "@/lib/spine/provenance";
import type { ExampleStep, WorkedExample } from "@/lib/home/worked_example";

/** Of 100: the share's whole. */
const WHOLE = 100;
/** A hundred units twenty to a row: five rows in a half at every width. */
const UNIT_COLUMNS = 20;
const DOOR = "tap-y inline-block text-[length:var(--t-body)] text-[var(--c-ink2)] underline decoration-[var(--c-line-strong)] underline-offset-2 transition-colors hover:text-[var(--c-ink)]";
const LINE = "mt-2 text-[length:var(--t-body)] leading-5 text-[var(--c-ink2)]";
/** A hairline, the interior line FactRows rules its rows with: the left half takes two, under its title and between its two steps, the
 * right half one, above step 4. A step stands in a band of its own, so what a short step leaves to its right reads as the end of a ruled
 * row, as it does wherever a row is drawn. Without them the left half held a blank 200 by 216 at its top right at 1280 (the page
 * filter's WHITE SPACE) and the right a blank 158 by 132 at its foot, beside step 4's figure (the gathered-emptiness gate's E6). */
const RULE = "border-t border-[var(--c-border)]";

/** A step's head where the step is no row: its numeral in the glyph's tile, then its name. */
function StepHead({ step }: { step: ExampleStep }) {
  return (
    <div data-step-head="" className="flex items-center gap-3">
      <StepMark n={step.n} />
      <span className="text-[length:var(--t-body)] leading-5 text-[var(--c-ink2)]">{step.label}</span>
    </div>
  );
}

export function HomePlace({ ex }: { ex: WorkedExample }) {
  const P = ex.place;
  return (
    <Box id="place" className="flex flex-col">
      <Rail icon="trade-restaurant" kicker={P.title} level={2} />
      <FactRows className={RULE} rows={[{ key: "registered", step: P.registered.n, label: P.registered.label, value: P.registered.figure, note: P.registered.line, prov: P.registered.prov }]} />
      {/* STEP 2'S LINE STANDS UNDER ITS HEAD, ABOVE THE STRIP: the strip draws three marks on a long track, so the band over it is
          mostly air, and with the line under the strip the page filter found a blank 252 by 144 in the middle of the card (WHITE SPACE). */}
      <div className={`${RULE} pt-4`}>
        <StepHead step={P.sales} />
        <p data-focal-words="" className={LINE}>{P.sales.line}</p>
      </div>
      {/* THE STRIP CENTRED IN THE HEIGHT ITS LEVEL LENDS (the trade page's `01 spread`, cell-view.tsx): beside the taller "Does it pay?"
          the air stands above and below the strip, never in one block at the card's foot. */}
      <div className="flex flex-1 flex-col justify-center py-2">
        <RangeStrip marks={P.strip} scale="linear" fmt={usd} basis="" />
      </div>
      <div className="mt-3">
        <a href={ex.href} className={DOOR}>{P.door}</a>
      </div>
    </Box>
  );
}

export function HomePays({ ex }: { ex: WorkedExample }) {
  const P = ex.pays;
  return (
    <Box id="pays" className="flex flex-col">
      <Rail icon="break-even" kicker={P.title} level={2} />
      <StepHead step={P.breakEven} />
      <div data-hero-figure className="fig mt-2 text-[length:var(--t-answer)] leading-none text-[var(--terra-text)]" {...provAttrs(P.breakEven.prov)}>
        {P.breakEven.figure}
      </div>
      <p data-focal-words="" className={LINE}>{P.breakEven.line}</p>
      <div data-units-head="" className="mt-4 flex flex-wrap items-baseline gap-x-2">
        <Fig className="text-[length:var(--t-lead)] font-semibold leading-5 text-[var(--c-ink)]" prov={P.above.prov}>{P.above.figure}</Fig>
        <span className="text-[length:var(--t-body)] leading-5 text-[var(--c-ink2)]">{P.above.label}</span>
      </div>
      <CountUnits className="mt-2" whole={WHOLE} filled={P.above.part} accent={false} columns={UNIT_COLUMNS} aria={`${P.above.figure}, ${P.above.label}`} />
      <div className="mt-4">
        <FactRows className={RULE} rows={[{ key: "insolvent", step: P.insolvent.n, label: P.insolvent.label, value: P.insolvent.figure, note: P.insolvent.line, prov: P.insolvent.prov }]} />
      </div>
      <div className="mt-auto pt-3">
        <a href="#search" className={DOOR}>{P.door}</a>
      </div>
    </Box>
  );
}
