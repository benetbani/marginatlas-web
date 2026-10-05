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

/* THE BREAK-IN RATING LEFT THIS PAGE on 2026-10-05 (his ruling 11, "no composite, ever"; masterplan step 02): the lead read
   that named the place with the highest 0..100 score, its badge, and the table's rating row. The data builder still carries
   the score on each column; nothing here prints it. */

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

      {/* The side-by-side comparison. Cities as columns, decisive rows as rows.
          The board's format helpers and dash, so it reads in the same language
          as every cell page. On mobile the table scrolls horizontally; the
          sticky metric column keeps each row legible. */}
      <section className="mt-10">
        <SectionEyebrow className="mb-3">Side by side</SectionEyebrow>
        <h2 className={T_H2}>The same business in each city</h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-cocoa-700/85">
          Revenue is a typical firm&apos;s yearly sales, not what an owner keeps.
          Owner take-home is after tax, for a single-site operator. The strongest
          city in each row is set in heavier, deeper type.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-parchment text-left align-bottom">
                <th scope="col" className="sticky left-0 z-10 w-40 bg-white py-2 pr-4 text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">
                  Metric
                </th>
                {cities.map((c) => (
                  <th scope="col" key={c.href} className="px-3 py-2 align-bottom">
                    <Link href={c.href} className="group block">
                      <span className="mb-1 flex items-center gap-1.5">
                        <CountryFlag iso2={c.country} className="w-4" />
                      </span>
                      <span className="block font-display text-base font-semibold tracking-tight text-ink-900 transition-colors group-hover:text-atlas-700">
                        {c.name}
                      </span>
                    </Link>
                    {/* Quiet cross-link to this place's cost-to-open read. */}
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
                        <span className="mt-0.5 block text-[11px] text-cocoa-500">
                          {metric.hint}
                        </span>
                      ) : null}
                    </td>
                    {cities.map((c, i) => {
                      const display = metricDisplay(metric, c);
                      const blank = display === MISSING;
                      const isBest = bestIdx === i && !blank;
                      // Weight is the primary cue for the best place (it reads
                      // without relying on colour); the terracotta is the second.
                      const tone = blank
                        ? "text-cocoa-500"
                        : isBest
                          ? "font-semibold text-atlas-700"
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
                        <span className="text-cocoa-500">{MISSING}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 max-w-2xl text-[11px] leading-relaxed text-cocoa-500">
          Owner take-home, margins and survival are estimates. Open any city for
          its full read.
        </p>
      </section>

      {/* Back to the activity page: the model anatomy that holds everywhere,
          for the reader who wants the why behind the numbers. */}
      {/* The border-t rule goes with the hand-roll: the card below is its own
          divider, and a full-width hairline drawn straight on the photograph
          reads as a scratch rather than a separator. */}
      <section className="mt-12 pt-8">
        <div className="atlas-card p-6">
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
