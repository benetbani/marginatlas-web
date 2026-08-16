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
import { elevation } from "@/lib/design-tokens";

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
    <section className="py-10 md:py-14">
      <div className="mb-5 md:mb-7 flex items-baseline justify-between gap-4 flex-wrap">
        <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 leading-tight">
          Pick a country
        </h2>
        <a
          href="/countries"
          className="text-sm text-atlas-700 hover:text-atlas-900 font-medium"
        >
          All countries &rarr;
        </a>
      </div>
      {/* Map sits on a white card with a soft elevation shadow so the
          countries stay readable and the card lifts a touch off the white
          page. Constrained to the map width and overflow-hidden with no
          padding so the map fills the rounded card edge to edge. */}
      <div
        className="rounded-2xl bg-white border border-parchment overflow-hidden max-w-4xl mx-auto"
        style={{ boxShadow: elevation.card }}
      >
        <WorldMapClient />
      </div>
    </section>
  );
}
