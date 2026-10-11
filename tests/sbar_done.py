"""SBAR reflects what the nurse already did: an action taken in the room shows up under "What you've already
done" on the next call, in the past tense, and the provider's reply acknowledges it."""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri(); fails = []
def check(ok, msg): print(('ok   ' if ok else 'FAIL ') + msg); ok or fails.append(msg)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 390, 'height': 844}); fontroute(pg); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
    pg.goto(GAME); pg.evaluate("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({terms:'9999',runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced'},seen:{'coach:station':1,'coach:room':1,tour:1}}))"); pg.reload(); pg.wait_for_timeout(300)
    H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
    def clr():
        for _ in range(4):
            ov = pg.evaluate("Shift.ui._ui.ov")
            if ov == 'crit': H('crit-x')
            elif ov == 'result': H('res-close')
            elif ov: H('close')
    H('pick-case', id='medsurg-4w-1'); H('new')
    if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
    H('h-done'); H('rank-submit'); H('rank-go'); clr()
    H('sbar', pid='416'); check(pg.locator('.sbar-did').count() == 0, 'nothing done yet: no done section'); H('close')
    H('goto', pid='416'); clr(); H('int', id='fall'); clr()
    H('med', id='416-lis'); H('hreason', v='1'); H('med-hold'); clr()
    H('sbar', pid='416'); txt = pg.inner_text('.sbar-did') if pg.locator('.sbar-did').count() else ''
    check('Started fall precautions' in txt, 'an intervention appears in the past tense')
    check('Held lisinopril' in txt, 'a held medication appears')
    ids = pg.evaluate("[...document.querySelectorAll('.sbar-did input')].map(x=>x.dataset.id)")
    for i in ids: H('sbar-pick', id=i)
    H('sbar-pick', id='vit'); H('sbar-req', id='fyi'); H('sbar-send'); pg.wait_for_timeout(150)
    rep = pg.inner_text('.reply'); check('Good to know' in rep and 'fall precautions' in rep, 'the reply acknowledges what was done')
    check(not errs, 'no page errors' + (': ' + errs[0] if errs else ''))
print('SBAR-DONE ' + ('CLEAN' if not fails else 'FAILED'))
sys.exit(1 if fails else 0)
