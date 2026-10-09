/**
 * Decision wizard: /decide/[activity]/[city]
 *
 * Founder's "where should I open my pharmacy / pet shop" question made
 * concrete. Given an activity + a city, iterates through every
 * neighborhood with curated intensity data, ranks them by NET MARGIN
 * (revenue uplift minus rent drag), and surfaces the top 3 with their
 * figures. (Until 2026-10-06 each carried a stock sentence per tag and the
 * tags as chips: the district summed up in a word, which his ruling of
 * 2026-09-07 bars. Nothing replaced them.)
 *
 * 2026-05-26 upgrade:
 *   - Ranks by net margin, not revenue. Times Square revenue uplift is
 *     real, but Times Square rent eats it. Net margin tells the
 *     truth.
 *   - Adds an activity selector so the user can swap industry without
 *     editing the URL.
 *   - Surfaces a "rev / rent / margin" three-number summary on every
 *     card so the operator can see what's actually driving the rank.
 *
 * Phase 2 of the commuter+tourism+anomaly-tag framework. See
 * docs/strategy/2026-05-25-COMMUTER-TOURISM-NEIGHBORHOOD-FRAMEWORK.md.
 *
 * Server component. revalidate 12h.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import neighborhoodsJson from "../../../../../../data/cities/neighborhoods_v1.json";
import cityListJson from "../../../../../../data/cities/city_list_v1.json";
import industryMarginsJson from "@/lib/finance/industry_margins.json";
import {
  slugToIndustry,
  resolveToMeasuredIndustry,
  industryToSlug,
  INDUSTRIES,
  isExcludedFromDiscovery,
  tradeNounFor,
  withArticle,
} from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";
import {
  getNeighborhoodNetMargin,
  hasNeighborhoodIntensity,
} from "@/lib/economics/neighborhood_multipliers";
import { rentOccupancyShareFor } from "@/lib/qa/industry_baselines";
import DecideActivitySelector from "@/components/DecideActivitySelector";
import { ProgressBar } from "@/components/ui/progress-bar";
import { colors } from "@/lib/design-tokens";
import { ZoomControl } from "@/components/kit/ZoomControl";
import { robotsFor } from "@/lib/seo/indexable";

export const revalidate = 43200;

type Neighborhood = { slug: string; name: string; character: string; description?: string };
type City = { slug: string; name: string; iso2: string };

const NEIGHBORHOODS = (
  neighborhoodsJson as { cities: Record<string, { neighborhoods: Neighborhood[] }> }
).cities;
const CITIES = (cityListJson as { cities: City[] }).cities;
const CITIES_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

type IndustryMarginRow = {
  gross_margin: number;
  operating_margin: number;
  net_margin: number;
};
const INDUSTRY_MARGINS = industryMarginsJson as unknown as {
  default_fallback: IndustryMarginRow;
  industries: Record<string, IndustryMarginRow>;
};

/**
 * Get the baseline (city-level) net margin for an activity.
 * Falls back to the default 0.08 if nothing curated.
 */
function baselineNetMarginFor(activityId: string): number {
  const row = INDUSTRY_MARGINS.industries[activityId];
  if (row && typeof row.net_margin === "number") return row.net_margin;
  return INDUSTRY_MARGINS.default_fallback?.net_margin ?? 0.08;
}

/* The baseline rent share is read through the ONE accessor on the baselines
   module (bug:rent-share-invented, 2026-09-17). This page and /decide each
   carried a private copy of this lookup with a silent 0.08 typed in; the
   shared one falls back to the median of the sourced rows and says so. */
const baselineRentShareFor = (activityId: string): number => rentOccupancyShareFor(activityId).share;

type MarginTone = "success" | "warning" | "danger";

/**
 * ONE net-margin ladder for this page, replacing two copies that disagreed.
 *
 * WHAT WAS WRONG, and it was invisible to the palette gate twice over. The
 * cards and the table below them each carried their own four-branch ternary
 * running `colors.moss[900]` -> `colors.delta.positive` -> `.caution` ->
 * `.negative`. Read through design-tokens those resolve to a dark green, a
 * moss green, and two ambers: the red-to-green good-versus-bad ramp the
 * founder ruled out on 2026-08-09, "no exceptions". verify_palette_membership
 * could not count a single one of them, because it reads hex literals, rgb()
 * literals and the class names moss/amber/orange, and a token-object property
 * read like `colors.delta.positive` is none of those. That is the same class
 * of miss as the stock `emerald`/`red` ramps found in this sweep, and it is
 * why the token OBJECT had to be enumerated separately from the source text.
 *
 * The replacement is intensity in one hue, per the gate's own instruction and
 * the ladder already central in scores/band_tone.ts: terracotta loud, then
 * terracotta faint, then a neutral warm, then the site's maroon for a real
 * loss. The FOUR colour steps and the THREE bar tones also used to be written
 * as separate ternaries over the same thresholds, so the bar and the figure
 * above it could drift apart; they now come off one step.
 *
 * The signal is not weakened: every one of these figures prints the margin
 * percent itself, to one decimal, right where the colour is.
 */
function marginLadder(netMargin: number): { color: string; tone: MarginTone } {
  if (netMargin >= 0.15) return { color: colors.atlas[700], tone: "success" };
  if (netMargin >= 0.08) return { color: colors.atlas[500], tone: "success" };
  if (netMargin >= 0) return { color: colors.cocoa[500], tone: "warning" };
  return { color: colors.clay[700], tone: "danger" };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ activity: string; city: string }>;
}): Promise<Metadata> {
  const { activity, city } = await params;
  const ind = slugToIndustry(activity);
  const cityRow = CITIES_BY_SLUG.get(city);
  if (!ind || !cityRow) return { title: "Decision not found | Margin Atlas" };
  // The city half comes from the RESOLVED row (an exact map lookup, so it is the
  // slug this page rendered). The activity half keeps the requested slug
  // lowercased rather than the resolved trade id, matching /industries/[industry]:
  // an alias slug resolves to a parent trade for CONTENT, but the canonical must
  // still name a URL this route serves. Without an `alternates` of its own this
  // route inherited the root layout's `canonical: "/"`.
  const canonical = `/decide/${activity.toLowerCase()}/${cityRow.slug}`;
  return {
    /* The trade as a business with its article ("Where to open a restaurant", "an electrician"); the plural name with a fixed
       "a" read "Where to open a restaurants in London" on every one of these pages until 2026-10-06. */
    title: `Where to open ${withArticle(tradeNounFor(ind.name) || ind.name.toLowerCase())} in ${cityRow.name} | Margin Atlas`,
    description: `Top neighborhoods ranked by expected net margin for ${withArticle(tradeNounFor(ind.name) || ind.name.toLowerCase())} in ${cityRow.name}.`,
    alternates: { canonical },
    /* A /decide pair is noindex (P1-B of the page architecture, 2026-10-09); the /decide tool page keeps its status. */
    robots: robotsFor(canonical),
  };
}

// Build the activity selector options once at module load. Discovery-excluded
// (solo-professional or non-SMB) activities are hidden from the selector too.
const ACTIVITY_OPTIONS = INDUSTRIES.filter(
  (i) =>
    ((i.audience || "smb_friendly") === "smb_core" || (i.audience || "smb_friendly") === "smb_friendly") &&
    !isExcludedFromDiscovery(i),
)
  .map((i) => ({ value: industryToSlug(i.id), label: i.name }))
  .sort((a, b) => a.label.localeCompare(b.label));

export default async function DecideWizard({
  params,
}: {
  params: Promise<{ activity: string; city: string }>;
}) {
  const { activity, city } = await params;
  const rawInd = slugToIndustry(activity);
  /* `ind` rolls up to the nearest trade with measured data (cafes to restaurants) for every DATA lookup; the headline names
     `rawInd`, the trade the reader asked for, as the title above already did (the district trade page's rule of 2026-08-08). */
  const ind = resolveToMeasuredIndustry(rawInd) || rawInd;
  if (!ind) notFound();

  const cityRow = CITIES_BY_SLUG.get(city);
  if (!cityRow) notFound();

  const scheme = NEIGHBORHOODS[city];
  if (!scheme) notFound();

  const baselineNetMargin = baselineNetMarginFor(ind.id);
  const baselineRentShare = baselineRentShareFor(ind.id);

  type Ranked = {
    neighborhood: Neighborhood;
    breakdown: ReturnType<typeof getNeighborhoodNetMargin>;
    isCurated: boolean;
  };

  const ranked: Ranked[] = scheme.neighborhoods
    .map((n) => ({
      neighborhood: n,
      breakdown: getNeighborhoodNetMargin(
        city,
        n.slug,
        ind.id,
        baselineNetMargin,
        baselineRentShare,
      ),
      isCurated: hasNeighborhoodIntensity(city, n.slug),
    }))
    // Sort: curated first, then by net margin descending (the actual
    // founder question: "where is profit highest").
    .sort((a, b) => {
      if (a.isCurated !== b.isCurated) return a.isCurated ? -1 : 1;
      return b.breakdown.neighborhoodNetMargin - a.breakdown.neighborhoodNetMargin;
    });

  const curatedCount = ranked.filter((r) => r.isCurated).length;
  const top3 = ranked.slice(0, 3);

  // Altitude links for the ZoomControl, all keeping THIS trade + THIS city
  // sticky. This ranking page is the "whole city" altitude. "This trade here"
  // is the city-level cell; "by neighbourhood" points at the best-ranked
  // neighbourhood's cell as the representative deeper read. Both use the same
  // cell URL grammar the cards below already use, so they never 404 differently.
  const iso2 = cityRow.iso2.toLowerCase();
  const industrySlug = industryToSlug(ind.id);
  const topRanked = ranked[0];
  const zoomHrefs = {
    business: `/${iso2}/${city}/${industrySlug}`,
    neighbourhood: topRanked
      ? `/${iso2}/${city}/${topRanked.neighborhood.slug}/${industrySlug}`
      : undefined,
  };

  return (
    <>
      {/* Altitude ladder: same trade + same city, at every level of detail.
          This page is the "whole city" rung; the links step out to the city
          cell and down to the best-corner neighbourhood without losing the
          trade or the place. Sticky, reversible, costs nothing to hydrate. */}
      <ZoomControl
        trade={ind.name}
        place={cityRow.name}
        altitude="city"
        hrefs={zoomHrefs}
      />
      <article className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-14">
      {/* Breadcrumb */}
      <nav className="text-sm text-cocoa-700/70 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-atlas-700">
          Home
        </Link>
        <span>/</span>
        <Link href={`/cities/${city}`} className="hover:text-atlas-700">
          <CountryFlag iso2={cityRow.iso2} className="w-4 inline-block align-middle mr-1" />
          {cityRow.name}
        </Link>
        <span>/</span>
        <span className="text-ink-900">Where to open</span>
      </nav>

      {/* Hero */}
      <div className="text-xs uppercase tracking-[0.18em] text-atlas-700 font-semibold mb-2">
        Decision wizard
      </div>
      <h1 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-ink-900 mb-3 leading-tight">
        Where to open {withArticle(tradeNounFor((rawInd ?? ind).name) || (rawInd ?? ind).name.toLowerCase())} in {cityRow.name}
      </h1>
      <p className="text-base md:text-lg text-cocoa-700/80 mb-6 max-w-2xl leading-relaxed">
        Every neighborhood in {cityRow.name} ranked by expected NET
        MARGIN, not just revenue. Tourist + financial-CBD zones get
        revenue uplift but the rent often eats it.
      </p>

      {/* Activity selector. Lets the user try the same city for a different activity. */}
      <div className="mb-10">
        <DecideActivitySelector
          citySlug={city}
          currentActivity={industryToSlug(ind.id)}
          options={ACTIVITY_OPTIONS}
        />
      </div>

      {/* Empty state */}
      {curatedCount === 0 && ranked.length === 0 ? (
        <div className="atlas-card p-8 text-center">
          <h2 className="font-display text-xl text-ink-900 mb-2">
            {cityRow.name} not yet covered at neighborhood resolution
          </h2>
          <p className="text-sm text-cocoa-700/80 max-w-md mx-auto">
            Open the city page for the cell-level benchmark in the meantime.
          </p>
          <Link
            href={`/cities/${city}`}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-atlas-700 hover:text-atlas-900"
          >
            Open {cityRow.name} city page &rarr;
          </Link>
        </div>
      ) : (
        <>
          {/* Top 3 picks */}
          <section className="mb-12">
            <h2 className="font-display text-xl md:text-2xl font-semibold text-ink-900 mb-5">
              Top 3 by net margin
            </h2>
            {/* Max margin used to scale the per-card ProgressBar so the
                visual comparison is honest: a 12% bar next to an 18% bar
                actually looks 2/3 as long. */}
            {(() => {
              const maxMargin = Math.max(
                0.01,
                ...top3.map((r) => r.breakdown.neighborhoodNetMargin),
              );
              return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {top3.map((r, idx) => {
                const b = r.breakdown;
                const marginPct = (b.neighborhoodNetMargin * 100).toFixed(1);
                const revPct = Math.round((b.revenueMultiplier - 1) * 100);
                const rentPct = Math.round((b.rentMultiplier - 1) * 100);
                const { color, tone } = marginLadder(b.neighborhoodNetMargin);
                return (
                  <Link
                    key={r.neighborhood.slug}
                    href={`/${cityRow.iso2.toLowerCase()}/${city}/${r.neighborhood.slug}/${industryToSlug(ind.id)}`}
                    className="atlas-card p-5 flex flex-col gap-3"
                  >
                    <div className="flex items-baseline justify-between">
                      <div className="text-[10px] uppercase tracking-[0.14em] text-atlas-700 font-semibold">
                        #{idx + 1}
                      </div>
                      <div
                        className="font-display text-2xl font-semibold tabular-nums leading-none"
                        style={{ color }}
                      >
                        {marginPct}%
                      </div>
                    </div>
                    <ProgressBar
                      value={Math.max(0, b.neighborhoodNetMargin)}
                      max={maxMargin}
                      size="sm"
                      tone={tone}
                    />
                    <h3 className="font-display text-lg font-semibold text-ink-900 leading-tight">
                      {r.neighborhood.name}
                    </h3>
                    {/* The district's name and its figures, nothing that sums it up: a stock sentence per tag and the tags as
                        chips stood here until 2026-10-06 (his ruling of 2026-09-07). The figures keep the card's foot. */}
                    <div className="mt-auto text-[10px] text-cocoa-700/55 tabular-nums pt-1 border-t border-[rgba(76,39,18,0.06)]">
                      {/* "at least" when the multiplier is the model's 3.0
                          ceiling rather than a reading, the same convention
                          CityDistrictPicker, DivergingBars and the
                          neighbourhoods hub already use. */}
                      revenue {b.revenueClipped ? "at least " : ""}
                      {revPct >= 0 ? "+" : ""}
                      {revPct}% &middot; rent {rentPct >= 0 ? "+" : ""}
                      {rentPct}% &middot; net margin {marginPct}%
                    </div>
                  </Link>
                );
              })}
            </div>
              );
            })()}
          </section>

          {/* Full ranking table */}
          <section className="mb-12">
            <h2 className="font-display text-xl md:text-2xl font-semibold text-ink-900 mb-5">
              All neighborhoods ranked
            </h2>
            {/* Canonical surface. The border was a raw rgba literal, which is
                banned in components; .atlas-card carries the hairline token. */}
            <div className="atlas-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white">
                  <tr className="border-b border-[rgba(76,39,18,0.10)]">
                    <th scope="col" className="text-left px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
                      Neighborhood
                    </th>
                    <th scope="col" className="text-right px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
                      Revenue
                    </th>
                    <th scope="col" className="text-right px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
                      Rent
                    </th>
                    <th scope="col" className="text-right px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
                      Net margin
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ranked.map((r) => {
                    const b = r.breakdown;
                    const marginPct = (b.neighborhoodNetMargin * 100).toFixed(1);
                    const revPct = Math.round((b.revenueMultiplier - 1) * 100);
                    const rentPct = Math.round((b.rentMultiplier - 1) * 100);
                    const { color } = marginLadder(b.neighborhoodNetMargin);
                    return (
                      <tr
                        key={r.neighborhood.slug}
                        className="border-t border-[rgba(76,39,18,0.06)]"
                      >
                        <td className="px-4 py-3">
                          <div className="font-semibold text-ink-900">
                            {r.neighborhood.name}
                          </div>
                          {!r.isCurated && (
                            <div className="text-[10px] text-cocoa-700/55 mt-0.5">
                              heuristic estimate
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-ink-800">
                          {/* Same clip qualifier as the cards above. */}
                          {b.revenueClipped ? "at least " : ""}
                          {revPct >= 0 ? "+" : ""}
                          {revPct}%
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-ink-800">
                          {rentPct >= 0 ? "+" : ""}
                          {rentPct}%
                        </td>
                        <td
                          className="px-4 py-3 text-right font-display text-base font-semibold tabular-nums"
                          style={{ color }}
                        >
                          {marginPct}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-cocoa-700/70 max-w-3xl">
              Baseline {ind.name.toLowerCase()} net margin: {(baselineNetMargin * 100).toFixed(1)}%
              of revenue (from the industry margin table). Baseline rent
              share: {(baselineRentShare * 100).toFixed(1)}% of revenue.
              Neighborhood net margin = baseline minus the additional
              rent drag at this neighborhood.
            </p>
          </section>

          {/* Methodology footnote */}
          <section className="text-xs text-cocoa-700/70 max-w-2xl leading-relaxed">
            The multiplier composes commuter intensity (daytime /
            resident pop), tourism intensity (visitors per resident),
            anomaly tags (financial CBD, luxury district, tech corridor,
            etc), and rent drag per tag. See{" "}
            <Link
              href="/methodology"
              className="text-atlas-700 font-medium hover:text-atlas-900 underline decoration-atlas-300 hover:decoration-atlas-700 underline-offset-2"
            >
              How we measure
            </Link>{" "}
            for the math.
          </section>
        </>
      )}
      </article>
    </>
  );
}
