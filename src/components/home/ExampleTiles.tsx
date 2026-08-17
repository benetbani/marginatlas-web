/**
 * ExampleTiles -- the homepage's lead data hook. Six curated business-in-city
 * tiles, each with a real headline number, that open the cell directly. Doubles
 * as the "I do not know what to search" helper under the search box. Self-omits
 * below three resolved tiles so the homepage always renders. Server component,
 * tokens only.
 */
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import type { ExampleTile } from "@/lib/home/example_tiles";

export function ExampleTiles({ tiles }: { tiles: ExampleTile[] }) {
  if (tiles.length < 3) return null;

  /* Countries represented, counted rather than typed. The first segment of each
     href IS the country, so this cannot drift from the curated list the way a
     written number would. */
  const countries = new Set(
    tiles.map((t) => t.href.split("/").filter(Boolean)[0]).filter(Boolean),
  ).size;

  return (
    <section className="py-8 md:py-10">
      {/* THE HEADING MOVED OFF THE SPECIMEN'S GROUND.
          This read "Or open a real one" over "See what a business actually
          keeps", which was right when the band sat directly under the search
          form. The specimen now sits between them and does exactly that: it
          shows what one business keeps, in figures. Leaving this would have
          promised a reader something they had just been given, and "or open a
          real one" reads strangely when the thing above it IS a real one.

          So the band says its own job instead. The specimen is one answer in
          depth; these are the same question asked somewhere else, which is the
          only thing a second band of examples can add. */}
      <SectionEyebrow tone="backdrop" size="md" className="mb-2">Six more</SectionEyebrow>
      <h2 className="font-display text-lg md:text-xl font-medium tracking-tight text-ink-900 mb-5">
        The same question, asked in {countries} countries
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tiles.map((t) => (
          <a key={t.href} href={t.href} className="group atlas-card block px-5 py-4">
            <div className="text-sm font-semibold text-ink-900 group-hover:text-atlas-700 transition-colors">
              {t.business} in {t.city}
            </div>
            <div className="mt-1.5 text-sm text-cocoa-700">{t.headline}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
