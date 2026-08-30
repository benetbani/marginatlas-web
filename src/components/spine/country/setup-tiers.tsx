"use client";
/**
 * The expandable legal-form table (founder, 2026-08-30 second batch, verbatim:
 * "I've told you multiple times that this should be an expandable section, so
 * when the person can click, he can see more about each category... the old
 * table was pretty good, but it should be expandable. With the complexity as
 * pointers having those terracotta points, that's quite nice.").
 *
 * Each row: tier name with the local term quiet beside it (his praise, kept),
 * fee, time, complexity as one-to-five terracotta dots (accent register 4),
 * a chevron. Clicking expands a quiet panel holding a UNIVERSAL explainer of
 * what that legal form IS , definitional prose, true in every country, never
 * a country claim (rule 21) , plus the tier's own figures restated in one
 * label/value line. K6 holds: every figure is visible collapsed; only prose
 * lives behind the disclosure.
 */
import * as React from "react";
import { Fig, usd } from "@/components/spine/kit";

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
  "Sole Trader":
    "One person trades under their own name. There is no wall between the owner and the business: debts are personal, and so are the profits. The fastest and cheapest way in, and the form most small shops start with.",
  LLC:
    "A company that stands apart from its owner: liability stops at what the company owns. More paperwork and a public filing, in exchange for that wall. The usual step up once a shop takes on staff or signs a lease.",
  "Joint-Stock":
    "A company built to carry many shareholders and outside capital: boards, audits, public accounts. The heaviest form to run, and rarely the first one a small shop needs.",
};

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export function SetupTiers({ tiers }: { tiers: SetupTier[] }) {
  const [open, setOpen] = React.useState<string | null>(null);
  return (
    <div className="divide-y divide-[var(--c-border)]">
      {tiers.map((t) => {
        const isOpen = open === t.tier;
        const explainer = EXPLAINERS[t.tier];
        return (
          <div key={t.tier} className="py-2.5 first:pt-0 last:pb-0">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : t.tier)}
              aria-expanded={isOpen}
              className="flex w-full flex-wrap items-baseline gap-x-4 gap-y-1 text-left"
            >
              <span className="min-w-[9rem] flex-[1_1_9rem]">
                <span className="text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{t.tier}</span>
                {t.local_term && t.local_term !== t.tier ? (
                  <span className="ml-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">{t.local_term}</span>
                ) : null}
              </span>
              <span className="whitespace-nowrap">
                {t.cost_usd === 0 ? (
                  <span className="text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">Free</span>
                ) : isNum(t.cost_usd) ? (
                  <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">{usd(t.cost_usd)}</Fig>
                ) : null}
              </span>
              {isNum(t.days) ? (
                <span className="whitespace-nowrap">
                  <Fig className="text-[length:var(--t-body)] text-[var(--c-ink2)]">
                    {t.days} {t.days === 1 ? "day" : "days"}
                  </Fig>
                </span>
              ) : null}
              {isNum(t.complexity_1_5) ? (
                <span aria-label={"complexity " + t.complexity_1_5 + " of 5"} className="ml-auto flex items-center gap-1">
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
              <span
                aria-hidden
                className={`shrink-0 text-[length:var(--t-micro)] text-[var(--c-muted)] transition-transform ${isOpen ? "rotate-90" : ""}`}
              >
                &#8250;
              </span>
            </button>
            {isOpen && explainer ? (
              <div className="mt-2 rounded-[8px] bg-[var(--c-soft)] px-3 py-2.5">
                <p className="text-[length:var(--t-small)] leading-relaxed text-[var(--c-ink2)]">{explainer}</p>
                <p className="mt-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">
                  {[
                    isNum(t.cost_usd) ? (t.cost_usd === 0 ? "Registers free" : "Registers for " + usd(t.cost_usd)) : null,
                    isNum(t.days) ? "takes " + t.days + (t.days === 1 ? " day" : " days") : null,
                    isNum(t.complexity_1_5) ? "complexity " + t.complexity_1_5 + " of 5" : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
