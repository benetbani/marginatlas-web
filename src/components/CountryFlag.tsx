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
 */
import { iso2ToName } from "@/lib/countries";

type Props = {
  iso2: string;
  /** Legacy width/margin utilities from a caller. A `rounded*` utility is
   *  stripped (see withoutRadius); a width utility is accepted but has no
   *  effect, overridden by the token-driven height/width below. */
  className?: string;
  /** Optional accessible label override; otherwise derived from ISO-2. */
  label?: string;
  /** The flag's height rung: `--flag-hero` (40px, a country or city masthead)
   *  or `--flag-row` (20px, a table row or a city card). Two tokens, no
   *  third. Defaults to "row", the shape of nearly every call site today. */
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
  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt={alt}
      className={`inline-block object-contain rounded-none border border-[var(--c-border)] align-middle ${withoutRadius(className)}`}
      style={{ height, width: "auto" }}
      loading="lazy"
    />
  );
}
