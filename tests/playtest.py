"""Regressions from the full-game playtest (Oct 14, 2026): the hold-to-give button, stale tasks and replies,
live patient headers, state-aware providers and debrief wording. Usage: python tests/playtest.py"""
import sys, pathlib, re
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

    # 9. Round 2: hold teaching points the right way, a held dose can be un-held, floated aides are gone.
    start('medsurg-4w-3'); go('437'); H('med', id='437-meto'); H('med-holdask'); H('hreason', v='0'); H('med-hold')
    note = J("Shift.ui._ui.med && Shift.ui._ui.med.note || ''")
    check('should be given' in note, 'a "meets the hold parameter" hold with normal numbers warns that the order says give')
    H('med-hold'); clr(); H('sbar', pid='437'); H('sbar-pick', id='hd:437-meto'); H('sbar-send'); rep = J("Shift.ui._ui.sbar.reply || ''"); clr()
    check('give it' in rep.lower() and 'was right' not in rep, f'the provider says to give a dose held inside the parameter ({rep[:80]}…)')
    go('437'); H('med', id='437-meto'); H('med-holdask'); H('hreason', v='1'); H('med-hold'); clr(); H('med', id='437-meto')
    check(J("!!document.querySelector('[data-act=med-unhold]')"), 'a held dose offers "Undo the hold"'); H('med-unhold')
    check(J("Shift.ui._state().meds['437-meto'].status") == 'due', 'undoing the hold makes the dose due again'); clr()
    J("Shift.ui._state().t=125"); H('catchup'); clr()
    board = J("document.body.innerText")
    check('Ask Dee' not in board, 'once Dee is floated, nothing offers to ask her')

    # 10. Choice messages open the choices instead of answering for you; the magnesium MAR shows the live rate.
    start('icu-3w-1'); J("(()=>{const s=Shift.ui._state();s.t=164})()"); H('catchup'); clr(); H('back') if J("Shift.ui._ui.view")=='room' else None
    mid = J("(()=>{const m=Shift.ui._state().inbox.find(x=>x.replies&&x.replies.length>1&&!x.bell&&!x.done);return m?m.id:null})()")
    if mid is not None:
        J(f"Shift.ui._ui.toasts=[{mid}]"); J("Shift.ui._render()")
        check(J(f"!document.querySelector('.toast [data-act=reply][data-m=\"{mid}\"]')"), 'a banner with several replies does not pick one for you')
    start('ob-2n-1'); J("(()=>{const P=Shift.ui._state().p['214'];P.stopped=5;P.rate=0})()"); go('214'); H('dock', id='meds')
    check('2 g/h' not in J("document.querySelector('.pane').innerText") and 'stopped' in J("document.querySelector('.pane').innerText"), 'the MAR shows a stopped drip as stopped')
    start('icu-3w-1'); J("Shift.ui._state().t=206"); H('catchup'); clr()
    check(any('Family meeting' in r for r in J("Shift.engine.getCase('icu-3w-1').dueExtras(Shift.ui._state()).map(x=>x.text)")), 'the family meeting is on the task list when it starts')

    # 11. Picking an answer doesn't look like a reload: the window stays put and keeps its scroll.
    pg.goto(GAME); J("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({terms:'9999',runs:[{caseId:'medsurg-4w-1',score:70,at:1}],settings:{theme:'light',sound:'off',music:'off',motion:'full'},seen:{'coach:station':1,'coach:room':1,tour:1,orient:1}}))"); pg.reload(); pg.wait_for_timeout(250)
    H('practice'); H('pset'); pg.wait_for_timeout(200)
    J("document.querySelector('.sheet-b').scrollTop = 9999"); y0 = J("document.querySelector('.sheet-b').scrollTop")
    btn = pg.locator('.sheet [data-act="ngn-pick"]').last; btn.scroll_into_view_if_needed(); y0 = J("document.querySelector('.sheet-b').scrollTop"); btn.click(); pg.wait_for_timeout(60)
    check(J("document.querySelector('.sheet-b').scrollTop") == y0, 'picking an answer keeps the question scrolled where it was')
    check(J("getComputedStyle(document.querySelector('.sheet')).animationName") == 'none' and J("getComputedStyle(document.querySelector('.scrim')).animationName") == 'none', 'picking an answer does not replay the window opening')
    check(J("!!document.querySelector('.sheet [data-act=ngn-pick].on.just')"), 'the picked answer is marked selected and gets the press response')

    # 12. Beta audit (Oct 17): priorities, scoring that matches the screen, and no lost debriefs.
    start('medsurg-4w-1'); go('416')
    J("(()=>{const s=Shift.ui._state(),P=s.p['416'];P.bundle=true;P.escalated=true;P.orders.push({t:s.t,text:'Sepsis bundle',isNew:true});P.assessAt={neuro:s.t,gi:s.t}})()")
    H('dock', id='assess'); H('assess', sys='vitals'); clr(); H('back'); clr()
    ptr = J("(()=>{const b=document.querySelector('.cmd-go');return b?b.innerText:''})()")
    check('416' in ptr and re.search(r'cultures|lactate|bolus', ptr, re.I) is not None, f'a new sepsis order outranks routine assessments at the station ({ptr.strip()[:50]})')
    go('416'); H('dock', id='brain'); first = J("(()=>{const r=document.querySelector('.pane .b-grp.now button.b-row, .pane .b-grp.over button.b-row');return r?r.innerText:''})()")
    check('awaiting pharmacy' not in first.lower(), f'an order waiting on pharmacy is not the first thing to do ({first.splitlines()[1] if len(first.splitlines())>1 else first[:40]})')
    # Lisinopril is judged on the blood pressure the nurse saw
    J("(()=>{const s=Shift.ui._state();s.p['416'].vit.push({t:s.t,by:'You',T:38,HR:104,SBP:97,DBP:58,RR:22,SpO2:95,O2:'Room air',pain:3})})()")
    H('med', id='416-lis'); H('med-give'); clr()
    jt = J("(Shift.ui._state().judg.find(j=>j.key==='416-lis')||{}).text||''")
    check('SBP of 97' in jt, f'lisinopril feedback quotes the reading the nurse saw, not a hidden one ({jt[:70]})')
    # Chen doesn't offer to call pharmacy once the nurse already has
    start('medsurg-4w-1'); J("(()=>{const P=Shift.ui._state().p['416'];P.allergyInfo=true})()"); go('416')
    J("(()=>{const s=Shift.ui._state(),P=s.p['416'];P.sev=50;P.assessAt={neuro:s.t,gi:s.t}})()"); H('dock', id='assess'); H('assess', sys='vitals'); clr()
    H('sbar', pid='416')
    for i in J("[...document.querySelectorAll('.sheet input[data-act=sbar-pick]:not([aria-disabled=true])')].map(x=>x.dataset.id).filter(x=>!/^(did|rx|hd|err):/.test(x))"): H('sbar-pick', id=i)
    H('sbar-req', id='sepsis'); H('sbar-send'); rep = J("Shift.ui._ui.sbar.reply||''"); clr()
    check('call pharmacy about the ceftriaxone myself' not in rep, f'the provider reply reflects the pharmacy work already done ({rep[:70]})')
    # In-room work answers a call light
    start('medsurg-4w-1'); go('414'); J("(()=>{const s=Shift.ui._state();s.p['414'].bell={at:s.t,id:'water',text:'wants fresh ice water',cna:true,fix:'Fresh ice water.',who:'Mrs. Okafor'};s.p['414'].lastBell=s.t})()")
    H('dock', id='assess'); H('assess', sys='vitals'); clr()
    check(J("Shift.ui._state().p['414'].bell") is None, 'working at the bedside answers that patient\'s call light')
    # Acronyms survive in the SBAR's "already done" list
    H('assess', sys='gi'); clr(); H('sbar', pid='414'); did = J("(document.querySelector('.sbar-did')||{}).innerText||''"); clr()
    check(' gI' not in did and 'GI' in did, 'the SBAR lists "GI, GU and intake/output" with its acronym intact')
    # Prep steps show they're done
    H('med', id='414-ins') if J("!!Shift.engine.getCase('medsurg-4w-1').patients.find(d=>d.id==='414').meds.find(m=>m.id==='414-ins')") else None
    # Furosemide hold explains the potassium
    start('medsurg-4w-1'); go('418'); H('med', id='418-lasix'); H('med-holdask'); H('hreason', v='1'); H('med-hold'); clr()
    fj = J("(Shift.ui._state().judg.find(j=>j.key==='418-lasix-hold')||{}).why||''")
    check('replace' in fj.lower() and 'diuretic' in fj.lower(), 'holding furosemide for a low potassium explains: replace the potassium, keep the diuretic')
    # PRN repeat limits
    start('stepdown-6e-1'); J("(()=>{const s=Shift.ui._state();s.p['603'].called=0})()"); go('603')
    has = J("!!Shift.engine.getCase('stepdown-6e-1').patients.find(d=>d.id==='603').meds.find(m=>m.id==='603-morph')")
    if has:
        H('med', id='603-morph'); H('dose', v='1') if J("!!document.querySelector('[data-act=dose]')") else None; H('med-give'); clr()
        n0 = J("Shift.ui._state().meds['603-morph'].given.length"); H('med', id='603-morph'); H('med-give'); clr()
        check(J("Shift.ui._state().meds['603-morph'].given.length") == n0, 'a second PRN morphine dose inside its interval is blocked')
    # The last debrief survives a reload
    start('medsurg-4w-1'); J("Shift.ui._state().t=298"); H('catchup'); clr()
    if J("Shift.ui._ui.view") != 'debrief': H('end-yes') if J("'end-yes' in Shift.ui._handlers") else None
    pg.reload(); pg.wait_for_timeout(300)
    check(J("!!document.querySelector('[data-act=last-debrief]')"), 'after a reload, home offers the last debrief')
    H('last-debrief'); check(J("Shift.ui._ui.view") == 'debrief' and 'out of 100' in J("document.body.innerText"), 'the saved debrief opens')

    # 13. Pilot prep (Oct 17): a pain call light left with no pain decision is named in the debrief; skipping ahead
    # near the end says report is what's left.
    BELL = "(()=>{const s=Shift.ui._state();s.p['412'].bell={at:s.t,id:'pain',text:'is asking for something for pain',cna:false,fix:'Rates pain 7 out of 10.',who:'Mr. Bell'};s.p['412'].lastBell=s.t})()"
    start('medsurg-4w-1'); go('412'); J(BELL); H('bell'); clr()
    J("Shift.ui._state().t=298"); H('catchup'); clr()
    pj = J("(Shift.ui._state().judg.find(j=>j.key==='412-pain-ask')||{})")
    check(bool(pj) and pj.get('delta') == 0 and 'Oxycodone' in pj.get('why', ''), 'an answered pain call light with no pain decision after it is named in the debrief (no points), with what was ordered')
    start('medsurg-4w-1'); go('412'); J(BELL); H('bell'); clr(); H('med', id='412-oxy')
    if J("!!document.querySelector('[data-act=dose]')"): H('dose', v='1')
    H('med-give'); clr()
    J("Shift.ui._state().t=298"); H('catchup'); clr()
    check(given('412-oxy') and not J("Shift.ui._state().judg.some(j=>j.key==='412-pain-ask')"), 'giving the PRN after the pain call light leaves no note')
    start('medsurg-4w-1'); J("(()=>{const c=Shift.engine.getCase('medsurg-4w-1');c.events.push({id:'t-ping',when:(s)=>s.t>=c.length-5,run:(s,A)=>A.msg({from:'nova',text:'Pharmacy says the 12:00 meds are up.'})});Shift.ui._state().t=c.length-8})()")
    H('skip'); pg.wait_for_timeout(100)
    ff = J("(document.querySelector('.ff-why')||{}).textContent||''")
    check(not J("Shift.ui._state().ended") and 'Report to the oncoming nurse is still waiting' in ff and 'End shift' in ff, 'when skipping stops a few minutes before handoff, it says report is still owed and how to finish')

    check(not errs, 'no page errors' + (': ' + errs[0] if errs else ''))
print('PLAYTEST ' + ('CLEAN' if not fails else 'FAILED'))
sys.exit(1 if fails else 0)
