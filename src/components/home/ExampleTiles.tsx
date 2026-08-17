/**
 * ExampleTiles -- the homepage's lead data hook. Six curated business-in-city
 * tiles, each with a real figure, that open the cell directly. Doubles as the
 * "I do not know what to search" helper under the search box. Self-omits below
 * three resolved tiles so the homepage always renders. Server component,
 * tokens only.
 *
 * DENSITY PASS 2026-08-17, and this band was the clearest case left on the page.
 *
 * MEASURED FIRST, off the rendered home page rather than off this source. Each
 * tile was a title line and a SENTENCE: "Owner keeps about $58K a year". Six of
 * those is 36 words, and the band contained no number set as a number. In the
 * one band whose whole job is to show that this atlas answers a question with a
 * figure, the figure was a word in the middle of a line, at 14px, in the same
 * face and the same colour as the words either side of it. The founder's note is
 * "It lacks flavor, it lacks elements. It just has a lot of text, when it should
 * not", and the references he names put the price where the eye lands.
 *
 * So the sentence became a figure with its unit beside it: the money at 24px in
 * the display face and tabular figures, the unit at 12px on the same baseline.
 * 36 words of sentence to 24 of unit, and six figures now read as figures in a
 * band that had none.
 *
 * IT ALSO FIXED A DEFECT THE SENTENCE WAS HIDING. Five tiles read "Owner keeps
 * about X" and the sixth read "About X a year in revenue", because Cancun's
 * hotels fall through the take-home floor to the revenue fallback. Two different
 * quantities in the same visual slot, told apart only by reading to the end of a
 * line. The loader now returns the figure and its KIND as separate fields, so
 * the unit beside each number states which quantity it is and the two can no
 * longer be confused for one another.
 *
 * THE VOCABULARY IS THE SPECIMEN'S, deliberately. The band directly above says
 * "Takes in" and "The owner keeps" over its two figures; these say the same two
 * things in the same words. One page, one name per quantity.
 *
 * THE FLAG, and why a flag rather than the trade pictogram this page's other
 * card band uses. The heading asserts "the same question, asked in 5 countries"
 * and nothing on the band let a reader see it: Bavaria, Cancun and es511's
 * Barcelona do not name their countries, and "the UK" and "California" are the
 * only two that do. The flag turns the heading's claim into something countable.
 * A trade pictogram would have failed the opposite test, the one this pass is
 * applying everywhere: it would be a mark for "Restaurants" sitting beside the
 * word "Restaurants", which is a label for something already visible.
 *
 * CountryFlag is the site's own flag, used on the country, city, cell,
 * /countries and /cities pages already, so this is convergence rather than a new
 * element on the home page.
 */
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { CountryFlag } from "@/components/CountryFlag";
import { fmtMoney } from "@/lib/format/money";
import type { ExampleTile } from "@/lib/home/example_tiles";

/** The unit beside each figure, in the Specimen band's words for the same two
 *  quantities. Four words each: the tile is inventory, not a caption. */
const METRIC_LABEL: Record<ExampleTile["metric"], string> = {
  kept: "owner keeps, a year",
  revenue: "takes in, a year",
};

export function ExampleTiles({ tiles }: { tiles: ExampleTile[] }) {
  if (tiles.length < 3) return null;

  /* Countries represented, counted rather than typed. The first segment of each
     href IS the country, so this cannot drift from the curated list the way a
     written number would. */
  const countries = new Set(
    tiles.map((t) => t.href.split("/").filter(Boolean)[0]).filter(Boolean),
  ).size;

  return (
    <section>
      {/* THE HEADING MOVED OFF THE SPECIMEN'S GROUND.
          This read "Or open a real one" over "See what a business actually
          keeps", which was right when the band sat directly under the search
          form. The specimen now sits between them and does exactly that: it
          shows what one business keeps, in figures. Leaving this would have
          promised a reader something they had just been given, and "or open a
          real one" reads strangely when the thing above it IS a real one.

          So the band says its own job instead. The specimen is one answer in
          depth; these are the same question asked somewhere else, which is the
          only thing a second band of examples can add. */}
      <SectionEyebrow tone="backdrop" size="md" className="mb-2">Six more</SectionEyebrow>
      <h2 className="font-display text-lg md:text-xl font-medium tracking-tight text-ink-900 mb-5">
        The same question, asked in {countries} countries
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tiles.map((t) => (
          <a key={t.href} href={t.href} className="group atlas-card block px-5 py-4">
            {/* items-start, and the title WRAPS rather than truncating. The
                longest of the six, "Software developers in San Francisco",
                fits one line in a three-up card at 1120 and does not at 768,
                and a place name is the tile's information: clipping it to
                "Software developers in San Franc..." would trade the thing the
                card is for against a straight edge. */}
            <div className="flex items-start gap-2">
              {/* aria-hidden. CountryFlag emits an <img alt="Spain flag">, and
                  the link's accessible name already reads "Restaurants in
                  Barcelona $58K owner keeps, a year". A country name spoken
                  ahead of that is a fourth fact in a name that does not need
                  one. The flag is here so the heading's "5 countries" can be
                  SEEN, which is a visual job, not a spoken one. */}
              <span aria-hidden className="shrink-0 translate-y-[3px]">
                <CountryFlag iso2={t.iso2} className="w-[18px]" />
              </span>
              <span className="min-w-0 text-sm font-semibold leading-snug text-ink-900 group-hover:text-atlas-700 transition-colors">
                {t.business} in {t.city}
              </span>
            </div>
            {/* THE FIGURE, set as a figure, with its unit trailing it on the
                same baseline. That is the site's own shape for a quantity plus
                its unit, the one the country scorecard uses for "$25K /yr" and
                "84 /100": the number carries the size and the face, the unit
                stays small and quiet beside it. Stacking the label under the
                number would have cost a third line on a card whose whole point
                is that it is quick to scan.

                Ink rather than terracotta. Six of these would be six accents in
                one grid, and the rulebook's rule for the accent is that it
                marks the answer: on this page that is the Specimen's kept figure
                one band up, which would stop being the accent if six more
                appeared under it. Terracotta stays on the hover. */}
            <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-display text-2xl leading-none tracking-tight tabular-nums text-ink-900">
                {fmtMoney(t.amount)}
              </span>
              <span className="text-xs text-cocoa-700/80">{METRIC_LABEL[t.metric]}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
