/**
 * Quick smoke test for the Plan v29 cost engine.
 * Verifies the hotel-Mexico case (and several others) produce realistic
 * net margins after the cap.
 */
import { estimateCostStructure } from "../../src/lib/cost_engine/engine";

export {};

const CASES: Array<{ label: string; iso2: string; industry: string; size: "small" | "medium" | "large"; rev: number; tier: 1 | 2 | 3 }> = [
  { label: "Hotel Mexico (Cancún T1)", iso2: "MX", industry: "hotels_lodging", size: "medium", rev: 1_200_000, tier: 1 },
  { label: "Restaurant US NYC", iso2: "US", industry: "restaurants", size: "medium", rev: 1_100_000, tier: 1 },
  { label: "Coffee shop Germany", iso2: "DE", industry: "cafes_coffee_shops", size: "small", rev: 600_000, tier: 2 },
  { label: "Hotel Switzerland Zürich", iso2: "CH", industry: "hotels_lodging", size: "medium", rev: 2_500_000, tier: 1 },
  { label: "Hotel India Mumbai", iso2: "IN", industry: "hotels_lodging", size: "medium", rev: 400_000, tier: 1 },
  { label: "Law firm UK London", iso2: "GB", industry: "legal_services", size: "medium", rev: 1_500_000, tier: 1 },
  { label: "Software shop India", iso2: "IN", industry: "software_development", size: "medium", rev: 250_000, tier: 1 },
  { label: "Restaurant Vietnam", iso2: "VN", industry: "restaurants", size: "small", rev: 80_000, tier: 1 },
  { label: "Auto repair Brazil", iso2: "BR", industry: "auto_repair_shops", size: "small", rev: 280_000, tier: 2 },
  { label: "Plumbing Australia", iso2: "AU", industry: "plumbing_hvac", size: "small", rev: 600_000, tier: 2 },
];

console.log("CASE | revenue | net margin | clamped? | confidence");
console.log("---");
for (const c of CASES) {
  const r = estimateCostStructure({ iso2: c.iso2, industryId: c.industry, sizeBand: c.size, grossRevenue: c.rev, cityTier: c.tier });
  const flag = r.margin_clamped ? "CLAMPED" : r.margin_flagged ? "flagged" : "ok";
  console.log(`${c.label.padEnd(38)} | $${(c.rev / 1000).toFixed(0).padStart(7)}K | ${(r.net_margin * 100).toFixed(1).padStart(5)}% (raw ${(r.raw_net_margin * 100).toFixed(1)}%) | ${flag.padEnd(8)} | ${r.confidence_score}/100`);
}
