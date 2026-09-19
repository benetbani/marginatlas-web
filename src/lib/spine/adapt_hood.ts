/**
 * src/lib/spine/adapt_hood.ts , the NEIGHBOURHOOD-hub real-data adapter (Phase B).
 *
 * Promotes the neighbourhood-hub spine surface (SpineHoodBody) from its
 * illustrative 9-district London seed to real data behind the per-page spine
 * gate (isSpineReformEnabledFor("hood")). Server only, pure of the network but
 * for `buildCityActivities` (the database, budgeted): awaited from the RSC
 * routes src/app/(site)/cities/[slug]/neighborhoods/page.tsx and its
 * [district] route under it.
 *
 * WHAT THE SEED CARRIES SINCE PLAN STEP 35 (2026-09-19, MODEL.md 8.8): `meta`
 * (the city's iso2, name, slug, country name and page href) and `districts`
 * (name, slug, the engine's rent multiple and revenue reading with its clip
 * flag, the district's `best_trades`). THE BODY READS `meta.slug` AND NOTHING
 * ELSE: every card is built by the slug off the files through
 * src/lib/spine/hood_scheme.ts and the hood_*_rows.ts builders, pure and
 * synchronous, so the stories and the copy gates draw the page without this
 * adapter. The admission gate lives in hood_scheme.ts now (`spineHoodDistricts`,
 * with `CENTROIDS`), and this adapter reads it: a city is admitted with four
 * or more curated districts AND an authored centroid, London alone today;
 * every other city returns undefined and the hub route falls through to the
 * legacy page, never a 404.
 *
 * WHAT LEFT WITH THE OLD CARDS (hood-view.tsx names each card): the
 * masthead's hero_note, support_label and support_note (the "x1.20 the city
 * rate" sentences, a multiple of a base drawn nowhere); the explorer's rail,
 * map_note, compare and myth blocks and the districts' verdict, blurb, tags,
 * character (the one-word class, never printed: PART 9 clause 19),
 * walkability (item 66), price_tier, demographics, lat, lng and cell_href;
 * the provenance_line (the take's foot says it now, off the files). Nothing
 * here fed a reader after this step but `meta`.
 *
 * `best_trades` STAYS AS IT WAS, UNREAD (the controller's ruling d): the
 * per-district lists off `getNeighborhoodMultiplier` for the city's real
 * trades, which the engine resolves at its boundary since 2026-09-17
 * (bug:district-revenue-dead is the QUEUE row; do not fix it here). They are
 * not printed: `04 works` stands as the drawn blocked seat on
 * DATA-REQUIREMENTS item 70, because the engine's district coefficients are
 * within 30 percent of the measured turnover on 4 of 21 London rows, and
 * three of the seven districts read the 3.0 ceiling on every trade
 * ("at least +200%"), a bound printed as a finding. Measured 2026-09-19: the
 * lists are NOT empty on any of the seven (the step's brief said they were;
 * the boundary fix of 2026-09-17 reached this call site), which changes
 * nothing about the seat.
 *
 * The benchmark activity is "restaurants" (the exact activity the legacy
 * neighbourhoods page hardcodes, page.tsx), so the revenue reading reconciles
 * with it; the hub's one trade door (close_rows.ts) opens on that trade.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import { getNeighborhoodMultiplier, rentMultiplier } from "@/lib/economics/neighborhood_multipliers";
import { buildCityActivities } from "@/lib/scores/city_board";
import { hoodCity, spineHoodDistricts, hoodHubHref, HOOD_BENCHMARK_TRADE } from "@/lib/spine/hood_scheme";

/** The benchmark activity the legacy neighbourhoods page uses (page.tsx), so the revenue reading reconciles with it; held in hood_scheme.ts beside the door that opens on it. */
export const BENCHMARK_ACTIVITY = HOOD_BENCHMARK_TRADE.slug;

/**
 * Build the real-data spine neighbourhood seed for one city slug. Returns
 * undefined when the city is not admitted (hood_scheme.ts: no authored
 * centroids, or fewer than four curated districts), so the caller falls
 * through to the legacy neighbourhoods page. London is the one such city today.
 */
export async function buildSpineHoodSeed(citySlug: string): Promise<any> {
  const city = hoodCity(citySlug);
  const curated = spineHoodDistricts(citySlug);
  if (!city || !curated) return undefined;

  // The real city trade set, used to rank each district's best-suited trades. One
  // budgeted call, reused across the districts; capped so the per-district ranking loop
  // stays cheap. Reconciles with the /cities/[slug] leaderboard (same accessor).
  const activities = await buildCityActivities({ slug: city.slug, countryIso2: city.iso2 });
  const activitySlugs = activities.filter((a) => a.slug && a.name).slice(0, 24);

  const districts = curated.map((n) => {
    const m = getNeighborhoodMultiplier(city.slug, n.slug, BENCHMARK_ACTIVITY);
    const rent = +rentMultiplier(m.appliedTags).toFixed(2);
    const rev = Math.round((m.final - 1) * 100);

    // Best trades: the real city trades that actually lift in THIS district, ranked by
    // that lift. Only trades with a real positive lift qualify; a trade the engine has
    // no model for is dropped by its tag, not by the accident of a 0 lift.
    /* a.slug is the HYPHENATED url slug (cafes-coffee-shops); the engine's tables
       are keyed by underscore id and it resolves either at its boundary since
       2026-09-17 (bug:district-revenue-dead). */
    const best_trades = activitySlugs
      .map((a) => {
        const t = getNeighborhoodMultiplier(city.slug, n.slug, a.slug);
        return { name: a.name, known: t.activityKnown, clipped: t.clipped, pct: Math.round((t.final - 1) * 100) };
      })
      .filter((t) => t.known && t.pct > 0)
      .sort((x, y) => y.pct - x.pct)
      .slice(0, 3)
      .map((t) => ({
        name: t.name,
        /* "at least" when the multiplier is the engine's 3.0 ceiling rather than
           a reading: three trades in the City of London all sit on it. */
        why: `Revenue runs ${t.clipped ? "at least" : "about"} +${t.pct}% versus the city for this trade here.`,
      }));

    return {
      name: n.name,
      slug: n.slug,
      rent_mult: rent,
      rev_vs_city_pct: rev,
      rev_clipped: m.clipped,
      best_trades: best_trades.length ? best_trades : undefined,
    };
  });

  const meta = {
    iso2: city.iso2,
    city: city.name,
    slug: city.slug,
    country_name: city.countryName,
    city_href: `/cities/${city.slug}`,
    hub_href: hoodHubHref(city.slug),
  };

  return { meta, districts };
}
