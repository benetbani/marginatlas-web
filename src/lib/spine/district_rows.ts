/**
 * src/lib/spine/district_rows.ts
 *
 * THE CITY'S DISTRICT RANKING (city:districts, the build loop's run 25,
 * 2026-09-07, rebased task 13, unfeatured and reworded task 14, 2026-09-10),
 * for the RankedBars archetype with the burden direction: every ranked
 * district as a row, its shop rent as the value; the set's dearest as the top
 * rule, since a world's best for a burden would be a rule at the floor. The
 * founder's D1 (2026-07-11): rank by rent, cheapest first.
 *
 * NO DISTRICT IS FEATURED, AND THE CARD SAYS SO BY MARKING NONE (his ruling,
 * 2026-09-10: "there is the featuring aspect of one neighborhood compared to
 * the other neighborhoods with no reason at all, just for the fact that it's
 * cheaper. It is not justifiable, so please rethink it"). Marking one member
 * of a set is an editorial claim, and the claim this card could make , "this
 * one is the cheapest" , is not an answer to the question the reader arrived
 * with, which is where to open. The cheapest district is still the REFERENCE
 * every figure is measured against, because the arithmetic needs a base and
 * an honest one has to be drawn on the card; being the base is not being
 * recommended, and it buys no pill, no colour and no rung of its own. The day
 * the engine can name a district as genuinely the best place to trade in
 * (DATA-REQUIREMENTS.md 15, and the revenue side of the model), the card gets
 * a leader again and it will be that district, not this one. `cheapestKey`
 * left with the pill it fed.
 *
 * THE REVENUE SIDE RUNS SINCE 2026-09-17 (it returned exactly 1.000 per
 * district before that: a hyphenated slug against underscore-keyed tables,
 * bug:district-revenue-dead), and this card STILL reads rent_mult only, on
 * purpose. The seed now carries rev_vs_city_pct and rev_clipped per row, and
 * the honest answer on whether they can print is written at
 * getNeighborhoodMultiplier in neighborhood_multipliers.ts: for the winner
 * trade two of seven rows sit on the same 0.4 floor and print the same
 * figure, so a figure-in-every-row card cannot carry them yet.
 *
 * THE REFERENCE POINT IS A DISTRICT ON THE CARD, NOT AN INVISIBLE AVERAGE,
 * and this is the whole of the change. His words on the old card: "then you
 * say the city average times one which is the baseline. You don't seem to
 * have an idea on how the information should be actually given." He is right
 * about the mechanism, not just the wording. Every figure was a multiple of
 * the city average, and the city average was drawn NOWHERE: a reader met
 * x1.20 and x3.00 with no way to turn either into anything, because the one
 * quantity they were both measured against never appeared on the page. The
 * rows are now measured against the CHEAPEST DISTRICT, which is drawn, named
 * and ranked two inches away, so "West End, two and a half times South
 * London" is a claim the eye can check against the card it is printed on.
 *
 * EVERY ROW PRINTS ITS OWN FIGURE, THE REFERENCE INCLUDED (task 14,
 * 2026-09-10, his "furthermore, the label replaces the number, which is
 * totally an idiotic thing out there"). For one day this file answered the
 * reference district with the word "cheapest", and for one day after that the
 * card printed nothing at all in that cell and moved a black pill onto its
 * name. Both were the same mistake in two costumes: a reader scanning a
 * column of seven figures met one row with no figure, which reads as data
 * this page does not hold rather than as the one district the others are
 * measured against. It reads 1.00x now, against itself, which is self-evident
 * rather than misleading precisely because the district is named on the row
 * and named again in the basis line. What is NOT back is the old "x1.00" of
 * the city average: that figure was a multiple of something invisible, and no
 * amount of notation makes an invisible base checkable.
 *
 * WHY REBASING IS HONEST HERE, stated plainly because dividing one modelled
 * number by another usually is not. The multiples are composed from a per-tag
 * constant table with square-root damping
 * (src/lib/economics/neighborhood_multipliers.ts), so both figures in the
 * ratio come off the SAME basis for the SAME city; the basis cancels, and
 * what survives is the ratio between two districts, which is the only thing
 * the model actually claims. What is NOT done, deliberately: these are never
 * multiplied by the premises rent to make money. That figure is a rent by
 * city SIZE, not London's own average, so the product would compound two
 * different modelled quantities into one absolute that would read as measured
 * and would not be. A measured district rent is DATA-REQUIREMENTS.md 15, and
 * until it lands the card stays tagged.
 *
 * Draws only for a city with two or more ranked districts, and the MIDDLE of
 * the ranking needs three (MIDDLE_MIN_DISTRICTS): with two, every member is an
 * end and a "middle" would be one of the ends printed a second time.
 * Synchronous over a seed, so the stories, the verdict card and the view all
 * share one set of numbers and one basis line and cannot drift apart. The
 * multiple prints with two decimals always, the page's one notation for it.
 */
import type { BarRow } from "@/components/spine/archetypes/RankedBars";
import { COPY } from "@/lib/spine/copy";
import { districtPageTarget } from "@/lib/geo/page_targets";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export type CityDistrictBars = {
  rows: BarRow[];
  worldMax: number;
  tagged: boolean;
  districts: number;
  /** The reference district: cheapest of the set, and what every row is measured
   *  against. NOT a recommendation and NOT a marked row: see the header. */
  cheapest: string;
  /** The far end, and the card's own ceiling. */
  dearest: { name: string; value: number };
  /** The middle of the ranking, the thing the two ends cannot say. Null below
   *  MIDDLE_MIN_DISTRICTS, where there is no member that is not an end. */
  middle: { name: string; value: number } | null;
  /** The composed basis line, naming the reference so it is said as well as drawn. */
  basis: string;
  /** The card's two column heads, composed here so the head that names the
   *  reference district is filled from the data and never typed into COPY. */
  phoneHead: { name: string; value: string };
  /** The districts whose rent sits on the engine's clip, by name, and the one
   *  line that says so under the basis; null where no row is clipped. */
  clipped: string[];
  clipLine: string | null;
};

/** The count of districts, in words, for a basis line a person reads rather
 *  than parses ("the seven districts we cover"). Digits are what a figure cell
 *  is for; a sentence takes the word. Falls back to the digits above twelve,
 *  where the word is longer than the number it saves.
 *
 *  EXPORTED for mark_list_rows.ts (2026-09-10): that card's basis line counts
 *  its rows in the same sentence grammar ("the ten highest-paying of the 252
 *  cities we cover"), and a second copy of this table in a second file is how
 *  two cards start spelling the same number two different ways. */
const COUNT_WORDS = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
export const countWord = (n: number) => COUNT_WORDS[n] ?? String(n);

/** The rent figure's one notation, shared by every card that prints it, and
 *  NOTHING ELSE: two decimals, always, for whatever it is handed. No branch,
 *  no word, no special case for the reference district , a formatter cannot
 *  tell 1.00-because-it-is-the-reference from 1.00-because-a-second district
 *  ties it, and both of those are a figure.
 *
 *  THE MULTIPLIER TRAILS THE NUMBER (task 14, 2026-09-10): "2.50x", not
 *  "x2.50". It is the order the words come in when the row is read out , "two
 *  and a half times South London" , and the head above the column now says
 *  "Rent, against South London", so the figure is the number and the unit,
 *  in that order, like every other figure on the site.
 *
 *  TWO DECIMALS, NOT ONE, and the reason is data rather than taste: London's
 *  City of London and West End sit at 2.47 and 2.50 of South London. At one
 *  decimal they print the same figure beside two visibly different bars,
 *  which is the card contradicting itself in the width of one row. */
export const rentMult = (v: number) => `${v.toFixed(2)}x`;

/** THE MIDDLE OF A RANKING NEEDS THREE MEMBERS. With two, every member is an
 *  end: the "middle" would be one of the two districts the basis line already
 *  names, printed a second time. Below this the middle is null and the card
 *  that shows it drops the cell rather than repeating an end. */
export const MIDDLE_MIN_DISTRICTS = 3;

export function buildCityDistrictBars(seed: any): CityDistrictBars | null {
  const list: any[] = Array.isArray(seed?.where_to_trade?.list)
    ? seed.where_to_trade.list.filter((r: any) => r && typeof r.name === "string" && r.name && isNum(r.rent_mult) && r.rent_mult > 0)
    : [];
  if (list.length < 2) return null;
  const ascending = list.slice().sort((a, b) => a.rent_mult - b.rent_mult);
  const base = ascending[0].rent_mult;
  const at = (r: any) => +(r.rent_mult / base).toFixed(2);
  /* ONE KEY FUNCTION, so every row is keyed the same way wherever it is read. */
  const keyOf = (r: any) => String(r.slug ?? r.name).toLowerCase();
  /* THE NAMES NAVIGATE (his word after the push of 2026-09-20, "it doesn't even
     have the neighbourhoods being clickable, which is wrong"; MODEL PART 9
     clause 61): each district's name is a link to the district's own page
     where one exists, through the one resolver that says which place pages
     exist (page_targets.ts `districtPageTarget`: London's seven today, and
     only while the neighbourhood spine is on); where none exists the row
     stays a row, never an assembled URL. The link carries what its page
     answers (`lands`) for the chain's doors gate. This is a name that is a
     link, not a featured district: the 2026-09-10 ruling struck a
     cheapest-district door and one-word summaries, and both stay struck. */
  const citySlug = typeof seed?.meta?.slug === "string" ? seed.meta.slug : "";
  const rows: BarRow[] = list.map((r) => {
    const page = citySlug && typeof r.slug === "string" ? districtPageTarget(citySlug, r.slug) : null;
    return {
      key: keyOf(r),
      name: String(r.name),
      value: at(r),
      ...(page ? { href: page.href, lands: page.answers } : {}),
    };
  });
  const dear = ascending[ascending.length - 1];
  /* THE CLIP LINE, ONE PLACE FOR BOTH ALTITUDES (QUEUE city:rent-clipped-line,
     the goal's B7, 2026-09-24). A district whose composed rent sits on the
     engine's clip prints the bound, not a reading; the hub said so under its
     basis since 2026-09-19 and the city card printed the same figure in
     silence. The row says it is clipped (`rent_clipped`, from the engine on
     the city, from the scheme on the hub) and the line names it in the hub's
     words; no clipped row, no line. */
  const clippedNames = list.filter((r) => r.rent_clipped === true).map((r) => String(r.name));
  const clipLine =
    clippedNames.length === 0
      ? null
      : clippedNames.length === 1
        ? COPY.hoodRank.clipOne.replace("{district}", clippedNames[0])
        : COPY.hoodRank.clipMany.replace("{districts}", clippedNames.join(", "));
  /* The lower middle for an even count, said here rather than left to a
     reader to wonder about: with six districts this is the third cheapest.
     With TWO the same expression returns index 0, the cheapest itself, which
     is why the count is checked and not assumed: see MIDDLE_MIN_DISTRICTS. */
  const mid = ascending.length >= MIDDLE_MIN_DISTRICTS ? ascending[Math.floor((ascending.length - 1) / 2)] : null;
  return {
    rows,
    worldMax: Math.max(...rows.map((r) => r.value)),
    tagged: true,
    districts: rows.length,
    cheapest: String(ascending[0].name),
    dearest: { name: String(dear.name), value: at(dear) },
    middle: mid ? { name: String(mid.name), value: at(mid) } : null,
    basis: COPY.cityDistricts.basis
      .replace("{district}", String(ascending[0].name))
      .replace("{count}", countWord(rows.length)),
    phoneHead: {
      name: COPY.cityDistricts.phoneHead.name,
      value: COPY.cityDistricts.phoneHead.value.replace("{district}", String(ascending[0].name)),
    },
    clipped: clippedNames,
    clipLine,
  };
}
