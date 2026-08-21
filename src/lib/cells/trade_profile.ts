/**
 * src/lib/cells/trade_profile.ts
 *
 * Which of the specialised sections a given trade gets, and in what order.
 *
 * Founder, 2026-08-21: "other custom sections for different businesses to give
 * the site that specialized feeling."
 *
 * WHY THIS EXISTS AT ALL, and it is the point of the whole phase. Without
 * something that decides per trade, every page gets every section and the
 * specialisation is a costume. A tipping section on an accountancy practice, a
 * pavement-licence section on a mobile locksmith and a "three most-sold items"
 * table on a funeral director are all worse than nothing: they say the site
 * does not know what this business is.
 *
 * AND IT IS THE DEFECT THAT STARTED THIS WHOLE EFFORT, GENERALISED. Eight cards
 * all read "Easy" because the section's shape was fixed and its content was
 * made to fit. A section that appears on every trade regardless of relevance is
 * the same mistake one level up: the page's shape fixed, the trades made to fit
 * it.
 *
 * AN EXPLICIT MAP, NOT A KEYWORD MATCH ON THE SLUG. Keyword matching is exactly
 * how four hardcoded wage tables came to serve twenty trades, printing the same
 * chef, server and porter pay for every cafe, bar, bakery and restaurant on
 * earth. A slug is a URL, not a description of a business. This file is a list
 * so it can be read and argued with, and so a wrong line is one line.
 *
 * THE DEFAULT IS DELIBERATELY THIN. A trade nobody has profiled gets only the
 * sections that are true of every business anywhere: what it costs to set up,
 * whether you can hire, how skilled they need to be, and what goes wrong. Rule
 * 21, the universality test: if a section breaks for Kinshasa, Dhaka, Tirana
 * or La Paz, it is wrong. Those four survive everywhere.
 */

export type TradeSectionId =
  /** The shape of the business: people, vehicles, kit. Not its accounts. */
  | "typical-setup"
  /** The three most-sold items, with local prices. */
  | "what-things-cost"
  /** Whether tipping is expected here, and roughly what share. */
  | "tipping"
  /** What a table, an A-board or a terrace costs per year. */
  | "public-space"
  /** Can you find people for this trade in this place. */
  | "can-you-hire"
  /** How skilled they need to be, on a deliberately simple four-step read. */
  | "skill-level"
  /** Who walks in: money, whether they live here, and age. */
  | "who-walks-in"
  /** Burglary, being sued, being fined, beside the trade's own risks. */
  | "what-goes-wrong"
  /** Reduced contributions, sector schemes, special zones. */
  | "deals-and-regimes"
  /** Incidence of corruption among local officials. */
  | "town-hall";

export interface TradeProfile {
  /** In render order. */
  sections: TradeSectionId[];
  /**
   * The three things this trade sells most of, as a reader would name them.
   * Empty when the trade does not sell countable items, which is why the
   * "what things cost" section is absent for those trades rather than empty.
   */
  topItems: string[];
  /**
   * True where a licence is not paperwork but the gate on trading at all:
   * medical, childcare, food, alcohol, firearms. Founder: "Licenses for
   * businesses that require them should be higher in the page especially
   * medical, daycare, etc."
   */
  licenceCritical: boolean;
}

/** True of every business anywhere. The universality floor. */
const UNIVERSAL: TradeSectionId[] = [
  "typical-setup",
  "can-you-hire",
  "skill-level",
  "what-goes-wrong",
];

/** A business with a counter, a street frontage and countable sales. */
const STREET_RETAIL: TradeSectionId[] = [
  "typical-setup",
  "what-things-cost",
  "who-walks-in",
  "can-you-hire",
  "skill-level",
  "what-goes-wrong",
];

/** Hospitality: everything retail has, plus tipping and the pavement. */
const HOSPITALITY: TradeSectionId[] = [
  "typical-setup",
  "what-things-cost",
  "tipping",
  "public-space",
  "who-walks-in",
  "can-you-hire",
  "skill-level",
  "what-goes-wrong",
];

/** A trade that travels to the customer: no frontage, no walk-in, no tipping. */
const MOBILE_TRADE: TradeSectionId[] = [
  "typical-setup",
  "what-things-cost",
  "can-you-hire",
  "skill-level",
  "what-goes-wrong",
];

/** Licensed practice: the licence gates trading, and skill is the product. */
const LICENSED_PRACTICE: TradeSectionId[] = [
  "typical-setup",
  "what-things-cost",
  "who-walks-in",
  "can-you-hire",
  "skill-level",
  "what-goes-wrong",
  "deals-and-regimes",
];

interface Entry {
  sections: TradeSectionId[];
  topItems: string[];
  licenceCritical: boolean;
}

/**
 * Profiled trades. Deliberately starts with the founder's own fixed example set
 * (rulebook rule 32: restaurant, grocery, pharmacy, salon, gym, auto repair,
 * cafe, bar) plus the two he named for licences, and grows one considered line
 * at a time rather than by pattern.
 */
const PROFILES: Record<string, Entry> = {
  restaurants: {
    sections: HOSPITALITY,
    topItems: ["Main course", "Glass of wine", "Dessert"],
    licenceCritical: true,
  },
  cafes_coffee: {
    sections: HOSPITALITY,
    topItems: ["Flat white", "Filter coffee", "Pastry"],
    licenceCritical: true,
  },
  bars_nightclubs: {
    sections: HOSPITALITY,
    topItems: ["Pint of lager", "Spirit and mixer", "Glass of wine"],
    licenceCritical: true,
  },
  pubs_taverns: {
    sections: HOSPITALITY,
    topItems: ["Pint of lager", "Sunday roast", "Glass of wine"],
    licenceCritical: true,
  },
  bakeries_retail: {
    sections: HOSPITALITY,
    topItems: ["Loaf of bread", "Croissant", "Birthday cake"],
    licenceCritical: true,
  },

  /* The founder's own worked example of a per-trade price list: "haircut,
     beard trimming, face mask". */
  barbershops: {
    sections: STREET_RETAIL,
    topItems: ["Haircut", "Beard trim", "Hot towel shave"],
    licenceCritical: false,
  },
  hairdressers_beauty: {
    sections: STREET_RETAIL,
    topItems: ["Cut and blow dry", "Colour", "Treatment"],
    licenceCritical: false,
  },

  grocery_stores: {
    sections: STREET_RETAIL,
    topItems: ["Basket of groceries", "Bread", "Milk"],
    licenceCritical: true,
  },
  health_beauty_stores: {
    sections: LICENSED_PRACTICE,
    topItems: ["Prescription dispensed", "Over-the-counter remedy", "Skincare"],
    licenceCritical: true,
  },

  auto_repair_shops: {
    sections: STREET_RETAIL,
    topItems: ["Annual service", "Brake replacement", "Diagnostic check"],
    licenceCritical: false,
  },
  sports_fitness: {
    sections: STREET_RETAIL,
    topItems: ["Monthly membership", "Day pass", "Personal training hour"],
    licenceCritical: false,
  },

  /* His two named licence-critical examples. */
  dental_practices: {
    sections: LICENSED_PRACTICE,
    topItems: ["Check-up", "Filling", "Hygienist visit"],
    licenceCritical: true,
  },
  daycare_preschool: {
    sections: LICENSED_PRACTICE,
    topItems: ["Full day", "Half day", "After-school hour"],
    licenceCritical: true,
  },

  /* Trades that travel to the customer. No frontage, so no pavement licence,
     no walk-in profile and no tipping section. This is the shape that proves
     the mechanism does something: a plumber's page is genuinely different. */
  plumbers: {
    sections: MOBILE_TRADE,
    topItems: ["Call-out", "Boiler service", "Bathroom install"],
    licenceCritical: true,
  },
  electricians: {
    sections: MOBILE_TRADE,
    topItems: ["Call-out", "Consumer unit swap", "Full rewire"],
    licenceCritical: true,
  },
  hvac_services: {
    sections: MOBILE_TRADE,
    topItems: ["Annual service", "Install", "Emergency repair"],
    licenceCritical: true,
  },
  cleaning_services: {
    sections: MOBILE_TRADE,
    topItems: ["Regular weekly clean", "Deep clean", "End of tenancy"],
    licenceCritical: false,
  },

  /* No countable item list on purpose: an accountant sells hours and
     engagements, not products, so the price section is absent rather than
     filled with something invented. */
  accounting_tax: {
    sections: [...UNIVERSAL, "deals-and-regimes"],
    topItems: [],
    licenceCritical: false,
  },
  legal_services: {
    sections: [...UNIVERSAL, "deals-and-regimes"],
    topItems: [],
    licenceCritical: true,
  },
};

const DEFAULT_PROFILE: TradeProfile = {
  sections: UNIVERSAL,
  topItems: [],
  licenceCritical: false,
};

/** The specialised sections this trade gets. Never throws; unprofiled trades get the thin default. */
export function profileFor(activityId: string): TradeProfile {
  const e = PROFILES[activityId];
  if (!e) return DEFAULT_PROFILE;
  return { sections: e.sections, topItems: e.topItems, licenceCritical: e.licenceCritical };
}

/** Does this trade show that section. */
export function hasSection(activityId: string, id: TradeSectionId): boolean {
  return profileFor(activityId).sections.includes(id);
}

/** Every trade with a hand-written profile, for the gate. */
export function profiledTrades(): string[] {
  return Object.keys(PROFILES);
}
