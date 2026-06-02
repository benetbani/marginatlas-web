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
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export function SectorMasterMenu() {
  const sectors = visibleSectors({});

  return (
    <section className="py-10 md:py-14">
      <div className="text-center mb-6 md:mb-8">
        <SectionEyebrow size="md">Browse by sector</SectionEyebrow>
        <h2 className="mt-2 font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900">
          Pick the kind of business
        </h2>
        <p className="mt-2 text-sm md:text-base text-ink-700 max-w-xl mx-auto">
          Twenty sectors. Click any to see every activity inside it.
        </p>
      </div>

      {/* Founder direction 2026-05-26 (revised): cards are now vertical
          tiles. The top portion is a placeholder background where the
          eventual sector photo will live (a soft warm-cream gradient
          with the icon as a subtle large watermark, so each card is
          still distinguishable until photos arrive). The bottom of
          each card is a white ribbon containing the sector name + the
          "X activities" subtitle. */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {sectors.map((s) => {
          const industries = visibleIndustriesInSector(s.id, {});
          return (
            <a
              key={s.id}
              href={`/sectors/${s.id}`}
              className="group relative block rounded-xl overflow-hidden border border-ink-200 bg-cream-50 hover:border-atlas-500 hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] transition-all aspect-[4/3]"
            >
              {/* Placeholder background. Will be swapped for a real
                  sector photo once Pexels curation lands. */}
              <div className="absolute inset-0 bg-gradient-to-br from-cream-50 via-cream-100 to-parchment" />
              {/* Subtle large watermark icon — visible distinction per
                  sector during the placeholder phase. */}
              <div className="absolute inset-0 flex items-center justify-center text-atlas-700/15">
                <SectorIcon sectorId={s.id} size={88} weight="duotone" />
              </div>
              {/* White ribbon at the bottom — title + activities count. */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-ink-100 px-3 py-2.5 md:px-4 md:py-3">
                <div className="text-sm md:text-base font-semibold text-ink-900 leading-tight truncate group-hover:text-atlas-700 transition-colors">
                  {s.name}
                </div>
                <div className="text-[11px] md:text-xs text-ink-500 tabular-nums leading-tight mt-0.5">
                  {industries.length} activities
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
