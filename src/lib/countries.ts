/**
 * ISO-2 → ISO-3 country code mapping + display slug helpers.
 *
 * Used to bridge the website URL space (ISO-2, e.g. /de) and the
 * extrapolated_cells table key (ISO-3, e.g. DEU).
 */

import { COUNTRIES } from "./taxonomy";

// Comprehensive ISO-2 → ISO-3 map. Includes every country in COUNTRIES + the
// rest of the ISO-3166 universe so unknown codes still resolve where possible.
const ISO2_TO_ISO3: Record<string, string> = {
  AD: "AND", AE: "ARE", AF: "AFG", AG: "ATG", AI: "AIA", AL: "ALB", AM: "ARM",
  AO: "AGO", AR: "ARG", AS: "ASM", AT: "AUT", AU: "AUS", AW: "ABW", AX: "ALA",
  AZ: "AZE", BA: "BIH", BB: "BRB", BD: "BGD", BE: "BEL", BF: "BFA", BG: "BGR",
  BH: "BHR", BI: "BDI", BJ: "BEN", BL: "BLM", BM: "BMU", BN: "BRN", BO: "BOL",
  BQ: "BES", BR: "BRA", BS: "BHS", BT: "BTN", BV: "BVT", BW: "BWA", BY: "BLR",
  BZ: "BLZ", CA: "CAN", CC: "CCK", CD: "COD", CF: "CAF", CG: "COG", CH: "CHE",
  CI: "CIV", CK: "COK", CL: "CHL", CM: "CMR", CN: "CHN", CO: "COL", CR: "CRI",
  CU: "CUB", CV: "CPV", CW: "CUW", CX: "CXR", CY: "CYP", CZ: "CZE", DE: "DEU",
  DJ: "DJI", DK: "DNK", DM: "DMA", DO: "DOM", DZ: "DZA", EC: "ECU", EE: "EST",
  EG: "EGY", EH: "ESH", ER: "ERI", ES: "ESP", ET: "ETH", FI: "FIN", FJ: "FJI",
  FK: "FLK", FM: "FSM", FO: "FRO", FR: "FRA", GA: "GAB", GB: "GBR", GD: "GRD",
  GE: "GEO", GF: "GUF", GG: "GGY", GH: "GHA", GI: "GIB", GL: "GRL", GM: "GMB",
  GN: "GIN", GP: "GLP", GQ: "GNQ", GR: "GRC", GS: "SGS", GT: "GTM", GU: "GUM",
  GW: "GNB", GY: "GUY", HK: "HKG", HM: "HMD", HN: "HND", HR: "HRV", HT: "HTI",
  HU: "HUN", ID: "IDN", IE: "IRL", IL: "ISR", IM: "IMN", IN: "IND", IO: "IOT",
  IQ: "IRQ", IR: "IRN", IS: "ISL", IT: "ITA", JE: "JEY", JM: "JAM", JO: "JOR",
  JP: "JPN", KE: "KEN", KG: "KGZ", KH: "KHM", KI: "KIR", KM: "COM", KN: "KNA",
  KP: "PRK", KR: "KOR", KW: "KWT", KY: "CYM", KZ: "KAZ", LA: "LAO", LB: "LBN",
  LC: "LCA", LI: "LIE", LK: "LKA", LR: "LBR", LS: "LSO", LT: "LTU", LU: "LUX",
  LV: "LVA", LY: "LBY", MA: "MAR", MC: "MCO", MD: "MDA", ME: "MNE", MF: "MAF",
  MG: "MDG", MH: "MHL", MK: "MKD", ML: "MLI", MM: "MMR", MN: "MNG", MO: "MAC",
  MP: "MNP", MQ: "MTQ", MR: "MRT", MS: "MSR", MT: "MLT", MU: "MUS", MV: "MDV",
  MW: "MWI", MX: "MEX", MY: "MYS", MZ: "MOZ", NA: "NAM", NC: "NCL", NE: "NER",
  NF: "NFK", NG: "NGA", NI: "NIC", NL: "NLD", NO: "NOR", NP: "NPL", NR: "NRU",
  NU: "NIU", NZ: "NZL", OM: "OMN", PA: "PAN", PE: "PER", PF: "PYF", PG: "PNG",
  PH: "PHL", PK: "PAK", PL: "POL", PM: "SPM", PN: "PCN", PR: "PRI", PS: "PSE",
  PT: "PRT", PW: "PLW", PY: "PRY", QA: "QAT", RE: "REU", RO: "ROU", RS: "SRB",
  RU: "RUS", RW: "RWA", SA: "SAU", SB: "SLB", SC: "SYC", SD: "SDN", SE: "SWE",
  SG: "SGP", SH: "SHN", SI: "SVN", SJ: "SJM", SK: "SVK", SL: "SLE", SM: "SMR",
  SN: "SEN", SO: "SOM", SR: "SUR", SS: "SSD", ST: "STP", SV: "SLV", SX: "SXM",
  SY: "SYR", SZ: "SWZ", TC: "TCA", TD: "TCD", TF: "ATF", TG: "TGO", TH: "THA",
  TJ: "TJK", TK: "TKL", TL: "TLS", TM: "TKM", TN: "TUN", TO: "TON", TR: "TUR",
  TT: "TTO", TV: "TUV", TW: "TWN", TZ: "TZA", UA: "UKR", UG: "UGA", UM: "UMI",
  US: "USA", UY: "URY", UZ: "UZB", VA: "VAT", VC: "VCT", VE: "VEN", VG: "VGB",
  VI: "VIR", VN: "VNM", VU: "VUT", WF: "WLF", WS: "WSM", YE: "YEM", YT: "MYT",
  ZA: "ZAF", ZM: "ZMB", ZW: "ZWE",
};

const ISO3_TO_ISO2: Record<string, string> = Object.fromEntries(
  Object.entries(ISO2_TO_ISO3).map(([a, b]) => [b, a])
);

export function iso2ToIso3(iso2: string): string | null {
  return ISO2_TO_ISO3[iso2.toUpperCase()] || null;
}

/**
 * Country flag from ISO-2 — built from unicode regional indicator pairs.
 * Returns the flag emoji + render hint suitable for `className="flag"`.
 * The .flag class in globals.css provides Twemoji/Segoe fallback on Windows.
 */
export function flagFromIso2(iso2: string): string {
  const code = (iso2 || "").toUpperCase();
  if (code.length !== 2) return "";
  const a = code.charCodeAt(0);
  const b = code.charCodeAt(1);
  if (a < 65 || a > 90 || b < 65 || b > 90) return "";
  return String.fromCodePoint(0x1f1e6 + a - 65, 0x1f1e6 + b - 65);
}

export function iso3ToIso2(iso3: string): string | null {
  return ISO3_TO_ISO2[iso3.toUpperCase()] || null;
}

/** Slug → ISO-2 code. Accepts "us", "germany", or any country name slug. */
export function slugToIso2(slug: string): string | null {
  const s = slug.toLowerCase().replace(/-/g, " ").trim();
  // Direct ISO-2 match
  const upper = slug.toUpperCase();
  if (upper.length === 2 && ISO2_TO_ISO3[upper]) return upper;
  // Match by name
  const hit = COUNTRIES.find((c) => c.name.toLowerCase() === s);
  if (hit) return hit.code;
  return null;
}

/** ISO-2 → URL slug (lower-cased ISO-2 code). */
export function iso2ToSlug(iso2: string): string {
  return iso2.toLowerCase();
}

/** ISO-2 → display name from COUNTRIES, or the code itself if not in our list. */
export function iso2ToName(iso2: string): string {
  const c = COUNTRIES.find((c) => c.code === iso2.toUpperCase());
  return c?.name || iso2;
}
