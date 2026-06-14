/**
 * NeighborhoodOverview component.
 *
 * The per-neighbourhood MICRO-MARKET PROFILE, the neighbourhood-landing page.
 * It does NOT restate the city's numbers: it reads the local economics of THIS
 * district (what the catchment runs on, which trades win or are suppressed
 * here, who shops here, the rent drag, and how it sits against the districts
 * next to it).
 *
 * Rebuilt onto the Atlas Page Kit (2026-06-13): answer-first headline, the
 * honest-take through-line right after it, the trade ranking as the "what
 * thrives here" zone, a "who lives and shops here" beat (renders the
 * loaded-but-previously-unused flavor.demographic_skew), an honest rent /
 * price-tier read that self-omits, an ADJACENT-DISTRICT like-for-like table,
 * then the on-the-ground texture and the sibling rail, with a sticky in-page
 * nav. The eight-section memo wall is folded into three visual zones. London
 * neighbourhoods fill the curated exemplar.
 *
 * Rendered by the cell-or-overview dispatcher at
 * src/app/[country]/[geo]/[industry]/page.tsx. The dispatcher imports
 * findNeighborhoodContext + listSiblingNeighborhoods + NeighborhoodOverview.
 *
 * Server component (no client JS, bar the props-driven StickySectionNav). Reads
 * neighborhoods_v1.json + city_list_v1.json via the cities helpers, the
 * commuter/tourism/anomaly-tag engine, and the flavor + economics loaders.
 * Every section self-omits cleanly when its data is absent.
 */
import Link from "next/link";
import cityListJson from "../../data/cities/city_list_v1.json";
import neighborhoodsJson from "../../data/cities/neighborhoods_v1.json";
import { getNeighborhoodFlavor } from "@/lib/cities/neighborhood_flavor";
import { COUNTRIES, slugToIndustry, industryToSlug } from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";
import { colors } from "@/lib/design-tokens";
import {
  getNeighborhoodMultiplier,
  getNeighborhoodRow,
  rentMultiplier,
  tagLabel,
  type NeighborhoodTag,
} from "@/lib/economics/neighborhood_multipliers";
import { getNeighborhoodEconomics } from "@/lib/economics/neighborhood_economics";
import { fmtUSD } from "@/components/board/format";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { AtlasPictogram } from "@/components/brand/pictograms";
import { industryPictogramId } from "@/lib/brand/industry_pictogram";
import { NeighborhoodCover } from "@/components/cities/NeighborhoodCover";
import {
  AnswerFirstMasthead,
  HeroWash,
  BeatCard,
  HonestTakeBox,
  WhatLocalsKnow,
  BreakEvenLine,
  LikeForLikeTable,
  StickySectionNav,
  SectionEmpty,
  StreetCharacter,
  OneThing,
} from "@/components/kit";
import {
  buildNeighborhoodOverviewView,
  neighborhoodOverviewNav,
  type SiblingArea,
} from "@/lib/cities/neighborhood_overview_view";

type City = { slug: string; name: string; iso2: string; pop_m: number };
export type Neighborhood = {
  slug: string;
  name: string;
  character: string;
  description?: string;
};
type Scheme = { scheme: string; neighborhoods: Neighborhood[] };

const CITIES = (cityListJson as { cities: City[] }).cities;
const NEIGHBORHOODS = (neighborhoodsJson as { cities: Record<string, Scheme> }).cities;

/**
 * Returns the (city, neighborhood) entry if `(country, citySlug,
 * neighborhoodSlug)` matches a known scheme. Returns null otherwise.
 * Used by the cell-page dispatcher to decide whether to render the
 * neighborhood overview or fall through to the cell page.
 */
export function findNeighborhoodContext(
  country: string,
  citySlug: string,
  neighborhoodSlug: string,
): { city: City; nb: Neighborhood } | null {
  const cityEntry = CITIES.find(
    (c) => c.slug === citySlug && c.iso2.toLowerCase() === country.toLowerCase(),
  );
  if (!cityEntry) return null;
  const scheme = NEIGHBORHOODS[citySlug];
  if (!scheme) return null;
  const nb = scheme.neighborhoods.find((n) => n.slug === neighborhoodSlug);
  if (!nb) return null;
  return { city: cityEntry, nb };
}

export function listSiblingNeighborhoods(
  citySlug: string,
  excludeSlug: string,
): Neighborhood[] {
  return (NEIGHBORHOODS[citySlug]?.neighborhoods || []).filter(
    (n) => n.slug !== excludeSlug,
  );
}

// ---------------------------------------------------------------------------
// Representative activity set for the "What thrives here" ranking.
//
// Multiplier activity id (underscores, as the engine expects) -> display name.
// The engine carries betas + tag effects under these ids. The cell link needs
// the TAXONOMY slug; most of these ids ARE taxonomy industry ids, but two
// differ and are aliased below.
// ---------------------------------------------------------------------------

const REP_ACTIVITIES: Array<{ id: string; name: string }> = [
  { id: "restaurants", name: "Restaurants" },
  { id: "cafes_coffee", name: "Cafes" },
  { id: "bars_nightclubs", name: "Bars and nightlife" },
  { id: "hotels_lodging", name: "Hotels" },
  { id: "pharmacies_drug_stores", name: "Pharmacies" },
  { id: "grocery_stores", name: "Grocery" },
  { id: "fitness_gyms", name: "Gyms" },
  { id: "hair_salons_full", name: "Hair salons" },
  { id: "legal_services", name: "Legal services" },
  { id: "accounting_tax", name: "Accounting" },
  { id: "software_development", name: "Software" },
  { id: "auto_repair_shops", name: "Auto repair" },
];

// Character-defining trades to surface FIRST for a tagged district, so the
// answer-first headline crowns a trade the district actually rewards, not a
// generic SMB winner lifted only by footfall (a luxury street's strongest trade
// is jewelry or a spa, not a tourism-lifted pharmacy). These ids carry the tag
// multipliers in the neighborhood-multiplier engine, so they rank on top for
// their tag; the generic set then fills out the rest of the ranking. Only the
// two tags whose reward set is sharply distinct from the generic SMB set are
// special-cased; every other tag (and an untagged district) keeps the generic
// set unchanged.
const TAG_LEAD_ACTIVITIES: Partial<Record<NeighborhoodTag, Array<{ id: string; name: string }>>> = {
  luxury_district: [
    { id: "jewelry_stores", name: "Jewelry" },
    { id: "designer_fashion", name: "Designer fashion" },
    { id: "day_spas", name: "Day spas" },
    { id: "boutique_clothing", name: "Boutique clothing" },
  ],
  university_district: [
    { id: "cafes_coffee", name: "Cafes" },
    { id: "bars_nightclubs", name: "Bars and nightlife" },
    { id: "bookstores_indie", name: "Bookshops" },
  ],
};

/**
 * The representative activity set for the "what thrives here" ranking, made
 * tag-aware. For a district whose primary tag rewards a sharply different trade
 * mix than the generic SMB set (a luxury district, a university district), the
 * character-defining trades are prepended so the headline winner is one of
 * them; the generic set follows, de-duplicated by id. For every other tag and
 * for an untagged district the generic set is returned unchanged.
 */
function repActivitiesForTag(
  primaryTag: NeighborhoodTag | undefined,
): Array<{ id: string; name: string }> {
  const lead = primaryTag ? TAG_LEAD_ACTIVITIES[primaryTag] : undefined;
  if (!lead) return REP_ACTIVITIES;
  const seen = new Set(lead.map((a) => a.id));
  return [...lead, ...REP_ACTIVITIES.filter((a) => !seen.has(a.id))];
}

// The representative activity for the headline breakdown and the adjacent-area
// comparison. Restaurants is the most universal SMB benchmark.
const REP_ACTIVITY_ID = "restaurants";
const REP_ACTIVITY_NAME = "Restaurant";

const ACTIVITY_CELL_SLUG_ALIAS: Record<string, string> = {
  pharmacies_drug_stores: "pharmacies-health-stores",
  fitness_gyms: "sports-fitness",
};

/**
 * Resolve a multiplier activity id to a real taxonomy CELL slug, or null if it
 * does not resolve (so the row can render unlinked rather than as a broken
 * link). Tries the explicit alias, the canonical slug from the activity id as
 * an industry id, then the dashed id, round-tripping each through slugToIndustry.
 */
function resolveActivityCellSlug(activityId: string): string | null {
  const candidates: string[] = [];
  if (ACTIVITY_CELL_SLUG_ALIAS[activityId]) candidates.push(ACTIVITY_CELL_SLUG_ALIAS[activityId]);
  candidates.push(industryToSlug(activityId));
  candidates.push(activityId.replace(/_/g, "-"));
  for (const c of candidates) {
    if (!c) continue;
    const ind = slugToIndustry(c);
    if (ind) return industryToSlug(ind.id);
  }
  return null;
}

/** Whole-percent vs-city label for a final multiplier (e.g. "+180%", "-60%", "par"). */
function pctLabel(final: number): string {
  const pct = Math.round((final - 1) * 100);
  if (pct === 0) return "par";
  // The multiplier is clamped to about 0.4x..3.0x, so strong trades pin to the
  // +200% ceiling. Show an honest band at the rails rather than a wall of
  // identical false-precise "+200%" figures. Mirrors the view-model helper.
  if (pct >= 195) return "2x or more";
  if (pct <= -58) return "less than half";
  return `${pct > 0 ? "+" : ""}${pct}%`;
}

/**
 * Brand-token color for a multiplier figure: moss for a clear premium (>1.1),
 * a neutral warm cocoa near par, clay for a clear suppression (<0.9). Token
 * references only (no raw hex), mirroring the neighborhoods hub treatment.
 */
function multColor(final: number): string {
  if (final > 1.1) return colors.moss[700];
  if (final < 0.9) return colors.clay[600];
  return colors.cocoa[700];
}

export function NeighborhoodOverview({
  country,
  city,
  nb,
}: {
  country: string;
  city: City;
  nb: Neighborhood;
}) {
  const countryName = COUNTRIES.find((c) => c.code === city.iso2)?.name || city.iso2;
  const flavor = getNeighborhoodFlavor(city.slug, nb.slug);
  const siblings = listSiblingNeighborhoods(city.slug, nb.slug);
  const cc = country.toLowerCase();

  // Prime commercial streets + per-street spend for THIS neighborhood. Null
  // until the pipeline fills the pair; the streets zone self-omits.
  const economics = getNeighborhoodEconomics(city.slug, nb.slug);
  const primeStreets = economics?.prime_streets ?? [];

  // The local-economics row: primary tag, anomaly tags, intensities. Null for a
  // neighborhood not yet curated (then the engine falls back to city defaults).
  const row = getNeighborhoodRow(city.slug, nb.slug);
  const tags = row?.tags ?? [];
  const primaryTag = row?.primary_tag;

  // The trade ranking, built ONCE: feeds the headline winner, the "what thrives
  // here" zone, and the view model. Sorted by final multiplier descending. The
  // activity set is tag-aware, so a tagged district (luxury, university) leads
  // with the trades it actually rewards rather than a generic SMB winner.
  const ranked = repActivitiesForTag(primaryTag).map((a) => {
    const m = getNeighborhoodMultiplier(city.slug, nb.slug, a.id);
    return {
      id: a.id,
      name: a.name,
      final: m.final,
      cellSlug: resolveActivityCellSlug(a.id),
    };
  }).sort((x, y) => y.final - x.final);

  // The masthead's non-money anchor stat: the top trade's lift versus the city.
  // This page has only relative figures (no absolute money), so the strongest
  // trade's lift rides as a labeled stat. Self-omits (null) at par, so the
  // masthead drops it cleanly rather than printing a hollow "par".
  const topTrade = ranked[0];
  const topTradeLiftLabel =
    topTrade && Math.round((topTrade.final - 1) * 100) !== 0
      ? pctLabel(topTrade.final)
      : null;

  // Economic-character tags for the role-chip row (the masthead break-in chip
  // already carries the "what kind of place" character, so these are scoped to
  // the economic tags only). Residential-only is implicit, not a chip.
  const visibleTags = tags.filter((t) => t !== "residential_only").slice(0, 3);

  // Representative-activity component breakdown for the demand drivers + table.
  const rep = getNeighborhoodMultiplier(city.slug, nb.slug, REP_ACTIVITY_ID);

  // Composed rent drag from the tag set (1.0 when neutral / unknown).
  const rentMult = rentMultiplier(tags);

  // Sibling districts, each with their own representative-trade lift, for the
  // adjacent-district comparison (the big gap). Only curated siblings carry a
  // lift; uncurated ones come through with repFinal null and the view drops them.
  const siblingAreas: SiblingArea[] = siblings.map((s) => {
    const srow = getNeighborhoodRow(city.slug, s.slug);
    return {
      slug: s.slug,
      name: s.name,
      character: s.character,
      repFinal: srow
        ? getNeighborhoodMultiplier(city.slug, s.slug, REP_ACTIVITY_ID).final
        : null,
      primaryTag: (srow?.primary_tag as NeighborhoodTag | null) ?? null,
    };
  });

  // The pure view model: answer-first headline, the honest take, who-shops-here,
  // the rent read, and the adjacent-district table.
  const view = buildNeighborhoodOverviewView({
    cityName: city.name,
    neighborhoodName: nb.name,
    ranked,
    rep,
    repName: REP_ACTIVITY_NAME,
    flavor,
    primaryTag,
    rentMult,
    siblings: siblingAreas,
    isCurated: !!row,
  });

  const hasTexture = !!(flavor?.food_scene || flavor?.dont_miss);
  const navSections = neighborhoodOverviewNav(
    view,
    primeStreets.length > 0,
    hasTexture,
  );

  return (
    <div className="xl:flex xl:gap-16">
      <article className="xl:flex-1 xl:min-w-0 max-w-5xl mx-auto px-4 md:px-6 pt-2 md:pt-4 pb-16">
        {/* Cover banner: an honest designed placeholder (gradient + engraved
            street grid), not a photo of the place. */}
        <NeighborhoodCover
          name={nb.name}
          seed={`${city.slug}-${nb.slug}`}
          className="h-28 md:h-40 rounded-2xl mb-5"
        />

        {/* ZONE 1: ANSWER-FIRST MASTHEAD ---------------------------------
            Composed from the SHARED AnswerFirstMasthead every other page type
            opens with (cell / country / city / industry), so the neighbourhood
            page reads identically. The winner headline is the answer-first line;
            the neighbourhood name is the H1 title; the coordinate links sit in
            the eyebrow; the character is the demoted break-in chip; and the
            top-trade lift rides as a labeled NON-money stat (this page carries
            only relative "+X% vs city" figures, no absolute money anchor, which
            is acceptable). The differentiated role chips (price tier, tags) sit
            just under the band so the reader can tell them apart. */}
        <HeroWash category="city">
        <AnswerFirstMasthead
          id="headline"
          eyebrow={
            <span className="inline-flex flex-wrap items-center gap-2">
              <Link
                href={`/cities/${city.slug}`}
                className="transition-colors hover:text-atlas-700"
              >
                {city.name}
              </Link>
              <span aria-hidden>·</span>
              <CountryFlag iso2={city.iso2} className="w-4" />
              <span>{countryName}</span>
              <span aria-hidden>·</span>
              <Link
                href={`/cities/${city.slug}/neighborhoods`}
                className="transition-colors hover:text-atlas-700"
              >
                all neighbourhoods
              </Link>
            </span>
          }
          title={nb.name}
          answer={view.winnerHeadline ?? view.leadLine}
          breakIn={nb.character.replace(/-/g, " ")}
          stats={[
            {
              label: `Top trade lift vs ${city.name}`,
              value: topTradeLiftLabel,
            },
          ]}
        />

        {/* The character paragraph sits below the band when the winner headline
            has already taken the answer slot, so the lead line is never lost. */}
        {view.winnerHeadline && view.leadLine && (
          <p className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-cocoa-700">
            {view.leadLine}
          </p>
        )}

        {/* DIFFERENTIATED ROLE CHIPS: the price tier (how pricey) reads as a
            tinted, captioned pill so it cannot be mistaken for the economic
            tags; the tags (economic character) stay quiet cream pills. The
            "what kind of place" role lives in the masthead break-in chip above,
            so the three roles are visually distinct. */}
        {(flavor?.price_tier || visibleTags.length > 0) && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {flavor?.price_tier && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-atlas-300 bg-atlas-50 px-3 py-1 text-xs font-medium capitalize text-atlas-700">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-atlas-700">
                  Cost
                </span>
                <span aria-hidden className="h-3 w-px bg-atlas-300" />
                {flavor.price_tier}
              </span>
            )}
            {visibleTags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-parchment bg-cream-100 px-3 py-1 text-xs font-medium text-cocoa-700"
              >
                {tagLabel(t)}
              </span>
            ))}
          </div>
        )}
        </HeroWash>

        {/* ZONE 1 (cont): THE HONEST TAKE, right after the headline. ------ */}
        {view.honestTake && (
          <div className="mb-8">
            <HonestTakeBox
              id="honest-take"
              verdict={view.honestTake.verdict}
              points={view.honestTake.points}
            >
              {view.honestTake.body}
            </HonestTakeBox>
          </div>
        )}

        {/* ZONE 2: WHAT THRIVES HERE -------------------------------------- */}
        <section id="thrives" className="mb-8">
          <SectionEyebrow size="md" className="mb-2">
            What thrives here
          </SectionEyebrow>
          <h2 className="mb-1 font-display text-xl md:text-2xl font-medium tracking-tight text-ink-900">
            Revenue by trade, versus the city
          </h2>
          <p className="mb-4 max-w-2xl text-sm text-cocoa-700">
            How much a typical operator earns here against the {city.name}
            {" "}baseline for the same trade. Winners on top, suppressed trades
            below.
          </p>

          {/* The demand-driver components for the REPRESENTATIVE trade only.
              Scoped explicitly: this decomposes one trade ({REP_ACTIVITY_NAME}),
              NOT the whole ranking below, so a flat "Local tags 1.00x" no longer
              reads as a claim about every trade. The figures multiply together
              into that one trade's lift; a 1.00x part simply does not move it. */}
          <div className="mb-5 max-w-md rounded-lg border border-parchment bg-cream-50 px-4 py-3.5">
            <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
              What lifts a typical {REP_ACTIVITY_NAME.toLowerCase()} here
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Commuter", v: rep.commuter },
                { label: "Tourism", v: rep.tourism },
                { label: "Local tags", v: rep.tags },
              ].map((c) => (
                <div key={c.label}>
                  <div className="mb-1 text-[11px] font-medium text-cocoa-500">
                    {c.label}
                  </div>
                  <div className="font-display text-lg font-semibold tabular-nums text-ink-900">
                    {c.v.toFixed(2)}x
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2.5 text-[11px] leading-relaxed text-cocoa-500">
              One trade, broken into its parts. A 1.00x part is neutral here: it
              neither lifts nor drags. The other trades below each carry their
              own mix.
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-parchment">
            {ranked.map((r, i) => {
              const figure = (
                <span
                  className="shrink-0 font-display text-base md:text-lg font-semibold tabular-nums"
                  style={{ color: multColor(r.final) }}
                >
                  {pctLabel(r.final)}
                </span>
              );
              const picto = (
                <AtlasPictogram
                  id={industryPictogramId(r.id)}
                  size={18}
                  className="shrink-0 text-cocoa-500"
                />
              );
              const rowClasses = `flex items-center justify-between gap-4 px-4 md:px-5 py-3 ${
                i > 0 ? "border-t border-parchment" : ""
              }`;
              return r.cellSlug ? (
                <Link
                  key={r.id}
                  href={`/${cc}/${city.slug}/${nb.slug}/${r.cellSlug}`}
                  className={`group ${rowClasses} bg-cream-50 transition-colors hover:bg-cream-100`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {picto}
                    <span className="text-sm md:text-base font-medium text-ink-900 transition-colors group-hover:text-atlas-700">
                      {r.name}
                    </span>
                    <span aria-hidden className="text-xs text-cocoa-500">
                      &rarr;
                    </span>
                  </span>
                  {figure}
                </Link>
              ) : (
                <div key={r.id} className={`${rowClasses} bg-cream-50`}>
                  <span className="flex min-w-0 items-center gap-2">
                    {picto}
                    <span className="text-sm md:text-base font-medium text-ink-900">
                      {r.name}
                    </span>
                  </span>
                  {figure}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] text-cocoa-500">
            Modeled from the area&apos;s commuter and tourism intensity and its
            local character. Directional, a read on the local lift, not a
            guarantee.
          </p>
        </section>

        {/* ZONE 2 (cont): STREET CHARACTER.
            The block exists to carry a per-street CHARACTER read (the one-word
            tag: high-footfall, restaurant row, quiet residential, up-and-coming)
            that only a curated district holds. No district holds that
            classification yet (the prime_streets record below carries a trade
            note, not a character tag, and no flavor field carries one), so we
            pass streets={null} and the block shows its honest "not mapped yet"
            empty state rather than inventing a tag. Fills automatically once a
            curated London-style street-character set is held. */}
        <div className="mb-8">
          <StreetCharacter streets={null} />
        </div>

        {/* ZONE 2 (cont): WHO LIVES AND SHOPS HERE ------------------------ */}
        <div className="mb-8">
          {view.whoLivesHere ? (
            <WhatLocalsKnow
              id="who"
              eyebrow="Who shops here"
              heading={view.whoLivesHere.heading}
              notes={view.whoLivesHere.notes}
            />
          ) : (
            <SectionEmpty
              id="who"
              eyebrow="Who shops here"
              heading="Who lives and shops here"
              place={nb.name}
            />
          )}
        </div>

        {/* ZONE 2 (cont): COST TO OPERATE (rent / price tier) ------------- */}
        <div className="mb-8">
          {view.operatingCost ? (
            <BreakEvenLine
              id="operating-cost"
              eyebrow="Cost to operate"
              headline={view.operatingCost.headline}
              detail={view.operatingCost.detail}
            />
          ) : (
            <SectionEmpty
              id="operating-cost"
              eyebrow="Cost to operate"
              heading="How pricey it is to operate here"
              place={nb.name}
            />
          )}
        </div>

        {/* ZONE 3: VS NEARBY AREAS (adjacent-district like-for-like) ------ */}
        <div className="mb-8">
          {view.adjacent ? (
            <LikeForLikeTable
              id="adjacent"
              eyebrow="Versus the areas next door"
              heading={`${nb.name} against the districts beside it`}
              lede={`The same trade, one city, comparable prices. Where one area clearly leads it is marked; several can sit at the top together.`}
              columns={view.adjacent.columns}
              rows={view.adjacent.rows}
              footnote={view.adjacent.footnote}
            />
          ) : (
            <SectionEmpty
              id="adjacent"
              eyebrow="Versus next door"
              heading="How this area compares to the ones beside it"
              place={nb.name}
            />
          )}
        </div>

        {/* ZONE 3 (cont): PRIME STREETS.
            Mounts only when this (city, neighborhood) has a curated streets
            record. Per-street rent and spend figures self-omit when absent. */}
        {primeStreets.length > 0 && (
          <section id="streets" className="mb-8">
            <SectionEyebrow size="md" className="mb-2">
              Prime streets
            </SectionEyebrow>
            <p className="mb-4 max-w-2xl text-sm text-cocoa-700">
              Where commerce concentrates in {nb.name}.
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {primeStreets.map((s) => {
                const streetRentPct =
                  typeof s.rent_vs_city === "number" && Number.isFinite(s.rent_vs_city)
                    ? Math.round((s.rent_vs_city - 1) * 100)
                    : null;
                const spend =
                  typeof s.spend_per_visit_usd === "number" &&
                  Number.isFinite(s.spend_per_visit_usd)
                    ? s.spend_per_visit_usd
                    : null;
                return (
                  <div
                    key={s.name}
                    className="rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5"
                  >
                    <div className="mb-1 font-display text-base md:text-lg font-medium leading-tight text-ink-900">
                      {s.name}
                    </div>
                    <div className="text-sm leading-relaxed text-cocoa-700">
                      {s.sells}
                    </div>
                    {(streetRentPct !== null && streetRentPct !== 0) || spend !== null ? (
                      <div className="mt-3 flex flex-wrap items-center gap-4">
                        {streetRentPct !== null && streetRentPct !== 0 && (
                          <span className="text-xs font-semibold tabular-nums">
                            <span className="font-medium text-cocoa-500">rent </span>
                            <span style={{ color: multColor(s.rent_vs_city as number) }}>
                              {streetRentPct > 0 ? "+" : ""}
                              {streetRentPct}%
                            </span>
                            <span className="font-medium text-cocoa-500"> vs city</span>
                          </span>
                        )}
                        {spend !== null && (
                          <span className="text-xs font-semibold tabular-nums text-ink-900">
                            <span className="font-medium text-cocoa-500">spend </span>
                            {fmtUSD(spend)}
                            <span className="font-medium text-cocoa-500"> per visit</span>
                          </span>
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ZONE 3 (cont): ON THE GROUND (texture) ------------------------- */}
        {hasTexture && (
          <section id="ground" className="mb-10">
            <SectionEyebrow size="md" className="mb-3">
              On the ground
            </SectionEyebrow>
            <div className="grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
              {flavor?.food_scene && (
                <div>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
                    Food
                  </div>
                  <div className="text-sm md:text-base leading-relaxed text-cocoa-700">
                    {flavor.food_scene}
                  </div>
                </div>
              )}
              {flavor?.dont_miss && (
                <div>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
                    Don&apos;t miss
                  </div>
                  <div className="text-sm md:text-base leading-relaxed text-cocoa-700">
                    {flavor.dont_miss}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ZONE 3 (cont): THE BUSINESSES HERE (sibling rail) --------------
            Routed through BeatCard so it shares the one card grammar with every
            other section; id="businesses-here" preserved for the section gate. */}
        {siblings.length > 0 ? (
          <BeatCard
            id="businesses-here"
            eyebrow={`Elsewhere in ${city.name}`}
            heading="Other neighbourhoods"
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-3">
              {siblings.map((n) => (
                <Link
                  key={n.slug}
                  href={`/${cc}/${city.slug}/${n.slug}`}
                  className="group block rounded-lg border border-parchment bg-cream-100 p-3 transition-colors hover:border-atlas-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-300"
                >
                  <div className="text-sm font-medium leading-tight text-ink-900 transition-colors group-hover:text-atlas-700">
                    {n.name}
                  </div>
                  <div className="mt-0.5 text-[11px] capitalize text-cocoa-500">
                    {n.character.replace(/-/g, " ")}
                  </div>
                </Link>
              ))}
            </div>
          </BeatCard>
        ) : (
          <SectionEmpty
            id="businesses-here"
            eyebrow="The businesses here"
            heading="The businesses of this district"
            place={nb.name}
          />
        )}

        {/* THE ONE THING TO REMEMBER: the page's last word. Reuses the honest
            take's verdict, the held district-specific read line, exactly as the
            country and city pages reuse their own verdict here. Passes null when
            no read is held, so the closer prints its honest line rather than a
            fabricated one. */}
        <OneThing id="one-thing" lastChecked="June 2026">
          {view.honestTake ? view.honestTake.verdict : null}
        </OneThing>
      </article>
      <StickySectionNav sections={navSections} />
    </div>
  );
}
