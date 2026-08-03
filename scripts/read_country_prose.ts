/**
 * scripts/read_country_prose.ts
 *
 * PRINT THE COUNTRY PAGE MODEL AS PROSE, so it can be read the way a reader
 * reads it rather than the way a compiler reads it.
 *
 * WHY THIS EXISTS. Seven real defects on this project passed TypeScript and
 * every gate in the chain and were caught only by looking at the output as
 * sentences: a chapter that printed the same figure six times, a label that
 * opened the wrong page, `favouredTrades` returning "gyms" for five districts
 * out of six, "Cafes" and "cafes" counted as two different trades, and two
 * trade labels truncated to "phone" and "repair". None of those is a type error
 * and none of them is visible in markup. They are visible in one glance at
 * prose.
 *
 * It reads the placeholder fixture, so every number it prints is illustrative.
 * It renders nothing and asserts nothing; it is an instrument for a person.
 *
 * Usage: npx tsx scripts/read_country_prose.ts
 */
import { buildCountryPage } from "../src/lib/countries/country_adapter";
import type { CountryFile } from "../src/lib/countries/country_spine2_types";
import fixture from "../fixtures/country-gb.fixture.json";

const m = buildCountryPage(fixture as unknown as CountryFile);
const out: string[] = [];
const say = (s = "") => out.push(s);

say(
  `# ${m.meta.country} (in a sentence: ${m.meta.countryInSentence}; short: ${m.meta.shortName}), ${m.meta.region}   (${m.meta.urlPath})`,
);
say();

for (const ch of m.chapters) {
  const filled = (m as unknown as Record<string, unknown>)[ch.id];
  say(`## ${ch.num}  ${ch.title}${filled == null ? "   [stated gap]" : ""}`);
  if (filled == null) {
    say();
    continue;
  }

  switch (ch.id) {
    case "hero": {
      const h = m.hero!;
      say(`   Opening a business in ${h.countryInSentence}`);
      say(`   ${h.texture ? `${h.texture.figure} ${h.texture.line}` : "(no texture line)"}`);
      say(`   ${h.headline}   ${h.headlineLabel}`);
      for (const g of h.glance) say(`   - ${g.label}: ${g.value ?? "not published"}`);
      say(`   ${h.partsLabel}: ${h.parts.map((p) => `${p.label} ${p.sharePct}%`).join(" / ")}`);
      say(`   parts add to ${h.parts.reduce((a, p) => a + p.sharePct, 0)}%, headline says ${h.headline}`);
      say(`   reviewed ${h.reviewedAt}`);
      break;
    }
    case "scorecard": {
      const s = m.scorecard!;
      say(`   midpoint: ${s.baselineLabel}`);
      for (const r of s.rows) {
        say(`   - ${r.label}${r.sub ? ` (${r.sub})` : ""}: ${r.value ?? "not published"}  [pos ${r.position}, glyph ${r.glyph}]`);
      }
      break;
    }
    case "shape": {
      for (const a of m.shape!.axes) say(`   - ${a.label} ${a.score}: ${a.note}`);
      break;
    }
    case "rules": {
      const r = m.rules!;
      let group = "";
      for (const x of r.readings) {
        if (x.group !== group) {
          group = x.group;
          say(`   [${group}]`);
        }
        say(`   - ${x.label}: ${x.value}  [pos ${x.position}${x.position >= 55 ? ", terracotta" : ""}]`);
      }
      say(`   ${r.groups} groups, ${r.readings.filter((x) => x.position >= 55).length} accented`);
      break;
    }
    case "opening": {
      const o = m.opening!;
      say(`   company registered in ${o.daysToRegister ?? "?"}, able to take money in ${o.weeksToTakeMoney ?? "?"}, ${o.cashToSetUp ?? "?"} of cash`);
      for (const s of o.steps) {
        say(`   - ${s.label}: ${s.cost ?? s.takes ?? "not published"}${s.bottleneck ? "   [sets your opening date]" : ""}`);
      }
      if (o.note) say(`   ${o.note}`);
      break;
    }
    case "licences": {
      const l = m.licences!;
      say(`   columns: ${l.kinds.join(" / ")}`);
      for (const r of l.rows) {
        say(`   - ${r.tradeName}: ${r.total} needed${r.slow.length ? `, slow on ${r.slow.join(" and ")}` : ""}`);
      }
      if (l.note) say(`   ${l.note}`);
      break;
    }
    case "marginStack": {
      const s = m.marginStack!;
      say(`   of every 100 through the till of ${s.subject}: ${s.parts.map((p) => `${p.label} ${p.sharePct}`).join(" / ")}`);
      say(`   parts add to ${s.parts.reduce((a, p) => a + p.sharePct, 0)}`);
      say(`   ${s.decidedByLabel}: ${s.decidedBy.map((p) => `${p.label} ${p.sharePct}%`).join(", ")}`);
      say(`   between them those lines take ${s.decidedByPct} of every 100`);
      say(`   owner keeps ${s.keptPct ?? "?"}%`);
      break;
    }
    case "staffCost": {
      const s = m.staffCost!;
      say(`   wage floor ${s.wageFloor ?? "?"}, employer adds ${s.employerOnCost ?? "?"} on top`);
      if (s.workedExample) {
        say(`   a ${s.workedExample.wage} hire really costs ${s.workedExample.reallyCosts}`);
      }
      say(`   overtime: ${s.overtime ?? "not published"}`);
      for (const r of s.payScale) {
        say(`   - ${r.label}: ${r.typical}${r.floor ? " (a full-time adult, no range)" : ` (${r.lo} to ${r.hi})`}`);
      }
      if (s.note) say(`   ${s.note}`);
      break;
    }
    case "staffSupply": {
      const s = m.staffSupply!;
      say(`   ${s.skilledInHundred ?? "?"} in 100 hold a degree or a skilled trade`);
      for (const r of s.rows) say(`   - ${r.label}: ${r.value}`);
      if (s.shortages.length) say(`   short of: ${s.shortages.join(", ")}`);
      if (s.note) say(`   ${s.note}`);
      break;
    }
    case "households": {
      const h = m.households!;
      if (h.split.length) {
        say(`   of every 100 a household spends: ${h.split.map((p) => `${p.label} ${p.display}`).join(" / ")}`);
      }
      for (const r of h.rows) say(`   - ${r.label}${r.sub ? ` (${r.sub})` : ""}: ${r.value}`);
      break;
    }
    case "reach": {
      const r = m.reach!;
      say(`   from ${r.origin}:`);
      for (const ring of r.rings) say(`   - ${ring.label}: ${ring.people}`);
      break;
    }
    case "tradeTakeHome": {
      const t = m.tradeTakeHome!;
      for (const r of t.rows) {
        say(`   - ${r.tradeName}: keeps ${r.ownerKeeps} on ${r.revenue}, ${r.costToOpen} to open, ${r.breakIn} to break into${r.top ? "   [keeps most]" : ""}`);
      }
      if (t.note) say(`   ${t.note}`);
      break;
    }
    case "neighbours": {
      const n = m.neighbours!;
      say(`   axes (higher is better for an owner): ${n.axes.join(" / ")}`);
      for (const r of n.rows) {
        say(`   - ${r.country}: ${r.scores.join(" / ")}${r.isThisCountry ? "   [this country]" : ""}`);
      }
      if (n.note) say(`   ${n.note}`);
      break;
    }
    case "underServed": {
      const u = m.underServed!;
      say(`   thin and moneyed: ${u.opportunity.map((o) => o.tradeName).join(", ") || "(nothing stands out)"}`);
      say(`   the rest: ${u.rest.map((o) => o.tradeName).join(", ") || "(none)"}`);
      if (u.note) say(`   ${u.note}`);
      break;
    }
    case "abroad": {
      const a = m.abroad!;
      say(`   ${a.tradeName} in ${a.here.country}: ${a.here.parts.map((p) => `${p.label} ${p.sharePct}`).join(" / ")}`);
      say(`   ${a.tradeName} in ${a.peer.country}: ${a.peer.parts.map((p) => `${p.label} ${p.sharePct}`).join(" / ")}`);
      say(`   keeps ${a.hereKeeps ?? "?"}% here against ${a.peerKeeps ?? "?"}% there`);
      if (a.note) say(`   ${a.note}`);
      break;
    }
    case "zones": {
      const z = m.zones!;
      say(`   relevant to a high-street trade: ${z.relevant ? "yes" : "no"}`);
      say(`   ${z.verdict}`);
      for (const one of z.zones) {
        say(`   - ${one.name}: ${one.effect} (${one.trades.join(", ") || "no high-street trade"})`);
      }
      break;
    }
    case "stability": {
      const s = m.stability!;
      for (const g of s.ground) say(`   - ${g.label}: ${g.word}  [strength ${g.strength}${g.costly ? ", costly" : ""}]`);
      for (const r of s.rows) say(`   - ${r.label}: ${r.value}`);
      if (s.note) say(`   ${s.note}`);
      break;
    }
    case "myth": {
      const y = m.myth!;
      say(`   claim: ${y.claim}`);
      say(`   reality: ${y.reality}`);
      if (y.note) say(`   ${y.note}`);
      say(`   panel "${y.panelLabel ?? "What the numbers say"}":`);
      for (const r of y.rows) say(`   - ${r.label}: ${r.value}`);
      break;
    }
    case "verdict": {
      say(`   ${m.verdict!.text}`);
      say(`   chips: ${m.verdict!.chips.map((c) => c.text).join(" / ")}`);
      break;
    }
    case "methodology": {
      const md = m.methodology!;
      for (const r of md.rows) say(`   - ${r.figure} [${r.tier}]: ${r.how}`);
      say(`   derived counts: ${md.counts.measured} measured, ${md.counts.built} built, ${md.counts.thin} thin`);
      break;
    }
    case "next": {
      for (const t of m.next!.tiles) {
        say(`   - ${t.label}: ${t.gloss}${t.href ? `  -> ${t.href}` : "  [no page yet]"}`);
      }
      break;
    }
    default:
      say(`   (rendered, no prose printer)`);
  }
  say();
}

if (m.remember != null) {
  say(`## the closing band`);
  say(`   ${m.remember.text}`);
  say(`   ${m.remember.figure ?? "?"}   ${m.remember.figureLabel}`);
  say();
}

say(`## the trust band`);
say(`   reviewed ${m.trust.reviewedAt}`);
say(`   ${m.trust.businesses ?? "(no business count)"} businesses, ${m.trust.tradesCovered ?? "(no)"} trades covered`);
say(
  m.trust.counts
    ? `   ${m.trust.counts.measured} measured, ${m.trust.counts.built} built, ${m.trust.counts.thin} thin`
    : "   (no method ledger)",
);
say();

const gaps = m.chapters.filter((c) => (m as unknown as Record<string, unknown>)[c.id] == null);
say(
  `${m.chapters.length - gaps.length} of ${m.chapters.length} chapters filled; ${gaps.length} stated gaps: ${gaps
    .map((g) => `${g.num} ${g.id}`)
    .join(", ")}`,
);

console.log(out.join("\n"));
