/**
 * scripts/data/seed_ato_subindustry_splits.ts
 *
 * ATO Phase 5 — adds 20 net-new sub-industries to the taxonomy that
 * match the ATO Small Business Benchmarks A-Z resolution. Idempotent:
 * skips industries that already exist in src/lib/taxonomy/industries.json.
 *
 * Each entry has:
 *   - id, name, audience (always smb_core or smb_friendly)
 *   - examples (4-6 representative tradenames or services)
 *   - keywords (search terms)
 *   - sector_id (the parent sector this rolls up into)
 *   - parent_id (optional measured-industry parent for data fallback)
 *   - isic_divisions / naics_3 / nace_divisions (classification hooks)
 *
 * Run: npx tsx scripts/data/seed_ato_subindustry_splits.ts
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const FILE = path.resolve(ROOT, "src/lib/taxonomy/industries.json");

type Industry = {
  id: string;
  name: string;
  audience: "smb_core" | "smb_friendly" | "mixed_caution" | "corp_only";
  examples: string[];
  keywords: string[];
  sector_id: string;
  parent_id?: string;
  isic_divisions?: string[];
  naics_3?: string[];
  nace_divisions?: string[];
};

const data = JSON.parse(fs.readFileSync(FILE, "utf-8")) as {
  industries: Industry[];
};

const SPLITS: Industry[] = [
  {
    id: "bricklaying_services",
    name: "Bricklaying services",
    audience: "smb_core",
    examples: ["new-build brickwork", "boundary walls", "decorative brick", "chimneys", "tuck pointing"],
    keywords: ["bricklayer", "bricklaying", "brick mason", "masonry", "brickwork"],
    sector_id: "construction",
    parent_id: "residential_construction",
    isic_divisions: ["43"],
    naics_3: ["238"],
    nace_divisions: ["43"],
  },
  {
    id: "blocklaying_services",
    name: "Blocklaying services",
    audience: "smb_core",
    examples: ["concrete block walls", "load-bearing blockwork", "garden walls", "retaining structures"],
    keywords: ["blocklayer", "blocklaying", "concrete blocks", "masonry blocks", "block wall"],
    sector_id: "construction",
    parent_id: "residential_construction",
    isic_divisions: ["43"],
    naics_3: ["238"],
    nace_divisions: ["43"],
  },
  {
    id: "cement_rendering_services",
    name: "Cement rendering services",
    audience: "smb_core",
    examples: ["external render", "stucco finish", "acrylic render", "polished concrete"],
    keywords: ["render", "rendering", "stucco", "plaster render", "cement render"],
    sector_id: "construction",
    parent_id: "residential_construction",
    isic_divisions: ["43"],
    naics_3: ["238"],
    nace_divisions: ["43"],
  },
  {
    id: "carpet_laying_services",
    name: "Carpet laying services",
    audience: "smb_core",
    examples: ["wall-to-wall installation", "carpet tiles", "underlay fitting", "stair carpeting"],
    keywords: ["carpet", "carpet layer", "carpet fitter", "flooring carpet", "installation"],
    sector_id: "construction",
    parent_id: "flooring_installers",
    isic_divisions: ["43"],
    naics_3: ["238"],
    nace_divisions: ["43"],
  },
  {
    id: "cabinet_making",
    name: "Cabinet making",
    audience: "smb_core",
    examples: ["kitchen cabinets", "bespoke joinery", "built-in wardrobes", "office millwork"],
    keywords: ["cabinet", "cabinetmaker", "joinery", "millwork", "carpentry custom"],
    sector_id: "manufacturing_artisan",
    isic_divisions: ["16", "31"],
    naics_3: ["337"],
    nace_divisions: ["31"],
  },
  {
    id: "chicken_shops",
    name: "Chicken shops",
    audience: "smb_core",
    examples: ["fried chicken takeaways", "rotisserie chicken", "wings shops", "halal chicken counters"],
    keywords: ["chicken shop", "fried chicken", "rotisserie", "takeaway chicken", "wings"],
    sector_id: "food_drink",
    parent_id: "restaurants",
    isic_divisions: ["56"],
    naics_3: ["722"],
    nace_divisions: ["56"],
  },
  {
    id: "cake_shops_patisseries",
    name: "Cake shops & patisseries",
    audience: "smb_core",
    examples: ["wedding cakes", "macarons", "tarts and entremets", "celebration cakes"],
    keywords: ["cake", "patisserie", "patissier", "pastry shop", "wedding cake", "dessert shop"],
    sector_id: "food_drink",
    parent_id: "restaurants",
    isic_divisions: ["10", "56"],
    naics_3: ["311", "722"],
    nace_divisions: ["10"],
  },
  {
    id: "alarm_systems_install",
    name: "Alarm systems install",
    audience: "smb_core",
    examples: ["intruder alarms", "fire alarms", "CCTV", "monitored security"],
    keywords: ["alarm", "security install", "fire alarm", "burglar alarm", "CCTV", "monitoring"],
    sector_id: "trades_home",
    parent_id: "residential_construction",
    isic_divisions: ["43", "80"],
    naics_3: ["238", "561"],
    nace_divisions: ["43", "80"],
  },
  {
    id: "cleaning_building_industrial",
    name: "Cleaning: building & industrial",
    audience: "smb_core",
    examples: ["office contract cleaning", "warehouse cleaning", "post-construction clean", "industrial facility"],
    keywords: ["cleaning contractor", "office cleaning", "industrial cleaning", "janitorial", "B2B cleaning"],
    sector_id: "repair",
    isic_divisions: ["81"],
    naics_3: ["561"],
    nace_divisions: ["81"],
  },
  {
    id: "cleaning_carpet_upholstery",
    name: "Cleaning: carpet & upholstery",
    audience: "smb_core",
    examples: ["carpet deep clean", "sofa cleaning", "rug shampoo", "stain removal"],
    keywords: ["carpet cleaning", "upholstery cleaning", "rug clean", "steam clean", "stain removal"],
    sector_id: "repair",
    isic_divisions: ["81"],
    naics_3: ["561"],
    nace_divisions: ["81"],
  },
  {
    id: "automotive_electrical_services",
    name: "Automotive electrical services",
    audience: "smb_core",
    examples: ["auto electrician", "vehicle wiring", "starter motors", "alternators", "diagnostic"],
    keywords: ["auto electrical", "auto electrician", "car electrics", "vehicle wiring", "auto diagnostic"],
    sector_id: "repair",
    parent_id: "auto_repair_shops",
    isic_divisions: ["45"],
    naics_3: ["811"],
    nace_divisions: ["45"],
  },
  {
    id: "air_conditioning_refrigeration",
    name: "Air conditioning & refrigeration",
    audience: "smb_core",
    examples: ["HVAC install", "split-system air-con", "commercial refrigeration", "heat pumps"],
    keywords: ["HVAC", "air conditioning", "refrigeration", "heat pump", "AC install", "cooling"],
    sector_id: "trades_home",
    parent_id: "residential_construction",
    isic_divisions: ["43"],
    naics_3: ["238"],
    nace_divisions: ["43"],
  },
  {
    id: "carpentry_services",
    name: "Carpentry services",
    audience: "smb_core",
    examples: ["framing carpenter", "finish carpentry", "trim work", "deck building", "interior fitouts"],
    keywords: ["carpenter", "carpentry", "framing", "joinery", "finish carpenter"],
    sector_id: "construction",
    parent_id: "residential_construction",
    isic_divisions: ["43"],
    naics_3: ["238"],
    nace_divisions: ["43"],
  },
  {
    id: "book_retailing",
    name: "Book retailing",
    audience: "smb_friendly",
    examples: ["independent bookshops", "academic booksellers", "rare book dealers", "new release retail"],
    keywords: ["bookshop", "bookstore", "book retail", "independent bookseller", "books"],
    sector_id: "retail_shops",
    isic_divisions: ["47"],
    naics_3: ["451"],
    nace_divisions: ["47"],
  },
  {
    id: "plumbing_services",
    name: "Plumbing services",
    audience: "smb_core",
    examples: ["domestic plumbing", "drain clearance", "gas fitting", "boiler install", "bathroom fitting"],
    keywords: ["plumber", "plumbing", "drain", "gas fitter", "boiler", "pipe"],
    sector_id: "trades_home",
    parent_id: "residential_construction",
    isic_divisions: ["43"],
    naics_3: ["238"],
    nace_divisions: ["43"],
  },
  {
    id: "roofing_services",
    name: "Roofing services",
    audience: "smb_core",
    examples: ["roof replacement", "leak repair", "slate and tile", "flat roof", "gutters"],
    keywords: ["roofer", "roofing", "roof repair", "shingles", "tiles", "gutters"],
    sector_id: "construction",
    parent_id: "residential_construction",
    isic_divisions: ["43"],
    naics_3: ["238"],
    nace_divisions: ["43"],
  },
  {
    id: "tiling_services",
    name: "Tiling services",
    audience: "smb_core",
    examples: ["bathroom tiling", "kitchen splashbacks", "floor tile", "porcelain", "natural stone"],
    keywords: ["tiler", "tiling", "tile install", "ceramic", "porcelain", "stone tile"],
    sector_id: "construction",
    parent_id: "residential_construction",
    isic_divisions: ["43"],
    naics_3: ["238"],
    nace_divisions: ["43"],
  },
  {
    id: "plastering_services",
    name: "Plastering services",
    audience: "smb_core",
    examples: ["wall plastering", "ceiling plastering", "skim coat", "patch repair", "decorative cornice"],
    keywords: ["plasterer", "plastering", "plaster", "drywall", "skim"],
    sector_id: "construction",
    parent_id: "residential_construction",
    isic_divisions: ["43"],
    naics_3: ["238"],
    nace_divisions: ["43"],
  },
  {
    id: "landscaping_services",
    name: "Landscaping services",
    audience: "smb_core",
    examples: ["garden design", "lawn care", "tree work", "paving", "irrigation"],
    keywords: ["landscaper", "landscaping", "garden", "lawn", "tree surgery", "paving"],
    sector_id: "trades_home",
    parent_id: "residential_construction",
    isic_divisions: ["81"],
    naics_3: ["561"],
    nace_divisions: ["81"],
  },
  {
    id: "painting_services",
    name: "Painting services",
    audience: "smb_core",
    examples: ["interior painting", "exterior painting", "wallpaper", "spray finishing", "decorative work"],
    keywords: ["painter", "painting", "decorator", "wallpaper", "paint contractor"],
    sector_id: "construction",
    parent_id: "residential_construction",
    isic_divisions: ["43"],
    naics_3: ["238"],
    nace_divisions: ["43"],
  },
];

let added = 0;
let skipped = 0;
const existing = new Set(data.industries.map((i) => i.id));

for (const sub of SPLITS) {
  if (existing.has(sub.id)) {
    skipped++;
    continue;
  }
  data.industries.push(sub);
  added++;
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf-8");
console.log(`Added ${added} sub-industries. Skipped ${skipped} that already existed.`);
console.log(`Total industries now: ${data.industries.length}.`);
