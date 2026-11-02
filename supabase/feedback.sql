-- The Shift: beta feedback, one row per note a player sends (debrief survey, "Report a problem", clinical reviews).
-- Paste into Supabase → SQL Editor → New query → Run. Safe to rerun.
-- Players can only add rows. Nobody can read them through the game's key; you read them in the Supabase dashboard
-- (Table Editor → feedback → Export → CSV) and hand that file to Claude. See docs/FEEDBACK-LOOP.md.
create table if not exists public.feedback (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  install_id   text not null check (char_length(install_id) <= 80),
  kind         text not null check (char_length(kind) <= 40),
  shift        text check (char_length(shift) <= 80),
  difficulty   text check (difficulty in ('easy', 'right', 'hard')),
  helps_nclex  text check (helps_nclex in ('yes', 'some', 'no')),
  would_pay    text check (would_pay in ('yes', 'maybe', 'no')),
  problem      text check (char_length(problem) <= 40),
  note         text check (char_length(note) <= 4000),
  score        int,
  source       text check (char_length(source) <= 200),
  app_version  text check (char_length(app_version) <= 40),
  screen       text check (char_length(screen) <= 20),
  details      jsonb check (pg_column_size(details) <= 65536),
  status       text not null default 'new' check (status in ('new', 'fixed', 'wontfix', 'later'))
);
create index if not exists feedback_created on public.feedback (created_at desc);

alter table public.feedback enable row level security;
-- Insert only, and only fresh rows: a player can't set the triage status or backdate a note.
drop policy if exists "anyone adds feedback" on public.feedback;
create policy "anyone adds feedback" on public.feedback for insert to anon, authenticated
  with check (status = 'new' and created_at > now() - interval '5 minutes');
revoke select, update, delete on public.feedback from anon, authenticated;
grant insert on public.feedback to anon, authenticated;

-- One-glance summary per shift. Run this any time in the SQL Editor:
--   select * from public.feedback_summary;
create or replace view public.feedback_summary with (security_invoker = true) as
select coalesce(nullif(shift, ''), '(no shift)') as shift,
       count(*)                                            as notes,
       count(*) filter (where difficulty = 'easy')         as too_easy,
       count(*) filter (where difficulty = 'right')        as about_right,
       count(*) filter (where difficulty = 'hard')         as too_hard,
       count(*) filter (where helps_nclex = 'yes')         as nclex_yes,
       count(*) filter (where helps_nclex = 'no')          as nclex_no,
       count(*) filter (where would_pay = 'yes')           as pay_yes,
       count(*) filter (where would_pay = 'maybe')         as pay_maybe,
       count(*) filter (where kind <> 'debrief')           as problem_reports,
       count(*) filter (where status = 'new')              as unhandled,
       max(created_at)                                     as latest
from public.feedback group by 1 order by notes desc;
revoke all on public.feedback_summary from anon, authenticated;
