import { visibleSectors, visibleIndustriesInSector } from "@/lib/taxonomy";
import { SectorIcon } from "@/components/icons/SectorIcon";

export const revalidate = 86400;

export const metadata = {
  title: "Browse categories | Margin Atlas",
  description: "All 20 small-business categories, in master-menu order.",
};

export default function SectorsIndex() {
  const sectors = visibleSectors({});
  return (
    <div>
      <header className="py-10">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
          Browse categories
        </h1>
        <p className="mt-3 text-lg text-ink-900/80 max-w-2xl">
          Twenty small-business categories. Pick a category to see every
          industry inside it.
        </p>
      </header>
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {sectors.map((s) => {
          const industries = visibleIndustriesInSector(s.id, {});
          return (
            <a
              key={s.id}
              href={`/sectors/${s.id}`}
              className="group rounded-2xl border border-parchment hover:border-atlas-600 p-4 flex flex-col gap-3 transition-all"
              style={{ backgroundColor: s.header_color || "#F8F2E4" }}
            >
              <div className="flex items-start justify-between">
                {/* Plan v19 Block F — Phosphor icon replaces emoji */}
                <span className="text-atlas-700" aria-hidden>
                  <SectorIcon sectorId={s.id} size={40} weight="duotone" />
                </span>
                <span className="text-[11px] uppercase tracking-wider text-cocoa-700/60 font-medium tabular-nums">
                  {industries.length}
                </span>
              </div>
              <div>
                <div className="text-base font-semibold text-ink-900 group-hover:text-atlas-700 transition-colors">
                  {s.name}
                </div>
                {s.tagline && (
                  <div className="mt-1 text-xs text-cocoa-700/80 leading-snug">
                    {s.tagline}
                  </div>
                )}
              </div>
            </a>
          );
        })}
      </section>
      <p className="mt-10 text-xs text-cocoa-700/60">
        Hidden by default: 5 categories dominated by very large firms (banking,
        oil & gas, pharma, telecom carriers, hospitals/universities). Available
        to Pro subscribers with appropriate firm-size segmentation.
      </p>
    </div>
  );
}
