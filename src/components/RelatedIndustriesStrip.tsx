/**
 * RelatedIndustriesStrip — Track DD.4.
 *
 * Surfaces sibling industries in the same sector for cross-cell internal
 * linking. Pure server component, no data fetches; just walks the
 * taxonomy in memory. Heavy lift for SEO (deeper internal link graph)
 * with negligible runtime cost.
 */
import Link from "next/link";
import { INDUSTRIES_BY_SECTOR, SECTOR_BY_ID, industryToSlug, isDefaultVisible } from "@/lib/taxonomy";

type Props = {
  country: string;
  geo: string;
  currentIndustryId: string;
  sectorId: string;
};

export function RelatedIndustriesStrip({
  country,
  geo,
  currentIndustryId,
  sectorId,
}: Props) {
  const sector = SECTOR_BY_ID[sectorId];
  const siblings = (INDUSTRIES_BY_SECTOR[sectorId] || [])
    .filter((i) => i.id !== currentIndustryId)
    .filter((i) => isDefaultVisible(i))
    .slice(0, 8);
  if (siblings.length === 0) return null;

  return (
    <section className="mt-10 card bg-cream-100">
      <div className="text-xs uppercase tracking-wide text-atlas-700 font-semibold">
        More in this sector
      </div>
      <div className="mt-1 text-sm text-ink-700/80">
        Same geography ({geo.replace(/-/g, " ")}), different industry: explore
        the {sector?.name?.toLowerCase() || "sector"} neighbors.
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {siblings.map((ind) => (
          <Link
            key={ind.id}
            href={`/${country.toLowerCase()}/${geo}/${industryToSlug(ind.id)}`}
            className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-ink-200 text-xs text-ink-900 hover:border-atlas-500 hover:bg-atlas-50 transition"
          >
            {ind.name} →
          </Link>
        ))}
      </div>
    </section>
  );
}
