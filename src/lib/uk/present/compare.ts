/**
 * src/lib/uk/present/compare.ts
 *
 * Ranking members of a like-for-like set when each figure has an interval.
 *
 * LEVEL WITH. Members are sorted by value, highest first. A member is "level with" the group above it when its interval
 * overlaps the interval of that group's first member; otherwise it starts a new group. Members of one group share a rank.
 * So the ranking never orders two figures the data cannot tell apart, and a page that marks "the highest" marks a group,
 * not a member, when the leader is level with the next. Intervals are closed, so two that touch at one point overlap.
 * Every interval must hold its figure: a figure that is not a finite number, an interval the wrong way round or a figure
 * outside its interval is refused, since the overlap test means nothing for it.
 *
 * SET STATISTICS WITHOUT FILLS. A set's median is taken over members whose figure is their own: a member carrying a fill
 * value (a default written in for a missing figure) is left out, and the count left out is returned, so a "world median"
 * can never be the fill value itself (PART 9 clause 46). An own figure that is not a finite number is refused.
 */
export type Ranked<T> = T & { rank: number; levelWithAbove: boolean };

export function rankWithTies<T extends { value: number; lo: number; hi: number }>(rows: readonly T[]): Ranked<T>[] {
  for (const r of rows) {
    if (!Number.isFinite(r.value) || !(r.lo <= r.value && r.value <= r.hi)) throw new RangeError(`rankWithTies: ${r.value} is not a figure inside its interval ${r.lo} to ${r.hi}`);
  }
  const sorted = [...rows].sort((a, b) => b.value - a.value);
  const out: Ranked<T>[] = [];
  let groupHead: T | null = null;
  let rank = 0;
  sorted.forEach((r, i) => {
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
  const own = values.filter((v) => !v.isFill).map((v) => v.value);
  if (own.some((x) => !Number.isFinite(x))) throw new RangeError(`medianExcludingFills: an own figure is not a finite number (${own.find((x) => !Number.isFinite(x))})`);
  own.sort((a, b) => a - b);
  const leftOut = values.length - own.length;
  if (own.length === 0) return { median: null, used: 0, leftOut };
  const m = own.length % 2 ? own[(own.length - 1) / 2] : (own[own.length / 2 - 1] + own[own.length / 2]) / 2;
  return { median: m, used: own.length, leftOut };
}
