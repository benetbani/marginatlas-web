/**
 * Plan v30 follow-up — homepage section that wraps WorldMapPicker.
 *
 * Server-rendered shell with a client child for the interactive map.
 * Selecting a country navigates to /[iso2]. Framing is "covers the
 * whole world" — never mention a country count (the founder explicitly
 * wants no number in the narrative).
 */
import { WorldMapClient } from "./WorldMapClient";

export function WorldMapSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
        Pick a country
      </div>
      <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-ink-900 mb-3 max-w-3xl">
        Anywhere on the map
      </h2>
      <p className="text-base md:text-lg text-cocoa-700/80 mb-8 max-w-2xl">
        Click your country to open its small-business landscape.
        Atlas covers the whole world.
      </p>
      <WorldMapClient />
    </section>
  );
}
