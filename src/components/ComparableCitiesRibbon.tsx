/**
 * Reformation idea #4 — "If you liked X, look at Y" card ribbon.
 *
 * Renders 3 peer-city cards under the main benchmark. Each card links
 * to the same industry in the peer city, encouraging horizontal
 * exploration instead of bounce.
 *
 * Server component. Zero client cost.
 */
import { getComparableCities } from "@/lib/cities/comparable_cities";
import { CountryFlag } from "@/components/CountryFlag";

type Props = {
  /** City slug from the URL — used as the seed for comparison. */
  citySlug: string;
  /** Industry slug — preserved so the destination card stays on the same industry. */
  industrySlug: string;
  /** Optional friendly industry name for the header copy. */
  industryName?: string;
};

export function ComparableCitiesRibbon({
  citySlug,
  industrySlug,
  industryName,
}: Props) {
  const peers = getComparableCities(citySlug, 3);
  if (peers.length === 0) return null;

  const seedLabel = citySlug
    .split("-")
    .map((s) => s[0]?.toUpperCase() + s.slice(1))
    .join(" ");

  return (
    <section className="py-10 md:py-14">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
        Cities that feel like {seedLabel}
      </div>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-2 max-w-3xl">
        If you&apos;re curious about {industryName ? industryName.toLowerCase() : "this industry"} elsewhere
      </h2>
      <p className="text-sm md:text-base text-cocoa-700/80 mb-6 max-w-2xl">
        Comparable in scale, culture, or wealth. A starting point for
        wandering.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {peers.map((p) => (
          <a
            key={`${p.iso2}-${p.slug}`}
            href={`/${p.iso2.toLowerCase()}/${p.slug}/${industrySlug}`}
            className="atlas-card group block p-5"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-cocoa-700/60 font-semibold mb-2">
              <CountryFlag iso2={p.iso2} className="w-4" />
              <span>{p.continent}</span>
            </div>
            <div className="font-display text-xl md:text-2xl font-medium tracking-tight text-ink-900 group-hover:text-atlas-700 transition-colors">
              {p.name}
            </div>
            {/* THE CARD IS THE LINK. This line described the affordance the card
                already has, the third instance of that defect on the site: it was
                deleted from the country page's break-in cards on 2026-08-20 and
                still shipped from here and from the cell page's city ribbon.
                Founder, 2026-08-21: "too much text, too little graphics, and they
                don't help each other at all." */}
          </a>
        ))}
      </div>
    </section>
  );
}
