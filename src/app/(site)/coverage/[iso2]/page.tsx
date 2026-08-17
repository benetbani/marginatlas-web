/**
 * /coverage/[iso2] — per-country scorecard (Track GG.4).
 *
 * Renders coverage stats + tier breakdown for a single country.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { COUNTRIES } from "@/lib/taxonomy";
import { getCoverageFor, getCoverageRows } from "@/lib/coverage/report";
import { ProgressBar } from "@/components/ui/progress-bar";

export const revalidate = 21600;

export async function generateStaticParams() {
  /* The 30 DEEPEST countries, not the 30 largest economies.
     The hardcoded GDP list this replaced pre-rendered Singapore, which has no
     row in the report at all, so one of the thirty was a statically built page
     saying nothing was held. Ranking by what is actually measured cannot
     produce that: every pre-rendered page has something on it, by construction.

     Still capped at 30. All 195 contributed to build-worker OOM, and the rest
     render on demand. */
  return getCoverageRows()
    .slice(0, 30)
    .map((c) => ({ iso2: c.iso2.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ iso2: string }>;
}) {
  const { iso2 } = await params;
  const upper = iso2.toUpperCase();
  const c = COUNTRIES.find((c) => c.code === upper);
  // Built from the RESOLVED country code so a request in any casing settles on
  // the one lowercase URL generateStaticParams emits and CoverageHubV2 links to.
  // Without an `alternates` of its own this route inherited the root layout's
  // `canonical: "/"` and every scorecard told a crawler it was the home page.
  const canonical = `/coverage/${(c?.code || iso2).toLowerCase()}`;
  return {
    title: `${c?.name || iso2} coverage: Margin Atlas`,
    description: `Per-country data quality scorecard for ${c?.name || iso2}.`,
    alternates: { canonical },
  };
}

const TIER_DESCRIPTIONS: Record<string, string> = {
  P: "Primary: direct measurement",
  S: "Secondary: official aggregation",
  M: "Modeled: derived from primary inputs",
  T: "Tabulated: published table consumed as-is",
  X: "Extrapolated: proxy + scaling factor",
};

export default async function PerCountryCoverage({
  params,
}: {
  params: Promise<{ iso2: string }>;
}) {
  const { iso2: lowerIso2 } = await params;
  const iso2 = lowerIso2.toUpperCase();
  const meta = COUNTRIES.find((c) => c.code === iso2);
  if (!meta) notFound();

  /* Resolves through the shared reader, which is what recovered this page.
     The old lookup compared the URL's ISO-2 against the report's raw key, and
     117 countries are keyed there in ISO-3. Afghanistan's 264 cells were in the
     file the whole time under "AFG" while /coverage/af rendered as empty. */
  const entry = getCoverageFor(iso2);

  /* CLASSIFIED cells, not regional + extrapolated. The stored sum folds in a
     264-cell block that carries no tier, no quality and no year, on 52 of the
     94 countries, so this page was crediting Australia with 80,992 benchmarks
     when 80,728 of them exist. It is also the denominator for the tier
     percentages below, which were therefore quietly short of 100%. */
  const totalCells = entry ? entry.cellCount : 0;
  const tierEntries = entry ? Object.entries(entry.tiers).sort((a, b) => b[1] - a[1]) : [];

  return (
    <div className="py-12 max-w-4xl">
      <nav className="text-sm text-ink-700/70 mb-4">
        <Link href="/coverage" className="hover:text-atlas-700">
          ← Coverage report
        </Link>
      </nav>
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
        Scorecard
      </div>
      <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-ink-900">
        {meta.name} <span className="text-ink-700/60 font-mono text-2xl">{iso2}</span>
      </h1>

      {!entry ? (
        /* THIS WAS AN INSTRUCTION TO A DEVELOPER, PUBLISHED TO READERS.
           It read: "No coverage data on disk for {name} yet: run the coverage
           audit to refresh." On 66 of 195 live coverage pages, 34% of them, all
           declared in the sitemap. "On disk" and "run the audit" describe this
           project's plumbing, and a reader who lands here has no audit to run.

           verify_no_internal_notes did not catch it because it only knew four
           patterns, Cloned from / Wave N split / TODO / FIXME, and none of them
           is operational prose. The gate now knows this shape too.

           The replacement says what is missing AND what the page will hold when
           it is not, which is the ratified treatment for a gap: name it, do not
           hide it, and never fill it with a number nobody measured. */
        <div className="mt-6 max-w-2xl">
          <p className="text-ink-700">
            Nothing has been measured for {meta.name} yet.
          </p>
          <p className="mt-3 text-ink-700">
            When it has been, this page will show how many benchmarks are held,
            across how many trades and regions, and how much of that is measured
            rather than modelled. The country page below carries whatever is
            already known.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Total benchmarks" value={totalCells.toLocaleString()} />
            <Stat label="Industries" value={entry.industries.toString()} />
            <Stat label="Geographies" value={entry.geographies.toString()} />
            <Stat
              label="Quality (1-10)"
              value={entry.avg_quality_10.toString()}
              accent
            />
          </div>

          {/* The "Coverage breakdown" pair of cards stood here and was removed
              because neither card could tell a reader anything. Every
              classified cell in this report is sub-national, on all 94
              countries, so "Regional / sub-national" restated the headline
              figure directly above it. And "Country-level extrapolated" reads 0
              for all 94 once the unclassified block is excluded, which is the
              only reason it ever showed a number: it was displaying the 264
              phantom cells. A card that is either a duplicate or a zero is not
              a breakdown. The tier distribution below is the real split. */}

          {tierEntries.length > 0 ? (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-ink-900 mb-3">
                Confidence tier distribution
              </h2>
              <ul className="space-y-2.5 text-sm">
                {tierEntries.map(([tier, count]) => {
                  const pct = totalCells > 0 ? (count / totalCells) * 100 : 0;
                  // Tone: A = success (deep green), B = default (atlas),
                  // C = warning (amber), D = muted. Reinforces the tier
                  // semantic without needing the legend.
                  const tone =
                    tier === "A"
                      ? "success"
                      : tier === "C"
                        ? "warning"
                        : tier === "D"
                          ? "muted"
                          : "default";
                  return (
                    <li
                      key={tier}
                      className="grid grid-cols-[60px,1fr,80px] items-center gap-3"
                    >
                      <span className="font-mono font-semibold text-ink-900">
                        {tier}
                      </span>
                      <ProgressBar
                        value={pct}
                        max={100}
                        tone={tone}
                        size="sm"
                      />
                      <span className="text-right text-ink-800 tabular-nums">
                        {count.toLocaleString()}
                      </span>
                      <span className="col-span-3 text-xs text-ink-700/60 pl-[68px]">
                        {TIER_DESCRIPTIONS[tier] || tier}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

        </>
      )}

      <div className="mt-10 flex gap-3 flex-wrap text-sm">
        <Link
          href={`/${iso2.toLowerCase()}`}
          className="px-4 py-2 rounded-full bg-ink-900 text-white hover:bg-ink-800 transition font-medium"
        >
          Open {meta.name} country page →
        </Link>
        <Link
          href="/coverage"
          className="px-4 py-2 rounded-full bg-paper-100 border border-parchment text-ink-900 hover:bg-white transition font-medium"
        >
          Back to coverage report
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="p-4 rounded-xl bg-paper-100 border border-parchment">
      <div className="text-xs uppercase tracking-wide text-ink-700/70 font-medium">
        {label}
      </div>
      <div
        className={`mt-1 text-2xl font-semibold tabular-nums ${
          accent ? "text-atlas-700" : "text-ink-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
