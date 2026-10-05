-- db/migrations/2026-10-05-pro-subscriptions.sql
-- THE ONE PRO PLAN (milestone 2; his interview of 2026-09-26, rulings 14 and 20). Supersedes 2026-06-09-subscriptions.sql, which
-- was never applied to the live database (scripts/query_outcomes.ts, 2026-09-17). DO NOT run automatically: the founder applies
-- it in the Supabase SQL Editor. Additive and idempotent: correct whether or not the June table exists.
--
-- Security model, unchanged from June: a user may read their own row and never write it; every write is the Stripe webhook's,
-- through the service role, which bypasses row level security.

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  tier text not null default 'free',
  status text not null default 'inactive',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now()
);

-- One paid tier. Postgres named the June inline check subscriptions_tier_check.
alter table public.subscriptions drop constraint if exists subscriptions_tier_check;
update public.subscriptions set tier = 'pro' where tier in ('basic', 'premium');
alter table public.subscriptions add constraint subscriptions_tier_check check (tier in ('free', 'pro'));

alter table public.subscriptions enable row level security;
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);

create index if not exists subscriptions_customer_idx on public.subscriptions (stripe_customer_id);
create unique index if not exists subscriptions_subscription_idx
  on public.subscriptions (stripe_subscription_id) where stripe_subscription_id is not null;

-- Checkout first (ruling 20): the account for a checkout email. The service role only; never anon, never a signed-in user.
create or replace function public.auth_user_id_by_email(p_email text)
returns uuid
language sql
stable
security definer
set search_path = public, auth
as $$
  select id from auth.users where lower(email) = lower(p_email) limit 1
$$;
revoke all on function public.auth_user_id_by_email(text) from public, anon, authenticated;
grant execute on function public.auth_user_id_by_email(text) to service_role;
