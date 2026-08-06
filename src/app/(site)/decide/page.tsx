/**
 * /decide landing page.
 *
 * The founder's first decision surface (bible Section 21, "What business should
 * I start in this city?", and Section 5, the "Best businesses to start" row).
 * It is reformed to lead with the decision, not the form: an opinionated read
 * that the harder half of the question is WHICH business, that the average
 * across activities is not the answer, and that the operator and the address
 * decide the outcome. Only then does it hand the founder the concrete tools,
 * the activity-plus-city picker that ranks a city's neighborhoods by what is
 * left after rent, and a set of worked examples.
 *
 * The opinionated read comes from a pure synthesis module
 * (src/lib/scores/founder_decision) fed only the data this page already loads:
 * the catalogue of SMB activities joined to their curated, cross-country-stable
 * margin shape. It invents no numbers and no rankings. This mirrors the
 * established pattern on the cell, country, industry, and place pages.
 *
 * Server component; the picker is a plain HTML form so it works without any
 * client JS (mirrors the bulletproof NavigatorForm pattern).
 *
 * 2026-05-26 shipped alongside the city-page entry point.
 * 2026-06-04 reformed to the warm decision-first layout.
 */
import type { Metadata } from "next";
import Link from "next/link";
import {
  INDUSTRIES,
  industryToSlug,
  slugToIndustry,
  resolveToMeasuredIndustry,
  isExcludedFromDiscovery,
} from "@/lib/taxonomy";
import industryMarginsJson from "@/lib/finance/industry_margins.json";
import cityListJson from "../../../../data/cities/city_list_v1.json";
import neighborhoodsJson from "../../../../data/cities/neighborhoods_v1.json";
import {
  getNeighborhoodNetMargin,
  hasNeighborhoodIntensity,
  type NeighborhoodTag,
} from "@/lib/economics/neighborhood_multipliers";
import { INDUSTRY_BASELINES } from "@/lib/qa/industry_baselines";
import {
  generateFounderDecision,
  type FounderActivityInput,
} from "@/lib/scores/founder_decision";
import { FounderDecisionLede } from "@/components/decide/FounderDecisionLede";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { DecideWizard, type WizardOption } from "./DecideWizard";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Where should you open a business? | Margin Atlas",
  description:
    "Pick an activity and a city. Margin Atlas ranks every neighborhood by expected net margin, accounting for commuter density, tourism, and rent drag.",
  alternates: { canonical: "/decide" },
};

type City = { slug: string; name: string; iso2: string; tier: number };
const CITIES = (cityListJson as { cities: City[] }).cities;

type IndustryMarginRow = {
  gross_margin: number;
  operating_margin: number;
  net_margin: number;
  asset_intensity?: number;
};
const INDUSTRY_MARGINS = industryMarginsJson as unknown as {
  default_fallback: IndustryMarginRow;
  industries: Record<string, IndustryMarginRow>;
};

// SMB-relevant activities only (the audience the founder decision is for).
// Discovery-excluded (solo-professional or non-SMB) activities are hidden too.
const SMB_INDUSTRIES = INDUSTRIES.filter(
  (i) =>
    ((i.audience || "smb_friendly") === "smb_core" ||
      (i.audience || "smb_friendly") === "smb_friendly") &&
    !isExcludedFromDiscovery(i),
);

// Activity options for the picker, alphabetical.
const ACTIVITY_OPTIONS = SMB_INDUSTRIES.map((i) => ({
  value: industryToSlug(i.id),
  label: i.name,
})).sort((a, b) => a.label.localeCompare(b.label));

// Sort cities by tier (deepest coverage first), then alphabetically.
const CITY_OPTIONS = [...CITIES]
  .sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return a.name.localeCompare(b.name);
  })
  .map((c) => ({ value: c.slug, label: `${c.name} (${c.iso2})` }));

// Join each SMB activity to the curated margin shape that the entity and
// decision pages already use. We resolve through the measured-ancestor chain
// so a sub-niche inherits its parent's structural ratios, exactly as the
// /decide/[activity]/[city] page does. Net margin is the only ordering signal,
// and it is reported qualitatively by the synthesis module, never as a number
// the page invents.
const FOUNDER_ACTIVITIES: FounderActivityInput[] = SMB_INDUSTRIES.map((i) => {
  const measured = resolveToMeasuredIndustry(i) || i;
  const row = INDUSTRY_MARGINS.industries[measured.id];
  return {
    industryId: i.id,
    name: i.name,
    slug: industryToSlug(i.id),
    netMargin: row && typeof row.net_margin === "number" ? row.net_margin : null,
    grossMargin: row && typeof row.gross_margin === "number" ? row.gross_margin : null,
    assetIntensity:
      row && typeof row.asset_intensity === "number" ? row.asset_intensity : null,
  };
});

const FOUNDER_DECISION = generateFounderDecision({ activities: FOUNDER_ACTIVITIES });

// Wizard feed. The guided flow reuses the lists the picker already built and a
// small trade -> typical net-margin table resolved here at build time from the
// SAME curated shape FOUNDER_ACTIVITIES carries, so the headline the wizard
// shows matches the destination page and is never invented client-side.
const WIZARD_TRADES: WizardOption[] = ACTIVITY_OPTIONS.map((o) => ({
  value: o.value,
  label: o.label,
}));

const TRADE_NET_MARGIN: Record<string, number | null> = Object.fromEntries(
  FOUNDER_ACTIVITIES.map((a) => [a.slug, a.netMargin]),
);

// A short curated set of trades for the quick chips: the founder-decision "best
// keepers" first (deduped), topped up from the alphabetical list so there is
// always a handful, capped so the chip row stays calm on mobile.
const FEATURED_TRADE_SLUGS = Array.from(
  new Set([
    ...FOUNDER_DECISION.best.map((b) => b.slug),
    "restaurants",
    "cafes-coffee-shops",
    "hair-salons",
  ]),
).slice(0, 5);
const FEATURED_TRADES: WizardOption[] = FEATURED_TRADE_SLUGS.map((slug) =>
  WIZARD_TRADES.find((t) => t.value === slug),
).filter((t): t is WizardOption => t != null);

// A short curated set of places for the quick chips: the deepest-coverage,
// widely-recognised metros, in the order a founder is most likely to reach for.
const FEATURED_PLACE_SLUGS = [
  "london",
  "new-york",
  "paris",
  "dubai",
  "amsterdam",
];
const FEATURED_PLACES: WizardOption[] = FEATURED_PLACE_SLUGS.map((slug) =>
  CITY_OPTIONS.find((c) => c.value === slug),
)
  .filter((c): c is { value: string; label: string } => c != null)
  .map((c) => ({ value: c.value, label: c.label }));

const WIZARD_PLACES: WizardOption[] = CITY_OPTIONS.map((c) => ({
  value: c.value,
  label: c.label,
}));

// Worked examples that surface the framework's strongest point: the best corner
// for a trade is rarely the busiest one, because rent moves with revenue. These
// are NOT a leaderboard and NOT hand-written numbers. Each is resolved here, at
// build time, through the SAME path the live /decide/[activity]/[city] ranking
// uses: the curated activity margin, the activity-aware revenue and rent
// multipliers per neighborhood, and the net-margin sort. The card prints the
// winning neighborhood's real net margin and links to that live ranking. If a
// candidate does not resolve cleanly (city or neighborhood data absent, the
// activity does not map to its own measured shape, or the top neighborhood is
// not hand-curated), it self-omits, and the whole section hides below three.

// Candidate (activity, city) pairs, hand-chosen to read as distinct best-corner
// stories across different cities and trade types. The numbers are not here; the
// resolver computes them. Each candidate is verified to resolve to its own
// measured activity, so the card label never contradicts the destination page.
const WORKED_EXAMPLE_CANDIDATES: ReadonlyArray<{
  activity: string;
  city: string;
}> = [
  { activity: "legal-services", city: "london" },
  { activity: "real-estate-agencies", city: "london" },
  { activity: "travel-agencies", city: "dubai" },
  { activity: "guest-houses-pensions", city: "paris" },
  { activity: "legal-services", city: "amsterdam" },
];

type NeighborhoodEntry = { slug: string; name: string };
const NEIGHBORHOODS_BY_CITY = (
  neighborhoodsJson as unknown as {
    cities: Record<string, { neighborhoods: NeighborhoodEntry[] }>;
  }
).cities;
const CITIES_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

// Rent occupancy share for the rent-drag math, mirroring the wizard page.
function baselineRentShareFor(activityId: string): number {
  const row = INDUSTRY_BASELINES[activityId];
  if (row && typeof row.rent_occupancy === "number") return row.rent_occupancy;
  return 0.08;
}

// One short, true clause keyed off the winning neighborhood's leading tag. It
// names WHY this corner keeps the most, in plain language, never a number this
// module invents (the only number rendered is the resolved net margin).
function bestCornerWhy(tags: NeighborhoodTag[]): string {
  const active = tags.filter((t) => t !== "residential_only");
  if (active.includes("financial_cbd")) {
    return "the business core wins outright: the work follows the offices, and the rent is earned back";
  }
  if (active.includes("luxury_district")) {
    return "the premium quarter carries it, where pricing power absorbs the steepest rent in the city";
  }
  if (active.includes("tourist_zone")) {
    return "the visitor quarter takes it, where the footfall lifts revenue faster than the rent climbs";
  }
  if (active.includes("tech_corridor")) {
    return "the tech corridor edges ahead: high-earning demand against rent that has not fully caught up";
  }
  if (active.includes("gentrifying_edge")) {
    return "the rising edge clears the centre, where demand is climbing but the rent has not chased it yet";
  }
  if (active.includes("nightlife_zone")) {
    return "the late-night quarter takes it on the evening trade, at a rent the centre cannot match";
  }
  if (active.includes("university_district")) {
    return "the student quarter holds it: steady local demand at a far gentler rent than the core";
  }
  return "the quieter address keeps the most, where the rent never outruns the revenue";
}

type WorkedExample = {
  activity: string;
  city: string;
  label: string;
  cityName: string;
  neighborhood: string;
  marginPct: string;
  why: string;
};

// Resolve every candidate through the live ranking path; keep only the clean,
// curated, self-named winners. No numbers are written here; all are computed.
const WORKED_EXAMPLES: WorkedExample[] = WORKED_EXAMPLE_CANDIDATES.map(
  ({ activity, city }): WorkedExample | null => {
    const raw = slugToIndustry(activity);
    const measured = raw ? resolveToMeasuredIndustry(raw) || raw : null;
    // Skip if the activity does not map to its own measured shape: the
    // destination page would then show a different activity name than the card.
    if (!raw || !measured || measured.id !== raw.id) return null;

    const cityRow = CITIES_BY_SLUG.get(city);
    const scheme = NEIGHBORHOODS_BY_CITY[city];
    if (!cityRow || !scheme || scheme.neighborhoods.length < 2) return null;

    const baselineNetMargin =
      INDUSTRY_MARGINS.industries[measured.id]?.net_margin ??
      INDUSTRY_MARGINS.default_fallback?.net_margin ??
      0.08;
    const baselineRentShare = baselineRentShareFor(measured.id);

    const ranked = scheme.neighborhoods
      .map((n) => ({
        n,
        breakdown: getNeighborhoodNetMargin(
          city,
          n.slug,
          measured.id,
          baselineNetMargin,
          baselineRentShare,
        ),
        isCurated: hasNeighborhoodIntensity(city, n.slug),
      }))
      .sort((a, b) => {
        if (a.isCurated !== b.isCurated) return a.isCurated ? -1 : 1;
        return b.breakdown.neighborhoodNetMargin - a.breakdown.neighborhoodNetMargin;
      });

    const top = ranked[0];
    // The card claims a real best-corner read, so the winner must be a
    // hand-curated neighborhood with a defensibly positive net margin.
    if (!top.isCurated || top.breakdown.neighborhoodNetMargin < 0.08) return null;

    return {
      activity,
      city,
      label: `${raw.name} in ${cityRow.name}`,
      cityName: cityRow.name,
      neighborhood: top.n.name,
      marginPct: (top.breakdown.neighborhoodNetMargin * 100).toFixed(1),
      why: bestCornerWhy(top.breakdown.appliedTags),
    };
  },
).filter((e): e is WorkedExample => e != null);

// The section earns its place only with at least three clean reads; below that
// it self-omits rather than show a thin or lopsided row.
const SHOW_WORKED_EXAMPLES = WORKED_EXAMPLES.length >= 3;

export default function DecideLanding() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
      {/* Hero: lead with the decision, not the form. */}
      <SectionEyebrow size="md" className="mb-2">
        The founder decision
      </SectionEyebrow>
      <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-balance text-ink-900 mb-4 leading-tight">
        What business should you start, and where?
      </h1>
      <p className="mb-4 max-w-2xl font-serif text-xl leading-snug text-atlas-700 sm:text-2xl">
        The map can tell you where a given business keeps the most. It cannot
        tell you which business to run. That part is yours.
      </p>
      <p className="mb-10 max-w-2xl text-base leading-relaxed text-graphite md:text-lg">
        Two shops on the same street can turn over the same money and hand the
        owner very different pay once rent, wages, and the cost stack land. So
        this page does two things. It frames the choice of activity by what
        actually reaches an owner. Then it ranks a city's neighborhoods for the
        activity you pick, because the best corner is rarely the busiest one.
      </p>

      {/* Founder-decision read: best vs hardest by what reaches an owner. */}
      <FounderDecisionLede decision={FOUNDER_DECISION} />

      {/* Guided picker. The three-step wizard keeps state in the URL so each
          step is shareable and back-safe; it acts in place, discloses step 3
          only once a trade and a place are chosen, and links onward to the live
          neighbourhood ranking (which itself links to the cell). Readers with no
          client JS still reach the same answer through the worked-example links
          and the activity links in the lede above. */}
      <section className="mt-12 mb-12">
        <SectionEyebrow className="mb-3">Make it concrete</SectionEyebrow>
        <h2 className="mb-2 font-display text-2xl font-medium tracking-tight text-ink-900 md:text-3xl">
          Pick a trade and a place
        </h2>
        <p className="mb-5 max-w-2xl text-base leading-relaxed text-graphite">
          Atlas ranks every neighborhood by expected net margin, accounting for
          commuter density, tourism footfall, anomaly zones (financial centre,
          luxury district, gentrifying edge), and rent drag. Different
          activities peak in different neighborhoods of the same city.
        </p>
        <DecideWizard
          trades={WIZARD_TRADES}
          featuredTrades={FEATURED_TRADES}
          places={WIZARD_PLACES}
          featuredPlaces={FEATURED_PLACES}
          tradeNetMargin={TRADE_NET_MARGIN}
        />
      </section>

      {/* Worked examples: the method in action, not a leaderboard. Each card is
          resolved from live data at build time; the figure is the winning
          neighborhood's real net margin. The section self-omits below three. */}
      {SHOW_WORKED_EXAMPLES && (
        <section className="mb-12">
          <SectionEyebrow className="mb-3">See the method work</SectionEyebrow>
          <h2 className="mb-2 font-display text-2xl font-medium tracking-tight text-ink-900 md:text-3xl">
            Different business, different best corner
          </h2>
          <p className="mb-5 max-w-2xl text-base leading-relaxed text-graphite">
            Each card opens the live neighborhood ranking it came from. The figure
            is the net margin the activity holds in its strongest neighborhood,
            not a city average. They are picked to show the same point from
            different angles, not to rank cities against each other.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {WORKED_EXAMPLES.map((q) => (
              <Link
                key={`${q.activity}-${q.city}`}
                href={`/decide/${q.activity}/${q.city}`}
                className="atlas-card flex flex-col gap-2 p-5"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-700">
                    {q.cityName}
                  </div>
                  <div className="font-display text-2xl font-semibold tabular-nums leading-none text-atlas-800">
                    {q.marginPct}%
                  </div>
                </div>
                <h3 className="font-display text-lg font-medium leading-tight text-ink-900">
                  {q.label}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-graphite">
                  Best corner: {q.neighborhood}, where {q.why}.
                </p>
                <div className="pt-1 text-[11px] font-medium text-atlas-700">
                  Open the ranking &rarr;
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Methodology footnote. */}
      <section className="max-w-2xl text-xs leading-relaxed text-cocoa-500">
        Net margin combines four signals per neighborhood: commuter intensity
        (daytime workers per resident), tourism intensity (visitors per
        resident), a tag system for anomaly zones (financial centre, luxury
        district, tech corridor, and the like), and a per-tag rent multiplier.
        Coverage spans 252 cities and roughly 1,300 neighborhoods, with
        hand-curated data for the largest metros and a documented heuristic
        elsewhere. The activity read above uses curated, cross-country margin
        ratios, so it is a structural guide, not a local quote. Refine when you
        spot something off:{" "}
        <Link
          href="/methodology"
          className="font-medium text-atlas-700 underline decoration-atlas-300 underline-offset-2 hover:text-atlas-900 hover:decoration-atlas-700"
        >
          How we measure
        </Link>
        .
      </section>
    </article>
  );
}
