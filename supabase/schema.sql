-- The Shift: cloud saves. Paste into Supabase → SQL Editor → New query → Run.
-- One row per player: their profile (scores, badges, settings) and their in-progress shift.
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
