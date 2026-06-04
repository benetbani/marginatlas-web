/**
 * Homepage section that wraps WorldMapPicker.
 *
 * Server-rendered shell with a client child for the interactive map.
 * Selecting a country navigates to /[iso2]. Framing is "covers the
 * whole world" — never mention a country count (the founder explicitly
 * wants no number in the narrative).
 *
 * 2026-05-26 founder direction: this section sits on the ink-dark
 * atlas-paper-dark background (set in section-order.ts). The title is
 * white, centered, and gets extra top spacing to breathe vs the
 * navigator section above. The map itself stays on a white card so
 * the countries remain readable.
 */
import { WorldMapClient } from "./WorldMapClient";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export function WorldMapSection() {
  return (
    <section className="pt-12 pb-12 md:pt-20 md:pb-16">
      <div className="text-center max-w-3xl mx-auto mb-6 md:mb-10">
        <SectionEyebrow tone="inverse" size="md" className="mb-3">
          Start with a place
        </SectionEyebrow>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.08]">
          Pick a country
        </h2>
      </div>
      {/* White card keeps the map readable on the dark section. Constrained
          to the map width and overflow-hidden with no padding, so the map
          fills the rounded card edge to edge: the old full-width card plus
          p-2/p-4 padding left a stray white margin all around the map. */}
      <div className="rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.25)] overflow-hidden max-w-5xl mx-auto">
        <WorldMapClient />
      </div>
    </section>
  );
}
