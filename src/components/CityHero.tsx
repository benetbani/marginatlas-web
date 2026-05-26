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
      {/* Amber gradient overlay for brand cohesion */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 247, 230, 0.0) 0%, rgba(212, 119, 6, 0.18) 60%, rgba(120, 53, 15, 0.34) 100%)",
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
