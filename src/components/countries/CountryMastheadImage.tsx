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
 * The treatment itself (low opacity, duotone filter, warm-white wash, the
 * aria-hidden decorative frame) now lives in the shared <MastheadImage> so the
 * country, city, and cell mastheads stay identical; this component only owns
 * the country-specific source resolution and self-omit policy and hands the
 * resolved URL to that shared treatment.
 *
 * Server component. Tokens / Tailwind classes plus rgba() gradient layers
 * (rgba is not a raw hex literal, matching CityHero); mobile-first.
 */
import { MastheadImage } from "@/components/board/MastheadImage";
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

  return <MastheadImage src={src} />;
}
