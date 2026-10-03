# UK Law Engine (2026-27) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every UK tax and employment rule the London/UK vertical prints, computed exactly for 2026-27 and proved to the penny on official worked examples.

**Architecture:** Pure TypeScript modules under `src/lib/uk/law/`, one per rule, all reading one dated parameter file (`params_2026_27.ts`) and one rounding rule (`money.ts`). Each module has a self-running test wired into the prebuild chain as its own gate. Nothing here reads data or the network.

**Tech Stack:** TypeScript 5 (strict), run by `tsx`; the website's prebuild chain (`scripts/prebuild_all.ts`) and its red helper (`scripts/lib/red`).

---

## Before you start (read once)

- Work in `E:/atlas/website`, its own git repository. Run every command from that folder. The master plan,
  `docs/superpowers/plans/2026-10-02-vertical-engine-00-master.md`, holds the mathematics each task implements; each task
  below repeats the part it needs.
- Tests here are self-running TypeScript scripts, not a framework: `npx tsx tests/<path>.test.ts` prints one `PASS  <label>`
  line per check. On a failure it prints `x <rule> <file>: <label>. Remedy: <remedy>` through `scripts/lib/red` and exits 1.
  That shape is required: the chain's gate-reds ratchet (`node scripts/audit_gate_reds.mjs`) fails when a newly wired test's
  red lacks a file, a rule or a remedy. Every test below has it (checked on 2026-10-02 with the census's own classifier);
  keep it when you edit one.
- A test nothing runs is not coverage: each task wires its test into the `GATES` array of `scripts/prebuild_all.ts`, then
  regenerates the counts. `npx tsx scripts/counts.ts --write` rewrites the counts blocks of `CLAUDE.md`,
  `docs/verification-protocol.md` and `docs/loop/02-ORGANISATION-RESEARCH.md` and the registry `scripts/gates.json`; the
  `counts-fresh` gate fails the chain when they are stale, so those four files are in every wiring commit.
- Never pipe a verification command into a filter (a pipe reports the filter's exit code, not the command's). Run it bare,
  or redirect to a file and read the file.
- The expected figures were computed independently (Python, decimal arithmetic, half-up at the penny) and agreed with this
  code to the penny on 2026-10-02. Never change an expected figure to make a test pass. Fix the code, or stop and report.
- Commits: one per task, never pushed by this plan. The website sits on `main`: before task 1, create the plan's branch
  (`git switch -c vertical-engine`, or switch to it if an earlier plan made it). The controlling session commits; a
  subagent executing a task stops before its commit step and reports. Never `--no-verify`.

## File structure

| File | Responsibility |
|---|---|
| `docs/uk-law/2026-27-readings.md` | the readings every parameter rests on, quoted, with the page and the date (task 1) |
| `src/lib/uk/law/params_2026_27.ts` | every rate and threshold of 2026-27, one typed object |
| `src/lib/uk/law/money.ts` | `pennies`, `sumPennies`, `bandedTax`: the one rounding rule |
| `src/lib/uk/law/income_tax.ts` | rUK income tax, the allowance taper, dividends as the top slice |
| `src/lib/uk/law/national_insurance.ts` | Class 4, employee and employer Class 1, the Employment Allowance |
| `src/lib/uk/law/corporation_tax.ts` | corporation tax with marginal relief |
| `src/lib/uk/law/take_home.ts` | what the owner keeps as a sole trader and as a one-director company |
| `src/lib/uk/law/employer_cost.ts` | the all-in yearly cost of one hire |
| `src/lib/uk/law/business_rates.ts` | business rates, England, with small business relief |
| `src/lib/uk/law/lease_tax.ts` | SDLT and Welsh LTT on a lease's rent |
| `src/lib/uk/law/redundancy.ts` | statutory redundancy pay and notice |
| `src/lib/uk/law/loan.ts` | the annuity repayment of a loan |
| `tests/uk/law/*.test.ts` | one test per module, one gate each (`uk-law-*`) |

### Task 1: Confirm the readings the parameters rest on

The parameters were read on 2026-10-02 (`E:/atlas/design/loop/build/research/2026-10-02-pro-sections-uk-law.md` and
`2026-10-02-guides-hub-and-sources.md`), and three readings were left open there: the corporation-tax marginal relief
fraction, whether small business relief applies at the retail, hospitality and leisure multiplier, and which trades count as
retail, hospitality or leisure. Every expected figure in tasks 2 to 11 rests on these values, so they are read first.

**Files:**
- Create: `docs/uk-law/2026-27-readings.md`

- [ ] **Step 1: Read each page and record what it says**

Create `docs/uk-law/2026-27-readings.md` with this table, one row per reading, filling the last three columns from the page
(the exact sentence that states the value, in quotation marks, and today's date):

```markdown
# UK law 2026-27: the readings the law engine rests on

Each value in `src/lib/uk/law/params_2026_27.ts`, the page it was read on, the sentence that states it, and the date.

| Parameter | Value in params_2026_27.ts | Page | Sentence (quoted) | Read on |
|---|---|---|---|---|
| Corporation tax: small profits rate, main rate, limits | 19%, 25%, 50,000, 250,000 | https://www.gov.uk/corporation-tax-rates | | |
| Corporation tax: marginal relief fraction | 3/200 | the Marginal Relief guidance linked from https://www.gov.uk/corporation-tax-rates | | |
| Business rates multipliers, England 2026-27 | 43.2p, 48p; retail, hospitality and leisure 38.2p, 43p | https://www.gov.uk/guidance/business-rates-multipliers-qualifying-retail-hospitality-or-leisure | | |
| Which uses qualify for the retail, hospitality and leisure multipliers | see the next table | https://www.gov.uk/guidance/business-rates-multipliers-qualifying-retail-hospitality-or-leisure | | |
| Small business rate relief | full to 12,000, tapering to none at 15,000; applies at the retail, hospitality and leisure multiplier | https://www.gov.uk/business-rates-relief/small-business-rate-relief | | |
| Income tax, rUK | allowance 12,570; taper above 100,000; 20% to 37,700; 40% to 125,140; 45% above | https://www.gov.uk/income-tax-rates | | |
| Dividends from 6 April 2026 | allowance 500; 10.75%, 35.75%, 39.35% | https://www.gov.uk/tax-on-dividends | | |
| Class 4 National Insurance | 6% from 12,570 to 50,270; 2% above | https://www.gov.uk/self-employed-national-insurance-rates | | |
| Class 1, employee and employer | 8% / 2% (12,570, 50,270); employer 15% above 5,000; under-21 and apprentice-under-25 relief to 50,270 | https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027 | | |
| Employment Allowance | 10,500; not for a company whose only employee paid above the secondary threshold is its director | https://www.gov.uk/claim-employment-allowance/eligibility | | |
| Minimum wage from 1 April 2026 | 21 and over 12.71; 18 to 20 10.85; under 18 and apprentices 8.00 | https://www.gov.uk/national-minimum-wage-rates | | |
| Pension auto-enrolment thresholds | trigger 10,000; qualifying earnings 6,240 to 50,270; employer minimum 3% | https://www.thepensionsregulator.gov.uk/en/employers/new-employers/im-an-employer-who-has-to-provide-a-pension/declare-your-compliance/ongoing-duties-for-employers/earnings-thresholds | | |
| Statutory redundancy pay | weekly cap 751; 20 years at most; 0.5 / 1 / 1.5 weeks by age | https://www.gov.uk/redundancy-your-rights/redundancy-pay | | |
| Statutory notice | one week to two years; a week a year to twelve | https://www.gov.uk/redundancy-your-rights/notice-periods | | |
| SDLT on a lease's rent (non-residential) | NPV at 3.5%; 0% to 150,000; 1% to 5,000,000; 2% above | https://www.gov.uk/guidance/stamp-duty-land-tax-leasehold-purchases | | |
| Welsh LTT on a lease's rent (non-residential) | 0% to 225,000; 1% to 2,000,000; 2% above | https://www.gov.wales/land-transaction-tax-rates-and-bands | | |

## Retail, hospitality and leisure: the trades the profit model uses

| Trade (site slug) | Premises | Qualifies? (expected) | Sentence (quoted) |
|---|---|---|---|
| barbershops | hairdressing salon | yes | |
| nail-salons | beauty salon | yes | |
| restaurants | restaurant | yes | |
| bakeries-retail | bakery shop or cafe | yes | |
| sports-fitness | gym | yes | |
| auto-repair-shops | vehicle repair workshop (a garage) | yes (garages are a named qualifying use, read 2026-10-03) | |
| dental-practices | surgery | no | |
```

- [ ] **Step 2: Compare every reading with the parameter file**

Open `src/lib/uk/law/params_2026_27.ts` (it is created in task 2 from the code in that task; read the values from task 2's
code block if the file does not exist yet). Expected: every value matches and every "expected" in the second table holds.
If any reading differs, stop here and report the difference with its quoted sentence: the tests of tasks 2 to 11 and the
recipes of plan 03 rest on these values, so a difference changes their expected figures and must be decided before code.

- [ ] **Step 3: Commit**
```bash
git add docs/uk-law/2026-27-readings.md
git commit -m "uk law: the 2026-27 readings the law engine rests on, quoted with their pages" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short docs/uk-law` prints nothing.

### Task 2: Parameters and money rounding

Every rate and threshold of 2026-27 lives in one typed object (`UK_2026_27`), each with the page it was read on; no formula
types a number of its own, so a Budget is one edit and one test run. Money has one rounding rule. `pennies(x)` rounds half
away from zero at two places with a 1e-7 penny guard: 0.03 x 18,544.50 (the pension minimum on a living-wage year) is
exactly 556.335 in decimal but 556.33499999999992269... in binary, and times 100 it stays below the half, so a plain
`Math.round(x * 100) / 100` prints 556.33 where every payroll and every gov.uk worked example prints 556.34 (the test's
second check fails without the guard; checked on 2026-10-02). Itemised bills round each part first and add the parts as integer pence
(`sumPennies`), so a reader adding the printed lines gets the printed total: 24,784.50 + 2,967.68 + 556.34 = 28,308.52,
where the unrounded sum would print 28,308.51 (the test feeds the raw products too, so the guard inside the sum is proved).
A negative amount under half a penny rounds to zero, never to -0, which a currency formatter prints as -0.00 (found by the
task review of 2026-10-03). `bandedTax(amount, bands)` taxes slices and rounds each slice the same way.

**Files:**
- Create: `src/lib/uk/law/params_2026_27.ts`
- Create: `src/lib/uk/law/money.ts`
- Test: `tests/uk/law/money.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (one `GATES` entry)
- Modify (generated by counts.ts): `CLAUDE.md`, `docs/verification-protocol.md`, `docs/loop/02-ORGANISATION-RESEARCH.md`, `scripts/gates.json`

- [ ] **Step 1: Write the failing test**

Create `tests/uk/law/money.test.ts`:

```ts
/**
 * The vertical's money rounding: half-pennies round up, parts add to the total.
 *
 * Run: npx tsx tests/uk/law/money.test.ts
 */
import { pennies, sumPennies, bandedTax } from "../../../src/lib/uk/law/money";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-money";
const FILE = "src/lib/uk/law/money.ts";
const REMEDY = "fix money.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

check("2,967.675 (0.15 x 19,784.50) rounds up to 2,967.68", pennies(0.15 * 19_784.5) === 2967.68);
check("556.335 (0.03 x 18,544.50) rounds up to 556.34", pennies(0.03 * 18_544.5) === 556.34);
check("a negative half-penny rounds away from zero", pennies(-0.005) === -0.01);
check("an exact amount is unchanged", pennies(24_784.5) === 24_784.5);
check("parts sum as pence: 24,784.50 + 2,967.68 + 556.34 = 28,308.52", sumPennies([24_784.5, 2967.675, 556.335]) === 28_308.52);
check("the raw sum would have said 28,308.51, which the reader cannot rebuild", pennies(24_784.5 + 2967.675 + 556.335) === 28_308.51);
check("each line is rounded inside the sum: the products 0.15 x 19,784.50 and 0.03 x 18,544.50 still give 28,308.52", sumPennies([24_784.5, 0.15 * 19_784.5, 0.03 * 18_544.5]) === 28_308.52);
check("a negative amount under half a penny is zero, never -0 (a formatter prints -0 as -0.00)", Object.is(pennies(-0.001), 0) && Object.is(pennies(0.3 - (0.1 + 0.2)), 0));
check("banded tax: 1% of NPV above 150,000 on 207,915.13 is 579.15", bandedTax(207_915.13, [{ upTo: 150_000, rate: 0 }, { upTo: 5_000_000, rate: 0.01 }, { upTo: Infinity, rate: 0.02 }]) === 579.15);
let threw = false;
try { pennies(NaN); } catch { threw = true; }
check("NaN is refused, never printed", threw);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/money: all pass");
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npx tsx tests/uk/law/money.test.ts
```

Expected: exit code 1 with `Error: Cannot find module '../../../src/lib/uk/law/money'`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/uk/law/params_2026_27.ts`:

```ts
/**
 * src/lib/uk/law/params_2026_27.ts
 *
 * Every UK legal parameter the vertical's formulas read, for the tax year 6 April 2026 to 5 April 2027 (England, and the
 * rest of the UK where the figure is UK-wide). One object, typed, each value with the page it was read on and the date.
 * A formula never types a rate or a threshold of its own: it reads it here, so a Budget change is one edit and one test run.
 *
 * Sources were read on 2026-10-02 (design/loop/build/research/2026-10-02-pro-sections-uk-law.md and
 * 2026-10-02-guides-hub-and-sources.md) and confirmed on 2026-10-03, every value with its quoted sentence and page, in
 * docs/uk-law/2026-27-readings.md. Scottish income tax bands are NOT here: a Scottish taxpayer's figures are out of
 * scope until a scottish block is added, and the functions say so by name (rUK).
 */
export const UK_2026_27 = {
  taxYear: "2026-27",
  incomeTax: {
    /** rUK (England, Wales, Northern Ireland) non-savings rates. https://www.gov.uk/income-tax-rates */
    personalAllowance: 12_570,
    /** The allowance falls by 1 pound for every 2 pounds of adjusted net income above this. */
    taperThreshold: 100_000,
    /** ...by 1 pound for every this many complete pounds above the threshold. */
    taperDivisor: 2,
    /** https://www.gov.uk/government/publications/rates-and-allowances-income-tax/income-tax-rates-and-allowances-current-and-past (the rates page prints the band only as 12,571 to 50,270) */
    basicRateBand: 37_700,
    additionalRateThreshold: 125_140,
    basic: 0.2,
    higher: 0.4,
    additional: 0.45,
  },
  dividends: {
    /** https://www.gov.uk/tax-on-dividends (rates from 6 April 2026) */
    allowance: 500,
    basic: 0.1075,
    higher: 0.3575,
    additional: 0.3935,
  },
  class4: {
    /** https://www.gov.uk/self-employed-national-insurance-rates */
    lowerProfitsLimit: 12_570,
    upperProfitsLimit: 50_270,
    main: 0.06,
    additional: 0.02,
  },
  class1Primary: {
    /** https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027 (annual earnings period) */
    primaryThreshold: 12_570,
    upperEarningsLimit: 50_270,
    main: 0.08,
    additional: 0.02,
  },
  class1Secondary: {
    /** same page; the 15% rate from the National Insurance Contributions (Secondary Class 1 Contributions) Act 2025, s.1: https://www.legislation.gov.uk/ukpga/2025/11/section/1 */
    secondaryThreshold: 5_000,
    /** under 21s, apprentices under 25 and veterans: 0% up to this */
    upperSecondaryThreshold: 50_270,
    rate: 0.15,
    employmentAllowance: 10_500,
  },
  pension: {
    /** thresholds for 2026-27: https://www.thepensionsregulator.gov.uk/en/employers/new-employers/im-an-employer-who-has-to-provide-a-pension/declare-your-compliance/ongoing-duties-for-employers/earnings-thresholds ; the 3% employer minimum: https://www.gov.uk/workplace-pensions/what-you-your-employer-and-the-government-pay */
    trigger: 10_000,
    qualifyingLower: 6_240,
    qualifyingUpper: 50_270,
    employerMinimum: 0.03,
    /** aged between 22 and State Pension age: https://www.gov.uk/workplace-pensions/joining-a-workplace-pension */
    minAge: 22,
    /** State Pension age is 66 rising to 67 between 2026 and 2028 (https://www.gov.uk/government/publications/state-pension-age-timetable/state-pension-age-timetable); 66 is used, the change dated in the guide */
    statePensionAge: 66,
  },
  corporationTax: {
    /** rates and limits: https://www.gov.uk/corporation-tax-rates ; the standard fraction 3/200 for the year from 1 April 2026: https://www.gov.uk/government/publications/rates-and-allowances-corporation-tax/rates-and-allowances-corporation-tax (the Marginal Relief guidance prints no fraction) */
    lowerLimit: 50_000,
    upperLimit: 250_000,
    smallProfitsRate: 0.19,
    mainRate: 0.25,
    marginalReliefFraction: 3 / 200,
  },
  businessRates: {
    /** England 2026-27. Multipliers: https://www.gov.uk/estimate-your-business-rates and the multipliers notification 2/2026; which uses qualify: https://www.gov.uk/guidance/business-rates-multipliers-qualifying-retail-hospitality-or-leisure */
    smallMultiplier: 0.432,
    standardMultiplier: 0.48,
    rhlSmallMultiplier: 0.382,
    rhlStandardMultiplier: 0.43,
    /** the small multipliers apply below this rateable value */
    smallThreshold: 51_000,
    /** at and above this the high-value multiplier applies (500,000 itself is high-value: https://www.gov.uk/estimate-your-business-rates); out of scope for street businesses, the function refuses it */
    highValueThreshold: 500_000,
    /** https://www.gov.uk/business-rates-relief/small-business-rate-relief */
    sbrrFullUpTo: 12_000,
    sbrrNoneFrom: 15_000,
  },
  leaseRentTax: {
    /** SDLT, non-residential lease rent: the 3.5% discount rate from Finance Act 2003 Sch 5 para 8(1); the bands from https://www.gov.uk/stamp-duty-land-tax/nonresidential-and-mixed-rates */
    discountRate: 0.035,
    sdlt: [
      { upTo: 150_000, rate: 0 },
      { upTo: 5_000_000, rate: 0.01 },
      { upTo: Infinity, rate: 0.02 },
    ],
    /** Wales, Land Transaction Tax on rent. https://www.gov.wales/land-transaction-tax-rates-and-bands */
    ltt: [
      { upTo: 225_000, rate: 0 },
      { upTo: 2_000_000, rate: 0.01 },
      { upTo: Infinity, rate: 0.02 },
    ],
    /** the rent taken for every year after the fifth: the highest of the first five (Finance Act 2003 Sch 17A para 7(3); https://www.gov.uk/guidance/stamp-duty-land-tax-leasehold-purchases) */
    yearsBeforeHighestRule: 5,
  },
  redundancy: {
    /** https://www.gov.uk/redundancy-your-rights/redundancy-pay ; cap from 6 April 2026 (SI 2026/310) */
    weeklyPayCap: 751,
    maxYears: 20,
    minYears: 2,
    /** weeks of pay per whole year of service, by the age held throughout that year */
    weeksUnder22: 0.5,
    weeks22To40: 1,
    weeks41Plus: 1.5,
  },
  minimumWage: {
    /** from 1 April 2026. https://www.gov.uk/national-minimum-wage-rates */
    age21Plus: 12.71,
    age18To20: 10.85,
    under18: 8.0,
    apprentice: 8.0,
  },
} as const;

export type UkLaw = typeof UK_2026_27;
```

Create `src/lib/uk/law/money.ts`:

```ts
/**
 * src/lib/uk/law/money.ts
 *
 * Rounding, the one way the vertical rounds money.
 *
 * WHY AN EPSILON. 0.03 x 18,544.50 (the pension minimum on a living-wage year) is 556.335 exactly in decimal, but in
 * binary floating point it is 556.33499999999992269..., and times 100 it stays below the half, so Math.round(x * 100) / 100
 * gives 556.33 where every payroll and every gov.uk worked example prints 556.34. (0.15 x 19,784.50 = 2,967.675 happens to
 * survive: its product times 100 lands exactly on the half. Luck is not a rule.) Adding 1e-7 of a penny before rounding
 * moves a value that is a half-penny in decimal onto the right side and moves nothing else: no amount the vertical computes
 * has a genuine fraction of a penny closer than 1e-7 to a half.
 *
 * WHY PARTS FIRST. A bill printed as lines must add up to its printed total, so every itemised total is the sum of its
 * rounded lines (sumPennies), never the rounding of the raw sum. On a living-wage hire the two differ by a penny
 * (28,308.52 against 28,308.51), and the reader can add the lines.
 */
export function pennies(x: number): number {
  if (!Number.isFinite(x)) throw new Error(`pennies: not a finite amount (${x})`);
  const sign = x < 0 ? -1 : 1;
  const pence = Math.round(Math.abs(x) * 100 + 1e-7);
  // a negative amount under half a penny is zero, never -0 (which a currency formatter prints as -0.00)
  return pence === 0 ? 0 : (sign * pence) / 100;
}

/** The sum of lines, each rounded to the penny here first, exact to the penny (integer arithmetic on pence). */
export function sumPennies(lines: readonly number[]): number {
  let pence = 0;
  for (const l of lines) pence += Math.round(pennies(l) * 100);
  return pence / 100;
}

/** Tax over a list of bands [{upTo, rate}], each band's tax rounded to the penny, summed as pence. */
export function bandedTax(amount: number, bands: readonly { upTo: number; rate: number }[]): number {
  let lower = 0;
  const lines: number[] = [];
  for (const b of bands) {
    if (amount <= lower) break;
    const slice = Math.min(amount, b.upTo) - lower;
    lines.push(slice * b.rate);
    lower = b.upTo;
  }
  return sumPennies(lines);
}
```

- [ ] **Step 4: Run it and watch it pass**

```bash
npx tsx tests/uk/law/money.test.ts
```

Expected: 10 lines starting `PASS`, the last line `uk/law/money: all pass`, exit code 0.

- [ ] **Step 5: Wire it into the chain**

In `scripts/prebuild_all.ts`, find this line in `GATES`:

```ts
  { name: "facts-confidence", script: "tests/facts/confidence.test.ts" },
```

and add directly below it:

```ts
  /* The UK law engine (docs/superpowers/plans/2026-10-02-vertical-engine-01-uk-law.md): every rate and threshold
     of 2026-27 in one dated file, each module proved on official worked examples to the penny. */
  { name: "uk-law-money", script: "tests/uk/law/money.test.ts" },
```

Then run:

```bash
npx tsx scripts/counts.ts --write
```

Expected: one line beginning `[counts] wrote 3 carrier(s) and scripts/gates.json:` whose gate count is one higher than before this step.

- [ ] **Step 6: Prove the gate runs in the chain and the ratchet holds**

```bash
npx tsx scripts/prebuild_all.ts --only=uk-law-money
```

Expected: a line `✓ uk-law-money` and, at the end, `SUBSET: PASS (not the chain; run without --only for the gate)`.

```bash
node scripts/audit_gate_reds.mjs
```

Expected: the last line starts `gate reds: PASS` and ends `the ratchet holds` (the three counts equal the baseline in `scripts/gate_reds_baseline.json`; a new test must not raise them).

- [ ] **Step 7: Commit**

```bash
git add src/lib/uk/law/params_2026_27.ts src/lib/uk/law/money.ts tests/uk/law/money.test.ts scripts/prebuild_all.ts CLAUDE.md docs/verification-protocol.md docs/loop/02-ORGANISATION-RESEARCH.md scripts/gates.json
git commit -m "uk law: the 2026-27 parameters in one dated file; money rounds half-pennies up and sums parts as pence (gate uk-law-money)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 3: Income tax (rUK)

The personal allowance is 12,570, reduced by 1 pound for every complete 2 pounds of adjusted net income above 100,000:
`PA = max(0, 12,570 - floor((ANI - 100,000) / 2))`, gone at 125,140. It is set against non-savings income first. Taxable
non-savings income fills the bands in order (20% to 37,700, 40% to 125,140, 45% above), then dividends sit on top: the first
500 at 0% but still using band, then 10.75%, 35.75% and 39.35% from wherever the non-savings income stopped. The marginal
rate of non-savings income is 0, 20%, 40%, then 60% from 100,000 to 125,140 (each pound of income costs 40p and withdraws
50p of allowance taxed at 40p in the pound, 20p more), then 45%. The schedule never falls, and inside the taper it is not
continuous: each even pound of excess (100,002, 100,004, ... 125,140) takes a whole pound of allowance at once, a 40p step
of tax, 12,570 steps in all; over each 2 pounds the tax rises 1.20, the 60%. Everywhere else the last penny before a pound
moves the tax by a penny at most. The test asserts both, the steps exactly (the review of 2026-10-03 found the first draft's
check could not see them), pins the dividend rules on four independently computed cases, and refuses an income that is not
a finite number rather than taxing it at zero. Task 5's optimiser has to respect the steps.

**Files:**
- Create: `src/lib/uk/law/income_tax.ts`
- Test: `tests/uk/law/income_tax.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (one `GATES` entry)
- Modify (generated by counts.ts): `CLAUDE.md`, `docs/verification-protocol.md`, `docs/loop/02-ORGANISATION-RESEARCH.md`, `scripts/gates.json`

- [ ] **Step 1: Write the failing test**

Create `tests/uk/law/income_tax.test.ts`:

```ts
/**
 * Income tax 2026-27 (rUK): allowance, taper, bands, dividends on top, and the shape of the schedule.
 * Expected values computed independently in Python (design/loop/build/goal-2026-10-02 plan check, 2026-10-02).
 *
 * Run: npx tsx tests/uk/law/income_tax.test.ts
 */
import { incomeTax, personalAllowance } from "../../../src/lib/uk/law/income_tax";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-income-tax";
const FILE = "src/lib/uk/law/income_tax.ts";
const REMEDY = "fix income_tax.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

check("allowance 12,570 up to 100,000", personalAllowance(100_000) === 12_570);
check("allowance 7,570 at 110,000 (1 pound per 2 above 100,000)", personalAllowance(110_000) === 7_570);
check("allowance 12,570 at 100,001 (no complete 2 pounds yet)", personalAllowance(100_001) === 12_570);
check("allowance gone at 125,140", personalAllowance(125_140) === 0);
check("30,000 of profit: 3,486.00", incomeTax(30_000).total === 3486);
check("60,000: 11,432.00", incomeTax(60_000).total === 11_432);
check("100,000: 27,432.00", incomeTax(100_000).total === 27_432);
check("110,000: 33,432.00", incomeTax(110_000).total === 33_432);
check("125,140: 42,516.00", incomeTax(125_140).total === 42_516);
check("130,000: 44,703.00", incomeTax(130_000).total === 44_703);
check("nothing below the allowance", incomeTax(12_570).total === 0);
check("salary 12,570 and 40,000 of dividends: 4,821.25", incomeTax(12_570, 40_000).total === 4821.25);
check("the first 500 of dividends are free", incomeTax(12_570, 500).total === 0);
check("1,000 of dividends: 500 free, 500 at 10.75% = 53.75", incomeTax(12_570, 1000).total === 53.75);
// Dividends on top of taxable non-savings income (each figure computed independently in Python, 2026-10-03).
check("50,000 and 10,000 of dividends: the free 500 straddles the basic band's edge, 10,882.25", incomeTax(50_000, 10_000).total === 10_882.25);
check("5,000 and 20,000 of dividends: the allowance left after salary covers dividends, 1,282.48", incomeTax(5_000, 20_000).total === 1_282.48);
check("124,000 and 5,000 of dividends: dividends cross 125,140 into the 39.35% rate, 43,807.71", incomeTax(124_000, 5_000).total === 43_807.71);
check("100,000 and 10,000 of dividends: the taper counts dividends, 32,828.25", incomeTax(100_000, 10_000).total === 32_828.25);

// The 60% band: between 100,000 and 125,140 a pound of income costs 40p plus 20p of lost allowance.
const m = (incomeTax(110_002).total - incomeTax(110_000).total) / 2;
check("marginal rate 60% inside the taper", Math.abs(m - 0.6) < 1e-9);

// Shape: never decreasing (sampled every 37 pounds).
let monotone = true;
let prev = incomeTax(0).total;
for (let x = 1; x <= 200_000; x += 37) {
  const t = incomeTax(x).total;
  if (t < prev) monotone = false;
  prev = t;
}
check("income tax never falls as income rises (0 to 200,000)", monotone);
// Shape: the last penny before every whole pound moves the tax by a penny at most, except the taper's steps, where a
// whole pound of allowance goes at once: exactly 40p at each even pound from 100,002 to 125,140.
let steps = 0;
let firstBreak: number | null = null;
for (let x = 1; x <= 200_000; x++) {
  const s = incomeTax(x).total - incomeTax(x - 0.01).total;
  const allowanceStep = x > 100_000 && x <= 125_140 && (x - 100_000) % 2 === 0;
  if (allowanceStep) steps++;
  const ok = allowanceStep ? Math.abs(s - 0.4) < 1e-9 : Math.abs(s) <= 0.011;
  if (!ok && firstBreak === null) firstBreak = x;
}
check(`a penny moves the tax by a penny at most, except ${steps.toLocaleString("en-GB")} taper steps of 40p${firstBreak === null ? "" : ` (first break at ${firstBreak})`}`, firstBreak === null && steps === 12_570);
const refuses = (f: () => unknown) => { try { f(); return false; } catch { return true; } };
check("negative income is refused", refuses(() => incomeTax(-1)));
check("negative dividends are refused", refuses(() => incomeTax(50_000, -1)));
check("an income that is not a number is refused, never taxed at zero", refuses(() => incomeTax(Number.NaN)) && refuses(() => incomeTax(50_000, Number.NaN)) && refuses(() => personalAllowance(Number.NaN)));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/income_tax: all pass");
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npx tsx tests/uk/law/income_tax.test.ts
```

Expected: exit code 1 with `Error: Cannot find module '../../../src/lib/uk/law/income_tax'`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/uk/law/income_tax.ts`:

```ts
/**
 * src/lib/uk/law/income_tax.ts
 *
 * Income tax for an rUK taxpayer (England, Wales, Northern Ireland), 2026-27, on non-savings income (trading profit,
 * salary) and dividends. Savings income is out of scope (a street business owner's figures do not need it).
 *
 * THE ORDER, as the law sets it: the personal allowance is set against non-savings income first, then dividends; the bands
 * are filled by non-savings income first and dividends sit on top (the top slice). The first 500 pounds of dividends are
 * taxed at 0% but still use up band.
 *
 * THE TAPER: the allowance falls by 1 pound for every 2 pounds of adjusted net income above 100,000, so it is zero from
 * 125,140. Read as "1 pound for every complete 2 pounds", the reduction is floor(excess / 2), so the allowance is a
 * staircase: at each even pound of excess (100,002, 100,004, ... 125,140, 12,570 steps) a whole pound of allowance goes at
 * once and the tax steps up by 40p (the higher rate on that pound). Between the steps the marginal rate is 40%; over each 2
 * pounds the tax rises 1.20, the 60% the band is known for. The schedule never falls.
 *
 * Every band's tax is rounded to the penny and the lines summed, so the breakdown adds up to the total.
 */
import { UK_2026_27 as L } from "./params_2026_27";
import { pennies, sumPennies } from "./money";

const IT = L.incomeTax;
const DV = L.dividends;

export function personalAllowance(adjustedNetIncome: number): number {
  if (!Number.isFinite(adjustedNetIncome)) throw new Error(`personalAllowance: not a finite income (${adjustedNetIncome})`);
  if (adjustedNetIncome <= IT.taperThreshold) return IT.personalAllowance;
  const reduction = Math.floor((adjustedNetIncome - IT.taperThreshold) / IT.taperDivisor);
  return Math.max(0, IT.personalAllowance - reduction);
}

/** Tax on `amount` of income placed in the bands starting at `start` (taxable income already below it). */
function fill(start: number, amount: number, rates: readonly [number, number, number]): number[] {
  const edges = [0, IT.basicRateBand, IT.additionalRateThreshold, Infinity];
  const lines: number[] = [];
  let pos = start;
  let left = amount;
  for (let i = 0; i < 3 && left > 0; i++) {
    if (pos >= edges[i + 1]) continue;
    const take = Math.min(left, edges[i + 1] - Math.max(pos, edges[i]));
    lines.push(take * rates[i]);
    pos += take;
    left -= take;
  }
  return lines;
}

/** A year's income tax, in pounds; every amount annual and gross. */
export type IncomeTaxBreakdown = {
  /** the personal allowance after the taper */
  allowance: number;
  /** non-savings income above the allowance */
  taxableNonSavings: number;
  /** dividends above what is left of the allowance, the 500 taxed at 0% included */
  taxableDividends: number;
  nonSavingsTax: number;
  dividendTax: number;
  total: number;
};

export function incomeTax(nonSavings: number, dividends = 0): IncomeTaxBreakdown {
  if (nonSavings < 0 || dividends < 0) throw new Error("incomeTax: income cannot be negative");
  // personalAllowance refuses a sum that is not finite, so NaN or Infinity in either input is refused there
  const allowance = personalAllowance(nonSavings + dividends);
  const paNonSavings = Math.min(allowance, nonSavings);
  const paDividends = Math.min(allowance - paNonSavings, dividends);
  const taxableNonSavings = nonSavings - paNonSavings;
  const taxableDividends = dividends - paDividends;
  const nonSavingsTax = sumPennies(fill(0, taxableNonSavings, [IT.basic, IT.higher, IT.additional]));
  const free = Math.min(DV.allowance, taxableDividends);
  const dividendTax = sumPennies(fill(taxableNonSavings + free, taxableDividends - free, [DV.basic, DV.higher, DV.additional]));
  return {
    allowance,
    taxableNonSavings,
    taxableDividends,
    nonSavingsTax,
    dividendTax,
    total: pennies(nonSavingsTax + dividendTax),
  };
}
```

- [ ] **Step 4: Run it and watch it pass**

```bash
npx tsx tests/uk/law/income_tax.test.ts
```

Expected: 24 lines starting `PASS`, the last line `uk/law/income_tax: all pass`, exit code 0.

- [ ] **Step 5: Wire it into the chain**

In `scripts/prebuild_all.ts`, find this line in `GATES`:

```ts
  { name: "uk-law-money", script: "tests/uk/law/money.test.ts" },
```

and add directly below it:

```ts
  { name: "uk-law-income-tax", script: "tests/uk/law/income_tax.test.ts" },
```

Then run:

```bash
npx tsx scripts/counts.ts --write
```

Expected: one line beginning `[counts] wrote 3 carrier(s) and scripts/gates.json:` whose gate count is one higher than before this step.

- [ ] **Step 6: Prove the gate runs in the chain and the ratchet holds**

```bash
npx tsx scripts/prebuild_all.ts --only=uk-law-income-tax
```

Expected: a line `✓ uk-law-income-tax` and, at the end, `SUBSET: PASS (not the chain; run without --only for the gate)`.

```bash
node scripts/audit_gate_reds.mjs
```

Expected: the last line starts `gate reds: PASS` and ends `the ratchet holds` (the three counts equal the baseline in `scripts/gate_reds_baseline.json`; a new test must not raise them).

- [ ] **Step 7: Commit**

```bash
git add src/lib/uk/law/income_tax.ts tests/uk/law/income_tax.test.ts scripts/prebuild_all.ts CLAUDE.md docs/verification-protocol.md docs/loop/02-ORGANISATION-RESEARCH.md scripts/gates.json
git commit -m "uk law: income tax with the allowance taper and dividends as the top slice (gate uk-law-income-tax)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 4: National Insurance

Annual basis, 2026-27. Class 4 (a sole trader's profit P): `6% x clamp(P, 12,570, 50,270) + 2% x max(0, P - 50,270)`.
Employee Class 1 on pay G: `8% x clamp(G, 12,570, 50,270) + 2% x max(0, G - 50,270)`. Employer Class 1:
`15% x max(0, G - 5,000)`, or `15% x max(0, G - 50,270)` for an employee under 21 or an apprentice under 25. The Employment
Allowance is one budget for the business: `net = max(0, sum_i er_i - 10,500)`, so how it is spread across employees cannot
change the bill (`sum - min(A, sum)` depends only on the sum); a company whose only NI-liable employee is its one director
cannot claim it. Payroll actually runs on period thresholds (96 a week, 417 a month); the annual basis differs by about a
pound on 30,000 and says so in the module.

**Files:**
- Create: `src/lib/uk/law/national_insurance.ts`
- Test: `tests/uk/law/national_insurance.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (one `GATES` entry)
- Modify (generated by counts.ts): `CLAUDE.md`, `docs/verification-protocol.md`, `docs/loop/02-ORGANISATION-RESEARCH.md`, `scripts/gates.json`

- [ ] **Step 1: Write the failing test**

Create `tests/uk/law/national_insurance.test.ts`:

```ts
/**
 * National Insurance 2026-27: Class 4, Class 1 primary and secondary, the Employment Allowance as one budget.
 *
 * Run: npx tsx tests/uk/law/national_insurance.test.ts
 */
import { class4, employeeClass1, employerClass1, employerNiAfterAllowance } from "../../../src/lib/uk/law/national_insurance";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-national-insurance";
const FILE = "src/lib/uk/law/national_insurance.ts";
const REMEDY = "fix national_insurance.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

check("Class 4 on 30,000: 6% of 17,430 = 1,045.80", class4(30_000) === 1045.8);
check("Class 4 on 60,000: 2,262 + 2% of 9,730 = 2,456.60", class4(60_000) === 2456.6);
check("Class 4 nothing at 12,570", class4(12_570) === 0);
check("employee Class 1 on 30,000: 8% of 17,430 = 1,394.40", employeeClass1(30_000) === 1394.4);
check("employer on 30,000: 15% of 25,000 = 3,750.00", employerClass1(30_000) === 3750);
check("employer on a living-wage year (24,784.50): 2,967.68", employerClass1(24_784.5) === 2967.68);
check("employer on an under-21's 21,157.50: nothing below 50,270", employerClass1(21_157.5, { reliefToUpperSecondary: true }) === 0);
check("employer nothing at the secondary threshold", employerClass1(5_000) === 0);

const four = employerNiAfterAllowance([2967.68, 2967.68, 2967.68, 2967.68], true);
check("four living-wage staff: 11,870.72 of employer NI", four.gross === 11_870.72);
check("the allowance takes 10,500 of it", four.allowanceUsed === 10_500);
check("the business pays 1,370.72", four.net === 1370.72);
check("a sole director cannot claim: pays it all", employerNiAfterAllowance([3750], false).net === 3750);
check("the allowance covers about 3.54 living-wage staff", Math.abs(10_500 / 2967.675 - 3.538) < 0.001);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/national_insurance: all pass");
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npx tsx tests/uk/law/national_insurance.test.ts
```

Expected: exit code 1 with `Error: Cannot find module '../../../src/lib/uk/law/national_insurance'`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/uk/law/national_insurance.ts`:

```ts
/**
 * src/lib/uk/law/national_insurance.ts
 *
 * National Insurance, 2026-27, on an annual basis: Class 4 on a sole trader's profit, Class 1 primary on an employee's
 * pay (a director's annual earnings period), Class 1 secondary (the employer's) with the under-21 and apprentice relief,
 * and the Employment Allowance as a business-wide budget.
 *
 * Payroll applies the thresholds per pay period (96 a week, 417 a month), which moves the annual figure by about a pound
 * on 30,000 of pay; the vertical prints yearly figures, so the annual basis is the one used and the difference is stated.
 */
import { UK_2026_27 as L } from "./params_2026_27";
import { bandedTax, pennies } from "./money";

export function class4(profit: number): number {
  const c = L.class4;
  return bandedTax(Math.max(0, profit), [
    { upTo: c.lowerProfitsLimit, rate: 0 },
    { upTo: c.upperProfitsLimit, rate: c.main },
    { upTo: Infinity, rate: c.additional },
  ]);
}

export function employeeClass1(pay: number): number {
  const c = L.class1Primary;
  return bandedTax(Math.max(0, pay), [
    { upTo: c.primaryThreshold, rate: 0 },
    { upTo: c.upperEarningsLimit, rate: c.main },
    { upTo: Infinity, rate: c.additional },
  ]);
}

/** The employer's NI on one employee's annual pay, before the Employment Allowance. */
export function employerClass1(pay: number, opts: { reliefToUpperSecondary?: boolean } = {}): number {
  const c = L.class1Secondary;
  const from = opts.reliefToUpperSecondary ? c.upperSecondaryThreshold : c.secondaryThreshold;
  return pennies(Math.max(0, pay - from) * c.rate);
}

/**
 * The Employment Allowance is one budget for the whole business (10,500 a year), spent against the employer's NI of all
 * staff together, so how it is "allocated" between employees does not change the business's bill:
 *   netEmployerNi = max(0, sum of employer NI - allowance), when the business can claim it.
 * A company whose only employee paid above the secondary threshold is its single director cannot claim it.
 */
export function employerNiAfterAllowance(employerNiByEmployee: readonly number[], canClaim: boolean): { gross: number; allowanceUsed: number; net: number } {
  const gross = pennies(employerNiByEmployee.reduce((a, b) => a + b, 0));
  const allowanceUsed = canClaim ? Math.min(L.class1Secondary.employmentAllowance, gross) : 0;
  return { gross, allowanceUsed, net: pennies(gross - allowanceUsed) };
}
```

- [ ] **Step 4: Run it and watch it pass**

```bash
npx tsx tests/uk/law/national_insurance.test.ts
```

Expected: 13 lines starting `PASS`, the last line `uk/law/national_insurance: all pass`, exit code 0.

- [ ] **Step 5: Wire it into the chain**

In `scripts/prebuild_all.ts`, find this line in `GATES`:

```ts
  { name: "uk-law-income-tax", script: "tests/uk/law/income_tax.test.ts" },
```

and add directly below it:

```ts
  { name: "uk-law-national-insurance", script: "tests/uk/law/national_insurance.test.ts" },
```

Then run:

```bash
npx tsx scripts/counts.ts --write
```

Expected: one line beginning `[counts] wrote 3 carrier(s) and scripts/gates.json:` whose gate count is one higher than before this step.

- [ ] **Step 6: Prove the gate runs in the chain and the ratchet holds**

```bash
npx tsx scripts/prebuild_all.ts --only=uk-law-national-insurance
```

Expected: a line `✓ uk-law-national-insurance` and, at the end, `SUBSET: PASS (not the chain; run without --only for the gate)`.

```bash
node scripts/audit_gate_reds.mjs
```

Expected: the last line starts `gate reds: PASS` and ends `the ratchet holds` (the three counts equal the baseline in `scripts/gate_reds_baseline.json`; a new test must not raise them).

- [ ] **Step 7: Commit**

```bash
git add src/lib/uk/law/national_insurance.ts tests/uk/law/national_insurance.test.ts scripts/prebuild_all.ts CLAUDE.md docs/verification-protocol.md docs/loop/02-ORGANISATION-RESEARCH.md scripts/gates.json
git commit -m "uk law: Class 4, employee and employer Class 1, the Employment Allowance as one budget (gate uk-law-national-insurance)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 5: Corporation Tax

One company, a 12-month period, no associated companies (each of those is out of scope and named in the module).
`CT(P) = 19% P` up to 50,000; `25% P - (3/200)(250,000 - P)` between the limits; `25% P` above 250,000. Between the limits
`CT(P) = 0.265 P - 3,750`, so the marginal rate is 26.5% and the average rate climbs from 19% to 25%. Continuity is the
check that the fraction is right: `CT(50,000) = 9,500` and `CT(250,000) = 62,500` from both sides, which holds only for
3/200 (task 1 reads the fraction on the official page).

**Files:**
- Create: `src/lib/uk/law/corporation_tax.ts`
- Test: `tests/uk/law/corporation_tax.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (one `GATES` entry)
- Modify (generated by counts.ts): `CLAUDE.md`, `docs/verification-protocol.md`, `docs/loop/02-ORGANISATION-RESEARCH.md`, `scripts/gates.json`

- [ ] **Step 1: Write the failing test**

Create `tests/uk/law/corporation_tax.test.ts`:

```ts
/**
 * Corporation Tax FY2026: the two rates, marginal relief between them, continuity at both limits.
 *
 * Run: npx tsx tests/uk/law/corporation_tax.test.ts
 */
import { corporationTax } from "../../../src/lib/uk/law/corporation_tax";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-corporation-tax";
const FILE = "src/lib/uk/law/corporation_tax.ts";
const REMEDY = "fix corporation_tax.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

check("no tax on a loss", corporationTax(-5_000) === 0);
check("19% at 50,000: 9,500", corporationTax(50_000) === 9_500);
check("marginal relief at 100,000: 25,000 - 2,250 = 22,750", corporationTax(100_000) === 22_750);
check("25% at 250,000: 62,500", corporationTax(250_000) === 62_500);
check("25% at 300,000: 75,000", corporationTax(300_000) === 75_000);
check("continuous at 50,000 (a pound more costs 26.5p, not a jump)", Math.abs(corporationTax(50_001) - 9_500 - 0.265) <= 0.011);
check("continuous at 250,000", Math.abs(corporationTax(250_000) - corporationTax(249_999) - 0.265) <= 0.011);
let ok = true;
for (let p = 50_100; p < 250_000; p += 997) {
  const m = corporationTax(p + 100) - corporationTax(p);
  if (Math.abs(m - 26.5) > 0.02) ok = false;
}
check("between the limits every extra 100 pounds costs 26.50", ok);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/corporation_tax: all pass");
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npx tsx tests/uk/law/corporation_tax.test.ts
```

Expected: exit code 1 with `Error: Cannot find module '../../../src/lib/uk/law/corporation_tax'`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/uk/law/corporation_tax.ts`:

```ts
/**
 * src/lib/uk/law/corporation_tax.ts
 *
 * Corporation Tax, financial year 2026, for a single company with no associated companies and a 12-month accounting
 * period (the limits are divided by associated companies and shortened for short periods; both out of scope, stated).
 *
 *   P <= 50,000                 tax = 19% x P
 *   50,000 < P <= 250,000       tax = 25% x P - (3/200) x (250,000 - P)          (marginal relief)
 *   P > 250,000                 tax = 25% x P
 *
 * Between the limits the formula is 0.265 x P - 3,750, so the marginal rate there is 26.5% and the effective rate climbs
 * from 19% to 25%. It is continuous at both limits (9,500 at 50,000; 62,500 at 250,000), which the tests assert.
 */
import { UK_2026_27 as L } from "./params_2026_27";
import { pennies } from "./money";

export function corporationTax(profit: number): number {
  const c = L.corporationTax;
  if (profit <= 0) return 0;
  if (profit <= c.lowerLimit) return pennies(c.smallProfitsRate * profit);
  if (profit <= c.upperLimit) return pennies(c.mainRate * profit - c.marginalReliefFraction * (c.upperLimit - profit));
  return pennies(c.mainRate * profit);
}
```

- [ ] **Step 4: Run it and watch it pass**

```bash
npx tsx tests/uk/law/corporation_tax.test.ts
```

Expected: 8 lines starting `PASS`, the last line `uk/law/corporation_tax: all pass`, exit code 0.

- [ ] **Step 5: Wire it into the chain**

In `scripts/prebuild_all.ts`, find this line in `GATES`:

```ts
  { name: "uk-law-national-insurance", script: "tests/uk/law/national_insurance.test.ts" },
```

and add directly below it:

```ts
  { name: "uk-law-corporation-tax", script: "tests/uk/law/corporation_tax.test.ts" },
```

Then run:

```bash
npx tsx scripts/counts.ts --write
```

Expected: one line beginning `[counts] wrote 3 carrier(s) and scripts/gates.json:` whose gate count is one higher than before this step.

- [ ] **Step 6: Prove the gate runs in the chain and the ratchet holds**

```bash
npx tsx scripts/prebuild_all.ts --only=uk-law-corporation-tax
```

Expected: a line `✓ uk-law-corporation-tax` and, at the end, `SUBSET: PASS (not the chain; run without --only for the gate)`.

```bash
node scripts/audit_gate_reds.mjs
```

Expected: the last line starts `gate reds: PASS` and ends `the ratchet holds` (the three counts equal the baseline in `scripts/gate_reds_baseline.json`; a new test must not raise them).

- [ ] **Step 7: Commit**

```bash
git add src/lib/uk/law/corporation_tax.ts tests/uk/law/corporation_tax.test.ts scripts/prebuild_all.ts CLAUDE.md docs/verification-protocol.md docs/loop/02-ORGANISATION-RESEARCH.md scripts/gates.json
git commit -m "uk law: corporation tax with marginal relief, continuous at both limits (gate uk-law-corporation-tax)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 6: What the owner keeps, by legal form

Sole trader: `K = P - IT(P) - Class4(P)`. One-director company extracting everything in the year with salary s:
`er(s) = 15% max(0, s - 5,000)`, retained profit `pi(s) = Pi - s - er(s) >= 0`, `CT(pi)`, dividends `d = pi - CT(pi)`, and
`K(s) = s - ee(s) + d - IT(s, d)`. Outside the allowance taper every schedule in that chain is continuous and piecewise linear
in s, so K is too, and its maximum is at a breakpoint of some schedule or at an end: the secondary threshold 5,000, the primary threshold 12,570, 50,270,
the taper points, the two salaries that land `pi(s)` exactly on a corporation-tax limit, and the largest payable salary
`s_max`. The search evaluates those (unrounded), a 250-pound grid, then refines to the pound around the best; `s_max` is
kept to the penny because the best salary can be the whole profit less its NI. Inside the taper each even pound of adjusted
net income takes a whole pound of allowance, so K drops by up to 40p there (a sawtooth); the grid and the refine to the pound
find the best tooth: at 150,000 the best salary is 4,996, 14p better than 5,000, so pages print the salary to the nearest
100. The test proves the search against a brute-force 10-pound grid at three profits. At 100,000 of
profit a sole trader keeps 69,311.40 and the company 65,209.63: the 2026-27 dividend rates reversed the old advice.

**Files:**
- Create: `src/lib/uk/law/take_home.ts`
- Test: `tests/uk/law/take_home.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (one `GATES` entry)
- Modify (generated by counts.ts): `CLAUDE.md`, `docs/verification-protocol.md`, `docs/loop/02-ORGANISATION-RESEARCH.md`, `scripts/gates.json`

- [ ] **Step 1: Write the failing test**

Create `tests/uk/law/take_home.test.ts`:

```ts
/**
 * What an owner keeps after tax, sole trader and company, and the company's best salary.
 * Expected values computed independently in Python on a 10-pound salary grid (2026-10-02).
 *
 * Run: npx tsx tests/uk/law/take_home.test.ts
 */
import { soleTraderTakeHome, companyTakeHome, bestCompanyTakeHome } from "../../../src/lib/uk/law/take_home";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-take-home";
const FILE = "src/lib/uk/law/take_home.ts";
const REMEDY = "fix take_home.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

check("sole trader on 30,000 keeps 25,468.20", soleTraderTakeHome(30_000).takeHome === 25_468.2);
check("sole trader on 60,000 keeps 46,111.40", soleTraderTakeHome(60_000).takeHome === 46_111.4);
check("sole trader on 100,000 keeps 69,311.40", soleTraderTakeHome(100_000).takeHome === 69_311.4);
check("sole trader on 150,000 keeps 92,040.40", soleTraderTakeHome(150_000).takeHome === 92_040.4);
check("a loss keeps nothing and pays nothing", soleTraderTakeHome(-3_000).takeHome === 0);

const c = companyTakeHome(60_000, 12_570)!;
check("company 60,000, salary 12,570: employer NI 1,135.50", c.employerNi === 1135.5);
check("profit after salary 46,294.50, corporation tax 8,795.96", c.profitAfterSalary === 46_294.5 && c.corporationTax === 8795.96);
check("dividends 37,498.54", c.dividends === 37_498.54);
check("keeps 46,091.20", c.takeHome === 46_091.2);
check("a salary the profit cannot pay is refused", companyTakeHome(10_000, 20_000) === null);

const cases: Array<[number, number, number]> = [
  [30_000, 12_570, 24_403.45],
  [60_000, 12_570, 46_091.2],
  [100_000, 12_570, 65_209.63],
];
for (const [profit, salary, keep] of cases) {
  const b = bestCompanyTakeHome(profit);
  check(`company ${profit}: best salary ${salary}, keeps ${keep}`, b.salary === salary && b.takeHome === keep);
}
// Inside the allowance taper the whole-pound rule (1 pound per complete 2) makes a sawtooth worth pennies, so the best
// salary can sit a few pounds off the kink: at 150,000 it is 4,996, 14p better than 5,000 (85,321.30 against 85,321.16).
const b150 = bestCompanyTakeHome(150_000);
check("company 150,000: best salary within 100 of 5,000, within a pound of 85,321.16 and not below it",
  Math.abs(b150.salary - 5_000) <= 100 && b150.takeHome >= 85_321.16 && b150.takeHome - 85_321.16 < 1);
// The search is at least as good as every salary on a 10-pound grid (a brute-force check).
let beaten = false;
for (const profit of [45_000, 80_000, 120_000]) {
  const b = bestCompanyTakeHome(profit);
  for (let s = 0; s <= profit; s += 10) {
    const r = companyTakeHome(profit, s);
    if (r && r.takeHome > b.takeHome + 1e-9) beaten = true;
  }
}
check("no salary on a 10-pound grid beats the search (45k, 80k, 120k)", !beaten);
check("at 100,000 a sole trader keeps more than a company (69,311.40 against 65,209.63)", soleTraderTakeHome(100_000).takeHome > bestCompanyTakeHome(100_000).takeHome);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/take_home: all pass");
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npx tsx tests/uk/law/take_home.test.ts
```

Expected: exit code 1 with `Error: Cannot find module '../../../src/lib/uk/law/take_home'`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/uk/law/take_home.ts`:

```ts
/**
 * src/lib/uk/law/take_home.ts
 *
 * What an owner keeps from a year's profit after tax, by legal form, 2026-27 rUK.
 *
 * SOLE TRADER. The profit is the owner's income: keep = P - incomeTax(P) - class4(P).
 *
 * LIMITED COMPANY, one director-shareholder, every pound extracted in the year (retaining profit in the company is a
 * different question and is out of scope, stated). For a salary s:
 *   employer NI          er(s) = 15% x max(0, s - 5,000)        (no Employment Allowance: a sole director cannot claim it)
 *   company profit       pi(s) = Pi - s - er(s)                  (must stay >= 0)
 *   corporation tax      ct(s) = CT(pi(s))
 *   dividends            d(s)  = pi(s) - ct(s)
 *   employee NI          ee(s) = class1Primary(s)
 *   income tax           it(s) = incomeTax(s, d(s))
 *   keep(s) = s - ee(s) + d(s) - it(s)
 * Outside the allowance taper keep(s) is continuous and piecewise linear in s (a composition of continuous piecewise-linear
 * schedules), so its maximum on [0, sMax] sits at a breakpoint of one of the schedules or at an end. The search evaluates every breakpoint it can name
 * (0, the secondary threshold, the primary threshold, the upper limits, the taper points, the salaries that put the company
 * profit exactly on a corporation-tax limit, sMax), plus a 250-pound grid, then refines the best to the pound. Ties go to
 * the lower salary. Measured on four profits (tests): 12,570 is best at 30k, 60k and 100k; about 5,000 at 150k.
 *
 * INSIDE THE TAPER (adjusted net income 100,000 to 125,140) keep(s) is not continuous: each time adjusted net income
 * crosses an even pound, a whole pound of allowance goes at once and keep drops by up to 40p (the rate on the income that
 * pound now taxes), so keep(s) is a sawtooth there. The 250-pound grid and the refine to the pound find the best tooth:
 * at 150,000 of profit the best salary is 4,996, 14p better than 5,000. A page prints the salary rounded to the nearest
 * 100 pounds; the engine keeps the exact one.
 */
import { UK_2026_27 as L } from "./params_2026_27";
import { incomeTax } from "./income_tax";
import { class4, employeeClass1, employerClass1 } from "./national_insurance";
import { corporationTax } from "./corporation_tax";
import { pennies, sumPennies } from "./money";

export type SoleTraderTakeHome = { profit: number; incomeTax: number; class4: number; takeHome: number };

export function soleTraderTakeHome(profit: number): SoleTraderTakeHome {
  const p = Math.max(0, profit);
  const it = incomeTax(p).total;
  const c4 = class4(p);
  return { profit: p, incomeTax: it, class4: c4, takeHome: sumPennies([p, -it, -c4]) };
}

export type CompanyTakeHome = {
  companyProfit: number;
  salary: number;
  employerNi: number;
  profitAfterSalary: number;
  corporationTax: number;
  dividends: number;
  employeeNi: number;
  incomeTax: number;
  takeHome: number;
};

export function companyTakeHome(companyProfit: number, salary: number): CompanyTakeHome | null {
  const s = pennies(Math.max(0, salary));
  const er = employerClass1(s);
  const pi = pennies(companyProfit - s - er);
  if (pi < 0) return null;
  const ct = corporationTax(pi);
  const d = pennies(pi - ct);
  const ee = employeeClass1(s);
  const it = incomeTax(s, d).total;
  return {
    companyProfit,
    salary: s,
    employerNi: er,
    profitAfterSalary: pi,
    corporationTax: ct,
    dividends: d,
    employeeNi: ee,
    incomeTax: it,
    takeHome: sumPennies([s, -ee, d, -it]),
  };
}

/** The largest salary the profit can pay with its employer NI (bisection on a decreasing function). */
function maxSalary(companyProfit: number): number {
  let lo = 0;
  let hi = Math.max(0, companyProfit);
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (companyTakeHome(companyProfit, mid)) lo = mid;
    else hi = mid;
  }
  return Math.floor(lo * 100) / 100; // to the penny: the best salary can be the whole profit less its NI, e.g. 11,041.65
}

/** The salary at which the company's profit after salary equals `target`, or null when no salary gets there. */
function salaryForCompanyProfit(companyProfit: number, target: number, sMax: number): number | null {
  const at = (s: number) => companyProfit - s - employerClass1(s);
  if (at(0) < target || at(sMax) > target) return null;
  let lo = 0;
  let hi = sMax;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (at(mid) > target) lo = mid;
    else hi = mid;
  }
  return pennies(lo);
}

export function bestCompanyTakeHome(companyProfit: number): CompanyTakeHome {
  const sMax = maxSalary(companyProfit);
  const named = [
    0,
    L.class1Secondary.secondaryThreshold,
    L.class1Primary.primaryThreshold,
    L.class1Primary.upperEarningsLimit,
    L.incomeTax.taperThreshold,
    L.incomeTax.additionalRateThreshold,
    sMax,
    salaryForCompanyProfit(companyProfit, L.corporationTax.lowerLimit, sMax),
    salaryForCompanyProfit(companyProfit, L.corporationTax.upperLimit, sMax),
  ];
  const candidates = new Set<number>();
  for (const s of named) if (s !== null && s >= 0 && s <= sMax) candidates.add(s);
  for (let s = 0; s <= sMax; s += 250) candidates.add(s);
  const better = (a: CompanyTakeHome | null, b: CompanyTakeHome | null) =>
    !!a && (!b || a.takeHome > b.takeHome || (a.takeHome === b.takeHome && a.salary < b.salary));
  let best: CompanyTakeHome | null = null;
  for (const s of [...candidates].sort((a, b) => a - b)) {
    const r = companyTakeHome(companyProfit, s);
    if (better(r, best)) best = r;
  }
  if (!best) throw new Error(`bestCompanyTakeHome: no feasible salary for profit ${companyProfit}`);
  let winner: CompanyTakeHome = best;
  const centre = winner.salary;
  for (let s = Math.max(0, centre - 250); s <= Math.min(sMax, centre + 250); s++) {
    const r = companyTakeHome(companyProfit, s);
    if (r && better(r, winner)) winner = r;
  }
  return winner;
}
```

- [ ] **Step 4: Run it and watch it pass**

```bash
npx tsx tests/uk/law/take_home.test.ts
```

Expected: 16 lines starting `PASS`, the last line `uk/law/take_home: all pass`, exit code 0.

- [ ] **Step 5: Wire it into the chain**

In `scripts/prebuild_all.ts`, find this line in `GATES`:

```ts
  { name: "uk-law-corporation-tax", script: "tests/uk/law/corporation_tax.test.ts" },
```

and add directly below it:

```ts
  { name: "uk-law-take-home", script: "tests/uk/law/take_home.test.ts" },
```

Then run:

```bash
npx tsx scripts/counts.ts --write
```

Expected: one line beginning `[counts] wrote 3 carrier(s) and scripts/gates.json:` whose gate count is one higher than before this step.

- [ ] **Step 6: Prove the gate runs in the chain and the ratchet holds**

```bash
npx tsx scripts/prebuild_all.ts --only=uk-law-take-home
```

Expected: a line `✓ uk-law-take-home` and, at the end, `SUBSET: PASS (not the chain; run without --only for the gate)`.

```bash
node scripts/audit_gate_reds.mjs
```

Expected: the last line starts `gate reds: PASS` and ends `the ratchet holds` (the three counts equal the baseline in `scripts/gate_reds_baseline.json`; a new test must not raise them).

- [ ] **Step 7: Commit**

```bash
git add src/lib/uk/law/take_home.ts tests/uk/law/take_home.test.ts scripts/prebuild_all.ts CLAUDE.md docs/verification-protocol.md docs/loop/02-ORGANISATION-RESEARCH.md scripts/gates.json
git commit -m "uk law: take-home as a sole trader and as a one-director company, the extraction optimum searched exactly (gate uk-law-take-home)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 7: One hire, all in

`allIn = G + er(G) - allowanceUsed + pension(G)`, with `pension(G) = 3% x max(0, min(G, 50,270) - 6,240)` when the employee is
22 to State Pension age and earns over 10,000 (auto-enrolment). G includes paid holiday. Statutory sick, maternity and
paternity pay are contingent and employers' liability insurance has no official price; both stay outside the yearly
figure and the module says so. Worked: the National Living Wage at 37.5 hours for 52 weeks is 24,784.50; employer NI
2,967.68; pension 556.34; all in 28,308.52, or 25,340.84 where the allowance is claimable (it covers about 3.54 such staff).

**Files:**
- Create: `src/lib/uk/law/employer_cost.ts`
- Test: `tests/uk/law/employer_cost.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (one `GATES` entry)
- Modify (generated by counts.ts): `CLAUDE.md`, `docs/verification-protocol.md`, `docs/loop/02-ORGANISATION-RESEARCH.md`, `scripts/gates.json`

- [ ] **Step 1: Write the failing test**

Create `tests/uk/law/employer_cost.test.ts`:

```ts
/**
 * One hire all in (Pro section 77), against the law research's worked examples of 2026-10-02.
 *
 * Run: npx tsx tests/uk/law/employer_cost.test.ts
 */
import { annualGross, hireAllIn } from "../../../src/lib/uk/law/employer_cost";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-employer-cost";
const FILE = "src/lib/uk/law/employer_cost.ts";
const REMEDY = "fix employer_cost.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

const nlw = annualGross(12.71, 37.5);
check("living wage, 37.5 hours, 52 weeks: 24,784.50", nlw === 24_784.5);
const a = hireAllIn({ gross: nlw, age: 30 });
check("employer NI 2,967.68, pension 556.34", a.employerNi === 2967.68 && a.pension === 556.34);
check("all in without the allowance: 28,308.52", a.allIn === 28_308.52);
const b = hireAllIn({ gross: nlw, age: 30, allowanceRemaining: 10_500 });
check("all in with the allowance: 25,340.84", b.allIn === 25_340.84 && b.allowanceUsed === 2967.68);
const c = hireAllIn({ gross: 30_000, age: 40 });
check("30,000: 3,750.00 NI, 712.80 pension, 34,462.80 all in", c.employerNi === 3750 && c.pension === 712.8 && c.allIn === 34_462.8);
check("30,000 with the allowance: 30,712.80", hireAllIn({ gross: 30_000, age: 40, allowanceRemaining: 10_500 }).allIn === 30_712.8);
const d = hireAllIn({ gross: annualGross(10.85, 37.5), age: 20 });
check("an 18 to 20 year old at 10.85: 21,157.50, no employer NI, no pension", d.gross === 21_157.5 && d.employerNi === 0 && d.pension === 0 && d.allIn === 21_157.5);
const e = hireAllIn({ gross: annualGross(8, 30), age: 23, apprentice: true });
check("an apprentice of 23: no employer NI below 50,270", e.employerNi === 0);
check("a part-timer on 9,000 is not auto-enrolled", hireAllIn({ gross: 9_000, age: 30 }).pension === 0);
check("the allowance never makes the bill smaller than the pay", hireAllIn({ gross: 6_000, age: 30, allowanceRemaining: 10_500 }).allIn === 6_000);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/employer_cost: all pass");
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npx tsx tests/uk/law/employer_cost.test.ts
```

Expected: exit code 1 with `Error: Cannot find module '../../../src/lib/uk/law/employer_cost'`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/uk/law/employer_cost.ts`:

```ts
/**
 * src/lib/uk/law/employer_cost.ts
 *
 * One hire, all in (Pro section 77): what a year of one employee costs the business, 2026-27.
 *
 *   allIn = gross + employerNi - allowanceUsed + pension
 *   employerNi = 15% x max(0, gross - 5,000), or 15% x max(0, gross - 50,270) under 21 and for apprentices under 25
 *   allowanceUsed = min(allowance still unspent this year, employerNi)        (0 for a company whose only employee is its director)
 *   pension = 3% x max(0, min(gross, 50,270) - 6,240) when aged 22 to State Pension age and gross over 10,000
 *
 * gross already contains the 5.6 weeks of paid holiday. Statutory sick, maternity and paternity pay are contingent costs in
 * the weeks they happen and are not in the yearly figure (stated). Employers' liability insurance has no official price and
 * is not in it either.
 *
 * Each line is rounded to the penny and allIn is the sum of the rounded lines, so the bill adds up.
 */
import { UK_2026_27 as L } from "./params_2026_27";
import { employerClass1 } from "./national_insurance";
import { pennies, sumPennies } from "./money";

export function annualGross(hourly: number, hoursPerWeek: number, weeks = 52): number {
  return pennies(hourly * hoursPerWeek * weeks);
}

export type HireCost = { gross: number; employerNi: number; allowanceUsed: number; pension: number; allIn: number };

export function hireAllIn(input: { gross: number; age: number; apprentice?: boolean; allowanceRemaining?: number }): HireCost {
  const gross = pennies(input.gross);
  const relief = input.age < 21 || (!!input.apprentice && input.age < 25);
  const employerNi = employerClass1(gross, { reliefToUpperSecondary: relief });
  const allowanceUsed = pennies(Math.min(Math.max(0, input.allowanceRemaining ?? 0), employerNi));
  const p = L.pension;
  const enrolled = input.age >= p.minAge && input.age < p.statePensionAge && gross > p.trigger;
  const pension = enrolled ? pennies(p.employerMinimum * Math.max(0, Math.min(gross, p.qualifyingUpper) - p.qualifyingLower)) : 0;
  return { gross, employerNi, allowanceUsed, pension, allIn: sumPennies([gross, employerNi, -allowanceUsed, pension]) };
}
```

- [ ] **Step 4: Run it and watch it pass**

```bash
npx tsx tests/uk/law/employer_cost.test.ts
```

Expected: 10 lines starting `PASS`, the last line `uk/law/employer_cost: all pass`, exit code 0.

- [ ] **Step 5: Wire it into the chain**

In `scripts/prebuild_all.ts`, find this line in `GATES`:

```ts
  { name: "uk-law-take-home", script: "tests/uk/law/take_home.test.ts" },
```

and add directly below it:

```ts
  { name: "uk-law-employer-cost", script: "tests/uk/law/employer_cost.test.ts" },
```

Then run:

```bash
npx tsx scripts/counts.ts --write
```

Expected: one line beginning `[counts] wrote 3 carrier(s) and scripts/gates.json:` whose gate count is one higher than before this step.

- [ ] **Step 6: Prove the gate runs in the chain and the ratchet holds**

```bash
npx tsx scripts/prebuild_all.ts --only=uk-law-employer-cost
```

Expected: a line `✓ uk-law-employer-cost` and, at the end, `SUBSET: PASS (not the chain; run without --only for the gate)`.

```bash
node scripts/audit_gate_reds.mjs
```

Expected: the last line starts `gate reds: PASS` and ends `the ratchet holds` (the three counts equal the baseline in `scripts/gate_reds_baseline.json`; a new test must not raise them).

- [ ] **Step 7: Commit**

```bash
git add src/lib/uk/law/employer_cost.ts tests/uk/law/employer_cost.test.ts scripts/prebuild_all.ts CLAUDE.md docs/verification-protocol.md docs/loop/02-ORGANISATION-RESEARCH.md scripts/gates.json
git commit -m "uk law: the all-in cost of one hire (pay, employer NI after the allowance, the pension minimum) (gate uk-law-employer-cost)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 8: Business rates (England)

`bill = RV x m(RV) x (1 - f(RV))` for a rateable value under 500,000 (above it a higher multiplier applies; the function
refuses rather than guesses). `m` is 38.2p (retail, hospitality and leisure) or 43.2p below 51,000, and 43p or 48p from
51,000. Small business relief `f` is 1 up to 12,000, `(15,000 - RV) / 3,000` between, 0 from 15,000: continuous, so the
bill at 12,001 is 1.53. The multiplier is not continuous: one pound of value at 51,000 adds about 2,448 a year
(51,000 x 4.8p). That step is the law's and the profit model in plan 03 prints it as it is.

**Files:**
- Create: `src/lib/uk/law/business_rates.ts`
- Test: `tests/uk/law/business_rates.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (one `GATES` entry)
- Modify (generated by counts.ts): `CLAUDE.md`, `docs/verification-protocol.md`, `docs/loop/02-ORGANISATION-RESEARCH.md`, `scripts/gates.json`

- [ ] **Step 1: Write the failing test**

Create `tests/uk/law/business_rates.test.ts`:

```ts
/**
 * Business rates 2026-27 (England): multipliers, the small business relief taper, the 51,000 cliff.
 *
 * Run: npx tsx tests/uk/law/business_rates.test.ts
 */
import { businessRates } from "../../../src/lib/uk/law/business_rates";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-business-rates";
const FILE = "src/lib/uk/law/business_rates.ts";
const REMEDY = "fix business_rates.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

const cafe = businessRates({ rateableValue: 13_500, retailHospitalityLeisure: true });
check("cafe, RV 13,500: 5,157.00 before relief, half off, 2,578.50", cafe.gross === 5157 && cafe.reliefFraction === 0.5 && cafe.bill === 2578.5);
check("RV 12,000 pays nothing", businessRates({ rateableValue: 12_000, retailHospitalityLeisure: true }).bill === 0);
check("RV 14,000, not retail: 6,048.00 less a third, 4,032.00", businessRates({ rateableValue: 14_000, retailHospitalityLeisure: false }).bill === 4032);
check("RV 15,000, not retail: no relief, 6,480.00", businessRates({ rateableValue: 15_000, retailHospitalityLeisure: false }).bill === 6480);
check("RV 25,000 retail: 9,550.00", businessRates({ rateableValue: 25_000, retailHospitalityLeisure: true }).bill === 9550);
check("RV 60,000 retail: 43p, 25,800.00", businessRates({ rateableValue: 60_000, retailHospitalityLeisure: true }).bill === 25_800);
check("relief taper continuous at 12,000 and 15,000 (1.53 at 12,001)", businessRates({ rateableValue: 12_001, retailHospitalityLeisure: true }).bill === 1.53 && businessRates({ rateableValue: 14_999, retailHospitalityLeisure: true }).bill > 5_725);
const below = businessRates({ rateableValue: 50_999, retailHospitalityLeisure: true }).bill;
const at = businessRates({ rateableValue: 51_000, retailHospitalityLeisure: true }).bill;
check("the cliff at 51,000 is the law's: about 2,448 more for one pound of value", Math.abs(at - below - 2448.38) < 0.02);
check("no relief when not eligible (a second property)", businessRates({ rateableValue: 10_000, retailHospitalityLeisure: true, smallBusinessReliefEligible: false }).bill === 3820);
let threw = false;
try { businessRates({ rateableValue: 600_000, retailHospitalityLeisure: false }); } catch { threw = true; }
check("a value above 500,000 is refused, not guessed", threw);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/business_rates: all pass");
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npx tsx tests/uk/law/business_rates.test.ts
```

Expected: exit code 1 with `Error: Cannot find module '../../../src/lib/uk/law/business_rates'`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/uk/law/business_rates.ts`:

```ts
/**
 * src/lib/uk/law/business_rates.ts
 *
 * A year's business rates in England, 2026-27, for one property with rateable value RV under 500,000:
 *
 *   multiplier m(RV)  = 38.2p (retail, hospitality, leisure) or 43.2p (other), when RV < 51,000
 *                     = 43p (retail, hospitality, leisure) or 48p (other), from 51,000
 *   gross             = RV x m(RV)
 *   relief fraction f = 1 when RV <= 12,000; (15,000 - RV) / 3,000 when 12,000 < RV < 15,000; 0 from 15,000
 *                       (small business rate relief, one property, the business's only one)
 *   bill              = gross x (1 - f)
 *
 * f is continuous (1 at 12,000, 0 at 15,000). The multiplier is NOT: at 51,000 the bill steps up by RV x 4.8p for retail,
 * hospitality and leisure (2,448 pounds at exactly 51,000) and by 4.8p for others. That cliff is the law's, printed as it is.
 * Transitional relief, the London supplement (above 75,000) and empty-property rules are out of scope (stated).
 */
import { UK_2026_27 as L } from "./params_2026_27";
import { pennies } from "./money";

export type RatesBill = { multiplier: number; gross: number; reliefFraction: number; relief: number; bill: number };

export function businessRates(input: { rateableValue: number; retailHospitalityLeisure: boolean; smallBusinessReliefEligible?: boolean }): RatesBill {
  const b = L.businessRates;
  const rv = input.rateableValue;
  if (!(rv >= 0) || rv >= b.highValueThreshold) throw new Error(`businessRates: rateable value out of scope (${rv})`);
  const small = rv < b.smallThreshold;
  const multiplier = input.retailHospitalityLeisure ? (small ? b.rhlSmallMultiplier : b.rhlStandardMultiplier) : small ? b.smallMultiplier : b.standardMultiplier;
  const gross = pennies(rv * multiplier);
  const eligible = input.smallBusinessReliefEligible ?? true;
  const reliefFraction = !eligible ? 0 : rv <= b.sbrrFullUpTo ? 1 : rv < b.sbrrNoneFrom ? (b.sbrrNoneFrom - rv) / (b.sbrrNoneFrom - b.sbrrFullUpTo) : 0;
  const relief = pennies(gross * reliefFraction);
  return { multiplier, gross, reliefFraction, relief, bill: pennies(gross - relief) };
}
```

- [ ] **Step 4: Run it and watch it pass**

```bash
npx tsx tests/uk/law/business_rates.test.ts
```

Expected: 10 lines starting `PASS`, the last line `uk/law/business_rates: all pass`, exit code 0.

- [ ] **Step 5: Wire it into the chain**

In `scripts/prebuild_all.ts`, find this line in `GATES`:

```ts
  { name: "uk-law-employer-cost", script: "tests/uk/law/employer_cost.test.ts" },
```

and add directly below it:

```ts
  { name: "uk-law-business-rates", script: "tests/uk/law/business_rates.test.ts" },
```

Then run:

```bash
npx tsx scripts/counts.ts --write
```

Expected: one line beginning `[counts] wrote 3 carrier(s) and scripts/gates.json:` whose gate count is one higher than before this step.

- [ ] **Step 6: Prove the gate runs in the chain and the ratchet holds**

```bash
npx tsx scripts/prebuild_all.ts --only=uk-law-business-rates
```

Expected: a line `✓ uk-law-business-rates` and, at the end, `SUBSET: PASS (not the chain; run without --only for the gate)`.

```bash
node scripts/audit_gate_reds.mjs
```

Expected: the last line starts `gate reds: PASS` and ends `the ratchet holds` (the three counts equal the baseline in `scripts/gate_reds_baseline.json`; a new test must not raise them).

- [ ] **Step 7: Commit**

```bash
git add src/lib/uk/law/business_rates.ts tests/uk/law/business_rates.test.ts scripts/prebuild_all.ts CLAUDE.md docs/verification-protocol.md docs/loop/02-ORGANISATION-RESEARCH.md scripts/gates.json
git commit -m "uk law: business rates 2026-27 with small business relief and the multiplier step at 51,000 (gate uk-law-business-rates)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 9: Tax on a lease's rent

`NPV = sum_{i=1..n} r_i / 1.035^i`, where the rent of every year after the fifth is taken as the highest rent of the first
five (the rule that stops a lease back-loading its rent to dodge the tax). SDLT on that NPV: 0% to 150,000, 1% to 5,000,000,
2% above; Land Transaction Tax in Wales: 0% to 225,000, 1% to 2,000,000, 2% above. Worked: 25,000 a year for ten years is an
NPV of 207,915.13 and 579.15 of SDLT; the same rent for five years (112,876.31) pays nothing.

**Files:**
- Create: `src/lib/uk/law/lease_tax.ts`
- Test: `tests/uk/law/lease_tax.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (one `GATES` entry)
- Modify (generated by counts.ts): `CLAUDE.md`, `docs/verification-protocol.md`, `docs/loop/02-ORGANISATION-RESEARCH.md`, `scripts/gates.json`

- [ ] **Step 1: Write the failing test**

Create `tests/uk/law/lease_tax.test.ts`:

```ts
/**
 * Tax on a lease's rent: NPV at 3.5%, the highest-of-the-first-five rule, SDLT and LTT bands.
 *
 * Run: npx tsx tests/uk/law/lease_tax.test.ts
 */
import { leaseRentNpv, sdltOnLeaseRent, lttOnLeaseRent } from "../../../src/lib/uk/law/lease_tax";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-lease-tax";
const FILE = "src/lib/uk/law/lease_tax.ts";
const REMEDY = "fix lease_tax.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};
const years = (n: number, rent: number) => Array.from({ length: n }, () => rent);

check("25,000 for 5 years: NPV 112,876.31", leaseRentNpv(years(5, 25_000)) === 112_876.31);
check("no SDLT on it", sdltOnLeaseRent(112_876.31) === 0);
check("25,000 for 10 years: NPV 207,915.13", leaseRentNpv(years(10, 25_000)) === 207_915.13);
check("SDLT 579.15", sdltOnLeaseRent(207_915.13) === 579.15);
check("LTT in Wales: nothing (nil band to 225,000)", lttOnLeaseRent(207_915.13) === 0);
check("15 years: NPV 287,935.27, SDLT 1,379.35, LTT 629.35", leaseRentNpv(years(15, 25_000)) === 287_935.27 && sdltOnLeaseRent(287_935.27) === 1379.35 && lttOnLeaseRent(287_935.27) === 629.35);
check("half the first year rent-free: NPV 195,837.84, SDLT 458.38", leaseRentNpv([12_500, ...years(9, 25_000)]) === 195_837.84 && sdltOnLeaseRent(195_837.84) === 458.38);
check("years after the fifth take the highest of the first five", leaseRentNpv([20_000, 20_000, 20_000, 25_000, 25_000, 0, 0, 0, 0, 0]) === 193_906.95);
check("an empty lease has no NPV", leaseRentNpv([]) === 0);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/lease_tax: all pass");
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npx tsx tests/uk/law/lease_tax.test.ts
```

Expected: exit code 1 with `Error: Cannot find module '../../../src/lib/uk/law/lease_tax'`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/uk/law/lease_tax.ts`:

```ts
/**
 * src/lib/uk/law/lease_tax.ts
 *
 * Tax on the rent of a new non-residential lease: SDLT in England (and Northern Ireland), LTT in Wales.
 *
 *   NPV = sum over years i = 1..n of r_i / (1 + 3.5%)^i
 * where r_i is the rent payable for year i, except that every year after the fifth takes the highest rent of the first five
 * (the rule HMRC's own calculator applies). VAT on the rent is part of the rent when the landlord has opted to tax.
 * Then the tax is banded on the NPV: SDLT 0% to 150,000, 1% to 5,000,000, 2% above; LTT 0% to 225,000, 1% to 2,000,000,
 * 2% above. A lease premium is taxed separately and is out of scope here.
 *
 * Worked (tests): 25,000 a year for 10 years, NPV 207,915.13, SDLT 579.15; for 5 years, NPV 112,876.31, no SDLT.
 */
import { UK_2026_27 as L } from "./params_2026_27";
import { bandedTax, pennies } from "./money";

export function leaseRentNpv(yearlyRents: readonly number[]): number {
  const t = L.leaseRentTax;
  if (yearlyRents.length === 0) return 0;
  const early = yearlyRents.slice(0, t.yearsBeforeHighestRule);
  const highest = Math.max(...early);
  let npv = 0;
  yearlyRents.forEach((r, i) => {
    const rent = i < t.yearsBeforeHighestRule ? r : highest;
    npv += rent / Math.pow(1 + t.discountRate, i + 1);
  });
  return pennies(npv);
}

export function sdltOnLeaseRent(npv: number): number {
  return bandedTax(npv, L.leaseRentTax.sdlt);
}

export function lttOnLeaseRent(npv: number): number {
  return bandedTax(npv, L.leaseRentTax.ltt);
}
```

- [ ] **Step 4: Run it and watch it pass**

```bash
npx tsx tests/uk/law/lease_tax.test.ts
```

Expected: 9 lines starting `PASS`, the last line `uk/law/lease_tax: all pass`, exit code 0.

- [ ] **Step 5: Wire it into the chain**

In `scripts/prebuild_all.ts`, find this line in `GATES`:

```ts
  { name: "uk-law-business-rates", script: "tests/uk/law/business_rates.test.ts" },
```

and add directly below it:

```ts
  { name: "uk-law-lease-tax", script: "tests/uk/law/lease_tax.test.ts" },
```

Then run:

```bash
npx tsx scripts/counts.ts --write
```

Expected: one line beginning `[counts] wrote 3 carrier(s) and scripts/gates.json:` whose gate count is one higher than before this step.

- [ ] **Step 6: Prove the gate runs in the chain and the ratchet holds**

```bash
npx tsx scripts/prebuild_all.ts --only=uk-law-lease-tax
```

Expected: a line `✓ uk-law-lease-tax` and, at the end, `SUBSET: PASS (not the chain; run without --only for the gate)`.

```bash
node scripts/audit_gate_reds.mjs
```

Expected: the last line starts `gate reds: PASS` and ends `the ratchet holds` (the three counts equal the baseline in `scripts/gate_reds_baseline.json`; a new test must not raise them).

- [ ] **Step 7: Commit**

```bash
git add src/lib/uk/law/lease_tax.ts tests/uk/law/lease_tax.test.ts scripts/prebuild_all.ts CLAUDE.md docs/verification-protocol.md docs/loop/02-ORGANISATION-RESEARCH.md scripts/gates.json
git commit -m "uk law: SDLT and Welsh LTT on a lease's rent, the NPV with the highest-of-the-first-five rule (gate uk-law-lease-tax)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 10: Redundancy pay and notice

Two whole years of service are needed. Counting back from the dismissal, each of the last (up to) 20 whole years earns half a
week's pay if the employee was under 22 throughout it, one week from 22 to 40, one and a half from 41; the k-th most recent
year is held at age `ageAtDismissal - 1 - k`. A week's pay is capped at 751, so the most anyone receives is 30 x 751 =
22,530. Statutory notice: none under a month of service, one week up to two years, then a week per whole year up to twelve.

**Files:**
- Create: `src/lib/uk/law/redundancy.ts`
- Test: `tests/uk/law/redundancy.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (one `GATES` entry)
- Modify (generated by counts.ts): `CLAUDE.md`, `docs/verification-protocol.md`, `docs/loop/02-ORGANISATION-RESEARCH.md`, `scripts/gates.json`

- [ ] **Step 1: Write the failing test**

Create `tests/uk/law/redundancy.test.ts`:

```ts
/**
 * Statutory redundancy pay and notice (Employment Rights Act 1996 ss. 86 and 162; the weekly cap of 2026-27).
 *
 * Run: npx tsx tests/uk/law/redundancy.test.ts
 */
import { statutoryRedundancyPay, statutoryNoticeWeeks } from "../../../src/lib/uk/law/redundancy";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-redundancy";
const FILE = "src/lib/uk/law/redundancy.ts";
const REMEDY = "fix redundancy.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

check("barber, 30, four years, 500 a week: 2,000.00", statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 4, weeklyPay: 500 }).pay === 2000);
check("same on 800 a week: the cap of 751 gives 3,004.00", statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 4, weeklyPay: 800 }).pay === 3004);
check("62, 25 years, 900 a week: the most anyone gets, 22,530.00", statutoryRedundancyPay({ ageAtDismissal: 62, wholeYears: 25, weeklyPay: 900 }).pay === 22_530);
check("23, three years, 400: two weeks (one year at 22, two under 22) = 800.00", statutoryRedundancyPay({ ageAtDismissal: 23, wholeYears: 3, weeklyPay: 400 }).pay === 800);
check("45, ten years, 600: twelve weeks = 7,200.00", statutoryRedundancyPay({ ageAtDismissal: 45, wholeYears: 10, weeklyPay: 600 }).pay === 7200);
check("under two years: nothing", statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 1, weeklyPay: 500 }).pay === 0);
check("notice: none under a month, one week to two years, a week a year to twelve", [0.5, 12, 24, 60, 200].map(statutoryNoticeWeeks).join(",") === "0,1,2,5,12");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/redundancy: all pass");
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npx tsx tests/uk/law/redundancy.test.ts
```

Expected: exit code 1 with `Error: Cannot find module '../../../src/lib/uk/law/redundancy'`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/uk/law/redundancy.ts`:

```ts
/**
 * src/lib/uk/law/redundancy.ts
 *
 * Statutory redundancy pay and statutory notice (Employment Rights Act 1996, ss 86, 162), from 6 April 2026.
 *
 * REDUNDANCY. Two whole years of service needed. Counting back from the dismissal, each of the last (up to) 20 whole years
 * earns weeks of pay by the age held throughout that year: 0.5 below 22, 1 from 22 to 40, 1.5 from 41. With integer ages,
 * the k-th most recent year (k = 0, 1, ...) is held at age (ageAtDismissal - 1 - k) throughout. A week's pay is capped at
 * 751, so the most anyone can get is 30 x 751 = 22,530.
 *
 * NOTICE (the employer's minimum): none under a month; one week from a month to two years; then a week per whole year, up
 * to twelve.
 */
import { UK_2026_27 as L } from "./params_2026_27";
import { pennies } from "./money";

export function statutoryRedundancyPay(input: { ageAtDismissal: number; wholeYears: number; weeklyPay: number }): { weeks: number; weeklyPayUsed: number; pay: number } {
  const r = L.redundancy;
  const weeklyPayUsed = Math.min(input.weeklyPay, r.weeklyPayCap);
  if (input.wholeYears < r.minYears) return { weeks: 0, weeklyPayUsed, pay: 0 };
  let weeks = 0;
  for (let k = 0; k < Math.min(input.wholeYears, r.maxYears); k++) {
    const age = input.ageAtDismissal - 1 - k;
    weeks += age < 22 ? r.weeksUnder22 : age < 41 ? r.weeks22To40 : r.weeks41Plus;
  }
  return { weeks, weeklyPayUsed, pay: pennies(weeks * weeklyPayUsed) };
}

export function statutoryNoticeWeeks(monthsOfService: number): number {
  if (monthsOfService < 1) return 0;
  if (monthsOfService < 24) return 1;
  return Math.min(12, Math.floor(monthsOfService / 12));
}
```

- [ ] **Step 4: Run it and watch it pass**

```bash
npx tsx tests/uk/law/redundancy.test.ts
```

Expected: 7 lines starting `PASS`, the last line `uk/law/redundancy: all pass`, exit code 0.

- [ ] **Step 5: Wire it into the chain**

In `scripts/prebuild_all.ts`, find this line in `GATES`:

```ts
  { name: "uk-law-lease-tax", script: "tests/uk/law/lease_tax.test.ts" },
```

and add directly below it:

```ts
  { name: "uk-law-redundancy", script: "tests/uk/law/redundancy.test.ts" },
```

Then run:

```bash
npx tsx scripts/counts.ts --write
```

Expected: one line beginning `[counts] wrote 3 carrier(s) and scripts/gates.json:` whose gate count is one higher than before this step.

- [ ] **Step 6: Prove the gate runs in the chain and the ratchet holds**

```bash
npx tsx scripts/prebuild_all.ts --only=uk-law-redundancy
```

Expected: a line `✓ uk-law-redundancy` and, at the end, `SUBSET: PASS (not the chain; run without --only for the gate)`.

```bash
node scripts/audit_gate_reds.mjs
```

Expected: the last line starts `gate reds: PASS` and ends `the ratchet holds` (the three counts equal the baseline in `scripts/gate_reds_baseline.json`; a new test must not raise them).

- [ ] **Step 7: Commit**

```bash
git add src/lib/uk/law/redundancy.ts tests/uk/law/redundancy.test.ts scripts/prebuild_all.ts CLAUDE.md docs/verification-protocol.md docs/loop/02-ORGANISATION-RESEARCH.md scripts/gates.json
git commit -m "uk law: statutory redundancy pay and notice (gate uk-law-redundancy)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 11: Loan repayments

A loan of A at an annual rate R over n months repays `A r / (1 - (1 + r)^-n)` a month, `r = R / 12`; at R = 0 it is A / n.
Worked: 25,000 at 7.5% over 60 months is 500.95 a month, 30,056.92 repaid, 5,056.92 of interest. The country page's
start-up loan lever computes the same thing today; this moves it into the law engine where the rest of the money is.

**Files:**
- Create: `src/lib/uk/law/loan.ts`
- Test: `tests/uk/law/loan.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (one `GATES` entry)
- Modify (generated by counts.ts): `CLAUDE.md`, `docs/verification-protocol.md`, `docs/loop/02-ORGANISATION-RESEARCH.md`, `scripts/gates.json`

- [ ] **Step 1: Write the failing test**

Create `tests/uk/law/loan.test.ts`:

```ts
/**
 * The repayment of a fixed-rate loan (the annuity formula), to the penny.
 *
 * Run: npx tsx tests/uk/law/loan.test.ts
 */
import { annuity } from "../../../src/lib/uk/law/loan";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-loan";
const FILE = "src/lib/uk/law/loan.ts";
const REMEDY = "fix loan.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

const loan = annuity({ principal: 25_000, annualRatePct: 7.5, months: 60 });
check("25,000 at 7.5% over five years: 500.95 a month", loan.monthly === 500.95);
check("30,056.92 repaid in all, 5,056.92 of interest", loan.totalRepaid === 30_056.92 && loan.interest === 5056.92);
check("no interest: the principal over the months", annuity({ principal: 12_000, annualRatePct: 0, months: 24 }).monthly === 500);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/loan: all pass");
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npx tsx tests/uk/law/loan.test.ts
```

Expected: exit code 1 with `Error: Cannot find module '../../../src/lib/uk/law/loan'`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/uk/law/loan.ts`:

```ts
/**
 * src/lib/uk/law/loan.ts
 *
 * The repayment of a fixed-rate loan repaid monthly over n months (an annuity):
 *   payment = A x r / (1 - (1 + r)^-n),   r = annual rate / 12;   payment = A / n when r = 0.
 * Derivation: the present value of n payments of size x at rate r is x (1 - (1 + r)^-n) / r; set it equal to A.
 * The total repaid is n x the exact payment, rounded once (a lender's schedule rounds each payment and settles the pennies
 * in the last one; the difference is under a pound over five years).
 */
import { pennies } from "./money";

export function annuity(input: { principal: number; annualRatePct: number; months: number }): { monthly: number; totalRepaid: number; interest: number } {
  const { principal: A, annualRatePct, months: n } = input;
  if (!(A >= 0) || !(n >= 1)) throw new Error("annuity: principal >= 0 and at least one month");
  const r = annualRatePct / 100 / 12;
  const exact = r === 0 ? A / n : (A * r) / (1 - Math.pow(1 + r, -n));
  const totalRepaid = pennies(exact * n);
  return { monthly: pennies(exact), totalRepaid, interest: pennies(totalRepaid - A) };
}
```

- [ ] **Step 4: Run it and watch it pass**

```bash
npx tsx tests/uk/law/loan.test.ts
```

Expected: 3 lines starting `PASS`, the last line `uk/law/loan: all pass`, exit code 0.

- [ ] **Step 5: Wire it into the chain**

In `scripts/prebuild_all.ts`, find this line in `GATES`:

```ts
  { name: "uk-law-redundancy", script: "tests/uk/law/redundancy.test.ts" },
```

and add directly below it:

```ts
  { name: "uk-law-loan", script: "tests/uk/law/loan.test.ts" },
```

Then run:

```bash
npx tsx scripts/counts.ts --write
```

Expected: one line beginning `[counts] wrote 3 carrier(s) and scripts/gates.json:` whose gate count is one higher than before this step.

- [ ] **Step 6: Prove the gate runs in the chain and the ratchet holds**

```bash
npx tsx scripts/prebuild_all.ts --only=uk-law-loan
```

Expected: a line `✓ uk-law-loan` and, at the end, `SUBSET: PASS (not the chain; run without --only for the gate)`.

```bash
node scripts/audit_gate_reds.mjs
```

Expected: the last line starts `gate reds: PASS` and ends `the ratchet holds` (the three counts equal the baseline in `scripts/gate_reds_baseline.json`; a new test must not raise them).

- [ ] **Step 7: Commit**

```bash
git add src/lib/uk/law/loan.ts tests/uk/law/loan.test.ts scripts/prebuild_all.ts CLAUDE.md docs/verification-protocol.md docs/loop/02-ORGANISATION-RESEARCH.md scripts/gates.json
git commit -m "uk law: the annuity repayment of a fixed-rate loan, to the penny (gate uk-law-loan)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 12: Prove the whole engine

**Files:** none changed.

- [ ] **Step 1: Run the ten law gates through the chain runner**

```bash
npx tsx scripts/prebuild_all.ts --only=uk-law-money,uk-law-income-tax,uk-law-national-insurance,uk-law-corporation-tax,uk-law-take-home,uk-law-employer-cost,uk-law-business-rates,uk-law-lease-tax,uk-law-redundancy,uk-law-loan
```

Expected: ten lines starting `✓ uk-law-`, `Passed: 10`, `Failed: 0`, and `SUBSET: PASS (not the chain; run without --only for the gate)`.

- [ ] **Step 2: Typecheck the repository**

```bash
npx tsc --noEmit
```

Expected: no output, exit code 0.

- [ ] **Step 3: Run the static gates that read `src/`**

```bash
npx tsx scripts/prebuild_all.ts --only=no-em-dashes,no-source-agencies,take-home-identity,gate-reds-ratchet,counts-fresh
```

Expected: five `✓` lines and `SUBSET: PASS`. `take-home-identity` does not list the new modules: they compute tax on a profit
and never derive a take-home from a margin (none of its derive signals appears in them, checked on 2026-10-02).

- [ ] **Step 4: Record the result**

No commit: tasks 2 to 11 each committed. Report the three outputs above to the controlling session.
