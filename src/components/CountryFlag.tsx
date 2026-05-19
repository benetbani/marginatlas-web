/**
 * CountryFlag — flat SVG flag rendered via flagcdn.com.
 *
 * Plan v13 Wave 1: replaces emoji-rendered flags whose system-emoji
 * shading looks 3D / glossy on most platforms. flagcdn ships flat
 * SVGs at a canonical 3:2 aspect.
 */
import { iso2ToName } from "@/lib/countries";

type Props = {
  iso2: string;
  /** Width in Tailwind units (e.g. "w-6", "w-8"). Defaults to "w-6". */
  className?: string;
  /** Optional accessible label override; otherwise derived from ISO-2. */
  label?: string;
};

export function CountryFlag({ iso2, className = "w-6", label }: Props) {
  const code = (iso2 || "").toLowerCase();
  if (code.length !== 2) return null;
  const alt = `${label ?? iso2ToName(iso2.toUpperCase()) ?? iso2.toUpperCase()} flag`;
  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt={alt}
      className={`inline-block aspect-[3/2] object-cover rounded-sm border border-ink-200/40 align-middle ${className}`}
      loading="lazy"
      width={24}
      height={16}
    />
  );
}
