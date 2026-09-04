/**
 * STORIES for the archetypes: the same component drawn across an instance set
 * chosen FROM THE DATA, never typed, so the harness and the founder see the
 * exemplar, the data-poor cases, the extreme names and one country per
 * profile tier on one page. Widths are the harness's business.
 */
import * as React from "react";
import { COUNTRIES } from "@/lib/taxonomy";
import { getCountryProfile } from "@/lib/economic_profile";
import { buildHeroFacts, type HeroFacts } from "@/lib/spine/hero_facts";
import { AnswerCard } from "./AnswerCard";

export type Instance = { iso2: string; why: string };

/** The instance set for the answer card, derived from the data. */
export function pickAnswerCardInstances(): Instance[] {
  const codes = (COUNTRIES as any[]).map((c) => String(c.code ?? c.iso2 ?? "").toUpperCase()).filter((c) => c.length === 2);
  const facts = codes.map((c) => ({ c, f: buildHeroFacts(c) })).filter((x) => x.f.answer || x.f.cells.length > 0);
  const out: Instance[] = [{ iso2: "GB", why: "the exemplar" }];
  const seen = new Set(["GB"]);
  const take = (iso2: string, why: string) => { if (!seen.has(iso2)) { seen.add(iso2); out.push({ iso2, why }); } };
  // data-poor: the fewest resolved cells, then the fewest with no answer
  [...facts].sort((a, b) => (a.f.cells.length + (a.f.answer ? 1 : 0)) - (b.f.cells.length + (b.f.answer ? 1 : 0))).slice(0, 3).forEach((x) => take(x.c, `data-poor: ${x.f.cells.length} cells${x.f.answer ? "" : ", no answer"}`));
  // extreme names: the longest country names and regime names
  [...facts].sort((a, b) => (b.f.name.length + (b.f.answer?.regime?.length ?? 0)) - (a.f.name.length + (a.f.answer?.regime?.length ?? 0))).slice(0, 3).forEach((x) => take(x.c, "extreme name"));
  // one per profile tier
  for (const tier of ["A", "B", "C"] as const) {
    const hit = facts.find((x) => { const p = getCountryProfile(x.c); return p.iso2.toUpperCase() === x.c && p.tier === tier && !seen.has(x.c); });
    if (hit) take(hit.c, `profile tier ${tier}`);
  }
  return out;
}

export function AnswerCardStory({ facts, why }: { facts: HeroFacts; why: string }) {
  return (
    <section data-story={facts.iso2} className="mb-12">
      <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{facts.iso2}, {why}</div>
      <AnswerCard id={`take-${facts.iso2.toLowerCase()}`} name={facts.name} iso2={facts.iso2} subtitle={facts.subtitle} answer={facts.answer} cells={facts.cells} />
    </section>
  );
}

export function AnswerCardStories({ instances = pickAnswerCardInstances() }: { instances?: Instance[] }) {
  return (
    <div data-stories="answer-card">
      {instances.map((i) => (
        <AnswerCardStory key={i.iso2} facts={buildHeroFacts(i.iso2)} why={i.why} />
      ))}
    </div>
  );
}
