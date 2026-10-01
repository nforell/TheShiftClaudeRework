"""The guided first room: a brand-new player is walked through looking at the patient, opening Assess, taking
vitals, reading findings, opening the chart and the rest of the room, each "do" step advancing only when they do it.
Checks it never shows again once finished or skipped, and fits on a phone. Usage: python tests/guide.py"""
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
    for W in (390, 1280):
        pg = b.new_page(viewport={'width': W, 'height': 844 if W < 600 else 900}); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(GAME); pg.evaluate("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced'},seen:{'coach:station':1}}))"); pg.reload(); pg.wait_for_timeout(300)
        H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
        step = lambda: pg.evaluate("Shift.ui._ui.coachStep&&Shift.ui._ui.coachStep.room||0")
        card = lambda: pg.locator('.coach').inner_text() if pg.locator('.coach').count() else ''
        H('new')
        if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
        H('h-done'); H('rank-submit'); H('rank-go'); pid = pg.evaluate("Shift.ui._state().answers.rank[0]")
        H('goto', pid=pid); pg.wait_for_timeout(250)
        check('Tap the patient' in card() and 'highlighted spot' in card(), f'{W}px: tour starts at the patient with a do-it step')
        if W < 600:
            box = pg.locator('.coach').bounding_box(); check(box and box['x'] >= 0 and box['x'] + box['width'] <= W, f'{W}px: tour card fits the screen')
        t0 = pg.evaluate("Shift.ui._state().t")
        H('poke'); pg.wait_for_timeout(150)
        check(pg.evaluate("Shift.ui._state().t") == t0, f'{W}px: looking at the patient costs no time')
        H('dock', id='brain'); pg.wait_for_timeout(100)
        check(step() == 1 and 'Open Assess' in card(), f'{W}px: advances to Assess only after looking')
        H('dock', id='assess'); pg.wait_for_timeout(150)
        check(step() == 2 and 'vital signs' in card(), f'{W}px: advances to vitals after opening Assess')
        H('assess', sys='vitals'); pg.wait_for_timeout(150)
        if pg.evaluate("Shift.ui._ui.ov") == 'result': H('res-close')
        pg.wait_for_timeout(150)
        check(step() == 3 and 'findings' in card() and pg.locator('.coach [data-act=coach-next]').count() == 1, f'{W}px: after vitals, explains findings with a Next button')
        H('coach-next'); pg.wait_for_timeout(100)
        check('check the chart' in card(), f'{W}px: then asks to open the chart')
        H('chart', pid=pid); pg.wait_for_timeout(100); H('close'); pg.wait_for_timeout(150)
        check(step() == 5 and 'more patients are waiting' in card(), f'{W}px: opening the chart moves on')
        H('coach-next'); pg.wait_for_timeout(100); check('Nova' in card(), f'{W}px: ends on Nova')
        H('coach-next'); pg.wait_for_timeout(100)
        check(pg.locator('.coach').count() == 0 and pg.evaluate("JSON.parse(localStorage.getItem('theshift.profile.v1')).seen['coach:room']") == 1, f'{W}px: tour finishes and is remembered')
        H('back'); pg.wait_for_timeout(100); H('goto', pid=pid); pg.wait_for_timeout(200)
        check(pg.locator('.coach').count() == 0, f'{W}px: does not come back')
        pg.close()
    # Skipping ends it for good.
    pg = b.new_page(viewport={'width': 390, 'height': 844}); fontroute(pg); pg.goto(GAME)
    pg.evaluate("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced'},seen:{'coach:station':1}}))"); pg.reload(); pg.wait_for_timeout(300)
    H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
    H('new')
    if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
    H('h-done'); H('rank-submit'); H('rank-go'); H('goto', pid=pg.evaluate("Shift.ui._state().answers.rank[0]")); pg.wait_for_timeout(200)
    H('coach-skip'); pg.wait_for_timeout(100)
    check(pg.locator('.coach').count() == 0, 'skip tour ends it')
    check(not errs, 'no page errors' + (': ' + errs[0][:200] if errs else ''))
    b.close()
print('GUIDE ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
