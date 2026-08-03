/**
 * Sector icon map for visual differentiation.
 *
 * Used on /industries (sector group headings), country pages, and
 * anywhere else sectors are listed without an icon.
 * Returns a single-emoji glyph that survives in plain text and works
 * across platforms without font dependencies.
 */
export const SECTOR_ICONS: Record<string, string> = {
  food_drink: "🍽️",
  retail_shops: "🛍️",
  beauty_wellness: "💇",
  professional_services: "💼",
  health_services: "⚕️",
  tech_creative: "💻",
  construction_trades: "🏗️",
  manufacturing: "🏭",
  agriculture: "🌾",
  hospitality_tourism: "🏨",
  transportation_logistics: "🚚",
  real_estate: "🏘️",
  finance_insurance: "💰",
  arts_entertainment: "🎭",
  education: "🎓",
  automotive: "🚗",
  wholesale: "📦",
  utilities_energy: "⚡",
  mining_resources: "⛏️",
  legal_services: "⚖️",
  media_communications: "📺",
  government_public: "🏛️",
  nonprofit: "🤝",
  recreation_sports: "🏃",
  default: "🏢",
};

export function sectorIcon(sectorId: string | null | undefined): string {
  if (!sectorId) return SECTOR_ICONS.default;
  return SECTOR_ICONS[sectorId] || SECTOR_ICONS.default;
}
