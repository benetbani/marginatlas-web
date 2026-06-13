/**
 * Industry landing page - /industries/{slug}.
 *
 * Reformation (bible Section 5, the Industry page row: "How [industry]
 * businesses make money", whose distinctive move is to show the "business
 * model anatomy"). The page now leads with an opinionated read of HOW this
 * kind of business makes money: where each dollar of a sale goes, how little
 * tends to survive to the bottom line, and what quietly kills the weak
 * operators. The decision framing comes from a pure synthesis module
 * (src/lib/scores/industry_verdict) fed only the data this page already loads,
 * the same established pattern as the cell-page verdict and the country verdict.
 *
 * Country-page rebuild §8 (2026-05-25): cross-country aggregate sections were
 * removed sitewide. Previously the page rendered three sections built from a
 * global cross-country revenue aggregate:
 *
 *   - industry-tiles (p10 / p50 / p90 across country medians)
 *   - revenue-distribution (log-normal curve from the same aggregate)
 *   - top-countries (countries ranked by typical revenue)
 *
 * The underlying extrapolated_cells data has wrong-aggregation tails that pull
 * the global picture to nonsense (India carpenters $11.6M sitting next to
 * Germany at $118K). Global averages are also misleading for any small-business
 * question because cost structure varies massively by country. The page keeps
 * only what is true worldwide: the curated cost-structure margins and the
 * model anatomy built from them. There is NO cross-place ranking here on
 * purpose.
 *
 * Place selection happens ONCE, at the top: the reader picks a country and
 * city in the lead place picker right under the hero, which routes straight to
 * that activity's cell page (/{country}/{geo}/{industry}), where the
 * country-specific revenue, employment, and cost benchmarks live.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  INDUSTRIES,
  INDUSTRIES_BY_SECTOR,
  INDUSTRY_BY_ID,
  SECTOR_BY_ID,
  industryToSlug,
  slugToIndustry,
  resolveToMeasuredIndustry,
  isDefaultVisible,
} from "@/lib/taxonomy";
import { MarginWaterfall } from "@/components/MarginWaterfall";
import industryMarginsJson from "@/lib/finance/industry_margins.json";
import { INDUSTRY_PAGE_SECTIONS } from "@/lib/page-layout/section-order";
import { getActivityCharacter } from "@/lib/content/activity_character";
import { generateIndustryVerdict } from "@/lib/scores/industry_verdict";
import { IndustryModelLede } from "@/components/industries/IndustryModelLede";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import {
  getSameIndustryAcrossCountries,
  getSameIndustryAcrossStates,
  cellUrl,
  withBudget,
  type Cell,
} from "@/lib/cells";
import { iso2ToName } from "@/lib/countries";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import { clampMargin } from "@/lib/finance/margin_floor";
import { BoardHero } from "@/components/board/BoardHero";
import { DataSection } from "@/components/board/DataSection";
import { StatCard } from "@/components/board/StatCard";
import { ActivityPlacePicker } from "@/components/industries/ActivityPlacePicker";
import { fmtPct } from "@/components/board/format";
import { TakeHomeValue } from "@/components/monetization/TakeHomeValue";
import {
  buildActivityBoard,
  summarizeActivityPlaces,
  getActivitySurvivalArchetype,
  type ActivityPlaceInput,
} from "@/lib/scores/activity_board";

void INDUSTRY_PAGE_SECTIONS;

export const revalidate = 86400;
export const dynamicParams = true;

type Params = { industry: string };

type IndustryMarginRow = {
  gross_margin: number;
  operating_margin: number;
  net_margin: number;
  asset_intensity?: number;
  notes?: string;
};
const INDUSTRY_MARGINS = industryMarginsJson as unknown as {
  default_fallback: IndustryMarginRow;
  industries: Record<string, IndustryMarginRow>;
};

function lookupIndustryMargin(industryId: string | null | undefined): IndustryMarginRow {
  if (!industryId) return INDUSTRY_MARGINS.default_fallback;
  return INDUSTRY_MARGINS.industries[industryId] || INDUSTRY_MARGINS.default_fallback;
}

// Cap build-time static generation. The rest render on
// demand via dynamicParams=true.
const STATIC_INDUSTRY_CAP = 30;

export async function generateStaticParams(): Promise<Params[]> {
  return INDUSTRIES
    .filter((i) => (i.audience || "smb_friendly") === "smb_core")
    .slice(0, STATIC_INDUSTRY_CAP)
    .map((i) => ({ industry: industryToSlug(i.id) }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { industry } = await params;
  const raw = slugToIndustry(industry);
  const ind = resolveToMeasuredIndustry(raw) || raw;
  if (!ind) return { title: "Activity not found | Margin Atlas" };
  return {
    title: `${ind.name}: small-business benchmarks | Margin Atlas`,
    description: `Margin structure and cost stack for ${ind.name.toLowerCase()}. Pick a country for revenue benchmarks.`,
    alternates: { canonical: `/industries/${industry.toLowerCase()}` },
  };
}

export default async function IndustryPage({ params }: { params: Promise<Params> }) {
  const { industry } = await params;
  const raw = slugToIndustry(industry);
  const ind = resolveToMeasuredIndustry(raw) || raw;
  if (!ind) notFound();

  const sector = ind ? SECTOR_BY_ID[ind.sector_id] : null;
  const margin = lookupIndustryMargin(ind.id);
  const character = getActivityCharacter(ind.id);
  const activitySlug = industryToSlug(ind.id);

  // Cross-place slate for the data board's revenue range and the "where it
  // works" table. Both fetches are wrapped in withBudget so a slow query
  // degrades to an empty slate (the range dashes, the table omits) instead of
  // hanging the route. The cross-country query already drops rows outside the
  // per-industry SMB revenue envelope (the same bounds the triage layer uses),
  // so the obvious garbage tails the founder named are gone before they reach
  // this page; the board applies a second median-relative trim on top. US
  // states come from the trusted Census-backed table (same currency, same wage
  // scale); the bogus exclude id "US-00" passes the query's "US-" guard while
  // excluding nothing real.
  //
  // IMPORTANT: never a single worldwide revenue average. These rows feed a
  // defensible p10..p90 band (see summarizeActivityPlaces), not a mean.
  const [acrossCountries, acrossStates] = await Promise.all([
    withBudget(
      getSameIndustryAcrossCountries(activitySlug, "", 24),
      [],
      4_000,
      "activityAcrossCountries",
    ),
    withBudget(
      getSameIndustryAcrossStates(activitySlug, "US-00", 24),
      [],
      4_000,
      "activityAcrossStates",
    ),
  ]);

  // One covered place, with its activity's typical revenue and the modeled
  // after-tax owner take-home computed by the same tax-aware estimator the cell
  // page uses. Pure per-place compute, no extra query. Net margin is floored
  // defensively (never a sub-3% net reaches the page), exactly as the cell page
  // does. Rows without a usable revenue are dropped; the board ranks and trims
  // whatever remains.
  // Tag each place with its like-for-like cohort at the source: the
  // across-states slate is US states (one country, one currency, comparable
  // prices), the across-countries slate is foreign countries (raw USD, not
  // price-adjusted). The "where it works" table below keeps the two apart and
  // never prints a single global rank that mixes them, which is what let a
  // poorer country appear to out-earn a richer one.
  const placeInputs: ActivityPlaceInput[] = [
    ...acrossStates.map((c) => activityPlaceFromCell(c, ind.id, "us-state")),
    ...acrossCountries.map((c) => activityPlaceFromCell(c, ind.id, "country")),
  ].filter((p): p is ActivityPlaceInput => p !== null);

  // Defensible cross-place summary: trimmed revenue + take-home bands and the
  // ranked rows for the table. Thin slates yield all-null bands (dashes) and a
  // short or empty table, never an invented spread.
  const placesSummary = summarizeActivityPlaces(placeInputs);

  // The activity data board. Structural margins (place-stable) plus the trimmed
  // cross-place bands plus a representative survival curve for the activity.
  // Every section and every row is always present; a datum we do not hold shows
  // as the board's dash. This is the activity-altitude sibling of the cell,
  // country, and city boards.
  const board = buildActivityBoard({
    margins: {
      grossMargin: margin.gross_margin ?? null,
      operatingMargin: margin.operating_margin ?? null,
      netMargin: margin.net_margin ?? null,
    },
    revenue: placesSummary.revenue,
    takeHome: placesSummary.takeHome,
    survival: getActivitySurvivalArchetype(activitySlug),
  });
  // Split the ranked rows into like-for-like cohorts, capped so each stays
  // scannable. US states keep the take-home ranking: one country, one currency,
  // broadly comparable prices. Countries are listed in name order as
  // price-unadjusted facts, never ranked by raw USD, because a larger dollar
  // figure across borders does not mean a better business (the founder's
  // "a poorer country out-earns a richer one" failure). The board already
  // carries the cross-place spread, so these tables are about which places to
  // open next, not a single global league table.
  const stateRows = placesSummary.rows
    .filter((r) => r.cohort === "us-state")
    .slice(0, 12);
  const countryRows = placesSummary.rows
    .filter((r) => r.cohort === "country")
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 12);
  const hasPlaceCohorts = stateRows.length >= 2 || countryRows.length >= 2;

  // Split the board for the reframed layout (founder feedback, 2026-06-06). The
  // economics section ("numbers") keeps its full DataSection treatment (the
  // structural margins, the cross-place revenue RANGE, the SpreadBar) and is
  // demoted BELOW the place picker as "the shape before you pick a place". The
  // four qualitative sections (market structure, pricing power, labor, survival)
  // each render as their own small titled table (the StatCard look) rather than
  // one flat run of mostly-dashed rows, so each reads as an intentional little
  // table even where a field is genuinely unheld. The split is by key, so the
  // board module stays the single source of section content.
  const economicsSection = board.find((s) => s.key === "numbers") ?? null;
  const qualitativeSections = board.filter((s) => s.key !== "numbers");

  // Reformation decision layer (bible Sections 4, 5, 25). Pure compute, no
  // queries: the opinionated business-model read and the cost-stage anatomy
  // come from the curated margin structure this page already loads, plus the
  // activity character when one is written. Every clause self-omits on null.
  //
  // The activity-character edge and watch-out are deliberately NOT fed to the
  // verdict here: they each own a dedicated module further down the flow (the
  // best-operators note inside the lede, and the failure-mechanics card below
  // the waterfall). Withholding them from the verdict lets its closing line
  // speak the structural failure read from the margin shape instead of
  // repeating a sentence the page already shows in full.
  const verdict = generateIndustryVerdict({
    industryName: ind.name,
    margins: {
      grossMargin: margin.gross_margin ?? null,
      operatingMargin: margin.operating_margin ?? null,
      netMargin: margin.net_margin ?? null,
      assetIntensity: margin.asset_intensity ?? null,
    },
  });

  // The search-sensible money question (bible Section 5 headline formula). It
  // is now the how-it-works section H2 (the board title is the plain H1); the
  // page <title> stays the benchmark phrasing, set in generateMetadata above.
  const moneyQuestion = `How ${ind.name.toLowerCase()} businesses make money`;

  // The single most punishing cost stage, read straight from the verdict
  // anatomy this page already computes. It anchors the failure-mechanics module
  // below the waterfall: the structural reason weak operators run out of room.
  // Falls back to null when no stage reads "bad", so the module self-suppresses.
  const worstSignal = verdict.signals.find((s) => s.tone === "bad") ?? null;

  // Related activities (bible Section 6 module 28, a FREE module): the other
  // small-business models that sit in the same sector. This is taxonomy data
  // the page already loads, NOT a cross-place ranking. It self-suppresses when
  // a sector has no other measured siblings. Capped so the rail stays scannable.
  const relatedActivities = (INDUSTRIES_BY_SECTOR[ind.sector_id] || [])
    .filter((sib) => sib.id !== ind.id && isDefaultVisible(sib))
    .slice(0, 8);

  void INDUSTRY_BY_ID;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm text-ink-700/70 mb-4">
        <a href="/" className="hover:text-atlas-600">Home</a>
        <span className="mx-2">/</span>
        <a href="/industries" className="hover:text-atlas-600">Activities</a>
        <span className="mx-2">/</span>
        <span>{ind.name}</span>
      </nav>

      {/* 1. hero. Rebuilt on the board kit (2026-06-05) to match the cell,
         country, and city pages. The heavy full-bleed photo hero with the
         money-question H1 overlaid was replaced by the quiet BoardHero (plain
         activity name), so the title reaches above the fold in the same fixed
         scaffold the reader learns once and reads on every page. An activity
         has no single Atlas score, so the score strip is passed empty and
         renders as a dash. The country eyebrow becomes a small sector eyebrow
         above the title. The decision-framed money question and the cost-stage
         anatomy keep their full prose treatment in how-it-works directly below.
         The id="hero" anchor is kept so the section-order gate sees the
         canonical first beat. */}
      <section id="hero" className="pb-2">
        {sector ? (
          <SectionEyebrow size="md" className="mt-4">
            {sector.name}
          </SectionEyebrow>
        ) : null}
        <BoardHero title={ind.name} score={{ overall: null, parts: [] }} />

        {/* The hero action (founder feedback, 2026-06-06). A visitor who clicked
           their own line of work does not want the place-agnostic worldwide
           numbers first; they want to pick THEIR place. So the page leads with a
           prominent country + city picker that routes straight to that
           activity's cell page for the chosen place
           (/{country}/{city}/{activity}). The worldwide shape is demoted below
           it. */}
        <div className="mt-4">
          <ActivityPlacePicker activityId={ind.id} activityName={ind.name} />
        </div>

        {/* Across-cities comparison CTA (founder's chosen comparison default).
           A reader who has not settled on a place yet wants to see this one
           business laid out across the major world cities, side by side. The
           programmatic comparison lives at /industries/{slug}/across; it self-
           omits cleanly when too few cities resolve, so the link is always safe
           to show (it lands on a graceful pointer in the rare thin case). */}
        <Link
          href={`/industries/${activitySlug}/across`}
          className="group mt-3 inline-flex items-center gap-2 rounded-full border border-parchment bg-cream-50 px-4 py-2 text-sm font-medium text-ink-900 transition-colors hover:border-atlas-300 hover:bg-cream-100"
        >
          <span>
            Not sure where? See {ind.name.toLowerCase()} across the world&apos;s
            cities
          </span>
          <span aria-hidden="true" className="text-atlas-700 transition-transform group-hover:translate-x-0.5">
            &rarr;
          </span>
        </Link>
      </section>

      {/* The activity economics, demoted (founder feedback, 2026-06-06). This
         was the board's lead section; it now sits BELOW the place picker, framed
         as the worldwide shape a reader sees before choosing a place. It keeps
         the structural margins and the defensible cross-place revenue RANGE (a
         p10..p90 band, never a single worldwide average) with its SpreadBar. The
         DataSection always renders every row; a datum we do not hold shows as
         the board's dash, so the shape never depends on the data. */}
      {economicsSection ? (
        <div className="mt-8">
          <SectionEyebrow size="md">
            The shape, before you pick a place
          </SectionEyebrow>
          <p className="mt-1.5 mb-1 max-w-2xl text-sm leading-relaxed text-cocoa-700/80">
            What holds across places: the cost shape, and the low-to-high revenue
            spread. The dollars themselves land once you pick a place above.
          </p>
          <DataSection section={economicsSection} />
        </div>
      ) : null}

      {/* The qualitative reads, each as its own small titled table (founder
         feedback, 2026-06-06). Market structure, pricing power, labor and
         skills, and the survival baseline used to render as one flat run of
         mostly-dashed rows. Each is now its own branded StatCard table, clearly
         delineated, so a section reads as an intentional small table even where
         a field is genuinely unheld (it shows the board dash). Survival carries
         a representative archetype where one is held; the others are named-but-
         unheld at this worldwide altitude today and fill in as archetypes are
         curated. The cards sit two-up from md so they stay scannable. */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {qualitativeSections.map((s) => (
          <StatCard
            key={s.key}
            title={s.title}
            stats={s.rows}
            footnote={
              s.modeled
                ? "Modeled from national business demography. Directional."
                : undefined
            }
          />
        ))}
      </div>

      {/* Where it works. The covered places where this activity keeps the most
         for its owner, ranked by modeled after-tax take-home, best at the top.
         Each row links to that place's full benchmark for this activity. Built
         from the cross-place slate the board already loaded and trimmed; garbage
         tails are dropped upstream, so a corrupt place can never headline. The
         whole block omits cleanly when the slate is thin (fewer than two
         places), never showing an invented ranking. No count-of-things copy. */}
      {hasPlaceCohorts && (
        // SaaS reformation 2026-06-12: seated card sections on the app
        // ground, matching the board language site-wide. Data-sanity 2026-06-13:
        // split into like-for-like cohorts so we never rank a US state's USD
        // figure against a foreign country's across price regimes.
        <section className="mt-5 rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6">
          <SectionEyebrow>Where it works</SectionEyebrow>
          <h2 className="mt-1 font-display text-xl md:text-2xl font-medium tracking-tight text-balance text-ink-900">
            Where {ind.name.toLowerCase()} earn more, and where less
          </h2>
          <p className="mt-1.5 mb-5 max-w-2xl text-sm md:text-base leading-relaxed text-cocoa-700/80">
            The places we cover for {ind.name.toLowerCase()}. US states sit on
            one currency and one tax system, so we rank them by what a typical
            owner keeps. Countries we list side by side, not ranked, because a
            raw dollar figure is not adjusted for local prices. Open any row for
            the full revenue, cost stack, and survival read. Modeled and
            directional.
          </p>

          {stateRows.length >= 2 && (
            <div>
              <SectionEyebrow size="md">Across US states</SectionEyebrow>
              <p className="mt-1 mb-2 text-[11px] leading-relaxed text-cocoa-500">
                Ranked by modeled after-tax owner take-home. Best at the top.
              </p>
              <ul className="divide-y divide-parchment border-y border-parchment">
                {stateRows.map((p, i) => (
                  <li key={`${p.href}-${i}`}>
                    <Link
                      href={p.href}
                      className="group flex items-baseline justify-between gap-3 py-2.5 transition-colors"
                    >
                      <span className="flex min-w-0 items-baseline gap-2.5">
                        <span className="w-5 shrink-0 text-[11px] tabular-nums text-cocoa-500">
                          {i + 1}
                        </span>
                        <span className="truncate text-sm font-medium text-ink-900 transition-colors group-hover:text-atlas-700">
                          {p.name}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-baseline gap-3">
                        {p.netMarginPct != null && (
                          <span className="hidden text-[11px] tabular-nums text-cocoa-500 sm:inline">
                            {fmtPct(p.netMarginPct)} net
                          </span>
                        )}
                        <span className="font-display text-base font-semibold tabular-nums text-ink-900">
                          <TakeHomeValue takeHome={p.takeHome} cellHref={p.href} />
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {countryRows.length >= 2 && (
            <div className={stateRows.length >= 2 ? "mt-7" : ""}>
              <SectionEyebrow size="md">Across countries we cover</SectionEyebrow>
              <p className="mt-1 mb-2 text-[11px] leading-relaxed text-cocoa-500">
                In name order, not ranked. Net margin is comparable across
                borders, take-home is in US dollars and not adjusted for local
                prices, so read each on its own.
              </p>
              <ul className="divide-y divide-parchment border-y border-parchment">
                {countryRows.map((p, i) => (
                  <li key={`${p.href}-${i}`}>
                    <Link
                      href={p.href}
                      className="group flex items-baseline justify-between gap-3 py-2.5 transition-colors"
                    >
                      <span className="truncate text-sm font-medium text-ink-900 transition-colors group-hover:text-atlas-700">
                        {p.name}
                      </span>
                      <span className="flex shrink-0 items-baseline gap-3">
                        {p.netMarginPct != null && (
                          <span className="text-[11px] tabular-nums text-cocoa-500">
                            {fmtPct(p.netMarginPct)} net
                          </span>
                        )}
                        <span className="font-display text-base font-medium tabular-nums text-cocoa-700/80">
                          <TakeHomeValue takeHome={p.takeHome} cellHref={p.href} />
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-3 text-[11px] text-cocoa-500">
            Owner take-home is after tax, for a typical single-site operator. The
            same activity reads differently once local rent, wages, and tax land
            on it.
          </p>
        </section>
      )}

      {/* 1b. how-it-works: the opinionated business-model read and the
         cost-stage anatomy, built from the curated margins by the
         industry-verdict synthesis module. This is the "found nowhere else"
         decision layer. The block always renders (margins fall back to a
         conservative SMB default), but every individual clause and signal
         self-omits when its input is missing. When an activity character is
         written, its one-line hook frames the lede and the hand-written
         mechanics add the depth the margin synthesis alone cannot reach. */}
      <section
        id="how-it-works"
        className="mt-5 rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6"
      >
        {/* The decision-framed money question is the page's primary search
           heading. It moved here from the retired photo hero so the H1 above
           can stay the plain board title; this reads as the section H2. */}
        <h2 className="mb-4 font-display text-2xl md:text-3xl font-medium tracking-tight text-balance text-ink-900">
          {moneyQuestion}
        </h2>
        <IndustryModelLede verdict={verdict} edge={character?.edge ?? null} />
        {character && (
          <div className="mt-8 max-w-3xl space-y-5">
            {/* The hand-written mechanics: how the money actually works, in the
               operator's own terms. This is the editorial depth a margin
               readout cannot carry. */}
            <div className="rounded-xl border border-parchment bg-cream-50 p-5">
              <div className="text-[10px] uppercase tracking-[0.16em] text-atlas-700 font-semibold mb-2">
                How the money actually works
              </div>
              <p className="font-serif text-base leading-snug text-ink-900 mb-2">
                {character.hook}
              </p>
              <p className="text-sm text-graphite leading-relaxed">{character.economics}</p>
            </div>
            {character.categoryNote && (
              <p className="text-sm text-cocoa-700/85 italic leading-relaxed border-l-2 border-atlas-300 pl-3">
                {character.categoryNote}
              </p>
            )}
          </div>
        )}
      </section>

      {/* 2. margin-waterfall: where each dollar of a sale actually goes. The
         curated cost-structure margins are stable across countries within an
         activity (a restaurant's payroll-as-share-of-revenue is similar in
         Berlin and Brazil). The cell page scales them against country-specific
         revenue; here they carry the model anatomy. */}
      <section
        id="margin-waterfall"
        className="mt-5 rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6"
      >
        <SectionEyebrow className="mb-3">Where each dollar goes</SectionEyebrow>
        <p className="max-w-2xl text-base leading-relaxed text-graphite mb-4">
          Each bar takes a typical sale one cut deeper: what survives the direct
          cost of goods, what running the business leaves, and what reaches the
          bottom line. The gap between the top bar and the bottom one is the
          whole game.
        </p>
        <MarginWaterfall
          grossMargin={margin.gross_margin}
          operatingMargin={margin.operating_margin}
          netMargin={margin.net_margin}
        />
        {margin.notes && !/Cloned from|Wave \d|To-?Do|Fix-?Me/i.test(margin.notes) && ( // allow-internal-note
          <p className="mt-2 text-xs text-ink-700/60 italic max-w-2xl">
            {margin.notes}
          </p>
        )}
      </section>

      {/* 3. what kills weak operators (bible Section 6 module 22, a FREE
         module). The flow beat between "where each dollar goes" and "where this
         plays out": once the reader sees how little survives, name what takes
         the rest of it from the weak operators. Built only from data already
         loaded: the hand-written watch-out, and the single most punishing cost
         stage read from the verdict anatomy. No <section id=>, so it sits
         OUTSIDE the canonical industry-page skeleton (hero / how-it-works /
         margin-waterfall) without disturbing the gate. The whole block
         self-suppresses when neither input exists. */}
      {(character?.watchOut?.trim() || worstSignal) && (
        <section className="mt-5 rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6">
          <SectionEyebrow className="mb-2">What kills the weak operators</SectionEyebrow>
          <h2 className="font-display text-lg md:text-xl font-semibold tracking-tight text-ink-900">
            Where the margin gets taken back
          </h2>
          <div className="mt-5 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
            {character?.watchOut?.trim() && (
              <div className="rounded-xl border-l-2 border-clay-700 border-y border-r border-parchment bg-white p-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-clay-700">
                  The trap
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-900">
                  {character.watchOut}
                </p>
              </div>
            )}
            {worstSignal && (
              <div className="rounded-xl border border-parchment bg-white p-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-cocoa-500">
                  The structural reason
                </div>
                <p className="mt-2 text-sm leading-relaxed text-graphite">
                  <span className="font-serif capitalize text-clay-700">
                    {worstSignal.label}: {worstSignal.word}.
                  </span>{" "}
                  {worstSignal.note}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. related activities (bible Section 6 module 28, a FREE module). The
         closing rail: the other small-business models in this sector, so a
         reader who has learned to read one model anatomy can jump to a
         neighbouring one. Pure taxonomy, NOT a cross-place ranking. No
         <section id=>, so it stays outside the canonical skeleton; the whole
         block self-suppresses when the sector has no other measured siblings. */}
      {relatedActivities.length > 0 && (
        <section className="mt-5 mb-8 rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6">
          <SectionEyebrow className="mb-1">Related activities</SectionEyebrow>
          <h2 className="font-display text-lg md:text-xl font-semibold tracking-tight text-ink-900">
            Other ways to make money{sector ? ` in ${sector.name.toLowerCase()}` : ""}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-cocoa-700/85 max-w-2xl">
            Each reads its own way once the cost stack and the capital bar land.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedActivities.map((sib) => (
              <a
                key={sib.id}
                href={`/industries/${industryToSlug(sib.id)}`}
                className="group rounded-xl border border-parchment bg-white p-4 transition-colors hover:bg-cream-50"
              >
                <div className="text-sm font-semibold text-ink-900 group-hover:text-atlas-700">
                  {sib.name}
                </div>
                {sib.examples && sib.examples.length > 0 && (
                  <div className="mt-1 text-xs leading-relaxed text-cocoa-500 line-clamp-2">
                    {sib.examples.slice(0, 3).join(", ")}
                  </div>
                )}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * Turn one cross-place Cell into a place row for the activity board's range +
 * "where it works" table, or null when the place has no usable typical revenue
 * (those are dropped rather than guessed).
 *
 * Owner take-home is the modeled after-tax net profit from the same tax-aware
 * estimator the cell page uses, so the worldwide table and the per-place cell
 * page agree on the method. The net margin is floored defensively (clampMargin)
 * exactly as on the cell page, so no sub-3% net leaks into the table. The href
 * points at that place's cell page for this activity via the shared cellUrl
 * shape, so every row resolves to a real benchmark.
 */
function activityPlaceFromCell(
  cell: Cell,
  industryId: string | null,
  cohort: "us-state" | "country",
): ActivityPlaceInput | null {
  const typicalRevenue = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  if (typicalRevenue == null || !(typicalRevenue > 0)) return null;

  const net = estimateNetProfit({
    iso2: cell.country.toUpperCase(),
    geoId: cell.geo_id || null,
    industryId: industryId,
    sectorId: cell.sector_id || null,
    grossRevenue: typicalRevenue,
    payroll: null,
  });
  const netMarginPct =
    net.net_margin != null
      ? clampMargin(net.net_margin, "net", industryId) * 100
      : null;
  const takeHome = net.net_profit ?? null;

  const name =
    cell.geo_name || iso2ToName(cell.country) || cell.country.toUpperCase();

  return {
    name,
    href: cellUrl(cell),
    typicalRevenue,
    takeHome: takeHome != null && takeHome > 0 ? takeHome : null,
    netMarginPct,
    cohort,
  };
}
