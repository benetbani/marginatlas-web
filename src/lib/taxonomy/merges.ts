/**
 * src/lib/taxonomy/merges.ts
 *
 * Over-split activities, collapsed onto one survivor each.
 *
 * Founder ruling, 2026-08-21: "the types of businesses is too much, you have
 * done a mistake because you have categorized a lot as different activities
 * when in fact we don't need that much. For example lingerie & intimates fall
 * in the category of clothing. The issue is long term SEO/AEO, that scares me
 * because of the merging nature of this concept. Right now the scroll on
 * business list is toooo much."
 *
 * THE JUDGEMENT RULE, stated once so every line below can be argued with:
 *
 *   Collapse when the two would produce THE SAME PAGE , the same cost
 *   structure, the same staffing, the same margins, the same advice. Keep them
 *   apart when the economics genuinely differ, even if the names look similar.
 *
 * That is why a wine bar folds into bars and a PUB does not: a wine bar is a
 * bar with a narrower list, while a pub is food-led, licensed differently, and
 * frequently a freehold rather than a lease. It is also why "sit-down" and
 * "fast-casual" restaurants fold into restaurants (they are service styles, not
 * businesses) while a pizzeria stays (an oven and a dough process are a
 * different capital and labour shape).
 *
 * CHOOSING THE SURVIVOR: keep the id a person would type and a search engine
 * already knows, and NEVER invent a new one. A new id is a new URL, and the
 * founder named search as his specific fear about this change. Where a name is
 * ugly but established, the established one still wins.
 *
 * NOTHING IS DELETED. Every merged slug keeps answering, with a 308 to its
 * survivor's page. scripts/gen_retired.ts folds this map into
 * src/lib/taxonomy/retired.ts so there is one redirect table, not two.
 */

/** Merged activity id, mapped to the id that survives. */
export const MERGES: Record<string, string> = {
  /* ---------------------------------------------------------------------
     1. LITERAL DUPLICATES. The same trade, entered twice, sometimes under
     two different sectors. These are unarguable and they were visible on
     the rendered directory page: Plumbers sat directly above Plumbing
     services, and Landscaping & lawn care above Landscaping services.
     --------------------------------------------------------------------- */
  plumbing_services: "plumbers",
  landscaping_services: "landscaping_lawn",
  roofing_services: "roofers",
  painting_services: "painters_residential",
  carpentry_services: "carpenters_finish",
  book_retailing: "bookstores_indie",
  small_museums: "museums_cultural",
  air_conditioning_refrigeration: "hvac_services",
  hair_salons_full: "hairdressers_beauty",
  /* Childcare appeared twice across two sectors: as a health service and as
     an education service. It is one business. */
  childcare_social: "daycare_preschool",
  /* Both are the vague catch-all for "a trade not otherwise listed", one per
     sector. Two catch-alls is one too many. */
  specialty_construction: "specialty_trades",
  /* Breweries appeared twice, once under food and drink and once under food
     production. The taproom is the street business, so the survivor is the
     one whose slug does not carry a "(retail)" qualifier. */
  breweries_taprooms: "craft_beer_mfg",

  /* ---------------------------------------------------------------------
     2. CLOTHING. The founder's own example, and the worst case on the page:
     eight ways to sell clothes. The survivor is already named "Clothing &
     shoe stores", which is why shoe shops fold in too.
     --------------------------------------------------------------------- */
  lingerie_intimates: "clothing_stores", // his example, verbatim
  boutique_clothing: "clothing_stores",
  streetwear_casual: "clothing_stores",
  designer_fashion: "clothing_stores",
  childrens_clothing: "clothing_stores",
  vintage_consignment: "clothing_stores",
  shoe_stores: "clothing_stores",

  /* ---------------------------------------------------------------------
     3. RESTAURANTS. Five entries for one trade. "Sit-down" and "fast-casual"
     are service styles rather than businesses; a chicken shop is a small
     fast-food restaurant. PIZZERIAS STAY: an oven, a dough process and the
     capital that goes with them are a genuinely different shape.
     --------------------------------------------------------------------- */
  sit_down_restaurants: "restaurants",
  fast_casual: "restaurants",
  chicken_shops: "restaurants",

  /* ---------------------------------------------------------------------
     4. BAKERY AND DESSERT. Three shopfronts selling baked goods over a
     counter. ICE CREAM STAYS: different equipment, and a season rather than
     a week.
     --------------------------------------------------------------------- */
  cake_shops_patisseries: "bakeries_retail",
  pastry_dessert: "bakeries_retail",

  /* ---------------------------------------------------------------------
     5. BARS. A wine bar is a bar with a narrower list. A PUB IS NOT: it is
     food-led, licensed differently, and often freehold rather than leased,
     and it is one of the highest-volume searches in the flagship market.
     --------------------------------------------------------------------- */
  wine_bars: "bars_nightclubs",

  /* ---------------------------------------------------------------------
     6. LODGING. A bed and breakfast and a guest house are the same business
     under two names. An independent hotel is a hotel.
     --------------------------------------------------------------------- */
  bnbs: "guest_houses",
  independent_hotels: "hotels_lodging",

  /* ---------------------------------------------------------------------
     7. PROFESSIONAL. A sole practitioner is not a different trade from the
     practice; it is the smallest size band of it, which this atlas already
     models as a size band rather than as an activity.
     --------------------------------------------------------------------- */
  sole_law_firms: "legal_services",
  sole_accounting: "accounting_tax",

  /* ---------------------------------------------------------------------
     8. SOFTWARE AND IT. Five entries across two sectors for what a reader
     would call two businesses: people who build software, and people who
     run your computers.
     --------------------------------------------------------------------- */
  web_mobile_dev_shops: "software_development",
  custom_software_contract: "software_development",
  it_services_msp: "it_services_hosting",

  /* ---------------------------------------------------------------------
     9. THE BUILDING TRADES, which were entered once under Construction and
     again under Trades. Blocklaying is bricklaying with a different block;
     rendering is external plastering; carpet laying is floor laying.
     --------------------------------------------------------------------- */
  blocklaying_services: "bricklaying_services",
  cement_rendering_services: "plastering_services",
  carpet_laying_services: "flooring_installers",

  /* ---------------------------------------------------------------------
     10. CLEANING. Four entries. The customer differs (a home, an office, a
     carpet) but the business does not: the same van, the same staff, the
     same margins.
     --------------------------------------------------------------------- */
  residential_cleaning: "cleaning_services",
  cleaning_building_industrial: "cleaning_services",
  cleaning_carpet_upholstery: "cleaning_services",

  /* ---------------------------------------------------------------------
     11. THE REST, one line of reasoning each.
     --------------------------------------------------------------------- */
  /* A watch shop is a jeweller that specialises. Watch AND JEWELRY REPAIR
     stays separate: repair is a workshop trade, not a retail one. */
  watch_shops: "jewelry_stores",
  /* An independent pharmacy is the independent case of the pharmacy trade,
     which is a size band rather than an activity. */
  independent_pharmacy: "health_beauty_stores",
  /* A med spa is a day spa with a nurse. MASSAGE THERAPY STAYS: clinical,
     often insurance-adjacent, different room and different licence. */
  med_spas: "day_spas",
  /* Auto electrics is a bay inside a garage, not a separate garage. */
  automotive_electrical_services: "auto_repair_shops",
  /* Test prep is what a tutoring centre sells in the spring. */
  test_prep: "tutoring_centers",
  /* Almost always the same operator, the same kit and the same client. */
  videography_services: "photography_studios",
  /* Builders' merchants and hardware shops overlap almost completely at the
     scale this atlas covers. GARDEN CENTRES STAY: seasonal, land-hungry,
     and a genuinely different business. */
  building_garden_stores: "hardware_stores",
  /* A private archive open to the public is a small museum. */
  private_libraries_archives: "museums_cultural",
};

/** The surviving id for an activity, or the id itself when it survives. */
export function survivorOf(id: string): string {
  return MERGES[id] ?? id;
}

/** True when this activity was merged away. */
export function isMerged(id: string): boolean {
  return id in MERGES;
}
