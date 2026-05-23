/**
 * CategoryChip
 * ============
 *
 * Compact identifier chip that appears in the top-left of every cell page,
 * industry page, and sector page. Composes SectorIcon with the
 * sector_palette tint.
 *
 *   [icon] FOOD & DRINK · 🇪🇸 MADRID
 *
 * Geo and flag are optional. Pass `size` to scale icon + text together.
 */

import SectorIcon from "./SectorIcon";
import { tokensFor } from "@/lib/sector_palette";

export type CategoryChipSize = "sm" | "md" | "lg";

export type CategoryChipProps = {
  sectorId: string;
  geoName?: string;
  /** Two-letter ISO 3166-1 alpha-2; converted to flag emoji. */
  countryIso2?: string;
  size?: CategoryChipSize;
  className?: string;
};

function flag(iso2?: string): string {
  if (!iso2 || iso2.length !== 2) return "";
  const A = 0x1F1E6;
  const a = "A".charCodeAt(0);
  return String.fromCodePoint(
    A + iso2.toUpperCase().charCodeAt(0) - a,
    A + iso2.toUpperCase().charCodeAt(1) - a
  );
}

const SIZE: Record<CategoryChipSize, { icon: 12 | 14 | 16 | 20; text: string; pad: string; gap: string }> = {
  sm: { icon: 12, text: "text-[10px]", pad: "px-2 py-0.5",  gap: "gap-1"   },
  md: { icon: 14, text: "text-xs",     pad: "px-2.5 py-1",  gap: "gap-1.5" },
  lg: { icon: 16, text: "text-sm",     pad: "px-3 py-1.5",  gap: "gap-2"   },
};

export default function CategoryChip({
  sectorId,
  geoName,
  countryIso2,
  size = "md",
  className,
}: CategoryChipProps) {
  const t = tokensFor(sectorId);
  const s = SIZE[size];
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border font-semibold uppercase tracking-wide",
        t.tint, s.pad, s.gap, s.text, className ?? "",
      ].join(" ")}
    >
      <SectorIcon sectorId={sectorId} size={s.icon} decorative />
      <span>{t.label}</span>
      {(geoName || countryIso2) && (
        <span aria-hidden="true" className="opacity-50">·</span>
      )}
      {countryIso2 && <span aria-hidden="true">{flag(countryIso2)}</span>}
      {geoName && <span>{geoName.toUpperCase()}</span>}
    </span>
  );
}
