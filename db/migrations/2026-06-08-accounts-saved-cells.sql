-- db/migrations/2026-06-08-accounts-saved-cells.sql
-- Milestone 1: free accounts with saved cells, watchlist, and recently-viewed.
--
-- DO NOT run automatically. The founder runs this in the Supabase SQL Editor when
-- activating M1 (repo convention: migrations are applied by hand). It is additive
-- and idempotent (IF NOT EXISTS / on conflict), so re-running is safe.
--
-- Saved cells / watchlist / recent are FREE features (founder 2026-06-08: "all
-- free; paid is data depth only"), so there is no tier gate in the schema, only a
-- generous per-user sanity cap enforced in the API. A cell is identified by the
-- same key the app uses everywhere: (country, geo, industry), matching the
-- /{country}/{geo}/{industry} URL.

-- --------------------------------------------------------------------------
-- profiles: 1:1 with auth.users, created automatically on signup.
-- --------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --------------------------------------------------------------------------
-- saved_cells: a user's bookmarked cells (free; the API caps per user).
-- --------------------------------------------------------------------------
create table if not exists public.saved_cells (
  user_id uuid not null references auth.users (id) on delete cascade,
  country text not null,
  geo text not null,
  industry text not null,
  label text,
  created_at timestamptz not null default now(),
  primary key (user_id, country, geo, industry)
);

alter table public.saved_cells enable row level security;

drop policy if exists "saved_cells_all_own" on public.saved_cells;
create policy "saved_cells_all_own"
  on public.saved_cells for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists saved_cells_user_idx
  on public.saved_cells (user_id, created_at desc);

-- --------------------------------------------------------------------------
-- watchlist: cells the user tracks (alerts are a later milestone, so no
-- notification column yet).
-- --------------------------------------------------------------------------
create table if not exists public.watchlist (
  user_id uuid not null references auth.users (id) on delete cascade,
  country text not null,
  geo text not null,
  industry text not null,
  label text,
  created_at timestamptz not null default now(),
  primary key (user_id, country, geo, industry)
);

alter table public.watchlist enable row level security;

drop policy if exists "watchlist_all_own" on public.watchlist;
create policy "watchlist_all_own"
  on public.watchlist for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists watchlist_user_idx
  on public.watchlist (user_id, created_at desc);

-- --------------------------------------------------------------------------
-- recent_cells: recently-viewed cells (the API caps + prunes per user).
-- --------------------------------------------------------------------------
create table if not exists public.recent_cells (
  user_id uuid not null references auth.users (id) on delete cascade,
  country text not null,
  geo text not null,
  industry text not null,
  label text,
  visited_at timestamptz not null default now(),
  primary key (user_id, country, geo, industry)
);

alter table public.recent_cells enable row level security;

drop policy if exists "recent_cells_all_own" on public.recent_cells;
create policy "recent_cells_all_own"
  on public.recent_cells for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists recent_cells_user_idx
  on public.recent_cells (user_id, visited_at desc);
