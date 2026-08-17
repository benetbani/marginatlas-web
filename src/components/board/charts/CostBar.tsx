/**
 * src/components/board/charts/CostBar.tsx
 *
 * A single stacked horizontal bar showing where revenue goes: each cost share
 * is a segment, sized by its percent. One compact bar, no legend (the parent
 * section's stat grid already names the shares), so it reads as a quick "this
 * much rent, this much labour, this much left" picture.
 *
 * Returns null when shares is null or empty. Segments with a non-positive or
 * non-finite percent are skipped. Tones cycle through a fixed warm ramp so the
 * order is stable and every color is a token (no raw hex).
 *
 * Server-renderable SVG (no client JS). Motion-reduce safe (static draw).
 */
import * as React from "react";

type Props = {
  shares: { label: string; pct: number }[] | null;
};

/**
 * Fixed segment ramp, warm palette, deepest first. Cycles if there are more
 * segments than tones. All are design-token classes, so the cost bar never
 * inlines color.
 */
/* amber-400 and moss-300 were two of the five until 2026-08-17; both hues are
   banned outright. These are COST SEGMENTS, a set of categories rather than a
   scale, so nothing here ranks and the replacements only need to separate: the
   accent leads, then the warm neutral ladder. Each segment carries its own
   direct label, so the fill is a second read.

   THE FIFTH WAS teal-500 FOR ONE COMMIT, and it should not have been. That fix
   read the palette gate's HUE bands, which permit 145 to 200 degrees, and
   missed that this project's own teal ramp measures 149 and 150. Teal sits
   near 180; 149 is green. The gate now says so in its own header and bans the
   name outright, which is the right reading of "no green, no exceptions": a
   banned hue under a permitted name is how the blog cover palette kept one for
   months. atlas-300 takes the slot, a light terracotta that separates cleanly
   from the deep atlas-500 four segments away. */
const SEGMENT_FILLS = [
  "fill-atlas-500",
  "fill-cocoa-500",
  "fill-cocoa-300",
  "fill-parchment",
  "fill-atlas-300",
];

export function CostBar({ shares }: Props) {
  if (!shares || shares.length === 0) return null;

  const clean = shares.filter(
    (s) => Number.isFinite(s.pct) && s.pct > 0,
  );
  if (clean.length === 0) return null;

  const W = 320;
  const H = 64;
  const barY = 24;
  const barH = 16;
  const total = clean.reduce((sum, s) => sum + s.pct, 0);

  // Lay segments end to end across the full width, scaled by share of total.
  let cursor = 0;
  const segments = clean.map((s, i) => {
    const w = (s.pct / total) * W;
    const seg = {
      x: cursor,
      w,
      label: s.label,
      pct: s.pct,
      fill: SEGMENT_FILLS[i % SEGMENT_FILLS.length],
    };
    cursor += w;
    return seg;
  });

  const summary = clean
    .map((s) => `${s.label} ${Math.round(s.pct)}%`)
    .join(", ");

  return (
    <figure className="w-full max-w-[400px]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Cost shares of revenue: ${summary}.`}
      >
        {segments.map((seg, i) => (
          <rect
            key={`${seg.label}-${i}`}
            x={seg.x}
            y={barY}
            width={Math.max(0, seg.w - 1)}
            height={barH}
            rx={2}
            className={seg.fill}
          />
        ))}
      </svg>
    </figure>
  );
}
