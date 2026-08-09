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
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import {
  getSameIndustryAcrossCountries,
  getSameIndustryAcrossStates,
  withBudget,
} from "@/lib/cells";
// activityPlaceFromCell used to be defined at the bottom of this file, which
// made this page the only place in the codebase that could compute the
// masthead's revenue figure. The social card at /og/industry has to print the
// same number, so the mapper moved to a module both can import. The data flow
// below is unchanged; only where the function lives changed.
import {
  activityPlaceFromCell,
  US_STATE_SLATE_EXCLUDE,
  US_STATE_SLATE_LIMIT,
  US_STATE_SLATE_BUDGET_MS,
} from "@/lib/industries/headline_band";
import { ActivityPlacePicker } from "@/components/industries/ActivityPlacePicker";
import { fmtPct } from "@/components/board/format";
import { TakeHomeValue } from "@/components/monetization/TakeHomeValue";
import { AtlasPictogram } from "@/components/brand/pictograms/AtlasPictogram";
import { industryPictogramId } from "@/lib/brand/industry_pictogram";
import {
  AnswerFirstMasthead,
  BeatCard,
  HonestTakeBox,
  MoneyGoesBreakdown,
  PlainTerms,
  StickySectionNav,
  SectionEmpty,
  formatWithSpec,
  HeroWash,
  OneThing,
  CostDrivers,
} from "@/components/kit";
import {
  buildIndustryView,
  industryViewNav,
  cleanTradeName,
} from "@/lib/industries/industry_view";
import {
  summarizeActivityPlaces,
  getActivitySurvivalArchetype,
  type ActivityPlaceInput,
} from "@/lib/scores/activity_board";
import { isSpineReformEnabledFor } from "@/lib/feature_flags";
import { SpineShell } from "@/components/spine/shell";
import { SpineIndustryBody } from "@/components/spine/industry/industry-view";
import { buildSpineIndustrySeed } from "@/lib/spine/adapt_industry";

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
  // Same guard as the page body: prefer the requested trade when it has its own
  // measured margin row, so the title matches the page (hair-salons must not
  // resolve to cleaning-services).
  const ind =
    raw && INDUSTRY_MARGINS.industries[raw.id]
      ? raw
      : resolveToMeasuredIndustry(raw) || raw;
  if (!ind) return { title: "Activity not found | Margin Atlas" };
  const title = `${ind.name}: small-business benchmarks | Margin Atlas`;
  const description = `Margin structure and cost stack for ${ind.name.toLowerCase()}. Pick a country for revenue benchmarks.`;
  const canonical = `/industries/${industry.toLowerCase()}`;
  // The card is handed the RESOLVED activity slug, not the raw route param, so
  // it shows the trade this page actually rendered. A request for hair-salons
  // that resolves to a parent must not produce a card titled with the parent
  // while the page is titled with the child, or the reverse.
  const ogPath = `/og/industry?industry=${encodeURIComponent(industryToSlug(ind.id))}`;
  return {
    title,
    description,
    alternates: { canonical },
    // title, description and images are all repeated below rather than
    // inherited. Next resolves metadata per KEY by replacement, not by deep
    // merge, so declaring openGraph at all discards the root layout's
    // openGraph, images included. Same for twitter. See the note in
    // src/app/layout.tsx.
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: ogPath, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogPath],
    },
  };
}

export default async function IndustryPage({ params }: { params: Promise<Params> }) {
  const { industry } = await params;

  // Spine reform (flag-gated, default OFF). Promoted to real data: the spine body
  // now renders the reconciled per-industry seed from buildSpineIndustrySeed
  // (driven from the margin table + the real where_pays across cities + synthesis),
  // never the bundled illustrative seed. A slug that resolves to no industry falls
  // through to notFound(), matching the non-spine page. Flag OFF path untouched.
  if (isSpineReformEnabledFor("industry")) {
    const spineData = await buildSpineIndustrySeed(industry);
    if (!spineData) notFound();
    return (
      <SpineShell bg="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1920&q=60" bgPosition="center 50%">
        <SpineIndustryBody data={spineData} />
      </SpineShell>
    );
  }

  const raw = slugToIndustry(industry);
  // Prefer the requested trade when it carries its OWN measured margin row;
  // only fall back to a measured parent when the requested trade has no data of
  // its own. This stops the parent-fallback map mis-resolving a trade that we
  // actually measure (e.g. hair-salons was resolving to cleaning-services and
  // rendering an entire cleaning page, even though hair-salon margins exist).
  const ind =
    raw && INDUSTRY_MARGINS.industries[raw.id]
      ? raw
      : resolveToMeasuredIndustry(raw) || raw;
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
    // The slate constants are named in @/lib/industries/headline_band so this
    // page and /og/industry ask the same question of the same rows. A literal
    // here and a literal there is how the page and its card come to disagree.
    withBudget(
      getSameIndustryAcrossStates(
        activitySlug,
        US_STATE_SLATE_EXCLUDE,
        US_STATE_SLATE_LIMIT,
      ),
      [],
      US_STATE_SLATE_BUDGET_MS,
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

  // Each like-for-like cohort is summarised SEPARATELY, so a cohort's outlier
  // fence is anchored on its OWN median, never the other's. This is the fix for
  // a real data trap: the extrapolated country cells often report restaurant
  // revenue near $5M; summarised together with the US states they (a) land a
  // visibly-wrong $5M "typical" and (b) outnumber the states enough to pull the
  // shared median up so far that the real US figures fall below median/6 and get
  // clipped out as "low outliers". Splitting first keeps each cohort honest. The
  // HEADLINE band comes from the US-state cohort only (Census-backed, one
  // currency, comparable prices), the same WS1 trust principle the cell-lookup
  // and compare surfaces use; when US coverage is thin the band dashes and the
  // masthead honestly leads with the verdict, no number.
  const bandSummary = summarizeActivityPlaces(
    placeInputs.filter((p) => p.cohort === "us-state"),
  );

  // The representative survival archetype for the activity (the same curated
  // directional read the cell and city boards use). All-null when none is held.
  const survival = getActivitySurvivalArchetype(activitySlug);

  // "Where it earns most" ranks the US-state cohort only: one currency, one tax
  // system, Census-backed, so a take-home ranking is honest. The extrapolated
  // country cohort was retired from this table (its per-firm revenue is not
  // trustworthy enough to rank, and country money belongs on each country page).
  const stateRows = bandSummary.rows.slice(0, 12);
  const hasPlaceCohorts = stateRows.length >= 2;

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

  // The trade name cleaned for prose headings: strips the taxonomy's
  // parenthetical qualifier (e.g. "Hair salons (full service)" becomes "Hair
  // salons") so a sentence heading does not leak the qualifier or stack two
  // nouns. The full ind.name keeps its qualifier in the breadcrumb and the page
  // title; only prose headings read the clean form.
  const tradeHeadingNoun = cleanTradeName(ind.name).toLowerCase();

  // The search-sensible money question (bible Section 5 headline formula). It
  // is now the how-it-works section H2 (the page hero headline is the verdict
  // model read); the page <title> stays the benchmark phrasing, set in
  // generateMetadata above. The gerund/plural form reads as one clause ("How
  // restaurants make money"), not the old double-noun ("How restaurants
  // businesses make money"), and the parenthetical is stripped.
  const moneyQuestion = `How ${tradeHeadingNoun} make money`;

  // The pure view model (src/lib/industries/industry_view): maps the place-
  // stable margin shape, the verdict, the activity character, the cross-place
  // bands, and the survival archetype into Atlas Page Kit props in the content-
  // map reading order. Heavy data wiring stays here; the lib is pure and self-
  // omitting, so the kit renders nothing for a datum we do not hold. There is no
  // single place at this altitude, so there is no London fill: the view fills
  // from structure and self-omits everywhere else.
  const view = buildIndustryView({
    industryName: ind.name,
    industryNoun: ind.name.toLowerCase(),
    sectorName: sector?.name ?? null,
    margins: {
      grossMargin: margin.gross_margin ?? null,
      operatingMargin: margin.operating_margin ?? null,
      netMargin: margin.net_margin ?? null,
      assetIntensity: margin.asset_intensity ?? null,
    },
    verdict,
    character,
    revenue: bandSummary.revenue,
    takeHome: bandSummary.takeHome,
    survival,
  });

  // The trade pictogram for the hero (the trade identity, design-system 9.2).
  const pictogramId = industryPictogramId(ind.id);

  // A compact USD formatter for the masthead spread strip. The masthead is a
  // server component, so a function prop is fine (only the count-up anchor and
  // the sticky nav are client islands, and they take serializable props).
  const usdCompact = (n: number) => formatWithSpec(n, "usd-compact");

  // Related activities (bible Section 6 module 28, a FREE module): the other
  // small-business models that sit in the same sector. This is taxonomy data
  // the page already loads, NOT a cross-place ranking. It self-suppresses when
  // a sector has no other measured siblings. Capped so the rail stays scannable.
  const relatedActivities = (INDUSTRIES_BY_SECTOR[ind.sector_id] || [])
    .filter((sib) => sib.id !== ind.id && isDefaultVisible(sib))
    .slice(0, 8);

  void INDUSTRY_BY_ID;

  // The sticky in-page jump nav, in reading order. The required content-map
  // sections (typical-operator, where-it-earns, margin-waterfall, related-links)
  // and the honest take are ALWAYS present now (content or a calm SectionEmpty),
  // so they are always listed. Only the per-$100 split stays conditional on its
  // data. StickySectionNav additionally drops any id whose anchor is missing on
  // mount, so the list never dead-links.
  void industryViewNav;
  const nav: Array<{ id: string; label: string }> = [
    { id: "hero", label: "Overview" },
    { id: "honest-take", label: "The honest take" },
    { id: "how-it-works", label: "How it makes money" },
    ...(view.moneyGoes ? [{ id: "money", label: "Where the money goes" }] : []),
    { id: "typical-operator", label: "A typical operator" },
    { id: "where-it-earns", label: "Where it earns most" },
    { id: "margin-waterfall", label: "The cost stack" },
    { id: "cost-drivers", label: "What moves the cost" },
    { id: "related-links", label: "Go deeper" },
  ];

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

      {/* WS6 reconstruction (2026-06-13): the activity page rebuilt on the Atlas
         Page Kit, thesis-first, in the content-map INDUSTRY reading order: hero
         (the trade pictogram + the verdict model read) -> headline numbers + the
         honest take -> how it makes money + the per-$100 split -> a typical
         operator -> where it earns most (the like-for-like cohort tables, kept
         exactly from WS1) -> the cost stack -> links. The four all-null
         qualitative StatCards (market / pricing / labor / survival, mostly
         dashes) are gone; the survival archetype now reads inside the typical-
         operator block where it is held. There is no single place at this
         altitude, so there is no London fill: the view fills from the place-
         stable structure and self-omits everywhere else.

         The sticky nav sits beside the body (left rail from xl, a chip row
         below). Only three literal <section id=> blocks exist, in the canonical
         order the section-order gate enforces: hero, how-it-works,
         margin-waterfall. Every other nav anchor is a <div id=> wrapper, so the
         kit's own <section> elements never inject an unregistered id. */}
      <div className="flex gap-6">
        <div className="min-w-0 flex-1 space-y-6 md:space-y-8">
          {/* 1. Hero + headline numbers, answer-first. The trade pictogram
             carries the identity (design-system 9.2); the answer-first masthead
             carries the verdict thesis as the page H1, the one-line answer, the
             cross-place typical-revenue anchor with its signature 7-gradation
             spread, and the place-stable structural shares. The masthead self-
             omits the anchor + spread when the slate is too thin to defend a band
             (the WS1 / activity_board guard), so a thin trade still opens cleanly
             with just the thesis, the answer, and the shares. The eyebrow is the
             sector. No tier chip at this altitude: an activity carries no single
             confidence read. The place picker and the across-cities link are the
             hero actions below. id="hero" is the canonical first beat. */}
          <HeroWash category="business">
          <section id="hero">
            <AnswerFirstMasthead
              eyebrow={
                <span className="inline-flex items-center gap-2">
                  <span className="shrink-0 text-ink-900" aria-hidden="true">
                    <AtlasPictogram id={pictogramId} size={24} />
                  </span>
                  <span>{view.masthead.eyebrow ?? ind.name}</span>
                </span>
              }
              title={view.masthead.title}
              answer={view.masthead.answer}
              anchor={view.masthead.anchor}
              spread={
                view.masthead.spread
                  ? { ...view.masthead.spread, format: usdCompact }
                  : null
              }
              stats={view.masthead.stats}
            />

            <div className="mt-5">
              <ActivityPlacePicker activityId={ind.id} activityName={ind.name} />
            </div>

            {/* Across-cities comparison CTA (founder's chosen comparison
               default). The programmatic comparison lives at
               /industries/{slug}/across; it self-omits cleanly when too few
               cities resolve, so the link is always safe to show. */}
            <Link
              href={`/industries/${activitySlug}/across`}
              className="group mt-3 inline-flex items-center gap-2 rounded-full border border-parchment bg-cream-50 px-4 py-2 text-sm font-medium text-ink-900 transition-colors hover:border-atlas-300 hover:bg-cream-100"
            >
              <span>
                Not sure where? See {tradeHeadingNoun} across the
                world&apos;s cities
              </span>
              <span
                aria-hidden="true"
                className="text-atlas-700 transition-transform group-hover:translate-x-0.5"
              >
                &rarr;
              </span>
            </Link>
          </section>
          </HeroWash>

          {/* 2. The honest take, right after the headline numbers (the
             through-line). The verdict close is the one-line read, the lead
             traces the money top-to-bottom, and the model anatomy (plus the
             activity character's watch-out when written) is the supporting
             points. The id lives on a div wrapper, not the kit <section>, so the
             gate sees no stray id. The box is ALWAYS present: a thin trade whose
             honest take cannot form falls back to a calm SectionEmpty (still
             carrying the honest-take anchor) rather than dropping the beat, so
             the page silhouette matches across trades. The fallback rides the
             same div wrapper, with no id on SectionEmpty itself, so no stray
             <section id=> reaches the section-order gate. */}
          {view.honestTake ? (
            <div id="honest-take">
              <HonestTakeBox
                verdict={view.honestTake.verdict}
                points={view.honestTake.points}
              >
                {view.honestTake.body}
              </HonestTakeBox>
            </div>
          ) : (
            <div id="honest-take">
              <SectionEmpty
                eyebrow="The honest take"
                heading="What to know before you commit"
                place={ind.name}
              />
            </div>
          )}

          {/* 4. How it makes money. The decision-framed money question is the
             page's primary search heading (H2). The verdict prose and the
             cost-stage anatomy read inline here, then the per-$100 split makes
             the shares tangible, then the hand-written mechanics add the depth
             the margin synthesis cannot reach. The block always renders (the
             margins fall back to a conservative default), but every clause and
             signal self-omits on a missing input. */}
          <BeatCard
            id="how-it-works"
            eyebrow="How this business makes money"
            heading={moneyQuestion}
            feature
          >
            {/* The money-trace lead only. The bottom-line verdict (verdict.close)
                lives in the honest-take box above, so it is not reprinted here. */}
            <div className="max-w-2xl space-y-3 text-base leading-relaxed text-graphite">
              <p>{verdict.lead}</p>
            </div>

            {/* The business-model anatomy: each cost stage as a qualitative
               word, read top-of-sale to bottom-line. The distinctive move. */}
            {verdict.signals.length > 0 ? (
              <dl className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {verdict.signals.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg border border-parchment bg-cream-50 p-4"
                  >
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
                      {s.label}
                    </dt>
                    <dd
                      className={`mt-1 font-display text-xl capitalize leading-none ${signalToneClass(
                        s.tone,
                      )}`}
                    >
                      {s.word}
                    </dd>
                    <p className="mt-2 text-sm leading-relaxed text-graphite">
                      {s.note}
                    </p>
                  </div>
                ))}
              </dl>
            ) : null}

            {character?.edge?.trim() ? (
              <div className="mt-6 border-l-2 border-moss-300 pl-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-moss-700">
                  What the best operators do
                </div>
                <p className="mt-1 text-sm leading-relaxed text-ink-900">
                  {character.edge}
                </p>
              </div>
            ) : null}

            {/* The per-$100 split (the signature money breakdown). Wrapped in a
               div anchor so the kit <section> carries no registered-but-out-of-
               order id. Self-omits when the margin shape cannot form a credible
               $100 decomposition. */}
            {view.moneyGoes ? (
              <div id="money" className="mt-7">
                <MoneyGoesBreakdown
                  items={view.moneyGoes}
                  eyebrow="Where each $100 goes"
                  heading="Every $100 of a sale"
                  lede="The cost shape is stable across places: a trade keeps roughly the same share of each dollar in one country as another. The dollars themselves land once you pick a place."
                />
              </div>
            ) : null}

            {/* The hand-written mechanics: how the money actually works, in the
               operator's own terms. The editorial depth a margin readout cannot
               carry. Self-suppresses when no character is written. */}
            {character ? (
              <div className="mt-7 max-w-3xl space-y-4">
                <div className="rounded-lg border border-parchment bg-cream-100 p-5">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-atlas-700">
                    How the money actually works
                  </div>
                  <p className="mb-2 font-display text-base font-medium leading-snug text-ink-900">
                    {character.hook}
                  </p>
                  <p className="text-sm leading-relaxed text-graphite">
                    {character.economics}
                  </p>
                </div>
                {character.categoryNote ? (
                  <p className="border-l-2 border-atlas-300 pl-3 text-sm italic leading-relaxed text-cocoa-700/85">
                    {character.categoryNote}
                  </p>
                ) : null}
              </div>
            ) : null}
          </BeatCard>

          {/* 5. A typical operator. The content-map's "what a typical one looks
             like": the place-stable structure read into tangible operator facts
             (what survives a sale, what reaches the owner, the capital bar, the
             representative one-year survival), plus the cross-place typical
             revenue when a band exists. No fabricated headcount. Self-omits when
             fewer than two facts are held. */}
          {view.typicalOperator ? (
            <div id="typical-operator">
              <PlainTerms
                eyebrow="A typical operator"
                heading={`What a typical ${tradeHeadingNoun} operator looks like`}
                items={view.typicalOperator}
              />
            </div>
          ) : (
            <SectionEmpty
              id="typical-operator"
              eyebrow="A typical operator"
              heading="What a typical operator looks like"
              place={ind.name}
            />
          )}

          {/* 6. Where it earns most. The trusted US-state cohort only (one
             currency, one tax system), ordered by what a typical owner keeps.
             The extrapolated country cohort was retired: its per-firm revenue is
             not reliable enough to order or to headline, and country money is
             read on each country page. Garbage tails are dropped upstream, so a
             corrupt place can never headline; the block omits cleanly when the
             slate is thin. The id rides the BeatCard, which carries the seated-
             card grammar. */}
          {hasPlaceCohorts ? (
            // BeatCard carries the anchor id directly. The section-order gate
            // scans the page source for literal lowercase <section id=> blocks
            // only; BeatCard renders its <section> in the kit file, so the id
            // here is never read as an unregistered literal section. The
            // page-sections gate sees the "where-it-earns" literal it needs.
            <BeatCard
              id="where-it-earns"
              eyebrow="Where it earns most"
              heading={`Where ${tradeHeadingNoun} earn more, and where less`}
            >
              <p className="mb-5 max-w-2xl text-sm md:text-base leading-relaxed text-cocoa-700">
                Across US states, which sit on one currency and one tax system, so
                a like-for-like ranking by what a typical owner keeps is honest.
                Open any row for the full revenue, cost stack, and survival read.
                For other countries, open that country&apos;s page, a raw dollar
                figure is not adjusted for local prices, so we do not rank trades
                across borders here. Modeled and directional.
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

              {/* The "Across countries we cover" cohort was retired: it was fed
                 by extrapolated country cells whose per-firm revenue is not
                 trustworthy (duplicate country rows, statistical aggregates
                 listed as countries, and take-homes implying ~$5M-revenue
                 restaurants). Per the data-sanity rule, country money is read
                 on each country's own page, not ranked here. */}

              <p className="mt-3 text-[11px] text-cocoa-500">
                Owner take-home is after tax, for a typical single-site operator.
                The same activity reads differently once local rent, wages, and
                tax land on it.
              </p>
            </BeatCard>
          ) : (
            <SectionEmpty
              id="where-it-earns"
              eyebrow="Where it earns most"
              heading="Where this business earns more, and less"
              place={ind.name}
            />
          )}

          {/* 7. The cost stack. The curated cost-structure margins are stable
             across countries within an activity. The cell page scales them
             against country-specific revenue; here they carry the model anatomy
             one cut deeper than the per-$100 bar. id="margin-waterfall" is the
             last canonical beat. */}
          <BeatCard id="margin-waterfall" eyebrow="The cost stack, cut by cut">
            <p className="max-w-2xl text-base leading-relaxed text-graphite mb-4">
              Each bar takes a typical sale one cut deeper: what survives the
              direct cost of goods, what running the business leaves, and what
              reaches the bottom line. The gap between the top bar and the bottom
              one is the whole game.
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
          </BeatCard>

          {/* The cost drivers (brand block): the biggest held cost lines ARE the
             levers that move this trade's margin, derived straight from the cost
             stack above (the per-$100 split's non-kept lines), ranked by share,
             each weighing the margin down. No new numbers: the held breakdown
             carries everything, so a thin trade with no cost structure shows the
             block's own honest empty state rather than a fabricated lever. It
             reads right after the cost stack, turning the same shares into the
             few things an operator can actually push on. */}
          <CostDrivers id="cost-drivers" drivers={view.costDrivers} />

          {/* 8. Related activities (a FREE module). The closing rail: the other
             small-business models in this sector, so a reader who has learned to
             read one model anatomy can jump to a neighbouring one. Pure taxonomy,
             NOT a cross-place ranking. The id rides the BeatCard. Self-
             suppresses when the sector has no other measured siblings. */}
          {relatedActivities.length > 0 ? (
            // BeatCard carries the anchor id directly (see the where-it-earns
            // note); the trailing margin rides BeatCard's className.
            <BeatCard
              id="related-links"
              eyebrow="Related activities"
              heading={`Other ways to make money${sector ? ` in ${sector.name.toLowerCase()}` : ""}`}
              className="mb-8"
            >
              <p className="text-sm leading-relaxed text-cocoa-700 max-w-2xl">
                Each reads its own way once the cost stack and the capital bar
                land.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {relatedActivities.map((sib) => (
                  <a
                    key={sib.id}
                    href={`/industries/${industryToSlug(sib.id)}`}
                    className="group rounded-lg border border-parchment bg-white p-4 transition-colors hover:bg-cream-50"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-0.5 shrink-0 text-cocoa-700"
                        aria-hidden="true"
                      >
                        <AtlasPictogram id={industryPictogramId(sib.id)} size={24} />
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-ink-900 group-hover:text-atlas-700">
                          {sib.name}
                        </div>
                        {sib.examples && sib.examples.length > 0 && (
                          <div className="mt-1 text-xs leading-relaxed text-cocoa-500 line-clamp-2">
                            {sib.examples.slice(0, 3).join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </BeatCard>
          ) : (
            <SectionEmpty
              id="related-links"
              eyebrow="Go deeper"
              heading="Into the places and businesses"
              place={ind.name}
            />
          )}

          {/* The one thing to remember: the verdict's bottom line as the close. */}
          <OneThing id="one-thing" lastChecked="June 2026">
            {verdict.close}
          </OneThing>
        </div>

        <StickySectionNav sections={nav} />
      </div>
    </div>
  );
}

/**
 * Token color class for a model-anatomy signal tone: a low-cost-pressure stage
 * leans moss, a heavy one clay, the middle the atlas accent. Tokens only.
 */
function signalToneClass(tone: "good" | "flat" | "bad"): string {
  if (tone === "good") return "text-moss-700";
  if (tone === "bad") return "text-clay-700";
  return "text-atlas-700";
}

// activityPlaceFromCell lived here. It now lives in
// @/lib/industries/headline_band, imported at the top of this file, because
// /og/industry has to build the masthead figure from the same mapper this page
// does. Nothing about it changed in the move.
