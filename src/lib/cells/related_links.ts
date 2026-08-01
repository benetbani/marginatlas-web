/**
 * src/lib/cells/related_links.ts
 *
 * THE ONWARD MOVES FROM ONE TRADE PAGE.
 *
 * A trade page is one cell of a lattice: one activity, one place. The four
 * moves a reader of it actually has are sideways along each axis and up:
 *
 *   1. the same trade in other places,
 *   2. other trades in this place,
 *   3. this place's own page,
 *   4. this country.
 *
 * All four already exist as published pages, and until this module the trade
 * page linked none of them from its body: measured 2026-08-01, six literal
 * hrefs on a 1,200-line page, twenty-seven of thirty outbound links coming from
 * the masthead and footer.
 *
 * ---------------------------------------------------------------------------
 * WHY EVERY LINK IS RESOLVED AND NOT CONSTRUCTED
 *
 * This site answers HTTP 200 for a wrong URL. getCellBySlug synthesizes a cell
 * when the lookup chain misses, so a trade page for a place that holds no data
 * still renders rather than 404s. A broken internal link therefore does not
 * announce itself: nothing errors, nothing logs, the crawler just spends budget
 * on a page nobody can use.
 *
 * So no URL here is assembled from a slug pattern and hoped over. Every
 * candidate starts life as a ROW that exists, and is then run backwards through
 * the exact resolver the destination route will use. A link is emitted only
 * when that round trip lands on the same row we started from:
 *
 *   regional destinations  regionalSlugToGeoId(country, geoSlug) === row.geo_id
 *                          AND industryQueryCandidates(tradeSlug) contains
 *                          row.industry_id
 *                          (these two are literally the .eq and .in that
 *                          getRegionalCell runs, so a match is proof the
 *                          destination query finds this row)
 *   US state destinations  SLUG_TO_GEO_ID[geoSlug] === row.geo_id
 *                          AND slugToIndustry(tradeSlug).id === row.industry_id
 *   this place's page      the geo slug is in the city list that
 *                          /cities/[slug] checks before notFound(), or in the
 *                          region list that /[country]/[geo] checks before
 *                          notFound()
 *   this country           the iso2 is in COUNTRIES, which /[country] checks
 *                          before notFound()
 *
 * On top of the round trip a candidate must also clear the triage suppression
 * list (a suppressed cell makes getRegionalCell return null, which is how a
 * trade page falls through to a country aggregate) and the thin-page list the
 * sitemap already refuses to advertise. This follows the link-gate precedent
 * set on the country pages in June, where 291 broken opening links were fixed
 * by setting a per-row href only for rows that resolve cleanly.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import { withBudget } from "@/lib/cells";
import { supabaseAdmin } from "@/lib/supabase";
import {
  SLUG_TO_GEO_ID,
  geoNameFromSlug,
  regionalSlugToGeoId,
  slugify,
} from "@/lib/cells/geo";
import { industryQueryCandidates } from "@/lib/cells/industry_resolution";
import { isCellSuppressed } from "@/lib/cells/triage";
import { isPathSuppressed } from "@/lib/quality/thin_pages";
import {
  COUNTRIES,
  INDUSTRY_BY_ID,
  industryToSlug,
  isDefaultVisible,
  slugToIndustry,
} from "@/lib/taxonomy";
import { getRegionsForCountry } from "@/lib/regions/regions-by-country";
import { CITY_FRIENDLY_TO_GEO_ID } from "@/lib/cities/city_aliases_generated";
import { MANUAL_FRIENDLY_TO_GEO_ID } from "@/lib/cities/manual_city_aliases";
import cityListJson from "../../../data/cities/city_list_v1.json";
import type { Cell } from "@/lib/cells";

/** One onward move. Label and destination, and deliberately nothing else. */
export type RelatedLink = {
  label: string;
  href: string;
};

export type CellRelatedLinks = {
  /** Same trade, other places. Empty when no sibling place resolves. */
  sameTradeElsewhere: RelatedLink[];
  /** Same place, other trades. Empty when no sibling trade resolves. */
  otherTradesHere: RelatedLink[];
  /** This place's own page, then this country. Either may be absent. */
  wider: RelatedLink[];
  /** Display name of the trade this page is about, for the headings. */
  tradeName: string;
  /** Display name of the place this page is about, for the headings. */
  placeName: string;
  /** True when at least one link resolved, so the caller can omit the block. */
  any: boolean;
};

/**
 * THE CAP: six links per list category, twelve in the two lists together.
 *
 * Not a round number picked for looks. Six is what the page already fetches for
 * its other-trades read (getComparableCells is called with a limit of 6), so
 * matching it keeps one number in the page rather than two. It fills exactly two
 * rows of the three-column grid at desktop width with no ragged tail, and it
 * keeps the whole tail near a dozen onward links: enough that the sideways move
 * is genuinely available, few enough that no single link is diluted into
 * meaninglessness the way a fifty-link footer farm dilutes every one of its
 * links. If this is ever raised, raise it because a measurement says readers
 * exhaust six, not because more felt better.
 */
const PER_CATEGORY_CAP = 6;

/**
 * Rows to pull before filtering. Every candidate is dropped if it fails the
 * round trip, is suppressed, or has no taxonomy entry, and a place or trade can
 * appear many times over (one row per year and size band), so the fetch has to
 * be a good deal wider than the cap. Bounded so the query stays cheap.
 */
const FETCH_WIDTH = 120;

type CityEntry = { slug: string; name: string; iso2: string };
const CITIES = (cityListJson as { cities: CityEntry[] }).cities;
const CITY_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

/** The minimum a sibling row has to carry to become a link. */
type SiblingRow = {
  country: string;
  geo_id: string;
  geo_name: string | null;
  industry_id: string | null;
  coverage_tier: string | null;
  geo_level: string | null;
  n_enterprises: number | null;
};

export type CellSiblingRows = {
  sameTradeElsewhere: SiblingRow[];
  otherTradesHere: SiblingRow[];
};

const NO_SIBLINGS: CellSiblingRows = {
  sameTradeElsewhere: [],
  otherTradesHere: [],
};

const REGIONAL_COLUMNS =
  "country, geo_id, geo_name, geo_level, industry_id, coverage_tier, n_enterprises";

/**
 * Is this URL a US state page? Decided from the URL rather than from the
 * resolved cell on purpose: the destination route branches on exactly this
 * lookup, so branching on anything else would be guessing about a different
 * question than the one the router asks.
 */
function isUsStateSlug(countrySlug: string, geoSlug: string): boolean {
  return (
    countrySlug.toLowerCase() === "us" &&
    SLUG_TO_GEO_ID[geoSlug.toLowerCase()] != null
  );
}

/**
 * The sibling ROWS around this URL, straight from the table the destination
 * route reads. Runs two narrow queries for a sub-national place and none at all
 * for a US state page, whose siblings the trade page already fetches from
 * cells_master and hands to buildCellRelatedLinks below.
 *
 * Safe to drop into the page's existing concurrent fan-out: it depends on
 * nothing else in it, and each query is budget-wrapped so a slow one degrades
 * this block to fewer links rather than holding the page.
 */
export async function fetchCellSiblings(
  countrySlug: string,
  geoSlug: string,
  industrySlug: string,
): Promise<CellSiblingRows> {
  const country = countrySlug.toUpperCase();
  if (isUsStateSlug(countrySlug, geoSlug)) return NO_SIBLINGS;

  const candidates = industryQueryCandidates(industrySlug);
  if (candidates.length === 0) return NO_SIBLINGS;
  const geoId = regionalSlugToGeoId(country, geoSlug);
  if (!geoId) return NO_SIBLINGS;

  const [elsewhere, here] = await Promise.all([
    withBudget(
      (async () => {
        const { data, error } = await supabaseAdmin
          .from("regional_cells")
          .select(REGIONAL_COLUMNS)
          .eq("country", country)
          .in("industry_id", candidates)
          .neq("geo_id", geoId)
          .order("n_enterprises", { ascending: false, nullsFirst: false })
          .limit(FETCH_WIDTH);
        if (error || !data) return [];
        // Rank the way getRegionalCell ranks: a place that holds the exact
        // activity comes before one that only holds the measured parent, and
        // within each, the busier place first. Sort is stable, so the firm-count
        // order the query returned survives inside each group.
        const rank = (id: string | null) => {
          const i = id ? candidates.indexOf(id) : -1;
          return i === -1 ? candidates.length : i;
        };
        return (data as unknown as SiblingRow[])
          .slice()
          .sort((a, b) => rank(a.industry_id) - rank(b.industry_id));
      })(),
      [] as SiblingRow[],
      4_000,
      `related:sameTrade:${country}/${industrySlug}`,
    ),
    withBudget(
      (async () => {
        const { data, error } = await supabaseAdmin
          .from("regional_cells")
          .select(REGIONAL_COLUMNS)
          .eq("country", country)
          .eq("geo_id", geoId)
          .order("n_enterprises", { ascending: false, nullsFirst: false })
          .limit(FETCH_WIDTH);
        if (error || !data) return [];
        return (data as unknown as SiblingRow[]).filter(
          (r) => r.industry_id != null && !candidates.includes(r.industry_id),
        );
      })(),
      [] as SiblingRow[],
      4_000,
      `related:otherTrades:${country}/${geoSlug}`,
    ),
  ]);

  return { sameTradeElsewhere: elsewhere, otherTradesHere: here };
}

/** The taxonomy id a row's industry maps to, or null when it maps to nothing. */
function taxonomyIdOf(industryId: string | null | undefined): string | null {
  if (!industryId) return null;
  if (INDUSTRY_BY_ID[industryId]) return industryId;
  // A legacy DB id resolves through the crosswalk the query layer already owns:
  // the slug it produces has to name this row back, which the caller checks.
  const slug = industryToSlug(industryId);
  const back = slug ? slugToIndustry(slug) : null;
  return back?.id ?? null;
}

/**
 * The trade segment for a row, or null when no slug names this exact row back.
 * `expectRowId` is the id as the DB holds it, which for a legacy row is not the
 * taxonomy id, so the round trip is checked against the query layer's candidate
 * set rather than against string equality alone.
 */
function tradeSegment(
  rowIndustryId: string | null,
  regional: boolean,
): { slug: string; name: string } | null {
  const taxId = taxonomyIdOf(rowIndustryId);
  if (!taxId || !rowIndustryId) return null;
  const ind = INDUSTRY_BY_ID[taxId];
  if (!ind || !ind.name) return null;
  const slug = industryToSlug(taxId);
  if (!slug) return null;
  if (regional) {
    // getRegionalCell selects on industryQueryCandidates(slug); if this row's id
    // is not in that set the destination query cannot return this row.
    if (!industryQueryCandidates(slug).includes(rowIndustryId)) return null;
  } else if (slugToIndustry(slug)?.id !== rowIndustryId) {
    return null;
  }
  return { slug, name: ind.name };
}

/** Reverse alias tables, built once: geo_id (as stored) to friendly slug. */
const FRIENDLY_SLUG_BY_GEO_ID = new Map<string, string>();
for (const [iso2, table] of Object.entries(MANUAL_FRIENDLY_TO_GEO_ID)) {
  for (const [slug, geoId] of Object.entries(table)) {
    FRIENDLY_SLUG_BY_GEO_ID.set(`${iso2.toUpperCase()}|${geoId.toUpperCase()}`, slug);
  }
}
for (const [iso2, table] of Object.entries(CITY_FRIENDLY_TO_GEO_ID)) {
  for (const [slug, geoId] of Object.entries(table)) {
    const key = `${iso2.toUpperCase()}|${geoId.toUpperCase()}`;
    if (!FRIENDLY_SLUG_BY_GEO_ID.has(key)) FRIENDLY_SLUG_BY_GEO_ID.set(key, slug);
  }
}

/**
 * The place segment for a sub-national row: the prettiest slug that provably
 * resolves back to THIS geo_id, or null when none does. Friendly name first
 * because that is the URL the rest of the site links, then the geo id form the
 * sitemap already advertises, which round-trips by construction.
 */
function regionalPlaceSegment(country: string, geoId: string): string | null {
  const friendly = FRIENDLY_SLUG_BY_GEO_ID.get(
    `${country.toUpperCase()}|${geoId.toUpperCase()}`,
  );
  const tries = [friendly, geoId.toLowerCase()].filter(
    (s): s is string => typeof s === "string" && s.length > 0,
  );
  for (const slug of tries) {
    if (regionalSlugToGeoId(country, slug) === geoId) return slug;
  }
  return null;
}

/**
 * What the destination page will CALL this place. The cell lookup overrides a
 * row's stored geo_name with geoNameFromSlug for whatever slug the URL used, so
 * reading the same function here is what keeps a link's text and the heading it
 * opens from disagreeing: /us/chicago is titled "Chicago", not the stored
 * "Cook County, Illinois", and /es/seville is "Seville", not "Sevilla".
 */
function displayPlaceName(
  country: string,
  placeSlug: string,
  stored: string | null,
): string | null {
  return geoNameFromSlug(country, placeSlug) || stored || null;
}

/** The place segment for a US state row, or null when the slug does not name it. */
function usStatePlaceSegment(geoName: string | null, geoId: string): string | null {
  const slug = slugify(geoName);
  if (!slug) return null;
  return SLUG_TO_GEO_ID[slug] === geoId ? slug : null;
}

/** Emit a trade-page path only if every gate passes. */
function verifiedTradePath(args: {
  country: string;
  placeSlug: string | null;
  tradeSlug: string | null;
  geoId: string;
  rowIndustryId: string | null;
}): string | null {
  const { country, placeSlug, tradeSlug, geoId, rowIndustryId } = args;
  if (!placeSlug || !tradeSlug || !rowIndustryId) return null;
  if (isCellSuppressed(country, geoId, rowIndustryId)) return null;
  const path = `/${country.toLowerCase()}/${placeSlug}/${tradeSlug}`;
  if (isPathSuppressed(path)) return null;
  return path;
}

/** This place's own page: the city page when there is one, else the region page. */
function placePagePath(
  countrySlug: string,
  geoSlug: string,
): RelatedLink | null {
  const iso2 = countrySlug.toUpperCase();
  const meta = COUNTRIES.find((c) => c.code === iso2);
  if (!meta) return null;
  const slug = geoSlug.toLowerCase();

  // /cities/[slug] resolves against the city list and notFound()s otherwise, so
  // membership in that list is the whole test. A trade page reached by the geo
  // id form of the URL gets the same city page as the same place reached by its
  // friendly name, via the reverse alias table.
  const aliasSlug = FRIENDLY_SLUG_BY_GEO_ID.get(
    `${iso2}|${regionalSlugToGeoId(iso2, slug).toUpperCase()}`,
  );
  for (const candidate of [slug, aliasSlug]) {
    if (!candidate) continue;
    const city = CITY_BY_SLUG.get(candidate);
    if (city && city.iso2.toUpperCase() === iso2) {
      return { label: `All trades in ${city.name}`, href: `/cities/${candidate}` };
    }
  }

  // /[country]/[geo] resolves against the same region list, and 404s for a city
  // slug, which is why a city has to be tried first.
  const region = getRegionsForCountry(iso2, meta.name).find(
    (r) => r.value === slug,
  );
  if (region) {
    return {
      label: `All trades in ${region.label}`,
      href: `/${iso2.toLowerCase()}/${slug}`,
    };
  }
  return null;
}

/**
 * This country's page. The label is the bare country name: a sentence around it
 * would need an article ("the United Kingdom", "the Netherlands", "Spain"), and
 * getting that right for 195 names is a vocabulary table this block does not
 * need. The heading above the link supplies the rest of the sentence.
 */
function countryPagePath(countrySlug: string): RelatedLink | null {
  const iso2 = countrySlug.toUpperCase();
  const meta = COUNTRIES.find((c) => c.code === iso2);
  if (!meta) return null;
  return { label: meta.name, href: `/${iso2.toLowerCase()}` };
}

/**
 * Compose the four onward moves. Pure: every row it reads was fetched by the
 * caller, so this can be unit-run and reasoned about without a database.
 *
 * `usSameTradeRows` and `usOtherTradeRows` are the cells_master reads the trade
 * page already performs for a US state (same trade across states, other trades
 * in the state). They are ignored on any other kind of page.
 */
export function buildCellRelatedLinks(input: {
  cell: Cell;
  countrySlug: string;
  geoSlug: string;
  industrySlug: string;
  tradeName: string;
  placeName: string;
  siblings: CellSiblingRows;
  usSameTradeRows?: Cell[];
  usOtherTradeRows?: Cell[];
}): CellRelatedLinks {
  const {
    countrySlug,
    geoSlug,
    industrySlug,
    tradeName,
    placeName,
    siblings,
    usSameTradeRows = [],
    usOtherTradeRows = [],
  } = input;
  const country = countrySlug.toUpperCase();
  const usState = isUsStateSlug(countrySlug, geoSlug);
  const selfPath = `/${countrySlug.toLowerCase()}/${geoSlug.toLowerCase()}/${industrySlug.toLowerCase()}`;
  const currentTrade = industryQueryCandidates(industrySlug);

  const seen = new Set<string>([selfPath]);
  const take = (out: RelatedLink[], link: RelatedLink | null) => {
    if (!link || seen.has(link.href) || out.length >= PER_CATEGORY_CAP) return;
    seen.add(link.href);
    out.push(link);
  };

  /* -- 1. the same trade, other places --------------------------------------
   *
   * THE ONE THING THAT MATTERS HERE: the link text and the page it opens must
   * agree. A first cut of this block put the row's activity in the URL and the
   * page's activity in the label, and a hair-salons page produced six links that
   * read "Hair salons in Westminster" and opened cleaning services. So each
   * branch below takes BOTH the label and the URL's trade segment from the same
   * place, and the two branches differ because the two routes name a page
   * differently:
   *
   *   sub-national  the destination's heading is decided by the URL SLUG alone
   *                 (resolveDisplayIndustry), whatever row ends up backing it:
   *                 /gb/leeds/hair-salons reads "Hair salons (full service) in
   *                 Leeds" even where the backing row is the parent activity.
   *                 So the slug and the name are carried over from this page,
   *                 and the sibling row's only job is to prove that the
   *                 destination's own query finds something there.
   *   US state      the destination's heading is decided by the ROW that wins
   *                 pickMatchingRow, so the label and the slug both come from
   *                 the row, and a row that does not name this exact activity
   *                 back is dropped.
   */
  const sameTradeElsewhere: RelatedLink[] = [];
  const placesUsed = new Set<string>();

  if (usState) {
    const thisTradeTaxId = slugToIndustry(industrySlug)?.id ?? null;
    for (const row of usSameTradeRows) {
      if (sameTradeElsewhere.length >= PER_CATEGORY_CAP) break;
      if (!row.geo_name || placesUsed.has(row.geo_id)) continue;
      const trade = tradeSegment(row.industry_id ?? null, false);
      if (!trade || taxonomyIdOf(row.industry_id ?? null) !== thisTradeTaxId) continue;
      const placeSlug = usStatePlaceSegment(row.geo_name, row.geo_id);
      const href = verifiedTradePath({
        country,
        placeSlug,
        tradeSlug: trade.slug,
        geoId: row.geo_id,
        rowIndustryId: row.industry_id ?? null,
      });
      if (!href || !placeSlug) continue;
      const where = displayPlaceName(country, placeSlug, row.geo_name);
      if (!where) continue;
      // Claim the place only once it has produced a link, so a row that fails a
      // gate does not lock a later row for the same place out of the list.
      placesUsed.add(row.geo_id);
      take(sameTradeElsewhere, { label: `${trade.name} in ${where}`, href });
    }
  } else {
    for (const row of siblings.sameTradeElsewhere) {
      if (sameTradeElsewhere.length >= PER_CATEGORY_CAP) break;
      if (!row.industry_id || !row.geo_name) continue;
      if (placesUsed.has(row.geo_id)) continue;
      if ((row.coverage_tier ?? "").toUpperCase() === "X") continue;
      if (row.geo_level === "country") continue;
      // The row is evidence, not the destination's identity: it proves the
      // .in(industryQueryCandidates) that getRegionalCell will run for THIS
      // page's trade slug returns something at that place.
      if (!currentTrade.includes(row.industry_id)) continue;
      const placeSlug = regionalPlaceSegment(country, row.geo_id);
      const href = verifiedTradePath({
        country,
        placeSlug,
        tradeSlug: industrySlug.toLowerCase(),
        geoId: row.geo_id,
        rowIndustryId: row.industry_id,
      });
      if (!href || !placeSlug) continue;
      const where = displayPlaceName(country, placeSlug, row.geo_name);
      if (!where) continue;
      // Claim the place only once it has produced a link (see the US branch).
      placesUsed.add(row.geo_id);
      take(sameTradeElsewhere, { label: `${tradeName} in ${where}`, href });
    }
  }

  /* -- 2. other trades, this place ------------------------------------------ */
  const otherTradesHere: RelatedLink[] = [];
  const tradesUsed = new Set<string>();
  const pushOtherTrade = (
    rowIndustryId: string | null,
    geoId: string,
    placeSlug: string | null,
    regional: boolean,
  ) => {
    if (otherTradesHere.length >= PER_CATEGORY_CAP) return;
    if (!rowIndustryId || currentTrade.includes(rowIndustryId)) return;
    const trade = tradeSegment(rowIndustryId, regional);
    if (!trade || tradesUsed.has(trade.slug)) return;
    // Solo-professional and non-small-business activities are kept out of
    // discovery everywhere else on the site; a related link is discovery.
    const ind = INDUSTRY_BY_ID[slugToIndustry(trade.slug)?.id ?? ""];
    if (!ind || !isDefaultVisible(ind)) return;
    const href = verifiedTradePath({
      country,
      placeSlug,
      tradeSlug: trade.slug,
      geoId,
      rowIndustryId,
    });
    if (!href) return;
    tradesUsed.add(trade.slug);
    take(otherTradesHere, { label: `${trade.name} in ${placeName}`, href });
  };

  if (usState) {
    for (const row of usOtherTradeRows) {
      pushOtherTrade(
        row.industry_id ?? null,
        row.geo_id,
        usStatePlaceSegment(row.geo_name, row.geo_id),
        false,
      );
    }
  } else {
    for (const row of siblings.otherTradesHere) {
      if ((row.coverage_tier ?? "").toUpperCase() === "X") continue;
      if (row.geo_level === "country") continue;
      pushOtherTrade(
        row.industry_id,
        row.geo_id,
        regionalPlaceSegment(country, row.geo_id),
        true,
      );
    }
  }

  /* -- 3 and 4. the place, then the country --------------------------------- */
  const wider: RelatedLink[] = [];
  const place = placePagePath(countrySlug, geoSlug);
  if (place && !seen.has(place.href)) {
    seen.add(place.href);
    wider.push(place);
  }
  const countryLink = countryPagePath(countrySlug);
  if (countryLink && !seen.has(countryLink.href)) {
    seen.add(countryLink.href);
    wider.push(countryLink);
  }

  return {
    sameTradeElsewhere,
    otherTradesHere,
    wider,
    tradeName,
    placeName,
    any:
      sameTradeElsewhere.length > 0 ||
      otherTradesHere.length > 0 ||
      wider.length > 0,
  };
}
