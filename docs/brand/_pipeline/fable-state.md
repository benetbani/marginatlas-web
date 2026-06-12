# Fable pipeline state

phase: P1
mode: autonomous run 2026-06-12 (founder away; explicit permission to overhaul page-type
  visual outlines completely; direction: more SaaS product surface, less newspaper; warm
  Atlas palette unchanged; everything lands on the branch + previews, production untouched
  until founder try)

direction-amendment (founder, 2026-06-12, verbal):
  The site should read as a modern SaaS product surface, not a static newspaper.
  Editorial bones stay; surface language modernizes: warm app ground, white cards with
  soft layered shadows, generous radii, sans UI + serif reserved for headlines/numbers,
  strong visual hierarchy, elements instantly understood. Reference set:
  docs/brand/assets/incoming/2026-06-12-saas-refresh/ (set-8; atlas-saas.css +
  atlas-system.css as SPEC, retoned to live tokens, never imported).
  Constitution amendments executed in the open per design-system.md section 17.

queue:
  - id: P1-02
    title: Stale-palette sweep (v2 components + repo-wide banned hex conform)
    status: pending
  - id: P1-03
    title: Font showcase page (3-4 serif candidates on a real business-page mock)
    status: pending
  - id: P1-05
    title: Icon + pictogram families ported (atlas-icons.js 40 / atlas-pictograms.js 64)
    status: pending
  - id: P1-04
    title: Cartographic motif kit conform (recolor public/ SVGs, atlas-pattern.css dark bg)
    status: pending
  - id: P1-06
    title: Chart grammar consolidation (dataviz+charts -> src/components/charts/)
    status: pending
  - id: P1-07
    title: Spot illustrations staged (retoned)
    status: pending
  - id: P1-08
    title: Catalog rolling (lands with each item)
    status: pending
  - id: FOUNDATION-BUG
    title: US wrong-industry bug in getCellBySlugRaw (gates cross-trade work)
    status: pending
  - id: P2-FLAGSHIP
    title: Kit primitives + flagship BUSINESS page overhaul (SaaS surface)
    status: pending
  - id: PAGE-OVERHAULS
    title: Homepage + Country + Industry visual-outline overhauls (founder-authorized)
    status: pending

done:
  - P1-01 (commit follows) Token reconciliation + SaaS surface layer. cream-75 #fbfaf7 app
    ground token; elevation retoned to warm ink layered profile (subtle/card/lift/modal) and
    exposed as Tailwind shadow-subtle/card/lift/modal; .atlas-card radius 6px -> var(--radius)
    16px (reverses 2026-05-26 "not SaaS" call per founder 2026-06-12); body off .atlas-paper
    onto the app ground; atlas-pattern dark bg conformed to ink-800; design-system.md amended
    (Article 4, cream table, section 7) in the open. Verified on dev preview: ground
    #fbfaf7, cards white 16px layered shadows. Evidence: evidence/p1/.

decisions:
  - 2026-06-12 founder: SaaS-not-newspaper surface direction; page-type overhauls fully
    authorized; founder away for hours, review pack on return.
  - 2026-06-12 founder: Mobbin subscription postponed (trigger: mobile/interaction
    research need).

notes:
  - First run creates this file. Previous chat's handoff: docs/handoff/2026-06-12-session-handoff.md.
  - Deploy: vercel deploy --yes --cwd "E:/atlas/website" (remote build runs all gates).
    No local build/prebuild/tsc without founder permission.
  - Ship = founder-gated. Nothing pushed to main this run.
  - SP3 search cascade + HP-v2 Pass A are parked on the branch; homepage overhaul should
    fold their learnings, not duplicate them.
