/**
 * src/lib/home/duel.ts
 *
 * THE DUEL (his ruling of 2026-10-05 on PARKED P36.2, option (a): "the duel" from the trades that fail most first, checked
 * against the 45-day rule before it prints; HOMEPAGE-EDITORIAL.md, format 2): a question and the two ends of its set on one scale,
 * like for like (trades ranked, the place held, the UK). Every number from data/editorial/editorial_feed.json, the registers'
 * feed (registers/uk/build_editorial.py), never typed here.
 *
 * In the trade pages' own unit, companies insolvent a year of 100 (a London trade page prints "2.9 of 100 UK companies insolvent
 * a year"), so the home page and the page a bar opens print one figure for one fact. The feed's rates are per 1,000 with one
 * decimal; one decimal per 100 is the same figure rounded, and the rounding is the trade page's.
 *
 * The drawing is the site's ranked bars with the set's two highest and two lowest (the form draws its bars from four rows), no
 * member featured (a failure ranking names nobody best), and the set's middle as the card's figure, a figure no bar prints.
 *
 * THE 45-DAY RULE: a monthly item prints for 45 days from the day its data ends (`as_of`, read by the feed off its table's own
 * source line), never from the day the feed was rebuilt; a monthly item without that date never prints.
 */
import feedJson from "../../../data/editorial/editorial_feed.json";
import type { Provenance } from "@/lib/spine/provenance";
import type { DoorKind } from "@/lib/spine/door_kinds";
import { SURFACE_ANSWERS } from "@/lib/spine/door_kinds";
import { COPY } from "@/lib/spine/copy";

export const FRESH_DAYS = 45;
const ITEM = "fail-most";

type Member = { member: string; trades: string[]; value: number };
type FeedItem = { id: string; title: string; line: string; refresh: string; as_of?: string; members: number; middle?: number; top: Member[]; bottom: Member[] };

export type DuelRow = { key: string; name: string; value: number; href: string; lands: DoorKind; prov: Provenance };
export type Duel = { title: string; middle: { value: number; figure: string; prov: Provenance }; count: number; rows: DuelRow[]; asOf: string };

/** Whether an item may print on `today` (an ISO date): a yearly item always; a monthly item for 45 days from its data's end. */
export function isFresh(item: { refresh: string; as_of?: string }, today: string): boolean {
  if (!/^monthly/i.test(item.refresh)) return true;
  if (!item.as_of) return false;
  const age = (Date.parse(today) - Date.parse(item.as_of)) / 86_400_000;
  return Number.isFinite(age) && age >= 0 && age <= FRESH_DAYS;
}

/** Per 1,000 to per 100, one decimal: 28.9 reads 2.9, as the trade pages print it. */
const per100 = (perThousand: number) => Math.round(perThousand) / 10;

/** The duel, or null when the feed holds no fresh item, no middle or too few members at either end. */
export function buildDuel(today: string = new Date().toISOString().slice(0, 10)): Duel | null {
  const item = (feedJson as unknown as { items: FeedItem[] }).items.find((i) => i.id === ITEM);
  if (!item || !isFresh(item, today) || typeof item.middle !== "number" || item.top.length < 2 || item.bottom.length < 2) return null;
  const ends = [...item.top.slice(0, 2), ...item.bottom.slice(-2)];
  if (ends.some((m) => !m.trades?.[0])) return null;
  const stamp = (tail: string): Provenance => ({ src: `editorial/editorial_feed.json:${ITEM}:${tail}`, kind: "worked out" });
  const rows: DuelRow[] = ends.map((m) => ({
    key: m.trades[0],
    /* The code's own name, in three words or fewer (his labels rule): a longer one takes its plain name from the copy table. */
    name: COPY.home.duel.names[m.member] ?? m.member,
    value: per100(m.value),
    href: `/gb/london/${m.trades[0]}`,
    lands: SURFACE_ANSWERS.cell,
    prov: stamp(m.member),
  }));
  const middle = per100(item.middle);
  return { title: item.title, middle: { value: middle, figure: middle.toFixed(1), prov: stamp(`the middle of ${item.members} trades`) }, count: item.members, rows, asOf: item.as_of as string };
}
