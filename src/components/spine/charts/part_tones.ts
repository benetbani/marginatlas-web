/**
 * THE TONES OF A WHOLE'S PARTS, ONE RAMP FOR EVERY DRAWING OF A WHOLE (2026-09-26). The largest part in the accent, the second in
 * its tint, the rest neutrals that step from dark to light by how many there are: one is ink2; two are ink2 and line-strong, the
 * ramp's ends; three put ink2 at half strength between them. The ring (DonutStat), the older ring (Donut) and the share bar's plain
 * form each carried ink2 and muted as their third and fourth tones, which sit four points of lightness apart and read as one grey:
 * the United Kingdom's cash and digital wallet could not be told apart on the ring or its legend. A tone's `o` is an opacity, for
 * the stroke or the swatch that draws it.
 */
export type Tone = { c: string; o?: number };

const LEADS: Tone[] = [{ c: "var(--terra)" }, { c: "var(--terra-border)" }];
const NEUTRALS: Tone[][] = [
  [],
  [{ c: "var(--c-ink2)" }],
  [{ c: "var(--c-ink2)" }, { c: "var(--c-line-strong)" }],
  [{ c: "var(--c-ink2)" }, { c: "var(--c-ink2)", o: 0.45 }, { c: "var(--c-line-strong)" }],
];

/** The tones for a whole of `n` parts (two to five), largest part first. */
export function partTones(n: number): Tone[] {
  const count = Math.max(0, Math.min(5, n));
  return [...LEADS, ...NEUTRALS[Math.max(0, count - LEADS.length)]].slice(0, count);
}
