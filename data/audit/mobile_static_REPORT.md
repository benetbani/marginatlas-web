# Mobile static audit (Plan v24 Block 9)

Generated 2026-05-26T12:05:14.312Z.

Scanned 285 TS/TSX source files.

## Findings

- **fixed-px-width**: 0
- **large-text-no-mobile**: 4
- **high-col-no-breakpoint**: 12
- **tiny-tap-target**: 0
- **nowrap-on-content**: 14

## Severity legend

- **warn** — likely to break mobile layout. Fix before next mobile sweep.
- **info** — worth a manual check. May be fine in context.

## large-text-no-mobile (4)

- [warn] `./src/app/blog/page.tsx:28`  
  ```
  <span className="font-display text-5xl md:text-6xl font-semibold text-white/85">
  ```
- [warn] `./src/app/blog/[slug]/page.tsx:50`  
  ```
  <span className="font-display text-6xl md:text-7xl font-semibold text-white/85">
  ```
- [warn] `./src/app/not-found.tsx:29`  
  ```
  <p aria-hidden="true" className="font-display text-6xl sm:text-7xl font-semibold text-atlas-700 leading-none">
  ```
- [warn] `./src/components/SmartImage.tsx:86`  
  ```
  <span className="text-5xl md:text-6xl drop-shadow-sm" aria-hidden>{glyph}</span>
  ```

## high-col-no-breakpoint (12)

- [info] `./src/app/download/2026-benchmarks/page.tsx:199`  
  ```
  <li key={l.label} className="grid grid-cols-12 items-center gap-2 text-[11px]">
  ```
- [info] `./src/components/CalculatorForm.tsx:268`  
  ```
  <div className="mt-4 grid grid-cols-5 gap-1 text-xs text-center">
  ```
- [info] `./src/components/comparison/CityComparisonPageV2.tsx:144`  
  ```
  <div className="mt-2 grid grid-cols-12 items-center gap-2">
  ```
- [info] `./src/components/comparison/MultiCellComparisonTable.tsx:200`  
  ```
  <div className="mt-3 grid grid-cols-4 gap-2 text-center">
  ```
- [info] `./src/components/comparison/_primitives.tsx:237`  
  ```
  className={`grid grid-cols-12 items-center py-3 sm:py-4 ${divider ? "border-b border-parchment" : ""}`}
  ```
- [info] `./src/components/comparison/_primitives.tsx:321`  
  ```
  <div className="mt-8 grid grid-cols-12 items-center pb-2 border-b border-parchment">
  ```
- [info] `./src/components/comparison/_primitives.tsx:341`  
  ```
  className={`grid grid-cols-12 items-center py-2.5 ${
  ```
- [info] `./src/components/LoadingSkeleton.tsx:82`  
  ```
  <div className="mt-10 grid grid-cols-12 gap-8 items-end">
  ```
- [info] `./src/components/LoadingSkeleton.tsx:138`  
  ```
  className="grid grid-cols-12 gap-4 items-center py-3 border-b border-parchment last:border-b-0"
  ```
- [info] `./src/components/mobile/MobileExpandableSection.tsx:161`  
  ```
  className="w-full grid grid-cols-12 items-center gap-2 py-1.5 text-left"
  ```
- [info] `./src/components/mobile/MobileShareSheet.tsx:153`  
  ```
  <div className="grid grid-cols-4 gap-2">
  ```
- [info] `./src/components/monetization/QuartileMarkers.tsx:90`  
  ```
  <div className="grid grid-cols-5 gap-2">
  ```

## nowrap-on-content (14)

- [info] `./src/app/account/page.tsx:108`  
  ```
  className={`inline-flex items-center gap-1.5 px-3 h-9 rounded-md text-sm font-semibold whitespace-nowrap ${
  ```
- [info] `./src/app/cities/[slug]/page.tsx:317`  
  ```
  className="px-4 py-2.5 rounded-full bg-atlas-700 hover:bg-atlas-800 text-cream-50 text-sm font-semibold shadow-sm transition text-center whitespace-nowrap"
  ```
- [info] `./src/app/cities/[slug]/page.tsx:323`  
  ```
  className="px-4 py-2.5 rounded-full bg-white hover:bg-cream-100 border border-ink-200 hover:border-atlas-700 text-ink-900 text-sm font-semibold transition text-
  ```
- [info] `./src/app/cities/[slug]/page.tsx:329`  
  ```
  className="px-4 py-2.5 rounded-full bg-white hover:bg-cream-100 border border-ink-200 hover:border-atlas-700 text-ink-900 text-sm font-semibold transition text-
  ```
- [info] `./src/components/comparison/MultiCellComparisonTable.tsx:156`  
  ```
  <td className="px-3 py-2.5 whitespace-nowrap">
  ```
- [info] `./src/components/CountryAtAGlance.tsx:118`  
  ```
  className="text-atlas-700 hover:text-atlas-900 font-medium whitespace-nowrap"
  ```
- [info] `./src/components/DecideActivitySelector.tsx:33`  
  ```
  <span className="text-cocoa-700/80 font-medium whitespace-nowrap">
  ```
- [info] `./src/components/DenseCellHero.tsx:199`  
  ```
  <span className="font-display italic font-normal leading-none text-sm sm:text-lg text-cocoa-700 ml-1 sm:ml-2 whitespace-nowrap">
  ```
- [info] `./src/components/DistributionVisual.tsx:233`  
  ```
  <div className="text-[10px] uppercase tracking-wider text-cocoa-700/60 font-semibold whitespace-nowrap">
  ```
- [info] `./src/components/DistributionVisual.tsx:250`  
  ```
  <div className="text-[10px] uppercase tracking-wider text-atlas-700 font-bold text-center whitespace-nowrap">
  ```
- [info] `./src/components/DistributionVisual.tsx:263`  
  ```
  <div className="text-[10px] uppercase tracking-wider text-cocoa-700/60 font-semibold whitespace-nowrap">
  ```
- [info] `./src/components/monetization/TruncatedTease.tsx:60`  
  ```
  <span className="text-atlas-700 font-semibold whitespace-nowrap">
  ```
- [info] `./src/components/SectionDivider.tsx:46`  
  ```
  <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-cocoa-700/70 whitespace-nowrap">
  ```
- [info] `./src/components/sections/FailureModes.tsx:66`  
  ```
  <div className="text-[11px] uppercase tracking-wide text-ink-500 font-medium whitespace-nowrap">
  ```

## Next steps

This audit only catches static patterns. A full mobile sweep
needs a headless-browser probe at 320px / 375px / 414px
viewports to surface layout overflow and text reflow issues
the source scan misses.
