/**
 * NeighborhoodCards -- the homepage "drilled to the neighborhood" proof, rebuilt
 * with REAL deep flavor data (six clickable cards, an image placeholder ready for
 * a real photo, a "known for" line, and one specific not-on-Google detail each).
 * Self-omits below four cards. Server component, tokens only.
 */
import Image from "next/image";

import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { getCityHero, isPatternHero } from "@/lib/images/city_heroes";
import type { NeighborhoodCard } from "@/lib/home/neighborhood_cards";

/** A city's editorial photograph, or the designed pattern when there is none. */
function CardImage({ citySlug, city }: { citySlug: string; city: string }) {
  const hero = getCityHero(citySlug);
  if (!hero || isPatternHero(hero)) {
    return (
      <div
        aria-hidden
        className="h-36 w-full bg-gradient-to-br from-cocoa-700/15 to-atlas-700/15 flex items-center justify-center"
      >
        <span className="font-display text-sm text-cocoa-700/50">{city}</span>
      </div>
    );
  }
  return (
    <div className="relative h-36 w-full overflow-hidden bg-cream-100">
      <Image
        src={hero.image_url_small}
        alt={hero.alt || city}
        fill
        sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 92vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </div>
  );
}

export function NeighborhoodCards({ cards }: { cards: NeighborhoodCard[] }) {
  if (cards.length < 4) return null;
  return (
    <section className="py-12 md:py-16">
      <SectionEyebrow size="md" className="mb-2">Drilled to the neighborhood</SectionEyebrow>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-3">
        The same benchmarks, block by block
      </h2>
      <p className="max-w-2xl text-base text-cocoa-700 leading-relaxed mb-8">
        A business two streets over can run on completely different economics. Here
        is the character behind a few of the places we cover.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {cards.map((n) => (
          <a key={n.href + n.name} href={n.href} className="group atlas-card block overflow-hidden p-0">
            {/* THE REAL PHOTOGRAPH. This slot said "image placeholder, ready
                for a real photo later" and rendered a gradient with the city
                name written on it. The photo has existed the whole time: 209 of
                the 252 cities carry an editorial hero in city_heroes, and the
                homepage was the one surface not using them.

                It is the founder's own note on this page, that there are "very
                few images (placeholders)", and it is the widest gap against
                every reference: a rental marketplace and an airline are both
                photography before they are anything else.

                The 43 cities with no editorial photo keep the gradient. That is
                not a placeholder, it is the designed fallback for a city we
                have no honest image of, and isPatternHero is the branch the
                library was built to expose. */}
            <CardImage citySlug={n.citySlug} city={n.city} />
            <div className="px-5 py-4">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-medium tracking-tight text-ink-900 group-hover:text-atlas-700 transition-colors">
                  {n.name}
                </h3>
                <span className="text-[11px] uppercase tracking-wide text-cocoa-700/70">{n.priceTier}</span>
              </div>
              <p className="mt-1 text-xs text-cocoa-700/80">{n.city}</p>
              <p className="mt-2.5 text-sm text-ink-700"><span className="text-cocoa-700/70">Known for:</span> {n.knownFor}</p>
              <p className="mt-1.5 text-sm text-cocoa-700 leading-relaxed">{n.dontMiss}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
