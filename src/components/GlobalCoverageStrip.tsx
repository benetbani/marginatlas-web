/**
 * GlobalCoverageStrip — server component showing live database scope.
 *
 * Renders four big numbers (countries / cities / cells / industries) +
 * a small flag chip row for visual interest. Static (no client JS).
 */

import { COUNTRIES } from "@/lib/taxonomy";
import { TOP_100_CITIES } from "@/lib/cities";
import { CountryFlag } from "@/components/CountryFlag";
import { supabaseAdmin } from "@/lib/supabase";

async function getRegionalCellCount(): Promise<number> {
  try {
    const { count } = await supabaseAdmin
      .from("regional_cells")
      .select("country", { count: "exact", head: true });
    return count ?? 0;
  } catch {
    return 0;
  }
}

const FEATURED_FLAGS = ["US", "GB", "DE", "FR", "MX", "AU", "BR", "JP", "AL", "ZA"];

export async function GlobalCoverageStrip() {
  const cellCount = await getRegionalCellCount();
  const countryCount = COUNTRIES.length;
  const cityCount = TOP_100_CITIES.length;

  return (
    <section className="my-10">
      <div className="rounded-2xl border border-parchment bg-cream-100 p-6 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <Stat number={countryCount} label="Countries" />
          <Stat number={cellCount} label="Measured cells" suffix={cellCount > 100_000 ? "" : ""} />
          <Stat number={cityCount} label="Top cities curated" />
          <Stat number={206} label="SMB industries" />
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
          {FEATURED_FLAGS.map((iso2) => (
            <a
              key={iso2}
              href={`/${iso2.toLowerCase()}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white hover:bg-atlas-100 hover:text-atlas-700 border border-cream-300 text-xs font-medium text-ink-800 transition"
            >
              <CountryFlag iso2={iso2} className="w-4" />
              <span>{iso2}</span>
            </a>
          ))}
          <a
            href="/browse"
            className="inline-flex items-center px-3 py-1 rounded-full bg-atlas-600 hover:bg-atlas-700 text-white text-xs font-medium transition"
          >
            Browse all →
          </a>
        </div>
      </div>
    </section>
  );
}

function Stat({ number, label, suffix }: { number: number; label: string; suffix?: string }) {
  const display = number >= 1_000_000
    ? `${(number / 1_000_000).toFixed(1)}M`
    : number >= 1000
    ? `${(number / 1000).toFixed(number < 100_000 ? 1 : 0)}k`
    : String(number);
  return (
    <div>
      <div className="text-3xl md:text-4xl font-bold text-ink-900 tabular-nums">
        {display}{suffix}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wider text-ink-700/60 font-medium">
        {label}
      </div>
    </div>
  );
}
