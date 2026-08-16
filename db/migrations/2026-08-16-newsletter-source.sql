-- db/migrations/2026-08-16-newsletter-source.sql
-- The table behind POST /api/newsletter, and the `source` column it has been
-- trying to write since the four signup forms were built.
--
-- DO NOT run automatically. The founder runs this in the Supabase SQL Editor
-- (repo convention: migrations are applied by hand). Additive and idempotent,
-- so re-running is safe.
--
-- WHY THIS CREATES THE TABLE AND NOT ONLY THE COLUMN. The first version of this
-- file was an `alter table` alone, which assumed the table was already there.
-- Nothing in the repository says it is: there is no create-table migration for
-- newsletter_signups anywhere in db/migrations, only this file. The table was
-- either made by hand in the dashboard and never written down, or it does not
-- exist and every signup so far has been dropped, because the handler treats a
-- missing table as a soft failure and still answers {ok:true}. Both are
-- possible and the migration should not care which: `if not exists` on both
-- statements covers either, and an `alter` on a table that was never created
-- would simply have errored in the founder's editor.
--
-- WHAT `source` IS FOR. Four forms post here and all of them have always sent
-- one: footer, inline, exit_intent, lead_magnet_2026. The route read only
-- `email` and dropped it. It matters because of where one of those forms sits:
-- /download/2026-benchmarks asks for an address in exchange for a PDF that does
-- not exist yet and promises to send it "when it is done". Those people landed
-- in the same undifferentiated table as everyone who ticked the footer box, so
-- there was no way to keep that promise to exactly the people it was made to.
--
-- Nullable on purpose. Any row already in the table predates the column and its
-- origin is genuinely unknown; a default like 'unknown' would invent a fact
-- about historical rows. NULL says "not recorded", which is true.
--
-- The route tolerates this file NOT being applied: it retries the insert
-- without the column when Postgres says the column is missing, so signups are
-- captured either way and start carrying their source the moment this runs.

create table if not exists public.newsletter_signups (
  id bigserial primary key,
  -- Unique because the handler depends on it. It returns the same {ok:true} for
  -- a fresh insert and for a duplicate, deliberately, so that the endpoint
  -- cannot be used to test whether an address is already subscribed. That
  -- design only holds if a second insert of the same address actually raises a
  -- duplicate rather than quietly adding another row.
  email text not null unique,
  -- Which form captured it. See above.
  source text,
  created_at timestamptz not null default now()
);

-- For the case where the table already exists from a hand-made version without
-- the column. Separate from the create above because `create table if not
-- exists` does nothing at all to a table that is already there, including
-- adding columns it is missing.
alter table public.newsletter_signups
  add column if not exists source text;

comment on column public.newsletter_signups.source is
  'Which form captured the address: footer | inline | exit_intent | lead_magnet_2026. NULL for rows captured before 2026-08-16, where the origin was never recorded.';

-- NOT ADDED HERE: a unique constraint on a pre-existing table. If the table was
-- made by hand without one, adding it now would fail on any duplicate rows
-- already stored, and this file should not be the thing that errors halfway
-- through in the founder's editor. Check first:
--
--   select email, count(*) from public.newsletter_signups
--   group by email having count(*) > 1;
--
-- If that returns nothing, the constraint is safe to add:
--
--   alter table public.newsletter_signups
--     add constraint newsletter_signups_email_key unique (email);
