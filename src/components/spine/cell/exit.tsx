/**
 * The trade page's exit: the band `13 rivals | 14 worth` and `15 close`
 * (MODEL.md 8.6; plan step 33's sixth and last dispatch, 2026-09-18). Three
 * cards, each drawn ONCE here and mounted by cell-view.tsx on the page and
 * by the archetype stories on the sheet, so the card a story is judged on is
 * the card the page draws (the renderers-agree rule, plan step 25). The
 * band's question from two sides: if not this trade, what else could I open
 * here, and if I ever wanted out, what is this one worth; then where do I go
 * from here.
 *
 * `13 rivals`, OTHER TRADES TO OPEN: the universal list card (MarkList, his
 * B3) with no marks, a sibling trade and its typical cost to open per row,
 * every row a door to that trade's page in this city (the archetype's
 * navigating row, built for this card), the headline the set's middle at 30
 * in ink, quiet by the form's own law (rivals_rows.ts: the siblings the
 * adapter resolved through related_links.ts, the figure the archetype's by
 * key, a sibling on the default withheld with the count, R3 and R11). Under
 * four siblings with a figure the card ships at FULL FORM WITH THE STATED
 * LINE where the list would stand, never a short list (8.6; PART 9 clause
 * 22), on BentoMetric's withheld cell, the same silhouette `04 open` takes in
 * its withheld state on this page (opener, the line at the lead rung, the
 * basis), so the band never holds a lone `14`. The old `#related` card (the
 * Related links, `d.related`, which no live route ever fed because a
 * keep-percent column has no honest per-sibling source) retired into this
 * card. Both forms draw their own Box, and the census reads the card by its
 * id since 2026-09-24 (it read `<Box` alone before).
 *
 * `14 worth`, WHAT ONE SELLS FOR: the range strip with two marks, linear, the
 * low and the high of what a business like this sells for, in currency and
 * never as a multiple (clause 15), no accent, no lead and so no 30 (a low and
 * a high are siblings), the page's second strip and the bookend to `01`
 * (worth_rows.ts: the shard's two sale figures times the take-home `00`
 * prints). Off `moneyShown` the card stands with its opener and the withheld
 * line at the lead rung where the strip would (`01 spread`'s own idiom); on
 * the 38 shards whose sale figures rest on operating earnings the line says
 * so and no figure prints (item 52). FOCAL names this card in every state
 * (RangeStrip is not in EVEN_BY_RULING); the row is reported to the
 * controller, not exempted. The census reads this Box as RangeStrip.
 *
 * `15 close`, WHERE TO NEXT: the terminus, three doors and the pill last
 * (close_rows.ts buildTradeCloseDoors: the industry page, the place's own
 * page, the compare pill), full width, the page's third of three (R1), on
 * the hero band the old close stood on, which the full-width gate, the
 * lone-card rule and the section-bands baseline all read as the exit's
 * sanction on this page (the section-bands count for the trade page was
 * measured with the exit there; the city's and the country's exits stand
 * under `data-terminus` and count, and moving this one is the controller's
 * to rule with a re-seed, never a baseline raised in a dispatch). No
 * pricing door, no sibling door, no last-checked line and no report-an-error
 * link (the builder says why). The old `#close` (the recap, the sibling
 * door and the pricing pill) retired into this card.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { MarkList } from "@/components/spine/archetypes/MarkList";
import { BentoMetric } from "@/components/spine/archetypes/BentoBand";
import { RangeStrip } from "@/components/spine/archetypes/RangeStrip";
import { Terminus, type Door } from "@/components/spine/archetypes/Terminus";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { RivalsData } from "@/lib/spine/rivals_rows";
import type { WorthData } from "@/lib/spine/worth_rows";
import type { TradeCustomersData } from "@/lib/spine/trade_customers_rows";
import { WorkedFigure } from "@/components/spine/archetypes/WorkedFigure";

export function RivalsCard({ id = "rivals", rivals, oneColumn = false }: { id?: string; rivals: RivalsData | null; /** The list stays one column on its wide seat (MarkList's word): beside the donut, whose card is taller than the one-column list. */ oneColumn?: boolean }) {
  if (!rivals) return null;
  if (rivals.state === "list" && rivals.middle != null) {
    return (
      <MarkList
        oneColumn={oneColumn}
        id={id}
        icon="subtype"
        kicker={rivals.kicker}
        tagged={rivals.sample}
        headline={{ label: rivals.middleLabel, value: rivals.middle }}
        basis={rivals.basis}
        head={rivals.head}
        rows={rivals.rows.map((r) => ({ key: r.key, name: r.name, value: r.value, href: r.href, lands: r.lands }))}
        fmt={rivals.fmt}
        withheld={rivals.withheld}
        withheldLine={rivals.withheldLine}
      />
    );
  }
  return (
    <BentoMetric
      id={id}
      icon="subtype"
      kicker={rivals.kicker}
      sample={rivals.sample}
      withheld={rivals.stateLine ?? COPY.tradeRivals.stateNone}
      basis={rivals.basis}
    />
  );
}

/**
 * THE BAND'S COMPOSITION, MEASURED 2026-09-18 (8.4 rule 1), and it took four
 * readings to seat. At 8.6's expected 1-1 the strip's card stood 520 by 397
 * on London beside the four-row list, 108 of content under its opener and a
 * 480 by 228 blank under that (the page filter's WHITE SPACE at 1280, 304 by
 * 228 at 768). At the composition's own fallback, `13` wide at 2-1 with the
 * list still one column, the blank was 307 by 210 in a 307 by 357 card:
 * still a hole, because a seat cannot be narrower than a third and the strip
 * is 72 tall whatever its width (the `10 | 11` band's finding again). Two
 * marks and a basis are all the data holds for a sale (the shard's
 * `sale_exit` is three fields), so the card cannot be given more of its own
 * content, and 8.6's row forbids a foot ("two marks is a track, not a figure
 * with a foot"). Centring the strip under the opener with the basis and
 * note at the foot (the composition the city's `08 demand | 07 earnings`
 * band ruled for a short card beside a taller one, BentoMetric's own shape)
 * passed the page filter at 1-1 (the largest blank 450 by 115, under the
 * floor) and FAILED the chain's E6, which takes every blank over the floor
 * and not only the largest: a 280 by 138 blank right of the kicker, above
 * the strip. The arithmetic closes that door at any split: 205 of air in a
 * 357 box, and the blank above the strip counts from the card's top (the
 * kicker inks only its left 200), so both blanks under 120 needs a five-pixel
 * window that font metrics would cross. THE SEAT IS THE MODEL'S OTHER
 * ANSWER: `13` takes the wide side at 2-1 (the row's own fallback) and puts
 * its four rows in TWO COLUMNS of rows there (PART 5: "on a card wide enough
 * to open a hole, rows go into two columns of rows"; MarkList's under-six
 * form), so the list stands 693 by 308 and the strip's card 347 by 308 with
 * the strip centred and the two lines at the foot: 0 holes by the page
 * filter at three widths and 0 by E6 at 1280 and 1440, on London and
 * California alike (Mumbai cafes, both cards withheld, 693 and 347 by 131).
 * `stack="lg"` because at a tablet's equal halves the list stood 344 by 414
 * in one column and the strip's card 414 with air above and below (the
 * `03 | 04` precedent); stacked, the list takes 720 in two columns at 308
 * and the strip 720 by 206, each at its own height. THE RESIDUAL, stated
 * and not padded: a six-row list stays one column by clause 20 (Berlin
 * restaurants, every sibling keyed) and stands 693 by 456, and the strip's
 * card beside it holes 307 by 120 at 1280 by the page filter, exactly at the
 * floor; no split in the closed set and no composition of two marks mends
 * a 456 partner. That case is not on the harness list and waits on the
 * controller (re-pair, or a form for `14` that the data can fill).
 */
export function WorthCard({ id = "worth", worth }: { id?: string; worth: WorthData | null }) {
  if (!worth) return null;
  return (
    <Box id={id} className="flex h-full flex-col">
      <Rail icon="sale-tag" kicker={COPY.tradeWorth.kicker} sample={worth.sample} />
      <div className="flex flex-1 flex-col justify-center">
        {worth.state === "strip" ? (
          <RangeStrip marks={worth.marks} scale="linear" fmt={usd} basis="" />
        ) : (
          <p data-withheld-line="worth" className="text-[length:var(--t-lead)] leading-snug text-[var(--c-ink2)]">{worth.withheld}</p>
        )}
      </div>
      {/* THE BASIS AND THE NOTE AT THE FOOT (the precedent's words: "the basis
          at the foot"), the strip's own two lines in the strip's own register,
          drawn here because the strip is centred above them; in the other two
          states the line above says everything and the foot is empty. */}
      {worth.state === "strip" && worth.basis ? (
        <div className="mt-3">
          {worth.basis ? <p className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{worth.basis}</p> : null}
          {worth.note ? <p className="mt-0.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{worth.note}</p> : null}
        </div>
      ) : null}
    </Box>
  );
}

/**
 * WHAT A CUSTOMER SPENDS, `16 customers` (2026-09-20 night; the builder's
 * header says which fields these are and how the year is computed): what one
 * regular customer is worth in a year, on WorkedFigure, the archetype this
 * section brought into the kit. The year is the card's one focal at 30 and
 * the two figures it is made of stand under it at 16, the visit and how many
 * of them, in the order they multiply: the answer first, the arithmetic
 * second, and no sentence explaining either (his words of 2026-09-20 night:
 * place things where the reader expects them, do not say the obvious twice).
 * Never one number (clause 65): three, with the basis naming the computation
 * and the foot saying what the year is worth before the costs. Quiet, the
 * page's three accents being spent; the level's drawing is the strip beside
 * it (`14 worth`), the exit's pair, one customer's year beside what the whole
 * business sells for.
 */
export function CustomersCard({ id = "customers", customers }: { id?: string; customers: TradeCustomersData | null }) {
  if (!customers) return null;
  const C = COPY.tradeCustomers;
  return (
    <Box id={id} className="flex h-full flex-col">
      {/* Every shard figure is modelled (R12), so the opener's mark is on, behind his switch. */}
      <Rail icon="spending-power" kicker={C.kicker} sample />
      <div className="flex flex-1 flex-col justify-center">
        <WorkedFigure label={C.yearLabel} figure={customers.year.figure} working={customers.cells.map((c) => ({ figure: String(c.value), words: c.label }))} />
      </div>
      {customers.basis ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{customers.basis}</p> : null}
      {customers.foot ? <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{customers.foot}</p> : null}
    </Box>
  );
}

export function CloseCard({ id = "close", doors }: { id?: string; doors: Door[] }) {
  if (doors.length === 0) return null;
  return (
    <Box id={id}>
      <Terminus kicker={COPY.close.kicker} doors={doors} />
    </Box>
  );
}
