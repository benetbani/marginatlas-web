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
    <section className="pt-2 pb-8 md:pt-2 md:pb-10">
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-4 max-w-3xl">
        Pick a country
      </h2>
      <WorldMapClient />
    </section>
  );
}
