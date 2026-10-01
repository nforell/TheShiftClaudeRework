"""First-player clarity (from beta feedback): the station says what it is, Nova and the aide are always in the
header as people with a label, the aide leads with at most three suggestions and folds the rest, and a talk
bubble by the bed opens the conversation. Every shift, phone and desktop. Usage: python tests/clarity.py"""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri(); fails = []
def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok: fails.append(what)
with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    for vw in (390, 1280):
        pg = b.new_page(viewport={'width': vw, 'height': 844}); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
        pg.goto(GAME); pg.evaluate("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced'},seen:{'coach:station':1,'coach:room':1,tour:1}}))"); pg.reload(); pg.wait_for_timeout(300)
        H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
        for case in pg.evaluate("Object.keys(Shift.engine.cases)"):
            t = f'{vw}px {case}:'
            H('home'); H('pick-case', id=case); H('new')
            if pg.evaluate("Shift.ui._ui.ov") == 'confirm': H('new-yes')
            if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
            H('h-done'); H('rank-submit'); H('rank-go'); pg.wait_for_timeout(150)
            check(pg.locator('.st-intro h1').inner_text() == "Nurses' station" and 'Nurses\' station' in pg.inner_text('.ps-st'), f'{t} the station names itself')
            check(pg.locator('.helpers [data-act=nova]').count() == 1 and pg.locator('.helpers [data-act=delegate]').count() == 1 and pg.locator('.helpers svg').count() == 2, f'{t} Nova and the aide are in the header, with faces')
            H('delegate'); pg.wait_for_timeout(100)
            n = pg.locator('.dl-s').count(); folded = pg.locator('details.dl-all').count() == 1
            check(n <= 3 and folded and pg.locator('.dl-who').count() == 1, f'{t} the aide leads with {n} suggestion(s), the rest folded')
            if n:
                pg.locator('.dl-s').first.click(); pg.wait_for_timeout(150)
                check(pg.evaluate("Shift.ui._state().deleg.length") >= 1, f'{t} a suggestion can be sent in one tap')
            H('close'); pid = pg.evaluate("Shift.ui._state() && Object.keys(Shift.ui._state().p).find(k=>{const d=Shift.engine.getCase(Shift.ui._state().caseId).patients.find(x=>x.id===k);return !d.arrives})")
            H('goto', pid=pid); pg.wait_for_timeout(200)
            bub = pg.locator('.talk-bub')
            check(bub.count() == 1 and bub.is_visible(), f'{t} a talk bubble is in the room')
            box, scene = bub.bounding_box(), pg.locator('.room-top svg').first.bounding_box()
            check(box and scene and box['x'] >= scene['x'] - 1 and box['x'] + box['width'] <= scene['x'] + scene['width'] + 1 and box['y'] >= scene['y'] - 1 and box['y'] + box['height'] <= scene['y'] + scene['height'] + 1, f'{t} the bubble sits inside the scene')
            bub.click(); pg.wait_for_timeout(150)
            check(pg.evaluate("Shift.ui._ui.dock") == 'talk', f'{t} the bubble opens Talk')
            H('nova'); check('Get a tip' in pg.inner_text('.sheet') and 'charge nurse' in pg.inner_text('.sheet'), f'{t} Nova explains what she\'s for'); H('close')
            H('endask'); H('end-yes'); pg.wait_for_timeout(200)
    check(not errs, 'no page errors' + (': ' + errs[0] if errs else ''))
    b.close()
print('CLARITY ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
