/**
 * Plan v19 Block F — Phosphor icon mapping for the highest-traffic
 * industries. Falls back to the sector icon when the specific industry
 * isn't mapped, so every benchmark page gets a real icon without us
 * having to map all 192 industries by hand.
 */
"use client";
import {
  ForkKnife,
  Coffee,
  Pizza,
  ShoppingBag,
  TShirt,
  Diamond,
  Watch,
  Scissors,
  Hammer,
  Bed,
  Briefcase,
  Scales,
  Calculator,
  Laptop,
  House,
  Truck,
  Wrench,
  Stethoscope,
  Pill,
  GraduationCap,
  PaintBrush,
  Dog,
  Confetti,
  Bank,
  Sparkle,
  Barbell,
  Buildings,
  PencilSimple,
  Camera,
  Microphone,
  Plant,
  Car,
  Wine,
  Heartbeat,
} from "@phosphor-icons/react/dist/ssr";
import { INDUSTRY_BY_ID } from "@/lib/taxonomy";
import { SectorIcon } from "./SectorIcon";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const INDUSTRY_ICONS: Record<string, any> = {
  restaurants: ForkKnife,
  cafes_coffee_shops: Coffee,
  bakeries_pastries: Pizza,
  bars_pubs_clubs: Wine,
  grocery_stores: ShoppingBag,
  clothing_stores: TShirt,
  apparel_mfg: TShirt,
  custom_apparel_mfg: TShirt,
  jewelry_stores: Diamond,
  custom_jewelers: Diamond,
  hairdressers_beauty: Scissors,
  nail_salons: Scissors,
  hair_salons: Scissors,
  barbershops: Scissors,
  fitness_gyms: Barbell,
  sports_fitness: Barbell,
  hotels_lodging: Bed,
  bed_breakfasts: Bed,
  legal_services: Scales,
  management_consulting: Briefcase,
  accounting_bookkeeping: Calculator,
  software_development: Laptop,
  custom_software_contract: Laptop,
  web_mobile_dev_shops: Laptop,
  real_estate_agencies: House,
  residential_construction: Hammer,
  fabricated_metal_mfg: Hammer,
  primary_metal_mfg: Hammer,
  machinery_mfg: Hammer,
  auto_repair_shops: Wrench,
  motor_vehicles_mfg: Car,
  doctors_clinics: Stethoscope,
  dental_practices: Stethoscope,
  veterinary_pet_care: Dog,
  pet_services: Dog,
  cleaning_services: Sparkle,
  freight_trucking: Truck,
  food_mfg: ForkKnife,
  beverage_mfg: Wine,
  craft_beer_mfg: Wine,
  print_publishing: PencilSimple,
  photography_studios: Camera,
  music_recording: Microphone,
  textile_apparel_mfg: TShirt,
  furniture_home_stores: House,
  health_beauty_stores: Sparkle,
  pharmacies: Pill,
  chemical_pharma_mfg: Pill,
  education_instruction: GraduationCap,
  scenic_sightseeing_transport: Truck,
  transit_ground_passenger: Truck,
  florists: Plant,
  vegetable_fruit_farming: Plant,
  grain_farming: Plant,
  livestock_farming: Plant,
  forestry_logging: Plant,
  fishing_aquaculture: Plant,
  hospitals: Heartbeat,
  events_planning: Confetti,
};

type Props = {
  industryId: string;
  size?: number;
  className?: string;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
};

/**
 * Industry-specific icon. Falls back to the sector icon when the
 * industry isn't directly mapped.
 */
export function IndustryIcon({ industryId, size = 32, className, weight = "duotone" }: Props) {
  const Direct = INDUSTRY_ICONS[industryId];
  if (Direct) return <Direct size={size} weight={weight} className={className} />;
  const sector = INDUSTRY_BY_ID[industryId]?.sector_id;
  if (sector) return <SectorIcon sectorId={sector} size={size} className={className} weight={weight} />;
  // Last-resort generic
  const Fallback = Sparkle;
  return <Fallback size={size} weight={weight} className={className} />;
}
