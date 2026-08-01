-- db/migrations/2026-08-01-contact-messages.sql
-- The table behind /contact and POST /api/contact.
--
-- DO NOT run automatically. The founder runs this in the Supabase SQL Editor
-- (repo convention: migrations are applied by hand). It is additive and
-- idempotent (IF NOT EXISTS), so re-running is safe.
--
-- Until it is applied, the endpoint still answers 200 and the page still says
-- "message received", because the handler treats a missing table as a soft
-- failure. That is the correct trade for a form on a public page, and it is
-- also the reason this file matters: without it, messages are accepted and
-- silently dropped.
--
-- WHY IT IS SEPARATE FROM `corrections`. The correction form is anchored to one
-- cell page and stores the cell URL it was opened from. This form is anchored
-- to nothing, takes a free-text page reference and a topic, and carries general
-- questions as well as corrections. Merging them would mean one table where
-- half the columns are null for half the rows, and the endpoints already keep
-- their validation separate on the same reasoning.

create table if not exists public.contact_messages (
  id bigserial primary key,
  -- 'correction' or 'other'. The API coerces anything else to 'other', so the
  -- constraint is a second line rather than the only one.
  topic text not null default 'other',
  -- Free text, not a URL column: a reader writes "the Lyon bakery page" as
  -- often as they paste an address, and refusing the first would lose the
  -- message rather than improve the data.
  page_ref text,
  message text not null,
  -- Nullable and expected to be null. The API nulls anything that does not
  -- parse rather than storing a string that merely looks like a route back.
  email text,
  ip text,
  user_agent text,
  created_at timestamptz not null default now(),
  constraint contact_messages_topic_check check (topic in ('correction', 'other')),
  -- The floor is 1, not the API's 10, and that is deliberate. The API counts
  -- UTF-16 units and char_length counts characters, so a short message written
  -- entirely in astral characters can clear the API and fail here. A constraint
  -- violation is invisible to the sender: the endpoint swallows it and still
  -- answers "received", so the message would be dropped while the reader was
  -- told otherwise. The API owns "long enough"; this owns "not empty".
  constraint contact_messages_message_len check (char_length(message) between 1 and 4000)
);

-- RLS on with NO policies is deliberate and is the whole access model here.
-- The anon and authenticated keys can then do nothing at all with this table:
-- they cannot read other people's messages and they cannot insert forged ones.
-- The service-role key used by the API route bypasses RLS, so the only writer
-- is the endpoint and the only reader is the founder in the SQL editor.
alter table public.contact_messages enable row level security;

-- The only query anyone runs against this: newest first.
create index if not exists contact_messages_created_idx
  on public.contact_messages (created_at desc);
