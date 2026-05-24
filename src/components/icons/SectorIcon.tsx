/**
 * Plan v19 Block F — Phosphor icon mapping for the 25 sectors.
 *
 * Replaces the emoji-per-sector treatment in src/lib/taxonomy/sectors.json
 * with consistent Phosphor Duotone icons in the warm-earth palette. The
 * emoji field is kept in the JSON for backward compatibility but the UI
 * reads from this map first.
 */
"use client";
import {
  ForkKnife,
  ShoppingBag,
  Scissors,
  Hammer,
  Bed,
  Briefcase,
  Laptop,
  House,
  Truck,
  Factory,
  Buildings,
  Plant,
  Stethoscope,
  GraduationCap,
  PaintBrush,
  Wrench,
  Dog,
  Confetti,
  Bank,
  Sparkle,
  Mountains,
  CellTower,
  // Plan v32 hotfix — additional icons so every sector gets a
  // distinct mark. Previously heavy_industry shared Factory with
  // manufacturing_artisan, finance_corp shared Bank with cultural,
  // higher_ed_hospitals shared Stethoscope with health_clinics.
  GearSix,
  ChartLineUp,
  Hospital,
} from "@phosphor-icons/react/dist/ssr";

// Phosphor exports `Icon` type but it expects a constrained IconWeight
// literal union. Using `any` here is fine — every value below is a real
// Phosphor icon component and TS verifies the import.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SECTOR_ICONS: Record<string, any> = {
  food_drink: ForkKnife,
  retail_shops: ShoppingBag,
  beauty_wellness: Scissors,
  trades_home: Hammer,
  hospitality: Bed,
  professional_services: Briefcase,
  software_tech: Laptop,
  real_estate: House,
  transport_small: Truck,
  manufacturing_artisan: Factory,
  construction: Buildings,
  farming_food_production: Plant,
  health_clinics: Stethoscope,
  education_instruction: GraduationCap,
  creative_media: PaintBrush,
  repair: Wrench,
  pet_services: Dog,
  events_entertainment: Confetti,
  cultural: Bank,
  other_local: Sparkle,
  // Pro-only sectors. v32 hotfix — every icon below now distinct
  // from the visible 20-sector set above.
  mining_energy: Mountains,
  heavy_industry: GearSix,        // was Factory (duplicate of manufacturing_artisan)
  finance_corp: ChartLineUp,      // was Bank (duplicate of cultural)
  telecom_broadcasting: CellTower,
  higher_ed_hospitals: Hospital,  // was Stethoscope (duplicate of health_clinics)
};

type Props = {
  sectorId: string;
  size?: number;
  className?: string;
  /** Phosphor weight: "thin" | "light" | "regular" | "bold" | "fill" | "duotone". Default "duotone". */
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
};

/**
 * Render the Phosphor icon for a given sector_id. Falls back to the
 * generic Sparkle icon if the sector isn't mapped (shouldn't happen
 * unless a new sector lands without updating this map).
 */
export function SectorIcon({ sectorId, size = 32, className, weight = "duotone" }: Props) {
  const Component = SECTOR_ICONS[sectorId] || Sparkle;
  return <Component size={size} weight={weight} className={className} />;
}
