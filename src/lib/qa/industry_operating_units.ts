/**
 * Per-industry "operating units" for the tangible-units panel.
 *
 * Translates abstract annual revenue into recognized daily/hourly
 * counts. Every industry has a primary unit (covers per day, haircuts
 * per day, oil changes per day, room-nights per year) and an average
 * ticket value in USD.
 *
 * Sources: industry trade-association benchmarks (NRA, IHRSA, AHLA,
 * NADA, AAHA, Square Industry Reports 2024). Values are US national
 * means; the panel uses them as ratios against the cell's revenue
 * (so a high-revenue cell shows proportionally more transactions per
 * day, a low-revenue cell shows fewer).
 *
 * Coverage: the 16 baselined industries.
 */

export type OperatingUnits = {
  /** What we're counting. Reads on the page as "{count} {primary_unit_name} per {period}". */
  primary_unit_name: string;
  /** Period for the primary count: "day" or "year" depending on industry shape. */
  period: "day" | "year";
  /** Average ticket / transaction value in USD. */
  average_ticket_usd: number;
  /** Operating days per year (restaurants typically 360, hotels 365, salons ~300). */
  operating_days_per_year: number;
  /** Editorial: one short sentence framing what the daily count actually feels like. */
  texture_note: string;
};

export const INDUSTRY_OPERATING_UNITS: Record<string, OperatingUnits> = {
  restaurants: {
    primary_unit_name: "covers",
    period: "day",
    average_ticket_usd: 45,
    operating_days_per_year: 360,
    texture_note:
      "Roughly half on weekdays, half on weekend dinner shifts. Peak Saturday lunch + dinner can hit 30% of the weekly total.",
  },
  cafes_coffee: {
    primary_unit_name: "transactions",
    period: "day",
    average_ticket_usd: 7,
    operating_days_per_year: 360,
    texture_note:
      "Mornings (7-10am) drive 50-60% of daily volume; afternoons and weekends fill the rest. Customer dwell averages 8-20 minutes.",
  },
  hairdressers_beauty: {
    primary_unit_name: "service appointments",
    period: "day",
    average_ticket_usd: 95,
    operating_days_per_year: 300,
    texture_note:
      "Most shops work 6 days. Saturday is the highest-revenue day across the industry; Tuesday is the slowest.",
  },
  barbershops: {
    primary_unit_name: "cuts",
    period: "day",
    average_ticket_usd: 35,
    operating_days_per_year: 300,
    texture_note:
      "Walk-in volume Tuesday-Friday; Saturday is appointment-heavy and the highest single-day revenue. Closed Sunday-Monday is common.",
  },
  auto_repair_shops: {
    primary_unit_name: "service tickets",
    period: "day",
    average_ticket_usd: 380,
    operating_days_per_year: 260,
    texture_note:
      "Most shops run Monday-Friday with reduced Saturday hours. Average ticket is bimodal: ~$80 oil-change visits + ~$800 brake/timing-belt repairs.",
  },
  hotels_lodging: {
    primary_unit_name: "room-nights",
    period: "year",
    average_ticket_usd: 165,
    operating_days_per_year: 365,
    texture_note:
      "Annual occupancy averages 65% across mid-market US hotels (about 240 sold nights per room per year). The bottom 10% of properties run below 50%.",
  },
  dental_practices: {
    primary_unit_name: "patient visits",
    period: "day",
    average_ticket_usd: 240,
    operating_days_per_year: 215,
    texture_note:
      "Typical practice works 4 days a week. Hygienist columns generate 60-70% of patient visits; doctor production drives the revenue.",
  },
  doctors_clinics: {
    primary_unit_name: "patient visits",
    period: "day",
    average_ticket_usd: 165,
    operating_days_per_year: 230,
    texture_note:
      "Primary care averages 22-28 visits/day per provider; specialists 12-18. Insurer mix drives the realized average ticket.",
  },
  legal_services: {
    primary_unit_name: "billable hours",
    period: "year",
    average_ticket_usd: 285,
    operating_days_per_year: 220,
    texture_note:
      "Solo and small-firm lawyers average 1,400-1,800 billable hours per year; realization rate (billed vs collected) runs 80-90%.",
  },
  accounting_tax: {
    primary_unit_name: "billable hours",
    period: "year",
    average_ticket_usd: 190,
    operating_days_per_year: 240,
    texture_note:
      "Heavily seasonal: 40% of annual revenue books between mid-January and mid-April. Most other months run thin to support tax-season capacity.",
  },
  real_estate_agencies: {
    primary_unit_name: "closed transactions",
    period: "year",
    average_ticket_usd: 11500,
    operating_days_per_year: 250,
    texture_note:
      "Average commission per side is 2.5-3% of sale price; the agency keeps 30-50% after splits with the agent. Median agent closes 8-12 transactions per year.",
  },
  residential_construction: {
    primary_unit_name: "projects",
    period: "year",
    average_ticket_usd: 95000,
    operating_days_per_year: 230,
    texture_note:
      "Small remodelers complete 8-15 projects per year; new-build contractors 3-6 per year per crew. Cash flow lags 30-90 days behind work.",
  },
  grocery_stores: {
    primary_unit_name: "transactions",
    period: "day",
    average_ticket_usd: 32,
    operating_days_per_year: 360,
    texture_note:
      "Independent grocers run 200-700 transactions/day depending on store size. Margin per transaction is thin: $1-3 net on a typical basket.",
  },
  clothing_stores: {
    primary_unit_name: "transactions",
    period: "day",
    average_ticket_usd: 75,
    operating_days_per_year: 360,
    texture_note:
      "Weekends drive 50-65% of weekly revenue. Inventory turn 3-5x per year is healthy; seasonal clearance accounts for most margin compression.",
  },
  sports_fitness: {
    primary_unit_name: "active members",
    period: "year",
    average_ticket_usd: 480,
    operating_days_per_year: 360,
    texture_note:
      "Membership economics dominate: average member stays 14-22 months. Boutique studios run on class packs ($20-35 per class) instead of monthly fees.",
  },
  veterinary_pet_care: {
    primary_unit_name: "patient visits",
    period: "day",
    average_ticket_usd: 215,
    operating_days_per_year: 260,
    texture_note:
      "Wellness exams and vaccinations drive volume; surgery + dental procedures drive margin. Most practices work 5-5.5 days.",
  },
};

/** Lookup helper. Returns null when the industry has no entry. */
export function getOperatingUnits(industryId: string | null | undefined): OperatingUnits | null {
  if (!industryId) return null;
  return INDUSTRY_OPERATING_UNITS[industryId] ?? null;
}
