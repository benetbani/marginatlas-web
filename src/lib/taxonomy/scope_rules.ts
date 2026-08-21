/**
 * src/lib/taxonomy/scope_rules.ts
 *
 * THE SINGLE ANSWER to "does this business belong on this site".
 *
 * Founder ruling, 2026-08-21: "we hunt for businesses that can be seen on the
 * street, and you slap grain farming, all farming is not allowed, banking,
 * financial trading, factories, etc. If a business needs 30m to open, we don't
 * put it on our site, because it is pointless to go with commercial centres and
 * huge real estate developing in this site." Plus, in the same message:
 * management consulting is out ("we do not calculate Deloitte and McKinsey
 * revenue here wtf"), and hospitals and high schools are out ("nobody thinks of
 * opening a school randomly").
 *
 * FOUR TESTS. An activity stays only if it passes all four.
 *
 *   street          a passer-by can see the premises from a public street
 *   owner           one person can plausibly own and run it
 *   capital         it can open for under 30 million USD, his stated ceiling
 *   local-customer  its customers are identifiable local people or businesses,
 *                   not a national balance sheet or a global supply chain
 *
 * WHY FOUR AND NOT ONE, because the ceiling on its own does almost nothing.
 * A bank branch, a wholesale depot and a small plastics plant all open for far
 * less than 30 million. The local-customer test is what actually removes those,
 * and the street and owner tests are what remove hospitals and schools. Each
 * rejection therefore records WHICH tests it failed, so the list can be argued
 * with rather than merely obeyed.
 *
 * THIS FILE IS A LIST, AND THAT IS DELIBERATE. A classifier inferring scope from
 * a name would be wrong in both directions and unarguable when it was: "Custom
 * furniture makers" and "Furniture manufacturing" differ by one word and fall on
 * opposite sides. An explicit list is auditable, and the founder can read it and
 * point at a line. Keyword matching on a slug is also precisely how four wage
 * tables came to serve twenty trades, which is one of the defects this whole
 * effort exists to remove.
 *
 * WHAT THIS FILE DOES NOT DO. It does not delete anything. Retiring an activity
 * is src/lib/taxonomy/retired.ts, and a retired slug keeps existing and answers
 * 301, because a 404 throws away whatever search authority the page had and adds
 * a crawl error on top. The founder named SEO as his fear, and it is a real one.
 */

export type ScopeTest = "street" | "owner" | "capital" | "local-customer";

export interface ScopeInput {
  id: string;
  name: string;
  sector_id: string;
}

export interface ScopeVerdict {
  inScope: boolean;
  /** Which of the four tests this activity failed. Empty when in scope. */
  failed: ScopeTest[];
}

/**
 * Whole sectors where every member fails. Each is one of the categories the
 * founder named, and each is emptied completely rather than member by member,
 * because a sector that keeps one survivor keeps a nav entry and a listing row.
 */
const OUT_OF_SCOPE_SECTORS: Record<string, ScopeTest[]> = {
  /* "banking, financial trading" */
  finance_corp: ["street", "owner", "local-customer"],
  /* "factories" */
  heavy_industry: ["street", "owner", "capital", "local-customer"],
  /* "full blown hospitals and high schools, it just gets too much out of scope" */
  higher_ed_hospitals: ["owner", "capital"],
  mining_energy: ["street", "owner", "capital", "local-customer"],
  telecom_broadcasting: ["street", "owner", "capital", "local-customer"],
};

/**
 * Activities that fail even though their sector survives. Keyed by NAME rather
 * than id: a name is what a human reads when auditing this list, and the gate
 * asserts every key here matches a real activity, so a rename cannot leave a
 * dead rule behind pretending to be coverage.
 */
const OUT_OF_SCOPE_NAMES: Record<string, ScopeTest[]> = {
  /* ALL FARMING, his words. Commodity output, no walk-in customer, and the
     premises are not on a street. */
  "Grain farming": ["street", "local-customer"],
  "Vegetable & fruit farming": ["street", "local-customer"],
  "Livestock farming": ["street", "local-customer"],
  "Fishing & aquaculture": ["street", "local-customer"],
  "Forestry & logging": ["street", "local-customer"],

  /* PRODUCTION AT SCALE. The retail bakery, the coffee roaster and the craft
     brewery with a taproom all survive, because a customer walks into them. The
     plant that supplies them does not. This is the line the "Cabinet making
     stays, primary metal goes" test in the gate is guarding. */
  "Food manufacturing": ["street", "local-customer"],
  "Beverage manufacturing": ["street", "local-customer"],
  "Specialty food production": ["street", "local-customer"],
  "Artisan bakery (wholesale)": ["street", "local-customer"],
  "Textiles & fabric manufacturing": ["street", "local-customer"],
  "Apparel manufacturing": ["street", "local-customer"],
  "Wood products manufacturing": ["street", "local-customer"],
  "Paper & printing manufacturing": ["street", "local-customer"],
  "Plastics & rubber products": ["street", "local-customer"],
  "Fabricated metal manufacturing": ["street", "local-customer"],
  "Primary metal manufacturing": ["street", "capital", "local-customer"],
  "Electrical equipment": ["street", "local-customer"],
  "Furniture manufacturing": ["street", "local-customer"],
  "Miscellaneous manufacturing": ["street", "local-customer"],

  /* WHOLESALE. No walk-in customer, by definition of the word. */
  "Wholesale food & beverages": ["street", "local-customer"],
  "Wholesale durable goods": ["street", "local-customer"],
  "General wholesale": ["street", "local-customer"],
  "Wholesale chemicals & pharma": ["street", "local-customer"],

  /* DEVELOPMENT SCALE. "it is pointless to go with commercial centres and huge
     real estate developing in this site." The thirteen building trades beneath
     these survive untouched: a plasterer and a roofer are exactly the kind of
     business this atlas is for. */
  "Residential construction": ["street", "capital"],
  "Commercial construction": ["street", "capital"],
  "Civil engineering": ["street", "capital"],
  "Real estate leasing": ["street", "capital"],

  /* SCHOOLS NOBODY OPENS ON A WHIM. Tutoring centres, language schools, driving
     schools, music teachers, martial arts dojos and daycare all stay: those are
     opened by one person, on a street, for local customers. */
  "Primary & secondary schools": ["owner", "capital"],
  "Private K-12 schools (small)": ["owner", "capital"],

  /* CONSULTING AT A SCALE THIS ATLAS CANNOT MODEL. The sole-practitioner
     accountant and the high-street solicitor stay; they have a door. */
  "Management consulting": ["street", "local-customer"],

  /* TRANSPORT AT NETWORK SCALE. Couriers and sightseeing operators survive. */
  "Trucking & freight": ["street", "local-customer"],
  "Transit & ground passenger transport": ["street", "owner", "capital"],
  "Transport support services": ["street", "local-customer"],
  "Warehousing & storage": ["street", "local-customer"],
  "Postal service": ["owner", "capital", "local-customer"],
  "Air transportation carriers": ["street", "owner", "capital", "local-customer"],
  "Rail transportation": ["street", "owner", "capital", "local-customer"],
  "Water transportation": ["street", "owner", "capital", "local-customer"],
  "Pipeline transportation": ["street", "owner", "capital", "local-customer"],

  /* MUNICIPAL SCALE. */
  "Water & waste management": ["street", "owner", "capital"],

  /* SELLS TO NOBODY WHO WALKS PAST IT. */
  "E-commerce & mail-order": ["street"],
};

export function isInScope(a: ScopeInput): ScopeVerdict {
  const bySector = OUT_OF_SCOPE_SECTORS[a.sector_id];
  if (bySector) return { inScope: false, failed: bySector };

  const byName = OUT_OF_SCOPE_NAMES[a.name];
  if (byName) return { inScope: false, failed: byName };

  return { inScope: true, failed: [] };
}

/** Every activity name this module rejects. Used by the gate to prove no rule is dead. */
export function rejectedNames(): string[] {
  return Object.keys(OUT_OF_SCOPE_NAMES);
}

/** Every sector id this module rejects wholesale. Used by the gate the same way. */
export function rejectedSectors(): string[] {
  return Object.keys(OUT_OF_SCOPE_SECTORS);
}
