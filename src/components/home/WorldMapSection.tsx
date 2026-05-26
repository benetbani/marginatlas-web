/**
 * Plan v30 follow-up — homepage section that wraps WorldMapPicker.
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

export function WorldMapSection() {
  return (
    <section className="pt-12 pb-12 md:pt-20 md:pb-16">
      <div className="text-center max-w-3xl mx-auto mb-6 md:mb-10">
        <div className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-atlas-300 mb-3">
          Start with a place
        </div>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.08]">
          Pick a country
        </h2>
      </div>
      {/* White card keeps the map background clean — only the
          surrounding section is dark. */}
      <div className="rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.25)] p-2 md:p-4">
        <WorldMapClient />
      </div>
    </section>
  );
}
