/**
 * City character data layer (Plan v32 Sprint G).
 *
 * Hand-curated editorial copy for cities, with structured fields that
 * city pages and neighborhood pages render selectively. Self-suppresses
 * when a city has no entry (most cities won't have one in v1).
 *
 * Editorial brief: each city entry should read like a knowledgeable
 * friend explaining the local economy to a stranger. Specific over
 * abstract. Names of actual neighborhoods, actual industries, actual
 * sources of small-business friction. No "diverse and dynamic
 * cosmopolitan hub" cliches.
 *
 * Coverage in v1: 15 cities (NYC, LA, Chicago, London, Paris, Berlin,
 * Tokyo, Madrid, Rome, Milan, Mexico City, Dubai, Singapore, Zurich,
 * Istanbul). Expansion happens one city at a time when there's a
 * specific reason to deepen one.
 *
 * Render: see src/components/sections/CityCharacter.tsx.
 */

export type NeighborhoodArchetype = {
  /** Short name. */
  name: string;
  /** One-line character note: who lives there, what businesses thrive. */
  blurb: string;
  /** Industries that genuinely cluster here (slugs from taxonomy). */
  defining_industries?: string[];
};

export type CityCharacter = {
  /** Match on regional_cells.geo_id (e.g. "US-CITY-new-york"). */
  geo_id: string;
  /** Display name for headers. */
  display_name: string;
  /** Country ISO2, used to filter / sort. */
  country_iso2: string;
  /**
   * One paragraph (3-5 sentences) describing the city's economic
   * identity. Should read aloud well; specific over abstract.
   */
  economic_identity: string;
  /**
   * 3-5 industries that genuinely define this city's small-business
   * economy. Industry IDs from the taxonomy.
   */
  defining_industries: string[];
  /**
   * 2-4 sentences on what is unusually expensive / unusually cheap
   * about doing business here compared to the country average.
   */
  cost_quirks: string;
  /**
   * One sentence on who the typical small-business owner here looks
   * like (demographic + prior path).
   */
  owner_archetype: string;
  /**
   * Neighborhood-level character notes for the most distinctive
   * 4-8 areas. Renders on the city overview page as a strip; each
   * also serves as the lede paragraph on the corresponding
   * neighborhood overview page.
   */
  neighborhoods?: NeighborhoodArchetype[];
  /**
   * One thing about doing business here that visitors don't expect.
   * Optional but high-value.
   */
  surprise?: string;
};

export const CITY_CHARACTERS: CityCharacter[] = [
  {
    geo_id: "US-CITY-new-york",
    display_name: "New York",
    country_iso2: "US",
    economic_identity:
      "New York's small-business economy is two parallel cities. Manhattan below 96th Street runs on rent, every storefront pays the highest rent per square foot in the United States, and businesses that survive there are either premium-margin or have a hidden second-floor / basement footprint. The outer boroughs run on density, Queens and Brooklyn small businesses serve neighborhood populations larger than mid-sized US cities, with much more forgiving economics.",
    defining_industries: [
      "restaurants",
      "legal_services",
      "real_estate_agencies",
      "hairdressers_beauty",
      "clothing_stores",
    ],
    cost_quirks:
      "Rent is the dominant cost above all others, easily 15-20% of revenue in Manhattan retail, vs the 6-8% US national average. Payroll is high (NY minimum wage + tipped-worker rules + healthcare mandates). Liquor licenses run $5K-$25K in fees plus 6-12 months of waiting. Compensating factors: revenue per location is 2-3x the national average, foot traffic is constant, and access to capital is the deepest in the US.",
    owner_archetype:
      "Often an immigrant or first-generation owner with prior industry experience; or a finance / tech alum pivoting into hospitality with savings to absorb a 2-3 year ramp.",
    neighborhoods: [
      {
        name: "Manhattan (Midtown / Financial District)",
        blurb:
          "Office-worker lunch crowd dominates weekdays; ghost town after 7pm and on weekends. Quick-service formats, dry cleaners, fitness studios thrive; full-service restaurants struggle with the weekend gap.",
        defining_industries: ["restaurants", "fitness_gyms"],
      },
      {
        name: "Brooklyn (Williamsburg / Park Slope)",
        blurb:
          "Resident-driven local economy. Independent restaurants, bookstores, baby boutiques, specialty grocers. Lower rent than Manhattan, longer customer dwell, higher Yelp / Instagram dependency.",
        defining_industries: ["restaurants", "cafes_coffee", "clothing_stores"],
      },
      {
        name: "Queens (Astoria / Flushing / Jackson Heights)",
        blurb:
          "Most ethnically distinct small-business economies in the city. Each neighborhood functions as a specialty district, Greek tavernas, Chinese supermarkets, South Asian gold dealers, Colombian bakeries.",
        defining_industries: ["restaurants", "grocery_stores"],
      },
      {
        name: "Bronx",
        blurb:
          "Strong neighborhood-services and quick-service food economy; below-average per-capita disposable income but high cash-flow velocity. Bodegas, barber shops, auto repair anchor most commercial corridors.",
        defining_industries: ["grocery_stores", "barbershops", "auto_repair_shops"],
      },
    ],
    surprise:
      "NYC's storefront vacancy rate in Manhattan is higher than the national average, despite the rent. Landlords often prefer empty over discount; many spaces sit vacant for 18+ months rather than re-lease at lower market rate.",
  },

  {
    geo_id: "US-CITY-los-angeles",
    display_name: "Los Angeles",
    country_iso2: "US",
    economic_identity:
      "LA's small-business map follows the freeway grid, not a downtown core. Each district functions as a self-contained economy, Koreatown, the Westside, the Valley, East LA all have distinct customer bases, price points, and operating norms. Sit-down restaurants and gyms are oversupplied; drive-thru formats, mobile services, and beauty are perpetually under-supplied.",
    defining_industries: [
      "restaurants",
      "auto_repair_shops",
      "hairdressers_beauty",
      "real_estate_agencies",
      "fitness_gyms",
    ],
    cost_quirks:
      "Rent is moderate by US-city standards but parking and accessibility constraints often force larger lease footprints. California labor law adds substantial payroll burden (meal break / rest break / sick leave / health benefits), payroll typically runs 35-40% of revenue vs ~32% nationally. Permitting takes longer than any other major US city.",
    owner_archetype:
      "Often a second-generation small-business family or an industry expat (entertainment / aerospace / tech) starting their second-act venture.",
    neighborhoods: [
      {
        name: "Koreatown",
        blurb:
          "24-hour spa culture, late-night Korean BBQ, karaoke bars. Highest density of full-service restaurants per square mile in the city. Heavy cash economy historically; now POS-driven.",
        defining_industries: ["restaurants", "bars_nightclubs"],
      },
      {
        name: "Beverly Hills / West Hollywood",
        blurb:
          "Premium-only retail and services. Sub-$200 average ticket businesses generally don't survive. Heavy reliance on out-of-area customer base.",
        defining_industries: ["clothing_stores", "hairdressers_beauty"],
      },
      {
        name: "East LA / Boyle Heights",
        blurb:
          "Strong neighborhood retail; predominantly Spanish-speaking customer base; mid-tier price points. Auto repair, taquerias, bakeries, beauty salons.",
        defining_industries: ["restaurants", "auto_repair_shops", "barbershops"],
      },
      {
        name: "Silver Lake / Echo Park",
        blurb:
          "Coffee, vintage clothing, music venues, specialty cocktail bars. Influencer-aware businesses cluster here. Foot traffic is moderate; destination spend is high.",
        defining_industries: ["cafes_coffee", "restaurants", "bars_nightclubs"],
      },
    ],
    surprise:
      "California requires sales tax remittance even for many service-only businesses (e.g. some catering and personal-care services). Owners regularly under-budget for this and get hit at quarterly remittance.",
  },

  {
    geo_id: "GB-CITY-london",
    display_name: "London",
    country_iso2: "GB",
    economic_identity:
      "London is a city of zone economics. Zone 1 retail rents are among the highest globally and can only be afforded by either chains with national support or premium independents with national draw. Zone 2-3 are where most independent restaurants, cafes, and salons actually live. Zone 4-6 small businesses serve local residential populations and often run on commuter cycles.",
    defining_industries: [
      "restaurants",
      "cafes_coffee",
      "legal_services",
      "real_estate_agencies",
      "hairdressers_beauty",
    ],
    cost_quirks:
      "Rent is the dominant cost line. A casual restaurant in Soho easily pays £150-£250K/year for a modest footprint; the same business in Hackney would pay £40-£80K. Business rates (UK property tax for commercial premises) add another 25-40% on top of rent. Compensating factor: high foot traffic and average ticket inflation in central zones.",
    owner_archetype:
      "Highly mixed. Independent operators are predominantly European or Asian first-generation; chain franchisees are often UK natives with finance / corporate backgrounds.",
    neighborhoods: [
      {
        name: "Soho & Covent Garden",
        blurb:
          "Tourist + theatre + media-office spend. Restaurants, pubs, members' clubs. Highest rent per square foot in the UK. Survivable only at premium ticket or with strong landlord relationship.",
        defining_industries: ["restaurants", "bars_nightclubs", "hotels_lodging"],
      },
      {
        name: "Shoreditch & Hackney",
        blurb:
          "Independent cafes, specialty grocers, craft food, small clothing boutiques. Younger demographic, weekend-skewed revenue, heavy Instagram dependency.",
        defining_industries: ["cafes_coffee", "restaurants", "clothing_stores"],
      },
      {
        name: "Chelsea & Notting Hill",
        blurb:
          "Premium independents and specialty retail. Florists, jewellers, premium bakeries, boutique fitness. Customer base is local affluent residents + tourists.",
        defining_industries: ["clothing_stores", "hairdressers_beauty", "cafes_coffee"],
      },
      {
        name: "City of London",
        blurb:
          "Almost exclusively weekday lunch-and-after-work trade. Pret, Itsu, Leon and equivalents dominate. Independents struggle without the office-worker volume.",
        defining_industries: ["restaurants", "cafes_coffee", "legal_services"],
      },
    ],
    surprise:
      "Business rates have been frozen / capped for small businesses through several recent budgets, but the underlying valuation system uses 2017 property values for most areas, meaning some neighborhoods (e.g. Hackney) pay disproportionately low rates while others (declining high streets) pay disproportionately high ones.",
  },

  {
    geo_id: "FR-CITY-paris",
    display_name: "Paris",
    country_iso2: "FR",
    economic_identity:
      "Paris's small-business economy is shaped by an unusually strong local-retail culture (regulation protects independent bakeries, butchers, bookshops via la loi Lang and bail commercial protections) and by the highest tourist traffic in Europe. The arrondissement matters more than the industry: a creperie in the 6th and one in the 19th run on different economics entirely.",
    defining_industries: [
      "restaurants",
      "cafes_coffee",
      "clothing_stores",
      "hairdressers_beauty",
      "legal_services",
    ],
    cost_quirks:
      "Labour costs are unusually high, employer-side social contributions add ~42% on top of gross wages, compared to ~15% in the US. Compensating factors: long commercial lease protections (bail 3-6-9), strong loyalty from local clientele, and regulated minimum prices on some categories (bread, books) that limit price competition.",
    owner_archetype:
      "Typically a French-trained operator who has done formal apprenticeship (CAP / BEP); inheriting a fonds de commerce from a previous owner is common.",
    neighborhoods: [
      {
        name: "Le Marais (3rd / 4th)",
        blurb:
          "Boutique retail, vintage clothing, premium cafes, art galleries. Heavy weekend tourist traffic. Highest rent per square meter for retail outside of the Champs-Elysees.",
        defining_industries: ["clothing_stores", "cafes_coffee", "restaurants"],
      },
      {
        name: "Latin Quarter (5th / 6th)",
        blurb:
          "Long-established bistros, bookshops, cinemas. Steady local + tourist traffic. Restaurants here are often multi-generational family businesses.",
        defining_industries: ["restaurants", "cafes_coffee"],
      },
      {
        name: "Belleville & Menilmontant (20th)",
        blurb:
          "Most diverse small-business economy in the city. Chinese, Maghrebi, Sub-Saharan, Eastern European specialty retail and restaurants. Mid-tier price points; high cash-flow velocity.",
        defining_industries: ["restaurants", "grocery_stores", "barbershops"],
      },
      {
        name: "8th arrondissement (Champs-Elysees / Madeleine)",
        blurb:
          "Luxury retail, fine dining, premium hospitality. Almost no genuinely independent small businesses; chains and ultra-premium independents dominate.",
        defining_industries: ["clothing_stores", "restaurants", "hotels_lodging"],
      },
    ],
    surprise:
      "France's bail commercial gives commercial tenants substantial protection against eviction and rent increases mid-lease. As a result, owners with old leases often pay rents 50-70% below market, and these leases trade as part of the fonds de commerce sale.",
  },

  {
    geo_id: "JP-CITY-tokyo",
    display_name: "Tokyo",
    country_iso2: "JP",
    economic_identity:
      "Tokyo runs on vertical retail. Where most cities have one storefront per street-level slot, Tokyo stacks 8-10 small businesses vertically in a single building. The 'rooftop ramen on the 7th floor' is a Tokyo-specific economic shape. Density and walkability mean that even non-prime locations have viable foot traffic, and small footprints (10-20 m2) are normal.",
    defining_industries: [
      "restaurants",
      "cafes_coffee",
      "barbershops",
      "hairdressers_beauty",
      "clothing_stores",
    ],
    cost_quirks:
      "Rent per square meter is high but absolute floor space is small, a 12-seat izakaya commonly pays less in absolute rent than a Western 50-seat restaurant. Reikin (key money) and shikikin (deposit) at lease signing can equal 6-12 months rent up front, creating a major cash barrier. Labour is genuinely cheap relative to peer global cities; staff turnover is unusually low.",
    owner_archetype:
      "Often a long-tenured employee of the same industry (10-20+ years in a kitchen / salon / shop) opening their own venue. Multi-generational family businesses are extremely common in established neighborhoods.",
    neighborhoods: [
      {
        name: "Shibuya & Harajuku",
        blurb:
          "Youth fashion, cosmetics, kawaii culture retail. Vertical retail buildings stack 6-10 boutiques per address. Foot traffic among the highest in the world.",
        defining_industries: ["clothing_stores", "cafes_coffee", "restaurants"],
      },
      {
        name: "Shinjuku (Kabukicho / Golden Gai)",
        blurb:
          "After-work and late-night entertainment. Tiny izakayas (8-12 seats) dominate Golden Gai. Karaoke, host clubs, ramen shops in dense vertical clusters.",
        defining_industries: ["bars_nightclubs", "restaurants"],
      },
      {
        name: "Asakusa & Yanaka",
        blurb:
          "Traditional Tokyo. Multi-generational tempura shops, washoku restaurants, specialty crafts. Slower foot traffic, older demographic, premium-on-craftsmanship pricing.",
        defining_industries: ["restaurants", "cafes_coffee"],
      },
      {
        name: "Roppongi & Azabu",
        blurb:
          "International + finance + embassy clientele. Premium dining, English-speaking salons, international groceries. Higher rent and tougher margins than equivalent Japanese-customer-base areas.",
        defining_industries: ["restaurants", "bars_nightclubs", "hotels_lodging"],
      },
    ],
    surprise:
      "Japan's commercial lease practice typically requires a 'reikin' (key money) payment of 1-3 months rent that is non-refundable and not credited toward future rent. Combined with the security deposit and first month's rent, opening a Tokyo restaurant typically requires 8-12 months rent in cash before a single customer walks in.",
  },

  {
    geo_id: "AE-CITY-dubai",
    display_name: "Dubai",
    country_iso2: "AE",
    economic_identity:
      "Dubai's small-business economy is unusually license-heavy. Almost every commercial activity requires a specific government license (DED for mainland businesses, free-zone licenses for specific industries), and the license cost is often the largest single year-one expense. Local sponsorship requirements (until reformed in 2021) historically pushed many foreign owners into free zones, which create geographic clustering by nationality.",
    defining_industries: [
      "restaurants",
      "real_estate_agencies",
      "hotels_lodging",
      "clothing_stores",
      "hairdressers_beauty",
    ],
    cost_quirks:
      "License + visa costs run AED 15K-40K/year per employee. Rent in malls (where most retail happens) is high. Compensating factors: zero income tax for individuals, zero corporate tax up to AED 375K profit (and 9% above), and abundant labour from South Asian and African expat communities at very competitive wages.",
    owner_archetype:
      "Predominantly expatriate (Indian, Pakistani, Lebanese, Egyptian, Iranian, increasingly Russian and Eastern European); often part of a larger family business network across multiple Gulf cities.",
    neighborhoods: [
      {
        name: "Downtown Dubai & DIFC",
        blurb:
          "Premium finance + tourism economy. Restaurants, salons, premium retail. International chains dominate; independents need either DIFC trade license or a very specialized concept.",
        defining_industries: ["restaurants", "hairdressers_beauty", "hotels_lodging"],
      },
      {
        name: "Deira & Bur Dubai",
        blurb:
          "Old Dubai. Gold souk, spice souk, traditional retail, mid-market restaurants serving expat workers. Lower rent, higher cash flow velocity, mixed customer base.",
        defining_industries: ["restaurants", "grocery_stores", "barbershops"],
      },
      {
        name: "Marina & JBR",
        blurb:
          "Residential expat + tourist economy. Casual dining, gyms, salons, dog grooming. Premium of ~30% over equivalent Deira / Bur Dubai locations.",
        defining_industries: ["restaurants", "cafes_coffee", "sports_fitness"],
      },
      {
        name: "Free zones (JAFZA, DMCC, Internet City, Media City)",
        blurb:
          "Sector-specific commercial zones. Each has different licensing, different ownership rules. Mostly B2B services + light manufacturing rather than consumer-facing retail.",
        defining_industries: ["legal_services", "real_estate_agencies"],
      },
    ],
    surprise:
      "The annual cost of business renewal in Dubai (license + ejari + DED registration + chamber fees) often exceeds the initial setup cost by year 3-5. Many small businesses fail not at opening but at the third renewal cycle when accumulated regulatory cost outpaces ramp.",
  },

  {
    geo_id: "SG-CITY-singapore",
    display_name: "Singapore",
    country_iso2: "SG",
    economic_identity:
      "Singapore's small-business economy is shaped by extreme land scarcity and one of the most efficient regulatory regimes globally. Almost all retail and F&B exists either in shopping mall food courts, on shophouse ground floors, or in licensed hawker centres. The regulatory cost of opening is low; the rent cost is the highest in Southeast Asia.",
    defining_industries: [
      "restaurants",
      "cafes_coffee",
      "hotels_lodging",
      "real_estate_agencies",
      "legal_services",
    ],
    cost_quirks:
      "Rent in malls easily reaches SGD 30-80 per square foot per month, among the highest globally for casual F&B. Foreign worker quotas + monthly Foreign Worker Levy add structural cost. Compensating factors: zero VAT for B2C below SGD 1M revenue, abundant skilled labour, English business environment.",
    owner_archetype:
      "Highly educated and bilingual; often a former corporate employee in MNCs or finance pivoting to F&B / retail. Family-run hawker stalls remain a distinct sub-economy.",
    neighborhoods: [
      {
        name: "Orchard Road",
        blurb:
          "Premium retail + tourism + luxury salons. Almost entirely chain-operated; independents extremely rare.",
        defining_industries: ["clothing_stores", "hairdressers_beauty", "restaurants"],
      },
      {
        name: "Chinatown / Tanjong Pagar / Tiong Bahru",
        blurb:
          "Heritage shophouse small businesses. Independent cafes, specialty restaurants, boutique retail. Where most genuinely independent F&B opens.",
        defining_industries: ["cafes_coffee", "restaurants", "clothing_stores"],
      },
      {
        name: "CBD (Raffles Place / Marina Bay)",
        blurb:
          "Weekday-lunch + after-work crowd. F&B dominates; closed on weekends. Premium pricing on the back of finance + legal customer base.",
        defining_industries: ["restaurants", "cafes_coffee"],
      },
      {
        name: "Hawker centres (citywide)",
        blurb:
          "Government-licensed food stalls with regulated rent (NEA / NEA-tendered). Distinct economic shape, low absolute revenue per stall but very thin cost base. Multi-generational families own most stalls.",
        defining_industries: ["restaurants"],
      },
    ],
    surprise:
      "Singapore's Foreign Worker Levy means each foreign worker on a Work Permit costs SGD 300-950/month in addition to wages. For service industries running mostly on foreign labour (most F&B and construction), this is a substantial fixed cost line that disappears the moment you hire locally, but the labour pool isn't large enough.",
  },

  {
    geo_id: "CH-CITY-zurich",
    display_name: "Zurich",
    country_iso2: "CH",
    economic_identity:
      "Zurich is the most expensive city on Earth for small business setup outside of Tokyo central. Every cost line, rent, wages, equipment, regulatory, runs 30-60% above the EU average. Compensating factors are the highest disposable income per capita in Europe, near-universal acceptance of premium pricing, and one of the most stable customer payment cultures globally.",
    defining_industries: [
      "restaurants",
      "cafes_coffee",
      "legal_services",
      "hotels_lodging",
      "hairdressers_beauty",
    ],
    cost_quirks:
      "Wages average CHF 65K-80K for skilled hospitality staff (vs EUR 30-40K equivalent in southern Europe). Rent for prime retail can run CHF 800-1500/m2/year. VAT is unusually low (8.1% standard rate vs 19-25% across the EU). Setup capital required is among the highest in Europe.",
    owner_archetype:
      "Typically Swiss-trained with formal vocational apprenticeship; family businesses passed through generations remain very common, especially in restaurants and trades.",
    surprise:
      "Switzerland has near-zero entry barrier for licensing (most small businesses can register and open in 2-4 weeks) but extremely high real-cost barrier (rent + wages + supplier costs). The bottleneck isn't bureaucracy; it's capital.",
  },

  {
    geo_id: "DE-CITY-berlin",
    display_name: "Berlin",
    country_iso2: "DE",
    economic_identity:
      "Berlin has the lowest rents of any major European capital and one of the most international independent small-business scenes. The city economy runs on mid-tier price points, longer customer dwell times, and a customer base unusually willing to support independent businesses. Wages are below German national average but customer purchasing power is also below average.",
    defining_industries: [
      "restaurants",
      "cafes_coffee",
      "hairdressers_beauty",
      "clothing_stores",
      "bars_nightclubs",
    ],
    cost_quirks:
      "Rent has risen sharply in the last decade but remains 30-50% below Munich, Paris, London. Wage costs (including the high employer-side social contributions of ~21%) are the dominant cost line. Berlin-specific: very strong tenant protections, including for commercial leases in some districts, slow eviction processes.",
    owner_archetype:
      "Often international (Turkish, Italian, Vietnamese, Eastern European, increasingly American) operators; second-generation immigrant families dominate certain segments (bakeries, snack bars, doner shops).",
    neighborhoods: [
      {
        name: "Mitte / Prenzlauer Berg",
        blurb:
          "Boutique cafes, independent restaurants, design shops. Gentrified over the past decade; rents have risen but customer base supports premium independents.",
        defining_industries: ["cafes_coffee", "restaurants", "clothing_stores"],
      },
      {
        name: "Kreuzberg / Neukolln",
        blurb:
          "Most internationally mixed small-business district. Doner shops, kebabci, Turkish bakeries, Lebanese restaurants, late-night bars. Mid-tier pricing, cash-heavy.",
        defining_industries: ["restaurants", "barbershops", "grocery_stores"],
      },
      {
        name: "Charlottenburg / Wilmersdorf",
        blurb:
          "Older, more established, German-customer-base economy. Bakeries, butchers, doctors, lawyers, hairdressers serving long-tenured local residents.",
        defining_industries: ["hairdressers_beauty", "doctors_clinics", "legal_services"],
      },
    ],
    surprise:
      "Berlin's commercial rent index rose ~150% from 2010-2024 but residential rent only rose ~80% in the same period; the city government applies rent controls to residential but not commercial. Some of Berlin's most beloved independent businesses have closed not for lack of revenue but for inability to absorb 3-4x rent at lease renewal.",
  },

  {
    geo_id: "IT-CITY-milan",
    display_name: "Milan",
    country_iso2: "IT",
    economic_identity:
      "Milan is Italy's commercial capital and the only Italian city where premium and luxury small businesses are dense enough to form a viable independent economy. Fashion, design, finance, premium hospitality. Outside the historic centre, Milan also has a strong working-class small-business economy (Navigli, Lambrate) that runs on different rules.",
    defining_industries: [
      "restaurants",
      "clothing_stores",
      "hairdressers_beauty",
      "hotels_lodging",
      "legal_services",
    ],
    cost_quirks:
      "Italian labour law is notoriously rigid on permanent employment, leading most small businesses to lean heavily on a mix of part-time and short-term contracts. Employer-side social contributions add ~30% on top of gross wages. Rent in central Milan is the highest in Italy; rent in Navigli or Lambrate is moderate.",
    owner_archetype:
      "Frequently a multi-generational family business, especially in fashion retail, jewelry, restaurants. Independent operators tend to be Italian; chains dominate at the entry-price tier.",
    surprise:
      "Italy's regional VAT and labour rules vary significantly between Lombardy (Milan) and southern regions. Operators expanding from one to the other often discover the same business model has materially different unit economics.",
  },
];

/** Lookup helper. Returns null when the city has no entry. */
export function getCityCharacter(geoId: string | null | undefined): CityCharacter | null {
  if (!geoId) return null;
  return CITY_CHARACTERS.find((c) => c.geo_id === geoId) ?? null;
}

/** All entries for a given country, sorted by display_name. */
export function citiesForCountry(countryIso2: string): CityCharacter[] {
  return CITY_CHARACTERS
    .filter((c) => c.country_iso2 === countryIso2)
    .sort((a, b) => a.display_name.localeCompare(b.display_name));
}
