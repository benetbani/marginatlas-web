/**
 * scripts/verify_gate_conflicts.ts , no two gates may disagree about one string.
 *
 * WHY IT EXISTS (plan-2026-09-17/02-ERRORS.md, step 15). With 141 gates, the
 * only way to learn that two of them contradict each other was for one to fail
 * after the other had been satisfied: the archetype-copy gate once REQUIRED the
 * literal `x1.00` on a peers row while the model-laws-copy gate BANNED it as a
 * whole cell, and a page could only ever pass one of them. Neither gate was
 * wrong about its own rule; the disagreement lived between two files nobody
 * read side by side.
 *
 * WHAT IT READS. `scripts/gates.json`, the registry `scripts/counts.ts --write`
 * generates from the GATES array and the gate scripts themselves. Every entry
 * carries `claims`: what the gate bans and what it requires, each tagged
 * `declared` (a `gate-claims: bans "x"; requires "y"` line in the script's
 * header) or `inferred` (a direct string element of a list named BANNED,
 * FORBIDDEN or NEVER in its code). This reds when one gate bans a literal that
 * a different gate requires, and prints the pair, both files, the string and
 * the remedy.
 *
 * WHAT IT CANNOT SEE, said plainly so a green here is read for what it is. A
 * gate that neither declares nor holds a ban-named list has `claims: []` and is
 * invisible to this check: today that is most of the chain, and the PASS line
 * prints how many, so "no conflicts" is never mistaken for "no disagreement".
 * Only `requires` claims are ever declared (nothing infers a requirement), so
 * a conflict needs at least one gate that wrote its claim down. It compares
 * literal strings exactly: a gate banning `x1.00` and one requiring `x 1.00`
 * do not meet here. And it trusts the registry it is given; `counts-fresh`,
 * the gate before this one in the chain, is what reds when the registry is
 * stale.
 *
 * PROVED, 2026-09-17, by planting a scratch gate declaring `requires "x1.00"`
 * and watching this name it against model-laws-copy; removed after.
 *
 * Usage: npx tsx scripts/verify_gate_conflicts.ts
 */
import fs from "node:fs";

const REGISTRY = "scripts/gates.json";

type Claim = {
  kind: "bans" | "requires";
  string: string;
  source: "declared" | "inferred";
  via: string;
};

type Entry = {
  name: string;
  script: string;
  claims: Claim[];
};

type Holder = { gate: Entry; claim: Claim };

function describe(h: Holder): string {
  const how = h.claim.source === "declared" ? "declared in its header" : `inferred from its ${h.claim.via} list`;
  return `${h.gate.name} (${h.gate.script}, ${how})`;
}

function main() {
  if (!fs.existsSync(REGISTRY)) {
    console.error(`[verify_gate_conflicts] FAIL: ${REGISTRY} does not exist.`);
    console.error(`Generate it: npx tsx scripts/counts.ts --write`);
    process.exit(1);
  }
  const registry = JSON.parse(fs.readFileSync(REGISTRY, "utf8")) as { gates: Entry[] };
  const gates = registry.gates;

  const bans = new Map<string, Holder[]>();
  const requires = new Map<string, Holder[]>();
  for (const gate of gates) {
    for (const claim of gate.claims) {
      const map = claim.kind === "bans" ? bans : requires;
      const list = map.get(claim.string) ?? [];
      list.push({ gate, claim });
      map.set(claim.string, list);
    }
  }

  const conflicts: { string: string; banner: Holder; requirer: Holder }[] = [];
  for (const [string, requirers] of requires) {
    for (const requirer of requirers) {
      for (const banner of bans.get(string) ?? []) {
        if (banner.gate.name === requirer.gate.name) continue;
        conflicts.push({ string, banner, requirer });
      }
    }
  }

  const withClaims = gates.filter((g) => g.claims.length > 0).length;
  const without = gates.length - withClaims;
  const banCount = [...bans.values()].reduce((n, l) => n + l.length, 0);
  const requireCount = [...requires.values()].reduce((n, l) => n + l.length, 0);

  if (conflicts.length > 0) {
    console.error(
      `[verify_gate_conflicts] FAIL: ${conflicts.length} contradictory claim pair(s) in ${REGISTRY}`,
    );
    for (const c of conflicts) {
      console.error(
        `  "${c.string}": banned by ${describe(c.banner)} and required by ${describe(c.requirer)}`,
      );
      console.error(
        `    remedy: one of the two is wrong about \`${c.string}\`; read both headers and strike the claim that lost; the founder's newer ruling wins`,
      );
    }
    process.exit(1);
  }

  console.log(
    `[verify_gate_conflicts] PASS: no gate bans a string another requires ` +
      `(${withClaims} of ${gates.length} gates carry claims: ${banCount} bans, ${requireCount} requires; ` +
      `${without} carry no claims and are invisible to this check)`,
  );
}

main();
