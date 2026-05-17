# 19 · Track P — Tax + Social Contribution Overlay

> Founder direction: "when we focus so much on the margins, people, like,
> obviously, they wanna know how much is it left in the end." Hard to
> implement; rules vary by country, region, even street. But "the data is
> out there." Frame as exploratory.

---

## 1 · Goal

Add an optional **post-tax / post-social-contribution view** to every
cell page. User toggles "After taxes" and the revenue / margin numbers
recompute showing what's actually left for the owner.

This is a Wave 3 stretch feature. Phase the implementation:

- **Phase P.1 (research)**: catalog what's reliably available per country
- **Phase P.2 (schema + minimum viable)**: country-level effective tax rate + employer social contribution rate
- **Phase P.3 (regional refinement)**: state/canton overlays for US, DE, CH, ES
- **Phase P.4 (city / street-level)**: London business rates, NYC city tax, etc. — defer until Phase P.2 ships

---

## 2 · Targets

| Phase | Metric | Target |
|---|---|---|
| P.1 | Country tax rate sourced | 30+ countries (covered country set) |
| P.1 | Country employer social contribution rate sourced | 30+ countries |
| P.2 | Cells with post-tax view available | All 38 covered countries (country-level approximation) |
| P.2 | UI toggle live on cell page | Yes |
| P.3 | US states with state-tax overlay | 50 states + DC |
| P.3 | DE Länder / CH Kantone / ES CCAA | All |
| P.4 | London business rates per LAD | 33 LADs |
| P.4 | NYC sub-borough rates | TBD |

---

## 3 · Phase P.1 — Research

### Sources (public, reliable, free)

| Source | What it has |
|---|---|
| **OECD Tax Statistics** | Corporate income tax rates, employer social contributions by country, time series |
| **PwC Worldwide Tax Summaries** | Annual per-country guide; corporate tax, VAT, employer + employee social, regional variations. Free public PDFs. |
| **Deloitte International Tax Highlights** | Per-country 2-page PDFs, similar to PwC |
| **KPMG Corporate Tax Rates Table** | Quick reference cross-country comparison |
| **EY Worldwide Personal Tax and Immigration Guide** | Personal tax + social contribution side |
| **EU Taxation and Customs Union database** | EU-27 + EFTA + UK detailed breakdowns |
| **IRS / HMRC / Bundesfinanzministerium etc.** | National tax offices (primary for the home country) |

### Schema decisions

For a typical small-business cell, the "tax stack" looks like:

1. **Corporate income tax (CIT) / business tax**: applied to profit
2. **VAT / GST / sales tax**: applied to revenue (but often passes through to consumer, so usually excluded from margin calc)
3. **Employer social contributions**: applied to payroll
4. **Local business taxes / business rates**: applied to property / revenue / firm count
5. **Sector-specific levies**: industry-specific (e.g. restaurants in France pay TVA reduced rate; some industries get tax breaks)

For Phase P.2 simplicity, encode just two numbers per (country, year):

```typescript
type TaxRow = {
  country: string;
  year: number;
  cit_effective_rate: number;  // 0.21 = 21%
  employer_social_rate: number;  // 0.07 = 7% of gross payroll
  notes: string;  // human-readable caveat
};
```

Then on the cell page:

```
Gross revenue:        $1,200,000
Estimated payroll:    $   600,000   (from n_employees * payroll_per_employee)
+ Employer social:    $    42,000   (7% of payroll)
= Total labor cost:   $   642,000
Gross profit:         $   558,000
- CIT (21%):          $   117,180
= Post-tax profit:    $   440,820
```

Caveat banner explains: "Country-level approximation. Actual rate varies
by region, business form, deductions, and incentives. For planning
purposes only — not tax advice."

---

## 4 · Phase P.2 — Country-level MVP

### T-P.2.1 · Compile the 38-country tax table

Output: `src/lib/tax/country_rates_2024.json`:

```json
{
  "US": { "cit_effective_rate": 0.21, "employer_social_rate": 0.0765, "notes": "Federal only; state varies 0-9.99%" },
  "GB": { "cit_effective_rate": 0.25, "employer_social_rate": 0.138, "notes": "Main rate; small profits rate 19% for < £50k" },
  "DE": { "cit_effective_rate": 0.299, "employer_social_rate": 0.197, "notes": "Includes Solidaritätszuschlag + trade tax avg; social ~20% incl health/pension/unemployment" },
  "FR": { "cit_effective_rate": 0.25, "employer_social_rate": 0.42, "notes": "Combined CIT + social surcharges; employer social ~42% (one of highest in OECD)" },
  "JP": { "cit_effective_rate": 0.305, "employer_social_rate": 0.158, "notes": "Combined national + local enterprise tax" },
  "BR": { "cit_effective_rate": 0.34, "employer_social_rate": 0.20, "notes": "IRPJ + CSLL; complex sub-rates by region" },
  // ... 38 entries
}
```

Hand-curated from PwC + Deloitte 2024 guides. Refresh annually.

### T-P.2.2 · Add the toggle component

`src/components/PostTaxToggle.tsx`:

```tsx
"use client";
import { useState } from "react";

type Props = {
  grossRevenue: number;
  payroll: number;
  taxRates: { cit_effective_rate: number; employer_social_rate: number };
};

export function PostTaxToggle({ grossRevenue, payroll, taxRates }: Props) {
  const [postTax, setPostTax] = useState(false);
  const socialCost = payroll * taxRates.employer_social_rate;
  const cit = (grossRevenue - payroll - socialCost) * taxRates.cit_effective_rate;
  const postTaxNet = grossRevenue - payroll - socialCost - cit;

  return (
    <div className="my-4">
      <button
        onClick={() => setPostTax(!postTax)}
        className="text-sm text-atlas-700 hover:text-atlas-900"
      >
        {postTax ? "Show pre-tax view" : "Estimate after taxes →"}
      </button>
      {postTax && (
        <div className="mt-3 rounded-lg border border-parchment bg-cream-100 p-4 text-sm">
          <Row label="Gross revenue" value={grossRevenue} />
          <Row label="Estimated payroll" value={-payroll} />
          <Row label={`Employer social (${(taxRates.employer_social_rate*100).toFixed(0)}%)`} value={-socialCost} />
          <Row label={`CIT (${(taxRates.cit_effective_rate*100).toFixed(0)}%)`} value={-cit} />
          <div className="border-t pt-2 mt-2 font-semibold">
            <Row label="Owner take" value={postTaxNet} />
          </div>
          <div className="text-xs text-ink-500 mt-3">
            Country-level approximation. Actual rate varies by region,
            business form, deductions, incentives. Planning only —
            not tax advice.
          </div>
        </div>
      )}
    </div>
  );
}
```

### T-P.2.3 · Wire into cell page

`src/app/[country]/[geo]/[industry]/page.tsx`:

```tsx
import { PostTaxToggle } from "@/components/PostTaxToggle";
import { getCountryTaxRates } from "@/lib/tax";

// After TypicalFirmCard:
{cell.revenue_per_firm && cell.payroll_per_employee && cell.n_employees && (
  <PostTaxToggle
    grossRevenue={cell.revenue_per_firm}
    payroll={cell.payroll_per_employee * (cell.n_employees / (cell.n_enterprises || 1))}
    taxRates={getCountryTaxRates(country)}
  />
)}
```

### T-P.2.4 · Disclaimer + legal review

Have the founder confirm the "not tax advice" disclaimer is sufficient.
Consider adding a one-line legal page at `/about-data/tax-notes`
explaining the assumptions.

---

## 5 · Phase P.3 — Regional refinement (deferred)

Layer state / canton / Land-level adjustments on top of country base.

Example for US:
```json
{
  "US-CA": { "additional_cit": 0.0884, "notes": "California state CIT 8.84%" },
  "US-NY": { "additional_cit": 0.0725, "notes": "NY franchise tax" },
  ...
}
```

For DE Länder, FR régions, CH Kantone, ES CCAA, etc.

Compute: country base + region overlay.

---

## 6 · Phase P.4 — City / sub-city (deferred)

Examples:
- **London business rates** vary by LAD; published by VOA (Valuation Office Agency)
- **NYC city tax**: 8.85% on top of state on top of federal
- **Paris taxe foncière** varies by arrondissement

These are research projects in their own right. Defer until P.2 ships
and we have a feedback signal from users.

---

## 7 · Verification gate (Phase P.2 only)

| Check | Pass criterion |
|---|---|
| P.1 Research log | `delivery/tax/country_rates_2024_sources.md` documents source per row |
| P.2.1 Country tax table | `src/lib/tax/country_rates_2024.json` has 38 entries |
| P.2.2 Toggle component | `PostTaxToggle.tsx` renders |
| P.2.3 Wired into cell page | Toggle appears on every cell with required fields |
| P.2.4 Disclaimer reviewed | Founder confirms |
| `tsc --noEmit` | Clean |

When all six pass: **P.2 is DONE.** P.3 + P.4 are future work.

---

## 8 · Time estimate

| Phase | Time |
|---|---|
| P.1 Research (catalog sources, draft rates table) | 6-8 hours |
| P.2.1 Table | 3 hours |
| P.2.2 Component | 2 hours |
| P.2.3 Wire-in | 1 hour |
| P.2.4 Disclaimer | 1 hour |
| **Phase P.2 total** | **13-15 hours** |
| P.3 (deferred) | 2-3 days for US states alone |
| P.4 (deferred) | Multi-week |

---

## 9 · Known concerns

- **Variation within country**: founder noted "the rules in every country are quite different". Mitigation: country-level is intentionally approximate; the disclaimer + regional overlay (P.3) address this in stages.
- **Business form matters**: sole proprietor vs LLC vs corporation pay very different taxes. P.2 assumes corporate (most defensible default). P.3 could add a "business form" toggle.
- **VAT inclusion**: typically excluded from margin calcs (it's a pass-through), but the disclaimer should note this so users don't double-count.
- **Tax incentives**: many countries offer SMB-specific reduced rates (UK small profits rate; US Section 199A; France micro-entreprise). Document in the notes field.
- **Currency**: tax rates are dimensionless (%), so no FX conversion needed. The underlying revenue / payroll fields are already USD.
- **Annual refresh**: tax rates change yearly. Schedule a refresh routine for January each year.
- **Liability risk**: "not tax advice" disclaimer is critical. Consider an explicit terms-of-use update before P.2 ships.

---

## 10 · What this unlocks

- Founder's "how much is left in the end" question becomes the cell-page headline
- Differentiates from competitors (Bloomberg, IBISWorld) that show pre-tax only
- New SEO surface: "how much do restaurants in California keep after tax"
- Premium feature candidate (Pro-only?) — to be decided
