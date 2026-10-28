-- The Shift: classes (educator view) and the shift pack.
-- Run once in Supabase → SQL Editor → New query → paste → Run. Safe to run again.
-- Needs the saves table from schema.sql to exist already.


-- A class an instructor runs. Students join with the code. pack = true gives every member the shift pack
-- (a school license): flip it in the Table Editor when a school pays.
create table if not exists public.classes (
  id         uuid primary key default gen_random_uuid(),
  code       text unique not null,
  name       text not null check (char_length(name) between 1 and 80),
  teacher    uuid not null references auth.users (id) on delete cascade,
  pack       boolean not null default false,
  created_at timestamptz not null default now()
);

-- Who is in which class, and the name their instructor sees.
create table if not exists public.class_members (
  class_id     uuid not null references public.classes (id) on delete cascade,
  user_id      uuid not null references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 60),
  joined_at    timestamptz not null default now(),
  primary key (class_id, user_id)
);

-- One row per finished shift: what an instructor's dashboard is built from.
create table if not exists public.results (
  id        bigint generated always as identity primary key,
  user_id   uuid not null references auth.users (id) on delete cascade,
  case_id   text not null,
  score     int not null,
  stars     int not null default 0,
  minutes   int,
  domains   jsonb not null default '[]'::jsonb,   -- [{id, score}] by skill
  steps     jsonb not null default '[]'::jsonb,   -- [{id, score}] by NCLEX clinical judgment step
  misses    jsonb not null default '[]'::jsonb,   -- [{key, text, step}] decisions to rethink
  outcomes  jsonb not null default '[]'::jsonb,   -- [{id, tone}]
  played_at timestamptz not null default now()
);
create index if not exists results_user on public.results (user_id, played_at desc);

-- Practice-question results.
create table if not exists public.ngn_results (
  id        bigint generated always as identity primary key,
  user_id   uuid not null references auth.users (id) on delete cascade,
  case_id   text not null,
  item_id   text not null,
  item_type text not null,
  step      text,
  score     int not null,
  max       int not null,
  at        timestamptz not null default now()
);
create index if not exists ngn_user on public.ngn_results (user_id, at desc);

-- Drill results: one row per card answered (Med Pass, Who's First, SBAR, De-escalation). kind is the drill, card_id
-- the card in src/drills-*.js, ok whether it was right, retry true for a "retry what you missed" round.
create table if not exists public.drill_results (
  id      bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind    text not null check (kind in ('med', 'first', 'sbar', 'calm')),
  card_id text not null,
  ok      boolean not null,
  retry   boolean not null default false,
  at      timestamptz not null default now()
);
create index if not exists drill_user on public.drill_results (user_id, at desc);

-- Purchases: written only by the Stripe webhook (service role), read by the player.
create table if not exists public.entitlements (
  user_id    uuid not null references auth.users (id) on delete cascade,
  product    text not null,
  source     text not null default 'stripe',
  ref        text,
  created_at timestamptz not null default now(),
  primary key (user_id, product)
);

alter table public.classes       enable row level security;
alter table public.class_members enable row level security;
alter table public.results       enable row level security;
alter table public.ngn_results   enable row level security;
alter table public.drill_results enable row level security;
alter table public.entitlements  enable row level security;

-- Helper: is the signed-in user the instructor of a class this student belongs to?
create or replace function public.teaches(student uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from class_members m join classes c on c.id = m.class_id
    where m.user_id = student and c.teacher = auth.uid()
  );
$$;

-- Same, limited to things the student did after joining that instructor's class: practice from before the class
-- (or for another instructor's class) stays the student's own.
create or replace function public.teaches_at(student uuid, at timestamptz) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from class_members m join classes c on c.id = m.class_id
    where m.user_id = student and c.teacher = auth.uid() and at >= m.joined_at
  );
$$;
grant execute on function public.teaches_at(uuid, timestamptz) to authenticated;

-- Helpers that read memberships without going through row level security again (avoids policy recursion).
create or replace function public.in_class(k uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from class_members where class_id = k and user_id = auth.uid());
$$;
create or replace function public.runs_class(k uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from classes where id = k and teacher = auth.uid());
$$;
grant execute on function public.in_class(uuid) to authenticated;
grant execute on function public.runs_class(uuid) to authenticated;

-- classes: instructors see and rename their own; members see the classes they're in.
drop policy if exists "teacher reads class" on public.classes;
create policy "teacher reads class" on public.classes for select using (teacher = auth.uid());
drop policy if exists "member reads class" on public.classes;
create policy "member reads class" on public.classes for select using (public.in_class(id));
drop policy if exists "teacher renames class" on public.classes;
create policy "teacher renames class" on public.classes for update using (teacher = auth.uid()) with check (teacher = auth.uid());
drop policy if exists "teacher deletes class" on public.classes;
create policy "teacher deletes class" on public.classes for delete using (teacher = auth.uid());

-- class_members: students see and leave their own memberships; instructors see their roster.
drop policy if exists "member reads own" on public.class_members;
create policy "member reads own" on public.class_members for select using (user_id = auth.uid());
drop policy if exists "teacher reads roster" on public.class_members;
create policy "teacher reads roster" on public.class_members for select using (public.runs_class(class_id));
drop policy if exists "member leaves" on public.class_members;
create policy "member leaves" on public.class_members for delete using (user_id = auth.uid());
drop policy if exists "teacher removes" on public.class_members;
create policy "teacher removes" on public.class_members for delete using (public.runs_class(class_id));

-- results and ngn_results: players write and read their own; instructors read their students', from the day each
-- student joined their class.
drop policy if exists "own results" on public.results;
create policy "own results" on public.results for select using (user_id = auth.uid() or public.teaches_at(user_id, played_at));
drop policy if exists "write own results" on public.results;
create policy "write own results" on public.results for insert with check (user_id = auth.uid());
drop policy if exists "own ngn" on public.ngn_results;
create policy "own ngn" on public.ngn_results for select using (user_id = auth.uid() or public.teaches_at(user_id, at));
drop policy if exists "write own ngn" on public.ngn_results;
create policy "write own ngn" on public.ngn_results for insert with check (user_id = auth.uid());
drop policy if exists "own drills" on public.drill_results;
create policy "own drills" on public.drill_results for select using (user_id = auth.uid() or public.teaches_at(user_id, at));
drop policy if exists "write own drills" on public.drill_results;
create policy "write own drills" on public.drill_results for insert with check (user_id = auth.uid());

-- entitlements: read your own. No insert policy: only the webhook (service role) writes.
drop policy if exists "read own entitlements" on public.entitlements;
create policy "read own entitlements" on public.entitlements for select using (user_id = auth.uid());

-- Creating a class: generates an unambiguous 6-character code.
create or replace function public.create_class(p_name text) returns json
language plpgsql security definer set search_path = public as $$
declare c text; k uuid; alphabet text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
begin
  if auth.uid() is null then raise exception 'sign in first'; end if;
  loop
    c := '';
    for i in 1..6 loop c := c || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1); end loop;
    exit when not exists (select 1 from classes where code = c);
  end loop;
  insert into classes (code, name, teacher) values (c, left(trim(p_name), 80), auth.uid()) returning id into k;
  return json_build_object('id', k, 'code', c, 'name', left(trim(p_name), 80));
end $$;

-- Wrong class codes tried, per account. Joining is limited to 10 wrong codes an hour so a code can't be guessed
-- (31^6 codes, so about 90 million years at that rate). Only join_class writes here; nobody can read it.
create table if not exists public.join_attempts (
  user_id uuid not null references auth.users (id) on delete cascade,
  at      timestamptz not null default now()
);
create index if not exists join_attempts_user_at on public.join_attempts (user_id, at);
alter table public.join_attempts enable row level security;
revoke all on public.join_attempts from anon, authenticated;

-- Joining a class by code, with the name the instructor will see. A wrong code returns {"error": ...} instead of
-- raising, so the attempt is kept (a raise would roll it back) and counts toward the limit.
create or replace function public.join_class(p_code text, p_name text) returns json
language plpgsql security definer set search_path = public as $$
declare k classes%rowtype; tries int;
begin
  if auth.uid() is null then raise exception 'sign in first'; end if;
  select count(*) into tries from join_attempts where user_id = auth.uid() and at > now() - interval '1 hour';
  if tries >= 10 then
    return json_build_object('error', 'Too many wrong codes. Wait an hour, then try again.');
  end if;
  select * into k from classes where code = upper(trim(p_code));
  if not found then
    insert into join_attempts (user_id) values (auth.uid());
    delete from join_attempts where at < now() - interval '1 day';
    return json_build_object('error', 'No class with that code');
  end if;
  insert into class_members (class_id, user_id, display_name) values (k.id, auth.uid(), left(trim(p_name), 60))
    on conflict (class_id, user_id) do update set display_name = excluded.display_name;
  return json_build_object('id', k.id, 'name', k.name, 'code', k.code, 'pack', k.pack);
end $$;

grant execute on function public.create_class(text) to authenticated;
grant execute on function public.join_class(text, text) to authenticated;
grant execute on function public.teaches(uuid) to authenticated;
