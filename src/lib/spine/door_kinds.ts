/**
 * src/lib/spine/door_kinds.ts
 *
 * THE PROMISE A DOOR MAKES AND THE ANSWER A MASTHEAD GIVES, one vocabulary
 * (plan-2026-09-17/04-PAGES.md step 39, 2026-09-19; MODEL.md PART 8's "THE
 * DOORS" paragraphs on 8.2, 8.3, 8.6, 8.7 and 8.8, and the coherence check's
 * section 5, "each door lands on a page whose opening answers the question
 * the door implied"). Every door on the site carries what it promises,
 * `data-lands="<kind>"`, set where the door is BUILT (close_rows.ts's `Door`,
 * the city cards, the neighbourhood cards, the trade rows, the rivals rows;
 * never typed in a component), and every masthead declares what it answers,
 * `data-answers="<kind>"` on the answer card, set by each surface's view from
 * `SURFACE_ANSWERS` below. scripts/verify_doors.ts walks every door in the
 * chain's renders and reds a door whose promise its target does not answer,
 * and a door to a page that does not exist.
 *
 * THE KINDS, a small closed set. A kind names what the landing page's
 * opening leads with, in the words the page prints:
 *   customer-pay         a city's masthead: "Typical customer pay", the one
 *                        builder's figure (8.3 `00`); the country's city cards
 *                        print the same figure and promise it.
 *   government-take      a country's masthead: the effective tax burden at 40
 *                        (8.2 `00 take`).
 *   owner-keeps          a trade page's masthead: "A typical owner keeps"
 *                        (8.6 `00 take`); the city's trade rows, the trade's
 *                        rivals rows and the hub's benchmark-trade door land
 *                        here.
 *   trade-keeps-per-100  the industry page's masthead: what the trade keeps
 *                        of every $100 (8.7 `00 take`). The trade close's door
 *                        "See {trade} in other cities" lands here and declares
 *                        this kind, its target's own answer; M23 binds the
 *                        industry composition to open on the trade across
 *                        places, and 8.7 records that opening as PROVISIONAL
 *                        until the composition round (the door's words
 *                        promise the places, the masthead answers the keep).
 *   rent-lightest        the neighbourhood hub's and the district page's
 *                        masthead: the rent spread, or the district's own rent
 *                        against the cheapest (8.8 `00 take`, ruled
 *                        2026-09-19).
 *   compare              the compare tool (/compare), the pill on every close
 *                        (M21).
 *   pricing              the pricing page, the country close's arrow (M21).
 *   trades-index         the country's trades index (/{iso2}/industries), "See
 *                        every trade measured here" (M22).
 *   districts            the LEGACY neighbourhoods hub, a list of the city's
 *                        districts: what /cities/{slug}/neighborhoods answers
 *                        for every city the hub's admission gate does not
 *                        admit (251 of 252 on 2026-09-19; hood_scheme.ts). The
 *                        city's districts door and its neighbourhood cards
 *                        land here off London.
 *   region-cities        a region page (/{iso2}/{geo}, a US state or an admin1
 *                        region): an index into the region's cities, the page
 *                        the trade close's place door lands on where the
 *                        cell's place is a region and not a city. Not in the
 *                        step's brief, which named the nine above; added by
 *                        the dispatch because the region page is a real
 *                        landing outside the spine and a door to it must
 *                        declare something true rather than nothing, or not
 *                        be drawn. The controller ratifies the kind or rules
 *                        the door away.
 */
export const DOOR_KINDS = [
  "customer-pay",
  "government-take",
  "owner-keeps",
  "trade-keeps-per-100",
  "rent-lightest",
  "compare",
  "pricing",
  "trades-index",
  "districts",
  "region-cities",
] as const;

export type DoorKind = (typeof DOOR_KINDS)[number];

export const isDoorKind = (v: unknown): v is DoorKind => typeof v === "string" && (DOOR_KINDS as readonly string[]).includes(v);

/**
 * THE SURFACES A DOOR CAN LAND ON, and what each one's masthead answers: one
 * declaration per surface, read by the views (which stamp it on the answer
 * card) and by the gate (which maps a door's href to a surface by the route's
 * own shape and compares). `country`, `city`, `cell`, `industry`, `hood` and
 * `district` are the harness's surfaces (scripts/harness/pages.json; the
 * district page renders through the hood surface's second slug); the rest are
 * pages off the spine that doors land on today.
 */
export type LandingSurface =
  | "country"
  | "city"
  | "cell"
  | "industry"
  | "hood"
  | "district"
  | "hub-legacy"
  | "region"
  | "compare"
  | "pricing"
  | "trades-index";

export const SURFACE_ANSWERS: Record<LandingSurface, DoorKind> = {
  country: "government-take",
  city: "customer-pay",
  cell: "owner-keeps",
  industry: "trade-keeps-per-100", // allow-industry-ref: the industry SURFACE and its answer kind, not a trade
  hood: "rent-lightest",
  district: "rent-lightest",
  "hub-legacy": "districts",
  region: "region-cities",
  compare: "compare",
  pricing: "pricing",
  "trades-index": "trades-index",
};
