/**
 * CityParts, THE CITY CARDS' SHARED PARTS: the photograph's recipe (DuotonePhoto) and the money grammar of a set of cities (moneyFor).
 * Moved out of CityCards.tsx (plan docs/superpowers/plans/2026-10-10-home-reform, Task 6; the ship audit's 3.5) into a file with no
 * client directive, so the home's server rows (CityRows.tsx) and the pager's client cards (CityCards.tsx) draw one recipe, and the
 * home ships no client code for a list that never pages. CityCards re-exports DuotonePhoto for the callers that import it from there.
 *
 * Since that plan the picture also takes the small copy's own size (`width`, `height`, so the browser keeps its box before it
 * decodes), a crop that keeps its landmark in a short frame (`position`, the CSS object-position), a veil of the caller's own
 * (`veil`, the home's grey rows at 0.6: the spec's decision 2), and decodes off the main thread (`decoding="async"`, the critique's
 * P1.11), on every card.
 */
import * as React from "react";

/* THE PHOTOGRAPH STACK: a DUOTONE, three layers, each with exactly one job.

   1. THE PICTURE, `object-cover`, full-bleed, and DESATURATED. That last word
      is the design decision and it was made from a photograph, not from an
      argument. Built first in full colour, the terracotta wash over a blue sky
      and green cliffs produced a pink-mauve cast that reads as a filter someone
      forgot to turn off , which is the exact quality the founder named when he
      killed the hero photograph on 2026-09-07 ("it gives a feeling of being
      cheap"). Desaturated first, the same wash reads as one deliberate
      terracotta monotone: the picture survives as texture, the row belongs to
      the palette, and green (banned outright) cannot appear. Both were
      photographed side by side before this was chosen.
      IT IS ALSO THE HONEST FORM FOR A STAND-IN. This is a coastline in Italy
      standing behind Birmingham and Manchester. Nobody mistakes a terracotta
      duotone for a document of a place; a full-colour photograph invites
      exactly that mistake, and would be a fabricated place detail the day a
      reader looked closely.
   2. THE VEIL, white, whose only job is to lift the photograph's darkest
      regions so near-black ink clears the contrast floor everywhere on the
      card and not just over the sky. A scrim behind the name alone was the
      alternative and was rejected: it reads as a label stuck on a picture, and
      the name is meant to be the card, not a caption.
   3. THE WASH, `--terra` at ONE fixed opacity. Fixed, not per-card: it is no
      longer a figure (see the header note).

   THE TWO NUMBERS ARE SET BY A MEASUREMENT, NOT BY EYE. Composited over the
   photograph's darkest pixel, which is rgb(0,0,0) (measured 2026-09-11 by
   decoding the file and walking all 1,116,717 pixels), this stack lands a
   backdrop of rgb(190,137,124), and `--c-ink` on it reads 5.78 to 1 , over the
   4.5 WCAG AA floor this repo holds, and 11.6 to 1 over the picture's brightest
   region. Lowering the veil to 0.42 to let more of the picture through was
   computed and rejected at 4.57 to 1: clearing the floor by seven hundredths is
   not a margin, it is a coincidence waiting for a different photograph. The
   harness re-measures this from the rendered layers at every run
   (check_archetypes.mjs, the city-cards CONTRAST rule), so changing either
   number here fails the build rather than the reader. */
const PHOTO_VEIL = 0.55;
const PHOTO_WASH = 0.45;
/* The grey form's veil (`DuotonePhoto`'s `tint={false}`): no name is printed over
   that picture, so it answers to no contrast floor, only to keeping the grey soft
   beside the cards' ink. A caller that prints a name over the grey picture sets
   its own (`veil`; the home's rows, 0.6). */
const PHOTO_VEIL_GREY = 0.3;

/* ONE GRAMMAR FOR THE WHOLE COLUMN, decided by the set and not by each figure
   (PART 5: every figure in a column shares one font, one size, one weight and
   one decimal count). The site's `usd()` switches to thousands at 10,000, which
   inside one set of cities would print "$8,400" beside "$12K": the same column
   in two notations. The set decides once, and it rounds to thousands only when
   its own SMALLEST figure can carry the rounding. */
export const moneyFor = (pays: number[]) => {
  const k = pays.length > 0 && Math.min(...pays) >= 1e4;
  return (v: number) => (k ? "$" + Math.round(v / 1000) + "K" : "$" + Math.round(v).toLocaleString("en-US"));
};

/** THE PICTURE AND THE TWO LAYERS OVER IT, drawn once and used by every form so
 *  a tall card and a wide row can never drift into two different recipes.
 *
 *  EXPORTED 2026-09-25 so the home page's post cards draw this recipe and not a
 *  copy of it (the founder: the blog blocks need a placeholder image). `crop`
 *  zooms into one region of the picture, so cards that share the single
 *  placeholder show different parts of it rather than one image six times. The
 *  parent must be `relative` and `overflow-hidden`.
 *
 *  `tint={false}` drops the terracotta wash and keeps a lighter veil: the
 *  picture in grey. For a grid of several photographs with no name printed over
 *  them (the post cards), where six washed pictures made a wall of the accent
 *  (the founder's reference of 2026-09-20: one warm card per grid). */
export function DuotonePhoto({
  src,
  placeholder,
  crop,
  tint = true,
  veil,
  position,
  width,
  height,
}: {
  src: string;
  placeholder: boolean;
  crop?: { x: number; y: number; zoom: number };
  tint?: boolean;
  /** The white veil's opacity, where the caller sets its own (the home's grey rows: 0.6, ink on the darkest pixel 6.05 to 1). */
  veil?: number;
  /** The CSS object-position that keeps the picture's landmark in a short frame ("50% 44%"). */
  position?: string | null;
  /** The file's own size (the small copies, 480 by 360), so the browser keeps the picture's box before it decodes. */
  width?: number;
  height?: number;
}) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        aria-hidden
        {...(width && height ? { width, height } : {})}
        data-photo={placeholder ? "placeholder" : "own"}
        className="absolute inset-0 h-full w-full object-cover"
        /* DESATURATED, so the wash above it reads as a duotone rather than as a
           filter left on by accident. See the stack note. */
        style={{
          filter: "grayscale(1)",
          ...(position ? { objectPosition: position } : {}),
          ...(crop ? { transform: `scale(${crop.zoom})`, transformOrigin: `${crop.x}% ${crop.y}%` } : {}),
        }}
      />
      <span aria-hidden data-veil className="absolute inset-0 bg-white" style={{ opacity: veil ?? (tint ? PHOTO_VEIL : PHOTO_VEIL_GREY) }} />
      {tint ? <span aria-hidden data-tint className="absolute inset-0" style={{ background: "var(--terra)", opacity: PHOTO_WASH }} /> : null}
    </>
  );
}
