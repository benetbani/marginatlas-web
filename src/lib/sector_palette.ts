/**
 * sector_palette
 * ==============
 *
 * Per-sector visual tokens for Margin Atlas. Every sector gets:
 *   - label   uppercase human-readable name (e.g., "FOOD & DRINK")
 *   - tint    Tailwind class string for chip/tag backgrounds
 *             (border + bg + text — single string composed)
 *   - accent  Tailwind text color used for icon and accent rules
 *
 * Plan v30 Phase 3 — visual language pack. All colors stay within the
 * cream/parchment/atlas/cocoa family. NO blues, NO mint, NO purple.
 */

export type SectorTokens = {
  label: string;
  tint: string;
  accent: string;
};

const A = "bg-cream-100 border-cream-300 text-cocoa-900"; // warm neutral
const B = "bg-atlas-50 border-atlas-200 text-atlas-900";   // warm amber
const C = "bg-cocoa-50 border-cocoa-100 text-cocoa-900";   // cocoa-leaning

export const SECTOR_TOKENS: Record<string, SectorTokens> = {
  food_drink:               { label: "FOOD & DRINK",            tint: B, accent: "text-atlas-700" },
  hospitality:              { label: "HOSPITALITY",             tint: A, accent: "text-cocoa-700" },
  retail_shops:             { label: "RETAIL",                  tint: A, accent: "text-cocoa-700" },
  professional_services:    { label: "PROFESSIONAL SERVICES",   tint: C, accent: "text-cocoa-700" },
  creative_media:           { label: "CREATIVE & MEDIA",        tint: A, accent: "text-atlas-700" },
  cultural:                 { label: "CULTURAL",                tint: A, accent: "text-cocoa-700" },
  education_instruction:    { label: "EDUCATION",               tint: C, accent: "text-cocoa-700" },
  events_entertainment:     { label: "EVENTS & ENTERTAINMENT",  tint: B, accent: "text-atlas-700" },
  farming_food_production:  { label: "FARMING & FOOD",          tint: A, accent: "text-cocoa-700" },
  finance_corp:             { label: "FINANCE",                 tint: C, accent: "text-cocoa-700" },
  construction:             { label: "CONSTRUCTION",            tint: A, accent: "text-cocoa-700" },
  trades_home:              { label: "HOME TRADES",             tint: A, accent: "text-cocoa-700" },
  repair:                   { label: "REPAIR",                  tint: A, accent: "text-cocoa-700" },
  beauty_wellness:          { label: "BEAUTY & WELLNESS",       tint: B, accent: "text-atlas-700" },
  health_clinics:           { label: "HEALTH & CLINICS",        tint: C, accent: "text-cocoa-700" },
  pet_services:             { label: "PET SERVICES",            tint: B, accent: "text-atlas-700" },
  real_estate:              { label: "REAL ESTATE",             tint: C, accent: "text-cocoa-700" },
  transport_small:          { label: "TRANSPORT",               tint: A, accent: "text-cocoa-700" },
  software_tech:            { label: "SOFTWARE & TECH",         tint: C, accent: "text-cocoa-700" },
  telecom_broadcasting:     { label: "TELECOM",                 tint: C, accent: "text-cocoa-700" },
  manufacturing_artisan:    { label: "ARTISAN MANUFACTURING",   tint: A, accent: "text-cocoa-700" },
  heavy_industry:           { label: "HEAVY INDUSTRY",          tint: A, accent: "text-cocoa-700" },
  mining_energy:            { label: "MINING & ENERGY",         tint: A, accent: "text-cocoa-700" },
  higher_ed_hospitals:      { label: "HIGHER ED & HOSPITALS",   tint: C, accent: "text-cocoa-700" },
  other_local:              { label: "LOCAL SERVICES",          tint: A, accent: "text-cocoa-700" },
};

const DEFAULT_TOKENS: SectorTokens = {
  label: "INDUSTRY",
  tint: A,
  accent: "text-cocoa-700",
};

export function tokensFor(sectorId: string | null | undefined): SectorTokens {
  if (!sectorId) return DEFAULT_TOKENS;
  return SECTOR_TOKENS[sectorId] ?? DEFAULT_TOKENS;
}
