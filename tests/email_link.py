"""The branded sign-in email: its link opens the game with a one-time token_hash, which the game trades for a session
(no supabase.co link in the email). Also: a used or expired link explains itself, sending errors are in plain words,
and the email copies to the developer (config.notify) go out only when turned on.
Usage: python tests/email_link.py  (exit 1 on failure)"""
import sys, json, pathlib, mimetypes, urllib.parse as up
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright

DIST = ROOT / 'dist'
SITE, SUPA, KEY, PH = 'https://play.theshift.test', 'https://supa.theshift.test', 'sb_publishable_test', 'https://ph.theshift.test'
fails = []
def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok: fails.append(what)
CORS = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'}
db = {'verify': [], 'notify': [], 'otp_reply': (200, {})}

def serve(route):
    path = route.request.url.split(SITE, 1)[1].split('?')[0].split('#')[0]
    f = DIST / path.lstrip('/')
    if f.is_dir() or path.endswith('/'): f = f / 'index.html'
    if not f.exists(): return route.fulfill(status=404, body='nope')
    route.fulfill(status=200, body=f.read_bytes(), content_type=mimetypes.guess_type(str(f))[0] or 'application/octet-stream')

def supa(route):
    r = route.request
    if r.method == 'OPTIONS': return route.fulfill(status=204, headers=CORS)
    u = up.urlparse(r.url)
    j = lambda code, body: route.fulfill(status=code, body=json.dumps(body), content_type='application/json', headers=CORS)
    if u.path == '/auth/v1/verify':
        b = json.loads(r.post_data); db['verify'].append(b)
        if b.get('token_hash') == 'good' and r.method == 'POST':
            return j(200, {'access_token': 't1', 'refresh_token': 'r1', 'expires_in': 3600, 'user': {'id': 'u1', 'email': 'nurse@example.com'}})
        return j(403, {'code': 403, 'error_code': 'otp_expired', 'msg': 'Email link is invalid or has expired'})
    if u.path == '/auth/v1/user':
        return j(200, {'id': 'u1', 'email': 'nurse@example.com'}) if 'Bearer t1' in (r.headers.get('authorization') or '') else j(401, {'msg': 'bad jwt'})
    if u.path == '/auth/v1/otp': return j(*db['otp_reply'])
    if u.path == '/rest/v1/saves': return j(200, []) if r.method == 'GET' else route.fulfill(status=201, body='', headers=CORS)
    if u.path == '/rest/v1/entitlements': return j(200, [])
    if u.path == '/functions/v1/notify': db['notify'].append(json.loads(r.post_data)); return j(200, {'ok': True})
    j(200, [])

with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    def device(notify=False):
        ctx = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
        ctx.add_init_script(f"window.Shift={{config:{{supabaseUrl:'{SUPA}',supabaseKey:'{KEY}',posthogKey:'phc_test',posthogHost:'{PH}',notify:{'true' if notify else 'false'}}}}};"
                            "try{if(!localStorage.getItem('theshift.profile.v1'))localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced'},seen:{'coach:station':1,'coach:room':1}}));}catch(e){}")
        ctx.route(SITE + '/**', serve); ctx.route(SUPA + '/**', supa)
        ctx.route(PH + '/**', lambda r: r.fulfill(status=200, body='{}', headers=CORS))
        pg = ctx.new_page(); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)))
        return pg
    H = lambda pg, a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])

    # The branded email's link: /play/#token_hash=…&type=email
    A = device(); A.goto(SITE + '/play/#token_hash=good&type=email'); A.wait_for_timeout(1200)
    check(db['verify'] and db['verify'][0] == {'type': 'email', 'token_hash': 'good'}, 'the game trades the token_hash for a session')
    check('token_hash' not in A.url, 'the token is cleared from the address bar')
    check(A.evaluate("Shift.cloud.user() && Shift.cloud.user().email") == 'nurse@example.com', 'signed in from the branded link')
    check('Signed in as nurse@example.com' in A.content(), 'says who is signed in')

    # The same link opened again (or prefetched and used): a clear message, not a raw error.
    Bp = device(); Bp.goto(SITE + '/play/#token_hash=used&type=email'); Bp.wait_for_timeout(1200)
    check(not Bp.evaluate("!!Shift.cloud.user()"), 'a used link does not sign in')
    check(Bp.evaluate("Shift.ui._ui.ov") == 'account' and 'expired or was already used' in Bp.content(), 'a used link opens the sign-in sheet and says why')
    # Supabase's own error redirect gets the same words.
    Bp.goto('about:blank'); Bp.goto(SITE + '/play/#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired'); Bp.wait_for_timeout(1000)
    check('expired or was already used' in Bp.content(), 'Supabase\'s expired-link redirect is explained too')

    # Sending: the address isn't allowed yet (Supabase's test mailer), and too many emails.
    def send(pg):
        H(pg, 'account'); pg.fill('#acct-email', 'nurse@example.com'); H(pg, 'acct-send'); pg.wait_for_timeout(500)
        return pg.locator('.acct-err').inner_text() if pg.locator('.acct-err').count() else ''
    db['otp_reply'] = (400, {'code': 400, 'error_code': 'email_address_not_authorized', 'msg': 'Email address not authorized'})
    C = device(); C.goto(SITE + '/play/'); C.wait_for_timeout(600)
    check('aren\'t open to everyone yet' in send(C), 'an unauthorized address gets a plain explanation')
    db['otp_reply'] = (429, {'code': 429, 'error_code': 'over_email_send_rate_limit', 'msg': 'email rate limit exceeded'})
    H(C, 'close'); check('Too many sign-in emails' in send(C), 'the email rate limit gets a plain explanation')
    db['otp_reply'] = (200, {})
    H(C, 'close'); send(C); check('Check your email' in C.content(), 'a normal send still says check your email')

    # Email copies: off by default, on with config.notify.
    C.evaluate("Shift.tel.feedback('question', {question_id:'q1', problem:'wrong answer', note:'x'})"); C.wait_for_timeout(300)
    check(db['notify'] == [], 'no email copy while notify is off')
    D = device(notify=True); D.goto(SITE + '/play/'); D.wait_for_timeout(600)
    D.evaluate("Shift.tel.feedback('question', {question_id:'q1', problem:'wrong answer', flagged:'[]', text:'x'.repeat(90000)})"); D.wait_for_timeout(400)
    n = db['notify'][-1] if db['notify'] else {}
    check(n.get('kind') == 'question' and n.get('fields', {}).get('question_id') == 'q1', 'a report is copied to the notify function')
    check('flagged' not in n.get('fields', {}) and len(n.get('fields', {}).get('text', '')) <= 45000, 'the copy is trimmed to fit')
    L = device(notify=True); L.goto(SITE + '/'); L.wait_for_timeout(500)
    L.evaluate("Shift.tel.signup('new@example.com','Student')"); L.wait_for_timeout(300)
    check(db['notify'] and db['notify'][-1].get('kind') == 'signup' and db['notify'][-1]['fields'].get('email') == 'new@example.com', 'a beta signup is copied too')
    check(not errs, 'no page errors: ' + '; '.join(errs[:3]))
    b.close()

# The templates link to the game, never to supabase.co.
for f in (ROOT / 'supabase' / 'email-templates').glob('*.html'):
    t = f.read_text()
    check('{{ .RedirectTo }}#token_hash={{ .TokenHash }}&type=email' in t and 'ConfirmationURL' not in t and 'supabase.co' not in t, f'{f.name} links to the game with a token_hash')
print('EMAIL-LINK', 'CLEAN' if not fails else 'FAILED: ' + '; '.join(fails))
sys.exit(1 if fails else 0)
