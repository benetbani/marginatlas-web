/**
 * NeighborhoodCards -- the homepage "drilled to the neighborhood" proof, built
 * from REAL deep flavor data (six clickable cards, a designed card head, a
 * "known for" line, and one specific not-on-Google detail each).
 * Self-omits below four cards. Server component, tokens only.
 */
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import type { NeighborhoodCard } from "@/lib/home/neighborhood_cards";

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
            {/* NOT A PHOTOGRAPH, AND NOT A PLACEHOLDER EITHER.
                This slot was briefly wired to the city's hero from
                city_heroes, on the reasoning that 209 of the 252 cities carry
                one and the homepage was the only surface not using them. Those
                heroes are Pexels stock photographs, and "no stock imagery" is a
                hard constraint, listed in the 2026-06-06 overhaul plan beside
                no-em-dashes and tokens-only, and again in the design system as
                "no stock gloss".

                This page in particular: ExploreCards was DELETED from the
                homepage for using Pexels, and the comment recording that is
                forty lines up in src/app/page.tsx. Putting stock photography
                back into the same page is the specific mistake that rule
                exists to prevent, so it came straight back out.

                The card head is a designed field, which is what the brand asks
                for: imagery that honors a real place rather than a photograph
                of some other place sold by the frame. When the founder has real
                photography, or commissions it, this is where it goes. */}
            <div
              aria-hidden
              className="h-36 w-full bg-gradient-to-br from-cocoa-700/15 to-atlas-700/15 flex items-center justify-center"
            >
              <span className="font-display text-sm text-cocoa-700/50">{n.city}</span>
            </div>
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
