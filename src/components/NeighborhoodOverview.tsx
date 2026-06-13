/**
 * NeighborhoodOverview component.
 *
 * The per-neighborhood MICRO-MARKET PROFILE. This is a deep, non-repetitive
 * extension of the city page: it does NOT restate the city's numbers, it reads
 * the local economics of THIS neighborhood (what the catchment runs on, the
 * time-of-day rhythm, which trades win or are suppressed here, the rent drag).
 *
 * Rendered by the cell-or-overview dispatcher at
 * src/app/[country]/[geo]/[industry]/page.tsx — when the URL
 * `/[country]/[geo]/[industry]` resolves as a known (city, neighborhood) pair
 * instead of a (geo, industry) cell, this component renders instead of the cell
 * page. The dispatcher imports findNeighborhoodContext + listSiblingNeighborhoods
 * + NeighborhoodOverview from here.
 *
 * Server component (no client JS). Reads neighborhoods_v1.json + city_list_v1.json
 * via the existing cities helpers, the commuter/tourism/anomaly-tag engine in
 * lib/economics/neighborhood_multipliers, and the flavor loader. Every section
 * self-omits cleanly when its data is absent; every multiplier figure is finite.
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
// Representative activity set for the "What wins here" ranking.
//
// Multiplier activity id (underscores, as the engine expects) -> display name.
// The engine in neighborhood_multipliers carries betas + tag effects under
// these ids. The cell link, however, needs the TAXONOMY slug — most of these
// ids ARE taxonomy industry ids (so industryToSlug(id) resolves), but two
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

// The representative activity used for the headline component breakdown and the
// demand-driver figures. Restaurants is the most universal SMB benchmark (it
// mirrors the neighborhoods hub, which also reads restaurants).
const REP_ACTIVITY_ID = "restaurants";

/**
 * Alias map for the two representative activity ids whose multiplier id is not
 * itself a taxonomy industry id. Values are taxonomy slugs.
 *   - pharmacies_drug_stores -> the consumer pharmacy/drug-store cell
 *   - fitness_gyms           -> the consumer sports & fitness (gyms) cell
 */
const ACTIVITY_CELL_SLUG_ALIAS: Record<string, string> = {
  pharmacies_drug_stores: "pharmacies-health-stores",
  fitness_gyms: "sports-fitness",
};

/**
 * Resolve a multiplier activity id to a real taxonomy CELL slug, or null if it
 * does not resolve (so the row can render unlinked rather than as a broken
 * link). Tries, in order: the explicit alias, the canonical slug derived from
 * the activity id treated as an industry id, then the dashed id. Each candidate
 * is round-tripped through slugToIndustry so we only ever emit a slug that
 * actually resolves to a cell, and we emit that industry's canonical slug.
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
  return `${pct > 0 ? "+" : ""}${pct}%`;
}

/**
 * Brand-token color for a multiplier figure: moss for a clear premium (>1.1),
 * a neutral warm ink/cocoa near par, clay for a clear suppression (<0.9). Token
 * references only (no raw hex), mirroring the neighborhoods hub treatment.
 */
function multColor(final: number): string {
  if (final > 1.1) return colors.moss[700];
  if (final < 0.9) return colors.clay[600];
  return colors.cocoa[700];
}

/** Driver phrase keyed off the primary tag. Defaults to a mixed catchment. */
function driverPhrase(primary: NeighborhoodTag | undefined): string {
  switch (primary) {
    case "financial_cbd":
    case "free_economic_zone":
    case "tech_corridor":
      return "Driven by weekday commuters and office workers.";
    case "tourist_zone":
    case "religious_pilgrimage":
      return "Driven by visitors.";
    case "university_district":
      return "Driven by students.";
    case "nightlife_zone":
      return "Driven by evening and night crowds.";
    case "residential_only":
      return "Driven by local residents.";
    case "medical_cluster":
      return "Driven by hospital and clinic traffic.";
    case "transit_hub":
      return "Driven by transient footfall.";
    case "industrial_park":
      return "Driven by daytime workforce.";
    default:
      return "A mixed local catchment.";
  }
}

/** Time-of-day / week rhythm phrase keyed off the primary tag. */
function rhythmPhrase(primary: NeighborhoodTag | undefined): string {
  switch (primary) {
    case "financial_cbd":
    case "free_economic_zone":
      return "Weekday business hours; quiet on weekends.";
    case "nightlife_zone":
      return "Comes alive in the evenings.";
    case "tourist_zone":
      return "Peaks in the visitor season.";
    case "university_district":
      return "Term-time driven, thinner in summer.";
    case "transit_hub":
      return "Steady commuter rush, morning and evening.";
    case "residential_only":
      return "Even, resident-paced through the week.";
    case "industrial_park":
      return "Daytime only, dead after the shift.";
    case "medical_cluster":
      return "Daytime clinical hours.";
    default:
      return "A steady weekly rhythm.";
  }
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
  // until the pipeline fills the pair; the streets section below self-omits.
  const economics = getNeighborhoodEconomics(city.slug, nb.slug);
  const primeStreets = economics?.prime_streets ?? [];

  // The local-economics row: primary tag, anomaly tags, intensities. Null for a
  // neighborhood that has not been curated yet (then the engine falls back to
  // city defaults, the tag-driven sections self-omit, and rent reads ~1.0).
  const row = getNeighborhoodRow(city.slug, nb.slug);
  const tags = row?.tags ?? [];
  const primaryTag = row?.primary_tag;

  // Build the activity ranking ONCE: it feeds both the headline winner and the
  // "What wins here" table. Sort by the final multiplier descending so winners
  // lead and the suppressed trades sink to the bottom. Every final is finite.
  const ranked = REP_ACTIVITIES.map((a) => {
    const m = getNeighborhoodMultiplier(city.slug, nb.slug, a.id);
    return {
      id: a.id,
      name: a.name,
      final: m.final,
      cellSlug: resolveActivityCellSlug(a.id),
    };
  }).sort((x, y) => y.final - x.final);

  const topWinner = ranked[0];

  // Representative-activity component breakdown for the demand-driver figures.
  const rep = getNeighborhoodMultiplier(city.slug, nb.slug, REP_ACTIVITY_ID);

  // Rent drag from the tag set. Exactly 1.0 (no tags / neutral) means the rent
  // line self-omits rather than printing a "+0%" non-fact.
  const rentMult = rentMultiplier(tags);
  const rentPct = Math.round((rentMult - 1) * 100);

  // Lead line: prefer the flavor character paragraph, fall back to the
  // neighborhood description, else omit entirely (no invented prose).
  const leadLine = flavor?.character_paragraph || nb.description || null;

  // The single strongest activity, phrased for the headline. "Restaurants earn
  // about +180% versus the city here." Omitted at par (would be a non-signal).
  const winnerHeadline =
    topWinner && Math.round((topWinner.final - 1) * 100) !== 0
      ? `${topWinner.name} earn about ${pctLabel(topWinner.final)} versus the city here.`
      : null;

  return (
    <article className="pb-16 max-w-5xl mx-auto px-4 md:px-6 pt-2 md:pt-4">
      {/* Cover banner: an honest designed placeholder (gradient + engraved
          street grid), not a photo of the place. */}
      <NeighborhoodCover
        name={nb.name}
        seed={`${city.slug}-${nb.slug}`}
        className="h-28 md:h-40 rounded-2xl mb-5"
      />

      {/* 1) HEADLINE -------------------------------------------------------- */}
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-cocoa-700 font-semibold mb-3 flex-wrap">
        <Link href={`/cities/${city.slug}`} className="hover:text-atlas-700 transition-colors">
          {city.name}
        </Link>
        <span aria-hidden>·</span>
        <CountryFlag iso2={city.iso2} className="w-3.5" />
        <span>{countryName}</span>
        <span aria-hidden>·</span>
        <Link href={`/cities/${city.slug}/neighborhoods`} className="hover:text-atlas-700 transition-colors">
          all neighborhoods
        </Link>
      </div>

      <div className="flex items-baseline gap-3 mb-2 flex-wrap">
        <h1 className="font-display text-3xl md:text-4xl font-medium tracking-tight text-ink-900">
          {nb.name}
        </h1>
        <span className="text-[10px] uppercase tracking-wide font-semibold text-atlas-700 bg-atlas-50 border border-atlas-200 rounded-full px-2 py-0.5">
          {nb.character.replace(/-/g, " ")}
        </span>
        {flavor?.price_tier && (
          <span className="text-[10px] uppercase tracking-wide font-semibold text-cocoa-700 bg-cream-100 border border-parchment rounded-full px-2 py-0.5">
            {flavor.price_tier}
          </span>
        )}
        {flavor?.walkability && (
          <span className="text-[10px] uppercase tracking-wide font-semibold text-cocoa-700 bg-cream-100 border border-parchment rounded-full px-2 py-0.5">
            walks {flavor.walkability}
          </span>
        )}
        {tags
          .filter((t) => t !== "residential_only")
          .slice(0, 4)
          .map((t) => (
            <span
              key={t}
              className="text-[10px] uppercase tracking-wide font-semibold text-atlas-700 bg-atlas-50 border border-atlas-200 rounded-full px-2 py-0.5"
            >
              {tagLabel(t)}
            </span>
          ))}
      </div>

      {/* The headline signal: the single strongest trade, vs the city. */}
      {winnerHeadline && (
        <p className="text-lg md:text-xl text-ink-900 font-medium max-w-2xl leading-snug mb-3">
          {winnerHeadline}
        </p>
      )}

      {leadLine && (
        <p className="text-base md:text-lg text-cocoa-700 max-w-2xl leading-relaxed mb-8">
          {leadLine}
        </p>
      )}

      {/* 2) DEMAND DRIVERS -------------------------------------------------- */}
      <section className="mb-10">
        <SectionEyebrow size="sm" className="mb-2">
          What it runs on
        </SectionEyebrow>
        <p className="text-base md:text-lg text-ink-900 max-w-2xl leading-relaxed mb-4">
          {driverPhrase(primaryTag)}
        </p>
        {/* The three components that move the representative number, so the
            reader sees what the multiplier is made of. */}
        <div className="grid grid-cols-3 gap-3 max-w-md">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-cocoa-700 font-semibold mb-1">
              Commuter
            </div>
            <div className="font-display text-lg font-semibold tabular-nums text-ink-900">
              {rep.commuter.toFixed(2)}×
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide text-cocoa-700 font-semibold mb-1">
              Tourism
            </div>
            <div className="font-display text-lg font-semibold tabular-nums text-ink-900">
              {rep.tourism.toFixed(2)}×
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide text-cocoa-700 font-semibold mb-1">
              Tags
            </div>
            <div className="font-display text-lg font-semibold tabular-nums text-ink-900">
              {rep.tags.toFixed(2)}×
            </div>
          </div>
        </div>
        <div className="text-[10px] text-cocoa-700/70 mt-2 tabular-nums">
          On restaurant revenue, relative to the {city.name} baseline.
        </div>
      </section>

      {/* 3) DISTRICT DYNAMICS ---------------------------------------------- */}
      <section className="mb-10">
        <SectionEyebrow size="sm" className="mb-2">
          When it works
        </SectionEyebrow>
        <p className="text-base md:text-lg text-ink-900 max-w-2xl leading-relaxed">
          {rhythmPhrase(primaryTag)}
        </p>
      </section>

      {/* 4) WHAT WINS HERE -------------------------------------------------- */}
      <section className="mb-10">
        <SectionEyebrow size="sm" className="mb-2">
          What wins here
        </SectionEyebrow>
        <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight text-ink-900 mb-1">
          Revenue by trade, versus the city
        </h2>
        <p className="text-sm text-cocoa-700 mb-4 max-w-2xl">
          How much a typical operator earns here against the {city.name} baseline
          for the same trade. Winners on top, suppressed trades below.
        </p>
        <div className="rounded-2xl border border-parchment overflow-hidden">
          {ranked.map((r, i) => {
            const figure = (
              <span
                className="font-display text-base md:text-lg font-semibold tabular-nums shrink-0"
                style={{ color: multColor(r.final) }}
              >
                {pctLabel(r.final)}
              </span>
            );
            const picto = (
              <AtlasPictogram
                id={industryPictogramId(r.id)}
                size={18}
                className="shrink-0 text-cocoa-700/70"
              />
            );
            const label = (
              <span className="flex items-center gap-2 min-w-0">
                {picto}
                <span className="font-medium text-sm md:text-base text-ink-900">
                  {r.name}
                </span>
              </span>
            );
            const rowClasses = `flex items-center justify-between gap-4 px-4 md:px-5 py-3 ${
              i > 0 ? "border-t border-parchment" : ""
            }`;
            // Render WITH a link only when the taxonomy slug resolves; otherwise
            // render the row plain rather than a broken link.
            return r.cellSlug ? (
              <Link
                key={r.id}
                href={`/${cc}/${city.slug}/${nb.slug}/${r.cellSlug}`}
                className={`group ${rowClasses} bg-white hover:bg-cream-100 transition-colors`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  {picto}
                  <span className="font-medium text-sm md:text-base text-ink-900 group-hover:text-atlas-700 transition-colors">
                    {r.name}
                  </span>
                  <span aria-hidden className="text-cocoa-700/50 text-xs">
                    →
                  </span>
                </span>
                {figure}
              </Link>
            ) : (
              <div key={r.id} className={`${rowClasses} bg-white`}>
                {label}
                {figure}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] text-cocoa-500">
          Modeled from the area&apos;s commuter and tourism intensity and its
          anomaly tags. Directional, a read on the local lift, not a guarantee.
        </p>
      </section>

      {/* 5) RENT ------------------------------------------------------------ */}
      {rentMult !== 1.0 && rentPct !== 0 && (
        <section className="mb-10">
          <SectionEyebrow size="sm" className="mb-2">
            Rent
          </SectionEyebrow>
          <p className="text-base md:text-lg text-ink-900 max-w-2xl leading-relaxed">
            Commercial rent runs about{" "}
            <span
              className="font-semibold tabular-nums"
              style={{ color: multColor(rentMult) }}
            >
              {rentPct > 0 ? "+" : ""}
              {rentPct}%
            </span>{" "}
            versus the city here.
          </p>
        </section>
      )}

      {/* 6) PRIME STREETS + SPEND.
          Mounts only when this (city, neighborhood) has a curated streets
          record with at least one street. Per-street rent and spend figures
          self-omit when the pipeline has not filled them. */}
      {primeStreets.length > 0 && (
        <section className="mb-10">
          <SectionEyebrow size="sm" className="mb-2">
            Prime streets
          </SectionEyebrow>
          <p className="text-sm text-cocoa-700 mb-4 max-w-2xl">
            Where commerce concentrates in {nb.name}.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {primeStreets.map((s) => {
              const rentPct =
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
                  className="rounded-2xl border border-parchment bg-white p-4 md:p-5"
                >
                  <div className="font-display text-base md:text-lg font-medium text-ink-900 leading-tight mb-1">
                    {s.name}
                  </div>
                  <div className="text-sm text-cocoa-700 leading-relaxed">
                    {s.sells}
                  </div>
                  {(rentPct !== null && rentPct !== 0) || spend !== null ? (
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      {rentPct !== null && rentPct !== 0 && (
                        <span className="text-xs font-semibold tabular-nums">
                          <span className="text-cocoa-700/70 font-medium">rent </span>
                          <span style={{ color: multColor(s.rent_vs_city as number) }}>
                            {rentPct > 0 ? "+" : ""}
                            {rentPct}%
                          </span>
                          <span className="text-cocoa-700/70 font-medium"> vs city</span>
                        </span>
                      )}
                      {spend !== null && (
                        <span className="text-xs font-semibold tabular-nums text-ink-900">
                          <span className="text-cocoa-700/70 font-medium">spend </span>
                          {fmtUSD(spend)}
                          <span className="text-cocoa-700/70 font-medium"> per visit</span>
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

      {/* 7) TEXTURE -------------------------------------------------------- */}
      {(flavor?.food_scene || flavor?.dont_miss) && (
        <section className="mb-12">
          <SectionEyebrow size="sm" className="mb-3">
            On the ground
          </SectionEyebrow>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            {flavor?.food_scene && (
              <div>
                <div className="text-[10px] uppercase tracking-wide text-cocoa-700 font-semibold mb-1">
                  Food
                </div>
                <div className="text-sm md:text-base text-cocoa-700 leading-relaxed">
                  {flavor.food_scene}
                </div>
              </div>
            )}
            {flavor?.dont_miss && (
              <div>
                <div className="text-[10px] uppercase tracking-wide text-cocoa-700 font-semibold mb-1">
                  Don&apos;t miss
                </div>
                <div className="text-sm md:text-base text-cocoa-700 leading-relaxed">
                  {flavor.dont_miss}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 8) SIBLINGS ------------------------------------------------------- */}
      {siblings.length > 0 && (
        <section>
          <SectionEyebrow size="sm" className="mb-2">
            Elsewhere in {city.name}
          </SectionEyebrow>
          <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight text-ink-900 mb-4">
            Other neighborhoods
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
            {siblings.map((n) => (
              <Link
                key={n.slug}
                href={`/${cc}/${city.slug}/${n.slug}`}
                className="group block rounded-xl border border-cream-300 hover:border-atlas-500 bg-cream-50 p-3 transition-colors"
              >
                <div className="font-medium text-sm text-ink-900 group-hover:text-atlas-700 transition-colors leading-tight">
                  {n.name}
                </div>
                <div className="text-[10px] text-cocoa-700 mt-0.5 capitalize">
                  {n.character.replace(/-/g, " ")}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
