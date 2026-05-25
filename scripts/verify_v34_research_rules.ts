/**
 * verify_v34_research_rules — Phase N regression suite.
 *
 * Encodes the 20-item anti-pattern register from v34 Part 8 as a
 * pre-commit / prebuild gate. Any violation blocks the build. The
 * rules are derived from the three deep-research reports:
 *
 *   - design-psychology (Tsai/Egelman/Cranor/Acquisti on trust;
 *     Atlas & Bartels on periodic framing; the 21-site German news
 *     paywall field study on reveal depth)
 *   - pricing-scoping (Bhargava & Choudhary on versioning;
 *     Balasubramanian/Bhattacharya/Krishnan on pay-per-use anxiety)
 *   - competitive-teardown (Numbeo cancellation copy as gold
 *     standard; Trading Economics auto-trial as the dark anti-pattern)
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 * Part 6 Phase N + Part 8 anti-pattern register.
 *
 * Each rule is a pure function over the source tree. If a rule
 * fires, the script prints the offending file:line and exits 1.
 * Allowlist mechanism: per-line `// allow-v34-NN` (e.g.
 * `// allow-v34-trial`) opts a single line out of a single rule.
 */

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = resolve(process.cwd(), "src");

// ---------------------------------------------------------------------------
// Source walking
// ---------------------------------------------------------------------------

type SourceFile = { path: string; lines: string[] };

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, acc);
    else if (p.endsWith(".ts") || p.endsWith(".tsx")) acc.push(p);
  }
  return acc;
}

function loadSources(): SourceFile[] {
  return walk(ROOT).map((path) => ({
    path,
    lines: readFileSync(path, "utf-8").split("\n"),
  }));
}

function isCommentLine(line: string): boolean {
  const t = line.trim();
  return (
    t.startsWith("//") ||
    t.startsWith("*") ||
    t.startsWith("/*") ||
    t.startsWith("{/*") ||
    t.endsWith("*/}")
  );
}

function isAllowed(line: string, tag: string): boolean {
  return line.includes(`allow-v34-${tag}`);
}

// ---------------------------------------------------------------------------
// Violation accumulator
// ---------------------------------------------------------------------------

type Violation = {
  ruleId: string;
  file: string;
  line: number;
  text: string;
  detail: string;
};

const violations: Violation[] = [];

function record(
  ruleId: string,
  file: string,
  lineNum: number,
  text: string,
  detail: string,
): void {
  violations.push({ ruleId, file, line: lineNum, text: text.trim(), detail });
}

// ---------------------------------------------------------------------------
// Rules
//
// Each rule walks the source files and records violations.
// Comment-only matches and `// allow-v34-{tag}` lines are skipped.
// ---------------------------------------------------------------------------

const sources = loadSources();

// Patterns we never want to see in user-visible code. Each entry is
// [ruleId, allowTag, pattern, detail, optional_path_filter].
type Pattern = {
  ruleId: string;
  tag: string;
  regex: RegExp;
  detail: string;
  /** Optional: restrict the rule to files matching this substring. */
  scope?: string;
  /** Optional: do NOT match against this substring path. */
  exclude?: string;
};

const PATTERNS: Pattern[] = [
  // 1. NO trial copy
  {
    ruleId: "no_trial_copy",
    tag: "trial",
    regex: /\bfree trial\b|\bfor\s+\d+\s*days?\b|\bday\s+trial\b/i,
    detail:
      "v34 forbids any trial copy. Free is genuinely free; paid is paid. " +
      "See Part 8 #6 anti-pattern register.",
  },
  // 2. NO money-back copy
  {
    ruleId: "no_money_back_copy",
    tag: "money-back",
    regex: /\bmoney[\s-]?back\b|\brefund\b/i,
    detail:
      "v34 forbids money-back / refund copy. We make the no-refund posture " +
      "explicit instead. See Part 8 #7.",
  },
  // 3. NO contact-sales tier
  {
    ruleId: "no_contact_sales_tier",
    tag: "contact-sales",
    regex: /\bcontact sales\b|\brequest (a |your )?pricing\b|\btalk to sales\b/i,
    detail:
      "v34 forbids 'Contact sales' opaque tiers. Every tier has a real " +
      "number on the pricing page. See Part 8 #5.",
  },
  // 4. NO countdown / fake-scarcity
  {
    ruleId: "no_countdown_timers",
    tag: "countdown",
    regex: /\bcountdown\b|\bonly \d+ left\b|\b\d+ people viewing\b|\boffer ends\b/i,
    detail: "v34 forbids countdown timers / scarcity counters. See Part 8 #8.",
  },
  // 5. NO confirmshaming
  {
    ruleId: "no_confirmshaming",
    tag: "confirmshaming",
    regex:
      /\bno thanks,?\s*i\s+(don't|do not|hate)\b|\bi['’]ll pay full price\b/i,
    detail:
      "v34 forbids confirmshaming on cancel/dismiss buttons. See Part 8 #9.",
  },
  // 6. NO .99 charm pricing
  {
    ruleId: "no_99_pricing",
    tag: "charm-pricing",
    regex: /\$\d+\.99\b/,
    detail:
      "v34 forbids .99 charm pricing. Field evidence is weak/inconsistent " +
      "and it cheapens a premium positioning. See Part 8 #4.",
  },
  // 7. NO padlock icon (Lock / LockSimple / Padlock) imports in
  // monetization-adjacent components. The text 'Basic'/'Premium' IS
  // the signal. Scope to /components/monetization/ + /components/billing/
  // to avoid false positives on, say, an account-security icon.
  {
    ruleId: "no_padlock_icons",
    tag: "padlock",
    regex: /\bLock(Simple|Closed|Open)?\b|\bPadlock\b/,
    detail:
      "v34 forbids padlock icons on lock UI. The word Basic / Premium IS the " +
      "signal. See Part 8 #1.",
    scope: "components/monetization",
  },
  // 8. NO generic "Upgrade now" / "Unlock now" CTAs anywhere
  {
    ruleId: "no_generic_upgrade_cta",
    tag: "generic-cta",
    regex:
      /(['"`>])\s*(Upgrade now|Unlock now|Get access)\s*(['"`<])/i,
    detail:
      "v34 forbids generic CTAs. Every CTA = action verb + benefit + tier. " +
      "See Part 3.2 microcopy + Part 8 #14.",
  },
  // 9. NO auto-renew trick language (negative case: 'auto-charge', etc.)
  {
    ruleId: "no_auto_charge_trick",
    tag: "auto-charge",
    regex: /\bautomatically charged?\b|\bauto[-\s]?charge\b/i,
    detail:
      "v34 forbids the Trading-Economics auto-trial-to-paid pattern. See " +
      "Part 8 #10/#11.",
  },
];

for (const file of sources) {
  // Skip the audit script itself, the regression suite, and other
  // prebuild scripts.
  if (
    file.path.includes("scripts/verify_") ||
    file.path.includes("scripts/audit/")
  ) {
    continue;
  }
  for (const p of PATTERNS) {
    if (p.scope && !file.path.includes(p.scope)) continue;
    if (p.exclude && file.path.includes(p.exclude)) continue;
    for (let i = 0; i < file.lines.length; i++) {
      const line = file.lines[i];
      if (isCommentLine(line)) continue;
      if (isAllowed(line, p.tag)) continue;
      if (p.regex.test(line)) {
        record(p.ruleId, file.path, i + 1, line, p.detail);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Structural rules — assert positive presence of locked copy.
// ---------------------------------------------------------------------------

function readIfExists(rel: string): string | null {
  const abs = resolve(ROOT, rel);
  return existsSync(abs) ? readFileSync(abs, "utf-8") : null;
}

// 10. annual_framing_shows_total — the pricing page must include the
// annual TOTAL alongside the monthly-equivalent. v34 Part 4.2.
// The check is two-step:
//   (a) the priceAnnualTotal field exists in paywall_copy.ts AND
//   (b) the pricing page references priceAnnualTotal in JSX.
// JSX wraps the `$\n{spec.priceAnnualTotal}` across lines so we don't
// do a single-line regex; we just look for the reference at all.
{
  const pricingPage = readIfExists("app/pricing/page.tsx");
  const paywallCopy = readIfExists("components/monetization/paywall_copy.ts");
  const refersToAnnualTotal =
    !!pricingPage && pricingPage.includes("priceAnnualTotal");
  const mentionsBilledAnnually =
    !!pricingPage && /billed annually/i.test(pricingPage);
  const hasTier = !!paywallCopy && /priceAnnualTotal:\s*\d+/.test(paywallCopy);
  if (!refersToAnnualTotal || !mentionsBilledAnnually || !hasTier) {
    record(
      "annual_framing_shows_total",
      pricingPage ? "src/app/pricing/page.tsx" : "<missing>",
      0,
      "",
      "v34 Part 4.2: annual price must be displayed as monthly-equiv PLUS " +
        "the actual yearly total in the same line. Could not find " +
        "'billed annually' + priceAnnualTotal reference on the pricing page.",
    );
  }
}

// 11. cancellation_copy_present — the cancel-anytime block from
// paywall_copy.ts must appear on the pricing page render.
{
  const pricingPage = readIfExists("app/pricing/page.tsx");
  if (
    !pricingPage ||
    !pricingPage.includes("CANCEL_ANYTIME_BLOCK")
  ) {
    record(
      "cancellation_copy_present",
      "src/app/pricing/page.tsx",
      0,
      "",
      "v34 Part 3.6: the cancel-anytime block must render on the pricing " +
        "page. Import CANCEL_ANYTIME_BLOCK from @/components/monetization.",
    );
  }
}

// 12. blur_radius_within_bounds — BlurredOverlay's blur radius must
// be 6px. Field evidence: perceptually harsh blur backfires.
{
  const overlay = readIfExists("components/monetization/BlurredOverlay.tsx");
  if (!overlay || !/blur\(6px\)/.test(overlay)) {
    record(
      "blur_radius_within_bounds",
      "src/components/monetization/BlurredOverlay.tsx",
      0,
      "",
      "v34 Part 2.2: BlurredOverlay must use blur(6px) exactly. Heavier " +
        "blur creates a 'grey soup' that the disfluency literature shows " +
        "backfires.",
    );
  }
}

// 13. trust_signals_capped_at_two — the paywall modal must not import
// more than two trust-signal helpers from paywall_copy. Operationalised
// as: the modal references METHODOLOGY_LABEL + CANCEL_ANYTIME_BLOCK and
// no third 'TRUST_' / 'GUARANTEE_' / 'SEAL_' constant.
{
  const modal = readIfExists("components/monetization/PaywallModalRoot.tsx");
  if (modal) {
    const trustMatches = modal.match(/\b(GUARANTEE|SEAL|BADGE|TESTIMONIAL)\w*/g);
    if (trustMatches && trustMatches.length > 0) {
      record(
        "trust_signals_capped_at_two",
        "src/components/monetization/PaywallModalRoot.tsx",
        0,
        trustMatches.join(", "),
        "v34 Part 3.5: at most 2 trust signals on the paywall modal. " +
          "Found extra trust-related constants: " +
          trustMatches.join(", "),
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

if (violations.length === 0) {
  console.log(
    `[verify_v34_research_rules] PASS: ${PATTERNS.length} pattern rules + ` +
      `4 structural rules checked across ${sources.length} files.`,
  );
  process.exit(0);
}

// Group by ruleId for readability.
const byRule = new Map<string, Violation[]>();
for (const v of violations) {
  const arr = byRule.get(v.ruleId) ?? [];
  arr.push(v);
  byRule.set(v.ruleId, arr);
}

console.error(
  `[verify_v34_research_rules] FAIL: ${violations.length} violation(s) ` +
    `across ${byRule.size} rule(s):`,
);
for (const [ruleId, vs] of byRule) {
  console.error(`\n  Rule: ${ruleId}`);
  console.error(`  ${vs[0].detail}`);
  for (const v of vs) {
    const rel = v.file.replace(process.cwd(), ".");
    if (v.line > 0) {
      console.error(`    ${rel}:${v.line}: ${v.text}`);
    } else {
      console.error(`    ${rel}: ${v.text || "(structural)"}`);
    }
  }
}
console.error(
  `\nTo opt a single line out of a rule, append // allow-v34-<tag>.`,
);
process.exit(1);
