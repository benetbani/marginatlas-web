/**
 * src/lib/spine/trade_hero_facts.ts
 *
 * THE TRADE MASTHEAD'S FACTS, `00 take` (MODEL.md 8.6; plan step 33's first
 * dispatch, 2026-09-18), mapped from the cell seed the adapter builds, for
 * the AnswerCard archetype and its stories, the way city_hero_facts.ts maps
 * the city's. The h1 is the trade's name; the identity crumb under it is the
 * city and the country, so the header holds trade, city and country and the
 * place is named once on the page (clause 11); the answer is what a typical
 * owner keeps a year, the page's only 40 (8.6, loud one); the companions are
 * 8.6's three, net margin, firms trading here and a typical year's takings,
 * and no ease score (a coined index, clause 17; the old masthead's "to break
 * in" word and the ease-of-entry column leave with this file). Synchronous
 * over a seed; the seed itself comes from the async adapter.
 *
 * THE FIGURES, each with its file and field:
 *  - THE TAKE-HOME: `owner.take_home_usd`, the adapter's `ownerTakeHome`
 *    (cell_view.ts `ownerKeeps.takeHome`: resolveOwnerTakeHome() through the
 *    credibility screen, gated `moneyShown`). Real where money is shown
 *    (London, trusted local cells); WITHHELD with the state word where it is
 *    not, and the crumb and the companions still draw (8.6's row), so the
 *    page carries two loud moments there.
 *  - THE NET: the seed's `net` block, THE ONE BUILDER'S figure (trade_net.ts,
 *    R7, item 58), with the builder's own note under it. Never the adapter's
 *    old `margins.net_pct`, which was the engine's alone.
 *  - FIRMS TRADING HERE: `headline.n_firms` (the London entry's `firms` on
 *    the exemplar, `cell.n_enterprises` elsewhere), printed where money is
 *    shown, as cell_view.ts's own stats gate it: on an untrusted cell the
 *    count is an extrapolation (Mumbai cafes carry a round 100) and is
 *    withheld with the foot's line rather than printed.
 *  - A TYPICAL YEAR'S TAKINGS: `headline.rev_p50_usd`, the typical of the
 *    spread `01 spread` draws (one source, so the strip's 30 and this cell
 *    are one figure), gated the same way: an untrusted cell's revenue is
 *    suppressed by the view (a Mumbai cafe at $5.2M is the visibly wrong
 *    number this site does not print).
 *
 * THE FOOT is the page's provenance line, the cell's own `coverage_source`
 * sanitised by the adapter (the old masthead printed it behind the hidden
 * sample mark); off `moneyShown` the withheld line naming the two companions
 * the card does not hold stands first on the same line (PART 5: withheld,
 * never dropped, with a stated line).
 */
import type { KvCell } from "@/components/spine/archetypes/KvGrid";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { TradeNet } from "@/lib/spine/trade_net";

type Conf = "measured" | "modeled" | "placeholder";
const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export type TradeHeroFacts = {
  /** The trade's name, the h1. */
  name: string;
  iso2?: string;
  /** The identity crumb under the h1: the city, then the country. */
  crumb: string[];
  /** The take-home, or null where money is not shown for the cell. */
  answer: { label: string; value: string; basis: string; confidence: Conf } | null;
  /** The state word's strings, drawn where `answer` is null. */
  absent: { label: string; word: string; note: string };
  cells: KvCell[];
  foot: { text: string; modeled: boolean } | null;
  /** cell_view.ts's `moneyShown`, carried on the seed's meta by the adapter. */
  moneyShown: boolean;
  /** The one builder's net, as the seed carries it, for the gates. */
  net: TradeNet | null;
  /** The withheld line, off `moneyShown`, or null. */
  withheld: string | null;
};

export function tradeHeroFacts(seed: any): TradeHeroFacts | null {
  const meta = seed?.meta;
  if (!meta || typeof meta.trade !== "string" || typeof meta.city !== "string") return null;
  const moneyShown = meta.money_shown === true;
  const net: TradeNet | null = seed?.net && isNum(seed.net.pct) && typeof seed.net.text === "string" ? (seed.net as TradeNet) : null;
  const take = seed?.owner?.take_home_usd;
  const answer = moneyShown && isNum(take) && take > 0
    ? { label: COPY.tradeHero.answerLabel, value: usd(take), basis: COPY.tradeHero.answerBasis, confidence: "modeled" as Conf }
    : null;
  const firms = seed?.headline?.n_firms;
  const takings = seed?.headline?.rev_p50_usd;
  const cells: KvCell[] = [];
  if (net) cells.push({ key: "net", label: COPY.tradeHero.cells.net, value: net.text, note: net.note, confidence: "modeled" });
  if (moneyShown && isNum(firms) && firms > 0) cells.push({ key: "firms", label: COPY.tradeHero.cells.firms, value: Math.round(firms).toLocaleString("en-US"), confidence: "measured" });
  if (moneyShown && isNum(takings) && takings > 0) cells.push({ key: "takings", label: COPY.tradeHero.cells.takings, value: usd(takings), note: COPY.tradeHero.cells.takingsNote, confidence: "measured" });
  const withheld = moneyShown ? null : COPY.tradeHero.withheld;
  const provenance = typeof meta.provenance_line === "string" && meta.provenance_line ? meta.provenance_line : null;
  const footText = [withheld, provenance].filter((t): t is string => !!t).join(" ");
  return {
    name: meta.trade,
    iso2: typeof meta.iso2 === "string" ? meta.iso2.toLowerCase() : undefined,
    crumb: [meta.city, typeof meta.country_name === "string" ? meta.country_name : ""].filter((s) => s.length > 0),
    answer,
    absent: { label: COPY.tradeHero.answerLabel, word: COPY.tradeHero.absent, note: COPY.tradeHero.absentNote },
    cells,
    foot: footText ? { text: footText, modeled: true } : null,
    moneyShown,
    net,
    withheld,
  };
}

/** A cell the stories draw: its route, why it is on the sheet, and the seed the adapter built. */
export type CellHeroInstance = { key: string; route: [string, string, string]; why: string; seed: any };

/**
 * THE CELLS THE SHEET DRAWS, by handle, chosen from the data on 2026-09-18
 * by probing loadCellView(): the exemplar (London restaurants: money shown,
 * the London entry's figures, the modelled spread), one trusted local cell
 * off London (California restaurants, tier S, money shown, a measured
 * spread off the cell's own deciles), and one untrusted cell (Mumbai cafes,
 * tier X, money not shown: the state word, the net off the shard's ladder,
 * the firms and takings withheld, the strip's line where its figure would
 * stand). A handle is a name for a route, so a story key stays short
 * ("cell:london:take", "cell:mumbai-cafes:spread"). The 240-case suits
 * story needs no seed (`cell:none:suits`, the builder handed an id no shard
 * holds) and is not here.
 *
 * TWO MORE FOR TURN ONE (plan step 33's second dispatch, 2026-09-18), each
 * naming the blocks it serves so the opening's stories do not grow by two
 * cells that add nothing to them, and the two opening cells off London
 * naming theirs so the permits (a trade's card, not a cell's) are not drawn
 * twice off one shard: London shoe repair (a trade on the
 * archetype's 80,000 default with no setup lines, `04 open`'s withheld
 * state, and a three-licence shard for `03 permits`) and London bookshops
 * (the default too, a five-licence shard). The exemplar holds nine setup
 * lines (`04` held) and four licences; California restaurants hold no lines
 * and the trade is keyed (`04` baseline). Probed 2026-09-18 with
 * buildSpineCellSeed on each route.
 *
 * TWO MORE FOR THE BAND `05 split | 06 team` (plan step 33's third
 * dispatch, 2026-09-18), and London shoe repair widened to serve both: the
 * exemplar draws the split off the shard's held drivers with the residual
 * named and the team's five roles; shoe repair is profile-fed (the repair
 * sector's shares, the drivers on its shard tagged modelled) and holds two
 * roles, the table's floor; London chiropractic is the split's withheld
 * state on a live cell (the sector's lines and the engine's net come to
 * 108); Cairo restaurants is the team with no median (Egypt's pay pair is
 * withheld, item 9), the pay column in dashes. The seven-row team is drawn
 * off the one seven-row shard by id (a retired trade no route reaches;
 * stories.tsx says so) and needs no seed.
 */
export const CELL_INSTANCES: Record<string, { route: [string, string, string]; why: string; blocks?: readonly string[] }> = {
  london: { route: ["gb", "london", "restaurants"], why: "the exemplar: money shown, the take-home at 40, the three companions" },
  california: { route: ["us", "california", "restaurants"], why: "a trusted local cell off London: money shown, the engine's net, a measured spread", blocks: ["take", "spread", "open"] },
  "mumbai-cafes": { route: ["in", "mumbai", "cafes-coffee-shops"], why: "money not shown (an untrusted read): the state word, the net off the shard's ladder, firms and takings withheld with the line", blocks: ["take", "spread", "open"] },
  "london-shoe-repair": { route: ["gb", "london", "shoe-repair"], why: "a trade on the archetype's default with no setup lines: the cost to open withheld, and a three-licence shard", blocks: ["permits", "open", "split", "team"] },
  "london-bookshops": { route: ["gb", "london", "indie-bookstores"], why: "a five-licence shard, the trade on the archetype's default", blocks: ["permits"] },
  "london-chiropractic": { route: ["gb", "london", "chiropractic"], why: "the split withheld on a live cell: the sector's lines and the engine's net come to more than a hundred", blocks: ["split"] },
  "cairo-restaurants": { route: ["eg", "cairo", "restaurants"], why: "the team with no median pay: Egypt's pair is withheld, so the pay column prints dashes and the card says so once", blocks: ["team"] },
};

/** Whether a handle's cell serves a block's story: every block unless the handle names its own. */
export function cellServes(handle: string, block: string): boolean {
  const inst = CELL_INSTANCES[handle];
  return !!inst && (!inst.blocks || inst.blocks.includes(block));
}

/** The seeds for the handles named, or all of them; async because the adapter is. A cell the adapter cannot build self-omits from the sheet. */
export async function loadCellHeroInstances(handles: string[] = Object.keys(CELL_INSTANCES)): Promise<CellHeroInstance[]> {
  const { buildSpineCellSeed } = await import("@/lib/spine/adapt_cell");
  const out: CellHeroInstance[] = [];
  for (const key of handles) {
    const inst = CELL_INSTANCES[key];
    if (!inst) continue;
    try {
      const seed = await buildSpineCellSeed(...inst.route);
      if (seed) out.push({ key, route: inst.route, why: inst.why, seed });
    } catch { /* a cell the adapter cannot build self-omits from the stories */ }
  }
  return out;
}
