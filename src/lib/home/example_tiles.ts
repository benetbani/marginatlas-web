/**
 * src/lib/home/example_tiles.ts
 *
 * The homepage's curated example tiles: six recognizable business-in-city cells,
 * each resolved to a real headline number (owner take-home, revenue fallback) so
 * a first-time visitor can open a concrete one instead of typing. Budget-wrapped
 * and self-omitting on a miss, so the homepage never blocks or shows a blank
 * number. The take-home uses the same source of truth the city/country pages use
 * (ownerTakeHomeForCell), so the headline matches that cell's own page.
 */
import { getCellBySlug, withBudget } from "@/lib/cells";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { ownerTakeHomeForCell } from "@/lib/scores/country_board";
import { fmtMoney } from "@/lib/format/money";

export type ExampleTile = {
  business: string;
  city: string;
  href: string;
  /** Pre-formatted headline, e.g. "Owner keeps about $48K a year". */
  headline: string;
};

type Curated = {
  business: string;
  city: string;
  country: string;
  geo: string;
  industry: string;
};

/** Six curated, recognizable cells (the same set the old home questions used,
 * known to resolve). Familiar over maximally-varied, per the design. */
const CURATED: Curated[] = [
  { business: "Restaurants", city: "Barcelona", country: "es", geo: "es511", industry: "restaurants" },
  { business: "Software developers", city: "San Francisco", country: "us", geo: "california", industry: "software-development" },
  { business: "Law firms", city: "the UK", country: "gb", geo: "gb", industry: "legal-services" },
  { business: "Hotels", city: "Cancun", country: "mx", geo: "mx-roo", industry: "hotels-lodging" },
  { business: "Metal manufacturers", city: "Bavaria", country: "de", geo: "de21", industry: "fabricated-metal-mfg" },
  { business: "Restaurants", city: "California", country: "us", geo: "california", industry: "restaurants" },
];

function isNum(n: number | null | undefined): n is number {
  return n != null && Number.isFinite(n);
}

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
      let headline: string | null = null;
      if (isNum(takeHome) && takeHome > 0) {
        headline = `Owner keeps about ${fmtMoney(takeHome)} a year`;
      } else if (isNum(revenue) && revenue > 0) {
        headline = `About ${fmtMoney(revenue)} a year in revenue`;
      }
      if (!headline) return null;
      return { business: c.business, city: c.city, href, headline };
    }),
  );
  return resolved.filter((t): t is ExampleTile => t !== null);
}
