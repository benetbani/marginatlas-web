/**
 * Programmatic comparison page - /industries/{slug}/across.
 *
 * "One business across the world's cities", side by side. This is the founder's
 * chosen comparison default and the STATIC, single-business sibling of the
 * interactive /compare grid: it fixes the activity and lays it out across a
 * curated slate of major world cities as columns, with the decisive cell-board
 * rows (typical revenue, owner take-home, net margin, competition density,
 * break-even, five-year survival) as rows, and the best place marked per row.
 *
 * DATA INTEGRITY is the reason this page exists as its own builder. Cross-country
 * extrapolated reads are poisoned (inflated tails, aggregate non-places), so the
 * comparison is built ONLY from trustworthy resolvable cells: src/lib/markets/
 * across_cities.ts resolves each (city, activity) pair and keeps a city only when
 * the resolved cell is a real, non-synthetic measurement of THIS activity (the
 * same guard the homepage beats apply). A city that does not resolve cleanly
 * self-omits, and the whole page self-omits when fewer than three cities hold, so
 * a reader only ever sees the business across the places where the data is real.
 *
 * The page is a sub-route of the activity page (/industries/{slug}), linked from
 * it with a clear call to action. It does not touch the canonical industry-page
 * section skeleton (it lives at a different path with its own layout), so it is
 * outside the section-order gate by construction.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures, tokens
 * only. revalidate daily; a bounded set of activities is prebuilt, the rest
 * render on demand via dynamicParams.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  INDUSTRIES,
  INDUSTRY_BY_ID,
  industryToSlug,
  slugToIndustry,
  resolveToMeasuredIndustry,
} from "@/lib/taxonomy";
import { buildAcrossCities, type CityColumn, type AcrossMetric } from "@/lib/markets/across_cities";
import type { BreakInBand } from "@/lib/scores/break_in_rating";
import { CountryFlag } from "@/components/CountryFlag";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { SpreadBar } from "@/components/board/charts/SpreadBar";
import { T_H1, T_H2, T_H3 } from "@/lib/ui/typography";
import { fmtUSD, fmtPct, fmtNum, MISSING } from "@/components/board/format";

export const revalidate = 86400;
export const dynamicParams = true;

type Params = { industry: string };

// Cap build-time static generation for the comparison. Each page resolves a
// curated city slate (one cell lookup per city), so the build stays bounded;
// the rest render on demand via dynamicParams=true. Kept below the parent
// activity-page cap because each across page is heavier (many cells, not one).
const STATIC_ACROSS_CAP = 14;

export async function generateStaticParams(): Promise<Params[]> {
  return INDUSTRIES.filter((i) => (i.audience || "smb_friendly") === "smb_core")
    .slice(0, STATIC_ACROSS_CAP)
    .map((i) => ({ industry: industryToSlug(i.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { industry } = await params;
  const raw = slugToIndustry(industry);
  const ind = resolveToMeasuredIndustry(raw) || raw;
  if (!ind) return { title: "Comparison not found | Margin Atlas" };
  const slug = industryToSlug(ind.id);
  return {
    title: `${ind.name} across the world's cities | Margin Atlas`,
    description: `The same ${ind.name.toLowerCase()} business, side by side across major world cities: typical revenue, owner take-home, margin, and where there is the most room to open one.`,
    alternates: { canonical: `/industries/${slug}/across` },
  };
}

/** The single board-format display string for a metric in one city column. */
function metricDisplay(metric: AcrossMetric, c: CityColumn): string {
  switch (metric.key) {
    case "revenue":
      return fmtUSD(c.revenue);
    case "take_home":
      return fmtUSD(c.takeHome);
    case "net_margin":
      return fmtPct(c.netMarginFraction, { fromFraction: true });
    case "density":
      return c.densityPer10k != null ? fmtNum(c.densityPer10k) : MISSING;
    case "breakeven":
      return c.breakevenDaily != null
        ? `${Math.round(c.breakevenDaily)} a day`
        : MISSING;
    case "survival":
      return c.survivalYr5 != null ? `${Math.round(c.survivalYr5)}%` : MISSING;
    default:
      return MISSING;
  }
}

/** A finite, positive real, matching the data builder's guard. */
function isPos(n: number | null | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n) && n > 0;
}

/** Compact USD for inline editorial prose, mirroring the board's money grain. */
function moneyWord(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000) {
    const v = Math.round((abs / 1_000_000) * 10) / 10;
    return `${sign}$${Number.isInteger(v) ? v : v.toFixed(1)}M`;
  }
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}K`;
  return `${sign}$${Math.round(abs).toLocaleString("en-US")}`;
}

/** Band to the badge tone. Higher = easier = warmer, the EXACT moss / atlas /
 * clay scale the break-in masthead and the cost-to-open comparison rows use, so
 * the badge reads identically here. */
function bandBadge(band: BreakInBand): string {
  switch (band) {
    case "forgiving":
      return "border-moss-300 bg-moss-50 text-moss-700";
    case "manageable":
    case "demanding":
      return "border-atlas-300 bg-atlas-100/60 text-atlas-700";
    case "brutal":
      return "border-clay-300 bg-clay-100/60 text-clay-700";
  }
}

/** The one-word band label, plain and direction-true, matching the masthead. */
function bandWord(band: BreakInBand): string {
  switch (band) {
    case "forgiving":
      return "Forgiving";
    case "manageable":
      return "Manageable";
    case "demanding":
      return "Demanding";
    case "brutal":
      return "Brutal";
  }
}

/**
 * The cost-to-open page href for a city column. The column href is the cell page
 * (/{country}/{geo}/{activity}); the opening page is that same path plus
 * /opening, the canonical route the site already uses, so this never invents a
 * slug. The column href has no query or hash, so a plain suffix is safe.
 */
function openingHref(col: CityColumn): string {
  return `${col.href}/opening`;
}

export default async function AcrossCitiesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { industry } = await params;
  const raw = slugToIndustry(industry);
  const ind = resolveToMeasuredIndustry(raw) || raw;
  if (!ind) notFound();

  const data = await buildAcrossCities(ind.id);
  const activitySlug = industryToSlug(ind.id);
  const lower = ind.name.toLowerCase();

  // Self-omit gracefully on thin data: when fewer than three cities resolve
  // cleanly for this activity, there is no honest side-by-side to show. The
  // page degrades to a quiet pointer back to the activity page rather than a
  // one-column "comparison".
  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
        <nav className="mb-6 text-sm text-cocoa-700/70">
          <Link href="/industries" className="hover:text-atlas-700">
            Activities
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/industries/${activitySlug}`} className="hover:text-atlas-700">
            {ind.name}
          </Link>
          <span className="mx-2">/</span>
          <span>Across cities</span>
        </nav>
        {/* typography-ok: graceful self-omit headline */}
        <h1 className={T_H2}>{ind.name} across the world&apos;s cities</h1>
        <p className="mt-3 text-base leading-relaxed text-cocoa-700/85">
          We do not yet hold a clean read on {lower} in enough major cities to
          put them honestly side by side. Rather than show a thin or invented
          picture, this view stays quiet until the data is real.
        </p>
        <Link
          href={`/industries/${activitySlug}`}
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-atlas-700 hover:text-atlas-900"
        >
          See how {lower} businesses make money &rarr;
        </Link>
      </div>
    );
  }

  // breakIn (the take-home-per-difficulty ratio from pickBreakIn) is still
  // computed in the builder and stays harmless on the payload; the lead call-out
  // no longer reads it. It is intentionally NOT destructured here so there is no
  // dangling page reference to a value the UI no longer uses.
  const { cities, metrics, bestByMetric } = data;
  const leader = cities[0]; // richest typical revenue, sorted first

  // The break-in ranking read: the single place that is easiest to break into by
  // the headline break-in rating (the SAME 0..100 score on the masthead and the
  // extremes board). Higher is easier. Only places that carry a real score enter
  // the running; ties keep the slate's revenue order. Null when no place is
  // scored, so the read self-omits rather than naming a place without a number.
  const scoredCities = cities.filter(
    (c): c is CityColumn & { breakInScore: number; breakInBand: BreakInBand } =>
      c.breakInScore != null && c.breakInBand != null,
  );
  const easiestBreakIn =
    scoredCities.length > 0
      ? scoredCities.reduce((best, c) =>
          c.breakInScore > best.breakInScore ? c : best,
        )
      : null;

  // The lead read names ONE place to break into: the place with the HIGHEST
  // break-in score, the exact same winner the table rings as easiest. Pointing
  // the call-out at this column keeps the headline, the badge, and the table's
  // ring in agreement, so the page never says one city is easiest while showing
  // a Brutal badge on it. The column carries a real score and band by
  // construction (scoredCities filtered for both), so the badge always prints a
  // defensible number.
  const easiest = easiestBreakIn; // the scored-cities winner the table rings

  // The warm reason: the single leg that most makes this place easy to break
  // into, read off what the column already carries. Room to grow (the thinnest
  // competitor count per resident) leads when held; otherwise a forgiving
  // break-even floor (more margin for a slow start). Both are direction-true
  // restatements of figures the table shows, never a new claim.
  const easiestHasRoom = easiest != null && isPos(easiest.densityPer10k);

  // The honest catch: the first decisive row where this place is NOT the leader,
  // named with whoever leads it, so the call to action never oversells. Mirrors
  // the pickBreakIn catch order (headline size, then profitability, then staying
  // power), reading the SAME bestByMetric the table marks. The reward leg
  // (take-home) and the ease leg the reason leans on are skipped, since leading
  // those is the point, not a catch.
  const easiestIdx = easiest != null ? cities.indexOf(easiest) : -1;
  const catchSkip = new Set<string>([
    "take_home",
    easiestHasRoom ? "density" : "breakeven",
  ]);
  let easiestCatch: { label: string; leaderName: string } | null = null;
  if (easiestIdx >= 0) {
    for (const key of ["revenue", "net_margin", "survival", "breakeven", "density"]) {
      if (catchSkip.has(key)) continue;
      const leaderIdx = bestByMetric[key];
      if (leaderIdx == null || leaderIdx === easiestIdx) continue;
      const metric = metrics.find((m) => m.key === key);
      if (!metric) continue;
      easiestCatch = { label: metric.label, leaderName: cities[leaderIdx].name };
      break;
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="mb-5 text-sm text-cocoa-700/70">
        <Link href="/industries" className="hover:text-atlas-700">
          Activities
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/industries/${activitySlug}`} className="hover:text-atlas-700">
          {ind.name}
        </Link>
        <span className="mx-2">/</span>
        <span>Across cities</span>
      </nav>

      {/* Hero: warm, editorial, plain. The business named, then a one-line read
          of what the comparison is for. */}
      <header className="pb-2">
        <SectionEyebrow size="md" className="mb-3">
          One business, many cities
        </SectionEyebrow>
        <h1 className={T_H1}>{ind.name} across the world&apos;s cities</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-cocoa-700/85 md:text-lg">
          The same {lower} business, laid out side by side across the major
          cities where we hold a real read on it. Each column is one city, each
          row a figure that decides the outcome. Where a place is the strongest
          for that figure, it is marked. A dash means we do not hold it cleanly
          there, so it stays blank rather than guess at it.
        </p>
      </header>

      {/* Where to break in: the single lead read the buyer came for. ONE place,
          the one with the HIGHEST break-in score, the exact city the table rings
          as easiest, shown with that same score + band badge. So the headline,
          the badge, and the table's ring all name and rate the same place: no
          contradiction between "easiest" copy and a Brutal badge. The warm reason
          and the honest catch ride below; the heading links to that place's full
          cell page and a quiet line links to its cost-to-open read. Self-omits
          when no city is scored. */}
      {easiest ? (
        <section className="mt-8 rounded-lg border border-moss-300/60 bg-moss-50/60 p-5 md:p-6">
          <SectionEyebrow size="md" className="mb-2">
            Where to break in
          </SectionEyebrow>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <h2 className={T_H3}>
              <Link href={easiest.href} className="text-moss-700 hover:text-moss-900">
                {easiest.name}
              </Link>{" "}
              is the easiest place to break into
            </h2>
            <span className="flex shrink-0 items-baseline gap-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-cocoa-500">
                Break-in rating
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${bandBadge(
                  easiest.breakInBand,
                )}`}
              >
                <span className="tabular-nums">{easiest.breakInScore}</span>
                <span>{bandWord(easiest.breakInBand)}</span>
              </span>
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-900">
            Across these cities, {easiest.name} carries the highest break-in score
            for a {lower} business
            {isPos(easiest.takeHome) ? (
              <>
                , pairing room to open one with an owner take-home of about{" "}
                <span className="font-semibold tabular-nums">
                  {moneyWord(easiest.takeHome)}
                </span>{" "}
                a year
              </>
            ) : null}
            .{" "}
            {easiestHasRoom
              ? `It carries one of the thinner competitor counts per resident here, so a new operator is not fighting a saturated market on day one.`
              : `Its break-even sits among the most forgiving here, so a new operator has more margin for a slow start.`}
            {easiestCatch ? (
              <>
                {" "}
                The catch: it is not the strongest on every measure.{" "}
                {easiestCatch.leaderName} leads on{" "}
                {easiestCatch.label.toLowerCase()}, so read the row that matters
                most to you before you commit.
              </>
            ) : null}
          </p>
          <Link
            href={openingHref(easiest)}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-atlas-700 hover:text-atlas-900"
          >
            See the cost to open one in {easiest.name} &rarr;
          </Link>
        </section>
      ) : null}

      {/* The side-by-side comparison. Cities as columns, decisive rows as rows.
          The board's format helpers and dash, so it reads in the same language
          as every cell page. On mobile the table scrolls horizontally; the
          sticky metric column keeps each row legible. */}
      <section className="mt-10">
        <SectionEyebrow className="mb-3">Side by side</SectionEyebrow>
        <h2 className={T_H2}>The same business in each city</h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-cocoa-700/85">
          Revenue is a typical firm&apos;s yearly sales, not what an owner keeps.
          Owner take-home is after tax, for a single-site operator. The break-in
          rating is one 0 to 100 score for how easy it is to open and win here,
          higher being easier. The strongest city in each row is set in heavier,
          deeper type, and the easiest place to break into is ringed.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-parchment text-left align-bottom">
                <th className="sticky left-0 z-10 w-40 bg-white py-2 pr-4 text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">
                  Metric
                </th>
                {cities.map((c) => (
                  <th key={c.href} className="px-3 py-2 align-bottom">
                    <Link href={c.href} className="group block">
                      <span className="mb-1 flex items-center gap-1.5">
                        <CountryFlag iso2={c.country} className="w-4" />
                      </span>
                      <span className="block font-display text-base font-semibold tracking-tight text-ink-900 transition-colors group-hover:text-atlas-700">
                        {c.name}
                      </span>
                    </Link>
                    {/* Quiet cross-link to this place's cost-to-open read, where
                        the break-in rating is broken down in full. */}
                    <Link
                      href={openingHref(c)}
                      className="mt-0.5 block text-[11px] font-medium text-cocoa-500 transition-colors hover:text-atlas-700"
                    >
                      Cost to open
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-ink-900">
              {metrics.map((metric) => {
                const bestIdx = bestByMetric[metric.key];
                return (
                  <tr key={metric.key} className="border-b border-parchment/50">
                    <td className="sticky left-0 z-10 bg-white py-2.5 pr-4 align-top text-cocoa-500">
                      {metric.label}
                      {metric.hint ? (
                        <span className="mt-0.5 block text-[11px] text-cocoa-400">
                          {metric.hint}
                        </span>
                      ) : null}
                    </td>
                    {cities.map((c, i) => {
                      const display = metricDisplay(metric, c);
                      const blank = display === MISSING;
                      const isBest = bestIdx === i && !blank;
                      // Weight is the primary cue for the best place (it reads
                      // without relying on colour); the moss tone is the second.
                      const tone = blank
                        ? "text-cocoa-400"
                        : isBest
                          ? "font-semibold text-moss-700"
                          : "text-ink-900";
                      return (
                        <td
                          key={c.href}
                          className={`px-3 py-2.5 align-top tabular-nums ${tone}`}
                        >
                          {display}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Break-in rating: the single headline score per place, the SAME
                  0..100 number the cell masthead and the extremes board show
                  (higher = easier to break in and win). A band-toned badge per
                  city; a quiet dash where a place carries no defensible score, so
                  the row never prints a wrong number. The easiest place is ringed,
                  the row's parallel to the heavier best-place cue above. */}
              <tr className="border-b border-parchment/50">
                <td className="sticky left-0 z-10 bg-white py-2.5 pr-4 align-top text-cocoa-500">
                  Break-in rating
                  <span className="mt-0.5 block text-[11px] text-cocoa-400">
                    higher is easier
                  </span>
                </td>
                {cities.map((c) => {
                  const scored =
                    c.breakInScore != null && c.breakInBand != null;
                  const isEasiest =
                    scored &&
                    easiestBreakIn != null &&
                    c.href === easiestBreakIn.href;
                  return (
                    <td key={c.href} className="px-3 py-2.5 align-top">
                      {scored ? (
                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${bandBadge(
                            c.breakInBand as BreakInBand,
                          )} ${isEasiest ? "ring-1 ring-moss-300" : ""}`}
                        >
                          <span className="tabular-nums">{c.breakInScore}</span>
                          <span>{bandWord(c.breakInBand as BreakInBand)}</span>
                        </span>
                      ) : (
                        <span className="text-cocoa-400">{MISSING}</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Revenue spread: one quiet bar per city, bottom tenth to top
                  tenth with the typical firm marked. Self-omits per city when
                  the range is absent. */}
              <tr>
                <td
                  colSpan={cities.length + 1}
                  className="sticky left-0 bg-white pb-1 pt-5"
                >
                  <SectionEyebrow size="md">Revenue spread</SectionEyebrow>
                  <p className="mt-1 text-[11px] leading-relaxed text-cocoa-500">
                    Bottom tenth to top tenth, with the typical firm marked.
                  </p>
                </td>
              </tr>
              <tr className="border-b border-parchment/50">
                <td className="sticky left-0 z-10 bg-white py-2 pr-4 align-top" />
                {cities.map((c) => {
                  const hasSpread =
                    c.revP10 != null &&
                    c.revP90 != null &&
                    c.revP90 > c.revP10;
                  return (
                    <td key={c.href} className="px-3 py-2 align-top">
                      {hasSpread ? (
                        <>
                          <SpreadBar p10={c.revP10} median={c.revenue} p90={c.revP90} />
                          <div className="mt-1 flex justify-between text-[11px] tabular-nums text-cocoa-500">
                            <span>{fmtUSD(c.revP10)}</span>
                            <span>{fmtUSD(c.revP90)}</span>
                          </div>
                        </>
                      ) : (
                        <span className="text-cocoa-400">{MISSING}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 max-w-2xl text-[11px] leading-relaxed text-cocoa-500">
          Owner take-home, margins, and survival are modeled from local business
          demography and are directional. The same activity reads differently
          once local rent, wages, tax, and competition land on it. Open any city
          for its full revenue, cost stack, and survival read.
        </p>
      </section>

      {/* Back to the activity page: the model anatomy that holds everywhere,
          for the reader who wants the why behind the numbers. */}
      <section className="mt-12 border-t border-parchment pt-8">
        <div className="rounded-2xl border border-parchment bg-cream-50 p-6">
          <h2 className={T_H3}>How {lower} businesses make money</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cocoa-700/85">
            The comparison above shows where the dollars land. The activity page
            shows why: where each dollar of a sale goes, how little survives to
            the bottom line, and what quietly takes the rest from the weak
            operators. {leader ? `${leader.name} leads the slate above on revenue today.` : ""}
          </p>
          <Link
            href={`/industries/${activitySlug}`}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-atlas-700 hover:text-atlas-900"
          >
            See the full {lower} model &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
