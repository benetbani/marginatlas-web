/**
 * /dev/variants/v5 , THE COUNTRY SCORECARD. Three versions, three real countries.
 *
 * Internal, noindex, not linked publicly. The founder picks; nothing here ranks
 * the three versions or recommends one.
 *
 * THE CONSTRAINT, and it decides what B and C are allowed to do. The charter
 * records the country page as blocked on DATA, not design: there is no honest
 * country-level source for a headline hero. So neither B nor C invents a lead.
 * Both lead with a figure the page already holds, the combined corporate tax
 * rate, which is the closest thing in the held data to the ratified direction of
 * "what the government takes". The page says that in its own words rather than
 * presenting it as settled.
 *
 * TWO CELLS STAY UNSCORED IN ALL THREE VERSIONS. The country page passes
 * score null and read null for minimum wage deliberately, so it takes no
 * good-or-bad tint. Population is the second such cell on the live page and is
 * NOT HELD in this dataset at all, which is stated rather than filled.
 *
 * WHAT THIS PAGE CANNOT DISTINGUISH: a scorecard that reads well from one whose
 * eight figures are all held. Every country here has gaps, and a cell that says
 * "not held" is doing its job, not failing.
 */
import * as React from "react";
import type { Metadata } from "next";

import { Scorecard, type ScorecardMetric } from "@/components/kit/engraved/Scorecard";
import { getCountryProfile } from "@/lib/economic_profile";
import { ScorecardB, ScorecardC, type Cell } from "./variants";

export const metadata: Metadata = {
  title: "V5 the country scorecard (internal)",
  robots: { index: false, follow: false },
};

const ISOS = ["GB", "DE", "SG"] as const;

function pct(v: unknown): string | null {
  return typeof v === "number" && Number.isFinite(v) ? `${Math.round(v * 100)}` : null;
}
function usd(v: unknown): string | null {
  if (typeof v !== "number" || !Number.isFinite(v)) return null;
  if (v >= 1000) return `$${Math.round(v / 1000)}K`;
  return `$${Math.round(v)}`;
}
function num(v: unknown): string | null {
  return typeof v === "number" && Number.isFinite(v) ? `${Math.round(v)}` : null;
}
/** Lower is friendlier for a tax or a cost; higher is friendlier for a wage. */
function read(v: unknown, lowGood: boolean, lo: number, hi: number): string | null {
  if (typeof v !== "number" || !Number.isFinite(v)) return null;
  const good = lowGood ? v <= lo : v >= hi;
  const bad = lowGood ? v >= hi : v <= lo;
  return good ? "light" : bad ? "heavy" : "middling";
}

function buildCells(iso: string): { lead: Cell; rest: Cell[]; name: string; basis: string } {
  const p = getCountryProfile(iso) as unknown as Record<string, unknown>;
  const name = typeof p.name === "string" ? p.name : iso;

  const lead: Cell = {
    label: "Combined corporate tax",
    value: pct(p.corporate_income_tax_combined_pct),
    unit: "%",
    score: null,
    read: read(p.corporate_income_tax_combined_pct, true, 0.18, 0.28),
    group: "cost of operating",
  };

  const rest: Cell[] = [
    { label: "Effective corporate tax", value: pct(p.effective_corporate_tax_pct), unit: "%",
      score: 1, read: read(p.effective_corporate_tax_pct, true, 0.15, 0.25), group: "cost of operating" },
    { label: "Employer social", value: pct(p.employer_social_pct), unit: "%",
      score: 1, read: read(p.employer_social_pct, true, 0.08, 0.2), group: "cost of operating" },
    { label: "VAT or GST", value: pct(p.vat_gst_standard_pct), unit: "%",
      score: 1, read: read(p.vat_gst_standard_pct, true, 0.1, 0.2), group: "cost of operating" },
    { label: "Median full-time wage", value: usd(p.median_wage_full_time_usd), unit: "a year",
      score: 1, read: read(p.median_wage_full_time_usd, false, 15000, 40000), group: "people" },
    /* Deliberately unscored, exactly as the live country page passes it. */
    { label: "Minimum wage", value: usd(p.minimum_wage_annual_usd), unit: "a year",
      score: null, read: null, group: "people" },
    { label: "Income tax at 50k", value: pct(p.personal_income_tax_marginal_50k_pct), unit: "%",
      score: 1, read: read(p.personal_income_tax_marginal_50k_pct, true, 0.2, 0.4), group: "people" },
    { label: "GDP per capita", value: usd(p.gdp_per_capita_usd_nominal), unit: null,
      score: 1, read: read(p.gdp_per_capita_usd_nominal, false, 10000, 45000), group: "market" },
    { label: "Ease of business", value: num(p.ease_of_doing_business_index), unit: "/100",
      score: 1, read: read(p.ease_of_doing_business_index, false, 55, 78), group: "market" },
  ];

  const basis =
    "The lead is the combined corporate rate, which is the closest figure the page already holds to what the government takes. It is not a new measurement.";

  return { lead, rest, name, basis };
}

function toScorecardMetrics(lead: Cell, rest: Cell[]): ScorecardMetric[] {
  const glyphs = ["bank", "coin", "wallet", "clock", "doc", "scale", "bank", "coin", "doc"];
  return [lead, ...rest].slice(0, 8).map((c, i) => ({
    label: c.label,
    value: c.value,
    unit: c.unit ?? null,
    glyph: glyphs[i] as ScorecardMetric["glyph"],
    read: c.read,
    score: c.score,
  }));
}

function Column({ letter, title: t, facts, children }: {
  letter: string; title: string; facts: string[]; children: React.ReactNode;
}) {
  return (
    <div className="relative min-w-0">
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-sm font-semibold text-ink-900">{letter}</span>
        <span className="text-[12px] text-ink-700">{t}</span>
      </div>
      {children}
      <ul className="mt-2 space-y-0.5">
        {facts.map((f) => (
          <li key={f} className="text-[11px] leading-snug text-ink-600">{f}</li>
        ))}
      </ul>
    </div>
  );
}

export default function V5Page() {
  const built = ISOS.map((iso) => ({ iso, ...buildCells(iso) }));

  return (
    <div className="relative mx-auto max-w-[1500px] px-6 py-10">
      <header className="relative mb-8 border-b border-paper-400 pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-atlas-700">
          Variant review, V5
        </p>
        {/* typography-ok: review harness chrome, deliberately neutral so the page
            typography does not compete with the three candidates being judged */}
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">The country scorecard</h1>
        <p className="mt-2 max-w-[74ch] text-sm leading-relaxed text-ink-700">
          The engraved scorecard renders eight cells at equal weight, so the
          country page is the only page type on this site with no signal for which
          number matters. Every other type has a dominant figure. The decision is
          whether this one should.
        </p>
        <p className="mt-2 max-w-[74ch] rounded border border-paper-400 bg-paper-200 px-3 py-2 text-sm leading-relaxed text-ink-700">
          <strong>The constraint B and C had to work inside.</strong> The charter
          records this page as blocked on <em>data</em>, not design: there is no
          honest country-level source for a headline hero. So neither invents one.
          Both lead with the combined corporate rate, the closest figure the page
          already holds to the ratified direction of what the government takes.
          Whether that figure deserves the lead is part of what you are picking.
        </p>
      </header>

      {built.map(({ iso, lead, rest, name, basis }) => {
        const held = [lead, ...rest].filter((c) => c.value != null).length;
        return (
          <section key={iso} className="relative mb-14">
            <div className="mb-3">
              {/* typography-ok: harness chrome, see the note on the h1 above */}
              <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-ink-900">
                {name}
              </h2>
              <p className="mt-0.5 text-[12px] text-ink-600">
                {held} of 9 figures held {"· "}minimum wage deliberately unscored
                {" · "}population not held in this dataset at all
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
              <Column
                letter="A"
                title="what ships today, eight equal cells"
                facts={[
                  "every cell the same size, so nothing says which number matters",
                  "the real engraved Scorecard, imported untouched",
                  "a not-held cell shows a dash rather than a filled figure",
                  "measured at 1280: the largest figure on this card is 22px",
                ]}
              >
                <Scorecard metrics={toScorecardMetrics(lead, rest)} />
              </Column>

              <Column
                letter="B"
                title="one dominant figure, seven demoted"
                facts={[
                  "the lead figure is set at 2.5rem against 1rem for the rest",
                  "the lead carries one line saying what it is and is not",
                  "minimum wage stays unscored, as on the live page",
                  "measured at 1280: the lead sets at 40px against 16px support, a 2.5x ratio",
                ]}
              >
                <ScorecardB lead={lead} rest={rest} basis={basis} />
              </Column>

              <Column
                letter="C"
                title="one dominant, the rest in three groups"
                facts={[
                  "the same lead, with the other eight under cost, people and market",
                  "the group headings are the only other accent",
                  "same figures as B, only the arrangement differs",
                ]}
              >
                <ScorecardC lead={lead} rest={rest} basis={basis} />
              </Column>
            </div>
          </section>
        );
      })}

      <footer className="relative mt-4 border-t border-paper-400 pt-4">
        {/* typography-ok: harness chrome, see the note on the h1 above */}
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-900">
          What this page cannot show you
        </h2>
        <ul className="mt-2 max-w-[80ch] space-y-1 text-[12px] leading-relaxed text-ink-700">
          <li>
            Whether the combined corporate rate deserves to be the lead. It is the
            closest held figure to the ratified direction, not a measurement built
            for the job, and the charter is explicit that this page lacks an honest
            hero source.
          </li>
          <li>
            Population, which is the second deliberately-unscored cell on the live
            page, is not in this dataset at all. It is shown as not held rather
            than filled from somewhere else.
          </li>
          <li>
            The read words here are computed from thresholds chosen for this
            harness. The live page derives them from its own banding, so the words
            are illustrative and the figures are real.
          </li>
          <li>
            Whether a reader prefers any of these. This page carries no ranking and
            no recommendation on purpose.
          </li>
        </ul>
      </footer>
    </div>
  );
}
