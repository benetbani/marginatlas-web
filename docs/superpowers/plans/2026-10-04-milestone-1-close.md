# Milestone 1 close: the launch fixes still open (2026-10-04, night)

**Goal:** finish milestone 1 of his launch interview (`E:/atlas/design/loop/build/INTERVIEW-2026-09-26.md`, "Milestone 1, the
launch fixes"), then his milestone review. The truth pass (plan 06) closed the trade headers' register figures, the UK survival
and the exemplar URL; this plan takes what the sweep of 2026-10-04 found still open, each item his decided answer, so nothing here
is re-asked.

**How each task runs:** a test or gate first where the rule can be checked, the change, `tsc`, the related gates, a render or a
production probe, one commit. The full chain before any push; his word before any push or deploy.

## Tasks

- [ ] **M1. Retired trades under a place redirect** (QUEUE `launch:retired-trades-live`, interview 12). `/gb/london/banking` and
  `/us/new-york/banking` answer 200 with a default page; only `/industries/<slug>` redirects. A retired slug under a place goes,
  permanently and in one hop, to the nearest live page: the trade it merged into, in the same place, where it merged; otherwise
  the place's own page (a region's page, else the city's page, else the country's). One pure function the middleware calls,
  tested; a production probe after the deploy.
- [ ] **M2. Clarity off** (QUEUE `site:clarity-never-runs`, interview 7). The loader leaves the layout, the event helper becomes a
  no-op, the privacy and cookie pages stop naming it. Cookie-free analytics (Vercel Web Analytics) needs his switch in the Vercel
  dashboard; the page carries its script once the switch is on.
- [ ] **M3. The staff card drops its average-salary bar** (QUEUE `country:median-pay-two-names`, interview 30): the minimum and
  the hire lever stay; the header and the peers keep the salary. PayBars draws its one-figure form by its own law.
- [ ] **M4. The three kept forms are his exceptions** (QUEUE `country:focal-kept-forms`, interview 31): recorded in the model-laws
  gate with his ruling, the UK page's model-law baseline to zero.
- [ ] **M5. The industry page's places table links each row** (QUEUE `ui:industry-page-is-a-dead-end`, interview 35) to that
  trade's page in that city, with the list rows' arrow.
- [ ] **M6. The district hub's visitor figures withheld until measured** (QUEUE `hood:visitor-figures`, interview 36).
- [ ] **M7. The industry page's survival card says it is not one country's** (QUEUE `trade:uk-survival-official`, interview 32).
- [ ] **M8. The 26 London trade headers with no register figure lead with the page's strongest trusted figure** (QUEUE
  `cell:hero-not-measured`, interview 2): 112 of 138 lead with the register's since the truth pass; the 26 are trades whose code
  is approximate, absent or thin.
- [ ] **M9. "About the figures" in the footer** and the "notify me when my place reaches this depth" capture on the thinner
  pages (interview 17 and the milestone's line).
- [ ] **M10. Indexing**: UK pages and pages at their floor index, the rest noindex, the sitemap to match (interview 6). Production
  today says "index, follow" on every page. The floor is the harness's block count by page type; the mechanism is designed in
  this task before anything is built.
- [ ] **Close:** QUEUE statuses (the exemplar URL and the city cards are done already), the full chain, photographs, his
  milestone review.
