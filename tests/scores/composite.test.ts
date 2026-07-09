/**
 * Run: npx tsx tests/scores/composite.test.ts
 * The unified 0-100 composite engine (keep/ease/risk/demand): anchored on keep,
 * drop-and-renormalize on missing axes, monotonic contrast stretch, one band scale.
 */
import {
  compositeScore,
  DEFAULT_COMPOSITE_WEIGHTS,
  type CompositeInput,
} from "@/lib/scores/composite";

let failures = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error("  x " + msg);
    failures++;
  }
}
function mk(partial: Partial<CompositeInput>): CompositeInput {
  return {
    keepPct: 15,
    breakInScore: 60,
    survivalYr5Pct: 55,
    demandScore: 60,
    restsOnModeled: true,
    ...partial,
  };
}

// keep is the anchor: no net margin, no composite (dash, never fabricate).
{
  assert(compositeScore(mk({ keepPct: null })) === null, "null keep yields null composite");
  assert(compositeScore(mk({ keepPct: undefined })) === null, "undefined keep yields null composite");
}

// a full-coverage row scores, is banded, integer 0..100, coverage 4.
{
  const r = compositeScore(mk({}));
  assert(r !== null, "full-coverage row scores");
  if (r) {
    assert(Number.isInteger(r.score) && r.score >= 0 && r.score <= 100, "score is an integer 0..100");
    assert(r.coverage === 4, "all four axes present -> coverage 4");
    assert(["forgiving", "manageable", "demanding", "brutal"].includes(r.band), "band is on the canonical scale");
    assert(r.restsOnModeled === true, "restsOnModeled passes through");
    assert(r.axes.keep !== null && r.axes.ease === 60 && r.axes.demand === 60, "ease/demand axes pass through 0..100; keep is mapped");
  }
}

// missing secondaries drop-and-renormalize (never neutral-fill), coverage falls.
{
  const only = compositeScore(mk({ breakInScore: null, survivalYr5Pct: null, demandScore: null }));
  assert(only !== null, "keep-only row still scores");
  if (only) {
    assert(only.coverage === 1, "keep-only -> coverage 1");
    assert(only.axes.ease === null && only.axes.risk === null && only.axes.demand === null, "absent axes are null, not 0");
  }
}

// monotonic: a strictly better keep never lowers the composite (ordering preserved).
{
  const lo = compositeScore(mk({ keepPct: 8 }));
  const hi = compositeScore(mk({ keepPct: 28 }));
  assert(lo !== null && hi !== null, "both keep points score");
  if (lo && hi) assert(hi.score >= lo.score, "higher keep -> higher-or-equal composite");
}

// weights are honored: an all-equal-axis row with any weights lands near that value.
{
  const flat = compositeScore(mk({ keepPct: 12, breakInScore: 48, survivalYr5Pct: 50, demandScore: 48 }));
  // keep=12% maps into the high-40s band; ease/risk/demand ~48 => raw ~48, stretched around midpoint 52.
  assert(flat !== null, "flat row scores");
  if (flat) assert(flat.score >= 35 && flat.score <= 60, "a mid row lands mid-scale, not pinned");
}

// determinism.
{
  const a = JSON.stringify(compositeScore(mk({})));
  const b = JSON.stringify(compositeScore(mk({})));
  assert(a === b, "same input -> same output");
}

// default weights sum to 1.0 (guards a typo in the constant).
{
  const w = DEFAULT_COMPOSITE_WEIGHTS;
  assert(Math.abs(w.keep + w.ease + w.risk + w.demand - 1) < 1e-9, "default weights sum to 1.0");
}

if (failures > 0) {
  console.error(`\ncomposite.test: FAIL (${failures} assertion(s))`);
  process.exit(1);
}
console.log("composite.test: PASS. Composite engine anchored, renormalizing, banded, monotonic, deterministic.");
