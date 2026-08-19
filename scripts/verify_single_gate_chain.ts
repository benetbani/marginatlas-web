/**
 * scripts/verify_single_gate_chain.ts
 *
 * THE GATE LIST EXISTS ONCE. No npm script may enumerate gate scripts itself.
 *
 * WHY, measured 2026-08-19. `package.json` carried `prebuild:serial` as a
 * hand-written `&&` chain of 43 explicit script paths, while
 * `scripts/prebuild_all.ts` held 102. So the two chains had drifted by **59
 * gates**, every one of them missing from the serial side, including
 * `verify_no_cream`, `verify_palette_membership`, `verify_take_home_identity`,
 * `verify_canonical_urls`, all 14 wired test files, and
 * `verify_no_self_referential_css_vars`, which had been added the day before.
 *
 * And nothing said so. `CLAUDE.md` describes that script as "same gates,
 * single-process (use if parallel is flaky)", which is the one situation this
 * repo actually hits: the parallel runner segfaults intermittently on Windows
 * under load, and the documented remedy quietly ran 42 percent of the chain and
 * printed nothing but passes.
 *
 * The repair was to delete the second list rather than to police it:
 * `prebuild:serial` now runs `prebuild_all.ts --concurrency=1`, so both chains
 * read the same array. This gate stops a second list from growing back, which
 * is the only failure mode left once the duplicate is gone.
 *
 * The shape of this defect is the one this repository keeps paying for: ONE
 * QUANTITY WRITTEN IN TWO PLACES WILL DISAGREE. It is the same shape as the
 * gate count stated at 78 locations in ten different values, as `parchment`
 * being `cream-300` under another name, and as the `--font-display` token that
 * referenced itself. Every instance is cheap to prevent and expensive to find.
 *
 * WHAT IT CANNOT SEE, stated: it reads `package.json` scripts only. A duplicate
 * chain living in a shell script, a CI workflow file, or a developer's muscle
 * memory is invisible here. It also cannot tell whether `prebuild_all.ts`'s own
 * array is complete; that is `verify_registry`'s kind of question, and nothing
 * currently answers it.
 */
import fs from "node:fs";

type Pkg = { scripts?: Record<string, string> };

/** A path that looks like a gate: a verifier or a wired test, run via tsx/node. */
const GATE_PATH = /(?:^|[\s&|])(?:npx\s+)?(?:tsx|node)\s+((?:scripts|tests)\/[^\s&|]+\.(?:ts|mjs|tsx))/g;

/** The one script allowed to name gate scripts, because it IS the list. */
const THE_LIST = "scripts/prebuild_all.ts";

function main() {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8")) as Pkg;
  const scripts = pkg.scripts ?? {};

  const offenders: { name: string; paths: string[] }[] = [];

  for (const [name, body] of Object.entries(scripts)) {
    const paths = [...body.matchAll(GATE_PATH)]
      .map((m) => m[1].replace(/\\/g, "/"))
      .filter((p) => p !== THE_LIST);

    /* One gate named in a one-off script is a convenience, not a second chain.
       Two or more is a list, and a list drifts. The threshold is deliberate:
       `verify:rendered` runs a single browser linter on purpose and must not be
       collateral damage. */
    if (paths.length >= 2) offenders.push({ name, paths });
  }

  if (offenders.length > 0) {
    console.error(
      `[verify_single_gate_chain] FAIL: ${offenders.length} npm script(s) enumerate gate scripts.\n`,
    );
    for (const o of offenders) {
      console.error(`  "${o.name}" names ${o.paths.length} gate scripts:`);
      for (const p of o.paths.slice(0, 6)) console.error(`    ${p}`);
      if (o.paths.length > 6) console.error(`    ... and ${o.paths.length - 6} more`);
    }
    console.error(
      `\nThe gate list lives in ${THE_LIST} and nowhere else. A second copy drifts:\n` +
        "on 2026-08-19 prebuild:serial held 43 of 102, missing cream, palette,\n" +
        "take-home identity, canonical URLs and every wired test, while CLAUDE.md\n" +
        "called it the same chain. Run the list instead: prebuild_all.ts --concurrency=1.",
    );
    process.exit(1);
  }

  const listed = (fs.readFileSync(THE_LIST, "utf8").match(/^\s*\{\s*name:\s*"/gm) ?? []).length;
  console.log(
    `[verify_single_gate_chain] PASS: the gate list exists once (${listed} gates in ${THE_LIST}); ` +
      `no npm script enumerates gates`,
  );
}

main();
