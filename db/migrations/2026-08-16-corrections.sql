-- db/migrations/2026-08-16-corrections.sql
-- The table behind the correction form on cell pages and POST /api/correction.
--
-- DO NOT run automatically. The founder runs this in the Supabase SQL Editor
-- (repo convention: migrations are applied by hand). Additive and idempotent.
--
-- WHY IT DID NOT EXIST. It was never written. The endpoint has been live and
-- inserting into `corrections` with no create-table migration anywhere in
-- db/migrations, and the table is not in the database: a zero-row select
-- answers 404, "Could not find the table 'public.corrections' in the schema
-- cache". Its sibling, contact_messages, got its migration on 2026-08-01 and is
-- present; this one was missed.
--
-- WHAT THAT MEANS TODAY. Every correction a reader has submitted has been
-- discarded. The endpoint checks `if (!r.ok && r.status !== 404)` before
-- logging, so a missing table is the ONE failure it does not even print, and it
-- answers {ok:true} regardless. The reader is told the correction was received.
-- Nothing was received. That is the worst shape a failure can take on a site
-- whose whole argument is that its numbers can be trusted and corrected.
--
-- The soft failure itself is right and stays: a public form must not break
-- because a table is missing. What was wrong is that the table was missing.
--
-- Columns mirror exactly what src/app/api/correction/route.ts sends, no more.

create table if not exists public.corrections (
  id bigserial primary key,
  -- The cell page the form was opened from. Nullable because the endpoint
  -- sends null rather than an empty string when it is absent, and because a
  -- correction that arrives without one is still worth keeping.
  cell_url text,
  message text not null,
  -- Nullable and often null: a reader can report a wrong number without
  -- leaving a way to be answered.
  email text,
  ip text,
  user_agent text,
  created_at timestamptz not null default now(),
  -- The floor is 1, not the API's own minimum, for the reason the
  -- contact_messages migration records: the API counts UTF-16 units and
  -- char_length counts characters, so a short message written entirely in
  -- astral characters can clear the API and fail here. A constraint violation
  -- is invisible to the sender, because the endpoint swallows it and still
  -- answers "received". The API owns "long enough"; this owns "not empty".
  constraint corrections_message_len check (char_length(message) between 1 and 4000)
);

-- Newest first is how these get read.
create index if not exists corrections_created_at_idx
  on public.corrections (created_at desc);
