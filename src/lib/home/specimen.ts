/**
 * src/lib/home/specimen.ts , one real answer, resolved live.
 *
 * WHY THIS EXISTS. The home page describes the product in five different ways,
 * what the atlas holds, what it can see, where it reaches, who it is for, what
 * it costs, and never once shows what an ANSWER looks like. Every reference it
 * is measured against does the opposite: a rental marketplace puts real
 * listings with real prices on the front page, an airline puts real routes with
 * real fares. They show the goods. This page had a shop window full of signage.
 *
 * The h1 makes a specific claim, "what a small business earns, and what its
 * owner actually keeps". This is that claim, answered once, in numbers, above
 * the fold's fold. Not a promise that the atlas can answer it: the answer.
 *
 * THE GAP IS THE POINT. Revenue and take-home are the two ends of the sentence
 * and the distance between them is what nobody else publishes. A restaurant
 * turning over half a million dollars while its owner keeps about a ninth of
 * that is the entire argument for the site, and it is more persuasive as one
 * true pair of numbers than as any amount of copy about methodology.
 *
 * HONEST OR ABSENT. Trusted-local only, both figures or nothing. If the cell
 * does not resolve, or is not a measurement, or either number is missing, this
 * returns null and the band does not render. A specimen that had to be hedged
 * would be worse than no specimen, because this is the one number on the page a
 * reader will check.
 */
import { getCellBySlug, withBudget } from "@/lib/cells";
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { ownerTakeHomeForCell } from "@/lib/scores/country_board";

export type Specimen = {
  trade: string;
  place: string;
  href: string;
  /** Typical annual revenue for one firm. */
  revenue: number;
  /** What reaches the owner, after everything. */
  takeHome: number;
  /** takeHome as a percent of revenue, rounded. */
  keptPct: number;
};

/**
 * The candidates, in order of preference. All are already curated in
 * example_tiles as known to resolve, so this adds no new claim about coverage.
 *
 * Restaurants lead deliberately. It is the trade a reader can price in their
 * head, which makes the gap between the two numbers land immediately rather
 * than after a paragraph of explanation.
 */
const CANDIDATES: { country: string; geo: string; industry: string; trade: string; place: string }[] = [
  { country: "us", geo: "california", industry: "restaurants", trade: "Restaurants", place: "California" },
  { country: "es", geo: "es511", industry: "restaurants", trade: "Restaurants", place: "Barcelona" },
  { country: "us", geo: "california", industry: "coffee-shops", trade: "Coffee shops", place: "California" },
];

export async function loadSpecimen(): Promise<Specimen | null> {
  for (const c of CANDIDATES) {
    const cell = await withBudget(
      getCellBySlug(c.country, c.geo, c.industry, { sizeBand: null, year: null }),
      null,
      4_000,
      `home-specimen:${c.country}/${c.geo}/${c.industry}`,
    );
    if (!cell || !isTrustedLocalCell(cell)) continue;

    const revenue = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
    if (typeof revenue !== "number" || revenue <= 0) continue;

    const snap = getCountryEconomicsSnapshot(c.country.toUpperCase());
    const annualIncome =
      snap && typeof snap.avgMonthlySalary === "number" ? snap.avgMonthlySalary * 12 : null;
    const takeHome = ownerTakeHomeForCell(cell, annualIncome);
    if (typeof takeHome !== "number" || !Number.isFinite(takeHome) || takeHome <= 0) continue;

    /* A take-home above revenue would mean the model has inverted somewhere,
       and the one place that must never print is the specimen. */
    if (takeHome >= revenue) continue;

    return {
      trade: c.trade,
      place: c.place,
      href: `/${c.country}/${c.geo}/${c.industry}`,
      revenue,
      takeHome,
      keptPct: Math.round((takeHome / revenue) * 100),
    };
  }
  return null;
}
