/**
 * /world — global coverage page.
 *
 * Plan v16 Block A9 — uniform tile sizes, no benchmark-count or quality
 * score leaked into the UI (D-107 + R-002 lockdown). Server-rendered;
 * regional grouping kept.
 */
import Link from "next/link";
import { COUNTRIES } from "@/lib/taxonomy";
import { getCoverageReport } from "@/lib/quality/coverage-report";

export const revalidate = 21600; // 6 hours

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
  const report = getCoverageReport();
  // Plan v32 hotfix — only allow REAL ISO2 country codes (from the
  // COUNTRIES taxonomy). The coverage report leaked ISO3 codes (BDI,
  // AFG, ZWE) and World Bank regional aggregates (AFE, EUU, WLD,
  // IBD, etc.) which were rendering as "countries" on /world. Build
  // the lookup map from the intersection so only real countries can
  // render below.
  const VALID_ISO2 = new Set(COUNTRIES.map((c) => c.code));
  const byIso2 = new Map(
    (report?.countries || [])
      .filter((c) => VALID_ISO2.has(c.iso2))
      .map((c) => [c.iso2, c]),
  );

  const covered = (iso2: string) =>
    byIso2.has(iso2) &&
    (byIso2.get(iso2)!.regional_cells + byIso2.get(iso2)!.extrapolated_cells) > 0;

  // Build "Rest of world" bucket from any covered country not placed yet.
  // Uses the filtered byIso2 (real ISO2 only) so it can't reintroduce
  // the ISO3 / aggregate codes.
  const placed = new Set(Object.values(REGIONS).flat());
  const rest = Array.from(byIso2.keys())
    .filter((iso2) => !placed.has(iso2))
    .sort();

  const allRegions: Array<[string, string[]]> = [
    ...Object.entries(REGIONS),
    ["Rest of world", rest],
  ];

  return (
    <div className="py-12">
      <header className="max-w-3xl">
        <div className="text-xs uppercase tracking-wide text-atlas-700 font-semibold">
          Worldwide coverage
        </div>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-ink-900">
          Every country in Margin Atlas
        </h1>
        <p className="mt-3 text-ink-800 leading-relaxed">
          Tap any country to drill into its regions and small-business industries.
        </p>
      </header>

      {allRegions.map(([region, isos]) => {
        const present = isos.filter(covered);
        if (present.length === 0) return null;
        return (
          <section key={region} className="mt-10">
            <h2 className="text-lg font-semibold text-ink-900 mb-3">{region}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {present.map((iso2) => (
                <Link
                  key={iso2}
                  href={`/${iso2.toLowerCase()}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-cream-100 border border-parchment hover:bg-white hover:border-atlas-500 transition-colors"
                >
                  <span className="font-mono font-semibold text-xs text-cocoa-700/70 shrink-0 w-8">
                    {iso2}
                  </span>
                  <span className="text-sm font-medium text-ink-900 truncate">
                    {countryName(iso2)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <section className="mt-12 p-6 rounded-2xl bg-white border border-ink-200">
        <h2 className="text-lg font-semibold text-ink-900">
          Looking for a specific country?
        </h2>
        <p className="mt-1 text-sm text-ink-700">
          Open the full{" "}
          <Link href="/coverage" className="text-atlas-700 hover:text-atlas-900">
            coverage page
          </Link>{" "}
          for a sortable view of every country, with benchmark depth and
          industry count side-by-side.
        </p>
      </section>
    </div>
  );
}
