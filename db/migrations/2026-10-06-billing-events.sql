-- db/migrations/2026-10-06-billing-events.sql
-- THE BILLING EVENT LOG (the checkup of 2026-10-06, finding 2): one row per Stripe event the webhook received, with what the sync
-- did with it, so a question about a paying reader ("why is she on free?") is answered from a record instead of from Stripe's
-- dashboard and memory.
--
-- DO NOT run automatically. The founder runs this in the Supabase SQL Editor (repo convention). Additive and idempotent.
--
-- The webhook writes here with the service role, after it has handled the event, and never fails because of it: a missing table
-- (this file not yet applied) or a failed write is logged and the event is still answered on its own merits. The sync itself is
-- idempotent (every event re-derives the reader's state from Stripe), so this table is an audit trail, not a lock.
--
-- Row level security on and no policy: no reader of the site, signed in or not, reads it; the service role bypasses it.

create table if not exists public.billing_events (
  -- Stripe's event id (evt_...). A redelivered event updates its row rather than adding one.
  id text primary key,
  type text not null,
  livemode boolean not null default false,
  -- What the sync did: "pro", "free", "skipped: <why>" or "failed: <why>".
  outcome text,
  received_at timestamptz not null default now()
);

alter table public.billing_events enable row level security;

create index if not exists billing_events_received_idx on public.billing_events (received_at desc);
