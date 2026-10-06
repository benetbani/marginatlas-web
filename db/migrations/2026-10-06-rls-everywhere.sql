-- db/migrations/2026-10-06-rls-everywhere.sql
-- ROW LEVEL SECURITY ON EVERY TABLE THE MIGRATION FILES CREATE (the checkup of 2026-10-06, finding 1).
--
-- DO NOT run automatically. The founder runs this in the Supabase SQL Editor (repo convention: migrations are applied by hand).
-- Idempotent and harmless where it is already on: `enable row level security` on a table that has it changes nothing, and no
-- policy is dropped or added here.
--
-- WHY. Three earlier files create tables and never enable it: 2026-08-16-newsletter-source.sql (newsletter_signups),
-- 2026-08-16-corrections.sql (corrections) and 2026-05-24-deepening-schema.sql (sub_industries, local_aliases). Measured on
-- 2026-10-06, the live database already refuses the public anon key's writes on all of them (an insert with its required
-- columns null answered 42501, row level security, never 23502), and the anon key reads no row of the form tables. So the
-- database is right and the files were wrong: anyone rebuilding the schema from these files would have made tables the public
-- key could read and write, holding emails and IP addresses. This file makes the files say what the database does.
--
-- WHAT IT DOES NOT CHANGE. Every writer of these tables uses the service role (src/app/api/newsletter, /api/correction and
-- /api/contact through the service key; the reference tables are loaded by scripts with it), and the service role bypasses row
-- level security, so nothing that writes today stops writing. No anon or authenticated policy is created: no reader of the site
-- reads these tables with the public key.
--
-- Each statement is guarded, so a table that was never created on this project is skipped rather than failing the file.

do $$
declare
  t text;
begin
  foreach t in array array[
    'newsletter_signups',
    'corrections',
    'contact_messages',
    'sub_industries',
    'local_aliases'
  ]
  loop
    if to_regclass('public.' || t) is not null then
      execute format('alter table public.%I enable row level security', t);
    end if;
  end loop;
end
$$;
