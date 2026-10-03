/**
 * src/lib/uk/present/compare.ts
 *
 * Ranking members of a like-for-like set when each figure has an interval.
 *
 * LEVEL WITH. Members are sorted by value, highest first. A member is "level with" the group above it when its interval
 * overlaps the interval of that group's first member, its leader; otherwise it starts a new group. Members of one group
 * share a rank (1, 1, 1, 4), and a page that marks "the highest" marks a group, not a member, when the leader is level with
 * the next. What holds by construction: every member overlaps its own group's leader; no leader overlaps the leader of the
 * group above; ranks never rise down the list. It is a rule about leaders, not about every pair: a member can sit in a lower
 * group while overlapping a member, even a leader, of a higher one (28.9 (27.3 to 30.5), 12 (11 to 13) and 11 (2 to 29)
 * rank 1, 2, 2: the 11 overlaps the 28.9 but comes after the 12, which starts the second group). So levelWithAbove means
 * "level with its group's leader", and a page marks the top group by rank, never by levelWithAbove (two identical rows are
 * level in either order, but which of them carries the flag follows the rows). Intervals are closed: two that touch at one
 * point overlap. Members with the same figure are taken lowest-reaching interval first, then highest-reaching: that pools
 * the most (the fewest groups, in every one of 23,030 random tied sets), at the price of leaving a member below a leader it
 * overlaps a little more often than highest-reaching first would; either way no rank depends on the order of the rows. A
 * figure and both ends must be finite numbers, the figure between the ends: anything else is refused (a null would
 * otherwise compare as 0, and the overlap test means nothing for it).
 *
 * SET STATISTICS WITHOUT FILLS. A set's median is taken over members whose figure is their own: a member carrying a fill
 * value (a default written in for a missing figure) is left out, and the count left out is returned, so a "world median"
 * can never be the fill value itself (PART 9 clause 46). An own figure that is not a finite number is refused, and so is a
 * member that does not say whether it is a fill.
 */
export type Ranked<T> = T & { rank: number; levelWithAbove: boolean };

export function rankWithTies<T extends { value: number; lo: number; hi: number }>(rows: readonly T[]): Ranked<T>[] {
  for (const r of rows) {
    // all three finite numbers (a null figure would compare as 0), the figure between the ends
    if (!(Number.isFinite(r.value) && Number.isFinite(r.lo) && Number.isFinite(r.hi) && r.lo <= r.value && r.value <= r.hi)) throw new RangeError(`rankWithTies: ${r.value} is not a figure inside its interval ${r.lo} to ${r.hi}`);
  }
  const sorted = [...rows].sort((a, b) => b.value - a.value || a.lo - b.lo || b.hi - a.hi);
  const out: Ranked<T>[] = [];
  let groupHead: T | null = null;
  let rank = 0;
  sorted.forEach((r, i) => {
    // r.lo <= groupHead.hi always holds once sorted (r.lo <= r.value <= head.value <= head.hi); it is kept for the reader
    const overlaps = groupHead !== null && r.hi >= groupHead.lo && r.lo <= groupHead.hi;
    if (!overlaps) {
      groupHead = r;
      rank = i + 1;
    }
    out.push({ ...r, rank, levelWithAbove: overlaps });
  });
  return out;
}

export function medianExcludingFills(values: readonly { value: number; isFill: boolean }[]): { median: number | null; used: number; leftOut: number } {
  if (values.some((v) => typeof v.isFill !== "boolean")) throw new RangeError("medianExcludingFills: every member must say whether its figure is a fill");
  const own = values.filter((v) => !v.isFill).map((v) => v.value);
  if (own.some((x) => !Number.isFinite(x))) throw new RangeError(`medianExcludingFills: an own figure is not a finite number (${own.find((x) => !Number.isFinite(x))})`);
  own.sort((a, b) => a - b);
  const leftOut = values.length - own.length;
  if (own.length === 0) return { median: null, used: 0, leftOut };
  const m = own.length % 2 ? own[(own.length - 1) / 2] : (own[own.length / 2 - 1] + own[own.length / 2]) / 2;
  return { median: m, used: own.length, leftOut };
}
