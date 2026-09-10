/**
 * SpineShell , the shared frame for every spine page type. Geist Sans is the
 * text face it anchors. The FIGURE face is no longer this file's business:
 * it is globals.css's `--font-num`, read by the one `.fig` rule that lives
 * there, so every renderer gets the same answer whether it mounts this shell
 * or not.
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
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-geist", display: "swap" });

export function SpineShell({ children }: { children: React.ReactNode; bg?: string; bgPosition?: string }) {
  return (
    <div className={`spine-scope ${geist.variable}`} style={{ fontFamily: "var(--font-geist), ui-sans-serif, system-ui, sans-serif", background: "var(--c-ground)" }}>
      {/* THIS SHELL NO LONGER CARRIES A STYLESHEET, and that is the point.
          The twelve colour tokens left in an earlier change for the same
          reason: declared from inside a component, they existed on a page that
          mounted this shell and nowhere else. `.fig`, `.focal` and the two
          hover rules have now followed them into globals.css (see "THE FIGURE,
          AND THE SPINE FRAME" there), because the same fault was costing more
          than tokens ever did:

          `.fig` read `var(--font-grotesk)`, a next/font slot THIS FILE
          defined. Every renderer that does not mount this shell , the
          archetype story sheet (scripts/harness/render_archetypes.tsx), the
          dev catalogue, any surface outside the spine tree that draws a `Fig`
          , had no such rule at all; and every renderer that mounts it without
          a real next/font transform got the slot as the EMPTY STRING, which
          makes `font-family: , ui-sans-serif, sans-serif` invalid and drops
          the declaration whole. Either way the figure inherited the body sans.
          Measured 2026-09-11: 86 elements carrying `.fig` across the rendered
          city and country pages, all of them Geist.

          The Space Grotesk next/font instance that used to sit beside `geist`
          above went with it. It was a SECOND load of a face the root layout
          already loads into `--font-serif`; nothing reads `--font-grotesk` in
          this tree any more, because every figure, in markup and in SVG, now
          reads the one token `--font-num`. */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
