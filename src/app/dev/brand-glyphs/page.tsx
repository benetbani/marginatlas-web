/**
 * /dev/brand-glyphs — ungated dev preview of the ma- glyph families
 * (Fable P1-05). The canonical catalog story lives on /_design (gated);
 * this page exists so the founder can eyeball all 104 glyphs on any
 * preview without the admin key. Not linked anywhere; noindex.
 */
import type { Metadata } from "next";
import { AtlasIcon, ATLAS_ICONS } from "@/components/brand/icons";
import {
  AtlasPictogram,
  ATLAS_PICTOGRAMS,
} from "@/components/brand/pictograms";

export const metadata: Metadata = {
  title: "Brand glyphs preview",
  robots: { index: false, follow: false },
};

export default function BrandGlyphsPreview() {
  const iconGroups = [...new Set(ATLAS_ICONS.map((d) => d.group))];
  const pictoGroups = [...new Set(ATLAS_PICTOGRAMS.map((d) => d.group))];
  return (
    <main className="min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-atlas-700">
          Fable P1-05 &middot; the ma- family
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium text-ink-900">
          One hand, 104 glyphs.
        </h1>
        <p className="mt-4 text-lg text-ink-700 leading-relaxed max-w-2xl">
          The 40 UI icons and 64 trade pictograms from the design export,
          ported as typed React primitives: 32-unit grid, 1.6 stroke,
          currentColor ink, at most one vermillion accent per glyph.
        </p>

        <section className="mt-10 rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6">
          <h2 className="font-display text-lg md:text-xl font-semibold tracking-tight text-ink-900">
            AtlasIcon (40)
          </h2>
          <div className="mt-4 space-y-6">
            {iconGroups.map((g) => (
              <div key={g}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                  {g.replace(/-/g, " ")}
                </div>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
                  {ATLAS_ICONS.filter((d) => d.group === g).map((d) => (
                    <div
                      key={d.id}
                      className="flex flex-col items-center gap-1.5 rounded-md border border-parchment bg-white px-2 py-3 text-center"
                    >
                      <AtlasIcon id={d.id} size={24} className="text-ink-700" />
                      <span className="text-[10px] leading-tight text-cocoa-700">
                        {d.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6">
          <h2 className="font-display text-lg md:text-xl font-semibold tracking-tight text-ink-900">
            AtlasPictogram (64)
          </h2>
          <div className="mt-4 space-y-6">
            {pictoGroups.map((g) => (
              <div key={g}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                  {g.replace(/-/g, " ")}
                </div>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
                  {ATLAS_PICTOGRAMS.filter((d) => d.group === g).map((d) => (
                    <div
                      key={d.id}
                      className="flex flex-col items-center gap-1.5 rounded-md border border-parchment bg-white px-2 py-3 text-center"
                    >
                      <AtlasPictogram
                        id={d.id}
                        size={32}
                        className="text-ink-700"
                      />
                      <span className="text-[10px] leading-tight text-cocoa-700">
                        {d.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
