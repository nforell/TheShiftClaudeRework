"""Orientation and drag-to-reorder. A brand-new player who taps Start gets the orientation; every chapter is played
with real clicks (and a real mouse drag on the practice board); finishing starts the shift; the triage ranking
reorders by dragging. Checks phone and desktop for sideways overflow and page errors.
Usage: python tests/orient.py"""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri(); fails = []
def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok: fails.append(what)

def drag(pg, src, dst_y, hold=0):
    src.scroll_into_view_if_needed(); bb = src.bounding_box(); x, y = bb['x'] + bb['width'] / 2, bb['y'] + bb['height'] / 2
    pg.mouse.move(x, y); pg.mouse.down()
    for k in range(1, 16): pg.mouse.move(x, y + (dst_y - y) * k / 15); pg.wait_for_timeout(16)
    for k in range(hold): pg.mouse.move(x, dst_y + (k % 2)); pg.wait_for_timeout(16)   # wait at the edge: the list scrolls
    pg.mouse.up(); pg.wait_for_timeout(300)

with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    for W, Hh in ((1280, 860), (390, 844)):
        pg = b.new_page(viewport={'width': W, 'height': Hh}); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
        pg.goto(GAME); pg.evaluate("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],terms:'9999',settings:{theme:'light',sound:'off',music:'off',motion:'reduced',feedback:'debrief'}}))"); pg.reload(); pg.wait_for_timeout(300)
        H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
        over = lambda: pg.evaluate("document.querySelector('.or-body') ? document.querySelector('.or-body').scrollWidth - document.querySelector('.or-body').clientWidth : 0")
        H('pick-case', id='medsurg-4w-1'); H('new'); pg.wait_for_timeout(250)
        check(pg.evaluate("Shift.ui._ui.ov") == 'orient', f'{W}: a new player who taps Start gets the orientation')
        click = lambda sel: (pg.locator(sel).first.click(), pg.wait_for_timeout(120))
        nxt = lambda: click('.or-nav .btn-primary')
        # 1. the clock moves by what actions cost
        t0 = pg.inner_text('.or-clock figcaption'); click('.or-act >> nth=1'); t1 = pg.inner_text('.or-clock figcaption')
        check(t0 != t1, f'{W}: an action moves the wall clock ({t0} -> {t1})'); check(over() <= 1, f'{W}: chapter 1 fits'); nxt()
        # 2. report highlights
        click('.or-line >> nth=1'); click('.or-line >> nth=2'); click('.or-check')
        check(pg.locator('.or-verdict').count() == 1, f'{W}: report highlights get a verdict'); check(over() <= 1, f'{W}: chapter 2 fits'); nxt()
        # 3. drag the practice board
        first = pg.evaluate("Shift.ui._ui.or.order[0]")
        drag(pg, pg.locator('.or-board li').last.locator('.grip'), pg.locator('.or-board li').first.bounding_box()['y'] + 5)
        check(pg.evaluate("Shift.ui._ui.or.order[0]") != first, f'{W}: dragging a magnet reorders the board')
        click('.or-check'); check(pg.locator('.or-board.done').count() == 1, f'{W}: the board locks in'); check(over() <= 1, f'{W}: chapter 3 fits'); nxt()
        # 4. phone and doors
        click('.or-msg .btn'); check(pg.locator('.or-msg .or-fb').count() >= 1, f'{W}: answering the phone gives feedback'); nxt()
        # 5. room and the med decision
        click('.or-dock button >> nth=2'); click('.or-med .btn >> nth=0'); click('.or-med .btn >> text=Hold it')
        check('Held' in pg.inner_text('.or-med'), f'{W}: holding metoprolol after the apical pulse is right'); check(over() <= 1, f'{W}: chapter 5 fits'); nxt()
        # 6. SBAR
        for k in range(5): click(f'.or-chip >> nth={k}')
        click('.or-req >> nth=0'); click('.or-check'); check(pg.locator('.or-reply').count() == 1, f'{W}: the SBAR call gets a reply'); nxt()
        # 7. delegation
        for k, v in ((0, 0), (1, 1), (2, 0), (3, 1)): click(f'.or-task >> nth={k} >> .seg button >> nth={v}')
        click('.or-check'); check(pg.locator('.or-task.hit').count() == 4, f'{W}: all four delegation calls are right'); nxt()
        check(pg.locator('.or-s-deb').count() == 1, f'{W}: the debrief chapter shows'); check(over() <= 1, f'{W}: chapter 8 fits')
        nxt(); pg.wait_for_timeout(300)
        check(pg.evaluate("Shift.ui._ui.view") == 'handoff' and pg.evaluate("Shift.ui._ui.ov") is None, f'{W}: finishing starts the shift')
        check(pg.evaluate("JSON.parse(localStorage.getItem('theshift.profile.v1')).seen.orient") == 1, f'{W}: the orientation is marked seen')
        # Triage ranking by drag.
        if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
        H('h-done'); pg.wait_for_timeout(300)
        before = pg.evaluate("Shift.ui._ui.rank.slice()")
        drag(pg, pg.locator('.rank li').last.locator('.grip'), pg.locator('.sheet-b').bounding_box()['y'] + 12, hold=60)
        after = pg.evaluate("Shift.ui._ui.rank.slice()")
        check(after[0] == before[-1] and sorted(after) == sorted(before), f'{W}: dragging a patient card to the top reorders the triage list ({before} -> {after})')
        pg.locator('.rank li').nth(1).locator('.mv .btn').first.click(); pg.wait_for_timeout(150)
        check(pg.evaluate("Shift.ui._ui.rank[0]") == after[1], f'{W}: the arrows still work')
        H('rank-submit'); H('rank-go'); H('help'); pg.wait_for_timeout(200)
        check(pg.evaluate("Shift.ui._ui.ov") == 'orient' and not pg.evaluate("Shift.ui._ui.or.start"), f'{W}: How it plays reopens the orientation without starting a shift')
        pg.keyboard.press('Escape'); pg.wait_for_timeout(150)
        check(pg.evaluate("Shift.ui._ui.ov") is None and pg.evaluate("Shift.ui._ui.view") == 'station', f'{W}: Escape closes it back to the shift')
        pg.close()
    # Someone who has played before isn't stopped by it.
    pg = b.new_page(); fontroute(pg); pg.goto(GAME)
    pg.evaluate("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[{}],terms:'9999',settings:{},seen:{tour:1}}))"); pg.reload(); pg.wait_for_timeout(300)
    pg.evaluate("Shift.ui._handlers['pick-case']({dataset:{id:'medsurg-4w-1'}});Shift.ui._handlers.new({dataset:{}})")
    check(pg.evaluate("Shift.ui._ui.ov") != 'orient', 'a returning player goes straight to the shift')
    # Reload in the middle: the walkthrough reopens at the same step with the same answers, then finishing starts the shift.
    pg = b.new_page(viewport={'width': 390, 'height': 844}); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)[:300])); pg.goto(GAME)
    pg.evaluate("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],terms:'9999',settings:{theme:'light',sound:'off',music:'off',motion:'reduced',feedback:'debrief'}}))"); pg.reload(); pg.wait_for_timeout(300)
    pg.evaluate("Shift.ui._handlers['pick-case']({dataset:{id:'icu-3w-1'}});Shift.ui._handlers.new({dataset:{}})"); pg.wait_for_timeout(200)
    for _ in range(2): pg.locator('.or-nav .btn-primary').click(); pg.wait_for_timeout(120)
    pg.locator('.or-check').first.click(); pg.wait_for_timeout(120)
    pg.reload(); pg.wait_for_timeout(400)
    check(pg.evaluate("Shift.ui._ui.ov") == 'orient' and pg.evaluate("Shift.ui._ui.or.i") == 2, 'a reload mid-walkthrough reopens it at the same step')
    check(pg.evaluate("Shift.ui._ui.or.rankChecked") is True, 'and keeps what the player already did there')
    check('101' in pg.inner_text('.orient') and '412' not in pg.inner_text('.orient'), 'the practice patients use their own rooms (101-107), not 4 West\'s')
    pg.keyboard.press('Escape'); pg.wait_for_timeout(300)
    check(pg.evaluate("Shift.ui._ui.view") == 'handoff' and pg.evaluate("Shift.ui._state().caseId") == 'icu-3w-1', 'skipping after the reload still starts the shift that was picked')
    pg.reload(); pg.wait_for_timeout(400)
    check(pg.evaluate("Shift.ui._ui.ov") != 'orient' and pg.evaluate("localStorage.getItem('theshift.orient.v1')") is None, 'once skipped, it does not come back on reload')
    pg.close()
    check(not errs, 'no page errors' + (': ' + errs[0] if errs else ''))
    b.close()
print('ORIENT ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
