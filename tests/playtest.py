"""Regressions from the full-game playtest (Oct 14, 2026): the hold-to-give button, stale tasks and replies,
live patient headers, state-aware providers and debrief wording. Usage: python tests/playtest.py"""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri(); fails = []
def check(ok, msg): print(('ok   ' if ok else 'FAIL ') + msg); ok or fails.append(msg)

with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1280, 'height': 900}); fontroute(pg); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
    H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
    J = lambda js: pg.evaluate(js)
    def clr():
        for _ in range(6):
            ov = J("Shift.ui._ui.ov")
            if ov == 'crit': H('crit-x')
            elif ov == 'result': H('res-close')
            elif ov: H('close')
    def start(case):
        pg.goto(GAME); J("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({terms:'9999',runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced'},seen:{'coach:station':1,'coach:room':1,tour:1}}))"); pg.reload(); pg.wait_for_timeout(250)
        H('pick-case', id=case); H('new')
        if J("Shift.ui._ui.intro!=null"): H('intro-go')
        H('h-done'); H('rank-submit'); H('rank-go'); clr()
    def go(pid): clr(); H('goto', pid=pid); clr()
    def given(mid): return J(f"(()=>{{const m=Shift.ui._state().meds['{mid}'];return m.status==='given'||m.given.length>0}})()")
    def btn_center(sel):
        bb = pg.locator(sel).first.bounding_box(); return bb['x'] + bb['width'] / 2, bb['y'] + bb['height'] / 2

    # 1. Hold to give: survives re-renders, a short press doesn't give, two taps do, labels name the real dose.
    start('ld-2s-1'); J("Shift.ui._state().p['224'].ampOrdered=true"); go('224'); H('med', id='224-gent'); pg.wait_for_timeout(100)
    x, y = btn_center('[data-act="med-give"]'); pg.mouse.move(x, y); pg.mouse.down()
    for i in range(6): pg.wait_for_timeout(110); J("Shift.ui._render()"); pg.mouse.move(x + (i % 3) - 1, y)
    pg.mouse.up(); pg.wait_for_timeout(150); check(given('224-gent'), 'a hold completes through re-renders and small movements')
    start('ld-2s-1'); J("Shift.ui._state().p['224'].ampOrdered=true"); go('224'); H('med', id='224-gent'); pg.wait_for_timeout(100)
    x, y = btn_center('[data-act="med-give"]'); pg.mouse.move(x, y); pg.mouse.down(); pg.wait_for_timeout(200); pg.mouse.up(); pg.wait_for_timeout(600)
    check(not given('224-gent'), 'a short press does not give')
    pg.wait_for_timeout(4200)   # a short press counts as a first tap; let it disarm
    pg.mouse.click(x, y); pg.wait_for_timeout(200); check(not given('224-gent'), 'one tap arms but does not give')
    pg.mouse.click(x, y); pg.wait_for_timeout(250); check(given('224-gent'), 'a second tap gives')
    start('ob-2n-1')
    mid = J("(()=>{const c=Shift.engine.getCase('ob-2n-1');for(const d of c.patients)for(const m of d.meds||[])if((m.doses||[]).some(x=>/mcg/.test(x.label)))return d.id+'|'+m.id;return ''})()")
    if mid:
        pid, m = mid.split('|'); go(pid); H('med', id=m)
        dose = J(f"Shift.engine.getCase('ob-2n-1').patients.find(d=>d.id==='{pid}').meds.find(x=>x.id==='{m}').doses.find(x=>/mcg/.test(x.label)).id")
        H('dose', v=str(dose)); lab = pg.inner_text('[data-act="med-give"]')
        check('mcg' in lab and ' mg' not in lab.replace('mcg', ''), f'the give button names the chosen dose, not its id ({lab.splitlines()[0]})')

    # 2. Peds: once Leo's orders are corrected, no wrong-weight dose is anyone's task.
    start('peds-5s-1'); J("(()=>{const P=Shift.ui._state().p['505'];P.weighed=true;P.fixed=true})()")
    for _ in range(14): H('catchup'); clr()
    txt = J("document.body.innerText")
    check('465 mg' not in txt and '3.1 mg (0.1' not in txt and '1,550 mg' not in txt, 'wrong-weight doses never show as due after the correction')
    late = J("(()=>{const s=Shift.ui._state();return ['505-apap','505-cef'].filter(id=>s.meds[id].status==='due')})()")
    go('505'); body = J("document.querySelector('.pane') ? document.querySelector('.pane').innerText : ''")
    check('465 mg' not in body and '1,550' not in body, f"the brain for 505 has no wrong-weight tasks ({late})")

    # 3. Replies: going to the room retires the other options; leaving the unit retires older questions.
    start('ob-2n-1')
    for _ in range(2): H('catchup'); clr()
    m = J("(()=>{const m=Shift.ui._state().inbox.find(x=>x.replies&&x.replies.some(r=>r.act==='baby-fine'));return m?m.id:null})()")
    if m is not None:
        J(f"(()=>{{const s=Shift.ui._state();s.p['216'].gone=true;s.p['216'].goneAt=s.t}})()"); H('catchup'); clr()
        check(J(f"Shift.ui._state().inbox.find(x=>x.id==={m}).done===true"), 'a question about a baby who has left the unit stops offering "babies sleep, it\'s fine"')
    else: check(False, 'mother-baby sleepy-baby message arrived')

    # 4. Step-down: stopping the heparin for HIT leaves a call to make, and says so.
    start('stepdown-6e-1'); go('605'); H('med', id='605-hep'); H('dose', v='5'); H('med-give'); clr()
    rows = J("(()=>{const c=Shift.engine.getCase('stepdown-6e-1');return c.dueExtras(Shift.ui._state()).map(x=>x.text)})()")
    check(any('non-heparin' in r for r in rows), 'stopping the heparin puts the call on the task list')

    # 5. ICU: after the family decides on comfort care, the header says so.
    start('icu-3w-1'); J("(()=>{const s=Shift.ui._state(),P=s.p['714'];P.decision=s.t;P.extAt=s.t;P.stopped=true})()"); go('714')
    hdr = J("document.querySelector('.room-who, .pt-head, .scene') ? document.body.innerText : ''")
    check('DNR' in hdr and 'Full code' not in J("[...document.querySelectorAll('.chip')].map(c=>c.innerText).join('|')"), 'code status updates after the family meeting')
    check(not J("Shift.engine.getCase('icu-3w-1').patients.find(d=>d.id==='714').meds.find(m=>m.id==='714-hep').available(Shift.ui._state(),Shift.ui._state().p['714'])"), 'heparin leaves the MAR once comfort orders are carried out')

    # 6. Mother-baby: a second magnesium call is answered from where things stand.
    start('ob-2n-1'); go('214')
    J("(()=>{const s=Shift.ui._state(),P=s.p['214'];P.uoSeen=true;P.checkAt=s.t})()")
    H('sbar', pid='214'); H('sbar-pick', id='uo'); H('sbar-pick', id='dtr'); H('sbar-req', id='mg'); H('sbar-send'); r1 = J("Shift.ui._ui.sbar.reply"); clr()
    J("(()=>{const s=Shift.ui._state(),P=s.p['214'];P.rate=1;P.reduced=s.t;P.levelAt=s.t;P.levelVal='8.6';P.uo=20})()")
    H('sbar', pid='214'); H('sbar-pick', id='uo'); H('sbar-pick', id='dtr'); H('sbar-req', id='mg'); H('sbar-send'); r2 = J("Shift.ui._ui.sbar.reply"); clr()
    check(r1 != r2 and 'Stop' in r2, f'the second magnesium call gets a new answer ({r2[:60]}…)')

    # 7. Floor calls in the debrief say they were someone else's patient.
    start('icu-3w-1')
    J("(()=>{const s=Shift.ui._state();const it=Shift.floor.POOL.find(x=>x.id==='icu-aline');s.floor.q.push({id:'icu-aline',at:s.t,exp:s.t+1,done:null})})()")
    for _ in range(2): H('catchup'); clr()
    t = J("(Shift.ui._state().judg.find(j=>j.key==='floor-icu-aline')||{}).text||''")
    check(t.startswith('Floor call') and 'not your patient' in t, f'a missed floor call is labeled as one ({t[:70]}…)')

    # 8. New-player audit: ordered bundle items are tasks, the allergy header learns, counts agree, reset works.
    start('medsurg-4w-1'); J("(()=>{const s=Shift.ui._state(),P=s.p['416'];P.bundle=true;P.escalated=true;s.p['416'].orders.push({t:s.t,text:'Sepsis bundle',isNew:true});P.allergyInfo=true})()"); go('416')
    pane = J("document.querySelector('.pane') ? document.querySelector('.pane').innerText : ''")
    check('Draw blood cultures' in pane and 'Send lactate' in pane and 'normal saline bolus' in pane, 'the sepsis bundle orders show up as tasks')
    chips = J("[...document.querySelectorAll('.chip, .ehr-tag')].map(c=>c.innerText).join('|')")
    check('reaction unknown' not in J("document.body.innerText"), 'the allergy header updates once the reaction is known')
    H('dock', id='assess'); H('assess', sys='vitals'); clr(); H('assess', sys='neuro'); clr()
    n_tab = J("(()=>{const b=[...document.querySelectorAll('.rt')].find(x=>/Assess/.test(x.innerText));return b?b.innerText:''})()")
    check('2 documented' in n_tab, f'the Assess tab counts vitals like the shift-assessment task does ({n_tab.replace(chr(10), " ")})')
    H('settings') if 'settings' in J("Object.keys(Shift.ui._handlers)") else None
    H('reset-ask'); check(J("Shift.ui._ui.ov") == 'confirm', 'reset asks first'); H('reset-yes')
    prof = J("JSON.parse(localStorage.getItem('theshift.profile.v1'))")
    check(not prof.get('runs') and not prof.get('seen') and prof.get('settings', {}).get('sound') == 'off' and prof.get('terms') == '9999', 'reset clears progress and keeps settings and terms')

    check(not errs, 'no page errors' + (': ' + errs[0] if errs else ''))
print('PLAYTEST ' + ('CLEAN' if not fails else 'FAILED'))
sys.exit(1 if fails else 0)
