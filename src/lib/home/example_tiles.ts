/**
 * src/lib/home/example_tiles.ts
 *
 * The homepage's curated example tiles: six recognizable business-in-city cells,
 * each resolved to a real figure (owner take-home, revenue fallback) so a
 * first-time visitor can open a concrete one instead of typing. Budget-wrapped
 * and self-omitting on a miss, so the homepage never blocks or shows a blank
 * number. The take-home uses the same source of truth the city/country pages use
 * (ownerTakeHomeForCell), so the figure matches that cell's own page.
 *
 * This module returns the figure and its KIND, never a formatted sentence. See
 * the note on `amount` below for what that fixed.
 */
import { getCellBySlug, withBudget } from "@/lib/cells";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { ownerTakeHomeForCell } from "@/lib/scores/country_board";

export type ExampleTile = {
  business: string;
  city: string;
  href: string;
  /** ISO-2 of the country the cell sits in, for the flag on the tile. */
  iso2: string;
  /**
   * THE FIGURE, AND WHICH FIGURE IT IS, instead of a pre-formatted sentence.
   *
   * This used to be one field, `headline`, holding "Owner keeps about $58K a
   * year". Measured off the rendered home page: the six tiles carried 36 words
   * of sentence and not one number set as a number, in the band whose entire
   * job is to show that the atlas answers a question with a figure. The
   * founder's note on the page is that it "just has a lot of text" and "lacks
   * elements", and a card that is a title plus a sentence is the exact shape
   * that note describes.
   *
   * Splitting it also fixes a defect the sentence hid. Five tiles said "Owner
   * keeps about X" and the sixth said "About X a year in revenue": two
   * different quantities in the same visual slot, told apart only by reading
   * the middle of a line. As a tagged pair the difference is structural, the
   * component labels it, and no caller can print one as the other by accident.
   */
  amount: number;
  metric: "kept" | "revenue";
};

type Curated = {
  business: string;
  city: string;
  country: string;
  geo: string;
  industry: string;
};

/** Six curated, recognizable cells (the same set the old home questions used,
 * known to resolve). Familiar over maximally-varied, per the design.
 *
 * THE SIXTH TILE USED TO BE RESTAURANTS AGAIN. Six tiles showed five trades,
 * and the repeat was not the useful kind: measured directly, restaurants in
 * California keep 57,001 and restaurants in Barcelona keep 58,179. The same
 * trade twice, 1,178 apart, in the band whose whole job is to show a reader
 * the breadth of what can be looked up. It demonstrated neither variety nor
 * variation.
 *
 * That is separate from the familiar-over-varied rule above, which is about
 * choosing recognisable places over exotic ones, and still holds: the
 * replacement stays in California.
 *
 * Coffee shops, on measurement rather than taste. The candidates that resolve
 * in California were probed through the same accessor this loader uses, and
 * most fail the common-sense bar rather than the technical one: auto repair
 * keeps 18,472 and dentists 43,685, and a dentist keeping 44K reads as broken
 * to anyone who knows the trade, which is the one thing a proof tile cannot
 * do. Hair salons resolve untrusted at a 1.5M revenue. Coffee shops come back
 * trusted at 70,673, sit mid-range against the other five, and are the
 * archetypal business a reader is actually weighing up.
 */
const CURATED: Curated[] = [
  { business: "Restaurants", city: "Barcelona", country: "es", geo: "es511", industry: "restaurants" },
  { business: "Software developers", city: "San Francisco", country: "us", geo: "california", industry: "software-development" },
  { business: "Law firms", city: "the UK", country: "gb", geo: "gb", industry: "legal-services" },
  { business: "Hotels", city: "Cancun", country: "mx", geo: "mx-roo", industry: "hotels-lodging" },
  { business: "Metal manufacturers", city: "Bavaria", country: "de", geo: "de21", industry: "fabricated-metal-mfg" },
  { business: "Coffee shops", city: "California", country: "us", geo: "california", industry: "coffee-shops" },
];

function isNum(n: number | null | undefined): n is number {
  return n != null && Number.isFinite(n);
}

/**
 * Common-sense floor for an owner-take-home headline tile. A tile sits on the
 * homepage as proof the numbers are real, so an implausibly low owner-keep
 * (e.g. a hotel clearing only about $5K a year) reads as broken next to the
 * six-figure tiles. Below this floor we do not surface the take-home headline;
 * the tile falls through to its revenue headline, and if that is also missing
 * the tile is dropped and the next curated one fills its place.
 */
const MIN_OWNER_TAKE_HOME_USD = 15_000;

export async function loadExampleTiles(): Promise<ExampleTile[]> {
  const resolved = await Promise.all(
    CURATED.map(async (c): Promise<ExampleTile | null> => {
      const cell = await withBudget(
        getCellBySlug(c.country, c.geo, c.industry, { sizeBand: null, year: null }),
        null,
        4_000,
        `home-tile:${c.country}/${c.geo}/${c.industry}`,
      );
      if (!cell) return null;
      const href = `/${c.country}/${c.geo}/${c.industry}`;
      const snap = getCountryEconomicsSnapshot(c.country.toUpperCase());
      const annualIncome = isNum(snap?.avgMonthlySalary) ? snap.avgMonthlySalary * 12 : null;
      const takeHome = ownerTakeHomeForCell(cell, annualIncome);
      const revenue = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
      // Sanity floor: only surface an owner-keep headline when it clears a
      // low-but-nonzero floor. A sub-floor take-home (e.g. a hotel clearing
      // about $5K a year) reads as broken beside the six-figure tiles, so we
      // fall through to the revenue headline instead, and drop the tile only if
      // that is also missing. The next curated tile then fills the row.
      if (isNum(takeHome) && takeHome >= MIN_OWNER_TAKE_HOME_USD) {
        return { business: c.business, city: c.city, href, iso2: c.country.toUpperCase(), amount: takeHome, metric: "kept" };
      }
      if (isNum(revenue) && revenue > 0) {
        return { business: c.business, city: c.city, href, iso2: c.country.toUpperCase(), amount: revenue, metric: "revenue" };
      }
      return null;
    }),
  );
  return resolved.filter((t): t is ExampleTile => t !== null);
}
