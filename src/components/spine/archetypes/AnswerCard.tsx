/**
 * AnswerCard , THE ANSWER-CARD ARCHETYPE (a page's masthead). The identity
 * row, a subtitle composed from what the card holds, the one answer-class
 * figure with its basis, and the companion facts as a KvGrid docked at the
 * card's half. Built once, drawn for every country; the city and trade
 * mastheads take the same component with their own facts.
 *
 * THE LAW INSIDE IT:
 *  - The name appears once, with its flag (founder, 2026-08-30).
 *  - The subtitle promises only what the card holds (the blueprint's rule; the
 *    builder composes it from the resolved cells).
 *  - The answer is the page's only 40; its label carries the SAMPLE tag when
 *    the answer is modelled (rule 4A), never the country name.
 *  - The companion grid is docked at the half from md up, top-aligned with the
 *    label, and fills row by row; with no cells the answer stands alone and
 *    nothing empty is drawn.
 *  - Words come from the copy table, in the practical register.
 *  - THE LEVEL (city:verdict, the build loop's run 23): at page level the
 *    opener is the identity row and the page's only h1; at section level (a
 *    page's second answer, the city's verdict card) the opener is the section
 *    rail, an icon tile and a kicker, and no h1 is drawn, so a page keeps one
 *    headline whatever its answer cards number. The harness reads the level
 *    and counts the h1s.
 */
import * as React from "react";
import { Band, Box, Rail, SampleTag } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/brand/icons";
import { AtlasMark } from "@/components/spine/marks";
import { CountryFlag } from "@/components/CountryFlag";
import { KvGrid, type KvCell } from "./KvGrid";
import { COPY } from "./copy";

export type AnswerCardProps = {
  id?: string;
  name: string;
  iso2?: string;
  /** A photograph beside the flag (a city's, the same file its card shows). */
  image?: { src: string; alt: string } | null;
  subtitle: string | null;
  /** `basis` replaces the country's composed basis line when the caller has its own (a city's "of the workforce"). */
  answer: { label: string; value: string; regime?: string | null; basis?: string | null; confidence: "measured" | "modeled" | "placeholder" } | null;
  cells: KvCell[];
  /** The answer wears the accent unless the page keeps its one accent elsewhere (the city blueprint: the verdict card's). */
  tone?: "accent" | "ink";
  /** One provenance line under the grid, with the modelled mark when the figures are modelled. */
  foot?: { text: string; modeled: boolean } | null;
  /** "page": the identity row and the h1 (a masthead). "section": the rail opener, no h1 (a verdict card below a masthead). */
  level?: "page" | "section";
  /** THE IDENTITY CRUMB (MODEL.md 8.6, `00 take`; the trade composition's
   * kit work 1.2; plan step 33's first dispatch, 2026-09-18): the segments
   * that place the h1 in its altitudes, drawn ONCE on one body line under the
   * h1 (the city masthead's own precedent, PART 3: "one --t-body line under
   * it names the country, once"), never above it (an eyebrow above a title
   * is clause 11's ban) and never in uppercase. The h1 is the first segment
   * by construction, so a caller passes the rest: on a trade page the city
   * and the country, and the place is named once on the page (clause 11).
   * Undefined on the country and city mastheads, which draw nothing new. */
  crumb?: string[];
  /** THE STATE WORD'S OWN STRINGS when `answer` is null: the label the answer
   * would carry, the word at figure size, and the note saying what is not
   * measured. The country's three (COPY.answer) are the default, so the
   * country masthead is unchanged; the trade masthead passes its own. */
  absent?: { label: string; word: string; note: string };
  /** The rail's icon tile at section level. */
  icon?: AtlasIconId;
  /** THE FOUNDER'S PLUS, at the card's actual foot (review finding 2, 2026-09-08):
   * a `DetailPanel` (or any disclosure) rendered under the grid and the
   * provenance line, exactly where DetailPanel's own doc comment says it
   * lives. Optional and undefined everywhere today; no current page passes
   * it, so no existing render changes. It exists so a section can nest the
   * plus at a real card's foot, the same way `cells` already nests a KvGrid. */
  detail?: React.ReactNode;
};

export function AnswerCard({ id = "take", name, iso2, image, subtitle, answer, cells, tone = "accent", foot, level = "page", icon, detail, crumb, absent }: AnswerCardProps) {
  const tagged = answer != null && answer.confidence !== "measured";
  const live = cells.filter((c) => c.value != null && c.value !== "");
  return (
    <Band hero>
      <Box id={id} data-archetype="answer-card" data-level={level}>
        {level === "section" ? (
          <Rail icon={icon} kicker={name} />
        ) : (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <AtlasMark id="alt-country" size={13} className="opacity-55" />
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image.src} alt={image.alt} width={80} height={60} className="h-[60px] w-20 shrink-0 rounded-lg object-cover" data-hero-image />
          ) : null}
          {/* size="hero" (2026-09-08, fix wave Finding 4): this identity row IS
              the masthead CountryFlag.tsx's own doc comment names as the one
              call site that should pass it explicitly (PART 3). Left at the
              default "row", it rendered the page's one true masthead flag at
              20px, the same size as a table row's inline mark. `w-9` is
              dropped rather than kept alongside it: CountryFlag's inline
              height/width always overrides a caller's width class, so it was
              already inert, just misleading to read next to a real size. */}
          {iso2 ? <CountryFlag iso2={iso2} size="hero" className="shrink-0" /> : null}
          <h1 id="headline" data-typography="custom" className="text-balance text-[length:var(--t-section)] font-semibold leading-[1.05] tracking-tight text-[var(--c-ink)]">
            {name}
          </h1>
        </div>
        )}
        {/* `data-subtitle` IS THE HARNESS'S HOOK, and it exists because the
            PROMISE rule used to find this line with `card.querySelector("p")`
            , the first paragraph anywhere inside the card. That held only
            while an answer-card contained no other paragraph. The moment
            DetailPanel nested at the foot of one carried a withheld line (a
            `p`, and this component's `detail` slot is built for exactly that
            nesting), the first `p` in the card became the panel's, and a rule
            about a SUBTITLE promising registration started reading a sentence
            it had never seen. The hook names the one element the rule is
            about, so nothing added below this line can be mistaken for it. */}
        {/* THE CRUMB, under the h1, one line at the body rung in ink2, the
            segments joined by a middle dot; the harness reads it by
            `data-crumb`. Nothing is drawn when a caller passes none, so
            the country and city cards are byte for byte what they were. */}
        {crumb && crumb.length > 0 ? <p data-crumb className="mt-1 text-[length:var(--t-body)] text-[var(--c-ink2)]">{crumb.join(COPY.tradeHero.crumbJoin)}</p> : null}
        {subtitle ? <p data-subtitle className="mt-1.5 max-w-[52ch] text-balance text-[length:var(--t-body)] text-[var(--c-ink2)]">{subtitle}</p> : null}
        {/* THE SPLIT ONLY WHEN THERE ARE CELLS. Measured by the harness at 768:
            a 1-1 split put a 130px answer beside a 250px grid and left a
            363x120 hole under the answer (E6). At tablet the answer takes a
            third and the grid two thirds, so the grid's cells widen, their
            notes stop wrapping, and the columns finish within the quarter;
            from lg the halves are equal. With no cells the answer stands
            alone. */}
        <div className={`mt-6 grid grid-cols-1 gap-8 ${live.length > 0 ? "md:grid-cols-[1fr_2fr] md:gap-10 lg:grid-cols-2 lg:gap-12" : ""}`} data-state={answer ? (live.length ? "answer-and-cells" : "answer-only") : "no-answer"}>
          {answer ? (
            <div data-answer="1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{answer.label}</div>
                {tagged ? <SampleTag /> : null}
              </div>
              <div className={`fig text-[length:var(--t-answer)] leading-none ${tone === "ink" ? "text-[var(--c-ink)]" : "text-[var(--terra-text)]"}`}>{answer.value}</div>
              <div className="mt-2.5 max-w-[40ch] text-balance text-[length:var(--t-body)] text-[var(--c-ink2)]">
                {answer.basis != null ? answer.basis : COPY.answer.basis}
                {answer.regime ? (
                  <>
                    {" "}{COPY.answer.basisUnder} <span className="text-[var(--c-ink)]">{answer.regime}</span>
                  </>
                ) : null}
              </div>
            </div>
          ) : (
            /* THE STATE WORD (catalogue I9): absence said as a word at figure
               size, with its label, never an empty slot and never a fabricated
               rate. Ink, not the accent: it is not an answer. */
            <div data-answer-absent="1">
              <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{absent?.label ?? COPY.answer.label}</div>
              <div className="mt-1 text-[length:var(--t-head)] font-medium leading-none text-[var(--c-ink)]">{absent?.word ?? COPY.answer.absent}</div>
              <div className="mt-2.5 max-w-[40ch] text-[length:var(--t-body)] text-[var(--c-ink2)]">{absent?.note ?? COPY.answer.absentNote}</div>
            </div>
          )}
          {live.length > 0 ? <KvGrid cells={live} /> : null}
        </div>
        {foot ? (
          <div data-foot className="mt-4 flex items-start gap-1.5 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">
            {foot.modeled ? <AtlasMark id="modeled" size={14} className="mt-px shrink-0" /> : null}
            <span className="max-w-[56ch]">{foot.text}</span>
          </div>
        ) : null}
        {detail}
      </Box>
    </Band>
  );
}
