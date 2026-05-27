/**
 * SectorIcon
 * ==========
 *
 * Maps an Atlas sector_id to a Phosphor icon at a chosen size/weight.
 * Falls back to Briefcase for any unknown sector. Use with CategoryChip
 * or directly anywhere a sector visual is needed.
 *
 * Visual language pack.
 */

import {
  ForkKnife,
  Bed,
  Storefront,
  Briefcase,
  Palette,
  BookOpen,
  GraduationCap,
  Confetti,
  Plant,
  Bank,
  Hammer,
  Wrench,
  Toolbox,
  Sparkle,
  FirstAid,
  Dog,
  HouseLine,
  Truck,
  Code,
  Broadcast,
  Package,
  Factory,
  Mountains,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhIcon } from "@phosphor-icons/react";

type Weight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone";

const SECTOR_PHOSPHOR: Record<string, PhIcon> = {
  food_drink: ForkKnife,
  hospitality: Bed,
  retail_shops: Storefront,
  professional_services: Briefcase,
  creative_media: Palette,
  cultural: BookOpen,
  education_instruction: GraduationCap,
  events_entertainment: Confetti,
  farming_food_production: Plant,
  finance_corp: Bank,
  construction: Hammer,
  trades_home: Wrench,
  repair: Toolbox,
  beauty_wellness: Sparkle,
  health_clinics: FirstAid,
  pet_services: Dog,
  real_estate: HouseLine,
  transport_small: Truck,
  software_tech: Code,
  telecom_broadcasting: Broadcast,
  manufacturing_artisan: Package,
  heavy_industry: Factory,
  mining_energy: Mountains,
  higher_ed_hospitals: GraduationCap,
  other_local: MapPin,
};

export type SectorIconProps = {
  sectorId: string;
  size?: 12 | 14 | 16 | 20 | 24;
  weight?: Weight;
  className?: string;
  /** When true, marks the icon aria-hidden. Pass false when the icon
   * is the only signifier and needs an accessible label. */
  decorative?: boolean;
  ariaLabel?: string;
};

export default function SectorIcon({
  sectorId,
  size = 16,
  weight = "regular",
  className,
  decorative = true,
  ariaLabel,
}: SectorIconProps) {
  const Icon = SECTOR_PHOSPHOR[sectorId] ?? Briefcase;
  return (
    <Icon
      size={size}
      weight={weight}
      className={className}
      aria-hidden={decorative ? true : undefined}
      aria-label={!decorative ? (ariaLabel ?? sectorId) : undefined}
    />
  );
}
