/**
 * /industries — the activities directory.
 *
 * Two blocks: a centered hero, then the directory itself. The directory
 * used to be a flat A-Z grid; it is now grouped by sector (mirroring the
 * per-continent grouping on /countries) with a live search bar on top.
 *
 * Split of concerns:
 *   - This server component computes the categorized list ONCE, purely
 *     from the taxonomy (visibleSectors -> visibleIndustriesInSector),
 *     and passes it down as serializable props.
 *   - <ActivitySearch> (client) owns the search input, the live filter,
 *     and the grouped rendering.
 *
 * Site reform v3, Phase B (2026-06-06): categorize + search. The old
 * flat A-Z list and the retired browse-by-sector card grid are gone.
 */
import {
  visibleSectors,
  visibleIndustriesInSector,
  industryToSlug,
} from "@/lib/taxonomy";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import {
  ActivitySearch,
  type SectorGroup,
} from "@/components/industries/ActivitySearch";

export const revalidate = 86400;

export const metadata = {
  title: "All activities: Margin Atlas",
  description:
    "Every activity covered in Margin Atlas, grouped by sector. Pick one to see its cost shape and the revenue range it runs depending on the city.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesIndex() {
  // Build the categorized list from the taxonomy. Default gate (no pro
  // reveal), matching the audience-default visibility the old flat list
  // used. Sectors come back in curated display order; activities are
  // alphabetical within each sector. Empty sectors are dropped by
  // visibleSectors itself, so every group here has at least one activity.
  const groups: SectorGroup[] = visibleSectors().map((sector) => ({
    sector: sector.name,
    activities: visibleIndustriesInSector(sector.id).map((ind) => ({
      slug: industryToSlug(ind.id),
      name: ind.name,
    })),
  }));

  return (
    <div>
      {/* Hero */}
      <section className="py-10 text-center md:py-14">
        <SectionEyebrow size="md" className="mb-3">
          Activities
        </SectionEyebrow>
        <h1 className="mx-auto max-w-3xl font-display text-3xl font-medium leading-tight tracking-tight text-ink-900 md:text-5xl">
          Every kind of small business we cover
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-800 md:text-lg">
          Pick an activity to see how it earns: the cost shape that holds
          everywhere, and a revenue range that runs from roughly one figure to
          several times that depending on the city, plus after-tax owner
          take-home. There is no single worldwide number, so we show the spread.
        </p>
      </section>

      {/* Directory: search bar + sector-grouped activity grids. Sits on
          its own hairline-separated band below the hero. */}
      <section className="border-t border-parchment/60 py-8 md:py-12">
        <ActivitySearch groups={groups} />
      </section>
    </div>
  );
}
