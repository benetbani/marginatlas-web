/**
 * src/lib/spine/loud_seats.ts
 *
 * THE SHAPE OF A PAGE'S LOUD-MOMENTS LEDGER (plan-2026-09-17/04-PAGES.md step
 * 40, 2026-09-19; MODEL.md PART 6, "three loud moments or fewer, two quiet
 * cards between loud ones", and PART 8's "THE THREE LOUD MOMENTS" seat tables
 * on 8.2, 8.3, 8.6, 8.7 and 8.8, and 8.9's "Loud today: 0 of 3").
 *
 * A page carries three loud moments or fewer, his ruling; a loud moment is an
 * accent figure, text in `--terra-text` (M8). Each surface's VIEW exports a
 * `LOUD_SEATS` table of this shape, three entries, seats 1 to 3, declared
 * beside the code that lights or holds them and never typed into a document:
 * the section census (scripts/harness/census.ts) reads the six tables off the
 * views' source and prints the ledger into PAGES.md's generated block and
 * docs/loop/CENSUS.md, and the loud-seats gate (scripts/verify_loud_seats.ts)
 * holds every render in scripts/harness/pages.json to its declaration with
 * the page filter's own accent walk: the LIT seats and the measured accents
 * must agree, card by card.
 *
 * THE STATES, the brief's vocabulary of three:
 *   LIT                  the figure is in `--terra-text` on the page; the
 *                        render carries one accent in that card. A LIT seat
 *                        whose figure the data withholds is unlit on that
 *                        render (the model's own rows: "LIT where held or
 *                        baseline; UNLIT where withheld"), and the gate reads
 *                        the withheld state off the render's own markers
 *                        (an AnswerCard's data-state="no-answer", a
 *                        BentoMetric's data-withheld-line="focal", PayBars'
 *                        data-withheld="1", a drawn blocked seat's
 *                        data-blocked) and says so; it never reads a missing
 *                        accent as withheld on a card that prints its figure.
 *   HELD EMPTY           the seat is named and unlit, on a condition the
 *                        entry states (a DATA-REQUIREMENTS item, a ruling, a
 *                        form awaiting his click). The card carries no accent.
 *   NO HONEST CANDIDATE  no figure in that turn could honestly be lit, by a
 *                        ruling the entry names (the hood's turn one under the
 *                        no-featuring ruling; the how-to page by design).
 *
 * `card` is the block as the seat table names it ("00 take", "turn two, `03`
 * or `09`"); a LIT seat's card is matched to the render's accents by its DOM
 * id, the block's word after the two-digit number ("take", "hiring", "open"),
 * or `id` where the two differ (the city's masthead is `city-take`). A seat
 * that is not LIT needs no id.
 *
 * The declaration is data, read from source by scripts/lib/loud_seats.ts: the
 * entries are object literals of numbers and double-quoted strings and nothing
 * else, so the census can read them without importing a view (a view's module
 * graph builds the database client at import, and the chain never needs a
 * secret). `satisfies readonly LoudSeat[]` keeps the shape type-checked.
 */
export const LOUD_STATES = ["LIT", "HELD EMPTY", "NO HONEST CANDIDATE"] as const;

export type LoudState = (typeof LOUD_STATES)[number];

export type LoudSeat = {
  /** 1, 2 or 3: the model's own count, one entry per seat. */
  seat: 1 | 2 | 3;
  /** The block as the seat table names it: "00 take", "08 hiring", "turn two, `03` or `09`". */
  card: string;
  /** What is lit, in the table's words. */
  figure: string;
  state: LoudState;
  /** The DATA-REQUIREMENTS item or the ruling the state stands on, and where the table is stale, what is true today and the bracket that says so. */
  condition: string;
  /** The card's DOM id where it is not the block's word (the city's masthead: `city-take`). */
  id?: string;
};

/** The DOM id a LIT seat is matched by: `id` when given, else the block's word after its two-digit number; null when neither names a card. */
export function loudCardId(seat: Pick<LoudSeat, "card" | "id">): string | null {
  if (seat.id) return seat.id;
  const m = /^\d\d\s+([a-z][a-z0-9-]*)$/.exec(seat.card.trim());
  return m ? m[1] : null;
}

/** How many of the three seats are declared LIT: the ledger's "Loud today: n of 3". */
export function litCount(seats: readonly LoudSeat[]): number {
  return seats.filter((s) => s.state === "LIT").length;
}
