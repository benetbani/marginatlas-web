/**
 * Homepage section that wraps WorldMapPicker.
 *
 * Server-rendered shell with a client child for the interactive map.
 * Selecting a country navigates to /[iso2]. Framing is "covers the
 * whole world" — never mention a country count (the founder explicitly
 * wants no number in the narrative).
 *
 * White-reset 2026-06-06: this section now sits on a pure white band (the
 * home-city-picker tone was flipped from ink-dark to white). The eyebrow and
 * title are therefore dark-on-white for legibility, and the map card carries
 * a soft elevation-token shadow rather than the old heavy dark-band shadow.
 */
import { WorldMapClient } from "./WorldMapClient";

export function WorldMapSection() {
  return (
    /* SMALLER, and subordinate, on the founder's note that "the map should be
       smaller". It was pt-20/pb-16 around a heading running to text-5xl, which
       is the h1's own size: a browse affordance competing with the instrument
       it is meant to sit beneath. None of the references gives a map this
       weight; a map is where you go when you do not know what to type.

       The eyebrow is gone as well. It read "Start with a place" over a heading
       reading "Pick a country", which is the exact shape the rulebook banned:
       a vaguer restatement of the heading, a second label carrying no
       information.

       Header now matches the blog rail twenty lines down the same page,
       heading left and an escape hatch right, so a reader who wants the list
       rather than the map has one move instead of a scroll. */
    <section>
      <div className="mb-5 md:mb-7 flex items-baseline justify-between gap-4 flex-wrap">
        {/* "Pick a country" stood here, and the hero form's own heading four
            bands above reads "Pick a country, a city, and a business." Two
            sections telling a reader to do the same thing, one of them a
            shorter version of the other, which is the restatement the rulebook
            bans one level up: the eyebrow above this heading was deleted for
            being a vaguer copy of the heading, and the heading turned out to be
            a vaguer copy of the form.

            They are not the same offer. The form is for a reader who knows what
            they want and wants to arrive; the map is for one who wants to look
            around first. So the heading names the artifact rather than
            repeating the instruction, which is the split every reference makes
            between a search box and an explore surface.

            No count, per this file's standing rule that the framing is "covers
            the whole world" and no number goes in the narrative. "Every
            country" carries the reach without spending a figure. */}
        <h2 className="font-display text-lg md:text-xl font-medium tracking-tight text-ink-900 leading-tight">
          Every country, on one map
        </h2>
        <a
          href="/countries"
          /* atlas-800: this link sits on the photograph, not on a card.
             The backdrop's darkest point is luminance 0.4179, where
             atlas-700 reads 3.79:1 against the 4.5 AA needs at 14px.
             atlas-800 reads 5.29:1. See the note on the sibling link in
             src/app/page.tsx. */
          className="text-sm text-atlas-800 hover:text-atlas-900 font-medium"
        >
          All countries &rarr;
        </a>
      </div>
      {/* Map sits on a card so the countries stay readable, constrained to the
          map width and overflow-hidden with no padding so the map fills the
          rounded edge to edge.

          It is now .atlas-card rather than `rounded-2xl bg-white border
          border-parchment` plus an inline elevation.card shadow, which was the
          class assembled by hand out of three tokens and one style attribute.
          Same radius and the same shadow, since --atlas-elev-1 mirrors
          elevation.card, but the surface goes from opaque white to the card
          token's rgba(255,255,255,.955): with no centre plate in the frame, an
          opaque white is a hole in the photograph rather than a sheet on it.
          .atlas-card also brings position: relative, which is what keeps a card
          above the frame's fixed layers. */}
      <div className="atlas-card overflow-hidden max-w-4xl mx-auto">
        <WorldMapClient />
      </div>
    </section>
  );
}
