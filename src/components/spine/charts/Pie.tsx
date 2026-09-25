/**
 * Pie, ONE SHARE OF ONE WHOLE (2026-09-25; his word on the hero's hundred squares that night: "the 20% with cubic bars at the
 * hero is a catastrophe, no need for that, a pie chart would be enough"). The whole is a disc in the page's palest neutral, the
 * share a wedge in the accent from twelve o'clock, clockwise, a hairline of the card's white between them. No legend and no
 * label inside: the figure it stands beside is printed in the same accent, and that colour is the key. Drawn on the server as
 * one SVG path, so it is the same in the harness and on the page.
 *
 * `tone` (2026-09-25): "ink" draws the wedge in ink, for a second pie on a card whose accent already marks the answer
 * (ART-DIRECTION C2: at most two accent marks a card).
 */
import * as React from "react";

export function Pie({ share, aria, className = "h-24 w-24", tone = "terra" }: { share: number; aria: string; className?: string; tone?: "terra" | "ink" }) {
  if (!Number.isFinite(share) || share <= 0 || share >= 1) return null;
  const a = 2 * Math.PI * share;
  const x = 50 + 50 * Math.sin(a);
  const y = 50 - 50 * Math.cos(a);
  const large = share > 0.5 ? 1 : 0;
  return (
    <svg data-chart="pie" data-visual="1" data-share={String(Math.round(share * 100))} viewBox="0 0 100 100" role="img" aria-label={aria} className={`block shrink-0 ${className}`}>
      <circle cx="50" cy="50" r="50" fill="var(--c-soft2)" />
      <path d={`M50,50 L50,0 A50,50 0 ${large} 1 ${x.toFixed(3)},${y.toFixed(3)} Z`} fill={tone === "ink" ? "var(--c-ink2)" : "var(--terra)"} stroke="var(--c-card)" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
