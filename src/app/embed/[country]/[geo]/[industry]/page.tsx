/**
 * Embed view — a minimal, iframe-friendly version of a cell.
 *
 * Designed to be dropped into Notion, a blog, or a Confluence page.
 * Hides the global header/footer (via parent layout opt-out) and shows
 * just the headline numbers + a tiny attribution footer.
 */

import { notFound } from "next/navigation";
import { getCellBySlug } from "@/lib/cells";

export const revalidate = 604800;
export const dynamicParams = true;

type Params = { country: string; geo: string; industry: string };

function fmtMoney(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "-";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { country, geo, industry } = await params;
  const cell = await getCellBySlug(country, geo, industry);
  if (!cell) return { title: "Not found" };
  return {
    title: `${cell.industry_name} in ${cell.geo_name} | Margin Atlas`,
    robots: { index: false, follow: false },
  };
}

export default async function EmbedCell({ params }: { params: Promise<Params> }) {
  const { country, geo, industry } = await params;
  const cell = await getCellBySlug(country, geo, industry);
  if (!cell) notFound();

  const url = `https://www.marginatlas.com/${country}/${geo}/${industry}`;
  return (
    <div className="p-5 max-w-2xl">
      <div className="text-[10px] uppercase tracking-wide text-atlas-600 font-medium">
        {cell.sector_name && <>{cell.sector_name} · </>}
        {cell.geo_name}
      </div>
      <h2 className="mt-1 text-xl font-semibold text-ink-900">
        {cell.industry_name}
      </h2>
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <Stat label="Typical revenue" value={fmtMoney(cell.revenue_per_firm)} />
        <Stat label="Bottom 10%" value={fmtMoney(cell.rev_p10)} />
        <Stat label="Top 10%" value={fmtMoney(cell.rev_p90)} />
        <Stat label="Wage / employee" value={fmtMoney(cell.payroll_per_employee)} />
      </div>
      <div className="mt-4 text-[10px] text-ink-700/60 flex items-center justify-between">
        <span>Source: Margin Atlas</span>
        <a href={url} target="_blank" rel="noopener" className="hover:text-atlas-600">
          View full page →
        </a>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-ink-200 rounded-lg p-2.5">
      <div className="text-[10px] uppercase tracking-wide text-ink-700/60 font-medium">
        {label}
      </div>
      <div className="mt-1 text-base font-semibold text-ink-900 tabular-nums">{value}</div>
    </div>
  );
}
