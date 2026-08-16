-- Newsletter signups: record WHICH form the address came from.
--
-- Four forms across the site have been posting a `source` all along
-- ("footer", "inline", "exit_intent", "lead_magnet_2026"), and
-- /api/newsletter read only `email` and dropped it. The route's own doc
-- comment declared the two-field contract, so this is the column catching up
-- with what the clients were already sending.
--
-- Why it matters more than analytics tidiness: /download/2026-benchmarks asks
-- for an address in exchange for a PDF that does not exist yet, and promises
-- to send it "when it is done". Those people land in the same undifferentiated
-- table as everyone who ticked the footer box. Without this column there is no
-- way to keep that promise to exactly the people it was made to.
--
-- Nullable on purpose. Every row already in the table predates the column and
-- its origin is genuinely unknown; a default like 'unknown' would invent a
-- fact about historical rows. NULL says "not recorded", which is true.
--
-- The route tolerates this migration NOT being applied: it retries the insert
-- without the column when Postgres says the column is missing, so signups are
-- captured either way and start carrying their source the moment this runs.

alter table newsletter_signups
  add column if not exists source text;

comment on column newsletter_signups.source is
  'Which form captured the address: footer | inline | exit_intent | lead_magnet_2026. NULL for rows captured before 2026-08-16, where the origin was never recorded.';
