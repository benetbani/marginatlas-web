/**
 * scripts/data/seed_city_culture_overrides.ts
 *
 * Wave 3: layer city-level CULTURE and demographic overrides on top of
 * country baselines for global metros that meaningfully differ from
 * their country. E.g., Berlin is more open and less formal than rural
 * Germany; Shanghai is more direct and innovative than the country
 * average; Dubai is far more international than UAE.
 *
 * Each override is partial — we only set fields that genuinely differ.
 * The merge in CitySignaturePanel.resolveSignature keeps the country
 * baseline for everything else.
 *
 * Run: npx tsx scripts/data/seed_city_culture_overrides.ts
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const FILE = path.resolve(ROOT, "data/cities/city_signature_v1.json");

type Culture = {
  punctuality?: number;
  openness_to_foreigners?: number;
  innovation?: number;
  communication_directness?: number;
  corruption_rejection?: number;
  ambition_chest_beating?: number;
};
type Government = {
  tax_predictability?: number;
  low_bribery?: number;
  task_efficiency?: number;
  time_efficiency?: number;
  judicial_impartiality?: number;
};
type Override = {
  foreign_born_pct?: number;
  foreign_owned_pct?: number;
  culture?: Culture;
  government?: Government;
  notes?: string;
};

const data = JSON.parse(fs.readFileSync(FILE, "utf-8")) as {
  cities: Record<string, Record<string, unknown>>;
};

// ---------------------------------------------------------------------------
// Curated overrides for major global metros.
// Only set fields that meaningfully differ from country baseline.
// ---------------------------------------------------------------------------
const OVERRIDES: Record<string, Override> = {
  "san-francisco": {
    foreign_born_pct: 34,
    foreign_owned_pct: 22,
    culture: {
      innovation: 10, // Silicon Valley
      ambition_chest_beating: 10, // pitch culture
      openness_to_foreigners: 9,
    },
    notes: "SF / Bay Area runs hot on innovation and ambition vs US country baseline.",
  },
  "los-angeles": {
    foreign_born_pct: 37,
    foreign_owned_pct: 14,
    culture: {
      openness_to_foreigners: 9,
      ambition_chest_beating: 9,
      innovation: 8,
    },
  },
  chicago: {
    foreign_born_pct: 22,
    foreign_owned_pct: 11,
  },
  boston: {
    foreign_born_pct: 28,
    foreign_owned_pct: 16,
    culture: {
      innovation: 9, // biotech / MIT / Harvard cluster
      ambition_chest_beating: 8,
    },
  },
  miami: {
    foreign_born_pct: 58,
    foreign_owned_pct: 28,
    culture: {
      openness_to_foreigners: 10,
      punctuality: 5, // Latin-time culture leaks in
    },
    notes: "Latin-American gateway, highest foreign-born share of any US metro.",
  },
  // ---- UK / Ireland ----
  london: {
    foreign_born_pct: 40,
    foreign_owned_pct: 23,
    culture: {
      openness_to_foreigners: 9,
      innovation: 8,
      ambition_chest_beating: 7,
    },
  },
  dublin: {
    foreign_born_pct: 28,
    foreign_owned_pct: 22,
    culture: {
      innovation: 8, // tech HQs: Google, Meta, Stripe Europe
      openness_to_foreigners: 8,
    },
  },
  // ---- Continental Europe ----
  berlin: {
    foreign_born_pct: 24,
    foreign_owned_pct: 18,
    culture: {
      openness_to_foreigners: 8,
      punctuality: 7, // looser than the German country 9
      innovation: 8,
    },
    notes: "Berlin runs looser and more open than the German country baseline.",
  },
  munich: {
    foreign_born_pct: 28,
    foreign_owned_pct: 15,
    culture: {
      ambition_chest_beating: 6, // BMW / Allianz HQ pride
    },
  },
  paris: {
    foreign_born_pct: 20,
    foreign_owned_pct: 16,
    culture: {
      openness_to_foreigners: 8,
    },
  },
  amsterdam: {
    foreign_born_pct: 40,
    foreign_owned_pct: 22,
    culture: {
      communication_directness: 9, // very direct
      openness_to_foreigners: 9,
    },
  },
  barcelona: {
    foreign_born_pct: 23,
    foreign_owned_pct: 14,
    culture: {
      openness_to_foreigners: 8,
      innovation: 7,
    },
  },
  milan: {
    foreign_born_pct: 20,
    foreign_owned_pct: 14,
    culture: {
      punctuality: 7,
      ambition_chest_beating: 7, // fashion industry's chest-beating
    },
    notes: "Milan runs more punctual and ambitious than Italian country baseline.",
  },
  zurich: {
    foreign_born_pct: 32,
    foreign_owned_pct: 22,
  },
  copenhagen: {
    foreign_born_pct: 16,
    culture: {
      communication_directness: 9, // Danish bluntness
    },
  },
  // ---- Asia ----
  tokyo: {
    foreign_born_pct: 5,
    foreign_owned_pct: 7,
    culture: {
      openness_to_foreigners: 5, // a notch above country 4
    },
  },
  singapore: {
    // SG country = city-state; keep baseline.
  },
  "hong-kong": {
    // HK ships as its own country code; no city-vs-country gap.
  },
  shanghai: {
    foreign_born_pct: 5,
    foreign_owned_pct: 14,
    culture: {
      openness_to_foreigners: 6,
      innovation: 8,
      communication_directness: 5,
    },
    notes: "Shanghai is more international and direct than the Chinese country baseline.",
  },
  beijing: {
    foreign_born_pct: 3,
    foreign_owned_pct: 9,
  },
  seoul: {
    foreign_born_pct: 4,
    foreign_owned_pct: 7,
    culture: {
      ambition_chest_beating: 7, // chaebol / startup grind
      innovation: 8,
    },
  },
  bangalore: {
    foreign_born_pct: 1,
    foreign_owned_pct: 18,
    culture: {
      innovation: 8, // India's tech capital
      communication_directness: 6,
    },
    notes: "Bangalore tech-belt runs higher on innovation than rural India.",
  },
  mumbai: {
    foreign_born_pct: 1,
    foreign_owned_pct: 12,
    culture: {
      ambition_chest_beating: 7,
      communication_directness: 6,
    },
  },
  delhi: {
    foreign_born_pct: 2,
    foreign_owned_pct: 11,
  },
  bangkok: {
    foreign_born_pct: 8,
    foreign_owned_pct: 19,
    culture: {
      openness_to_foreigners: 7,
    },
  },
  "kuala-lumpur": {
    foreign_born_pct: 14,
    foreign_owned_pct: 22,
    culture: {
      openness_to_foreigners: 7,
    },
  },
  jakarta: {
    foreign_born_pct: 2,
    foreign_owned_pct: 13,
  },
  manila: {
    foreign_born_pct: 1,
    foreign_owned_pct: 14,
  },
  // ---- Middle East ----
  dubai: {
    foreign_born_pct: 88, // among the highest in the world
    foreign_owned_pct: 48,
    culture: {
      openness_to_foreigners: 9,
      innovation: 8,
      ambition_chest_beating: 8,
    },
    notes: "Dubai's foreign-born share is the global high; openness reflects expat-majority demographics.",
  },
  "abu-dhabi": {
    foreign_born_pct: 80,
    foreign_owned_pct: 38,
  },
  doha: {
    foreign_born_pct: 80,
    foreign_owned_pct: 40,
  },
  riyadh: {
    foreign_born_pct: 38,
    foreign_owned_pct: 22,
    culture: {
      openness_to_foreigners: 5, // a notch above country 4 post-Vision 2030
    },
  },
  "tel-aviv": {
    foreign_born_pct: 30,
    foreign_owned_pct: 26,
    culture: {
      innovation: 10, // Startup Nation
      communication_directness: 9,
      ambition_chest_beating: 9,
    },
    notes: "Tel Aviv runs hotter on innovation and directness than the Israeli country baseline.",
  },
  istanbul: {
    foreign_born_pct: 9,
    foreign_owned_pct: 14,
    culture: {
      openness_to_foreigners: 6,
    },
  },
  cairo: {
    foreign_born_pct: 3,
    foreign_owned_pct: 11,
  },
  // ---- Latin America ----
  "mexico-city": {
    foreign_born_pct: 2,
    foreign_owned_pct: 14,
    culture: {
      openness_to_foreigners: 7,
      innovation: 6,
    },
  },
  "sao-paulo": {
    foreign_born_pct: 3,
    foreign_owned_pct: 18,
    culture: {
      punctuality: 5, // a notch above country 4
      ambition_chest_beating: 7,
    },
  },
  "buenos-aires": {
    foreign_born_pct: 13,
    foreign_owned_pct: 14,
    culture: {
      communication_directness: 7,
    },
  },
  bogota: {
    foreign_born_pct: 1,
    foreign_owned_pct: 12,
  },
  lima: {
    foreign_born_pct: 3,
    foreign_owned_pct: 12,
  },
  santiago: {
    foreign_born_pct: 14,
    foreign_owned_pct: 18,
  },
  // ---- Africa ----
  "cape-town": {
    foreign_born_pct: 12,
    foreign_owned_pct: 17,
    culture: {
      openness_to_foreigners: 7,
    },
  },
  johannesburg: {
    foreign_born_pct: 14,
    foreign_owned_pct: 18,
  },
  nairobi: {
    foreign_born_pct: 4,
    foreign_owned_pct: 18,
    culture: {
      innovation: 6, // "Silicon Savannah"
    },
  },
  lagos: {
    foreign_born_pct: 1,
    foreign_owned_pct: 14,
    culture: {
      ambition_chest_beating: 8, // hustle culture
    },
  },
  // ---- Oceania ----
  sydney: {
    foreign_born_pct: 39,
    foreign_owned_pct: 22,
    culture: {
      openness_to_foreigners: 9,
    },
  },
  melbourne: {
    foreign_born_pct: 36,
    foreign_owned_pct: 21,
    culture: {
      openness_to_foreigners: 9,
    },
  },
  auckland: {
    foreign_born_pct: 41,
    foreign_owned_pct: 24,
    culture: {
      openness_to_foreigners: 9,
    },
  },
  // ---- North America (Canada) ----
  toronto: {
    foreign_born_pct: 47,
    foreign_owned_pct: 24,
    culture: {
      openness_to_foreigners: 10,
    },
    notes: "Toronto runs the highest foreign-born share of any major Western metro.",
  },
  vancouver: {
    foreign_born_pct: 42,
    foreign_owned_pct: 26,
    culture: {
      openness_to_foreigners: 9,
    },
  },
  montreal: {
    foreign_born_pct: 24,
    foreign_owned_pct: 18,
  },
  // ---- Europe (more) ----
  vienna: {
    foreign_born_pct: 33,
    foreign_owned_pct: 18,
  },
  lisbon: {
    foreign_born_pct: 22,
    foreign_owned_pct: 18,
    culture: {
      openness_to_foreigners: 8,
    },
  },
  madrid: {
    foreign_born_pct: 22,
    foreign_owned_pct: 14,
  },
  rome: {
    foreign_born_pct: 14,
    foreign_owned_pct: 12,
  },
  moscow: {
    foreign_born_pct: 13,
    foreign_owned_pct: 11,
  },
};

let mergedFields = 0;
let citiesUpdated = 0;

for (const [slug, override] of Object.entries(OVERRIDES)) {
  // Skip if no actual fields are set (placeholder entries).
  const hasContent =
    override.foreign_born_pct !== undefined ||
    override.foreign_owned_pct !== undefined ||
    override.culture !== undefined ||
    override.government !== undefined;
  if (!hasContent) continue;

  const existing = data.cities[slug] ?? {};
  // Merge: existing commercial_streets remains; new fields overlay.
  const merged: Record<string, unknown> = { ...existing };
  if (override.foreign_born_pct !== undefined) {
    merged.foreign_born_pct = override.foreign_born_pct;
    mergedFields++;
  }
  if (override.foreign_owned_pct !== undefined) {
    merged.foreign_owned_pct = override.foreign_owned_pct;
    mergedFields++;
  }
  if (override.culture) {
    merged.culture = { ...(existing.culture as object | undefined), ...override.culture };
    mergedFields++;
  }
  if (override.government) {
    merged.government = { ...(existing.government as object | undefined), ...override.government };
    mergedFields++;
  }
  if (override.notes) {
    merged.notes = override.notes;
  }
  data.cities[slug] = merged;
  citiesUpdated++;
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf-8");
console.log(`Updated ${citiesUpdated} cities with ${mergedFields} new override fields.`);
console.log(`Total city entries: ${Object.keys(data.cities).length}.`);
