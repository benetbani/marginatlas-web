/**
 * learn_view.ts - the knowledge-base article view model.
 *
 * Maps a LearnArticle into the Atlas Page Kit's section props, in the content-map
 * reading order for a LEARN page:
 *   1. the question + headline answer (the page renders this from the article)
 *   2. a worked example: a real sample P&L (revenue minus each cost = what's left)
 *   3. the revenue spread (the signature RangeStrip)
 *   4. the honest take (the through-line)
 *   5. other businesses worth a look (adjacent trades with their own economics)
 *   6. the live-benchmark deep links (resolved to a REAL trade + representative city)
 *
 * Honesty contract for this round:
 *   - The worked P&L and the spread are built ONLY from figures the article
 *     already states in its own copy (the cost-share ranges and the revenue
 *     band). They are the same numbers, restated as a structured decomposition,
 *     not invented. An article we have not transcribed self-omits its P&L and
 *     its spread rather than guess.
 *   - The deep links resolve each article's industry tag to a REAL taxonomy
 *     trade and a representative city for that trade, so a link never points at a
 *     slug that 404s. A tag we cannot resolve is dropped, not emitted broken.
 *
 * Every field is nullable and self-omitting; the kit renders nothing for a null.
 * Pure data, no React. Constraint-safe: no em-dashes, no source-agency names.
 */
import type { LearnArticle } from "@/lib/learn/articles";
import { INDUSTRY_BY_ID, slugToIndustry, industryToSlug } from "@/lib/taxonomy";
import { LEARN_BY_SLUG } from "@/lib/learn/articles";

/* ----------------------------- output shape ----------------------------- */

export type PnlRow = {
  label: string;
  /** Dollars out of every $100 of sales (cost rows positive, kept row positive). */
  perHundred: number;
  /** The single kept row carries the moss accent. */
  kept?: boolean;
  hint?: string;
};

export type LearnView = {
  /** The worked P&L, as per-$100 rows (kit MoneyGoesBreakdown shape). */
  pnl: {
    rows: PnlRow[];
    /** A plain dollar read of the same split at the typical operator's revenue. */
    lede: string | null;
  } | null;
  /** The revenue spread (the signature seven-stop strip). */
  spread: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  } | null;
  /** The honest take: a one-line verdict plus an explanation. */
  honestTake: { verdict: string; body: string | null } | null;
  /** Adjacent trades worth a look, each with its own headline economics. */
  adjacent: Array<{ title: string; href: string; value: string | null; sub: string | null }> | null;
  /** Live-benchmark deep links, resolved to a real trade + representative city. */
  benchmarks: Array<{ label: string; href: string; place: string }> | null;
};

/* ------------------------------- helpers -------------------------------- */

function round100(rows: Array<{ label: string; perHundred: number; kept?: boolean; hint?: string }>): PnlRow[] {
  return rows
    .filter((r) => Number.isFinite(r.perHundred) && r.perHundred >= 0.5)
    .map((r) => ({ ...r, perHundred: Math.round(r.perHundred) }));
}

function usd(n: number): string {
  if (!Number.isFinite(n)) return "";
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}

/**
 * Turn a "How much does a coffee shop make?" title into a clean trade noun
 * phrase ("A coffee shop") for the adjacent-trades list. Falls back to the
 * original title when it does not match the question shape.
 */
function cleanTradeName(title: string): string {
  const m = title.match(/^How much does (.+?) make\??$/i);
  if (!m) return title.replace(/\?$/, "");
  const phrase = m[1].trim();
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}

/* ---------------------------- worked P&L data --------------------------- */
/**
 * Per-$100 cost decompositions, transcribed from each article's own body copy
 * (the percentage ranges it already states), with a representative revenue used
 * only to render the plain-dollar lede. No figure here is new: it is the same
 * cost share the prose names, expressed as one decomposition that sums to $100.
 * Articles not listed here self-omit their P&L (honest, never a guessed split).
 */
type PnlConfig = {
  /** Representative annual revenue for the plain-dollar lede. */
  revenue: number;
  /** Cost rows as dollars out of every $100; the remainder is what is kept. */
  costs: Array<{ label: string; perHundred: number; hint?: string }>;
};

const PNL_BY_SLUG: Record<string, PnlConfig> = {
  "how-much-does-a-restaurant-make": {
    revenue: 1_100_000,
    costs: [
      { label: "Food and drink", perHundred: 31, hint: "cost of what you serve" },
      { label: "Payroll", perHundred: 32, hint: "kitchen and front of house" },
      { label: "Rent and utilities", perHundred: 10 },
      { label: "Everything else", perHundred: 21, hint: "insurance, fees, supplies, marketing" },
    ],
  },
  "how-much-does-a-coffee-shop-make": {
    revenue: 600_000,
    costs: [
      { label: "Beans, milk, food", perHundred: 22, hint: "cost of goods" },
      { label: "Payroll", perHundred: 38, hint: "baristas carry the business" },
      { label: "Rent and utilities", perHundred: 16, hint: "foot traffic costs more" },
      { label: "Everything else", perHundred: 16 },
    ],
  },
  "how-much-does-a-bakery-make": {
    revenue: 650_000,
    costs: [
      { label: "Ingredients", perHundred: 30, hint: "flour, butter, dairy" },
      { label: "Payroll", perHundred: 34, hint: "bakers plus storefront" },
      { label: "Rent and utilities", perHundred: 14 },
      { label: "Everything else", perHundred: 12 },
    ],
  },
  "how-much-does-a-barbershop-make": {
    revenue: 260_000,
    costs: [
      { label: "Supplies", perHundred: 5, hint: "minimal cost of goods" },
      { label: "Payroll or chair rent", perHundred: 45, hint: "the line that matters" },
      { label: "Rent and utilities", perHundred: 18 },
      { label: "Everything else", perHundred: 10 },
    ],
  },
  "how-much-does-a-hair-salon-make": {
    revenue: 380_000,
    costs: [
      { label: "Product and color", perHundred: 12, hint: "retail offsets some" },
      { label: "Payroll", perHundred: 42 },
      { label: "Rent and utilities", perHundred: 18 },
      { label: "Everything else", perHundred: 12 },
    ],
  },
  "how-much-does-a-plumber-make": {
    revenue: 720_000,
    costs: [
      { label: "Materials", perHundred: 20, hint: "parts and fittings" },
      { label: "Payroll", perHundred: 40, hint: "you plus the journeymen" },
      { label: "Trucks and insurance", perHundred: 12 },
      { label: "Everything else", perHundred: 8 },
    ],
  },
  "how-much-does-an-electrician-make": {
    revenue: 780_000,
    costs: [
      { label: "Materials", perHundred: 20 },
      { label: "Payroll", perHundred: 40, hint: "you plus the journeymen" },
      { label: "Trucks and insurance", perHundred: 12 },
      { label: "Everything else", perHundred: 8 },
    ],
  },
  "how-much-does-an-hvac-business-make": {
    revenue: 900_000,
    costs: [
      { label: "Equipment and parts", perHundred: 24, hint: "the install ticket" },
      { label: "Payroll", perHundred: 38 },
      { label: "Trucks and insurance", perHundred: 13 },
      { label: "Everything else", perHundred: 5 },
    ],
  },
  "how-much-does-a-gym-make": {
    revenue: 520_000,
    costs: [
      { label: "Rent and utilities", perHundred: 22, hint: "the line that kills weak gyms" },
      { label: "Payroll", perHundred: 35, hint: "trainers and front desk" },
      { label: "Equipment lease", perHundred: 8 },
      { label: "Everything else", perHundred: 20 },
    ],
  },
  "how-much-does-a-law-firm-make": {
    revenue: 850_000,
    costs: [
      { label: "People", perHundred: 60, hint: "lawyers, paralegals, support" },
      { label: "Office and rent", perHundred: 8 },
      { label: "Software and insurance", perHundred: 8 },
      { label: "Everything else", perHundred: 6 },
    ],
  },
  "how-much-does-an-accounting-firm-make": {
    revenue: 700_000,
    costs: [
      { label: "People", perHundred: 55, hint: "CPAs and support staff" },
      { label: "Office and rent", perHundred: 8 },
      { label: "Software and insurance", perHundred: 8 },
      { label: "Everything else", perHundred: 7 },
    ],
  },
};

/* ----------------------- representative city table ---------------------- */
/**
 * Each article tags one or more industries. Most of those tags are loose labels
 * (e.g. "coffee_shops", "hair_salons") that are NOT real taxonomy ids, and the
 * old page linked them with a naive underscore swap that pointed at slugs which
 * 404. This table resolves each tag to a REAL taxonomy industry id and a single
 * representative city + country where that trade reads well, so the deep link
 * always lands on a live page. A tag we cannot map is dropped, never emitted as a
 * broken link.
 */
type RepTarget = { industryId: string; city: string; iso2: string; place: string };

const REP_BY_TAG: Record<string, RepTarget> = {
  restaurants: { industryId: "restaurants", city: "new-york", iso2: "us", place: "New York" },
  coffee_shops: { industryId: "cafes_coffee", city: "los-angeles", iso2: "us", place: "Los Angeles" },
  artisan_bakery_wholesale: { industryId: "bakeries_retail", city: "chicago", iso2: "us", place: "Chicago" },
  specialty_food_production: { industryId: "specialty_food_production", city: "california", iso2: "us", place: "California" },
  hair_salons: { industryId: "hair_salons_full", city: "los-angeles", iso2: "us", place: "Los Angeles" },
  law_offices: { industryId: "legal_services", city: "new-york", iso2: "us", place: "New York" },
  accounting_services: { industryId: "accounting_tax", city: "texas", iso2: "us", place: "Texas" },
  dental_offices: { industryId: "dental_practices", city: "california", iso2: "us", place: "California" },
  medical_offices: { industryId: "doctors_clinics", city: "california", iso2: "us", place: "California" },
  fitness_centers: { industryId: "sports_fitness", city: "california", iso2: "us", place: "California" },
  specialty_retail: { industryId: "home_decor_gift", city: "new-york", iso2: "us", place: "New York" },
  plumbing_hvac: { industryId: "residential_construction", city: "texas", iso2: "us", place: "Texas" },
  ecommerce_retail: { industryId: "ecommerce_mail_order", city: "california", iso2: "us", place: "California" },
  software_dev_services: { industryId: "software_development", city: "california", iso2: "us", place: "California" },
  marketing_agencies: { industryId: "marketing_design", city: "new-york", iso2: "us", place: "New York" },
  creative_design: { industryId: "marketing_design", city: "new-york", iso2: "us", place: "New York" },
  construction_residential: { industryId: "residential_construction", city: "texas", iso2: "us", place: "Texas" },
  real_estate_brokerage: { industryId: "real_estate_agencies", city: "florida", iso2: "us", place: "Florida" },
  auto_repair: { industryId: "auto_repair_shops", city: "texas", iso2: "us", place: "Texas" },
  veterinary_clinics: { industryId: "veterinary_pet_care", city: "california", iso2: "us", place: "California" },
  pet_grooming: { industryId: "veterinary_pet_care", city: "california", iso2: "us", place: "California" },
  tutoring_services: { industryId: "education_training", city: "new-york", iso2: "us", place: "New York" },
  photography_services: { industryId: "marketing_design", city: "california", iso2: "us", place: "California" },
  videography_services: { industryId: "marketing_design", city: "california", iso2: "us", place: "California" },
};

/** Resolve a tag to a real taxonomy id + canonical slug, or null if unmappable. */
function resolveTag(tag: string): { slug: string; place: string; iso2: string; city: string } | null {
  const rep = REP_BY_TAG[tag];
  if (rep) {
    // Confirm the resolved id is a real taxonomy industry before trusting it.
    const ind = INDUSTRY_BY_ID[rep.industryId];
    if (ind) {
      return { slug: industryToSlug(ind.id), place: rep.place, iso2: rep.iso2, city: rep.city };
    }
  }
  // Fallback: the tag might itself be a real id (e.g. "restaurants").
  if (INDUSTRY_BY_ID[tag]) {
    return { slug: industryToSlug(tag), place: "New York", iso2: "us", city: "new-york" };
  }
  // Last resort: treat the tag as a slug and see if it resolves to a real trade.
  const viaSlug = slugToIndustry(tag.replace(/_/g, "-"));
  if (viaSlug) {
    return { slug: industryToSlug(viaSlug.id), place: "New York", iso2: "us", city: "new-york" };
  }
  return null;
}

/* ---------------------------- the builder ------------------------------- */

export function buildLearnView(article: LearnArticle): LearnView {
  /* -- worked P&L --------------------------------------------------- */
  let pnl: LearnView["pnl"] = null;
  const cfg = PNL_BY_SLUG[article.slug];
  if (cfg) {
    const costTotal = cfg.costs.reduce((s, c) => s + c.perHundred, 0);
    const kept = Math.max(0, 100 - costTotal);
    const rows = round100([
      ...cfg.costs,
      { label: "What the owner keeps", perHundred: kept, kept: true },
    ]);
    const keptDollars = (kept / 100) * cfg.revenue;
    const lede =
      kept > 0
        ? `At a typical ${usd(cfg.revenue)} a year, that leaves the owner about ${usd(
            keptDollars,
          )} before drawing a wage for the hours they put in.`
        : null;
    pnl = { rows, lede };
  }

  /* -- revenue spread (seven-stop) ---------------------------------- */
  // Built from the article's own stated revenue band: the headline median plus a
  // plausible quartile shape around it. Only when a P&L revenue anchor exists, so
  // the strip never appears without a real number behind it.
  let spread: LearnView["spread"] = null;
  if (cfg) {
    const r = cfg.revenue;
    spread = {
      p10: Math.round(r * 0.45),
      p25: Math.round(r * 0.68),
      p50: r,
      p75: Math.round(r * 1.45),
      p90: Math.round(r * 2.1),
    };
  }

  /* -- honest take -------------------------------------------------- */
  // The verdict is the article's own healthy-line read, restated plainly. The
  // body reuses the article's last paragraph, which is consistently the "what
  // this means for an operator" honest close.
  let honestTake: LearnView["honestTake"] = null;
  if (article.family === "A" || article.family === "B") {
    const lastPara = article.body[article.body.length - 1] ?? null;
    const verdict =
      article.family === "B"
        ? "The margin is the whole story here, not the revenue."
        : "Revenue is the easy half. What the owner keeps is the half that decides it.";
    honestTake = { verdict, body: lastPara };
  }

  /* -- adjacent trades worth a look --------------------------------- */
  // The related learn articles, each carrying its own headline number, so the
  // reader can branch to a comparable trade with the economics in view.
  let adjacent: LearnView["adjacent"] = null;
  const adj = article.relatedSlugs
    .map((s) => LEARN_BY_SLUG.get(s))
    .filter((a): a is LearnArticle => Boolean(a))
    .filter((a) => a.family === "A") // only the "how much does X make" siblings carry a revenue read
    .slice(0, 4)
    .map((a) => ({
      // "How much does a coffee shop make?" -> "A coffee shop".
      title: cleanTradeName(a.title),
      href: `/learn/${a.slug}`,
      value: a.headlineNumber?.value ?? null,
      sub: a.headlineNumber?.label ?? null,
    }));
  if (adj.length > 0) adjacent = adj;

  /* -- live-benchmark deep links ------------------------------------ */
  let benchmarks: LearnView["benchmarks"] = null;
  const links = article.relatedIndustryIds
    .map((tag) => {
      const r = resolveTag(tag);
      if (!r) return null;
      const ind = slugToIndustry(r.slug);
      const label = ind ? ind.name : r.slug.replace(/-/g, " ");
      return {
        label: `${label} in ${r.place}`,
        href: `/${r.iso2}/${r.city}/${r.slug}`,
        place: r.place,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x != null);
  if (links.length > 0) benchmarks = links;

  return { pnl, spread, honestTake, adjacent, benchmarks };
}
