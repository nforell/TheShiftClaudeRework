"""Accounts and cloud saves, end to end against a stand-in for Supabase's auth and REST APIs: email link, coming
back signed in, first upload, merging two devices' progress, picking up a shift on a third device, token refresh,
sign out, and that nothing shows when accounts aren't configured. The shift in progress syncs to shift_snapshots on
its own debounced clock, never inside the profile row, and isn't re-sent unchanged; without that table it falls back
to saves.game. Usage: python tests/cloud.py  (exit 1 on failure)"""
import sys, json, pathlib, mimetypes, urllib.parse as up
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright

DIST = ROOT / 'dist'
SITE, SUPA, KEY = 'https://play.theshift.test', 'https://supa.theshift.test', 'sb_publishable_test'
fails = []
def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok: fails.append(what)

db = {'rows': {}, 'snaps': {}, 'snap_on': True, 'posts': [], 'otp': [], 'tokens': {'t1': 'u1', 't2': 'u1', 't3': 'u1'}, 'refreshed': 0, 'bad_auth': 0}
CORS = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'}

def serve(route):
    path = route.request.url.split(SITE, 1)[1].split('?')[0].split('#')[0]
    f = DIST / path.lstrip('/')
    if f.is_dir() or path.endswith('/'): f = f / 'index.html'
    if not f.exists(): return route.fulfill(status=404, body='nope')
    route.fulfill(status=200, body=f.read_bytes(), content_type=mimetypes.guess_type(str(f))[0] or 'application/octet-stream')

def supa(route):
    r = route.request
    if r.method == 'OPTIONS': return route.fulfill(status=204, headers=CORS)
    u = up.urlparse(r.url); q = up.parse_qs(u.query); h = r.headers
    if h.get('apikey') != KEY: return route.fulfill(status=401, body='{"message":"no apikey"}', headers=CORS)
    j = lambda code, body: route.fulfill(status=code, body=json.dumps(body), content_type='application/json', headers=CORS)
    uid = db['tokens'].get((h.get('authorization') or '').replace('Bearer ', ''))
    if u.path == '/auth/v1/otp':
        db['otp'].append({'body': json.loads(r.post_data), 'redirect_to': q.get('redirect_to', [''])[0]}); return j(200, {})
    if u.path == '/auth/v1/user':
        return j(200, {'id': uid, 'email': 'nurse@example.com'}) if uid else j(401, {'msg': 'bad jwt'})
    if u.path == '/auth/v1/token':
        db['refreshed'] += 1; db['tokens']['t9'] = 'u1'
        return j(200, {'access_token': 't9', 'refresh_token': 'r9', 'expires_in': 3600, 'user': {'id': 'u1', 'email': 'nurse@example.com'}})
    if u.path in ('/rest/v1/saves', '/rest/v1/shift_snapshots'):
        snap = u.path.endswith('shift_snapshots'); tbl = db['snaps' if snap else 'rows']
        if snap and not db['snap_on']: return j(404, {'code': 'PGRST205', 'message': "Could not find the table 'public.shift_snapshots'"})
        if not uid: db['bad_auth'] += 1; return j(401, {'message': 'JWT invalid'})
        if r.method == 'GET':
            want = q.get('user_id', [''])[0].replace('eq.', '')
            row = tbl.get(want) if want == uid else None   # row level security
            return j(200, [row] if row else [])
        body = json.loads(r.post_data)
        if body.get('user_id') != uid: return j(403, {'message': 'row level security'})
        check('merge-duplicates' in (h.get('prefer') or ''), 'upsert asks Supabase to merge, not duplicate')
        db['posts'].append(('snap' if snap else 'saves', sorted(body)))
        tbl[uid] = dict(tbl.get(uid) or {}, **body); return route.fulfill(status=201, body='', headers=CORS)   # merge-duplicates updates only the columns sent
    j(404, {'message': 'not found'})

with sync_playwright() as p:
    b = p.chromium.launch()
    errs = []
    def device(name):
        ctx = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
        ctx.add_init_script(f"window.Shift={{config:{{supabaseUrl:'{SUPA}',supabaseKey:'{KEY}',posthogKey:''}}}};")
        ctx.route(SITE + '/**', serve); ctx.route(SUPA + '/**', supa)
        pg = ctx.new_page(); fontroute(pg); pg.on('pageerror', lambda e: errs.append(name + ': ' + str(e)))
        pg.goto(SITE + '/play/'); pg.wait_for_timeout(250)
        pg.evaluate("localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced'},seen:{'coach:station':1,'coach:room':1}}))")
        pg.reload(); pg.wait_for_timeout(250)
        return pg
    def H(pg, a, **kw): return pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
    def play(pg, case):
        H(pg, 'pick-case', id=case); H(pg, 'new')
        if pg.evaluate("Shift.ui._ui.intro!=null"): H(pg, 'intro-go')
        H(pg, 'h-done'); H(pg, 'rank-submit'); H(pg, 'rank-go'); H(pg, 'endask'); H(pg, 'end-yes'); H(pg, 'home')
    def signin(pg, tok):
        pg.goto('about:blank'); pg.goto(SITE + f'/play/#access_token={tok}&refresh_token=r1&expires_in=3600&token_type=bearer&type=magiclink'); pg.wait_for_timeout(900)
    runs = lambda pg: pg.evaluate("JSON.parse(localStorage.getItem('theshift.profile.v1')).runs.map(r=>r.caseId).sort()")

    # Device A: play, then ask for a link.
    A = device('A'); play(A, 'medsurg-4w-1')
    check(A.locator('[data-act=account].acct-link').inner_text() == 'Save your progress', 'home offers to save progress')
    H(A, 'account'); A.fill('#acct-email', 'nope'); H(A, 'acct-send'); A.wait_for_timeout(100)
    check(A.locator('.acct-err').count() == 1, 'rejects a bad email')
    A.fill('#acct-email', 'nurse@example.com'); H(A, 'acct-send'); A.wait_for_timeout(400)
    check(len(db['otp']) == 1 and db['otp'][0]['body'].get('email') == 'nurse@example.com', 'asked Supabase to email a link')
    check(db['otp'] and db['otp'][0]['redirect_to'] == SITE + '/play/', 'link comes back to the game')
    check('Check your email' in A.content(), 'shows check-your-email')
    # The link brings them back signed in; local progress uploads.
    signin(A, 't1')
    check('access_token' not in A.url, 'tokens removed from the address bar')
    check(A.evaluate("!!Shift.cloud.user()") and A.locator('[data-act=account].acct-link').inner_text() == 'Saved to your account', 'signed in after the link')
    row = db['rows'].get('u1') or {}
    check([r['caseId'] for r in row.get('profile', {}).get('runs', [])] == ['medsurg-4w-1'], 'first sign-in uploads this device\'s progress')

    # Device B has its own progress; signing in merges both.
    B = device('B'); play(B, 'psych-3e-1'); signin(B, 't2')
    check(runs(B) == ['medsurg-4w-1', 'psych-3e-1'], 'second device merges in the first device\'s shifts')
    check(sorted(r['caseId'] for r in db['rows']['u1']['profile']['runs']) == ['medsurg-4w-1', 'psych-3e-1'], 'cloud row holds both devices\' shifts')
    check(B.evaluate("Shift.ui._ui.view") == 'home' and 'Shifts completed: 2' in B.content(), 'home shows merged progress')
    H(A, 'account'); H(A, 'acct-sync'); A.wait_for_timeout(600)
    check(runs(A) == ['medsurg-4w-1', 'psych-3e-1'], 'first device picks up the second device\'s shift on sync')

    # A shift in progress on B continues on a new device C.
    H(B, 'pick-case', id='peds-5s-1'); H(B, 'new')
    if B.evaluate("Shift.ui._ui.intro!=null"): H(B, 'intro-go')
    H(B, 'h-done'); H(B, 'rank-submit'); H(B, 'rank-go')
    # Debounced: actions mid-shift don't upload right away; the shift goes up on its own, apart from the profile.
    n0 = len(db['posts']); B.evaluate("Shift.engine.store.save(Shift.ui._state())"); B.wait_for_timeout(700)
    check(len(db['posts']) == n0, 'an action mid-shift does not upload at once (debounced)')
    w = B.evaluate("Shift.cloud._sync().waits"); check(w['GAME_WAIT'] >= 30000 and w['GAME_MAX'] >= w['GAME_WAIT'], f'shift snapshot waits for a pause, with a cap ({w})')
    B.evaluate("Shift.cloud.sync()"); B.wait_for_timeout(600)
    check(((db['snaps'].get('u1') or {}).get('game') or {}).get('caseId') == 'peds-5s-1', 'shift in progress is saved to the cloud, in shift_snapshots')
    check(db['snaps']['u1'].get('case_id') == 'peds-5s-1' and isinstance(db['snaps']['u1'].get('game_min'), int), 'the snapshot row names the shift and its minute')
    check(all('game' not in keys for t, keys in db['posts'] if t == 'saves'), 'profile uploads never carry the shift in progress')
    n1 = len(db['posts']); B.evaluate("Shift.cloud.pushGame()"); B.wait_for_timeout(300)
    check(len(db['posts']) == n1, 'an unchanged shift is not uploaded again')
    B.evaluate("(()=>{const s=Shift.ui._state(); s.t+=1; Shift.engine.store.save(s)})()"); B.evaluate("Shift.cloud.pushGame()"); B.wait_for_timeout(300)
    check(len(db['posts']) == n1 + 1 and db['posts'][-1][0] == 'snap', 'a changed shift uploads only its snapshot')
    C = device('C'); signin(C, 't3')
    check('Resume' in C.content() and C.evaluate("Shift.ui._state() && Shift.ui._state().caseId") == 'peds-5s-1', 'a new device can resume that shift')
    # An older database without shift_snapshots: the shift goes to saves.game, as before.
    db['snap_on'] = False; B.reload(); B.wait_for_timeout(900)
    B.evaluate("(()=>{const s=Shift.ui._state(); s.t+=2; Shift.engine.store.save(s)})()"); B.evaluate("Shift.cloud.pushGame()"); B.wait_for_timeout(400)
    check(((db['rows']['u1'].get('game') or {}).get('caseId')) == 'peds-5s-1' and db['rows']['u1'].get('profile'), 'without shift_snapshots the shift falls back to saves.game, profile kept')
    db['snap_on'] = True

    # Expired token refreshes; sign out forgets the session but keeps progress on the device.
    C.evaluate("(()=>{const s=JSON.parse(localStorage.getItem('theshift.auth.v1'));s.expires_at=Date.now()-1000;localStorage.setItem('theshift.auth.v1',JSON.stringify(s))})()")
    C.reload(); C.wait_for_timeout(800)
    check(db['refreshed'] >= 1 and C.evaluate("Shift.cloud.status().state") == 'in', 'expired session refreshes itself')
    H(C, 'account'); H(C, 'acct-out'); C.wait_for_timeout(200)
    check(C.evaluate("!Shift.cloud.user() && !localStorage.getItem('theshift.auth.v1')"), 'sign out forgets the session')
    check(len(runs(C)) == 2, 'sign out keeps progress on this device')
    check(db['bad_auth'] == 0, 'never called the database without a valid session')

    # A rejected link (expired) explains itself.
    D = device('D'); D.goto('about:blank'); D.goto(SITE + '/play/#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired'); D.wait_for_timeout(600)
    check(D.evaluate("Shift.ui._ui.ov") == 'account' and 'expired' in D.content(), 'an expired link opens sign-in with the reason')

    # Not configured: no account UI at all.
    E = b.new_page(); E.goto((DIST / 'the-shift.html').as_uri()); E.wait_for_timeout(300)
    check(E.locator('[data-act=account]').count() == 0, 'no account button when opened from a file')
    check(not errs, 'no page errors' + (': ' + errs[0][:200] if errs else ''))
    b.close()
print('CLOUD ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
