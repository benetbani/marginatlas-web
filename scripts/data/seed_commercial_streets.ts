/**
 * scripts/data/seed_commercial_streets.ts
 *
 * One-shot seeder: writes commercial_streets arrays for the 49 cities
 * beyond NYC (NYC already has 10 entries shipped as the sample).
 *
 * The city entries are PARTIAL overrides — they only override
 * commercial_streets and inherit everything else (demographics,
 * sectors, culture, gov) from the country baseline.
 *
 * Run: npx tsx scripts/data/seed_commercial_streets.ts
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const FILE = path.resolve(ROOT, "data/cities/city_signature_v1.json");

type Street = { name: string; area: string; sells: string };
type CityEntry = { commercial_streets?: Street[]; [k: string]: unknown };
type FileShape = {
  version: string;
  anchor: string;
  convention: Record<string, unknown>;
  cities: Record<string, CityEntry>;
};

const data = JSON.parse(fs.readFileSync(FILE, "utf-8")) as FileShape;

// ---------------------------------------------------------------------------
// Top 50 cities. NYC already shipped 10 streets, so the seeder skips it.
// Each city: 5-7 commercial streets / zones with what is sold.
// Hand-curated 2026-05-26 from on-the-ground knowledge + Wikipedia + Tripadvisor.
// ---------------------------------------------------------------------------
const STREETS: Record<string, Street[]> = {
  // ---- Tier 1, alphabetical (excluding NYC which is already shipped) ----
  baghdad: [
    { name: "Karrada", area: "Central Baghdad", sells: "Electronics, mobile-phone retail, mid-range fashion, restaurants. The main modern shopping district." },
    { name: "Mansour", area: "West Baghdad", sells: "Upmarket boutiques, salons, malls (Mansour Mall), cafes. The wealthy residential commerce belt." },
    { name: "Al-Rasheed Street", area: "Rusafa, old Baghdad", sells: "Historic colonnaded street with traditional traders: textiles, copperware, books." },
    { name: "Al-Mutanabbi Street", area: "Old Baghdad", sells: "Books and printed media: the literary heart of Baghdad, lined with bookshops and stationers." },
    { name: "Bab al-Sharqi (Tahrir)", area: "Central Baghdad", sells: "Souk-style mixed retail: clothing, gold, household goods, currency exchange." },
  ],
  barcelona: [
    { name: "Passeig de Gràcia", area: "Eixample", sells: "Luxury flagships: Loewe, Chanel, Cartier. Plus the Gaudí façades that draw the foot traffic." },
    { name: "Las Ramblas", area: "Ciutat Vella", sells: "Tourist retail, flower stalls, La Boqueria market, street performers. Volume not margin." },
    { name: "El Born", area: "Ciutat Vella", sells: "Independent fashion, ceramic ateliers, wine bars, design-led boutiques in medieval lanes." },
    { name: "Gràcia (Carrer Verdi)", area: "Gràcia", sells: "Bohemian independent retail, vintage clothing, third-wave coffee, neighbourhood plaças." },
    { name: "Avinguda Diagonal", area: "Eixample / Les Corts", sells: "Mid-market chain retail anchored by L'Illa Diagonal mall and El Corte Inglés." },
  ],
  beijing: [
    { name: "Wangfujing", area: "Dongcheng", sells: "Department stores, luxury malls, the famous Wangfujing snack street. The historic main shopping artery." },
    { name: "Sanlitun", area: "Chaoyang", sells: "International luxury flagships, expat bars, the Taikoo Li open-air complex." },
    { name: "Qianmen Street", area: "Dongcheng", sells: "Restored Qing-era retail strip near Tiananmen: traditional crafts, Peking duck, silk." },
    { name: "Nanluoguxiang", area: "Dongcheng", sells: "Hutong-lined alley with boutiques, snack vendors, ear-cleaners. Foot traffic from tourists." },
    { name: "CBD (Guomao)", area: "Chaoyang", sells: "China World Mall plus the SKP and SKP-S luxury complex. Top-tier global brand flagships." },
  ],
  berlin: [
    { name: "Kurfürstendamm (Ku'damm)", area: "Charlottenburg", sells: "Western Berlin's main retail axis: KaDeWe, mid-luxury fashion, large flagships." },
    { name: "Friedrichstraße", area: "Mitte", sells: "Galeries Lafayette, Quartier 206, high-end fashion. The Mitte answer to Ku'damm." },
    { name: "Hackescher Markt", area: "Mitte", sells: "Independent fashion, concept stores, design ateliers in restored courtyards." },
    { name: "Kreuzberg (Bergmannstraße)", area: "Kreuzberg", sells: "Vintage shops, indie record stores, Turkish grocers, late-night bars." },
    { name: "Bikini Berlin", area: "Charlottenburg", sells: "Concept mall with pop-up boxes for emerging brands. Sits opposite the Zoo." },
  ],
  chicago: [
    { name: "Magnificent Mile", area: "Streeterville, North Michigan Ave", sells: "Flagship retail: Apple, Burberry, the John Hancock observation deck. Chicago's main luxury axis." },
    { name: "State Street", area: "The Loop", sells: "Macy's flagship (formerly Marshall Field's), department-store density and the Theater District." },
    { name: "Wicker Park", area: "West Town", sells: "Independent boutiques, vintage clothing, brewpubs, the original Big Star taqueria." },
    { name: "Lincoln Park / Armitage", area: "North Side", sells: "Family-friendly upscale boutiques, kids' brands, organic markets along Halsted." },
    { name: "Fulton Market", area: "West Loop", sells: "Restaurants, food halls, the Soho House, and tech-tenant office retail." },
  ],
  delhi: [
    { name: "Connaught Place", area: "Central Delhi", sells: "Colonial-era circular plaza with Khadi, Western retail, restaurants. New Delhi's CBD." },
    { name: "Chandni Chowk", area: "Old Delhi", sells: "Wholesale and bridal: textiles (Katra Neel), spices (Khari Baoli), silver and gold (Dariba Kalan)." },
    { name: "Khan Market", area: "South-Central Delhi", sells: "Highest rents per square foot in India: boutiques, bookshops, expat-favoured restaurants." },
    { name: "Sarojini Nagar", area: "South-West Delhi", sells: "Export-surplus fashion at street-stall prices. Young-Delhi's bargaining mecca." },
    { name: "Karol Bagh", area: "Central Delhi", sells: "Mid-market clothing, sari shops, bridal jewellery, mobile-phone retail." },
  ],
  dubai: [
    { name: "Sheikh Zayed Road", area: "Downtown corridor", sells: "Skyscraper retail, hotel arcades, the Dubai Mall feeder. The car-borne main artery." },
    { name: "Dubai Mall", area: "Downtown Dubai", sells: "World's second-largest mall: every luxury flagship, the aquarium, indoor ski slope's neighbour." },
    { name: "Gold Souk", area: "Deira", sells: "Hundreds of gold and jewellery retailers in a covered souk. Wholesale and retail." },
    { name: "Spice Souk", area: "Deira", sells: "Bulk spices, dried fruit, frankincense. Adjacent to the gold souk in old Dubai." },
    { name: "City Walk", area: "Jumeirah", sells: "European-style outdoor retail district: boutiques, casual dining, design-conscious." },
  ],
  "hong-kong": [
    { name: "Tsim Sha Tsui (Canton Road)", area: "Kowloon", sells: "Highest density of luxury watch and handbag flagships globally. Mainland-tourist anchored." },
    { name: "Central (IFC and Landmark)", area: "Hong Kong Island", sells: "Luxury malls inside finance towers: Hermès, Chanel, private-bank lounges above." },
    { name: "Causeway Bay (Times Square)", area: "Hong Kong Island", sells: "Mid-to-high-end fashion, electronics, SOGO department store. Dense youth-market retail." },
    { name: "Mong Kok (Ladies Market)", area: "Kowloon", sells: "Street stalls, electronics in Sham Shui Po next door, fast-fashion. Volume retail." },
    { name: "SoHo (Hollywood Road)", area: "Hong Kong Island", sells: "Antique dealers, design galleries, expat-favoured restaurants below the Mid-Levels Escalator." },
  ],
  london: [
    { name: "Oxford Street", area: "West End", sells: "Selfridges, John Lewis, mass-market flagships. Highest pedestrian volume in Europe." },
    { name: "Bond Street", area: "Mayfair", sells: "Luxury watches, jewellery (Cartier, Boucheron), couture flagships. London's top-tier axis." },
    { name: "Savile Row", area: "Mayfair", sells: "Bespoke tailoring: Henry Poole, Anderson & Sheppard, Huntsman. The reference for hand-made suits." },
    { name: "Regent Street", area: "West End", sells: "Curved Nash terrace lined with global brand flagships: Apple, Burberry, Liberty just behind." },
    { name: "Shoreditch (Redchurch Street)", area: "East End", sells: "Independent fashion, third-wave coffee, tech-startup ground floors, vintage." },
    { name: "Covent Garden", area: "West End", sells: "Premium chains, beauty flagships, the Apple Market, theatre crowds." },
  ],
  "los-angeles": [
    { name: "Rodeo Drive", area: "Beverly Hills", sells: "Three blocks of luxury flagships: Hermès, Chanel, Prada. America's most photographed retail strip." },
    { name: "Melrose Avenue", area: "West Hollywood", sells: "Street-style boutiques, sneakers, vintage. The reference for LA streetwear retail." },
    { name: "Abbot Kinney", area: "Venice", sells: "Concept stores, surf-luxe boutiques, vegan restaurants, design-led independent retail." },
    { name: "Hollywood Boulevard", area: "Hollywood", sells: "Walk of Fame tourist retail, Hollywood & Highland complex, costume and souvenir traders." },
    { name: "Robertson Boulevard", area: "Beverly Hills border", sells: "Paparazzi-favoured boutiques: Kitson legacy, The Ivy restaurant, celebrity-spotting commerce." },
  ],
  madrid: [
    { name: "Gran Vía", area: "Centro", sells: "Theatre marquees and mass-market fashion flagships: Primark, Zara, H&M. Madrid's main retail axis." },
    { name: "Calle Serrano (Salamanca)", area: "Salamanca", sells: "Luxury flagships: Loewe, Hermès, Chanel. The wealthy district's main artery." },
    { name: "Chueca", area: "Centro", sells: "LGBT-anchored independent retail, design boutiques, late-night bars and restaurants." },
    { name: "Malasaña (Fuencarral)", area: "Centro", sells: "Vintage, indie fashion, record stores, third-wave coffee, the youth scene." },
    { name: "Mercado de San Miguel", area: "Centro", sells: "Iron-and-glass food market: tapas, jamón, vermouth, oysters. Tourist-anchored but real." },
  ],
  "mexico-city": [
    { name: "Avenida Presidente Masaryk", area: "Polanco", sells: "Mexico's premier luxury axis: Louis Vuitton, Cartier, Hermès. The 'Rodeo Drive of Mexico'." },
    { name: "Roma Norte", area: "Cuauhtémoc", sells: "Independent design, third-wave coffee, the densest restaurant cluster in Latin America." },
    { name: "Condesa", area: "Cuauhtémoc", sells: "Boutiques, bookshops, sidewalk restaurants along Amsterdam and Mazatlán." },
    { name: "Centro Histórico (Madero)", area: "Cuauhtémoc", sells: "Pedestrianised colonial street with mid-market fashion, jewellery, the old Casa de los Azulejos." },
    { name: "Santa Fe", area: "Cuajimalpa", sells: "Corporate-tower mall (Centro Santa Fe), Mexico's largest. Office-worker retail at scale." },
  ],
  milan: [
    { name: "Via Montenapoleone", area: "Quadrilatero della Moda", sells: "Italy's most expensive retail: Prada, Versace, Dolce & Gabbana flagships, Bulgari." },
    { name: "Galleria Vittorio Emanuele II", area: "Centro Storico", sells: "19th-century glass-roof arcade: Prada, Louis Vuitton, the historic Savini restaurant." },
    { name: "Brera", area: "Centro Storico", sells: "Design-week ateliers, the Pinacoteca, ceramic and textile galleries, design press." },
    { name: "Navigli", area: "Porta Genova canal district", sells: "Aperitivo bars, antique markets on Sundays, indie fashion along the canals." },
    { name: "Corso Buenos Aires", area: "Porta Venezia", sells: "Mass-market fashion: one of Europe's longest commercial streets by linear retail." },
  ],
  moscow: [
    { name: "Tverskaya Street", area: "Tverskoy District", sells: "Soviet-era main artery: chain retail, the Yeliseyev grocery hall, government-block frontages." },
    { name: "Arbat", area: "Arbat District", sells: "Pedestrianised tourist strip: matryoshka shops, painters, cafés, the original Praga restaurant." },
    { name: "Kuznetsky Most", area: "Meshchansky", sells: "Boutique fashion, the TsUM department store next door, Moscow's bourgeois retail spine." },
    { name: "GUM", area: "Red Square", sells: "Three-level neo-Russian arcade with luxury flagships and the historic Gastronom No.1." },
    { name: "Patriarshiye Prudy", area: "Presnensky", sells: "Wealthy-bohemian dining cluster, boutique cafés around the iconic pond." },
  ],
  mumbai: [
    { name: "Linking Road", area: "Bandra West", sells: "Mid-market fashion, footwear, street stalls plus mall anchors. The Bandra shopping spine." },
    { name: "Colaba Causeway", area: "Colaba, South Mumbai", sells: "Street stalls and curio shops along the heritage causeway. Tourist-anchored haggling commerce." },
    { name: "Crawford Market", area: "Fort, South Mumbai", sells: "Victorian-era wholesale fruit, vegetables, imported goods, exotic pets. The colonial market hall." },
    { name: "Zaveri Bazaar", area: "Bhuleshwar", sells: "India's largest gold and jewellery market: ~7000 retailers and the wholesale price-set point." },
    { name: "Hill Road / Carter Road", area: "Bandra West", sells: "Indie boutiques, beauty parlours, the Hill Road shoe market, sea-front restaurants." },
  ],
  paris: [
    { name: "Champs-Élysées", area: "8th arrondissement", sells: "Luxury flagships: LV vuitton, Dior, plus tourist-heavy mass-market and the historic cafés." },
    { name: "Rue du Faubourg Saint-Honoré", area: "8th", sells: "Hermès flagship, the Élysée Palace neighbours, ultra-high-end boutiques and antique dealers." },
    { name: "Le Marais", area: "3rd & 4th", sells: "Independent fashion, design boutiques, Jewish-quarter delis, queer bars, art galleries." },
    { name: "Saint-Germain-des-Prés", area: "6th", sells: "Bookshops (Hermès's original; Sonia Rykiel), Le Bon Marché department store, literary cafés." },
    { name: "Montmartre (Rue des Abbesses)", area: "18th", sells: "Tourist crêperies, painters' easels, the Place du Tertre, indie boutiques near Sacré-Cœur." },
  ],
  rome: [
    { name: "Via del Corso", area: "Centro Storico", sells: "Long pedestrian artery from Piazza del Popolo: mid-market fashion, the Galleria Alberto Sordi." },
    { name: "Via Condotti", area: "Tridente", sells: "Luxury flagships at the foot of the Spanish Steps: Bulgari, Gucci, Cartier, Hermès." },
    { name: "Trastevere", area: "Trastevere", sells: "Cobblestone restaurant cluster, artisan boutiques, the Sunday Porta Portese market behind it." },
    { name: "Campo de' Fiori", area: "Centro Storico", sells: "Morning food market and night-time bar belt in one of Rome's most lived squares." },
    { name: "Monti", area: "Rione Monti", sells: "Independent fashion ateliers, vintage, the Sunday Mercato Monti craft market." },
  ],
  "san-francisco": [
    { name: "Union Square", area: "Downtown SF", sells: "Macy's, Saks, Apple flagship, the Westfield Centre. SF's historic primary retail core." },
    { name: "Hayes Valley", area: "Hayes Valley", sells: "Design-led independent boutiques, Blue Bottle's flagship, third-wave coffee, ceramic studios." },
    { name: "Valencia Street", area: "Mission District", sells: "Indie boutiques, used bookstores, Latin restaurants, tech-money-meets-bohemian retail." },
    { name: "Chestnut Street", area: "Marina District", sells: "Upmarket boutiques, organic grocers, casual restaurants serving the Marina demographic." },
    { name: "Fillmore Street", area: "Pacific Heights", sells: "Boutique fashion, the historic Fillmore jazz district below, neighbourhood luxury." },
  ],
  "sao-paulo": [
    { name: "Rua Oscar Freire", area: "Jardins", sells: "Brazil's premier luxury axis: Louis Vuitton, Cartier, Daslu legacy. The Jardins paseo." },
    { name: "Vila Madalena", area: "West Zone", sells: "Bohemian bars, art galleries, the Beco do Batman graffiti alley, indie design retail." },
    { name: "Avenida Paulista", area: "Bela Vista", sells: "Skyscraper corridor: MASP museum, Conjunto Nacional, mass-market and bank flagships." },
    { name: "Pinheiros (Rua dos Pinheiros)", area: "Pinheiros", sells: "Restaurant cluster, indie fashion, the Fradique Coutinho Sunday market." },
    { name: "Rua 25 de Março", area: "Centro", sells: "Wholesale market street: textiles, costume jewellery, the Korean-Bolivian importer cluster." },
  ],
  seoul: [
    { name: "Myeongdong", area: "Jung-gu", sells: "K-beauty flagships: Olive Young, Innisfree, Etude. Tourist-anchored cosmetics density." },
    { name: "Gangnam (Apgujeong Rodeo)", area: "Gangnam-gu", sells: "Luxury boutiques, plastic-surgery clinic strips, K-pop entertainment-company offices." },
    { name: "Hongdae", area: "Mapo-gu", sells: "Youth fashion, indie music venues, late-night street food, the university nightlife spine." },
    { name: "Itaewon", area: "Yongsan-gu", sells: "International cuisine, expat-targeted retail, antique furniture row along Itaewon-ro." },
    { name: "Dongdaemun Design Plaza district", area: "Jung-gu", sells: "24-hour wholesale fashion district: garment buyers from across Asia trade overnight." },
  ],
  shanghai: [
    { name: "Nanjing Road", area: "Huangpu / Jing'an", sells: "Pedestrianised eastern half (tourist mass-market) plus West Nanjing's luxury malls (Plaza 66, CITIC)." },
    { name: "Huaihai Road", area: "Xuhui", sells: "Mid-luxury fashion axis: K11, IAPM, iAPM. Less touristy than Nanjing Road." },
    { name: "Xintiandi", area: "Huangpu", sells: "Restored shikumen lanes converted to upscale restaurants, design retail, the Communist Party museum." },
    { name: "Tianzifang", area: "Xuhui", sells: "Maze of converted lane houses: indie boutiques, artist studios, café-bar density." },
    { name: "The Bund (Zhongshan Road)", area: "Huangpu waterfront", sells: "Colonial-era buildings repurposed as luxury (Three on the Bund, Bund 18). Hospitality-anchored retail." },
  ],
  singapore: [
    { name: "Orchard Road", area: "Central", sells: "Continuous luxury-mall corridor: ION, Ngee Ann City, Paragon. Singapore's main retail axis." },
    { name: "Marina Bay Sands (The Shoppes)", area: "Marina Bay", sells: "Casino-resort luxury mall: Chanel duplex, Louis Vuitton island flagship over the bay." },
    { name: "Tanjong Pagar", area: "Outram", sells: "Restored shophouse restaurants, the Korean street cluster, finance-district lunch retail." },
    { name: "Bugis Street", area: "Rochor", sells: "Mass-market fashion and street stalls in a covered market: Singapore's largest budget shopping zone." },
    { name: "Chinatown (Pagoda Street)", area: "Outram", sells: "Souvenir stalls, traditional medicine halls, the Maxwell hawker centre with chicken-rice institutions." },
  ],
  sydney: [
    { name: "Pitt Street Mall", area: "Sydney CBD", sells: "Westfield Sydney plus Strand Arcade: Australia's busiest retail block." },
    { name: "Paddington (Oxford Street)", area: "Eastern Suburbs", sells: "Australian designer boutiques (Zimmermann, Camilla), the Saturday Paddington Markets." },
    { name: "Bondi Beach (Hall Street + Gould Street)", area: "Eastern Beaches", sells: "Surf retail, swimwear flagships, smashed-avo cafés, the Bondi Markets on Sundays." },
    { name: "Newtown (King Street)", area: "Inner West", sells: "Indie bookshops, vintage, vegan restaurants, the live-music alt-scene retail." },
    { name: "Surry Hills (Crown Street)", area: "Inner Sydney", sells: "Design ateliers, third-wave coffee, the Bourke Street Bakery flagship, restaurant density." },
  ],
  tokyo: [
    { name: "Ginza (Chuo-dori)", area: "Chuo", sells: "Department stores (Mitsukoshi, Wako), luxury flagships, the highest land prices in Japan." },
    { name: "Shibuya", area: "Shibuya", sells: "Shibuya 109, Center-gai youth fashion, Shibuya Scramble Square. Mass-volume teen-to-young-adult retail." },
    { name: "Shinjuku", area: "Shinjuku", sells: "Isetan flagship (Japan's #1 department store), Kabukicho nightlife, Lumine for fashion." },
    { name: "Harajuku (Omotesando + Takeshita)", area: "Shibuya", sells: "Two faces: Omotesando's luxury boulevard and Takeshita's teen-subculture street stalls." },
    { name: "Akihabara", area: "Chiyoda", sells: "Electronics, anime, manga, idol shops, maid cafés. The reference market for otaku retail." },
    { name: "Asakusa (Nakamise)", area: "Taito", sells: "Edo-era covered arcade to Sensoji Temple: kimono, sweets, fans, lacquerware. Tourist-heavy." },
  ],
  // ---- Selected tier-2 globally significant commercial cities (25 more) ----
  amsterdam: [
    { name: "Kalverstraat", area: "Centrum", sells: "Pedestrian mass-market: H&M, Zara, the Bijenkorf flagship at one end. Amsterdam's busiest retail." },
    { name: "P.C. Hooftstraat", area: "Oud-Zuid", sells: "Dutch luxury axis: Chanel, Hermès, Louis Vuitton. Short street, the highest rents in NL." },
    { name: "Nine Streets (De Negen Straatjes)", area: "Centrum canals", sells: "Boutiques, vintage, design and antique stores in the canal-belt streets." },
    { name: "Jordaan", area: "West", sells: "Independent galleries, brown cafés, the Noordermarkt Saturday market, design ateliers." },
    { name: "Albert Cuyp Market", area: "De Pijp", sells: "Six-day-a-week outdoor market: stroopwafels, raw herring, textiles, household goods." },
  ],
  bangkok: [
    { name: "Sukhumvit (Asoke / EmQuartier)", area: "Khlong Toei", sells: "Expat-and-tourist retail corridor along the Skytrain: malls, hotel arcades, restaurants." },
    { name: "Siam Square (Siam Paragon)", area: "Pathum Wan", sells: "Mid-luxury malls clustered around Siam BTS: Paragon, Discovery, Center. Bangkok's main shopping hub." },
    { name: "Chatuchak Market", area: "Chatuchak", sells: "World's largest weekend market: 8,000 stalls. Clothing, antiques, plants, street food, art." },
    { name: "Silom / Patpong", area: "Bang Rak", sells: "Office-worker retail by day, night market and bars after dark along Patpong." },
    { name: "Yaowarat (Chinatown)", area: "Samphanthawong", sells: "Gold shops, traditional medicine, the famous nighttime street-food cluster." },
  ],
  bogota: [
    { name: "Zona Rosa (Zona T)", area: "Chapinero Alto", sells: "Bogotá's nightlife and luxury triangle: Andino mall, restaurants, designer boutiques." },
    { name: "Usaquén", area: "North Bogotá", sells: "Colonial plaza with restaurants and the Sunday flea market: crafts, antiques, food trucks." },
    { name: "Chapinero (Calle 53)", area: "Chapinero Central", sells: "Mass-market retail, the original Bogotá department-store cluster, midmarket fashion." },
    { name: "La Candelaria", area: "Centro Histórico", sells: "Bookshops, traditional craft stalls, emerald dealers (Avenida Jiménez), tourist-anchored." },
    { name: "Parque 93 area", area: "Chicó", sells: "Upmarket restaurants and boutique retail around the park: corporate-class lunch cluster." },
  ],
  boston: [
    { name: "Newbury Street", area: "Back Bay", sells: "Brownstone boutiques: contemporary fashion, the Apple Store, Boston's primary upscale strip." },
    { name: "Faneuil Hall / Quincy Market", area: "Downtown", sells: "Federal-era market hall: souvenir retail, food stalls, street performers. Tourist-heavy." },
    { name: "Charles Street", area: "Beacon Hill", sells: "Gas-lamp lined antique stores, design boutiques, neighbourhood restaurants." },
    { name: "Harvard Square", area: "Cambridge", sells: "Bookstores, college retail, the Coop, third-wave coffee, the Harvard Yard tourist anchor." },
    { name: "Seaport (Seaport Blvd)", area: "South Boston", sells: "New mixed-use district: Lululemon, L.L. Bean flagship, biotech-anchored office retail." },
  ],
  "buenos-aires": [
    { name: "Calle Florida", area: "San Nicolás", sells: "Pedestrian artery from Plaza de Mayo: Galerías Pacífico, mid-market fashion, dollar-exchange touts." },
    { name: "Palermo Soho", area: "Palermo", sells: "Argentine designer fashion, leather goods, boho cafés around Plaza Serrano." },
    { name: "Avenida Santa Fe", area: "Recoleta / Palermo", sells: "Mid-market chain retail and the historic Galerías Pacífico flagship district." },
    { name: "Recoleta", area: "Recoleta", sells: "Luxury boutiques, the Patio Bullrich mall, the famous cemetery's tourist trail." },
    { name: "San Telmo (Defensa)", area: "San Telmo", sells: "Sunday antique fair, tango bars, cobblestone-lined design retail and used books." },
  ],
  cairo: [
    { name: "Khan el-Khalili", area: "Islamic Cairo", sells: "Medieval souk: copperware, spices, lanterns, gold. Egypt's most famous tourist bazaar." },
    { name: "Zamalek (26th of July)", area: "Gezira Island", sells: "Upscale boutiques, design galleries, embassy-row restaurants on the island." },
    { name: "Maadi (Road 9)", area: "Maadi", sells: "Expat-favoured retail: boutiques, restaurants, cafés serving the leafy southern district." },
    { name: "Downtown (Talaat Harb)", area: "Wust al-Balad", sells: "1930s arcades: traditional tailors, the Groppi café, mid-market fashion, bookshops." },
    { name: "Mohandessin (Arab League Street)", area: "Giza", sells: "Mid-class chain retail, fast-food density, fashion arcades, and salon row." },
  ],
  "cape-town": [
    { name: "Long Street", area: "City Centre", sells: "Backpacker bars, second-hand books, vintage clothing, the historic Victorian shopfronts." },
    { name: "V&A Waterfront", area: "Waterfront", sells: "Harbour-side mall complex: luxury flagships, the African Trading Port craft retailers." },
    { name: "Bree Street", area: "City Centre", sells: "Design boutiques, restaurants (La Tête, Chefs Warehouse), Cape Town's hippest retail strip." },
    { name: "Kloof Street", area: "Gardens", sells: "Independent fashion, boutique hotels, restaurants. Foothills of Table Mountain commerce." },
    { name: "Sea Point Promenade (Main Road)", area: "Sea Point", sells: "Mid-market retail with kosher and Israeli food clusters, ocean-front bars." },
  ],
  copenhagen: [
    { name: "Strøget", area: "Indre By", sells: "One of Europe's longest pedestrian streets: Illum, Magasin, plus luxury (Hermès) and mid-market." },
    { name: "Jægersborggade", area: "Nørrebro", sells: "Indie design, ceramics ateliers, Relæ restaurant's neighbourhood, third-wave coffee." },
    { name: "Vesterbro (Istedgade)", area: "Vesterbro", sells: "Former red-light street now lined with hip restaurants, boutique fashion, the meatpacking district." },
    { name: "Nyhavn", area: "Indre By harbour", sells: "Restaurant-and-bar row on the colourful canal façades. Tourist-heavy waterfront dining." },
    { name: "Torvehallerne", area: "Nørreport", sells: "Modern indoor food market: artisan butcher, smørrebrød, oysters, specialty grocers." },
  ],
  dublin: [
    { name: "Grafton Street", area: "City Centre", sells: "Pedestrian retail spine: Brown Thomas (luxury), Marks & Spencer, busker performances." },
    { name: "Henry Street", area: "North Inner City", sells: "Arnotts and Penneys (Primark's flagship store), mass-market fashion across the Liffey." },
    { name: "Temple Bar", area: "Temple Bar", sells: "Cobbled tourist quarter: pubs, the Saturday Food Market, vintage clothing, music shops." },
    { name: "South William Street + Drury Street", area: "City Centre", sells: "Indie boutiques, the Powerscourt Centre arcade, design retail and bistros." },
    { name: "Dawson Street", area: "City Centre", sells: "Bookshops (Hodges Figgis), boutique hotels, the Mansion House's neighbourhood retail." },
  ],
  istanbul: [
    { name: "İstiklal Caddesi", area: "Beyoğlu", sells: "Tram-and-pedestrian boulevard from Taksim to Tünel: mass-market fashion, bookshops, restaurants." },
    { name: "Grand Bazaar (Kapalıçarşı)", area: "Fatih", sells: "4,000-shop covered market: gold, carpets, ceramics, lanterns. One of the world's oldest covered bazaars." },
    { name: "Nişantaşı", area: "Şişli", sells: "Istanbul's luxury district: Vakko, Beymen department store, international flagships." },
    { name: "Karaköy", area: "Beyoğlu", sells: "Design boutiques, third-wave coffee, the Karaköy Lokantası, hip restaurants on the Golden Horn." },
    { name: "Bağdat Caddesi", area: "Kadıköy (Asian side)", sells: "10 km of mid-luxury retail and restaurant-lined boulevard on the Anatolian side." },
  ],
  jakarta: [
    { name: "Sudirman / Thamrin", area: "Central Jakarta", sells: "Skyscraper-spine: Plaza Indonesia, Grand Indonesia, the corporate-district malls." },
    { name: "Senayan", area: "South Central Jakarta", sells: "Plaza Senayan + Senayan City: Jakarta's top luxury mall cluster." },
    { name: "Kemang", area: "South Jakarta", sells: "Expat-favoured restaurants, boutique fashion, design galleries in the leafy southern district." },
    { name: "Menteng", area: "Central Jakarta", sells: "Colonial-era residential turned upscale dining and antique-retail district." },
    { name: "Tanah Abang", area: "Central Jakarta", sells: "Southeast Asia's largest textile wholesale market: garment-trade hub for the entire archipelago." },
  ],
  johannesburg: [
    { name: "Sandton City + Nelson Mandela Square", area: "Sandton", sells: "Africa's premier luxury mall complex. Louis Vuitton, the JSE next door." },
    { name: "Maboneng", area: "Inner City", sells: "Regenerated industrial blocks: design boutiques, Sunday Market on Main, restaurants and galleries." },
    { name: "Rosebank (The Mall + Zone)", area: "Northern Suburbs", sells: "Mid-luxury mall, the Sunday Rosebank Art & Craft Market, restaurant-and-cinema cluster." },
    { name: "Melville (7th Street)", area: "Northern Suburbs", sells: "Bohemian retail: indie bookshops, vintage, bistros, university-neighbourhood bars." },
    { name: "Parkhurst (4th Avenue)", area: "Northern Suburbs", sells: "Tree-lined upmarket high street: restaurants, design boutiques, leafy residential commerce." },
  ],
  karachi: [
    { name: "Tariq Road", area: "PECHS", sells: "Mid-market fashion, the original Karachi shopping street: textiles, salons, bridal lehengas." },
    { name: "Zamzama", area: "DHA Phase V", sells: "Upmarket fashion (Sapphire, Khaadi), restaurants, the wealthy-district's main retail boulevard." },
    { name: "Saddar (Empress Market)", area: "Saddar Town", sells: "Colonial-era market plus the surrounding wholesale lanes: electronics, books, hardware." },
    { name: "Clifton (Boat Basin / Park Towers)", area: "Clifton", sells: "Mall-and-restaurant cluster facing the Arabian Sea. Mid-luxury fashion, family-style dining." },
    { name: "Bahadurabad", area: "Karachi East", sells: "Dense mid-market retail belt: clothing, shoes, the Bahadurabad food street." },
  ],
  "kuala-lumpur": [
    { name: "Bukit Bintang", area: "Central KL", sells: "Pavilion KL, Lot 10, Sungei Wang. KL's primary mall corridor and tourist shopping spine." },
    { name: "KLCC (Suria KLCC)", area: "City Centre", sells: "Petronas Towers mall: Louis Vuitton, Cartier, Aquaria attraction. KL's luxury anchor." },
    { name: "Petaling Street (Chinatown)", area: "City Centre", sells: "Covered market street: knockoff fashion, watches, dim-sum stalls, Hokkien mee institutions." },
    { name: "Bangsar (Telawi)", area: "Bangsar Baru", sells: "Expat-favoured bars and restaurants, indie boutiques, the Bangsar Village mall." },
    { name: "Mid Valley + The Gardens", area: "Mid Valley", sells: "Family mid-market and luxury malls under one roof. Malaysia's busiest mall complex." },
  ],
  lisbon: [
    { name: "Avenida da Liberdade", area: "Santo António", sells: "Luxury flagships along the Paris-style boulevard: Louis Vuitton, Gucci, Prada." },
    { name: "Chiado", area: "Santa Maria Maior", sells: "Historic literary quarter: bookshops, A Brasileira café, fashion in restored 19th-c. buildings." },
    { name: "Bairro Alto", area: "Misericórdia", sells: "Night-time bar district by night, indie fashion and design boutiques by day." },
    { name: "LX Factory", area: "Alcântara", sells: "Converted industrial complex: independent shops, restaurants, the iconic Ler Devagar bookshop." },
    { name: "Príncipe Real", area: "Misericórdia", sells: "Embassy-row turned design district: concept stores, the Embaixada gallery-mall, ceramics ateliers." },
  ],
  manila: [
    { name: "Ayala Avenue / Makati CBD", area: "Makati", sells: "Greenbelt, Glorietta, Power Plant. The Philippines' top mall cluster in the finance district." },
    { name: "Bonifacio High Street", area: "Bonifacio Global City (Taguig)", sells: "Open-air upmarket retail spine in BGC: Uniqlo, indie boutiques, restaurants." },
    { name: "Quiapo", area: "City of Manila", sells: "Wholesale fabric, religious goods around Quiapo Church, electronics in Raon, Filipino street food." },
    { name: "Greenhills Shopping Center", area: "San Juan", sells: "Tiangge bazaar pearls, knockoff bags, mobile phones. Filipino-Chinese trader hub." },
    { name: "Divisoria (168 Mall, Tutuban)", area: "City of Manila", sells: "Wholesale clothing, accessories, toys. The Philippines' largest informal-economy retail zone." },
  ],
  melbourne: [
    { name: "Bourke Street Mall", area: "Melbourne CBD", sells: "Pedestrian retail core: Myer, David Jones flagships, the Royal Arcade just behind." },
    { name: "Chapel Street", area: "South Yarra / Prahran", sells: "Australian designer boutiques, vintage, bars, the Prahran Market food hall." },
    { name: "Fitzroy (Brunswick Street)", area: "Fitzroy", sells: "Bohemian indie fashion, record stores, brunch cafés, the alt-Melbourne reference street." },
    { name: "Collins Street", area: "Melbourne CBD", sells: "'Paris End' luxury: Chanel, Hermès. Bank and corporate-tower retail at the east end." },
    { name: "Queen Victoria Market", area: "CBD north edge", sells: "150-year-old open market: deli, produce, the Wednesday night summer-market food stalls." },
  ],
  montreal: [
    { name: "Rue Sainte-Catherine", area: "Downtown", sells: "Eaton Centre, the underground city anchors, mid-market fashion. Montreal's main retail axis." },
    { name: "Avenue du Mont-Royal", area: "Plateau-Mont-Royal", sells: "Indie boutiques, second-hand bookshops, vegan restaurants, the Plateau's main spine." },
    { name: "Old Montreal (Saint-Paul / Notre-Dame)", area: "Vieux-Montréal", sells: "Restored cobblestone tourist quarter: galleries, restaurants, boutique hotels." },
    { name: "Mile End (Saint-Viateur + Bernard)", area: "Le Plateau", sells: "Bagel bakeries (St-Viateur, Fairmount), indie fashion, the Ubisoft-creative-class retail." },
    { name: "Boulevard Saint-Laurent", area: "Plateau / Mile End", sells: "Long anglo-franco-Jewish corridor: Schwartz's deli, design boutiques, dive bars, fashion." },
  ],
  munich: [
    { name: "Kaufingerstraße + Neuhauser Straße", area: "Altstadt", sells: "Mass-market pedestrian retail from Karlsplatz to Marienplatz: H&M, Galeria Kaufhof, Hirmer." },
    { name: "Maximilianstraße", area: "Altstadt", sells: "Munich's luxury axis: Chanel, Cartier, Bulgari. Modeled on Vienna's Ringstraße boulevards." },
    { name: "Schwabing (Leopoldstraße)", area: "Schwabing", sells: "University-quarter retail, bars, the Münchner Freiheit nightlife cluster." },
    { name: "Glockenbachviertel", area: "Ludwigsvorstadt-Isarvorstadt", sells: "LGBT-anchored indie retail, design boutiques, Munich's hippest neighbourhood." },
    { name: "Viktualienmarkt", area: "Altstadt", sells: "Daily food market in the old town: cheese, charcuterie, fish, the beer garden at the centre." },
  ],
  nairobi: [
    { name: "Westlands", area: "Westlands", sells: "Mall cluster (Sarit, Westgate, The Mall, ABC), expat restaurants, tech-startup ground floors." },
    { name: "Karen (Karen Country Club area)", area: "Karen", sells: "Upmarket boutiques, garden centres, the Karen Blixen Coffee House and craft markets." },
    { name: "Kilimani / Yaya Centre", area: "Kilimani", sells: "Mid-class retail mall plus the surrounding restaurant-and-bar cluster on Argwings Kodhek." },
    { name: "Maasai Market (rotating venues)", area: "Citywide", sells: "Open-air craft market rotating between locations (Village Market, Hilton, Westgate): Maasai jewellery, kikoy, kanga, soapstone." },
    { name: "CBD (Kenyatta Avenue / Tom Mboya)", area: "Central Nairobi", sells: "Matatu-anchored mass-market retail, the City Market, mobile-phone strips, banks." },
  ],
  riyadh: [
    { name: "Olaya Street", area: "Olaya", sells: "Riyadh's main commercial spine: Kingdom Centre and Al Faisaliah mall flagships." },
    { name: "Tahlia Street (Prince Mohammed)", area: "Olaya", sells: "Restaurant row, mid-luxury boutiques, the post-2017 Vision 2030 entertainment cluster." },
    { name: "Diplomatic Quarter (DQ)", area: "DQ", sells: "Embassy-precinct retail: cafés, low-rise plazas, the souk-style Tuesday market." },
    { name: "Al-Bujairi (At-Turaif)", area: "Diriyah", sells: "UNESCO mud-brick old town redeveloped as restaurant-and-boutique district. New tourist anchor." },
    { name: "Boulevard / Riyadh Season venues", area: "Various", sells: "Seasonal entertainment zones with pop-up retail launched under Vision 2030 reforms." },
  ],
  toronto: [
    { name: "Bloor-Yorkville (Mink Mile)", area: "Yorkville", sells: "Canada's luxury axis: Louis Vuitton, Holt Renfrew flagship, Tiffany. Highest retail rents in the country." },
    { name: "Queen Street West", area: "Downtown West", sells: "Indie fashion, vintage, the Drake Hotel anchor, Trinity Bellwoods Park's retail spine." },
    { name: "King West", area: "Downtown West", sells: "Restaurant-and-bar district by night, the TIFF/Bell Lightbox cinema, business-lunch crowd by day." },
    { name: "Kensington Market", area: "Downtown West", sells: "Pedestrianised market quarter: vintage, Caribbean grocers, vegan cafés, a counterculture mainstay." },
    { name: "Eaton Centre + Yonge-Dundas", area: "Downtown core", sells: "Canada's busiest mall (CF Eaton Centre) plus the surrounding Yonge Street mid-market retail." },
  ],
  vienna: [
    { name: "Kärntner Straße", area: "Innere Stadt", sells: "Pedestrian retail from Staatsoper to Stephansplatz: mid-luxury, the Steffl department store." },
    { name: "Graben + Kohlmarkt", area: "Innere Stadt", sells: "Vienna's luxury axis: Chanel, Louis Vuitton, the historic Demel patisserie." },
    { name: "Mariahilferstraße", area: "Mariahilf", sells: "Vienna's longest shopping street: H&M, Peek & Cloppenburg, mass-market mid-belt." },
    { name: "Naschmarkt", area: "Mariahilf / Wieden", sells: "Open-air market: Levantine grocers, fish, the Saturday flea market at the western end." },
    { name: "Spittelberg", area: "Neubau", sells: "Cobbled Biedermeier lanes: indie boutiques, the Christmas market in December, neighbourhood restaurants." },
  ],
  zurich: [
    { name: "Bahnhofstraße", area: "Kreis 1", sells: "One of the world's most expensive shopping streets: luxury watches, jewellery, Sprüngli." },
    { name: "Niederdorf", area: "Altstadt", sells: "Old-town lanes east of the Limmat: indie boutiques, restaurants, the cathedral's tourist trail." },
    { name: "Zürich-West (Im Viadukt)", area: "Kreis 5", sells: "Repurposed rail viaduct arches: design boutiques, food market, hip restaurants." },
    { name: "Langstraße", area: "Kreis 4", sells: "Zurich's vice-and-design street: bars, indie fashion, the Hürlimann brewery cluster." },
    { name: "Seefeld (Seefeldstraße)", area: "Kreis 8", sells: "Lakeside upmarket retail: boutiques, design ateliers, neighbourhood restaurants along the Seestrasse." },
  ],
};

let added = 0;
let alreadyExisted = 0;

for (const [slug, streets] of Object.entries(STREETS)) {
  const existing = data.cities[slug];
  if (existing && Array.isArray(existing.commercial_streets) && existing.commercial_streets.length > 0) {
    alreadyExisted++;
    continue;
  }
  if (existing) {
    existing.commercial_streets = streets;
  } else {
    data.cities[slug] = { commercial_streets: streets };
  }
  added++;
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf-8");
console.log(`Wrote ${added} new city commercial-streets entries; ${alreadyExisted} already had data.`);
console.log(`Total cities in file: ${Object.keys(data.cities).length}.`);
