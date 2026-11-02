"""Telemetry and feedback, end to end: serves the built game from a fake https site, captures what it sends to a
fake analytics host, plays a short shift and checks the events, the feedback, the opt-out and that nothing is
sent from a local file. Usage: python tests/telemetry.py   (exit 1 on any failure)"""
import sys, json, pathlib, mimetypes
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright

DIST = ROOT / 'dist'
SITE, PH, SB = 'https://play.theshift.test', 'https://ph.theshift.test', 'https://sb.theshift.test'
sent, fails, rows = [], [], []
def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok: fails.append(what)

def serve(route):
    path = route.request.url.split(SITE, 1)[1].split('?')[0]
    f = DIST / path.lstrip('/')
    if f.is_dir() or path.endswith('/'): f = f / 'index.html'
    if not f.exists(): return route.fulfill(status=404, body='nope')
    route.fulfill(status=200, body=f.read_bytes(), content_type=mimetypes.guess_type(str(f))[0] or 'application/octet-stream')

def sbcapture(route):
    if route.request.method == 'OPTIONS': return route.fulfill(status=200, headers={'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'POST'})
    if route.request.url.endswith('/rest/v1/feedback'):
        try: rows.append(json.loads(route.request.post_data or '{}'))
        except Exception as e: fails.append(f'bad feedback row: {e}')
    route.fulfill(status=201, body='', headers={'Access-Control-Allow-Origin': '*'})

def capture(route):
    try: sent.extend(json.loads(route.request.post_data or '{}').get('batch', []))
    except Exception as e: fails.append(f'bad payload: {e}')
    route.fulfill(status=200, body='{"status":1}', content_type='application/json', headers={'Access-Control-Allow-Origin': '*'})

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
    ctx.add_init_script(f"window.Shift={{config:{{posthogKey:'phc_test',posthogHost:'{PH}',supabaseUrl:'{SB}',supabaseKey:'sb_publishable_test'}}}};")
    ctx.route(SITE + '/**', serve); ctx.route(PH + '/**', capture); ctx.route(SB + '/**', sbcapture)
    pg = ctx.new_page(); fontroute(pg)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    # Landing page: a visit from a campaign link, then a signup.
    pg.goto(SITE + '/?utm_source=tiktok&utm_campaign=launch'); pg.wait_for_timeout(300)
    pg.fill('#su-email', 'not-an-email'); pg.click('#signup button[type=submit]')
    check('err' in pg.get_attribute('#su-msg', 'class'), 'signup rejects a bad email')
    pg.fill('#su-email', 'student@example.com'); pg.select_option('#su-role', 'student'); pg.click('#signup button[type=submit]')
    check('on the list' in pg.inner_text('#su-msg'), 'signup confirms')
    pg.evaluate("Shift.tel.flush()"); pg.wait_for_timeout(500)
    lv = next((e for e in sent if e['event'] == 'landing_view'), None)
    check(bool(lv) and lv['properties'].get('first_source') == 'tiktok' and lv['properties'].get('first_campaign') == 'launch', 'landing_view carries the campaign')
    su = next((e for e in sent if e['event'] == 'beta_signup'), None)
    check(bool(su) and su['properties'].get('$set', {}).get('email') == 'student@example.com' and su['properties'].get('role') == 'student', 'signup carries email and role')
    landing_id = lv['properties']['distinct_id'] if lv else None
    pg.goto(SITE + '/privacy/'); check('Turning it off' in pg.content(), 'privacy page is served')
    pg.goto(SITE + '/play/'); pg.wait_for_timeout(300)
    pg.evaluate("localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced'},seen:{'coach:station':1,'coach:room':1}}))")
    pg.reload(); pg.wait_for_timeout(300)
    H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
    check(pg.evaluate("Shift.tel.enabled()"), 'analytics on for a real site with a key')
    H('pick-case', id='medsurg-4w-1'); H('new')
    if pg.evaluate("Shift.ui._ui.intro!==null&&Shift.ui._ui.intro!==undefined"): H('intro-go')
    H('h-done'); H('rank-submit'); H('rank-go'); H('endask'); H('end-yes')
    check(pg.evaluate("Shift.ui._ui.view") == 'debrief', 'reached the debrief')
    # Debrief feedback: type, choose, send.
    check(pg.get_attribute('[data-act="fb-send"]', 'aria-disabled') == 'true', 'feedback waits for an answer')
    H('fb-q', k='level', v='hard'); check(pg.get_attribute('[data-act="fb-send"]', 'aria-disabled') is None, 'one tap is enough to send')
    H('fb-q', k='nclex', v='yes'); pg.fill('#fb-note', 'Room 412 potassium timing felt off'); H('fb-pay', v='yes'); H('fb-send')
    check(pg.locator('.fbk.sent').count() == 1, 'feedback card shows thanks after sending')
    # Report a problem on one decision.
    jk = pg.evaluate("(()=>{const j=Shift.ui._state().judg[0];return j?[j.key||'',String(j.t)]:null})()")
    if jk:
        H('rpt', k=jk[0], t=jk[1]); H('rpt-why', v='clinical'); pg.fill('#rp-note', 'Expected a call to the provider first'); H('rpt-send')
    pg.evaluate("Shift.tel.flush()"); pg.wait_for_timeout(600)
    names = [e['event'] for e in sent]
    for ev in ['app_open', 'shift_start', 'report_done', 'triage_ranked', 'shift_complete']:
        check(ev in names, f'sent {ev}')
    fb = [e for e in sent if e['event'] == 'feedback']
    deb = [e for e in fb if e['properties'].get('kind') == 'debrief']
    check(bool(deb) and deb[0]['properties'].get('would_pay') == 'yes' and 'potassium' in deb[0]['properties'].get('note', ''), 'debrief feedback carries the answers')
    check(bool(deb) and deb[0]['properties'].get('difficulty') == 'hard' and deb[0]['properties'].get('helps_nclex') == 'yes', 'debrief feedback carries the one-tap answers')
    if jk: check(any(e['properties'].get('kind') == 'decision' and e['properties'].get('problem') == 'clinical' for e in fb), 'decision report carries its reason')
    drow = next((r for r in rows if r.get('kind') == 'debrief'), {})
    check(drow.get('shift') == 'medsurg-4w-1' and drow.get('difficulty') == 'hard' and drow.get('helps_nclex') == 'yes' and drow.get('would_pay') == 'yes' and 'potassium' in (drow.get('note') or ''), 'debrief feedback is stored as an exportable row')
    check(drow.get('source') == 'tiktok' and isinstance(drow.get('score'), int) and len(drow.get('install_id', '')) > 10, 'the stored row has the campaign, score and anonymous id')
    if jk: check(any(r.get('kind') == 'decision' and r.get('problem') == 'clinical' and (r.get('details') or {}).get('decision_text') for r in rows), 'decision reports are stored with the decision they are about')
    check(all(e['properties'].get('first_source') == 'tiktok' for e in sent if e['event'] == 'shift_complete'), 'shifts are credited to the campaign that brought the player')
    ids = {e['properties'].get('distinct_id') for e in sent}
    check(landing_id in ids, 'landing visit and shifts share one id')
    check(len(ids) == 1 and all(len(i) > 10 for i in ids), 'one anonymous id per install')
    comp = next((e for e in sent if e['event'] == 'shift_complete'), {'properties': {}})['properties']
    check(comp.get('case') == 'medsurg-4w-1' and isinstance(comp.get('score'), int), 'shift_complete has case and score')
    check(not any('@' in json.dumps(e) for e in sent if e['event'] not in ('feedback', 'beta_signup')), 'no email addresses in usage events')
    # Opt out: nothing more is sent, and the queue is dropped.
    n0 = len(sent)
    pg.evaluate("Shift.tel.setOptOut(true); Shift.tel.track('should_not_send',{}); Shift.tel.flush()"); pg.wait_for_timeout(400)
    check(len(sent) == n0, 'opted out: nothing sent')
    pg.evaluate("Shift.tel.setOptOut(false)")
    # Leaving mid-shift records where the player stopped.
    H('home'); H('new');
    if pg.evaluate("Shift.ui._ui.intro!==null&&Shift.ui._ui.intro!==undefined"): H('intro-go')
    pg.evaluate("dispatchEvent(new PageTransitionEvent('pagehide'))"); pg.wait_for_timeout(500)
    check(any(e['event'] == 'shift_left' and e['properties'].get('view') == 'handoff' for e in sent), 'shift_left records the screen the player left on')
    check(not errs, 'no page errors' + (': ' + errs[0][:200] if errs else ''))
    # Local file: never sends.
    n1 = len(sent)
    pg2 = ctx.new_page(); pg2.goto((DIST / 'the-shift.html').as_uri()); pg2.wait_for_timeout(300)
    check(not pg2.evaluate("Shift.tel.enabled()"), 'off when opened from a file')
    pg2.evaluate("Shift.tel.track('x',{}); Shift.tel.flush()"); pg2.wait_for_timeout(300)
    check(len(sent) == n1, 'nothing sent from a file')
    b.close()
print('TELEMETRY ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
