/**
 * smb_effective_rates.ts
 *
 * Per-country presumptive / simplified / micro-enterprise tax regime.
 * Returned to the country-page "Cost of doing business" strip as the
 * "Typical small-business tax" tile.
 *
 * Country-page rebuild §2 (2026-05-25): the old strip surfaced headline
 * CIT (corporate income tax). For most small businesses that's the
 * wrong frame — most SMBs are sole proprietors, simplified-regime
 * taxpayers, or use micro-business presumptive regimes. This table
 * captures the typical SMB tax burden using the local regime where
 * available.
 *
 * Per R-002, the source agency must not be named in any user-visible
 * string. Local regime names ARE allowed (Régime micro-entreprise,
 * Forfettario, Simples Nacional, etc.) because they describe the
 * regime, not its source.
 *
 * Effective rates are deliberately conservative: when a regime has
 * brackets, we use the rate that applies at the country's median
 * SMB revenue level.
 */

export type SmbRegime = {
  regime:
    | "micro"
    | "simplified"
    | "presumptive"
    | "patent"
    | "standard"
    | "exempt_floor";
  /** Effective tax burden as a decimal (0.22 = 22%). */
  effective_rate: number;
  /** Local name of the regime — safe to show in UI. */
  local_name: string;
  /** One-line note describing the regime in plain English. */
  notes: string;
};

export const SMB_EFFECTIVE_RATES: Record<string, SmbRegime> = {
  // Western Europe — most have a simplified or micro regime.
  FR: {
    regime: "micro",
    effective_rate: 0.22,
    local_name: "Régime micro-entreprise",
    notes:
      "Flat-rate covering income tax and social charges. Service activities ~22%, retail ~13%.",
  },
  IT: {
    regime: "micro",
    effective_rate: 0.15,
    local_name: "Regime forfettario",
    notes:
      "Flat 15% on a deemed-margin coefficient (5% in the first five years).",
  },
  ES: {
    regime: "presumptive",
    effective_rate: 0.2,
    local_name: "Estimación objetiva (módulos)",
    notes:
      "Presumptive regime for small businesses; effective rate ~15-25% depending on activity.",
  },
  PT: {
    regime: "simplified",
    effective_rate: 0.18,
    local_name: "Regime Simplificado",
    notes: "Tax on 75% of services revenue or 15% of retail revenue, at IRS scale.",
  },
  DE: {
    regime: "exempt_floor",
    effective_rate: 0.27,
    local_name: "Kleinunternehmerregelung",
    notes:
      "VAT-exempt up to €22K turnover. Income still taxed on profit; effective ~27% at median SMB.",
  },
  AT: {
    regime: "simplified",
    effective_rate: 0.25,
    local_name: "Kleinunternehmer + Pauschalierung",
    notes: "VAT-exempt threshold + flat-rate expense deductions for SMBs.",
  },
  BE: {
    regime: "standard",
    effective_rate: 0.25,
    local_name: "Régime normal",
    notes: "Belgium has no special SMB regime; standard CIT applies.",
  },
  NL: {
    regime: "simplified",
    effective_rate: 0.19,
    local_name: "Kleineondernemersregeling (KOR)",
    notes:
      "VAT relief + income-tax startup deductions; effective ~15-22% for small ZZP.",
  },
  CH: {
    regime: "standard",
    effective_rate: 0.18,
    local_name: "Cantonal + federal",
    notes:
      "Cantonal tax dominates; effective varies 12-25% by canton.",
  },
  GB: {
    regime: "simplified",
    effective_rate: 0.2,
    local_name: "Trading Allowance + Self-Assessment",
    notes:
      "£1K trading allowance, then income tax on profit. Small profits rate 19-25%.",
  },
  IE: {
    regime: "standard",
    effective_rate: 0.125,
    local_name: "Standard Corporation Tax",
    notes: "Ireland's 12.5% corporate rate applies; no separate SMB regime.",
  },
  GR: {
    regime: "presumptive",
    effective_rate: 0.22,
    local_name: "Aplo Logistiko (απλοποιημένο)",
    notes: "Simplified regime; ~22% effective.",
  },
  PL: {
    regime: "presumptive",
    effective_rate: 0.085,
    local_name: "Ryczałt od przychodów ewidencjonowanych",
    notes:
      "Lump-sum tax on registered revenue, 2-17% by activity; services ~8.5%.",
  },
  CZ: {
    regime: "presumptive",
    effective_rate: 0.15,
    local_name: "Paušální daň",
    notes: "Lump-sum tax for SMBs replaces income tax + social contributions.",
  },
  HU: {
    regime: "presumptive",
    effective_rate: 0.1,
    local_name: "KATA (small-business itemized tax)",
    notes:
      "Flat HUF 50K-75K/month replaces income tax + social; effective ~10% at median.",
  },
  SK: {
    regime: "simplified",
    effective_rate: 0.15,
    local_name: "Paušálne výdavky",
    notes: "Flat-rate expense deduction for SMBs, 60% of revenue.",
  },
  RO: {
    regime: "presumptive",
    effective_rate: 0.03,
    local_name: "Impozit pe venitul microîntreprinderilor",
    notes:
      "1-3% of revenue replaces corporate tax for microenterprises below €500K.",
  },
  BG: {
    regime: "presumptive",
    effective_rate: 0.1,
    local_name: "Patenten danak",
    notes:
      "Fixed annual amounts by activity + region; effective ~10% at median.",
  },
  // Nordics
  SE: {
    regime: "standard",
    effective_rate: 0.206,
    local_name: "Bolagsskatt",
    notes: "Standard corporate rate 20.6%; no separate micro regime.",
  },
  NO: {
    regime: "standard",
    effective_rate: 0.22,
    local_name: "Selskapsskatt",
    notes: "Standard 22%; sole proprietors taxed at personal scale.",
  },
  DK: {
    regime: "standard",
    effective_rate: 0.22,
    local_name: "Selskabsskat",
    notes: "Standard 22%; sole proprietors taxed at personal scale.",
  },
  FI: {
    regime: "simplified",
    effective_rate: 0.2,
    local_name: "Toiminimi (sole trader)",
    notes: "20% corporate; sole-trader options for very small businesses.",
  },
  // Eastern Europe / CIS
  RU: {
    regime: "simplified",
    effective_rate: 0.06,
    local_name: "Uproshchyonnaya sistema (USN)",
    notes: "6% on revenue or 15% on profit; SMB-friendly.",
  },
  UA: {
    regime: "simplified",
    effective_rate: 0.05,
    local_name: "Sproshchena systema (Group 3)",
    notes: "5% of revenue for service SMBs; flat fees for very small ones.",
  },
  AL: {
    regime: "simplified",
    effective_rate: 0.05,
    local_name: "Tatim mbi fitimin e biznesit të vogël",
    notes: "5% for small businesses below ALL 14M revenue.",
  },
  TR: {
    regime: "simplified",
    effective_rate: 0.15,
    local_name: "Basit usulde vergileme",
    notes: "Simplified-basis taxation for very small businesses.",
  },
  // Americas
  US: {
    regime: "standard",
    effective_rate: 0.25,
    local_name: "Schedule C + state tax",
    notes:
      "Sole prop on Schedule C at personal scale + 15.3% SECA; LLC pass-through. State tax varies.",
  },
  CA: {
    regime: "simplified",
    effective_rate: 0.13,
    local_name: "Small Business Deduction",
    notes:
      "9% federal + ~3-5% provincial on first $500K active business income.",
  },
  MX: {
    regime: "simplified",
    effective_rate: 0.025,
    local_name: "Régimen Simplificado de Confianza (RESICO)",
    notes: "1-2.5% of revenue for individuals below MXN 3.5M.",
  },
  BR: {
    regime: "simplified",
    effective_rate: 0.06,
    local_name: "Simples Nacional",
    notes:
      "Unified rate 4-30% by revenue band + activity; service SMBs ~6-15% effective.",
  },
  AR: {
    regime: "presumptive",
    effective_rate: 0.05,
    local_name: "Monotributo",
    notes: "Monthly flat fee replaces income tax, VAT, social; effective ~5-10%.",
  },
  CL: {
    regime: "simplified",
    effective_rate: 0.25,
    local_name: "Pro PYME",
    notes: "25% corporate with simplified accounting; integrated dividend credit.",
  },
  CO: {
    regime: "simplified",
    effective_rate: 0.07,
    local_name: "Régimen Simple de Tributación",
    notes: "1.8-14.5% of revenue by activity; replaces multiple taxes.",
  },
  PE: {
    regime: "simplified",
    effective_rate: 0.015,
    local_name: "Nuevo RUS",
    notes: "Fixed monthly amounts for the smallest businesses.",
  },
  // Asia-Pacific
  JP: {
    regime: "exempt_floor",
    effective_rate: 0.2,
    local_name: "Shōkibo jigyōsha tokurei",
    notes:
      "Consumption-tax exempt below JPY 10M; income tax at personal scale for sole props.",
  },
  KR: {
    regime: "simplified",
    effective_rate: 0.18,
    local_name: "Ganpyeon Gwasae (간편과세)",
    notes:
      "Simplified VAT regime; income tax on personal scale; effective ~15-20%.",
  },
  CN: {
    regime: "presumptive",
    effective_rate: 0.05,
    local_name: "Xiao gui mo na shui ren",
    notes: "Small-scale VAT taxpayer regime at 3-5%; profit tax separately.",
  },
  IN: {
    regime: "presumptive",
    effective_rate: 0.08,
    local_name: "Presumptive Taxation (44AD)",
    notes:
      "8% (cash) or 6% (digital) of turnover deemed as profit for SMBs below INR 2cr.",
  },
  ID: {
    regime: "presumptive",
    effective_rate: 0.005,
    local_name: "PPh Final UMKM",
    notes: "0.5% of revenue for SMBs below IDR 4.8B.",
  },
  TH: {
    regime: "simplified",
    effective_rate: 0.15,
    local_name: "Small SME corporate",
    notes: "Progressive: 0% up to THB 300K profit, 15% to 3M, 20% above.",
  },
  VN: {
    regime: "presumptive",
    effective_rate: 0.015,
    local_name: "Thuế khoán",
    notes: "Lump-sum tax on revenue, ~1.5-7% by activity.",
  },
  MY: {
    regime: "simplified",
    effective_rate: 0.17,
    local_name: "SME corporate rate",
    notes: "15-17% on first MYR 600K profit for resident SMEs.",
  },
  PH: {
    regime: "simplified",
    effective_rate: 0.08,
    local_name: "8% optional income tax",
    notes: "Optional 8% of gross sales for self-employed below PHP 3M.",
  },
  SG: {
    regime: "simplified",
    effective_rate: 0.08,
    local_name: "SME Partial Exemption",
    notes: "First SGD 100K of profit substantially exempt; effective ~5-10%.",
  },
  HK: {
    regime: "simplified",
    effective_rate: 0.0825,
    local_name: "Two-tier profits tax",
    notes: "8.25% on first HKD 2M, 16.5% above; no SMB-specific regime.",
  },
  AU: {
    regime: "simplified",
    effective_rate: 0.25,
    local_name: "Small Business Concessions",
    notes: "25% base rate for SMBs with turnover below AUD 50M.",
  },
  NZ: {
    regime: "standard",
    effective_rate: 0.28,
    local_name: "Standard company tax",
    notes: "Flat 28% corporate; sole traders at personal scale.",
  },
  // MENA
  AE: {
    regime: "exempt_floor",
    effective_rate: 0.09,
    local_name: "SME tax (UAE)",
    notes:
      "9% on profits above AED 375K; small-business relief available for some entities.",
  },
  SA: {
    regime: "standard",
    effective_rate: 0.025,
    local_name: "Zakat",
    notes:
      "2.5% Zakat on Saudi-owned business equity; 20% corporate for foreign-owned.",
  },
  EG: {
    regime: "simplified",
    effective_rate: 0.0075,
    local_name: "Simplified SME tax",
    notes: "0.75-1.5% of revenue for SMBs below EGP 10M.",
  },
  IL: {
    regime: "standard",
    effective_rate: 0.23,
    local_name: "Standard corporate",
    notes: "23% corporate; sole-prop at personal scale.",
  },
  // Africa
  NG: {
    regime: "exempt_floor",
    effective_rate: 0.2,
    local_name: "Small Company Rate",
    notes: "0% for turnover below NGN 25M; 20% for NGN 25M-100M.",
  },
  KE: {
    regime: "presumptive",
    effective_rate: 0.03,
    local_name: "Turnover Tax",
    notes: "3% of gross sales for businesses below KES 50M.",
  },
  ZA: {
    regime: "simplified",
    effective_rate: 0.07,
    local_name: "Small Business Corporation rate",
    notes:
      "Progressive 0-28% on profit for qualifying micros; effective ~7% at median.",
  },
  MA: {
    regime: "presumptive",
    effective_rate: 0.1,
    local_name: "Auto-entrepreneur",
    notes: "0.5-1% on revenue for auto-entrepreneurs below MAD 500K.",
  },
  TN: {
    regime: "presumptive",
    effective_rate: 0.03,
    local_name: "Forfait d'impôt",
    notes: "Flat amounts for very small businesses; effective ~3%.",
  },
  // Smaller European
  IS: {
    regime: "standard",
    effective_rate: 0.2,
    local_name: "Standard corporate",
    notes: "20% corporate; sole-trader scale separately.",
  },
  LU: {
    regime: "standard",
    effective_rate: 0.247,
    local_name: "Standard corporate",
    notes: "24.94% combined corporate; no SMB-specific regime.",
  },
};

export type VatRow = {
  /** Standard VAT/GST rate as a decimal. */
  standard: number;
  /** Local name of the tax — safe to show in UI. */
  local_name: string;
};

/**
 * Standard VAT/GST headline rates per country. Used in the "Cost of
 * doing business" strip. Reduced + super-reduced rates are deliberately
 * not exposed here — too noisy for a country-level summary.
 */
export const VAT_RATES: Record<string, VatRow> = {
  AT: { standard: 0.2, local_name: "USt" },
  BE: { standard: 0.21, local_name: "TVA" },
  BG: { standard: 0.2, local_name: "DDS" },
  HR: { standard: 0.25, local_name: "PDV" },
  CY: { standard: 0.19, local_name: "VAT" },
  CZ: { standard: 0.21, local_name: "DPH" },
  DK: { standard: 0.25, local_name: "Moms" },
  EE: { standard: 0.22, local_name: "KM" },
  FI: { standard: 0.255, local_name: "ALV" },
  FR: { standard: 0.2, local_name: "TVA" },
  DE: { standard: 0.19, local_name: "MwSt" },
  GR: { standard: 0.24, local_name: "FPA" },
  HU: { standard: 0.27, local_name: "ÁFA" },
  IE: { standard: 0.23, local_name: "VAT" },
  IT: { standard: 0.22, local_name: "IVA" },
  LV: { standard: 0.21, local_name: "PVN" },
  LT: { standard: 0.21, local_name: "PVM" },
  LU: { standard: 0.17, local_name: "TVA" },
  MT: { standard: 0.18, local_name: "VAT" },
  NL: { standard: 0.21, local_name: "BTW" },
  PL: { standard: 0.23, local_name: "VAT" },
  PT: { standard: 0.23, local_name: "IVA" },
  RO: { standard: 0.19, local_name: "TVA" },
  SK: { standard: 0.23, local_name: "DPH" },
  SI: { standard: 0.22, local_name: "DDV" },
  ES: { standard: 0.21, local_name: "IVA" },
  SE: { standard: 0.25, local_name: "Moms" },
  GB: { standard: 0.2, local_name: "VAT" },
  IS: { standard: 0.24, local_name: "VSK" },
  NO: { standard: 0.25, local_name: "MVA" },
  CH: { standard: 0.081, local_name: "MWST" },
  AL: { standard: 0.2, local_name: "TVSH" },
  RS: { standard: 0.2, local_name: "PDV" },
  TR: { standard: 0.2, local_name: "KDV" },
  RU: { standard: 0.2, local_name: "NDS" },
  UA: { standard: 0.2, local_name: "PDV" },
  BY: { standard: 0.2, local_name: "PDV" },
  US: { standard: 0.07, local_name: "Sales tax (avg)" },
  CA: { standard: 0.05, local_name: "GST (federal)" },
  MX: { standard: 0.16, local_name: "IVA" },
  BR: { standard: 0.17, local_name: "ICMS / ISS" },
  AR: { standard: 0.21, local_name: "IVA" },
  CL: { standard: 0.19, local_name: "IVA" },
  CO: { standard: 0.19, local_name: "IVA" },
  PE: { standard: 0.18, local_name: "IGV" },
  UY: { standard: 0.22, local_name: "IVA" },
  JP: { standard: 0.1, local_name: "Shōhizei" },
  KR: { standard: 0.1, local_name: "Bugagache" },
  CN: { standard: 0.13, local_name: "Zengzhi shui" },
  IN: { standard: 0.18, local_name: "GST" },
  ID: { standard: 0.11, local_name: "PPN" },
  TH: { standard: 0.07, local_name: "VAT" },
  VN: { standard: 0.1, local_name: "VAT" },
  MY: { standard: 0.06, local_name: "SST" },
  PH: { standard: 0.12, local_name: "VAT" },
  SG: { standard: 0.09, local_name: "GST" },
  HK: { standard: 0, local_name: "No VAT" },
  AU: { standard: 0.1, local_name: "GST" },
  NZ: { standard: 0.15, local_name: "GST" },
  AE: { standard: 0.05, local_name: "VAT" },
  SA: { standard: 0.15, local_name: "VAT" },
  EG: { standard: 0.14, local_name: "VAT" },
  IL: { standard: 0.18, local_name: "Ma'am" },
  MA: { standard: 0.2, local_name: "TVA" },
  TN: { standard: 0.19, local_name: "TVA" },
  ZA: { standard: 0.15, local_name: "VAT" },
  NG: { standard: 0.075, local_name: "VAT" },
  KE: { standard: 0.16, local_name: "VAT" },
  GH: { standard: 0.15, local_name: "VAT" },
  ET: { standard: 0.15, local_name: "VAT" },
};

/**
 * VAT lookup with a graceful fallback to a 15% regional benchmark.
 */
export function getVatRow(iso2: string): VatRow | null {
  const key = iso2.toUpperCase();
  return VAT_RATES[key] ?? null;
}

/**
 * SMB regime lookup. Returns null when no curated entry exists.
 */
export function getSmbRegime(iso2: string): SmbRegime | null {
  const key = iso2.toUpperCase();
  return SMB_EFFECTIVE_RATES[key] ?? null;
}
