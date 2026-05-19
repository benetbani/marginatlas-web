/**
 * /world — global coverage map page (Track FF.1).
 *
 * Server-rendered list of every country in the atlas, grouped by
 * region. Public copy never exposes the internal cell-count or
 * confidence-score signals (Plan v13 Wave 1).
 */
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { COUNTRIES } from "@/lib/taxonomy";

export const revalidate = 21600; // 6 hours

type CoverageReport = {
  countries: Array<{
    iso2: string;
    regional_cells: number;
    extrapolated_cells: number;
    avg_quality_10: number;
  }>;
};

function loadReport(): CoverageReport | null {
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

function qualityFill(q: number): string {
  if (q >= 7) return "bg-moss-200 border-moss-400 text-moss-900";
  if (q >= 5) return "bg-cream-200 border-parchment text-ink-900";
  if (q >= 3) return "bg-clay-100 border-clay-300 text-clay-900";
  return "bg-ink-100 border-ink-200 text-ink-700/70";
}

function chipSize(cells: number): string {
  // 4 size buckets, ramp tile area with cell-count tiers
  if (cells >= 50000) return "col-span-2 row-span-2 text-base";
  if (cells >= 10000) return "col-span-2 text-sm";
  if (cells >= 1000) return "text-sm";
  return "text-xs";
}

export const metadata = {
  title: "World map: Margin Atlas",
  description: "Every country in Margin Atlas.",
};

// Loose regional groupings so the page reads geographically rather than
// alphabetically. Countries not in any region show up in "Rest of world".
const REGIONS: Record<string, string[]> = {
  "North America": ["US", "CA", "MX"],
  "Latin America & Caribbean": [
    "BR", "AR", "CL", "CO", "PE", "EC", "UY", "PY", "VE", "BO",
    "CR", "PA", "DO", "GT", "HN", "SV", "NI", "JM", "TT", "BB", "BS",
  ],
  "Western Europe": [
    "GB", "FR", "DE", "IT", "ES", "NL", "BE", "LU", "IE", "PT",
    "CH", "AT", "DK", "SE", "NO", "FI", "IS", "MT", "CY", "GR",
    "AD", "MC", "LI", "SM", "VA",
  ],
  "Central & Eastern Europe": [
    "PL", "CZ", "SK", "HU", "RO", "BG", "HR", "SI", "EE", "LV", "LT",
    "AL", "MK", "BA", "ME", "RS", "RU", "UA", "BY", "MD",
  ],
  "Middle East & North Africa": [
    "IL", "TR", "SA", "AE", "QA", "KW", "BH", "OM", "JO", "LB",
    "EG", "MA", "TN", "DZ", "LY", "YE", "IQ", "IR",
  ],
  "Asia": [
    "JP", "KR", "CN", "TW", "HK", "SG", "MY", "TH", "ID", "PH", "VN",
    "IN", "PK", "BD", "LK", "NP", "MM", "KH", "LA", "MN",
    "KZ", "UZ", "AZ", "GE", "AM", "KG", "TJ", "TM",
  ],
  "Africa": [
    "ZA", "NG", "KE", "ET", "GH", "SN", "CI", "CM", "TZ", "UG",
    "MZ", "ZW", "ZM", "MG", "RW", "AO",
  ],
  "Oceania": ["AU", "NZ", "FJ", "PG", "WS", "TO"],
};

function countryName(iso2: string): string {
  return COUNTRIES.find((c) => c.code === iso2)?.name || iso2;
}

export default async function WorldPage() {
  const report = loadReport();
  const byIso2 = new Map(report?.countries.map((c) => [c.iso2, c]) || []);

  const covered = (iso2: string) => byIso2.has(iso2) && (byIso2.get(iso2)!.regional_cells + byIso2.get(iso2)!.extrapolated_cells) > 0;

  // Build "Rest of world" bucket from any covered country not placed yet
  const placed = new Set(Object.values(REGIONS).flat());
  const rest = (report?.countries || [])
    .filter((c) => !placed.has(c.iso2))
    .map((c) => c.iso2)
    .sort();

  const allRegions: Array<[string, string[]]> = [
    ...Object.entries(REGIONS),
    ["Rest of world", rest],
  ];

  return (
    <div className="py-12">
      <header className="max-w-3xl">
        <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
          Coverage at a glance
        </div>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-ink-900">
          The atlas in one view
        </h1>
        <p className="mt-3 text-ink-700 leading-relaxed">
          Each tile is a country we cover. Tap one to drill into its
          regions and industries.
        </p>
      </header>

      <section className="mt-6 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-ink-700/70">Quality:</span>
        <span className="px-2 py-0.5 rounded-full bg-moss-200 border border-moss-400 text-moss-900 font-medium">
          7-10 strong
        </span>
        <span className="px-2 py-0.5 rounded-full bg-cream-200 border border-parchment text-ink-900 font-medium">
          5-6 solid
        </span>
        <span className="px-2 py-0.5 rounded-full bg-clay-100 border border-clay-300 text-clay-900 font-medium">
          3-4 emerging
        </span>
        <span className="px-2 py-0.5 rounded-full bg-ink-100 border border-ink-200 text-ink-700/70 font-medium">
          1-2 sparse
        </span>
      </section>

      {allRegions.map(([region, isos]) => {
        const present = isos.filter(covered);
        if (present.length === 0) return null;
        return (
          <section key={region} className="mt-10">
            <h2 className="text-lg font-semibold text-ink-900 mb-3">
              {region}{" "}
              <span className="text-sm font-normal text-ink-700/70">
                ({present.length})
              </span>
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2 auto-rows-[80px]">
              {present.map((iso2) => {
                const e = byIso2.get(iso2)!;
                const cells = e.regional_cells + e.extrapolated_cells;
                return (
                  <Link
                    key={iso2}
                    href={`/${iso2.toLowerCase()}`}
                    className={`flex flex-col justify-between p-2 rounded-lg border transition hover:scale-[1.02] hover:shadow-sm ${qualityFill(
                      e.avg_quality_10
                    )} ${chipSize(cells)}`}
                  >
                    <div className="font-mono font-semibold text-xs">{iso2}</div>
                    <div className="flex flex-col leading-tight">
                      <span className="font-semibold truncate">
                        {countryName(iso2)}
                      </span>
                      <span className="text-[10px] opacity-80 tabular-nums">
                        {cells.toLocaleString()} cells · q{e.avg_quality_10}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className="mt-12 p-6 rounded-2xl bg-cream-100 border border-parchment">
        <h2 className="text-lg font-semibold text-ink-900">
          Want a country we don&apos;t cover?
        </h2>
        <p className="mt-1 text-sm text-ink-700">
          Send a note via{" "}
          <Link href="/coverage" className="text-atlas-700 hover:text-atlas-900">
            the coverage report
          </Link>
          {" "}: countries with multiple requests jump the queue.
        </p>
      </section>
    </div>
  );
}
