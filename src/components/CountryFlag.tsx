/**
 * CountryFlag — flat SVG flag rendered via flagcdn.com.
 *
 * Replaces emoji-rendered flags whose system-emoji
 * shading looks 3D / glossy on most platforms. flagcdn ships flat SVGs at
 * each country's own true aspect ratio, which is NOT always 3:2.
 *
 * A FLAG IS A RECTANGLE, AND THE COMPONENT ENFORCES IT.
 * Founder, 2026-08-27, on the countries list: "just totally disgusting. A lot
 * of rounding that makes it ugly. The flags are rounded, which should not be
 * the case." A national flag is data, not a chip, and rounding its corners is
 * decoration applied to something the reader is meant to recognise. The rule
 * is gated by `scripts/verify_flag_marks.mjs`: radius 0, a hairline border,
 * and a rendered height matching one of the two size tokens below.
 *
 * SIZED BY HEIGHT, NOT BY WIDTH (founder, 2026-09-07, on a distorted flag in
 * the wild: "the flag which is distorted"; MODEL.md PART 3). The old
 * `aspect-[3/2] object-cover` forced every flag into a fixed 3:2 box
 * regardless of its real shape, cropping a square flag and stretching a
 * narrow one, on all 208 measured flag sites at once, because the fix lived
 * in a caller's width class instead of in the component. Height now comes
 * from one of two tokens, `--flag-hero` (40px) or `--flag-row` (20px), width
 * is `auto`, and `object-contain` never crops. Two rungs, no third, so a flag
 * obeys one law everywhere. A caller's leftover width utility, still accepted
 * through `className` so the 208 call sites need not be revisited in this
 * change, is silently overridden by the inline height/width rather than
 * merged: the two never agreed, and only one may decide the box.
 *
 * `size` DEFAULTS TO "row", NOT "hero". Every one of today's 208 call sites is
 * an inline mark beside a list row, a table cell, a breadcrumb or a search
 * result, none of them the one true page masthead PART 3 describes; sizing
 * them all at 40px by default would be the distortion bug's inverse, a flag
 * suddenly too large everywhere it appears today. The masthead a page builds
 * under PART 3 passes `size="hero"` explicitly.
 *
 * The radius half of that rule lived in three callers instead of here, and so
 * it was broken in all three: `rounded-sm` (8px) on 194 tiles of the countries
 * list plus the city and neighbourhood mastheads, 196 of the site's 208
 * measured flag violations from one class name. A rule a caller can pass a
 * class to break is not a rule, so any `rounded*` utility handed in through
 * `className` is stripped here rather than merged. Order in the class
 * attribute would not have decided it anyway: two radius utilities at equal
 * specificity are settled by their order in the stylesheet, not the markup.
 *
 * THE HAIRLINE MOVED FROM `border` TO `outline`, 2026-09-08 (flag-marks'
 * width-ratio check, found once its own floor was raised from 14px to the two
 * tokens exactly). `border` is part of the box a browser sizes `width:auto`
 * against, and every element on this site is `box-sizing:border-box`
 * (Tailwind's preflight), so the border was being carved OUT of the specified
 * height before the intrinsic ratio ran: at `--flag-row` (20px) a 1px+1px
 * border left an 18px content box, `auto` computed a width for THAT box, and
 * the border added back on afterward, landing the rendered box a full 5% off
 * the flag's true ratio at every site on the property, all from one shared
 * component. `outline` paints the identical hairline (same colour, same 1px,
 * flush against the edge at the default zero offset) without ever entering
 * the box a replaced element sizes itself against, so `width:auto` now runs
 * on the full, unaltered height and the rendered box matches the SVG's own
 * ratio exactly.
 *
 * EVERY FLAG IS THE SAME WIDTH, 2026-09-11. Founder, verbatim and in full:
 * "all-flags-same-width-please-madatory-always". `width:auto` gave each flag
 * its own true width, which is right about the flag and wrong about the column:
 * Switzerland is square, the United States is wide, Qatar is a ribbon, so a
 * list of them has a ragged edge and no two of them occupy the same slot. Width
 * is a token now too, `--flag-row-w` / `--flag-hero-w`, each 1.5x its own rung,
 * because 3:2 is the commonest shape in the set and therefore the one that
 * should fill its box exactly.
 *
 * AIR, NOT A CROP, AND THAT IS THE WHOLE DECISION. There are two ways to put a
 * square flag in a 3:2 box: fill it, or fit inside it and leave the leftover
 * space empty. `object-fit: cover` would fill it perfectly and amputate a third
 * of the Swiss cross, clip the United States' canton, and make nonsense of
 * Nepal, which is not even a rectangle. A flag is data, which is the same
 * reason its corners are not rounded; cropping it edits the data to tidy the
 * layout. `object-fit: contain` keeps every flag's true proportions, scales it
 * to the one box and leaves air: about 5px either side of a square flag at the
 * row rung, about 4px above and below the widest ribbon in common use. The
 * hairline frames the BOX rather than the flag, which is what makes one width
 * visible rather than merely true, so a letterboxed flag reads as deliberately
 * mounted rather than accidentally narrow.
 *
 * NOTHING HERE STRETCHES A FLAG, so the distortion fix of 2026-09-07 is intact:
 * height still comes from its own token, `contain` still never crops, and all
 * that changed is that the box around the flag stopped varying. The gate moved
 * with the law rather than being deleted by it: `verify_flag_marks.mjs` used to
 * fail a flag whose rendered box did not match its own natural ratio, which is
 * now the normal case for every flag that is not 3:2. It fails one whose
 * rendered WIDTH is not a token, and reads `object-fit` to prove that the
 * fitting is air rather than a stretch.
 *
 * THE WIDTH TOKENS CARRY A LITERAL FALLBACK, `var(--flag-row-w, 30px)`, and the
 * height tokens deliberately do not. An undefined height token yields an
 * invalid declaration and the flag renders at its intrinsic size, which is
 * enormous and unmissable. An undefined WIDTH token would fall back to the
 * initial value, `auto`, which is precisely the old ragged behaviour this
 * change removes and would look entirely normal while doing it. A law whose
 * failure mode is invisible is not enforceable, so the one that fails quietly
 * gets the fallback. */
import { iso2ToName } from "@/lib/countries";

type Props = {
  iso2: string;
  /** Legacy width/margin utilities from a caller. A `rounded*` utility is
   *  stripped (see withoutRadius); a width utility is accepted but has no
   *  effect, overridden by the token-driven height/width below. */
  className?: string;
  /** Optional accessible label override; otherwise derived from ISO-2. */
  label?: string;
  /** The flag's rung: `--flag-hero` (40 by 60, a country or city masthead) or
   *  `--flag-row` (20 by 30, a table row or a city card). Height AND width come
   *  from the rung, two of each, no third. Defaults to "row", the shape of
   *  nearly every call site today. */
  size?: "hero" | "row";
};

/** Drop every radius utility a caller passes. See the note above. */
function withoutRadius(className: string): string {
  return className
    .split(/\s+/)
    .filter((c) => c.length > 0 && !c.startsWith("rounded"))
    .join(" ");
}

export function CountryFlag({ iso2, className = "", label, size = "row" }: Props) {
  const code = (iso2 || "").toLowerCase();
  if (code.length !== 2) return null;
  const alt = `${label ?? iso2ToName(iso2.toUpperCase()) ?? iso2.toUpperCase()} flag`;
  const height = size === "row" ? "var(--flag-row)" : "var(--flag-hero)";
  const width = size === "row" ? "var(--flag-row-w, 30px)" : "var(--flag-hero-w, 60px)";
  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt={alt}
      className={`inline-block object-contain rounded-none outline outline-1 outline-[var(--c-border)] align-middle ${withoutRadius(className)}`}
      style={{ height, width }}
      loading="lazy"
    />
  );
}
