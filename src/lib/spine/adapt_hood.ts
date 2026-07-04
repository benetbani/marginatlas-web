/**
 * src/lib/spine/adapt_hood.ts , the NEIGHBORHOOD-hub real-data adapter (Phase B).
 *
 * Promotes the neighborhood-hub spine surface (/dev/spine-hood body, SpineHoodBody)
 * from its illustrative 9-district London seed to real, reconciled data behind the
 * per-page spine gate (isSpineReformEnabledFor("hood")). Server only, pure (no
 * "use client"): awaited from the RSC route src/app/cities/[slug]/neighborhoods/page.tsx.
 *
 * HONESTY RAIL (absolute). The seed's nine named fine-districts (Mayfair, Soho,
 * Shoreditch, ...) do NOT exist in any live scheme, so promotion RE-KEYS the page to
 * the seven real London macro-districts (neighborhoods_v1.json cities.london) and
 * discards the fabricated set wholesale. Every filled figure is driven from the SAME
 * engine the live non-spine neighborhoods page runs (getNeighborhoodMultiplier +
 * rentMultiplier over data/economics/neighborhood_intensity_v1.json) plus the real
 * flavor accessor (neighborhood_flavor_v1.json). The keep index is the same server-safe
 * formula the page renders. Nothing is fabricated.
 *
 * The benchmark activity is "restaurants" (the exact activity the live non-spine page
 * hardcodes, page.tsx:131), so the revenue figures reconcile with it; the provenance
 * line states this. Revenue is per-activity, so there is no activity-free number.
 *
 * What is filled REAL: name / slug / character, the revenue/rent/keep triple + the
 * commuter/visitor/character multiplier factors + tags (engine), walkability / price
 * tier / demographic skew / character paragraph (flavor), the per-district best-trade
 * ranking (real per-trade multiplier), and the narrative notes (derived from the real
 * figures, never asserted). The orientation MAP survives via authored macro-district
 * centroids (verifiable public geography, not fabricated business data).
 *
 * What is OMITTED (no honest source; the spine body null-guards each so it renders
 * NOTHING, never a 0 / "?" / fabricated value): footfall timing (kills FootfallScale +
 * the weekday-dependence and weekend-footfall Pro compare rows), "what locals know"
 * (the panel Pro seam), prime streets, the numeric walk score (the categorical 3-band
 * survives), the per-district cell count, headline_trade, and the legacy xy coords.
 *
 * DATA-QUALITY NOTE (surfaced, not a fabrication): the visitor multiplier clips, so
 * City of London, West End and South Bank all read an identical +200% revenue. The
 * keep index still separates them through rent, so the page thesis holds; the narrative
 * copy is written to the true "same takings, rent decides" story rather than the seed's
 * "loudest keeps least" framing, which the real data does not support.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import neighborhoodsJson from "../../../data/cities/neighborhoods_v1.json";
import { COUNTRIES } from "@/lib/taxonomy";
import {
  getNeighborhoodMultiplier,
  rentMultiplier,
  hasNeighborhoodIntensity,
  tagLabel,
} from "@/lib/economics/neighborhood_multipliers";
import { getNeighborhoodFlavor } from "@/lib/cities/neighborhood_flavor";
import { buildCityActivities } from "@/lib/scores/city_board";

type City = { slug: string; name: string; iso2: string };
type Neighborhood = { slug: string; name: string; character: string; description?: string };
type Scheme = { scheme: string; neighborhoods: Neighborhood[] };

const CITIES = (cityListJson as { cities: City[] }).cities;
const CITIES_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));
const SCHEMES = (neighborhoodsJson as { cities: Record<string, Scheme> }).cities;

/** The benchmark activity the live non-spine neighborhoods page uses (page.tsx:131),
 * so the revenue figures reconcile with it. Stated in the provenance line. */
const BENCHMARK_ACTIVITY = "restaurants";

/** Authored macro-district centroids: the true geographic center of each broad London
 * district (verifiable public geography, not fabricated business data), so the
 * orientation map survives the re-key. ONLY a city present here renders the spine hub;
 * every other city falls through to the existing non-spine page (no invented coords). */
const CENTROIDS: Record<string, Record<string, { lat: number; lng: number }>> = {
  london: {
    "city-of-london": { lat: 51.515, lng: -0.093 },
    "west-end": { lat: 51.513, lng: -0.14 },
    "south-bank": { lat: 51.505, lng: -0.116 },
    "north-london": { lat: 51.552, lng: -0.118 },
    "south-london": { lat: 51.457, lng: -0.117 },
    "east-london": { lat: 51.541, lng: -0.056 },
    "west-london": { lat: 51.499, lng: -0.205 },
  },
};

/** keepIndex, inlined to keep the adapter in the domain layer (mirrors
 * components/spine/keep.ts exactly): 100 x revenue / rent, city baseline 100. */
function keepOf(revVsCityPct: number, rentMult: number): number {
  const revenue = 1 + revVsCityPct / 100;
  const rent = rentMult > 0 ? rentMult : 1;
  return Math.round((revenue / rent) * 100);
}

/** The panel's price band lacks a "budget" step; fold it onto the nearest real one. */
function priceTierBand(t: string | undefined): string | undefined {
  if (!t) return undefined;
  return t === "budget" ? "affordable" : t;
}

/**
 * Build the real-data spine neighborhood seed for one city slug. Returns undefined
 * when the city has no authored centroids or fewer than four curated districts (the
 * caller then falls through to the existing non-spine neighborhoods page, never a 404),
 * so the spine hub only ever renders where every number is real and the keep-divergence
 * thesis actually has districts to separate. London is the one such city today.
 */
export async function buildSpineHoodSeed(citySlug: string): Promise<any> {
  const city = CITIES_BY_SLUG.get(citySlug);
  const scheme = SCHEMES[citySlug];
  const centroids = CENTROIDS[citySlug];
  if (!city || !scheme || !centroids) return undefined;

  // Only districts with a curated intensity row AND an authored centroid carry real
  // numbers; anything else is dropped rather than shown on a city-default fallback.
  const curated = scheme.neighborhoods.filter(
    (n) => hasNeighborhoodIntensity(citySlug, n.slug) && centroids[n.slug],
  );
  if (curated.length < 4) return undefined;

  const countryName = COUNTRIES.find((c) => c.code === city.iso2)?.name || city.iso2;

  // The real city trade set, used to rank each district's best-suited trades. One
  // budgeted call, reused across the districts; capped so the per-district ranking loop
  // stays cheap. Reconciles with the /cities/[slug] leaderboard (same accessor).
  const activities = await buildCityActivities({ slug: city.slug, countryIso2: city.iso2 });
  const activitySlugs = activities.filter((a) => a.slug && a.name).slice(0, 24);

  const districts = curated.map((n) => {
    const m = getNeighborhoodMultiplier(citySlug, n.slug, BENCHMARK_ACTIVITY);
    const rent = +rentMultiplier(m.appliedTags).toFixed(2);
    const rev = Math.round((m.final - 1) * 100);
    const keep = keepOf(rev, rent);
    const above = keep >= 100;
    const flavor = getNeighborhoodFlavor(citySlug, n.slug);
    const cen = centroids[n.slug];

    // Best trades: the real city trades that actually lift in THIS district, ranked by
    // that lift, so a finance-tagged district surfaces its finance trades and a tourist
    // zone its footfall trades. Only trades with a real positive lift qualify (a "what
    // works here" list must not list a trade the district does nothing for); the section
    // self-omits when none lift. The "why" states the real per-trade lift.
    const best_trades = activitySlugs
      .map((a) => ({
        name: a.name,
        pct: Math.round((getNeighborhoodMultiplier(citySlug, n.slug, a.slug).final - 1) * 100),
      }))
      .filter((t) => t.pct > 0)
      .sort((x, y) => y.pct - x.pct)
      .slice(0, 3)
      .map((t) => ({
        name: t.name,
        why: `Revenue runs about +${t.pct}% versus the city for this trade here.`,
      }));

    // Deterministic, honest verdict + counterweights, all from the real figures.
    const verdict = above
      ? "Rent stays light enough against the takings that more of each pound survives than the city keeps on average."
      : "Strong takings, but a heavier rent load leaves less of each pound than the city keeps on average.";
    const counterweight_above = `Takings run ${rev >= 0 ? "+" : ""}${rev}% over the city and rent x${rent.toFixed(2)}, which leaves the keep index at ${keep}, above the city baseline of 100.`;
    const counterweight_below = `Takings run ${rev >= 0 ? "+" : ""}${rev}% over the city, but rent at x${rent.toFixed(2)} pulls the keep index to ${keep}, below the city baseline of 100.`;

    return {
      name: n.name,
      slug: n.slug,
      character: n.character.replace(/-/g, " "),
      tags: m.appliedTags.map(tagLabel),
      commuter_mult: m.commuter,
      tourism_mult: m.tourism,
      tag_mult: m.tags,
      rent_mult: rent,
      rev_vs_city_pct: rev,
      walkability: flavor?.walkability,
      price_tier: priceTierBand(flavor?.price_tier),
      lat: cen.lat,
      lng: cen.lng,
      blurb: flavor?.character_paragraph ?? n.description,
      verdict,
      counterweight_above,
      counterweight_below,
      best_trades: best_trades.length ? best_trades : undefined,
      demographics: flavor?.demographic_skew ? [flavor.demographic_skew] : undefined,
      // real destination for the CTA + back link (the district overview page).
      cell_href: `/${city.iso2.toLowerCase()}/${citySlug}/${n.slug}`,
      // OMITTED (no honest source): footfall, locals_know, prime_streets, walk_score,
      // cell_count, headline_trade, xy. Left undefined so the body renders nothing there.
    };
  });

  // best (highest keep) + loud (highest revenue), resolved the SAME way the masthead
  // does (stable sort over the same array), so the derived notes match what it shows.
  const byKeep = [...districts].sort(
    (a, b) => keepOf(b.rev_vs_city_pct, b.rent_mult) - keepOf(a.rev_vs_city_pct, a.rent_mult),
  );
  const byRev = [...districts].sort((a, b) => b.rev_vs_city_pct - a.rev_vs_city_pct);
  const best = byKeep[0];
  const loud = byRev[0];
  const loudKeep = keepOf(loud.rev_vs_city_pct, loud.rent_mult);

  const meta = {
    iso2: city.iso2,
    city: city.name,
    slug: citySlug,
    country_name: countryName,
    default_slug: best.slug,
    // real hrefs (the promoted page must not link to the dev routes).
    city_href: `/cities/${citySlug}`,
    // honest, derived masthead prose (the hardcoded seed copy assumed a story the real
    // data does not tell): the hero keeps most on light rent, the loud one gives its
    // lift back. Works whether the loud district lands above or below the baseline.
    hero_note: `Rent here runs x${best.rent_mult.toFixed(2)} the city rate, light enough against its takings that most of each pound stays. The louder, higher-revenue districts give more of theirs back in rent.`,
    support_label: "Top takings, heavy lease",
    support_note: `It matches the city's top for takings, yet a keep index of ${loudKeep} shows how much a heavier rent load, x${loud.rent_mult.toFixed(2)}, takes back before it reaches the till.`,
    rail: {
      kicker: "Where in the city",
      verdict:
        "The same trade keeps very different money district to district. Rank by what the owner keeps, not by what comes in, then open one to see how the lease changes the answer.",
    },
    map_note:
      "Where each district sits. Tap a pin for its keep read; the ranking and the panel move with it.",
    compare: {
      kicker: "Hold two or three side by side",
      verdict:
        "Line them up and it is rent, not revenue, that sets the order. Two districts can take the same and keep very different money.",
    },
    myth: {
      claim: "The busiest, highest-revenue district is the best place to open.",
      reality:
        "It takes the most, but takings are not what stays. Top revenue comes with the heaviest rent, and after the lease a loud district can keep no more than an average one while a quieter, lighter-rent district keeps far more. Revenue rank and keep rank are simply not the same list.",
      tell: "Two addresses with the same takings can keep very different money. The lease is the difference.",
      slope_note:
        "Revenue rank and keep rank are different lists. The priciest addresses give most of their lift back and stall near the city line, while lighter-rent districts climb.",
    },
    provenance_line:
      "Revenue is shown for a representative restaurant, modeled from each district's commuter, visitor and character multipliers against the city baseline; the keep index divides that lift by the district's rent load. The map uses the seven broad London districts.",
  };

  return { meta, districts };
}
