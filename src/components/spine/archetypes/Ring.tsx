/**
 * Ring, HIS B4 AND THE GOLD STANDARD'S B31 (rules/FOUNDER-VERDICTS.md 2026-09-10
 * and 2026-09-20; design/references/founder-2026-09-20-gold-standard-sections.md):
 * one share of a whole drawn as a sweep around a ring, the figure inside it,
 * one caption under. The first question, PART 9 clause 57: a single share
 * (the part of a day that pays the fixed costs) is best shown as how much of
 * the circle it takes, so the eye reads "most of the day" or "a third of it"
 * before the number. Its family is the shape-and-area family, beside the
 * donut; where the donut is many parts, the ring is one.
 *
 * THE LAW, inside the component:
 *  - THE SWEEP: an SVG circle, the share's arc in the accent from twelve
 *    o'clock, the rest in the accent's tint; a share over the whole (a day
 *    that does not clear its costs) fills the ring and the figure says the
 *    number past a hundred, never a second lap.
 *  - THE FIGURE inside the ring at the focal rung (`size="focal"`, the default,
 *    a 144px ring); `accent` puts it in the accent text colour (the seat's
 *    declared loud moment), else ink. One caption under the ring at the micro
 *    rung, in grey.
 *  - `size="lead"`: the figure at the lead rung (16px semibold, var(--t-lead))
 *    in a 96px ring, so a ring beside a card's focal figure is never a second
 *    30. Its caption takes `text-balance` (fix round 2b): in the 22ch box the
 *    joins' "in 100 names found in the register" broke as "in 100 names found
 *    in the" and "register" at every width, a word left alone under the ring;
 *    balanced it breaks as "in 100 names found" and "in the register". Only
 *    the lead ring takes it, so no other ring's caption moves.
 *  - `data-archetype="ring"`, `data-visual="1"`, `data-share` the whole
 *    percent. No second hue.
 *  - `tone="ink"` (plan 2026-10-10, the home reformed to ship, Task 4; the
 *    critique's P1.1): the sweep in ink2 on the soft grey, for a ring in a
 *    quiet card (the home's joins), where the accent belongs to the page's
 *    answer. The default, "accent", is the terracotta pair as before.
 *  - THE CAP (P1.6): round, but butt above 90 percent, so a nearly closed
 *    ring shows no notch at twelve o'clock where the round cap overlapped.
 *    Pinned at its edge in tests/spine/home_forms.test.ts: 91 butt, 90 round.
 *  - THE LABEL (the closing cleanup of the same plan, item 13): the svg's
 *    account to a screen reader is the figure and the caption's words when a
 *    caption is given ("97 in 100 names found in the register"; a caption that
 *    is a node is read for its text, a stamped figure in it included), and the
 *    figure and "of the whole" only when there is none. It said "97 of the
 *    whole" beside a caption that says what the 97 is of.
 *
 * Gated by the archetype harness (stories `ring`: the exemplar, a share over
 * a hundred, a share under a quarter) and the page laws.
 */
import * as React from "react";
import { provAttrs, type Provenance } from "@/lib/spine/provenance";

/** The words of a caption node as a screen reader gets them: a string or a number as it is, an element by its children, so a caption
 *  that holds a stamped figure ("of <Fig>31,376</Fig> names found in the register") reads whole. */
function wordsOf(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(wordsOf).join("");
  if (React.isValidElement(node)) return wordsOf((node.props as { children?: React.ReactNode }).children);
  return "";
}

/** `prov` stamps the figure inside the ring with where it came from (plan 06, task B5), as every other figure is stamped. `size`
 *  (plan 2026-10-09, home introduction): "lead" draws a 96px ring with its figure at the lead rung (16, semibold), for a ring that is a
 *  card's second reading, so the card's one 30 stays its focal (PART 4); "focal", the default, is the 144px ring and its 30. The caption
 *  is a node, so it may hold a stamped figure. */
export function Ring({ value, figure, caption, accent = false, prov, size = "focal", tone = "accent" }: { value: number; figure: string; caption?: React.ReactNode; accent?: boolean; prov?: Provenance | null; size?: "focal" | "lead"; /** "ink": the sweep in ink2 on the soft grey, for a quiet card (plan 2026-10-10, home reform, Task 4). */ tone?: "accent" | "ink" }) {
  if (!Number.isFinite(value) || value <= 0) return null;
  const share = Math.min(1, value / 100);
  const r = 44, c = 2 * Math.PI * r;
  const len = share * c;
  const lead = size === "lead";
  const ink = tone === "ink";
  const label = `${figure} ${wordsOf(caption).replace(/\s+/g, " ").trim() || "of the whole"}`;
  return (
    <div data-archetype="ring" data-visual="1" data-share={String(Math.round(value))} className="flex flex-col items-center">
      <div className={lead ? "relative h-24 w-24" : "relative h-36 w-36"}>
        <svg viewBox="0 0 120 120" width={lead ? "96" : "144"} height={lead ? "96" : "144"} role="img" aria-label={label} className={lead ? "block h-24 w-24" : "block h-36 w-36"}>
          <circle r={r} cx="60" cy="60" fill="none" stroke={ink ? "var(--c-soft2)" : "var(--terra-soft)"} strokeWidth="14" />
          <circle r={r} cx="60" cy="60" fill="none" stroke={ink ? "var(--c-ink2)" : "var(--terra)"} strokeWidth="14" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={c / 4} strokeLinecap={share > 0.9 ? "butt" : "round"} data-sweep />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`fig ${lead ? "text-[length:var(--t-lead)] font-semibold" : "text-[length:var(--t-focal)]"} leading-none ${accent ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`} {...provAttrs(prov)}>{figure}</span>
        </div>
      </div>
      {caption ? <div data-mark-label className={`mt-2 max-w-[22ch] text-center text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]${lead ? " text-balance" : ""}`}>{caption}</div> : null}
    </div>
  );
}
