/**
 * src/components/board/MastheadImage.tsx
 *
 * The shared board-masthead background photo. Renders ONE resolved image as
 * ATMOSPHERE behind a board masthead: a single low-opacity, desaturated
 * (duotone-leaning) photo that sits BEHIND the masthead's eyebrow / flag /
 * title and fades to the page's warm white, so the white system and the data
 * board below keep full legibility. The image is the deliberate exception to
 * pure-white; the body stays white.
 *
 * This is the place-agnostic treatment extracted from the country masthead so
 * every place-based page (country, city, cell) shares one warm, premium
 * editorial masthead. The caller resolves the right photo for its place
 * (country hero by ISO2, city hero by slug) and passes the URL in; this
 * component only owns the treatment and self-omits when no URL is given.
 *
 * Self-omits cleanly (returns null) when no `src` is supplied, so a place
 * without a resolvable image degrades to the quiet white masthead rather than
 * a broken or empty frame.
 *
 * No attribution, photographer, or source string is ever rendered (R-002, the
 * same policy CityHero / the country masthead follow): the photo is wallpaper,
 * not a credited figure. Decorative only, so it is aria-hidden and carries
 * empty alt.
 *
 * Server component. Tokens / Tailwind classes plus rgba() gradient layers
 * (rgba is not a raw hex literal, matching CityHero); mobile-first. The parent
 * supplies the relative + overflow-hidden + rounded frame; this fills it.
 */

export function MastheadImage({
  src,
  filter = true,
}: {
  /** The already-resolved photo URL for this place. Omit / null to self-omit. */
  src?: string | null;
  /** When false, render the photo in full colour (no grayscale/saturate filter).
   *  The city page passes false (founder 2026-06-08); the country page keeps true. */
  filter?: boolean;
}) {
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
        style={filter ? { filter: "grayscale(0.55) contrast(1.02) saturate(0.7)" } : undefined}
      />
      {/* Duotone wash: pulls the photo toward the site's own ground and
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
