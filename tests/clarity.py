"""First-player clarity (from beta feedback): the station says what it is, Nova and the aide are always in the
header as people with a label, the aide leads with at most three suggestions and folds the rest, and the
patient speaks in a bubble by their head that starts the conversation in the room. Every shift, phone and desktop. Usage: python tests/clarity.py"""
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
            check(pg.locator('.st-intro h1').inner_text() == "Nurses' station" and 'station' in pg.inner_text('.ps-st').lower(), f'{t} the station names itself')
            check(pg.locator('.helpers [data-act=nova]').count() == 1 and pg.locator('.helpers [data-act=delegate]').count() == 1 and pg.locator('.helpers svg').count() == 2, f'{t} Nova and the aide are in the header, with faces')
            H('delegate'); pg.wait_for_timeout(100)
            n = pg.locator('.dl-s').count(); folded = pg.locator('details.dl-all').count() == 1
            check(n <= 3 and folded and pg.locator('.dl-who').count() == 1, f'{t} the aide leads with {n} suggestion(s), the rest folded')
            check(n >= 1, f'{t} the aide has something to offer at the start of the shift')
            j0 = pg.evaluate("Shift.ui._state().judg.length")
            for k in range(n):   # send every suggestion, one at a time as the aide frees up
                if k: H('delegate'); pg.evaluate("(()=>{const s=Shift.ui._state();s.deleg.forEach(d=>d.done=true)})()"); H('close'); H('delegate')
                if pg.locator('.dl-s').count() == 0: break
                pg.locator('.dl-s').first.click(); pg.wait_for_timeout(100)
            neg = pg.evaluate(f"Shift.ui._state().judg.slice({j0}).filter(j=>/^deleg/.test(j.key||'')&&j.delta<0).map(j=>j.text)")
            check(pg.evaluate("Shift.ui._state().deleg.length") >= 1 and not neg, f'{t} suggestions send in one tap and none is scored as a mistake' + (f': {neg}' if neg else ''))
            H('close'); pid = pg.evaluate("Shift.ui._state() && Object.keys(Shift.ui._state().p).find(k=>{const d=Shift.engine.getCase(Shift.ui._state().caseId).patients.find(x=>x.id===k);return !d.arrives})")
            H('goto', pid=pid); pg.wait_for_timeout(200)
            bub = pg.locator('.sb.idle[data-anchor=pt]')
            check(bub.count() == 1 and bub.is_visible() and pg.locator('.sb.idle [data-act=talk]').count() == 1, f'{t} the patient has a speech bubble with a way to talk')
            box, scene = bub.bounding_box(), pg.locator('.room-top svg').first.bounding_box()
            check(box and scene and box['x'] >= scene['x'] - 1 and box['x'] + box['width'] <= scene['x'] + scene['width'] + 1 and box['y'] >= scene['y'] - 1 and box['y'] + box['height'] <= scene['y'] + scene['height'] + 1, f'{t} the bubble sits inside the scene')
            # every patient's room: the bubble is inside the scene and clear of the name card and buttons
            bad = []
            for q in pg.evaluate("(()=>{const s=Shift.ui._state(),c=Shift.engine.getCase(s.caseId);return c.patients.filter(d=>!d.arrives).map(d=>d.id)})()"):
                H('goto', pid=q); H('close'); pg.wait_for_timeout(80)
                r = pg.evaluate("""(()=>{const b=document.querySelector('.sb.idle[data-anchor=pt]'),sc=document.querySelector('.room-top svg');if(!b||!sc)return 'missing';const x=b.getBoundingClientRect(),y=sc.getBoundingClientRect();
                  if(x.left<y.left-1||x.right>y.right+1||x.top<y.top-1||x.bottom>y.bottom+1)return 'outside';
                  for(const e of document.querySelectorAll('.nameplate .plate,.plate-btns')){const z=e.getBoundingClientRect();if(z.width&&x.left<z.right&&x.right>z.left&&x.top<z.bottom&&x.bottom>z.top)return 'overlaps '+e.className}
                  return ''})()""")
                if r: bad.append(f'{q} {r}')
            check(not bad, f'{t} the bubble is placed well in every room' + (': ' + ', '.join(bad) if bad else ''))
            H('goto', pid=pid); H('close'); pg.locator('.sb.idle [data-act=talk]').click(); pg.wait_for_timeout(250)
            check(pg.evaluate("Shift.ui._ui.ov") == 'dialog' and pg.locator('.sheet').count() == 0, f'{t} tapping it starts the conversation in the room, not in a pop-up')
            sp = pg.locator('.sb.talking')
            check(sp.count() == 1 and sp.is_visible() and len(sp.inner_text().strip()) > 10, f'{t} what they say appears in a speech bubble')
            n = pg.locator('.convo .cv-reply').count()
            if n:
                pg.locator('.convo .cv-reply').first.click(); pg.wait_for_timeout(200)
                check(pg.locator('.convo .said').count() == 1 or pg.evaluate("Shift.ui._ui.ov") != 'dialog', f'{t} your reply is shown as what you said')
            for _ in range(6):
                if pg.evaluate("Shift.ui._ui.ov") != 'dialog': break
                if pg.locator('.convo .cv-reply').count(): pg.locator('.convo .cv-reply').first.click()
                else: pg.locator('.convo [data-act=close]').click()
                pg.wait_for_timeout(120)
            check(pg.evaluate("Shift.ui._ui.ov") != 'dialog' and pg.locator('.sb.talking').count() == 0, f'{t} the conversation ends back in the room')
            H('nova'); check('Get a tip' in pg.inner_text('.sheet') and 'charge nurse' in pg.inner_text('.sheet'), f'{t} Nova explains what she\'s for'); H('close')
            H('endask'); H('end-yes'); pg.wait_for_timeout(200)
    check(not errs, 'no page errors' + (': ' + errs[0] if errs else ''))
    b.close()
print('CLARITY ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
