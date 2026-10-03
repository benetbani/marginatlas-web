/**
 * src/lib/uk/present/compare.ts
 *
 * Ranking members of a like-for-like set when each figure has an interval.
 *
 * LEVEL WITH. Members are sorted by value, highest first. A member is "level with" the group above it when its interval
 * overlaps the interval of that group's first member, its leader; otherwise it starts a new group. Members of one group
 * share a rank (1, 1, 1, 4). So no member is ranked below a leader the data cannot tell it apart from, and a page that
 * marks "the highest" marks a group, not a member, when the leader is level with the next. It is not a promise about every
 * pair: a member that overlaps another member, but not that member's leader, still starts a lower group (11 (10 to 12),
 * 9.5 (8.5 to 10.5) and 8 (7 to 9) rank 1, 1, 3: the 8 is apart from the 11, not from the 9.5), so levelWithAbove means
 * "level with its group's leader", never "level with the row above". Intervals are closed: two that touch at one point
 * overlap. Members with the same figure are taken lowest-reaching interval first (then highest-reaching), so a group that
 * starts among them is led by the one that can be told apart from the fewest members below, and no rank depends on the
 * order of the rows. Every interval must hold a finite figure between two finite ends: anything else is refused, since the
 * overlap test means nothing for it.
 *
 * SET STATISTICS WITHOUT FILLS. A set's median is taken over members whose figure is their own: a member carrying a fill
 * value (a default written in for a missing figure) is left out, and the count left out is returned, so a "world median"
 * can never be the fill value itself (PART 9 clause 46). An own figure that is not a finite number is refused, and so is a
 * member that does not say whether it is a fill.
 */
export type Ranked<T> = T & { rank: number; levelWithAbove: boolean };

export function rankWithTies<T extends { value: number; lo: number; hi: number }>(rows: readonly T[]): Ranked<T>[] {
  for (const r of rows) {
    // two finite ends with the figure between them, so the figure is finite too (a NaN fails both comparisons)
    if (!(Number.isFinite(r.lo) && Number.isFinite(r.hi) && r.lo <= r.value && r.value <= r.hi)) throw new RangeError(`rankWithTies: ${r.value} is not a figure inside its interval ${r.lo} to ${r.hi}`);
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
