/**
 * trade_index.ts , the trade axis of the lattice.
 *
 * The site is trade by place. `/world` is the place door. There has never been
 * a trade door at the current bar, so a reader who arrives thinking "I want to
 * open a bakery" rather than "tell me about Berlin" has nowhere to land.
 *
 * WHAT IS SHOWN AND WHAT IS GATED. `visibleIndustries()` is the founder-approved
 * filter and it is used rather than the raw list: of 243 industries, 19 are
 * corp-only and 12 are mixed-caution, and neither belongs in a small-business
 * index. Nothing here re-implements that decision.
 *
 * THE NOTE IS THE POINT. 179 of the 204 industries with margins carry a
 * one-line structural reason: "Feed and breeding stock heavy. Margins erode
 * quickly with feed price." That sentence is worth more than the percentage
 * beside it, and it is the same thing the homepage was missing: a figure with a
 * reason attached is a finding, a figure alone is a statistic.
 *
 * WHAT IS DELIBERATELY NOT BUILT HERE.
 *
 * NO LEAGUE TABLE OF TRADES. Ranking trades by margin is ranking businesses
 * against each other, which the standing rule forbids, and a "worst margins"
 * list badmouths the trades at the bottom. Trades are shown inside their
 * sector, in the taxonomy's own order.
 *
 * THE PHRASE "NET MARGIN" IS BANNED VOCABULARY and the data file uses it as a
 * key. It is never printed. What is printed is the operating figure in the
 * site's own register: what an owner keeps out of every hundred.
 */
import marginsJson from "../finance/industry_margins.json";
import {
  SECTORS_ORDERED,
  industryToSlug,
  visibleIndustries,
  visibleIndustriesInSector,
  type Industry,
} from "../taxonomy";

type MarginRow = {
  operating_margin?: number;
  notes?: string;
};

const MARGINS = (marginsJson as { industries: Record<string, MarginRow> }).industries;

export type TradeRow = {
  id: string;
  name: string;
  slug: string;
  /** Out of every hundred, what the operating line leaves. Null when unknown. */
  keepsPer100: number | null;
  /** The structural reason, in the data file's own words. */
  note: string | null;
};

export type SectorGroup = {
  id: string;
  name: string;
  tagline: string | null;
  trades: TradeRow[];
};

/**
 * The canonical slug, RESOLVED rather than assembled.
 *
 * The first version here built one from the id, `restaurants_full_service` to
 * `restaurants-full-service`. The canonical builder works from the NAME, so the
 * real slug is `full-service-restaurants` and every link would have 404ed. This
 * is the same defect the geo gate caught on country links, in a different
 * corner: a slug you construct is a slug you are guessing.
 */
function slugOf(i: Industry): string {
  return industryToSlug(i.id);
}

/**
 * Whether a note can be shown to a reader.
 *
 * THE FIELD IS NOT UNIFORMLY PUBLISHABLE and assuming it was put internal
 * working notes on a page. Reading the rendered page as prose caught this one
 * live:
 *
 *   "Plan v30 audit , hostels run slightly better than hotels (lower service
 *   intensity, dorm rate efficiency) but 20% operating was unrealistic. 12-16%
 *   op is the achievable band; 8-12% net for well-run urban hostels."
 *
 * Eight of the 179 notes fail. Between them they carry an internal plan
 * reference, an em dash, the banned word "net", a named company, and a named
 * source agency, which is banned in anything a reader sees. None of that is
 * visible to the em-dash gate, because the text lives in a data file rather
 * than in source.
 *
 * A note that fails is DROPPED, not trimmed. Cutting a working note down to
 * its first clause invents an editorial line the analyst did not write.
 */
/* Word boundaries matter here: "net" must not match "network", and
   "covers" must not match "discovers". The dashes are written as escapes
   rather than as characters, because the em-dash gate reads this file too and
   a literal one fails the build, correctly. */
const INTERNAL = /\baudit\b|\bplan v|\bv\d+\b|\btodo\b|\bfixme\b/i;
const BANNED = /\bnet\b|\bturnover\b|\bcovers\b|percentage points/i;
const DASH = /[\u2013\u2014]|--/;
const CITED = /\b(19|20)\d{2}\b/;

function publishableNote(note: string | undefined): string | null {
  if (!note) return null;
  const t = note.trim();
  if (t.length > 120) return null;
  if (DASH.test(t) || INTERNAL.test(t) || BANNED.test(t) || CITED.test(t)) return null;
  return t;
}

function rowOf(i: Industry): TradeRow {
  const m = MARGINS[i.id];
  return {
    id: i.id,
    name: i.name,
    slug: slugOf(i),
    keepsPer100:
      m?.operating_margin == null ? null : Math.round(m.operating_margin * 100),
    note: publishableNote(m?.notes),
  };
}

/** Every sector that has at least one visible trade, in the taxonomy's order. */
export function sectorGroups(): SectorGroup[] {
  return SECTORS_ORDERED.map((s) => ({
    id: s.id,
    name: s.name,
    tagline: (s as unknown as { tagline?: string }).tagline ?? null,
    trades: visibleIndustriesInSector(s.id).map(rowOf),
  })).filter((g) => g.trades.length > 0);
}

/** How many trades a reader can actually reach. Counted, never claimed. */
export function visibleTradeCount(): number {
  return visibleIndustries().length;
}

/**
 * A handful of trades whose structural note is worth reading, taken from
 * across sectors rather than from the top or the bottom of anything.
 *
 * NOT A RANKING. The picks are evenly spaced through the visible list, so the
 * selection carries no claim about which trades are better. Deterministic,
 * because a homepage that shuffles on every render is a homepage nobody can
 * refer back to.
 */
export function notableNotes(count = 6): TradeRow[] {
  const withNotes = sectorGroups()
    .flatMap((g) => g.trades)
    .filter((t) => t.note && t.keepsPer100 != null);
  if (withNotes.length <= count) return withNotes;
  const step = Math.floor(withNotes.length / count);
  return Array.from({ length: count }, (_, i) => withNotes[i * step]);
}
