/**
 * SectorMasterMenu — Plan v4.0 Step 13.
 *
 * The curated 20-category grid that lives directly under the navigator
 * and gives the visitor a single-click "I want this category" entry
 * point. Tiles render in display_order (NOT alphabetical).
 *
 * Server component — no client-side state, no hydration cost.
 */

import { visibleSectors, visibleIndustriesInSector } from "@/lib/taxonomy";

export function SectorMasterMenu() {
  const sectors = visibleSectors({});

  return (
    <section className="py-10">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink-900">
          Browse by category
        </h2>
        <p className="text-sm text-cocoa-700/70 hidden md:block">
          Pick the broad area, then drill into specific small-business industries.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {sectors.map((s) => {
          const industries = visibleIndustriesInSector(s.id, {});
          const examples = industries.slice(0, 4).map((i) => i.name);
          return (
            <a
              key={s.id}
              href={`/sectors/${s.id}`}
              className="group relative overflow-hidden rounded-2xl border border-parchment hover:border-atlas-600 transition-all p-4 flex flex-col gap-3"
              style={{ backgroundColor: s.header_color || "#F8F2E4" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-3xl leading-none" aria-hidden>
                  {s.icon}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-cocoa-700/50 font-medium tabular-nums">
                  {industries.length}
                </div>
              </div>
              <div>
                <div className="text-base font-semibold text-ink-900 group-hover:text-atlas-700 transition-colors">
                  {s.name}
                </div>
                {s.tagline && (
                  <div className="text-xs text-cocoa-700/80 leading-snug mt-1">
                    {s.tagline}
                  </div>
                )}
              </div>
              {examples.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-auto pt-2 border-t border-cocoa-700/10">
                  {examples.map((e) => (
                    <span
                      key={e}
                      className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/60 text-cocoa-700/80"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              )}
            </a>
          );
        })}
      </div>
    </section>
  );
}
