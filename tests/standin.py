"""A stand-in for the parts of Supabase The Shift uses (auth, saves, classes, results, practice questions,
entitlements, and the two class RPCs), with the same row level security rules as supabase/*.sql, so browser tests
can play students and instructors end to end. tests/sql/policies.mjs checks the real SQL; this checks the game."""
import sys, json, pathlib, mimetypes, itertools, urllib.parse as up
from datetime import datetime, timezone
ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / 'dist'
SITE, SUPA, KEY = 'https://play.theshift.test', 'https://supa.theshift.test', 'sb_publishable_test'
CORS = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET,POST,DELETE,PATCH,OPTIONS'}


def serve(route):
    path = route.request.url.split(SITE, 1)[1].split('?')[0].split('#')[0]
    f = DIST / path.lstrip('/')
    if f.is_dir() or path.endswith('/'): f = f / 'index.html'
    if not f.exists(): return route.fulfill(status=404, body='nope')
    route.fulfill(status=200, body=f.read_bytes(), content_type=mimetypes.guess_type(str(f))[0] or 'application/octet-stream')


class Supa:
    def __init__(self):
        self.users = {}          # token → (uid, email)
        self.saves, self.classes, self.members, self.results, self.ngn, self.ent = {}, [], [], [], [], []
        self.otp, self.log, self.n = [], [], itertools.count(1)

    def user(self, token, uid, email): self.users[token] = (uid, email)

    # Row level security, as in classes-and-pack.sql.
    def teaches(self, me, student, at=None):   # teaches_at: only what the student did after joining
        mine = {c['id'] for c in self.classes if c['teacher'] == me}
        t = lambda x: datetime.fromisoformat(str(x).replace('Z', '+00:00'))
        return any(m['user_id'] == student and m['class_id'] in mine and (at is None or t(at) >= t(m['joined_at'])) for m in self.members)
    def visible(self, table, row, me):
        if table == 'saves': return row['user_id'] == me
        if table == 'classes': return row['teacher'] == me or any(m['class_id'] == row['id'] and m['user_id'] == me for m in self.members)
        if table == 'class_members': return row['user_id'] == me or any(c['id'] == row['class_id'] and c['teacher'] == me for c in self.classes)
        if table in ('results', 'ngn_results'): return row['user_id'] == me or self.teaches(me, row['user_id'], row.get('played_at') or row.get('at'))
        if table == 'entitlements': return row['user_id'] == me
        return False
    def table(self, t):
        return {'classes': self.classes, 'class_members': self.members, 'results': self.results, 'ngn_results': self.ngn, 'entitlements': self.ent}[t]

    def route(self, route):
        r = route.request
        if r.method == 'OPTIONS': return route.fulfill(status=204, headers=CORS)
        u = up.urlparse(r.url); q = up.parse_qs(u.query); h = r.headers
        j = lambda code, body: route.fulfill(status=code, body=json.dumps(body), content_type='application/json', headers=CORS)
        if h.get('apikey') != KEY: return j(401, {'message': 'no apikey'})
        if 'service_role' in (h.get('authorization') or '') or 'sb_secret' in (h.get('authorization') or ''): self.log.append('SECRET KEY SEEN')
        me, email = self.users.get((h.get('authorization') or '').replace('Bearer ', ''), (None, None))
        self.log.append(f'{r.method} {u.path}')
        if u.path == '/auth/v1/otp':
            self.otp.append({'body': json.loads(r.post_data), 'redirect_to': q.get('redirect_to', [''])[0]}); return j(200, {})
        if u.path == '/auth/v1/user': return j(200, {'id': me, 'email': email}) if me else j(401, {'msg': 'bad jwt'})
        if not me: return j(401, {'message': 'JWT invalid'})
        if u.path == '/rest/v1/rpc/create_class':
            b = json.loads(r.post_data); code = 'K' + str(next(self.n)).zfill(5)
            c = {'id': 'c' + code, 'code': code, 'name': b['p_name'][:80], 'teacher': me, 'pack': False, 'created_at': '2026-09-0%dT00:00:00Z' % len(self.classes)}
            self.classes.append(c); return j(200, {'id': c['id'], 'code': code, 'name': c['name']})
        if u.path == '/rest/v1/rpc/join_class':
            b = json.loads(r.post_data); c = next((c for c in self.classes if c['code'] == b['p_code'].strip().upper()), None)
            if not c: return j(400, {'message': 'No class with that code'})
            self.members[:] = [m for m in self.members if not (m['class_id'] == c['id'] and m['user_id'] == me)]
            self.members.append({'class_id': c['id'], 'user_id': me, 'display_name': b['p_name'][:60], 'joined_at': datetime.now(timezone.utc).isoformat()})
            return j(200, {'id': c['id'], 'name': c['name'], 'code': c['code'], 'pack': c['pack']})
        if u.path == '/rest/v1/rpc/delete_my_account':   # the auth user goes; everything referencing it cascades
            self.saves.pop(me, None)
            gone = {c['id'] for c in self.classes if c['teacher'] == me}
            self.classes[:] = [c for c in self.classes if c['id'] not in gone]
            for lst in (self.results, self.ngn, self.ent): lst[:] = [x for x in lst if x['user_id'] != me]
            self.members[:] = [m for m in self.members if m['user_id'] != me and m['class_id'] not in gone]
            self.users = {k: v for k, v in self.users.items() if v[0] != me}; self.deleted = getattr(self, 'deleted', []) + [me]
            return route.fulfill(status=204, body='', headers=CORS)
        if u.path == '/rest/v1/saves':
            if r.method == 'GET':
                want = q.get('user_id', [''])[0].replace('eq.', ''); row = self.saves.get(want) if want == me else None
                return j(200, [row] if row else [])
            body = json.loads(r.post_data)
            if body.get('user_id') != me: return j(403, {'message': 'row level security'})
            self.saves[me] = body; return route.fulfill(status=201, body='', headers=CORS)
        t = u.path.replace('/rest/v1/', '')
        if t not in ('classes', 'class_members', 'results', 'ngn_results', 'entitlements'): return j(404, {'message': 'not found'})
        rows = self.table(t)
        def match(row):
            for k, v in q.items():
                if k in ('select', 'order', 'limit', 'on_conflict'): continue
                v = v[0]
                if v.startswith('eq.') and str(row.get(k)) != v[3:]: return False
                if v.startswith('in.(') and str(row.get(k)) not in v[4:-1].split(','): return False
            return True
        if r.method == 'POST':
            if t not in ('results', 'ngn_results'): return j(403, {'message': 'row level security'})   # entitlements: service role only
            body = json.loads(r.post_data); body = body if isinstance(body, list) else [body]
            if any(x.get('user_id') != me for x in body): return j(403, {'message': 'row level security'})
            for x in body: rows.append(dict(x, id=next(self.n)))
            return route.fulfill(status=201, body='', headers=CORS)
        if r.method == 'DELETE':
            gone = [x for x in rows if match(x) and self.visible(t, x, me) and (t != 'class_members' or x['user_id'] == me or any(c['id'] == x['class_id'] and c['teacher'] == me for c in self.classes))]
            rows[:] = [x for x in rows if x not in gone]; return route.fulfill(status=204, body='', headers=CORS)
        out = [dict(x) for x in rows if match(x) and self.visible(t, x, me)]
        sel = q.get('select', ['*'])[0]
        if t == 'class_members' and 'classes(' in sel:
            for x in out:
                c = next((c for c in self.classes if c['id'] == x['class_id']), None)
                x['classes'] = {k: c[k] for k in ('name', 'code', 'pack')} if c and self.visible('classes', c, me) else None
        if t in ('results', 'ngn_results', 'classes'): out.reverse()   # newest first
        return j(200, out)


def device(b, supa, path='/play/', name='', errs=None, vw=390, extra=None):
    ctx = b.new_context(viewport={'width': vw, 'height': 844}, is_mobile=vw < 600, has_touch=vw < 600)
    if extra: ctx.add_init_script('window.__extraConfig=' + json.dumps(extra) + ';')
    ctx.add_init_script(f"window.Shift=Object.assign(window.Shift||{{}},{{config:Object.assign({{supabaseUrl:'{SUPA}',supabaseKey:'{KEY}',posthogKey:''}},(window.__extraConfig||{{}}))}});")
    ctx.route(SITE + '/**', serve); ctx.route(SUPA + '/**', supa.route)
    pg = ctx.new_page()
    sys.path.insert(0, str(ROOT / 'tests')); from fonts import fontroute; fontroute(pg)
    if errs is not None: pg.on('pageerror', lambda e: errs.append(name + ': ' + str(e)))
    pg.goto(SITE + path); pg.wait_for_timeout(250)
    if path.startswith('/play'):
        pg.evaluate("localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced'},seen:{'coach:station':1,'coach:room':1}}))")
        pg.reload(); pg.wait_for_timeout(250)
    return pg


def signin(pg, tok, path='/play/'):
    pg.goto('about:blank'); pg.goto(SITE + path + f'#access_token={tok}&refresh_token=r1&expires_in=3600&token_type=bearer&type=magiclink'); pg.wait_for_timeout(900)
