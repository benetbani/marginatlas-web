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
  resolveToMeasuredIndustry,
} from "@/lib/taxonomy";
import industryMarginsJson from "@/lib/finance/industry_margins.json";
import cityListJson from "../../../data/cities/city_list_v1.json";
import {
  generateFounderDecision,
  type FounderActivityInput,
} from "@/lib/scores/founder_decision";
import { FounderDecisionLede } from "@/components/decide/FounderDecisionLede";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Where should you open a business? | Margin Atlas",
  description:
    "Pick an activity and a city. Margin Atlas ranks every neighborhood by expected net margin, accounting for commuter density, tourism, and rent drag.",
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
const SMB_INDUSTRIES = INDUSTRIES.filter(
  (i) =>
    (i.audience || "smb_friendly") === "smb_core" ||
    (i.audience || "smb_friendly") === "smb_friendly",
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

// Worked examples that surface the framework's strongest point: different
// activities have different best neighborhoods in the same city. These are
// illustrations of the method, not a ranking. Each links to the live
// neighborhood ranking for that activity and city.
const WORKED_EXAMPLES: Array<{
  activity: string;
  city: string;
  label: string;
  rationale: string;
}> = [
  {
    activity: "pharmacies-drug-stores",
    city: "new-york",
    label: "Pharmacy in New York",
    rationale: "Harlem and Brooklyn clear Midtown once the rent is counted.",
  },
  {
    activity: "pet-stores",
    city: "new-york",
    label: "Pet shop in New York",
    rationale: "Brooklyn and the Upper East Side tie: one on volume, one on premium.",
  },
  {
    activity: "cafes-coffee",
    city: "london",
    label: "Cafe in London",
    rationale: "East London edges the City of London once rent is in the math.",
  },
  {
    activity: "restaurants",
    city: "paris",
    label: "Restaurant in Paris",
    rationale: "Tourist quarters lift revenue; Saint-Germain holds the net margin.",
  },
  {
    activity: "jewelry-stores",
    city: "tokyo",
    label: "Jewelry in Tokyo",
    rationale: "The central luxury district pulls clear of everywhere else.",
  },
  {
    activity: "fitness-gyms",
    city: "berlin",
    label: "Gym in Berlin",
    rationale: "The gentrifying east: rising incomes against rent that has not caught up.",
  },
];

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

      {/* Picker. Native HTML form -> GET /decide/go -> /decide/[activity]/[city] */}
      <section className="mt-12 mb-12">
        <SectionEyebrow className="mb-3">Make it concrete</SectionEyebrow>
        <h2 className="mb-2 font-display text-2xl font-medium tracking-tight text-ink-900 md:text-3xl">
          Pick an activity and a city
        </h2>
        <p className="mb-5 max-w-2xl text-base leading-relaxed text-graphite">
          Atlas ranks every neighborhood by expected net margin, accounting for
          commuter density, tourism footfall, anomaly zones (financial centre,
          luxury district, gentrifying edge), and rent drag. Different
          activities peak in different neighborhoods of the same city.
        </p>
        <div className="atlas-card p-6 md:p-8">
          <form
            action="/decide/go"
            method="get"
            className="grid grid-cols-1 items-end gap-4 md:grid-cols-[1fr_1fr_auto]"
          >
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-atlas-700">
                Activity
              </span>
              <select
                name="activity"
                required
                defaultValue="restaurants"
                className="rounded-lg border border-ink-200 bg-cream-50 px-3 py-2.5 text-sm font-medium text-ink-900 focus:border-atlas-700 focus:outline-none focus:ring-2 focus:ring-atlas-700/20"
              >
                {ACTIVITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-atlas-700">
                City
              </span>
              <select
                name="city"
                required
                defaultValue="new-york"
                className="rounded-lg border border-ink-200 bg-cream-50 px-3 py-2.5 text-sm font-medium text-ink-900 focus:border-atlas-700 focus:outline-none focus:ring-2 focus:ring-atlas-700/20"
              >
                {CITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="inline-flex items-center gap-2 self-stretch rounded-full bg-atlas-700 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-sm transition hover:bg-atlas-800 md:self-end"
            >
              Rank the neighborhoods &rarr;
            </button>
          </form>
        </div>
      </section>

      {/* Worked examples: the method in action, not a leaderboard. */}
      <section className="mb-12">
        <SectionEyebrow className="mb-3">See the method work</SectionEyebrow>
        <h2 className="mb-2 font-display text-2xl font-medium tracking-tight text-ink-900 md:text-3xl">
          Different business, different best corner
        </h2>
        <p className="mb-5 max-w-2xl text-base leading-relaxed text-graphite">
          Each of these opens the live neighborhood ranking. They are picked to
          show the same point from different angles, not to rank cities against
          each other.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {WORKED_EXAMPLES.map((q) => (
            <Link
              key={`${q.activity}-${q.city}`}
              href={`/decide/${q.activity}/${q.city}`}
              className="atlas-card flex flex-col gap-2 p-5"
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-700">
                {q.city.replace(/-/g, " ")}
              </div>
              <h3 className="font-display text-lg font-medium leading-tight text-ink-900">
                {q.label}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-graphite">
                {q.rationale}
              </p>
              <div className="pt-1 text-[11px] font-medium text-atlas-700">
                Open the ranking &rarr;
              </div>
            </Link>
          ))}
        </div>
      </section>

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
