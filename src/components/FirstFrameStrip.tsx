/**
 * FirstFrameStrip — Plan v4.0 Step 15.
 *
 * A wide horizontal strip under the navigator showing a real cell's
 * headline numbers. Rotates hourly via /api/popular-cell-snapshot.
 * Server component — server-fetches at render time, never flashes.
 */

import { getCellBySlug } from "@/lib/cells";
import { CountryFlag } from "@/components/CountryFlag";

type Pick = { country: string; geo: string; industry: string };

const ROTATION: Pick[] = [
  { country: "us", geo: "california",           industry: "restaurants" },
  { country: "us", geo: "new-york",             industry: "real-estate-agencies" },
  { country: "us", geo: "florida",              industry: "hairdressers-beauty" },
  { country: "us", geo: "texas",                industry: "auto-repair-shops" },
  { country: "us", geo: "california",           industry: "software-development" },
  { country: "us", geo: "district-of-columbia", industry: "management-consulting" },
];

function fmtMoney(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "—";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

function fmtCount(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "—";
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
  return v.toLocaleString();
}

export async function FirstFrameStrip() {
  // Hourly rotation index keeps the cache key stable per hour.
  const hourBucket = Math.floor(Date.now() / (1000 * 60 * 60));
  let cell = null;
  let pick: Pick | null = null;
  for (let i = 0; i < ROTATION.length; i++) {
    const p = ROTATION[(hourBucket + i) % ROTATION.length];
    const c = await getCellBySlug(p.country, p.geo, p.industry);
    if (c && c.revenue_per_firm != null) {
      cell = c;
      pick = p;
      break;
    }
  }
  if (!cell || !pick) return null;

  // Plan v13 Wave 4a — avg-employees-per-firm display removed (n_enterprises
  // denominator is unreliable, so the derived ratio looks dubious).
  const cellUrl = `/${pick.country}/${pick.geo}/${pick.industry}`;

  return (
    <section className="mt-6 mb-2">
      <a
        href={cellUrl}
        className="block rounded-2xl bg-gradient-to-br from-cream-100 via-cream-200 to-cream-100 border border-parchment hover:border-atlas-600 transition-all p-4 md:p-5"
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-atlas-100 text-atlas-700 font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-atlas-500 animate-pulse" aria-hidden />
              First look
            </span>
            <span className="text-cocoa-700 inline-flex items-center gap-1">
              <CountryFlag iso2={pick.country} label={cell.geo_name || pick.country} className="w-4" />
              <span>{cell.industry_name} in {cell.geo_name} · {cell.year}</span>
            </span>
          </div>
          <span className="text-xs text-atlas-700 font-medium hover:text-atlas-900">
            See full cell →
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          <Cell label="Typical revenue / firm" value={fmtMoney(cell.revenue_per_firm)} />
          <Cell label="Firms" value={fmtCount(cell.n_enterprises)} />
          <Cell
            label="Wage / employee"
            value={fmtMoney(cell.payroll_per_employee)}
            mutedOnMobile
          />
        </div>
      </a>
    </section>
  );
}

function Cell({
  label,
  value,
  mutedOnMobile,
}: {
  label: string;
  value: string;
  mutedOnMobile?: boolean;
}) {
  return (
    <div className={mutedOnMobile ? "hidden md:block" : ""}>
      <div className="text-[10px] uppercase tracking-wider text-cocoa-700/70 font-medium">
        {label}
      </div>
      <div className="mt-0.5 text-xl md:text-2xl font-semibold text-ink-900 tabular-nums">
        {value}
      </div>
    </div>
  );
}
