/**
 * /_design/v2-review: the idle "v2" design language, put on a review table.
 *
 * Admin-gated by ?key=<ADMIN_KEY>, same pattern as /_design and
 * /_design/monetized. SAFE preview surface: it renders the v2 components on
 * MOCK data so the founder can decide, per surface, whether any v2 design is
 * worth promoting over its live v1 twin. Nothing here is wired onto a live
 * route. The v2 components currently carry ship-blockers (hardcoded hex, a
 * blue tier dot that is off the warm palette); each card below states them.
 *
 * Context: the 2026-06-02 audit proved the design EXPORT (set_17..20) is stale
 * and must not be ported. These v2 components, by contrast, already live in the
 * repo (src/components/v2) but sit unused. This page is the decision surface for
 * them. See docs/superpowers/specs/2026-06-02-graphics-rethink.md.
 *
 * No em-dashes. On-brand cream / parchment / ink / atlas for this page's own UI.
 */
import { notFound } from "next/navigation";
import { timingSafeEqualString } from "@/lib/rate_limit";

import CityHeroV2 from "@/components/v2/CityHeroV2";
import CountryScorecardV2 from "@/components/v2/CountryScorecardV2";
import CoverageHubV2 from "@/components/v2/CoverageHubV2";
import LondonRoadmap from "@/components/v2/LondonRoadmap";

type Verdict = "ship after fixes" | "skip" | "phase 2";

function VerdictPill({ verdict }: { verdict: Verdict }) {
  const tone =
    verdict === "ship after fixes"
      ? "bg-moss-100 text-moss-700"
      : verdict === "phase 2"
        ? "bg-cream-100 text-cocoa-700"
        : "bg-clay-100 text-clay-700";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wide font-semibold ${tone}`}>
      {verdict}
    </span>
  );
}

function ReviewCard({
  name,
  replaces,
  blockers,
  verdict,
  children,
}: {
  name: string;
  replaces: string;
  blockers: string;
  verdict: Verdict;
  children?: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-parchment bg-cream-50 overflow-hidden">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-3 border-b border-parchment bg-white">
        <code className="text-sm font-semibold text-ink-900">{name}</code>
        <VerdictPill verdict={verdict} />
        <span className="text-xs text-cocoa-700">replaces: {replaces}</span>
        <span className="basis-full text-xs text-clay-700">blockers: {blockers}</span>
      </header>
      {children ? (
        <div className="p-5 bg-cream-100">{children}</div>
      ) : (
        <div className="p-5 text-xs text-cocoa-700 italic">
          Live preview omitted: this card needs a Phosphor icon function as a
          prop, which cannot cross the server to client boundary on a static
          catalog page. See the fix list in the rethink spec.
        </div>
      )}
    </section>
  );
}

const SCORECARD_MOCK = {
  iso2: "de",
  name: "Germany",
  tier: "deep" as const,
  cellCount: 18450,
  industriesCovered: 65,
  citiesCovered: 12,
  yearRange: [2016, 2025] as [number, number],
  sampleIndustries: [
    { name: "Restaurants", cellCount: 850, href: "/de/restaurants" },
    { name: "Auto repair", cellCount: 720, href: "/de/auto-repair-shops" },
    { name: "IT services", cellCount: 680, href: "/de/it-services" },
    { name: "Consulting", cellCount: 540, href: "/de/management-consulting" },
    { name: "Bakeries", cellCount: 510, href: "/de/bakeries" },
    { name: "Plumbing", cellCount: 480, href: "/de/plumbing-services" },
  ],
  sampleCities: [
    { name: "Berlin", href: "/de/berlin" },
    { name: "Munich", href: "/de/munich" },
    { name: "Hamburg", href: "/de/hamburg" },
    { name: "Cologne", href: "/de/cologne" },
    { name: "Frankfurt", href: "/de/frankfurt" },
    { name: "Stuttgart", href: "/de/stuttgart" },
  ],
};

const COVERAGE_MOCK = {
  countries: [
    { iso2: "us", name: "United States", tier: "deep" as const, cellCount: 52000, lastRefreshed: "2025-12-16" },
    { iso2: "de", name: "Germany", tier: "deep" as const, cellCount: 18450, lastRefreshed: "2025-12-15" },
    { iso2: "gb", name: "United Kingdom", tier: "deep" as const, cellCount: 16200, lastRefreshed: "2025-12-14" },
    { iso2: "fr", name: "France", tier: "good" as const, cellCount: 12800, lastRefreshed: "2025-12-10" },
    { iso2: "es", name: "Spain", tier: "good" as const, cellCount: 9450, lastRefreshed: "2025-12-08" },
    { iso2: "ca", name: "Canada", tier: "good" as const, cellCount: 8900, lastRefreshed: "2025-12-12" },
    { iso2: "it", name: "Italy", tier: "starter" as const, cellCount: 4200, lastRefreshed: "2025-12-05" },
    { iso2: "au", name: "Australia", tier: "modeled" as const, cellCount: 1200, lastRefreshed: "2025-11-30" },
  ],
};

const HERO_MOCK = {
  cityName: "Munich",
  countryName: "Germany",
  iso2: "de",
  population: "1.5M",
  metroGdp: "$385B",
  medianWageUsd: 52000,
  typicalRevenueUsd: 420000,
  smbDensity: "245 per 100k",
  editorialBlurb:
    "Munich anchors southern Germany's small business base, with a dense mix of trades, food, and professional services around a high wage floor.",
  coverageTier: "measured" as const,
};

const NEW_FILES: Array<{ file: string; what: string; verdict: Verdict; why: string }> = [
  { file: "export: RolePay.tsx", what: "pay by role", verdict: "skip", why: "Salary by role. Hard founder steer against salary content." },
  { file: "export: MethodologyBlock.tsx", what: "methodology metadata", verdict: "skip", why: "Asks for a sources string. Risks naming source agencies (gate verify_no_source_agencies). about-data already covers this." },
  { file: "export: CostStructure.tsx", what: "P and L stacked bar", verdict: "skip", why: "Redundant. Live SmartWaterfall is a richer 13 line waterfall with confidence dots." },
  { file: "export: PeerCells.tsx", what: "peer cell grid", verdict: "phase 2", why: "Needs a peer fetch layer and a browse page that does not exist yet. Revisit if a peer page is greenlit." },
  { file: "export: BlogCoverCard.tsx", what: "blog covers", verdict: "skip", why: "Demo hardcoded SVGs for 3 fixed slugs. Cannot be data driven without a rewrite." },
  { file: "export: DecadeArticleLayout.tsx", what: "longform article", verdict: "skip", why: "Already superseded by the live editorial/LongformArticle.tsx in Atlas tokens." },
  { file: "export: styles/atlas-reform.css", what: "texture and palette", verdict: "skip", why: "Redefines --atlas-* with a conflicting terracotta palette under the same names. Would repaint the whole site." },
  { file: "export: niche districts mockup", what: "district markers and persona cards", verdict: "phase 2", why: "Clever vocabulary, but demo only and styled by the conflicting CSS. Rebuild in Atlas tokens if a niche signals surface is greenlit." },
];

export default async function V2Review({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const sp = await searchParams;
  const required = process.env.ADMIN_KEY;
  if (!required || !sp.key || !timingSafeEqualString(sp.key, required)) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="font-display text-3xl md:text-4xl font-medium text-ink-900">
        v2 design language, on the review table
      </h1>
      <p className="mt-2 text-sm text-cocoa-700 max-w-2xl leading-relaxed">
        A full parallel set of v2 components sits in the repo, unused. Their live
        v1 twins are what visitors see today. This page renders the v2 designs on
        mock data so you can decide, per surface, whether any is worth promoting.
        None is a free win: each carries ship blockers listed on its card.
      </p>

      <h2 className="mt-10 font-display text-2xl font-medium text-ink-900">
        New files: where they land
      </h2>
      <p className="mt-1 text-sm text-cocoa-700 max-w-2xl">
        Verdict on every net new file in the design export. Short version: nothing
        ships as is.
      </p>
      <div className="mt-4 rounded-lg border border-parchment overflow-hidden">
        {NEW_FILES.map((row, i) => (
          <div
            key={row.file}
            className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-2.5 text-sm ${i % 2 ? "bg-cream-50" : "bg-white"}`}
          >
            <code className="text-xs text-ink-900 w-64 shrink-0">{row.file}</code>
            <span className="w-28 shrink-0"><VerdictPill verdict={row.verdict} /></span>
            <span className="text-cocoa-700">{row.why}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-2xl font-medium text-ink-900">
        v2 components: the menu
      </h2>
      <div className="mt-4 space-y-8">
        <ReviewCard
          name="CountryScorecardV2"
          replaces="CountryAtAGlance + CountrySignaturePanel on /[country]"
          blockers="hardcoded hex tier dots, one blue dot (#2563EB) off the warm palette"
          verdict="ship after fixes"
        >
          <CountryScorecardV2 {...SCORECARD_MOCK} />
        </ReviewCard>

        <ReviewCard
          name="CoverageHubV2"
          replaces="nothing live (coverage currently redirects)"
          blockers="hardcoded hex tier dots incl. one blue dot (#2563EB)"
          verdict="ship after fixes"
        >
          <CoverageHubV2 {...COVERAGE_MOCK} />
        </ReviewCard>

        <ReviewCard
          name="CityHeroV2"
          replaces="CityHero on the cell page"
          blockers="hardcoded hex, blue dot, expects a remote photoUrl (shown here in fallback)"
          verdict="ship after fixes"
        >
          <CityHeroV2 {...HERO_MOCK} />
        </ReviewCard>

        <ReviewCard
          name="LondonRoadmap"
          replaces="nothing (illustrative only)"
          blockers="hardcoded hex throughout the SVG; London specific, not general"
          verdict="phase 2"
        >
          <LondonRoadmap />
        </ReviewCard>

        <ReviewCard
          name="SectorCardV2"
          replaces="the SectorMasterMenu tiles on the homepage"
          blockers="client component, ResizeObserver, needs an icon function prop, hardcoded hex"
          verdict="skip"
        />

        <ReviewCard
          name="FeaturedCardV2"
          replaces="FeaturedCellTile on the homepage"
          blockers="fixed 280x180 box, needs an icon function prop, hardcoded hex, blue dot"
          verdict="skip"
        />
      </div>

      <p className="mt-10 text-xs text-cocoa-700/70">
        Decision surface only. Promoting any v2 design is a separate, tested step:
        tokenize its hex, swap the blue tier dot for a warm token, then wire it
        behind a before and after on its route. Source: src/components/v2.
      </p>
    </div>
  );
}
