/**
 * Plan v19 Block H — "Did you know that..." surprise facts.
 *
 * Two facts per visit, picked deterministically from a curated list
 * at data/content/did_you_know_v1.json. The deterministic pick uses
 * the current hour bucket as the seed so a returning visitor inside
 * the same hour sees the same two facts, then they rotate.
 *
 * Server component — reads the JSON at module load. Zero runtime cost.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type Fact = {
  fact: string;
  category: string;
  href: string;
  linked_label: string;
};

let cached: Fact[] | undefined;

function loadFacts(): Fact[] {
  if (cached) return cached;
  try {
    const raw = readFileSync(
      resolve(process.cwd(), "data", "content", "did_you_know_v1.json"),
      "utf-8",
    );
    const parsed = JSON.parse(raw) as { facts?: Fact[] };
    cached = parsed.facts || [];
  } catch {
    cached = [];
  }
  return cached;
}

function pickTwo(facts: Fact[]): Fact[] {
  if (facts.length < 2) return facts;
  // Deterministic-per-hour seed so cache stays warm
  const hour = Math.floor(Date.now() / (1000 * 60 * 60));
  const i = hour % facts.length;
  const j = (hour * 7 + 3) % facts.length;
  if (i === j) {
    return [facts[i], facts[(j + 1) % facts.length]];
  }
  return [facts[i], facts[j]];
}

export function DidYouKnow() {
  const facts = loadFacts();
  if (facts.length === 0) return null;
  const picks = pickTwo(facts);

  return (
    <section className="py-10 md:py-14">
      <div className="text-sm md:text-base font-bold uppercase tracking-[0.12em] text-atlas-700 mb-6 md:mb-8">
        Did you know that
      </div>
      <div className="grid md:grid-cols-2 gap-5 md:gap-6">
        {picks.map((f, i) => (
          <a
            key={i}
            href={f.href}
            className="group block rounded-2xl bg-white border border-parchment hover:border-atlas-500 hover:shadow-[0_8px_24px_rgba(120,53,15,0.08)] transition-all p-6 md:p-7"
          >
            <p className="font-display text-xl md:text-2xl leading-snug text-ink-900 group-hover:text-atlas-700 transition-colors">
              {f.fact}
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-atlas-700 group-hover:text-atlas-900 font-medium border-b border-atlas-200 group-hover:border-atlas-500 pb-0.5 transition-colors">
              {f.linked_label}
              <span aria-hidden="true">→</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
