# Mobile static audit (Plan v24 Block 9)

Generated 2026-05-22T03:35:40.839Z.

Scanned 146 TS/TSX source files.

## Findings

- **fixed-px-width**: 1
- **large-text-no-mobile**: 4
- **high-col-no-breakpoint**: 1
- **tiny-tap-target**: 0

## Severity legend

- **warn** — likely to break mobile layout. Fix before next mobile sweep.
- **info** — worth a manual check. May be fine in context.

## fixed-px-width (1)

- [warn] `./src/app/admin/review/page.tsx:467`  
  ```
  <td className="py-1.5 px-2 max-w-[420px] text-ink-700/85">{r.notes}</td>
  ```

## large-text-no-mobile (4)

- [warn] `./src/components/AtlasScore.tsx:63`  
  ```
  <div className="text-5xl font-semibold text-ink-900 tabular-nums">{score}</div>
  ```
- [warn] `./src/components/CalculatorForm.tsx:203`  
  ```
  <div className="text-5xl font-bold text-atlas-700 tabular-nums">
  ```
- [warn] `./src/components/NetProfitSummary.tsx:56`  
  ```
  <div className="font-display text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-atlas-700 leading-none">
  ```
- [warn] `./src/components/SmartImage.tsx:86`  
  ```
  <span className="text-5xl md:text-6xl drop-shadow-sm" aria-hidden>{glyph}</span>
  ```

## high-col-no-breakpoint (1)

- [info] `./src/components/CalculatorForm.tsx:212`  
  ```
  <div className="mt-4 grid grid-cols-5 gap-1 text-xs text-center">
  ```

## Next steps

This audit only catches static patterns. A full mobile sweep
needs a headless-browser probe at 320px / 375px / 414px
viewports to surface layout overflow and text reflow issues
the source scan misses.
