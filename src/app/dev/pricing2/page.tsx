/**
 * /dev/pricing2 , the pricing page, rebuilt to the v2 system.
 *
 * A REVIEW ARTIFACT at a dev route. Nothing links to it, the live `/pricing` is
 * untouched, and no price, tier name or feature is authored here. Everything
 * renders from `paywall_copy.ts` and `lib/pricing/matrix.ts`, which is why the
 * matrix moved out of the live page in the first place: two pricing surfaces
 * with two copies of a price list is how a site ends up quoting different
 * features on different pages.
 *
 * THE v34 RULES THIS OBEYS, and they are the reason it looks restrained:
 * exact tier names, annual shown as a monthly equivalent AND the yearly total
 * in the same line, no trial copy, no money-back copy, no "contact sales", no
 * charm pricing, no countdown, no scarcity counter, Basic quietly marked and
 * never an aggressive "most popular" badge.
 *
 * NO THREE-CARD GRID. `PRODUCT.md` bans it twice over: "NOT a startup-landing
 * SaaS dashboard, no 'Get started free' stacked-CTA hero", and "no infinite
 * scroll of identical cards". Three identical cards is the single most
 * recognisable SaaS pricing shape, which is exactly why it is wrong here. The
 * tiers are three columns of one table instead, which is also the honest form:
 * what a reader wants is not three pitches, it is the difference between them.
 *
 * THE OPENING IS THE ARGUMENT, AND IT IS TRUE. Eleven of the twenty-four rows
 * are free, counted from the matrix rather than claimed, and they are the
 * reading. That is the strongest thing this page can say and it says it first.
 */
import * as React from "react";

import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { GlyphId } from "@/components/spine2/glyphs";
import { Place } from "@/components/spine2/Place";
import {
  TIERS,
  CANCEL_ANYTIME_BLOCK,
  METHODOLOGY_HREF,
  METHODOLOGY_LABEL,
} from "@/components/monetization";
import {
  MATRIX,
  FREE_DESCRIPTION,
  ANTI_TE_CALLOUT,
  includedCount,
  type MatrixCellValue,
} from "@/lib/pricing/matrix";

import "@/styles/atlas-spine.css";

export const metadata = {
  title: "Pricing , proposal , Margin Atlas dev",
  robots: { index: false, follow: false },
};

const COLS = ["Free", TIERS.basic.name, TIERS.premium.name] as const;

/**
 * A cell in the matrix. A dash, not an empty box: absence is stated.
 *
 * ONLY THE FREE COLUMN TAKES THE ACCENT. Terracotta marks the answer once, and
 * a tick in every column of twenty-four rows is about fifty accents and no
 * focal point at all. This page's answer is how much costs nothing, so that is
 * the column that carries it, and the paid columns are ink.
 */
function Cell({ value, accent }: { value: MatrixCellValue; accent: boolean }) {
  if (value === true) {
    return (
      <span
        aria-label="included"
        style={{ color: accent ? "var(--terra-deep)" : "var(--n1)", fontSize: 15 }}
      >
        &#10003;
      </span>
    );
  }
  if (value === false) {
    return (
      <span aria-label="not included" style={{ color: "var(--n4)", fontSize: 15 }}>
        &ndash;
      </span>
    );
  }
  return <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{value}</span>;
}

export default function PricingProposal() {
  const freeRows = includedCount(0);
  const groups = [...new Set(MATRIX.map((r) => r.group))];

  const price = (
    label: string,
    monthly: number | null,
    annualPerMonth: number | null,
    annualTotal: number | null,
    note: string,
  ) => (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{label}</div>
      <div
        className="fig"
        style={{ fontSize: 30, fontWeight: 600, color: "var(--ink)", marginTop: 6 }}
      >
        {monthly === null ? "$0" : `$${monthly}`}
        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)" }}> a month</span>
      </div>
      {/* v34: the annual plan is shown as a monthly equivalent AND the actual
          yearly charge, in the same line. A monthly-equivalent alone is the
          oldest trick on a pricing page. */}
      {annualPerMonth !== null && annualTotal !== null ? (
        <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4 }}>
          ${annualPerMonth} a month if paid yearly, which is ${annualTotal} a year
        </div>
      ) : (
        <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4 }}>
          No account required
        </div>
      )}
      <p className="k" style={{ margin: "10px 0 0", fontSize: 12 }}>
        {note}
      </p>
    </div>
  );

  return (
    <div className="av2" style={{ position: "relative" }}>
      <Place />
      <div className="wrap">
        <header className="mast">
          <div className="in">
            <span className="brand">
              <span className="m" />
              Margin Atlas
            </span>
            <nav className="lat" aria-label="Where you are">
              <a href="/">Home</a>
              <span className="s">&rsaquo;</span>
              <a href="/pricing">Pricing</a>
            </nav>
          </div>
        </header>

        {/* 1 , WHAT IS FREE. The claim first, because it is the true one and it
            is the one nobody else in this category makes. */}
        <section className="glass rise" style={{ padding: "30px 32px", marginTop: 16 }}>
          <div className="crumb">
            <span>Pricing</span>
          </div>
          <h1 style={{ marginTop: 14, maxWidth: "19ch" }}>
            Reading the atlas is free, and stays free.
          </h1>
          <p className="k" style={{ margin: "16px 0 0", maxWidth: "52ch", fontSize: 15 }}>
            {freeRows} of the {MATRIX.length} things listed below cost nothing
            and need no account, including every headline figure on every page.
            Paying is for reading deeper into a figure, keeping your own list,
            and getting the data out of the page.
          </p>
        </section>

        {/* 2 , THE THREE, AS COLUMNS OF ONE THING. Not three cards. */}
        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 28,
            }}
          >
            {price("Free", null, null, null, FREE_DESCRIPTION)}
            {price(
              TIERS.basic.name,
              TIERS.basic.priceMonthly,
              TIERS.basic.priceAnnualPerMonth,
              TIERS.basic.priceAnnualTotal,
              TIERS.basic.description,
            )}
            {price(
              TIERS.premium.name,
              TIERS.premium.priceMonthly,
              TIERS.premium.priceAnnualPerMonth,
              TIERS.premium.priceAnnualTotal,
              TIERS.premium.description,
            )}
          </div>
        </section>

        {/* 3 , THE DIFFERENCE, WHICH IS WHAT A READER ACTUALLY CAME FOR. */}
        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="statblock">
            <div className="hd">
              <GlyphIcon id={"scorecard" as GlyphId} size={18} />
              What each one includes
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0,1fr) 74px 74px 74px",
                gap: 12,
                padding: "9px 0 10px",
                fontSize: 11,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              <span />
              {COLS.map((c) => (
                <span key={c} style={{ textAlign: "center" }}>
                  {c}
                </span>
              ))}
            </div>

            {groups.map((group) => (
              <React.Fragment key={group}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: "var(--ink-2)",
                    padding: "16px 0 6px",
                    borderTop: "1px solid var(--grp-rule)",
                  }}
                >
                  {group}
                </div>
                {MATRIX.filter((r) => r.group === group).map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0,1fr) 74px 74px 74px",
                      gap: 12,
                      alignItems: "center",
                      padding: "6px 0",
                      fontSize: 13,
                      color: "var(--ink-2)",
                    }}
                  >
                    <span>{row.label}</span>
                    {row.values.map((v, i) => (
                      <span key={i} style={{ textAlign: "center" }}>
                        <Cell value={v} accent={i === 0} />
                      </span>
                    ))}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* 4 , THE TERMS, STATED RATHER THAN BURIED. Both blocks verbatim. */}
        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 14 }}>
            The terms
          </div>
          <div className="grid g12" style={{ gap: 32, alignItems: "start" }}>
            <p className="k" style={{ margin: 0, maxWidth: "46ch" }}>
              {CANCEL_ANYTIME_BLOCK}
            </p>
            <p className="k" style={{ margin: 0, maxWidth: "46ch" }}>
              {ANTI_TE_CALLOUT}
            </p>
          </div>
          <p className="k" style={{ margin: "18px 0 0" }}>
            <a href={METHODOLOGY_HREF}>{METHODOLOGY_LABEL}</a>, which is how every
            figure on this site says which route it came down.
          </p>
        </section>

        <footer style={{ padding: "40px 0 24px" }}>
          <span className="tag">Margin Atlas</span>
        </footer>
      </div>
    </div>
  );
}
