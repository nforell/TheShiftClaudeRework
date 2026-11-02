/* Runs supabase/schema.sql and supabase/classes-and-pack.sql in an in-memory Postgres (PGlite) with stand-ins for
   Supabase auth, then checks the row level security: who can see and write which rows. npm install; node policies.mjs */
import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
const R = new URL('../../supabase/', import.meta.url).pathname;
const db = new PGlite();
const q = (s, p) => db.query(s, p);
// Minimal Supabase stand-ins: auth schema, auth.uid() from a session setting, roles.
await db.exec(`
create schema auth;
create table auth.users (id uuid primary key, email text);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.uid', true), '')::uuid $$;
create role authenticated; create role anon;
grant usage on schema public to authenticated; grant usage on schema auth to authenticated;
grant execute on function auth.uid() to authenticated;
alter default privileges in schema public grant all on tables to authenticated;
`);
await db.exec(fs.readFileSync(R + 'schema.sql', 'utf8'));
await db.exec(fs.readFileSync(R + 'classes-and-pack.sql', 'utf8'));
await db.exec(fs.readFileSync(R + 'classes-and-pack.sql', 'utf8'));   // idempotent
await db.exec(`grant all on all tables in schema public to authenticated; grant all on all sequences in schema public to authenticated;`);
const T = '11111111-1111-1111-1111-111111111111', S1 = '22222222-2222-2222-2222-222222222222', S2 = '33333333-3333-3333-3333-333333333333', X = '44444444-4444-4444-4444-444444444444';
await db.exec(`insert into auth.users values ('${T}','t@x'),('${S1}','s1@x'),('${S2}','s2@x'),('${X}','x@x')`);
async function as(uid, sql) { await db.exec(`set role authenticated; select set_config('request.uid','${uid}',false);`); try { return await q(sql); } finally { await db.exec('reset role'); } }
let ok = 0, bad = 0; const check = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); c ? ok++ : bad++; };
const k = (await as(T, `select public.create_class('NURS 310, Section 2') as j`)).rows[0].j;
check(/^[A-Z2-9]{6}$/.test(k.code), 'create_class makes a 6-character code ' + k.code);
const j1 = (await as(S1, `select public.join_class('${k.code.toLowerCase()}', 'Ana P.') as j`)).rows[0].j;
check(j1.name === 'NURS 310, Section 2', 'a student joins by code (any case)');
await as(S2, `select public.join_class('${k.code}', 'Ben R.')`);
let e = null; const wrong = (await as(S1, `select public.join_class('ZZZZZZ', 'x') as j`)).rows[0].j;
check(/No class/.test(wrong.error || ''), 'a wrong code is refused');
check((await as(S1, `select count(*)::int n from public.class_members where display_name = 'x'`)).rows[0].n === 0, 'a wrong code joins nothing');
for (let i = 0; i < 9; i++) await as(X, `select public.join_class('ZZZZZ${i}', 'x')`);
const tenth = (await as(X, `select public.join_class('${k.code}', 'Xavier') as j`)).rows[0].j;
check(!tenth.error && tenth.name === 'NURS 310, Section 2', 'nine wrong codes still let the right one through');
await db.exec(`delete from public.class_members where user_id = '${X}'`);
await as(X, `select public.join_class('ZZZZZZ', 'x')`);
const locked = (await as(X, `select public.join_class('${k.code}', 'Xavier') as j`)).rows[0].j;
check(/Too many/.test(locked.error || ''), 'after ten wrong codes in an hour, even the right code waits (no guessing)');
check((await as(S1, `select public.join_class('${k.code}', 'Ana P.') as j`)).rows[0].j.name === 'NURS 310, Section 2', 'the limit is per account: another student still joins');
await db.exec(`update public.join_attempts set at = now() - interval '61 minutes' where user_id = '${X}'`);
check(!(await as(X, `select public.join_class('${k.code}', 'Xavier') as j`)).rows[0].j.error, 'an hour later the account can join again');
await db.exec(`delete from public.class_members where user_id = '${X}'`);
let seen = 0; try { seen = (await as(X, `select count(*)::int n from public.join_attempts`)).rows[0].n; } catch (x) { seen = 0; }
check(seen === 0, 'nobody can read the attempt log directly, even their own rows');
e = null; try { await as(X, `delete from public.join_attempts`); } catch (x) { e = x.message; }
check((await db.query(`select count(*)::int n from public.join_attempts where user_id = '${X}'`)).rows[0].n > 0, 'and nobody can clear it to reset the limit');
await as(S1, `insert into public.results (user_id, case_id, score, steps, misses) values ('${S1}', 'medsurg-4w-1', 72, '[{"id":"cues","score":80}]', '[{"key":"416-sbar","text":"x"}]')`);
await as(S2, `insert into public.results (user_id, case_id, score) values ('${S2}', 'medsurg-4w-1', 55)`);
await as(X, `insert into public.results (user_id, case_id, score) values ('${X}', 'medsurg-4w-1', 99)`);
e = null; try { await as(S1, `insert into public.results (user_id, case_id, score) values ('${S2}', 'medsurg-4w-1', 100)`); } catch (x) { e = x.message; }
check(!!e, 'a student cannot write a result as someone else');
await as(S1, `insert into public.results (user_id, case_id, score, played_at) values ('${S1}', 'psych-3e-1', 40, now() - interval '30 days')`);
await as(S1, `insert into public.ngn_results (user_id, case_id, item_id, item_type, score, max, at) values ('${S1}', 'psych-3e-1', 'q1', 'matrix', 1, 3, now() - interval '30 days')`);
await as(S1, `insert into public.ngn_results (user_id, case_id, item_id, item_type, score, max) values ('${S1}', 'medsurg-4w-1', 'q2', 'bowtie', 4, 5)`);
check((await as(T, `select count(*)::int n from public.results`)).rows[0].n === 2, 'the instructor sees their two students\' results, not an outsider\'s');
check((await as(T, `select count(*)::int n from public.results where case_id = 'psych-3e-1'`)).rows[0].n === 0, 'the instructor does not see a result from before the student joined');
check((await as(S1, `select count(*)::int n from public.results`)).rows[0].n === 2 && (await as(S1, `select count(*)::int n from public.ngn_results`)).rows[0].n === 2, 'the student still sees all of their own results');
check((await as(T, `select count(*)::int n from public.ngn_results`)).rows[0].n === 1, 'the instructor sees practice results only from after joining');
// Drill results: same rules as shift results.
await as(S1, `insert into public.drill_results (user_id, kind, card_id, ok) values ('${S1}', 'med', 'mp-digoxin', false)`);
await as(S1, `insert into public.drill_results (user_id, kind, card_id, ok, at) values ('${S1}', 'first', 'wf-sepsis', true, now() - interval '30 days')`);
await as(X, `insert into public.drill_results (user_id, kind, card_id, ok) values ('${X}', 'sbar', 'sb-hf', true)`);
e = null; try { await as(S1, `insert into public.drill_results (user_id, kind, card_id, ok) values ('${S2}', 'med', 'mp-digoxin', true)`); } catch (x) { e = x.message; }
check(!!e, 'a student cannot write a drill result as someone else');
e = null; try { await as(S1, `insert into public.drill_results (user_id, kind, card_id, ok) values ('${S1}', 'nonsense', 'x', true)`); } catch (x) { e = x.message; }
check(!!e, 'drill results only take the four drill kinds');
check((await as(T, `select count(*)::int n from public.drill_results`)).rows[0].n === 1, 'the instructor sees a student\'s drills from after joining, not before, and not an outsider\'s');
check((await as(S1, `select count(*)::int n from public.drill_results`)).rows[0].n === 2, 'a student sees all of their own drills');
const T2 = '55555555-5555-5555-5555-555555555555'; await db.exec(`insert into auth.users values ('${T2}','t2@x')`);
const k2 = (await as(T2, `select public.create_class('Other school') as j`)).rows[0].j;
await db.exec(`update public.class_members set joined_at = now() - interval '60 days' where user_id = '${S2}'`);
await as(S2, `select public.join_class('${k2.code}', 'Ben R.')`);
check((await as(T2, `select count(*)::int n from public.results`)).rows[0].n === 0, 'a second instructor does not see what a student did before joining their class');
check((await as(S2, `select count(*)::int n from public.results`)).rows[0].n === 1, 'a student sees only their own results');
check((await as(T, `select count(*)::int n from public.class_members`)).rows[0].n === 2, 'the instructor sees the roster');
check((await as(S1, `select count(*)::int n from public.class_members`)).rows[0].n === 1, 'a student sees only their own membership');
check((await as(S1, `select count(*)::int n from public.classes`)).rows[0].n === 1, 'a student can read the class they joined');
check((await as(X, `select count(*)::int n from public.classes`)).rows[0].n === 0, 'an outsider sees no classes');
e = null; try { await as(S1, `insert into public.entitlements (user_id, product) values ('${S1}', 'pack1')`); } catch (x) { e = x.message; }
check(!!e, 'a player cannot grant themselves the pack');
await db.exec(`insert into public.entitlements (user_id, product, ref) values ('${S2}', 'pack1', 'cs_test')`);
check((await as(S2, `select count(*)::int n from public.entitlements`)).rows[0].n === 1 && (await as(S1, `select count(*)::int n from public.entitlements`)).rows[0].n === 0, 'players read only their own purchases');
await as(S1, `delete from public.class_members where user_id = '${S1}'`);
check((await as(T, `select count(*)::int n from public.results`)).rows[0].n === 1, 'after a student leaves, the instructor stops seeing their results');
e = null; try { await as(X, `select public.delete_my_account()`); } catch (x) { e = x.message; }
check(!e, 'a player can delete their own account' + (e ? ' (' + e + ')' : ''));
check((await q(`select count(*)::int n from auth.users where id = '${X}'`)).rows[0].n === 0 && (await q(`select count(*)::int n from public.results where user_id = '${X}'`)).rows[0].n === 0, 'deleting an account removes the user and their results');
check((await q(`select count(*)::int n from auth.users`)).rows[0].n === 4, 'deleting one account leaves everyone else');
await as(T2, `select public.delete_my_account()`);
check((await q(`select count(*)::int n from public.classes where id = '${k2.id}'`)).rows[0].n === 0 && (await q(`select count(*)::int n from auth.users where id = '${S2}'`)).rows[0].n === 1, 'an instructor deleting their account removes their class, not their students');
e = null; try { await db.exec(`set role authenticated; select set_config('request.uid','',false); select public.delete_my_account();`); } catch (x) { e = x.message; } finally { await db.exec('reset role'); }
check(/sign in/.test(e || ''), 'deleting needs a signed-in player');
// Beta feedback (supabase/feedback.sql): anyone can add a fresh row, nobody reads, updates or deletes through the game's key.
await db.exec(fs.readFileSync(R + 'feedback.sql', 'utf8'));
await db.exec(fs.readFileSync(R + 'feedback.sql', 'utf8'));   // idempotent
await db.exec(`grant usage on schema public to anon;`);
async function anon(sql) { await db.exec(`set role anon;`); try { return await q(sql); } finally { await db.exec('reset role'); } }
await anon(`insert into public.feedback (install_id, kind, shift, difficulty, helps_nclex, would_pay, note) values ('i1','debrief','medsurg-4w-1','hard','yes','maybe','K+ timing felt off')`);
check((await q(`select count(*)::int n from public.feedback`)).rows[0].n === 1, 'a signed-out player can send feedback');
e = null; try { await anon(`select * from public.feedback`); } catch (x) { e = x.message; }
check(/permission/.test(e || ''), 'players cannot read anyone\'s feedback');
e = null; try { await anon(`update public.feedback set status = 'fixed'`); } catch (x) { e = x.message; }
check(/permission/.test(e || ''), 'players cannot change feedback');
e = null; try { await anon(`insert into public.feedback (install_id, kind, status) values ('i1','debrief','fixed')`); } catch (x) { e = x.message; }
check(!!e, 'players cannot set the triage status');
e = null; try { await anon(`insert into public.feedback (install_id, kind, difficulty) values ('i1','debrief','meh')`); } catch (x) { e = x.message; }
check(!!e, 'answers outside the choices are refused');
e = null; try { await anon(`select * from public.feedback_summary`); } catch (x) { e = x.message; }
check(/permission/.test(e || ''), 'players cannot read the summary');
check((await q(`select too_hard, nclex_yes, pay_maybe from public.feedback_summary where shift = 'medsurg-4w-1'`)).rows[0].too_hard === 1, 'the summary counts answers per shift');
console.log(bad ? 'SQL FAILED ' + bad : 'SQL CLEAN');
process.exit(bad ? 1 : 0);
