"use client";
/**
 * The expandable legal-form table (founder, 2026-08-30 second batch, verbatim:
 * "I've told you multiple times that this should be an expandable section, so
 * when the person can click, he can see more about each category... the old
 * table was pretty good, but it should be expandable. With the complexity as
 * pointers having those terracotta points, that's quite nice.").
 *
 * Each row: tier name with the local term quiet beneath it (his praise, kept),
 * fee, time, paperwork as one-to-five terracotta dots (accent register 4),
 * a chevron. Clicking expands a quiet panel holding a UNIVERSAL explainer of
 * what that legal form IS , definitional prose, true in every country, never
 * a country claim (rule 21) , plus what its paperwork level means. K6 holds:
 * every figure is visible collapsed; only prose lives behind the disclosure.
 *
 * ================ B8, 2026-09-02: THE FORM SURVIVES, THE ROW DOES NOT ========
 *
 * THE QUEUE PREDICTED OptionCards AND THE FIXTURE REFUSES IT, which is the
 * sixth row in this loop where a prediction was wrong about its own data. Four
 * reasons, any one arguable and the four together not:
 *
 * (1) IT REFUSES THE DATA ON TWO REAL PAGES. `business_formation_costs_v1.json`
 *     carries 107 countries with three tiers, 30 with two, 13 with four and TWO
 *     WITH FIVE, Germany and Italy. OptionCards refuses five rather than
 *     truncating, on its own stated ground, so this whole section would vanish
 *     from those two pages.
 * (2) THE OPTIONS ARE NOT DISTINGUISHED BY ONE FIGURE AND THAT FORM HOLDS ONE.
 *     Every row carries three. In the United Kingdom the fee separates a sole
 *     trader from a limited company by fifteen dollars and the filing time not
 *     at all; what separates them is the liability wall, which is not a figure.
 *     Passing the fee as the distinguishing one would tell a reader the choice
 *     is a fifteen-dollar decision, which is B4's error in another costume.
 * (3) THE PROSE IS THE READING AND THAT FORM CLAMPS IT AT THREE LINES with no
 *     disclosure, so every definition would be cut mid-sentence, or all of them
 *     would sit open at once, which is the wall of text the founder rejected on
 *     this very page (verdict 9).
 * (4) THIS DESIGN IS RATIFIED IN HIS OWN WORDS, above, in three parts: the
 *     expandability, the table, and the terracotta dots.
 *
 * WHAT THE INFORMATION IS: entities across several metrics (a name, a local
 * name, a fee, a filing time, a paperwork level), which the index sends to a
 * table. A8 re-typed the wage card the same way for the same reason: the
 * comparison runs DOWN the columns.
 *
 * SO THE FORM STAYS AND THE ROW HAD REAL WORK, and the photograph is what found
 * it. At 375 the row was a wrapping flex of six inline items and it broke in a
 * different place on every line: the local term split around the figures
 * ("LLC Private Limited $15 1 day" then "Company (Ltd)" underneath), the dots
 * landed on three different lines, and one chevron ended up alone at the left.
 * Step 6 is explicit that a wide thing RECONFIGURES rather than wrapping. It is
 * TWO BLOCKS now, a name block and a readings block, so a wrap can only ever
 * happen BETWEEN them and never inside either, and it is driven by the CARD's
 * own width rather than the viewport's (run 7's ruling: a viewport breakpoint
 * is a proxy for a card width and it is wrong wherever a narrow card sits on a
 * wide screen).
 *
 * THE IDEA IS DECLARED ONCE, ON THE SET. The dots are a count of identical
 * marks with no continuous scale, which is I5, and the country page had spent
 * none of its three. It is NOT declared per row, and that is the whole lesson
 * of B7 arriving in a second place: the kit's own `Dots` declares I5 per
 * instance, so a column of three would have failed the form-variety gate's
 * per-card clause on a page the gate actually reads. SpectraTable settled this
 * one run earlier by tagging its wrapper once.
 */
import * as React from "react";
import { Fig } from "@/components/spine/kit";

export type SetupTier = {
  tier: string;
  local_term?: string;
  cost_usd?: number;
  days?: number;
  complexity_1_5?: number;
};

/* What each legal FORM is, in plain words. Definitional, not a country fact:
   the same sentence is true in Tirana and in Tokyo, which is what makes it
   legal to hand-write here (rule 21; rule 0 bans invented country figures,
   not the dictionary). */
const EXPLAINERS: Record<string, string> = {
  Freelancer:
    "Self-employed with no separate company behind you. The income is taxed as your own and the debts are your own, and many countries offer a simplified tax regime for it. The lightest way to be paid for your own work.",
  "Sole Trader":
    "One person trades under their own name. There is no wall between the owner and the business: debts are personal, and so are the profits. The fastest and cheapest way in, and the form most small shops start with.",
  LLC:
    "A company that stands apart from its owner: liability stops at what the company owns. More paperwork and a public filing, in exchange for that wall. The usual step up once a shop takes on staff or signs a lease.",
  "Joint-Stock":
    "A company built to carry many shareholders and outside capital: boards, audits, public accounts. The heaviest form to run, and rarely the first one a small shop needs.",
};

/* WHAT A PAPERWORK LEVEL MEANS, one line each, the scale's own definitions. A
   dot count says how many, never how much, so the panel says it in words. This
   REPLACED a line that restated the row's own three figures forty pixels above
   it, which is the duplication B3 and B7 both had to cut from their own cards. */
const PAPERWORK: Record<number, string> = {
  1: "An online form in under an hour. No notary, no capital, nobody to visit.",
  2: "Online in a day, with a little documentation and no notary.",
  3: "Several steps, a registered office and a tax registration, done in a week or two.",
  4: "A notary or a court, minimum capital and signed articles. Three to six weeks.",
  5: "A lawyer, a notary, several offices to visit and capital to deposit. Often two months.",
};

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/* THE FEE IS PRINTED EXACTLY, AND IT IS A CORRECTION RATHER THAN A PREFERENCE.
   The kit's `usd` abbreviates at a thousand and rounds to the nearest one, which
   is right for a $426K fit-out, where the last three digits are noise, and wrong
   for a fee a registry publishes to the euro. Counted on the file: FIFTY-THREE
   rows across FIFTY-TWO countries carry a fee that the abbreviation misprints.
   Germany's GmbH costs $1,500 and read "$2K"; Belgium's limited company costs
   $1,200 and read "$1K"; Italy's S.r.l. costs $2,500 and read "$2K". A published
   exact figure overstated by a third is the visibly-wrong-number class, not a
   rounding style. Nothing else on the page is affected, because the masthead and
   the peers table both carry the cheapest tier's fee, which is under a thousand
   almost everywhere. */
const fee = (v: number) => "$" + Math.round(v).toLocaleString("en-US");

/* THE PANEL IS ITS OWN EXPORT SO ITS OPEN STATE CAN BE PHOTOGRAPHED, which is
   not a convenience: this is a client component and BOTH harnesses render it
   server-side with the disclosure shut, so until now the open state existed
   only on the live route and no photograph of it had ever been taken. Exported,
   the branch harness renders the shipped markup itself rather than a replica of
   it. It says what the FORM is and what its paperwork level means, and nothing
   else: the line that used to sit here restated the row's own three figures
   forty pixels above them, which is B3's and B7's duplication in a third place. */
export function TierPanel({ explainer, paperwork }: { explainer?: string; paperwork?: string }) {
  if (!explainer && !paperwork) return null;
  return (
    <div className="mt-2 rounded-[8px] bg-[var(--c-soft)] p-4">
      {explainer ? (
        <p className="text-[length:var(--t-micro)] leading-relaxed text-[var(--c-ink2)]">{explainer}</p>
      ) : null}
      {paperwork ? (
        <p
          className={
            "text-[length:var(--t-micro)] leading-relaxed text-[var(--c-muted)]" + (explainer ? " mt-2" : "")
          }
        >
          {paperwork}
        </p>
      ) : null}
    </div>
  );
}

export function SetupTiers({ tiers }: { tiers: SetupTier[] }) {
  /* KEYED BY POSITION, NOT BY TIER NAME, and this is a live defect the branch
     harness found rather than a tidy-up. ELEVEN countries carry the same tier
     name twice, because one legal family holds two real forms: Germany files a
     UG and a GmbH as LLC, Italy an S.r.l.s. and an S.r.l. Keyed by name, React
     saw duplicate keys and, worse, `open === t.tier` matched BOTH rows, so a
     reader clicking one of Germany's two limited companies opened the other one
     as well. DE, IT, IN, GR, VN, PH, AR, CL, LT, LU and ZW all reach it. */
  const [open, setOpen] = React.useState<number | null>(null);
  const anyDots = tiers.some((t) => isNum(t.complexity_1_5));
  return (
    <>
      {/* THE SET DECLARES, NOT THE ROW. See the header. */}
      <div data-idea="I5" className="divide-y divide-[var(--c-border)]">
        {tiers.map((t, i) => {
          const isOpen = open === i;
          const explainer = EXPLAINERS[t.tier];
          const paperwork = isNum(t.complexity_1_5) ? PAPERWORK[t.complexity_1_5] : undefined;
          const hasPanel = Boolean(explainer || paperwork);
          const localTerm = t.local_term && t.local_term !== t.tier ? t.local_term : null;
          /* THE NAME BLOCK IS ONE OBJECT AND ITS TWO LINES ARE KERNED, not
             spaced: a two-pixel gap between a name and the local name for the
             same thing is the ring's own distinction (A4), one object kerned
             against two blocks separated. The local term sits UNDER the name
             rather than beside it, which is B1's ratified fix for the identical
             fault: inline, the longest one in the file runs to 56 characters
             and broke around the figures at every width. */
          const nameBlock = (
            <span className="min-w-0 flex-[1_1_11rem]">
              <span className="block text-[length:var(--t-section)] font-medium leading-tight text-[var(--c-ink)]">
                {t.tier}
              </span>
              {localTerm ? (
                <span className="mt-0.5 block text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">
                  {localTerm}
                </span>
              ) : null}
            </span>
          );
          /* THE READINGS BLOCK. Four fixed columns, so the fee, the time and the
             dots line up DOWN the card whatever a name's length, which is what
             makes this a table rather than three rows of facts. The widths are
             measured against the file's own extremes, a $12,000 fee and a
             90-day wait, not against the United Kingdom's.
             THE LEADING 1fr SPACER IS WHAT GIVES THE SET ONE GRAMMAR AT BOTH
             WIDTHS. The block grows, and the spacer eats whatever it grows by,
             so the four columns stay packed to the card's own right edge
             whether they sit beside a name or on their own line beneath one. At
             375 without it the wrapped readings floated 66px in from the left
             with 30px of slack at the right, and the chevron, which is an
             affordance and should be in the same place always, moved with them. */
          const readings = (
            <span className="grid flex-[1_0_auto] grid-cols-[minmax(0,1fr)_5.5rem_5rem_3.75rem_0.75rem] items-baseline gap-x-3">
              <span aria-hidden />
              <span className="text-right">
                {t.cost_usd === 0 ? (
                  <span className="text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">Free</span>
                ) : isNum(t.cost_usd) ? (
                  <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">{fee(t.cost_usd)}</Fig>
                ) : null}
              </span>
              <span className="text-right">
                {isNum(t.days) ? (
                  <Fig className="text-[length:var(--t-body)] text-[var(--c-ink2)]">
                    {t.days} {t.days === 1 ? "day" : "days"}
                  </Fig>
                ) : null}
              </span>
              <span className="flex justify-end gap-1">
                {isNum(t.complexity_1_5) ? (
                  <span
                    aria-label={"paperwork " + t.complexity_1_5 + " of 5"}
                    role="img"
                    className="flex items-center gap-1"
                  >
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: i <= (t.complexity_1_5 as number) ? "var(--terra)" : "var(--c-soft2)" }}
                      />
                    ))}
                  </span>
                ) : null}
              </span>
              <span
                aria-hidden
                className={`text-right text-[length:var(--t-micro)] text-[var(--c-muted)] transition-transform ${
                  isOpen ? "rotate-90" : ""
                }`}
              >
                {hasPanel ? "›" : ""}
              </span>
            </span>
          );
          return (
            <div key={`${t.tier}-${i}`} className="py-2 first:pt-0 last:pb-0">
              {/* TWO BLOCKS, SO A WRAP LANDS BETWEEN THEM AND NEVER INSIDE ONE.
                  The name asks for 11rem and grows; the readings never shrink.
                  Below about 470px of row the readings drop to their own line,
                  left-packed under the name, columns still aligned across the
                  set. That is the reconfigure step 6 asks for, and it is the
                  card's width that decides it rather than the screen's. */}
              {hasPanel ? (
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full flex-wrap items-baseline justify-between gap-x-4 gap-y-2 text-left"
                >
                  {nameBlock}
                  {readings}
                </button>
              ) : (
                <div className="flex w-full flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                  {nameBlock}
                  {readings}
                </div>
              )}
              {isOpen && hasPanel ? <TierPanel explainer={explainer} paperwork={paperwork} /> : null}
            </div>
          );
        })}
      </div>
      {/* THE ONE COLUMN THAT CANNOT NAME ITSELF. A fee reads as money and a
          filing time reads as days; five dots read as nothing at all, and the
          only place the scale was named was an aria-label. A legend under the
          set is the card's own job (A9's ruling for the dashed reference rule),
          and it costs one quiet line where a head row would have cost an empty
          first line every time the readings wrapped. */}
      {anyDots ? (
        <div className="mt-2 border-t border-[var(--c-border)] pt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">
          Dots are the paperwork: one is an online form, five is a notary and a lawyer.
        </div>
      ) : null}
    </>
  );
}
