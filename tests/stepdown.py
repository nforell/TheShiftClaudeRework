"""Days on 6 East (cardiac step-down): plays the shift twice. A careful nurse should get every patient to a good
outcome; a nurse who only skips ahead should see every emergency play out. Usage: python tests/stepdown.py"""
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
    def start():
        pg = b.new_page(viewport={'width': 1280, 'height': 900}); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
        pg.goto(GAME); pg.evaluate("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced',feedback:'debrief'},seen:{'coach:station':1,'coach:room':1,tour:1}}))"); pg.reload(); pg.wait_for_timeout(300)
        return pg
    for run in ('careful', 'skipper'):
        pg = start()
        H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
        st = lambda e: pg.evaluate("(()=>{const s=Shift.ui._state();return " + e + "})()")
        def close():
            for _ in range(4):
                ov = pg.evaluate("Shift.ui._ui.ov")
                if ov == 'crit': H('crit-x')
                elif ov == 'result': H('res-close')
                elif ov: H('close')
                else: break
        def go(pid): close(); H('goto', pid=pid); close()
        def act(pid, iid): go(pid); H('int', id=iid); close()
        def talk(pid, *choices):
            go(pid); H('talk')
            for c in choices:
                if pg.evaluate("Shift.ui._ui.ov") != 'dialog': break
                H('dlg', i=str(c))
            close()
        def sbar(pid, picks, req):
            close(); H('sbar', pid=pid)
            for k in picks: H('sbar-pick', id=k)
            H('sbar-req', id=req); H('sbar-send'); r = pg.evaluate("Shift.ui._ui.sbar && Shift.ui._ui.sbar.reply"); close(); return r or ''
        def give(pid, mid, dose=None):
            go(pid); H('med', id=mid)
            if dose is not None: H('dose', v=str(dose))
            H('med-give'); close()
        def hold(pid, mid):
            go(pid); H('med', id=mid); H('med-holdask'); H('hreason', v='1'); H('med-hold'); close()
        def reply(label):
            r = pg.evaluate("(l)=>{const s=Shift.ui._state();for(const m of s.inbox){if(!m.replies||m.done)continue;const i=m.replies.findIndex(x=>x.label.indexOf(l)>=0);if(i>=0)return [m.id,i]}return null}", label)
            if r: H('reply', m=str(r[0]), i=str(r[1])); close()
            return bool(r)
        def until(t):
            for _ in range(40):
                if st('s.ended') or st('s.t') >= t: break
                close(); H('back'); close(); H('skip'); pg.wait_for_timeout(30)
            close()
        judg = lambda key: st(f"(s.judg.find(j=>j.key==='{key}')||{{}}).delta")

        H('pick-case', id='stepdown-6e-1'); H('new')
        if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
        H('h-done')
        if run == 'careful':
            pg.evaluate("Shift.ui._ui.rank=['601','603','605','607']"); H('rank-submit'); H('rank-go')
            check(judg('rank-first') == 2, 'ranking Mrs. Mendes first scores best')
            go('601'); H('assess', sys='resp'); close(); act('601', 'strip')
            act('603', 'groin'); talk('603', 0)
            reply('Read back')
            act('605', 'labs'); give('605', '605-hep', 5)
            sbar('605', ['plt', 'aptt', 'stopped'], 'hit'); give('605', '605-arga'); hold('605', '605-flush')
            give('607', '607-kcl'); give('607', '607-mag'); act('607', 'strip')
            until(16); act('601', 'echo'); give('601', '601-dilt', 3)
            r = sbar('601', ['ef', 'rate', 'bp', 'lungs'], 'switch'); check('amiodarone' in r.lower() or 'Stop the diltiazem' in r, 'calling about the echo gets the switch')
            give('601', '601-amio'); give('601', '601-lasix')
            act('603', 'groin'); sbar('607', ['qtc', 'lytes', 'protocol', 'cital'], 'qt')
            reply('Print me'); until(61); reply('Print me')
            act('603', 'groin'); until(75); act('603', 'groin')
            until(86); go('603'); H('assess', sys='pain'); close(); act('603', 'groin')
            r = sbar('603', ['back', 'hr', 'bp', 'groin', 'stick'], 'rp'); print('  603 reply:', r, st("[s.t, s.p['603'].called, s.p['603'].bleed]")); check('coming' in r.lower() or 'way' in r.lower(), 'the bleed call brings the cardiologist')
            act('603', 'ivs'); give('603', '603-ns'); reply('coming to assess')
            until(110); act('603', 'reassess'); act('601', 'reassess')
            until(120); give('601', '601-apix'); give('603', '603-asa'); give('603', '603-tica'); hold('603', '603-meto')
            hold('607', '607-cital'); hold('607', '607-lasix'); talk('607', 0); talk('605', 0)
            until(150); act('605', 'reassess')
        else:
            H('rank-submit'); H('rank-go')
        until(300)
        if not st('s.ended'): H('endask'); H('end-yes')
        close()
        out = pg.evaluate("(()=>{const s=Shift.ui._state();const d=Shift.engine.debrief(s);return {score:d.overall,o:Object.fromEntries(d.outcomes.map(o=>[o.id,[o.tone,o.title]])),steps:Shift.cjmm.score(d.judg).map(x=>[x.id,x.score])}})()")
        print(run, out['score'], out['o'])
        if run == 'careful':
            print('  misses:', pg.evaluate("Shift.ui._state().judg.filter(j=>j.delta<=0).map(j=>j.key+' '+j.delta+' '+j.text)"))
            for pid in ['601', '603', '605', '607']:
                check(out['o'][pid][0] == 'good', f'careful: {pid} has a good outcome ({out["o"][pid][1]})')
            check(out['score'] >= 85, f'careful: overall score is high ({out["score"]})')
            ev = dict(out['steps']).get('eval')
            check(ev is not None and ev >= 70, f'careful: Evaluate outcomes is scored ({ev})')
        else:
            for pid, word in (('601', 'CCU'), ('603', 'shock'), ('605', 'clot'), ('607', '')):
                check(out['o'][pid][0] == 'bad' and word in out['o'][pid][1], f'skipper: {pid} goes badly ({out["o"][pid][1]})')
            check(out['score'] <= 40, f'skipper: overall score is low ({out["score"]})')
        pg.close()
    check(not errs, 'no page errors' + (': ' + errs[0] if errs else ''))
    b.close()
print('STEPDOWN ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
