# Commuter, Tourism, and Neighborhood-Anomaly Framework

**Date:** 2026-05-25
**Status:** Strategy memo + concrete schemas. Pending founder approval for implementation.
**Audience:** Margin Atlas founder + future implementation agent.

---

## 0. The decision we are actually trying to support

Someone with capital wants to open a **pharmacy** or **pet shop** in some city. Right now the Margin Atlas cell page tells them: "median revenue per firm for pharmacies in {city} is ${N}." That number collapses five different customer realities into one figure:

1. **Residents** — staple, recurring spend, low margin per visit, high frequency.
2. **Daytime commuters** — convenience + lunch + before-and-after-work spend, no weekend spend.
3. **Tourists** — impulse + premium + travel-essential spend, no recurring.
4. **Wealth concentration** — same activity priced 2-3× higher, smaller volume, higher margin.
5. **Anomaly zones** — financial CBD, luxury district, free zone, university, embassy quarter, etc. — each with a sector-specific multiplier.

A city-level median tells the operator nothing about WHICH of these five mixes will land at their actual storefront. A pharmacy in Manhattan-Midtown lives off commuter pickup + tourist sundries; a pharmacy in Brooklyn-Brownsville lives off Medicaid scripts + family-pack hygiene; they share a "Manhattan pharmacy" benchmark today.

**The end-state we want:** the cell page (or a new decision wizard) lets the operator see, for a chosen activity in a chosen city, the **3-5 best neighborhoods to open in**, ranked by expected net margin per dollar of opening capital, with a one-line rationale ("commuter-heavy, +30% revenue, +50% rent, net +15%").

This memo lays out the data, the math, the schemas, and the integration path to get there.

---

## 1. Commuter intensity

### 1.1 Definition

`commuter_intensity = daytime_population / nighttime_residential_population` per neighborhood.

Roughly equivalent to ACS's "employment-to-residence ratio." Values:

| Value | Means | Examples |
|---|---|---|
| 5.0+ | Pure CBD, almost no residents | Wall Street, Marunouchi, La Défense |
| 2.0-5.0 | Strong commuter pull | Midtown Manhattan, City of London, Chiyoda Tokyo |
| 1.2-2.0 | Office-mixed, some residential | Bishopsgate, Shibuya, SoMa SF |
| 0.9-1.2 | Balanced | Most middle neighborhoods |
| 0.5-0.9 | Residential pull | Suburban + family neighborhoods |
| < 0.5 | Pure bedroom | Outer-ring suburbs, dormitory towns |

### 1.2 Data sources

| Country tier | Source | Granularity | Update |
|---|---|---|---|
| US | LEHD LODES Origin-Destination Employment Statistics | Census Block | Annual |
| EU | Eurostat commuting tables + national stats (UK ONS, FR INSEE Mobilités, DE Destatis Pendlerstatistik, IT ISTAT) | LAU / NUTS-3 | 2-5 year cycle |
| Japan | e-Stat commuting flow data | Municipality | 5-year census |
| Canada | StatCan Journey to Work | Census Tract | 5-year census |
| Australia | ABS Census Place of Work | SA2 | 5-year census |
| Brazil, Mexico, India, China | National census commuting tables — coverage uneven, often only metro-level | Municipality | 10-year census |
| Rest of world | Limited — bucket per metro from secondary sources (rough estimate or "N/A") | City | Annual or static |

**Coverage realistic:** ~30 cities with high-quality block-level data; ~80 cities with municipality-level; remaining tier-2/3 cities use a regional-default fallback (commuter_intensity = 1.0 — assume balanced).

### 1.3 Revenue multiplier per activity

For each activity, a **commuter elasticity** β_commuter is hand-curated. The revenue multiplier at neighborhood level is:

```
revenue_mult_commuter = 1 + β_commuter * (clip(commuter_intensity, 0.3, 5.0) - 1.0) / 1.5
```

Hand-curated betas for common SMB activities:

| Activity | β_commuter | Why |
|---|---|---|
| cafes_coffee | +0.45 | Morning rush + lunch demand is enormous in CBDs |
| restaurants (sit-down) | +0.15 | Lunch trade real, but commuter doesn't pay weekend rent |
| fast_casual | +0.55 | Pure commuter-lunch activity |
| pizzerias | +0.10 | Mostly resident; some lunch slices |
| bars_nightclubs | -0.20 | Commuter leaves at 7pm; bars need residents |
| pharmacies_drug_stores | +0.30 | Forgotten prescription, headache pills, travel-meds |
| grocery_stores | -0.40 | Commuter doesn't shop for groceries away from home |
| dry_cleaning_laundry | +0.50 | Drop-off morning, pickup evening |
| barbershops | -0.10 | Mild; weekend appointments dominate |
| nail_salons | -0.15 | Same; recurring local clients |
| hair_salons_full | -0.05 | Slight residential bias |
| residential_cleaning | -0.60 | Pure residential market |
| auto_repair_shops | -0.30 | Mostly resident car-owners |
| dental_practices | -0.40 | Residents register with local dentist |
| doctors_clinics | -0.35 | Same |
| jewelry_stores | +0.10 | Some commuter impulse buys (anniversary, gift) |
| clothing_stores | +0.20 | Lunch-hour shopping in CBDs is real |
| bookstores_indie | +0.15 | Lunch break browsing |
| fitness_gyms | +0.20 | Pre-work + post-work commuter usage real |
| accounting_tax | +0.50 | B2B service, follows businesses, not residents |
| legal_services | +0.40 | Same |
| it_services_msp | +0.50 | Same |
| real_estate_agencies | -0.10 | Hyper-local |
| childcare_daycare | -0.50 | Pure residential |

For activities not in the table, default β = 0 (commuter-neutral).

### 1.4 Schema

`data/economics/commuter_intensity_v1.json`

```json
{
  "version": "1.0.0",
  "convention": {
    "unit": "ratio_daytime_pop_over_resident_pop",
    "neighborhood_keying": "city_slug + neighborhood_slug",
    "fallback_when_unmeasured": 1.0
  },
  "neighborhoods": {
    "new-york__manhattan-midtown": {
      "commuter_intensity": 4.7,
      "daytime_pop": 950000,
      "resident_pop": 202000,
      "year": 2023,
      "source_quality": "A"
    },
    "new-york__manhattan-fidi": {
      "commuter_intensity": 6.2,
      "daytime_pop": 410000,
      "resident_pop": 66000,
      "year": 2023,
      "source_quality": "A"
    },
    "new-york__brooklyn-williamsburg": {
      "commuter_intensity": 1.4,
      "year": 2023,
      "source_quality": "A"
    }
    // ...
  },
  "city_defaults": {
    "new-york": 1.5,
    "london": 1.4,
    "tokyo": 1.3
    // for neighborhoods within these cities that aren't measured
  }
}
```

`src/lib/economics/commuter_elasticity.ts` exports `ACTIVITY_COMMUTER_BETA: Record<industry_id, number>` and `commuterRevenueMultiplier(industryId, intensity) -> number`.

---

## 2. Tourism intensity

### 2.1 Definition

`tourism_intensity = annual_tourist_visits / resident_population` per neighborhood.

Two flavors:
- **Overnight tourists** (stayed in a hotel/Airbnb in this neighborhood)
- **Day-trip visitors** (went to this neighborhood but slept elsewhere)

For the revenue model we use the SUM. Day-trippers count because they buy.

| Value | Means | Examples |
|---|---|---|
| 50+ | Tourism is the economy | Las Ramblas, Times Square, Marrakech Medina, Patong Beach |
| 20-50 | Major tourism layer | South Bank London, Le Marais Paris, Asakusa Tokyo |
| 5-20 | Mixed | Greenwich Village, Camden, Shibuya |
| 1-5 | Slight tourism layer | Most major-city downtowns |
| < 1 | Negligible | Pure residential or industrial zones |

### 2.2 Data sources

| Country tier | Source | Granularity | Update |
|---|---|---|---|
| US | NYC OpenData (visitor stats), STR hotel bednights, TripAdvisor POI density (proxy) | District / zip | Annual |
| EU | National tourism offices (UK VisitBritain, FR Atout France, IT ENIT, ES Turespaña) + city tourism boards | District | Annual |
| Japan | JNTO Tourism Statistics + Tokyo Metropolitan Government | Ward | Annual |
| Other major | National tourism ministry — uneven granularity | City | Annual |
| Tier-2/3 cities | Hand-curated estimates from Foursquare check-in density, Instagram hashtag volume | City | Static / 2-year |

**Coverage realistic:** ~50 cities with district-level; ~150 with city-level; remaining = "estimate from tier" using the founder's existing tourism rule (tier 1 / tier 2 / tier 3 divisors).

### 2.3 Revenue multiplier per activity

```
revenue_mult_tourism = 1 + β_tourism * log10(clip(tourism_intensity, 0.1, 100) + 1)
```

Logarithm because the marginal effect of additional tourism flattens quickly (a Times Square restaurant doesn't double in revenue when you double tourist count — it's already at capacity).

Hand-curated betas:

| Activity | β_tourism | Why |
|---|---|---|
| restaurants | +0.50 | Tourists eat 2-3x more frequently than locals (no home kitchen) |
| sit_down_restaurants | +0.55 | Same; sit-down is the tourist choice |
| fast_casual | +0.20 | Tourists prefer experience over fast |
| cafes_coffee | +0.40 | Resting spots between sightseeing |
| ice_cream_shops | +0.80 | Pure tourism activity in most cities |
| pizzerias | +0.35 | Easy default tourist food |
| bars_nightclubs | +0.45 | Nightlife districts driven by tourism |
| pharmacies_drug_stores | +0.40 | Travel-essentials, sun care, allergies — huge in tourist zones |
| grocery_stores | -0.10 | Tourists don't buy groceries |
| clothing_stores | +0.25 | Tourist apparel + souvenir clothing |
| jewelry_stores | +0.30 | Premium tourist purchases (especially Italy/UAE/Switzerland) |
| florist_shops | -0.10 | Resident-driven |
| bookstores_indie | +0.20 | Tourist-friendly especially for guidebooks |
| photography_studios | +0.15 | Tourist portrait services |
| hair_salons | -0.20 | Locals only |
| dental_practices | -0.30 | Locals only |
| auto_repair_shops | -0.40 | Pure resident market |
| hotels_lodging | +0.90 | Definitional — this is tourism |
| bnbs | +1.10 | Strongly tourist-driven, log of tourism is the demand curve |
| travel_agencies | +0.50 | Inbound and outbound traffic |
| event_production | +0.20 | Some weddings + tourist events |
| pet_stores | -0.30 | Pure resident market — important for our pharmacy/pet-shop example |
| pet_daycare | -0.50 | Pure resident |
| childcare_daycare | -0.60 | Pure resident |

For activities not in the table, default β = 0 (tourism-neutral).

### 2.4 The compensation question

**Does tourism revenue offset higher rent + tax burden in tourism-hot zones? Mostly no.**

The math, taking Times Square restaurant as an extreme case:
- Revenue per sqft: ~3.5× a residential NYC restaurant ($1,400 vs $400)
- Rent per sqft: ~8× ($2,500 vs $300 in outer Manhattan)
- Property tax: ~6× (commercial overlay)
- Labor premium: ~1.4× (Times Square restaurant minimum wage premium + premium for English-speaking tourist-facing staff)

Net operating margin for a Times Square restaurant: typically **0-8%**, while a Brooklyn Heights restaurant clears **10-18%**.

**The exception**: quasi-luxury tourism activities where unit margins are high enough to absorb rent — jewelry, watches, designer fashion, fine dining, sightseeing experiences. Bond Street jewelry shops or Avenue Montaigne boutiques have higher net margins than residential-area equivalents because the gross margin on a $20K watch absorbs $50K/month rent fine.

**For pharmacy specifically**: tourist pharmacies sell 3-5× the cosmetics, sun care, and travel-meds. Net margin in tourist-zone pharmacies is GENERALLY positive vs residential, because pharmacy fixed costs are low and the impulse-buy margin is huge. Las Ramblas Farmàcia is a goldmine.

**For pet shop specifically**: tourist multiplier is NEGATIVE. Pet shops live off recurring local customers buying food + grooming. A tourist zone pet shop is a worse bet than a residential one.

**Operational rule** that should land in the model: tourism multiplier on revenue is real, but the model must ALSO apply a **rent multiplier** based on the same neighborhood tags, and the user-facing answer is **net margin** not gross revenue. Otherwise the model lies in the direction of "open in Times Square."

---

## 3. Neighborhood-anomaly framework

Each neighborhood gets ONE OR MORE tags from this list. Tags compose: Manhattan-Midtown is `tourist + financial_cbd + transit_hub`.

| Tag | Definition | Revenue effect | Examples |
|---|---|---|---|
| `financial_cbd` | Banking + corporate HQ density; ratio of finance/legal/consulting payroll > 30% of district payroll | Lunch service +200%, printing/courier +400%, groceries -50% (no residential), pharmacies +120% (workers grab meds at lunch) | Wall Street, Canary Wharf, La Défense, Marunouchi |
| `tourist_zone` | Annual tourist count > 10× resident pop | See §2 — varies by activity | Times Square, Las Ramblas, Marrakech Medina |
| `luxury_district` | Median household wealth in top decile + retail rent in top 5% of city | Jewelry/watch/designer +300%; baseline activities priced 2-3×; pet-grooming + premium services very strong | Fifth Avenue, Bond Street, Ginza, Avenue Montaigne, Rodeo Drive |
| `free_economic_zone` | Special tax + customs regime; foreign-invested business density high | International logistics +150%, premium retail +100%, fintech / regtech services strong | Shenzhen FEZ, Dubai DIFC, Singapore CBD, Shanghai FTZ |
| `university_district` | Full-time student population > 15% of district resident pop | Cheap restaurants +200%, bars +180%, bookstores +120%, premium services -50% | Latin Quarter Paris, Coyoacán Mexico City, Cambridge MA |
| `industrial_park` | Manufacturing + warehousing payroll > 50% of district payroll, residential pop very low | Canteen-style food +100%, parts retail +80%, personal services -90% | Tama Tokyo, Industriegebiet Munich, Edogawa east |
| `tech_corridor` | High software/IT payroll density + high tertiary education | Premium cafes +150%, premium fitness +130%, pet shops +80% (young high-earner dog owners), residential rents climbing | SoMa SF, Shoreditch, Cyberjaya, Roppongi Hills |
| `embassy_quarter` | Foreign mission + expat consulate density; international schools nearby | International groceries (Whole Foods / Carrefour Bio) +200%, premium services +150%, international schools +400% | Mayfair London, Marolles Brussels, Hiroo Tokyo |
| `medical_cluster` | Hospital + clinic + medical research density > 25% of district payroll | Pharmacies +180%, cafes +120%, simple food +130% | Texas Medical Center Houston, UCSF zone SF, Charité Berlin |
| `transit_hub` | Major rail / metro / airport interchange with daily transit pop > 200K | Convenience +200%, coffee +180%, magazines/newsstand +250%, sit-down restaurants -50% | Shinjuku Station, Châtelet-Les Halles, King's Cross |
| `gentrifying_edge` | Rents climbing >10% YoY for 3+ years; new SMB opening rate top quartile | First-mover restaurants +50-200%, but late entrants and staid concepts -50% | Williamsburg, Kreuzberg, Lisbon Beato, Detroit Corktown |
| `nightlife_zone` | Bar + club density top 5% of city; weekend foot traffic 2× weekday | Bars +250%, fast food +180%, late-night taxi/rideshare +200%, residential services suppressed by noise | Roppongi, Soho London, El Born Barcelona, Itaewon Seoul |
| `religious_pilgrimage` | Annual pilgrim count > 100K AND > 10× resident pop | Religious goods +500%, modest fashion +200%, vegetarian/halal/kosher restaurants +200% | Old Jerusalem, Vatican, Varanasi, Karbala |
| `tax_haven_office` | Special holding-vehicle regime AND foreign HQ density | Premium legal +300%, premium accounting +250%, NO retail effect | Luxembourg City CBD, Zug, BVI Road Town, Cayman George Town — note: founder rule excludes these from the SMB benchmark, so we tag them and SUPPRESS rendering |
| `residential_only` | Default — no special tags apply | Pure residential mix, baseline applies | Most middle neighborhoods worldwide |

### 3.1 Composition rule

For a neighborhood with multiple tags, the final multiplier is the **product** of each tag's multiplier for the activity in question, capped at ±4×:

```
neighborhood_multiplier(activity, tags) = clip(
  product(tag_multiplier(activity, tag) for tag in tags),
  0.25, 4.0
)
```

The cap prevents "luxury + tourist + transit_hub" cascading to absurd numbers.

---

## 4. Granular framework for cities like NYC

The current `α-macro 5-borough` scheme treats Manhattan as one block. That's a 10-20× revenue gap inside one bucket. Granular Manhattan (this is the founder's "central disproportional" concern):

| Sub-zone | Tags | Pharmacy revenue multiplier vs NYC median |
|---|---|---|
| Manhattan / FiDi | financial_cbd, tourist_zone (light), transit_hub | ~1.6× |
| Manhattan / Midtown East | financial_cbd, tourist_zone, transit_hub, embassy_quarter (UN) | ~1.8× |
| Manhattan / Midtown West (Times Square area) | tourist_zone (heavy), nightlife_zone, transit_hub | ~2.2× |
| Manhattan / Upper East Side | luxury_district, residential | ~2.5× (premium pharmacy) |
| Manhattan / Upper West Side | residential, luxury_district (light) | ~1.4× |
| Manhattan / Harlem | residential, gentrifying_edge | ~0.9× |
| Manhattan / Chelsea | nightlife_zone, gentrifying_edge | ~1.2× |
| Manhattan / SoHo + Tribeca | tourist_zone, luxury_district | ~1.6× |

For the founder's reference: this is the kind of resolution that turns "Manhattan pharmacy revenue: $2.1M" (the current single number) into a real decision tool — "Upper East Side pharmacy revenue: $4.4M but rent $25K/month; Harlem pharmacy revenue: $1.6M, rent $4K/month — UES net margin 12%, Harlem net margin 18%, plus less competition." That conversation is the product.

Top-10 cities to do this for first (highest payoff): NYC, London, Tokyo, Paris, Berlin, Hong Kong, Singapore, Mumbai, São Paulo, Dubai.

Top-50 cities is the goal for v1.

---

## 5. Does this improve our model? The honest answer.

### 5.1 Where this materially helps

1. **Cell pages for cities with high intra-city variance** (NYC, London, Paris, Tokyo, Mumbai, Mexico City, São Paulo): the current single revenue number is a 5-10× compression. Granular adds real signal.
2. **Decision support questions** (the founder's pharmacy/pet shop example): without this layer, the answer is "median of city, divided by competition density." With this layer, the answer is "open in X-neighborhood, expected revenue Y, expected rent Z, net margin W."
3. **High-tourism cities**: barcelona, prague, bali, marrakech — current model overstates revenue for non-tourism activities by ~30% because city averages mix tourist & resident customer bases.

### 5.2 Where it adds noise, not signal

1. **Low-data countries** (most of Africa, Central Asia, smaller LatAm): we don't have neighborhood-level commuter or tourism data. The framework requires inputs we cannot source reliably. For these places, the framework collapses to city-level multipliers — same value as today.
2. **Mid-sized cities** with low intra-city variance (Bordeaux, Stuttgart, Phoenix): a single revenue number is already close to right. Adding neighborhood layers adds maintenance burden without much accuracy gain.
3. **Activities that ARE pure residential** (childcare, pet daycare, residential cleaning): commuter + tourism layers barely affect them. The baseline city revenue stands.

### 5.3 Cost of building this

| Phase | Effort | Outcome |
|---|---|---|
| Schema + types | 2 days | Data structures + types in place |
| Hand-curate top 10 cities | 5-7 days | NYC, London, Paris, Tokyo, Berlin, HK, Singapore, Mumbai, São Paulo, Dubai tagged + multipliers populated |
| Build multiplier engine | 2 days | `getNeighborhoodRevenueMultiplier(city, neighborhood, activity)` |
| Wire into cell page + neighborhood pages | 3 days | Cell page shows "in this neighborhood, expected revenue is X% vs city baseline because of {tags}" |
| Decision wizard UI (the pharmacy/pet shop question) | 5 days | New `/decide` route or expanded calculator that recommends top neighborhoods for the chosen activity in the chosen city |
| Coverage extension to top 50 cities | 2-3 weeks | Compound payoff |

Total v1: ~3-4 weeks of focused work for top 10. Top 50 = quarter-long.

### 5.4 Recommendation

**Do it, but in this order:**

1. **Phase 1 (immediate, ~1 week):** Schema + types + multiplier engine + populate NYC + London + Paris only. Wire into the existing neighborhood page (we already have `/cities/[city]/neighborhoods/[neighborhood]`). This proves the value with three cities before scaling.

2. **Phase 2 (after Phase 1 lands and the founder vets the NYC numbers):** Decision wizard prototype — single route `/decide/{activity}/{city}` that picks top 3 neighborhoods with rationale. This is the user-facing payoff of the framework.

3. **Phase 3 (parallel, ongoing):** Coverage extension. Each week, add 3-5 cities of curated data. Top 50 by end of quarter.

4. **Phase 4 (after Phase 2 is validated):** Wire the same framework into the cell page so every cell shows its neighborhood-adjusted revenue + a "compare to other neighborhoods in this city" panel.

### 5.5 Things we DO NOT do (out of scope)

- We do NOT try to fully model the rent surface across the city. We use the existing city-level + tier multipliers + add neighborhood RENT tags (premium / standard / budget) as a separate axis. Full rent prediction is a separate product.
- We do NOT model worker wage premium per neighborhood. The country-level effective tax already captures most of it.
- We do NOT try to predict competition density per neighborhood. That requires firm-level address data we don't have for most cities. Phase 2 wizard surfaces "high / low" qualitative density only.

---

## 6. Concrete schemas (the founder asked for these)

### 6.1 Commuter intensity table

`data/economics/commuter_intensity_v1.json` — see §1.4.

### 6.2 Tourism intensity table

`data/economics/tourism_intensity_v1.json`:

```json
{
  "version": "1.0.0",
  "convention": {
    "unit": "annual_tourists_per_resident",
    "neighborhood_keying": "city_slug + neighborhood_slug",
    "fallback_when_unmeasured": "city_default"
  },
  "neighborhoods": {
    "new-york__manhattan-midtown-west": {
      "tourism_intensity": 78,
      "overnight_visitors_m": 14,
      "day_trippers_m": 26,
      "resident_pop": 110000,
      "year": 2023,
      "source_quality": "B"
    },
    "barcelona__ciutat-vella": {
      "tourism_intensity": 220,
      "year": 2023,
      "source_quality": "B"
    }
  },
  "city_defaults": {
    "new-york": 2.5,
    "barcelona": 12,
    "paris": 8,
    "tokyo": 3,
    "marrakech": 35,
    "bali": 60
  }
}
```

### 6.3 Neighborhood anomaly tags

`data/cities/neighborhood_tags_v1.json`:

```json
{
  "version": "1.0.0",
  "tag_definitions": {
    "financial_cbd": "Banking + corporate HQ density >30% of district payroll",
    "tourist_zone": "Annual tourist count > 10x resident pop",
    "luxury_district": "Median household wealth top decile + retail rent top 5%",
    "free_economic_zone": "Special tax + customs regime",
    "university_district": "Full-time students > 15% of resident pop",
    "industrial_park": "Manufacturing payroll > 50% of district",
    "tech_corridor": "Software/IT payroll density + high tertiary education",
    "embassy_quarter": "Foreign mission + expat consulate density",
    "medical_cluster": "Hospital + clinic density > 25% of payroll",
    "transit_hub": "Daily transit pop > 200K",
    "gentrifying_edge": "Rents climbing >10% YoY for 3+ years",
    "nightlife_zone": "Bar + club density top 5%",
    "religious_pilgrimage": "Annual pilgrim count > 100K AND > 10x resident pop",
    "residential_only": "Default — no special tags apply"
  },
  "neighborhoods": {
    "new-york__manhattan-midtown-east": {
      "tags": ["financial_cbd", "tourist_zone", "transit_hub", "embassy_quarter"],
      "primary_tag": "financial_cbd"
    },
    "new-york__manhattan-times-square": {
      "tags": ["tourist_zone", "nightlife_zone", "transit_hub"],
      "primary_tag": "tourist_zone"
    },
    "new-york__manhattan-upper-east-side": {
      "tags": ["luxury_district", "residential_only"],
      "primary_tag": "luxury_district"
    },
    "london__city-of-london": {
      "tags": ["financial_cbd", "transit_hub", "tourist_zone"],
      "primary_tag": "financial_cbd"
    }
  }
}
```

### 6.4 Activity x tag multiplier table

`src/lib/economics/neighborhood_multipliers.ts`:

```typescript
type Tag =
  | "financial_cbd"
  | "tourist_zone"
  | "luxury_district"
  | "free_economic_zone"
  | "university_district"
  | "industrial_park"
  | "tech_corridor"
  | "embassy_quarter"
  | "medical_cluster"
  | "transit_hub"
  | "gentrifying_edge"
  | "nightlife_zone"
  | "religious_pilgrimage";

/**
 * Revenue multiplier per activity per neighborhood tag. 1.0 = neutral.
 * Values above 1 mean the tag boosts revenue for that activity; below
 * 1 means the tag suppresses it. Source: founder + curated industry
 * studies. Refine per city as data comes in.
 */
export const TAG_REVENUE_MULTIPLIER: Record<Tag, Record<string, number>> = {
  financial_cbd: {
    cafes_coffee: 2.4,
    fast_casual: 2.8,
    sit_down_restaurants: 1.6,
    pharmacies_drug_stores: 2.2,
    grocery_stores: 0.5,
    bars_nightclubs: 0.8,
    accounting_tax: 2.5,
    legal_services: 2.6,
    pet_stores: 0.4,
    pet_daycare: 0.3,
    residential_cleaning: 0.4,
    dental_practices: 0.6,
    // ... full table 60+ activities
  },
  tourist_zone: {
    restaurants: 1.8,
    ice_cream_shops: 2.5,
    pharmacies_drug_stores: 1.6,
    pet_stores: 0.6,
    pet_daycare: 0.4,
    // ...
  },
  luxury_district: {
    jewelry_stores: 3.0,
    pet_stores: 1.8,
    pet_daycare: 2.2,
    residential_cleaning: 1.6,
    // ...
  },
  // ... rest of tags
};

/**
 * Compute final neighborhood revenue multiplier for an activity given a
 * neighborhood's tag set. Product of tag multipliers, clipped to [0.25, 4.0].
 */
export function neighborhoodRevenueMultiplier(
  activityId: string,
  tags: Tag[],
): number {
  let m = 1.0;
  for (const t of tags) {
    const tm = TAG_REVENUE_MULTIPLIER[t]?.[activityId] ?? 1.0;
    m *= tm;
  }
  return Math.max(0.25, Math.min(4.0, m));
}
```

### 6.5 Final composed multiplier

```typescript
function getNeighborhoodAdjustedRevenue(
  cityBaseline: number,
  activityId: string,
  neighborhoodSlug: string,
): number {
  const commuter = getCommuterIntensity(neighborhoodSlug);
  const tourism = getTourismIntensity(neighborhoodSlug);
  const tags = getNeighborhoodTags(neighborhoodSlug);

  const commMult = commuterRevenueMultiplier(activityId, commuter);
  const tourMult = tourismRevenueMultiplier(activityId, tourism);
  const tagMult = neighborhoodRevenueMultiplier(activityId, tags);

  // Multiply all three. Cap at the same overall ceiling to prevent
  // compounding outliers (e.g., Times Square pharmacy).
  return cityBaseline * clip(commMult * tourMult * tagMult, 0.2, 5.0);
}
```

---

## 7. The pharmacy / pet shop decision (worked example)

User opens `/decide/pharmacy/new-york`. The wizard computes for each of the 8 Manhattan + Brooklyn + Queens sub-neighborhoods:

```
[NEIGHBORHOOD]    [REV]   [RENT/mo]  [TAX]    [NET MARGIN]  [DENSITY]
Manhattan-UES     $4.4M   $25K      $880K     12%           moderate
Manhattan-FiDi    $3.5M   $18K      $700K     14%           low
Manhattan-Mid-W   $4.0M   $32K      $810K      9%           HIGH
Brooklyn-Park-Sl  $1.9M   $7K       $380K     17%           low
Brooklyn-Bushw    $1.4M   $4K       $290K     19%           low
Queens-Astoria    $1.7M   $5K       $340K     18%           moderate
Manhattan-Harlem  $1.6M   $4K       $320K     20%           low
Manhattan-UWS     $2.5M   $15K      $510K     14%           moderate
```

Wizard picks top 3 by net margin:
1. **Manhattan-Harlem** — 20% net margin, $4K rent, low competition. Gentrifying.
2. **Brooklyn-Bushwick** — 19% net, $4K rent, low competition. Same pattern.
3. **Queens-Astoria** — 18% net, $5K rent, moderate competition.

Then the SAME wizard for `/decide/pet-shop/new-york`:
1. **Manhattan-UES** — luxury_district tag, high pet-spend per resident, premium pricing absorbs rent. 16% net.
2. **Brooklyn-Park-Slope** — gentrifying + family-residential — strong pet-shop demand. 19% net.
3. **Manhattan-UWS** — similar to UES but cheaper rent. 15% net.

Different activity → different optimal neighborhoods. That's the framework's whole point.

---

## 8. Approval gate

This is the design. The founder reviews. Approve with "execute" and I'll start Phase 1:

- Phase 1 deliverables: schemas, types, multiplier engine, populated for NYC + London + Paris, wired into the existing neighborhood page.
- Then we hold for founder review of the NYC numbers before continuing to top 10, then top 50.
- Phase 2 (decision wizard) only after Phase 1 numbers pass the founder's smell test.

Out-of-scope explicitly:
- Full rent surface modeling (use existing tier multipliers)
- Worker-wage prediction per neighborhood
- Firm-level competition density
- The 12 long-tail activity images still missing from the manifest

Approval requested.
