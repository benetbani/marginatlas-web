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

  {
    geo_id: "PT-CITY-lisbon",
    display_name: "Lisbon",
    country_iso2: "PT",
    economic_identity:
      "Lisbon's small-business economy was reshaped twice in a decade: first by the post-2014 tourism boom that quadrupled short-term rentals and pushed restaurants and cafes into tourism dependence, then by the post-2020 tech and remote-worker influx that pulled rents up sharply across previously affordable districts. Independent local businesses now operate in a city with German prices and Portuguese wages, a structural squeeze that defines almost every operating decision.",
    defining_industries: [
      "restaurants",
      "cafes_coffee",
      "hotels_lodging",
      "hairdressers_beauty",
      "real_estate_agencies",
    ],
    cost_quirks:
      "Wages are the lowest in Western Europe (a server earns EUR 850-1,100 net per month) but rent in central districts has tripled since 2015. The result: payroll runs ~20-25% of revenue (low by EU standards), but rent runs 12-18% (higher than most of southern Europe). Tourist-zone restaurants compete on price with locals who have been priced out of those neighborhoods entirely.",
    owner_archetype:
      "Increasingly mixed: long-established Portuguese family businesses in residential districts, foreign-owned (French, Italian, Brazilian, American, British) tourism-dependent businesses in the central Pombaline grid.",
    neighborhoods: [
      {
        name: "Baixa & Chiado",
        blurb:
          "Almost entirely tourist-driven. Restaurants run on lunch tour groups and dinner couples; few year-round local customers. Highest rent per square meter in Portugal.",
        defining_industries: ["restaurants", "cafes_coffee", "clothing_stores"],
      },
      {
        name: "Alfama & Mouraria",
        blurb:
          "Tourist + Airbnb economy with pockets of older Portuguese residents. Fado restaurants, miradouro cafes, souvenir shops. Tight medieval streets limit space and force micro-formats.",
        defining_industries: ["restaurants", "cafes_coffee"],
      },
      {
        name: "Principe Real & Bairro Alto",
        blurb:
          "Most cosmopolitan independent-retail district. Boutique fashion, specialty bookstores, third-wave coffee. Higher disposable-income foreign residents anchor demand.",
        defining_industries: ["cafes_coffee", "clothing_stores", "restaurants"],
      },
      {
        name: "Marvila & Beato",
        blurb:
          "Industrial heritage converted to creative spaces. Craft breweries, design studios, coworking. Rent climbing but still affordable by central-Lisbon standards.",
        defining_industries: ["cafes_coffee", "restaurants", "bars_nightclubs"],
      },
    ],
    surprise:
      "Portugal's RNAL (short-term rental register) creates a parallel commercial-property economy. Many storefronts in central Lisbon are worth more as ground-floor apartments converted to tourist rentals than as commercial leases, creating long-term structural pressure on retail viability.",
  },

  {
    geo_id: "ES-CITY-barcelona",
    display_name: "Barcelona",
    country_iso2: "ES",
    economic_identity:
      "Barcelona runs a small-business economy uniquely shaped by tourism + dense urbanism + a politically active local government. Catalonia's regional autonomy gives the city distinct labour and consumer protections vs the rest of Spain; the Ada Colau administration's 2016-2023 policies (short-term-rental moratorium, terrace restrictions, retail-protection zones) reshaped what could open where. Independent businesses outside the tourist core remain unusually resilient.",
    defining_industries: [
      "restaurants",
      "cafes_coffee",
      "clothing_stores",
      "hotels_lodging",
      "hairdressers_beauty",
    ],
    cost_quirks:
      "Wages are mid-range for Western Europe (kitchen wages EUR 1,100-1,500 net). Rent is the highest in Spain in central districts but lower than Lisbon's central core. The big cost line nobody models well: terrace fees + sidewalk-occupation taxes for restaurants and cafes can add EUR 5K-25K/year per location.",
    owner_archetype:
      "Catalan family businesses (multi-generational restaurants, panaderias) and increasingly Argentinian, Italian, French, and Latin American entrepreneurs running independent restaurants and cafes.",
    neighborhoods: [
      {
        name: "El Born & Gothic Quarter",
        blurb:
          "Highest tourist density in Spain. Tapas bars, boutique hotels, fashion retail. Restrictive licensing means new establishments rare; existing licenses trade as part of business sales.",
        defining_industries: ["restaurants", "clothing_stores", "hotels_lodging"],
      },
      {
        name: "Gracia",
        blurb:
          "Distinctive bohemian-residential character. Independent cafes, vintage stores, family restaurants, small theaters. Lower rent than the tourist core; strong local customer loyalty.",
        defining_industries: ["cafes_coffee", "restaurants", "clothing_stores"],
      },
      {
        name: "Eixample",
        blurb:
          "Office-worker lunch trade by day, residential by night. Mid-tier restaurants, dental clinics, hairdressers, gyms. Most balanced economy in the city.",
        defining_industries: ["restaurants", "dental_practices", "sports_fitness"],
      },
      {
        name: "Poblenou",
        blurb:
          "Former industrial district now in the 22@ tech zone. Coworking, third-wave cafes, casual restaurants serving tech workers. Rapid rent growth since 2015.",
        defining_industries: ["cafes_coffee", "restaurants"],
      },
    ],
    surprise:
      "Barcelona's restaurant terraces operate under both city and municipal-district rules; the same operator on opposite sides of a single street can face different chair limits and operating hours. Veteran operators choose addresses partly on which district's specific terrace regulation favors their format.",
  },

  {
    geo_id: "NL-CITY-amsterdam",
    display_name: "Amsterdam",
    country_iso2: "NL",
    economic_identity:
      "Amsterdam is dense, regulated, and increasingly expensive. The historic canal-ring layout limits commercial footprint; the city's strict zoning differentiates 'living' streets (limited retail) from 'shopping' streets (concentrated commerce). Add the highest VAT in the EU at 21% on most goods, and the resulting economy strongly favors high-margin, design-led, low-footprint formats.",
    defining_industries: [
      "restaurants",
      "cafes_coffee",
      "hotels_lodging",
      "clothing_stores",
      "bars_nightclubs",
    ],
    cost_quirks:
      "Dutch labour costs include some of the highest employer-side contributions in Europe (~30% on top of gross wages). Rent in De Negen Straatjes and the Jordaan is among the highest per square meter in continental Europe. Compensating: high disposable-income customers, English-language ease for international staff, fast business registration (1 day at the KvK).",
    owner_archetype:
      "Dutch-trained operators alongside an unusually international cohort (British, German, French, increasingly American). Most independent restaurant owners came up through Dutch culinary school + 5+ years in established kitchens.",
    neighborhoods: [
      {
        name: "Jordaan",
        blurb:
          "Boutique retail + cafes + casual restaurants in historic narrow buildings. Strong residential customer base supports independent businesses; tourist overflow on weekends.",
        defining_industries: ["restaurants", "cafes_coffee", "clothing_stores"],
      },
      {
        name: "De Pijp",
        blurb:
          "Most lively independent-restaurant cluster. Albert Cuyp market anchors the area. International + Dutch-resident customer mix; mid-tier prices.",
        defining_industries: ["restaurants", "cafes_coffee", "grocery_stores"],
      },
      {
        name: "Zuidas",
        blurb:
          "Financial-business district. Weekday-only lunch + after-work trade. International chains dominate; few genuinely independent restaurants survive.",
        defining_industries: ["restaurants", "legal_services"],
      },
      {
        name: "Noord",
        blurb:
          "Former industrial waterfront across the IJ. Craft breweries, art-collective spaces, casual restaurants. Lower rent + rapid demographic shift; the next 5 years will define what survives.",
        defining_industries: ["cafes_coffee", "restaurants", "bars_nightclubs"],
      },
    ],
    surprise:
      "Amsterdam's 'horeca' license is tied to the specific premises, not the operator. Buying an existing license-holding business often costs more than the business itself, because licenses for restaurants in central canal-ring buildings are functionally capped.",
  },

  {
    geo_id: "MX-CITY-mexico-city",
    display_name: "Mexico City",
    country_iso2: "MX",
    economic_identity:
      "Mexico City's small-business economy is among the most stratified globally. The same metropolitan area contains Polanco luxury retail (price points comparable to Madrid or Miami) and 30 minutes away, neighborhood economies running on USD 4 average tickets. Informal economy (street vendors, market stalls, unregistered shops) accounts for an estimated 30-40% of total small-business activity by transaction count.",
    defining_industries: [
      "restaurants",
      "cafes_coffee",
      "grocery_stores",
      "auto_repair_shops",
      "hairdressers_beauty",
    ],
    cost_quirks:
      "Wages are very low relative to peer megacities (a server earns USD 350-600/month). Rent varies 20-50x between Tlalpan and Polanco. Informal operating means many businesses don't pay VAT, payroll taxes, or registration fees, which creates a structural disadvantage for formally registered businesses competing on the same street.",
    owner_archetype:
      "Either multi-generational Mexican families running neighborhood businesses, or returnees from the US with cross-border experience setting up modern formats, or international (Argentinian, Colombian, Spanish) operators in the more cosmopolitan districts.",
    neighborhoods: [
      {
        name: "Polanco",
        blurb:
          "Premium retail, fine dining, luxury hospitality. Customer base is Mexican upper class + corporate expats + tourists. Operating costs and customer expectations both 5-10x the city average.",
        defining_industries: ["restaurants", "clothing_stores", "hotels_lodging"],
      },
      {
        name: "Roma & Condesa",
        blurb:
          "Most concentrated cosmopolitan independent scene in Latin America. Third-wave coffee, gastro-restaurants, designer boutiques. Strong cohort of foreign residents lifting price points.",
        defining_industries: ["cafes_coffee", "restaurants", "clothing_stores"],
      },
      {
        name: "Coyoacan",
        blurb:
          "Historic residential district. Independent restaurants, panaderias, libraries, museums. Tourist + local-resident mix; mid-tier price points.",
        defining_industries: ["restaurants", "cafes_coffee"],
      },
      {
        name: "Iztapalapa",
        blurb:
          "One of the largest delegations by population. Dense neighborhood retail: bodegas, taquerias, auto-repair shops, beauty salons. Cash-heavy, high transaction velocity, thin margins.",
        defining_industries: ["restaurants", "grocery_stores", "auto_repair_shops"],
      },
    ],
    surprise:
      "Mexico City's elevation (2,240m / 7,350 ft) genuinely affects commercial-kitchen operation. Yeasted-bread bakeries proof faster, deep-fryers boil oil at lower temperature, espresso extraction is harder to dial in. Operators expanding from coastal Mexico often discover their recipes need rebuilding.",
  },

  {
    geo_id: "BR-CITY-sao-paulo",
    display_name: "Sao Paulo",
    country_iso2: "BR",
    economic_identity:
      "Sao Paulo runs the most internally diverse small-business economy in Latin America. The metropolitan area encompasses Brazilian-Italian neighborhoods (Bixiga, Bras), Brazilian-Japanese (Liberdade), Brazilian-Korean (Bom Retiro), Brazilian-Lebanese (downtown), each with distinct food and retail traditions. Sao Paulo accounts for an outsized share of national premium retail; outside the wealthier Western and Southern zones, the economy looks closer to other Brazilian metros.",
    defining_industries: [
      "restaurants",
      "cafes_coffee",
      "hairdressers_beauty",
      "clothing_stores",
      "grocery_stores",
    ],
    cost_quirks:
      "Brazilian payroll burden is among the highest in the world: total labour cost runs ~1.7-1.8x gross wage when all encargos sociais are added. Compensating: cost of materials is low for domestically sourced inputs (food, basic retail); imported goods carry substantial tariffs and currency-exposed pricing. Rent in Jardins / Itaim Bibi is high; in Lapa or Mooca, very moderate.",
    owner_archetype:
      "Multi-generational immigrant-family businesses (Italian, Japanese, Lebanese descent) plus a growing cohort of professionalized restaurant + cafe entrepreneurs in the wealthier zones.",
    neighborhoods: [
      {
        name: "Jardins (Cerqueira Cesar, Jardim Paulista)",
        blurb:
          "Premium retail + fine dining + boutique hotels. Highest disposable-income customer base in Latin America. Restaurants here regularly carry Sao Paulo's representative on World's 50 Best lists.",
        defining_industries: ["restaurants", "clothing_stores", "hairdressers_beauty"],
      },
      {
        name: "Vila Madalena",
        blurb:
          "Bohemian-creative district. Independent bars, casual restaurants, art galleries, vintage shops. Weekend-night-heavy revenue; quiet weekdays.",
        defining_industries: ["restaurants", "bars_nightclubs", "cafes_coffee"],
      },
      {
        name: "Liberdade",
        blurb:
          "Japanese / Korean / Chinese diaspora district. Specialty grocers, ramen shops, Korean BBQ, Asian beauty salons. Distinct from rest of city in customer base and product mix.",
        defining_industries: ["restaurants", "grocery_stores", "hairdressers_beauty"],
      },
      {
        name: "Itaim Bibi & Faria Lima",
        blurb:
          "Financial + corporate district. Weekday lunch + after-work + happy hour. Premium pricing on finance-worker customer base.",
        defining_industries: ["restaurants", "cafes_coffee", "bars_nightclubs"],
      },
    ],
    surprise:
      "Brazilian Simples Nacional simplified tax regime caps annual revenue at BRL 4.8M (~USD 950K). Many growing small businesses deliberately split into two legal entities to stay under the cap; crossing it triggers a punitive jump in effective tax rate that makes scaling discontinuously expensive.",
  },

  {
    geo_id: "TH-CITY-bangkok",
    display_name: "Bangkok",
    country_iso2: "TH",
    economic_identity:
      "Bangkok's small-business economy is split between an enormous informal street-economy (street-food, motorcycle-taxi, sidewalk-vendor) and a fast-growing formal mid-market that has built rapidly around shopping malls and BTS / MRT station nodes. The mall-anchored model is dominant for retail and casual dining; the street economy serves locals at price points the formal economy can't reach.",
    defining_industries: [
      "restaurants",
      "cafes_coffee",
      "hotels_lodging",
      "hairdressers_beauty",
      "clothing_stores",
    ],
    cost_quirks:
      "Wages are very low (a server in a mall restaurant earns THB 12,000-18,000/month, USD 340-510). Mall rents are high (often 15-25% of revenue + GTV-linked variable rent). Foreign-ownership restrictions (Thai majority required for many license types) shape who can own what; nominee structures are common but legally risky.",
    owner_archetype:
      "Thai-owned independents alongside an unusually large cohort of foreign-married Thais holding the license on behalf of foreign partners, plus international hotel + restaurant groups.",
    neighborhoods: [
      {
        name: "Sukhumvit (Asoke, Phrom Phong, Thong Lor)",
        blurb:
          "Mid-to-premium-tier restaurants, third-wave cafes, boutique hotels, beauty clinics. Customer base: Thai middle-upper class + expats + medical tourists. Highest rent corridor in the city.",
        defining_industries: ["restaurants", "cafes_coffee", "hairdressers_beauty"],
      },
      {
        name: "Siam & Chitlom",
        blurb:
          "Mall-anchored retail + dining. Almost entirely chain-operated; independents push out by the rent + rotation model. Customer base is Bangkokian shoppers + tourists.",
        defining_industries: ["clothing_stores", "restaurants"],
      },
      {
        name: "Chinatown (Yaowarat)",
        blurb:
          "Densest street-food and traditional Chinese-Thai retail. Gold shops, dried-seafood wholesalers, all-night noodle stalls. Mostly multi-generational family operations.",
        defining_industries: ["restaurants", "grocery_stores"],
      },
      {
        name: "Ari & Phaya Thai",
        blurb:
          "Younger residential-creative district. Independent cafes, casual restaurants, small fashion boutiques. Lower rent than Sukhumvit + younger Bangkokian customer base.",
        defining_industries: ["cafes_coffee", "restaurants", "clothing_stores"],
      },
    ],
    surprise:
      "Bangkok's MRT and BTS station catchment areas create dramatic property-value cliffs: rent for a unit 50m from a station entrance can be double the rent of an identical unit 250m away. Most modern retail leases negotiate explicit station-proximity premiums.",
  },

  {
    geo_id: "IN-CITY-mumbai",
    display_name: "Mumbai",
    country_iso2: "IN",
    economic_identity:
      "Mumbai is shaped by extreme land scarcity (it sits on a narrow peninsula) and by India's most diversified small-business economy. The same city contains both India's highest-priced real estate (South Mumbai) and the world's largest informal slum economy (Dharavi, employing hundreds of thousands in micro-businesses). Formal-economy small businesses cluster around suburban railway corridors; informal economy operates between and below them.",
    defining_industries: [
      "restaurants",
      "cafes_coffee",
      "clothing_stores",
      "auto_repair_shops",
      "grocery_stores",
    ],
    cost_quirks:
      "Wages are very low (a server earns INR 12,000-22,000/month, USD 145-265) but commercial rent in Bandra, Lower Parel, BKC is among the highest in Asia. GST compliance adds substantial paperwork burden disproportionately affecting small operators. Power outages still occur and most established small businesses budget for generator + invertor capital.",
    owner_archetype:
      "Multi-generational community-anchored family businesses (Gujarati, Marwari, Parsi, Maharashtrian, Catholic Goan, Muslim communities each with distinct retail clusters), plus a growing cohort of urban returnees from US/UK opening modernized formats.",
    neighborhoods: [
      {
        name: "South Mumbai (Colaba, Fort, Marine Drive)",
        blurb:
          "Premium retail + heritage hospitality + offices. Customer base: corporate + tourist + diplomatic. Most internationalized district in Mumbai.",
        defining_industries: ["restaurants", "hotels_lodging", "clothing_stores"],
      },
      {
        name: "Bandra West",
        blurb:
          "Bollywood + creative + affluent residential. Boutique fashion, gastropubs, third-wave cafes, designer salons. Highest premium per square foot for boutique commercial in India.",
        defining_industries: ["restaurants", "cafes_coffee", "hairdressers_beauty"],
      },
      {
        name: "Andheri (East + West)",
        blurb:
          "Massive mixed-use suburban district. Lokhandwala for retail and dining; SEEPZ for IT-corporate lunch trade. Mid-tier pricing; very high foot traffic.",
        defining_industries: ["restaurants", "cafes_coffee", "clothing_stores"],
      },
      {
        name: "Lower Parel & BKC",
        blurb:
          "Former mill district turned corporate financial hub. Weekday-corporate lunch trade dominates. Premium tower rents but limited consumer base outside business hours.",
        defining_industries: ["restaurants", "cafes_coffee", "legal_services"],
      },
    ],
    surprise:
      "Mumbai's commercial property market includes 'pagri' (key money) leases dating from rent-control law: monthly rent might be INR 200 (USD 2.50) on a Fort heritage building unit, but the pagri sale price changes hands for crores (tens of millions of rupees / hundreds of thousands of USD). Many businesses occupy commercial space purely on these legacy structures.",
  },

  {
    geo_id: "TR-CITY-istanbul",
    display_name: "Istanbul",
    country_iso2: "TR",
    economic_identity:
      "Istanbul's small-business economy operates against one of the most volatile major-economy currencies in the world. The Turkish lira lost over 80% of its USD value from 2018-2024, which means: anything imported is wildly expensive, exporters are unusually profitable, savings cannot reliably be held in lira. Many small businesses operate dual pricing (lira for locals, EUR/USD for tourists) to manage the exposure.",
    defining_industries: [
      "restaurants",
      "cafes_coffee",
      "clothing_stores",
      "hairdressers_beauty",
      "hotels_lodging",
    ],
    cost_quirks:
      "Domestic labour is cheap in lira terms (a server earns TRY 25,000-40,000/month, USD 750-1,200 at current rates). Rent in Beyoglu, Nisantasi, Bebek is high in USD-equivalent because landlords increasingly index leases to inflation or foreign currency. Energy and gas costs are very high; cold-chain logistics are expensive.",
    owner_archetype:
      "Multi-generational Turkish family businesses + a growing cohort of Russian, Iranian, Syrian, and Ukrainian owners (post-2014 + post-2022 migrations) operating restaurants, boutiques, and import-export.",
    neighborhoods: [
      {
        name: "Beyoglu (Istiklal, Galata, Karakoy)",
        blurb:
          "Historic European-side commercial spine. Restaurants, music venues, cafes, boutique hotels. Heavy tourist traffic; gradual gentrification of Karakoy in the past decade.",
        defining_industries: ["restaurants", "cafes_coffee", "hotels_lodging"],
      },
      {
        name: "Kadikoy & Moda",
        blurb:
          "Asian-side bohemian-creative district. Independent restaurants, bookstores, third-wave coffee, music venues. Strong local-customer base; less tourist-dependent.",
        defining_industries: ["cafes_coffee", "restaurants", "bars_nightclubs"],
      },
      {
        name: "Nisantasi & Tesvikiye",
        blurb:
          "Premium retail + dining + medical / aesthetic clinics. Customer base: Turkish upper class + Gulf medical tourists + Russian residents. Premium pricing.",
        defining_industries: ["clothing_stores", "restaurants", "hairdressers_beauty"],
      },
      {
        name: "Fatih (historic peninsula)",
        blurb:
          "Mass-tourism Sultanahmet + working-class residential. Hotels, souvenir shops, traditional restaurants, neighborhood services. Two parallel economies (tourist + local) coexisting.",
        defining_industries: ["hotels_lodging", "restaurants", "grocery_stores"],
      },
    ],
    surprise:
      "Turkish minimum wage has been adjusted by 50-100% in single steps multiple times since 2021 to keep pace with inflation. Many small businesses set internal wages 20-40% above minimum specifically to anchor them above the next minimum-wage hike, which is otherwise structurally cannibalizing.",
  },

  {
    geo_id: "AR-CITY-buenos-aires",
    display_name: "Buenos Aires",
    country_iso2: "AR",
    economic_identity:
      "Buenos Aires runs one of the most paradoxical small-business economies on the planet: an unusually well-educated workforce, dense European-style commercial streets, and a sophisticated restaurant + culture scene, all operating against decades of macroeconomic instability (inflation, currency controls, devaluation cycles). Most independent operators run dual pricing (peso for locals, USD for tourists or USD-earning expats); savings stay in USD physical cash, not banks.",
    defining_industries: [
      "restaurants",
      "cafes_coffee",
      "clothing_stores",
      "hairdressers_beauty",
      "real_estate_agencies",
    ],
    cost_quirks:
      "Wages are very low in USD terms but compress to mid-tier in peso-real-purchasing-power. Rent is moderate by global-capital standards. Imported goods (kitchen equipment, salon products, technology) cost 2-3x global market price because of import taxes and currency controls. Cash-economy operating is common; formal accounting and tax compliance vary widely.",
    owner_archetype:
      "Argentinian operators with multi-generational small-business heritage; many Italian and Spanish surnames reflecting late-19th-century immigration. A meaningful cohort of expat operators (Venezuelan, Colombian, Brazilian) post-2015.",
    neighborhoods: [
      {
        name: "Palermo (Soho + Hollywood)",
        blurb:
          "Most cosmopolitan independent district in Latin America. Designer fashion, gastronomy, third-wave coffee, craft cocktails, boutique hotels. Premium pricing on tourist + expat customer base.",
        defining_industries: ["restaurants", "cafes_coffee", "clothing_stores"],
      },
      {
        name: "Recoleta",
        blurb:
          "Old-money premium residential + boutique retail + traditional cafes. Customer base: affluent porteno families + tourists for the cemetery. Stable premium pricing.",
        defining_industries: ["restaurants", "cafes_coffee", "hairdressers_beauty"],
      },
      {
        name: "San Telmo",
        blurb:
          "Historic colonial district; antique markets, tango bars, casual restaurants. Tourist-heavy by day, locals by night. Older buildings + lower rent than Palermo.",
        defining_industries: ["restaurants", "cafes_coffee", "clothing_stores"],
      },
      {
        name: "Belgrano & Chinatown",
        blurb:
          "Residential middle-class + Asian diaspora district. Independent restaurants, specialty grocers, Asian beauty salons. Moderate prices; resident-driven foot traffic.",
        defining_industries: ["restaurants", "grocery_stores", "hairdressers_beauty"],
      },
    ],
    surprise:
      "Argentina's currency controls historically created multiple official exchange rates simultaneously (oficial, blue, MEP, CCL). A restaurant accepting tourist USD might quote a menu priced at a different effective USD rate than what the central bank publishes. Most independent operators track multiple rates daily.",
  },

  {
    geo_id: "HK-CITY-hong-kong",
    display_name: "Hong Kong",
    country_iso2: "HK",
    economic_identity:
      "Hong Kong has the most extreme commercial real-estate cost structure in the world. Retail rent in Causeway Bay was historically the highest globally; even after the 2020-2023 reset, central-district rents remain at levels that force a binary outcome on small businesses (premium-margin survives; mid-market does not). The city's ultra-vertical retail, ground-floor sticker prices in the millions of HKD per month, and lease security via assignments (not month-to-month) are unique constraints.",
    defining_industries: [
      "restaurants",
      "cafes_coffee",
      "hotels_lodging",
      "legal_services",
      "real_estate_agencies",
    ],
    cost_quirks:
      "Wages mid-range globally (a server earns HKD 16,000-22,000/month, USD 2,050-2,800), but rent in Central, Causeway Bay, Tsim Sha Tsui regularly exceeds 30% of revenue. Compensating: very low corporate tax (8.25% on first HKD 2M profit, 16.5% above), generally fast license processing for most categories, dense walkable customer base.",
    owner_archetype:
      "Multi-generational Hong Kong Chinese family businesses (often Cantonese-speaking, Hakka-origin, or Chiu Chow-origin) dominate traditional retail; international and mainland Chinese operators dominate premium F&B and luxury retail.",
    neighborhoods: [
      {
        name: "Central & Sheung Wan",
        blurb:
          "Finance + corporate + premium dining + luxury retail. Independents survive only at the top of the market (Michelin-starred restaurants, premium specialty retail) or in vertical retail upper floors.",
        defining_industries: ["restaurants", "legal_services", "cafes_coffee"],
      },
      {
        name: "Causeway Bay & Wan Chai",
        blurb:
          "Highest density of mid-market retail and dining. Cha chaan teng cafes, Hong Kong-style noodle shops, beauty clinics, fashion boutiques. Tourist + local Hong Kong customer base.",
        defining_industries: ["restaurants", "clothing_stores", "hairdressers_beauty"],
      },
      {
        name: "Mong Kok & Yau Ma Tei",
        blurb:
          "Densest commercial district per square meter on the planet. Markets, street food, electronics retail, dim-sum parlors. Foot traffic is enormous; transaction value is moderate.",
        defining_industries: ["restaurants", "clothing_stores", "grocery_stores"],
      },
      {
        name: "Tsim Sha Tsui",
        blurb:
          "Premium tourism + Kowloon corporate. Luxury hotels, high-end dining, boutique retail. Customer base heavily mainland Chinese + international tourist.",
        defining_industries: ["hotels_lodging", "restaurants", "clothing_stores"],
      },
    ],
    surprise:
      "Hong Kong commercial leases routinely include a 'good guy guarantee' from the personal director of the operating company. If the business closes, the director's personal assets are exposed even if the company is dissolved. Most experienced operators negotiate this down to a 6-12-month cap.",
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
