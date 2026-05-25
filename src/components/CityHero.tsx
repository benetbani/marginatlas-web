/**
 * Reformation idea #1 — wide cinematic hero image at the top of cell
 * pages for Tier 1+2 cities, tinted to Atlas amber via CSS layers.
 *
 * Renders the photo from Unsplash with required attribution. If no
 * hero is cached for the city, returns null and the page falls back
 * to the existing text-only hero (HeroBenchmark).
 *
 * Server component. Zero client cost.
 */
import { getCityHero, isPatternHero, type CityHero as CityHeroType } from "@/lib/images/city_heroes";

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
      {/* Photographer credit, bottom-right, tiny */}
      <PhotoCredit hero={hero} />
    </section>
  );
}

function PhotoCredit({ hero }: { hero: CityHeroType }) {
  const utm =
    "?utm_source=margin_atlas&utm_medium=referral";
  return (
    <div className="absolute bottom-2 right-3 text-[10px] text-ink-900/70 tracking-wide">
      Photo by{" "}
      <a
        href={`${hero.photographer_url}${utm}`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-atlas-700 transition-colors"
      >
        {hero.photographer_name}
      </a>{" "}
      on{" "}
      <a
        href={`https://unsplash.com${utm}`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-atlas-700 transition-colors"
      >
        Unsplash
      </a>
    </div>
  );
}
