/**
 * /decide landing page.
 *
 * Editorial entry point for the decision wizard. Two-step picker:
 * pick an activity + pick a city, then navigate to
 * /decide/[activity]/[city] for the ranked-by-net-margin recommendation.
 *
 * Server component; the form is a plain HTML form so it works without
 * any client JS (mirrors the bulletproof NavigatorForm pattern).
 *
 * 2026-05-26 shipped alongside the city-page entry point.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { INDUSTRIES, industryToSlug } from "@/lib/taxonomy";
import cityListJson from "../../../data/cities/city_list_v1.json";
import { CountryFlag } from "@/components/CountryFlag";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Where should you open a business? | Margin Atlas",
  description:
    "Pick an activity and a city. Margin Atlas ranks every neighborhood by expected net margin, accounting for commuter density, tourism, and rent drag.",
};

type City = { slug: string; name: string; iso2: string; tier: number };
const CITIES = (cityListJson as { cities: City[] }).cities;

// Sort activities alphabetically, SMB-relevant only.
const ACTIVITY_OPTIONS = INDUSTRIES.filter(
  (i) => (i.audience || "smb_friendly") === "smb_core" || (i.audience || "smb_friendly") === "smb_friendly",
)
  .map((i) => ({ value: industryToSlug(i.id), label: i.name }))
  .sort((a, b) => a.label.localeCompare(b.label));

// Sort cities by tier (global first), then alphabetically.
const CITY_OPTIONS = [...CITIES]
  .sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return a.name.localeCompare(b.name);
  })
  .map((c) => ({ value: c.slug, label: `${c.name} (${c.iso2})` }));

// Pre-set "quick pick" combinations that surface the framework's
// strongest examples — different optimal neighborhoods per activity.
const QUICK_PICKS: Array<{
  activity: string;
  city: string;
  label: string;
  rationale: string;
}> = [
  {
    activity: "pharmacies-drug-stores",
    city: "new-york",
    label: "Pharmacy in New York",
    rationale: "Reveals why Harlem + Brooklyn beat Midtown on net margin.",
  },
  {
    activity: "pet-stores",
    city: "new-york",
    label: "Pet shop in New York",
    rationale: "Brooklyn + UES tied at the top. Brooklyn on volume, UES on premium.",
  },
  {
    activity: "cafes-coffee",
    city: "london",
    label: "Cafe in London",
    rationale: "East London (tech corridor) edges the City of London once rent is in.",
  },
  {
    activity: "restaurants",
    city: "paris",
    label: "Restaurant in Paris",
    rationale: "Louvre/Marais brings tourists; Saint-Germain holds net margin.",
  },
  {
    activity: "jewelry-stores",
    city: "tokyo",
    label: "Jewelry in Tokyo",
    rationale: "Central Tokyo (Ginza luxury) blows out everything else.",
  },
  {
    activity: "fitness-gyms",
    city: "berlin",
    label: "Gym in Berlin",
    rationale: "Mitte and East Berlin. Tech salaries + gentrifying demand.",
  },
];

export default function DecideLanding() {
  return (
    <article className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16">
      {/* Hero */}
      <div className="text-xs uppercase tracking-[0.18em] text-atlas-700 font-semibold mb-2">
        Decision wizard
      </div>
      <h1 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-ink-900 mb-4 leading-tight">
        Where should you open your business?
      </h1>
      <p className="text-base md:text-lg text-cocoa-700/80 mb-10 max-w-2xl leading-relaxed">
        Pick an activity and a city. Atlas ranks every neighborhood by
        expected NET MARGIN, accounting for commuter density, tourism
        footfall, anomaly zones (financial CBD, luxury district,
        gentrifying edge), and rent drag. Different activities have
        different optimal neighborhoods in the same city.
      </p>

      {/* Picker card. Native HTML form -> GET /decide/[activity]/[city] */}
      <div className="atlas-card p-6 md:p-8 mb-12">
        <form action="/decide/go" method="get" className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] uppercase tracking-[0.14em] text-atlas-700 font-semibold">
              Activity
            </span>
            <select
              name="activity"
              required
              defaultValue="restaurants"
              className="rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 font-medium focus:outline-none focus:border-atlas-700 focus:ring-2 focus:ring-atlas-700/20"
            >
              {ACTIVITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] uppercase tracking-[0.14em] text-atlas-700 font-semibold">
              City
            </span>
            <select
              name="city"
              required
              defaultValue="new-york"
              className="rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 font-medium focus:outline-none focus:border-atlas-700 focus:ring-2 focus:ring-atlas-700/20"
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
            className="px-5 py-2.5 rounded-full bg-atlas-700 hover:bg-atlas-800 text-cream-50 font-semibold text-sm shadow-sm transition inline-flex items-center gap-2 self-stretch md:self-end"
          >
            Rank the neighborhoods &rarr;
          </button>
        </form>
      </div>

      {/* Quick picks */}
      <section className="mb-12">
        <h2 className="font-display text-xl md:text-2xl font-semibold text-ink-900 mb-5">
          Try one of these
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_PICKS.map((q) => (
            <Link
              key={`${q.activity}-${q.city}`}
              href={`/decide/${q.activity}/${q.city}`}
              className="atlas-card p-5 flex flex-col gap-2"
            >
              <div className="text-[10px] uppercase tracking-[0.14em] text-atlas-700 font-semibold">
                {q.city.replace(/-/g, " ")}
              </div>
              <h3 className="font-display text-lg font-semibold text-ink-900 leading-tight">
                {q.label}
              </h3>
              <p className="text-xs text-cocoa-700/80 leading-relaxed">
                {q.rationale}
              </p>
              <div className="text-[11px] text-atlas-700 font-medium pt-1">
                Open ranking &rarr;
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Methodology footnote */}
      <section className="text-xs text-cocoa-700/70 max-w-2xl leading-relaxed">
        Net margin combines four signals per neighborhood: commuter
        intensity (daytime workers per resident), tourism intensity
        (visitors per resident), a 13-tag anomaly system (financial
        CBD, luxury district, tech corridor, etc), and a per-tag rent
        multiplier. Coverage: 252 cities, ~1300 neighborhoods, with
        hand-curated A-quality data for top 10 cities and heuristic
        C-quality everywhere else. Refine when you spot something off:{" "}
        <Link
          href="/methodology"
          className="text-atlas-700 font-medium hover:text-atlas-900 underline decoration-atlas-300 hover:decoration-atlas-700 underline-offset-2"
        >
          How we measure
        </Link>
        .
      </section>
    </article>
  );
}
