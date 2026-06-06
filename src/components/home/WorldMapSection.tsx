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
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { elevation } from "@/lib/design-tokens";

export function WorldMapSection() {
  return (
    <section className="pt-12 pb-12 md:pt-20 md:pb-16">
      <div className="text-center max-w-3xl mx-auto mb-6 md:mb-10">
        <SectionEyebrow size="md" className="mb-3">
          Start with a place
        </SectionEyebrow>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-ink-900 leading-[1.08]">
          Pick a country
        </h2>
      </div>
      {/* Map sits on a white card with a soft elevation shadow so the
          countries stay readable and the card lifts a touch off the white
          page. Constrained to the map width and overflow-hidden with no
          padding so the map fills the rounded card edge to edge. */}
      <div
        className="rounded-2xl bg-white border border-parchment overflow-hidden max-w-5xl mx-auto"
        style={{ boxShadow: elevation.card }}
      >
        <WorldMapClient />
      </div>
    </section>
  );
}
