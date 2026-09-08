/**
 * SpineShell , the shared frame for every spine page type. Geist Sans (text) +
 * Space Grotesk (.fig figures).
 *
 * THE GROUND IS GREY, THE CARDS ARE WHITE (MODEL.md PART 2; founder ruling
 * 2026-09-07, on the skyline photograph that used to sit behind every page:
 * "this image standing on the background makes the whole thing less
 * readable... it gives a feeling of being cheap"). No photograph, no motif,
 * no per-page-type picture, on any page, of any kind. This shell paints
 * `--c-ground` on its own root, edge to edge, behind the gutters as well; the
 * main column keeps its existing width and padding. White cards (kit.tsx
 * `CARD_SURFACE`) are what float on it, and the card's own border, one step
 * stronger than any hairline inside it, is what now carries the edge a
 * photograph used to.
 *
 * `bg` and `bgPosition` stay in the prop type, unread, so the dev routes that
 * still hand this shell a motif URL keep compiling without touching every one
 * of them in this change: the same tolerated-no-op pattern `Box`'s
 * `elevation` prop already uses below.
 */
import * as React from "react";
import { Geist, Space_Grotesk } from "next/font/google";

const geist = Geist({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-geist", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-grotesk", display: "swap" });

export function SpineShell({ children }: { children: React.ReactNode; bg?: string; bgPosition?: string }) {
  return (
    <div className={`spine-scope ${geist.variable} ${grotesk.variable}`} style={{ fontFamily: "var(--font-geist), ui-sans-serif, system-ui, sans-serif", background: "var(--c-ground)" }}>
      {/* THE TWELVE COLOUR TOKENS THAT USED TO OPEN THIS BLOCK NOW LIVE IN
          globals.css, and the reason is that they were never scoped to anything.
          They were declared at `:root` from inside a component, so they existed
          on a page that mounted this shell and nowhere else, while four surfaces
          outside the spine tree already read them. Moved, not copied: globals.css
          is imported by the root layout, so every route inherits them and this
          page computes what it always computed. The rules below stay, because
          each depends on something this shell owns: `.fig` on --font-grotesk,
          which only the spine loads, and the hover rules on the frame. */}
      <style>{`.fig{font-family:var(--font-grotesk),ui-sans-serif,sans-serif;font-variant-numeric:tabular-nums lining-nums;letter-spacing:0;font-weight:600}
.focal{background:linear-gradient(180deg,#ffffff 0%,#fffaf8 100%);border-radius:10px}
.hov{transition:background-color .15s ease-out,transform .15s ease-out,border-color .15s ease-out}
.hov:hover{background:var(--c-soft)}
.cityhov{transition:transform .15s ease-out,border-color .15s ease-out}
.cityhov:hover{transform:translateY(-2px);border-color:var(--terra-border)}
/* AtlasIcon accent rides terracotta via .spine-scope .ma-glyph in globals.css; ink rides currentColor from the Ico tile. */
@media (prefers-reduced-motion: reduce){.hov,.cityhov,details summary span{transition:none !important}.cityhov:hover{transform:none}}`}</style>
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
