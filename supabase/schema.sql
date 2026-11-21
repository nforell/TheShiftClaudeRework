-- The Shift: cloud saves. Paste into Supabase → SQL Editor → New query → Run.
-- One row per player: their profile (scores, badges, settings, finished shifts). The shift in progress has its own
-- table below (shift_snapshots); saves.game is kept for older versions of the game.
create table if not exists public.saves (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  profile    jsonb not null default '{}'::jsonb,
  game       jsonb,
  updated_at timestamptz not null default now()
);

-- Row level security: each player can only see and change their own row.
alter table public.saves enable row level security;

drop policy if exists "read own save" on public.saves;
create policy "read own save" on public.saves
  for select using (auth.uid() = user_id);

drop policy if exists "insert own save" on public.saves;
create policy "insert own save" on public.saves
  for insert with check (auth.uid() = user_id);

drop policy if exists "update own save" on public.saves;
create policy "update own save" on public.saves
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- The shift in progress, kept apart from the profile. A shift's logs grow with every action; keeping the snapshot in
-- its own row means the game uploads it on its own debounced clock (src/cloud.js) and never re-sends it with the
-- profile, and the profile (which holds every finished shift's summary) stays small. Finished shifts also go to
-- public.results for instructors (classes-and-pack.sql). saves.game is still read, for shifts saved by older versions.
create table if not exists public.shift_snapshots (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  game       jsonb,                          -- null when no shift is in progress
  case_id    text,
  game_min   integer,                        -- minutes into the shift, for the dashboard without opening game
  saved_at   timestamptz not null default now()
);
alter table public.shift_snapshots enable row level security;

drop policy if exists "read own snapshot" on public.shift_snapshots;
create policy "read own snapshot" on public.shift_snapshots
  for select using (auth.uid() = user_id);

drop policy if exists "insert own snapshot" on public.shift_snapshots;
create policy "insert own snapshot" on public.shift_snapshots
  for insert with check (auth.uid() = user_id);

drop policy if exists "update own snapshot" on public.shift_snapshots;
create policy "update own snapshot" on public.shift_snapshots
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Move any shift already saved the old way, once. Safe to re-run.
insert into public.shift_snapshots (user_id, game, case_id, game_min, saved_at)
  select user_id, game, game->>'caseId', nullif(game->>'t', '')::numeric::integer, updated_at from public.saves
  where game is not null and coalesce((game->>'ended')::boolean, false) = false
on conflict (user_id) do nothing;

-- Deleting an account: a signed-in player removes themselves. Deleting the auth user cascades to every table that
-- references it (saves, class memberships, results, practice results, purchases, and any classes they teach).
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'sign in first'; end if;
  delete from auth.users where id = auth.uid();
end $$;
revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;
