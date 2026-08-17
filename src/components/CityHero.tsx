/**
 * Reformation idea #1 — wide cinematic hero image at the top of cell
 * pages for Tier 1+2 cities, tinted to Atlas amber via CSS layers.
 *
 * Source policy 2026-05-26: Pexels-only. Pexels' license does not
 * require attribution, so no photographer credit is rendered. If a
 * city's hero is a pattern fallback (no curated photo), returns null
 * and the page falls back to the existing text-only hero.
 */
import { getCityHero, isPatternHero } from "@/lib/images/city_heroes";
import { colors } from "@/lib/design-tokens";

type Props = {
  citySlug: string;
  /** Optional explicit alt text; falls through to the cached alt. */
  altOverride?: string;
};

export function CityHero({ citySlug, altOverride }: Props) {
  const hero = getCityHero(citySlug);
  if (!hero) return null;
  // Sanity §7 — when only a pattern-card fallback exists, render nothing
  // so the page's existing text-first hero (HeroBenchmark) stays in place.
  if (isPatternHero(hero)) return null;
  if (!hero.image_url_regular) return null;

  return (
    <section className="relative w-full overflow-hidden" style={{ aspectRatio: "21 / 9" }}>
      {/* Photo */}
      <img
        src={hero.image_url_regular}
        alt={altOverride || hero.alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
        // CSS tint per Atlas brand (visual_assets_plan.md)
        style={{ filter: "contrast(1.08) saturate(0.85)" }}
      />
      {/* THE PHOTO TINT, terracotta since 2026-08-17, amber before it.
          Its own comment said "amber gradient overlay for brand cohesion",
          which was true of the brand it was written for and is the opposite of
          cohesion now: the accent is terracotta and this painted every city
          hero photograph a different warm hue from the page around it. The
          middle stop was rgba(212, 119, 6), #d47706, and it was written as an
          rgb() literal rather than a token, which is how the gate saw it at all
          (its class-name check knows names, not numbers).

          Three stops, one family now. The bottom stop is unchanged: #78350f
          measures hue 21.7, already inside the terracotta band. The middle
          moves to atlas-700, the same ramp, so the wash deepens through one hue
          instead of sliding amber-to-brown. The top stop was a transparent
          CREAM, which is banned separately and renders identically at alpha 0,
          so it is plain transparent white. Weight is untouched: the alphas
          stay .18 and .34 and the blend stays multiply. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, rgba(255, 255, 255, 0.0) 0%, ${colors.atlas[700]}2e 60%, rgba(120, 53, 15, 0.34) 100%)`,
          mixBlendMode: "multiply",
        }}
      />
      {/* Subtle bottom-of-image fade so any caption / following content blends */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 247, 230, 0) 0%, rgba(255, 247, 230, 0.95) 100%)",
        }}
      />
    </section>
  );
}
