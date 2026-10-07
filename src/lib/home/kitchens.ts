/**
 * src/lib/home/kitchens.ts
 *
 * THE RANKED LIST BESIDE THE DUEL (his ruling of 2026-10-05 on PARKED P36.2b, option (a): "a place question instead, 'Where kitchens
 * score five' (the share of London restaurants and cafes rated five for hygiene, by borough, from the feed)"; HOMEPAGE-EDITORIAL.md,
 * format 6, the ranked list, drawn as the site's MarkList). Like for like: one trade (restaurants, cafes and canteens, the ratings'
 * own business type) across London's boroughs, each with 300 or more rated premises (the feed's floor). The set's two highest and
 * two lowest as the rows, as the duel beside it draws its set, the middle borough as the card's figure: three and three stood a
 * card taller than the duel's chart, which cannot grow into a taller seat without a blank over its short bars (RankedBars.tsx;
 * the page laws' CARD FOOT BLANK, 113px at 1280, measured 2026-10-06). Every number from data/editorial/editorial_feed.json, the
 * registers' feed (registers/uk/build_editorial.py), never typed here.
 *
 * A place question, chosen so the home page asks a question it does not ask yet: the takings list his first choice named would
 * have printed the second answer card's figures a second time (his page laws, clause 66).
 *
 * THE 45-DAY RULE, the duel's (src/lib/home/duel.ts): a monthly item prints for 45 days from the day its data ends (`as_of`, the
 * ratings' own date), never from the day the feed was rebuilt.
 */
import feedJson from "../../../data/editorial/editorial_feed.json";
import type { Provenance } from "@/lib/spine/provenance";
import { COPY } from "@/lib/spine/copy";
import { isFresh } from "@/lib/home/duel";

const ITEM = "kitchens-five";
const ENDS = 2;

type Member = { member: string; value: number; units?: number };
type FeedItem = { id: string; title: string; refresh: string; as_of?: string; members: number; middle?: number; top: Member[]; bottom: Member[] };

export type KitchensRow = { key: string; name: string; value: number; prov: Provenance };
export type Kitchens = { title: string; middle: { value: number; prov: Provenance }; count: number; rows: KitchensRow[] };

/** The list, or null when the feed holds no fresh item, no middle or too few members at either end. */
export function buildKitchens(today: string = new Date().toISOString().slice(0, 10)): Kitchens | null {
  const item = (feedJson as unknown as { items: FeedItem[] }).items.find((i) => i.id === ITEM);
  if (!item || !isFresh(item, today) || typeof item.middle !== "number" || item.top.length < ENDS || item.bottom.length < ENDS) return null;
  const stamp = (tail: string): Provenance => ({ src: `editorial/editorial_feed.json:${ITEM}:${tail}`, kind: "worked out" });
  const ends = [...item.top.slice(0, ENDS), ...item.bottom.slice(-ENDS)];
  const rows: KitchensRow[] = ends.map((m) => ({
    key: m.member,
    name: COPY.home.kitchens.names[m.member] ?? m.member,
    value: m.value,
    prov: stamp(m.member),
  }));
  return { title: item.title, middle: { value: item.middle, prov: stamp(`the middle of ${item.members} boroughs`) }, count: item.members, rows };
}
