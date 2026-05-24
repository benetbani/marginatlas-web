/**
 * SectorMasterMenu — Plan v4.0 Step 13, redesigned in v32 hotfix.
 *
 * Founder feedback: the previous cards were too tall, occupied too
 * much space, and used per-sector color blocks that looked unelegant.
 * This version is compact (one short line per tile), uses a uniform
 * white surface with the sector icon as the only visual differentiator,
 * and packs 5-6 columns on desktop instead of 4.
 *
 * Server component — no client-side state, no hydration cost.
 */

import { visibleSectors, visibleIndustriesInSector } from "@/lib/taxonomy";
import { SectorIcon } from "@/components/icons/SectorIcon";

export function SectorMasterMenu() {
  const sectors = visibleSectors({});

  return (
    <section className="py-10 md:py-14">
      <div className="text-center mb-6 md:mb-8">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-atlas-700">
          Browse by category
        </div>
        <h2 className="mt-2 font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900">
          Pick the kind of business
        </h2>
        <p className="mt-2 text-sm md:text-base text-ink-700 max-w-xl mx-auto">
          Twenty categories. Click any to see every industry inside it.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
        {sectors.map((s) => {
          const industries = visibleIndustriesInSector(s.id, {});
          return (
            <a
              key={s.id}
              href={`/sectors/${s.id}`}
              className="group flex items-center gap-3 rounded-xl border border-ink-200 bg-white hover:border-atlas-500 hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all px-3 py-3"
            >
              <div className="shrink-0 w-9 h-9 rounded-md bg-cream-50 border border-parchment flex items-center justify-center text-atlas-700 group-hover:text-atlas-600 transition-colors">
                <SectorIcon sectorId={s.id} size={20} weight="duotone" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-ink-900 leading-tight truncate group-hover:text-atlas-700 transition-colors">
                  {s.name}
                </div>
                <div className="text-[11px] text-ink-500 tabular-nums leading-tight mt-0.5">
                  {industries.length} industries
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
