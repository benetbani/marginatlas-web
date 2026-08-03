/**
 * /coverage/[iso2] — per-country scorecard (Track GG.4).
 *
 * Renders coverage stats + tier breakdown for a single country.
 */
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COUNTRIES } from "@/lib/taxonomy";
import { ProgressBar } from "@/components/ui/progress-bar";

export const revalidate = 21600;

type CoverageReport = {
  generated_at: string;
  countries: Array<{
    iso2: string;
    regional_cells: number;
    extrapolated_cells: number;
    industries: number;
    geographies: number;
    tiers: Record<string, number>;
    avg_quality: number;
    avg_quality_10: number;
    year_range: [number | null, number | null];
  }>;
};

function loadReport(): CoverageReport | null {
  /* In-repo paths only. The third candidate used to climb to
     "../delivery/quality/", which is the parent repository and is never
     present on a build server. It was harmless here because the first
     candidate resolves and the chain is wrapped in try/catch, but a dead
     path that reaches outside the repo is a template someone copies. The
     same shape, unguarded, has cost 49 deploys. */
  const candidates = [
    path.resolve(process.cwd(), "data/quality/coverage_v2.json"),
    path.resolve(process.cwd(), "delivery/quality/coverage_v2.json"),
  ];
  for (const p of candidates) {
    try {
      return JSON.parse(fs.readFileSync(p, "utf-8")) as CoverageReport;
    } catch {
      continue;
    }
  }
  return null;
}

export async function generateStaticParams() {
  // Pre-render top 30 GDP countries only; rest
  // on-demand. Was 195 pages, contributing to build-worker OOM.
  const TOP_30 = ["US","CN","JP","DE","IN","GB","FR","IT","CA","BR","RU","KR","AU","ES","MX","ID","NL","SA","TR","CH","PL","AR","BE","SE","TH","IE","NO","AT","IL","SG"];
  return TOP_30.map((iso2) => ({ iso2: iso2.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ iso2: string }>;
}) {
  const { iso2 } = await params;
  const upper = iso2.toUpperCase();
  const c = COUNTRIES.find((c) => c.code === upper);
  return {
    title: `${c?.name || iso2} coverage: Margin Atlas`,
    description: `Per-country data quality scorecard for ${c?.name || iso2}.`,
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

  const report = loadReport();
  const entry = report?.countries.find((c) => c.iso2 === iso2);

  const totalCells = entry ? entry.regional_cells + entry.extrapolated_cells : 0;
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
        <p className="mt-6 text-ink-700">
          No coverage data on disk for {meta.name} yet: run the coverage audit
          to refresh.
        </p>
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

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-ink-900 mb-3">
              Coverage breakdown
            </h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="p-4 rounded-xl bg-cream-100 border border-parchment">
                <div className="text-xs uppercase tracking-wide text-ink-700/70 font-medium">
                  Regional / sub-national
                </div>
                <div className="mt-1 text-2xl font-semibold text-ink-900 tabular-nums">
                  {entry.regional_cells.toLocaleString()}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-cream-100 border border-parchment">
                <div className="text-xs uppercase tracking-wide text-ink-700/70 font-medium">
                  Country-level extrapolated
                </div>
                <div className="mt-1 text-2xl font-semibold text-ink-900 tabular-nums">
                  {entry.extrapolated_cells.toLocaleString()}
                </div>
              </div>
            </div>
          </section>

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
          className="px-4 py-2 rounded-full bg-ink-900 text-cream-50 hover:bg-ink-800 transition font-medium"
        >
          Open {meta.name} country page →
        </Link>
        <Link
          href="/coverage"
          className="px-4 py-2 rounded-full bg-cream-100 border border-parchment text-ink-900 hover:bg-white transition font-medium"
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
    <div className="p-4 rounded-xl bg-cream-100 border border-parchment">
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
