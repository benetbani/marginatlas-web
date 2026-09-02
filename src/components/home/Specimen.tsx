/**
 * Specimen , one real answer, shown rather than described.
 *
 * THE CONCEPTUAL GAP IT CLOSES. The founder, on the live page: "conceptually it
 * is still a disaster." The page had five ways of talking about the product,
 * what the atlas holds, what it can see, where it reaches, who it is for, what
 * it costs, and no way of showing one. Every reference it is measured against
 * does the opposite. A rental marketplace opens with real homes at real prices;
 * an airline opens with real routes at real fares. They put the goods in the
 * window. This page put up signage about the goods.
 *
 * So this is the goods. The h1 one band above makes a specific claim, "what a
 * small business earns, and what its owner actually keeps", and this answers it
 * once, in two real numbers, before a reader has typed anything.
 *
 * THE BAR IS THE ARGUMENT. Revenue is the whole. What the owner keeps is the
 * terracotta end of it. Half a million dollars through the door and about a
 * ninth of it reaching the person who owns the place is the entire reason this
 * site exists, and it is more persuasive as one true pair of figures than as
 * any amount of copy about method.
 *
 * IT IS A STACKED WHOLE NOW, NOT A PROGRESS RAIL, and that is the 2026-09-02
 * change (subsection loop, C5). What was here was a 12px track with an 11% fill
 * at its left end, hand-rolled inline, carrying no declared idea. Two faults,
 * and the second is the one a reader feels. It is the silhouette the whole form
 * catalogue exists to stop the pages repeating: a line with a fill positioned
 * along it, which the budget calls I1 and reserves for a position between two
 * named poles. And a track's unfilled remainder reads as EMPTY, so the drawing
 * said "11% done" where the card means "89% spent and 11% kept". Both halves of
 * this bar are now named parts of one hundred dollars, which is what the
 * sentence underneath has always claimed, and it is the same shape the cell
 * page draws for "Where each $100 of sales goes".
 *
 * WHY IT USES THE SPINE KIT'S OWN StackBar AND NOT A COPY. The kit is where the
 * catalogue can see a form; a second stacked bar written into this file is how
 * this project got the sprawl it is still paying for. What it took to make that
 * possible is recorded in globals.css: the twelve colour tokens every kit form
 * reads were declared inside SpineShell and existed on a spine page and nowhere
 * else, so a kit form rendered here drew its hairline in near-black. They are
 * declared once, globally, now. The COLOURS below are still this page's own,
 * because the accent that marks the answer must be the same red as the figure
 * beside it.
 *
 * Deliberately ONE. Six tiles follow it, and they are a different job: pick
 * another. This one is "here is what an answer is", which a reader can only be
 * shown once before it becomes a list.
 *
 * Self-omits when the specimen does not resolve, because a hedged specimen is
 * worse than none: it is the first number on the page a reader will check.
 */
import { fmtMoney } from "@/lib/format/money";
import type { Specimen as SpecimenData } from "@/lib/home/specimen";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { StackBar } from "@/components/spine/kit";
import { tailwindColors } from "@/lib/design-tokens";

/* THE TWO FILLS, FROM THIS PAGE'S OWN TOKENS RATHER THAN THE KIT'S.
   The kept segment is atlas-700, which is the exact red the kept FIGURE beside
   it is set in, so the mark and the number read as one object rather than as
   two things that happen to be warm. The kit's own TERRA is atlas-300, a softer
   step, and using it would have put two different reds for one idea on one card,
   which is the fault globals.css records against --chart-1.
   The mass is paper-400, whose token comment in design-tokens.ts names this
   exact job: "chart bar mass, dashed rules, underlines". It is deliberately
   heavier than the paper-200 the old track used, because a part of a whole has
   to read as filled and an unfilled track reads as empty. */
const KEPT_FILL = tailwindColors.atlas[700];
const COST_FILL = tailwindColors.paper[400];

export function Specimen({ specimen }: { specimen: SpecimenData | null }) {
  if (!specimen) return null;
  const { trade, place, href, revenue, takeHome, keptPct } = specimen;

  /* The costs share is the remainder, computed from the two published figures
     rather than from the rounded percentage, so the two segments always sum to
     the whole bar even when keptPct has been rounded for display. */
  const costPct = Math.max(0, 100 - keptPct);

  return (
    <section>
      <SectionEyebrow tone="backdrop" size="md" className="mb-2">
        What an answer looks like
      </SectionEyebrow>

      {/* .atlas-card, which this card was already imitating: it read
          `rounded-xl border border-parchment bg-white ...
          hover:border-atlas-300`. Three of the home page's link cards
          (ExampleTiles, NeighborhoodCards, the audience tiles) use the class;
          this one hand-rolled a flatter, opaque, differently-rounded near-copy
          with a hover of its own.

          The hover goes with it, deliberately. a.atlas-card:hover is the site's
          card gesture, a vermillion top edge with a 1px lift, and this is an
          anchor so it applies. `transition-colors` also had to go: it sets
          transition-property itself and would have replaced the class's own
          transition of box-shadow, border-color and transform, leaving the lift
          to snap. The focus ring is untouched. */}
      <a
        href={href}
        className="group atlas-card block px-5 py-6 md:px-8 md:py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          {/* Canonical section size, stepped down from text-2xl/3xl 2026-08-17.
              The figure below is the argument; a heading competing with it is
              the label shouting over the answer. Content carries the weight,
              which is the structure every reference page on this brief uses. */}
          <h2 className="font-display text-lg md:text-xl font-medium tracking-tight text-ink-900 group-hover:text-atlas-700 transition-colors">
            {trade} in {place}
          </h2>
          <span className="text-sm font-medium text-atlas-700">
            See the whole page <span aria-hidden>&rarr;</span>
          </span>
        </div>

        {/* TWO BLOCKS, NOT TWO COLUMNS OF FIGURES, and the difference is the
            whole layout. This row used to be an equal two-column grid holding
            $503K on the left and $57K on the right, both at the answer rung.
            Measured at 1280 the two figures started 499px apart in a 1024px
            card, with about 340px of nothing between the left column's content
            and the right column's label: an empty rectangle a third of the card
            wide and three lines tall, which is the founder's first named fault
            class. And two figures at 40px is two things competing to be read
            first, so the card had no answer at all.
            The answer is now ONE figure with the whole it came out of stated
            beside it in prose, and the drawing takes the width the second
            figure used to strand. */}
        {/* EVERY GAP IN THIS CARD IS ON THE SPACING LADDER, 48 / 32 / 28-20-16 / 8,
            which the rest of the home page is not: this row arrived carrying
            mt-6, mt-7, mt-1.5 and mt-4, four values that sit between rungs, and
            nearly-equal gaps read as a mistake rather than as a decision. The
            label sits on its figure with no margin at all, which is the kit's
            own Stat grammar: a label over a number is one object and the line
            box is the kerning. */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-7">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cocoa-700/70">
              The owner keeps
            </div>
            {/* THE ANSWER RUNG, AT EVERY WIDTH, 2026-09-02 (C17). C5 landed both
                ends of this on rungs, 30 and 40, in place of a phone that
                rendered 32. It is one number now, and the reason is the ledger
                band four screens down: its counts were 44 over this figure's 40
                at 1280 and 32 over 30 at 375, so home's largest figure was a
                count of what the atlas holds and its answer was smaller, at
                both widths. Those counts are at `--t-focal` 30 now. A responsive
                pair here would have re-opened the same gap at 375, where 30
                against 30 is a tie and the six-digit count is three times as
                wide as "$57K"; flat 40 makes this the ONE figure on the page at
                the answer rung, at 1.33x the next largest, at every width. */}
            <div className="font-display text-[40px] leading-none tracking-tight tabular-nums text-atlas-700">
              {fmtMoney(takeHome)}
            </div>
            {/* text-balance, because at 375 this ran to two lines with "year"
                alone on the second, which is the orphan A3 had to shorten two
                rung meanings for. Balancing splits it evenly instead of cutting
                a word, and it survives a longer money figure, which trimming
                the sentence to fit 237px would not: the shortest wording that
                keeps the typicality measures 234px against a 237px column, so
                any specimen whose revenue prints wider than $503K would orphan
                again. */}
            <div className="mt-2 text-balance text-base leading-snug text-graphite">
              of {fmtMoney(revenue)} taken in, in a typical year
            </div>
          </div>

          {/* THE DRAWING, AND WHAT IT MEANS, AS ONE BLOCK BESIDE THE ANSWER.
              A bar this long needs width and a figure does not, so pairing them
              across the row lets each have the axis it needs. The closing
              sentence rides HERE rather than under the whole card, and that is
              a composition rather than a tidy-up: it is the grey segment's own
              gloss, the only thing in the card that says what the 89% contains,
              and left at the card's foot it sat one line high with three
              quarters of the row empty beside it. Under its own segment the two
              blocks come out within a line of each other and neither strands.
              Below sm they stack, which is what a 237px card can hold. */}
          <div className="sm:col-span-2">
            <StackBar
              segments={[
                { label: "Costs to run", pct: costPct, color: COST_FILL },
                { label: "Kept", pct: keptPct, color: KEPT_FILL, kept: true },
              ]}
              sort={false}
              h="h-10"
              rounded="rounded"
              ariaLabel={`Of ${fmtMoney(revenue)} taken in, ${costPct} percent goes on running the place and ${keptPct} percent, ${fmtMoney(takeHome)}, reaches the owner`}
            />
            {/* Each name under its own end of the bar, which is the one
                alignment this drawing has and the reason the row fills its
                width at every size. "Kept" rather than "The owner keeps",
                because the block to the left already carries those words over
                the figure and a legend restating them would be the card
                labelling one thing twice. */}
            <div className="mt-2 flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-cocoa-700/70">
              <span>Costs to run</span>
              <span>Kept</span>
            </div>
            {/* THE ONE THING NOTHING ELSE IN THE CARD SAYS. This line used to
                open "11% of what comes through the door reaches the person who
                owns the place", which the figure, the prose beside it and the
                bar's own terracotta segment now each state; three statements of
                one fact in a card 300px tall. What survives is the sentence
                that says what the grey 89% actually contains, which no figure
                and no mark can. */}
            <p className="mt-4 text-sm leading-relaxed text-graphite">
              The rest is staff, rent, stock and tax.
            </p>
          </div>
        </div>
      </a>
    </section>
  );
}
