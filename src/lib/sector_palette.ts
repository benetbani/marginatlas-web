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
 * Visual language pack. All colors stay within the
 * cream/parchment/atlas/cocoa family. NO blues, NO mint, NO purple.
 */

export type SectorTokens = {
  label: string;
  tint: string;
  accent: string;
};

const A = "bg-paper-100 border-parchment text-cocoa-900"; // true neutral, s=0%
const B = "bg-atlas-50 border-atlas-200 text-atlas-900";   // warm amber
/* NO LONGER COCOA-LEANING, 2026-08-17, and the label is corrected rather than
   the classes. The two steps this chip used to name were #faf4ec and #f0e7d9,
   warm sand at s58% and s43%, and they were retoned to true neutrals because
   both were the banned cream under a name that does not say cream. They were
   then collapsed away entirely, being byte-identical twins of the ink steps, so
   this chip now spells the surviving names for the values it already had.

   WHICH MAKES THE REAL FINDING IMPOSSIBLE TO KEEP HIDING: C is now A with a
   heavier border, letter for letter, and the six sectors carrying it read the
   same grey as the eleven carrying A. Whether those six should have a distinct
   tint at all is a design question for the founder; inventing one here would be
   inventing a colour to justify a variable. */
const C = "bg-paper-100 border-ink-100 text-cocoa-900";   // neutral, s=0%

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
