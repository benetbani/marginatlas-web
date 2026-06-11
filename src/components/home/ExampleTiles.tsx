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
  return (
    <section className="py-8 md:py-10">
      <SectionEyebrow size="md" className="mb-2">Or open a real one</SectionEyebrow>
      <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight text-ink-900 mb-5">
        See what a business actually keeps
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
