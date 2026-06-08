-- db/migrations/2026-06-09-subscriptions.sql
-- Milestone 2: the entitlement layer. One subscription row per user records their
-- current paid tier and the Stripe linkage. DO NOT run automatically; the founder
-- applies it in the Supabase SQL Editor alongside the Stripe setup. Additive and
-- idempotent.
--
-- Security model: users may READ their own subscription, but never write it. All
-- writes happen server-side in the Stripe webhook using the service-role key,
-- which bypasses RLS. So there is no insert/update policy for users: a viewer can
-- never grant themselves a tier.

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  tier text not null default 'free' check (tier in ('free', 'basic', 'premium')),
  -- Stripe subscription status: active | trialing | past_due | canceled | inactive
  status text not null default 'inactive',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create index if not exists subscriptions_customer_idx
  on public.subscriptions (stripe_customer_id);
