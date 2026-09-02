/**
 * CountryFlag — flat SVG flag rendered via flagcdn.com.
 *
 * Replaces emoji-rendered flags whose system-emoji
 * shading looks 3D / glossy on most platforms. flagcdn ships flat
 * SVGs at a canonical 3:2 aspect.
 *
 * A FLAG IS A RECTANGLE, AND THE COMPONENT ENFORCES IT.
 * Founder, 2026-08-27, on the countries list: "just totally disgusting. A lot
 * of rounding that makes it ugly. The flags are rounded, which should not be
 * the case." A national flag is data, not a chip, and rounding its corners is
 * decoration applied to something the reader is meant to recognise. The rule
 * is gated by `scripts/verify_flag_marks.mjs`: radius 0, a hairline border,
 * and at least 14px of rendered height.
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
  /** Width in Tailwind units (e.g. "w-6", "w-8"). Defaults to "w-6". */
  className?: string;
  /** Optional accessible label override; otherwise derived from ISO-2. */
  label?: string;
};

/** Drop every radius utility a caller passes. See the note above. */
function withoutRadius(className: string): string {
  return className
    .split(/\s+/)
    .filter((c) => c.length > 0 && !c.startsWith("rounded"))
    .join(" ");
}

export function CountryFlag({ iso2, className = "w-6", label }: Props) {
  const code = (iso2 || "").toLowerCase();
  if (code.length !== 2) return null;
  const alt = `${label ?? iso2ToName(iso2.toUpperCase()) ?? iso2.toUpperCase()} flag`;
  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt={alt}
      className={`inline-block aspect-[3/2] object-cover rounded-none border border-paper-350/40 align-middle ${withoutRadius(className)}`}
      loading="lazy"
      width={24}
      height={16}
    />
  );
}
