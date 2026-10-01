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
let e = null; try { await as(S1, `select public.join_class('ZZZZZZ', 'x')`); } catch (x) { e = x.message; }
check(/No class/.test(e || ''), 'a wrong code is refused');
await as(S1, `insert into public.results (user_id, case_id, score, steps, misses) values ('${S1}', 'medsurg-4w-1', 72, '[{"id":"cues","score":80}]', '[{"key":"416-sbar","text":"x"}]')`);
await as(S2, `insert into public.results (user_id, case_id, score) values ('${S2}', 'medsurg-4w-1', 55)`);
await as(X, `insert into public.results (user_id, case_id, score) values ('${X}', 'medsurg-4w-1', 99)`);
e = null; try { await as(S1, `insert into public.results (user_id, case_id, score) values ('${S2}', 'medsurg-4w-1', 100)`); } catch (x) { e = x.message; }
check(!!e, 'a student cannot write a result as someone else');
check((await as(T, `select count(*)::int n from public.results`)).rows[0].n === 2, 'the instructor sees their two students\' results, not an outsider\'s');
check((await as(S1, `select count(*)::int n from public.results`)).rows[0].n === 1, 'a student sees only their own results');
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
console.log(bad ? 'SQL FAILED ' + bad : 'SQL CLEAN');
process.exit(bad ? 1 : 0);
