/**
 * /industries — top-level industry directory.
 *
 * The previous page was ugly except
 * for the A-Z section. Two clear blocks remain:
 *
 *   1. Hero (center-aligned, consistent with home)
 *   2. A-Z list (kept; founder explicit: this part is good)
 *
 * The 'Popular industries' middle section is removed (duplicates the
 * homepage navigator and the Featured grid). The browse-by-sector card
 * grid was removed when sector pages were retired.
 */
import Link from "next/link";
import {
  INDUSTRIES,
  industryToSlug,
  isDefaultVisible,
} from "@/lib/taxonomy";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export const revalidate = 86400;

export const metadata = {
  title: "All activities: Margin Atlas",
  description:
    "Every activity covered in Margin Atlas. Pick one to see how it earns across the whole world.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesIndex() {
  const visibleIndustries = INDUSTRIES.filter(isDefaultVisible).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <div>
      {/* Hero */}
      <section className="py-10 md:py-14 text-center">
        <SectionEyebrow size="md" className="mb-3">Activities</SectionEyebrow>
        <h1 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-ink-900 leading-tight max-w-3xl mx-auto">
          Every kind of small business we cover
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-ink-800 leading-relaxed">
          Pick an activity to see how it earns worldwide: typical revenue,
          employment, after-tax owner take-home, and where every business
          lands from bottom 10% to top 10%.
        </p>
      </section>

      {/* Browse-by-sector grid retired alongside the sector pages: it
         linked to /sectors/[id], a destination too diluted to keep. The
         A-Z activity list below is now the primary directory. */}

      {/* A-Z list — founder-approved as-is. */}
      <section className="py-10 md:py-14 border-t border-ink-100">
        <div className="text-center mb-6 md:mb-8">
          <SectionEyebrow size="md">All activities</SectionEyebrow>
          <h2 className="mt-2 font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900">
            {visibleIndustries.length} activities, A to Z
          </h2>
          <p className="mt-2 text-sm md:text-base text-ink-700 max-w-2xl mx-auto">
            Each name opens its worldwide benchmark page: typical revenue,
            employment, and how the activity varies country by country.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-2 text-sm max-w-6xl mx-auto">
          {visibleIndustries.map((ind) => (
            <Link
              key={ind.id}
              href={`/industries/${industryToSlug(ind.id)}`}
              className="text-ink-900 hover:text-atlas-700 transition-colors truncate py-1"
            >
              {ind.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
