/**
 * City-level rent multipliers (Plan v32 Sprint G).
 *
 * Applied on top of the country baseline when a cell is a known
 * expensive (or cheap) metropolitan area. Currently used by the bulk
 * SQL generator to scale rent_occupancy and lease_deposit on
 * city-level rows; future use will let render-time logic boost the
 * SmartWaterfall rent line on those same cells.
 *
 * Keys are geo_id values as stored in regional_cells.geo_id. Most
 * use the country-CITY-name format (e.g. "GB-CITY-london"); a few
 * use NUTS or LAD codes where the friendly alias maps directly.
 *
 * Multipliers are vs the country baseline. 1.5 means "this city's
 * rent runs 50% higher than the country average."
 *
 * Sources: Knight Frank Wealth Report 2024 prime-retail rents,
 * CBRE Global Retail rents 2024, Cushman & Wakefield Main Streets
 * Across the World 2024.
 */

export const CITY_RENT_MULTIPLIERS: Record<string, number> = {
  // United States — top 5 metros
  "US-CITY-new-york": 2.5,
  "US-CITY-san-francisco": 2.3,
  "US-CITY-los-angeles": 1.8,
  "US-CITY-chicago": 1.4,
  "US-CITY-boston": 1.6,
  "US-CITY-washington-dc": 1.6,
  "US-CITY-miami": 1.5,
  "US-CITY-seattle": 1.7,

  // United Kingdom
  "GB-CITY-london": 2.2,
  "GB-CITY-manchester": 1.2,
  "GB-CITY-edinburgh": 1.3,

  // Germany
  "DE-CITY-munich": 1.8,
  "DE-CITY-frankfurt": 1.6,
  "DE-CITY-hamburg": 1.4,
  "DE-CITY-berlin": 1.3,
  "DE-CITY-dusseldorf": 1.4,

  // France
  "FR-CITY-paris": 2.0,
  "FR-CITY-lyon": 1.2,
  "FR-CITY-nice": 1.4,

  // Italy
  "IT-CITY-milan": 1.7,
  "IT-CITY-rome": 1.5,
  "IT-CITY-florence": 1.3,
  "IT-CITY-venice": 1.4,

  // Spain
  "ES-CITY-madrid": 1.5,
  "ES-CITY-barcelona": 1.6,

  // Japan
  "JP-CITY-tokyo": 2.0,
  "JP-CITY-osaka": 1.3,
  "JP-CITY-kyoto": 1.3,

  // UAE
  "AE-CITY-dubai": 1.7,
  "AE-CITY-abu-dhabi": 1.4,

  // Singapore — city-state, no city aggregate above the country
  "SG-CITY-singapore": 1.6,

  // Switzerland
  "CH-CITY-zurich": 1.9,
  "CH-CITY-geneva": 1.8,

  // Other high-cost
  "AU-CITY-sydney": 1.7,
  "AU-CITY-melbourne": 1.5,
  "CA-CITY-toronto": 1.6,
  "CA-CITY-vancouver": 1.6,
  "NL-CITY-amsterdam": 1.7,
  "IE-CITY-dublin": 1.5,
  "DK-CITY-copenhagen": 1.5,
  "SE-CITY-stockholm": 1.5,
  "NO-CITY-oslo": 1.5,
  "FI-CITY-helsinki": 1.3,
  "BE-CITY-brussels": 1.3,
  "AT-CITY-vienna": 1.3,
  "PT-CITY-lisbon": 1.3,
  "GR-CITY-athens": 1.2,
  "CZ-CITY-prague": 1.3,
  "PL-CITY-warsaw": 1.3,
  "IL-CITY-tel-aviv": 1.7,
  "KR-CITY-seoul": 1.5,
  "MX-CITY-mexico-city": 1.4,
  "BR-CITY-sao-paulo": 1.3,
  "AR-CITY-buenos-aires": 1.3,
  "CO-CITY-bogota": 1.2,
  "CL-CITY-santiago": 1.3,
  "TR-CITY-istanbul": 1.3,
  "ZA-CITY-cape-town": 1.4,
  "ZA-CITY-johannesburg": 1.3,
  "EG-CITY-cairo": 1.2,
  "NG-CITY-lagos": 1.4,
  "KE-CITY-nairobi": 1.3,
  "IN-CITY-mumbai": 1.7,
  "IN-CITY-delhi": 1.4,
  "IN-CITY-bangalore": 1.5,
  "ID-CITY-jakarta": 1.3,
  "TH-CITY-bangkok": 1.3,
  "PH-CITY-manila": 1.3,
  "VN-CITY-ho-chi-minh-city": 1.3,
  "MY-CITY-kuala-lumpur": 1.3,
  "CN-CITY-shanghai": 1.8,
  "CN-CITY-beijing": 1.6,
  "CN-CITY-shenzhen": 1.6,
  "HK-CITY-hong-kong": 2.5,
};

/** Returns the rent multiplier for a given geo_id; 1.0 if not in map. */
export function getCityRentMultiplier(geoId: string | null | undefined): number {
  if (!geoId) return 1.0;
  return CITY_RENT_MULTIPLIERS[geoId] ?? 1.0;
}
