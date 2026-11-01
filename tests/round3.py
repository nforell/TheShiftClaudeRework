"""Round 3 playtest regressions (Nov 1, 2026): each check reproduces one reported bug and confirms the fix.
Usage: python tests/round3.py"""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from bot import start
from playwright.sync_api import sync_playwright
fails = []
def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok: fails.append(what)

with sync_playwright() as p:
    b = p.chromium.launch(); errs = []

    def game(case):
        pg = b.new_page(viewport={'width': 1280, 'height': 900}); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
        H = start(pg, case)
        J = lambda e, *a: pg.evaluate("(a)=>{const s=Shift.ui._state(),A=Shift.engine.api(s);return " + e + "}", list(a))
        def close():
            for _ in range(4):
                ov = pg.evaluate("Shift.ui._ui.ov")
                if ov == 'crit': H('crit-x')
                elif ov == 'result': H('res-close')
                elif ov: H('close')
                else: break
        def go(pid): close(); H('goto', pid=pid); close()
        def act(pid, iid): go(pid); H('int', id=iid); close()
        def give(pid, mid, dose=None):
            go(pid); H('med', id=mid)
            if dose is not None: H('dose', v=str(dose))
            H('med-give'); close()
        def sbar(pid, picks, req):
            close(); H('sbar', pid=pid)
            for k in picks: H('sbar-pick', id=k)
            H('sbar-req', id=req); H('sbar-send'); r = pg.evaluate("Shift.ui._ui.sbar && Shift.ui._ui.sbar.reply"); close(); return r or ''
        def until(t):
            for _ in range(80):
                if J('s.ended') or J('s.t') >= t: break
                close(); H('back'); close(); H('skip'); pg.wait_for_timeout(10)
            close()
        def rows(pid): return J("Shift.ui._brainRows(a[0])", pid)
        return pg, H, J, close, go, act, give, sbar, until, rows

    # 1. Nights 4W: the drip-stop task is never pushed before 2 hours, and a stop at 2 hours is a full overlap.
    pg, H, J, close, go, act, give, sbar, until, rows = game('medsurg-4w-3')
    J("(()=>{const P=s.p['435'];P.gapClosed=true;P.bg=180;return 1})()")
    give('435', '435-glar'); g = J("s.p['435'].glarAt")
    J("(()=>{s.t=a[0]+116;return 1})()", g)
    nx = J("(Shift.ui._nextFor('435')||{}).text||''")
    check('Stop the insulin drip' not in nx, f'nights: drip stop not pushed as Next at 116 min (next: {nx!r})')
    stop = [r for r in rows('435') if 'Stop the insulin drip' in r.get('text', '')]
    check(bool(stop) and stop[0].get('notBefore'), 'nights: the stop task says not before its time')
    J("(()=>{s.t=a[0]+120;return 1})()", g); act('435', 'stop')
    j = J("s.judg.find(x=>x.key==='435-stop')")
    check(j and j['delta'] > 0, f'nights: stopping at 120 min is credited ({j and j["text"]})')
    d = J("Shift.engine.debrief(s).outcomes.find(o=>o.id==='435')")
    check('120 minutes later' in d['text'] and d['tone'] == 'good', f'nights: debrief quotes the real overlap ({d["text"]})')
    pg.close()

    # 2-3. Step-down: kept flat, then sat up on purpose, is judged; HIT orders update the chart and tasks.
    pg, H, J, close, go, act, give, sbar, until, rows = game('stepdown-6e-1')
    J("(()=>{Shift.engine.cases['stepdown-6e-1'].replies['ray-urinal'](s,A);return 1})()")
    go('603'); H('talk')
    i = J("Shift.engine.cases['stepdown-6e-1'].dialogs['ray_talk'].choices.findIndex(c=>/Sure, just for a minute/.test(c.label))")
    H('dlg', i=str(i)); close()
    j = J("s.judg.find(x=>x.key==='603-flat'&&!x.superseded)")
    check(j and j['delta'] < 0, f'step-down: sitting Okoro up after the urinal is judged ({j and j["text"]})')
    act('605', 'labs'); give('605', '605-hep', 5); sbar('605', ['plt', 'aptt', 'stopped'], 'hit')
    live = J("Shift.ui._liveDef('605')")
    check('Heparin' in live['allergies'] and 'HIT' in live['dx'] and 'heparin infusion' not in live['lines'][0].replace('heparin stopped', ''), f'step-down: allergy, problem and lines updated ({live["allergies"]} / {live["dx"]} / {live["lines"][0]})')
    check('stopped' in live['reason'], 'step-down: "Admitted for" no longer says on heparin since admission')
    liveOrders = J("s.p['605'].orders.filter(o=>o.dc===undefined).map(o=>o.text)")
    check(not any('Heparin infusion per' in o or 'flush with heparin' in o for o in liveOrders), 'step-down: old heparin orders discontinued')
    txt = ' '.join(r.get('text', '') for r in rows('605'))
    check('PF4' in txt and 'duplex' in txt, 'step-down: PF4 antibody and duplex orders are tasks')
    check(not any(r.get('key') == 'm:605-flush' and not r.get('done') for r in rows('605')), 'step-down: heparin flush task gone after the HIT orders')
    pg.close()

    # 4. Days 4W: verbal orders become tasks, and the chest X-ray has an action.
    pg, H, J, close, go, act, give, sbar, until, rows = game('medsurg-4w-1')
    J("(()=>{const P=s.p['418'];P.kxOrdered=true;P.lx80=true;return 1})()")
    keys = [r.get('key') for r in rows('418')]
    check('n:418-kx' in keys and 'n:418-lx80' in keys, 'days: KCl and furosemide verbal orders are tasks')
    check(J("A.def('418').interventions.some(x=>x.id==='cxr'&&x.avail(s,s.p['418'],A))"), 'days: the chest X-ray order can be carried out')
    pg.close()

    # 5. ED: once the onset is corrected, the thrombolysis instruction is gone.
    pg, H, J, close, go, act, give, sbar, until, rows = game('ed-podb-1')
    until(26); act('22', 'lkw'); sbar('22', ['lkw'], 'tx')
    stale = J("s.inbox.filter(m=>m.pid==='22'&&/tenecteplase/i.test(m.text)&&!m.stale).length")
    txt = ' '.join((r.get('text', '') + ' ' + (r.get('sub') or '')) for r in rows('22'))
    check(stale == 0 and 'in the window' not in txt, 'ED: stale tenecteplase instruction retired')
    check(J("s.p['22'].orders.filter(o=>/Tenecteplase/.test(o.text)&&o.dc===undefined).length") == 0, 'ED: tenecteplase order discontinued')
    pg.close()

    # 6. Mother-baby: saying "asthma, so no carboprost" in the request means no Hemabate comes back.
    pg, H, J, close, go, act, give, sbar, until, rows = game('ob-2n-1')
    J("(()=>{const P=s.p['212'];P.fundusAt=s.t;P.qblSeen=true;P.k.fundus=s.t;return 1})()")
    r = sbar('212', ['fundus', 'qbl'], 'pph')
    check('Hemabate' not in r or 'No Hemabate' in r, f'mother-baby: provider does not order carboprost after hearing asthma ({r[:90]})')
    until(J("s.t") + 14)
    check(J("s.p['212'].mdHere!==undefined"), 'mother-baby: Dr. Brennan arrives after saying she is coming')
    pg.close()

    # 10. Teen psych: the replacement order is a task; 12. ICU: a GCS-3 patient never "wants to talk".
    pg, H, J, close, go, act, give, sbar, until, rows = game('psych-4n-1')
    J("(()=>{s.p['401'].replOrder=true;return 1})()")
    check('n:401-repl' in [r.get('key') for r in rows('401')], 'teen psych: electrolyte replacement order is on the task list')
    pg.close()
    pg, H, J, close, go, act, give, sbar, until, rows = game('icu-3w-1')
    go('714'); html = pg.content()
    check('Mr. Mensah wants to talk' not in html, 'ICU: no "Mr. Mensah wants to talk" for a GCS-3 patient')
    pg.close()

    # 16. NCLEX bank: the Tried filter filters.
    pg = b.new_page(viewport={'width': 1280, 'height': 900}); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
    from bot import GAME, PROFILE
    pg.goto(GAME); pg.evaluate(PROFILE); pg.reload(); pg.wait_for_timeout(250)
    n = pg.evaluate("""(()=>{const P=JSON.parse(localStorage.getItem('theshift.profile.v1'));P.ngn={};const B=Shift.ngnBank;P.ngn[B[0].id]={score:1,max:1,last:1,at:1};localStorage.setItem('theshift.profile.v1',JSON.stringify(P));return B.length})()""")
    pg.reload(); pg.wait_for_timeout(250)
    k = pg.evaluate("(()=>{const H=Shift.ui._handlers;H.practice&&H.practice({dataset:{}});Shift.ui._ui.pf={st:'done'};return Shift.ui._bankFiltered().length})()")
    check(k == 1, f'flashcards: the Tried filter shows only tried questions ({k})')
    pg.close()
    b.close()

for e in errs[:10]: print('FAIL js error', e)
print('ROUND3 FAILED' if fails or errs else 'ROUND3 CLEAN', len(fails) + len(errs))
sys.exit(1 if fails or errs else 0)
