/**
 * Per-industry failure modes for the "Why these businesses fail" panel.
 *
 * Founder-research lens: every other benchmark site shows only the
 * median. We show the ditch. Five specific failure modes per industry,
 * not generic "bad management" or "cash flow issues."
 *
 * Sources: SBA Office of Advocacy 5-year survival data + industry-
 * specific post-mortems from trade press (Restaurant Hospitality,
 * Modern Salon, Hotel Management Magazine, etc.). Each item names a
 * specific operational misjudgment that recurs in that industry.
 *
 * Editorial brief: each failure mode reads as something a working
 * operator would nod at, not something a McKinsey deck would write.
 *
 * Coverage: the 16 baselined industries.
 */

export type FailureMode = {
  /** Short label (2-5 words). */
  label: string;
  /** One-sentence explanation; specific enough to recognize. */
  explanation: string;
  /** Rough timeline when this typically hits. */
  when: string;
};

export const INDUSTRY_FAILURE_MODES: Record<string, FailureMode[]> = {
  restaurants: [
    {
      label: "Lease terms misjudged",
      explanation: "Owner signed a 10-year lease with annual escalators based on opening-month projections; rent compounds past what the operation can support by year 3-4.",
      when: "Year 2-4",
    },
    {
      label: "Owner-as-only-cook burnout",
      explanation: "The chef-owner can't take a day off; after 18 months of 14-hour shifts, quality slips, staff turns over, the owner quits.",
      when: "Month 12-24",
    },
    {
      label: "Liquor license delays past opening",
      explanation: "Restaurant opens with food-only revenue while the liquor application sits with the regulator for 4-9 months; gross margin never recovers from those missing alcohol sales.",
      when: "Month 0-12",
    },
    {
      label: "Payment-processing fees underestimated",
      explanation: "Card fees + delivery-platform commissions silently consume 6-12% of revenue. Owner didn't model this and never raises prices to compensate.",
      when: "Chronic",
    },
    {
      label: "Quarterly tax shock",
      explanation: "Owner pulls cash for personal use during good months; quarterly self-employment + sales tax bill arrives unfunded, business takes on debt to cover.",
      when: "Q2 of any year",
    },
  ],

  cafes_coffee: [
    {
      label: "Foot-traffic miscalculation",
      explanation: "Owner counted morning commuters at the lease signing; office vacancy or work-from-home shift cut weekday foot traffic 30-50% within 18 months.",
      when: "Month 12-24",
    },
    {
      label: "Espresso-machine downtime",
      explanation: "The $15K machine breaks; the only certified tech in town can't come for 5 days. Cafe loses 80% of revenue in the meantime, repair costs $3-8K.", // allow-v34-trial
      when: "Year 1-3",
    },
    {
      label: "Pastry program fails to launch",
      explanation: "Cafe planned to add food to lift average ticket; commercial kitchen permit and recipe development take 6+ months; the menu addition arrives without margin to recover the investment.",
      when: "Month 6-18",
    },
    {
      label: "Wholesale chain pressure",
      explanation: "Starbucks or a regional chain opens within 200m; foot traffic falls 25-40% within 6 months. Independent cafes can compete on quality but not on volume.",
      when: "Variable",
    },
    {
      label: "Loyalty-program math",
      explanation: "Owner runs a buy-10-get-1-free; once habitual customers fill cards, effective margin per cup drops by 10% just as fixed costs are rising.",
      when: "Year 1-2",
    },
  ],

  hairdressers_beauty: [
    {
      label: "Star stylist departure",
      explanation: "The senior stylist who brought 40% of the salon's revenue takes their book and opens their own studio. Salon loses revenue and customer loyalty within 90 days.",
      when: "Year 2-5",
    },
    {
      label: "Booth-rent vs commission imbalance",
      explanation: "Salon converted to booth-rent for stability; stylists set their own prices below salon-recommended, undercutting the brand. Or kept commission and watched stylists leave for booth-rent shops nearby.",
      when: "Year 1-3",
    },
    {
      label: "Retail revenue collapse",
      explanation: "Product retail used to subsidize service margin; Amazon + influencer-DTC brands now cover that demand. Margin compression of 8-15% over 3-4 years.",
      when: "Chronic",
    },
    {
      label: "Permit / cosmetology snag",
      explanation: "State board inspection finds a chemical-storage or sanitation issue; salon closes 1-4 weeks during remediation. Some clients don't return.",
      when: "Year 1-5",
    },
    {
      label: "Lease-end relocation",
      explanation: "Landlord doesn't renew or raises rent 30-50% at lease end; owner relocates and discovers a salon's customer base is highly local; 40-60% don't follow to the new address.",
      when: "Year 5-10",
    },
  ],

  barbershops: [
    {
      label: "Trend cycle out of style",
      explanation: "Shop built around a specific aesthetic (fades, beard styling, classic-cut revival); trend rotates, customer base contracts faster than the shop can adapt.",
      when: "Year 3-7",
    },
    {
      label: "Walk-in to appointment-only shift",
      explanation: "Owner switches to appointment-only to manage chair productivity; loses 20-40% of walk-in revenue immediately, hopes the higher-value appointments compensate. Sometimes they don't.",
      when: "Year 2-4",
    },
    {
      label: "Solo-shop scale ceiling",
      explanation: "Owner-operator hits the math limit of one chair, eight customers a day, six days a week. No way to grow without hiring, which barbers often resist.",
      when: "Year 3 onwards",
    },
    {
      label: "Cash-economy compliance",
      explanation: "Shop ran heavily cash for years; an audit or POS-mandate forces full reporting; revenue 'shrinks' on paper, tax bill jumps, owner can't service it.",
      when: "Year 5-10",
    },
    {
      label: "Beard / shave market exhaustion",
      explanation: "Premium shave services rode the 2015-2022 beard wave; demand cooled. Shops that overinvested in straight-razor training and equipment have stranded capital.",
      when: "Year 3-5",
    },
  ],

  auto_repair_shops: [
    {
      label: "Diagnostic-equipment obsolescence",
      explanation: "$8-15K diagnostic tool refresh every 3-4 years to keep up with newer vehicle electronics; many independents skip the upgrade and lose work to dealer service.",
      when: "Year 3-7",
    },
    {
      label: "EV transition exposure",
      explanation: "ICE-focused shops lose oil-change and brake-job volume as EV fleet share grows; shops without HV-system certification can't pick up the new work.",
      when: "Ongoing",
    },
    {
      label: "Master mechanic departure",
      explanation: "One ASE-certified tech does 60% of the complex work and trains the others; they leave for a dealership, shop can't replace them quickly.",
      when: "Year 2-5",
    },
    {
      label: "Insurance + lift-certification gap",
      explanation: "Worker injury on the floor; shop's GL or workers-comp coverage proves inadequate; settlement plus premium hike eats 6-18 months of profit.",
      when: "Year 1-5",
    },
    {
      label: "Specialty-only narrowing",
      explanation: "Shop specialized (transmissions, European imports, body work); the manufacturer changes designs or warranty terms; specialty volume drops faster than reintegration is possible.",
      when: "Year 5-15",
    },
  ],

  hotels_lodging: [
    {
      label: "Loan-covenant breach during a soft year",
      explanation: "Hotel loan requires minimum DSCR or RevPAR; one bad year (recession, local event cancellation) breaches covenants, lender takes control or forces a sale.",
      when: "Year 2-7",
    },
    {
      label: "OTA dependence",
      explanation: "Booking.com / Expedia drive 60-80% of bookings; commissions average 15-25%. Hotel never builds direct-booking channel, never escapes the toll.",
      when: "Chronic",
    },
    {
      label: "Brand-conversion shock",
      explanation: "Independent hotel converts to a franchise flag for marketing; required PIP (Property Improvement Plan) costs $500K-$2M up front; ROI takes 4-6 years.",
      when: "Year 3-7",
    },
    {
      label: "Convention or event-host loss",
      explanation: "Local convention center closes or major event moves cities; midweek occupancy collapses 20-40%. Property can't rightsize fixed costs fast enough.",
      when: "Variable",
    },
    {
      label: "Deferred-maintenance reckoning",
      explanation: "HVAC, roof, elevators all hit replacement age in the same 3-year window; CapEx call exceeds what cash flow can fund; deferred work compounds into bigger bills.",
      when: "Year 10-20",
    },
  ],

  dental_practices: [
    {
      label: "Insurance reimbursement cuts",
      explanation: "Major insurer renegotiates the fee schedule downward; practice loses 5-15% of revenue per affected procedure code without losing the patient base.",
      when: "Year 1-10",
    },
    {
      label: "Associate exit + non-compete gap",
      explanation: "Associate dentist leaves and takes patients; non-compete is either unenforceable in the state or weakly drafted. Revenue dip 15-30%.",
      when: "Year 2-5",
    },
    {
      label: "DSO acquisition pressure",
      explanation: "Dental Service Organization buys the practice across the street; reduces fees by 10-20%, captures price-sensitive patients. Independent practice loses 8-15% of patient volume.",
      when: "Year 3-10",
    },
    {
      label: "Equipment financing trap",
      explanation: "$200K+ in equipment financed during opening; combined monthly payments + operating debt eat owner take-home for 5-7 years; one quiet quarter triggers a covenant issue.",
      when: "Year 1-7",
    },
    {
      label: "Hygienist shortage",
      explanation: "Cannot hire/keep a dental hygienist; doctor revenue is half of practice revenue, hygienist column accounts for the other half. Empty chair means immediate 30-40% revenue drop.",
      when: "Year 2 onwards",
    },
  ],

  doctors_clinics: [
    {
      label: "Insurance credentialing delay",
      explanation: "Independent practice or new provider waits 4-9 months to credential with major insurers; sees patients for self-pay or out-of-network rates during the gap; cash flow severely strained.",
      when: "Year 1",
    },
    {
      label: "Documentation and prior-auth overhead",
      explanation: "Increasing payer documentation requirements push administrative staff costs from 25% to 35%+ of revenue without offsetting reimbursement gain.",
      when: "Chronic",
    },
    {
      label: "Hospital-system squeeze",
      explanation: "Local hospital system acquires competing practices, captures referral volume, forces independents to either join or compete against integrated networks.",
      when: "Year 3-15",
    },
    {
      label: "Provider burnout",
      explanation: "Solo or small-group practice runs the lead physician at 28-32 visits/day; productivity drops, satisfaction plummets, provider leaves medicine entirely.",
      when: "Year 3-10",
    },
    {
      label: "EHR migration cost",
      explanation: "Forced upgrade or switch costs $30-100K and 3-6 months of reduced productivity; small practices often defer until clinical or billing problems force the move under pressure.",
      when: "Year 5-10",
    },
  ],

  legal_services: [
    {
      label: "Client concentration",
      explanation: "Solo or small firm derives 40%+ of revenue from one client (often a single corporate or repeat consumer source); that client moves work in-house or to bigger counsel; firm shrinks below sustainable size.",
      when: "Year 2-10",
    },
    {
      label: "AR / collections crisis",
      explanation: "Firm bills $X but only collects 70-80%; cash flow assumes 95%; difference accumulates as bad debt until working capital is exhausted.",
      when: "Year 1-5",
    },
    {
      label: "Malpractice claim spike",
      explanation: "One claim, meritorious or not, pushes premiums 50-100%; defending the claim costs partner time and reputation; some clients quietly leave.",
      when: "Year 1-15",
    },
    {
      label: "Bar discipline action",
      explanation: "Even a minor disciplinary action against the named partner triggers reportable events, insurance complications, and referral hesitation; firm loses 10-30% of new matters.",
      when: "Year 1-20",
    },
    {
      label: "Practice-area extinction",
      explanation: "Solo or boutique focused on a narrow practice; that practice contracts (mortgage foreclosure post-crisis, immigration policy shift, etc.); fixed-cost firm can't pivot fast.",
      when: "Variable",
    },
  ],

  accounting_tax: [
    {
      label: "Tax-season staffing failure",
      explanation: "Cannot hire seasonal staff at acceptable rates; partners work 80-hour weeks for 12 weeks; client errors increase; reputation damage in year 2-3.",
      when: "Year 2 onwards",
    },
    {
      label: "Software-platform lock-in cost",
      explanation: "Migrates from one tax-prep software to another (cost, features, support); 200-400 hours of re-setup + client data re-entry; one bad season can sink the practice.",
      when: "Year 3-10",
    },
    {
      label: "IRS / state audit reputation hit",
      explanation: "One major client gets audited and outcome looks bad on the preparer; word spreads in a small market; new-client growth stalls for 12-18 months.",
      when: "Year 1-10",
    },
    {
      label: "DIY-software substitution",
      explanation: "Lower-end clients migrate to TurboTax / FreeTaxUSA; firm loses the simple-return volume that subsidized senior staff during the off-season.",
      when: "Chronic",
    },
    {
      label: "Owner-as-only-CPA bottleneck",
      explanation: "Practice growth limited by the partner's billable hours; staff CPAs are too few or too junior to take signature responsibility; owner can't scale or exit.",
      when: "Year 3 onwards",
    },
  ],

  real_estate_agencies: [
    {
      label: "Interest-rate cycle exposure",
      explanation: "Brokerage's revenue moves with transaction volume; a 200-300bps rate hike cuts transactions 30-50%. Brokerage with fixed overhead can't downsize fast enough.",
      when: "Year 1-5",
    },
    {
      label: "Top producer departure",
      explanation: "The two or three highest-producing agents account for 40-60% of office GCI; one leaves for a national franchise or starts their own brokerage; revenue collapses immediately.",
      when: "Year 1-10",
    },
    {
      label: "Commission-split compression",
      explanation: "Agents demand higher splits (80/20, 90/10, fully retained); brokerage's percentage of each transaction falls below the level that covers office + tech + marketing overhead.",
      when: "Year 3 onwards",
    },
    {
      label: "MLS / portal-fee escalation",
      explanation: "Multiple Listing Service dues + portal fees (Zillow Premier, Realtor.com) grow faster than transaction volume; small brokerages absorb the cost personally.",
      when: "Chronic",
    },
    {
      label: "Class-action commission case",
      explanation: "Industry-wide settlements (post-Sitzer/Burnett) reshape commission economics; brokerage that built its model on 2.5-3% buy-side commissions struggles to adapt.",
      when: "2024-2027",
    },
  ],

  residential_construction: [
    {
      label: "Material-cost spike between bid and build",
      explanation: "Lumber, copper, drywall prices jump 20-40% between contract signing and project execution; firm fixed-price; entire project margin evaporates.",
      when: "Year 1-5",
    },
    {
      label: "Subcontractor no-show",
      explanation: "Plumber or electrician disappears mid-project; finding a replacement at the agreed price takes 6-12 weeks; project completion slips, customer threatens lawsuit, lien risk.",
      when: "Year 1 onwards",
    },
    {
      label: "Workers' comp claim",
      explanation: "Workplace injury triggers a claim; premium goes up 50-150% the following year; subcontractor's insurance also pulls; some bonds and licenses can't be maintained.",
      when: "Year 1-10",
    },
    {
      label: "Cash-flow lag",
      explanation: "Customer pays in stages; supplier and labor want cash weekly; one slow-paying customer is enough to bankrupt a small contractor with thin working capital.",
      when: "Year 1-3",
    },
    {
      label: "Mechanic's lien dispute",
      explanation: "Owner-customer disputes work quality; refuses final payment; contractor files lien but recovery takes 6-18 months and substantial legal fees; mid-sized contractors often settle for less than owed.",
      when: "Year 1 onwards",
    },
  ],

  grocery_stores: [
    {
      label: "Wholesale-club opening within 10 minutes",
      explanation: "Costco, Sam's Club, or a Walmart Supercenter opens nearby; customer trip frequency drops 30-50% within 12 months. Independent grocer can't price-match on staples.",
      when: "Year 1-10",
    },
    {
      label: "Shrinkage (theft + spoilage)",
      explanation: "Industry baseline ~1.5% of sales; in some neighborhoods reaches 4-6% during economic stress. Net margin is already 1-3%; shrinkage shocks turn profit into loss.",
      when: "Variable",
    },
    {
      label: "Refrigeration breakdown",
      explanation: "Walk-in cooler or freezer fails during a hot weekend; $20-60K of inventory spoils; insurance covers only partial loss; replacement compressor + downtime is another $20K+.",
      when: "Year 3-10",
    },
    {
      label: "WIC / SNAP authorization snag",
      explanation: "SNAP authorization withdrawn or WIC vendor agreement not renewed; many neighborhood stores derive 20-50% of revenue from benefit transactions; immediate revenue collapse.",
      when: "Year 1-10",
    },
    {
      label: "Family succession failure",
      explanation: "Owner retires or dies; children don't want the business; selling a small independent grocery in 2024 typically yields very little because no buyer wants this margin profile.",
      when: "Year 20-40",
    },
  ],

  clothing_stores: [
    {
      label: "Buying mistakes lock in markdowns",
      explanation: "Owner over-orders a seasonal collection; trend doesn't materialize; 30-50% of inventory eventually moves at 50-75% off, wiping out margin for two quarters.",
      when: "Year 1-5",
    },
    {
      label: "E-commerce + DTC pressure",
      explanation: "Customer browses in-store, buys the same item online for less; conversion rate falls 20-40% over 5-7 years; physical-only stores can't compete on price.",
      when: "Chronic",
    },
    {
      label: "Pop-up + outlet undercutting",
      explanation: "Brand the boutique carries opens its own outlet 30-60 minutes away or runs flash sales online; loyal customers shift channels; wholesale relationship sours.",
      when: "Year 3-10",
    },
    {
      label: "Lease renewal at 2x rent",
      explanation: "Successful boutique attracts attention from the landlord; rent renewal proposed at 80-150% above current; relocation kills the existing customer base.",
      when: "Year 5-10",
    },
    {
      label: "Tariff or import-duty shock",
      explanation: "Sudden tariff change on imported apparel (China, Vietnam, Bangladesh sources); cost basis rises 10-25%; pass-through to retail price slowed by competition.",
      when: "Variable",
    },
  ],

  sports_fitness: [
    {
      label: "Member-churn underestimated",
      explanation: "Owner models 12-month average tenure; actual is 6-8 months for many segments; LTV math collapses, growth requires constant new acquisition.",
      when: "Year 1-2",
    },
    {
      label: "Equipment lease end-of-term",
      explanation: "Treadmills and cardio equipment financed; lease ends at year 5 with balloon payment or refresh requirement; CapEx call hits during a soft membership year.",
      when: "Year 4-6",
    },
    {
      label: "Cycle/HIIT format cooling",
      explanation: "Specific class format (cycling, HIIT, Pilates) was hot when the studio opened; format cools, members migrate to alternatives; studio can't reposition.",
      when: "Year 2-5",
    },
    {
      label: "Liability + injury claim",
      explanation: "Member injury during class; waiver doesn't hold up; insurance settles but premium triples; some payment processors drop fitness studios after claims.",
      when: "Year 1-10",
    },
    {
      label: "Lease-locked through a downturn",
      explanation: "Studio signed 10-year lease in good times; pandemic / recession reduces attendance 40-60% for 12-18 months; lease obligations exceed reduced membership revenue.",
      when: "Variable",
    },
  ],

  veterinary_pet_care: [
    {
      label: "Corporate consolidator pressure",
      explanation: "Mars Petcare / NVA / Pathway acquires the adjacent practice; offers expanded hours, financing, and equipment the independent can't match; independent loses 10-25% of patient base.",
      when: "Year 3-15",
    },
    {
      label: "Veterinarian shortage",
      explanation: "Cannot hire a relief vet or associate; lead veterinarian burns out from 6-day weeks; either reduces hours (revenue falls) or sells (often below market).",
      when: "Year 3 onwards",
    },
    {
      label: "Pet insurance dynamics",
      explanation: "Insured pets demand more workups and treatments; uninsured pets see fewer visits; practice mix shifts unpredictably; AR + collections complexity rises.",
      when: "Chronic",
    },
    {
      label: "Equipment-investment ROI failure",
      explanation: "Practice invests $80-200K in laser surgery, ultrasound, or dental; utilization doesn't reach projected volume; equipment depreciates as 'idle asset.'",
      when: "Year 2-7",
    },
    {
      label: "Owner-vet exit valuation gap",
      explanation: "Practice generates good cash flow but valuation depends on transferable goodwill; in a one-or-two-vet practice that's hard to evidence; sale price disappoints retiring owner.",
      when: "Year 15-30",
    },
  ],
};

/** Lookup helper. Returns null when the industry has no failure modes documented. */
export function getFailureModes(industryId: string | null | undefined): FailureMode[] | null {
  if (!industryId) return null;
  const list = INDUSTRY_FAILURE_MODES[industryId];
  return list && list.length > 0 ? list : null;
}
