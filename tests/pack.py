"""The shift pack: with it switched on, the free shifts play and the rest show as in the pack; starting one offers
the pack; buying needs an account and sends the player's id to Stripe; after the webhook records the purchase the
game unlocks on return; a class with a school license unlocks too; signing out locks again; switched off, nothing
is locked; no secret key anywhere in what's published. Usage: python tests/pack.py"""
import sys, json, pathlib, urllib.parse as up
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from standin import Supa, device, signin, SITE
from playwright.sync_api import sync_playwright
fails = []
def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok: fails.append(what)
OUT = ROOT / 'tests' / 'out'; OUT.mkdir(exist_ok=True)
BUY = 'https://buy.stripe.test/test_abc'
PACK = {'pack': {'on': True, 'free': ['medsurg-4w-1', 'medsurg-4w-2', 'psych-3e-1'], 'price': '$12', 'checkoutUrl': BUY}}
db = Supa(); db.user('p1', 'u-pat', 'pat@example.com'); db.user('s1', 'u-sam', 'sam@school.edu'); db.user('tt', 'u-teach', 'prof@school.edu')
def H(pg, a, **kw): return pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
lockedN = lambda pg: (H(pg, 'shifts'), pg.locator('.sc-pick.in-pack').count())[1]   # counted on the Full shifts screen

with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    went = []
    A = device(b, db, '/play/', 'pat', errs, extra=PACK)
    A.context.route('https://buy.stripe.test/**', lambda r: (went.append(r.request.url), r.fulfill(status=200, body='<h1>Stripe stand-in</h1>', content_type='text/html')))
    H(A, 'shifts'); A.wait_for_timeout(150)   # the shift cards live on the Full shifts screen
    NPACK = A.locator('.sc-pick[data-id]').count() - 3
    check(NPACK >= 4 and lockedN(A) == NPACK, f'every shift but the free three is in the pack ({lockedN(A)} of {NPACK})')
    check(A.locator('.sc-pick[data-id]:not(.in-pack)').count() == 3, 'three shifts are free')
    H(A, 'pick-case', id='medsurg-4w-1'); H(A, 'new')
    check(A.evaluate("Shift.ui._ui.view") == 'handoff', 'a free shift starts')
    H(A, 'home'); H(A, 'pick-case', id='stepdown-6e-1')
    check('Unlock with the shift pack' in A.inner_text('.sc.on .sc-cta'), 'a pack shift can be previewed, and offers the pack')
    H(A, 'new'); A.wait_for_timeout(150)
    check(A.evaluate("Shift.ui._ui.ov") == 'pack' and A.evaluate("Shift.ui._ui.view") == 'shifts', 'starting a pack shift opens the pack instead')
    txt = A.inner_text('.sheet')
    check('3 shifts are free' in txt and f'other {NPACK}' in txt and '$12' in txt and 'Days on 6 East' in txt, 'the pack says what it opens and the price')
    check('Sign in to buy' in txt, 'buying asks to sign in first')
    A.screenshot(path=str(OUT / 'pack-signed-out.png'))

    signin(A, 'p1'); H(A, 'pick-case', id='stepdown-6e-1'); H(A, 'new'); A.wait_for_timeout(150)
    check(A.locator('[data-act=pack-buy]').inner_text() == 'Unlock for $12', 'signed in, the pack can be bought')
    A.screenshot(path=str(OUT / 'pack-buy.png'))
    H(A, 'pack-buy'); A.wait_for_timeout(600)
    q = up.parse_qs(up.urlparse(went[0]).query) if went else {}
    check(went and went[0].startswith(BUY) and q.get('client_reference_id') == ['u-pat'] and q.get('prefilled_email') == ['pat@example.com'], 'checkout gets the player\'s id and email')

    # Stripe's webhook records the purchase; the player comes back to the game.
    db.ent.append({'user_id': 'u-pat', 'product': 'pack', 'source': 'stripe', 'ref': 'pi_1'})
    A.goto(SITE + '/play/?pack=thanks'); A.wait_for_timeout(1500)
    check('?pack' not in A.url, 'return address is cleaned up')
    check('Shift pack unlocked' in A.content(), 'coming back from checkout shows the unlock')
    H(A, 'close'); check(lockedN(A) == 0, 'every shift is open after buying')
    H(A, 'pick-case', id='stepdown-6e-1'); H(A, 'new')
    if A.evaluate("Shift.ui._ui.ov") == 'confirm': H(A, 'new-yes')
    check(A.evaluate("Shift.ui._ui.view") == 'handoff', 'a pack shift starts after buying')
    H(A, 'home')
    r = A.evaluate(f"fetch('{db and 'https://supa.theshift.test'}/rest/v1/entitlements',{{method:'POST',headers:{{apikey:Shift.config.supabaseKey,'Content-Type':'application/json',Authorization:'Bearer p1'}},body:JSON.stringify({{user_id:'u-pat',product:'pack2'}})}}).then(r=>r.status)")
    check(r == 403, 'a player can\'t write a purchase themselves')
    H(A, 'account'); H(A, 'acct-out'); A.wait_for_timeout(200)
    check(lockedN(A) == NPACK, 'signing out locks the pack again on this device')

    # A school license: the class has pack = true.
    T = device(b, db, '/teach/', 'teach', errs, vw=1280); signin(T, 'tt', '/teach/')
    T.fill('#cn', 'School cohort'); T.click('form[data-form=make] button'); T.wait_for_timeout(600)
    db.classes[-1]['pack'] = True; code = db.classes[-1]['code']
    B = device(b, db, '/play/', 'sam', errs, extra=PACK); signin(B, 's1')
    check(lockedN(B) == NPACK, 'a student not yet in a licensed class sees the pack')
    H(B, 'cls'); B.wait_for_timeout(300); B.fill('#cls-code', code); B.fill('#cls-name', 'Sam Lee'); H(B, 'cls-join'); B.wait_for_timeout(800)
    check('Every shift is open to you' in B.content(), 'joining a licensed class says every shift opens')
    H(B, 'close'); check(lockedN(B) == 0, 'a licensed class unlocks every shift')
    H(B, 'pack'); check('through your class' in B.inner_text('.sheet'), 'the pack says it came through the class')

    # Switched off (the default): nothing locked.
    C = device(b, db, '/play/', 'off', errs)
    check(lockedN(C) == 0 and C.evaluate("!Shift.config.pack.on"), 'with the pack off, nothing is locked')

    # Nothing secret is published.
    leaks = [str(f.relative_to(ROOT)) for f in (ROOT / 'dist').rglob('*') if f.is_file() and f.suffix in ('.html', '.js', '.json', '.webmanifest') and any(k in f.read_text(errors='ignore') for k in ('sb_secret_', 'SUPABASE_SERVICE_ROLE_KEY', 'whsec_', 'sk_live_', 'sk_test_'))]
    check(not leaks, 'no secret keys in anything published' + (': ' + ', '.join(leaks) if leaks else ''))
    check('SECRET KEY SEEN' not in db.log, 'no secret key ever reaches Supabase from a page')
    check(not errs, 'no page errors' + (': ' + errs[0][:300] if errs else ''))
    b.close()
print('PACK ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
