/**
 * src/components/countries/CountryMastheadImage.tsx
 *
 * The country masthead background photo. Restores the country hero image the
 * board rebuild dropped, but as ATMOSPHERE rather than foreground: a single
 * low-opacity, desaturated (duotone-leaning) country photo that sits BEHIND
 * the masthead's flag / eyebrow / title and fades to the page's warm white,
 * so the white system and the data board below keep full legibility. The
 * image is the deliberate exception to pure-white; the body stays white.
 *
 * Source: the pre-fetched country hero manifest (getCountryHero, keyed by
 * ISO2). That loader already layers an editorial photo over a legacy photo
 * manifest and falls back to a "pattern" variant when neither source has a
 * usable image for a country.
 *
 * Self-omits cleanly (returns null) when:
 *   - the country has no hero record,
 *   - the record is the pattern fallback (no real photo), or
 *   - the record carries no usable image URL.
 * In every omit case the masthead simply renders on plain white, so a country
 * without a resolvable image degrades to the quiet white masthead rather than
 * a broken or empty frame.
 *
 * No attribution, photographer, or source string is ever rendered (R-002, and
 * the same policy CityHero follows): the photo is wallpaper, not a credited
 * figure. Decorative only, so it is aria-hidden and carries empty alt.
 *
 * Server component. Tokens / Tailwind classes plus rgba() gradient layers
 * (rgba is not a raw hex literal, matching CityHero); mobile-first.
 */
import { getCountryHero, isPatternCountryHero } from "@/lib/images/country_heroes";

export function CountryMastheadImage({
  iso2,
  countryName,
}: {
  iso2: string;
  /** Accepted for call-site symmetry; intentionally not surfaced as visible
   *  text since the image is decorative and carries empty alt. */
  countryName?: string;
}) {
  void countryName;

  const hero = getCountryHero(iso2);
  // Self-omit: no record, a pattern-card fallback (no real photo), or no URL.
  if (!hero) return null;
  if (isPatternCountryHero(hero)) return null;
  const src = hero.image_url_regular || hero.image_url_full;
  if (!src) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* The photo, low-opacity and desaturated so it reads as a tinted
         backdrop rather than a foreground image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        style={{ filter: "grayscale(0.55) contrast(1.02) saturate(0.7)" }}
      />
      {/* Warm-white duotone wash: pulls the photo toward the site's cream and
         lifts the lower portion to near-solid white so the masthead text and
         the data board immediately below stay fully legible. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,247,230,0.55) 0%, rgba(255,247,230,0.78) 55%, rgba(255,247,230,0.97) 100%)",
        }}
      />
    </div>
  );
}
